import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import {
  Phone, Star, ArrowRight, Check, Search, Droplets, Wind, TestTube,
  Wrench, Truck, ClipboardCheck, PhoneCall, CalendarClock,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import SymptomList from '../components/SymptomList';
import FaqSection, { type Faq } from '../components/FaqSection';
import { getReviews, DPF_TURNAROUND_REVIEW_IDS } from '../data/reviews';
import { localBusinessNode, BUSINESS_ID } from '../data/business';
import { trackEvent } from '../lib/tracking';

gsap.registerPlugin(ScrollTrigger);

const PHONE_DISPLAY = '01803 269895';
const PHONE_HREF = 'tel:01803269895';

const trackCta = (cta: string, type: 'phone' | 'booking') =>
  trackEvent('dpf_cta_click', { cta_location: cta, cta_type: type, page_path: '/dpf-cleaning-newton-abbot' });

const heroTrust = [
  'Around 8 miles from the workshop',
  'Off-vehicle machine cleaning',
  'Collection or drop-off',
  'Before & after flow testing',
];

// Newton Abbot's angle: the five workshop stages, because at 8 miles the
// question people actually have is "how long is my vehicle off the road?".
const workshopStages = [
  {
    icon: Search,
    title: 'Inspect & pre-test',
    body: 'Visual check for cracks, melted or collapsed substrate and oil contamination, then a flow and back-pressure reading that records the condition it arrived in.',
  },
  {
    icon: Droplets,
    title: 'Machine clean',
    body: 'Cleaned off the vehicle on our METclean XL to shift accumulated soot and the ash a regeneration can never burn away.',
  },
  {
    icon: Wind,
    title: 'Controlled drying',
    body: 'A hot-air drying stage after the aqueous process, so the filter goes back dry rather than damp.',
  },
  {
    icon: TestTube,
    title: 'Post-test & report',
    body: 'The same flow test is repeated and the figures written up, so the change is measured rather than claimed.',
  },
];

const processSteps = [
  {
    icon: PhoneCall,
    title: 'Get in touch',
    body: 'Call with the registration and the symptoms. If it sounds like a sensor or EGR fault rather than a loaded filter, we would rather say so first.',
  },
  {
    icon: Wrench,
    title: 'DPF removed',
    body: 'The filter comes off the vehicle, usually at your own garage. Newton Abbot is close enough that dropping it in yourself is genuinely practical.',
  },
  {
    icon: ClipboardCheck,
    title: 'Professionally cleaned & tested',
    body: 'The four workshop stages above: inspect, pre-test, machine clean and dry, then post-test.',
  },
  {
    icon: Truck,
    title: 'Returned ready to refit',
    body: 'Back to you with the before-and-after figures. Filters that reach us early in the day can often be ready the same working day.',
  },
];

const SYMPTOMS = [
  'A DPF or engine warning light on the dashboard',
  'Reduced power, or the vehicle dropping into limp mode',
  'A regeneration that will not complete',
  'Higher fuel consumption than usual',
  'Excessive exhaust smoke or soot',
  'Failed or borderline MOT emissions',
];

const included = [
  'Professional off-vehicle machine clean',
  'Flow testing before and after',
  'Internal inspection and honest report',
  'DPF, DOC and SCR filter cleaning',
  'Trade, fleet and private customers',
];

const priceTiers = [
  { label: 'DPF machine cleaning', note: 'Our starting price', price: '£210' },
  { label: 'Collection & return, or UK postal', note: 'Outside our 10-mile band', price: '£230' },
  { label: 'HGV & plant filters', note: 'Heavy vehicle and machinery DPFs', price: '£299' },
];

const FAQS: Faq[] = [
  {
    q: 'How quickly can you clean my DPF near Newton Abbot?',
    a: 'Newton Abbot is around 8 miles from our Totnes workshop via the A381, which is the shortest run of anywhere we serve. Filters that reach us early in the working day can often be cleaned, tested and ready the same day. We confirm timing when you book rather than promising a slot we cannot hold.',
  },
  {
    q: 'What does DPF cleaning cost?',
    a: 'DPF machine cleaning starts from £210, with collection and return or UK postal cleaning from £230, and HGV and plant filters from £299. Call 01803 269895 with your vehicle details and we will confirm the exact price before anything is booked.',
  },
  {
    q: 'Can I drop the filter off myself instead of arranging collection?',
    a: 'Yes, and from Newton Abbot it is often the quickest option. The workshop is at Webbers Yard, Totnes, straight down the A381. Bring the removed filter in and, if it arrives early enough in the day, it can often go through and be ready the same working day.',
  },
  {
    q: 'What actually happens to the filter while you have it?',
    a: 'It is inspected and flow tested on arrival, machine cleaned off the vehicle, put through a controlled hot-air drying stage, then flow tested again. You get the before-and-after figures back with the filter so you can see what changed.',
  },
  {
    q: 'Do I need a diagnostic before a DPF clean?',
    a: 'Not always, but it is worth it if the filter has blocked before. A DPF warning light can be caused by a faulty differential pressure sensor or an EGR fault rather than a loaded filter, and cleaning will not fix either. Our DPF diagnostics are a paid check, not a free scan.',
  },
  {
    q: 'Do you remove and refit the DPF for me?',
    a: 'Our standard service is cleaning the filter itself, with removal usually handled by your own garage. If you need help arranging removal or refitting, call 01803 269895 to discuss current availability and we will tell you honestly what we can do.',
  },
  {
    q: 'Do you offer mobile DPF cleaning in Newton Abbot?',
    a: 'No. Professional DPF cleaning is an off-vehicle workshop process using cleaning and flow-testing equipment that cannot be replicated at the roadside or on a driveway. Given how close Newton Abbot is to the workshop, collection or drop-off is rarely a problem. Our mobile service covers ECU remapping only.',
  },
  {
    q: 'Which areas around Newton Abbot do you cover?',
    a: 'As well as Newton Abbot we serve Kingsteignton, Kingskerswell, Abbotskerswell, Bovey Tracey, Chudleigh, Ashburton and Teignmouth, plus the wider South Devon area. Call us if you are not sure whether we reach you.',
  },
  {
    q: 'Can a blocked DPF be cleaned instead of replaced?',
    a: 'Usually, but not always. Filters loaded with soot and ash normally respond well to off-vehicle machine cleaning, while a cracked, melted or collapsed substrate may not be recoverable. Testing the filter first is how you find out before spending the money rather than after.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    localBusinessNode({
      description:
        'Professional off-vehicle DPF cleaning for Newton Abbot and South Devon, carried out at the Auto-Cleanse workshop in Totnes, around 8 miles away. Filters are inspected and flow tested before and after cleaning, with collection, workshop drop-off or UK-wide postal cleaning. We do not offer mobile or roadside DPF cleaning.',
      serviceType: 'DPF Cleaning',
      areaServed: [
        { '@type': 'City', name: 'Newton Abbot' },
        { '@type': 'AdministrativeArea', name: 'Devon' },
      ],
    }),
    {
      '@type': 'Service',
      name: 'DPF Cleaning Newton Abbot',
      serviceType: 'Diesel Particulate Filter Cleaning',
      provider: { '@id': BUSINESS_ID },
      areaServed: [
        { '@type': 'City', name: 'Newton Abbot' },
        { '@type': 'AdministrativeArea', name: 'Devon' },
      ],
      url: 'https://www.auto-cleanse.co.uk/dpf-cleaning-newton-abbot',
      description:
        'Off-vehicle machine cleaning of diesel particulate filters for Newton Abbot and South Devon, with inspection and flow testing before and after cleaning, and same-day return where possible.',
      offers: [
        { '@type': 'Offer', name: 'DPF Cleaning - from', priceCurrency: 'GBP', price: '210.00', availability: 'https://schema.org/InStock' },
        { '@type': 'Offer', name: 'DPF Cleaning - collection or UK postal', priceCurrency: 'GBP', price: '230.00', availability: 'https://schema.org/InStock' },
        { '@type': 'Offer', name: 'DPF Cleaning - HGV and plant', priceCurrency: 'GBP', price: '299.00', availability: 'https://schema.org/InStock' },
      ],
    },
  ],
};

