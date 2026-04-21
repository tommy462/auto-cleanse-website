import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle, Phone, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const REMAP_WEBHOOK_URL = 'https://hook.eu2.make.com/uw0b9gab1m4qdj1zhs4m4mkkn9kt5fva';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  vehicleRegistration: string;
  vehicleMakeModel: string;
  remapType: string;
  currentPowerKnown: string;
  goals: string;
  preferredDate: string;
  additionalNotes: string;
}

const RemappingBooking = () => {
  const container = useRef(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    vehicleRegistration: '',
    vehicleMakeModel: '',
    remapType: '',
    currentPowerKnown: 'no',
    goals: '',
    preferredDate: '',
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [jobReference, setJobReference] = useState('');

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );
  }, { scope: container });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate job reference: AC-R-XXXXXX
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const ref = `AC-R-${timestamp.toString().slice(-4)}${random.slice(-1)}`;
    const uuid = crypto.randomUUID();

    const payload = {
      type: 'remap_booking',
      jobReference: ref,
      uuid,
      ...formData,
      timestamp: new Date().toISOString(),
      source: 'remapping-booking-form',
    };

    try {
      const response = await fetch(REMAP_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setJobReference(ref);
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7A00]/50 focus:ring-1 focus:ring-[#FF7A00]/30 transition-colors font-medium text-sm';

  const labelClass = 'block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider';

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Book a Remap | ECU Remapping Enquiry"
        description="Book an ECU remapping consultation with AutoCleanse. Stage 1, Stage 2, and custom maps for cars, vans, HGVs and commercial vehicles based in Devon."
        path="/remapping-booking"
      />

      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-[#FF7A00]/8 blur-[120px] rounded-[100%] pointer-events-none opacity-60"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back link */}
        <Link
          to="/remapping"
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#FF7A00] transition-colors text-sm font-medium mb-12"
        >
          <ArrowLeft size={16} /> Back to Remapping
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">Booking Enquiry</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.05] mb-6">
            Book a Remap<br />
            <span className="text-[#FF7A00]">Consultation.</span>
          </h1>
          <p className="text-white/60 text-lg font-medium leading-relaxed max-w-lg">
            Fill in your vehicle details and we'll confirm availability and pricing.
            No commitment required at this stage.
          </p>
        </div>

        {/* Success State */}
        {submitStatus === 'success' ? (
          <div className="rounded-3xl bg-[#1A1D22] border border-[#FF7A00]/30 p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-[#FF7A00]" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Enquiry Received</h2>
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-6">{jobReference}</div>
            <p className="text-white/60 text-lg font-medium leading-relaxed mb-8 max-w-md mx-auto">
              Thanks — we'll be in touch within one business day to confirm your booking details and pricing.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton>
                <a href="tel:08000430609" className="btn-shine px-8 py-3 rounded-xl font-bold text-base text-white hover:text-white inline-flex items-center gap-2">
                  <Phone size={18} /> Call Us Directly
                </a>
              </MagneticButton>
              <Link to="/" className="px-8 py-3 rounded-xl font-bold text-base text-white border border-white/20 hover:bg-white/10 transition-colors inline-block">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-[#1A1D22] border border-white/5 p-8 sm:p-10 space-y-8"
          >
            {/* Contact Details */}
            <div>
              <h2 className="text-lg font-black text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#FF7A00] text-black text-xs font-black flex items-center justify-center">1</span>
                Your Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="07700 000000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h2 className="text-lg font-black text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#FF7A00] text-black text-xs font-black flex items-center justify-center">2</span>
                Vehicle Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="vehicleRegistration">Registration *</label>
                  <input
                    id="vehicleRegistration"
                    name="vehicleRegistration"
                    type="text"
                    value={formData.vehicleRegistration}
                    onChange={handleInputChange}
                    className={`${inputClass} uppercase`}
                    placeholder="AB12 CDE"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="vehicleMakeModel">Make &amp; Model *</label>
                  <input
                    id="vehicleMakeModel"
                    name="vehicleMakeModel"
                    type="text"
                    value={formData.vehicleMakeModel}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Ford Transit 2.0 TDCi"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Remap Details */}
            <div>
              <h2 className="text-lg font-black text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#FF7A00] text-black text-xs font-black flex items-center justify-center">3</span>
                Remap Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="remapType">Type of Remap *</label>
                  <select
                    id="remapType"
                    name="remapType"
                    value={formData.remapType}
                    onChange={handleInputChange}
                    className={`${inputClass} cursor-pointer`}
                    required
                  >
                    <option value="" disabled>Select a remap type</option>
                    <option value="stage-1">Stage 1 — Standard vehicle, no hardware changes</option>
                    <option value="stage-2">Stage 2 — Modified vehicle with hardware upgrades</option>
                    <option value="custom-fleet">Custom / Fleet map</option>
                    <option value="dpf-remap-bundle">DPF Clean + Remap Bundle</option>
                    <option value="not-sure">Not sure — need advice</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="goals">What are you hoping to achieve? *</label>
                  <textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    rows={3}
                    className={inputClass}
                    placeholder="e.g. More power for towing, better fuel economy on motorways, remove power restrictions, etc."
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="preferredDate">Preferred Date</label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className={inputClass}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="currentPowerKnown">Do you know the current power output?</label>
                  <select
                    id="currentPowerKnown"
                    name="currentPowerKnown"
                    value={formData.currentPowerKnown}
                    onChange={handleInputChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="additionalNotes">Additional Notes</label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className={inputClass}
                    placeholder="Any other information — existing modifications, known faults, fleet size, etc."
                  />
                </div>
              </div>
            </div>

            {/* Error State */}
            {submitStatus === 'error' && (
              <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4 text-red-400 text-sm font-medium">
                Something went wrong submitting your enquiry. Please try calling us on{' '}
                <a href="tel:08000430609" className="underline hover:text-red-300">0800 043 0609</a>.
              </div>
            )}

            {/* Submit */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <p className="text-white/30 text-xs font-medium max-w-xs leading-relaxed">
                No payment required at this stage. We'll confirm pricing and availability before you commit.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-shine px-8 py-4 rounded-xl font-bold text-base text-white hover:text-white inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting…
                  </>
                ) : (
                  <>
                    <Zap size={18} /> Submit Enquiry
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Alt contact */}
        <div className="mt-10 text-center text-white/30 text-sm font-medium">
          Prefer to talk first?{' '}
          <a href="tel:08000430609" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors font-bold">
            Call 0800 043 0609
          </a>
        </div>

      </div>
    </div>
  );
};

export default RemappingBooking;
