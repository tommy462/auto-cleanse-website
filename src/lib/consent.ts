// Cookie consent for the Google tag (Google Ads, and GA4 when enabled) and
// Microsoft Clarity (when a project ID is set).
// Nothing from Google or Microsoft loads until the visitor accepts in the
// cookie banner: no gtag.js, no Clarity script, no cookies and no "cookieless
// pings". The ICO's storage and access technologies guidance (April 2026) says
// advertising measurement and recordings of individual visits always need
// consent, so Consent Mode's "advanced" setup (tag loads, pings before consent)
// and Clarity's no-consent mode are not used. The cookie policy page
// (/cookie-policy) describes this file.
import { CLARITY_PROJECT_ID, GA4_MEASUREMENT_ID, GOOGLE_ADS_ID } from '../config/leads';

export const CONSENT_STORAGE_KEY = 'ac-cookie-consent';
// Which version of the banner the choice was given to. Version 2 added
// Microsoft Clarity, so an "Accept" given to version 1 still covers Google but
// not Clarity: those visitors are asked once more. A "Reject" stays a Reject.
export const CONSENT_VERSION_KEY = 'ac-cookie-consent-v';
export const CONSENT_VERSION = '2';
export const OPEN_COOKIE_SETTINGS_EVENT = 'ac:open-cookie-settings';

export type ConsentChoice = 'granted' | 'denied';

// A real GA4 measurement ID looks like "G-XXXXXXXXXX".
const isValidGa4Id = (id: string) => /^G-[A-Z0-9]{4,}$/i.test(id);
const isValidClarityId = (id: string) => /^[a-z0-9]{6,20}$/i.test(id);

let googleLoaded = false;
let clarityLoaded = false;

type ClarityFn = ((...a: unknown[]) => void) & { q?: unknown[] };

export function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

function readVersion(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_VERSION_KEY);
  } catch {
    return null;
  }
}

/** True when the banner should be shown: no answer yet, or an Accept given before Clarity was added. */
export function consentNeedsAsking(): boolean {
  const choice = readConsent();
  return choice === null || (choice === 'granted' && readVersion() !== CONSENT_VERSION && Boolean(CLARITY_PROJECT_ID));
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

// Loads Microsoft Clarity (heatmaps and session recordings). Form fields are
// masked by Clarity in every mode, and the forms, booking pages, chat and
// lookup results also carry data-clarity-mask so nothing typed or shown back is
// ever recorded.
function injectClarity() {
  if (clarityLoaded || typeof window === 'undefined' || !isValidClarityId(CLARITY_PROJECT_ID)) return;
  clarityLoaded = true;
  const w = window as unknown as { clarity?: ClarityFn };
  // Microsoft's standard snippet: queue calls until the script arrives.
  w.clarity = w.clarity || (function clarity(...args: unknown[]) {
    (w.clarity!.q = w.clarity!.q || []).push(args);
  } as ClarityFn);
  w.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  document.head.appendChild(s);
}

/** For returning visitors: only an Accept given to the current banner covers Clarity. */
export function loadClarity() {
  if (readConsent() !== 'granted' || readVersion() !== CONSENT_VERSION) return;
  injectClarity();
}

/** Loads everything the visitor has accepted. */
export function loadMeasurement() {
  loadGoogleTag();
  loadClarity();
}

/** Tags the current Clarity session (e.g. "lead_submitted") so recordings can be filtered by outcome. */
export function clarityEvent(name: string, prioritise = false) {
  if (typeof window === 'undefined') return;
  const c = (window as unknown as { clarity?: ClarityFn }).clarity;
  if (typeof c !== 'function') return;
  c('event', name);
  if (prioritise) c('upgrade', name);
}

// Removes the first-party Google and Clarity cookies (_ga, _ga_<id>, _gcl_au,
// _gcl_aw, _clck, _clsk...) from this host and every parent domain they may
// have been written to.
function clearMeasurementCookies() {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => /^(_ga|_gid|_gat|_gcl_|_clck|_clsk)/.test(n));
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
    window.localStorage.setItem(CONSENT_VERSION_KEY, CONSENT_VERSION);
  } catch {
    // Storage blocked (private mode, site data cleared): the choice still
    // applies to this visit, the banner just asks again next time.
  }

  if (choice === 'granted') {
    loadGoogleTag();
    // Just accepted in the current banner, so this covers Clarity even if storage is blocked.
    injectClarity();
    return;
  }

  // Changing Accept to Reject: tell the tags, delete their cookies and reload,
  // so neither is on the page at all.
  if (googleLoaded || clarityLoaded || previous === 'granted') {
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    }
    const clarity = (window as unknown as { clarity?: ClarityFn }).clarity;
    if (typeof clarity === 'function') {
      clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
      clarity('consent', false); // Microsoft: erases Clarity's cookies
    }
    clearMeasurementCookies();
    window.location.reload();
  }
}

// Lets any "Cookie settings" link reopen the banner so a visitor can change
// their mind as easily as they gave the answer.
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
