import React, { useState } from 'react';
import { Phone, Loader2, CheckCircle } from 'lucide-react';
import { LEADS_WEBHOOK_URL, SERVICE_OPTIONS } from '../config/leads';
import { trackLead } from '../lib/tracking';

interface QuickEnquiryFormProps {
  /** Pre-selects the service dropdown, e.g. "ECU Remapping". */
  defaultService?: string;
  /** Where the lead came from, sent with the payload (e.g. page slug). */
  source?: string;
  /** Optional heading shown above the form. */
  heading?: string;
  subheading?: string;
}

const initial = { name: '', phone: '', registration: '', service: '', message: '', company: '' };

export default function QuickEnquiryForm({
  defaultService = '',
  source = 'quick_enquiry',
  heading,
  subheading,
}: QuickEnquiryFormProps) {
  const [data, setData] = useState({ ...initial, service: defaultService });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: name === 'registration' ? value.toUpperCase() : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: real users never fill the hidden "company" field.
    if (data.company) return;
    setStatus('submitting');
    try {
      const res = await fetch(LEADS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          registration: data.registration,
          service: data.service,
          message: data.message,
          source,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      trackLead({
        service: data.service || 'unspecified',
        source,
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setData({ ...initial, service: defaultService });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-[#1A1D22] border border-[#FF7A00]/20 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 text-[#FF7A00]" size={40} />
        <h3 className="text-xl font-bold text-white mb-2">Thanks — we&rsquo;ve got your details</h3>
        <p className="text-white/60 text-sm mb-5">
          We&rsquo;ll call you back as soon as we can. Need us sooner? Call us now.
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {(heading || subheading) && (
        <div className="mb-1">
          {heading && <h3 className="text-2xl font-bold text-white tracking-tight">{heading}</h3>}
          {subheading && <p className="text-white/50 text-sm mt-1">{subheading}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="qe-name" className={labelClass}>Name *</label>
          <input id="qe-name" name="name" type="text" required autoComplete="name"
            value={data.name} onChange={handleChange} placeholder="Your name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="qe-phone" className={labelClass}>Phone *</label>
          <input id="qe-phone" name="phone" type="tel" required autoComplete="tel"
            value={data.phone} onChange={handleChange} placeholder="Your phone number" className={fieldClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="qe-reg" className={labelClass}>Vehicle reg <span className="text-white/30">(optional)</span></label>
          <input id="qe-reg" name="registration" type="text" value={data.registration}
            onChange={handleChange} placeholder="AB12 CDE" maxLength={10}
            className={`${fieldClass} uppercase tracking-wider`} />
        </div>
        <div>
          <label htmlFor="qe-service" className={labelClass}>Service needed *</label>
          <select id="qe-service" name="service" required value={data.service}
            onChange={handleChange} className={fieldClass}>
            <option value="" disabled>Choose a service…</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[#1A1D22]">{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="qe-message" className={labelClass}>Message <span className="text-white/30">(optional)</span></label>
        <textarea id="qe-message" name="message" rows={3} value={data.message}
          onChange={handleChange} placeholder="Anything else we should know? (symptoms, warning lights, timescale…)"
          className={`${fieldClass} resize-none`} />
      </div>

      {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" value={data.company}
        onChange={handleChange} className="hidden" aria-hidden="true" />

      <button type="submit" disabled={status === 'submitting'}
        className="w-full btn-shine px-6 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
        {status === 'submitting'
          ? (<><Loader2 size={16} className="animate-spin" /> Sending…</>)
          : (<>Request a Callback</>)}
      </button>

      <p className="text-center text-white/30 text-xs">
        Prefer to talk now? Call{' '}
        <a href="tel:01803269895" className="text-[#FF7A00] font-semibold">01803 269895</a>
      </p>

      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">
          Something went wrong. Please try again or call us on 01803 269895.
        </p>
      )}
    </form>
  );
}
