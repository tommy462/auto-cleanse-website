import { FileText, Clock } from 'lucide-react';
import {
  OFFER_TERMS,
  TURNAROUND_TERMS,
  TRADE_OFFER,
  offerExpiryFor,
} from '../../data/trade-invite-regions';
import { TURNAROUND_TERMS_ID, OFFER_TERMS_ID, type RegionSectionProps } from './shared';

// Both term sets are rendered as plain, readable sections, deliberately not
// collapsed or hidden behind a modal, while the commercial message above stays
// simple. Both are centrally managed in src/data/trade-invite-regions.ts.

export function TurnaroundTerms() {
  return (
    <section
      id={TURNAROUND_TERMS_ID}
      className="max-w-5xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20"
    >
      <div className="rounded-2xl bg-[#111317] border border-white/5 p-5 sm:p-7">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 inline-flex items-center gap-2">
          <Clock size={18} className="text-[#FF7A00]" aria-hidden="true" />
          Turnaround Terms
        </h2>
        <ul className="space-y-2.5">
          {TURNAROUND_TERMS.map((term) => (
            <li key={term} className="text-white/65 text-sm leading-relaxed flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shrink-0 mt-[7px]" aria-hidden="true" />
              <span>{term}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function OfferTerms({ region }: RegionSectionProps) {
  return (
    <section
      id={OFFER_TERMS_ID}
      className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 scroll-mt-20"
    >
      <div className="rounded-2xl bg-[#111317] border border-white/5 p-5 sm:p-7">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 inline-flex items-center gap-2">
          <FileText size={18} className="text-[#FF7A00]" aria-hidden="true" />
          Free Offer Terms
        </h2>
        <p className="text-white/55 text-sm mb-4">
          {TRADE_OFFER.title}. Offer expires {offerExpiryFor(region)}. Invitation code{' '}
          <span className="font-mono font-semibold text-[#FF7A00]">{region.invitationCode}</span>.
        </p>
        <ul className="space-y-2.5">
          {OFFER_TERMS.map((term) => (
            <li key={term} className="text-white/65 text-sm leading-relaxed flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shrink-0 mt-[7px]" aria-hidden="true" />
              <span>{term}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
