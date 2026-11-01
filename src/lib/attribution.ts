// Where this visit came from, so an enquiry or booking can be credited to the
// page and traffic source that brought it in. Read once when the page first
// loads and kept in memory only: nothing is written to cookies or browser
// storage, no ad click IDs are kept (only whether one was present), and it
// is forgotten when the tab closes. Visitors who choose Reject in the cookie
// banner are not attributed (see attributionFields).

import { readConsent } from './consent';

export interface Attribution {
  landing: string;
  referrerHost: string | null;
  channel: 'paid_search' | 'organic_search' | 'social' | 'email' | 'referral' | 'direct' | 'campaign';
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  device: 'mobile' | 'tablet' | 'desktop';
}

let captured: Attribution | null = null;

const SEARCH = /(^|\.)(google|bing|yahoo|duckduckgo|ecosia|yandex|baidu|startpage|brave)\./i;
const SOCIAL = /(^|\.)(facebook|instagram|t\.co|twitter|x\.com|linkedin|tiktok|youtube|pinterest|reddit|whatsapp)\b/i;

const clip = (v: string | null, max = 100) => (v ? v.trim().slice(0, max) : null);

export function captureAttribution() {
  if (captured || typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const q = url.searchParams;
  let referrerHost: string | null = null;
  try {
    const r = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : '';
    if (r && r !== url.hostname && !r.endsWith('auto-cleanse.co.uk')) referrerHost = r;
  } catch {
    referrerHost = null;
  }
  const medium = clip(q.get('utm_medium'))?.toLowerCase() ?? null;
  const paidClick = q.has('gclid') || q.has('gbraid') || q.has('wbraid') || q.has('msclkid');
  let channel: Attribution['channel'] = 'direct';
  if (paidClick || (medium && /^(cpc|ppc|paid|paidsearch)$/.test(medium))) channel = 'paid_search';
  else if (medium === 'email') channel = 'email';
  else if (medium) channel = 'campaign';
  else if (referrerHost && SEARCH.test(referrerHost)) channel = 'organic_search';
  else if (referrerHost && SOCIAL.test(referrerHost)) channel = 'social';
  else if (referrerHost) channel = 'referral';
  const w = window.innerWidth || 1024;
  captured = {
    landing: url.pathname.slice(0, 300),
    referrerHost: clip(referrerHost),
    channel,
    utmSource: clip(q.get('utm_source')),
    utmMedium: medium,
    utmCampaign: clip(q.get('utm_campaign')),
    device: w < 768 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop',
  };
}

/** Attribution to send with a conversion; empty when the visitor chose Reject. */
export function attributionFields(): Partial<Attribution> & { consent: 'granted' | 'denied' | 'unknown' } {
  const choice = readConsent();
  if (choice === 'denied' || !captured) return { consent: choice ?? 'unknown' };
  return { ...captured, consent: choice ?? 'unknown' };
}
