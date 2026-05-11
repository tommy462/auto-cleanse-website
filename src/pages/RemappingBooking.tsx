import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Car, MapPin, Wrench, CheckCircle,
  Phone, ClipboardList, Zap, Loader2, AlertTriangle, CalendarOff,
  ChevronLeft, ChevronRight, Calendar, Clock,
} from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import { BOOKING_CONFIG, REMAP_SERVICES, REMAP_OPTIONS, BASE_PRICES, type RemapServiceValue } from '../config/booking';

// Make.com webhook — receives combined booking record once payment confirms
const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/uw0b9gab1m4qdj1zhs4m4mkkn9kt5fva';

// Tell TypeScript about the <stripe-buy-button> web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface BookingForm {
  serviceType: RemapServiceValue | '';
  bookingType: 'workshop' | 'mobile' | '';
  selectedOptions: string[];
  legalAcknowledged: boolean;
  fullName: string;
  email: string;
  phone: string;
  vehicleRegistration: string;
  vehicleMakeModel: string;
  goals: string;
  notes: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  postcode: string;
}

export interface PendingBooking {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  serviceLabel: string;
  bookingType: string;
  vehicleRegistration: string;
  vehicleMakeModel: string;
  goals: string;
  notes: string;
  address: string | null;
  postcode: string | null;
  selectedOptions: string[];
  quotedPrice: number;
  jobDate: string;   // YYYY-MM-DD
  jobTime: string;   // HH:MM
  slotDisplay: string; // human-readable e.g. "Monday 3 June 2025 at 10:00"
}

