// Cookie consent for the Google tag (Google Ads, and GA4 when enabled). The tag
// starts in Consent Mode with everything denied (see the inline script in
// index.html, which reads the same storage key) and only stores cookies after
// the visitor accepts in the cookie banner.
export const CONSENT_STORAGE_KEY = 'ac-cookie-consent';
export const OPEN_COOKIE_SETTINGS_EVENT = 'ac:open-cookie-settings';

export type ConsentChoice = 'granted' | 'denied';

export function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked (private mode, site data cleared): the choice still
    // applies to this visit, the banner just asks again next time.
  }
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      ad_storage: choice,
      ad_user_data: choice,
      ad_personalization: choice,
      analytics_storage: choice,
    });
  }
}

// Lets any "Cookie settings" link reopen the banner so a visitor can change
// their mind as easily as they gave the answer.
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
