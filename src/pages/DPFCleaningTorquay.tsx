import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import {
  Phone, Star, ArrowRight, Check, Search, Gauge, Wrench, Truck,
  ClipboardCheck, PhoneCall, CalendarClock,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import SymptomList from '../components/SymptomList';
import FaqSection, { type Faq } from '../components/FaqSection';
import { getReviews, DPF_ASSESSMENT_REVIEW_IDS } from '../data/reviews';
import { localBusinessNode, BUSINESS_ID } from '../data/business';
import { trackEvent } from '../lib/tracking';

gsap.registerPlugin(ScrollTrigger);

const PHONE_DISPLAY = '01803 269895';
const PHONE_HREF = 'tel:01803269895';

const trackCta = (cta: string, type: 'phone' | 'booking') =>
  trackEvent('dpf_cta_click', { cta_location: cta, cta_type: type, page_path: '/dpf-cleaning-torquay' });

const heroTrust = [
  'Assessed before it is cleaned',
  'Off-vehicle machine cleaning',
  'On our Torbay collection run',
  'Trade and private work',
];

// Torquay's angle: a blocked-looking filter is not always a blocked filter.
const assessmentPoints = [
  {
    icon: Search,
    title: 'Is it really the filter?',
    body: 'A DPF light and limp mode can come from a failed differential pressure sensor, a split pressure pipe or an EGR fault, with a perfectly serviceable filter behind it. Cleaning that filter fixes nothing and the light comes back.',
  },
  {
    icon: Gauge,
    title: 'What the numbers say',
    body: 'Flow and back-pressure testing tells us how restricted the filter actually is, rather than relying on a dashboard warning or a soot figure the ECU has calculated rather than measured.',
  },
  {
    icon: ClipboardCheck,
    title: 'What we tell you',
    body: 'If the filter is loaded, we clean it and show you the before-and-after. If it is physically damaged, or the fault is somewhere else, you get told that instead of an invoice for work that will not help.',
  },
];

const processSteps = [
  {
    icon: PhoneCall,
    title: 'Get in touch',
    body: 'Call with the registration and the symptoms. If the fault sounds like something other than a loaded filter, we will say so before you take anything apart.',
  },
  {
    icon: Wrench,
    title: 'DPF removed',
    body: 'The filter comes off the vehicle. From Torquay that means collection on our Torbay run, a drop-off at the Totnes workshop, or tracked post.',
  },
  {
    icon: ClipboardCheck,
    title: 'Assessed, cleaned & tested',
    body: 'Inspected and flow tested first, then machine cleaned off the vehicle on our METclean XL, dried, and tested again.',
  },
  {
    icon: Truck,
    title: 'Ready to refit',
    body: 'Returned with the before-and-after figures so you can see what changed. Same-day turnaround where possible for filters that reach us early.',
  },
];

const SYMPTOMS = [
  'A DPF or engine warning light that will not clear',
  'Limp mode, or power that drops away under load',
  'A regeneration that starts and never completes',
  'Fuel consumption creeping up with no other change',
  'Excessive exhaust smoke or a strong diesel smell',
  'Failed or borderline MOT emissions',
];

const included = [
  'Internal inspection and flow test on arrival',
  'Professional off-vehicle machine clean',
  'Repeat flow test after cleaning',
  'An honest report on what was found',
  'Cars, vans, commercials and plant',
];

const priceTiers = [
  { label: 'DPF machine cleaning', note: 'Our starting price', price: '£210' },
  { label: 'Collection & return, or UK postal', note: 'Outside our 10-mile band', price: '£230' },
  { label: 'HGV & plant filters', note: 'Heavy vehicle and machinery DPFs', price: '£299' },
];

const FAQS: Faq[] = [
  {
    q: 'How much does DPF cleaning cost in Torquay?',
    a: 'DPF machine cleaning starts from £210. Torquay is around 12 miles from our Totnes workshop, so cleaning with collection and return, or by post, is from £230. HGV and plant filters are from £299. Call 01803 269895 with your vehicle details and we will confirm the exact price before anything is booked.',
  },
  {
    q: 'How do I know my DPF actually needs cleaning?',
    a: 'You often do not, until it is tested. A DPF warning light can be caused by a faulty differential pressure sensor, a split sensor pipe or an EGR fault rather than a loaded filter. We inspect and flow test the filter before cleaning it, and if the filter is healthy we will tell you so rather than clean it anyway.',
  },
  {
    q: 'Do you collect DPFs from Torquay?',
    a: 'Yes. Torquay sits on our Torbay collection run alongside Paignton and Brixham, so collection of a removed filter can usually be arranged. Garages can put several filters on one collection. Availability depends on where we are running that week, so call to check rather than assume a slot.',
  },
  {
    q: 'Do you offer mobile DPF cleaning in Torquay?',
    a: 'No. Professional DPF cleaning is an off-vehicle workshop process using cleaning and flow-testing equipment that cannot be replicated at the roadside or on a driveway. From Torquay that means collection, a drop-off at Totnes, or tracked post. Our mobile service covers ECU remapping only.',
  },
  {
    q: 'Is this different from an additive or a forced regeneration?',
    a: 'Yes. Additives and forced regens work by burning soot off, which can be enough on a lightly loaded filter once the underlying fault is fixed. Neither removes the ash that builds up over a filter’s life, because ash does not burn. Off-vehicle machine cleaning is aimed at both, and it is measurable.',
  },
  {
    q: 'Can every blocked DPF be cleaned?',
    a: 'No. Filters loaded with soot and ash usually respond well, but a cracked, melted or collapsed substrate may not be recoverable, and heavy oil contamination does not always come back. That is exactly why we test first: it is better to find out before you pay than after.',
  },
  {
    q: 'Do you work with Torbay garages?',
    a: 'Yes. Garages and mobile mechanics remove the filter, we clean and test it, and it comes back with documented before-and-after figures you can show the customer. Call 01803 269895 to talk through trade turnaround.',
  },
  {
    q: 'How long does DPF cleaning take?',
    a: 'The clean itself is a workshop process rather than an overnight soak, so filters that reach us early in the working day can often be cleaned, tested and ready the same day. We confirm timing when you book rather than promising a slot we cannot hold.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    localBusinessNode({
      description:
        'Professional off-vehicle DPF cleaning for Torquay and the wider Torbay area, carried out at the Auto-Cleanse workshop in Totnes, Devon. Filters are inspected and flow tested before and after cleaning. Collection on the Torbay run, workshop drop-off or UK-wide postal cleaning. We do not offer mobile or roadside DPF cleaning.',
      serviceType: 'DPF Cleaning',
      areaServed: [
        { '@type': 'City', name: 'Torquay' },
        { '@type': 'City', name: 'Paignton' },
        { '@type': 'City', name: 'Brixham' },
        { '@type': 'AdministrativeArea', name: 'Devon' },
      ],
    }),
    {
      '@type': 'Service',
      name: 'DPF Cleaning Torquay',
      serviceType: 'Diesel Particulate Filter Cleaning',
      provider: { '@id': BUSINESS_ID },
      areaServed: [
        { '@type': 'City', name: 'Torquay' },
        { '@type': 'AdministrativeArea', name: 'Devon' },
      ],
      url: 'https://www.auto-cleanse.co.uk/dpf-cleaning-torquay',
      description:
        'Off-vehicle machine cleaning of diesel particulate filters for Torquay and Torbay, with inspection and flow testing before and after cleaning.',
      offers: [
        { '@type': 'Offer', name: 'DPF Cleaning - from', priceCurrency: 'GBP', price: '210.00', availability: 'https://schema.org/InStock' },
        { '@type': 'Offer', name: 'DPF Cleaning - collection or UK postal', priceCurrency: 'GBP', price: '230.00', availability: 'https://schema.org/InStock' },
        { '@type': 'Offer', name: 'DPF Cleaning - HGV and plant', priceCurrency: 'GBP', price: '299.00', availability: 'https://schema.org/InStock' },
      ],
    },
  ],
};

