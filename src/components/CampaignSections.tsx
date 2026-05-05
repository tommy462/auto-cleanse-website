import { Link } from 'react-router-dom';
import { Tag, ArrowRight, Wrench } from 'lucide-react';
import MagneticButton from './MagneticButton';
import {
  MAY_OFFER,
  RECENT_REMAPS,
  RECENT_REMAPS_FRAMING,
  type RemapCard,
} from '../data/campaign';

// ── Element 1: May Launch Offer Banner ───────────────────────────────────────
// Position: between hero and the first content section.
// Renders the £199 offer when slots remain; switches to "fully booked" once
// slotsRemaining hits 0 in campaign.ts.

export function MayOfferBanner() {
  const { slotsRemaining, slotsTotal } = MAY_OFFER;

  if (slotsRemaining <= 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 px-7 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
            <Tag size={15} className="text-white/30" />
          </div>
          <p className="text-white/55 text-sm font-semibold flex-1">
            May offer fully booked —{' '}
            <span className="text-white">June bookings now open</span>
          </p>
          <MagneticButton className="shrink-0">
            <Link
              to="/remapping-booking"
              className="btn-shine px-5 py-2.5 rounded-xl font-bold text-xs text-white inline-flex items-center gap-2"
            >
              Book for June <ArrowRight size={11} />
            </Link>
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="rounded-3xl bg-[#FF7A00]/[0.09] border border-[#FF7A00]/30 p-7 sm:p-9 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FF7A00]/20 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          {/* Label pill */}
          <div className="inline-flex items-center gap-2 bg-[#FF7A00] text-white text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
            <Tag size={10} />
            May Launch Offer
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-white text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-1.5">
                £199 ECU Remap
              </p>
              <p className="text-white/75 text-sm font-semibold mb-1">
                Devon's DPF-Specialist Remapper
              </p>
              <p className="text-white/40 text-xs">
                May only&nbsp;&nbsp;·&nbsp;&nbsp;Normal rates from June&nbsp;&nbsp;·&nbsp;&nbsp;Limited bookings
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
              <MagneticButton>
                <Link
                  to="/remapping-booking"
                  className="btn-shine px-6 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2"
                >
                  Claim Slot <ArrowRight size={13} />
                </Link>
              </MagneticButton>
              <p className="text-white/50 text-xs font-medium">
                <span className="text-[#FF7A00] font-bold">{slotsRemaining}</span>
                {' '}of {slotsTotal} slots remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Element 2: DPF-Specialist Trust Signal ───────────────────────────────────
// Position: immediately after the "Why choose us" section.
// Self-contained section block — drop it between any two sections.

export function DpfTrustSignal() {
  return (
    <section className="pb-4 border-t-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#FF7A00]/[0.06] border border-[#FF7A00]/20 p-6 sm:p-8 flex items-start gap-5">
          <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/15 flex items-center justify-center shrink-0 mt-0.5">
            <Wrench size={17} className="text-[#FF7A00]" />
          </div>
          <div>
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-2">
              DPF Specialists First
            </p>
            <p className="text-white/65 text-sm leading-relaxed">
              We're DPF specialists who remap. Every map we write is tuned to
              protect your filter — because we're the ones who clean them when
              they fail. Hundreds of DPFs cleaned across Devon, and that
              experience goes into every remap we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Element 3: Recent Remaps ─────────────────────────────────────────────────
// Position: after DpfTrustSignal, before the FAQ section.
// Add new entries to RECENT_REMAPS in campaign.ts as jobs complete.

function RemapCardItem({ card }: { card: RemapCard }) {
  return (
    <div className="rounded-2xl bg-[#1A1D22] border border-white/5 p-6 hover:border-white/10 transition-colors">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-bold bg-[#FF7A00]/10 text-[#FF7A00] px-3 py-1 rounded-full">
          {card.month}
        </span>
        {card.serviceType && (
          <span className="text-xs font-medium text-white/35 bg-white/[0.04] px-3 py-1 rounded-full">
            {card.serviceType}
          </span>
        )}
      </div>
      <p className="text-white font-bold text-base mb-3">{card.vehicle}</p>
      <p className="text-white/55 text-sm leading-relaxed">
        &ldquo;{card.ownerNote}&rdquo;
      </p>
      {card.customerQuote && (
        <p className="mt-3 text-white/35 text-xs leading-relaxed border-t border-white/5 pt-3">
          Customer: &ldquo;{card.customerQuote}&rdquo;
        </p>
      )}
    </div>
  );
}

export function RecentRemaps() {
  if (RECENT_REMAPS.length === 0) return null;

  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">
            Recent Remaps
          </p>
          <h2 className="text-2xl font-black tracking-tighter text-white">
            Recent Customer Remaps
          </h2>
          {RECENT_REMAPS_FRAMING && (
            <p className="text-white/40 text-sm mt-2 max-w-xl leading-relaxed">
              {RECENT_REMAPS_FRAMING}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RECENT_REMAPS.map((card, i) => (
            <RemapCardItem key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