const DPFCleaningNewtonAbbot = () => {
  const container = useRef(null);
  const [pullQuote] = getReviews(['peter-anning']);

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
        title="DPF Cleaning Newton Abbot | Professional Clean | Auto-Cleanse"
        description="Professional DPF cleaning for Newton Abbot, 8 miles from our Totnes workshop. Off-vehicle machine cleaning and testing, from £210. Call 01803 269895."
        path="/dpf-cleaning-newton-abbot"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'Newton Abbot' }]} />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="text-center mb-12 md:mb-16">
          <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
            DPF Specialists &middot; 8 Miles Away
          </p>

          <h1 className="text-[1.9rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 md:mb-6 drop-shadow-2xl">
            <span className="text-white">DPF Cleaning </span>
            <span className="text-[#FF7A00] font-mono">Newton Abbot.</span>
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white/90 tracking-tight max-w-3xl mx-auto mb-4">
            Blocked filter? Get it cleaned without the vehicle sitting for a week.
          </p>

          <p className="text-[15px] sm:text-base md:text-xl text-white/50 leading-relaxed font-medium max-w-3xl mx-auto">
            Our workshop is around 8 miles from Newton Abbot on the A381, the shortest run of
            anywhere we serve. Filters are machine cleaned off the vehicle and flow tested before
            and after, with same-day turnaround where possible.
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
              Collected, cleaned and back the same day
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

        {/* ── The Newton Abbot angle: downtime ─────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="reveal-item">
              <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
                Downtime
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-5 leading-tight">
                The nearest thing you have to an in-house cleaning bay
              </h2>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed mb-4">
                For a van that earns its keep, the cost of a DPF clean matters less than how many
                days the vehicle is standing still. Newton Abbot is around 8 miles from the workshop
                down the A381, which changes the practicalities more than the price does.
              </p>
              <p className="text-white/60 text-[15px] sm:text-base md:text-lg leading-relaxed">
                Dropping the removed filter in yourself is genuinely realistic from here rather than
                a half-day round trip, and collection can be arranged where it suits better. Filters
                that reach us early in the working day can often be cleaned, tested and ready the
                same day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal-item">
              <div className="rounded-2xl bg-[#111317] border border-white/5 p-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">Distance</div>
                <div className="text-2xl font-black font-mono text-[#FF7A00]">~8 miles</div>
                <p className="text-white/50 text-sm mt-2 leading-relaxed">Totnes workshop, via the A381.</p>
              </div>
              <div className="rounded-2xl bg-[#111317] border border-white/5 p-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">Getting it here</div>
                <div className="text-lg font-bold text-white">Drop off or collection</div>
                <p className="text-white/50 text-sm mt-2 leading-relaxed">Whichever suits the job.</p>
              </div>
              <div className="rounded-2xl bg-[#111317] border border-white/5 p-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">Turnaround</div>
                <div className="text-lg font-bold text-white">Often same working day</div>
                <p className="text-white/50 text-sm mt-2 leading-relaxed">For filters that arrive early.</p>
              </div>
              <div className="rounded-2xl bg-[#111317] border border-white/5 p-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">From</div>
                <div className="text-2xl font-black font-mono text-[#FF7A00]">£210</div>
                <p className="text-white/50 text-sm mt-2 leading-relaxed">Confirmed before you book.</p>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-sm leading-relaxed mt-6 max-w-3xl">
            We also cover Kingsteignton, Kingskerswell, Abbotskerswell, Bovey Tracey, Chudleigh,
            Ashburton and{' '}
            <Link to="/dpf-cleaning-teignmouth" className="text-white/70 hover:text-[#FF7A00] transition-colors">
              Teignmouth
            </Link>
            . Nearby too:{' '}
            <Link to="/dpf-cleaning-torquay" className="text-white/70 hover:text-[#FF7A00] transition-colors">Torquay</Link>
            {', '}
            <Link to="/dpf-cleaning-totnes" className="text-white/70 hover:text-[#FF7A00] transition-colors">Totnes</Link>
            {' and '}
            <Link to="/dpf-cleaning-dawlish" className="text-white/70 hover:text-[#FF7A00] transition-colors">Dawlish</Link>
            .
          </p>
        </section>

        {/* ── What happens in the workshop ─────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              Inside the clean
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
              What happens while we have your filter
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base md:text-lg leading-relaxed">
              Four stages on the bench. It is a workshop process rather than an overnight soak,
              which is why same-day turnaround is realistic when a filter arrives early enough.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/5 border border-white/5">
            {workshopStages.map((s, i) => (
              <div key={s.title} className="bg-[#111317] p-6 md:p-7 reveal-item">
                <div className="flex items-center gap-3 mb-4">
                  <s.icon size={20} className="text-[#FF7A00] shrink-0" aria-hidden="true" />
                  <span className="font-mono text-xs text-white/30 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-2 leading-snug">{s.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-sm leading-relaxed mt-5 max-w-3xl">
            The same process is used on DPF, DOC and SCR units. There is a fuller walkthrough on our{' '}
            <Link to="/how-it-works" className="text-white/70 hover:text-[#FF7A00] transition-colors">
              cleaning process page
            </Link>
            , and the full range is listed under{' '}
            <Link to="/services" className="text-white/70 hover:text-[#FF7A00] transition-colors">
              filter cleaning services
            </Link>
            .
          </p>
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
              A replacement filter runs from many hundreds to several thousand pounds depending on
              the vehicle, and keeps none of the original vehicle-matched part. Cleaning is not
              always possible, which is why the filter gets tested rather than promised on.
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

        {/* ── Symptoms ─────────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3 leading-tight">
              Signs your DPF needs attention
            </h2>
            <p className="text-white/55 text-[15px] sm:text-base leading-relaxed">
              A blocked filter is often a symptom of something else, so it is worth finding the
              cause rather than cleaning the same filter twice.
            </p>
          </div>
          <div className="reveal-item">
            <SymptomList items={SYMPTOMS} />
          </div>
          <p className="text-white/40 text-sm leading-relaxed mt-5 max-w-3xl">
            Where a filter has blocked more than once, our{' '}
            <Link to="/dpf-diagnostics-devon" className="text-white/70 hover:text-[#FF7A00] transition-colors">
              DPF diagnostics
            </Link>{' '}
            look for the underlying fault. There is more on{' '}
            <Link to="/blocked-dpf-cleaning-devon" className="text-white/70 hover:text-[#FF7A00] transition-colors">
              blocked filters, warning lights and limp mode
            </Link>
            .
          </p>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section className="mb-14 md:mb-24 reveal-container">
          <div className="max-w-3xl mb-8 md:mb-12">
            <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
              Start to finish
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
                vehicle, which most local garages handle themselves. If you need help arranging
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
            reviews={getReviews(DPF_TURNAROUND_REVIEW_IDS)}
            heading={<><span className="text-white">Back on the road </span><span className="text-[#FF7A00]">quickly</span></>}
            intro="Genuine customer feedback, chosen because each one is about turnaround."
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
                source="dpf-cleaning-newton-abbot"
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
              { to: '/postal-dpf', label: 'UK-wide postal DPF cleaning' },
              { to: '/ecu-remapping-newton-abbot', label: 'ECU remapping in Newton Abbot' },
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
              heading={<><span className="text-white">Newton Abbot DPF </span><span className="text-[#FF7A00]">Questions</span></>}
            />
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="text-center">
          <div className="relative p-7 sm:p-10 md:p-12 lg:p-16 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <h2 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Need DPF cleaning in <span className="text-[#FF7A00]">Newton Abbot?</span>
            </h2>
            <p className="relative z-10 text-white/60 text-[15px] sm:text-base md:text-lg font-medium mb-6 md:mb-8 max-w-2xl mx-auto">
              Eight miles down the A381. Drop the filter in or arrange collection, and get it back
              cleaned, tested and documented.
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

export default DPFCleaningNewtonAbbot;
