// The comparison for a change to one page (or a few): similar pages left as
// they were, so site-wide movement (season, a Google update, a wave of new
// town pages) is taken out of the verdict; and the searches the page is found
// for, so the result is read on "dpf cleaning exeter" and not only on the
// page's average position, which shifts with the mix of searches.
// Pure functions; the pipeline feeds them data and stores what they pick.

import { isBrandQuery } from './classify.js';
import { addDays } from './dates.js';
import type { QueryRow } from './types.js';

export const MIN_CONTROLS = 3;
export const MAX_CONTROLS = 8;
/** A page whose text changed this recently is not a clean comparison. */
export const RECENT_CHANGE_DAYS = 35;
export const TARGET_QUERIES = 3;

export interface Candidate { path: string; group: string; impressions: number; position: number | null; contentChangedOn: string | null }

/**
 * Pages to compare a change against: same page group as the changed pages,
 * not changed themselves, not under another test, with Google impressions
 * closest to the changed pages' over the same window. None when fewer than
 * MIN_CONTROLS qualify; a thin comparison is worse than an honest before/after.
 */
export function pickControls(changed: string[], candidates: Candidate[], busy: Set<string>, today: string, labelOf: (group: string) => string = (g) => g): { controls: string[]; note: string } {
  const byPath = new Map(candidates.map((c) => [c.path, c]));
  const treat = changed.map((p) => byPath.get(p)).filter((c): c is Candidate => Boolean(c));
  if (!treat.length) return { controls: [], note: 'No comparison pages: the changed pages had no Search Console data in the window before the change.' };
  const groups = [...new Set(treat.map((c) => c.group))];
  const label = groups.map(labelOf).join(' and ');
  const mean = treat.reduce((s, c) => s + c.impressions, 0) / treat.length;
  const recent = addDays(today, -RECENT_CHANGE_DAYS);
  const changedSet = new Set(changed);
  const eligible = candidates.filter((c) => groups.includes(c.group) && !changedSet.has(c.path) && !busy.has(c.path) && c.impressions > 0
    && !(c.contentChangedOn && c.contentChangedOn > recent));
  const dist = (c: Candidate) => Math.abs(Math.log(c.impressions + 1) - Math.log(mean + 1));
  const picked = eligible.sort((a, b) => dist(a) - dist(b) || b.impressions - a.impressions).slice(0, MAX_CONTROLS);
  if (picked.length < MIN_CONTROLS) {
    return { controls: [], note: `No comparison pages: only ${picked.length} similar unchanged ${label} available (${MIN_CONTROLS} needed), so this is judged before against after.` };
  }
  return {
    controls: picked.map((c) => c.path),
    note: `Compared against ${picked.length} similar ${label} picked automatically: closest to it in Google impressions over the same window, unchanged, and not under another test.`,
  };
}

/** The searches the changed pages are found for most, brand searches aside. */
export function targetQueries(rows: QueryRow[], paths: string[], max = TARGET_QUERIES): string[] {
  const want = new Set(paths);
  const agg = new Map<string, number>();
  for (const r of rows) if (want.has(r.path) && !isBrandQuery(r.query)) agg.set(r.query, (agg.get(r.query) ?? 0) + r.impressions);
  return [...agg].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, max).map(([q]) => q);
}

export interface QueryShift { query: string; before: number | null; after: number | null; impressions_before: number | null; impressions_after: number | null; moved: number | null }

/** Each target search's position (weighted across the pages) in the period before and the period after. */
export function queryShifts(targets: string[], paths: string[], before: QueryRow[], after: QueryRow[]): QueryShift[] {
  const want = new Set(paths);
  const pos = (rows: QueryRow[], q: string) => {
    let i = 0;
    let pw = 0;
    for (const r of rows) if (r.query === q && want.has(r.path)) { i += r.impressions; pw += r.position * r.impressions; }
    return i ? { position: Math.round((pw / i) * 10) / 10, impressions: i } : null;
  };
  return targets.map((q) => {
    const b = pos(before, q);
    const a = pos(after, q);
    return {
      query: q, before: b?.position ?? null, after: a?.position ?? null, impressions_before: b?.impressions ?? null, impressions_after: a?.impressions ?? null,
      moved: b && a ? Math.round((a.position - b.position) * 10) / 10 : null,
    };
  });
}

/**
 * Which stored search periods (28-day windows ending on period_end) stand for
 * "before" and "after": the last one ending before the change, and the latest
 * one that sits mostly inside the measured window.
 */
export function queryPeriods(periodEnds: string[], w: { baselineTo: string; measureFrom: string; measureTo: string }): { before: string | null; after: string | null } {
  const ends = [...new Set(periodEnds)].sort();
  const before = ends.filter((d) => d <= w.baselineTo).pop() ?? null;
  const after = ends.filter((d) => d >= addDays(w.measureFrom, 20) && d <= addDays(w.measureTo, 7)).pop() ?? null;
  return { before, after };
}

/** One sentence on the main searches, for the verdict. */
export function describeShifts(shifts: QueryShift[]): string | null {
  const known = shifts.filter((s) => s.moved != null);
  if (!known.length) return null;
  const part = (s: QueryShift) => `"${s.query}" ${s.moved === 0 ? `stayed at ${s.before}` : `${s.moved! < 0 ? 'climbed' : 'slipped'} from ${s.before} to ${s.after}`}`;
  return `On its main search${known.length > 1 ? 'es' : ''}: ${known.map(part).join('; ')}.`;
}
