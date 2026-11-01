// Turns this run's findings into changes to web_recommendations without
// creating duplicates or nagging:
//  - one row per dedupe key, ever; a repeat finding refreshes its evidence
//  - new OPPORTUNITIES are only created by the weekly run; the daily run only
//    refreshes existing ones and raises alerts
//  - anything a person has moved on (implemented, dismissed...) is left alone
//  - an open finding that stops being detected is closed as "resolved"

import { addDays } from './dates.js';
import { priorityOf } from './rules.js';
import { OPEN_STATUSES, type Finding, type RecStatus } from './types.js';

export interface ExistingRec {
  id: string;
  dedupe_key: string;
  kind: 'opportunity' | 'alert';
  rule: string;
  status: RecStatus;
  snoozed_until: string | null;
  last_detected_at: string;
  updated_at: string;
  detections: number;
}

export interface MergePlan {
  inserts: Record<string, unknown>[];
  updates: { id: string; patch: Record<string, unknown> }[];
  closes: { id: string; status: RecStatus; note: string }[];
}

export function findingColumns(f: Finding): Record<string, unknown> {
  return {
    kind: f.kind,
    rule: f.rule,
    category: f.category,
    scope_type: f.scopeType,
    scope_key: f.scopeKey.slice(0, 300),
    pages: f.pages.slice(0, 50),
    page_count: f.pages.length,
    title: f.title.slice(0, 200),
    problem: f.problem.slice(0, 2000),
    evidence: f.evidence,
    facts: f.facts.map((x) => x.slice(0, 600)).slice(0, 20),
    hypotheses: f.hypotheses.map((x) => x.slice(0, 600)).slice(0, 10),
    proposal: f.proposal.slice(0, 3000),
    benefit: f.benefit.slice(0, 1500),
    effort: f.effort,
    confidence: f.confidence,
    confidence_score: f.confidenceScore,
    est_extra_clicks_month: f.estExtraClicksMonth,
    value_score: f.valueScore,
    priority_score: priorityOf(f),
    measurement_days: f.measurementDays,
    success_metric: f.successMetric.slice(0, 500),
    data_source: f.dataSource,
  };
}

export function mergeFindings(opts: {
  siteId: string;
  existing: ExistingRec[];
  findings: Finding[];
  mode: 'daily' | 'weekly';
  /** rules that actually ran this time (a rule whose source had no data did not run) */
  rulesRun: Set<string>;
  now: string; // ISO timestamp
  runId: number | null;
}): MergePlan {
  const { existing, findings, mode, rulesRun, now, runId, siteId } = opts;
  const today = now.slice(0, 10);
  const byKey = new Map(existing.map((e) => [e.dedupe_key, e]));
  const seen = new Set<string>();
  const plan: MergePlan = { inserts: [], updates: [], closes: [] };

  for (const f of findings) {
    if (seen.has(f.dedupeKey)) continue;
    seen.add(f.dedupeKey);
    const ex = byKey.get(f.dedupeKey);
    const cols = findingColumns(f);
    const touch = { last_detected_at: now, last_run_id: runId };

    if (!ex) {
      if (f.kind === 'opportunity' && mode !== 'weekly') continue;
      plan.inserts.push({ site_id: siteId, dedupe_key: f.dedupeKey, ...cols, status: 'new', first_detected_at: now, ...touch, detections: 1 });
      continue;
    }
    const detections = ex.detections + 1;
    if (OPEN_STATUSES.includes(ex.status)) {
      plan.updates.push({ id: ex.id, patch: { ...cols, ...touch, detections } });
    } else if (ex.status === 'resolved') {
      plan.updates.push({ id: ex.id, patch: { ...cols, ...touch, detections, status: 'new', status_note: `Detected again on ${today}.` } });
    } else if (ex.status === 'dismissed') {
      if (ex.snoozed_until && ex.snoozed_until <= today) {
        plan.updates.push({ id: ex.id, patch: { ...cols, ...touch, detections, status: 'new', snoozed_until: null, status_note: `Snooze ended; still detected on ${today}.` } });
      }
    } else if (['successful', 'inconclusive', 'reverted'].includes(ex.status)) {
      // Only come back long after the experiment closed, so a page is never changed again before its last change was judged.
      if (ex.updated_at.slice(0, 10) <= addDays(today, -60)) {
        plan.updates.push({ id: ex.id, patch: { ...cols, ...touch, detections, status: 'new', status_note: `Detected again on ${today}, more than 60 days after the last experiment closed.` } });
      }
    }
    // implemented / monitoring: the experiment owns it; leave it alone.
  }

  // Close what is no longer detected.
  for (const ex of existing) {
    if (seen.has(ex.dedupe_key) || ex.status !== 'new' || !rulesRun.has(ex.rule)) continue;
    if (ex.kind === 'opportunity' && mode !== 'weekly') continue;
    const graceDays = ex.kind === 'alert' ? 2 : 14;
    if (ex.last_detected_at.slice(0, 10) <= addDays(today, -graceDays)) {
      plan.closes.push({ id: ex.id, status: 'resolved', note: `No longer detected (last seen ${ex.last_detected_at.slice(0, 10)}).` });
    }
  }
  return plan;
}
