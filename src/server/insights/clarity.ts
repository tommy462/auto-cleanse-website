// Microsoft Clarity Data Export API. What it can and cannot do (checked
// against Microsoft's docs, Nov 2026):
//   - aggregate dashboard metrics only, for the last 1, 2 or 3 days (24/48/72
//     hours back from the call); no older history, so the daily run must call
//     it every day or that day is lost for good
//   - at most 10 requests per project per day, 3 dimensions, 1,000 rows, no paging
//   - NO recordings and NO heatmaps: those stay in the Clarity website, which
//     the dashboard links to
// Microsoft documents the response shape for "Traffic" only, so every other
// metric is parsed defensively: any field whose name contains a known word is
// read, everything else is kept untouched in web_clarity_snapshots so nothing
// is lost if the format differs.
//
// The 10-a-day allowance is counted per HTTP attempt (one that times out counts
// too) across all of today's runs, and collectClarity never plans past it.
// Microsoft does not say when its day resets: UTC midnight is assumed. Clarity's
// own 429 "daily limit" answer is the backstop and is never retried.
//
// Env: INSIGHTS_CLARITY_TOKEN (Clarity > Settings > Data Export > Generate new API token)

import { fetchJson, HttpError, isTransient, TimeoutError } from './http.js';
import { normaliseUrl } from './classify.js';

const ENDPOINT = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';

export function clarityConfigured(env = process.env): boolean {
  return Boolean(env.INSIGHTS_CLARITY_TOKEN);
}

export interface ClarityMetricBlock {
  metricName: string;
  information: Record<string, unknown>[];
}

/** Microsoft's limit per project per day; every HTTP attempt counts, including one that times out. */
export const CLARITY_DAILY_ALLOWANCE = 10;
/**
 * A normal answer takes about 15 s and 30 s was not enough on a slow morning; 75 s also
 * outlasts a typical 60 s gateway limit, so a stuck request comes back as an HTTP error we can read.
 */
export const CLARITY_TIMEOUT_MS = 75_000;
/** With less time than this left, a request is not worth one of the 10. */
export const CLARITY_MIN_ATTEMPT_MS = 20_000;
/** A run from before requests were counted is assumed to have used its worst case (3 dimensions, one retry each). */
export const CLARITY_LEGACY_RUN_REQUESTS = 6;
/** Most important first. `name` is what web_clarity_snapshots.dimension already holds: do not change it. */
export const CLARITY_DIMENSIONS: readonly { name: string; dims: string[]; label: string }[] = [
  { name: 'site', dims: [], label: 'site totals' },
  { name: 'URL', dims: ['URL'], label: 'pages' },
  { name: 'URL+Device', dims: ['URL', 'Device'], label: 'pages by device' },
];