const EMPTY: BookingForm = {
  serviceType: '', bookingType: '',
  selectedOptions: [],
  legalAcknowledged: false,
  fullName: '', email: '', phone: '',
  vehicleRegistration: '', vehicleMakeModel: '',
  goals: '', notes: '',
  addressLine1: '', addressLine2: '', townCity: '', postcode: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// Style helpers
// ─────────────────────────────────────────────────────────────────────────────

const INPUT =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7A00]/50 focus:ring-1 focus:ring-[#FF7A00]/30 transition-colors font-medium text-sm';
const LABEL = 'block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest';

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

function getServiceLabel(value: string) {
  return REMAP_SERVICES.find((s) => s.value === value)?.label ?? value;
}

function getFirstFreeOptionValue(selectedOptions: string[]): string | null {
  return selectedOptions.find((val) => {
    const opt = REMAP_OPTIONS.find((o) => o.value === val);
    return opt && opt.extraCost < 36;
  }) ?? null;
}

function calcQuotedPrice(serviceType: string, bookingType: string, selectedOptions: string[]): number {
  if (!serviceType || !bookingType) return 0;
  const prices = BASE_PRICES[serviceType as RemapServiceValue];
  if (!prices) return 0;
  const base = bookingType === 'mobile' ? prices.mobile : prices.workshop;
  const freeVal = getFirstFreeOptionValue(selectedOptions);
  const extras = selectedOptions.reduce((sum, val) => {
    if (val === freeVal) return sum;
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

function formatSlotDisplay(dateStr: string, time: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at ${time}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// DatePicker component
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_HEADERS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function DatePicker({
  blockedDates,
  selected,
  onSelect,
}: {
  blockedDates: string[];
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  // Today at midnight local time
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const minDate = new Date(todayMidnight);
  minDate.setDate(minDate.getDate() + BOOKING_CONFIG.minDaysAdvance);

  const maxDate = new Date(todayMidnight);
  maxDate.setDate(maxDate.getDate() + BOOKING_CONFIG.maxDaysAdvance);

  const [viewYear, setViewYear]   = useState(minDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(minDate.getMonth());

  const blockedSet = new Set(blockedDates);

  const todayStr = `${todayMidnight.getFullYear()}-${String(todayMidnight.getMonth()+1).padStart(2,'0')}-${String(todayMidnight.getDate()).padStart(2,'0')}`;

  // Build grid: pad start so Monday is column 0
  const firstDay = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // 0=Mon … 6=Sun

  type Cell = { dateStr: string; dayNum: number } | null;
  const cells: Cell[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const month = String(viewMonth + 1).padStart(2, '0');
    const day   = String(d).padStart(2, '0');
    cells.push({ dateStr: `${viewYear}-${month}-${day}`, dayNum: d });
  }

  const isDisabled = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00`);
    if (d < minDate || d > maxDate) return true;
    if (d.getDay() === 0) return true; // Sunday always closed
    if (blockedSet.has(dateStr)) return true;
    return false;
  };

  const minMonthKey = viewYear * 100 + viewMonth;
  const minAllowedKey = minDate.getFullYear() * 100 + minDate.getMonth();
  const maxAllowedKey = maxDate.getFullYear() * 100 + maxDate.getMonth();
  const canPrev = minMonthKey > minAllowedKey;
  const canNext = minMonthKey < maxAllowedKey;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="rounded-2xl bg-black/30 border border-white/10 p-4 sm:p-5 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-white font-bold text-sm">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canNext}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-white/25 text-[10px] font-bold uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`pad-${i}`} />;

          const { dateStr, dayNum } = cell;
          const disabled = isDisabled(dateStr);
          const isBlocked = blockedSet.has(dateStr);
          const isSunday  = new Date(`${dateStr}T12:00:00`).getDay() === 0;
          const isSelected = dateStr === selected;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={[
                'relative flex flex-col items-center justify-center rounded-lg py-2 text-sm font-medium transition-all',
                disabled
                  ? 'text-white/15 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-white/10 text-white',
                isSelected && !disabled
                  ? '!bg-[#FF7A00] !text-black font-black hover:!bg-[#ff8c20]'
                  : '',
                isToday && !isSelected
                  ? 'ring-1 ring-[#FF7A00]/40'
                  : '',
              ].join(' ')}
              aria-label={`${dateStr}${disabled ? ' (unavailable)' : ''}`}
            >
              {dayNum}
              {isBlocked && !isSunday && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400/70" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-medium">
          <span className="w-2 h-2 rounded-sm bg-[#FF7A00]" />
          Selected
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
          Blocked
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-medium">
          <span className="w-4 h-4 rounded-lg ring-1 ring-[#FF7A00]/40 text-[9px] flex items-center justify-center text-white/30">·</span>
          Today
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation screen (shown after Stripe payment completes inline)
// ─────────────────────────────────────────────────────────────────────────────

function BookingConfirmed({ booking }: { booking: PendingBooking }) {
  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Booking Confirmed | AutoCleanse Remapping"
        description="Your ECU remapping booking is confirmed."
        path="/remapping-booking"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[#FF7A00]/6 blur-[100px] rounded-[100%] pointer-events-none opacity-60" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10 text-center pt-6">
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
          Your £50 deposit has been received. We'll be in touch to confirm your vehicle details
          before the appointment.
        </p>

        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
            Booking summary
          </p>
          <dl className="space-y-2">
            {[
              { label: 'Name',    value: booking.fullName },
              { label: 'Email',   value: booking.email },
              { label: 'Phone',   value: booking.phone },
              { label: 'Service', value: booking.serviceLabel },
              { label: 'Date',    value: booking.slotDisplay },
              { label: 'Type',    value: booking.bookingType === 'mobile' ? '🚗 Mobile – we come to you' : '🏪 Workshop visit' },
              { label: 'Vehicle', value: `${booking.vehicleMakeModel} (${booking.vehicleRegistration})` },
              ...(booking.address ? [{ label: 'Address', value: booking.address }] : []),
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

        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
            What happens next
          </p>
          <ol className="space-y-3 text-sm text-white/50 leading-relaxed">
            {[
              'You\'ll receive a confirmation email shortly.',
              'We may call to confirm your vehicle details and advise on preparation.',
              booking.bookingType === 'mobile'
                ? "We'll arrive at your address at the booked time — please ensure the vehicle is accessible."
                : 'Bring your vehicle to us at the booked time with a full tank of fuel.',
              'Remaining balance is due on the day once the job is complete.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
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
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const prefillReg     = searchParams.get('reg') ?? '';
  const prefillVehicle = searchParams.get('vehicle') ?? '';

  const [form, setForm] = useState<BookingForm>({
    ...EMPTY,
    vehicleRegistration: prefillReg.toUpperCase(),
    vehicleMakeModel: prefillVehicle,
  });

  // Booking progress: 1 = details form, 2 = date+time, 3 = payment
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading]   = useState(false);
  const [slotsReason, setSlotsReason]     = useState<string | null>(null);

  const [blockedDates, setBlockedDates] = useState<{ date: string; reason: string | null }[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<PendingBooking | null>(null);

  const topRef          = useRef<HTMLDivElement>(null);
  const slotSectionRef  = useRef<HTMLDivElement>(null);
  const paymentRef      = useRef<HTMLDivElement>(null);

  // Guard against firing the webhook/job creation twice
  const jobCreated = useRef(false);

  const update = (u: Partial<BookingForm>) => setForm((f) => ({ ...f, ...u }));

  // ── Load Stripe buy-button script ──────────────────────────────────────────
  useEffect(() => {
    if (document.querySelector('script[data-stripe-buy-button]')) return;
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.setAttribute('data-stripe-buy-button', 'true');
    document.head.appendChild(script);
  }, []);

  // ── Fetch blocked dates from dashboard API ──────────────────────────────────
  useEffect(() => {
    fetch('/api/blocked-dates')
      .then((r) => r.ok ? r.json() : { dates: [] })
      .then((data) => setBlockedDates(data.dates ?? []))
      .catch(() => {});
  }, []);

  // ── Fetch available slots when date changes ─────────────────────────────────
  useEffect(() => {
    if (!selectedDate) return;
    setSelectedTime(null);
    setAvailableSlots([]);
    setSlotsReason(null);
    setSlotsLoading(true);

    fetch(`/api/available-slots?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailableSlots(data.slots ?? []);
        setSlotsReason(data.reason ?? null);
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  // ── Save booking data to sessionStorage when reaching payment step ───────────
  useEffect(() => {
    if (step !== 3 || !selectedDate || !selectedTime) return;

    const pending: PendingBooking = {
      fullName:            form.fullName,
      email:               form.email,
      phone:               form.phone,
      serviceType:         form.serviceType,
      serviceLabel:        getServiceLabel(form.serviceType),
      bookingType:         form.bookingType,
      vehicleRegistration: form.vehicleRegistration,
      vehicleMakeModel:    form.vehicleMakeModel,
      goals:               form.goals,
      notes:               form.notes,
      address:             form.bookingType === 'mobile' ? buildAddress(form) : null,
      postcode:            form.bookingType === 'mobile' ? form.postcode : null,
      selectedOptions:     form.selectedOptions,
      quotedPrice:         calcQuotedPrice(form.serviceType, form.bookingType, form.selectedOptions),
      jobDate:             selectedDate,
      jobTime:             selectedTime,
      slotDisplay:         formatSlotDisplay(selectedDate, selectedTime),
    };
    sessionStorage.setItem('pendingBooking', JSON.stringify(pending));
  }, [step, selectedDate, selectedTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Listen for Stripe buy-button completion ─────────────────────────────────
  useEffect(() => {
    const handleComplete = async () => {
      if (jobCreated.current) return;
      jobCreated.current = true;

      const raw = sessionStorage.getItem('pendingBooking');
      if (!raw) return;

      let pending: PendingBooking;
      try { pending = JSON.parse(raw); } catch { return; }

      setConfirmedBooking(pending);
      setBookingConfirmed(true);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const payload = {
        type:                'remap_booking_confirmed',
        source:              'stripe-buy-button',
        timestamp:           new Date().toISOString(),
        customerName:        pending.fullName,
        customerEmail:       pending.email,
        customerPhone:       pending.phone,
        serviceType:         pending.serviceType,
        serviceLabel:        pending.serviceLabel,
        bookingType:         pending.bookingType,
        vehicleRegistration: pending.vehicleRegistration,
        vehicleMakeModel:    pending.vehicleMakeModel,
        goals:               pending.goals,
        notes:               pending.notes || null,
        address:             pending.address,
        postcode:            pending.postcode,
        selectedOptions:     pending.selectedOptions,
        quotedPrice:         pending.quotedPrice,
        jobDate:             pending.jobDate,
        jobTime:             pending.jobTime,
      };

      await Promise.allSettled([
        fetch('/api/create-dashboard-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch((err) => console.error('[booking] Dashboard job error:', err)),

        fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch((err) => console.error('[booking] Make.com error:', err)),
      ]);

      sessionStorage.removeItem('pendingBooking');
    };

    // The stripe-buy-button element fires 'stripe-buy-button:completed' which bubbles to window
    window.addEventListener('stripe-buy-button:completed', handleComplete);
    return () => window.removeEventListener('stripe-buy-button:completed', handleComplete);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Validation ──────────────────────────────────────────────────────────────

  const hasOffRoadOptions = form.selectedOptions.some(
    (v) => REMAP_OPTIONS.find((o) => o.value === v)?.offRoadOnly,
  );

  const canProceed =
    form.serviceType !== '' &&
    form.bookingType !== '' &&
    form.fullName.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.vehicleRegistration.trim() !== '' &&
    form.vehicleMakeModel.trim() !== '' &&
    (form.bookingType !== 'mobile' ||
      (form.addressLine1.trim() !== '' && form.townCity.trim() !== '' && form.postcode.trim() !== '')) &&
    (!hasOffRoadOptions || form.legalAcknowledged);

  const canConfirmSlot = !!selectedDate && !!selectedTime;

  const handleProceedToSlot = () => {
    setStep(2);
    setTimeout(() => slotSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const handleProceedToPayment = () => {
    setStep(3);
    setTimeout(() => paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  // ── Confirmation screen ─────────────────────────────────────────────────────
  if (bookingConfirmed && confirmedBooking) {
    return <BookingConfirmed booking={confirmedBooking} />;
  }

  // ── Main booking page ───────────────────────────────────────────────────────
  return (
    <div ref={topRef} className="pt-28 pb-20 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Book a Remap | ECU Remapping Booking - AutoCleanse"
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

        {/* ── Step indicator ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8">
          {([1,2,3] as const).map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                step >= n ? 'bg-[#FF7A00] text-black' : 'bg-white/10 text-white/30'
              }`}>
                {n}
              </div>
              <span className={`text-xs font-bold transition-colors hidden sm:block ${
                step >= n ? 'text-white/60' : 'text-white/20'
              }`}>
                {n === 1 ? 'Your Details' : n === 2 ? 'Choose Slot' : 'Pay Deposit'}
              </span>
              {n < 3 && <div className={`w-6 h-px transition-colors ${step > n ? 'bg-[#FF7A00]/50' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* ── Step 1 header ─────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
            Step 1 of 3
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.05] mb-4">
            Your<br />
            <span className="text-[#FF7A00]">Details.</span>
          </h1>
          <p className="text-white/50 text-base font-medium leading-relaxed max-w-md">
            Tell us about your vehicle and what you need — then choose a slot and pay the{' '}
            {BOOKING_CONFIG.depositAmountDisplay} deposit to confirm.
          </p>
        </div>

        {/* ── 1. Service selector ───────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
          <h2 className="text-sm font-black text-white mb-5 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FF7A00] text-black text-[10px] font-black flex items-center justify-center shrink-0">1</span>
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
                      <div className="text-white/40 text-xs mt-1 leading-relaxed">{s.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. Workshop or mobile ─────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
          <h2 className="text-sm font-black text-white mb-5 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FF7A00] text-black text-[10px] font-black flex items-center justify-center shrink-0">2</span>
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
                  <div className={`mb-2 ${selected ? 'text-[#FF7A00]' : 'text-white/40'}`}>{icon}</div>
                  <div className={`font-bold text-sm ${selected ? 'text-[#FF7A00]' : 'text-white'}`}>{title}</div>
                  <div className="text-white/40 text-xs mt-1 leading-relaxed">{desc}</div>
                </button>
              );
            })}
          </div>

          {form.bookingType === 'mobile' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
              <div className="sm:col-span-2">
                <label className={LABEL}>Address Line 1 *</label>
                <input type="text" value={form.addressLine1} onChange={(e) => update({ addressLine1: e.target.value })} className={INPUT} placeholder="House number and street" />
              </div>
              <div>
                <label className={LABEL}>Address Line 2</label>
                <input type="text" value={form.addressLine2} onChange={(e) => update({ addressLine2: e.target.value })} className={INPUT} placeholder="Village / estate (optional)" />
              </div>
              <div>
                <label className={LABEL}>Town / City *</label>
                <input type="text" value={form.townCity} onChange={(e) => update({ townCity: e.target.value })} className={INPUT} placeholder="e.g. Exeter" />
              </div>
              <div>
                <label className={LABEL}>Postcode *</label>
                <input type="text" value={form.postcode} onChange={(e) => update({ postcode: e.target.value.toUpperCase() })} className={`${INPUT} uppercase`} placeholder="EX1 2AB" />
              </div>
            </div>
          )}
        </div>

        {/* ── 3. Contact details ───────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
          <h2 className="text-sm font-black text-white mb-5 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FF7A00] text-black text-[10px] font-black flex items-center justify-center shrink-0">3</span>
            Your Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={LABEL}>Full Name *</label>
              <input type="text" value={form.fullName} onChange={(e) => update({ fullName: e.target.value })} className={INPUT} placeholder="Your full name" />
            </div>
            <div>
              <label className={LABEL}>Email Address *</label>
              <input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} className={INPUT} placeholder="you@example.com" />
            </div>
            <div>
              <label className={LABEL}>Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => update({ phone: e.target.value })} className={INPUT} placeholder="07700 000000" />
            </div>
          </div>
        </div>

        {/* ── 4. Vehicle details ────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
          <h2 className="text-sm font-black text-white mb-5 flex items-center gap-3">
            <Car size={15} className="text-[#FF7A00]" />
            Vehicle Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Registration *</label>
              <input type="text" value={form.vehicleRegistration} onChange={(e) => update({ vehicleRegistration: e.target.value.toUpperCase() })} className={`${INPUT} uppercase`} placeholder="AB12 CDE" />
            </div>
            <div>
              <label className={LABEL}>Make &amp; Model *</label>
              <input type="text" value={form.vehicleMakeModel} onChange={(e) => update({ vehicleMakeModel: e.target.value })} className={INPUT} placeholder="e.g. Ford Transit 2.0 TDCi" />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>What are you hoping to achieve?</label>
              <textarea value={form.goals} onChange={(e) => update({ goals: e.target.value })} rows={3} className={INPUT} placeholder="e.g. More power for towing, better fuel economy, remove power restrictions…" />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Additional Notes</label>
              <textarea value={form.notes} onChange={(e) => update({ notes: e.target.value })} rows={2} className={INPUT} placeholder="Existing modifications, known faults, fleet size, questions…" />
            </div>
          </div>
        </div>

        {/* ── 5. Add-on options ─────────────────────────────────────────────── */}
        {form.serviceType && form.serviceType !== 'not-sure' && (
          <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
            <h2 className="text-sm font-black text-white mb-1 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FF7A00] text-black text-[10px] font-black flex items-center justify-center shrink-0">5</span>
              Add-on Options
            </h2>
            <p className="text-white/30 text-xs mb-4 ml-9">Select any extras you'd like included — tick all that apply</p>

            <div className="ml-9 mb-5 flex items-center gap-2.5 bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-2.5">
              <span className="text-green-400 text-base leading-none">✦</span>
              <p className="text-green-400 text-xs font-bold">
                First add-on included <span className="uppercase tracking-wider">FREE</span>
                <span className="text-green-400/50 font-normal ml-1">— additional add-ons from +£20</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REMAP_OPTIONS.map((opt) => {
                const checked  = form.selectedOptions.includes(opt.value);
                const freeVal  = getFirstFreeOptionValue(form.selectedOptions);
                const isFree   = checked && opt.value === freeVal;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const next = checked
                        ? form.selectedOptions.filter((v) => v !== opt.value)
                        : [...form.selectedOptions, opt.value];
                      update({ selectedOptions: next, legalAcknowledged: false });
                    }}
                    className={`flex flex-col gap-1.5 px-4 py-3 rounded-xl border text-left transition-all ${
                      checked
                        ? isFree ? 'bg-green-500/10 border-green-500/50'
                          : opt.offRoadOnly ? 'bg-amber-500/10 border-amber-500/50'
                          : 'bg-[#FF7A00]/10 border-[#FF7A00]/50'
                        : 'bg-black/20 border-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                        checked
                          ? isFree ? 'bg-green-500 border-green-500'
                            : opt.offRoadOnly ? 'bg-amber-500 border-amber-500'
                            : 'bg-[#FF7A00] border-[#FF7A00]'
                          : 'border-white/20'
                      }`}>
                        {checked && <span className="text-black text-[10px] font-black leading-none">✓</span>}
                      </span>
                      <span className={`text-sm font-medium flex-1 ${checked ? 'text-white' : 'text-white/60'}`}>
                        {opt.label}
                      </span>
                      {isFree ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-green-400 bg-green-500/15 border border-green-500/30 px-2 py-0.5 rounded-lg shrink-0 tracking-wide uppercase">✦ Free</span>
                      ) : opt.extraCost > 0 ? (
                        <span className="text-xs font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-2 py-0.5 rounded-lg shrink-0">+£{opt.extraCost}</span>
                      ) : null}
                    </div>
                    {isFree && <p className="ml-7 text-[10px] text-green-400/60 font-medium">Included at no extra cost</p>}
                    {opt.offRoadOnly && (
                      <div className="flex items-center gap-1.5 ml-7">
                        <AlertTriangle size={10} className="text-amber-400 shrink-0" />
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Off-road / export use only</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {hasOffRoadOptions && (
              <div className="mt-5 rounded-2xl bg-amber-500/8 border border-amber-500/30 p-5">
                <div className="flex gap-3 mb-3">
                  <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-amber-300 text-xs font-black uppercase tracking-widest">Important Legal Notice — Please Read</p>
                </div>
                <div className="text-white/60 text-xs leading-relaxed space-y-2 mb-4">
                  <p>
                    In the UK, a <strong className="text-white/80">DPF filter, EGR valve, AdBlue/SCR system,
                    and intake flaps</strong> must be fitted and functioning on your vehicle to comply with
                    emissions regulations under the Road Vehicles (Construction and Use) Regulations 1986
                    and the Motor Vehicles (Type Approval) Regulations.
                  </p>
                  <p>
                    Software deletion of these systems means the vehicle will <strong className="text-white/80">no longer
                    comply with UK road law</strong> and <strong className="text-amber-400">must not be driven on public
                    roads in the UK</strong>. This service is only lawful for vehicles used exclusively off-road, for
                    export outside the UK, or for competition/track use.
                  </p>
                  <p>
                    By proceeding you confirm that you understand and accept these legal responsibilities,
                    and that the vehicle will not be used on UK public roads following this modification.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <button
                    type="button"
                    onClick={() => update({ legalAcknowledged: !form.legalAcknowledged })}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      form.legalAcknowledged ? 'bg-amber-500 border-amber-500' : 'border-amber-500/50 group-hover:border-amber-500'
                    }`}
                  >
                    {form.legalAcknowledged && <span className="text-black text-[11px] font-black leading-none">✓</span>}
                  </button>
                  <span className="text-white/70 text-xs leading-relaxed">
                    I confirm I have read and understood the above. The vehicle is for{' '}
                    <strong className="text-white/90">off-road, export, or competition use only</strong> and I
                    accept full legal responsibility for its use following this modification.
                  </span>
                </label>
                {!form.legalAcknowledged && (
                  <p className="text-amber-400/70 text-[10px] font-bold mt-3 ml-8 uppercase tracking-wider">
                    ↑ You must tick this box before proceeding
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Proceed to slot selection button ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-16">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-[#FF7A00]/8 border border-[#FF7A00]/15 px-4 py-3">
              <Zap size={14} className="text-[#FF7A00] shrink-0" />
              <p className="text-white/50 text-xs leading-snug">
                <span className="text-white font-bold">{BOOKING_CONFIG.depositAmountDisplay} deposit</span> secures your slot. Balance due on the day.
              </p>
            </div>
            {formatPrice(form.serviceType, form.bookingType, form.selectedOptions) && (
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <span className="text-white/40 text-xs">Estimated total:</span>
                <span className="text-white font-black text-sm">
                  {formatPrice(form.serviceType, form.bookingType, form.selectedOptions)}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={!canProceed}
            onClick={handleProceedToSlot}
            className="btn-shine px-8 py-4 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <ClipboardList size={16} /> Choose Your Slot <ArrowRight size={15} />
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            Step 2: Choose date + time
        ════════════════════════════════════════════════════════════════════ */}
        <div ref={slotSectionRef} className="scroll-mt-28">
          {step >= 2 && (
            <>
              {/* Step 2 header */}
              <div className="mb-8">
                <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                  Step 2 of 3
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-3">
                  Choose Your <span className="text-[#FF7A00]">Slot.</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-md">
                  Select a date, then pick an available time. Slots are first-come, first-served.
                </p>
              </div>

              {/* Blocked dates notice */}
              {blockedDates.length > 0 && (
                <div className="rounded-2xl bg-red-500/8 border border-red-500/25 px-5 py-4 mb-6">
                  <div className="flex gap-3 mb-2">
                    <CalendarOff size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-300 text-xs font-black uppercase tracking-widest">Unavailable Dates</p>
                  </div>
                  <ul className="ml-7 space-y-1">
                    {blockedDates.map(({ date, reason }) => {
                      const [y, m, d] = date.split('-').map(Number);
                      const label = new Date(y, m - 1, d).toLocaleDateString('en-GB', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                      });
                      return (
                        <li key={date} className="text-xs text-red-300 font-medium">
                          {label}
                          {reason && <span className="text-white/30 font-normal ml-1.5">— {reason}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Summary strip */}
              <div className="rounded-2xl bg-[#1A1D22] border border-[#FF7A00]/20 px-5 py-4 mb-6">
                <div className="flex flex-wrap gap-x-6 gap-y-2 items-start">
                  <div>
                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mr-1.5">Service</span>
                    <span className="text-[#FF7A00] text-sm font-bold">{getServiceLabel(form.serviceType)}</span>
                  </div>
                  <div>
                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mr-1.5">Type</span>
                    <span className="text-white text-sm font-medium">{form.bookingType === 'mobile' ? '🚗 Mobile' : '🏪 Workshop'}</span>
                  </div>
                  <div>
                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mr-1.5">Vehicle</span>
                    <span className="text-white text-sm font-medium">{form.vehicleMakeModel} ({form.vehicleRegistration})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(null); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    className="text-white/25 hover:text-white/60 text-xs font-medium transition-colors sm:ml-auto"
                  >
                    Edit ↑
                  </button>
                </div>
              </div>

              {/* Date picker */}
              <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
                <h3 className="text-sm font-black text-white mb-5 flex items-center gap-3">
                  <Calendar size={15} className="text-[#FF7A00]" />
                  Select a Date
                </h3>
                <DatePicker
                  blockedDates={blockedDates.map((b) => b.date)}
                  selected={selectedDate}
                  onSelect={(d) => {
                    setSelectedDate(d);
                    setSelectedTime(null);
                  }}
                />
              </div>

              {/* Time slot picker */}
              {selectedDate && (
                <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-5">
                  <h3 className="text-sm font-black text-white mb-1 flex items-center gap-3">
                    <Clock size={15} className="text-[#FF7A00]" />
                    Available Times
                  </h3>
                  <p className="text-white/30 text-xs mb-5 ml-6">
                    {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  {slotsLoading && (
                    <div className="flex items-center justify-center py-8 gap-3">
                      <Loader2 size={20} className="animate-spin text-[#FF7A00]" />
                      <span className="text-white/40 text-sm">Checking availability…</span>
                    </div>
                  )}

                  {!slotsLoading && slotsReason === 'closed' && (
                    <p className="text-white/40 text-sm py-4 text-center">We're closed on this day. Please select another date.</p>
                  )}

                  {!slotsLoading && slotsReason === 'blocked' && (
                    <p className="text-red-400/80 text-sm py-4 text-center">This date is unavailable. Please select another date.</p>
                  )}

                  {!slotsLoading && !slotsReason && availableSlots.length === 0 && (
                    <p className="text-white/40 text-sm py-4 text-center">No slots available on this date. Please try another day.</p>
                  )}

                  {!slotsLoading && availableSlots.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => {
                        const isSelected = slot === selectedTime;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                              isSelected
                                ? 'bg-[#FF7A00] border-[#FF7A00] text-black'
                                : 'bg-black/30 border-white/[0.08] text-white hover:border-[#FF7A00]/40 hover:text-[#FF7A00]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Proceed to payment button */}
              <div className="flex justify-end mb-16">
                <button
                  type="button"
                  disabled={!canConfirmSlot}
                  onClick={handleProceedToPayment}
                  className="btn-shine px-8 py-4 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Slot &amp; Pay Deposit <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            Step 3: Payment
        ════════════════════════════════════════════════════════════════════ */}
        <div ref={paymentRef} className="scroll-mt-28">
          {step === 3 && selectedDate && selectedTime && (
            <>
              {/* Step 3 header */}
              <div className="mb-8">
                <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                  Step 3 of 3
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-3">
                  Secure Your <span className="text-[#FF7A00]">Slot.</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-md">
                  Pay the {BOOKING_CONFIG.depositAmountDisplay} deposit to confirm your booking.
                  The remaining balance is due on the day.
                </p>
              </div>

              {/* Booking summary */}
              <div className="rounded-3xl bg-[#1A1D22] border border-[#FF7A00]/20 p-6 sm:p-8 mb-6">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Booking Summary</p>
                <dl className="space-y-0">
                  {[
                    { label: 'Service',  value: getServiceLabel(form.serviceType) },
                    { label: 'Date',     value: formatSlotDisplay(selectedDate, selectedTime) },
                    { label: 'Type',     value: form.bookingType === 'mobile' ? '🚗 Mobile – we come to you' : '🏪 Workshop visit' },
                    { label: 'Vehicle',  value: `${form.vehicleMakeModel} (${form.vehicleRegistration})` },
                    ...(form.bookingType === 'mobile' ? [{ label: 'Address', value: buildAddress(form) }] : []),
                    ...(formatPrice(form.serviceType, form.bookingType, form.selectedOptions)
                      ? [{ label: 'Total est.', value: formatPrice(form.serviceType, form.bookingType, form.selectedOptions)! }]
                      : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 py-2.5 border-b border-white/5 last:border-0">
                      <dt className="text-white/30 text-xs font-bold uppercase tracking-widest w-20 shrink-0 pt-0.5">{label}</dt>
                      <dd className="text-white text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  type="button"
                  onClick={() => { setStep(2); setSelectedTime(null); slotSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="mt-4 text-white/25 hover:text-white/60 text-xs font-medium transition-colors"
                >
                  Change slot ↑
                </button>
              </div>

              {/* Stripe Buy Button */}
              <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center shrink-0">
                    <Zap size={14} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Pay {BOOKING_CONFIG.depositAmountDisplay} deposit</p>
                    <p className="text-white/40 text-xs">Secures your slot. Balance due on the day.</p>
                  </div>
                </div>

                <div className="flex justify-center py-2">
                  <stripe-buy-button
                    buy-button-id="buy_btn_1TR7zyJ6Gx6wxrAfdXtmc06U"
                    publishable-key="pk_live_51TQkxIJ6Gx6wxrAfnYCzrPhXcDdwdizGyzZGK2b7WikhO7iJg9h1KL52F3wGi5uPtaH4oDx0LuZfOPWYbmlMB2A700Xoc41KIM"
                  />
                </div>

                <p className="text-white/25 text-[11px] text-center mt-4 leading-relaxed">
                  Secure payment processed by Stripe. Your slot is confirmed once payment is complete.<br />
                  You'll receive a confirmation email shortly after.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Alt contact */}
        <div className="text-center text-white/25 text-xs font-medium mt-4 pb-4">
          Prefer to book over the phone?{' '}
          <a href="tel:08000430609" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors font-bold">
            <Phone size={12} className="inline mb-0.5 mr-0.5" />
            0800 043 0609
          </a>
        </div>

      </div>
    </div>
  );
}
