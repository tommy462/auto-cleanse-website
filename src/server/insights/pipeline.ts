// The daily run (and, on Mondays, the weekly analysis). Each source is its
// own step: one failing source is logged and the rest carry on, and the run
// ends "partial" rather than losing the day. Runs are claimed in the database
// first, so two cron triggers or a manual re-run never double-process a day.
//
// Daily:  sitemap -> Search Console -> GA4 -> Clarity -> jobs + Stripe ->
//         marts -> alerts + refresh open recommendations -> experiments -> retention
// Weekly: query snapshot -> new opportunities -> AI write-up of the best few

import { addDays, rangeLabel, ukNow } from './dates.js';
import { AUTO_CLEANSE, type SiteConfig } from './site-config.js';
import { claimRun, finishRun, insertIgnore, patch, rpc, rpcAll, selectAll, skip, step, upsert } from './store.js';
import { loadSitemaps, checkStatuses } from './sitemap.js';
import { ga4Events, ga4Landing, ga4Pages, googleConfigured, gscPagesDaily, gscQueries, gscSiteDaily } from './google.js';
import { clarityConfigured, clarityExport, flattenClarity } from './clarity.js';
import { businessDaily, stripeConversions } from './business.js';
import { buildSiteDaily, loadPageWindows, makeWindow, writeSnapshots } from './data.js';
import { analyse } from './rules.js';
import { dailyAlerts, type SiteDay } from './alerts.js';
import { mergeFindings, type ExistingRec } from './recommend.js';
import { emptyTotals, evaluate, experimentWindows, type Totals } from './experiments.js';
import { writeUp } from './ai.js';
import type { Experiment, Finding, QueryRow, RunStep } from './types.js';

export interface RunOptions {
  config?: SiteConfig;
  trigger: 'cron' | 'manual' | 'cli';
  force?: boolean;
  /** run the weekly analysis even if today is not Monday */
  weekly?: boolean;
  now?: Date;
}

interface SiteRow { ai_enabled: boolean; ai_monthly_budget_usd: number; autonomy_mode: string; gsc_property: string | null; ga4_property_id: string | null; clarity_project_id: string | null }

const env = () => ({
  gscProperty: process.env.INSIGHTS_GSC_PROPERTY,
  ga4Property: process.env.INSIGHTS_GA4_PROPERTY_ID,
});

