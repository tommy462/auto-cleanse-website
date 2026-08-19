import { Phone, MessageCircle, Clock, AlertTriangle, Check, ArrowDown } from 'lucide-react';
import Reviews from '../Reviews';
import { getReviews, DPF_TOWN_REVIEW_IDS } from '../../data/reviews';
import {
  OFFER_INCLUDES,
  PROCESS_STEPS,
  PROCESS_CAVEAT,
  REMOVAL_REQUIREMENT,
  TURNAROUND,
  WHY_FREE,
  PARTNERSHIP_STEPS,
  FINAL_CTA,
  TRADE_CONTACT,
  buildWhatsAppLink,
} from '../../data/trade-invite-regions';
import { trackTradeEvent } from '../../lib/trade-campaign';
import {
  scrollToClaimForm,
  scrollToId,
  TURNAROUND_TERMS_ID,
  PRIMARY_BTN,
  SECONDARY_BTN,
  type RegionSectionProps,
} from './shared';

// ── 4. What the free service includes ───────────────────────────────────────

export function IncludedProcess({ region }: RegionSectionProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
        What the Free Service Includes
      </h2>
      <p className="text-white/65 text-sm sm:text-base mb-8 max-w-3xl">
        {region.collectionAreaWording}
      </p>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PROCESS_STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl bg-[#1A1D22] border border-white/5 p-5"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF7A00]/15 text-[#FF7A00] font-black text-sm mb-3">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-white font-bold text-base mb-1.5">{step.title}</h3>
            <p className="text-white/65 text-sm leading-relaxed">{step.copy}</p>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl bg-[#111317] border border-white/5 p-5 sm:p-6 mb-4">
        <h3 className="text-white font-bold text-base mb-3">Everything below is included, free</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {OFFER_INCLUDES.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-white/75 text-sm">
              <Check size={16} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-[#FF7A00]/[0.06] border border-[#FF7A00]/20 p-5 space-y-3">
        <p className="text-white/75 text-sm leading-relaxed flex items-start gap-2.5">
          <AlertTriangle size={16} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
          <span>{REMOVAL_REQUIREMENT}</span>
        </p>
        <p className="text-white/75 text-sm leading-relaxed flex items-start gap-2.5">
          <AlertTriangle size={16} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
          <span>{PROCESS_CAVEAT}</span>
        </p>
      </div>
    </section>
  );
}

// ── 5. Same-day turnaround ──────────────────────────────────────────────────

export function TurnaroundGuarantee({ region, campaign }: RegionSectionProps) {
  return (
    <section className="border-y border-white/5 bg-[#111317]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/30 px-4 py-1.5 mb-5">
          <Clock size={16} className="text-[#FF7A00]" aria-hidden="true" />
          <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest">
            Turnaround Guarantee
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight mb-5">
          {TURNAROUND.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 p-5">
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-2">
              Collected before 12:00 PM
            </p>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">{TURNAROUND.before}</p>
          </div>
          <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
            <p className="text-white/55 text-xs font-bold uppercase tracking-widest mb-2">
              Collected after 12:00 PM
            </p>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed">{TURNAROUND.after}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            trackTradeEvent('turnaround_terms_view', region, campaign);
            scrollToId(TURNAROUND_TERMS_ID);
          }}
          className="mt-5 text-sm font-semibold text-[#FF7A00] underline underline-offset-4 hover:text-[#FF9500] min-h-[44px] inline-flex items-center"
        >
          Read the turnaround terms
        </button>
      </div>
    </section>
  );
}

// ── 6. Why the first clean is free ──────────────────────────────────────────

export function WhyFree() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-4">
        {WHY_FREE.heading}
      </h2>
      <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-3xl mb-4">
        {WHY_FREE.copy}
      </p>
      <p className="text-[#FF7A00] font-bold text-base">{WHY_FREE.supporting}</p>
    </section>
  );
}

// ── 7. How the ongoing trade relationship works ─────────────────────────────

