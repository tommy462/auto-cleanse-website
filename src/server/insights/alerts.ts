// Daily checks: is every source still delivering, is tracking still firing,
// and did anything move far outside its normal range? Only extreme moves are
// flagged (robust z-score against the same weekday over 8 weeks), so normal
// day-to-day wobble never raises an alert.

import { addDays, isoWeekday } from './dates.js';
import { median, robustZ, round } from './stats.js';
import type { Finding } from './types.js';

export interface SiteDay {
  date: string;
  gsc_clicks: number | null;
  gsc_impressions: number | null;
  gsc_final: boolean | null;
  ga4_sessions: number | null;
  ga4_leads: number | null;
  ga4_phone_clicks: number | null;
  ga4_whatsapp_clicks: number | null;
  site_leads: number | null;
  deposits_paid: number | null;
  clarity_sessions: number | null;
}

export interface AlertInput {
  today: string;
  days: SiteDay[];
  configured: { gsc: boolean; ga4: boolean; clarity: boolean; siteLeads: boolean };
}

function alert(key: string, category: Finding['category'], title: string, problem: string, proposal: string, facts: string[], value: number): Finding {
  return {
    dedupeKey: key,
    kind: 'alert',
    rule: key.split(':')[0],
    category,
    scopeType: 'site',
    scopeKey: 'site',
    pages: [],
    title,
    problem,
    evidence: [],
    facts,
    hypotheses: [],
    proposal,
    benefit: 'Keeps the numbers the recommendations rely on trustworthy.',
    effort: 'small',
    confidence: 'high',
    confidenceScore: 0.9,
    estExtraClicksMonth: null,
    valueScore: value,
    measurementDays: 7,
    successMetric: 'The source reports normal figures again.',
    dataSource: 'api',
  };
}

const sum = (rows: SiteDay[], k: keyof SiteDay) => rows.reduce((s, r) => s + (Number(r[k]) || 0), 0);

export function dailyAlerts(input: AlertInput): Finding[] {
  const { today, configured } = input;
  const days = [...input.days].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(days.map((d) => [d.date, d]));
  const out: Finding[] = [];
  const yesterday = addDays(today, -1);

  if (configured.gsc) {
    const lastFinal = [...days].reverse().find((d) => d.gsc_final && d.gsc_impressions != null)?.date;
    if (!lastFinal || lastFinal < addDays(today, -6)) {
      out.push(alert('gsc_stale:site', 'data_quality', 'Search Console data has stopped arriving',
        `The newest complete Search Console day is ${lastFinal ?? 'missing'}; normally it is 2-3 days old.`,
        'Check the run log on the Data health tab. If the error mentions permission, the service account has lost access to the Search Console property.',
        [`Latest complete day: ${lastFinal ?? 'none'}`], 50));
    }
  }

  if (configured.ga4) {
    const last28 = days.filter((d) => d.date >= addDays(today, -29) && d.date <= addDays(today, -2));
    const med = median(last28.map((d) => d.ga4_sessions ?? 0));
    const y = byDate.get(yesterday)?.ga4_sessions ?? 0;
    if (med >= 10 && y === 0) {
      out.push(alert('ga4_zero:site', 'data_quality', 'GA4 recorded no visits yesterday',
        `GA4 shows 0 sessions for ${yesterday}, against a usual ${Math.round(med)} a day.`,
        'Open the live site, accept cookies and check GA4 Realtime. If nothing arrives, the tag or the consent banner is broken.',
        [`Usual: ${Math.round(med)} sessions a day (median of the last 4 weeks)`], 60));
    }
    const last7 = days.filter((d) => d.date >= addDays(today, -8) && d.date <= addDays(today, -2));
    const before = days.filter((d) => d.date >= addDays(today, -36) && d.date < addDays(today, -8));
    const contacts = (rows: SiteDay[]) => sum(rows, 'ga4_leads') + sum(rows, 'ga4_phone_clicks') + sum(rows, 'ga4_whatsapp_clicks');
    if (last7.length >= 5 && before.length >= 14 && contacts(last7) === 0 && contacts(before) / before.length >= 1 && sum(last7, 'ga4_sessions') > 50) {
      out.push(alert('tracking_break:site', 'data_quality', 'No call taps or enquiries recorded for a week',
        `GA4 recorded visits (${sum(last7, 'ga4_sessions')}) but no form, call or WhatsApp events in the last 7 days, against ${round(contacts(before) / before.length, 1)} a day before.`,
        'Tap the phone number on the live site (with gtag stubbed, so no Ads conversion is recorded) and watch GA4 DebugView. Something in the tracking has probably broken.',
        [], 70));
    }
  }

  if (configured.siteLeads) {
    const last10 = days.filter((d) => d.date >= addDays(today, -11) && d.date <= yesterday);
    if (sum(last10, 'site_leads') === 0 && sum(last10, 'ga4_leads') >= 2) {
      out.push(alert('site_leads_break:site', 'data_quality', 'Enquiry forms are not being counted by the site',
        `GA4 saw ${sum(last10, 'ga4_leads')} form submissions in 10 days but the site's own counter recorded none.`,
        'Submit a test enquiry and check web_conversions. The beacon to /api/insights may be failing.',
        [], 55));
    }
  }

  if (configured.clarity) {
    const last3 = days.filter((d) => d.date >= addDays(today, -3) && d.date <= yesterday);
    if (last3.length >= 2 && sum(last3, 'clarity_sessions') === 0 && sum(last3, 'ga4_sessions') > 30) {
      out.push(alert('clarity_zero:site', 'data_quality', 'Clarity has recorded nothing for days',
        'GA4 shows visitors who accepted cookies, but Clarity recorded no sessions.',
        'Check the Clarity project is still set up and the project ID in Vercel is right.',
        [], 30));
    }
  }

  // Anomalies against the same weekday over the previous 8 weeks.
  const check = (metric: keyof SiteDay, day: string | undefined, label: string, minDrop: number) => {
    if (!day) return;
    const v = Number(byDate.get(day)?.[metric]);
    if (!Number.isFinite(v)) return;
    const history = [1, 2, 3, 4, 5, 6, 7, 8]
      .map((w) => byDate.get(addDays(day, -7 * w))?.[metric])
      .filter((x): x is number => typeof x === 'number');
    const z = robustZ(v, history);
    if (z == null) return;
    const med = median(history);
    if (z <= -3.5 && med - v >= minDrop) {
      out.push(alert(`anomaly_${metric}:${day}`, 'anomaly', `${label} unusually low on ${day}`,
        `${v} on ${day} (a ${['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][isoWeekday(day)]}), against a usual ${Math.round(med)} on that weekday.`,
        'One low day is not a trend. Check whether the next days recover before acting; if two or more are low, look at the Data health tab and the Search Console / GA4 reports.',
        [`Same weekday, previous 8 weeks: ${history.join(', ')}`], 20));
    } else if (z >= 5 && v - med >= 30 && metric === 'ga4_sessions') {
      out.push(alert(`spike_${metric}:${day}`, 'anomaly', `Unusual spike in visits on ${day}`,
        `${v} sessions against a usual ${Math.round(med)}. If it did not bring enquiries it may be bot traffic.`,
        'Check the GA4 traffic source for that day. Exclude bot traffic before reading conversion rates for that week.',
        [], 10));
    }
  };
  const lastFinalGsc = [...days].reverse().find((d) => d.gsc_final && d.gsc_clicks != null)?.date;
  check('gsc_clicks', lastFinalGsc, 'Google clicks', 8);
  if (configured.ga4) check('ga4_sessions', yesterday, 'Website visits', 10);
  return out;
}
