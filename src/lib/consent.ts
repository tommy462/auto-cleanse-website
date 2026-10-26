// Cookie consent for the Google tag (Google Ads, and GA4 when enabled).
// Nothing from Google loads until the visitor accepts in the cookie banner: no
// gtag.js, no cookies and no "cookieless pings". The ICO's storage and access
// technologies guidance (April 2026) says advertising measurement always needs
// consent, so Consent Mode's "advanced" setup (tag loads, pings before consent)
// is not used. The cookie policy page (/cookie-policy) describes this file.
import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID } from '../config/leads';

export const CONSENT_STORAGE_KEY = 'ac-cookie-consent';
export const OPEN_COOKIE_SETTINGS_EVENT = 'ac:open-cookie-settings';

export type ConsentChoice = 'granted' | 'denied';

// A real GA4 measurement ID looks like "G-XXXXXXXXXX".
const isValidGa4Id = (id: string) => /^G-[A-Z0-9]{4,}$/i.test(id);

let googleLoaded = false;

export function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

// Loads gtag.js and configures Google Ads (+ GA4). Only ever called after the
// visitor has accepted, either just now in the banner or on an earlier visit.
export function loadGoogleTag() {
  if (googleLoaded || typeof window === 'undefined') return;
  googleLoaded = true;

  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  // gtag.js only reads the Arguments object, so keep the standard snippet shape.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  // The banner asks to measure which ads and pages bring in enquiries, so ad
  // personalisation (remarketing) stays off even after Accept.
  w.gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });
  w.gtag('js', new Date());
  w.gtag('config', GOOGLE_ADS_ID);
  if (isValidGa4Id(GA4_MEASUREMENT_ID)) w.gtag('config', GA4_MEASUREMENT_ID);

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(s);
}

// Removes the first-party Google cookies (_ga, _ga_<id>, _gcl_au, _gcl_aw...)
// from this host and every parent domain they may have been written to.
function clearGoogleCookies() {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => /^(_ga|_gid|_gat|_gcl_)/.test(n));
  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`.${parts.slice(i).join('.')}`);
  for (const name of names) {
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`;
    }
  }
}

export function saveConsent(choice: ConsentChoice) {
  const previous = readConsent();
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked (private mode, site data cleared): the choice still
    // applies to this visit, the banner just asks again next time.
  }

  if (choice === 'granted') {
    loadGoogleTag();
    return;
  }

  // Changing Accept to Reject: tell the tag, delete its cookies and reload, so
  // the tag is no longer on the page at all.
  if (googleLoaded || previous === 'granted') {
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    }
    clearGoogleCookies();
    window.location.reload();
  }
}

// Lets any "Cookie settings" link reopen the banner so a visitor can change
// their mind as easily as they gave the answer.
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