/** One request = one of the 10 a day. */
export async function clarityExport(numOfDays: 1 | 2 | 3, dimensions: string[], opts: { timeoutMs?: number } = {}): Promise<ClarityMetricBlock[]> {
  const token = process.env.INSIGHTS_CLARITY_TOKEN;
  if (!token) throw new Error('INSIGHTS_CLARITY_TOKEN not set');
  const qs = new URLSearchParams({ numOfDays: String(numOfDays) });
  dimensions.slice(0, 3).forEach((d, i) => qs.set(`dimension${i + 1}`, d));
  // Exactly one HTTP attempt: every attempt spends one of the 10 a day, so
  // collectClarity decides about retries and counts each one.
  const res = await fetchJson<unknown>(`${ENDPOINT}?${qs}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    retries: 0,
    timeoutMs: opts.timeoutMs ?? CLARITY_TIMEOUT_MS,
    label: 'Clarity',
  });
  return validateClarity(res);
}

export interface ClarityCollectInput {
  /** dimension names already stored today by an earlier run: never asked for again */
  alreadyStored: string[];
  /** Clarity requests already made today by earlier runs */
  usedToday: number;
  /** epoch ms by which the Clarity step must be finished */
  deadline: number;
  /** ONE HTTP attempt */
  fetchDimension: (dims: string[], opts: { timeoutMs: number }) => Promise<ClarityMetricBlock[]>;
  /** stores one dimension's answer, returns the number of rows written */
  store: (name: string, dims: string[], blocks: ClarityMetricBlock[]) => Promise<number>;
  /** called BEFORE each HTTP attempt with the count this run will have made including it; if it throws, the attempt is not made */
  onRequest?: (requestsThisRun: number) => Promise<void>;
  /** default Date.now */
  now?: () => number;
  /** pause before a retry, default 1000 */
  pauseMs?: number;
  sleep?: (ms: number) => Promise<void>;
}

export interface ClarityCollectResult {
  /** stored by THIS run */
  stored: { name: string; label: string; rows: number }[];
  /** already stored earlier today, not asked for */
  kept: { name: string; label: string }[];
  /** the one dimension that was asked for and failed */
  failed: { name: string; label: string; reason: string } | null;
  /** never requested this run */
  notAsked: { name: string; label: string }[];
  /** why the dimensions in notAsked were not requested */
  notAskedWhy: 'after_failure' | 'allowance' | 'time' | null;
  /** HTTP attempts made by this run */
  requests: number;
  /** input.usedToday + requests */
  usedToday: number;
  /** rows stored by this run */
  rows: number;
}

const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));
const isDailyLimit = (e: unknown) => e instanceof HttpError && e.status === 429 && /daily limit/i.test(e.body);

/**
 * Asks Clarity for each dimension in CLARITY_DIMENSIONS order, within the daily
 * allowance and the time the run gives it. Pure apart from the injected
 * functions, so it is tested without network or database.
 */
export async function collectClarity(input: ClarityCollectInput): Promise<ClarityCollectResult> {
  const now = input.now ?? Date.now;
  const pauseMs = input.pauseMs ?? 1000;
  const sleep = input.sleep ?? ((ms: number) => new Promise<void>((res) => setTimeout(res, ms)));
  const already = new Set(input.alreadyStored);
  const r: ClarityCollectResult = { stored: [], kept: [], failed: null, notAsked: [], notAskedWhy: null, requests: 0, usedToday: input.usedToday, rows: 0 };

  for (let i = 0; i < CLARITY_DIMENSIONS.length; i++) {
    const { name, dims, label } = CLARITY_DIMENSIONS[i];
    if (already.has(name)) { r.kept.push({ name, label }); continue; }
    if (r.notAskedWhy) { r.notAsked.push({ name, label }); continue; }
    const remaining = CLARITY_DAILY_ALLOWANCE - input.usedToday - r.requests;
    if (remaining <= 0) { r.notAskedWhy = 'allowance'; r.notAsked.push({ name, label }); continue; }
    let left = input.deadline - now();
    if (left < CLARITY_MIN_ATTEMPT_MS) { r.notAskedWhy = 'time'; r.notAsked.push({ name, label }); continue; }

    // A retry is only spent when the allowance still covers a first attempt for
    // every dimension not yet asked for: breadth before depth.
    const still = CLARITY_DIMENSIONS.slice(i).filter((d) => !already.has(d.name)).length;
    const maxAttempts = remaining - still >= 1 ? 2 : 1;
    let attempts = 0;
    let lastErr: unknown = null;
    let reason: string | null = null;
    let longestTimeout = 0;
    let allTimeouts = true;
    let done = false;
    for (let a = 0; a < maxAttempts; a++) {
      if (a > 0) {
        left = input.deadline - now();
        if (left < CLARITY_MIN_ATTEMPT_MS) break; // no time for a retry: the failure stands
        await sleep(pauseMs);
        left = input.deadline - now();
      }
      try {
        await input.onRequest?.(r.requests + 1);
      } catch (e) {
        reason = `Could not record the request count: ${errText(e)}`;
        break;
      }
      r.requests++;
      attempts++;
      let blocks: ClarityMetricBlock[];
      try {
        blocks = await input.fetchDimension(dims, { timeoutMs: Math.min(CLARITY_TIMEOUT_MS, left) });
      } catch (e) {
        lastErr = e;
        if (e instanceof TimeoutError) longestTimeout = Math.max(longestTimeout, e.timeoutMs);
        else allTimeouts = false;
        if (isTransient(e) && a + 1 < maxAttempts) continue;
        break;
      }
      // The request is already spent, so a failure to store its answer is not retried.
      try {
        const rows = await input.store(name, dims, blocks);
        r.stored.push({ name, label, rows });
        r.rows += rows;
        done = true;
      } catch (e) {
        reason = errText(e);
      }
      break;
    }
    if (done) continue;

    if (!reason) {
      if (attempts > 0 && allTimeouts) reason = new TimeoutError('Clarity', longestTimeout, attempts).message;
      else if (isDailyLimit(lastErr)) reason = `Clarity says today's ${CLARITY_DAILY_ALLOWANCE} requests are already used up`;
      else reason = errText(lastErr);
    }
    // Stop after the first failure: each request is one of ten, whatever made
    // this one fail will almost certainly fail the next one seconds later, and
    // a re-run the same day asks only for what is missing.
    r.failed = { name, label, reason };
    r.notAskedWhy = 'after_failure';
  }
  r.usedToday = input.usedToday + r.requests;
  return r;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const labels = (xs: { label: string }[]) => xs.map((x) => x.label).join(', ');

