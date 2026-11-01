// Lightweight gtag event tracking. No-ops safely during SSR/prerender and when
// gtag is unavailable, so it can be called from anywhere without guards.
// Key events are also passed to Microsoft Clarity (when the visitor accepted),
// so recordings can be filtered to visits that ended in a call or enquiry.
import {
  GOOGLE_ADS_ID,
  LEAD_CONVERSION_LABEL,
  CALL_CONVERSION_LABEL,
} from '../config/leads';
import { attributionFields } from './attribution';
import { clarityEvent } from './consent';

type Params = Record<string, unknown>;

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  const fn = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof fn === 'function') fn(...args);
}

export function trackEvent(name: string, params: Params = {}) {
  gtag('event', name, params);
}

/**
 * Counts a successful enquiry on our own server (/api/insights), so the lead
 * count is complete rather than limited to visitors who accepted cookies. No
 * cookies or browser storage; no name, phone or email is sent - only the
 * page, form and service, plus the traffic source unless the visitor chose
 * Reject. Never blocks or delays the form.
 */
function countLead(params: Params) {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  try {
    const a = attributionFields();
    const body = JSON.stringify({
      e: 'lead_submitted',
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      p: window.location.pathname,
      f: String(params.source ?? 'form').slice(0, 40),
      s: String(params.service ?? '').slice(0, 60),
      l: a.landing, r: a.referrerHost, c: a.channel,
      us: a.utmSource, um: a.utmMedium, uc: a.utmCampaign, d: a.device, k: a.consent,
    });
    if (!navigator.sendBeacon?.('/api/insights', body)) {
      fetch('/api/insights', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  } catch {
    // counting must never break the form
  }
}

// Fire when a visitor submits the enquiry form.
export function trackLead(params: Params = {}) {
  trackEvent('generate_lead', params);
  if (LEAD_CONVERSION_LABEL) {
    gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${LEAD_CONVERSION_LABEL}`,
      ...params,
    });
  }
  clarityEvent('lead_submitted', true);
  countLead(params);
}

// Fire when a visitor taps a phone link.
export function trackCall(params: Params = {}) {
  trackEvent('phone_click', params);
  if (CALL_CONVERSION_LABEL) {
    gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${CALL_CONVERSION_LABEL}`,
      ...params,
    });
  }
  clarityEvent('phone_click', true);
}
