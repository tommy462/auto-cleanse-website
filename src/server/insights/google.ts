// Search Console and GA4 Data API, read-only, through one Google service
// account. Nothing here writes to Google.
//
// Setup (once): create a service account in Google Cloud, enable the
// "Google Search Console API" and "Google Analytics Data API", then add the
// service account's email as a user (Restricted is enough) on the Search
// Console property and as a Viewer in GA4 Property access management.
//
// Env (Vercel, type Secret): INSIGHTS_GOOGLE_CLIENT_EMAIL, INSIGHTS_GOOGLE_PRIVATE_KEY
// (the private_key from the JSON key, with \n escapes). GA4: INSIGHTS_GA4_PROPERTY_ID
// (the numeric property id, not the G- measurement id). GSC: INSIGHTS_GSC_PROPERTY
// ("https://www.auto-cleanse.co.uk/" or "sc-domain:auto-cleanse.co.uk").

import { JWT } from 'google-auth-library';
import { fetchJson } from './http.js';
import { normaliseUrl } from './classify.js';
import { fromGa4Date, isValidDay } from './dates.js';

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/analytics.readonly'];

export function googleConfigured(env = process.env): boolean {
  return Boolean((env.INSIGHTS_GOOGLE_CLIENT_EMAIL ?? env.GOOGLE_SERVICE_ACCOUNT_EMAIL) &&
    (env.INSIGHTS_GOOGLE_PRIVATE_KEY ?? env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY));
}

let client: JWT | null = null;
async function token(): Promise<string> {
  if (!client) {
    const email = process.env.INSIGHTS_GOOGLE_CLIENT_EMAIL ?? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = (process.env.INSIGHTS_GOOGLE_PRIVATE_KEY ?? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');
    if (!email || !key) throw new Error('Google service account not configured (INSIGHTS_GOOGLE_CLIENT_EMAIL / INSIGHTS_GOOGLE_PRIVATE_KEY)');
    client = new JWT({ email, key, scopes: SCOPES });
  }
  const { token: t } = await client.getAccessToken();
  if (!t) throw new Error('Google did not return an access token');
  return t;
}

async function post<T>(url: string, body: unknown, label: string): Promise<T> {
  return fetchJson<T>(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    label,
  });
}

/* ── Search Console ───────────────────────────────────────────────────────── */

interface GscRow { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }
interface GscResponse { rows?: GscRow[]; metadata?: { firstIncompleteDate?: string; first_incomplete_date?: string } }

function num(x: unknown, what: string): number {
  const n = Number(x);
  if (!Number.isFinite(n) || n < 0) throw new Error(`Search Console returned an invalid ${what}`);
  return n;
}

async function gscQuery(property: string, body: Record<string, unknown>): Promise<{ rows: GscRow[]; firstIncomplete: string | null }> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const rows: GscRow[] = [];
  let firstIncomplete: string | null = null;
  for (let startRow = 0; startRow < 500_000; startRow += 25_000) {
    const res = await post<GscResponse>(url, { ...body, rowLimit: 25_000, startRow }, 'Search Console');
    if (res == null || typeof res !== 'object') throw new Error('Search Console returned an empty response');
    const fi = res.metadata?.firstIncompleteDate ?? res.metadata?.first_incomplete_date ?? null;
    if (fi && isValidDay(fi)) firstIncomplete = fi;
    const page = Array.isArray(res.rows) ? res.rows : [];
    rows.push(...page);
    if (page.length < 25_000) break;
  }
  return { rows, firstIncomplete };
}

export interface GscPageDay { date: string; path: string; host: string; device: 'ALL' | 'MOBILE' | 'DESKTOP' | 'TABLET'; clicks: number; impressions: number; position: number; final: boolean }
export interface GscSiteDay { date: string; clicks: number; impressions: number; position: number; final: boolean }
export interface GscQueryRow { query: string; path: string; clicks: number; impressions: number; position: number }

/**
 * Page x day totals (device 'ALL') plus page x device x day rows, with fresh
 * (not yet final) days included and flagged. Two requests because adding the
 * device dimension makes Google drop most rows (checked 3 Nov 2026: 17,297 of
 * 88,097 impressions came back for 27 Jul - 26 Oct), while page x day is
 * complete. The 'ALL' rows are the page totals; the device rows are only used
 * for the phone share. Rows from URLs that normalise to the same path and host
 * are summed.
 */
