// The analysis rules. Each one reads per-page totals for a window and returns
// findings with the evidence behind them. Rules are deterministic: same data,
// same findings. AI is only used later, to write up the best few.
//
// Guards that apply everywhere:
//  - A finding needs a significance test AND a minimum size; small samples and
//    normal daily movement never become recommendations.
//  - Pages that changed recently, or are part of a running experiment, are left
//    alone until the change has had time to show its effect.
//  - Near-identical pages are rolled up into one group finding.
//  - Facts (measured) and hypotheses (possible explanations) are kept apart.

import { classifyPath, isBrandQuery, queryService } from './classify.js';
import { addDays, daysBetween, rangeLabel } from './dates.js';
import { groupDef, type SiteConfig } from './site-config.js';
import { binomialLowerP, median, pct, poissonCdf, round, twoProportion } from './stats.js';
import type { AnalysisWindow, EvidenceItem, Experiment, Finding, PageWindow, QueryRow } from './types.js';

export interface AnalysisInput {
  config: SiteConfig;
  window: AnalysisWindow;
  pages: PageWindow[];
  queries: QueryRow[];
  prevQueries: QueryRow[];
  experiments: Experiment[];
  dataSource: 'api' | 'export';
  /** which sources have data in this window */
  sources: { gsc: boolean; prevGsc: boolean; queryPages: boolean; ga4: boolean; clarity: boolean; conversions: boolean };
  /** HTTP status of URLs outside the sitemap, when the collector checked them */
  urlStatus?: Record<string, number>;
  /**
   * Impressions per page over a longer window (90 days). Whether a page is shown
   * in Google at all is judged on this: a page seen a few times a quarter is not
   * "never shown" just because one 28-day window missed it.
   */
  longWindow?: { from: string; to: string; days: number; label: string; impressions: Map<string, number> };
}

/** Scales a 28-day threshold to the window length. */
const scale = (n28: number, days: number) => Math.round((n28 * days) / 28);
const perMonth = (x: number, days: number) => (x * 30) / days;
const fmt = (n: number) => Math.round(n).toLocaleString('en-GB');
// Effort divides value, but gently: the most valuable work should not lose to the easiest.
const EFFORT_FACTOR = { small: 1, medium: 1.5, large: 2.5 } as const;

/* ── Search Console CTR curve ─────────────────────────────────────────────── */

const BUCKETS = [1, 2, 3, 4, 5.5, 7, 8.5, 10.5, 13, 16, 20, 30, Infinity];
const bucketOf = (pos: number) => BUCKETS.findIndex((edge, i) => pos >= (BUCKETS[i - 1] ?? 0) && pos < edge);
/** pages whose clicks are mostly brand searches; they would distort the curve */
const BRAND_PAGES = new Set(['/', '/about', '/contact', '/reviews']);

export interface CtrCurve {
  clicks: number[];
  impressions: number[];
  /** expected CTR at a position, leaving one page's own numbers out */
  expected: (pos: number, exclude?: { clicks: number; impressions: number }) => number | null;
  label: (pos: number) => string;
}

export function buildCtrCurve(pages: PageWindow[]): CtrCurve {
  const clicks = BUCKETS.map(() => 0);
  const impressions = BUCKETS.map(() => 0);
  for (const p of pages) {
    if (BRAND_PAGES.has(p.path) || p.position == null || p.impressions < 20) continue;
    const b = bucketOf(p.position);
    if (b < 0) continue;
    clicks[b] += p.clicks;
    impressions[b] += p.impressions;
  }
  const expected = (pos: number, exclude?: { clicks: number; impressions: number }) => {
    const b = bucketOf(pos);
    if (b < 0) return null;
    // Widen to neighbouring buckets until there are 1,500 impressions to judge by.
    let c = clicks[b] - (exclude?.clicks ?? 0);
    let i = impressions[b] - (exclude?.impressions ?? 0);
    for (let w = 1; i < 1500 && w < 3; w++) {
      for (const nb of [b - w, b + w]) {
        if (nb >= 0 && nb < BUCKETS.length) { c += clicks[nb]; i += impressions[nb]; }
      }
    }
    return i >= 1500 ? c / i : null;
  };
  const label = (pos: number) => {
    const b = bucketOf(pos);
    const lo = BUCKETS[b - 1] ?? 1;
    const hi = BUCKETS[b];
    return hi === Infinity ? `${lo}+` : `${lo}-${round(hi - 0.1, 1)}`;
  };
  return { clicks, impressions, expected, label };
}

/* ── Suppression: recent changes and running experiments ──────────────────── */

interface Hold { path: string; reason: string }

/**
 * Two kinds of hold. An experiment hold keeps every rule off the pages under
 * test. A change hold (the page's text changed during or after the window, so
 * the numbers partly describe the old version) only applies to the rules whose
 * metric a text change moves straight away: CTR (titles and descriptions) and
 * on-page behaviour. Ranking and indexing findings still report such pages,
 * with the change date as a fact.
 */
interface Holds { experiment: Map<string, Hold>; changed: Map<string, Hold>; all: Map<string, Hold> }

function holdsFor(input: AnalysisInput): Holds {
  const experiment = new Map<string, Hold>();
  const changed = new Map<string, Hold>();
  const { window } = input;
  for (const e of input.experiments) {
    if (!['planned', 'running'].includes(e.outcome)) continue;
    const due = e.measure_to ?? (e.implemented_on ? addDays(e.implemented_on, 42) : null);
    const reason = `part of the experiment "${e.title}"${due ? `, results due ${due}` : ''}`;
    for (const p of e.pages) experiment.set(p, { path: p, reason });
    if (e.page_groups.length) {
      for (const pg of input.pages) if (e.page_groups.includes(pg.group)) experiment.set(pg.path, { path: pg.path, reason });
    }
  }
  // Wait for 5 weeks of data on the new version (Google re-crawls + a 28-day read).
  for (const p of input.pages) {
    if (experiment.has(p.path) || !p.contentChangedOn) continue;
    if (p.contentChangedOn > addDays(window.from, 7)) {
      const ready = addDays(p.contentChangedOn, 35);
      changed.set(p.path, { path: p.path, reason: `its text changed on ${p.contentChangedOn}; judge it again from ${ready}` });
    }
  }
  return { experiment, changed, all: new Map([...changed, ...experiment]) };
}

/* ── Rule helpers ─────────────────────────────────────────────────────────── */

function confidenceFrom(p: number, sample: number, exportData: boolean): { confidence: 'low' | 'medium' | 'high'; score: number } {
  let score = p < 0.0001 ? 0.85 : p < 0.001 ? 0.75 : p < 0.01 ? 0.62 : 0.45;
  if (sample < 500) score -= 0.1;
  if (exportData) score -= 0.05; // export totals are coarser than daily API data
  score = Math.max(0.2, Math.min(0.95, score));
  return { confidence: score >= 0.72 ? 'high' : score >= 0.5 ? 'medium' : 'low', score: round(score, 3) };
}

