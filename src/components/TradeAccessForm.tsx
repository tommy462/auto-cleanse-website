import React, { useState } from 'react';
import { Loader2, CheckCircle, Phone } from 'lucide-react';
import { TRADE_LEADS_WEBHOOK_URL } from '../config/leads';
import { trackLead } from '../lib/tracking';

const BUSINESS_TYPES = [
  'Garage',
  'Mobile tuner',
  'Mechanic',
  'DPF specialist',
  'Performance tuner',
  'Other',
] as const;

const SERVICE_INTERESTS = [
  'Stage 1 / Stage 2',
  'TCU / gearbox tuning',
  'DPF solutions',
  'EGR solutions',
  'AdBlue / SCR solutions',
  'DTC removal',
  'Other',
] as const;

const FILES_PER_MONTH = ['1-5', '6-15', '16-30', '30+'] as const;

const initial = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  websiteOrSocial: '',
  businessType: '',
  filesPerMonth: '',
  message: '',
  consent: false,
  company: '', // honeypot
};

export default function TradeAccessForm() {
  const [data, setData] = useState({ ...initial });
  const [services, setServices] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value } = target;
    if (target instanceof HTMLInputElement && target.type === 'checkbox' && name === 'consent') {
      setData((d) => ({ ...d, consent: target.checked }));
      return;
    }
    setData((d) => ({ ...d, [name]: value }));
  };

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: real users never fill the hidden "company" field.
    if (data.company) return;
    if (!data.consent) return;
    setStatus('submitting');
    try {
      const res = await fetch(TRADE_LEADS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'AutoCleanse Trade File Service Page',
          submittedAt: new Date().toISOString(),
          name: data.name,
          businessName: data.businessName,
          email: data.email,
          phone: data.phone,
          websiteOrSocial: data.websiteOrSocial,
          businessType: data.businessType,
          services,
          filesPerMonth: data.filesPerMonth,
          message: data.message,
          consent: data.consent,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      trackLead({
        service: 'Trade File Service',
        source: 'trade-file-service',
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setData({ ...initial });
      setServices([]);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-[#1A1D22] border border-[#FF7A00]/20 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 text-[#FF7A00]" size={40} />
        <h3 className="text-xl font-bold text-white mb-2">Trade access request received</h3>
        <p className="text-white/60 text-sm mb-5">
          Thanks &mdash; your trade access request has been received. We&rsquo;ll be in touch shortly.
        </p>
        <a
          href="tel:01803269895"
          className="inline-flex items-center gap-2 btn-shine px-6 py-3 rounded-xl font-bold text-sm text-white"
        >
          <Phone size={16} /> 01803 269895
        </a>
      </div>
    );
  }

  const fieldClass =
    'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all';
  const labelClass = 'block text-white/60 text-sm font-medium mb-1.5';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      toolname="applyForTradeEcuFiles"
      tooldescription="Submits a trade-access application to Auto-Cleanse for its trade ECU/TCU file service (for garages and mobile tuners). Auto-Cleanse reviews the application and follows up about trade file access."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tf-name" className={labelClass}>Name *</label>
          <input id="tf-name" name="name" type="text" required autoComplete="name"
            value={data.name} onChange={handleChange} placeholder="Your name" className={fieldClass}
            toolparamdescription="Full name of the person applying for trade access." />
        </div>
        <div>
          <label htmlFor="tf-business" className={labelClass}>Business name *</label>
          <input id="tf-business" name="businessName" type="text" required autoComplete="organization"
            value={data.businessName} onChange={handleChange} placeholder="Business name" className={fieldClass}
            toolparamdescription="Name of the applicant's garage or tuning business." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tf-email" className={labelClass}>Email *</label>
          <input id="tf-email" name="email" type="email" required autoComplete="email"
            value={data.email} onChange={handleChange} placeholder="you@business.co.uk" className={fieldClass}
            toolparamdescription="Business email address Auto-Cleanse will reply to." />
        </div>
        <div>
          <label htmlFor="tf-phone" className={labelClass}>Phone *</label>
          <input id="tf-phone" name="phone" type="tel" required autoComplete="tel"
            value={data.phone} onChange={handleChange} placeholder="Your phone number" className={fieldClass}
            toolparamdescription="Contact phone number for the business." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tf-web" className={labelClass}>
            Website or Facebook page <span className="text-white/30">(optional)</span>
          </label>
          <input id="tf-web" name="websiteOrSocial" type="text" autoComplete="url"
            value={data.websiteOrSocial} onChange={handleChange} placeholder="Link to your site or page" className={fieldClass}
            toolparamdescription="Link to the business website or Facebook page (optional), used to verify the trade business." />
        </div>
        <div>
          <label htmlFor="tf-type" className={labelClass}>Business type *</label>
          <select id="tf-type" name="businessType" required value={data.businessType}
            onChange={handleChange} className={fieldClass}
            toolparamdescription="The type of trade business, e.g. Garage, Mobile tuner, Mechanic, DPF specialist or Performance tuner.">
            <option value="" disabled>Choose business type&hellip;</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#1A1D22]">{t}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Services interested in</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SERVICE_INTERESTS.map((service) => {
            const checked = services.includes(service);
            return (
              <label
                key={service}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                  checked
                    ? 'border-[#FF7A00]/50 bg-[#FF7A00]/10'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  checked={checked}
                  onChange={() => toggleService(service)}
                  className="h-4 w-4 accent-[#FF7A00] shrink-0"
                  toolparamdescription="A file-service type the trade customer is interested in; select all that apply (Stage 1/2, TCU, DPF, EGR, AdBlue/SCR, DTC removal or Other)."
                />
                <span className="text-sm text-white/80">{service}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="tf-volume" className={labelClass}>Approx. files per month *</label>
        <select id="tf-volume" name="filesPerMonth" required value={data.filesPerMonth}
          onChange={handleChange} className={fieldClass}
          toolparamdescription="Approximate number of files the business expects to submit per month (1-5, 6-15, 16-30 or 30+).">
          <option value="" disabled>Choose a range&hellip;</option>
          {FILES_PER_MONTH.map((v) => (
            <option key={v} value={v} className="bg-[#1A1D22]">{v}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tf-message" className={labelClass}>
          Message / notes <span className="text-white/30">(optional)</span>
        </label>
        <textarea id="tf-message" name="message" rows={3} value={data.message}
          onChange={handleChange} placeholder="Tell us about your business and what you need"
          className={`${fieldClass} resize-none`}
          toolparamdescription="Any extra detail about the business and what the trade customer needs (optional)." />
      </div>

      <label className="flex items-start gap-3 text-sm text-white/70 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          required
          checked={data.consent}
          onChange={handleChange}
          className="h-4 w-4 accent-[#FF7A00] shrink-0 mt-0.5"
          toolparamdescription="Required confirmation that the applicant is a trade customer and consents to being contacted about trade file access."
        />
        <span>
          I confirm I am applying as a trade customer and understand AutoCleanse may contact me about
          trade file access.
        </span>
      </label>

      {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" value={data.company}
        onChange={handleChange} className="hidden" aria-hidden="true" />

      <button type="submit" disabled={status === 'submitting'}
        className="w-full btn-shine px-6 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
        {status === 'submitting'
          ? (<><Loader2 size={16} className="animate-spin" /> Sending&hellip;</>)
          : (<>Apply for Trade Access</>)}
      </button>

      {status === 'error' && (
        <p className="text-red-400 text-sm text-center" role="alert">
          Something went wrong. Please try again or call AutoCleanse directly on{' '}
          <a href="tel:01803269895" className="font-semibold underline">01803 269895</a>.
        </p>
      )}

      <p className="text-center text-white/30 text-xs">
        Prefer to talk? Call{' '}
        <a href="tel:01803269895" className="text-[#FF7A00] font-semibold">01803 269895</a>
      </p>
    </form>
  );
}
