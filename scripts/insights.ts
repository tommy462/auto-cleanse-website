/**
 * Website insights engine, command line.
 *
 *   npx tsx scripts/insights.ts analyse-export <folder> [--out file.json]
 *       Analyse an unzipped Search Console export (Chart.csv, Pages.csv,
 *       Queries.csv) against the live sitemap. Needs no credentials and writes
 *       nothing to the database. Keep the output out of this public repo.
 *
 *   npx tsx --env-file=<env> scripts/insights.ts import-export <folder>
 *       Same analysis, then stores the export (site totals, page snapshot,
 *       queries) and the resulting recommendations in Supabase.
 *
 *   npx tsx --env-file=<env> scripts/insights.ts daily [--force] [--weekly]
 *       The daily run, exactly as the cron runs it.
 *
 *   npx tsx --env-file=<env> scripts/insights.ts backfill --from 2025-07-01 --to 2026-10-31 [--sources gsc,ga4]
 *       Fills history from the APIs (Search Console keeps 16 months).
 *
 *   npx tsx --env-file=<env> scripts/insights.ts business --from 2026-07-27 [--to 2026-11-01]
 *       Jobs per day and service (no customer details) for the overview.
 *
 *   npx tsx --env-file=<env> scripts/insights.ts seed-experiments
 *       Records the changes already made on 28 Oct 2026 as running experiments.
 *
 * <env> holds AUTOCLEANSE_SUPABASE_URL / AUTOCLEANSE_SUPABASE_SERVICE_KEY and,
 * for the APIs, the INSIGHTS_* variables (see docs/website-insights.md). Never
 * commit it.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { AUTO_CLEANSE } from '../src/server/insights/site-config.js';
import { loadSitemaps } from '../src/server/insights/sitemap.js';
import { readExport } from '../src/server/insights/gsc-export.js';
import { analyse, priorityOf } from '../src/server/insights/rules.js';
import type { Experiment } from '../src/server/insights/types.js';

const [cmd, ...rest] = process.argv.slice(2);
const flag = (name: string) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};
const has = (name: string) => rest.includes(`--${name}`);

/** Changes already live (CLAUDE.md, 28 Oct 2026). Pages are judged once Google has the new versions. */
const KNOWN_EXPERIMENTS = [
  {
    title: 'Data-driven titles on vehicle remap pages',
    hypothesis: 'Titles that state the measured gain and the Stage 1 price ("up to +Xbhp, from £250") match what searchers compare, so more of the people who see these pages in Google will click.',
    change_summary: 'Rewrote the title tags of 65 vehicle remap pages to "up to +Xbhp, from £250" (commits d4aa111..0efb7c8). URLs and page text unchanged.',
    page_groups: ['vehicle'],
    method: 'before_after',
    primary_metric: 'ctr',
    guardrail_metrics: ['position', 'clicks'],
    implementation_ref: 'd4aa111..0efb7c8',
    rollback_ref: 'git revert d4aa111..0efb7c8 (titles only)',
    implemented_on: '2026-10-28',
  },
  {
    title: 'Price box and "Stage 1 from £250" titles on Devon remap town pages',
    hypothesis: 'Showing the Stage 1 price in the title and near the top of each Devon town page gives searchers a reason to click and to call.',
    change_summary: 'Added a price box and "Stage 1 from £250" titles to all Devon ECU town pages (commits e82629b..11ac896).',
    page_groups: ['ecu-devon-town'],
    method: 'before_after',
    primary_metric: 'ctr',
    guardrail_metrics: ['position', 'clicks'],
    implementation_ref: 'e82629b..11ac896',
    rollback_ref: 'git revert e82629b..11ac896',
    implemented_on: '2026-10-28',
  },
] as const;