const DPFCleaningTorquay = () => {
  const container = useRef(null);
  const [pullQuote] = getReviews(['callum-woodman']);

  useGSAP(() => {
    // Hero deliberately excluded: GSAP would set it to opacity 0 on hydration and
    // delay the prerendered LCP element on mobile.
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
        title="DPF Cleaning Torquay | Professional DPF Cleaning | Auto-Cleanse"
        description="Professional DPF cleaning for Torquay and Torbay. Inspected and flow tested before and after an off-vehicle machine clean, from £210. Call 01803 269895."
        path="/dpf-cleaning-torquay"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'Torquay' }]} />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="text-center mb-12 md:mb-16">
          <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
            DPF Specialists &middot; Serving Torquay
          </p>

          <h1 className="text-[2rem] leading-[1.08] sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 drop-shadow-2xl">
            <span className="text-white">DPF Cleaning </span>
            <span className="text-[#FF7A00] font-mono">Torquay.</span>
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white/90 tracking-tight max-w-3xl mx-auto mb-4">
            Tested before it is cleaned, so you only pay for work that helps.
          </p>

          <p className="text-[15px] sm:text-base md:text-xl text-white/50 leading-relaxed font-medium max-w-3xl mx-auto">
            Auto-Cleanse cleans diesel particulate filters off the vehicle at our Totnes workshop for
            drivers and garages across Torquay and Torbay. Every filter is inspected and flow tested
            before and after, so the result is measured rather than assumed.
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
              Diagnosis first, work second
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

        {/* ── The Torquay angle: is it really the filter? ──────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              Before we clean anything
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              A DPF light does not always mean a blocked DPF
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              This is the part most people skip. Cleaning a filter that was never the problem costs
              money and changes nothing, and the warning light returns within a few hundred miles.
              So the filter gets assessed before it gets cleaned.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden bg-white/5 border border-white/5">
            {assessmentPoints.map((p) => (
              <div key={p.title} className="bg-[#111317] p-6 md:p-7 reveal-item">
                <p.icon size={22} className="text-[#FF7A00] mb-4" aria-hidden="true" />
                <h3 className="text-white font-bold text-lg mb-2 leading-snug tracking-tight">{p.title}</h3>
                <p className="text-white/55 text-sm md:text-[15px] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-sm leading-relaxed mt-5 max-w-3xl">
            Where the cause is not obvious, our{' '}
            <Link to="/dpf-diagnostics-devon" className="text-white/70 hover:text-[#FF7A00] transition-colors">
              DPF diagnostics
            </Link>{' '}
            go further. They are a paid check rather than a free scan, and they are worth doing when
            a filter has blocked more than once.
          </p>
        </section>

        {/* ── Symptoms ─────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3 leading-tight">
              What brings Torquay drivers to us
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base leading-relaxed">
              Any of these is worth a phone call before it turns into a recovery truck.
            </p>
          </div>
          <div className="reveal-item">
            <SymptomList items={SYMPTOMS} />
          </div>
          <p className="text-white/40 text-sm leading-relaxed mt-5 max-w-3xl">
            More detail on{' '}
            <Link to="/blocked-dpf-cleaning-devon" className="text-white/70 hover:text-[#FF7A00] transition-colors">
              warning lights, limp mode and failed regenerations
            </Link>
            .
          </p>
        </section>

        {/* ── Getting the filter to us from Torquay ────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 p-6 sm:p-8 md:p-10 reveal-item">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-5 leading-tight">
              Getting the filter to us from Torquay
            </h2>
            <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
              Torquay is about 12 miles from the workshop and sits on our Torbay collection run
              alongside Paignton and Brixham, so a removed filter can usually be collected. Garages
              can put several on one collection. If the timing does not suit, the filter can be
              dropped at Webbers Yard in Totnes or sent tracked instead.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { t: 'Collection', d: 'On the Torbay run, by arrangement' },
                { t: 'Workshop drop-off', d: 'Webbers Yard, Totnes' },
                { t: 'Tracked post', d: 'UK-wide, from £230' },
              ].map((o) => (
                <div key={o.t} className="rounded-xl bg-black/40 border border-white/10 p-4">
                  <div className="text-white font-bold text-[15px] mb-1">{o.t}</div>
                  <div className="text-white/50 text-sm">{o.d}</div>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm leading-relaxed mt-5">
              Collection depends on where we are running that week, so call{' '}
              <a href={PHONE_HREF} onClick={() => trackCta('collection_note', 'phone')} className="text-white/70 hover:text-[#FF7A00] transition-colors">
                {PHONE_DISPLAY}
              </a>{' '}
              to check rather than assuming a slot. Nearby:{' '}
              <Link to="/dpf-cleaning-paignton" className="text-white/70 hover:text-[#FF7A00] transition-colors">Paignton</Link>
              {', '}
              <Link to="/dpf-cleaning-brixham" className="text-white/70 hover:text-[#FF7A00] transition-colors">Brixham</Link>
              {' and '}
              <Link to="/dpf-cleaning-newton-abbot" className="text-white/70 hover:text-[#FF7A00] transition-colors">Newton Abbot</Link>
              .
            </p>
          </div>
        </section>

        {/* ── Price ────────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              DPF cleaning cost
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              Professional DPF cleaning from <span className="text-[#FF7A00] font-mono">£210</span>
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              The price depends on how the filter reaches us and what kind of vehicle it came off,
              and we confirm it before anything is booked. A replacement filter runs from many
              hundreds to several thousand pounds depending on the vehicle, which is usually reason
              enough to test the one you have first.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-8">
            <div className="lg:col-span-3 rounded-2xl bg-[#111317] border border-white/5 overflow-hidden reveal-item">
              {priceTiers.map((t) => (
                <div key={t.label} className="flex items-center justify-between gap-4 p-5 md:p-6 border-b border-white/5 last:border-0">
                  <div className="min-w-0">
                    <div className="text-white font-bold text-[15px] sm:text-base md:text-lg leading-snug">{t.label}</div>
                    <div className="text-white/45 text-xs sm:text-sm mt-0.5">{t.note}</div>
                  </div>
                  <div className="text-2xl md:text-3xl font-black font-mono text-[#FF7A00] shrink-0 tabular-nums">{t.price}</div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 rounded-2xl bg-[#1A1D22] border border-white/5 p-5 sm:p-6 md:p-7 reveal-item">
              <h3 className="text-white font-bold text-lg mb-5 tracking-tight">What&rsquo;s included</h3>
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
                , and there is more on{' '}
                <Link to="/why-clean" className="text-white/60 hover:text-[#FF7A00] transition-colors">
                  why cleaning usually beats replacing
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
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight">{step.title}</h3>
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
                vehicle, which most Torbay garages handle themselves. If you need help arranging
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

        {/* ── Reviews ──────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <Reviews
            reviews={getReviews(DPF_ASSESSMENT_REVIEW_IDS)}
            heading={<><span className="text-white">Diagnosed properly, </span><span className="text-[#FF7A00]">not just sold to</span></>}
            intro="Genuine customer feedback, including two cases where the DPF turned out not to be the fault."
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
                source="dpf-cleaning-torquay"
                heading="Request a DPF Cleaning Callback"
                subheading="Send your details and we'll call you back about your DPF clean."
              />
            </div>
          </div>
        </section>

        {/* ── Related pages ────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-20 reveal-container">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">Related pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="flex items-center gap-3 p-4 rounded-xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 text-white/70 hover:text-white transition-all group reveal-item"
              >
                <ArrowRight size={16} className="text-[#FF7A00] shrink-0 group-hover:translate-x-1 transition-transform" />
                <span className="font-medium text-sm md:text-[15px]">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-20 reveal-container">
          <div className="reveal-item">
            <FaqSection
              faqs={FAQS}
              heading={<><span className="text-white">Torquay DPF Cleaning </span><span className="text-[#FF7A00]">Questions</span></>}
            />
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="text-center">
          <div className="relative p-7 sm:p-10 md:p-12 lg:p-16 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <h2 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Need DPF cleaning in <span className="text-[#FF7A00]">Torquay?</span>
            </h2>
            <p className="relative z-10 text-white/60 text-[15px] sm:text-base md:text-lg font-medium mb-6 md:mb-8 max-w-2xl mx-auto">
              Tell us the registration and the symptoms and we will tell you whether cleaning is the
              right answer before you spend anything.
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

export default DPFCleaningTorquay;
