/**
 * Tests for the website insights engine (src/server/insights).
 *
 *   npx tsx scripts/test-insights.ts
 *
 * Every number below is SYNTHETIC test data made up for these checks. None of
 * it is real Auto-Cleanse traffic. Nothing here touches the network or the
 * database.
 */
import assert from 'node:assert/strict';
import { classifyPath, normaliseUrl, queryService } from '../src/server/insights/classify.js';
import { addDays, rangeLabel, ukNow, fromGa4Date } from '../src/server/insights/dates.js';
import { binomialLowerP, didRatio, poissonCdf, rateRatio, robustZ, twoProportion } from '../src/server/insights/stats.js';
import { analyse, buildCtrCurve, priorityOf } from '../src/server/insights/rules.js';
import { dailyAlerts, type SiteDay } from '../src/server/insights/alerts.js';
import { mergeFindings, type ExistingRec } from '../src/server/insights/recommend.js';
import { evaluate, experimentWindows, emptyTotals } from '../src/server/insights/experiments.js';
import { flattenClarity, validateClarity } from '../src/server/insights/clarity.js';
import { validateAiResult, estimateMaxCost } from '../src/server/insights/ai.js';
import { readExport } from '../src/server/insights/gsc-export.js';
import { parseSitemap } from '../src/server/insights/sitemap.js';
import { AUTO_CLEANSE } from '../src/server/insights/site-config.js';
import type { AnalysisWindow, Experiment, Finding, PageWindow } from '../src/server/insights/types.js';

let passed = 0;
const failures: string[] = [];
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`PASS ${name}`); } catch (e) { failures.push(name); console.log(`FAIL ${name}\n     ${(e as Error).message}`); }
}

const W: AnalysisWindow = { from: '2026-09-01', to: '2026-09-28', prevFrom: '2026-08-04', prevTo: '2026-08-31', days: 28, label: '2026-09-01 to 2026-09-28' };
function page(path: string, over: Partial<PageWindow> = {}): PageWindow {
  return {
    path, group: classifyPath(path).group, clicks: 0, impressions: 0, position: null, mobileImpressions: 0, otherHostImpressions: 0,
    prevClicks: null, prevImpressions: null, prevPosition: null, sessions: null, engagedSessions: null, engagementSeconds: null,
    mobileSessions: null, mobileEngaged: null, views: null, leads: null, phoneClicks: null, whatsappClicks: null, bookingStarts: null,
    deposits: null, clarity: null, inSitemap: true, contentChangedOn: '2026-01-05', ...over,
  };
}
const SOURCES = { gsc: true, prevGsc: true, queryPages: false, ga4: false, clarity: false, conversions: false };
// A synthetic site: 40 blog pages at position ~6 with a 3% CTR form the benchmark curve.
const baseline = Array.from({ length: 40 }, (_, i) => page(`/blog/synthetic-${i}`, { impressions: 500, clicks: 15, position: 6, prevImpressions: 500, prevClicks: 15, prevPosition: 6 }));

/* ── classify ── */
test('normaliseUrl strips host, query, trailing slash and flags the apex host', () => {
  assert.deepEqual(normaliseUrl('https://www.auto-cleanse.co.uk/dpf-cleaning/?gclid=x', 'www.auto-cleanse.co.uk'), { path: '/dpf-cleaning', host: '' });
  assert.deepEqual(normaliseUrl('https://auto-cleanse.co.uk/', 'www.auto-cleanse.co.uk'), { path: '/', host: 'auto-cleanse.co.uk' });
  assert.equal(normaliseUrl('(not set)', 'x'), null);
});
test('classifyPath puts real URL patterns in the right groups', () => {
  const g = (p: string, s?: string) => classifyPath(p, s).group;
  assert.equal(g('/dpf-cleaning-exeter'), 'dpf-town');
  assert.equal(g('/dpf-cleaning'), 'dpf-hub');
  assert.equal(g('/ecu-remapping-totnes'), 'ecu-devon-town');
  assert.equal(g('/ecu-remapping/aberdeen'), 'ecu-national-town');
  assert.equal(g('/adblue-repair/crawley', 'sitemap-adblue-towns.xml'), 'adblue-town');
  assert.equal(g('/adblue-repair/nox-sensor'), 'adblue-guide');
  assert.equal(g('/bmw-320d-remap'), 'vehicle');
  assert.equal(g('/blog/x'), 'blog');
  assert.equal(g('/privacy'), 'legal');
  assert.equal(g('/remapping-booking'), 'booking');
  assert.equal(classifyPath('/dpf-cleaning-newton-abbot').location, 'Newton Abbot');
});
test('queryService reads search intent', () => {
  assert.equal(queryService('dpf cleaning near me'), 'dpf');
  assert.equal(queryService('p20ee fault'), 'adblue');
  assert.equal(queryService('stage 1 remap golf'), 'ecu');
  assert.equal(queryService('mot test totnes'), null);
});

