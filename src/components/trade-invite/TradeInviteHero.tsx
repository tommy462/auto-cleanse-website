import { Phone, MessageCircle, ShieldCheck, Tag, CalendarClock, ArrowDown } from 'lucide-react';
import {
  TRADE_OFFER,
  TRADE_CONTACT,
  buildWhatsAppLink,
  offerExpiryFor,
} from '../../data/trade-invite-regions';
import { trackTradeEvent } from '../../lib/trade-campaign';
import {
  scrollToClaimForm,
  PRIMARY_BTN,
  SECONDARY_BTN,
  type RegionSectionProps,
} from './shared';

// ── 1. Private trade invitation banner ──────────────────────────────────────

export function PrivateInvitationBanner() {
  return (
    <div className="bg-[#FF7A00] text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-center">
        <p className="text-sm sm:text-base font-black uppercase tracking-wide">
          Private Trade Invitation
        </p>
        <p className="text-xs sm:text-sm font-medium mt-0.5 text-black/80">
          You have accessed this page through Auto-Cleanse&rsquo;s South West garage outreach campaign.
        </p>
      </div>
    </div>
  );
}

// ── 2. Regional hero ────────────────────────────────────────────────────────

export function TradeInviteHero({ region, campaign }: RegionSectionProps) {
  const whatsappLink = buildWhatsAppLink(region);

  return (
    <section className="relative overflow-hidden border-b border-white/5">
      {/* Genuine Auto-Cleanse workshop photograph */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/about-workshop.webp')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[#0A0A0A]/85"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <p className="text-[#FF7A00] text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
          Trade DPF Cleaning &middot; {region.regionName}
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4">
          {region.headline}
        </h1>

        <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-3xl mb-6">
          {region.openingCopy}
        </p>

        {/* The offer, stated immediately */}
        <div className="rounded-2xl border border-[#FF7A00]/40 bg-[#FF7A00]/10 p-4 sm:p-5 mb-6">
          <p className="text-white font-black text-lg sm:text-2xl leading-snug">
            Your First Trade DPF Clean Is Completely Free
          </p>
          <p className="text-white/70 text-sm mt-1">{region.serviceEmphasis}</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              trackTradeEvent('free_dpf_cta_click', region, campaign, { cta_location: 'hero' });
              scrollToClaimForm();
            }}
            className={PRIMARY_BTN}
          >
            Claim My Free DPF Clean <ArrowDown size={18} aria-hidden="true" />
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackTradeEvent('trade_whatsapp_click', region, campaign, { cta_location: 'hero' })}
            className={SECONDARY_BTN}
          >
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp Us
          </a>

          <a
            href={TRADE_CONTACT.phoneHref}
            onClick={() => trackTradeEvent('trade_phone_click', region, campaign, { cta_location: 'hero' })}
            className={SECONDARY_BTN}
          >
            <Phone size={18} aria-hidden="true" /> {TRADE_CONTACT.phoneDisplay}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-2 text-white">
            <Tag size={16} className="text-[#FF7A00]" aria-hidden="true" />
            Invitation code:{' '}
            <strong className="font-mono font-bold tracking-wider text-[#FF7A00]">
              {region.invitationCode}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2 text-white/65">
            <ShieldCheck size={16} className="text-[#FF7A00]" aria-hidden="true" />
            {TRADE_OFFER.noContractLine}
          </span>
        </div>
      </div>
    </section>
  );
}

// ── 3. Free-service offer card ──────────────────────────────────────────────

export function FreeOfferCard({ region, campaign }: RegionSectionProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
      <div className="rounded-2xl border-2 border-[#FF7A00] bg-[#111317] p-5 sm:p-8 shadow-2xl shadow-black/60">
        <p className="text-[#FF7A00] text-lg sm:text-2xl font-black tracking-tight mb-3">
          {TRADE_OFFER.cardTitle}
        </p>

        <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-5">
          {TRADE_OFFER.cardBody}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl bg-black/40 border border-white/10 p-3">
            <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-1">
              Invitation code
            </p>
            <p className="text-[#FF7A00] font-mono font-bold tracking-wider text-base">
              {region.invitationCode}
            </p>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/10 p-3">
            <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-1">
              Offer expires
            </p>
            <p className="text-white font-bold text-base inline-flex items-center gap-1.5">
              <CalendarClock size={15} className="text-[#FF7A00]" aria-hidden="true" />
              {offerExpiryFor(region)}
            </p>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/10 p-3">
            <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-1">
              Your cost
            </p>
            <p className="text-white font-bold text-base">{TRADE_OFFER.noChargeLine}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            trackTradeEvent('free_dpf_cta_click', region, campaign, { cta_location: 'offer_card' });
            scrollToClaimForm();
          }}
          className={`${PRIMARY_BTN} sm:w-full`}
        >
          Claim My Free DPF Clean <ArrowDown size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
