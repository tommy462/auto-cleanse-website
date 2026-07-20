import {
  RECENT_REMAPS,
  RECENT_REMAPS_FRAMING,
  type RemapCard,
} from '../data/campaign';
import { Wrench } from 'lucide-react';

// ── DPF-Specialist Trust Signal ──────────────────────────────────────────────
// Position: immediately after the "Why choose us" section.
// Self-contained section block - drop it between any two sections.

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
              We're DPF specialists who remap. Every remap we apply is chosen to
              protect your filter - because we're the ones who clean them when
              they fail. Hundreds of DPFs cleaned across Devon, and that
              experience goes into every remap we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Recent Remaps ────────────────────────────────────────────────────────────
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
          <span className="text-xs font-medium text-white/60 bg-white/[0.04] px-3 py-1 rounded-full">
            {card.serviceType}
          </span>
        )}
      </div>
      <p className="text-white font-bold text-base mb-3">{card.vehicle}</p>
      <p className="text-white/55 text-sm leading-relaxed">
        &ldquo;{card.ownerNote}&rdquo;
      </p>
      {card.customerQuote && (
        <p className="mt-3 text-white/60 text-xs leading-relaxed border-t border-white/5 pt-3">
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
            <p className="text-white/60 text-sm mt-2 max-w-xl leading-relaxed">
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
