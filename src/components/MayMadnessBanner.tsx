/**
 * MayMadnessBanner - Sticky promotional announcement strip.
 * Shown at the top of the page, dismissible, mobile-first.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, X } from 'lucide-react';

const STORAGE_KEY = 'may-madness-dismissed-2025';

export default function MayMadnessBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
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
        background: 'linear-gradient(90deg, #c45e00 0%, #FF7A00 45%, #ff9a3c 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">

        {/* Left: label + offer text */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Flame / badge pill */}
          <span className="hidden sm:flex items-center gap-1 bg-black/20 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0">
            <Zap size={10} fill="white" />
            May Madness
          </span>

          {/* Offer copy */}
          <p className="text-white font-black text-sm sm:text-base leading-tight truncate">
            <span className="sm:hidden font-black">MAY MADNESS - </span>
            Stage 1 Remap{' '}
            <span className="line-through text-white/50 font-normal text-xs sm:text-sm">£249</span>{' '}
            <span className="text-white text-base sm:text-lg font-black">£199</span>
            <span className="hidden md:inline text-white/70 font-normal text-sm ml-2">- this month only</span>
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
            className="text-white/70 hover:text-white p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
