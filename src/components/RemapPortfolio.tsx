/**
 * RemapPortfolio — Premium ECU remap showcase section.
 * Data-driven: add vehicles to PORTFOLIO_VEHICLES to grow the gallery.
 */
import { useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortfolioVehicle {
  image: string;
  alt: string;
  make: string;
  model: string;
  engine: string;
  stockBhp: number;
  tunedBhp: number;
  stockNm: number;
  tunedNm: number;
}

const PORTFOLIO_VEHICLES: PortfolioVehicle[] = [
  {
    image: '/portfolio-0.jpg',
    alt: 'Mercedes-Benz GLC 63 S AMG remapped by Auto Cleanse',
    make: 'Mercedes-Benz',
    model: 'GLC 63 S AMG',
    engine: '4.0L V8 Bi-Turbo',
    stockBhp: 510,
    tunedBhp: 570,
    stockNm: 700,
    tunedNm: 820,
  },
  {
    image: '/portfolio-1.jpg',
    alt: 'Range Rover Autobiography remapped by Auto Cleanse',
    make: 'Land Rover',
    model: 'Range Rover Autobiography',
    engine: '4.4L V8 SDV8',
    stockBhp: 313,
    tunedBhp: 390,
    stockNm: 700,
    tunedNm: 820,
  },
  {
    image: '/portfolio-2.jpg',
    alt: 'Ford Transit Custom EcoBlue remapped by Auto Cleanse',
    make: 'Ford',
    model: 'Transit Custom',
    engine: '2.0L EcoBlue Diesel',
    stockBhp: 170,
    tunedBhp: 200,
    stockNm: 390,
    tunedNm: 480,
  },
  {
    image: '/portfolio-3.jpg',
    alt: 'Audi S4 3.0 TFSI remapped by Auto Cleanse',
    make: 'Audi',
    model: 'S4 3.0 TFSI',
    engine: '3.0L V6 Supercharged',
    stockBhp: 354,
    tunedBhp: 440,
    stockNm: 500,
    tunedNm: 620,
  },
];

function VehicleCard({ v }: { v: PortfolioVehicle }) {
  const [active, setActive] = useState(false);
  const bhpGain = v.tunedBhp - v.stockBhp;
  const nmGain  = v.tunedNm  - v.stockNm;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        boxShadow: active
          ? '0 0 0 1px rgba(255,122,0,0.5), 0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,122,0,0.12)'
          : '0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        transition: 'box-shadow 0.4s ease',
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={() => setActive(v => !v)}
    >
      {/* ── Photo ── */}
      <div className="relative w-full" style={{ paddingBottom: '72%' }}>
        <img
          src={v.image}
          alt={v.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: active ? 'scale(1.06)' : 'scale(1)',
            filter: active ? 'contrast(1.06) brightness(0.85)' : 'contrast(1.02) brightness(0.95)',
          }}
        />

        {/* Permanent vignette so corners are always darkened */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Bottom gradient — always visible, deepens on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none transition-opacity duration-400"
          style={{
            height: '65%',
            background:
              'linear-gradient(to top, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.70) 40%, transparent 100%)',
            opacity: active ? 1 : 0.88,
          }}
        />

        {/* Orange accent line — slides in on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none transition-all duration-500 ease-out"
          style={{
            background: 'linear-gradient(to right, transparent, #FF7A00, transparent)',
            opacity: active ? 1 : 0,
            transform: active ? 'scaleX(1)' : 'scaleX(0.4)',
          }}
        />

        {/* Stage 1 badge — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#FF7A00] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_16px_rgba(255,122,0,0.5)]">
          <Zap size={10} fill="currentColor" />
          Stage 1 Remap
        </div>

        {/* ── Card content overlay ── */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2">
          {/* Vehicle name — always visible */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF7A00]/80 mb-0.5">
            {v.make}
          </p>
          <h3 className="text-white font-black text-lg leading-tight tracking-tight mb-0.5">
            {v.model}
          </h3>
          <p className="text-white/40 text-xs font-medium mb-3">{v.engine}</p>

          {/* Stats — visible on mobile always, fade in on hover desktop */}
          <div
            className="transition-all duration-400 ease-out"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            {/* Mobile always shows stats via the CSS below */}
            <div className="flex items-stretch gap-2">
              {/* BHP */}
              <div className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Power</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/60 font-black text-sm">{v.stockBhp}</span>
                  <ArrowRight size={10} className="text-[#FF7A00]/60 shrink-0" />
                  <span className="text-white font-black text-sm">{v.tunedBhp}</span>
                  <span className="ml-auto text-[#FF7A00] font-black text-xs">+{bhpGain}</span>
                </div>
                <p className="text-white/25 text-[9px] mt-0.5">bhp</p>
              </div>
              {/* Torque */}
              <div className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Torque</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/60 font-black text-sm">{v.stockNm}</span>
                  <ArrowRight size={10} className="text-[#FF7A00]/60 shrink-0" />
                  <span className="text-white font-black text-sm">{v.tunedNm}</span>
                  <span className="ml-auto text-[#FF7A00] font-black text-xs">+{nmGain}</span>
                </div>
                <p className="text-white/25 text-[9px] mt-0.5">Nm</p>
              </div>
            </div>
          </div>

          {/* Mobile stats — always visible, hidden on md+ (hover handles it there) */}
          <div className="md:hidden mt-2">
            <div className="flex items-stretch gap-2">
              <div className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Power</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/60 font-black text-sm">{v.stockBhp}</span>
                  <ArrowRight size={10} className="text-[#FF7A00]/60 shrink-0" />
                  <span className="text-white font-black text-sm">{v.tunedBhp}</span>
                  <span className="ml-auto text-[#FF7A00] font-black text-xs">+{bhpGain}</span>
                </div>
                <p className="text-white/25 text-[9px] mt-0.5">bhp</p>
              </div>
              <div className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Torque</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/60 font-black text-sm">{v.stockNm}</span>
                  <ArrowRight size={10} className="text-[#FF7A00]/60 shrink-0" />
                  <span className="text-white font-black text-sm">{v.tunedNm}</span>
                  <span className="ml-auto text-[#FF7A00] font-black text-xs">+{nmGain}</span>
                </div>
                <p className="text-white/25 text-[9px] mt-0.5">Nm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RemapPortfolio() {
  return (
    <section className="relative bg-[#0A0A0A] py-24 md:py-32 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF7A00]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="mb-14 md:mb-16 reveal-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 reveal-item">
            <div>
              <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
                Workshop Portfolio
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Recent ECU <span className="text-[#FF7A00]">Remaps</span>
              </h2>
              <p className="text-white/50 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                A growing portfolio of real vehicles tuned by Auto-Cleanse — from performance cars to commercial vans.
              </p>
              <p className="text-white/30 text-sm font-medium mt-2 max-w-xl">
                Every vehicle is diagnosed, read, tuned and tested properly for safe, usable performance gains.
              </p>
            </div>
            <Link
              to="/remapping-booking"
              className="shrink-0 inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#FF9500] text-black font-black px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,122,0,0.25)] hover:shadow-[0_0_30px_rgba(255,122,0,0.45)] text-sm"
            >
              <Zap size={15} />
              Book Your Remap
            </Link>
          </div>
        </div>

        {/* Grid — 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 reveal-container">
          {PORTFOLIO_VEHICLES.map((v, i) => (
            <div key={i} className="reveal-item">
              <VehicleCard v={v} />
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-white/20 text-xs font-medium mt-8">
          All figures shown are indicative Stage 1 gains. Actual results may vary by vehicle condition and specification.
        </p>
      </div>
    </section>
  );
}
