import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Car, MapPin, Wrench, CheckCircle,
  Phone, ClipboardList, Zap, Loader2,
} from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import { BOOKING_CONFIG, REMAP_SERVICES, REMAP_OPTIONS, BASE_PRICES, type RemapServiceValue } from '../config/booking';

// Make.com webhook — receives combined booking record once Calendly confirms
const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/uw0b9gab1m4qdj1zhs4m4mkkn9kt5fva';

// Tell TypeScript about the Calendly global the embed script adds to window
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: Element;
        prefill?: Record<string, string>;
        utm?: Record<string, string>;
      }) => void;
    };
  }
}

// Calendly event type URL — update the slug if you create a different event type
const CALENDLY_BASE = 'https://calendly.com/auto-cleanse-info/30min';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface BookingForm {
  serviceType: RemapServiceValue | '';
  bookingType: 'workshop' | 'mobile' | '';
  selectedOptions: string[];
  // Contact
  fullName: string;
  email: string;
  phone: string;
  // Vehicle
  vehicleRegistration: string;
  vehicleMakeModel: string;
  goals: string;
  notes: string;
  // Mobile only
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  postcode: string;
}

const EMPTY: BookingForm = {
  serviceType: '', bookingType: '',
  selectedOptions: [],
  fullName: '', email: '', phone: '',
  vehicleRegistration: '', vehicleMakeModel: '',
  goals: '', notes: '',
  addressLine1: '', addressLine2: '', townCity: '', postcode: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const INPUT =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7A00]/50 focus:ring-1 focus:ring-[#FF7A00]/30 transition-colors font-medium text-sm';
const LABEL = 'block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest';

function getServiceLabel(value: string) {
  return REMAP_SERVICES.find((s) => s.value === value)?.label ?? value;
}

function calcQuotedPrice(serviceType: string, bookingType: string, selectedOptions: string[]): number {
  if (!serviceType || !bookingType) return 0;
  const prices = BASE_PRICES[serviceType as RemapServiceValue];
  if (!prices) return 0;
  const base = bookingType === 'mobile' ? prices.mobile : prices.workshop;
  const extras = selectedOptions.reduce((sum, val) => {
    return sum + (REMAP_OPTIONS.find((o) => o.value === val)?.extraCost ?? 0);
  }, 0);
  return base + extras;
}

function formatPrice(serviceType: string, bookingType: string, selectedOptions: string[]): string | null {
  if (!serviceType || !bookingType || serviceType === 'not-sure') return null;
  const prices = BASE_PRICES[serviceType as RemapServiceValue];
  if (!prices) return null;
  const total = calcQuotedPrice(serviceType, bookingType, selectedOptions);
  const prefix = prices.fromPrice ? 'from ' : '';
  return `${prefix}£${total}`;
}

function buildAddress(f: BookingForm) {
  return [f.addressLine1, f.addressLine2, f.townCity, f.postcode].filter(Boolean).join(', ');
}

// Build the Calendly URL with:
// - Prefill: name + email so the customer doesn't retype them in Calendly's form
// - UTM params: service/booking type stored against the Calendly event for Make.com
function buildCalendlyUrl(f: BookingForm): string {
  const params = new URLSearchParams({
    primary_color: 'ff7a00',
    hide_gdpr_banner: '1',
    // Prefill customer details into Calendly's own form fields
    name: f.fullName,
    email: f.email,
    // UTM params are stored on the Calendly event record
    utm_source: 'autocleanse-website',
    utm_medium: 'online-booking',
    utm_campaign: f.serviceType,
    utm_content: f.bookingType,
  });
  if (f.bookingType === 'mobile' && f.postcode) {
    params.set('utm_term', f.postcode);
  }
  return `${CALENDLY_BASE}?${params.toString()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation screen (shown after Calendly booking is completed)
// ─────────────────────────────────────────────────────────────────────────────

function BookingConfirmed({ form }: { form: BookingForm }) {
  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Booking Confirmed | AutoCleanse Remapping"
        description="Your ECU remapping booking is confirmed."
        path="/remapping-booking"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[#FF7A00]/6 blur-[100px] rounded-[100%] pointer-events-none opacity-60" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10 text-center pt-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[#FF7A00]" strokeWidth={1.5} />
        </div>

        <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
          Booking confirmed
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white mb-4">
          You're all booked in.
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Check your email for a confirmation from Calendly. We'll also be in touch to
          confirm your vehicle details before the appointment.
        </p>

        {/* Booking summary */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
            Booking summary
          </p>
          <dl className="space-y-2">
            {[
              { label: 'Name', value: form.fullName },
              { label: 'Email', value: form.email },
              { label: 'Phone', value: form.phone },
              { label: 'Service', value: getServiceLabel(form.serviceType) },
              {
                label: 'Type',
                value: form.bookingType === 'mobile'
                  ? '🚗 Mobile — we come to you'
                  : '🏪 Workshop visit',
              },
              {
                label: 'Vehicle',
                value: `${form.vehicleMakeModel} (${form.vehicleRegistration})`,
              },
              ...(form.bookingType === 'mobile'
                ? [{ label: 'Address', value: buildAddress(form) }]
                : []),
              ...(form.selectedOptions.length > 0
                ? [{ label: 'Add-ons', value: form.selectedOptions.map((v) => REMAP_OPTIONS.find((o) => o.value === v)?.label ?? v).join(', ') }]
                : []),
              ...(formatPrice(form.serviceType, form.bookingType, form.selectedOptions)
                ? [{ label: 'Total', value: formatPrice(form.serviceType, form.bookingType, form.selectedOptions)! }]
                : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3 py-2 border-b border-white/5 last:border-0">
                <dt className="text-white/30 text-xs font-bold uppercase tracking-widest w-16 shrink-0 pt-0.5">
                  {label}
                </dt>
                <dd className="text-white text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* What's next */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
            What happens next
          </p>
          <ol className="space-y-3 text-sm text-white/50 leading-relaxed">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
              You'll receive a confirmation email from Calendly with your date and time.
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
              We may call to confirm your vehicle details and advise on preparation.
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
              {form.bookingType === 'mobile'
                ? "We'll arrive at your address at the booked time — please make sure the vehicle is accessible."
                : 'Bring your vehicle to us at the booked time with a full tank of fuel.'}
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">4</span>
              Remaining balance is due on the day once the job is complete.
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <MagneticButton>
            <a
              href="tel:08000430609"
              className="btn-shine px-7 py-3 rounded-xl font-bold text-sm text-white hover:text-white inline-flex items-center gap-2"
            >
              <Phone size={15} /> Call Us
            </a>
          </MagneticButton>
          <Link
            to="/"
            className="px-7 py-3 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function RemappingBooking() {
  const [form, setForm] = useState<BookingForm>(EMPTY);
  const [showWidget, setShowWidget] = useState(false);
  const [widgetLoading, setWidgetLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Ref keeps form value fresh inside the message-event listener (no stale closure)
  const formRef = useRef<BookingForm>(EMPTY);
  useEffect(() => { formRef.current = form; }, [form]);

  // Guard against firing the webhook twice
  const webhookFired = useRef(false);

  const topRef = useRef<HTMLDivElement>(null);
  const calendlySection = useRef<HTMLDivElement>(null);

  // ── Load Calendly embed script ──────────────────────────────────────────
  useEffect(() => {
    if (document.querySelector('script[data-calendly]')) return;
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.setAttribute('data-calendly', 'true');
    document.head.appendChild(script);
    return () => {
      document.querySelector('script[data-calendly]')?.remove();
    };
  }, []);

  // ── Listen for Calendly booking completion ──────────────────────────────
  // Calendly fires `calendly.event_scheduled` as a postMessage when the customer
  // completes a booking in an embedded widget. We use this to:
  //   1. Show our own confirmation UI
  //   2. POST a combined record (our form data + Calendly URIs) to Make.com
  //
  // The Calendly event payload contains `event.uri` and `invitee.uri` — Make.com
  // can call the Calendly API with these to retrieve name / email / time / etc.
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.event !== 'calendly.event_scheduled') return;
      if (webhookFired.current) return;
      webhookFired.current = true;

      const payload = e.data.payload;
      const f = formRef.current;

      setBookingComplete(true);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const quotedPrice = calcQuotedPrice(f.serviceType, f.bookingType, f.selectedOptions);

      // Build the shared payload once — sent to both Make.com and our dashboard API
      const bookingPayload = {
        type: 'remap_booking_confirmed',
        source: 'calendly-inline',
        timestamp: new Date().toISOString(),

        // ── Customer contact ────────────────────────────────────────────
        customerName: f.fullName,
        customerEmail: f.email,
        customerPhone: f.phone,
        // ── Booking details ─────────────────────────────────────────────
        serviceType: f.serviceType,
        serviceLabel: getServiceLabel(f.serviceType),
        bookingType: f.bookingType,
        vehicleRegistration: f.vehicleRegistration,
        vehicleMakeModel: f.vehicleMakeModel,
        goals: f.goals,
        notes: f.notes || null,
        address: f.bookingType === 'mobile' ? buildAddress(f) : null,
        postcode: f.bookingType === 'mobile' ? f.postcode : null,
        selectedOptions: f.selectedOptions,
        quotedPrice,

        // ── Calendly URIs ───────────────────────────────────────────────
        calendlyEventUri: payload.event?.uri ?? null,
        calendlyInviteeUri: payload.invitee?.uri ?? null,
      };

      // Fire both in parallel — failures are non-blocking
      await Promise.allSettled([
        fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        }).catch((err) => console.error('[booking] Make.com error:', err)),

        fetch('/api/create-dashboard-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        }).catch((err) => console.error('[booking] Dashboard job error:', err)),
      ]);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const update = (u: Partial<BookingForm>) => setForm((f) => ({ ...f, ...u }));

  const canProceed =
    form.serviceType !== '' &&
    form.bookingType !== '' &&
    form.fullName.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.vehicleRegistration.trim() !== '' &&
    form.vehicleMakeModel.trim() !== '' &&
    (form.bookingType !== 'mobile' ||
      (form.addressLine1.trim() !== '' &&
        form.townCity.trim() !== '' &&
        form.postcode.trim() !== ''));

  // Poll until the Calendly script has loaded, then call initInlineWidget.
  // Mobile connections can take 30+ seconds to load the script, so we keep
  // polling every 500ms rather than giving up after a fixed set of retries.
  // A MutationObserver watches for the iframe Calendly injects — once it
  // appears we know rendering is done and we hide the loading state.
  useEffect(() => {
    if (!showWidget) return;

    setWidgetLoading(true);
    let initialized = false;

    const tryInit = () => {
      const el = document.getElementById('calendly-inline');
      if (!el || !window.Calendly || initialized) return;
      initialized = true;

      window.Calendly.initInlineWidget({
        url: buildCalendlyUrl(form),
        parentElement: el,
      });

      // Watch for Calendly to inject its iframe, then clear the loading state
      const observer = new MutationObserver(() => {
        if (el.querySelector('iframe')) {
          setWidgetLoading(false);
          observer.disconnect();
        }
      });
      observer.observe(el, { childList: true, subtree: true });

      // Fallback: hide loader after 8s regardless (slow connections)
      setTimeout(() => setWidgetLoading(false), 8000);
    };

    tryInit();
    const interval = setInterval(() => {
      if (initialized) clearInterval(interval);
      else tryInit();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [showWidget]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProceed = () => {
    setShowWidget(true);
    setTimeout(
      () => calendlySection.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      80,
    );
  };

  // ── Confirmation screen ─────────────────────────────────────────────────
  if (bookingComplete) {
    return <BookingConfirmed form={form} />;
  }

  // ── Main booking page ───────────────────────────────────────────────────
  return (
    <div ref={topRef} className="pt-28 pb-20 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Book a Remap | ECU Remapping Booking — AutoCleanse"
        description="Book your ECU remapping appointment online. Choose your service, pick a slot, and pay the £50 deposit to confirm. Devon and surrounding areas."
        path="/remapping-booking"
      />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[350px] bg-[#FF7A00]/6 blur-[120px] rounded-[100%] pointer-events-none opacity-50" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back link */}
        <Link
          to="/remapping"
          className="inline-flex items-center gap-2 text-white/30 hover:text-[#FF7A00] transition-colors text-sm font-medium mb-10"
        >
          <ArrowLeft size={15} /> Back to Remapping
        </Link>

        {/* ── Step 1 header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
            Step 1 of 2
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.05] mb-4">
            Your<br />
            <span className="text-[#FF7A00]">Details.</span>
          </h1>
          <p className="text-white/50 text-base font-medium leading-relaxed max-w-md">
            Tell us about your vehicle and what you need — then choose a slot and pay
            the {BOOKING_CONFIG.depositAmountDisplay} deposit to confirm.
          </p>
        </div>

        {/* ── 1. Service selector ───────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
          <h2 className="text-sm font-black text-white mb-5 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FF7A00] text-black text-[10px] font-black flex items-center justify-center shrink-0">
              1
            </span>
            Choose your service
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REMAP_SERVICES.map((s) => {
              const selected = form.serviceType === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => update({ serviceType: s.value as RemapServiceValue })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selected
                      ? 'bg-[#FF7A00]/10 border-[#FF7A00]/50 ring-1 ring-[#FF7A00]/30'
                      : 'bg-black/30 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{s.icon}</span>
                    <div>
                      <div className={`font-bold text-sm ${selected ? 'text-[#FF7A00]' : 'text-white'}`}>
                        {s.label}
                      </div>
                      <div className="text-white/40 text-xs mt-1 leading-relaxed">
                        {s.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. Workshop or mobile ─────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
          <h2 className="text-sm font-black text-white mb-5 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FF7A00] text-black text-[10px] font-black flex items-center justify-center shrink-0">
              2
            </span>
            Workshop or mobile?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                value: 'workshop' as const,
                icon: <Wrench size={18} />,
                title: 'Workshop Visit',
                desc: `Bring your vehicle to us in ${BOOKING_CONFIG.workshopAddressDisplay}`,
              },
              {
                value: 'mobile' as const,
                icon: <MapPin size={18} />,
                title: 'Mobile Booking',
                desc: `We come to you — within ${BOOKING_CONFIG.maxServiceRadiusMiles} miles of ${BOOKING_CONFIG.workshopAddressDisplay}`,
              },
            ].map(({ value, icon, title, desc }) => {
              const selected = form.bookingType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ bookingType: value })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selected
                      ? 'bg-[#FF7A00]/10 border-[#FF7A00]/50 ring-1 ring-[#FF7A00]/30'
                      : 'bg-black/30 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className={`mb-2 ${selected ? 'text-[#FF7A00]' : 'text-white/40'}`}>
                    {icon}
                  </div>
                  <div className={`font-bold text-sm ${selected ? 'text-[#FF7A00]' : 'text-white'}`}>
                    {title}
                  </div>
                  <div className="text-white/40 text-xs mt-1 leading-relaxed">{desc}</div>
                </button>
              );
            })}
          </div>

          {/* Mobile address — revealed when mobile is selected */}
          {form.bookingType === 'mobile' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
              <div className="sm:col-span-2">
                <label className={LABEL}>Address Line 1 *</label>
                <input
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) => update({ addressLine1: e.target.value })}
                  className={INPUT}
                  placeholder="House number and street"
                />
              </div>
              <div>
                <label className={LABEL}>Address Line 2</label>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) => update({ addressLine2: e.target.value })}
                  className={INPUT}
                  placeholder="Village / estate (optional)"
                />
              </div>
              <div>
                <label className={LABEL}>Town / City *</label>
                <input
                  type="text"
                  value={form.townCity}
                  onChange={(e) => update({ townCity: e.target.value })}
                  className={INPUT}
                  placeholder="e.g. Exeter"
                />
              </div>
              <div>
                <label className={LABEL}>Postcode *</label>
                <input
                  type="text"
                  value={form.postcode}
                  onChange={(e) => update({ postcode: e.target.value.toUpperCase() })}
                  className={`${INPUT} uppercase`}
                  placeholder="EX1 2AB"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── 3. Contact details ───────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
          <h2 className="text-sm font-black text-white mb-5 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FF7A00] text-black text-[10px] font-black flex items-center justify-center shrink-0">
              3
            </span>
            Your Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={LABEL}>Full Name *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update({ fullName: e.target.value })}
                className={INPUT}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className={LABEL}>Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
                className={INPUT}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className={LABEL}>Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update({ phone: e.target.value })}
                className={INPUT}
                placeholder="07700 000000"
              />
            </div>
          </div>
        </div>

        {/* ── 4. Vehicle details ────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-8">
          <h2 className="text-sm font-black text-white mb-5 flex items-center gap-3">
            <Car size={15} className="text-[#FF7A00]" />
            Vehicle Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Registration *</label>
              <input
                type="text"
                value={form.vehicleRegistration}
                onChange={(e) => update({ vehicleRegistration: e.target.value.toUpperCase() })}
                className={`${INPUT} uppercase`}
                placeholder="AB12 CDE"
              />
            </div>
            <div>
              <label className={LABEL}>Make &amp; Model *</label>
              <input
                type="text"
                value={form.vehicleMakeModel}
                onChange={(e) => update({ vehicleMakeModel: e.target.value })}
                className={INPUT}
                placeholder="e.g. Ford Transit 2.0 TDCi"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>What are you hoping to achieve?</label>
              <textarea
                value={form.goals}
                onChange={(e) => update({ goals: e.target.value })}
                rows={3}
                className={INPUT}
                placeholder="e.g. More power for towing, better fuel economy, remove power restrictions…"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Additional Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => update({ notes: e.target.value })}
                rows={2}
                className={INPUT}
                placeholder="Existing modifications, known faults, fleet size, questions…"
              />
            </div>
          </div>
        </div>

        {/* ── 5. Add-on options ─────────────────────────────────────────── */}
        {form.serviceType && form.serviceType !== 'not-sure' && (
          <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
            <h2 className="text-sm font-black text-white mb-1 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FF7A00] text-black text-[10px] font-black flex items-center justify-center shrink-0">
                5
              </span>
              Add-on Options
            </h2>
            <p className="text-white/30 text-xs mb-5 ml-9">Select any extras you'd like included — tick all that apply</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REMAP_OPTIONS.map((opt) => {
                const checked = form.selectedOptions.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const next = checked
                        ? form.selectedOptions.filter((v) => v !== opt.value)
                        : [...form.selectedOptions, opt.value];
                      update({ selectedOptions: next });
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      checked
                        ? 'bg-[#FF7A00]/10 border-[#FF7A00]/50'
                        : 'bg-black/20 border-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                      checked ? 'bg-[#FF7A00] border-[#FF7A00]' : 'border-white/20'
                    }`}>
                      {checked && <span className="text-black text-[10px] font-black leading-none">✓</span>}
                    </span>
                    <span className={`text-sm font-medium flex-1 ${checked ? 'text-white' : 'text-white/60'}`}>
                      {opt.label}
                    </span>
                    {opt.extraCost > 0 && (
                      <span className="text-xs font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-2 py-0.5 rounded-lg shrink-0">
                        +£{opt.extraCost}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Proceed button ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-20">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-[#FF7A00]/8 border border-[#FF7A00]/15 px-4 py-3">
              <Zap size={14} className="text-[#FF7A00] shrink-0" />
              <p className="text-white/50 text-xs leading-snug">
                <span className="text-white font-bold">{BOOKING_CONFIG.depositAmountDisplay} deposit</span> secures your slot.
                Balance due on the day.
              </p>
            </div>
            {formatPrice(form.serviceType, form.bookingType, form.selectedOptions) && (
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <span className="text-white/40 text-xs">Estimated total:</span>
                <span className="text-white font-black text-sm">
                  {formatPrice(form.serviceType, form.bookingType, form.selectedOptions)}
                </span>
                {form.selectedOptions.some((v) => REMAP_OPTIONS.find((o) => o.value === v && o.extraCost > 0)) && (
                  <span className="text-white/30 text-xs">
                    (inc. add-ons)
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={!canProceed}
            onClick={handleProceed}
            className="btn-shine px-8 py-4 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <ClipboardList size={16} /> Choose Your Slot <ArrowRight size={15} />
          </button>
        </div>

        {/* ── Step 2: Calendly widget ───────────────────────────────────── */}
        <div ref={calendlySection} className="scroll-mt-28">
          {showWidget && (
            <>
              {/* Step 2 header */}
              <div className="mb-8">
                <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                  Step 2 of 2
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-3">
                  Choose Your <span className="text-[#FF7A00]">Slot.</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-md">
                  Pick a date and time, enter your contact details, and pay the{' '}
                  {BOOKING_CONFIG.depositAmountDisplay} deposit via Stripe to confirm.
                </p>
              </div>

              {/* Summary strip — shows what was entered in step 1 */}
              <div className="rounded-2xl bg-[#1A1D22] border border-[#FF7A00]/20 px-5 py-4 mb-6">
                <div className="flex flex-wrap gap-x-6 gap-y-2 items-start">
                  <div>
                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mr-1.5">
                      Service
                    </span>
                    <span className="text-[#FF7A00] text-sm font-bold">
                      {getServiceLabel(form.serviceType)}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mr-1.5">
                      Type
                    </span>
                    <span className="text-white text-sm font-medium">
                      {form.bookingType === 'mobile' ? '🚗 Mobile' : '🏪 Workshop'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mr-1.5">
                      Vehicle
                    </span>
                    <span className="text-white text-sm font-medium">
                      {form.vehicleMakeModel} ({form.vehicleRegistration})
                    </span>
                  </div>
                  {form.bookingType === 'mobile' && (
                    <div>
                      <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mr-1.5">
                        Address
                      </span>
                      <span className="text-white text-sm font-medium">{buildAddress(form)}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowWidget(false);
                      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="text-white/25 hover:text-white/60 text-xs font-medium transition-colors sm:ml-auto"
                  >
                    Edit ↑
                  </button>
                </div>
              </div>

              {/* Calendly inline widget — initialised programmatically via initInlineWidget */}
              <div className="rounded-3xl overflow-hidden border border-white/5 mb-6 relative">
                {/* Loading overlay — shown until Calendly iframe appears */}
                {widgetLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#1A1D22]" style={{ minHeight: '400px' }}>
                    <Loader2 size={32} className="animate-spin text-[#FF7A00]" />
                    <div className="text-center">
                      <p className="text-white/70 text-sm font-medium">Loading booking calendar…</p>
                      <p className="text-white/30 text-xs mt-1">This may take a moment on mobile</p>
                    </div>
                  </div>
                )}
                <div
                  id="calendly-inline"
                  className="calendly-inline-widget"
                  style={{ minWidth: '320px', height: '700px' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Alt contact */}
        <div className="text-center text-white/25 text-xs font-medium mt-4">
          Prefer to book over the phone?{' '}
          <a
            href="tel:08000430609"
            className="text-[#FF7A00] hover:text-[#FF9500] transition-colors font-bold"
          >
            <Phone size={12} className="inline mb-0.5 mr-0.5" />
            0800 043 0609
          </a>
        </div>

      </div>
    </div>
  );
}