function priority(f: Pick<Finding, 'valueScore' | 'confidenceScore' | 'effort'>): number {
  return round((f.valueScore * f.confidenceScore) / EFFORT_FACTOR[f.effort], 2);
}

function list(paths: string[], n = 6): string {
  const shown = paths.slice(0, n).join(', ');
  return paths.length > n ? `${shown} and ${paths.length - n} more` : shown;
}

/** A fact line naming pages whose text changed during or after the window. */
function changedNote(paths: string[], holdSet: Holds): string[] {
  const hit = paths.filter((p) => holdSet.changed.has(p));
  if (!hit.length) return [];
  const dates = [...new Set(hit.map((p) => holdSet.changed.get(p)!.reason.match(/on (\d{4}-\d{2}-\d{2})/)?.[1]).filter(Boolean))].sort();
  return [`${hit.length} of these pages changed since the start of this data (${dates.join(', ')}); check the change before acting, and re-read their positions from ${addDays(dates[dates.length - 1] as string, 35)}.`];
}

/* ── Rules ────────────────────────────────────────────────────────────────── */

interface CtrRow { page: PageWindow; expectedClicks: number; gap: number; p: number; expCtr: number }

function ruleCtr(input: AnalysisInput, curve: CtrCurve, holdSet: Holds): Finding[] {
  const holds = holdSet.all;
  const { window: w, config } = input;
  const minImpr = scale(150, w.days);
  const flagged: CtrRow[] = [];
  const held: CtrRow[] = [];
  for (const page of input.pages) {
    if (BRAND_PAGES.has(page.path) || page.position == null || page.position > 15 || page.impressions < minImpr) continue;
    const expCtr = curve.expected(page.position, page);
    if (expCtr == null) continue;
    const expectedClicks = page.impressions * expCtr;
    const gap = expectedClicks - page.clicks;
    if (gap < Math.max(5, 0.3 * expectedClicks)) continue;
    const p = poissonCdf(page.clicks, expectedClicks);
    if (p >= 0.005) continue;
    (holds.has(page.path) ? held : flagged).push({ page, expectedClicks, gap, p, expCtr });
  }

  const byGroup = new Map<string, CtrRow[]>();
  for (const r of flagged) byGroup.set(r.page.group, [...(byGroup.get(r.page.group) ?? []), r]);
  const heldByGroup = new Map<string, CtrRow[]>();
  for (const r of held) heldByGroup.set(r.page.group, [...(heldByGroup.get(r.page.group) ?? []), r]);

  const out: Finding[] = [];
  for (const [group, rows] of byGroup) {
    const g = groupDef(config, group);
    rows.sort((a, b) => b.gap - a.gap);
    const clicks = rows.reduce((s, r) => s + r.page.clicks, 0);
    const impressions = rows.reduce((s, r) => s + r.page.impressions, 0);
    const expected = rows.reduce((s, r) => s + r.expectedClicks, 0);
    const gapMonth = perMonth(expected - clicks, w.days);
    const pPool = poissonCdf(clicks, expected);
    const conf = confidenceFrom(pPool, impressions, input.dataSource === 'export');
    const heldRows = heldByGroup.get(group) ?? [];
    const asGroup = rows.length >= 3;
    const targets = asGroup ? [rows] : rows.map((r) => [r]);
    for (const set of targets) {
      const one = set.length === 1 ? set[0] : null;
      const sClicks = set.reduce((s, r) => s + r.page.clicks, 0);
      const sImpr = set.reduce((s, r) => s + r.page.impressions, 0);
      const sExp = set.reduce((s, r) => s + r.expectedClicks, 0);
      const sGapMonth = asGroup ? gapMonth : perMonth(sExp - sClicks, w.days);
      const c = asGroup ? conf : confidenceFrom(one!.p, sImpr, input.dataSource === 'export');
      const evidence: EvidenceItem[] = [
        { label: 'Impressions', value: fmt(sImpr), period: w.label, source: 'Search Console' },
        { label: 'Clicks', value: fmt(sClicks), period: w.label, source: 'Search Console' },
        { label: 'CTR', value: pct(sClicks / sImpr, 2), period: w.label, source: 'Search Console' },
        { label: 'Expected clicks at these positions', value: fmt(sExp), period: w.label, source: 'Engine' },
      ];
      if (one) evidence.splice(3, 0, { label: 'Average position', value: String(round(one.page.position!, 1)), period: w.label, source: 'Search Console' });
      const facts = set.slice(0, 8).map((r) =>
        `${r.page.path}: ${fmt(r.page.impressions)} impressions at average position ${round(r.page.position!, 1)}, ${fmt(r.page.clicks)} clicks (${pct(r.page.clicks / r.page.impressions, 2)} CTR) where this site's pages at that position average ${pct(r.expCtr, 2)}.`);
      if (asGroup && heldRows.length) {
        facts.push(`${heldRows.length} more ${g.label.toLowerCase()} show the same pattern but are left out: ${heldRows.map((r) => holds.get(r.page.path)!.reason)[0]}.`);
      }
      const title = one
        ? `${one.page.path}: few clicks for its Google position`
        : `${g.label}: ${set.length} pages get fewer clicks than their Google positions should bring`;
      const finding: Finding = {
        dedupeKey: one ? `ctr_gap:page:${one.page.path}` : `ctr_gap:group:${group}`,
        kind: 'opportunity',
        rule: 'ctr_gap',
        category: 'seo',
        scopeType: one ? 'page' : 'group',
        scopeKey: one ? one.page.path : group,
        pages: set.map((r) => r.page.path),
        title,
        problem: one
          ? `Shown ${fmt(sImpr)} times in Google (${w.label}) at an average position of ${round(one.page.position!, 1)}, but clicked ${fmt(sClicks)} times. At that position this site's other pages convert ${pct(one.expCtr, 2)} of impressions into clicks; this page converts ${pct(sClicks / sImpr, 2)}.`
          : `${set.length} ${g.label.toLowerCase()} were shown ${fmt(sImpr)} times (${w.label}) and clicked ${fmt(sClicks)} times. At their positions this site's other pages would have earned about ${fmt(sExp)} clicks.`,
        evidence,
        facts,
        hypotheses: [
          'The title and description shown in Google may not match what searchers want (price, location, the specific fault or vehicle).',
          'Google may be showing a rewritten title or a snippet from elsewhere on the page.',
          'Average position mixes many searches: the page may rank well for rarely clicked searches and poorly for the main one.',
          'Results above may include ads, a map pack or rich results that take the clicks.',
        ],
        proposal: one
          ? `Rewrite the title tag and meta description of ${one.page.path} to answer the main searches directly (check its top queries in Search Console first), keeping the URL and on-page content as they are. Record the old title and description so the change can be reverted.`
          : `Rewrite the title template for ${g.label.toLowerCase()} to lead with what searchers look for, then apply it to half of the pages and keep the other half as a control, so the effect can be measured against unchanged pages. Record the old titles so the change can be reverted.`,
        benefit: `Closing the gap to this site's own average CTR would bring about ${fmt(sGapMonth)} extra Google clicks a month to ${one ? 'this page' : 'these pages'} (estimate: the measured gap, scaled to a month).`,
        effort: 'small',
        confidence: c.confidence,
        confidenceScore: c.score,
        estExtraClicksMonth: round(sGapMonth, 1),
        valueScore: round(sGapMonth * g.weight, 2),
        measurementDays: 28,
        successMetric: 'CTR adjusted for position (actual clicks / clicks expected at the same positions) on the changed pages, 28 days after Google has re-crawled them, compared with the 28 days before and with unchanged control pages.',
        dataSource: input.dataSource,
      };
      out.push(finding);
    }
  }
  return out;
}