/** The Clarity step's note or error, in plain English for Data health. Always under 600 characters. */
export function describeClarityOutcome(r: ClarityCollectResult): { ok: boolean; rows: number; text: string } {
  const ok = r.failed === null && r.notAsked.length === 0;
  if (ok) {
    if (!r.stored.length) return { ok, rows: r.rows, text: 'already stored by an earlier run today; no requests made' };
    let text = `last 24 hours to the time of the run; ${plural(r.requests, 'request', 'requests')}, ${r.usedToday} of ${CLARITY_DAILY_ALLOWANCE} used today`;
    if (r.kept.length) text += `; ${labels(r.kept)} kept from an earlier run today`;
    return { ok, rows: r.rows, text };
  }
  // Listed in CLARITY_DIMENSIONS order, whichever run stored them.
  const have = new Set([...r.kept, ...r.stored].map((x) => x.name));
  const haveList = CLARITY_DIMENSIONS.filter((d) => have.has(d.name));
  const parts: string[] = [];
  parts.push(haveList.length ? `Stored: ${labels(haveList)} (${plural(r.rows, 'row', 'rows')} this run).` : 'Nothing stored.');
  parts.push(`Not stored: ${labels([...(r.failed ? [r.failed] : []), ...r.notAsked])}.`);
  if (r.failed) {
    // An API's own error text is cut short and kept free of long dashes.
    const reason = r.failed.reason.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 300);
    parts.push(/[.!?]$/.test(reason) ? reason : `${reason}.`);
  }
  if (r.notAsked.length) {
    if (r.notAskedWhy === 'after_failure') parts.push('The rest were not asked for, to save the daily allowance.');
    else if (r.notAskedWhy === 'allowance') parts.push(`Clarity's ${CLARITY_DAILY_ALLOWANCE} requests for today are used up.`);
    else if (r.notAskedWhy === 'time') parts.push('There was no time left in this run to ask.');
  }
  parts.push(`${r.usedToday} of Clarity's ${CLARITY_DAILY_ALLOWANCE} daily requests used today.`);
  return { ok, rows: r.rows, text: parts.join(' ') };
}

/**
 * Clarity requests already made today by the given runs. A run that recorded
 * summary.clarityRequests counts that; one from before requests were counted
 * that ran the Clarity step counts its worst case.
 */
/**
 * Clarity dimensions the given runs reported as fully stored (snapshot and daily
 * rows), in CLARITY_DIMENSIONS order. A run that recorded summary.clarityStored
 * gives that list; one from before it was recorded gives all three if its
 * Clarity step was ok, and nothing otherwise (unknown, so ask again).
 */
export function clarityStoredBy(runs: { summary?: Record<string, unknown> | null; steps?: { step: string; status: string }[] | null }[]): string[] {
  const found = new Set<string>();
  for (const run of runs) {
    const list = run.summary?.clarityStored;
    if (Array.isArray(list)) {
      for (const x of list) if (typeof x === 'string') found.add(x);
    } else if ((run.steps ?? []).some((s) => s.step === 'clarity' && s.status === 'ok')) {
      CLARITY_DIMENSIONS.forEach((d) => found.add(d.name));
    }
  }
  return CLARITY_DIMENSIONS.filter((d) => found.has(d.name)).map((d) => d.name);
}

export function clarityRequestsUsed(runs: { summary?: Record<string, unknown> | null; steps?: { step: string; status: string }[] | null }[]): number {
  let total = 0;
  for (const run of runs) {
    const n = run.summary?.clarityRequests;
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0) total += n;
    else if ((run.steps ?? []).some((s) => s.step === 'clarity' && s.status !== 'skipped')) total += CLARITY_LEGACY_RUN_REQUESTS;
  }
  return total;
}

export function validateClarity(res: unknown): ClarityMetricBlock[] {
  if (!Array.isArray(res)) throw new Error('Clarity returned something other than a list of metrics');
  const out: ClarityMetricBlock[] = [];
  for (const b of res) {
    if (!b || typeof b !== 'object') continue;
    const name = (b as { metricName?: unknown }).metricName;
    const info = (b as { information?: unknown }).information;
    if (typeof name !== 'string' || !Array.isArray(info)) continue;
    out.push({ metricName: name.slice(0, 60), information: info.filter((x) => x && typeof x === 'object').slice(0, 1000) as Record<string, unknown>[] });
  }
  if (!out.length && res.length) throw new Error('Clarity response had no recognisable metrics');
  return out;
}

export interface ClarityRow {
  url: string;
  device: string;
  sessions: number | null;
  bot_sessions: number | null;
  users: number | null;
  pages_per_session: number | null;
  scroll_depth: number | null;
  engagement_total_s: number | null;
  engagement_active_s: number | null;
  dead_click_pct: number | null;
  rage_click_pct: number | null;
  excessive_scroll_pct: number | null;
  quickback_pct: number | null;
  error_click_pct: number | null;
  script_error_pct: number | null;
}

