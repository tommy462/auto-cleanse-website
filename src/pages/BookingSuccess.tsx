import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Car, MapPin, Phone, Loader2, Zap, Hash } from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';

// Shape returned by /api/booking-details - read straight from the Stripe session,
// so it works regardless of which tab/device the customer lands on.
interface BookingDetails {
  bookingRef: string;
  serviceLabel: string;
  bookingType: string;
  customerName: string;
  customerEmail: string;
  vehicleRegistration: string;
  vehicleMakeModel: string;
  slotDisplay: string;
  address: string | null;
  processed: boolean;
}

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_MS = 45_000;

export default function BookingSuccess() {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('session_id')
      : null;

    if (!sessionId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();

    // Poll until the booking has been written to the dashboard (`processed`),
    // which normally happens via the Stripe webhook within a few seconds. The
    // API itself falls back to processing the booking if the webhook hasn't.
    const load = async () => {
      try {
        const res = await fetch(`/api/booking-details?session_id=${encodeURIComponent(sessionId)}`);
        if (!res.ok) throw new Error(String(res.status));
        const data: BookingDetails = await res.json();
        if (cancelled) return;
        setBooking(data);
        setLoading(false);
        if (!data.processed && Date.now() - startedAt < POLL_MAX_MS) {
          setTimeout(load, POLL_INTERVAL_MS);
        }
      } catch {
        if (cancelled) return;
        // Transient error - retry a few times before giving up on the details
        if (Date.now() - startedAt < POLL_MAX_MS) {
          setTimeout(load, POLL_INTERVAL_MS);
        } else {
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Booking Confirmed | AutoCleanse Remapping"
        description="Your ECU remapping booking has been confirmed. £50 deposit received."
        path="/booking-success"
        noindex
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[#FF7A00]/6 blur-[100px] rounded-[100%] pointer-events-none opacity-60" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10">

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="animate-spin text-[#FF7A00]" />
            <p className="text-white/40 text-sm">Confirming your booking…</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Success hero */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-[#FF7A00]" strokeWidth={1.5} />
              </div>
              <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                Booking confirmed
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
                You're all booked in.
              </h1>
              <p className="text-white/50 text-base leading-relaxed max-w-sm mx-auto">
                Your £50 deposit has been received.
                {booking?.customerEmail && (
                  <> We'll be in touch at <span className="text-white font-medium">{booking.customerEmail}</span>.</>
                )}
              </p>
            </div>

            {/* Booking summary - shown when we have the data */}
            {booking && (
              <>
                <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 space-y-0 mb-6">
                  <h2 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">Your Appointment</h2>
                  {[
                    {
                      icon: <Hash size={16} className="text-[#FF7A00]" />,
                      label: 'Booking reference',
                      value: booking.bookingRef,
                    },
                    {
                      icon: <Zap size={16} className="text-[#FF7A00]" />,
                      label: 'Service',
                      value: booking.serviceLabel,
                    },
                    {
                      icon: <Calendar size={16} className="text-[#FF7A00]" />,
                      label: 'Date & Time',
                      value: booking.slotDisplay,
                    },
                    {
                      icon: <Car size={16} className="text-[#FF7A00]" />,
                      label: 'Vehicle',
                      value: `${booking.vehicleMakeModel} (${booking.vehicleRegistration})`,
                    },
                    {
                      icon: <MapPin size={16} className="text-[#FF7A00]" />,
                      label: 'Location',
                      value: booking.bookingType === 'mobile'
                        ? `Mobile - ${booking.address ?? ''}`
                        : 'Workshop - bring your vehicle to us',
                    },
                  ].filter(({ value }) => Boolean(value)).map(({ icon, label, value }) => (
                    <div key={label} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
                      <div className="mt-0.5">{icon}</div>
                      <div>
                        <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-0.5">{label}</div>
                        <div className="text-white text-sm font-medium">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* What's next */}
                <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 mb-8">
                  <h2 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">What happens next</h2>
                  <ol className="space-y-3 text-sm text-white/60 leading-relaxed">
                    {[
                      'You\'ll receive an email confirmation shortly.',
                      'We may call to confirm your vehicle details and advise on any preparation needed.',
                      booking.bookingType === 'mobile'
                        ? "We'll arrive at your address at the booked time. Please ensure the vehicle is accessible."
                        : 'Bring your vehicle to our workshop at the booked time with a full tank of fuel.',
                      'The remaining balance is due on the day once the job is complete.',
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
              </>
            )}

            {/* Generic message when details couldn't be loaded */}
            {!booking && (
              <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-8 text-center mb-8">
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Your payment has been processed. You'll receive a confirmation email shortly.
                </p>
                <p className="text-white/40 text-sm">
                  If you have any questions, please don't hesitate to call us.
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center">
              <MagneticButton>
                <a
                  href="tel:01803269895"
                  className="btn-shine px-7 py-3 rounded-xl font-bold text-sm text-white hover:text-white inline-flex items-center gap-2"
                >
                  <Phone size={16} /> Call Us
                </a>
              </MagneticButton>
              <Link
                to="/"
                className="px-7 py-3 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-block"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