function rulePageTwo(input: AnalysisInput, holdSet: Holds): Finding[] {
  const holds = holdSet.experiment;
  const { window: w, config } = input;
  const minImpr = scale(100, w.days);
  const rows = input.pages.filter((p) =>
    groupDef(config, p.group).commercial && !holds.has(p.path) && !BRAND_PAGES.has(p.path) && p.position != null &&
    p.position >= 8.5 && p.position <= 20 && p.impressions >= minImpr && p.group !== 'booking');
  const byGroup = new Map<string, PageWindow[]>();
  for (const p of rows) byGroup.set(p.group, [...(byGroup.get(p.group) ?? []), p]);
  const out: Finding[] = [];
  for (const [group, pages] of byGroup) {
    const g = groupDef(config, group);
    pages.sort((a, b) => b.impressions - a.impressions);
    const sets = pages.length >= 3 ? [pages] : pages.map((p) => [p]);
    for (const set of sets) {
      const one = set.length === 1 ? set[0] : null;
      const impr = set.reduce((s, p) => s + p.impressions, 0);
      const clicks = set.reduce((s, p) => s + p.clicks, 0);
      // How many clicks page one would bring cannot be read from this site's data (its CTR by
      // position is a blend of very different searches), so no click figure is claimed: the size
      // of the opportunity is the demand already being shown, ranked by impressions.
      const imprMonth = perMonth(impr, w.days);
      if (imprMonth < 60) continue;
      // Being on page two is measured, not inferred; what is uncertain is whether work moves it.
      const score = round(Math.min(0.6, 0.35 + Math.log10(impr) * 0.05) - (input.dataSource === 'export' ? 0.05 : 0), 3);
      out.push({
        dedupeKey: one ? `page_two:page:${one.path}` : `page_two:group:${group}`,
        kind: 'opportunity',
        rule: 'page_two',
        category: 'seo',
        scopeType: one ? 'page' : 'group',
        scopeKey: one ? one.path : group,
        pages: set.map((p) => p.path),
        title: one ? `${one.path} sits just off page one of Google` : `${g.label}: ${set.length} pages sit just off page one of Google`,
        problem: one
          ? `${fmt(one.impressions)} impressions (${w.label}) at an average position of ${round(one.position!, 1)}: mostly on page two, where few people click.`
          : `${set.length} ${g.label.toLowerCase()} average positions 8.5-20 with ${fmt(impr)} impressions between them (${w.label}).`,
        evidence: [
          { label: 'Impressions', value: fmt(impr), period: w.label, source: 'Search Console' },
          { label: 'Clicks', value: fmt(clicks), period: w.label, source: 'Search Console' },
          { label: 'Impressions a month', value: fmt(imprMonth), period: w.label, source: 'Search Console' },
        ],
        facts: [
          ...set.slice(0, 8).map((p) => `${p.path}: position ${round(p.position!, 1)}, ${fmt(p.impressions)} impressions, ${fmt(p.clicks)} clicks.`),
          ...changedNote(set.map((p) => p.path), holdSet),
        ],
        hypotheses: [
          'The page may be thinner or less specific than the pages ranking above it for the main searches.',
          'Few internal links may point to it from stronger pages (home, service hubs, related posts).',
          'For "near me" and town searches, Google Business Profile strength (reviews, photos, distance) can matter more than the page.',
        ],
        proposal: one
          ? `Strengthen ${one.path} for its main searches: add genuinely useful detail the top results cover (real job notes, process, prices already published, FAQs from real calls), and link to it from the most relevant hub and articles. Do not change the URL.`
          : `Pick the 3 ${g.label.toLowerCase()} with the most impressions, deepen them with subject-specific content and internal links, and compare their positions after 6 weeks with the rest of the group as a control.`,
        benefit: `These pages are already shown about ${fmt(imprMonth)} times a month, mostly on page two where few people click. Moving onto page one usually brings several times the clicks, but no reliable figure can be given until positions move.`,
        effort: 'medium',
        confidence: score >= 0.5 ? 'medium' : 'low',
        confidenceScore: score,
        estExtraClicksMonth: null,
        valueScore: round(imprMonth * 0.02 * g.weight, 2),
        measurementDays: 42,
        successMetric: 'Average position and clicks of the improved pages over 42 days, against unchanged pages in the same group.',
        dataSource: input.dataSource,
      });
    }
  }
  return out;
}

