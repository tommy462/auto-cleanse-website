import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Zap, TrendingUp } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio data - add new entries here as more remaps are completed.
// Images go in /public/portfolio-*.jpg
// ─────────────────────────────────────────────────────────────────────────────
const portfolioItems = [
  {
    image: '/transit2.jpg',
    vehicle: 'Ford Transit Custom',
    service: 'Stage 1 Remap',
    bhpBefore: 130,
    bhpAfter: 170,
    nmBefore: 385,
    nmAfter: 430,
  },
  {
    image: '/aygo.jpg',
    vehicle: 'Toyota Aygo',
    service: 'Stage 1 Remap',
    bhpBefore: 68,
    bhpAfter: 76,
    nmBefore: 93,
    nmAfter: 107,
  },
  {
    image: '/ranger.jpg',
    vehicle: 'Ford Ranger',
    service: 'Stage 1 Remap',
    bhpBefore: 213,
    bhpAfter: 240,
    nmBefore: 500,
    nmAfter: 580,
  },
  {
    image: '/tiguan.jpg',
    vehicle: 'VW Tiguan',
    service: 'Stage 1 Remap',
    bhpBefore: 125,
    bhpAfter: 170,
    nmBefore: 200,
    nmAfter: 300,
  },
] as const;

export default function RemapPortfolioCarousel() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = portfolioItems.length;

  // Auto-advance every 6 s; resets on manual interaction
  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActive(a => (a + 1) % total);
    }, 6000);
  }, [total]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, startTimer]);

  const go = (index: number) => { setActive(index); startTimer(); };
  const prev = () => go((active - 1 + total) % total);
  const next = () => go((active + 1) % total);

  // Touch / swipe support
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
    touchStartX.current = null;
  };

  const item = portfolioItems[active];
  const bhpGain = item.bhpAfter - item.bhpBefore;
  const bhpPct = Math.round((bhpGain / item.bhpBefore) * 100);
  const nmGain  = item.nmAfter  - item.nmBefore;
  const nmPct   = Math.round((nmGain  / item.nmBefore)  * 100);

  return (
    <section className="py-14 lg:py-24 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF7A00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
            Client Results
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
            <span className="text-white">Real Results. </span>
            <span className="text-[#FF7A00]">Real Cars.</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mt-3 leading-relaxed">
            Every figure is from a real customer vehicle - no estimates, no bench numbers.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-xl mx-auto lg:max-w-2xl">

          {/* ── Card ── */}
          <div
            className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] aspect-[4/5] sm:aspect-[3/4] cursor-grab active:cursor-grabbing select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Slides - fade transition */}
            {portfolioItems.map((p, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={i !== active}
              >
                <img
                  src={p.image}
                  alt={`${p.vehicle} ECU remap by AutoCleanse Devon`}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  draggable="false"
                />
                {/* Gradient: dark at bottom for readability, light touch at top */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
              </div>
            ))}

            {/* Service badge - top left */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#FF7A00] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-[#FF7A00]/30">
              <Zap size={9} fill="currentColor" />
              {item.service}
            </div>

            {/* Slide counter - top right */}
            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-white/60 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
              {active + 1} / {total}
            </div>

            {/* ── Stats overlay - bottom ── */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6 lg:p-7">
              {/* Vehicle name */}
              <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-3 drop-shadow-lg">
                {item.vehicle}
              </h3>

              {/* Before / after stat cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">

                {/* BHP */}
                <div className="bg-black/75 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                  <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                    <TrendingUp size={9} />
                    Power
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-white/30 text-xs font-bold line-through">{item.bhpBefore}</span>
                    <span className="text-[#FF7A00] text-xl sm:text-2xl font-black leading-none">{item.bhpAfter}</span>
                    <span className="text-white/30 text-[10px] font-medium">bhp</span>
                  </div>
                  <div className="text-[#FF7A00] text-[10px] sm:text-xs font-black mt-1 opacity-90">
                    +{bhpGain} bhp&nbsp;&nbsp;(+{bhpPct}%)
                  </div>
                </div>

                {/* Torque */}
                <div className="bg-black/75 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                  <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                    <Zap size={9} />
                    Torque
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-white/30 text-xs font-bold line-through">{item.nmBefore}</span>
                    <span className="text-[#FF7A00] text-xl sm:text-2xl font-black leading-none">{item.nmAfter}</span>
                    <span className="text-white/30 text-[10px] font-medium">Nm</span>
                  </div>
                  <div className="text-[#FF7A00] text-[10px] sm:text-xs font-black mt-1 opacity-90">
                    +{nmGain} Nm&nbsp;&nbsp;(+{nmPct}%)
                  </div>
                </div>

              </div>
            </div>

            {/* ── Arrow buttons (inside the card) ── */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:border-[#FF7A00]/60 hover:text-[#FF7A00] transition-all duration-200"
              aria-label="Previous vehicle"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:border-[#FF7A00]/60 hover:text-[#FF7A00] transition-all duration-200"
              aria-label="Next vehicle"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* ── Dot indicators ── */}
          <div className="flex justify-center items-center gap-2 mt-5">
            {portfolioItems.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-7 bg-[#FF7A00]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`View slide ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