export async function runDaily(opts: RunOptions): Promise<Record<string, unknown>> {
  const config = opts.config ?? AUTO_CLEANSE;
  const uk = ukNow(opts.now);
  const today = uk.date;
  const runId = await claimRun(config.id, 'daily', today, opts.trigger, Boolean(opts.force));
  if (runId == null) return { status: 'skipped', reason: `daily run for ${today} already done or in progress` };

  const steps: RunStep[] = [];
  const summary: Record<string, unknown> = { today };
  const [site] = await selectAll<SiteRow>(`/web_sites?id=eq.${config.id}&select=ai_enabled,ai_monthly_budget_usd,autonomy_mode,gsc_property,ga4_property_id,clarity_project_id&order=id`);
  const gscProperty = env().gscProperty || site?.gsc_property || '';
  const ga4Property = env().ga4Property || site?.ga4_property_id || '';
  const google = googleConfigured();
  const configured = {
    gsc: google && Boolean(gscProperty),
    ga4: google && Boolean(ga4Property),
    clarity: clarityConfigured(),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
  };
  summary.configured = configured;

  // 1. Page registry from the live sitemaps
  let urlsOutside: string[] = [];
  await step(steps, 'sitemap', async () => {
    const pages = await loadSitemaps(config.baseUrl, config.canonicalHost);
    await upsert('web_pages', pages.map((p) => ({
      site_id: config.id, path: p.path, page_group: p.group, service: p.service, location: p.location, page_type: p.pageType,
      in_sitemap: true, sitemap_lastmod: p.lastmod, content_changed_on: p.lastmod, last_seen: today, updated_at: new Date().toISOString(),
    })), 'site_id,path');
    // Pages that dropped out of the sitemap stay registered but are marked as such.
    const known = await selectAll<{ path: string }>(`/web_pages?site_id=eq.${config.id}&in_sitemap=eq.true&last_seen=lt.${today}&select=path&order=path`);
    for (let i = 0; i < known.length; i += 100) {
      const list = known.slice(i, i + 100).map((k) => `"${k.path.replace(/"/g, '')}"`).join(',');
      await patch('web_pages', `site_id=eq.${config.id}&path=in.(${encodeURIComponent(list)})`, { in_sitemap: false });
    }
    return { rows: pages.length, note: known.length ? `${known.length} left the sitemap` : undefined };
  });

  // 2. Search Console: the last 10 days, re-read every day so late revisions land.
  if (configured.gsc) {
    await step(steps, 'search_console', async () => {
      const from = addDays(today, -10);
      const to = addDays(today, -1);
      const [site10, pages] = await Promise.all([gscSiteDaily(gscProperty, from, to), gscPagesDaily(gscProperty, config.canonicalHost, from, to)]);
      await upsert('web_gsc_site_daily', site10.map((r) => ({ site_id: config.id, ...r, source: 'api' })), 'site_id,date');
      await upsert('web_gsc_daily', pages.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,path,device,host');
      const lastFinal = site10.filter((r) => r.final).map((r) => r.date).sort().pop() ?? null;
      summary.gscLastFinal = lastFinal;
      // Register any URL Google shows that the sitemap does not list.
      const reg = new Set((await selectAll<{ path: string }>(`/web_pages?site_id=eq.${config.id}&select=path&order=path`)).map((r) => r.path));
      const fresh = [...new Set(pages.map((p) => p.path))].filter((p) => !reg.has(p));
      if (fresh.length) {
        const { classifyPath } = await import('./classify.js');
        await insertIgnore('web_pages', fresh.map((p) => {
          const c = classifyPath(p);
          return { site_id: config.id, path: p, page_group: c.group, service: c.service, location: c.location, page_type: c.pageType, in_sitemap: false, first_seen: today, last_seen: today };
        }), 'site_id,path');
      }
      urlsOutside = fresh;
      return { rows: pages.length + site10.length, note: `complete up to ${lastFinal ?? 'none'}` };
    });
  } else skip(steps, 'search_console', 'not configured (service account and INSIGHTS_GSC_PROPERTY)');

  // 3. GA4: the last 4 days, re-read so late-processed hits land.
  if (configured.ga4) {
    await step(steps, 'ga4', async () => {
      const from = addDays(today, -4);
      const to = addDays(today, -1);
      const [land, pv, ev] = await Promise.all([
        ga4Landing(ga4Property, config.canonicalHost, from, to),
        ga4Pages(ga4Property, config.canonicalHost, from, to),
        ga4Events(ga4Property, config.canonicalHost, from, to, Object.keys(config.events)),
      ]);
      await upsert('web_ga4_landing_daily', land.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,landing_path,channel,device');
      await upsert('web_ga4_pages_daily', pv.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,page_path');
      await upsert('web_ga4_events_daily', ev.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,page_path,event_name');
      return { rows: land.length + pv.length + ev.length };
    });
  } else skip(steps, 'ga4', 'not configured (service account and INSIGHTS_GA4_PROPERTY_ID)');

  // 4. Clarity: last 24 hours, 3 of the 10 requests allowed a day. Cannot be backfilled.
  if (configured.clarity) {
    await step(steps, 'clarity', async () => {
      let rows = 0;
      for (const dims of [[], ['URL'], ['URL', 'Device']]) {
        const name = dims.length ? dims.join('+') : 'site';
        const blocks = await clarityExport(1, dims);
        await upsert('web_clarity_snapshots', [{ site_id: config.id, captured_on: today, num_days: 1, dimension: name, payload: blocks }], 'site_id,captured_on,dimension');
        const flat = flattenClarity(blocks, dims, config.canonicalHost);
        await upsert('web_clarity_daily', flat.map((r) => ({ site_id: config.id, captured_on: today, num_days: 1, ...r })), 'site_id,captured_on,url,device');
        rows += flat.length;
      }
      return { rows, note: 'last 24 hours to the time of the run' };
    });
  } else skip(steps, 'clarity', 'not configured (INSIGHTS_CLARITY_TOKEN)');

  // 5. Business outcomes
  await step(steps, 'jobs', async () => {
    const rows = await businessDaily(addDays(today, -14), today);
    await upsert('web_business_daily', rows.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,service_category');
    return { rows: rows.length };
  });
  if (configured.stripe) {
    await step(steps, 'stripe', async () => {
      const conv = await stripeConversions(addDays(today, -3), today);
      await insertIgnore('web_conversions', conv.map((c) => ({ site_id: config.id, ...c })), 'site_id,dedupe_key');
      return { rows: conv.length };
    });
  } else skip(steps, 'stripe', 'STRIPE_SECRET_KEY not set');

  // 6. Marts
  const gscEnd = (summary.gscLastFinal as string | null) ?? addDays(today, -3);
  const win = makeWindow(gscEnd, 28);
  let loaded: Awaited<ReturnType<typeof loadPageWindows>> | null = null;
  await step(steps, 'marts', async () => {
    const n = await buildSiteDaily(config, addDays(today, -40), today);
    loaded = await loadPageWindows(config, win);
    // No search or visitor data for the window (e.g. before the APIs are connected): writing a
    // snapshot of zeros would hide an imported Search Console export in the dashboard.
    if (!loaded.sources.gsc && !loaded.sources.ga4) return { rows: n, note: 'no page data for the window; snapshots left as they were' };
    const s = await writeSnapshots(config, win, loaded.pages, 'api');
    return { rows: n + s };
  });

  // 7. Analysis
  const weekly = Boolean(opts.weekly) || uk.weekday === 1;
  summary.weekly = weekly;
  const experiments = await selectAll<Experiment>(`/web_experiments?site_id=eq.${config.id}&select=id,title,pages,page_groups,control_pages,method,primary_metric,implemented_on,measure_from,measure_to,baseline_from,baseline_to,outcome,recommendation_id&order=created_at`).catch(() => [] as Experiment[]);
  const findings: Finding[] = [];
  const rulesRun = new Set<string>();
  await step(steps, 'analyse', async () => {
    const days = await selectAll<SiteDay>(`/web_site_daily?site_id=eq.${config.id}&date=gte.${addDays(today, -80)}&select=date,gsc_clicks,gsc_impressions,gsc_final,ga4_sessions,ga4_leads,ga4_phone_clicks,ga4_whatsapp_clicks,site_leads,deposits_paid,clarity_sessions&order=date`);
    const anyLeads = days.some((d) => (d.site_leads ?? 0) > 0);
    const alerts = dailyAlerts({ today, days, configured: { gsc: configured.gsc, ga4: configured.ga4, clarity: configured.clarity, siteLeads: anyLeads } });
    for (const a of alerts) rulesRun.add(a.rule);
    ['gsc_stale', 'ga4_zero', 'tracking_break', 'site_leads_break', 'clarity_zero', 'anomaly_gsc_clicks', 'anomaly_ga4_sessions', 'spike_ga4_sessions'].forEach((r) => rulesRun.add(r));
    findings.push(...alerts);
    if (loaded && loaded.sources.gsc) {
      let queries: QueryRow[] = [];
      if (weekly && configured.gsc) {
        queries = (await gscQueries(gscProperty, config.canonicalHost, win.from, win.to)).map((q) => ({ ...q }));
        await upsert('web_gsc_queries', queries.map((q) => ({ site_id: config.id, period_end: win.to, days: win.days, ...q, source: 'api' })), 'site_id,period_end,days,query,path');
      } else {
        queries = await selectAll<QueryRow>(`/web_gsc_queries?site_id=eq.${config.id}&period_end=eq.${win.to}&days=eq.${win.days}&select=query,path,clicks,impressions,position&order=query,path`);
      }
      const outside = loaded.pages.filter((p) => !p.inSitemap && p.impressions >= 30).map((p) => p.path);
      const urlStatus = outside.length ? await checkStatuses(config.baseUrl, [...new Set([...outside, ...urlsOutside])]) : {};
      const longFrom = addDays(win.to, -89);
      const long = await rpcAll<{ path: string; impressions: number }>('web_gsc_page_window', { p_site: config.id, p_from: longFrom, p_to: win.to }, 'path');
      const result = analyse({
        config, window: win, pages: loaded.pages, queries, prevQueries: [], experiments, dataSource: 'api',
        sources: { ...loaded.sources, queryPages: queries.some((q) => q.path) }, urlStatus,
        longWindow: { from: longFrom, to: win.to, days: 90, label: rangeLabel(longFrom, win.to), impressions: new Map(long.map((r) => [r.path, Number(r.impressions)])) },
      });
      findings.push(...result.findings);
      for (const f of result.findings) rulesRun.add(f.rule);
      ['ctr_gap', 'page_two', 'visibility_drop', 'no_impressions', 'non_canonical_host', 'dead_urls'].forEach((r) => rulesRun.add(r));
      if (queries.length) ['query_demand', 'cannibalisation'].forEach((r) => rulesRun.add(r));
      if (loaded.sources.ga4) ['conversion_gap', 'mobile_gap'].forEach((r) => rulesRun.add(r));
      if (loaded.sources.clarity) ['friction', 'low_scroll'].forEach((r) => rulesRun.add(r));
      summary.heldPages = result.heldPages.length;
    }
    return { rows: findings.length };
  });

  // 8. Recommendations (observe mode collects and analyses but changes nothing here)
  if (site?.autonomy_mode !== 'observe') {
    await step(steps, 'recommendations', async () => {
      const existing = await selectAll<ExistingRec>(`/web_recommendations?site_id=eq.${config.id}&select=id,dedupe_key,kind,rule,status,snoozed_until,last_detected_at,updated_at,detections,data_source&order=id`);
      const plan = mergeFindings({ siteId: config.id, existing, findings, mode: weekly ? 'weekly' : 'daily', rulesRun, now: new Date().toISOString(), runId, apiRun: Boolean(loaded?.sources.gsc) });
      await applyPlan(plan);
      return { rows: plan.inserts.length + plan.updates.length + plan.closes.length, note: `${plan.inserts.length} new, ${plan.updates.length} refreshed, ${plan.closes.length} closed` };
    });
  } else skip(steps, 'recommendations', 'observe mode');

  // 9. Experiments
  await step(steps, 'experiments', async () => evaluateExperiments(config, experiments, today, gscEnd));

  // 10. Weekly AI write-up
  if (weekly) {
    await step(steps, 'ai_writeup', async () => aiWriteUp(config, site, experiments, runId));
  }

  // 11. Retention
  await step(steps, 'retention', async () => {
    const r = await rpc<Record<string, number>>('web_prune', { p_site: config.id });
    return { note: JSON.stringify(r) };
  });

  const failed = steps.filter((s) => s.status === 'failed');
  const status = failed.length === 0 ? 'succeeded' : failed.length === steps.filter((s) => s.status !== 'skipped').length ? 'failed' : 'partial';
  await finishRun(runId, status, steps, summary, failed.map((f) => `${f.step}: ${f.error}`).join('\n') || undefined);
  return { status, runId, steps, summary };
}

export async function applyPlan(plan: ReturnType<typeof mergeFindings>) {
  if (plan.inserts.length) await insertIgnore('web_recommendations', plan.inserts, 'site_id,dedupe_key');
  for (const u of plan.updates) await patch('web_recommendations', `id=eq.${u.id}`, u.patch);
  for (const c of plan.closes) await patch('web_recommendations', `id=eq.${c.id}`, { status: c.status, status_note: c.note });
}

async function evaluateExperiments(config: SiteConfig, experiments: Experiment[], today: string, dataUntil: string) {
  let n = 0;
  for (const e of experiments.filter((x) => ['planned', 'running'].includes(x.outcome) && x.implemented_on)) {
    const w = experimentWindows(e);
    if (!w || today < w.measureFrom) continue;
    const args = (from: string, to: string) => ({ p_site: config.id, p_from: from, p_to: to });
    const [before, after] = await Promise.all([
      rpcAll<{ path: string; clicks: number; impressions: number; avg_position: number | null }>('web_gsc_page_window', args(w.baselineFrom, w.baselineTo), 'path'),
      rpcAll<{ path: string; clicks: number; impressions: number; avg_position: number | null }>('web_gsc_page_window', args(w.measureFrom, w.measureTo), 'path'),
    ]);
    const reg = await selectAll<{ path: string; page_group: string }>(`/web_pages?site_id=eq.${config.id}&select=path,page_group&order=path`);
    const groupOf = new Map(reg.map((r) => [r.path, r.page_group]));
    const inTreat = (p: string) => e.pages.includes(p) || e.page_groups.includes(groupOf.get(p) ?? '');
    const inControl = (p: string) => e.control_pages.includes(p);
    const sumUp = (rows: typeof before, pick: (p: string) => boolean, days: number): Totals => rows.filter((r) => pick(r.path)).reduce((t, r) => ({
      ...t, clicks: t.clicks + Number(r.clicks), impressions: t.impressions + Number(r.impressions),
      positionWeight: t.positionWeight + Number(r.avg_position ?? 0) * Number(r.impressions),
    }), emptyTotals(days));
    const treat = { before: sumUp(before, inTreat, w.len), after: sumUp(after, inTreat, w.len) };
    const control = e.control_pages.length ? { before: sumUp(before, inControl, w.len), after: sumUp(after, inControl, w.len) } : null;
    const ev = evaluate(e, w, treat, control, today, dataUntil);
    const values: Record<string, unknown> = {
      result: { ...ev, evaluated_on: today },
      baseline_from: w.baselineFrom, baseline_to: w.baselineTo, measure_from: w.measureFrom, measure_to: w.measureTo,
      outcome: ev.outcome,
    };
    if (ev.complete) {
      values.outcome_confidence = ev.confidence;
      values.conclusion = [ev.summary, ...ev.limitations].join(' ');
      values.decided_at = new Date().toISOString();
    }
    await patch('web_experiments', `id=eq.${e.id}`, values);
    if (ev.complete && e.recommendation_id) {
      const status = ev.outcome === 'successful' ? 'successful' : 'inconclusive';
      await patch('web_recommendations', `id=eq.${e.recommendation_id}&status=in.(implemented,monitoring)`, { status, status_note: ev.summary.slice(0, 2000) });
    }
    n++;
  }
  return { rows: n };
}

async function aiWriteUp(config: SiteConfig, site: SiteRow | undefined, experiments: Experiment[], runId: number | null) {
  const monthStart = `${new Date().toISOString().slice(0, 7)}-01T00:00:00Z`;
  const spent = await selectAll<{ cost_usd: number }>(`/web_ai_calls?site_id=eq.${config.id}&created_at=gte.${monthStart}&select=cost_usd&order=id`);
  const open = await selectAll<Finding & { id: string; priority_score: number; dedupe_key: string; scope_type: Finding['scopeType']; scope_key: string; est_extra_clicks_month: number | null }>(
    `/web_recommendations?site_id=eq.${config.id}&kind=eq.opportunity&status=in.(new,investigating,proposed,awaiting_approval)&select=id,rule,kind,scope_type,scope_key,pages,title,problem,facts,evidence,hypotheses,proposal,est_extra_clicks_month,confidence,effort,priority_score&order=priority_score.desc&limit=12`);
  const findings = open.map((r) => ({ ...r, scopeType: r.scope_type, scopeKey: r.scope_key, estExtraClicksMonth: r.est_extra_clicks_month }));
  const { result, log } = await writeUp({
    config,
    findings: findings as unknown as (Finding & { id: string; priority_score?: number })[],
    experiments: experiments.filter((e) => ['planned', 'running'].includes(e.outcome)).map((e) => `${e.title} (pages: ${[...e.pages, ...e.page_groups].slice(0, 6).join(', ')})`),
    enabled: Boolean(site?.ai_enabled),
    budgetUsd: Number(site?.ai_monthly_budget_usd ?? 0),
    spentThisMonthUsd: spent.reduce((s, r) => s + Number(r.cost_usd), 0),
  });
  await insertIgnore('web_ai_calls', [{ site_id: config.id, run_id: runId, ...log }], 'id');
  if (result) {
    const top = new Map(result.top_three.map((t, i) => [t.id, { rank: i + 1, why: t.why }]));
    for (const item of result.items) {
      await patch('web_recommendations', `id=eq.${item.id}`, {
        ai: { ...item, top_rank: top.get(item.id)?.rank ?? null, top_why: top.get(item.id)?.why ?? null, notes_for_owner: result.notes_for_owner, model: log.model, generated_at: new Date().toISOString() },
      });
    }
  }
  return { note: `${log.status}${log.cost_usd ? `, $${log.cost_usd.toFixed(4)}` : ''}${log.error ? `: ${log.error}` : ''}` };
}

/** Fills Search Console history (up to 16 months) and GA4 history, a chunk at a time. */
export async function backfill(opts: { config?: SiteConfig; from: string; to: string; sources: ('gsc' | 'ga4')[] }) {
  const config = opts.config ?? AUTO_CLEANSE;
  const gscProperty = env().gscProperty ?? '';
  const ga4Property = env().ga4Property ?? '';
  const out: Record<string, number> = {};
  for (let start = opts.from; start <= opts.to; start = addDays(start, 30)) {
    const end = addDays(start, 29) < opts.to ? addDays(start, 29) : opts.to;
    if (opts.sources.includes('gsc') && gscProperty) {
      const [s, p] = await Promise.all([gscSiteDaily(gscProperty, start, end), gscPagesDaily(gscProperty, config.canonicalHost, start, end)]);
      await upsert('web_gsc_site_daily', s.map((r) => ({ site_id: config.id, ...r, source: 'api' })), 'site_id,date');
      await upsert('web_gsc_daily', p.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,path,device,host');
      out.gsc = (out.gsc ?? 0) + s.length + p.length;
    }
    if (opts.sources.includes('ga4') && ga4Property) {
      const [land, pv, ev] = await Promise.all([
        ga4Landing(ga4Property, config.canonicalHost, start, end), ga4Pages(ga4Property, config.canonicalHost, start, end),
        ga4Events(ga4Property, config.canonicalHost, start, end, Object.keys(config.events)),
      ]);
      await upsert('web_ga4_landing_daily', land.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,landing_path,channel,device');
      await upsert('web_ga4_pages_daily', pv.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,page_path');
      await upsert('web_ga4_events_daily', ev.map((r) => ({ site_id: config.id, ...r })), 'site_id,date,page_path,event_name');
      out.ga4 = (out.ga4 ?? 0) + land.length + pv.length + ev.length;
    }
    console.log(`[insights] backfilled ${start} to ${end}`);
  }
  await buildSiteDaily(config, opts.from, opts.to);
  return out;
}