function ruleDrops(input: AnalysisInput, holdSet: Holds): Finding[] {
  const holds = holdSet.all;
  if (!input.sources.prevGsc) return [];
  const { window: w, config } = input;
  const byGroup = new Map<string, { cur: number; prev: number; clicks: number; prevClicks: number; posW: number; prevPosW: number; pages: PageWindow[] }>();
  for (const p of input.pages) {
    if (p.prevImpressions == null) continue;
    const g = byGroup.get(p.group) ?? { cur: 0, prev: 0, clicks: 0, prevClicks: 0, posW: 0, prevPosW: 0, pages: [] };
    g.cur += p.impressions; g.prev += p.prevImpressions;
    g.clicks += p.clicks; g.prevClicks += p.prevClicks ?? 0;
    g.posW += (p.position ?? 0) * p.impressions; g.prevPosW += (p.prevPosition ?? 0) * p.prevImpressions;
    g.pages.push(p);
    byGroup.set(p.group, g);
  }
  const out: Finding[] = [];
  for (const [group, g] of byGroup) {
    const def = groupDef(config, group);
    if (!def.commercial || g.prevClicks < scale(20, w.days)) continue;
    const ratio = g.clicks / g.prevClicks;
    const p = poissonCdf(g.clicks, g.prevClicks);
    if (ratio > 0.7 || p >= 0.001) continue;
    const pos = g.cur ? g.posW / g.cur : null;
    const prevPos = g.prev ? g.prevPosW / g.prev : null;
    const posWorse = pos != null && prevPos != null && pos - prevPos >= 1.5;
    const imprDown = g.prev > 0 && g.cur / g.prev < 0.75;
    const losers = g.pages
      .filter((x) => (x.prevClicks ?? 0) - x.clicks >= 3)
      .sort((a, b) => ((b.prevClicks ?? 0) - b.clicks) - ((a.prevClicks ?? 0) - a.clicks));
    const changed = losers.filter((x) => holds.has(x.path));
    const conf = confidenceFrom(p, g.prev, input.dataSource === 'export');
    out.push({
      dedupeKey: `visibility_drop:group:${group}`,
      kind: 'alert',
      rule: 'visibility_drop',
      category: 'seo',
      scopeType: 'group',
      scopeKey: group,
      pages: losers.map((x) => x.path).slice(0, 50),
      title: `${def.label}: Google clicks down ${Math.round((1 - ratio) * 100)}%`,
      problem: `${fmt(g.clicks)} Google clicks in ${w.label} against ${fmt(g.prevClicks)} in the 28 days before (${rangeLabel(w.prevFrom, w.prevTo)}).`,
      evidence: [
        { label: 'Clicks now / before', value: `${fmt(g.clicks)} / ${fmt(g.prevClicks)}`, period: w.label, source: 'Search Console' },
        { label: 'Impressions now / before', value: `${fmt(g.cur)} / ${fmt(g.prev)}`, period: w.label, source: 'Search Console' },
        { label: 'Average position now / before', value: `${pos ? round(pos, 1) : '-'} / ${prevPos ? round(prevPos, 1) : '-'}`, period: w.label, source: 'Search Console' },
      ],
      facts: losers.slice(0, 8).map((x) => `${x.path}: ${fmt(x.clicks)} clicks, was ${fmt(x.prevClicks ?? 0)}; position ${x.position ? round(x.position, 1) : '-'}, was ${x.prevPosition ? round(x.prevPosition, 1) : '-'}.`),
      hypotheses: [
        posWorse ? 'Positions fell, so this looks like lost rankings (a competitor, a Google update, or a change to these pages).' : 'Positions held, so fewer people searched, or searches shifted to terms these pages do not rank for (season, weather, news).',
        imprDown ? 'Impressions fell too: less search demand or lost rankings rather than a snippet problem.' : 'Impressions held but clicks fell: check how the result looks in Google (title rewrites, new ads or map pack above).',
        ...(changed.length ? [`${changed.length} of the pages that lost most were changed recently (${changed.slice(0, 3).map((x) => x.path).join(', ')}).`] : []),
      ],
      proposal: `Check the top losing pages in Search Console (Performance, compare date ranges, Queries tab) to see which searches dropped. If positions fell, review what changed on those pages and what now ranks above. If demand fell, compare with the same weeks last year before acting.`,
      benefit: `Recovering to the previous level would be worth about ${fmt(perMonth(g.prevClicks - g.clicks, w.days))} clicks a month.`,
      effort: 'small',
      confidence: conf.confidence,
      confidenceScore: conf.score,
      estExtraClicksMonth: round(perMonth(g.prevClicks - g.clicks, w.days), 1),
      valueScore: round(perMonth(g.prevClicks - g.clicks, w.days) * def.weight, 2),
      measurementDays: 28,
      successMetric: 'Clicks and impressions for the group over the next 28 days against the 28 days before the drop.',
      dataSource: input.dataSource,
    });
  }
  return out;
}

function ruleNoImpressions(input: AnalysisInput): Finding[] {
  const { config } = input;
  const long = input.longWindow;
  const w = long ? { ...input.window, from: long.from, to: long.to, days: long.days, label: long.label } : input.window;
  const impressionsOf = (p: PageWindow) => (long ? long.impressions.get(p.path) ?? 0 : p.impressions);
  if (w.days < 28) return [];
  const byGroup = new Map<string, { zero: PageWindow[]; eligible: number; tooNew: number }>();
  for (const p of input.pages) {
    if (!p.inSitemap) continue;
    const def = groupDef(config, p.group);
    if (!def.commercial) continue;
    const g = byGroup.get(p.group) ?? { zero: [], eligible: 0, tooNew: 0 };
    // For page sets whose sitemap date is their launch date, only judge pages that existed for the whole window.
    // Elsewhere a recent date means an edit to an established page, which does not make it new.
    const launched = config.launchDatedGroups.includes(p.group) || /\/areas$/.test(p.path) ? p.contentChangedOn : null;
    if (launched && launched > w.from) { g.tooNew++; byGroup.set(p.group, g); continue; }
    g.eligible++;
    if (impressionsOf(p) === 0) g.zero.push(p);
    byGroup.set(p.group, g);
  }
  const out: Finding[] = [];
  for (const [group, g] of byGroup) {
    if (g.zero.length < 3 && !(g.zero.length && ['dpf-hub', 'ecu-hub', 'adblue-hub', 'booking'].includes(group))) continue;
    const def = groupDef(config, group);
    const share = g.zero.length / Math.max(1, g.eligible);
    const zeroPaths = g.zero.map((p) => p.path).sort();
    out.push({
      dedupeKey: `no_impressions:group:${group}`,
      kind: 'opportunity',
      rule: 'no_impressions',
      category: 'technical',
      scopeType: 'group',
      scopeKey: group,
      pages: zeroPaths.slice(0, 50),
      title: `${def.label}: ${g.zero.length} of ${g.eligible} pages had no Google impressions`,
      problem: `${g.zero.length} ${def.label.toLowerCase()} in the sitemap were not shown in Google once in ${w.label} (${pct(share, 0)} of those old enough to judge).`,
      evidence: [
        { label: 'Pages with no impressions', value: `${g.zero.length} of ${g.eligible}`, period: w.label, source: 'Search Console' },
        { label: 'Too new to judge', value: String(g.tooNew), source: 'Sitemap' },
      ],
      facts: [`No impressions: ${list(zeroPaths, 10)}.`],
      hypotheses: [
        'Google may not have indexed them (check Pages > "Crawled - currently not indexed" or URL Inspection in Search Console).',
        'They may be too similar to other pages in the group to be worth indexing separately.',
        'They may target places or vehicles with very little search demand, so there is nothing to show.',
      ],
      proposal: `Inspect 5 of these URLs in Search Console. If they are "crawled - not indexed", add genuinely local or vehicle-specific detail and internal links before adding any more pages of this kind; if they are indexed but unseen, the demand is low and they need no work.`,
      benefit: 'Tells you whether this page type is worth extending. Each page that starts appearing adds impressions, but no click figure can be estimated for pages Google is not showing.',
      effort: 'small',
      confidence: 'high',
      confidenceScore: 0.8,
      estExtraClicksMonth: null,
      valueScore: round(Math.min(40, g.zero.length) * def.weight * 0.3, 2),
      measurementDays: 56,
      successMetric: 'Share of the group\'s pages with at least one impression in a 28-day window.',
      dataSource: input.dataSource,
    });
  }
  return out;
}

