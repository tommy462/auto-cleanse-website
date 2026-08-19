import { useEffect, useState } from 'react';
import { Phone, ArrowDown } from 'lucide-react';
import { TRADE_CONTACT } from '../../data/trade-invite-regions';
import { trackTradeEvent } from '../../lib/trade-campaign';
import { CLAIM_FORM_ID, scrollToClaimForm, type RegionSectionProps } from './shared';

/**
 * Sticky mobile CTA for the campaign pages. It hides itself whenever the claim
 * form is on screen, so it never covers the form fields, and a matching spacer
 * keeps it from covering page content.
 *
 * The site-wide MobileCallBar is suppressed on these routes so only one sticky
 * bar is ever shown.
 */
export default function StickyMobileCta({ region, campaign }: RegionSectionProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const form = document.getElementById(CLAIM_FORM_ID);
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: '0px 0px -20% 0px' }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Spacer so the fixed bar never covers the end of the page on mobile */}
      <div className="h-[68px] lg:hidden" aria-hidden="true" />

      <div
        className={`lg:hidden fixed bottom-0 inset-x-0 z-50 flex items-stretch gap-px border-t border-white/10 bg-[#1A1D22] pb-[env(safe-area-inset-bottom)] transition-opacity duration-200 ${
          hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            trackTradeEvent('free_dpf_cta_click', region, campaign, { cta_location: 'sticky_mobile' });
            scrollToClaimForm();
          }}
          className="flex-[2] flex items-center justify-center gap-2 py-4 gradient-orange text-white font-bold text-sm min-h-[56px]"
        >
          Claim Free DPF Clean <ArrowDown size={16} aria-hidden="true" />
        </button>
        <a
          href={TRADE_CONTACT.phoneHref}
          onClick={() => trackTradeEvent('trade_phone_click', region, campaign, { cta_location: 'sticky_mobile' })}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#0A0A0A] text-white font-bold text-sm min-h-[56px]"
          aria-label={`Call Auto-Cleanse on ${TRADE_CONTACT.phoneDisplay}`}
        >
          <Phone size={16} className="text-[#FF7A00]" aria-hidden="true" /> Call
        </a>
      </div>
    </>
  );
}