export async function gscPagesDaily(property: string, canonicalHost: string, from: string, to: string): Promise<GscPageDay[]> {
  const [all, byDevice] = await Promise.all([
    gscQuery(property, { startDate: from, endDate: to, dimensions: ['date', 'page'], type: 'web', dataState: 'all', aggregationType: 'byPage' }),
    gscQuery(property, { startDate: from, endDate: to, dimensions: ['date', 'page', 'device'], type: 'web', dataState: 'all', aggregationType: 'byPage' }),
  ]);
  const firstIncomplete = all.firstIncomplete ?? byDevice.firstIncomplete;
  const rows = [
    ...all.rows.map((r) => ({ ...r, keys: [...(r.keys ?? []).slice(0, 2), 'ALL'] })),
    ...byDevice.rows,
  ];
  const map = new Map<string, GscPageDay & { posW: number }>();
  for (const r of rows) {
    const [date, page, device] = r.keys ?? [];
    if (!isValidDay(date) || !['ALL', 'MOBILE', 'DESKTOP', 'TABLET'].includes(device)) continue;
    const n = normaliseUrl(page, canonicalHost);
    if (!n) continue;
    const impressions = num(r.impressions, 'impressions');
    const key = `${date}|${n.path}|${device}|${n.host}`;
    const cur = map.get(key) ?? { date, path: n.path, host: n.host, device: device as GscPageDay['device'], clicks: 0, impressions: 0, position: 0, posW: 0, final: !firstIncomplete || date < firstIncomplete };
    cur.clicks += num(r.clicks, 'clicks');
    cur.impressions += impressions;
    cur.posW += num(r.position, 'position') * impressions;
    map.set(key, cur);
  }
  return [...map.values()].map(({ posW, ...r }) => ({ ...r, position: r.impressions ? Math.round((posW / r.impressions) * 100) / 100 : 0 }));
}

/** Whole-property totals per day: these include anonymised queries, so they are the true totals. */
export async function gscSiteDaily(property: string, from: string, to: string): Promise<GscSiteDay[]> {
  const { rows, firstIncomplete } = await gscQuery(property, { startDate: from, endDate: to, dimensions: ['date'], type: 'web', dataState: 'all' });
  return rows
    .filter((r) => isValidDay(r.keys?.[0]))
    .map((r) => ({
      date: r.keys![0], clicks: num(r.clicks, 'clicks'), impressions: num(r.impressions, 'impressions'),
      position: Math.round(num(r.position, 'position') * 100) / 100, final: !firstIncomplete || r.keys![0] < firstIncomplete,
    }));
}

/** Query x page totals for a window (final data only). Anonymised queries are not included. */
export async function gscQueries(property: string, canonicalHost: string, from: string, to: string): Promise<GscQueryRow[]> {
  const { rows } = await gscQuery(property, { startDate: from, endDate: to, dimensions: ['query', 'page'], type: 'web', dataState: 'final' });
  const map = new Map<string, GscQueryRow & { posW: number }>();
  for (const r of rows) {
    const [query, page] = r.keys ?? [];
    if (!query || query.length > 300) continue;
    const n = normaliseUrl(page, canonicalHost);
    if (!n) continue;
    const impressions = num(r.impressions, 'impressions');
    const key = `${query}|${n.path}`;
    const cur = map.get(key) ?? { query, path: n.path, clicks: 0, impressions: 0, position: 0, posW: 0 };
    cur.clicks += num(r.clicks, 'clicks');
    cur.impressions += impressions;
    cur.posW += num(r.position, 'position') * impressions;
    map.set(key, cur);
  }
  return [...map.values()].map(({ posW, ...r }) => ({ ...r, position: r.impressions ? Math.round((posW / r.impressions) * 100) / 100 : 0 }));
}

/* ── GA4 ──────────────────────────────────────────────────────────────────── */

interface Ga4Response {
  rows?: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }[];
  rowCount?: number;
}

