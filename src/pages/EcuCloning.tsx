import { Link } from 'react-router-dom';
import { Cpu, CheckCircle2, Phone, Mail, ArrowRight, AlertTriangle, Zap, Shield, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import Breadcrumbs from '../components/Breadcrumbs';

const useCases = [
  {
    icon: AlertTriangle,
    title: 'Faulty or Damaged ECU',
    desc: 'Water ingress, electrical fault or physical damage has rendered your original ECU unresponsive. We clone all data to a known-good donor unit so your car runs exactly as before.',
  },
  {
    icon: Cpu,
    title: 'Second-Hand Replacement ECU',
    desc: 'A donor ECU from a breaker carries different VIN and immobiliser data — it simply won\'t start your vehicle. Cloning transfers your original identity to the donor unit.',
  },
  {
    icon: Shield,
    title: 'Immobiliser & Key Synchronisation',
    desc: 'ECU cloning is often the cleanest solution when immobiliser pairing has been lost or corrupted, restoring the exact security profile from the original unit.',
  },
  {
    icon: Zap,
    title: 'Motorsport & Track Use',
    desc: 'Running a spare or backup ECU for competition? We clone your mapped ECU so you have an identical standby ready at all times — tune and all.',
  },
];

const steps = [
  { n: '01', title: 'Diagnosis', desc: 'We connect to your vehicle and read the existing ECU (or assess the faulty unit) to confirm what data can be extracted.' },
  { n: '02', title: 'Read & Extract', desc: 'The full ECU content is read at chip or OBD level — including VIN, calibration, immobiliser tokens and mileage data.' },
  { n: '03', title: 'Write to Donor', desc: 'The extracted data is written byte-for-byte to the replacement ECU, giving it an identical identity to the original.' },
  { n: '04', title: 'Verify & Test', desc: 'The vehicle is started, live data monitored, and all functions confirmed before the job is signed off.' },
];

const faqs = [
  {
    q: 'Is ECU cloning legal in the UK?',
    a: 'Yes. ECU cloning is a legitimate diagnostic and repair procedure. It is commonly used by main dealers and independent specialists to restore vehicles with failed ECUs. It does not alter emissions, performance or safety parameters.',
  },
  {
    q: 'Will my existing remap survive the clone?',
    a: 'Yes — the entire ECU image is copied, including any existing tune. The donor unit will be identical to your original in every respect.',
  },
  {
    q: 'What if my original ECU is completely dead?',
    a: 'In many cases we can still perform a bench read directly from the ECU circuit board. This depends on the ECU type — contact us and we\'ll advise on feasibility before you commit.',
  },
  {
    q: 'How long does ECU cloning take?',
    a: 'Most jobs are completed within a few hours on the day. If bench-level reading is required the ECU will need to be removed, which may extend the process — we\'ll always give you a clear timeframe upfront.',
  },
  {
    q: 'Which vehicles do you support?',
    a: 'We work with the majority of petrol and diesel passenger cars, vans and light commercials from mainstream European, Japanese and American manufacturers. Contact us with your make, model and year for confirmation.',
  },
  {
    q: 'Do you offer a mobile ECU cloning service?',
    a: 'Yes — for OBD-accessible jobs we can come to you across Devon. Bench-read jobs require the ECU to be brought to our workshop in Totnes.',
  },
];

const supported = [
  'Ford', 'Volkswagen', 'Audi', 'BMW', 'Mercedes-Benz',
  'Vauxhall', 'Toyota', 'Nissan', 'Renault', 'Peugeot',
  'Citroën', 'Skoda', 'SEAT', 'Land Rover', 'Volvo',
];

export default function EcuCloning() {
  return (
    <>
      <SEO
        title="ECU Cloning Devon | Faulty ECU Replacement | AutoCleanse"
        description="Professional ECU cloning service in Devon. Faulty, water-damaged or incompatible replacement ECU? We clone your original data to a donor unit — VIN, immobiliser, tune and all. Workshop in Totnes, mobile across Devon."
        path="/ecu-cloning"
      />

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': ['AutomotiveService', 'LocalBusiness'],
              name: 'Auto-Cleanse',
              description: 'Professional ECU cloning service in Devon. Faulty or damaged ECU replacement via full image cloning — VIN, immobiliser, calibration and tune preserved.',
              url: 'https://www.auto-cleanse.co.uk/ecu-cloning',
              telephone: '+441803269895',
              email: 'info@auto-cleanse.co.uk',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'The Old Barn Industrial Estate, Webbers Yard',
                addressLocality: 'Totnes',
                addressRegion: 'Devon',
                postalCode: 'TQ9 6JY',
                addressCountry: 'GB',
              },
              geo: { '@type': 'GeoCoordinates', latitude: '50.4316', longitude: '-3.6844' },
              areaServed: [
                { '@type': 'AdministrativeArea', name: 'Devon' },
                { '@type': 'Country', name: 'United Kingdom' },
              ],
              serviceType: 'ECU Cloning',
              priceRange: '££',
              sameAs: [
                'https://www.facebook.com/profile.php?id=61573744325360',
                'https://www.instagram.com/auto_cleansedpf/',
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'ECU Cloning Devon',
              provider: { '@type': 'LocalBusiness', name: 'Auto-Cleanse', url: 'https://www.auto-cleanse.co.uk' },
              areaServed: { '@type': 'AdministrativeArea', name: 'Devon' },
              description: 'Full ECU image cloning for faulty, water-damaged or incompatible replacement ECUs. VIN, immobiliser data, calibration and existing tune preserved. Workshop in Totnes, mobile service available across Devon.',
              url: 'https://www.auto-cleanse.co.uk/ecu-cloning',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.auto-cleanse.co.uk/' },
                { '@type': 'ListItem', position: 2, name: 'ECU Remapping', item: 'https://www.auto-cleanse.co.uk/ecu-remapping' },
                { '@type': 'ListItem', position: 3, name: 'ECU Cloning', item: 'https://www.auto-cleanse.co.uk/ecu-cloning' },
              ],
            },
          ]),
        }}
      />

      <main className="bg-[#0A0A0A] min-h-screen relative overflow-hidden">

        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[#FF7A00]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-[#FF7A00]/3 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-20 relative z-10">

          <Breadcrumbs items={[
            { name: 'ECU Remapping', href: '/ecu-remapping' },
            { name: 'ECU Cloning' },
          ]} />

          {/* ── Hero ── */}
          <div className="max-w-4xl mb-16 md:mb-24">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">ECU Repair &amp; Programming</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05] mb-6">
              ECU Cloning<br />
              <span className="text-[#FF7A00]">Devon.</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Faulty ECU? Incompatible donor unit? We perform full ECU image cloning — preserving your
              VIN, immobiliser data, calibration and any existing tune — so your vehicle runs exactly as it did before.
            </p>
            <div className="flex flex-wrap gap-3">
              <MagneticButton>
                <a
                  href="tel:01803269895"
                  className="btn-shine px-7 py-3.5 rounded-xl font-bold text-sm text-white hover:text-white inline-flex items-center gap-2"
                >
                  <Phone size={15} /> 01803 269895
                </a>
              </MagneticButton>
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
              >
                <Mail size={15} /> Send Enquiry
              </Link>
            </div>
          </div>

          {/* ── What is ECU cloning ── */}
          <section className="mb-16 md:mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              <div>
                <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">The Process Explained</div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-5 leading-tight">
                  What is <span className="text-[#FF7A00]">ECU Cloning?</span>
                </h2>
                <div className="space-y-4 text-white/60 leading-relaxed">
                  <p>
                    Every ECU stores a unique set of data: the vehicle's VIN, immobiliser security tokens, mileage information
                    and the calibration map that controls how the engine runs. When an ECU fails, simply fitting a second-hand
                    replacement won't work — the new unit carries a different identity and the vehicle's security system will
                    prevent it from starting.
                  </p>
                  <p>
                    ECU cloning solves this by reading the <strong className="text-white font-semibold">complete memory image</strong> from
                    the original (or faulty) unit and writing it byte-for-byte onto the donor ECU. The result is a replacement
                    that is electronically identical to the original — the car doesn't know anything has changed.
                  </p>
                  <p>
                    If your original ECU had a performance remap applied, that tune is part of the image and is preserved in full
                    during the clone.
                  </p>
                </div>
              </div>

              {/* Stats panel */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'VIN', label: 'Vehicle identity preserved' },
                  { value: 'IMMO', label: 'Immobiliser data cloned' },
                  { value: 'MAP', label: 'Calibration & tune retained' },
                  { value: '100%', label: 'Byte-for-byte image copy' },
                ].map(({ value, label }) => (
                  <div key={value} className="bg-[#1A1D22] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col justify-between hover:border-[#FF7A00]/20 transition-colors duration-300">
                    <div className="text-2xl md:text-3xl font-black text-[#FF7A00] mb-2 font-mono">{value}</div>
                    <div className="text-white/50 text-sm font-medium leading-snug">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Use cases ── */}
          <section className="mb-16 md:mb-24">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">Common Scenarios</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-10 leading-tight">
              When Do You <span className="text-[#FF7A00]">Need ECU Cloning?</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {useCases.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/25 rounded-2xl p-6 md:p-7 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/15 flex items-center justify-center mb-4 group-hover:bg-[#FF7A00]/15 transition-colors duration-300">
                    <Icon size={20} className="text-[#FF7A00]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors duration-300">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── How it works ── */}
          <section className="mb-16 md:mb-24">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">Our Approach</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-10 leading-tight">
              How We <span className="text-[#FF7A00]">Do It</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="relative bg-[#1A1D22] border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-[#FF7A00]/20 transition-all duration-300 group">
                  <div className="absolute -top-3 -right-2 text-[80px] font-black text-white/[0.025] group-hover:text-[#FF7A00]/[0.06] transition-colors duration-500 leading-none pointer-events-none select-none">
                    {n}
                  </div>
                  <div className="text-[#FF7A00] text-xs font-black font-mono tracking-widest mb-3">{n}</div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Supported makes ── */}
          <section className="mb-16 md:mb-24">
            <div className="bg-[#1A1D22] border border-white/5 rounded-2xl md:rounded-3xl p-7 md:p-10">
              <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">Vehicle Coverage</div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Supported Makes</h2>
              <p className="text-white/50 text-sm md:text-base mb-7 max-w-2xl">
                We support the majority of mainstream manufacturers. If your make isn't listed, contact us — coverage is regularly expanding.
              </p>
              <div className="flex flex-wrap gap-2">
                {supported.map(make => (
                  <span
                    key={make}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/70 text-sm font-medium hover:border-[#FF7A00]/30 hover:text-white transition-all duration-200"
                  >
                    {make}
                  </span>
                ))}
                <span className="px-3.5 py-1.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-sm font-bold">
                  + many more
                </span>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-16 md:mb-24">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">Common Questions</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-10 leading-tight">
              ECU Cloning <span className="text-[#FF7A00]">FAQs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {faqs.map(({ q, a }) => (
                <div key={q} className="bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/20 rounded-2xl p-6 md:p-7 transition-colors duration-300">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 size={16} className="text-[#FF7A00] shrink-0 mt-0.5" />
                    <h3 className="text-white font-bold text-base leading-snug">{q}</h3>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed pl-7">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related services ── */}
          <section className="mb-16 md:mb-24">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">Also Available</div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-7">Related ECU Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Stage 1 Remapping', href: '/stage-1-remaps-devon', desc: 'Software-only power and economy gains' },
                { label: 'Van & Commercial Remapping', href: '/van-remapping-devon', desc: 'Torque and economy tuning for working vehicles' },
                { label: 'Vehicle Performance Lookup', href: '/vehicle-performance-lookup', desc: 'See exact gains for your reg plate' },
              ].map(({ label, href, desc }) => (
                <Link
                  key={href}
                  to={href}
                  className="group bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 rounded-2xl p-5 flex flex-col gap-2 transition-all duration-300"
                >
                  <span className="text-white font-bold text-base group-hover:text-[#FF7A00] transition-colors duration-300">{label}</span>
                  <span className="text-white/45 text-sm leading-snug">{desc}</span>
                  <span className="flex items-center gap-1 text-[#FF7A00] text-xs font-bold mt-1 group-hover:translate-x-1 transition-transform duration-300">
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section>
            <div className="relative p-8 md:p-12 lg:p-16 rounded-[2rem] bg-[#1A1D22] border border-white/5 overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              <div className="relative z-10 text-center">
                <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">Get in Touch</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                  Need your ECU cloned?<br />
                  <span className="text-[#FF7A00]">Let's talk.</span>
                </h2>
                <p className="text-white/55 text-base md:text-lg font-medium mb-8 max-w-xl mx-auto leading-relaxed">
                  Tell us your vehicle make, model, year and the problem you're experiencing.
                  We'll advise on the best approach and give you a clear price before any work begins.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton>
                    <a
                      href="tel:01803269895"
                      className="btn-shine px-8 py-4 rounded-xl font-bold text-base text-white hover:text-white inline-flex items-center gap-2"
                    >
                      <Phone size={18} /> 01803 269895
                    </a>
                  </MagneticButton>
                  <MagneticButton>
                    <Link
                      to="/contact"
                      className="px-8 py-4 rounded-xl font-bold text-base text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
                    >
                      <Mail size={18} /> Send an Enquiry
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