/* ── dates ── */
test('UK date helpers handle BST and GMT', () => {
  assert.deepEqual(ukNow(new Date('2026-07-01T06:30:00Z')).hour, 7); // BST
  assert.deepEqual(ukNow(new Date('2026-12-01T06:30:00Z')).hour, 6); // GMT
  assert.equal(addDays('2026-10-25', 1), '2026-10-26'); // across the clock change
  assert.equal(fromGa4Date('20261101'), '2026-11-01');
  assert.match(rangeLabel('2026-09-01', '2026-09-28'), /1 Sept? - 28 Sept? 2026/);
});

/* ── stats ── */
test('poisson and binomial tails', () => {
  assert.ok(poissonCdf(2, 20) < 0.001);
  assert.ok(poissonCdf(18, 20) > 0.3);
  assert.ok(binomialLowerP(1, 200, 0.05) < 0.01);
  assert.ok(binomialLowerP(9, 200, 0.05) > 0.2);
  const t = twoProportion(50, 100, 30, 100);
  assert.ok(t.z > 0 && t.p < 0.01);
  assert.equal(robustZ(5, [1, 2]), null);
  assert.ok((robustZ(0, [40, 42, 38, 41, 39, 40, 43, 37]) ?? 0) < -3.5);
});
test('rate ratios and difference-in-differences intervals', () => {
  const r = rateRatio(200, 1000, 100, 1000);
  assert.ok(r.ratio > 1.9 && r.low > 1.5);
  const d = didRatio(200, 1, 100, 1, 150, 1, 100, 1);
  assert.ok(Math.abs(d.ratio - 2 / 1.5) < 0.01);
});

