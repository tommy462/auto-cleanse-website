import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Settings, Shield, Truck, ArrowRight, Search } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import Breadcrumbs from '../components/Breadcrumbs';
import SymptomList from '../components/SymptomList';
import FaqSection, { type Faq } from '../components/FaqSection';
import { getReviews, DPF_TOWN_REVIEW_IDS } from '../data/reviews';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const SYMPTOMS = [
  'A DPF or engine warning light on the dashboard',
  'Reduced power or limp mode',
  'A regeneration that will not complete',
  'Higher fuel consumption than usual',
  'Excessive exhaust smoke or soot',
  'Failed or borderline MOT emissions',
];

const FAQS: Faq[] = [
  {
    q: 'How quickly can you clean my DPF near Newton Abbot?',
    a: 'Newton Abbot is only about 8 miles from our Totnes workshop, so it is one of our fastest areas to serve. Filters received early in the day can often be cleaned and returned the same working day.',
  },
  {
    q: 'Do I need a diagnostic before a DPF clean?',
    a: 'We always confirm the filter is genuinely blocked and check for an underlying cause first. It avoids cleaning a healthy filter, or missing a sensor or EGR fault that would simply block it again.',
  },
  {
    q: 'What does DPF cleaning cost?',
    a: 'Professional DPF cleaning starts from £210. The exact price depends on the filter and vehicle, so call us on 01803 269895 for a quick quote.',
  },
  {
    q: 'Do you remove and refit the DPF for me?',
    a: 'Our core service is professional off-car cleaning of the filter itself at our workshop. Removal and refitting can be arranged - tell us your vehicle when you get in touch and we will advise the best option.',
  },
  {
    q: 'Which areas around Newton Abbot do you cover?',
    a: 'We regularly serve Kingsteignton, Kingskerswell, Abbotskerswell, Bovey Tracey, Chudleigh, Ashburton and Teignmouth, plus the wider South Devon area.',
  },
  {
    q: 'Can a blocked DPF be cleaned instead of replaced?',
    a: 'In most cases, yes. A professional clean restores your original filter for a fraction of the cost of a replacement, unless the filter is physically damaged.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'DPF Cleaning',
  serviceType: 'Diesel Particulate Filter Cleaning',
  provider: { '@type': 'LocalBusiness', name: 'Auto-Cleanse', url: 'https://www.auto-cleanse.co.uk' },
  areaServed: [
    { '@type': 'City', name: 'Newton Abbot' },
    { '@type': 'AdministrativeArea', name: 'Devon' },
  ],
  url: 'https://www.auto-cleanse.co.uk/dpf-cleaning-newton-abbot',
  description:
    'Professional off-car DPF cleaning for Newton Abbot and South Devon, with before-and-after flow testing and same-day local return where possible.',
};

const DPFCleaningNewtonAbbot = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );
    gsap.utils.toArray<HTMLElement>('.reveal-container').forEach((container) => {
      const items = container.querySelectorAll('.reveal-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: container, start: 'top 85%' }
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="DPF Cleaning Newton Abbot | Same-Day Turnaround | AutoCleanse"
        description="Professional DPF cleaning near Newton Abbot, just 8 miles from our Totnes workshop. We collect, clean to high flow efficiency and return, often same day. Cars, vans, HGVs and fleets."
        path="/dpf-cleaning-newton-abbot"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["AutomotiveService", "LocalBusiness"],
        "name": "AutoCleanse",
        "description": "Professional DPF cleaning service collecting from Newton Abbot and South Devon. Based in Totnes, Devon, approximately 8 miles from Newton Abbot.",
        "url": "https://www.auto-cleanse.co.uk/dpf-cleaning-newton-abbot",
        "telephone": "01803 269895",
        "email": "info@auto-cleanse.co.uk",
        "address": { "@type": "PostalAddress", "streetAddress": "The Old Barn Industrial Estate, Webbers Yard Estate", "addressLocality": "Totnes", "addressRegion": "Devon", "postalCode": "TQ9 6JY", "addressCountry": "GB" },
        "geo": { "@type": "GeoCoordinates", "latitude": "50.4316", "longitude": "-3.6844" },
        "areaServed": [{ "@type": "City", "name": "Newton Abbot" }, { "@type": "AdministrativeArea", "name": "Devon" }],
        "priceRange": "££",
        "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00" }]
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'Newton Abbot' }]} />
        </div>
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('DPF Cleaning Near', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Newton Abbot.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              AutoCleanse is your closest professional DPF cleaning specialist to Newton Abbot, our Totnes
              workshop is just 8 miles away. We collect, deep-clean your filter to high flow efficiency, and
              return it, with same-day turnaround available on filters received early.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 reveal-container">
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Truck size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">DPF Collection from Newton Abbot</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Newton Abbot is one of our nearest and busiest service areas. Whether you're an independent garage on the Brunel Industrial Estate, a fleet operator off the A380, or a driver in Kingsteignton or Abbotskerswell, AutoCleanse will collect your blocked DPF, clean it using our METclean XL aqueous process, and return it fully restored.
              </p>
              <p>
                Because our Totnes workshop is only around 8 miles away via the A381, Newton Abbot enjoys some of the fastest turnaround times of anywhere we serve. Filters received before 10am are typically returned the same working day, ideal when a vehicle is off the road and every day counts.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Shield size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Cost of DPF Cleaning vs Replacement in Newton Abbot</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                A replacement DPF for a Newton Abbot driver is commonly quoted at £800 to £2,500, and the part is often a non-OEM aftermarket unit. Professional cleaning with AutoCleanse starts from £210 and keeps your original, vehicle-matched filter, restored to factory performance and supplied with before-and-after flow and weight test data.
              </p>
              <p>
                For local garages and fleets, the saving across multiple vehicles quickly adds up. We offer trade accounts and can fit around your maintenance schedule to keep both cost and downtime to a minimum.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Settings size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">DPF Cleaning for Newton Abbot Fleets & Garages</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Newton Abbot sits at the meeting point of the A380, A381 and A382, making it a natural hub for delivery, trade and agricultural vehicles across South Devon. AutoCleanse supports local garages and fleet operators with professional DPF, DOC and SCR cleaning for vans, HGVs, pickups and plant machinery, all backed by clear pre and post test reporting.
              </p>
              <p>
                We also offer <Link to="/ecu-remapping-newton-abbot" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">ECU remapping in Newton Abbot</Link> for drivers who want to combine a DPF clean with a Stage 1 or Stage 2 performance and economy tune.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Newton Abbot & Surrounding Areas Covered</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-4 text-lg md:text-xl font-medium relative z-10">
              <p>
                We cover Newton Abbot and the surrounding towns and villages including Kingsteignton, Kingskerswell, Abbotskerswell, Bovey Tracey, Chudleigh, Ashburton and Teignmouth. Not sure if we reach you? Call 01803 269895 and we'll confirm straight away.
              </p>
            </div>
          </section>

          {/* Symptoms */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item shadow-xl shadow-black">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">Signs your DPF needs attention</h2>
            <p className="text-white/50 text-sm mb-6">Seeing any of these around Newton Abbot? Get it checked before it gets worse.</p>
            <SymptomList items={SYMPTOMS} />
          </section>

          {/* Why we diagnose first */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Search size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Why we diagnose before cleaning</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                A blocked DPF is often a symptom of something else - a faulty pressure sensor, an EGR fault, or too many short journeys that never complete a regeneration. We check the cause first, so a clean actually lasts rather than blocking again soon after.
              </p>
              <p>
                If the filter turns out to be healthy, we will tell you. For more, see our <Link to="/dpf-diagnostics-devon" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">DPF diagnostics</Link> service, or read about the signs of a <Link to="/blocked-dpf-cleaning-devon" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">blocked DPF</Link>.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">Related Services</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/services', label: 'Full range of filter cleaning services' },
                { to: '/postal-dpf', label: 'Nationwide postal DPF cleaning' },
                { to: '/ecu-remapping-newton-abbot', label: 'ECU remapping in Newton Abbot' },
                { to: '/dpf-cleaning-devon', label: 'DPF cleaning across Devon' },
                { to: '/pricing', label: 'DPF cleaning prices' },
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
            <FaqSection faqs={FAQS} />
          </section>

          <section className="reveal-item">
            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none"></div>
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

          <section className="text-center mt-16 reveal-item">
            <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                DPF Cleaning for <span className="text-[#FF7A00]">Newton Abbot</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Call us or send an enquiry to arrange DPF collection from Newton Abbot. Trade and fleet rates available.
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
};

export default DPFCleaningNewtonAbbot;
