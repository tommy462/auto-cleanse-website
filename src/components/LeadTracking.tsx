import { useEffect } from 'react';
import { trackCall, trackEvent } from '../lib/tracking';
import { clarityEvent } from '../lib/consent';

// Renders nothing. Attaches a single delegated click listener so any phone
// link on the site (header, footer, sticky bar, location pages, 404) reports a
// call conversion without each button needing its own handler. WhatsApp and
// text links are reported too, so every contact route can be compared, and so
// are taps on links into the remap booking page (a booking started, not made).
export default function LeadTracking() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href^="tel:"], a[href^="https://wa.me/"], a[href^="sms:"], a[href^="/remapping-booking"], a[href^="/book"]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('/remapping-booking') || href === '/book' || href.startsWith('/book?') || href.startsWith('/book#')) {
        if (window.location.pathname !== '/remapping-booking') {
          trackEvent('booking_click', { link_url: href, page_path: window.location.pathname });
        }
      } else if (href.startsWith('tel:')) {
        trackCall({ link_url: href, page_path: window.location.pathname });
      } else {
        trackEvent('contact_click', {
          method: href.startsWith('sms:') ? 'sms' : 'whatsapp',
          page_path: window.location.pathname,
        });
        clarityEvent('whatsapp_click', true);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return null;
}
