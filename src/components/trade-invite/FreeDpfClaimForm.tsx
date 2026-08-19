import React, { useRef, useState } from 'react';
import { Loader2, CheckCircle, Phone } from 'lucide-react';
import { TRADE_INVITE_WEBHOOK_URL } from '../../config/leads';
import { trackLead } from '../../lib/tracking';
import { trackTradeEvent } from '../../lib/trade-campaign';
import {
  TRADE_CONTACT,
  REMOVAL_REQUIREMENT,
  offerExpiryFor,
} from '../../data/trade-invite-regions';
import { CLAIM_FORM_ID, OFFER_TERMS_ID, type RegionSectionProps } from './shared';

type ContactMethod = 'Phone' | 'Email' | 'WhatsApp';

interface FormState {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  postcode: string;
  dpfDetails: string;
  collectionDate: string;
  preferredContact: ContactMethod;
  dpfReady: boolean;
  consent: boolean;
  termsAccepted: boolean;
  company: string; // honeypot
}

const initial: FormState = {
  businessName: '',
  contactName: '',
  phone: '',
  email: '',
  postcode: '',
  dpfDetails: '',
  collectionDate: '',
  preferredContact: 'Phone',
  dpfReady: false,
  consent: false,
  termsAccepted: false,
  company: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

const fieldClass =
  'w-full min-h-[48px] bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-colors';
const labelClass = 'block text-white/80 text-sm font-semibold mb-1.5';
const errorClass = 'mt-1.5 text-sm text-red-400';

function validate(d: FormState): Errors {
  const e: Errors = {};
  if (!d.businessName.trim()) e.businessName = 'Please enter your garage or business name.';
  if (!d.contactName.trim()) e.contactName = 'Please enter a contact name.';
  if (!d.phone.trim()) e.phone = 'Please enter a telephone number.';
  if (!d.email.trim()) e.email = 'Please enter an email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()))
    e.email = 'Please enter a valid email address.';
  if (!d.postcode.trim()) e.postcode = 'Please enter your business postcode.';
  if (!d.dpfReady) e.dpfReady = 'Please confirm the DPF will be removed and ready for collection.';
  if (!d.consent) e.consent = 'Please confirm Auto-Cleanse may contact you about this offer.';
  if (!d.termsAccepted) e.termsAccepted = 'Please accept the free-offer and turnaround terms.';
  return e;
}

export default function FreeDpfClaimForm({ region, campaign }: RegionSectionProps) {
  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const startedRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Fire free_dpf_form_start once, on the visitor's first interaction.
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackTradeEvent('free_dpf_form_start', region, campaign);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    markStarted();
    const target = e.target;
    const { name } = target;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;
    setData((d) => ({ ...d, [name]: value }));
    // Clear the error for a field as soon as the user edits it.
    setErrors((prev) => (prev[name as keyof FormState] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: real users never fill the hidden "company" field.
    if (data.company) return;
    // Guard against duplicate submissions while a request is in flight.
    if (status === 'submitting') return;

    const found = validate(data);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      trackTradeEvent('free_dpf_form_error', region, campaign, {
        error_fields: Object.keys(found).join(','),
      });
      // Move focus to the first invalid control for keyboard/screen-reader users.
      const firstKey = Object.keys(found)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(TRADE_INVITE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Clear label so this campaign is obvious in the inbox/automation.
          leadType: 'FREE TRADE DPF CLEAN LEAD',
          source: `trade-invite-${region.slug}`,
          submittedAt: new Date().toISOString(),

          // Campaign attribution
          region: region.regionName,
          regionSlug: region.slug,
          invitationCode: region.invitationCode,
          campaignId: region.campaignId,
          offerExpiry: offerExpiryFor(region),
          landingPageUrl: campaign.landingUrl || (typeof window !== 'undefined' ? window.location.href : ''),
          utmSource: campaign.utmSource,
          utmMedium: campaign.utmMedium,
          utmCampaign: campaign.utmCampaign,
          utmContent: campaign.utmContent,
          referrer: campaign.referrer,
          page: typeof window !== 'undefined' ? window.location.pathname : `/trade-invite/${region.slug}`,

          // Submitted details
          businessName: data.businessName,
          contactName: data.contactName,
          phone: data.phone,
          email: data.email,
          postcode: data.postcode,
          dpfDetails: data.dpfDetails,
          estimatedCollectionDate: data.collectionDate,
          preferredContactMethod: data.preferredContact,
          dpfRemovedAndReady: data.dpfReady,
          consentToContact: data.consent,
          acceptedOfferTerms: data.termsAccepted,
        }),
      });
      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      trackTradeEvent('free_dpf_form_submit', region, campaign, {
        preferred_contact: data.preferredContact,
      });
      // Keep the site's existing lead/conversion tracking working too.
      trackLead({
        service: 'Free Trade DPF Clean',
        source: `trade-invite-${region.slug}`,
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setData(initial);
    } catch {
      setStatus('error');
      trackTradeEvent('free_dpf_form_error', region, campaign, { error_type: 'submit_failed' });
    }
  };

  if (status === 'success') {
    return (
      <section id={CLAIM_FORM_ID} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
        <div className="rounded-2xl bg-[#1A1D22] border border-[#FF7A00]/30 p-8 text-center" role="status">
          <CheckCircle className="mx-auto mb-4 text-[#FF7A00]" size={44} aria-hidden="true" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Your free trade DPF clean has been requested.
          </h2>
          <p className="text-white/70 text-base mb-6">
            Auto-Cleanse will contact you to confirm eligibility and arrange collection.
          </p>
          <a href={TRADE_CONTACT.phoneHref} className="inline-flex items-center gap-2 btn-shine px-6 py-3.5 rounded-xl font-bold text-white min-h-[48px]">
            <Phone size={16} aria-hidden="true" /> {TRADE_CONTACT.phoneDisplay}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id={CLAIM_FORM_ID} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 scroll-mt-20">
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
        Claim Your Free Trade DPF Clean
      </h2>
      <p className="text-white/65 text-sm sm:text-base mb-6">
        Invitation code{' '}
        <span className="font-mono font-bold text-[#FF7A00]">{region.invitationCode}</span> &middot;{' '}
        {region.regionName} &middot; offer expires {offerExpiryFor(region)}
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
        toolname="claimFreeTradeDpfClean"
        tooldescription="Submits a claim to Auto-Cleanse for a garage's free first trade DPF clean under the South West trade-outreach campaign. Auto-Cleanse contacts the business to confirm eligibility and arrange collection of the removed DPF."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fdc-business" className={labelClass}>Garage or business name *</label>
            <input
              id="fdc-business" name="businessName" type="text" required autoComplete="organization"
              value={data.businessName} onChange={handleChange} className={fieldClass}
              placeholder="e.g. Riverside Motors"
              aria-invalid={!!errors.businessName}
              aria-describedby={errors.businessName ? 'fdc-business-err' : undefined}
              toolparamdescription="Name of the garage, workshop or MOT centre claiming the free DPF clean."
            />
            {errors.businessName && <p id="fdc-business-err" className={errorClass} role="alert">{errors.businessName}</p>}
          </div>

          <div>
            <label htmlFor="fdc-contact" className={labelClass}>Contact name *</label>
            <input
              id="fdc-contact" name="contactName" type="text" required autoComplete="name"
              value={data.contactName} onChange={handleChange} className={fieldClass}
              placeholder="Your name"
              aria-invalid={!!errors.contactName}
              aria-describedby={errors.contactName ? 'fdc-contact-err' : undefined}
              toolparamdescription="Full name of the person at the garage to contact about the free clean."
            />
            {errors.contactName && <p id="fdc-contact-err" className={errorClass} role="alert">{errors.contactName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fdc-phone" className={labelClass}>Telephone number *</label>
            <input
              id="fdc-phone" name="phone" type="tel" required autoComplete="tel"
              value={data.phone} onChange={handleChange} className={fieldClass}
              placeholder="Workshop phone number"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'fdc-phone-err' : undefined}
              toolparamdescription="Telephone number Auto-Cleanse will use to arrange collection."
            />
            {errors.phone && <p id="fdc-phone-err" className={errorClass} role="alert">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="fdc-email" className={labelClass}>Email address *</label>
            <input
              id="fdc-email" name="email" type="email" required autoComplete="email"
              value={data.email} onChange={handleChange} className={fieldClass}
              placeholder="you@garage.co.uk"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'fdc-email-err' : undefined}
              toolparamdescription="Business email address for confirmation and the before-and-after flow reports."
            />
            {errors.email && <p id="fdc-email-err" className={errorClass} role="alert">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fdc-postcode" className={labelClass}>Business postcode *</label>
            <input
              id="fdc-postcode" name="postcode" type="text" required autoComplete="postal-code"
              value={data.postcode} onChange={handleChange} className={`${fieldClass} uppercase`}
              placeholder="e.g. TQ9 6JY"
              aria-invalid={!!errors.postcode}
              aria-describedby={errors.postcode ? 'fdc-postcode-err' : undefined}
              toolparamdescription="Postcode of the garage, used to plan the collection round."
            />
            {errors.postcode && <p id="fdc-postcode-err" className={errorClass} role="alert">{errors.postcode}</p>}
          </div>

          <div>
            <label htmlFor="fdc-date" className={labelClass}>
              Estimated collection date <span className="text-white/40 font-normal">(optional)</span>
            </label>
            <input
              id="fdc-date" name="collectionDate" type="date"
              value={data.collectionDate} onChange={handleChange} className={fieldClass}
              toolparamdescription="Approximate date the removed DPF will be ready for collection (optional)."
            />
          </div>
        </div>

        <div>
          <label htmlFor="fdc-dpf" className={labelClass}>
            DPF or vehicle details <span className="text-white/40 font-normal">(optional)</span>
          </label>
          <textarea
            id="fdc-dpf" name="dpfDetails" rows={3}
            value={data.dpfDetails} onChange={handleChange} className={`${fieldClass} resize-none`}
            placeholder="e.g. Ford Transit 2.0 EcoBlue, DPF already removed"
            toolparamdescription="Vehicle make and model or DPF details, so Auto-Cleanse knows what is coming in (optional)."
          />
        </div>

        <div>
          <label htmlFor="fdc-preferred" className={labelClass}>Preferred contact method</label>
          <select
            id="fdc-preferred" name="preferredContact"
            value={data.preferredContact} onChange={handleChange} className={fieldClass}
            toolparamdescription="How the garage prefers to be contacted: Phone, Email or WhatsApp."
          >
            <option value="Phone" className="bg-[#1A1D22]">Phone</option>
            <option value="Email" className="bg-[#1A1D22]">Email</option>
            <option value="WhatsApp" className="bg-[#1A1D22]">WhatsApp</option>
          </select>
        </div>

        <fieldset className="space-y-3">
          <legend className="sr-only">Confirmations</legend>

          <label className="flex items-start gap-3 text-sm text-white/75 cursor-pointer">
            <input
              type="checkbox" name="dpfReady" checked={data.dpfReady} onChange={handleChange}
              className="h-5 w-5 accent-[#FF7A00] shrink-0 mt-0.5"
              aria-invalid={!!errors.dpfReady}
              aria-describedby={errors.dpfReady ? 'fdc-ready-err' : undefined}
              toolparamdescription="Confirmation that the DPF will be removed from the vehicle and ready for collection."
            />
            <span>I confirm the DPF will be removed from the vehicle and ready for collection.</span>
          </label>
          {errors.dpfReady && <p id="fdc-ready-err" className={errorClass} role="alert">{errors.dpfReady}</p>}

          <label className="flex items-start gap-3 text-sm text-white/75 cursor-pointer">
            <input
              type="checkbox" name="consent" checked={data.consent} onChange={handleChange}
              className="h-5 w-5 accent-[#FF7A00] shrink-0 mt-0.5"
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? 'fdc-consent-err' : undefined}
              toolparamdescription="Consent for Auto-Cleanse to contact the business about this free-clean offer."
            />
            <span>I consent to Auto-Cleanse contacting my business about this offer.</span>
          </label>
          {errors.consent && <p id="fdc-consent-err" className={errorClass} role="alert">{errors.consent}</p>}

          <label className="flex items-start gap-3 text-sm text-white/75 cursor-pointer">
            <input
              type="checkbox" name="termsAccepted" checked={data.termsAccepted} onChange={handleChange}
              className="h-5 w-5 accent-[#FF7A00] shrink-0 mt-0.5"
              aria-invalid={!!errors.termsAccepted}
              aria-describedby={errors.termsAccepted ? 'fdc-terms-err' : undefined}
              toolparamdescription="Acceptance of the free-offer terms and the turnaround terms."
            />
            <span>
              I accept the{' '}
              <a
                href={`#${OFFER_TERMS_ID}`}
                onClick={() => trackTradeEvent('offer_terms_view', region, campaign)}
                className="text-[#FF7A00] underline underline-offset-2 font-semibold"
              >
                free-offer and turnaround terms
              </a>
              .
            </span>
          </label>
          {errors.termsAccepted && <p id="fdc-terms-err" className={errorClass} role="alert">{errors.termsAccepted}</p>}
        </fieldset>

        {/* Honeypot: visually hidden, ignored by humans, filled by bots. */}
        <input
          type="text" name="company" tabIndex={-1} autoComplete="off" value={data.company}
          onChange={handleChange} className="hidden" aria-hidden="true"
          toolparamdescription="Anti-spam field. Leave this empty. Do not enter any value."
        />

        <p className="text-white/45 text-xs leading-relaxed">
          {REMOVAL_REQUIREMENT}
        </p>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full btn-shine px-6 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2 min-h-[52px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending&hellip;</>
          ) : (
            <>Claim My Free DPF Clean</>
          )}
        </button>

        {status === 'error' && (
          <p className="text-red-400 text-sm text-center" role="alert">
            Something went wrong sending your claim. Please try again, or call us on{' '}
            <a href={TRADE_CONTACT.phoneHref} className="font-semibold underline">
              {TRADE_CONTACT.phoneDisplay}
            </a>
            .
          </p>
        )}
      </form>
    </section>
  );
}