export function PartnershipSteps() {
  return (
    <section className="border-y border-white/5 bg-[#111317]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-8">
          How the Ongoing Trade Relationship Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PARTNERSHIP_STEPS.map((step, i) => (
            <div key={step.title} className="rounded-2xl bg-[#1A1D22] border border-white/5 p-6">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#FF7A00]/15 text-[#FF7A00] font-black mb-4">
                {i + 1}
              </span>
              <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 8. Trust and evidence (genuine reviews + genuine workshop photo only) ───

export function TradeTrust() {
  // Exactly three genuine Google reviews from the existing reviews dataset.
  const reviews = getReviews(DPF_TOWN_REVIEW_IDS).slice(0, 3);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Reviews
        reviews={reviews}
        heading={
          <>
            What Customers Say About <span className="text-[#FF7A00]">Auto-Cleanse</span>
          </>
        }
        intro="Genuine Google reviews from Auto-Cleanse customers."
        columns={3}
        showGoogleCta
        showCallCta={false}
        showContactCta={false}
        showInternalLinks={false}
      />
    </section>
  );
}

// ── 11. Final CTA ───────────────────────────────────────────────────────────

export function FinalTradeCta({ region, campaign }: RegionSectionProps) {
  const whatsappLink = buildWhatsAppLink(region);

  return (
    <section className="border-t border-white/5 bg-[#111317]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight mb-4">
          {FINAL_CTA.heading}
        </h2>
        <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-7">
          {FINAL_CTA.supporting}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              trackTradeEvent('free_dpf_cta_click', region, campaign, { cta_location: 'final' });
              scrollToClaimForm();
            }}
            className={PRIMARY_BTN}
          >
            Claim My Free DPF Clean <ArrowDown size={18} aria-hidden="true" />
          </button>
          <a
            href={TRADE_CONTACT.phoneHref}
            onClick={() => trackTradeEvent('trade_phone_click', region, campaign, { cta_location: 'final' })}
            className={SECONDARY_BTN}
          >
            <Phone size={18} aria-hidden="true" /> Call Auto-Cleanse
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackTradeEvent('trade_whatsapp_click', region, campaign, { cta_location: 'final' })}
            className={SECONDARY_BTN}
          >
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp Auto-Cleanse
          </a>
        </div>
      </div>
    </section>
  );
}

// ── 10. Direct contact section ──────────────────────────────────────────────

export function DirectContact({ region, campaign }: RegionSectionProps) {
  const whatsappLink = buildWhatsAppLink(region);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-6">
        Speak to Auto-Cleanse Directly
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href={TRADE_CONTACT.phoneHref}
          onClick={() => trackTradeEvent('trade_phone_click', region, campaign, { cta_location: 'contact_section' })}
          className="rounded-2xl bg-[#1A1D22] border border-white/5 p-5 hover:border-[#FF7A00]/40 transition-colors min-h-[96px] flex flex-col justify-center"
        >
          <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-1">
            Workshop
          </span>
          <span className="text-white font-bold text-lg inline-flex items-center gap-2">
            <Phone size={18} className="text-[#FF7A00]" aria-hidden="true" />
            {TRADE_CONTACT.phoneDisplay}
          </span>
        </a>

        <a
          href={TRADE_CONTACT.mobileHref}
          onClick={() => trackTradeEvent('trade_phone_click', region, campaign, { cta_location: 'contact_section_mobile' })}
          className="rounded-2xl bg-[#1A1D22] border border-white/5 p-5 hover:border-[#FF7A00]/40 transition-colors min-h-[96px] flex flex-col justify-center"
        >
          <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-1">
            Mobile
          </span>
          <span className="text-white font-bold text-lg inline-flex items-center gap-2">
            <Phone size={18} className="text-[#FF7A00]" aria-hidden="true" />
            {TRADE_CONTACT.mobileDisplay}
          </span>
        </a>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackTradeEvent('trade_whatsapp_click', region, campaign, { cta_location: 'contact_section' })}
          className="rounded-2xl bg-[#1A1D22] border border-white/5 p-5 hover:border-[#FF7A00]/40 transition-colors min-h-[96px] flex flex-col justify-center"
        >
          <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-1">
            WhatsApp
          </span>
          <span className="text-white font-bold text-lg inline-flex items-center gap-2">
            <MessageCircle size={18} className="text-[#FF7A00]" aria-hidden="true" />
            {TRADE_CONTACT.mobileDisplay}
          </span>
        </a>
      </div>
      <p className="text-white/50 text-sm mt-4">{TRADE_CONTACT.website}</p>
    </section>
  );
}
