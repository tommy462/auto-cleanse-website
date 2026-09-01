import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import {
  Phone, Star, ArrowRight, Check, Truck, Building2, Package,
  Wrench, ClipboardCheck, PhoneCall, CalendarClock,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import SymptomList from '../components/SymptomList';
import FaqSection, { type Faq } from '../components/FaqSection';
import { getReviews, DPF_TOWN_REVIEW_IDS } from '../data/reviews';
import { localBusinessNode, BUSINESS_ID } from '../data/business';
import { trackEvent } from '../lib/tracking';

gsap.registerPlugin(ScrollTrigger);

const PHONE_DISPLAY = '01803 269895';
const PHONE_HREF = 'tel:01803269895';

// Reuses the site-wide gtag helper. Phone links are already counted as
// `phone_click` by <LeadTracking>; this only adds which section was clicked.
const trackCta = (cta: string, type: 'phone' | 'booking') =>
  trackEvent('dpf_cta_click', { cta_location: cta, cta_type: type, page_path: '/dpf-cleaning-exeter' });

const heroTrust = [
  'Off-vehicle machine cleaning',
  'Before & after flow testing',
  'Collection on our Exeter route',
  'Workshop drop-off or UK postal',
];

// The three genuine ways an Exeter customer can actually use the service.
// Distances and route wording come from DPF_DIRECTORY in src/data/dpf-locations.ts.
const exeterRoutes = [
  {
    icon: Truck,
    title: 'Collection on our Exeter route',
    body: 'Exeter is on our regular collection route from Totnes. Once the filter is off the vehicle we can arrange to collect it, clean and test it at the workshop, and bring it back. Garages can batch several filters into one collection.',
  },
  {
    icon: Building2,
    title: 'Drop off at the Totnes workshop',
    body: 'The workshop is at Webbers Yard, Totnes, roughly 27 miles from Exeter straight down the A38. Filters that reach us early in the working day can often be cleaned, tested and ready the same day.',
  },
  {
    icon: Package,
    title: 'Send it by post',
    body: 'If neither suits, box the removed filter and send it tracked. UK-wide postal cleaning starts from £230 and is often the quickest option for a single filter.',
  },
];

const processSteps = [
  {
    icon: PhoneCall,
    title: 'Get in touch',
    body: 'Call with your registration and what the vehicle is doing. We will tell you whether cleaning is the right answer before you commit to anything.',
  },
  {
    icon: Wrench,
    title: 'DPF removed',
    body: 'The filter comes off the vehicle, at your own garage or ours. Then choose collection from Exeter, workshop drop-off, or post.',
  },
  {
    icon: ClipboardCheck,
    title: 'Cleaned & tested',
    body: 'Inspected, flow tested, machine cleaned off the vehicle on our METclean XL, dried, then tested again so the change is measured.',
  },
  {
    icon: Truck,
    title: 'Ready to refit',
    body: 'Back to you with the before-and-after figures, ready to go straight back on. Same-day turnaround where possible for filters received early.',
  },
];

const SYMPTOMS = [
  'A DPF or engine warning light that stays on',
  'Limp mode or a sudden loss of power',
  'A regeneration that starts but never completes',
  'Fuel consumption creeping up',
  'Excessive exhaust smoke or soot',
  'Failed or borderline MOT emissions',
];

const included = [
  'Professional off-vehicle machine clean',
  'Before and after flow testing',
  'Visual filter assessment and honest report',
  'Cars, vans and commercial vehicles',
  'Trade, fleet and private customers',
];

const FAQS: Faq[] = [
  {
    q: 'How much does DPF cleaning cost in Exeter?',
    a: 'DPF machine cleaning starts from £210. Exeter sits outside our 10-mile collection band, so cleaning with collection and return, or by post, is from £230, and HGV and plant filters are from £299. We confirm the exact price when you call on 01803 269895 with your vehicle details.',
  },
  {
    q: 'Do you collect DPFs from Exeter?',
    a: 'Yes. Exeter is on our regular collection route from the Totnes workshop, so collection of a removed filter can be arranged. Garages can batch several filters into one collection. Call to check current availability, as collection depends on where we are running that week.',
  },
  {
    q: 'How long does DPF cleaning take?',
    a: 'The clean is a workshop process rather than an overnight soak. Filters that reach us early in the working day can often be cleaned, tested and ready the same day. We confirm timing when you book rather than promising a slot we cannot hold.',
  },
  {
    q: 'Do you offer mobile DPF cleaning in Exeter?',
    a: 'No. Professional DPF cleaning is carried out off the vehicle using workshop cleaning and flow-testing equipment that cannot be replicated at the roadside or on a driveway. For Exeter customers that means collection, workshop drop-off or post. Our mobile service covers ECU remapping only.',
  },
  {
    q: 'Can every DPF be cleaned?',
    a: 'No. Filters loaded with soot and ash usually respond well to off-vehicle machine cleaning, but a cracked, melted or collapsed substrate may not be recoverable. We inspect and flow test the filter first and tell you honestly if replacement is the more sensible option.',
  },
  {
    q: 'Do you clean DPFs for Exeter garages?',
    a: 'Yes. We work with garages, fleets and mobile mechanics across Devon, cleaning filters they have removed themselves. Call 01803 269895 to talk through trade turnaround and rates.',
  },
  {
    q: 'Can I post my DPF to you from Exeter?',
    a: 'Yes. Remove the filter, box it securely and send it tracked to the Totnes workshop. Postal cleaning starts from £230 and covers the whole UK, so it works just as well from Exeter as anywhere else.',
  },
  {
    q: 'Why did my DPF block in the first place?',
    a: 'Usually a regeneration that never completes, often from short, low-speed journeys. It can also be an underlying fault such as a faulty differential pressure sensor, an EGR problem, injector faults, or oil contamination from a failed turbo. Our DPF diagnostics are a paid check, not a free scan, and they are worth doing when a filter keeps blocking.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    localBusinessNode({
      description:
        'Professional off-vehicle DPF cleaning for Exeter drivers, garages and fleets. Carried out at the Auto-Cleanse workshop in Totnes, Devon, with collection on our Exeter route, workshop drop-off or UK-wide postal cleaning. We do not offer mobile or roadside DPF cleaning.',
      serviceType: 'DPF Cleaning',
      areaServed: [
        { '@type': 'City', name: 'Exeter' },
        { '@type': 'AdministrativeArea', name: 'Devon' },
      ],
    }),
    {
      '@type': 'Service',
      name: 'DPF Cleaning Exeter',
      serviceType: 'Diesel Particulate Filter Cleaning',
      provider: { '@id': BUSINESS_ID },
      areaServed: [
        { '@type': 'City', name: 'Exeter' },
        { '@type': 'AdministrativeArea', name: 'Devon' },
      ],
      url: 'https://www.auto-cleanse.co.uk/dpf-cleaning-exeter',
      description:
        'Off-vehicle machine cleaning of diesel particulate filters for Exeter, with flow testing before and after cleaning. Collection on the Exeter route, drop-off at the Totnes workshop, or UK-wide postal cleaning.',
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

const DPFCleaningExeter = () => {
  const container = useRef(null);
  const [pullQuote] = getReviews(['antony-moore']);

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
        title="DPF Cleaning Exeter | Professional DPF Cleaning | Auto-Cleanse"
        description="Professional DPF cleaning for Exeter drivers and garages. Off-vehicle machine cleaning, tested before and after, from £210. Call Auto-Cleanse on 01803 269895."
        path="/dpf-cleaning-exeter"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'Exeter' }]} />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="text-center mb-12 md:mb-16">
          <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
            DPF Specialists &middot; Serving Exeter
          </p>

          <h1 className="text-[2rem] leading-[1.08] sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 drop-shadow-2xl">
            <span className="text-white">DPF Cleaning </span>
            <span className="text-[#FF7A00] font-mono">Exeter.</span>
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white/90 tracking-tight max-w-3xl mx-auto mb-4">
            Blocked DPF, warning light or a regeneration that never finishes?
          </p>

          <p className="text-[15px] sm:text-base md:text-xl text-white/50 leading-relaxed font-medium max-w-3xl mx-auto">
            Auto-Cleanse provides professional off-vehicle DPF machine cleaning for drivers, garages
            and fleets in Exeter, carried out at our Totnes workshop with the filter tested before
            and after cleaning.
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
              Trusted by drivers and garages across Devon
            </p>
          </div>

          {pullQuote && (
            <figure className="lg:border-l lg:border-white/10 lg:pl-8 min-w-0 m-0">
              <blockquote className="text-white/70 text-sm sm:text-[15px] leading-relaxed">
                &ldquo;{pullQuote.text}&rdquo;
              </blockquote>
              <figcaption className="text-white/40 text-xs font-medium mt-2">
                {pullQuote.name}
                {pullQuote.company ? `, ${pullQuote.company}` : ''} &middot; {pullQuote.source}
              </figcaption>
            </figure>
          )}
        </section>

        {/* ── Three ways Exeter customers use us (the local core) ──────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              Getting the filter to us
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              Three ways to get a DPF cleaned from Exeter
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              The filter has to come off the vehicle either way, so where you are matters less than
              you would think. Pick whichever suits the job.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden bg-white/5 border border-white/5">
            {exeterRoutes.map((r) => (
              <div key={r.title} className="bg-[#111317] p-6 md:p-7 reveal-item">
                <r.icon size={22} className="text-[#FF7A00] mb-4" aria-hidden="true" />
                <h3 className="text-white font-bold text-lg mb-2 leading-snug tracking-tight">
                  {r.title}
                </h3>
                <p className="text-white/55 text-sm md:text-[15px] leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-sm leading-relaxed mt-5 max-w-3xl">
            Collection depends on where we are running that week, so call{' '}
            <a href={PHONE_HREF} onClick={() => trackCta('routes_note', 'phone')} className="text-white/70 hover:text-[#FF7A00] transition-colors">
              {PHONE_DISPLAY}
            </a>{' '}
            to check what is available for your job rather than assuming a slot.
          </p>
        </section>

        {/* ── Why off-vehicle cleaning ─────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="reveal-item">
              <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                Why off-vehicle
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-5 leading-tight">
                What professional cleaning actually involves
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-4">
                A bottle of additive or a forced regeneration has its place. Both work by burning
                soot off, and if the filter is only lightly loaded and the underlying fault is
                fixed, that can be enough. Neither touches the incombustible ash that builds up over
                a filter&rsquo;s life, because ash does not burn.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-7">
                That is what off-vehicle machine cleaning is for. The filter comes off, is inspected
                and flow tested, cleaned on our METclean XL and dried, then tested again, so you get
                a measured before-and-after rather than a hopeful guess.
              </p>

              <ul className="space-y-3">
                {[
                  'Cleaned off the vehicle, not treated in situ',
                  'A dedicated cleaning machine, not a chemical soak',
                  'Flow and back-pressure tested before and after',
                  'Physically damaged filters identified before you pay',
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
                The METclean XL MKII machine every Exeter filter is cleaned on.
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
                vehicle. Most Exeter garages remove it themselves. If you need help arranging
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

        {/* ── Price ────────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              DPF cleaning cost
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              What DPF cleaning costs from <span className="text-[#FF7A00] font-mono">£210</span>
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              Exeter is around 27 miles from the workshop, outside our 10-mile collection band, so
              cleaning with collection and return, or by post, is from £230. We confirm the exact
              figure when you call with your vehicle details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-8">
            <div className="lg:col-span-3 rounded-2xl bg-[#111317] border border-white/5 overflow-hidden reveal-item">
              {[
                { label: 'DPF machine cleaning', note: 'Our starting price, from the workshop', price: '£210' },
                { label: 'Collection & return, or UK postal', note: 'Applies to Exeter, outside 10 miles', price: '£230' },
                { label: 'HGV & plant filters', note: 'Heavy vehicle and machinery DPFs', price: '£299' },
              ].map((t) => (
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

        {/* ── Symptoms + clean vs replace ──────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="reveal-item">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-5 leading-tight">
                Signs your DPF needs attention
              </h2>
              <p className="text-white/55 text-[15px] sm:text-base leading-relaxed mb-6">
                Exeter driving does not help a diesel: the ring-road crawl, short hops across the
                city and stop-start delivery work all keep exhaust temperatures below what a
                regeneration needs. Soot builds faster than it burns off.
              </p>
              <SymptomList items={SYMPTOMS} />
              <p className="text-white/45 text-sm leading-relaxed mt-5">
                Repeated blocking usually points at something else. Our{' '}
                <Link to="/dpf-diagnostics-devon" className="text-white/70 hover:text-[#FF7A00] transition-colors">
                  paid DPF diagnostics
                </Link>{' '}
                look for the cause so the clean lasts, and there is more detail on{' '}
                <Link to="/blocked-dpf-cleaning-devon" className="text-white/70 hover:text-[#FF7A00] transition-colors">
                  warning lights, limp mode and failed regenerations
                </Link>
                .
              </p>
            </div>

            <div className="reveal-item">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-5 leading-tight">
                Clean it or replace it?
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base leading-relaxed mb-4">
                A replacement filter can run from many hundreds to several thousand pounds depending
                on the vehicle. Before committing to that, it is worth finding out whether the
                filter you already have is recoverable.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base leading-relaxed mb-6">
                Professional cleaning can often restore a serviceable blocked filter for a fraction
                of replacement cost, and keeps your original, vehicle-matched filter in place. It is
                not always possible, which is exactly why we test the filter before and after rather
                than promising an outcome up front.
              </p>
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
                <Link
                  to="/why-clean"
                  className="px-5 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2 min-h-[48px]"
                >
                  Why cleaning beats replacing <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Reviews ──────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <Reviews
            reviews={getReviews(DPF_TOWN_REVIEW_IDS)}
            heading={<><span className="text-white">Trusted for </span><span className="text-[#FF7A00]">DPF Cleaning</span></>}
            intro="Genuine feedback from drivers, garages and fleets across Devon."
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
                source="dpf-cleaning-exeter"
                heading="Request a DPF Cleaning Callback"
                subheading="Send your details and we'll call you back about your DPF clean."
              />
            </div>
          </div>
        </section>

        {/* ── Around Exeter + internal links ───────────────────────────────── */}
        <section className="mb-14 md:mb-20 reveal-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="reveal-item">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 tracking-tight">
                Around Exeter and East Devon
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base leading-relaxed mb-4">
                As well as Exeter itself we serve the surrounding East Devon towns, and the postal
                service covers everywhere else. If you have been looking for DPF cleaning near you
                and are not sure whether we reach your area, call {PHONE_DISPLAY} and we will tell
                you straight away.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base leading-relaxed">
                Nearby pages worth a look:{' '}
                <Link to="/dpf-cleaning-exmouth" className="text-white/80 hover:text-[#FF7A00] transition-colors">
                  DPF cleaning in Exmouth
                </Link>
                ,{' '}
                <Link to="/dpf-cleaning-dawlish" className="text-white/80 hover:text-[#FF7A00] transition-colors">
                  Dawlish
                </Link>
                ,{' '}
                <Link to="/dpf-cleaning-teignmouth" className="text-white/80 hover:text-[#FF7A00] transition-colors">
                  Teignmouth
                </Link>{' '}
                and{' '}
                <Link to="/dpf-cleaning-newton-abbot" className="text-white/80 hover:text-[#FF7A00] transition-colors">
                  Newton Abbot
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
              heading={<><span className="text-white">Exeter DPF Cleaning </span><span className="text-[#FF7A00]">Questions</span></>}
            />
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="text-center">
          <div className="relative p-7 sm:p-10 md:p-12 lg:p-16 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <h2 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Need DPF cleaning in <span className="text-[#FF7A00]">Exeter?</span>
            </h2>
            <p className="relative z-10 text-white/60 text-[15px] sm:text-base md:text-lg font-medium mb-6 md:mb-8 max-w-2xl mx-auto">
              Professional off-vehicle cleaning from our Totnes workshop, with collection on the
              Exeter route, workshop drop-off or UK-wide postal cleaning.
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

export default DPFCleaningExeter;