const toNum = (v: unknown): number | null => {
  if (v == null || v === '') return null;
  const n = Number(String(v).replace(/[%,\s]/g, ''));
  return Number.isFinite(n) ? n : null;
};

/** Reads the first field whose lower-cased name contains every word in one of the patterns. */
function field(info: Record<string, unknown>, ...patterns: string[][]): number | null {
  const keys = Object.keys(info);
  for (const words of patterns) {
    const k = keys.find((key) => words.every((w) => key.toLowerCase().includes(w)));
    if (k) return toNum(info[k]);
  }
  return null;
}

const DIM_KEYS: Record<string, string[]> = { URL: ['url', 'URL', 'Url'], Device: ['Device', 'device'] };
function dim(info: Record<string, unknown>, d: string): string {
  for (const k of DIM_KEYS[d] ?? [d]) if (typeof info[k] === 'string') return info[k] as string;
  return '';
}

// Keyed by metric name in lower case with spaces removed (see metricKey).
const METRIC_COLUMN: Record<string, keyof ClarityRow> = {
  deadclickcount: 'dead_click_pct',
  rageclickcount: 'rage_click_pct',
  excessivescroll: 'excessive_scroll_pct',
  quickbackclick: 'quickback_pct',
  errorclickcount: 'error_click_pct',
  scripterrorcount: 'script_error_pct',
};

/** The live API sends "ScrollDepth" and "DeadClickCount"; Microsoft's docs write "Scroll Depth". Compare letters only. */
const metricKey = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '');

/**
 * Flattens one response into rows keyed by URL and device ('' = all). Frustration
 * metrics are stored as "% of sessions with the signal", which is what the
 * Clarity dashboard shows; a raw count is kept only if no percentage is present.
 */
export function flattenClarity(blocks: ClarityMetricBlock[], dims: string[], canonicalHost: string): ClarityRow[] {
  const rows = new Map<string, ClarityRow>();
  const get = (info: Record<string, unknown>): ClarityRow | null => {
    let url = '';
    if (dims.includes('URL')) {
      const raw = dim(info, 'URL');
      const n = raw ? normaliseUrl(raw, canonicalHost) : null;
      if (!n || n.host) return null; // other hosts (e.g. preview deployments) are not the live site
      url = n.path;
    }
    const device = dims.includes('Device') ? dim(info, 'Device').slice(0, 30) : '';
    const key = `${url}|${device}`;
    let r = rows.get(key);
    if (!r) {
      r = { url, device, sessions: null, bot_sessions: null, users: null, pages_per_session: null, scroll_depth: null,
        engagement_total_s: null, engagement_active_s: null, dead_click_pct: null, rage_click_pct: null,
        excessive_scroll_pct: null, quickback_pct: null, error_click_pct: null, script_error_pct: null };
      rows.set(key, r);
    }
    return r;
  };
  for (const b of blocks) {
    const name = metricKey(b.metricName);
    for (const info of b.information) {
      const r = get(info);
      if (!r) continue;
      if (name === 'traffic') {
        r.sessions = field(info, ['totalsessioncount'], ['session', 'count']);
        r.bot_sessions = field(info, ['bot']);
        r.users = field(info, ['distinctuser'], ['distantuser'], ['user', 'count']);
        r.pages_per_session = field(info, ['pagespersession']);
      } else if (name === 'scrolldepth') {
        r.scroll_depth = field(info, ['averagescrolldepth'], ['scroll']);
      } else if (name === 'engagementtime') {
        r.engagement_total_s = field(info, ['totaltime'], ['total']);
        r.engagement_active_s = field(info, ['activetime'], ['active']);
      } else if (METRIC_COLUMN[name]) {
        const col = METRIC_COLUMN[name];
        const v = field(info, ['sessionswithmetricpercentage'], ['withmetric', 'percentage']) ?? null;
        (r as unknown as Record<string, number | null>)[col] = v;
        if (r.sessions == null) r.sessions = field(info, ['sessionscount'], ['sessions']);
      }
    }
  }
  return [...rows.values()].filter((r) => Object.values(r).some((v) => typeof v === 'number'));
}

/** Links into the Clarity website. The heatmap URL parameters are not documented by Microsoft and may change. */
export function clarityLinks(projectId: string, pageUrl?: string) {
  const base = `https://clarity.microsoft.com/projects/view/${encodeURIComponent(projectId)}`;
  return {
    dashboard: `${base}/dashboard?date=Last%203%20days`,
    recordings: `${base}/impressions?date=Last%203%20days`,
    heatmap: pageUrl ? `${base}/heatmaps?date_h=Last%203%20days&url_h=${encodeURIComponent(pageUrl)}` : `${base}/heatmaps`,
  };
}
