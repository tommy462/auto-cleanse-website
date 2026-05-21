import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Car, MapPin, Wrench, CheckCircle,
  Phone, Zap, Loader2, AlertTriangle, CalendarOff,
  ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight,
} from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import { BOOKING_CONFIG, REMAP_SERVICES, REMAP_OPTIONS, BASE_PRICES, type RemapServiceValue } from '../config/booking';

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/uw0b9gab1m4qdj1zhs4m4mkkn9kt5fva';

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
  jobDate: string;
  jobTime: string;
  slotDisplay: string;
}

type CardId =
  | 'service'
  | 'location'
  | 'address'
  | 'contact'
  | 'vehicle'
  | 'addons'
  | 'legal'
  | 'date'
  | 'time'
  | 'payment';

const EMPTY: BookingForm = {
  serviceType: '', bookingType: '',
  selectedOptions: [], legalAcknowledged: false,
  fullName: '', email: '', phone: '',
  vehicleRegistration: '', vehicleMakeModel: '', goals: '', notes: '',
  addressLine1: '', addressLine2: '', townCity: '', postcode: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles & animations
// ─────────────────────────────────────────────────────────────────────────────

const INPUT =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7A00]/50 focus:ring-1 focus:ring-[#FF7A00]/30 transition-colors font-medium text-sm';
const LABEL = 'block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest';

const CARD_CSS = `
@keyframes cardInRight { from { transform: translateX(52px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes cardInLeft  { from { transform: translateX(-52px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

const getServiceLabel = (v: string) =>
  REMAP_SERVICES.find((s) => s.value === v)?.label ?? v;

const getFirstFreeOption = (opts: string[]) =>
  opts.find((v) => { const o = REMAP_OPTIONS.find((x) => x.value === v); return o && o.extraCost < 36; }) ?? null;

function calcQuotedPrice(serviceType: string, bookingType: string, opts: string[], dateStr?: string | null): number {
  if (!serviceType || !bookingType) return 0;
  const prices = BASE_PRICES[serviceType as RemapServiceValue];
  if (!prices) return 0;
  const base = bookingType === 'mobile' ? prices.mobile : prices.workshop;
  const freeVal = getFirstFreeOption(opts);
  const addons = opts.reduce((s, v) => v === freeVal ? s : s + (REMAP_OPTIONS.find((o) => o.value === v)?.extraCost ?? 0), 0);
  const surcharge = dateStr && isWeekendDate(dateStr) ? BOOKING_CONFIG.weekendSurchargePounds : 0;
  return base + addons + surcharge;
}

function formatPrice(serviceType: string, bookingType: string, opts: string[], dateStr?: string | null): string | null {
  if (!serviceType || !bookingType || serviceType === 'not-sure') return null;
  const prices = BASE_PRICES[serviceType as RemapServiceValue];
  if (!prices) return null;
  const total = calcQuotedPrice(serviceType, bookingType, opts, dateStr);
  return `${prices.fromPrice ? 'from ' : ''}£${total}`;
}

const buildAddress = (f: BookingForm) =>
  [f.addressLine1, f.addressLine2, f.townCity, f.postcode].filter(Boolean).join(', ');

const isWeekendDate = (dateStr: string) => {
  const day = new Date(`${dateStr}T12:00:00`).getDay();
  return day === 0 || day === 6;
};

const formatSlotDisplay = (dateStr: string, time: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at ${time}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DatePicker
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_HEADERS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function DatePicker({ blockedDates, selected, onSelect }: {
  blockedDates: string[];
  selected: string | null;
  onSelect: (d: string) => void;
}) {
  const todayMidnight = new Date(); todayMidnight.setHours(0,0,0,0);
  const minDate = new Date(todayMidnight); minDate.setDate(minDate.getDate() + BOOKING_CONFIG.minDaysAdvance);
  const maxDate = new Date(todayMidnight); maxDate.setDate(maxDate.getDate() + BOOKING_CONFIG.maxDaysAdvance);

  const [viewYear, setViewYear]   = useState(minDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(minDate.getMonth());

  const blockedSet  = new Set(blockedDates);
  const todayStr    = `${todayMidnight.getFullYear()}-${String(todayMidnight.getMonth()+1).padStart(2,'0')}-${String(todayMidnight.getDate()).padStart(2,'0')}`;
  const firstDay    = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  type Cell = { dateStr: string; dayNum: number } | null;
  const cells: Cell[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ dateStr: `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, dayNum: d });
  }

  const isDisabled = (ds: string) => {
    const d = new Date(`${ds}T12:00:00`);
    return d < minDate || d > maxDate || blockedSet.has(ds);
  };

  const monthKey    = viewYear * 100 + viewMonth;
  const minKey      = minDate.getFullYear() * 100 + minDate.getMonth();
  const maxKey      = maxDate.getFullYear() * 100 + maxDate.getMonth();

  const prevMonth = () => viewMonth === 0 ? (setViewYear(y=>y-1), setViewMonth(11)) : setViewMonth(m=>m-1);
  const nextMonth = () => viewMonth === 11 ? (setViewYear(y=>y+1), setViewMonth(0)) : setViewMonth(m=>m+1);

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} disabled={monthKey <= minKey}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
          <ChevronLeft size={16} />
        </button>
        <span className="text-white font-bold text-sm">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button type="button" onClick={nextMonth} disabled={monthKey >= maxKey}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-white/25 text-[9px] font-bold uppercase tracking-wider py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`p${i}`} />;
          const { dateStr, dayNum } = cell;
          const disabled   = isDisabled(dateStr);
          const isSelected = dateStr === selected;
          const isToday    = dateStr === todayStr;
          const isBlocked  = blockedSet.has(dateStr);
          const isWeekend = isWeekendDate(dateStr);
          return (
            <button key={dateStr} type="button" disabled={disabled} onClick={() => onSelect(dateStr)}
              className={[
                'relative flex flex-col items-center justify-center rounded-lg py-2 text-xs font-medium transition-all',
                disabled ? 'text-white/15 cursor-not-allowed' : 'cursor-pointer hover:bg-white/10 text-white',
                isSelected && !disabled ? '!bg-[#FF7A00] !text-black font-black' : '',
                isToday && !isSelected ? 'ring-1 ring-[#FF7A00]/40' : '',
                isWeekend && !disabled && !isSelected ? 'ring-1 ring-amber-500/30' : '',
              ].join(' ')}>
              {dayNum}
              {isWeekend && !disabled && !isSelected && (
                <span className="text-[7px] font-bold text-amber-400/70 leading-none mt-0.5">+£30</span>
              )}
              {isBlocked && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400/70" />}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-white/5">
        {[['', 'bg-[#FF7A00]', 'Selected'],['','ring-1 ring-[#FF7A00]/40 bg-transparent','Today'],['bg-red-400/70','','Blocked']].map(([bg,ring,label])=>(
          <div key={label} className="flex items-center gap-1.5 text-[9px] text-white/30 font-medium">
            <span className={`w-2 h-2 rounded-sm ${bg} ${ring} inline-block`} />
            {label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-[9px] text-amber-400/50 font-medium">
          <span className="w-2 h-2 rounded-sm ring-1 ring-amber-500/40 inline-block" />
          Weekend +£{BOOKING_CONFIG.weekendSurchargePounds}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking confirmed screen
// ─────────────────────────────────────────────────────────────────────────────

function BookingConfirmed({ booking }: { booking: PendingBooking }) {
  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="Booking Confirmed | AutoCleanse Remapping" description="Your ECU remapping booking is confirmed." path="/remapping-booking" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[#FF7A00]/6 blur-[100px] rounded-[100%] pointer-events-none opacity-60" />
      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10 text-center pt-6">
        <div className="w-20 h-20 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[#FF7A00]" strokeWidth={1.5} />
        </div>
        <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">Booking confirmed</div>
        <h1 className="text-4xl font-black tracking-tighter text-white mb-4">You're all booked in.</h1>
        <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Your £50 deposit has been received. We'll be in touch before your appointment.
        </p>
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Booking summary</p>
          <dl className="space-y-0">
            {[
              { l: 'Name',    v: booking.fullName },
              { l: 'Email',   v: booking.email },
              { l: 'Phone',   v: booking.phone },
              { l: 'Service', v: booking.serviceLabel },
              { l: 'Date',    v: booking.slotDisplay },
              { l: 'Type',    v: booking.bookingType === 'mobile' ? '🚗 Mobile' : '🏪 Workshop' },
              { l: 'Vehicle', v: `${booking.vehicleMakeModel} (${booking.vehicleRegistration})` },
              ...(booking.address ? [{ l: 'Address', v: booking.address }] : []),
            ].map(({ l, v }) => (
              <div key={l} className="flex gap-3 py-2.5 border-b border-white/5 last:border-0">
                <dt className="text-white/30 text-[10px] font-bold uppercase tracking-widest w-14 shrink-0 pt-0.5">{l}</dt>
                <dd className="text-white text-xs font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">What happens next</p>
          <ol className="space-y-3 text-sm text-white/50 leading-relaxed">
            {["You'll receive a confirmation email shortly.",
              "We may call to confirm your vehicle details and advise on preparation.",
              booking.bookingType === 'mobile' ? "We'll arrive at your address at the booked time - please ensure the vehicle is accessible." : "Bring your vehicle to us at the booked time with a full tank of fuel.",
              "Remaining balance is due on the day once the job is complete."
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <MagneticButton>
            <a href="tel:08000430609" className="btn-shine px-7 py-3 rounded-xl font-bold text-sm text-white hover:text-white inline-flex items-center gap-2">
              <Phone size={15} /> Call Us
            </a>
          </MagneticButton>
          <Link to="/" className="px-7 py-3 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card titles / step labels
// ─────────────────────────────────────────────────────────────────────────────

const CARD_META: Record<CardId, { title: string; subtitle?: string }> = {
  service:  { title: 'What service do you need?', subtitle: 'Choose the option that fits your vehicle' },
  location: { title: 'Workshop or mobile?', subtitle: 'We come to you, or you come to us' },
  address:  { title: 'Your address', subtitle: 'Where should we come to?' },
  contact:  { title: 'Your contact details', subtitle: "So we can confirm your booking" },
  vehicle:  { title: 'Your vehicle', subtitle: 'Tell us about the car we\'ll be working on' },
  addons:   { title: 'Add-on options', subtitle: 'First add-on is FREE - extras from +£20' },
  legal:    { title: 'Legal notice', subtitle: 'Please read and confirm before continuing' },
  date:     { title: 'Choose a date', subtitle: 'Select an available day' },
  time:     { title: 'Choose a time', subtitle: 'Pick an available slot' },
  payment:  { title: 'Secure your slot', subtitle: 'Pay the £50 deposit to confirm' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function RemappingBooking() {
  const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

  const [form, setForm] = useState<BookingForm>({
    ...EMPTY,
    vehicleRegistration: sp.get('reg')?.toUpperCase() ?? '',
    vehicleMakeModel:    sp.get('vehicle') ?? '',
  });

  // Card carousel state
  const [currentCard, setCurrentCard]   = useState<CardId>('service');
  const [animKey, setAnimKey]           = useState(0);
  const [animDir, setAnimDir]           = useState<'forward' | 'back'>('forward');

  // Slot / date state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading]   = useState(false);
  const [slotsReason, setSlotsReason]     = useState<string | null>(null);

  // Blocked dates
  const [blockedDates, setBlockedDates] = useState<{ date: string; reason: string | null }[]>([]);

  // Booking completion
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<PendingBooking | null>(null);

  const topRef    = useRef<HTMLDivElement>(null);
  const jobCreated = useRef(false);

  const update = (u: Partial<BookingForm>) => setForm(f => ({ ...f, ...u }));

  const hasOffRoadOptions = form.selectedOptions.some(v => REMAP_OPTIONS.find(o => o.value === v)?.offRoadOnly);

  // ── Sequence ────────────────────────────────────────────────────────────────

  function getSequence(): CardId[] {
    const cards: CardId[] = ['service', 'location'];
    if (form.bookingType === 'mobile') cards.push('address');
    cards.push('contact', 'vehicle');
    if (form.serviceType && form.serviceType !== 'not-sure') cards.push('addons');
    if (hasOffRoadOptions) cards.push('legal');
    cards.push('date', 'time', 'payment');
    return cards;
  }

  // Fixed ordering - used to find the nearest preceding card when the current
  // card is removed from the sequence (e.g. switching mobile → workshop removes 'address')
  const FULL_ORDER: CardId[] = ['service', 'location', 'address', 'contact', 'vehicle', 'addons', 'legal', 'date', 'time', 'payment'];

  // If form changes make current card invalid, fall back to the nearest preceding valid card
  useEffect(() => {
    const seq = getSequence();
    if (!seq.includes(currentCard)) {
      const fullIdx = FULL_ORDER.indexOf(currentCard);
      // Walk backwards through the canonical order to find the last card still in seq
      const fallback = [...seq].reverse().find(c => FULL_ORDER.indexOf(c) < fullIdx) ?? seq[0];
      setCurrentCard(fallback);
      setAnimKey(k => k + 1);
      setAnimDir('back');
    }
  }, [form.serviceType, form.bookingType, hasOffRoadOptions]); // eslint-disable-line

  // ── Navigation ──────────────────────────────────────────────────────────────

  function navigate(target: CardId, dir: 'forward' | 'back') {
    setAnimDir(dir);
    setCurrentCard(target);
    setAnimKey(k => k + 1);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goNext() {
    const seq = getSequence();
    const idx = seq.indexOf(currentCard);
    if (idx < seq.length - 1) navigate(seq[idx + 1], 'forward');
  }

  function goBack() {
    const seq = getSequence();
    const idx = seq.indexOf(currentCard);
    if (idx > 0) navigate(seq[idx - 1], 'back');
  }

  // Auto-advance after a short delay (used for single-click selections)
  function autoNext(delay = 220) {
    setTimeout(goNext, delay);
  }

  // ── Effects ─────────────────────────────────────────────────────────────────

  // Load Stripe script
  useEffect(() => {
    if (document.querySelector('script[data-stripe-buy-button]')) return;
    const s = document.createElement('script');
    s.src = 'https://js.stripe.com/v3/buy-button.js';
    s.async = true;
    s.setAttribute('data-stripe-buy-button', 'true');
    document.head.appendChild(s);
  }, []);

  // Fetch blocked dates
  useEffect(() => {
    fetch('/api/blocked-dates')
      .then(r => r.ok ? r.json() : { dates: [] })
      .then(d => setBlockedDates(d.dates ?? []))
      .catch(() => {});
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    setSelectedTime(null);
    setAvailableSlots([]);
    setSlotsReason(null);
    setSlotsLoading(true);
    fetch(`/api/available-slots?date=${selectedDate}`)
      .then(r => r.json())
      .then(d => { setAvailableSlots(d.slots ?? []); setSlotsReason(d.reason ?? null); })
      .catch(() => setAvailableSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  // Save to sessionStorage when reaching payment card
  useEffect(() => {
    if (currentCard !== 'payment' || !selectedDate || !selectedTime) return;
    const pending: PendingBooking = {
      fullName: form.fullName, email: form.email, phone: form.phone,
      serviceType: form.serviceType, serviceLabel: getServiceLabel(form.serviceType),
      bookingType: form.bookingType,
      vehicleRegistration: form.vehicleRegistration, vehicleMakeModel: form.vehicleMakeModel,
      goals: form.goals, notes: form.notes,
      address: form.bookingType === 'mobile' ? buildAddress(form) : null,
      postcode: form.bookingType === 'mobile' ? form.postcode : null,
      selectedOptions: form.selectedOptions,
      quotedPrice: calcQuotedPrice(form.serviceType, form.bookingType, form.selectedOptions, selectedDate),
      jobDate: selectedDate, jobTime: selectedTime,
      slotDisplay: formatSlotDisplay(selectedDate, selectedTime),
    };
    sessionStorage.setItem('pendingBooking', JSON.stringify(pending));
  }, [currentCard, selectedDate, selectedTime]); // eslint-disable-line

  // Stripe buy-button completion
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
        type: 'remap_booking_confirmed', source: 'stripe-buy-button',
        timestamp: new Date().toISOString(),
        customerName: pending.fullName, customerEmail: pending.email, customerPhone: pending.phone,
        serviceType: pending.serviceType, serviceLabel: pending.serviceLabel,
        bookingType: pending.bookingType,
        vehicleRegistration: pending.vehicleRegistration, vehicleMakeModel: pending.vehicleMakeModel,
        goals: pending.goals, notes: pending.notes || null,
        address: pending.address, postcode: pending.postcode,
        selectedOptions: pending.selectedOptions, quotedPrice: pending.quotedPrice,
        jobDate: pending.jobDate, jobTime: pending.jobTime,
      };
      await Promise.allSettled([
        fetch('/api/create-dashboard-job', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch(MAKE_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
      ]);
      sessionStorage.removeItem('pendingBooking');
    };
    window.addEventListener('stripe-buy-button:completed', handleComplete);
    return () => window.removeEventListener('stripe-buy-button:completed', handleComplete);
  }, []); // eslint-disable-line

  // ── Per-card validation ──────────────────────────────────────────────────────

  const canProceed: Record<CardId, boolean> = {
    service:  form.serviceType !== '',
    location: form.bookingType !== '',
    address:  form.addressLine1.trim() !== '' && form.townCity.trim() !== '' && form.postcode.trim() !== '',
    contact:  form.fullName.trim() !== '' && form.email.trim() !== '' && form.phone.trim() !== '',
    vehicle:  form.vehicleRegistration.trim() !== '' && form.vehicleMakeModel.trim() !== '',
    addons:   true,
    legal:    form.legalAcknowledged,
    date:     selectedDate !== null && !slotsLoading,
    time:     selectedTime !== null,
    payment:  true,
  };

  // ── Confirmation ─────────────────────────────────────────────────────────────

  if (bookingConfirmed && confirmedBooking) return <BookingConfirmed booking={confirmedBooking} />;

  // ── Build sequence & progress ─────────────────────────────────────────────────

  const sequence   = getSequence();
  const cardIndex  = Math.max(0, sequence.indexOf(currentCard)); // clamp -1 during effect async gap
  const isFirst    = cardIndex === 0;
  const progress   = Math.round(((cardIndex + 1) / sequence.length) * 100);
  const meta       = CARD_META[currentCard];

  // ── Card content renderer ─────────────────────────────────────────────────────

  function renderContent() {
    switch (currentCard) {

      /* ── Service type ─────────────────────────────────────────────────────── */
      case 'service':
        return (
          <div className="grid grid-cols-1 gap-2.5">
            {REMAP_SERVICES.map(s => {
              const sel = form.serviceType === s.value;
              return (
                <button key={s.value} type="button"
                  onClick={() => { update({ serviceType: s.value as RemapServiceValue }); autoNext(); }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    sel ? 'bg-[#FF7A00]/10 border-[#FF7A00]/50 ring-1 ring-[#FF7A00]/30' : 'bg-black/30 border-white/[0.08] hover:border-white/20'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm ${sel ? 'text-[#FF7A00]' : 'text-white'}`}>{s.label}</div>
                      <div className="text-white/40 text-xs mt-0.5 leading-snug">{s.description}</div>
                    </div>
                    {sel && <ChevronRight size={16} className="text-[#FF7A00] shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        );

      /* ── Workshop / Mobile ────────────────────────────────────────────────── */
      case 'location':
        return (
          <div className="grid grid-cols-1 gap-3">
            {([
              { value: 'workshop' as const, icon: <Wrench size={20} />, title: 'Workshop Visit', desc: `Bring your vehicle to us in ${BOOKING_CONFIG.workshopAddressDisplay}` },
              { value: 'mobile'   as const, icon: <MapPin size={20} />, title: 'Mobile Booking',  desc: `We come to you - within ${BOOKING_CONFIG.maxServiceRadiusMiles} miles of ${BOOKING_CONFIG.workshopAddressDisplay}` },
            ]).map(({ value, icon, title, desc }) => {
              const sel = form.bookingType === value;
              return (
                <button key={value} type="button"
                  onClick={() => { update({ bookingType: value }); autoNext(); }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    sel ? 'bg-[#FF7A00]/10 border-[#FF7A00]/50 ring-1 ring-[#FF7A00]/30' : 'bg-black/30 border-white/[0.08] hover:border-white/20'
                  }`}>
                  <div className={`mb-2 ${sel ? 'text-[#FF7A00]' : 'text-white/40'}`}>{icon}</div>
                  <div className={`font-bold text-sm ${sel ? 'text-[#FF7A00]' : 'text-white'}`}>{title}</div>
                  <div className="text-white/40 text-xs mt-1 leading-relaxed">{desc}</div>
                </button>
              );
            })}
          </div>
        );

      /* ── Mobile address ───────────────────────────────────────────────────── */
      case 'address':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={LABEL}>Address Line 1 *</label>
              <input type="text" value={form.addressLine1} onChange={e => update({ addressLine1: e.target.value })} className={INPUT} placeholder="House number and street" />
            </div>
            <div>
              <label className={LABEL}>Address Line 2</label>
              <input type="text" value={form.addressLine2} onChange={e => update({ addressLine2: e.target.value })} className={INPUT} placeholder="Village / estate (optional)" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Town / City *</label>
                <input type="text" value={form.townCity} onChange={e => update({ townCity: e.target.value })} className={INPUT} placeholder="e.g. Exeter" />
              </div>
              <div>
                <label className={LABEL}>Postcode *</label>
                <input type="text" value={form.postcode} onChange={e => update({ postcode: e.target.value.toUpperCase() })} className={`${INPUT} uppercase`} placeholder="EX1 2AB" />
              </div>
            </div>
          </div>
        );

      /* ── Contact details ──────────────────────────────────────────────────── */
      case 'contact':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={LABEL}>Full Name *</label>
              <input type="text" value={form.fullName} onChange={e => update({ fullName: e.target.value })} className={INPUT} placeholder="Your full name" />
            </div>
            <div>
              <label className={LABEL}>Email Address *</label>
              <input type="email" value={form.email} onChange={e => update({ email: e.target.value })} className={INPUT} placeholder="you@example.com" />
            </div>
            <div>
              <label className={LABEL}>Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => update({ phone: e.target.value })} className={INPUT} placeholder="07700 000000" />
            </div>
          </div>
        );

      /* ── Vehicle details ──────────────────────────────────────────────────── */
      case 'vehicle':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Registration *</label>
                <input type="text" value={form.vehicleRegistration} onChange={e => update({ vehicleRegistration: e.target.value.toUpperCase() })} className={`${INPUT} uppercase`} placeholder="AB12 CDE" />
              </div>
              <div>
                <label className={LABEL}>Make &amp; Model *</label>
                <input type="text" value={form.vehicleMakeModel} onChange={e => update({ vehicleMakeModel: e.target.value })} className={INPUT} placeholder="Ford Transit 2.0" />
              </div>
            </div>
            <div>
              <label className={LABEL}>What are you hoping to achieve?</label>
              <textarea value={form.goals} onChange={e => update({ goals: e.target.value })} rows={3} className={INPUT} placeholder="More power for towing, better fuel economy, remove power restrictions…" />
            </div>
            <div>
              <label className={LABEL}>Additional Notes</label>
              <textarea value={form.notes} onChange={e => update({ notes: e.target.value })} rows={2} className={INPUT} placeholder="Existing mods, known faults, questions…" />
            </div>
          </div>
        );

      /* ── Add-ons ──────────────────────────────────────────────────────────── */
      case 'addons': {
        const freeVal = getFirstFreeOption(form.selectedOptions);
        return (
          <div>
            <div className="flex items-center gap-2 bg-green-500/8 border border-green-500/20 rounded-xl px-3 py-2 mb-4">
              <span className="text-green-400 text-sm">✦</span>
              <p className="text-green-400 text-xs font-bold">
                First add-on <span className="uppercase tracking-wider">FREE</span>
                <span className="text-green-400/50 font-normal ml-1">- extras from +£20</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REMAP_OPTIONS.map(opt => {
                const checked = form.selectedOptions.includes(opt.value);
                const isFree  = checked && opt.value === freeVal;
                return (
                  <button key={opt.value} type="button"
                    onClick={() => {
                      const next = checked ? form.selectedOptions.filter(v => v !== opt.value) : [...form.selectedOptions, opt.value];
                      update({ selectedOptions: next, legalAcknowledged: false });
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      checked
                        ? isFree ? 'bg-green-500/10 border-green-500/50'
                          : opt.offRoadOnly ? 'bg-amber-500/10 border-amber-500/50'
                          : 'bg-[#FF7A00]/10 border-[#FF7A00]/50'
                        : 'bg-black/20 border-white/[0.07] hover:border-white/20'
                    }`}>
                    <span className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center ${
                      checked
                        ? isFree ? 'bg-green-500 border-green-500' : opt.offRoadOnly ? 'bg-amber-500 border-amber-500' : 'bg-[#FF7A00] border-[#FF7A00]'
                        : 'border-white/20'
                    }`}>
                      {checked && <span className="text-black text-[9px] font-black leading-none">✓</span>}
                    </span>
                    <span className={`text-xs font-medium flex-1 leading-snug ${checked ? 'text-white' : 'text-white/60'}`}>{opt.label}</span>
                    {opt.offRoadOnly && <AlertTriangle size={10} className="text-amber-400 shrink-0" />}
                    {isFree
                      ? <span className="text-[9px] font-black text-green-400 bg-green-500/15 border border-green-500/30 px-1.5 py-0.5 rounded shrink-0">FREE</span>
                      : opt.extraCost > 0
                      ? <span className="text-[10px] font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-1.5 py-0.5 rounded shrink-0">+£{opt.extraCost}</span>
                      : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      /* ── Legal ────────────────────────────────────────────────────────────── */
      case 'legal':
        return (
          <div>
            <div className="flex gap-2.5 mb-3">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-300 text-xs font-black uppercase tracking-widest">Off-road / Export Use Only</p>
            </div>
            <div className="text-white/60 text-xs leading-relaxed space-y-2 mb-5">
              <p>In the UK, a <strong className="text-white/80">DPF filter, EGR valve, AdBlue/SCR system, and intake flaps</strong> must be fitted and functioning to comply with emissions regulations.</p>
              <p>Software deletion of these systems means the vehicle will <strong className="text-white/80">no longer comply with UK road law</strong> and <strong className="text-amber-400">must not be driven on public roads</strong>. This service is only lawful for off-road, export, or competition/track use.</p>
              <p>By proceeding you confirm you understand and accept these legal responsibilities.</p>
            </div>
            <button type="button" onClick={() => update({ legalAcknowledged: !form.legalAcknowledged })}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                form.legalAcknowledged ? 'bg-amber-500/10 border-amber-500/50' : 'bg-black/30 border-white/[0.08] hover:border-amber-500/30'
              }`}>
              <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                form.legalAcknowledged ? 'bg-amber-500 border-amber-500' : 'border-amber-500/40'
              }`}>
                {form.legalAcknowledged && <span className="text-black text-[10px] font-black leading-none">✓</span>}
              </span>
              <span className="text-white/70 text-xs leading-relaxed">
                I confirm the vehicle is for <strong className="text-white/90">off-road, export, or competition use only</strong> and I accept full legal responsibility.
              </span>
            </button>
          </div>
        );

      /* ── Date picker ──────────────────────────────────────────────────────── */
      case 'date':
        return (
          <div>
            {blockedDates.length > 0 && (
              <div className="rounded-xl bg-red-500/8 border border-red-500/25 px-4 py-3 mb-4">
                <div className="flex gap-2 mb-1.5">
                  <CalendarOff size={14} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300 text-[10px] font-black uppercase tracking-widest">Unavailable dates</p>
                </div>
                <ul className="space-y-0.5 ml-5">
                  {blockedDates.map(({ date, reason }) => {
                    const [y,m,d] = date.split('-').map(Number);
                    return (
                      <li key={date} className="text-[10px] text-red-300 font-medium">
                        {new Date(y,m-1,d).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}
                        {reason && <span className="text-white/30 font-normal ml-1">- {reason}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <DatePicker
              blockedDates={blockedDates.map(b => b.date)}
              selected={selectedDate}
              onSelect={d => { setSelectedDate(d); setSelectedTime(null); }}
            />
            {selectedDate && isWeekendDate(selectedDate) && (
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 px-3 py-2.5 mt-3">
                <span className="text-amber-400 text-sm shrink-0 leading-none mt-0.5">⚠</span>
                <p className="text-amber-300 text-xs leading-snug">
                  <span className="font-bold">Weekend booking - +£{BOOKING_CONFIG.weekendSurchargePounds} surcharge</span>
                  <span className="text-amber-400/60"> applies to all Saturday and Sunday appointments.</span>
                </p>
              </div>
            )}
          </div>
        );

      /* ── Time slots ───────────────────────────────────────────────────────── */
      case 'time':
        return (
          <div>
            {selectedDate && (
              <p className="flex items-center gap-2 text-white/40 text-xs mb-4">
                <Calendar size={13} className="text-[#FF7A00]" />
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
                <button type="button" onClick={() => navigate('date','back')} className="text-[#FF7A00]/70 hover:text-[#FF7A00] transition-colors ml-1">← change</button>
              </p>
            )}
            {selectedDate && isWeekendDate(selectedDate) && (
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 px-3 py-2.5 mb-4">
                <span className="text-amber-400 text-sm shrink-0 leading-none mt-0.5">⚠</span>
                <p className="text-amber-300 text-xs leading-snug">
                  <span className="font-bold">Weekend booking - +£{BOOKING_CONFIG.weekendSurchargePounds} surcharge</span>
                  <span className="text-amber-400/60"> applies to this appointment.</span>
                </p>
              </div>
            )}
            {slotsLoading && (
              <div className="flex items-center justify-center py-10 gap-3">
                <Loader2 size={20} className="animate-spin text-[#FF7A00]" />
                <span className="text-white/40 text-sm">Checking availability…</span>
              </div>
            )}
            {!slotsLoading && (slotsReason === 'closed' || slotsReason === 'blocked') && (
              <div className="text-center py-8">
                <p className="text-white/40 text-sm mb-3">
                  {slotsReason === 'closed' ? "We're closed on this day." : "This date is unavailable."}
                </p>
                <button type="button" onClick={() => navigate('date','back')} className="text-[#FF7A00] text-sm font-bold hover:underline">
                  ← Choose another date
                </button>
              </div>
            )}
            {!slotsLoading && !slotsReason && availableSlots.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/40 text-sm mb-3">No slots available on this date.</p>
                <button type="button" onClick={() => navigate('date','back')} className="text-[#FF7A00] text-sm font-bold hover:underline">
                  ← Choose another date
                </button>
              </div>
            )}
            {!slotsLoading && availableSlots.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map(slot => {
                  const sel = slot === selectedTime;
                  return (
                    <button key={slot} type="button"
                      onClick={() => { setSelectedTime(slot); setTimeout(goNext, 220); }}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        sel ? 'bg-[#FF7A00] border-[#FF7A00] text-black' : 'bg-black/30 border-white/[0.08] text-white hover:border-[#FF7A00]/40 hover:text-[#FF7A00]'
                      }`}>
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      /* ── Payment ──────────────────────────────────────────────────────────── */
      case 'payment':
        return (
          <div>
            {/* Booking summary */}
            <div className="rounded-2xl bg-black/30 border border-white/[0.08] p-4 mb-5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Booking Summary</p>
              <dl className="space-y-0">
                {[
                  { l: 'Service', v: getServiceLabel(form.serviceType) },
                  { l: 'Date',    v: selectedDate && selectedTime ? formatSlotDisplay(selectedDate, selectedTime) : '-' },
                  { l: 'Type',    v: form.bookingType === 'mobile' ? '🚗 Mobile' : '🏪 Workshop' },
                  { l: 'Vehicle', v: `${form.vehicleMakeModel} (${form.vehicleRegistration})` },
                  ...(form.bookingType === 'mobile' ? [{ l: 'Address', v: buildAddress(form) }] : []),
                  ...(selectedDate && isWeekendDate(selectedDate) ? [{ l: 'Weekend', v: `+£${BOOKING_CONFIG.weekendSurchargePounds}` }] : []),
                  ...(formatPrice(form.serviceType, form.bookingType, form.selectedOptions, selectedDate)
                    ? [{ l: 'Est. total', v: formatPrice(form.serviceType, form.bookingType, form.selectedOptions, selectedDate)! }]
                    : []),
                ].map(({ l, v }) => (
                  <div key={l} className="flex gap-3 py-2 border-b border-white/5 last:border-0">
                    <dt className="text-white/30 text-[10px] font-bold uppercase tracking-widest w-16 shrink-0 pt-0.5">{l}</dt>
                    <dd className="text-white text-xs font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Deposit callout */}
            <div className="flex items-center gap-2.5 rounded-xl bg-[#FF7A00]/8 border border-[#FF7A00]/15 px-4 py-3 mb-5">
              <Zap size={14} className="text-[#FF7A00] shrink-0" />
              <p className="text-white/60 text-xs leading-snug">
                <span className="text-white font-bold">£50 deposit</span> secures your slot. Remaining balance due on the day.
              </p>
            </div>

            {/* Stripe Buy Button */}
            <div className="flex justify-center py-1">
              <stripe-buy-button
                buy-button-id="buy_btn_1TR7zyJ6Gx6wxrAfdXtmc06U"
                publishable-key="pk_live_51TQkxIJ6Gx6wxrAfnYCzrPhXcDdwdizGyzZGK2b7WikhO7iJg9h1KL52F3wGi5uPtaH4oDx0LuZfOPWYbmlMB2A700Xoc41KIM"
              />
            </div>

            <p className="text-white/20 text-[10px] text-center mt-3 leading-relaxed">
              Secure payment via Stripe. Your slot is confirmed once payment is complete.
            </p>
          </div>
        );

      default:
        return null;
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div ref={topRef} className="pt-24 pb-16 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Book a Remap | ECU Remapping Booking - AutoCleanse"
        description="Book your ECU remapping appointment online. Choose your service, pick a slot, and pay the £50 deposit to confirm. Devon and surrounding areas."
        path="/remapping-booking"
      />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[#FF7A00]/6 blur-[120px] rounded-[100%] pointer-events-none opacity-40" />

      {/* Inject card animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />

      <div className="max-w-lg mx-auto px-4 sm:px-6 relative z-10">

        {/* Back to remapping */}
        <Link to="/remapping"
          className="inline-flex items-center gap-2 text-white/30 hover:text-[#FF7A00] transition-colors text-sm font-medium mb-6">
          <ArrowLeft size={14} /> Back to Remapping
        </Link>

        {/* ── Card shell ─────────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#1A1D22] border border-white/5 overflow-hidden shadow-2xl">

          {/* Progress bar */}
          <div className="h-0.5 bg-white/[0.04]">
            <div
              className="h-full bg-[#FF7A00] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Card header */}
          <div className="flex items-center gap-3 px-5 sm:px-7 pt-5 pb-4 border-b border-white/[0.06]">
            <button
              type="button"
              onClick={goBack}
              disabled={isFirst}
              aria-label="Previous step"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors disabled:opacity-0 disabled:pointer-events-none shrink-0"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-mono text-[#FF7A00] tracking-widest uppercase mb-0.5">
                Step {cardIndex + 1} of {sequence.length}
              </div>
              <h2 className="text-sm font-black text-white leading-tight truncate">{meta.title}</h2>
              {meta.subtitle && <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{meta.subtitle}</p>}
            </div>
            {/* Progress dots */}
            <div className="flex gap-1 shrink-0">
              {sequence.map((id, i) => (
                <span key={id} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i < cardIndex ? 'bg-[#FF7A00]/60' : i === cardIndex ? 'bg-[#FF7A00] w-3' : 'bg-white/10'
                }`} />
              ))}
            </div>
          </div>

          {/* Animated card content */}
          <div
            key={animKey}
            style={{ animation: `${animDir === 'forward' ? 'cardInRight' : 'cardInLeft'} 300ms cubic-bezier(0.4, 0, 0.2, 1) both` }}
            className="px-5 sm:px-7 pt-6 pb-2"
          >
            {renderContent()}
          </div>

          {/* Card footer - Next button (hidden for auto-advance cards and payment) */}
          {currentCard !== 'service' && currentCard !== 'location' && currentCard !== 'time' && currentCard !== 'payment' && (
            <div className="px-5 sm:px-7 py-5 flex items-center justify-between gap-3 border-t border-white/[0.04] mt-4">
              {/* Price estimate (visible once service + type are chosen) */}
              {formatPrice(form.serviceType, form.bookingType, form.selectedOptions, selectedDate) && (
                <div className="flex items-center gap-1.5">
                  <span className="text-white/25 text-[10px]">Est.</span>
                  <span className="text-white font-black text-sm">
                    {formatPrice(form.serviceType, form.bookingType, form.selectedOptions, selectedDate)}
                  </span>
                </div>
              )}
              <button
                type="button"
                disabled={!canProceed[currentCard]}
                onClick={goNext}
                className="ml-auto btn-shine px-6 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Payment card footer spacer */}
          {currentCard === 'payment' && <div className="pb-6" />}

          {/* Time card "no selection yet" note */}
          {currentCard === 'time' && !selectedTime && availableSlots.length > 0 && (
            <div className="px-5 sm:px-7 pb-5 pt-2">
              <p className="text-white/25 text-[10px] text-center">Tap a time to continue</p>
            </div>
          )}
        </div>

        {/* Alt contact */}
        <p className="text-center text-white/20 text-xs font-medium mt-6">
          Prefer to book by phone?{' '}
          <a href="tel:08000430609" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors font-bold">
            <Phone size={11} className="inline mb-0.5 mr-0.5" />0800 043 0609
          </a>
        </p>

      </div>
    </div>
  );
}
