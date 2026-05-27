/**
 * RemapPortfolio - Premium ECU remap showcase section.
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
  // ── Real customer remaps ──────────────────────────────────────────────────
  {
    image: '/transit2.jpg',
    alt: 'Ford Transit Custom Stage 1 remap by AutoCleanse Devon',
    make: 'Ford',
    model: 'Transit Custom',
    engine: '2.0L EcoBlue Diesel',
    stockBhp: 130,
    tunedBhp: 170,
    stockNm: 385,
    tunedNm: 430,
  },
  {
    image: '/aygo.jpg',
    alt: 'Toyota Aygo Stage 1 remap by AutoCleanse Devon',
    make: 'Toyota',
    model: 'Aygo',
    engine: '1.0L VVT-i Petrol',
    stockBhp: 68,
    tunedBhp: 76,
    stockNm: 93,
    tunedNm: 107,
  },
  {
    image: '/ranger.jpg',
    alt: 'Ford Ranger Stage 1 remap by AutoCleanse Devon',
    make: 'Ford',
    model: 'Ranger',
    engine: '2.0L EcoBlue Bi-Turbo',
    stockBhp: 213,
    tunedBhp: 240,
    stockNm: 500,
    tunedNm: 580,
  },
  {
    image: '/tiguan.jpg',
    alt: 'VW Tiguan Stage 1 remap by AutoCleanse Devon',
    make: 'Volkswagen',
    model: 'Tiguan',
    engine: '2.0L TDI Diesel',
    stockBhp: 125,
    tunedBhp: 170,
    stockNm: 200,
    tunedNm: 300,
  },
];

function StatBox({ label, unit, stock, tuned, gain }: { label: string; unit: string; stock: number; tuned: number; gain: number }) {
  return (
    <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-2.5 py-2 backdrop-blur-sm min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5">{label}</p>
      {/* Single line - whitespace-nowrap keeps stock → tuned +gain on one row always */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="text-white/50 font-bold text-[11px]">{stock}</span>
        <ArrowRight size={7} className="text-[#FF7A00]/50 shrink-0" />
        <span className="text-white font-black text-[13px]">{tuned}</span>
        <span className="text-[#FF7A00] font-black text-[11px]">+{gain}</span>
      </div>
      <p className="text-white/25 text-[9px] mt-0.5">{unit}</p>
    </div>
  );
}

function VehicleCard({ v }: { v: PortfolioVehicle }) {
  const [active, setActive] = useState(false);
  const bhpGain = v.tunedBhp - v.stockBhp;
  const nmGain  = v.tunedNm  - v.stockNm;

  return (
    <div
      className="group relative rounded-2xl cursor-pointer select-none"
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
      {/* ── Photo (overflow-hidden ONLY here so zoom is clipped but text never is) ── */}
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: '75%' }}>
        <img
          src={v.image}
          alt={v.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: active ? 'scale(1.06)' : 'scale(1)',
            filter: active ? 'contrast(1.06) brightness(0.82)' : 'contrast(1.02) brightness(0.95)',
          }}
        />

        {/* Permanent vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)' }}
        />

        {/* Bottom gradient - deepens on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '70%',
            background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.75) 45%, transparent 100%)',
            opacity: active ? 1 : 0.9,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Orange accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent, #FF7A00, transparent)',
            opacity: active ? 1 : 0,
            transform: active ? 'scaleX(1)' : 'scaleX(0.4)',
            transition: 'all 0.5s ease',
          }}
        />
      </div>

      {/* ── Content overlay - sits on top, NOT inside overflow-hidden, never clipped ── */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none rounded-2xl">

        {/* Stage 1 badge - top right */}
        <div className="flex justify-end">
          <div className="flex items-center gap-1.5 bg-[#FF7A00] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_16px_rgba(255,122,0,0.5)]">
            <Zap size={10} fill="currentColor" />
            Stage 1 Remap
          </div>
        </div>

        {/* Bottom: name + stats */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF7A00]/80 mb-0.5">{v.make}</p>
          <h3 className="text-white font-black text-lg leading-tight tracking-tight mb-0.5">{v.model}</h3>
          <p className="text-white/40 text-xs font-medium mb-3">{v.engine}</p>

          {/* Desktop hover stats */}
          <div
            className="hidden md:flex gap-2"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            <StatBox label="Power" unit="bhp" stock={v.stockBhp} tuned={v.tunedBhp} gain={bhpGain} />
            <StatBox label="Torque" unit="Nm" stock={v.stockNm} tuned={v.tunedNm} gain={nmGain} />
          </div>

          {/* Mobile stats - always visible */}
          <div className="flex md:hidden gap-2">
            <StatBox label="Power" unit="bhp" stock={v.stockBhp} tuned={v.tunedBhp} gain={bhpGain} />
            <StatBox label="Torque" unit="Nm" stock={v.stockNm} tuned={v.tunedNm} gain={nmGain} />
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
                A growing portfolio of real vehicles tuned by Auto-Cleanse - from performance cars to commercial vans.
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

        {/* Grid - 2 cols on tablet, 4 cols on desktop */}
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