/* ── rules ── */
test('ctr_gap flags a page far below the site curve, with evidence and all 10 fields', () => {
  const pages = [...baseline, page('/dpf-cleaning-exeter', { impressions: 2000, clicks: 10, position: 6, prevImpressions: 2000, prevClicks: 12, prevPosition: 6 })];
  const r = analyse({ config: AUTO_CLEANSE, window: W, pages, queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: SOURCES });
  const f = r.findings.find((x) => x.rule === 'ctr_gap');
  assert.ok(f, 'expected a ctr_gap finding');
  assert.equal(f!.scopeKey, '/dpf-cleaning-exeter');
  assert.ok(f!.estExtraClicksMonth! > 40, `gap ${f!.estExtraClicksMonth}`);
  for (const k of ['pages', 'problem', 'evidence', 'hypotheses', 'confidence', 'proposal', 'benefit', 'effort', 'measurementDays', 'successMetric'] as const) {
    assert.ok(Array.isArray(f![k]) ? (f![k] as unknown[]).length : f![k], `missing ${k}`);
  }
  assert.ok(!/[–—]/.test(JSON.stringify(f)), 'no en or em dashes in generated text');
});
test('ctr_gap ignores small samples and normal variation', () => {
  const pages = [...baseline, page('/dpf-cleaning-exeter', { impressions: 120, clicks: 1, position: 6 }), page('/dpf-cleaning-torquay', { impressions: 600, clicks: 15, position: 6 })];
  const r = analyse({ config: AUTO_CLEANSE, window: W, pages, queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: SOURCES });
  assert.equal(r.findings.filter((x) => x.rule === 'ctr_gap').length, 0);
});
test('ctr_gap rolls near-identical pages into one group finding', () => {
  const towns = ['exeter', 'plymouth', 'torquay', 'paignton', 'brixham'].map((t) => page(`/dpf-cleaning-${t}`, { impressions: 1500, clicks: 5, position: 6 }));
  const r = analyse({ config: AUTO_CLEANSE, window: W, pages: [...baseline, ...towns], queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: SOURCES });
  const f = r.findings.filter((x) => x.rule === 'ctr_gap');
  assert.equal(f.length, 1);
  assert.equal(f[0].scopeType, 'group');
  assert.equal(f[0].pages.length, 5);
});
test('pages under a running experiment or recently changed are held back from CTR findings', () => {
  const towns = ['exeter', 'plymouth', 'torquay'].map((t) => page(`/dpf-cleaning-${t}`, { impressions: 1500, clicks: 5, position: 6 }));
  const exp: Experiment = { id: 'e1', title: 'Synthetic test', pages: [], page_groups: ['dpf-town'], control_pages: [], method: 'before_after', primary_metric: 'ctr', implemented_on: '2026-09-20', measure_from: null, measure_to: null, baseline_from: null, baseline_to: null, outcome: 'running', recommendation_id: null };
  const r = analyse({ config: AUTO_CLEANSE, window: W, pages: [...baseline, ...towns], queries: [], prevQueries: [], experiments: [exp], dataSource: 'api', sources: SOURCES });
  assert.equal(r.findings.filter((x) => x.rule === 'ctr_gap').length, 0);
  const changed = towns.map((t) => ({ ...t, contentChangedOn: '2026-09-25' }));
  const r2 = analyse({ config: AUTO_CLEANSE, window: W, pages: [...baseline, ...changed], queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: SOURCES });
  assert.equal(r2.findings.filter((x) => x.rule === 'ctr_gap').length, 0);
});
test('visibility_drop needs a real, significant fall', () => {
  const dropped = Array.from({ length: 5 }, (_, i) => page(`/ecu-remapping-town${i}`, { group: 'ecu-devon-town', impressions: 300, clicks: 4, position: 12, prevImpressions: 900, prevClicks: 30, prevPosition: 7 }));
  const r = analyse({ config: AUTO_CLEANSE, window: W, pages: [...baseline, ...dropped], queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: SOURCES });
  const f = r.findings.find((x) => x.rule === 'visibility_drop');
  assert.ok(f && f.kind === 'alert');
  assert.match(f!.hypotheses[0], /Positions fell/);
  const wobble = dropped.map((p) => ({ ...p, clicks: 26 }));
  const r2 = analyse({ config: AUTO_CLEANSE, window: W, pages: [...baseline, ...wobble], queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: SOURCES });
  assert.equal(r2.findings.filter((x) => x.rule === 'visibility_drop').length, 0);
});
test('no_impressions skips newly launched national pages but reports established ones', () => {
  const pages = [
    ...['a', 'b', 'c', 'd'].map((x) => page(`/${x}-remap`, { contentChangedOn: '2026-09-20' })),
    ...['x', 'y', 'z', 'w'].map((x) => page(`/ecu-remapping/${x}`, { contentChangedOn: '2026-09-20' })),
  ];
  const r = analyse({ config: AUTO_CLEANSE, window: W, pages: [...baseline, ...pages], queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: SOURCES });
  const f = r.findings.filter((x) => x.rule === 'no_impressions');
  assert.deepEqual(f.map((x) => x.scopeKey), ['vehicle']);
});
test('conversion_gap uses GA4 sessions against similar pages', () => {
  const mk = (p: string, s: number, leads: number, phone: number) => page(p, { sessions: s, engagedSessions: Math.round(s * 0.6), leads, phoneClicks: phone, mobileSessions: Math.round(s * 0.9), mobileEngaged: Math.round(s * 0.5) });
  const pages = [mk('/dpf-cleaning-exeter', 400, 0, 1), mk('/dpf-cleaning-plymouth', 400, 8, 20), mk('/dpf-cleaning-torquay', 300, 6, 15), mk('/dpf-cleaning-paignton', 200, 4, 10)];
  const r = analyse({ config: AUTO_CLEANSE, window: W, pages, queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: { ...SOURCES, gsc: false, ga4: true } });
  const f = r.findings.find((x) => x.rule === 'conversion_gap');
  assert.equal(f?.scopeKey, '/dpf-cleaning-exeter');
});
test('Clarity friction needs both a high rate and enough sessions', () => {
  const clar = (dead: number, rage: number, sessions = 80) => ({ sessions, scrollDepth: 60, deadClickPct: dead, rageClickPct: rage, quickbackPct: 5, excessiveScrollPct: 1, mobileSessions: sessions, mobileScrollDepth: 60, desktopScrollDepth: 60 });
  const pages = [page('/a-remap', { clarity: clar(2, 0.5) }), page('/b-remap', { clarity: clar(3, 0.4) }), page('/c-remap', { clarity: clar(2, 0.5) }), page('/dpf-cleaning', { clarity: clar(25, 6) }), page('/d-remap', { clarity: clar(40, 9, 10) })];
  const r = analyse({ config: AUTO_CLEANSE, window: W, pages, queries: [], prevQueries: [], experiments: [], dataSource: 'api', sources: { ...SOURCES, gsc: false, clarity: true } });
  const f = r.findings.filter((x) => x.rule === 'friction').map((x) => x.scopeKey);
  assert.deepEqual(f, ['/dpf-cleaning']);
});
test('the CTR curve leaves brand pages out', () => {
  const c = buildCtrCurve([page('/', { impressions: 5000, clicks: 2000, position: 2 }), ...baseline]);
  assert.equal(c.impressions.reduce((a, b) => a + b, 0), 40 * 500);
});
test('priority favours value, not just ease', () => {
  const base = { valueScore: 30, confidenceScore: 0.6 } as Finding;
  assert.ok(priorityOf({ ...base, effort: 'medium' }) > priorityOf({ ...base, valueScore: 5, effort: 'small' }));
});