function ruleQueryDemand(input: AnalysisInput): Finding[] {
  const { window: w, config } = input;
  const minImpr = scale(40, w.days);
  // Combine query rows across pages (export data has no page).
  const byQuery = new Map<string, { clicks: number; impressions: number; posW: number; paths: Set<string> }>();
  for (const q of input.queries) {
    if (isBrandQuery(q.query)) continue;
    const r = byQuery.get(q.query) ?? { clicks: 0, impressions: 0, posW: 0, paths: new Set<string>() };
    r.clicks += q.clicks; r.impressions += q.impressions; r.posW += q.position * q.impressions;
    if (q.path) r.paths.add(q.path);
    byQuery.set(q.query, r);
  }
  const sitePaths = new Set(input.pages.map((p) => p.path));
  const out: Finding[] = [];
  for (const service of ['dpf', 'ecu', 'adblue'] as const) {
    const rows = [...byQuery.entries()]
      .map(([query, r]) => ({ query, ...r, position: r.impressions ? r.posW / r.impressions : 99 }))
      .filter((r) => queryService(r.query) === service && r.impressions >= minImpr && r.position > 10)
      .sort((a, b) => b.impressions - a.impressions);
    if (rows.length < 3) continue;
    const impr = rows.reduce((s, r) => s + r.impressions, 0);
    const nearMe = rows.filter((r) => /near me|nearby|local/.test(r.query));
    // Searches whose words match an existing page's address: that page is the one to strengthen.
    const matches = rows
      .map((r) => {
        const slugGuess = r.query.replace(/\b(dpf|cleaning|clean|remap|remapping|ecu|adblue|repair|fault|near|me|in)\b/g, ' ').trim().replace(/\s+/g, '-');
        const token = { dpf: 'dpf', ecu: 'remap', adblue: 'adblue' }[service];
        const hit = slugGuess.length > 3 ? [...sitePaths].find((p) => p.endsWith(slugGuess) && p.includes(token)) : undefined;
        return hit ? { query: r.query, path: hit } : null;
      })
      .filter((x): x is { query: string; path: string } => x !== null);
    const target = rows.slice(0, 10);
    const label = { dpf: 'DPF', ecu: 'remapping', adblue: 'AdBlue' }[service];
    const groupWeight = Math.max(...config.groups.filter((g) => g.service === service && g.commercial).map((g) => g.weight));
    out.push({
      dedupeKey: `query_demand:service:${service}`,
      kind: 'opportunity',
      rule: 'query_demand',
      category: 'seo',
      scopeType: 'query',
      scopeKey: service,
      pages: [...new Set(target.flatMap((r) => [...r.paths]))].slice(0, 20),
      title: `${rows.length} ${label} searches where the site is not on page one`,
      problem: `${rows.length} ${label} searches with real demand (${fmt(impr)} impressions between them, ${w.label}) where the site's average position is worse than 10.`,
      evidence: [
        { label: 'Searches', value: String(rows.length), period: w.label, source: 'Search Console' },
        { label: 'Impressions', value: fmt(impr), period: w.label, source: 'Search Console' },
        { label: '"Near me" searches among them', value: String(nearMe.length), period: w.label, source: 'Search Console' },
      ],
      facts: target.map((r) => `"${r.query}": ${fmt(r.impressions)} impressions, position ${round(r.position, 1)}, ${fmt(r.clicks)} clicks${r.paths.size ? ` (ranking page: ${[...r.paths][0]})` : ''}.`),
      hypotheses: [
        ...(nearMe.length ? ['"Near me" results are driven mostly by the Google Business Profile (distance, reviews, photos), not by page content.'] : []),
        ...(matches.length ? [`${matches.length} of these match an existing page (${matches.slice(0, 3).map((m) => `"${m.query}" and ${m.path}`).join('; ')}), so strengthening that page may beat adding a new one.`] : []),
        'Some searches may be national, where a Devon workshop is not the most relevant result.',
      ],
      proposal: nearMe.length
        ? `Treat the "near me" searches as Google Business Profile work (regular photos, posts, asking every happy customer for a review). For the other searches, check which page ranks and whether it answers the search; strengthen that page rather than adding a new one.`
        : `For each of the top searches, check which page ranks and whether it answers the search; strengthen that page (content, internal links) rather than adding a new one.`,
      benefit: `These searches had ${fmt(perMonth(impr, w.days))} impressions a month. Reaching page one for a few of them would add clicks, but no reliable click figure can be given until positions move.`,
      effort: nearMe.length ? 'large' : 'medium',
      confidence: 'medium',
      confidenceScore: input.dataSource === 'export' ? 0.5 : 0.55,
      estExtraClicksMonth: null,
      valueScore: round(Math.min(perMonth(impr, w.days) * 0.02, 60) * groupWeight, 2),
      measurementDays: 56,
      successMetric: 'Average position and clicks for these searches over 8 weeks.',
      dataSource: input.dataSource,
    });
  }
  return out;
}

