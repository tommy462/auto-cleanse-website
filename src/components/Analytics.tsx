import { useEffect } from 'react';
import { GA4_MEASUREMENT_ID } from '../config/leads';

// A real GA4 measurement ID looks like "G-XXXXXXXXXX".
const isValidGa4Id = (id: string) => /^G-[A-Z0-9]{4,}$/i.test(id);

// Loads GA4 only when a valid measurement ID is provided via env. If the ID is
// missing or a placeholder, this is a complete no-op — nothing is requested and
// nothing breaks. Works independently of the Google Ads tag, so the site is not
// dependent on Ads being active.
export default function Analytics() {
  useEffect(() => {
    const id = GA4_MEASUREMENT_ID;
    if (!isValidGa4Id(id)) return;

    const w = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    w.dataLayer = w.dataLayer || [];
    if (typeof w.gtag !== 'function') {
      w.gtag = (...args: unknown[]) => {
        w.dataLayer!.push(args);
      };
    }

    // Inject the GA4 library once (it may already be present from the Ads tag).
    const libSrc = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    if (!document.querySelector(`script[src="${libSrc}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = libSrc;
      document.head.appendChild(script);
    }

    w.gtag('js', new Date());
    w.gtag('config', id);
  }, []);

  return null;
}
