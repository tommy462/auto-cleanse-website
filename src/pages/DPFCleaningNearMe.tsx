import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Package, Truck, Warehouse, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import { getReviews, DPF_TOWN_REVIEW_IDS } from '../data/reviews';
import { DPF_DIRECTORY } from '../data/dpf-locations';

gsap.registerPlugin(ScrollTrigger);

const options = [
  {
    icon: Warehouse,
    title: 'Drop off at the workshop',
    desc: 'Near Totnes or South Devon? Bring the removed filter to Webbers Yard, Totnes. Before 10am, cleaning is often completed the same working day. Removal and refit can be arranged subject to availability.',
    link: { to: '/dpf-cleaning-totnes', label: 'Totnes workshop details' },
  },
  {
    icon: Truck,
    title: 'We collect across Devon',
    desc: 'We run collection routes across South Devon and reach the wider county by arrangement - from Plymouth and Exeter to the Torbay towns and the South Hams villages. Ideal for garages and fleets.',
    link: { to: '/dpf-cleaning-devon', label: 'Devon collection & trade' },
  },
  {
    icon: Package,
    title: 'Post it from anywhere in the UK',
    desc: 'Outside Devon? Send the removed filter tracked and it is usually cleaned, flow-tested and on its way back to you the next working day. Postal cleaning from £230.',
    link: { to: '/postal-dpf', label: 'Postal DPF cleaning' },
  },
];

const faqs = [
  {
    q: 'Is there a DPF cleaning service near me?',
    a: 'If you are in Devon - almost certainly. Our workshop is in Totnes, South Devon, with collection available across the county; pick your town below for local routes, drive times and collection detail. Outside Devon, the postal service means "near" stops mattering: filters are usually back the next working day.',
  },
  {
    q: 'Do you come to my house and clean the DPF on the vehicle?',
    a: 'No - and be wary of anyone who says they can. Proper DPF cleaning is an off-vehicle workshop process using aqueous cleaning, pneumatic flushing and back-pressure flow testing. We collect and return, or you can drop off or post the filter. Our mobile visits are for ECU remapping only.',
  },
  {
    q: "What if I'm not sure the DPF is the problem?",
    a: 'A blocked filter is often a symptom of something else - a faulty sensor, EGR issue or failed regeneration. Our DPF diagnostics service (a paid assessment, not a free check) reads soot and ash levels and finds the underlying cause before you spend money on cleaning or a replacement.',
  },
  {
    q: 'How quickly will I get the filter back?',
    a: 'Filters with us before 10am are often cleaned the same working day. Postal filters are usually returned the next working day after cleaning. Every filter comes back with before-and-after flow-test figures.',
  },
];

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

