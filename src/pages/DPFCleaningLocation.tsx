import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Settings, Shield, Truck, ArrowRight, HelpCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import { getReviews, DPF_TOWN_REVIEW_IDS } from '../data/reviews';
import { DpfLocation, DPF_DIRECTORY } from '../data/dpf-locations';
import { getLocationBySlug } from '../data/remapping-locations';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const sectionIcons = [Truck, Settings];

export default function DPFCleaningLocation({ location }: { location: DpfLocation }) {
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

  const relatedPages = location.relatedSlugs
    .map((slug) => DPF_DIRECTORY.find((d) => d.path === `/${slug}`))
    .filter(Boolean) as typeof DPF_DIRECTORY;

  // Cross-link the matching ECU remapping town page where one exists
  // (e.g. dpf-cleaning-brixham -> ecu-remapping-brixham).
  const ecuTownSlug = `ecu-remapping-${location.slug.replace('dpf-cleaning-', '')}`;
  const ecuTown = getLocationBySlug(ecuTownSlug);

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title={location.metaTitle}
        description={location.metaDescription}
        path={`/${location.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['AutomotiveService', 'LocalBusiness'],
        name: 'AutoCleanse',
        description: `Off-vehicle DPF cleaning service for ${location.name} and ${location.region}. Workshop-based deep cleaning and flow testing, based in Totnes, Devon.`,
        url: `https://www.auto-cleanse.co.uk/${location.slug}`,
        telephone: '01803 269895',
        email: 'info@auto-cleanse.co.uk',
        address: { '@type': 'PostalAddress', streetAddress: 'The Old Barn Industrial Estate, Webbers Yard Estate', addressLocality: 'Totnes', addressRegion: 'Devon', postalCode: 'TQ9 6JY', addressCountry: 'GB' },
        geo: { '@type': 'GeoCoordinates', latitude: '50.4316', longitude: '-3.6844' },
        areaServed: [
          { '@type': 'City', name: location.name },
          ...location.nearbyAreas.map((a) => ({ '@type': 'City', name: a })),
          { '@type': 'AdministrativeArea', name: 'Devon' },
        ],
        serviceType: 'DPF Cleaning',
        priceRange: '££',
        openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '17:00' }],
      })}} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero */}
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText(location.h1Prefix, 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">{location.name}.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              {location.intro}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 reveal-container">

          {/* Unique local sections */}
          {location.sections.map((section, i) => {
            const Icon = sectionIcons[i % sectionIcons.length];
            return (
              <section key={section.heading} className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="flex items-center mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                    <Icon size={28} className="text-[#FF7A00]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">{section.heading}</h2>
                </div>
                <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
                  {section.paragraphs.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Shared: workshop process + pricing (kept compact and honest) */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Shield size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Off-Vehicle Cleaning at Our Totnes Workshop</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Every filter goes through the same documented workshop process: inspection, aqueous deep
                clean, high-pressure pneumatic flush, drying and a back-pressure flow test before and after -
                so you get proof of the result, not just a promise. DPF cleaning is a workshop-based,
                off-vehicle service; it is not something we do at the roadside.
              </p>
              <p>
                Cleaning starts from £210, with UK postal cleaning from £230 and HGV/plant filters quoted
                individually - compared with £500-£2,000+ for a typical replacement. Filters with us before
                10am are often returned the same working day.
              </p>
            </div>
          </section>

          {/* Unique FAQs */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item overflow-hidden shadow-xl shadow-black">
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <HelpCircle size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{location.name} DPF Cleaning FAQs</h2>
            </div>
            <div className="relative z-10 space-y-6 text-white/60 text-lg font-medium leading-relaxed">
              {location.faqs.map((faq) => (
                <div key={faq.q}>
                  <p className="text-white font-bold mb-1">{faq.q}</p>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Nearby areas */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="flex items-center mb-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Areas Near {location.name} We Cover</h2>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2">
              {location.nearbyAreas.map((area) => (
                <span key={area} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium">
                  {area}
                </span>
              ))}
            </div>
          </section>

          {/* DPF services & related towns */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">DPF Services &amp; Booking</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/dpf-cleaning', label: 'DPF cleaning Devon - main hub' },
                { to: '/dpf-diagnostics-devon', label: 'DPF diagnostics - find the cause first' },
                { to: '/blocked-dpf-cleaning-devon', label: 'Blocked DPF? Warning light & limp mode help' },
                { to: '/postal-dpf', label: 'Nationwide postal DPF cleaning' },
                { to: '/pricing', label: 'DPF cleaning prices' },
                { to: '/book', label: 'Book a DPF clean or collection' },
                ...(ecuTown ? [{ to: `/${ecuTownSlug}`, label: `ECU remapping in ${location.name}` }] : []),
                ...relatedPages.map((p) => ({ to: p.path, label: `DPF cleaning ${p.name}` })),
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
                  source={location.slug}
                  heading="Request a DPF Cleaning Callback"
                  subheading="Send your details and we'll call you back about your DPF clean."
                />
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center mt-16 reveal-item">
            <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                DPF Cleaning for <span className="text-[#FF7A00]">{location.name}</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Call or send an enquiry to arrange a collection or drop-off from {location.name}. Trade accounts available.
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
