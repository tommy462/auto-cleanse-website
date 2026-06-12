// Lightweight gtag event tracking. No-ops safely during SSR/prerender and when
// gtag is unavailable, so it can be called from anywhere without guards.
import {
  GOOGLE_ADS_ID,
  LEAD_CONVERSION_LABEL,
  CALL_CONVERSION_LABEL,
} from '../config/leads';

type Params = Record<string, unknown>;

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  const fn = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof fn === 'function') fn(...args);
}

export function trackEvent(name: string, params: Params = {}) {
  gtag('event', name, params);
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
}
