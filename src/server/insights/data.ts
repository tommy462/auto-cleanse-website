// Reads the collected data back as per-page totals for a window (the input to
// the rules), and writes the marts the dashboard draws: web_site_daily,
// web_page_snapshots and web_group_snapshots.

import { classifyPath } from './classify.js';
import { addDays, daysBetween, eachDay, rangeLabel } from './dates.js';
import type { SiteConfig } from './site-config.js';
import { rpc, selectAll, upsert } from './store.js';
import type { AnalysisWindow, ClarityPageStats, PageWindow } from './types.js';
import { round } from './stats.js';

const ukDay = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date(iso));
const N = (x: unknown) => (x == null ? 0 : Number(x) || 0);

interface GscWin { path: string; clicks: number; impressions: number; avg_position: number | null; mobile_impressions: number; other_host_impressions: number }
interface LandWin { landing_path: string; device: string; sessions: number; engaged_sessions: number; engagement_seconds: number }
interface EvWin { page_path: string; event_name: string; events: number }
interface PageWin { page_path: string; views: number }
interface ClarWin { url: string; device: string; sessions: number; scroll_depth: number | null; dead_click_pct: number | null; rage_click_pct: number | null; quickback_pct: number | null; excessive_scroll_pct: number | null }
interface ConvRow { occurred_at: string; event: string; page_path: string | null }
interface PageReg { path: string; page_group: string; in_sitemap: boolean; content_changed_on: string | null }

export interface Sources { gsc: boolean; prevGsc: boolean; queryPages: boolean; ga4: boolean; clarity: boolean; conversions: boolean }