async function exportAnalysis(folder: string) {
  const read = (f: string) => (existsSync(join(folder, f)) ? readFileSync(join(folder, f), 'utf8') : undefined);
  const chart = read('Chart.csv');
  const pagesCsv = read('Pages.csv');
  if (!chart || !pagesCsv) throw new Error(`${folder} needs Chart.csv and Pages.csv from a Search Console export`);
  const sitemap = await loadSitemaps(AUTO_CLEANSE.baseUrl, AUTO_CLEANSE.canonicalHost);
  const data = readExport({ chart, pages: pagesCsv, queries: read('Queries.csv'), devices: read('Devices.csv') }, AUTO_CLEANSE.canonicalHost, sitemap);
  const experiments: Experiment[] = KNOWN_EXPERIMENTS.map((e, i) => ({
    id: `known-${i}`, title: e.title, pages: [], page_groups: [...e.page_groups], control_pages: [], method: e.method,
    primary_metric: e.primary_metric, implemented_on: e.implemented_on, measure_from: null, measure_to: null,
    baseline_from: null, baseline_to: null, outcome: 'running', recommendation_id: null,
  }));
  const result = analyse({
    config: AUTO_CLEANSE, window: data.window, pages: data.pages, queries: data.queries, prevQueries: [], experiments,
    dataSource: 'export',
    sources: { gsc: true, prevGsc: false, queryPages: false, ga4: false, clarity: false, conversions: false },
  });
  const ranked = result.findings
    .map((f) => ({ ...f, priorityScore: priorityOf(f) }))
    .sort((a, b) => (a.kind === b.kind ? b.priorityScore - a.priorityScore : a.kind === 'opportunity' ? -1 : 1));
  return { data, result, ranked, sitemapCount: sitemap.length };
}