function ruleCannibalisation(input: AnalysisInput, holdSet: Holds): Finding[] {
  const holds = holdSet.experiment;
  if (!input.sources.queryPages) return [];
  const { window: w } = input;
  const byQuery = new Map<string, QueryRow[]>();
  for (const q of input.queries) if (q.path && !isBrandQuery(q.query)) byQuery.set(q.query, [...(byQuery.get(q.query) ?? []), q]);
  const pairs = new Map<string, { a: string; b: string; queries: { q: string; a: QueryRow; b: QueryRow }[]; impr: number }>();
  for (const [query, rows] of byQuery) {
    const total = rows.reduce((s, r) => s + r.impressions, 0);
    if (total < scale(60, w.days)) continue;
    const strong = rows.filter((r) => r.impressions >= Math.max(15, total * 0.2)).sort((x, y) => y.impressions - x.impressions);
    if (strong.length < 2) continue;
    const [a, b] = strong;
    if (holds.has(a.path) && holds.has(b.path)) continue;
    // The home page ranks for broad searches by design; sharing one with a service page is not a problem to fix.
    if (BRAND_PAGES.has(a.path) || BRAND_PAGES.has(b.path)) continue;
    const key = [a.path, b.path].sort().join('|');
    const pr = pairs.get(key) ?? { a: a.path, b: b.path, queries: [], impr: 0 };
    pr.queries.push({ q: query, a, b });
    pr.impr += total;
    pairs.set(key, pr);
  }
  return [...pairs.values()]
    .filter((p) => p.queries.length >= 2 || p.impr >= scale(400, w.days))
    .sort((x, y) => y.impr - x.impr)
    .slice(0, 5)
    .map((pr) => {
      const ga = classifyPath(pr.a).group;
      const weight = groupDef(input.config, ga).weight;
      return {
        dedupeKey: `cannibalisation:pair:${[pr.a, pr.b].sort().join('|')}`,
        kind: 'opportunity',
        rule: 'cannibalisation',
        category: 'seo',
        scopeType: 'page',
        scopeKey: pr.a,
        pages: [pr.a, pr.b],
        title: `${pr.a} and ${pr.b} compete for the same searches`,
        problem: `Google splits ${pr.queries.length} search${pr.queries.length === 1 ? '' : 'es'} (${fmt(pr.impr)} impressions, ${w.label}) between these two pages, so neither ranks as well as one clear page might.`,
        evidence: [
          { label: 'Shared searches', value: String(pr.queries.length), period: w.label, source: 'Search Console' },
          { label: 'Impressions on those searches', value: fmt(pr.impr), period: w.label, source: 'Search Console' },
        ],
        facts: pr.queries.slice(0, 6).map((x) => `"${x.q}": ${x.a.path} position ${round(x.a.position, 1)} (${fmt(x.a.impressions)} impr.), ${x.b.path} position ${round(x.b.position, 1)} (${fmt(x.b.impressions)} impr.).`),
        hypotheses: [
          'Both pages target the same intent with similar titles or headings.',
          'Internal links do not make clear which page is the main one for these searches.',
        ],
        proposal: `Decide which page should own these searches. Make the other page clearly about something different (its own title and heading) and link from it to the main page with descriptive anchor text. Do not merge or redirect without checking each page's own traffic first.`,
        benefit: 'Consolidating ranking signals usually lifts the stronger page; the size of the gain cannot be estimated reliably in advance.',
        effort: 'small',
        confidence: 'medium',
        confidenceScore: 0.55,
        estExtraClicksMonth: null,
        valueScore: round(Math.min(perMonth(pr.impr, w.days) * 0.02, 40) * weight, 2),
        measurementDays: 42,
        successMetric: 'Position of the chosen page for the shared searches, and its clicks, over 6 weeks.',
        dataSource: input.dataSource,
      } satisfies Finding;
    });
}

function ruleTechnical(input: AnalysisInput): Finding[] {
  const { window: w } = input;
  const out: Finding[] = [];
  const otherHost = input.pages.reduce((s, p) => s + p.otherHostImpressions, 0);
  if (otherHost >= scale(200, w.days)) {
    const top = input.pages.filter((p) => p.otherHostImpressions > 0).sort((a, b) => b.otherHostImpressions - a.otherHostImpressions);
    out.push({
      dedupeKey: 'non_canonical_host:site',
      kind: 'opportunity',
      rule: 'non_canonical_host',
      category: 'technical',
      scopeType: 'site',
      scopeKey: 'site',
      pages: top.map((p) => p.path).slice(0, 20),
      title: 'Google still shows the old non-www address',
      problem: `${fmt(otherHost)} impressions (${w.label}) were for URLs on a host other than ${input.config.canonicalHost}, mostly the bare domain. Those impressions split the page's signals between two addresses.`,
      evidence: [{ label: 'Impressions on other hosts', value: fmt(otherHost), period: w.label, source: 'Search Console' }],
      facts: top.slice(0, 6).map((p) => `${p.path}: ${fmt(p.otherHostImpressions)} impressions on the other host.`),
      hypotheses: [
        'Google has not yet re-processed the redirects to the www address for every URL.',
        'The bare domain answers with a 308 from the hosting provider\'s domain setting rather than the site\'s own 301.',
      ],
      proposal: 'Confirm the bare domain returns a single 301 to the www URL for each of these pages, then submit the www sitemap again. This needs no content change; just watch the other-host impressions fall.',
      benefit: 'Consolidates ranking signals onto one address; the click gain cannot be estimated reliably.',
      effort: 'small',
      confidence: 'high',
      confidenceScore: 0.8,
      estExtraClicksMonth: null,
      valueScore: round(Math.min(perMonth(otherHost, w.days) * 0.003, 15), 2),
      measurementDays: 56,
      successMetric: 'Impressions on the non-www host per 28 days, falling towards zero.',
      dataSource: input.dataSource,
    });
  }
  const outside = input.pages
    .filter((p) => !p.inSitemap && p.impressions >= scale(30, w.days) && p.group !== 'utility')
    .sort((a, b) => b.impressions - a.impressions);
  const broken = outside.filter((p) => (input.urlStatus?.[p.path] ?? 0) >= 400);
  if (broken.length) {
    out.push({
      dedupeKey: 'dead_urls:site',
      kind: 'alert',
      rule: 'dead_urls',
      category: 'technical',
      scopeType: 'site',
      scopeKey: 'site',
      pages: broken.map((p) => p.path),
      title: `${broken.length} URLs that Google still shows now return an error`,
      problem: `These URLs had ${fmt(broken.reduce((s, p) => s + p.impressions, 0))} impressions (${w.label}) but return ${[...new Set(broken.map((p) => input.urlStatus![p.path]))].join('/')} today, so searchers land on an error page.`,
      evidence: broken.slice(0, 6).map((p) => ({ label: p.path, value: `${fmt(p.impressions)} impr., HTTP ${input.urlStatus![p.path]}`, period: w.label, source: 'Search Console' as const })),
      facts: broken.slice(0, 10).map((p) => `${p.path}: ${fmt(p.impressions)} impressions, ${fmt(p.clicks)} clicks, now HTTP ${input.urlStatus![p.path]}.`),
      hypotheses: ['The pages were removed or renamed without a redirect.'],
      proposal: 'Add a 301 redirect in vercel.json (statusCode 301, above the catch-all) from each URL to the closest live page.',
      benefit: `Keeps the ${fmt(perMonth(broken.reduce((s, p) => s + p.clicks, 0), w.days))} clicks a month these URLs still earn.`,
      effort: 'small',
      confidence: 'high',
      confidenceScore: 0.9,
      estExtraClicksMonth: round(perMonth(broken.reduce((s, p) => s + p.clicks, 0), w.days), 1),
      valueScore: round(perMonth(broken.reduce((s, p) => s + p.clicks, 0), w.days) + 10, 2),
      measurementDays: 28,
      successMetric: 'The URLs return 301, and their impressions move to the target pages.',
      dataSource: input.dataSource,
    });
  }
  return out;
}