export async function loadPageWindows(config: SiteConfig, w: AnalysisWindow): Promise<{ pages: PageWindow[]; sources: Sources }> {
  const site = config.id;
  const args = (from: string, to: string) => ({ p_site: site, p_from: from, p_to: to });
  const [reg, gsc, prev, land, ev, pv, clar, conv] = await Promise.all([
    selectAll<PageReg>(`/web_pages?site_id=eq.${site}&select=path,page_group,in_sitemap,content_changed_on&order=path`),
    rpc<GscWin[]>('web_gsc_page_window', args(w.from, w.to)),
    rpc<GscWin[]>('web_gsc_page_window', args(w.prevFrom, w.prevTo)),
    rpc<LandWin[]>('web_ga4_landing_window', args(w.from, w.to)),
    rpc<EvWin[]>('web_ga4_event_window', args(w.from, w.to)),
    rpc<PageWin[]>('web_ga4_page_window', args(w.from, w.to)),
    rpc<ClarWin[]>('web_clarity_url_window', args(w.from, w.to)),
    selectAll<ConvRow>(`/web_conversions?site_id=eq.${site}&occurred_at=gte.${w.from}T00:00:00Z&occurred_at=lt.${addDays(w.to, 1)}T12:00:00Z&select=occurred_at,event,page_path&order=id`),
  ]);

  const pages = new Map<string, PageWindow>();
  const get = (path: string) => {
    let p = pages.get(path);
    if (!p) {
      const r = regByPath.get(path);
      p = {
        path, group: r?.page_group ?? classifyPath(path).group, clicks: 0, impressions: 0, position: null, mobileImpressions: 0,
        otherHostImpressions: 0, prevClicks: null, prevImpressions: null, prevPosition: null, sessions: null, engagedSessions: null,
        engagementSeconds: null, mobileSessions: null, mobileEngaged: null, views: null, leads: null, phoneClicks: null,
        whatsappClicks: null, bookingStarts: null, deposits: null, clarity: null, inSitemap: r?.in_sitemap ?? false,
        contentChangedOn: r?.content_changed_on ?? null,
      };
      pages.set(path, p);
    }
    return p;
  };
  const regByPath = new Map(reg.map((r) => [r.path, r]));
  for (const r of reg) if (r.in_sitemap) get(r.path);

  for (const g of gsc) {
    const p = get(g.path);
    p.clicks = N(g.clicks); p.impressions = N(g.impressions); p.position = g.avg_position == null ? null : Number(g.avg_position);
    p.mobileImpressions = N(g.mobile_impressions); p.otherHostImpressions = N(g.other_host_impressions);
  }
  const prevGsc = prev.length > 0;
  if (prevGsc) {
    for (const p of pages.values()) { p.prevClicks = 0; p.prevImpressions = 0; }
    for (const g of prev) {
      const p = get(g.path);
      p.prevClicks = N(g.clicks); p.prevImpressions = N(g.impressions); p.prevPosition = g.avg_position == null ? null : Number(g.avg_position);
    }
  }
  const ga4 = land.length > 0;
  if (ga4) {
    for (const l of land) {
      if (l.landing_path === '(not set)') continue;
      const p = get(l.landing_path);
      p.sessions = N(p.sessions) + N(l.sessions);
      p.engagedSessions = N(p.engagedSessions) + N(l.engaged_sessions);
      p.engagementSeconds = N(p.engagementSeconds) + N(l.engagement_seconds);
      if (l.device === 'mobile') { p.mobileSessions = N(p.mobileSessions) + N(l.sessions); p.mobileEngaged = N(p.mobileEngaged) + N(l.engaged_sessions); }
    }
    for (const v of pv) get(v.page_path).views = N(v.views);
    for (const e of ev) {
      const kind = config.events[e.event_name];
      const p = get(e.page_path);
      if (kind === 'lead') p.leads = N(p.leads) + N(e.events);
      else if (kind === 'phone') p.phoneClicks = N(p.phoneClicks) + N(e.events);
      else if (kind === 'whatsapp') p.whatsappClicks = N(p.whatsappClicks) + N(e.events);
      else if (kind === 'booking_start') p.bookingStarts = N(p.bookingStarts) + N(e.events);
    }
  }
  // The site's own form counter is complete (not limited to visitors who accepted cookies), so it wins over GA4 for leads.
  const siteLeads = conv.filter((c) => c.event === 'lead_submitted');
  if (siteLeads.length) {
    const byPage = new Map<string, number>();
    for (const c of siteLeads) if (c.page_path) byPage.set(c.page_path, (byPage.get(c.page_path) ?? 0) + 1);
    for (const p of pages.values()) if (p.leads != null || byPage.has(p.path)) p.leads = byPage.get(p.path) ?? 0;
    for (const [path, n] of byPage) get(path).leads = n;
  }
  for (const c of conv.filter((x) => x.event === 'deposit_paid')) {
    const p = get(c.page_path ?? '/remapping-booking');
    p.deposits = N(p.deposits) + 1;
  }
  const clarity = clar.length > 0;
  if (clarity) {
    const byUrl = new Map<string, ClarWin[]>();
    for (const c of clar) if (c.url) byUrl.set(c.url, [...(byUrl.get(c.url) ?? []), c]);
    for (const [url, rows] of byUrl) {
      const all = rows.find((r) => r.device === '') ?? null;
      const mob = rows.find((r) => r.device.toLowerCase() === 'mobile') ?? null;
      const desk = rows.find((r) => r.device.toLowerCase() === 'pc' || r.device.toLowerCase() === 'desktop') ?? null;
      const src = all ?? mob ?? desk;
      if (!src) continue;
      const sessions = all ? N(all.sessions) : rows.reduce((s, r) => s + N(r.sessions), 0);
      const stats: ClarityPageStats = {
        sessions, scrollDepth: src.scroll_depth == null ? null : Number(src.scroll_depth),
        deadClickPct: src.dead_click_pct == null ? null : Number(src.dead_click_pct),
        rageClickPct: src.rage_click_pct == null ? null : Number(src.rage_click_pct),
        quickbackPct: src.quickback_pct == null ? null : Number(src.quickback_pct),
        excessiveScrollPct: src.excessive_scroll_pct == null ? null : Number(src.excessive_scroll_pct),
        mobileSessions: N(mob?.sessions), mobileScrollDepth: mob?.scroll_depth == null ? null : Number(mob.scroll_depth),
        desktopScrollDepth: desk?.scroll_depth == null ? null : Number(desk.scroll_depth),
      };
      get(url).clarity = stats;
    }
  }
  return {
    pages: [...pages.values()],
    sources: { gsc: gsc.length > 0, prevGsc, queryPages: false, ga4, clarity, conversions: conv.length > 0 },
  };
}

