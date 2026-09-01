import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import {
  Phone, Star, ArrowRight, Check, Wrench, Truck, ClipboardCheck,
  PhoneCall, CalendarClock, Building2, Car,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import FaqSection, { type Faq } from '../components/FaqSection';
import { getReviews, DPF_TRADE_REVIEW_IDS } from '../data/reviews';
import { localBusinessNode, BUSINESS_ID } from '../data/business';
import { trackEvent } from '../lib/tracking';

gsap.registerPlugin(ScrollTrigger);

const PHONE_DISPLAY = '01803 269895';
const PHONE_HREF = 'tel:01803269895';

// Reuses the site-wide gtag helper. Phone links are already counted as
// `phone_click` by <LeadTracking>; this only records which section was clicked.
const trackCta = (cta: string, type: 'phone' | 'booking') =>
  trackEvent('dpf_cta_click', { cta_location: cta, cta_type: type, page_path: '/dpf-cleaning-plymouth' });

const heroTrust = [
  'Off-vehicle machine cleaning',
  'Before & after flow testing',
  'Collection on our Plymouth route',
  'Trade, fleet and private work',
];

const processSteps = [
  {
    icon: PhoneCall,
    title: 'Get in touch',
    body: 'Call with the registration and what the vehicle is doing. Garages can tell us how many filters are coming and we will work out the practicalities from there.',
  },
  {
    icon: Wrench,
    title: 'DPF removed',
    body: 'The filter comes off the vehicle, usually in your own workshop. Then it is collection on our Plymouth route, a drop-off at Totnes, or tracked post.',
  },
  {
    icon: ClipboardCheck,
    title: 'Professionally cleaned & tested',
    body: 'Inspected, flow tested, machine cleaned off the vehicle on our METclean XL, dried, then tested again so the change is measured rather than claimed.',
  },
  {
    icon: Truck,
    title: 'Returned ready to refit',
    body: 'Back to you with the before-and-after figures so it can go straight back on. Same-day turnaround where possible for filters that reach us early.',
  },
];

const included = [
  'Professional off-vehicle machine clean',
  'Before and after flow testing',
  'Internal inspection and honest report',
  'Cars, vans, commercials and plant',
  'Trade, fleet and private customers',
];

const priceTiers = [
  { label: 'DPF machine cleaning', note: 'Our starting price', price: '£210' },
  { label: 'Collection & return, or UK postal', note: 'Applies to Plymouth, outside 10 miles', price: '£230' },
  { label: 'HGV & plant filters', note: 'Heavy vehicle and machinery DPFs', price: '£299' },
];

const FAQS: Faq[] = [
  {
    q: 'How much does DPF cleaning cost in Plymouth?',
    a: 'DPF machine cleaning starts from £210. Plymouth is around 25 miles from the workshop, outside our 10-mile collection band, so cleaning with collection and return, or by post, is from £230. HGV and plant filters are from £299. Call 01803 269895 with your vehicle details and we will confirm the exact price.',
  },
  {
    q: 'Do you collect DPFs from Plymouth?',
    a: 'Yes. Plymouth is on our regular collection route and we collect from garages across Plymouth, Saltash, Ivybridge, Tavistock, Plympton and the surrounding South Hams area. Collection depends on where we are running that week, so call to check what is available for your job.',
  },
  {
    q: 'Do you clean DPFs for Plymouth garages?',
    a: 'Yes, and it is a large part of what we do. Cleaning and flow-testing equipment is expensive to buy and rarely justified for the number of filters a single garage sees, so we act as the cleaning facility instead. You remove the filter, we clean and test it, and it comes back with a before-and-after report you can show the customer.',
  },
  {
    q: 'Can you handle several filters at once for a fleet?',
    a: 'Yes. Fleets and garages regularly send more than one filter on a single collection, which is usually the most efficient way to do it. Tell us roughly how many and what the vehicles are when you call and we will talk through the practicalities.',
  },
  {
    q: 'Do you offer mobile DPF cleaning in Plymouth?',
    a: 'No. Professional DPF cleaning is an off-vehicle workshop process using cleaning and flow-testing equipment that cannot be replicated at the roadside or on a driveway. For Plymouth customers that means collection, a drop-off at the Totnes workshop, or tracked post. Our mobile service covers ECU remapping only.',
  },
  {
    q: 'How long does DPF cleaning take?',
    a: 'The clean itself is a workshop process rather than an overnight soak, so filters that reach us early in the working day can often be cleaned, tested and ready the same day. We confirm timing when you book rather than promising a slot we cannot hold.',
  },
  {
    q: 'Can every blocked DPF be cleaned?',
    a: 'No. Filters loaded with soot and ash usually respond well to off-vehicle machine cleaning, but a cracked, melted or collapsed substrate may not be recoverable, and heavy oil contamination does not always come back. We inspect and flow test first and tell you honestly if replacement is the more sensible option.',
  },
  {
    q: 'Can I post my DPF from Plymouth instead?',
    a: 'Yes. Remove the filter, box it securely and send it tracked to the Totnes workshop. Postal cleaning starts from £230 and is often the simplest route for a single filter if the collection timing does not suit.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    localBusinessNode({
      description:
        'Professional off-vehicle DPF cleaning for Plymouth drivers, garages and fleets. Carried out at the Auto-Cleanse workshop in Totnes, Devon, with collection on our Plymouth route, workshop drop-off or UK-wide postal cleaning. We do not offer mobile or roadside DPF cleaning.',
      serviceType: 'DPF Cleaning',
      areaServed: [
        { '@type': 'City', name: 'Plymouth' },
        { '@type': 'AdministrativeArea', name: 'Devon' },
      ],
    }),
    {
      '@type': 'Service',
      name: 'DPF Cleaning Plymouth',
      serviceType: 'Diesel Particulate Filter Cleaning',
      provider: { '@id': BUSINESS_ID },
      areaServed: [
        { '@type': 'City', name: 'Plymouth' },
        { '@type': 'AdministrativeArea', name: 'Devon' },
      ],
      url: 'https://www.auto-cleanse.co.uk/dpf-cleaning-plymouth',
      description:
        'Off-vehicle machine cleaning of diesel particulate filters for Plymouth drivers, garages and fleets, with flow testing before and after cleaning. Collection on the Plymouth route, drop-off at the Totnes workshop, or UK-wide postal cleaning.',
      offers: [
        {
          '@type': 'Offer',
          name: 'DPF Cleaning - from',
          priceCurrency: 'GBP',
          price: '210.00',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'DPF Cleaning - collection outside 10 miles / UK postal',
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

const DPFCleaningPlymouth = () => {
  const container = useRef(null);
  const [pullQuote] = getReviews(['otr-mobile']);

  useGSAP(() => {
    // The hero is deliberately outside the reveal system: GSAP would set it to
    // opacity 0 on hydration and delay the prerendered LCP element on mobile.
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
        title="DPF Cleaning Plymouth | Professional DPF Cleaning | Auto-Cleanse"
        description="Professional DPF cleaning for Plymouth garages, fleets and drivers. Off-vehicle machine cleaning, tested before and after, from £210. Call 01803 269895."
        path="/dpf-cleaning-plymouth"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'Plymouth' }]} />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="text-center mb-12 md:mb-16">
          <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
            DPF Specialists &middot; Serving Plymouth
          </p>

          <h1 className="text-[2rem] leading-[1.08] sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 drop-shadow-2xl">
            <span className="text-white">DPF Cleaning </span>
            <span className="text-[#FF7A00] font-mono">Plymouth.</span>
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white/90 tracking-tight max-w-3xl mx-auto mb-4">
            Blocked filter, warning light or limp mode? Get it cleaned properly.
          </p>

          <p className="text-[15px] sm:text-base md:text-xl text-white/50 leading-relaxed font-medium max-w-3xl mx-auto">
            Auto-Cleanse is a diesel particulate filter specialist serving Plymouth garages, fleets
            and drivers. Filters are machine cleaned off the vehicle at our Totnes workshop and flow
            tested before and after, so you get a measured result.
          </p>

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

        {/* ── Trust strip ──────────────────────────────────────────────────── */}
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
              Used by garages and mobile mechanics across Devon
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

        {/* ── Who we work with in Plymouth (the local core) ────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              Working with Plymouth
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              The cleaning facility Plymouth garages do not have to buy
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              DPF cleaning and flow-testing equipment is expensive, and rarely justified by the
              number of filters a single garage sees in a year. Plymouth sits on our regular
              collection route from Totnes, roughly 25 miles down the A38, so most of our work in
              the city is done as an extension of someone else&rsquo;s workshop.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <div className="rounded-2xl bg-[#111317] border border-white/5 p-6 md:p-8 reveal-item">
              <Building2 size={24} className="text-[#FF7A00] mb-4" aria-hidden="true" />
              <h3 className="text-white font-bold text-lg md:text-xl mb-3 tracking-tight">
                Garages, fleets and mobile mechanics
              </h3>
              <p className="text-white/60 text-sm md:text-[15px] leading-relaxed mb-4">
                You remove the filter, we clean and test it, and it comes back with before-and-after
                figures you can put in front of the customer. Several filters can go on one
                collection, which is usually the sensible way to run a fleet through.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Collection across Plymouth, Saltash, Plympton, Ivybridge and Tavistock',
                  'Batch several filters on a single collection',
                  'Documented before-and-after flow figures',
                  'Cars, vans, commercials and plant',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-white/70 text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-[#111317] border border-white/5 p-6 md:p-8 reveal-item">
              <Car size={24} className="text-[#FF7A00] mb-4" aria-hidden="true" />
              <h3 className="text-white font-bold text-lg md:text-xl mb-3 tracking-tight">
                Private drivers
              </h3>
              <p className="text-white/60 text-sm md:text-[15px] leading-relaxed mb-4">
                The filter has to be off the vehicle before we can clean it, so most private
                customers have their own garage remove it, or ask us about arranging that. From
                there it is collection, a drop-off at Totnes, or tracked post.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Drop off at the Totnes workshop, straight down the A38',
                  'Collection by arrangement on our Plymouth route',
                  'UK-wide postal cleaning if timing suits better',
                  'An honest answer on whether cleaning is worth it',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-white/70 text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-white/40 text-sm leading-relaxed mt-5 max-w-3xl">
            Collection depends on where we are running that week, so call{' '}
            <a href={PHONE_HREF} onClick={() => trackCta('coverage_note', 'phone')} className="text-white/70 hover:text-[#FF7A00] transition-colors">
              {PHONE_DISPLAY}
            </a>{' '}
            to check what is available rather than assuming a slot.
          </p>
        </section>

        {/* ── Price ────────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              DPF cleaning cost
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              Plymouth DPF cleaning from <span className="text-[#FF7A00] font-mono">£210</span>
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              Plymouth is around 25 miles from the workshop, outside our 10-mile collection band, so
              cleaning with collection and return, or by post, is from £230. We confirm the exact
              figure when you call with your vehicle details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-8">
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
                Full pricing is on our{' '}
                <Link to="/pricing" className="text-white/60 hover:text-[#FF7A00] transition-colors">
                  DPF cleaning and remapping price list
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-12">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              The process
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
              How it works
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              Four steps from your first call to a cleaned, tested filter ready to go back on.
            </p>
          </div>

          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
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

        {/* ── Removal & refitting ──────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="rounded-2xl bg-[#1A1D22] border border-white/5 border-l-4 border-l-[#FF7A00] p-5 sm:p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8 reveal-item">
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                Need help with removal &amp; refitting?
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-3xl">
                Our standard DPF cleaning service is carried out with the filter removed from the
                vehicle, which most Plymouth garages handle themselves. If you need help arranging
                removal or refitting, call us to discuss current availability.
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

        {/* ── What comes out of the filter ─────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="reveal-item">
              <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                Why off-vehicle
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-5 leading-tight">
                What is actually blocking the filter
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-4">
                Not everything in a blocked DPF is the same substance, and that is what decides
                whether cleaning will work. Soot burns off, so a regeneration can clear it if the
                vehicle gets the chance. Ash does not burn at any temperature a vehicle reaches, and
                it accumulates for the life of the filter. Oil or coolant contamination is different
                again.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-7">
                An off-vehicle machine clean is aimed at the ash and the soot a regeneration never
                cleared. Testing the filter before and after is what tells you which of those you
                were dealing with, and whether the filter is worth keeping.
              </p>

              <ul className="space-y-3">
                {[
                  'Cleaned off the vehicle, not treated through the exhaust',
                  'Dedicated cleaning machine, not an additive or a forced regen',
                  'Flow and back-pressure measured before and after',
                  'Cracked, melted or contaminated filters flagged before you pay',
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
                The METclean XL MKII machine every Plymouth filter is cleaned on.
              </p>
            </div>
          </div>
        </section>

        {/* ── Clean vs replace ─────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 p-6 sm:p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center reveal-item">
            <div>
              <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                Clean vs replace
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-5 leading-tight">
                Worth cleaning, or worth replacing?
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-4">
                A replacement filter runs from many hundreds to several thousand pounds depending on
                the vehicle, and on a van or a fleet that decision repeats. Before committing to it,
                it is worth establishing whether the filter already on the vehicle is recoverable.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed">
                Professional cleaning can often restore a serviceable blocked filter for a fraction
                of replacement cost, and keeps the original vehicle-matched part in place. It is not
                always possible, which is exactly why we test before and after instead of promising
                an outcome up front. If a filter is not worth cleaning, we will say so.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-black/40 border border-[#FF7A00]/25 p-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#FF7A00]/80 mb-1">
                  Professional clean
                </div>
                <div className="text-3xl font-black font-mono text-[#FF7A00]">From £210</div>
                <p className="text-white/55 text-sm mt-2 leading-relaxed">
                  Keeps the original filter. Tested before and after.
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
              <Link
                to="/why-clean"
                className="px-5 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2 min-h-[48px]"
              >
                Why cleaning beats replacing <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Reviews ──────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <Reviews
            reviews={getReviews(DPF_TRADE_REVIEW_IDS)}
            heading={<><span className="text-white">Trusted by </span><span className="text-[#FF7A00]">garages &amp; fleets</span></>}
            intro="Genuine feedback from the garages and mobile mechanics who send us filters."
            columns={3}
            showGoogleCta
            showCallCta
          />
        </section>

        {/* ── Enquiry ──────────────────────────────────────────────────────── */}
        <section id="enquiry" className="mb-14 md:mb-24 scroll-mt-28 reveal-container">
          <div className="max-w-3xl mx-auto relative p-6 sm:p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden reveal-item">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <QuickEnquiryForm
                defaultService="DPF Cleaning"
                source="dpf-cleaning-plymouth"
                heading="Request a DPF Cleaning Callback"
                subheading="Send your details and we'll call you back about your DPF clean."
              />
            </div>
          </div>
        </section>

        {/* ── Coverage + internal links ────────────────────────────────────── */}
        <section className="mb-14 md:mb-20 reveal-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="reveal-item">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 tracking-tight">
                Plymouth and the A38 corridor
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base leading-relaxed mb-4">
                We collect from garages across Plymouth, Saltash, Ivybridge, Tavistock, Plympton and
                the surrounding South Hams area, and the postal service covers everywhere else. If
                you are not sure whether we reach you, call {PHONE_DISPLAY} and we will tell you
                straight away.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base leading-relaxed">
                Between Plymouth and the workshop:{' '}
                <Link to="/dpf-cleaning-ivybridge" className="text-white/80 hover:text-[#FF7A00] transition-colors">
                  DPF cleaning in Ivybridge
                </Link>
                ,{' '}
                <Link to="/dpf-cleaning-south-hams" className="text-white/80 hover:text-[#FF7A00] transition-colors">
                  across the South Hams
                </Link>{' '}
                and at{' '}
                <Link to="/dpf-cleaning-totnes" className="text-white/80 hover:text-[#FF7A00] transition-colors">
                  our Totnes workshop
                </Link>
                .
              </p>
            </div>

            <div className="reveal-item">
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Related pages</h3>
              <div className="space-y-3">
                {[
                  { to: '/dpf-cleaning', label: 'Professional DPF cleaning across Devon' },
                  { to: '/dpf-diagnostics-devon', label: 'DPF diagnostics: find the cause first' },
                  { to: '/blocked-dpf-cleaning-devon', label: 'Blocked DPF, warning light and limp mode' },
                  { to: '/how-it-works', label: 'Our full workshop cleaning process' },
                  { to: '/postal-dpf', label: 'UK-wide postal DPF cleaning' },
                  { to: '/pricing', label: 'DPF cleaning prices' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 text-white/70 hover:text-white transition-all group"
                  >
                    <ArrowRight size={16} className="text-[#FF7A00] shrink-0 group-hover:translate-x-1 transition-transform" />
                    <span className="font-medium text-sm md:text-[15px]">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-20 reveal-container">
          <div className="reveal-item">
            <FaqSection
              faqs={FAQS}
              heading={<><span className="text-white">Plymouth DPF Cleaning </span><span className="text-[#FF7A00]">Questions</span></>}
            />
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="text-center">
          <div className="relative p-7 sm:p-10 md:p-12 lg:p-16 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <h2 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Need DPF cleaning in <span className="text-[#FF7A00]">Plymouth?</span>
            </h2>
            <p className="relative z-10 text-white/60 text-[15px] sm:text-base md:text-lg font-medium mb-6 md:mb-8 max-w-2xl mx-auto">
              Professional off-vehicle cleaning from our Totnes workshop, with collection on the
              Plymouth route, workshop drop-off or UK-wide postal cleaning. Trade and private work
              both welcome.
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

export default DPFCleaningPlymouth;
