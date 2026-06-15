import { Link } from 'react-router-dom';
import { ArrowRight, Package, Zap, CheckCircle2, Clock, Shield, Truck } from 'lucide-react';
import SEO from '../components/SEO';

const dpfFeatures = [
  { icon: Truck,   text: 'Free pickup & return within Devon' },
  { icon: Package, text: 'Nationwide postal — tracked next-day' },
  { icon: Clock,   text: 'Same-day turnaround locally' },
  { icon: Shield,  text: '98% flow restoration guaranteed' },
];

const remapFeatures = [
  { icon: Zap,          text: 'Stage 1 from £220 — workshop' },
  { icon: CheckCircle2, text: 'Mobile or workshop appointment' },
  { icon: Shield,       text: 'Safe, road-legal calibration' },
  { icon: Clock,        text: '£50 deposit secures your slot' },
];

export default function BookNow() {
  return (
    <>
      <SEO
        title="Book Now | AutoCleanse — DPF Cleaning & ECU Remapping Devon"
        description="Book a DPF clean or ECU remap with AutoCleanse. Same-day local DPF cleaning from £210, nationwide postal service, and Stage 1, Stage 2 and economy remapping available."
        path="/book"
      />

      <main className="min-h-screen flex flex-col">

        {/* ── Hero heading ── */}
        <section className="pt-16 pb-8 md:pt-20 md:pb-10 text-center px-4">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
            AutoCleanse
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-tight mb-3">
            What would you<br className="hidden sm:block" />{' '}
            <span className="text-[#FF7A00]">like to book?</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Choose your service below — we'll take you straight to booking.
          </p>
        </section>

        {/* ── Choice cards ── */}
        <section className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

            {/* ── Card 1: DPF Cleaning ── */}
            <Link
              to="/postal-dpf"
              className="group relative flex flex-col rounded-[2rem] overflow-hidden border border-white/10 bg-[#111315] hover:border-white/25 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
            >
              {/* Top colour band */}
              <div className="h-1.5 w-full bg-gradient-to-r from-white/20 via-white/40 to-white/10 group-hover:from-white/30 group-hover:via-white/60 group-hover:to-white/20 transition-all duration-500" />

              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col flex-1 p-7 sm:p-8 lg:p-10">

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/25 group-hover:bg-white/8 transition-all duration-300">
                  <Package size={26} className="text-white/70 group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Label */}
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
                  Emission Control
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">
                  DPF Cleaning
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white/40 text-sm font-medium">from</span>
                  <span className="text-3xl font-black text-white">£210</span>
                </div>

                {/* Desc */}
                <p className="text-white/55 text-sm leading-relaxed mb-6">
                  Professional off-vehicle DPF cleaning — restore your filter to 98% of original flow.
                  Same-day local service or tracked nationwide postal return.
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-8">
                  {dpfFeatures.map(({ icon: Icon, text }, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-white/60">
                      <Icon size={13} className="text-white/40 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/8">
                  <span className="text-sm font-black text-white/60 group-hover:text-white transition-colors duration-300 uppercase tracking-wider">
                    Book DPF Clean
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/25 transition-all duration-300">
                    <ArrowRight size={16} className="text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </Link>

            {/* ── Card 2: ECU Remapping ── */}
            <Link
              to="/remapping-booking"
              className="group relative flex flex-col rounded-[2rem] overflow-hidden border border-[#FF7A00]/20 bg-[#111315] hover:border-[#FF7A00]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF7A00]/10"
            >
              {/* Top colour band — orange */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#FF7A00]/40 via-[#FF7A00] to-[#FF7A00]/30 group-hover:from-[#FF7A00]/60 group-hover:via-[#FF7A00] group-hover:to-[#FF7A00]/50 transition-all duration-500" />

              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF7A00]/10 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 flex flex-col flex-1 p-7 sm:p-8 lg:p-10">

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center mb-6 group-hover:border-[#FF7A00]/40 group-hover:bg-[#FF7A00]/15 transition-all duration-300">
                  <Zap size={26} className="text-[#FF7A00]" fill="currentColor" />
                </div>

                {/* Label */}
                <div className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00]/60 mb-2">
                  Performance Tuning
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">
                  ECU Remapping
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white/40 text-sm font-medium">from</span>
                  <span className="text-3xl font-black text-[#FF7A00]">£220</span>
                </div>

                {/* Desc */}
                <p className="text-white/55 text-sm leading-relaxed mb-6">
                  Stage 1 & 2 ECU maps tailored to your vehicle. More power, better economy,
                  sharper response — safely calibrated and road-legal.
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-8">
                  {remapFeatures.map(({ icon: Icon, text }, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-white/60">
                      <Icon size={13} className="text-[#FF7A00]/70 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-[#FF7A00]/10 group-hover:border-[#FF7A00]/25 transition-colors duration-300">
                  <span className="text-sm font-black text-[#FF7A00]/70 group-hover:text-[#FF7A00] transition-colors duration-300 uppercase tracking-wider">
                    Book a Remap
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center group-hover:bg-[#FF7A00] group-hover:border-[#FF7A00] transition-all duration-300">
                    <ArrowRight size={16} className="text-[#FF7A00] group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </section>

        {/* ── Not sure? strip ── */}
        <section className="pb-14 md:pb-20 px-4 text-center">
          <p className="text-white/30 text-sm">
            Not sure which service you need?{' '}
            <Link to="/contact" className="text-white/60 hover:text-[#FF7A00] transition-colors font-semibold underline underline-offset-2">
              Get in touch
            </Link>
            {' '}and we'll point you in the right direction.
          </p>
        </section>

      </main>
    </>
  );
}