/* ── Conversion and behaviour rules (need GA4 / Clarity / site conversions) ── */

const convOf = (p: PageWindow) => (p.leads ?? 0) + (p.phoneClicks ?? 0) + (p.whatsappClicks ?? 0) + (p.bookingStarts ?? 0);

function ruleConversion(input: AnalysisInput, holdSet: Holds): Finding[] {
  const holds = holdSet.all;
  if (!input.sources.ga4) return [];
  const { window: w, config } = input;
  const minSessions = scale(120, w.days);
  const out: Finding[] = [];
  const byGroup = new Map<string, PageWindow[]>();
  for (const p of input.pages) if ((p.sessions ?? 0) > 0) byGroup.set(p.group, [...(byGroup.get(p.group) ?? []), p]);
  for (const [group, pages] of byGroup) {
    const def = groupDef(config, group);
    if (!def.commercial) continue;
    const gSessions = pages.reduce((s, p) => s + (p.sessions ?? 0), 0);
    const gConv = pages.reduce((s, p) => s + convOf(p), 0);
    for (const p of pages) {
      const n = p.sessions ?? 0;
      if (n < minSessions || holds.has(p.path)) continue;
      const x = convOf(p);
      const restN = gSessions - n;
      const restX = gConv - x;
      if (restN < minSessions || restX < 10) continue;
      const rate = restX / restN;
      const expected = n * rate;
      if (expected - x < 3) continue;
      const pv = binomialLowerP(x, n, rate);
      if (pv >= 0.01) continue;
      const conf = confidenceFrom(pv, n, false);
      const missing = perMonth(expected - x, w.days);
      out.push({
        dedupeKey: `conversion_gap:page:${p.path}`,
        kind: 'opportunity',
        rule: 'conversion_gap',
        category: 'conversion',
        scopeType: 'page',
        scopeKey: p.path,
        pages: [p.path],
        title: `${p.path}: visitors contact you less often than on similar pages`,
        problem: `${fmt(n)} visits (${w.label}) produced ${x} recorded contacts (${pct(x / n, 1)}). Other ${def.label.toLowerCase()} produce ${pct(rate, 1)}.`,
        evidence: [
          { label: 'Sessions', value: fmt(n), period: w.label, source: 'GA4' },
          { label: 'Contacts (forms, call and WhatsApp taps, booking starts)', value: String(x), period: w.label, source: 'GA4' },
          { label: 'Rate on similar pages', value: pct(rate, 1), period: w.label, source: 'GA4' },
        ],
        facts: [
          `Forms ${p.leads ?? 0}, call taps ${p.phoneClicks ?? 0}, WhatsApp/text taps ${p.whatsappClicks ?? 0}, booking starts ${p.bookingStarts ?? 0}.`,
          'GA4 only counts visitors who accepted cookies; the comparison is like-for-like because the same applies to every page.',
          ...(p.clarity?.scrollDepth != null ? [`Clarity: visitors scroll ${round(p.clarity.scrollDepth, 0)}% of the page on average.`] : []),
        ],
        hypotheses: [
          'The call button or form may sit below where most visitors stop scrolling.',
          'The page may attract searches with weaker buying intent than its siblings.',
          'Price, location or "what happens next" may be less clear than on similar pages.',
        ],
        proposal: `Watch 10 Clarity recordings of mobile visits to ${p.path} and look at its scroll heatmap, then propose one change (e.g. a call button above the fold) as an experiment against the rest of the group.`,
        benefit: `Matching similar pages would mean about ${round(missing, 1)} more recorded contacts a month from this page.`,
        effort: 'medium',
        confidence: conf.confidence,
        confidenceScore: conf.score,
        estExtraClicksMonth: null,
        valueScore: round(missing * def.weight * 25, 2),
        measurementDays: 42,
        successMetric: 'Contacts per session on the page over 6 weeks, against unchanged pages in the same group.',
        dataSource: 'api',
      });
    }
    // Mobile against desktop, group level.
    const mob = pages.reduce((s, p) => s + (p.mobileSessions ?? 0), 0);
    const mobEng = pages.reduce((s, p) => s + (p.mobileEngaged ?? 0), 0);
    const desk = gSessions - mob;
    const deskEng = pages.reduce((s, p) => s + (p.engagedSessions ?? 0), 0) - mobEng;
    if (mob >= minSessions && desk >= scale(60, w.days)) {
      const t = twoProportion(mobEng, mob, deskEng, desk);
      if (t.z < 0 && t.p < 0.01 && deskEng / desk - mobEng / mob >= 0.1) {
        out.push({
          dedupeKey: `mobile_gap:group:${group}`,
          kind: 'opportunity',
          rule: 'mobile_gap',
          category: 'behaviour',
          scopeType: 'group',
          scopeKey: group,
          pages: pages.sort((a, b) => (b.mobileSessions ?? 0) - (a.mobileSessions ?? 0)).slice(0, 10).map((p) => p.path),
          title: `${def.label}: phone visitors engage less than desktop visitors`,
          problem: `${pct(mobEng / mob, 0)} of phone sessions were engaged against ${pct(deskEng / desk, 0)} on desktop (${w.label}).`,
          evidence: [
            { label: 'Phone sessions (engaged)', value: `${fmt(mob)} (${pct(mobEng / mob, 0)})`, period: w.label, source: 'GA4' },
            { label: 'Desktop sessions (engaged)', value: `${fmt(desk)} (${pct(deskEng / desk, 0)})`, period: w.label, source: 'GA4' },
          ],
          facts: ['GA4 counts a session as engaged after 10 seconds, a key event or 2 page views.'],
          hypotheses: ['Something on phones (layout, a popup, slow loading, the cookie card) may get in the way.', 'Phone searchers may want a phone number fast and leave after calling (check call taps before treating this as a problem).'],
          proposal: 'Check the group\'s top pages at 375px and in Clarity mobile recordings before changing anything.',
          benefit: 'Most visitors use phones, so a mobile fix applies to most traffic; the size cannot be estimated before the cause is known.',
          effort: 'medium',
          confidence: 'medium',
          confidenceScore: 0.6,
          estExtraClicksMonth: null,
          valueScore: round(def.weight * 20, 2),
          measurementDays: 28,
          successMetric: 'Engaged-session rate on phones for the group, 28 days after a change.',
          dataSource: 'api',
        });
      }
    }
  }
  return out;
}

