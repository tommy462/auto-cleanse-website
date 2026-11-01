// Judges whether a change worked. Every experiment has a baseline window
// before the change and a measurement window after it (starting a week later,
// so Google has re-crawled the pages). The verdict is only "successful" or
// "unsuccessful" when the 95% interval of the effect sits wholly on one side
// of "no change"; otherwise it is "inconclusive" - which is an honest result,
// not a failure of the system.

import { addDays, daysBetween } from './dates.js';
import { didRatio, rateRatio, round } from './stats.js';
import type { Experiment } from './types.js';

export interface Totals {
  clicks: number;
  impressions: number;
  /** sum of position x impressions, for a weighted average */
  positionWeight: number;
  sessions: number;
  engaged: number;
  conversions: number;
  days: number;
}

export const emptyTotals = (days: number): Totals => ({ clicks: 0, impressions: 0, positionWeight: 0, sessions: 0, engaged: 0, conversions: 0, days });

/** Search Console needs ~3 days before a day is complete. */
export const GSC_LAG_DAYS = 3;
/** Days after a change before measurement starts (re-crawl and re-index). */
export const SETTLE_DAYS = 7;

export function experimentWindows(e: Pick<Experiment, 'implemented_on' | 'baseline_from' | 'baseline_to' | 'measure_from' | 'measure_to'>, measurementDays = 28) {
  if (!e.implemented_on) return null;
  const measureFrom = e.measure_from ?? addDays(e.implemented_on, SETTLE_DAYS);
  const measureTo = e.measure_to ?? addDays(measureFrom, measurementDays - 1);
  const len = daysBetween(measureFrom, measureTo) + 1;
  const baselineTo = e.baseline_to ?? addDays(e.implemented_on, -1);
  const baselineFrom = e.baseline_from ?? addDays(baselineTo, -(len - 1));
  return { baselineFrom, baselineTo, measureFrom, measureTo, len };
}

interface Effect { ratio: number; low: number; high: number }

export interface Evaluation {
  complete: boolean;
  outcome: 'running' | 'successful' | 'unsuccessful' | 'inconclusive';
  confidence: 'low' | 'medium' | 'high' | null;
  effect: Effect | null;
  summary: string;
  limitations: string[];
  numbers: Record<string, number | string | null>;
}

const avgPos = (t: Totals) => (t.impressions ? round(t.positionWeight / t.impressions, 2) : null);

export function evaluate(
  e: Pick<Experiment, 'method' | 'primary_metric' | 'title'>,
  windows: NonNullable<ReturnType<typeof experimentWindows>>,
  treat: { before: Totals; after: Totals },
  control: { before: Totals; after: Totals } | null,
  today: string,
  /** last day of complete data for the metric's source */
  dataUntil: string,
): Evaluation {
  const complete = dataUntil >= windows.measureTo && today >= addDays(windows.measureTo, GSC_LAG_DAYS);
  const m = e.primary_metric;
  const pick = (t: Totals): [number, number] => {
    switch (m) {
      case 'ctr': return [t.clicks, t.impressions];
      case 'clicks': return [t.clicks, t.days];
      case 'impressions': return [t.impressions, t.days];
      case 'sessions': return [t.sessions, t.days];
      case 'leads': return [t.conversions, t.days];
      case 'lead_rate': return [t.conversions, t.sessions];
      case 'engaged_rate': return [t.engaged, t.sessions];
      default: return [t.clicks, t.days];
    }
  };
  const numbers: Record<string, number | string | null> = {
    baseline: `${windows.baselineFrom} to ${windows.baselineTo}`,
    measurement: `${windows.measureFrom} to ${windows.measureTo}`,
    treat_clicks_before: treat.before.clicks, treat_clicks_after: treat.after.clicks,
    treat_impressions_before: treat.before.impressions, treat_impressions_after: treat.after.impressions,
    treat_position_before: avgPos(treat.before), treat_position_after: avgPos(treat.after),
    treat_sessions_before: treat.before.sessions, treat_sessions_after: treat.after.sessions,
    treat_conversions_before: treat.before.conversions, treat_conversions_after: treat.after.conversions,
  };
  if (control) {
    Object.assign(numbers, {
      control_clicks_before: control.before.clicks, control_clicks_after: control.after.clicks,
      control_impressions_before: control.before.impressions, control_impressions_after: control.after.impressions,
      control_position_before: avgPos(control.before), control_position_after: avgPos(control.after),
    });
  }

  const [tA, tAe] = pick(treat.after);
  const [tB, tBe] = pick(treat.before);
  const limitations: string[] = [];
  if (tAe === 0 || tBe === 0) {
    return { complete, outcome: complete ? 'inconclusive' : 'running', confidence: null, effect: null, numbers, limitations: ['No data for the pages in one of the windows.'], summary: 'Not enough data to measure yet.' };
  }
  let effect: Effect;
  if (control && e.method !== 'before_after') {
    const [cA, cAe] = pick(control.after);
    const [cB, cBe] = pick(control.before);
    if (cAe === 0 || cBe === 0) {
      effect = rateRatio(tA, tAe, tB, tBe);
      limitations.push('The control pages had no data, so this fell back to a before/after comparison.');
    } else {
      effect = didRatio(tA, tAe, tB, tBe, cA, cAe, cB, cBe);
      limitations.push('Compared against unchanged control pages, which removes site-wide movement (season, Google updates) as long as the two sets behave alike.');
    }
  } else {
    effect = rateRatio(tA, tAe, tB, tBe);
    limitations.push('Before/after only: a season, a Google update or a competitor could explain some or all of the difference.');
  }
  if (m === 'ctr') {
    const pb = avgPos(treat.before);
    const pa = avgPos(treat.after);
    if (pb != null && pa != null && Math.abs(pa - pb) >= 1) {
      limitations.push(`Average position moved from ${pb} to ${pa}; CTR changes with position, so part of the CTR change may come from ranking, not the change itself.`);
    }
  }
  if (tA + tB < 40) limitations.push(`Small numbers (${tA + tB} events across both windows): only a large effect could be detected.`);

  const pctChange = Math.round((effect.ratio - 1) * 100);
  const width = effect.high / effect.low;
  const confidence: Evaluation['confidence'] = width < 1.5 ? 'high' : width < 2.5 ? 'medium' : 'low';
  let outcome: Evaluation['outcome'] = 'running';
  if (complete) outcome = effect.low > 1 ? 'successful' : effect.high < 1 ? 'unsuccessful' : 'inconclusive';
  const range = `${Math.round((effect.low - 1) * 100)}% to ${Math.round((effect.high - 1) * 100)}%`;
  const summary = !complete
    ? `Measuring until ${windows.measureTo}. So far ${m.replace('_', ' ')} is ${pctChange >= 0 ? 'up' : 'down'} ${Math.abs(pctChange)}% (95% range ${range}); too early to call.`
    : outcome === 'successful'
      ? `${m.replace('_', ' ')} rose ${pctChange}% (95% range ${range}). The improvement is unlikely to be chance.`
      : outcome === 'unsuccessful'
        ? `${m.replace('_', ' ')} fell ${Math.abs(pctChange)}% (95% range ${range}). Consider reverting.`
        : `${m.replace('_', ' ')} changed ${pctChange >= 0 ? '+' : ''}${pctChange}% but the 95% range (${range}) includes no change, so the effect cannot be told apart from noise.`;
  return { complete, outcome, confidence: complete ? confidence : null, effect: { ratio: round(effect.ratio, 3), low: round(effect.low, 3), high: round(effect.high, 3) }, numbers, limitations, summary };
}
