import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, CalendarClock } from 'lucide-react';
import { trackEvent } from '../lib/tracking';

// Pages that get a service-specific second action instead of the generic
// "Enquire" link. Keeps a single sticky bar site-wide (no stacking) while
// letting a paid-search landing page push its own conversion.
const CTA_OVERRIDES: Record<string, { to: string; label: string }> = {
  '/dpf-cleaning': { to: '/book', label: 'Book DPF Clean' },
  '/dpf-cleaning-exeter': { to: '/book', label: 'Book DPF Clean' },
  '/dpf-cleaning-plymouth': { to: '/book', label: 'Book DPF Clean' },
  '/dpf-cleaning-torquay': { to: '/book', label: 'Book DPF Clean' },
  '/dpf-cleaning-newton-abbot': { to: '/book', label: 'Book DPF Clean' },
  '/dpf-cleaning-paignton': { to: '/book', label: 'Book DPF Clean' },
};

// Sticky bottom call/enquire bar shown on mobile and tablet (hidden on lg+).
// Gives phone-led visitors a one-tap way to call or book from any page.
export default function MobileCallBar() {
  const { pathname } = useLocation();

  // The private trade-invite campaign pages render their own campaign-specific
  // sticky CTA ("Claim Free DPF Clean"), so the site-wide bar is suppressed
  // there, otherwise two sticky bars would stack on mobile.
  if (pathname.startsWith('/trade-invite/')) return null;

  const override = CTA_OVERRIDES[pathname.replace(/\/+$/, '') || '/'];

  return (
    <>
      {/* Spacer keeps the fixed bar from covering page/footer content on mobile.
          It also has to absorb the safe-area inset, or the bar overlaps the last
          few pixels of content on notched iPhones. */}
      <div
        className="h-16 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-hidden="true"
      />

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex items-stretch gap-px border-t border-white/10 bg-[#1A1D22] pb-[env(safe-area-inset-bottom)]">
        <a
          href="tel:01803269895"
          onClick={() =>
            override &&
            trackEvent('dpf_cta_click', {
              cta_location: 'sticky_bar',
              cta_type: 'phone',
              page_path: pathname,
            })
          }
          className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[56px] gradient-orange text-white font-bold text-sm"
          aria-label="Call AutoCleanse on 01803 269895"
        >
          <Phone size={18} /> Call Now
        </a>
        {override ? (
          <Link
            to={override.to}
            onClick={() =>
              trackEvent('dpf_cta_click', {
                cta_location: 'sticky_bar',
                cta_type: 'booking',
                page_path: pathname,
              })
            }
            className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[56px] bg-[#0A0A0A] text-white font-bold text-sm hover:text-[#FF7A00] transition-colors"
            aria-label={override.label}
          >
            <CalendarClock size={18} className="text-[#FF7A00]" /> {override.label}
          </Link>
        ) : (
          <Link
            to="/contact"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[56px] bg-[#0A0A0A] text-white font-bold text-sm hover:text-[#FF7A00] transition-colors"
            aria-label="Send an enquiry to AutoCleanse"
          >
            <Mail size={18} className="text-[#FF7A00]" /> Enquire
          </Link>
        )}
      </div>
    </>
  );
}
