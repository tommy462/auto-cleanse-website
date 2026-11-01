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
// Env: INSIGHTS_CLARITY_TOKEN (Clarity > Settings > Data Export > Generate new API token)

import { fetchJson } from './http.js';
import { normaliseUrl } from './classify.js';

const ENDPOINT = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';

export function clarityConfigured(env = process.env): boolean {
  return Boolean(env.INSIGHTS_CLARITY_TOKEN);
}

export interface ClarityMetricBlock {
  metricName: string;
  information: Record<string, unknown>[];
}

/** One request = one of the 10 a day. */
export async function clarityExport(numOfDays: 1 | 2 | 3, dimensions: string[]): Promise<ClarityMetricBlock[]> {
  const token = process.env.INSIGHTS_CLARITY_TOKEN;
  if (!token) throw new Error('INSIGHTS_CLARITY_TOKEN not set');
  const qs = new URLSearchParams({ numOfDays: String(numOfDays) });
  dimensions.slice(0, 3).forEach((d, i) => qs.set(`dimension${i + 1}`, d));
  // Retries would spend more of the 10-a-day allowance; one retry for a dropped connection only.
  const res = await fetchJson<unknown>(`${ENDPOINT}?${qs}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    retries: 1,
    label: 'Clarity',
  });
  return validateClarity(res);
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

const METRIC_COLUMN: Record<string, keyof ClarityRow> = {
  'dead click count': 'dead_click_pct',
  'rage click count': 'rage_click_pct',
  'excessive scroll': 'excessive_scroll_pct',
  'quickback click': 'quickback_pct',
  'error click count': 'error_click_pct',
  'script error count': 'script_error_pct',
};

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
    const name = b.metricName.toLowerCase();
    for (const info of b.information) {
      const r = get(info);
      if (!r) continue;
      if (name === 'traffic') {
        r.sessions = field(info, ['totalsessioncount'], ['session', 'count']);
        r.bot_sessions = field(info, ['bot']);
        r.users = field(info, ['distinctuser'], ['distantuser'], ['user', 'count']);
        r.pages_per_session = field(info, ['pagespersession']);
      } else if (name === 'scroll depth') {
        r.scroll_depth = field(info, ['averagescrolldepth'], ['scroll']);
      } else if (name === 'engagement time') {
        r.engagement_total_s = field(info, ['totaltime'], ['total']);
        r.engagement_active_s = field(info, ['activetime'], ['active']);
      } else if (METRIC_COLUMN[name]) {
        const col = METRIC_COLUMN[name];
        const v = field(info, ['percentage'], ['sessionswithmetric']) ?? null;
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
