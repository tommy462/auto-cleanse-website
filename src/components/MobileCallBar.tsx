import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { DPF_FITTED_WHATSAPP } from '../data/dpf-fitting';
import { useNationalPage } from '../lib/use-national-page';

// Pre-filled so the first message already carries what we need to quote.
const WHATSAPP_HREF = `https://wa.me/447823649190?text=${encodeURIComponent('Hi Auto-Cleanse, I need a quote. Reg: . Postcode: . What\'s the problem: ')}`;

// Pages that get a service-specific second action instead of the generic
// "Enquire" link. Keeps a single sticky bar site-wide (no stacking) while
// letting a paid-search landing page push its own conversion.
// DPF pages: a fitted DPF job is priced from the registration, so the second button is a
// WhatsApp message pre-filled for that quote (it used to open /book, whose DPF card led to
// the postal form, which suits nobody who needs the filter taken off).
const DPF_QUOTE = { href: DPF_FITTED_WHATSAPP, label: 'WhatsApp a price' };
const CTA_OVERRIDES: Record<string, { href: string; label: string }> = {
  '/dpf-cleaning': DPF_QUOTE,
  '/dpf-cleaning-exeter': DPF_QUOTE,
  '/dpf-cleaning-plymouth': DPF_QUOTE,
  '/dpf-cleaning-torquay': DPF_QUOTE,
  '/dpf-cleaning-newton-abbot': DPF_QUOTE,
  '/dpf-cleaning-paignton': DPF_QUOTE,
};

// Sticky bottom call/enquire bar shown on mobile and tablet (hidden on lg+).
// Gives phone-led visitors a one-tap way to call or book from any page.
export default function MobileCallBar() {
  const { pathname } = useLocation();
  const { hasEnquiryForm } = useNationalPage();

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
          href="tel:07823649190"
          onClick={() =>
            override &&
            trackEvent('dpf_cta_click', {
              cta_location: 'sticky_bar',
              cta_type: 'phone',
              page_path: pathname,
            })
          }
          className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[56px] gradient-orange text-white font-bold text-sm"
          aria-label="Call AutoCleanse on 07823 649190"
        >
          <Phone size={18} /> Call Now
        </a>
        {override ? (
          <a
            href={override.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('dpf_cta_click', {
                cta_location: 'sticky_bar',
                cta_type: 'whatsapp',
                page_path: pathname,
              })
            }
            className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[56px] bg-[#0A0A0A] text-white font-bold text-sm hover:text-[#FF7A00] transition-colors"
            aria-label={`${override.label} on WhatsApp`}
          >
            <MessageCircle size={18} className="text-[#25D366]" /> {override.label}
          </a>
        ) : (
          <>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[56px] bg-[#0A0A0A] text-white font-bold text-sm hover:text-[#FF7A00] transition-colors"
              aria-label="Message AutoCleanse on WhatsApp"
            >
              <MessageCircle size={18} className="text-[#25D366]" /> WhatsApp
            </a>
            {/* AdBlue pages have their own enquiry form, which tags the town or
                topic, so Enquire jumps to it instead of the generic contact page. */}
            {hasEnquiryForm ? (
              <a
                href="#enquiry"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[56px] bg-[#0A0A0A] text-white font-bold text-sm hover:text-[#FF7A00] transition-colors"
                aria-label="Send an enquiry to AutoCleanse"
              >
                <Mail size={18} className="text-[#FF7A00]" /> Enquire
              </a>
            ) : (
              <Link
                to="/contact"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[56px] bg-[#0A0A0A] text-white font-bold text-sm hover:text-[#FF7A00] transition-colors"
                aria-label="Send an enquiry to AutoCleanse"
              >
                <Mail size={18} className="text-[#FF7A00]" /> Enquire
              </Link>
            )}
          </>
        )}
      </div>
    </>
  );
}
