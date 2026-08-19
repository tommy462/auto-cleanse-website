// Shared ids, scroll helpers, button classes and props for the private
// trade-outreach campaign components. Kept out of the component files so React
// Fast Refresh stays granular.
import type { TradeInviteRegion } from '../../data/trade-invite-regions';
import type { CampaignParams } from '../../lib/trade-campaign';

export const CLAIM_FORM_ID = 'claim-free-dpf-clean';
export const TURNAROUND_TERMS_ID = 'turnaround-terms';
export const OFFER_TERMS_ID = 'offer-terms';

export interface RegionSectionProps {
  region: TradeInviteRegion;
  campaign: CampaignParams;
}

/** Scrolls an element into view, respecting reduced-motion preferences. */
export function scrollToId(id: string): void {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** Scrolls to the free-DPF claim form. */
export function scrollToClaimForm(): void {
  scrollToId(CLAIM_FORM_ID);
}

// Large touch targets, because most visitors arrive by scanning a printed QR code.
export const PRIMARY_BTN =
  'w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-4 rounded-xl font-bold text-white btn-shine text-base';
export const SECONDARY_BTN =
  'w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-4 rounded-xl font-bold text-white border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/30 transition-colors text-base';
