import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Calendar, Car, MapPin, Phone, Loader2, AlertCircle, Zap } from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';

interface BookingDetails {
  bookingRef: string;
  serviceLabel: string;
  bookingType: 'workshop' | 'mobile';
  customerName: string;
  customerEmail: string;
  vehicleReg: string;
  vehicleMakeModel: string;
  slotDisplay: string;
  address: string | null;
  postcode: string | null;
  depositPaid: boolean;
  depositAmount: string;
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  }).format(new Date(iso));
}

export default function BookingSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No booking session found.');
      setLoading(false);
      return;
    }

    fetch(`/api/booking-details?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setDetails(data);
        }
      })
      .catch(() => setError('Could not load your booking details.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Booking Confirmed | AutoCleanse Remapping"
        description="Your ECU remapping booking has been confirmed. £50 deposit received."
        path="/booking-success"
      />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[#FF7A00]/6 blur-[100px] rounded-[100%] pointer-events-none opacity-60" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10">

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="animate-spin text-[#FF7A00]" />
            <p className="text-white/40 text-sm">Loading your booking…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-10 text-center">
            <AlertCircle size={40} className="text-amber-400 mx-auto mb-4" strokeWidth={1.5} />
            <h1 className="text-2xl font-black text-white mb-3">Could not load booking</h1>
            <p className="text-white/50 text-sm mb-6">{error}</p>
            <p className="text-white/40 text-sm mb-8">
              If your payment went through, you will receive a confirmation email.
              Please call us if you need immediate help.
            </p>
            <a href="tel:08000430609"
              className="btn-shine px-7 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2">
              <Phone size={16} /> Call 0800 043 0609
            </a>
          </div>
        )}

        {!loading && !error && details && (
          <>
            {/* Success hero */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-[#FF7A00]" strokeWidth={1.5} />
              </div>
              <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                {details.bookingRef}
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
                Booking Confirmed.
              </h1>
              <p className="text-white/50 text-base leading-relaxed max-w-sm mx-auto">
                Your {details.depositAmount} deposit has been received. We'll send a confirmation
                to <span className="text-white font-medium">{details.customerEmail}</span>.
              </p>
            </div>

            {/* Booking summary */}
            <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 space-y-4 mb-6">
              <h2 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">
                Your Appointment
              </h2>

              {[
                {
                  icon: <Zap size={16} className="text-[#FF7A00]" />,
                  label: 'Service',
                  value: details.serviceLabel,
                },
                {
                  icon: <Calendar size={16} className="text-[#FF7A00]" />,
                  label: 'Date & Time',
                  value: details.slotDisplay,
                },
                {
                  icon: <Car size={16} className="text-[#FF7A00]" />,
                  label: 'Vehicle',
                  value: `${details.vehicleMakeModel} (${details.vehicleReg})`,
                },
                {
                  icon: <MapPin size={16} className="text-[#FF7A00]" />,
                  label: 'Location',
                  value:
                    details.bookingType === 'mobile'
                      ? `Mobile — ${details.address ?? ''}`
                      : 'Workshop — bring your vehicle to us',
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
                  <div className="mt-0.5">{icon}</div>
                  <div>
                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-0.5">
                      {label}
                    </div>
                    <div className="text-white text-sm font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* What's next */}
            <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-8">
              <h2 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">
                What happens next
              </h2>
              <ol className="space-y-3 text-sm text-white/60 leading-relaxed">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                  You'll receive an email confirmation with your booking reference.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                  We may call to confirm your vehicle details and advise on any preparation needed.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                  {details.bookingType === 'mobile'
                    ? "We'll arrive at your address at the booked time. Please ensure the vehicle is accessible."
                    : 'Bring your vehicle to our workshop at the booked time with a full tank of fuel.'}
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">4</span>
                  The remaining balance is due on the day once the job is complete.
                </li>
              </ol>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center">
              <MagneticButton>
                <a href="tel:08000430609"
                  className="btn-shine px-7 py-3 rounded-xl font-bold text-sm text-white hover:text-white inline-flex items-center gap-2">
                  <Phone size={16} /> Call Us
                </a>
              </MagneticButton>
              <Link to="/"
                className="px-7 py-3 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-block">
                Back to Home
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