export default function DPFCleaningNearMe() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );
    gsap.utils.toArray<HTMLElement>('.reveal-container').forEach((c) => {
      const items = c.querySelectorAll('.reveal-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: c, start: 'top 85%' }
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="DPF Cleaning Near Me | Drop-Off, Devon Collection & UK Postal | AutoCleanse"
        description="Looking for DPF cleaning near you? AutoCleanse deep-cleans DPFs off the vehicle at our Totnes workshop - drop off, Devon-wide collection, or UK postal with next-working-day return. From £210."
        path="/dpf-cleaning-near-me"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': ['AutomotiveService', 'LocalBusiness'],
          name: 'AutoCleanse',
          description: 'Off-vehicle DPF cleaning - workshop drop-off in Totnes, collection across Devon, and UK-wide postal cleaning with next-working-day return.',
          url: 'https://www.auto-cleanse.co.uk/dpf-cleaning-near-me',
          telephone: '01803 269895',
          email: 'info@auto-cleanse.co.uk',
          address: { '@type': 'PostalAddress', streetAddress: 'The Old Barn Industrial Estate, Webbers Yard Estate', addressLocality: 'Totnes', addressRegion: 'Devon', postalCode: 'TQ9 6JY', addressCountry: 'GB' },
          geo: { '@type': 'GeoCoordinates', latitude: '50.4316', longitude: '-3.6844' },
          areaServed: [
            { '@type': 'AdministrativeArea', name: 'Devon' },
            { '@type': 'Country', name: 'United Kingdom' },
          ],
          serviceType: 'DPF Cleaning',
          priceRange: '££',
          openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '17:00' }],
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
      ])}} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[
          { name: 'DPF Cleaning', path: '/dpf-cleaning' },
          { name: 'Near Me' },
        ]} />

        {/* Hero */}
        <div className="text-center mb-16 md:mb-20 reveal-container">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4 reveal-item">
            Find your nearest option
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('DPF Cleaning Near', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">You.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              Here's the honest answer to "DPF cleaning near me": proper cleaning happens off the vehicle,
              on workshop equipment - so what matters isn't the closest garage, it's the nearest specialist
              and the easiest way to get your filter to them. AutoCleanse cleans DPFs at our workshop in
              Totnes, South Devon, and there are three ways to use us wherever you are.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 reveal-container">

          {/* Three ways */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {options.map(({ icon: Icon, title, desc, link }) => (
              <div key={title} className="reveal-item group bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/25 rounded-2xl p-6 md:p-7 transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#FF7A00]" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors duration-300">{title}</h2>
                <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">{desc}</p>
                <Link to={link.to} className="text-[#FF7A00] text-sm font-bold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  {link.label} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>

          {/* Distance directory */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item overflow-hidden shadow-xl shadow-black">
            <div className="flex items-center mb-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">How Near Are We To You?</h2>
            </div>
            <p className="relative z-10 text-white/50 text-base md:text-lg font-medium mb-8">
              Approximate road distances from our Totnes workshop. Pick your town for local routes,
              collection detail and prices.
            </p>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DPF_DIRECTORY.map(({ name, path, distance, note }) => (
                <Link key={path} to={path} className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 transition-all group/link">
                  <div className="min-w-0">
                    <span className="block text-white font-bold group-hover/link:text-[#FF7A00] transition-colors">{name}</span>
                    <span className="block text-white/40 text-xs truncate">{note}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#FF7A00] text-sm font-mono font-bold">{distance}</span>
                    <ArrowRight size={14} className="text-[#FF7A00] group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Why a specialist beats "nearest" */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <ShieldCheck size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Why "Nearest" Isn't the Same as "Best"</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Additive flushes and forced regenerations - the typical "DPF clean" offered locally - only
                deal with soot the engine could mostly burn off anyway, and do nothing about the ash that
                permanently builds up in the filter. Off-vehicle cleaning removes both, restores near-new
                flow, and is verified with a before-and-after back-pressure test you can see in numbers.
              </p>
              <p>
                Because the filter has to come off the vehicle for a proper clean, distance barely matters:
                collection, drop-off or a tracked courier all get the same result. Cleaning starts from
                £210, against £500-£2,000+ for a typical replacement filter.
              </p>
            </div>
          </section>

          {/* FAQs */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item overflow-hidden shadow-xl shadow-black">
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <HelpCircle size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Near-Me Questions, Answered Honestly</h2>
            </div>
            <div className="relative z-10 space-y-6 text-white/60 text-lg font-medium leading-relaxed">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <p className="text-white font-bold mb-1">{faq.q}</p>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Services links */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">DPF Services &amp; Booking</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/dpf-cleaning', label: 'DPF cleaning Devon - main service page' },
                { to: '/dpf-diagnostics-devon', label: 'DPF diagnostics - find the cause first' },
                { to: '/blocked-dpf-cleaning-devon', label: 'Blocked DPF? Warning light & limp mode help' },
                { to: '/why-clean', label: 'Why cleaning beats replacement' },
                { to: '/pricing', label: 'DPF cleaning prices' },
                { to: '/book', label: 'Book a DPF clean or collection' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all group/link">
                  <ArrowRight size={20} className="text-[#FF7A00] mr-4 group-hover/link:translate-x-2 transition-transform" />
                  <span className="font-medium text-lg">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="reveal-item">
            <Reviews
              reviews={getReviews(DPF_TOWN_REVIEW_IDS)}
              heading={<><span className="text-white">Trusted for </span><span className="text-[#FF7A00]">DPF Cleaning</span></>}
              columns={3}
              showGoogleCta
              showCallCta
            />
          </section>

          <section className="reveal-item">
            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <QuickEnquiryForm
                  defaultService="DPF Cleaning"
                  source="dpf-cleaning-near-me"
                  heading="Not sure which option fits? Ask us."
                  subheading="Tell us where you are and we'll recommend drop-off, collection or postal."
                />
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center mt-16 reveal-item">
            <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Wherever you are, your DPF <span className="text-[#FF7A00]">can reach us.</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Drop off, collection or post - one workshop, one documented process, from £210.
              </p>
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
                <MagneticButton className="block">
                  <a href="tel:01803269895" className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg">
                    <Phone size={24} className="mr-3 text-[#FF7A00]" /> 01803 269895
                  </a>
                </MagneticButton>
                <MagneticButton className="block">
                  <a href="mailto:info@auto-cleanse.co.uk" className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg">
                    <Mail size={24} className="mr-3" /> Send enquiry
                  </a>
                </MagneticButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