/* ── Marts ────────────────────────────────────────────────────────────────── */

export async function writeSnapshots(config: SiteConfig, w: AnalysisWindow, pages: PageWindow[], source: 'api' | 'export') {
  const site = config.id;
  const rows = pages
    .filter((p) => p.impressions > 0 || (p.sessions ?? 0) > 0 || p.inSitemap || (p.leads ?? 0) > 0)
    .map((p) => ({
      site_id: site, period_end: w.to, window_days: w.days, path: p.path, page_group: p.group, source,
      gsc_clicks: p.clicks, gsc_impressions: p.impressions, gsc_position: p.position,
      gsc_mobile_share: p.impressions ? round(p.mobileImpressions / p.impressions, 3) : null,
      prev_clicks: p.prevClicks, prev_impressions: p.prevImpressions, prev_position: p.prevPosition,
      ga4_sessions: p.sessions, ga4_engaged: p.engagedSessions, ga4_engagement_s: p.engagementSeconds == null ? null : round(p.engagementSeconds, 1),
      ga4_views: p.views, leads: p.leads, phone_clicks: p.phoneClicks, whatsapp_clicks: p.whatsappClicks,
      booking_starts: p.bookingStarts, deposits: p.deposits, clarity_sessions: p.clarity?.sessions ?? null,
      scroll_depth: p.clarity?.scrollDepth ?? null, dead_click_pct: p.clarity?.deadClickPct ?? null,
      rage_click_pct: p.clarity?.rageClickPct ?? null, quickback_pct: p.clarity?.quickbackPct ?? null,
    }));
  await upsert('web_page_snapshots', rows, 'site_id,period_end,window_days,path');

  const groups = new Map<string, Record<string, number | null> & { posW: number }>();
  for (const p of pages) {
    const g = groups.get(p.group) ?? { pages: 0, pages_with_impressions: 0, gsc_clicks: 0, gsc_impressions: 0, posW: 0, prev_clicks: null, prev_impressions: null, ga4_sessions: null, ga4_engaged: null, leads: null, phone_clicks: null, booking_starts: null, deposits: null };
    if (p.inSitemap) g.pages = N(g.pages) + 1;
    if (p.impressions > 0) g.pages_with_impressions = N(g.pages_with_impressions) + 1;
    g.gsc_clicks = N(g.gsc_clicks) + p.clicks;
    g.gsc_impressions = N(g.gsc_impressions) + p.impressions;
    g.posW += (p.position ?? 0) * p.impressions;
    const add = (k: string, v: number | null) => { if (v != null) g[k] = N(g[k]) + v; };
    add('prev_clicks', p.prevClicks); add('prev_impressions', p.prevImpressions); add('ga4_sessions', p.sessions);
    add('ga4_engaged', p.engagedSessions); add('leads', p.leads); add('phone_clicks', p.phoneClicks);
    add('booking_starts', p.bookingStarts); add('deposits', p.deposits);
    groups.set(p.group, g);
  }
  await upsert('web_group_snapshots', [...groups.entries()].map(([group, g]) => {
    const { posW, ...rest } = g;
    return { site_id: site, period_end: w.to, window_days: w.days, page_group: group, source, ...rest, gsc_position: N(g.gsc_impressions) ? round(posW / N(g.gsc_impressions), 2) : null };
  }), 'site_id,period_end,window_days,page_group');
  return rows.length;
}

