import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OPEN_COOKIE_SETTINGS_EVENT, readConsent, saveConsent, type ConsentChoice } from '../lib/consent';

// Small cookie choice card. It only renders after hydration, so the prerendered
// HTML is unchanged, and it is fixed in place, so it never shifts the page.
// Sits above the sticky call bar on phones and bottom-left on desktop (the chat
// button is bottom-right). Reject and Accept get equal weight. Google Ads and
// Analytics load only after Accept (src/lib/consent.ts).
export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    if (readConsent() === null) setOpen(true);
    const reopen = () => {
      setCurrent(readConsent());
      setOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie choices"
      className="fixed inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] z-[60] rounded-2xl border border-white/10 bg-[#1A1D22] p-4 shadow-2xl lg:inset-x-auto lg:left-6 lg:bottom-6 lg:w-[22rem]"
    >
      <p className="text-white/80 text-sm leading-relaxed">
        Can we use Google cookies to see which of our ads and pages bring in enquiries? Google
        Analytics and Ads only load if you accept. The site works the same either way.{' '}
        <Link to="/cookie-policy" className="text-[#FF7A00] underline underline-offset-2">
          Cookie policy
        </Link>
      </p>
      {current && (
        <p className="mt-2 text-white/50 text-xs">
          Your current choice: {current === 'granted' ? 'Accept' : 'Reject'}
        </p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="min-h-[44px] rounded-xl border border-white/25 text-white text-sm font-bold hover:border-white/50 transition-colors"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="min-h-[44px] rounded-xl gradient-orange text-white text-sm font-bold"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
