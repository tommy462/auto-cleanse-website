import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, ShieldCheck, Clock, Headphones, ListChecks,
  UploadCloud, FileCheck, Cog, Zap, Gauge, Fuel, Cpu, Wrench,
  LayoutDashboard, CreditCard, Receipt, Search, Bot, Car, LogIn, CheckCircle2,
} from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import Breadcrumbs from '../components/Breadcrumbs';
import TradeAccessForm from '../components/TradeAccessForm';

const trustPoints = [
  'ECU & TCU files',
  'Stage 1 & Stage 2',
  'DPF / EGR / AdBlue solutions',
  'Trade support',
  'Portal access coming soon',
];

const whyCards = [
  {
    icon: ShieldCheck,
    title: 'Clean, reliable files',
    desc: 'Carefully checked calibrations built for real-world driveability, not just headline figures. Every file is reviewed before it is returned.',
  },
  {
    icon: Clock,
    title: 'Fast turnaround',
    desc: 'Trade files are prioritised and turned around quickly so you can keep vehicles moving and customers happy.',
  },
  {
    icon: Headphones,
    title: 'Real support',
    desc: 'Talk to people who actually work on cars. If a job needs a second look or a revision, we are here to help.',
  },
  {
    icon: ListChecks,
    title: 'Job tracking & downloads',
    desc: 'Keep every original and returned file in one place, with clear job status - moving to the Trade Portal soon.',
  },
];

const steps = [
  { n: '01', icon: LogIn, title: 'Apply for trade access', desc: 'Send us your business details and we set you up as a trade customer.' },
  { n: '02', icon: UploadCloud, title: 'Upload your original file', desc: 'Read your ECU or TCU and send us the original, unmodified file for the vehicle.' },
  { n: '03', icon: Cog, title: 'Select the required service', desc: 'Choose the solution you need - Stage 1/2, TCU, DPF, EGR, AdBlue/SCR, DTC or a custom request.' },
  { n: '04', icon: FileCheck, title: 'Track progress & download', desc: 'We process the file and return it to you, ready to write back to the vehicle.' },
];

const performanceServices = [
  { icon: Zap, label: 'Stage 1', desc: 'Software-only optimisation for a standard vehicle.' },
  { icon: Gauge, label: 'Stage 2', desc: 'For vehicles with supporting hardware modifications.' },
  { icon: Fuel, label: 'Economy tuning', desc: 'Calibrations focused on efficiency for high-mileage use.' },
  { icon: Cog, label: 'TCU / gearbox tuning', desc: 'Transmission calibration to match the engine setup.' },
  { icon: Gauge, label: 'VMAX / speed limiter options', desc: 'Speed limiter adjustments where legally permitted.' },
];

const solutionServices = [
  { icon: Wrench, label: 'DPF solutions', desc: 'Software solutions to support diesel particulate filter work.' },
  { icon: Cog, label: 'EGR solutions', desc: 'EGR-related calibration options.' },
  { icon: Fuel, label: 'AdBlue / SCR solutions', desc: 'AdBlue and SCR system software options.' },
  { icon: Cpu, label: 'DTC removal', desc: 'Targeted diagnostic trouble code handling.' },
  { icon: FileCheck, label: 'Custom requests', desc: 'Non-standard or combined requirements - just ask.' },
];

const portalFeatures = [
  { icon: UploadCloud, title: 'File upload dashboard', desc: 'Submit original files in a few clicks.' },
  { icon: LayoutDashboard, title: 'Job status tracking', desc: 'See exactly where each job is.' },
  { icon: CreditCard, title: 'Credit balance', desc: 'Manage your trade credit at a glance.' },
  { icon: FileCheck, title: 'Completed files', desc: 'Download returned files any time.' },
  { icon: Receipt, title: 'Invoices', desc: 'Access your billing history.' },
  { icon: Car, title: 'Vehicle lookup', desc: 'Confirm vehicle and engine details.' },
  { icon: Search, title: 'DTC search', desc: 'Look up diagnostic trouble codes.' },
  { icon: Bot, title: 'AI assistant', desc: 'Quick answers while you work.' },
];

const cardBase =
  'group bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/25 rounded-2xl transition-all duration-300';
const iconChip =
  'w-11 h-11 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/15 flex items-center justify-center group-hover:bg-[#FF7A00]/15 transition-colors duration-300';