/* ── alerts ── */
test('daily alerts: tracking break and stale Search Console data', () => {
  const days: SiteDay[] = [];
  for (let i = 40; i >= 1; i--) {
    const d = addDays('2026-11-01', -i);
    days.push({ date: d, gsc_clicks: 40, gsc_impressions: 2000, gsc_final: i > 12, ga4_sessions: 60, ga4_leads: i > 8 ? 1 : 0, ga4_phone_clicks: i > 8 ? 3 : 0, ga4_whatsapp_clicks: 0, site_leads: 0, deposits_paid: 0, clarity_sessions: 20 });
  }
  const a = dailyAlerts({ today: '2026-11-01', days, configured: { gsc: true, ga4: true, clarity: true, siteLeads: false } });
  const rules = a.map((x) => x.rule).sort();
  assert.ok(rules.includes('tracking_break'), rules.join(','));
  assert.ok(rules.includes('gsc_stale'), rules.join(','));
});
test('daily alerts: one quiet day is normal, a collapse is flagged', () => {
  const days: SiteDay[] = [];
  for (let i = 70; i >= 1; i--) {
    const d = addDays('2026-11-01', -i);
    days.push({ date: d, gsc_clicks: 40 + (i % 3), gsc_impressions: 2000, gsc_final: true, ga4_sessions: i === 1 ? 2 : 60 + (i % 5), ga4_leads: 1, ga4_phone_clicks: 3, ga4_whatsapp_clicks: 0, site_leads: 1, deposits_paid: 0, clarity_sessions: 20 });
  }
  const a = dailyAlerts({ today: '2026-11-01', days, configured: { gsc: true, ga4: true, clarity: false, siteLeads: true } });
  assert.ok(a.some((x) => x.rule === 'anomaly_ga4_sessions'));
  assert.ok(!a.some((x) => x.rule === 'anomaly_gsc_clicks'));
});

