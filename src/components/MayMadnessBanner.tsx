/**
 * MayMadnessBanner - Promotional announcement banner.
 * Mobile: stacked layout with big price and full-width CTA.
 * Desktop: compact single-row strip.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, X } from 'lucide-react';

const STORAGE_KEY = 'may-madness-dismissed-2025';

export default function MayMadnessBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="w-full z-50 relative"
      style={{
        background: 'linear-gradient(135deg, #b85600 0%, #FF7A00 50%, #ff9a3c 100%)',
      }}
    >
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* ── MOBILE layout (< sm) ── */}
      <div className="sm:hidden relative px-4 pt-4 pb-3">
        {/* Dismiss - top right */}
        <button
          onClick={dismiss}
          aria-label="Dismiss offer"
          className="absolute top-3 right-3 text-white/60 hover:text-white p-1.5 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>

        {/* Badge */}
        <div className="flex justify-center mb-2">
          <span className="inline-flex items-center gap-1.5 bg-black/25 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
            <Zap size={10} fill="white" />
            May Madness
          </span>
        </div>

        {/* Offer text - centred, big price */}
        <div className="text-center mb-3 pr-6">
          <p className="text-white/90 text-sm font-semibold mb-1">Stage 1 Remap - this month only</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="line-through text-white/50 text-base font-medium">£249</span>
            <span className="text-white text-4xl font-black tracking-tight">£199</span>
          </div>
        </div>

        {/* Full-width CTA */}
        <Link
          to="/remapping-booking"
          onClick={dismiss}
          className="block w-full text-center bg-black text-white font-black text-sm py-3 rounded-xl hover:bg-black/80 transition-colors shadow-lg"
        >
          Book Now - £199
        </Link>
      </div>

      {/* ── DESKTOP layout (sm+) ── single row */}
      <div className="hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Left: badge + offer */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center gap-1.5 bg-black/20 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0">
                <Zap size={10} fill="white" />
                May Madness
              </span>
              <p className="text-white font-bold text-sm md:text-base whitespace-nowrap">
                Stage 1 Remap{' '}
                <span className="line-through text-white/50 font-normal">£249</span>{' '}
                <span className="font-black text-base md:text-lg">£199</span>
                <span className="text-white/70 font-normal text-sm ml-2 hidden md:inline">- this month only</span>
              </p>
            </div>

            {/* Right: CTA + dismiss */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/remapping-booking"
                onClick={dismiss}
                className="bg-black text-white font-black text-xs sm:text-sm px-4 py-2 rounded-lg hover:bg-black/80 transition-colors whitespace-nowrap shadow-md"
              >
                Book Now
              </Link>
              <button
                onClick={dismiss}
                aria-label="Dismiss offer"
                className="text-white/60 hover:text-white p-1.5 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