async function ga4Report(propertyId: string, body: Record<string, unknown>): Promise<string[][]> {
  if (!/^\d{6,15}$/.test(propertyId)) throw new Error('INSIGHTS_GA4_PROPERTY_ID must be the numeric GA4 property id');
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const out: string[][] = [];
  for (let offset = 0; offset < 1_000_000; offset += 100_000) {
    const res = await post<Ga4Response>(url, { ...body, limit: 100_000, offset }, 'GA4');
    if (res == null || typeof res !== 'object') throw new Error('GA4 returned an empty response');
    const rows = res.rows ?? [];
    for (const r of rows) out.push([...(r.dimensionValues ?? []).map((d) => d.value ?? ''), ...(r.metricValues ?? []).map((m) => m.value ?? '0')]);
    if (offset + rows.length >= (res.rowCount ?? 0) || rows.length === 0) break;
  }
  return out;
}

const n0 = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export interface Ga4LandingDay { date: string; landing_path: string; channel: string; device: string; sessions: number; engaged_sessions: number; users: number; new_users: number; engagement_seconds: number; key_events: number }
export interface Ga4PageDay { date: string; page_path: string; views: number; users: number; engagement_seconds: number }
export interface Ga4EventDay { date: string; page_path: string; event_name: string; events: number }

export async function ga4Landing(propertyId: string, canonicalHost: string, from: string, to: string): Promise<Ga4LandingDay[]> {
  const rows = await ga4Report(propertyId, {
    dateRanges: [{ startDate: from, endDate: to }],
    dimensions: [{ name: 'date' }, { name: 'landingPage' }, { name: 'sessionDefaultChannelGroup' }, { name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'totalUsers' }, { name: 'newUsers' }, { name: 'userEngagementDuration' }, { name: 'keyEvents' }],
  });
  const map = new Map<string, Ga4LandingDay>();
  for (const [d, landing, channel, device, s, e, u, nu, eng, ke] of rows) {
    const date = fromGa4Date(d);
    const n = normaliseUrl(landing, canonicalHost);
    if (!date) continue;
    const path = n?.path ?? '(not set)';
    const key = `${date}|${path}|${channel}|${device}`;
    const cur = map.get(key) ?? { date, landing_path: path, channel: (channel || 'Unassigned').slice(0, 60), device: (device || 'unknown').slice(0, 20), sessions: 0, engaged_sessions: 0, users: 0, new_users: 0, engagement_seconds: 0, key_events: 0 };
    cur.sessions += n0(s); cur.engaged_sessions += n0(e); cur.users += n0(u); cur.new_users += n0(nu);
    cur.engagement_seconds += n0(eng); cur.key_events += n0(ke);
    map.set(key, cur);
  }
  return [...map.values()];
}

export async function ga4Pages(propertyId: string, canonicalHost: string, from: string, to: string): Promise<Ga4PageDay[]> {
  const rows = await ga4Report(propertyId, {
    dateRanges: [{ startDate: from, endDate: to }],
    dimensions: [{ name: 'date' }, { name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'userEngagementDuration' }],
  });
  const map = new Map<string, Ga4PageDay>();
  for (const [d, page, v, u, eng] of rows) {
    const date = fromGa4Date(d);
    const n = normaliseUrl(page, canonicalHost);
    if (!date || !n) continue;
    const key = `${date}|${n.path}`;
    const cur = map.get(key) ?? { date, page_path: n.path, views: 0, users: 0, engagement_seconds: 0 };
    cur.views += n0(v); cur.users += n0(u); cur.engagement_seconds += n0(eng);
    map.set(key, cur);
  }
  return [...map.values()];
}

export async function ga4Events(propertyId: string, canonicalHost: string, from: string, to: string, eventNames: string[]): Promise<Ga4EventDay[]> {
  const rows = await ga4Report(propertyId, {
    dateRanges: [{ startDate: from, endDate: to }],
    dimensions: [{ name: 'date' }, { name: 'pagePath' }, { name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: eventNames } } },
  });
  const map = new Map<string, Ga4EventDay>();
  for (const [d, page, name, c] of rows) {
    const date = fromGa4Date(d);
    const n = normaliseUrl(page, canonicalHost);
    if (!date || !n || !/^[a-z0-9_]{1,40}$/.test(name)) continue;
    const key = `${date}|${n.path}|${name}`;
    const cur = map.get(key) ?? { date, page_path: n.path, event_name: name, events: 0 };
    cur.events += n0(c);
    map.set(key, cur);
  }
  return [...map.values()];
}
