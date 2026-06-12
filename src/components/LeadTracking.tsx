import { useEffect } from 'react';
import { trackCall } from '../lib/tracking';

// Renders nothing. Attaches a single delegated click listener so any phone
// link on the site (header, footer, sticky bar, location pages, 404) reports a
// call conversion without each button needing its own handler.
export default function LeadTracking() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (link) {
        trackCall({ link_url: link.getAttribute('href') ?? '', page_path: window.location.pathname });
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return null;
}