export default function TradeFileService() {
  return (
    <>
      <SEO
        title="Trade File Service | ECU & TCU Files for Trade | AutoCleanse"
        description="A professional ECU & TCU trade file service for garages and mobile tuners. Upload original files, request Stage 1, Stage 2, TCU, DPF, EGR and AdBlue/SCR solutions, then track progress and download returned files."
        path="/trade-file-service"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Trade File Service',
              serviceType: 'ECU & TCU trade file service',
              provider: {
                '@type': 'LocalBusiness',
                name: 'AutoCleanse',
                url: 'https://www.auto-cleanse.co.uk',
                telephone: '+441803269895',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: 'The Old Barn Industrial Estate, Webbers Yard',
                  addressLocality: 'Totnes',
                  addressRegion: 'Devon',
                  postalCode: 'TQ9 6JY',
                  addressCountry: 'GB',
                },
              },
              areaServed: { '@type': 'Country', name: 'United Kingdom' },
              audience: { '@type': 'BusinessAudience', audienceType: 'Automotive trade, garages and mobile tuners' },
              description:
                'A professional ECU and TCU trade file service for garages, mobile tuners and automotive trade customers. Upload original files, request Stage 1, Stage 2, TCU, DPF, EGR and AdBlue/SCR solutions, then track progress and download returned files.',
              url: 'https://www.auto-cleanse.co.uk/trade-file-service',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.auto-cleanse.co.uk/' },
                { '@type': 'ListItem', position: 2, name: 'ECU Remapping', item: 'https://www.auto-cleanse.co.uk/ecu-remapping' },
                { '@type': 'ListItem', position: 3, name: 'Trade File Service', item: 'https://www.auto-cleanse.co.uk/trade-file-service' },
              ],
            },
          ]),
        }}
      />

      <div className="bg-[#0A0A0A] min-h-screen relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[#FF7A00]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-[#FF7A00]/3 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-20 relative z-10">

          <Breadcrumbs items={[
            { name: 'ECU Remapping', path: '/ecu-remapping' },
            { name: 'Trade File Service' },
          ]} />

          {/* ── 1. Hero ── */}
          <section className="max-w-4xl mb-16 md:mb-24">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
              AutoCleanse Trade File Service
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05] mb-6">
              Clean ECU &amp; TCU Files.<br />
              <span className="text-[#FF7A00]">Built for Trade.</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Fast turnaround, clean calibrations and proper support for garages, mobile tuners and
              automotive trade customers.
            </p>
            <div className="flex flex-wrap gap-3">
              <MagneticButton>
                <a
                  href="#apply"
                  className="btn-shine px-7 py-3.5 rounded-xl font-bold text-sm text-white hover:text-white inline-flex items-center gap-2"
                >
                  Apply for Trade Access <ArrowRight size={15} />
                </a>
              </MagneticButton>
              <a
                href="#how-it-works"
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
              >
                How It Works
              </a>
            </div>

            {/* Trust points */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-9">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-white/45 text-xs sm:text-sm font-medium">
                  <CheckCircle2 size={14} className="text-[#FF7A00] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* ── 2. Why trade customers use AutoCleanse ── */}
          <section className="mb-16 md:mb-24" aria-labelledby="why-heading">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">Why AutoCleanse</div>
            <h2 id="why-heading" className="text-3xl md:text-4xl font-black text-white tracking-tight mb-10 leading-tight">
              Why Trade Customers <span className="text-[#FF7A00]">Use AutoCleanse</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {whyCards.map(({ icon: Icon, title, desc }) => (
                <div key={title} className={`${cardBase} p-6 md:p-7`}>
                  <div className={`${iconChip} mb-4`}>
                    <Icon size={20} className="text-[#FF7A00]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors duration-300">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. How it works ── */}
          <section id="how-it-works" className="mb-16 md:mb-24 scroll-mt-28" aria-labelledby="how-heading">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">The Process</div>
            <h2 id="how-heading" className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 leading-tight">
              How It <span className="text-[#FF7A00]">Works</span>
            </h2>
            <p className="text-white/55 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
              A simple, trade-focused workflow today - and the full AutoCleanse Trade Portal is
              currently being built to make it even easier.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {steps.map(({ n, icon: Icon, title, desc }) => (
                <div key={n} className={`${cardBase} p-6 relative overflow-hidden`}>
                  <div className="absolute -top-3 -right-2 text-[80px] font-black text-white/[0.025] group-hover:text-[#FF7A00]/[0.06] transition-colors duration-500 leading-none pointer-events-none select-none">
                    {n}
                  </div>
                  <div className={`${iconChip} mb-4`}>
                    <Icon size={20} className="text-[#FF7A00]" />
                  </div>
                  <div className="text-[#FF7A00] text-xs font-black font-mono tracking-widest mb-2">{n}</div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 4. Services ── */}
          <section className="mb-16 md:mb-24" aria-labelledby="services-heading">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">File Solutions</div>
            <h2 id="services-heading" className="text-3xl md:text-4xl font-black text-white tracking-tight mb-10 leading-tight">
              Trade <span className="text-[#FF7A00]">File Services</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              {/* Performance group */}
              <div className="bg-[#1A1D22] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Zap size={16} className="text-[#FF7A00]" />
                  <h3 className="text-lg font-bold text-white">Performance</h3>
                </div>
                <ul className="space-y-3">
                  {performanceServices.map(({ icon: Icon, label, desc }) => (
                    <li key={label} className="flex items-start gap-3 rounded-xl bg-black/20 border border-white/5 px-4 py-3">
                      <Icon size={18} className="text-[#FF7A00] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-semibold text-sm">{label}</div>
                        <div className="text-white/45 text-xs leading-relaxed">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions group */}
              <div className="bg-[#1A1D22] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Wrench size={16} className="text-[#FF7A00]" />
                  <h3 className="text-lg font-bold text-white">Solutions</h3>
                </div>
                <ul className="space-y-3">
                  {solutionServices.map(({ icon: Icon, label, desc }) => (
                    <li key={label} className="flex items-start gap-3 rounded-xl bg-black/20 border border-white/5 px-4 py-3">
                      <Icon size={18} className="text-[#FF7A00] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-semibold text-sm">{label}</div>
                        <div className="text-white/45 text-xs leading-relaxed">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Compliance note */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#FF7A00]/20 bg-[#FF7A00]/[0.06] px-5 py-4">
              <ShieldCheck size={18} className="text-[#FF7A00] shrink-0 mt-0.5" />
              <p className="text-white/60 text-sm leading-relaxed">
                Some services may be for off-road, export or competition use only. Trade customers are
                responsible for ensuring legal compliance for the vehicle&rsquo;s intended use.
              </p>
            </div>
          </section>

          {/* ── 5. Portal preview ── */}
          <section className="mb-16 md:mb-24" aria-labelledby="portal-heading">
            <div className="relative rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#14161A] to-[#0E0F12] overflow-hidden p-6 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,122,0,0.08)_0%,transparent_60%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase">AutoCleanse Trade Portal</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/25 px-3 py-0.5 text-[11px] font-bold text-[#FF7A00] uppercase tracking-wide">
                    Coming soon
                  </span>
                </div>
                <h2 id="portal-heading" className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 leading-tight">
                  Everything in <span className="text-[#FF7A00]">One Place</span>
                </h2>
                <p className="text-white/55 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
                  We&rsquo;re building a dedicated trade portal so you can submit files, track jobs and manage
                  your account in one dashboard.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {portalFeatures.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="group rounded-2xl bg-[#1A1D22]/80 border border-white/5 hover:border-[#FF7A00]/25 p-4 md:p-5 transition-all duration-300">
                      <div className="w-9 h-9 rounded-lg bg-[#FF7A00]/10 border border-[#FF7A00]/15 flex items-center justify-center mb-3">
                        <Icon size={17} className="text-[#FF7A00]" />
                      </div>
                      <div className="text-white font-bold text-sm mb-1">{title}</div>
                      <div className="text-white/40 text-xs leading-snug">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 6. Apply form ── */}
          <section id="apply" className="mb-16 md:mb-24 scroll-mt-28" aria-labelledby="apply-heading">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-2">
                <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">Get Started</div>
                <h2 id="apply-heading" className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 leading-tight">
                  Apply for <span className="text-[#FF7A00]">Trade Access</span>
                </h2>
                <p className="text-white/55 text-base leading-relaxed mb-6">
                  Tell us a little about your business and what you need. We&rsquo;ll review your details and
                  get you set up as a trade customer.
                </p>
                <ul className="space-y-3">
                  {['Trade-only pricing and support', 'Clean, checked ECU & TCU files', 'Early access to the Trade Portal'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                      <CheckCircle2 size={16} className="text-[#FF7A00] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3 rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 shadow-2xl shadow-black/40">
                <TradeAccessForm />
              </div>
            </div>
          </section>

          {/* ── 7. Final CTA ── */}
          <section>
            <div className="relative p-8 md:p-12 lg:p-16 rounded-[2rem] bg-[#1A1D22] border border-white/5 overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              <div className="relative z-10 text-center">
                <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">Trade Enquiries</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
                  Ready to offer more <span className="text-[#FF7A00]">file services?</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton>
                    <a
                      href="#apply"
                      className="btn-shine px-8 py-4 rounded-xl font-bold text-base text-white hover:text-white inline-flex items-center gap-2"
                    >
                      Apply for Trade Access <ArrowRight size={18} />
                    </a>
                  </MagneticButton>
                  <MagneticButton>
                    <a
                      href="tel:01803269895"
                      className="px-8 py-4 rounded-xl font-bold text-base text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
                    >
                      <Phone size={18} /> 01803 269895
                    </a>
                  </MagneticButton>
                </div>
                <p className="text-white/30 text-xs mt-6">
                  <Link to="/ecu-remapping" className="text-[#FF7A00] hover:underline">ECU remapping</Link> and{' '}
                  <Link to="/mobile-ecu-remapping-devon" className="text-[#FF7A00] hover:underline">mobile remapping</Link> also available.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
