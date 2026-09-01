import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Star, Settings, Package, Shield, ArrowRight, Check,
  Wrench, Truck, ClipboardCheck, CalendarClock, PhoneCall,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import LatestPosts from '../components/LatestPosts';
import FaqSection, { type Faq } from '../components/FaqSection';
import DpfResults from '../components/DpfResults';
import { getReviews, DPF_REVIEW_IDS } from '../data/reviews';
import { localBusinessNode, BUSINESS_ID } from '../data/business';
import { trackEvent } from '../lib/tracking';

gsap.registerPlugin(ScrollTrigger);

const PHONE_DISPLAY = '01803 269895';
const PHONE_HREF = 'tel:01803269895';

// GA4 / Google Ads events for this landing page. Phone links are already counted
// site-wide as `phone_click` by <LeadTracking>; this adds the CTA position so paid
// search performance can be read per section without a second analytics framework.
const trackCta = (cta: string, type: 'phone' | 'booking' | 'postal') =>
  trackEvent('dpf_cta_click', { cta_location: cta, cta_type: type, page_path: '/dpf-cleaning' });

const heroTrust = [
  'Before & after testing',
  'Professional workshop equipment',
  'Local collection available',
  'UK-wide postal service',
];

const processSteps = [
  {
    icon: PhoneCall,
    title: 'Get in touch',
    body: 'Tell us your vehicle registration and what problem you are experiencing: a warning light, limp mode, or a regeneration that will not finish.',
  },
  {
    icon: Wrench,
    title: 'DPF removed',
    body: 'Drop the removed filter at our Totnes workshop, or call to discuss local collection across Devon and UK-wide postal options.',
  },
  {
    icon: ClipboardCheck,
    title: 'Cleaned & tested',
    body: 'The filter is professionally machine cleaned off the vehicle, then flow and back-pressure checked before and after cleaning.',
  },
  {
    icon: Truck,
    title: 'Ready to refit',
    body: 'The cleaned DPF is returned ready for refitting, with same-day turnaround where possible for filters received early in the day.',
  },
];

const included = [
  'Professional off-vehicle machine clean',
  'Before and after flow testing',
  'Visual filter assessment and honest report',
  'Fast turnaround, same day where possible',
  'Trade, fleet and private customers',
  'Local collection in Devon or UK-wide postal',
];

const priceTiers = [
  { label: 'Within 10 miles of Totnes', note: 'Local collection and return', price: '£210' },
  { label: 'Outside 10 miles & UK postal', note: 'Nationwide postal DPF cleaning', price: '£230' },
  { label: 'HGV & plant filters', note: 'Heavy vehicle and machinery DPFs', price: '£299' },
];

const locations = [
  { name: 'Near Me', path: '/dpf-cleaning-near-me', note: 'Find your nearest option' },
  { name: 'Devon', path: '/dpf-cleaning-devon', note: 'Full county coverage' },
  { name: 'Totnes', path: '/dpf-cleaning-totnes', note: 'Our workshop base' },
  { name: 'Exeter', path: '/dpf-cleaning-exeter', note: 'East Devon' },
  { name: 'Plymouth', path: '/dpf-cleaning-plymouth', note: 'South West Devon' },
  { name: 'Newton Abbot', path: '/dpf-cleaning-newton-abbot', note: 'South Devon' },
  { name: 'Torquay', path: '/dpf-cleaning-torquay', note: 'Torbay' },
  { name: 'Paignton', path: '/dpf-cleaning-paignton', note: 'Torbay' },
  { name: 'Brixham', path: '/dpf-cleaning-brixham', note: 'Torbay' },
  { name: 'Teignmouth', path: '/dpf-cleaning-teignmouth', note: 'Teign Estuary' },
  { name: 'Dawlish', path: '/dpf-cleaning-dawlish', note: 'East Devon coast' },
  { name: 'Exmouth', path: '/dpf-cleaning-exmouth', note: 'East Devon' },
  { name: 'Dartmouth', path: '/dpf-cleaning-dartmouth', note: 'South Hams' },
  { name: 'Kingsbridge', path: '/dpf-cleaning-kingsbridge', note: 'South Hams' },
  { name: 'Ivybridge', path: '/dpf-cleaning-ivybridge', note: 'A38 corridor' },
  { name: 'South Hams', path: '/dpf-cleaning-south-hams', note: 'Our home district' },
];

