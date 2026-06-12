import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, Phone } from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';

export default function BookingCancel() {
  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Booking Cancelled | AutoCleanse Remapping"
        description="Your remapping booking was cancelled. No payment has been taken."
        path="/booking-cancel"
        noindex
      />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[250px] bg-white/3 blur-[100px] rounded-[100%] pointer-events-none" />

      <div className="max-w-lg mx-auto px-4 sm:px-6 relative z-10 text-center">

        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
          <XCircle size={32} className="text-white/30" strokeWidth={1.5} />
        </div>

        <div className="text-xs font-mono text-white/30 tracking-widest uppercase mb-3">Cancelled</div>
        <h1 className="text-3xl font-black tracking-tighter text-white mb-4">
          Booking Not Completed
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          No payment has been taken. Your slot has not been reserved.
          Head back to try again, or call us if you'd prefer to book over the phone.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <Link to="/remapping-booking"
            className="btn-shine px-7 py-3.5 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2">
            <ArrowLeft size={15} /> Try Again
          </Link>
          <MagneticButton>
            <a href="tel:01803269895"
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2">
              <Phone size={15} /> Call 01803 269895
            </a>
          </MagneticButton>
        </div>

        <Link to="/" className="text-white/25 hover:text-white/50 transition-colors text-sm font-medium">
          Back to home
        </Link>

      </div>
    </div>
  );
}