/** Rebuilds web_site_daily for [from, to] from the raw tables. */
export async function buildSiteDaily(config: SiteConfig, from: string, to: string): Promise<number> {
  const site = config.id;
  const [gsc, land, ev, conv, biz, clar] = await Promise.all([
    selectAll<{ date: string; clicks: number; impressions: number; position: number; final: boolean }>(`/web_gsc_site_daily?site_id=eq.${site}&date=gte.${from}&date=lte.${to}&select=date,clicks,impressions,position,final&order=date`),
    selectAll<{ date: string; sessions: number; engaged_sessions: number; users: number; engagement_seconds: number }>(`/web_ga4_landing_daily?site_id=eq.${site}&date=gte.${from}&date=lte.${to}&select=date,sessions,engaged_sessions,users,engagement_seconds&order=date,landing_path,channel,device`),
    selectAll<{ date: string; event_name: string; events: number }>(`/web_ga4_events_daily?site_id=eq.${site}&date=gte.${from}&date=lte.${to}&select=date,event_name,events&order=date,page_path,event_name`),
    selectAll<{ occurred_at: string; event: string; value: number | null }>(`/web_conversions?site_id=eq.${site}&occurred_at=gte.${addDays(from, -1)}T00:00:00Z&occurred_at=lt.${addDays(to, 1)}T12:00:00Z&select=occurred_at,event,value&order=id`),
    selectAll<{ date: string; jobs_created: number; revenue_done: number }>(`/web_business_daily?site_id=eq.${site}&date=gte.${from}&date=lte.${to}&select=date,jobs_created,revenue_done&order=date,service_category`),
    selectAll<{ captured_on: string; sessions: number | null }>(`/web_clarity_daily?site_id=eq.${site}&captured_on=gte.${from}&captured_on=lte.${to}&url=eq.&device=eq.&select=captured_on,sessions&order=captured_on`),
  ]);
  const days = new Map(eachDay(from, to).map((d) => [d, { site_id: site, date: d } as Record<string, unknown>]));
  const add = (d: string, k: string, v: number) => { const r = days.get(d); if (r) r[k] = N(r[k]) + v; };
  for (const g of gsc) {
    const r = days.get(g.date);
    if (r) Object.assign(r, { gsc_clicks: g.clicks, gsc_impressions: g.impressions, gsc_position: g.position, gsc_final: g.final });
  }
  for (const l of land) {
    add(l.date, 'ga4_sessions', N(l.sessions)); add(l.date, 'ga4_engaged_sessions', N(l.engaged_sessions));
    add(l.date, 'ga4_users', N(l.users)); add(l.date, 'ga4_engagement_s', N(l.engagement_seconds));
  }
  const evCol: Record<string, string> = { lead: 'ga4_leads', phone: 'ga4_phone_clicks', whatsapp: 'ga4_whatsapp_clicks', booking_start: 'ga4_booking_starts' };
  for (const e of ev) {
    const col = evCol[config.events[e.event_name] ?? ''];
    if (col) add(e.date, col, N(e.events));
  }
  const convCol: Record<string, string> = { lead_submitted: 'site_leads', checkout_started: 'checkouts_started', deposit_paid: 'deposits_paid' };
  for (const c of conv) {
    const d = ukDay(c.occurred_at);
    add(d, convCol[c.event], 1);
    if (c.event === 'deposit_paid') add(d, 'deposit_value', N(c.value));
  }
  for (const b of biz) { add(b.date, 'jobs_created', N(b.jobs_created)); add(b.date, 'jobs_revenue', N(b.revenue_done)); }
  for (const c of clar) if (c.sessions != null) add(c.captured_on, 'clarity_sessions', N(c.sessions));
  const rows = [...days.values()].map((r) => ({ ...r, updated_at: new Date().toISOString() }));
  await upsert('web_site_daily', rows, 'site_id,date');
  return rows.length;
}

export function makeWindow(to: string, days = 28): AnalysisWindow {
  const from = addDays(to, -(days - 1));
  const prevTo = addDays(from, -1);
  const prevFrom = addDays(prevTo, -(days - 1));
  return { from, to, prevFrom, prevTo, days: daysBetween(from, to) + 1, label: rangeLabel(from, to) };
}