// Rendered visibly below AND emitted once as FAQPage schema by <FaqSection>, so the
// structured data always matches the on-page text. The mobile-cleaning, paid-
// diagnostics and location answers are the long-standing AI-answer set, so keep them.
const dpfFaqs: Faq[] = [
  {
    q: 'Do you offer mobile DPF cleaning?',
    a: 'No. Auto-Cleanse does not offer mobile DPF cleaning at the roadside. DPF cleaning is carried out off the vehicle using our workshop equipment in Totnes, or through postal and trade supply of the filter. Our mobile service applies to ECU remapping only - that can be done at your home or workplace.',
  },
  {
    q: 'Can you help with removing and refitting the DPF?',
    a: 'Our standard DPF cleaning service is carried out with the filter already removed from the vehicle. If you need assistance arranging removal or refitting, call us on 01803 269895 to discuss current availability - we will tell you honestly what we can help with.',
  },
  {
    q: 'How much does DPF cleaning cost?',
    a: 'DPF machine cleaning starts at £210 within 10 miles of our Totnes workshop, £230 outside 10 miles including UK-wide postal cleaning, and £299 for HGV and plant filters. Prices are confirmed when you contact us with your vehicle details.',
  },
  {
    q: 'How long does DPF cleaning take?',
    a: 'The clean itself is a workshop process rather than an overnight soak, so filters received early in the working day can often be cleaned, tested and returned the same day locally in Devon. Postal filters are turned around as quickly as possible and we confirm timing when you book.',
  },
  {
    q: 'Can every DPF be cleaned?',
    a: 'No. Filters blocked with soot and ash usually respond well to off-vehicle machine cleaning, but a filter with a cracked, melted or collapsed substrate, or severe internal damage, may not be recoverable. We inspect and flow test before cleaning and tell you if replacement is the more sensible option.',
  },
  {
    q: 'Is DPF cleaning cheaper than replacement?',
    a: 'In most cases, yes. A replacement filter can cost many hundreds to several thousand pounds depending on the vehicle, whereas professional cleaning starts at £210 and keeps your original, vehicle-matched filter. Cleaning is not always possible, which is why we test the filter first.',
  },
  {
    q: 'What causes a DPF to block?',
    a: 'Most blockages come from a regeneration that never completes - typically short, low-speed journeys - or from an underlying fault such as a faulty differential pressure sensor, an EGR problem, injector or fuelling faults, or oil contamination from a failed turbo. We look for the cause so the clean lasts.',
  },
  {
    q: 'Are diagnostics free?',
    a: 'No - diagnostics are a paid check, not a free scan. We flow-test and assess the filter before and after cleaning so you get a properly measured result rather than a guess.',
  },
  {
    q: 'Do you offer postal DPF cleaning?',
    a: 'Yes. We clean DPFs sent to us from anywhere in the UK. Remove the filter, send it to our Totnes workshop, and we clean, test and return it. See our postal DPF cleaning page for how it works.',
  },
  {
    q: 'Do you clean DPFs for garages?',
    a: 'Yes. We work with garages, fleets and mobile mechanics across Devon and the South West, cleaning filters they have removed in their own workshop. Call us on 01803 269895 to discuss trade turnaround and rates.',
  },
  {
    q: 'Where is Auto-Cleanse based and what areas do you cover?',
    a: 'We are based in Totnes, Devon. We collect DPFs across Devon, offer UK-wide postal DPF cleaning, and serve both trade customers and private drivers.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    localBusinessNode({
      description:
        'Professional DPF cleaning service in Devon. Workshop drop-off, local collection and UK-wide postal DPF cleaning - carried out off the vehicle at our Totnes workshop. We do not offer mobile/roadside DPF cleaning.',
      serviceType: 'DPF Cleaning',
    }),
    {
      '@type': 'Service',
      name: 'Professional DPF Cleaning',
      serviceType: 'Diesel Particulate Filter Cleaning',
      provider: { '@id': BUSINESS_ID },
      areaServed: { '@type': 'AdministrativeArea', name: 'Devon' },
      url: 'https://www.auto-cleanse.co.uk/dpf-cleaning',
      description:
        'Off-vehicle machine cleaning of diesel particulate filters at the Auto-Cleanse workshop in Totnes, Devon, with flow testing before and after cleaning, local collection across Devon and UK-wide postal cleaning.',
      offers: [
        {
          '@type': 'Offer',
          name: 'DPF Cleaning - within 10 miles of Totnes',
          priceCurrency: 'GBP',
          price: '210.00',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'DPF Cleaning - outside 10 miles / UK postal',
          priceCurrency: 'GBP',
          price: '230.00',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'DPF Cleaning - HGV and plant',
          priceCurrency: 'GBP',
          price: '299.00',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
  ],
};

const DPFCleaningHub = () => {
  const container = useRef(null);
  // A genuine Google review used as the trust-strip pull quote. Renders nothing
  // if the id is ever removed from the review store.
  const [pullQuote] = getReviews(['peter-anning']);

  useGSAP(() => {
    // The hero is deliberately excluded from the reveal system: GSAP would set it
    // to opacity 0 on hydration and delay the prerendered LCP element on mobile.
    gsap.utils.toArray<HTMLElement>('.reveal-container').forEach((c) => {
      const items = c.querySelectorAll('.reveal-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: c, start: 'top 85%' },
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-10 pb-16 md:pt-28 md:pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="DPF Cleaning Devon | Professional DPF Cleaning | Auto-Cleanse"
        description="Professional DPF cleaning in Devon from Auto-Cleanse in Totnes. Off-vehicle machine cleaning, testing, local collection and UK postal service. From £210. Call 01803 269895."
        path="/dpf-cleaning"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[{ name: 'DPF Cleaning' }]} />

        {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
        <header className="text-center mb-12 md:mb-16">
          <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
            DPF Cleaning Specialists
          </p>

          <h1 className="text-[2rem] leading-[1.08] sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 drop-shadow-2xl">
            <span className="text-white">Professional DPF Cleaning </span>
            <span className="text-[#FF7A00] font-mono">Devon.</span>
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white/90 tracking-tight max-w-3xl mx-auto mb-4">
            Blocked DPF? Get it professionally cleaned &amp; tested.
          </p>

          <p className="text-[15px] sm:text-base md:text-xl text-white/50 leading-relaxed font-medium max-w-3xl mx-auto">
            Professional off-vehicle DPF machine cleaning from our Totnes workshop, with same-day
            turnaround where possible for private and trade customers.
          </p>

          {/* Price + CTAs */}
          <div className="mt-7 md:mt-10 flex flex-col items-center gap-5 sm:gap-6">
            <p className="inline-flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-2xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 px-5 py-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">From</span>
              <span className="text-3xl md:text-4xl font-black text-[#FF7A00] font-mono tracking-tight">£210</span>
              <span className="text-sm font-medium text-white/50">DPF machine clean</span>
            </p>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href={PHONE_HREF}
                onClick={() => trackCta('hero', 'phone')}
                className="btn-shine px-6 sm:px-7 py-4 rounded-xl font-bold text-white text-base sm:text-lg inline-flex items-center justify-center gap-2.5 min-h-[52px]"
                aria-label={`Call Auto-Cleanse on ${PHONE_DISPLAY}`}
              >
                <Phone size={20} aria-hidden="true" /> Call {PHONE_DISPLAY}
              </a>
              <Link
                to="/book"
                onClick={() => trackCta('hero', 'booking')}
                className="px-6 sm:px-7 py-4 rounded-xl font-bold text-white text-base sm:text-lg border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2.5 min-h-[52px]"
              >
                Book DPF Cleaning <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            {/* 2x2 on mobile, single row from lg */}
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3 w-full max-w-3xl mt-1">
              {heroTrust.map((t) => (
                <li key={t} className="flex items-start gap-2 text-left">
                  <Check size={16} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-white/65 text-[13px] sm:text-sm font-medium leading-snug">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* ── 2. Trust strip ──────────────────────────────────────────────── */}
        <section
          aria-label="Customer trust"
          className="mb-14 md:mb-24 rounded-2xl bg-[#111317] border border-white/5 p-5 sm:p-6 md:p-7 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8"
        >
          <div className="shrink-0">
            <div className="flex gap-0.5 mb-2" role="img" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="fill-[#FF7A00] text-[#FF7A00]" />
              ))}
            </div>
            <p className="text-white font-bold text-[15px] sm:text-base leading-snug">
              Trusted by drivers and garages across Devon
            </p>
          </div>

          {pullQuote && (
            <figure className="lg:border-l lg:border-white/10 lg:pl-8 min-w-0 m-0">
              <blockquote className="text-white/70 text-sm sm:text-[15px] leading-relaxed">
                &ldquo;{pullQuote.text}&rdquo;
              </blockquote>
              <figcaption className="text-white/40 text-xs font-medium mt-2">
                {pullQuote.name} &middot; {pullQuote.source}
              </figcaption>
            </figure>
          )}
        </section>

        {/* ── 3. Real workshop cleaning ───────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="reveal-item">
              <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                Off-vehicle machine cleaning
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-5 leading-tight">
                Professional off-vehicle DPF cleaning
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-4">
                Not an additive. Not a quick forced regen. Your diesel particulate filter is removed
                from the vehicle and cleaned in our Totnes workshop on dedicated DPF cleaning
                equipment: a METclean XL machine clean followed by a controlled hot-air drying stage.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-7">
                The filter is inspected and flow tested before cleaning and tested again afterwards,
                so the result is measured rather than assumed. If a filter is physically damaged we
                tell you. Cleaning it would be a waste of your money.
              </p>

              <ul className="space-y-3">
                {[
                  'Cleaned off the vehicle, not treated in situ',
                  'Dedicated DPF cleaning machine, not a chemical soak',
                  'Flow and back-pressure tested before and after',
                  'Cars, vans and commercial vehicles where appropriate',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check size={18} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-white/75 text-sm md:text-base leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal-item">
              <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 bg-[#111317]">
                <img
                  src="/dpf-cleaning-machine.webp"
                  alt="The METclean XL MKII DPF cleaning machine used for off-vehicle DPF cleaning at the Auto-Cleanse workshop in Totnes, Devon"
                  width={852}
                  height={852}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-white/35 text-xs mt-3 text-center">
                The METclean XL MKII machine used for our off-vehicle DPF cleaning.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. How it works ─────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-12">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              The process
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
              How DPF cleaning works
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              Four steps from your first call to a cleaned, tested filter ready to go back on the
              vehicle.
            </p>
          </div>

          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {/* Connecting rule, desktop only */}
            <div
              className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#FF7A00]/40 via-white/10 to-transparent"
              aria-hidden="true"
            />
            {processSteps.map((step, i) => (
              <li key={step.title} className="relative reveal-item">
                <div className="flex items-center gap-4 mb-4 md:mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#111317] border border-white/10 flex items-center justify-center shrink-0 relative z-10">
                    <step.icon size={22} className="text-[#FF7A00]" aria-hidden="true" />
                  </div>
                  <span className="font-mono font-black text-3xl md:text-4xl text-white/10 tabular-nums leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-white/55 text-sm md:text-[15px] leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 5. Removal & refitting ──────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="rounded-2xl bg-[#1A1D22] border border-white/5 border-l-4 border-l-[#FF7A00] p-5 sm:p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8 reveal-item">
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                Need help with removal &amp; refitting?
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-3xl">
                Our standard DPF cleaning service is carried out with the filter removed from the
                vehicle. If you need assistance arranging removal or refitting, call us to discuss
                current availability.
              </p>
            </div>
            <a
              href={PHONE_HREF}
              onClick={() => trackCta('removal_refitting', 'phone')}
              className="shrink-0 w-full lg:w-auto px-6 py-3.5 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2.5 min-h-[48px]"
              aria-label={`Call Auto-Cleanse on ${PHONE_DISPLAY}`}
            >
              <Phone size={18} className="text-[#FF7A00]" aria-hidden="true" /> Call {PHONE_DISPLAY}
            </a>
          </div>
        </section>

        {/* ── 6. Pricing / what's included ────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              DPF cleaning cost
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              Professional DPF cleaning from <span className="text-[#FF7A00] font-mono">£210</span>
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              Clear pricing before you commit. What you pay depends on where the filter is coming
              from and the type of vehicle. Nothing else.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-8">
            {/* Price rows */}
            <div className="lg:col-span-3 rounded-2xl bg-[#111317] border border-white/5 overflow-hidden reveal-item">
              {priceTiers.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center justify-between gap-4 p-5 md:p-6 border-b border-white/5 last:border-0"
                >
                  <div className="min-w-0">
                    <div className="text-white font-bold text-[15px] sm:text-base md:text-lg leading-snug">
                      {t.label}
                    </div>
                    <div className="text-white/45 text-xs sm:text-sm mt-0.5">{t.note}</div>
                  </div>
                  <div className="text-2xl md:text-3xl font-black font-mono text-[#FF7A00] shrink-0 tabular-nums">
                    {t.price}
                  </div>
                </div>
              ))}
            </div>

            {/* What's included */}
            <div className="lg:col-span-2 rounded-2xl bg-[#1A1D22] border border-white/5 p-5 sm:p-6 md:p-7 reveal-item">
              <h3 className="text-white font-bold text-lg mb-5 tracking-tight">
                What&rsquo;s included
              </h3>
              <ul className="space-y-3 mb-7">
                {included.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check size={17} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-white/70 text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <a
                  href={PHONE_HREF}
                  onClick={() => trackCta('pricing', 'phone')}
                  className="btn-shine px-6 py-3.5 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2.5 min-h-[48px]"
                  aria-label={`Call Auto-Cleanse on ${PHONE_DISPLAY}`}
                >
                  <Phone size={18} aria-hidden="true" /> Call {PHONE_DISPLAY}
                </a>
                <Link
                  to="/book"
                  onClick={() => trackCta('pricing', 'booking')}
                  className="px-6 py-3.5 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2.5 min-h-[48px]"
                >
                  Book DPF Cleaning <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <p className="text-white/35 text-xs leading-relaxed mt-4">
                Full pricing, including{' '}
                <Link to="/pricing" className="text-white/60 hover:text-[#FF7A00] transition-colors">
                  ECU remapping rates
                </Link>
                , is published on our pricing page.
              </p>
            </div>
          </div>
        </section>

        {/* ── 7. Real results ─────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="reveal-item">
            <DpfResults />
          </div>
        </section>

        {/* ── 8. Clean vs replace ─────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 p-6 sm:p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center reveal-item">
            <div>
              <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                Clean vs replace
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-5 leading-tight">
                Why clean instead of replace?
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-4">
                A replacement OEM diesel particulate filter can run from several hundred to several
                thousand pounds depending on the vehicle. Before spending that, it is worth finding
                out whether the filter you already have is recoverable.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed">
                Professional cleaning can often restore a serviceable blocked filter for a fraction
                of replacement cost, and keeps your original vehicle-matched filter in place. It is
                not always possible, which is exactly why we test the filter before and after
                rather than promising an outcome up front.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-black/40 border border-[#FF7A00]/25 p-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#FF7A00]/80 mb-1">
                  Professional clean
                </div>
                <div className="text-3xl font-black font-mono text-[#FF7A00]">From £210</div>
                <p className="text-white/55 text-sm mt-2 leading-relaxed">
                  Keeps your original filter. Tested before and after.
                </p>
              </div>
              <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">
                  Replacement filter
                </div>
                <div className="text-2xl font-black text-white/80">Hundreds to thousands</div>
                <p className="text-white/45 text-sm mt-2 leading-relaxed">
                  Varies widely by make and model. Sometimes unavoidable.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                <Link
                  to="/why-clean"
                  className="flex-1 px-5 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2 min-h-[48px]"
                >
                  Check your DPF <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <a
                  href={PHONE_HREF}
                  onClick={() => trackCta('clean_vs_replace', 'phone')}
                  className="flex-1 px-5 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2 min-h-[48px]"
                  aria-label={`Call Auto-Cleanse on ${PHONE_DISPLAY}`}
                >
                  <Phone size={15} className="text-[#FF7A00]" aria-hidden="true" /> Call Auto-Cleanse
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. Reviews ──────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <Reviews
            reviews={getReviews(DPF_REVIEW_IDS)}
            heading={<><span className="text-white">Trusted for </span><span className="text-[#FF7A00]">DPF Cleaning</span></>}
            intro="Genuine feedback from drivers, garages and fleets across Devon."
            columns={3}
            showGoogleCta
            showCallCta
          />
        </section>

        {/* ── Quick enquiry ───────────────────────────────────────────────── */}
        <section id="enquiry" className="mb-14 md:mb-24 scroll-mt-28 reveal-container">
          <div className="max-w-3xl mx-auto relative p-6 sm:p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden reveal-item">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none"></div>
            <div className="relative z-10">
              <QuickEnquiryForm
                defaultService="DPF Cleaning"
                source="dpf-cleaning"
                heading="Request a DPF Cleaning Callback"
                subheading="Send your details and we'll call you back about your DPF clean."
              />
            </div>
          </div>
        </section>

        {/* ── 10. Related services + Devon location links (SEO) ───────────── */}
        <section className="mb-14 md:mb-20 reveal-container">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 reveal-item">
            Related diesel &amp; DPF services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Link to="/blocked-dpf-cleaning-devon" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
              <Shield className="text-[#FF7A00] mb-4" size={26} />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">Blocked DPF Cleaning</h3>
              <p className="text-white/60 text-sm md:text-base mb-4">Warning light, limp mode or a failed regen? We diagnose the cause and professionally clean blocked filters.</p>
              <span className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
                Blocked DPF help <ArrowRight size={14} className="ml-2" />
              </span>
            </Link>

            <Link to="/dpf-diagnostics-devon" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
              <Settings className="text-[#FF7A00] mb-4" size={26} />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">DPF Diagnostics</h3>
              <p className="text-white/60 text-sm md:text-base mb-4">Find the real cause before paying for cleaning or a costly replacement. Evidence-based, honest diagnosis.</p>
              <span className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
                DPF diagnostics <ArrowRight size={14} className="ml-2" />
              </span>
            </Link>

            <Link
              to="/postal-dpf"
              onClick={() => trackCta('related_services', 'postal')}
              className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#FF7A00]/10 border border-[#FF7A00]/20 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/15 transition-all duration-300 reveal-item"
            >
              <Package className="text-[#FF7A00] mb-4" size={26} />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Postal DPF Cleaning</h3>
              <p className="text-white/70 text-sm md:text-base mb-4">UK-wide service: remove your DPF, send it to us, and we clean, test and return it.</p>
              <span className="flex items-center text-[#FF7A00] font-bold group-hover:translate-x-2 transition-transform text-sm">
                Book postal clean <ArrowRight size={14} className="ml-2" />
              </span>
            </Link>

            <Link to="/how-it-works" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
              <Settings className="text-[#FF7A00] mb-4" size={26} />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">Our Full Cleaning Process</h3>
              <p className="text-white/60 text-sm md:text-base mb-4">The complete five-stage workshop process, from pre-test through to flow test and return.</p>
              <span className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
                See the process <ArrowRight size={14} className="ml-2" />
              </span>
            </Link>

            <Link to="/why-clean" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
              <Shield className="text-[#FF7A00] mb-4" size={26} />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">Why Clean vs Replace?</h3>
              <p className="text-white/60 text-sm md:text-base mb-4">Professional cleaning costs a fraction of a new filter and keeps your vehicle&rsquo;s OEM specification intact.</p>
              <span className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
                Learn more <ArrowRight size={14} className="ml-2" />
              </span>
            </Link>

            <Link to="/adblue-repair-devon" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
              <Package className="text-[#FF7A00] mb-4" size={26} />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">AdBlue Repair</h3>
              <p className="text-white/60 text-sm md:text-base mb-4">AdBlue warning light or a no-start countdown? We diagnose and repair AdBlue and SCR faults properly.</p>
              <span className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
                AdBlue fault diagnostics <ArrowRight size={14} className="ml-2" />
              </span>
            </Link>
          </div>
        </section>

        <section className="mb-14 md:mb-20 reveal-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white reveal-item">
                DPF cleaning across Devon
              </h2>
              <p className="text-white/50 text-sm md:text-base mt-2 max-w-2xl reveal-item">
                Collection and return across Devon, or drop your removed filter straight to the
                workshop in Totnes.
              </p>
            </div>
            <Link
              to="/dpf-cleaning-devon"
              className="shrink-0 inline-flex items-center gap-2 text-[#FF7A00] font-medium text-sm hover:translate-x-1 transition-transform reveal-item"
            >
              <MapPin size={15} aria-hidden="true" /> Full Devon coverage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {locations.map((loc) => (
              <Link
                key={loc.path}
                to={loc.path}
                className="group p-4 md:p-5 rounded-xl md:rounded-2xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-white group-hover:text-[#FF7A00] transition-colors text-sm md:text-base">{loc.name}</span>
                  <ArrowRight size={14} className="text-[#FF7A00] shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-white/50 text-xs md:text-sm">{loc.note}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 11. FAQ ─────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-20 reveal-container">
          <div className="rounded-2xl bg-[#1A1D22] border border-white/5 border-l-4 border-l-[#FF7A00] p-5 sm:p-6 md:p-8 mb-8 reveal-item">
            <p className="text-white/70 text-[15px] sm:text-base md:text-lg leading-relaxed">
              <span className="text-white font-bold">Auto-Cleanse</span> is a Totnes-based DPF
              cleaning and ECU remapping specialist serving trade and private customers across
              Devon. Diesel particulate filter cleaning is carried out{' '}
              <span className="text-white font-semibold">off the vehicle</span> using our workshop
              equipment in Totnes, with local collection across Devon and UK-wide postal cleaning.
            </p>
          </div>
          <div className="reveal-item">
            <FaqSection
              faqs={dpfFaqs}
              heading={<><span className="text-white">DPF Cleaning </span><span className="text-[#FF7A00]">Questions</span></>}
            />
          </div>
        </section>

        {/* ── Latest from the workshop ────────────────────────────────────── */}
        <section className="mb-14 md:mb-20">
          <LatestPosts category="DPF" />
        </section>

        {/* ── 12. Final CTA ───────────────────────────────────────────────── */}
        <section className="text-center">
          <div className="relative p-7 sm:p-10 md:p-12 lg:p-16 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <h2 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Blocked DPF? Speak to <span className="text-[#FF7A00]">Auto-Cleanse.</span>
            </h2>
            <p className="relative z-10 text-white/60 text-[15px] sm:text-base md:text-lg font-medium mb-6 md:mb-8 max-w-2xl mx-auto">
              Professional DPF cleaning from our Totnes workshop for drivers and garages across
              Devon, with UK-wide postal cleaning available.
            </p>

            <p className="relative z-10 inline-flex items-baseline gap-3 rounded-2xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 px-6 py-3 mb-7 md:mb-8">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">From</span>
              <span className="text-3xl md:text-4xl font-black text-[#FF7A00] font-mono tracking-tight">£210</span>
            </p>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href={PHONE_HREF}
                onClick={() => trackCta('final', 'phone')}
                className="btn-shine px-6 sm:px-7 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2.5 text-base sm:text-lg min-h-[52px]"
                aria-label={`Call Auto-Cleanse on ${PHONE_DISPLAY}`}
              >
                <Phone size={20} aria-hidden="true" /> Call {PHONE_DISPLAY}
              </a>
              <Link
                to="/book"
                onClick={() => trackCta('final', 'booking')}
                className="px-6 sm:px-7 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2.5 text-base sm:text-lg min-h-[52px]"
              >
                <CalendarClock size={20} className="text-[#FF7A00]" aria-hidden="true" /> Book DPF Cleaning
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DPFCleaningHub;
