import { useEffect } from 'react';
import { trackCall, trackEvent } from '../lib/tracking';

// Renders nothing. Attaches a single delegated click listener so any phone
// link on the site (header, footer, sticky bar, location pages, 404) reports a
// call conversion without each button needing its own handler. WhatsApp and
// text links are reported too, so every contact route can be compared.
export default function LeadTracking() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href^="tel:"], a[href^="https://wa.me/"], a[href^="sms:"]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('tel:')) {
        trackCall({ link_url: href, page_path: window.location.pathname });
      } else {
        trackEvent('contact_click', {
          method: href.startsWith('sms:') ? 'sms' : 'whatsapp',
          page_path: window.location.pathname,
        });
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return null;
}
