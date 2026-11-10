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
  /** First full day the site's own enquiry counter was live. Earlier days are never compared against GA4. */
  siteLeadsFrom?: string | null;
}

function alert(key: string, category: Finding['category'], title: string, problem: string, proposal: string, facts: string[], value: number, hypotheses: string[] = []): Finding {
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
    hypotheses,
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
        [`Latest complete day: ${lastFinal ?? 'none'}`], 50,
        ['The service account lost access to the Search Console property.', 'The Google API failed on the last few runs; the run log on the Data health tab shows the error.']));
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
        [`Usual: ${Math.round(med)} sessions a day (median of the last 4 weeks)`, 'Yesterday: 0 sessions'], 60,
        ['The Google tag stopped loading after Accept on the cookie banner.', 'The GA4 measurement ID in Vercel changed.', 'GA4 had not finished processing yesterday when the run read it. The run re-reads the last 4 days, so this clears itself.']));
    }
    const last7 = days.filter((d) => d.date >= addDays(today, -8) && d.date <= addDays(today, -2));
    const before = days.filter((d) => d.date >= addDays(today, -36) && d.date < addDays(today, -8));
    const contacts = (rows: SiteDay[]) => sum(rows, 'ga4_leads') + sum(rows, 'ga4_phone_clicks') + sum(rows, 'ga4_whatsapp_clicks');
    if (last7.length >= 5 && before.length >= 14 && contacts(last7) === 0 && contacts(before) / before.length >= 1 && sum(last7, 'ga4_sessions') > 50) {
      out.push(alert('tracking_break:site', 'data_quality', 'No call taps or enquiries recorded for a week',
        `GA4 recorded visits (${sum(last7, 'ga4_sessions')}) but no form, call or WhatsApp events in the last 7 days, against ${round(contacts(before) / before.length, 1)} a day before.`,
        'Tap the phone number on the live site (with gtag stubbed, so no Ads conversion is recorded) and watch GA4 DebugView. Something in the tracking has probably broken.',
        [`GA4 visits in the last 7 days: ${sum(last7, 'ga4_sessions')}`, 'Form, call and WhatsApp events in the same days: 0', `Before that: ${round(contacts(before) / before.length, 1)} a day over ${before.length} days`], 70,
        ['The Google tag stopped loading after Accept on the cookie banner, so no events reach GA4.', 'A change to the call buttons or forms removed the tracking call.']));
    }
  }

  if (configured.siteLeads) {
    // Every form sends both counts, and GA4 only sees visitors who accept
    // cookies, so the site's own count should never be the lower one. Only days
    // since the counter went live are compared: before that it had nothing to count.
    const start = input.siteLeadsFrom && input.siteLeadsFrom > addDays(today, -11) ? input.siteLeadsFrom : addDays(today, -11);
    const span = days.filter((d) => d.date >= start && d.date <= yesterday);
    const ga4 = sum(span, 'ga4_leads');
    const site = sum(span, 'site_leads');
    if (span.length >= 3 && ga4 >= 2 && site * 2 < ga4) {
      const n = (v: number | null) => Number(v) || 0;
      const short = span.filter((d) => n(d.ga4_leads) > n(d.site_leads)).slice(-5).map((d) => `${d.date} (GA4 ${n(d.ga4_leads)}, site ${n(d.site_leads)})`);
      out.push(alert('site_leads_break:site', 'data_quality',
        site === 0 ? 'Enquiry forms are not being counted by the site' : 'The site is counting fewer enquiries than GA4',
        `Since ${start}, GA4 saw ${ga4} form enquiries but the site's own counter recorded ${site === 0 ? 'none' : site}. GA4 only sees visitors who accept cookies, so the site's figure should be the higher one.`,
        'Submit one test enquiry on the live site (it reaches you like any other enquiry), then check the Vercel log for POST /api/insights: anything other than 204 says why it was not counted.',
        [
          `Days compared: ${start} to ${yesterday}${input.siteLeadsFrom ? ` (the counter went live on ${input.siteLeadsFrom})` : ''}`,
          `Form enquiries seen by GA4: ${ga4}`,
          `Form enquiries counted by the site: ${site}`,
          ...(short.length ? [`Days GA4 saw more: ${short.join(', ')}`] : []),
        ], 55,
        [
          'The site refuses the count: 403 (page served from an unexpected address), 400 (a field failed its check) or 429 (rate limit). The Vercel log shows which.',
          'The database write fails (500 in the log), for example after a change to the web_conversions table.',
          'A form was changed to report to GA4 without the shared trackLead helper, which is what sends both counts.',
        ]));
    }
  }

  if (configured.clarity) {
    // Each run stores Clarity's last 24 hours under the run's own date, so a run on day D
    // covers mostly D-1. Days with no Clarity figure (before it was connected, or a failed
    // fetch) are missing, not zero: only the last few runs that returned a figure count.
    const runs = days.filter((d) => d.date > addDays(today, -4) && d.date <= today && d.clarity_sessions != null);
    const covered = new Set(runs.map((d) => addDays(d.date, -1)));
    const ga4 = sum(days.filter((d) => covered.has(d.date)), 'ga4_sessions');
    if (runs.length >= 2 && sum(runs, 'clarity_sessions') === 0 && ga4 > 30) {
      out.push(alert('clarity_zero:site', 'data_quality', 'Clarity has recorded nothing for days',
        'GA4 shows visitors who accepted cookies, but Clarity recorded no sessions.',
        'Check the Clarity project is still set up and the project ID in Vercel is right.',
        [`Clarity fetches compared: ${runs.map((d) => d.date).join(', ')} (each covers the 24 hours before the 7am run)`, `GA4 visits on the days they cover: ${ga4}`, 'Clarity sessions in those fetches: 0'], 30,
        ['The Clarity project was deleted or its ID in Vercel changed.', 'Clarity stopped loading after Accept on the cookie banner.']));
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
        [`Same weekday, previous 8 weeks: ${history.join(', ')}`], 20,
        ['A quiet day by chance.', 'The data for that day was not complete when the run read it.', 'A site or tracking problem, if the following days stay low too.']));
    } else if (z >= 5 && v - med >= 30 && metric === 'ga4_sessions') {
      out.push(alert(`spike_${metric}:${day}`, 'anomaly', `Unusual spike in visits on ${day}`,
        `${v} sessions against a usual ${Math.round(med)}. If it did not bring enquiries it may be bot traffic.`,
        'Check the GA4 traffic source for that day. Exclude bot traffic before reading conversion rates for that week.',
        [`Same weekday, previous 8 weeks: ${history.join(', ')}`], 10,
        ['Bot or crawler traffic counted as visits.', 'A real burst of interest, such as a mention on social media.']));
    }
  };
  const lastFinalGsc = [...days].reverse().find((d) => d.gsc_final && d.gsc_clicks != null)?.date;
  check('gsc_clicks', lastFinalGsc, 'Google clicks', 8);
  if (configured.ga4) check('ga4_sessions', yesterday, 'Website visits', 10);
  return out;
}