async function main() {
  switch (cmd) {
    case 'analyse-export': {
      const folder = rest[0];
      const { data, result, ranked, sitemapCount } = await exportAnalysis(folder);
      const totals = data.siteDaily.reduce((s, d) => ({ clicks: s.clicks + d.clicks, impressions: s.impressions + d.impressions }), { clicks: 0, impressions: 0 });
      console.log(`Window: ${data.window.label} (${data.window.days} days). Site: ${totals.clicks} clicks, ${totals.impressions} impressions.`);
      const exp = result.heldPages.filter((h) => h.reason.startsWith('part of the experiment')).length;
      console.log(`Pages in export: ${data.pages.filter((p) => p.impressions > 0).length}; sitemap pages: ${sitemapCount}; under a running experiment: ${exp}; text changed since the data started (CTR and behaviour rules wait): ${result.heldPages.length - exp}`);
      console.log('CTR curve:', result.curve.filter((c) => c.impressions).map((c) => `${c.bucket}: ${c.ctr == null ? '-' : (c.ctr * 100).toFixed(2) + '%'} (${c.impressions})`).join(' | '));
      console.log('');
      ranked.forEach((f, i) => {
        console.log(`#${i + 1} [${f.kind}/${f.rule}] priority ${f.priorityScore} | ${f.confidence} | effort ${f.effort}${f.estExtraClicksMonth != null ? ` | ~${f.estExtraClicksMonth} clicks/mo` : ''}`);
        console.log(`   ${f.title}`);
        console.log(`   ${f.problem}`);
        f.facts.slice(0, 4).forEach((x) => console.log(`     - ${x}`));
      });
      const out = flag('out');
      if (out) writeFileSync(out, JSON.stringify({ window: data.window, held: result.heldPages, curve: result.curve, findings: ranked }, null, 2));
      break;
    }
    case 'import-export': {
      const { upsert } = await import('../src/server/insights/store.js');
      const { writeSnapshots } = await import('../src/server/insights/data.js');
      const { mergeFindings } = await import('../src/server/insights/recommend.js');
      const { applyPlan } = await import('../src/server/insights/pipeline.js');
      const { selectAll } = await import('../src/server/insights/store.js');
      const { classifyPath } = await import('../src/server/insights/classify.js');
      const folder = rest[0];
      const { data, ranked } = await exportAnalysis(folder);
      const site = AUTO_CLEANSE.id;
      const today = new Date().toISOString().slice(0, 10);
      await upsert('web_pages', data.pages.map((p) => {
        const c = classifyPath(p.path);
        return { site_id: site, path: p.path, page_group: p.group, service: c.service, location: c.location, page_type: c.pageType, in_sitemap: p.inSitemap, sitemap_lastmod: p.contentChangedOn, content_changed_on: p.contentChangedOn, last_seen: today };
      }), 'site_id,path');
      // Export days only fill gaps: a day the API already wrote is not overwritten by coarser export data.
      const have = new Set((await selectAll<{ date: string }>(`/web_gsc_site_daily?site_id=eq.${site}&source=eq.api&select=date&order=date`)).map((r) => r.date));
      await upsert('web_gsc_site_daily', data.siteDaily.filter((d) => !have.has(d.date)).map((d) => ({ site_id: site, ...d, final: true, source: 'export' })), 'site_id,date');
      await upsert('web_gsc_queries', data.queries.map((q) => ({ site_id: site, period_end: data.window.to, days: data.window.days, ...q, source: 'export' })), 'site_id,period_end,days,query,path');
      const n = await writeSnapshots(AUTO_CLEANSE, data.window, data.pages, 'export');
      const existing = await selectAll<Parameters<typeof mergeFindings>[0]['existing'][number]>(`/web_recommendations?site_id=eq.${site}&select=id,dedupe_key,kind,rule,status,snoozed_until,last_detected_at,updated_at,detections&order=id`);
      const plan = mergeFindings({ siteId: site, existing, findings: ranked, mode: 'weekly', rulesRun: new Set(), now: new Date().toISOString(), runId: null });
      await applyPlan(plan);
      const { buildSiteDaily } = await import('../src/server/insights/data.js');
      await buildSiteDaily(AUTO_CLEANSE, data.window.from, data.window.to);
      console.log(`Imported ${data.siteDaily.length} days, ${n} page rows, ${data.queries.length} queries; recommendations: ${plan.inserts.length} new, ${plan.updates.length} refreshed.`);
      break;
    }
    case 'daily': {
      const { runDaily } = await import('../src/server/insights/pipeline.js');
      const r = await runDaily({ trigger: 'cli', force: has('force'), weekly: has('weekly') });
      console.log(JSON.stringify(r, null, 2));
      break;
    }
    case 'backfill': {
      const { backfill } = await import('../src/server/insights/pipeline.js');
      const from = flag('from');
      const to = flag('to');
      if (!from || !to) throw new Error('--from and --to are required (YYYY-MM-DD)');
      const sources = (flag('sources') ?? 'gsc,ga4').split(',') as ('gsc' | 'ga4')[];
      console.log(await backfill({ from, to, sources }));
      break;
    }
    case 'business': {
      // Jobs per day and service (counts and quoted value only) into web_business_daily, then the overview series.
      const { businessDaily } = await import('../src/server/insights/business.js');
      const { upsert } = await import('../src/server/insights/store.js');
      const { buildSiteDaily } = await import('../src/server/insights/data.js');
      const from = flag('from');
      if (!from) throw new Error('--from is required (YYYY-MM-DD)');
      const to = flag('to') ?? new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
      const rows = await businessDaily(from, to);
      await upsert('web_business_daily', rows.map((r) => ({ site_id: AUTO_CLEANSE.id, ...r })), 'site_id,date,service_category');
      const days = await buildSiteDaily(AUTO_CLEANSE, from, to);
      console.log(`${rows.length} job rows (day x service), ${days} overview days rebuilt.`);
      break;
    }
    case 'seed-experiments': {
      const { insertIgnore, selectAll } = await import('../src/server/insights/store.js');
      const existing = new Set((await selectAll<{ title: string }>(`/web_experiments?site_id=eq.${AUTO_CLEANSE.id}&select=title&order=title`)).map((e) => e.title));
      const rows = KNOWN_EXPERIMENTS.filter((e) => !existing.has(e.title)).map((e) => ({ site_id: AUTO_CLEANSE.id, ...e, guardrail_metrics: [...e.guardrail_metrics], page_groups: [...e.page_groups], outcome: 'running' }));
      if (rows.length) await insertIgnore('web_experiments', rows, 'id');
      console.log(`${rows.length} experiment(s) recorded.`);
      break;
    }
    default:
      console.log('Commands: analyse-export <folder> | import-export <folder> | daily [--force] [--weekly] | backfill --from --to [--sources] | business --from [--to] | seed-experiments');
      process.exit(cmd ? 1 : 0);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
