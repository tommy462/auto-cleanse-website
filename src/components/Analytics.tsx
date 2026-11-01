import { useEffect } from 'react';
import { loadMeasurement, readConsent } from '../lib/consent';

// Returning visitors who accepted cookies on an earlier visit get the Google
// tag (Ads + GA4) and, if that Accept covered it, Clarity (see src/lib/consent.ts)
// without being asked again. It is
// fetched on the first interaction or when the page goes idle, so third-party
// JS stays off the critical path. Everyone else gets nothing from Google until
// they accept in the cookie banner.
export default function Analytics() {
  useEffect(() => {
    if (readConsent() !== 'granted') return;

    const events = ['pointerdown', 'touchstart', 'keydown', 'scroll'] as const;
    const load = () => {
      events.forEach((evt) => window.removeEventListener(evt, load));
      loadMeasurement();
    };
    events.forEach((evt) => window.addEventListener(evt, load, { once: true, passive: true }));

    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if ('requestIdleCallback' in window) {
      idle = window.requestIdleCallback(load, { timeout: 5000 });
    } else {
      timer = setTimeout(load, 4000);
    }

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, load));
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  return null;
}
