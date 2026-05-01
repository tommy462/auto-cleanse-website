import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Zap, ArrowRight, CheckCircle, ChevronDown,
  Wrench, Activity, Shield, Info
} from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { VehicleRemapData, getVehicleBySlug } from '../data/vehicle-remapping';
import { VEHICLE_REMAPS } from '../data/vehicle-remapping';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-white font-semibold text-sm leading-snug group-hover:text-[#FF7A00] transition-colors">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-[#FF7A00] shrink-0 mt-0.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="text-white/50 text-sm leading-relaxed pb-5 -mt-1">{a}</p>
      )}
    </div>
  );
}

export default function VehicleRemap({ vehicle }: { vehicle: VehicleRemapData }) {
  const relatedVehicles = vehicle.relatedSlugs
    .map((s) => getVehicleBySlug(s))
    .filter(Boolean) as VehicleRemapData[];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${vehicle.fullName} ECU Remapping`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'AutoCleanse',
      telephone: '08000430609',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'The Old Barn Industrial Estate, Webbers Yard',
        addressLocality: 'Totnes',
        addressRegion: 'Devon',
        postalCode: 'TQ9 6JY',
        addressCountry: 'GB',
      }
    },
    description: vehicle.metaDescription,
    url: `https://www.auto-cleanse.co.uk/${vehicle.slug}`,
    category: 'ECU Remapping',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'GBP',
      }
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <SEO
        title={vehicle.metaTitle}
        description={vehicle.metaDescription}
        path={`/${vehicle.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[400px] bg-[#FF7A00]/6 blur-[130px] rounded-[100%] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[
            { name: 'ECU Remapping', path: '/ecu-remapping' },
            { name: 'Vehicles', path: '/vehicle-remapping' },
            { name: vehicle.make, path: '/vehicle-remapping' },
            { name: vehicle.model }
          ]} />

          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#FF7A00]" />
            <Link to="/stage-1-remaps-devon" className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
              Stage 1 Tuning Specialists
            </Link>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05] mb-6">
            {vehicle.h1}
          </h1>

          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-10">
            {vehicle.intro}
          </p>

          <div className="flex flex-wrap gap-3">
            <MagneticButton>
              <Link
                to="/remapping-booking"
                className="btn-shine px-7 py-3.5 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2"
              >
                <Zap size={15} /> Book a Remap <ArrowRight size={14} />
              </Link>
            </MagneticButton>
            <a
              href="tel:08000430609"
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
            >
              <Phone size={15} /> 0800 043 0609
            </a>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10">
            {['Diagnostic check included', 'Mobile service available across Devon', 'Safe, proven limits'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/40 text-xs font-medium">
                <CheckCircle size={12} className="text-[#FF7A00]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Engine Options ────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:text-left">
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">Performance Gains</p>
            <h2 className="text-3xl font-black tracking-tighter text-white">
              {vehicle.fullName} Engine Options
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vehicle.engineOptions.map((engine, idx) => (
              <div key={idx} className="bg-[#1A1D22] border border-white/5 rounded-2xl overflow-hidden group">
                <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">{engine.name}</h3>
                  {engine.mpgGain && (
                    <span className="text-[#FF7A00] text-xs font-bold bg-[#FF7A00]/10 px-3 py-1 rounded-full">
                      +{engine.mpgGain} MPG
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    {/* Power */}
                    <div>
                      <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-3 uppercase tracking-wider">
                        <Zap size={14} /> Power (BHP)
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="text-white/30 line-through text-lg font-bold">{engine.stockPower}</div>
                        <div className="text-white text-3xl font-black">{engine.remapPower}</div>
                      </div>
                    </div>
                    {/* Torque */}
                    <div>
                      <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-3 uppercase tracking-wider">
                        <Activity size={14} /> Torque (Nm)
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="text-white/30 line-through text-lg font-bold">{engine.stockTorque}</div>
                        <div className="text-[#FF7A00] text-3xl font-black">{engine.remapTorque}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual Bar */}
                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-white/20 w-[60%]" />
                    <div className="absolute top-0 left-[60%] h-full bg-[#FF7A00] w-[40%] transition-transform origin-left group-hover:scale-x-105" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Included ───────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">Our Process</p>
              <h2 className="text-3xl font-black tracking-tighter text-white mb-6">
                Professional ECU Tuning in Devon
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Every remap we perform includes a full pre-tune diagnostic check to ensure your {vehicle.make} is healthy before we start. We don't flash generic files - we use safe, proven calibrations tailored to your engine's specific hardware.
              </p>
              <div className="space-y-4">
                {[
                  'Full initial OBD diagnostic scan',
                  'Battery stabilization during flash',
                  'Safe limits for engine and gearbox',
                  'Post-remap test drive and data logging',
                  'Mobile service available across Devon'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-[#FF7A00]" />
                    <span className="text-white/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1A1D22] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00]/10 blur-3xl" />
               <Wrench size={32} className="text-[#FF7A00] mb-6" />
               <h3 className="text-xl font-bold text-white mb-3">Mobile Remapping Available</h3>
               <p className="text-white/60 text-sm leading-relaxed mb-6">
                 We cover the entirety of Devon. We can remap your {vehicle.fullName} at your home, workplace, or driveway, providing the same high-quality service as you'd receive in our workshop.
               </p>
               <div className="space-y-3">
                 <Link
                   to="/ecu-remapping-locations"
                   className="text-white/70 hover:text-white text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all"
                 >
                   View mobile coverage areas <ArrowRight size={14} className="text-[#FF7A00]" />
                 </Link>
                 <Link
                   to="/remapping-booking"
                   className="text-[#FF7A00] text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all"
                 >
                   Book a mobile appointment <ArrowRight size={14} />
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-black tracking-tighter text-white">
              {vehicle.fullName} Remapping Questions
            </h2>
          </div>
          <div className="rounded-3xl bg-[#1A1D22] border border-white/5 px-6 sm:px-8">
            {vehicle.faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Vehicles ──────────────────────────────────────────────── */}
      {relatedVehicles.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-6">Similar Vehicles</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedVehicles.map((related) => (
                <Link
                  key={related.slug}
                  to={`/${related.slug}`}
                  className="rounded-2xl bg-[#1A1D22] border border-white/5 p-5 hover:border-[#FF7A00]/30 transition-colors group"
                >
                  <p className="text-white font-bold text-sm group-hover:text-[#FF7A00] transition-colors">
                    {related.fullName} Remap
                  </p>
                  <p className="text-white/30 text-xs mt-1 flex items-center gap-1">
                    View performance gains <ArrowRight size={11} />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
            Ready to upgrade?
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white mb-4">
            Transform Your <span className="text-[#FF7A00]">{vehicle.make}</span> Today.
          </h2>
          <p className="text-white/40 text-base mb-8 max-w-md mx-auto">
            Book your {vehicle.model} in for a Stage 1 ECU remap. Choose between a workshop visit or a mobile appointment across Devon.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <MagneticButton>
              <Link
                to="/remapping-booking"
                className="btn-shine px-8 py-4 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2"
              >
                <Zap size={15} /> Book Online <ArrowRight size={14} />
              </Link>
            </MagneticButton>
            <a
              href="tel:08000430609"
              className="px-8 py-4 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
            >
              <Phone size={15} /> 0800 043 0609
            </a>
          </div>
          <p className="text-white/20 text-xs mt-6">
            <Shield size={11} className="inline mb-0.5 mr-1" />
            Safe, tested calibrations for long-term reliability
          </p>
        </div>
      </section>
    </div>
  );
}