/* ── recommendations ── */
const finding = (key: string, kind: 'opportunity' | 'alert' = 'opportunity'): Finding => ({
  dedupeKey: key, kind, rule: key.split(':')[0], category: 'seo', scopeType: 'page', scopeKey: '/x', pages: ['/x'], title: 't', problem: 'p',
  evidence: [], facts: [], hypotheses: [], proposal: 'do', benefit: 'b', effort: 'small', confidence: 'medium', confidenceScore: 0.6,
  estExtraClicksMonth: 10, valueScore: 10, measurementDays: 28, successMetric: 'm', dataSource: 'api',
});
const rec = (key: string, status: ExistingRec['status'], over: Partial<ExistingRec> = {}): ExistingRec => ({
  id: key, dedupe_key: key, kind: 'opportunity', rule: key.split(':')[0], status, snoozed_until: null,
  last_detected_at: '2026-10-01T07:00:00Z', updated_at: '2026-10-01T07:00:00Z', detections: 3, ...over,
});
const NOW = '2026-11-02T07:00:00Z';
test('merge: no duplicates; daily runs refresh but do not create opportunities', () => {
  const daily = mergeFindings({ siteId: 's', existing: [rec('ctr_gap:a', 'new')], findings: [finding('ctr_gap:a'), finding('ctr_gap:b'), finding('ctr_gap:b'), finding('gsc_stale:site', 'alert')], mode: 'daily', rulesRun: new Set(['ctr_gap']), now: NOW, runId: 1 });
  assert.equal(daily.inserts.length, 1); // only the alert
  assert.equal(daily.inserts[0].dedupe_key, 'gsc_stale:site');
  assert.equal(daily.updates.length, 1);
  const weekly = mergeFindings({ siteId: 's', existing: [], findings: [finding('ctr_gap:b'), finding('ctr_gap:b')], mode: 'weekly', rulesRun: new Set(), now: NOW, runId: 1 });
  assert.equal(weekly.inserts.length, 1);
});
test('merge: respects decisions people made', () => {
  const plan = mergeFindings({
    siteId: 's',
    existing: [rec('a:1', 'dismissed'), rec('b:1', 'implemented'), rec('c:1', 'dismissed', { snoozed_until: '2026-11-01' }), rec('d:1', 'successful', { updated_at: '2026-10-20T00:00:00Z' }), rec('e:1', 'resolved')],
    findings: ['a:1', 'b:1', 'c:1', 'd:1', 'e:1'].map((k) => finding(k)), mode: 'weekly', rulesRun: new Set(), now: NOW, runId: 1,
  });
  const reopened = plan.updates.filter((u) => u.patch.status === 'new').map((u) => u.id).sort();
  assert.deepEqual(reopened, ['c:1', 'e:1']);
  assert.ok(!plan.updates.some((u) => ['a:1', 'b:1', 'd:1'].includes(u.id)));
});
test('merge: findings no longer detected are closed after a grace period', () => {
  const plan = mergeFindings({ siteId: 's', existing: [rec('ctr_gap:old', 'new'), rec('ctr_gap:recent', 'new', { last_detected_at: '2026-10-28T07:00:00Z' }), rec('ctr_gap:busy', 'investigating')], findings: [], mode: 'weekly', rulesRun: new Set(['ctr_gap']), now: NOW, runId: 1 });
  assert.deepEqual(plan.closes.map((c) => c.id), ['ctr_gap:old']);
});

/* ── experiments ── */
test('experiment windows and verdicts', () => {
  const w = experimentWindows({ implemented_on: '2026-10-28', baseline_from: null, baseline_to: null, measure_from: null, measure_to: null })!;
  assert.equal(w.measureFrom, '2026-11-04');
  assert.equal(w.measureTo, '2026-12-01');
  assert.equal(w.baselineTo, '2026-10-27');
  assert.equal(w.len, 28);
  const t = (clicks: number, impressions: number) => ({ ...emptyTotals(28), clicks, impressions, positionWeight: impressions * 7 });
  const win = evaluate({ method: 'before_after', primary_metric: 'ctr', title: 'x' }, w, { before: t(100, 10000), after: t(180, 10000) }, null, '2026-12-10', '2026-12-05');
  assert.equal(win.outcome, 'successful');
  assert.ok(win.limitations.some((l) => /Before\/after only/.test(l)));
  const flat = evaluate({ method: 'before_after', primary_metric: 'ctr', title: 'x' }, w, { before: t(30, 3000), after: t(33, 3000) }, null, '2026-12-10', '2026-12-05');
  assert.equal(flat.outcome, 'inconclusive');
  const early = evaluate({ method: 'before_after', primary_metric: 'ctr', title: 'x' }, w, { before: t(100, 10000), after: t(180, 10000) }, null, '2026-11-20', '2026-11-17');
  assert.equal(early.outcome, 'running');
  const did = evaluate({ method: 'diff_in_diff', primary_metric: 'clicks', title: 'x' }, w, { before: t(100, 1), after: t(200, 1) }, { before: t(100, 1), after: t(200, 1) }, '2026-12-10', '2026-12-05');
  assert.equal(did.outcome, 'inconclusive'); // everything rose equally: the change did nothing
});