function ruleClarity(input: AnalysisInput, holdSet: Holds): Finding[] {
  const holds = holdSet.all;
  if (!input.sources.clarity) return [];
  const { window: w, config } = input;
  const rows = input.pages.filter((p) => p.clarity && p.clarity.sessions >= 30);
  if (rows.length < 3) return [];
  const medDead = median(rows.map((p) => p.clarity!.deadClickPct ?? 0));
  const medRage = median(rows.map((p) => p.clarity!.rageClickPct ?? 0));
  const medQuick = median(rows.map((p) => p.clarity!.quickbackPct ?? 0));
  const out: Finding[] = [];
  for (const p of rows) {
    const c = p.clarity!;
    const def = groupDef(config, p.group);
    if (holds.has(p.path)) continue;
    const signals: string[] = [];
    if ((c.rageClickPct ?? 0) >= 3 && (c.rageClickPct ?? 0) >= 2 * medRage) signals.push(`rage clicks in ${round(c.rageClickPct!, 1)}% of sessions (site median ${round(medRage, 1)}%)`);
    if ((c.deadClickPct ?? 0) >= 15 && (c.deadClickPct ?? 0) >= 2 * medDead) signals.push(`dead clicks in ${round(c.deadClickPct!, 1)}% of sessions (site median ${round(medDead, 1)}%)`);
    if ((c.quickbackPct ?? 0) >= 20 && (c.quickbackPct ?? 0) >= 2 * medQuick) signals.push(`quick-backs in ${round(c.quickbackPct!, 1)}% of sessions (site median ${round(medQuick, 1)}%)`);
    if (signals.length) {
      out.push({
        dedupeKey: `friction:page:${p.path}`,
        kind: 'opportunity',
        rule: 'friction',
        category: 'behaviour',
        scopeType: 'page',
        scopeKey: p.path,
        pages: [p.path],
        title: `${p.path}: visitors click things that do not respond`,
        problem: `In ${fmt(c.sessions)} recorded sessions (${w.label}) Clarity saw ${signals.join('; ')}.`,
        evidence: [
          { label: 'Clarity sessions', value: fmt(c.sessions), period: w.label, source: 'Clarity' },
          ...signals.map((s) => ({ label: 'Signal', value: s, period: w.label, source: 'Clarity' as const })),
        ],
        facts: ['Clarity only records visitors who accepted cookies.'],
        hypotheses: ['An image, heading or price looks tappable but is not.', 'A button or link is slow or broken on some phones.'],
        proposal: `Open the Clarity recordings for ${p.path} filtered to rage or dead clicks, find the element, and either make it work (e.g. link the image) or make it look less clickable.`,
        benefit: 'Removes a point of frustration on a page people already reach; the effect on enquiries cannot be estimated before the cause is seen.',
        effort: 'small',
        confidence: c.sessions >= 100 ? 'medium' : 'low',
        confidenceScore: c.sessions >= 100 ? 0.6 : 0.45,
        estExtraClicksMonth: null,
        valueScore: round(def.weight * Math.min(30, c.sessions / 5), 2),
        measurementDays: 28,
        successMetric: 'Rage and dead click rates on the page fall back to the site median.',
        dataSource: 'api',
      });
    }
    if (def.commercial && c.scrollDepth != null && c.scrollDepth < 35 && c.sessions >= 50) {
      out.push({
        dedupeKey: `low_scroll:page:${p.path}`,
        kind: 'opportunity',
        rule: 'low_scroll',
        category: 'behaviour',
        scopeType: 'page',
        scopeKey: p.path,
        pages: [p.path],
        title: `${p.path}: most visitors see only the top third`,
        problem: `Average scroll depth ${round(c.scrollDepth, 0)}% over ${fmt(c.sessions)} recorded sessions (${w.label}).`,
        evidence: [
          { label: 'Average scroll depth', value: `${round(c.scrollDepth, 0)}%`, period: w.label, source: 'Clarity' },
          ...(c.mobileScrollDepth != null ? [{ label: 'On phones', value: `${round(c.mobileScrollDepth, 0)}%`, period: w.label, source: 'Clarity' as const }] : []),
        ],
        facts: ['Clarity only records visitors who accepted cookies.'],
        hypotheses: ['The enquiry form or booking button may sit below where most visitors stop.', 'Visitors may find the phone number at the top and call straight away, which is a good outcome (check call taps).'],
        proposal: 'Look at the scroll heatmap in Clarity. If the main call to action is below the average fold, test a compact call/enquiry block higher up, on half of the similar pages first.',
        benefit: 'More visitors would see the call to action; the effect on enquiries is measured by the experiment, not assumed.',
        effort: 'small',
        confidence: 'medium',
        confidenceScore: 0.55,
        estExtraClicksMonth: null,
        valueScore: round(def.weight * Math.min(25, c.sessions / 6), 2),
        measurementDays: 28,
        successMetric: 'Contacts per session on the changed pages against unchanged pages.',
        dataSource: 'api',
      });
    }
  }
  return out;
}

/* ── Entry point ──────────────────────────────────────────────────────────── */

export interface AnalysisResult {
  findings: Finding[];
  heldPages: { path: string; reason: string }[];
  curve: { bucket: string; impressions: number; ctr: number | null }[];
}

export function analyse(input: AnalysisInput): AnalysisResult {
  const curve = buildCtrCurve(input.pages);
  const holds = holdsFor(input);
  const findings = [
    ...(input.sources.gsc ? ruleCtr(input, curve, holds) : []),
    ...(input.sources.gsc ? rulePageTwo(input, holds) : []),
    ...(input.sources.gsc ? ruleDrops(input, holds) : []),
    ...(input.sources.gsc ? ruleNoImpressions(input) : []),
    ...ruleQueryDemand(input),
    ...ruleCannibalisation(input, holds),
    ...(input.sources.gsc ? ruleTechnical(input) : []),
    ...ruleConversion(input, holds),
    ...ruleClarity(input, holds),
  ];
  for (const f of findings) (f as Finding & { priorityScore?: number }).priorityScore = priority(f);
  return {
    findings,
    heldPages: [...holds.all.values()],
    curve: BUCKETS.map((edge, i) => ({
      bucket: edge === Infinity ? `${BUCKETS[i - 1]}+` : `${BUCKETS[i - 1] ?? 1}-${edge}`,
      impressions: curve.impressions[i],
      ctr: curve.impressions[i] ? round(curve.clicks[i] / curve.impressions[i], 4) : null,
    })),
  };
}

export function priorityOf(f: Finding): number {
  return priority(f);
}

/** Exported for tests. */
export const _internal = { bucketOf, holdsFor, scale, daysBetween };
