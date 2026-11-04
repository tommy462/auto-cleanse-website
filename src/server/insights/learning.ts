// Learning across changes: which kinds of change, on which kinds of page, have
// worked. Pure functions over the experiments table. The engine uses them to
// weight recommendation priority (do more of what works), and the agent's queue
// uses them to steer the next change and to stop a kind of change that keeps
// doing nothing.

import type { Experiment } from './types.js';

export const CHANGE_TYPES = ['title', 'description', 'faq', 'content', 'links', 'mixed'] as const;
export type ChangeType = (typeof CHANGE_TYPES)[number];
export const CHANGE_TYPE_LABEL: Record<ChangeType, string> = {
  title: 'Search titles', description: 'Meta descriptions', faq: 'FAQ additions', content: 'Content sections', links: 'Internal links', mixed: 'Mixed changes',
};

/** A kind of change stops being used after this many decided results in a row without a win. */
export const STOP_AFTER = 3;
/** A kind of change is recommended once it has this many decided results and wins at least half. */
export const PREFER_MIN_DECIDED = 2;

export type Verdict = 'worked' | 'no_change' | 'worse' | 'undone' | 'measuring';
export function verdictOf(outcome: string): Verdict {
  if (outcome === 'successful') return 'worked';
  if (outcome === 'inconclusive') return 'no_change';
  if (outcome === 'unsuccessful') return 'worse';
  if (outcome === 'reverted') return 'undone';
  return 'measuring';
}

export interface Tally {
  worked: number;
  no_change: number;
  worse: number;
  undone: number;
  measuring: number;
  decided: number;
  /** decided results since the last win, counted back from the latest */
  streak: number;
  /** win rate with one imaginary win and one imaginary loss added, so one result does not swing it */
  score: number;
}
const emptyTally = (): Tally => ({ worked: 0, no_change: 0, worse: 0, undone: 0, measuring: 0, decided: 0, streak: 0, score: 0.5 });

export type RecordRow = Pick<Experiment, 'outcome' | 'pages' | 'page_groups'> & {
  change_type?: string | null; decided_at?: string | null; created_at?: string | null; rule?: string | null;
};

export interface TrackRecord {
  by_type: Record<string, Tally>;
  /** key `${type}|${group}` */
  by_type_group: Record<string, Tally>;
  by_rule: Record<string, Tally>;
  /** key `${rule}|${group}` */
  by_rule_group: Record<string, Tally>;
  /** kinds of change to stop using for now */
  avoid: ChangeType[];
  /** kinds of change with a record worth repeating, best first */
  prefer: ChangeType[];
}

const isType = (t: unknown): t is ChangeType => typeof t === 'string' && (CHANGE_TYPES as readonly string[]).includes(t);

/** The page groups a change touched: its own groups, or the groups of its pages. */
export function groupsOf(e: Pick<RecordRow, 'pages' | 'page_groups'>, groupOf: (path: string) => string | null): string[] {
  const out = new Set<string>(e.page_groups ?? []);
  if (!out.size) for (const p of e.pages ?? []) { const g = groupOf(p); if (g) out.add(g); }
  return [...out];
}

export function trackRecord(exps: RecordRow[], groupOf: (path: string) => string | null = () => null): TrackRecord {
  const rec: TrackRecord = { by_type: {}, by_type_group: {}, by_rule: {}, by_rule_group: {}, avoid: [], prefer: [] };
  const at = (e: RecordRow) => e.decided_at ?? e.created_at ?? '';
  // Oldest first, so the streak reads forward in time.
  const ordered = [...exps].sort((a, b) => at(a).localeCompare(at(b)));
  const add = (table: Record<string, Tally>, key: string, v: Verdict) => {
    const t = (table[key] ??= emptyTally());
    t[v]++;
    if (v !== 'measuring') {
      t.decided++;
      t.streak = v === 'worked' ? 0 : t.streak + 1;
      t.score = (t.worked + 1) / (t.decided + 2);
    }
  };
  for (const e of ordered) {
    const v = verdictOf(e.outcome);
    const groups = groupsOf(e, groupOf);
    if (isType(e.change_type)) {
      add(rec.by_type, e.change_type, v);
      for (const g of groups) add(rec.by_type_group, `${e.change_type}|${g}`, v);
    }
    if (e.rule) {
      add(rec.by_rule, e.rule, v);
      for (const g of groups) add(rec.by_rule_group, `${e.rule}|${g}`, v);
    }
  }
  for (const t of CHANGE_TYPES) {
    const x = rec.by_type[t];
    if (!x) continue;
    if (x.streak >= STOP_AFTER) rec.avoid.push(t);
    else if (x.decided >= PREFER_MIN_DECIDED && x.worked / x.decided >= 0.5) rec.prefer.push(t);
  }
  rec.prefer.sort((a, b) => rec.by_type[b].score - rec.by_type[a].score);
  return rec;
}

/**
 * How much a finding's priority is scaled by what happened last time this kind
 * of finding was acted on, on this kind of page: 0.5 (everything failed) to 1.5
 * (everything worked), 1 with no record. The most specific record with at least
 * one decided result wins: rule on these page groups, then the rule anywhere.
 */
export function priorityMultiplier(f: { rule: string; pages: string[] }, record: TrackRecord, groupOf: (path: string) => string | null): number {
  const groups = [...new Set(f.pages.map(groupOf).filter((g): g is string => Boolean(g)))];
  const specific = groups.map((g) => record.by_rule_group[`${f.rule}|${g}`]).filter((t): t is Tally => Boolean(t && t.decided));
  const t = specific.length ? { score: specific.reduce((s, x) => s + x.score, 0) / specific.length } : record.by_rule[f.rule]?.decided ? record.by_rule[f.rule] : null;
  return t ? Math.round((0.5 + t.score) * 100) / 100 : 1;
}

/** The part of the record the agent needs: by kind of change, plus what to avoid and prefer. */
export function recordForAgent(record: TrackRecord) {
  return { by_type: record.by_type, avoid: record.avoid, prefer: record.prefer, stop_after: STOP_AFTER };
}