/* ── Clarity parsing ── */
test('Clarity: documented Traffic shape and defensive parsing of other metrics', () => {
  const blocks = validateClarity([
    { metricName: 'Traffic', information: [{ totalSessionCount: '120', totalBotSessionCount: '30', distantUserCount: '100', PagesPerSessionPercentage: 1.4, URL: 'https://www.auto-cleanse.co.uk/dpf-cleaning' }] },
    { metricName: 'Dead Click Count', information: [{ sessionsCount: '120', sessionsWithMetricPercentage: 12.5, URL: 'https://www.auto-cleanse.co.uk/dpf-cleaning' }] },
    { metricName: 'Scroll Depth', information: [{ averageScrollDepth: 48.2, URL: 'https://www.auto-cleanse.co.uk/dpf-cleaning' }] },
    { metricName: 'Traffic', information: [{ totalSessionCount: '5', URL: 'https://preview.vercel.app/x' }] },
  ]);
  const rows = flattenClarity(blocks, ['URL'], 'www.auto-cleanse.co.uk');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].url, '/dpf-cleaning');
  assert.equal(rows[0].sessions, 120);
  assert.equal(rows[0].dead_click_pct, 12.5);
  assert.equal(rows[0].scroll_depth, 48.2);
  assert.throws(() => validateClarity({ error: 'x' }));
});

/* ── AI output validation ── */
test('AI output: unknown ids, banned phrases and dashes are handled', () => {
  const ok = validateAiResult({
    items: [
      { id: 'a', headline: 'Fix titles — now', summary: 's', likely_causes: ['c'], proposed_change: 'Change X', how_to_measure: 'm', risks: 'r', keep_priority: true, priority_note: '' },
      { id: 'zzz', headline: 'h', summary: 's', likely_causes: [], proposed_change: 'p', how_to_measure: 'm', risks: 'r', keep_priority: true, priority_note: '' },
      { id: 'b', headline: 'Guaranteed results', summary: 's', likely_causes: [], proposed_change: 'p', how_to_measure: 'm', risks: 'r', keep_priority: true, priority_note: '' },
    ],
    top_three: [{ id: 'a', why: 'w' }, { id: 'zzz', why: 'w' }],
    notes_for_owner: '',
  }, new Set(['a', 'b']));
  assert.ok(ok);
  assert.deepEqual(ok!.items.map((i) => i.id), ['a']);
  assert.equal(ok!.items[0].headline, 'Fix titles, now');
  assert.deepEqual(ok!.top_three.map((t) => t.id), ['a']);
  assert.equal(validateAiResult({ nonsense: true }, new Set(['a'])), null);
  assert.ok(estimateMaxCost(40_000) < 0.5, 'worst case for one weekly call stays well under the default $5 budget');
});

/* ── exports and sitemaps ── */
test('Search Console export: www and apex rows merge with weighted position', () => {
  const sm = parseSitemap('<urlset><url><loc>https://www.auto-cleanse.co.uk/dpf-cleaning</loc><lastmod>2026-01-05</lastmod></url></urlset>', 'sitemap.xml', 'www.auto-cleanse.co.uk');
  const d = readExport({
    chart: 'Date,Clicks,Impressions,CTR,Position\n2026-09-01,1,100,1%,5\n2026-09-02,2,100,2%,6\n',
    pages: '\uFEFFTop pages,Clicks,Impressions,CTR,Position\nhttps://www.auto-cleanse.co.uk/dpf-cleaning,10,300,3.3%,4\nhttps://auto-cleanse.co.uk/dpf-cleaning,0,100,0%,8\n',
  }, 'www.auto-cleanse.co.uk', sm.map((p) => ({ ...p, group: 'dpf-hub' })));
  const p = d.pages.find((x) => x.path === '/dpf-cleaning')!;
  assert.equal(p.impressions, 400);
  assert.equal(p.otherHostImpressions, 100);
  assert.equal(p.position, 5);
  assert.equal(d.window.days, 2);
});

console.log(`\n${passed} passed, ${failures.length} failed${failures.length ? `: ${failures.join('; ')}` : ''}`);
process.exit(failures.length ? 1 : 0);
