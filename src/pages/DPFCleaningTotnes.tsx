import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Settings, Shield, Truck, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import { getReviews, DPF_TOWN_REVIEW_IDS } from '../data/reviews';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const DPFCleaningTotnes = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );

    gsap.utils.toArray('.reveal-container').forEach((container: any) => {
      const items = container.querySelectorAll('.reveal-item');
      gsap.fromTo(items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
          }
        }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="DPF Cleaning Totnes | Fast Turnaround | AutoCleanse" description="AutoCleanse DPF cleaning workshop in Totnes, Devon. Fast turnaround, often same-day where possible when the filter is with us before 10am. Cars, vans, HGVs & plant. Trade accounts welcome." path="/dpf-cleaning-totnes" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["AutomotiveService", "LocalBusiness"],
        "name": "Auto-Cleanse",
        "description": "DPF cleaning workshop in Totnes, Devon. Drop off your filter before 10am for same-day return. Serving South Devon and nationwide by post.",
        "url": "https://www.auto-cleanse.co.uk/dpf-cleaning-totnes",
        "telephone": "+441803269895",
        "email": "info@auto-cleanse.co.uk",
        "address": { "@type": "PostalAddress", "streetAddress": "The Old Barn Industrial Estate, Webbers Yard", "addressLocality": "Totnes", "addressRegion": "Devon", "postalCode": "TQ9 6JY", "addressCountry": "GB" },
        "geo": { "@type": "GeoCoordinates", "latitude": "50.4316", "longitude": "-3.6844" },
        "areaServed": [{ "@type": "City", "name": "Totnes" }, { "@type": "AdministrativeArea", "name": "Devon" }],
        "priceRange": "££",
        "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "17:00" }]
      })}} />

      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('DPF Cleaning in', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Totnes.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>

          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              Totnes is home for us - our DPF cleaning workshop is here at The Old Barn Industrial Estate,
              so if you are local it is the easiest place to drop your filter off in person. We deep clean
              off the vehicle for cars, vans, HGVs and plant, with same-day return where possible for
              filters received before 10am.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 reveal-container">
          {/* Professional Off-Vehicle DPF Cleaning */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Settings size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Professional Off-Vehicle DPF Cleaning</h2>
            </div>

            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Off-vehicle DPF cleaning involves removing the diesel particulate filter from your vehicle
                for comprehensive cleaning using professional equipment. This process allows for thorough
                cleaning that cannot be achieved through on-vehicle regeneration or additives.
              </p>
              <p>
                Our service is suitable for all vehicle types including cars, vans, HGVs, and fleet vehicles.
                Professional cleaning maintains emissions compliance and ensures your vehicle will pass MOT
                emissions tests, as the original filter specifications and performance characteristics are preserved.
              </p>
            </div>
          </section>

          {/* Cost-Effective Alternative */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Shield size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Cost-Effective Alternative to DPF Replacement</h2>
            </div>

            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Professional DPF cleaning is often preferable to replacement because original equipment
                manufacturer (OEM) filters are designed to be cleaned and reused. Most DPF issues are
                caused by blockages rather than structural failure, making cleaning the appropriate solution.
              </p>
              <p>
                DPF cleaning at our Totnes workshop starts from £210, with UK-wide postal DPF cleaning
                from £230 - transparent, fixed pricing and no hidden costs. Collection and return may vary
                depending on location and availability. Compared with a replacement filter at £500-£2,000+ fitted,
                a professional clean restores your existing DPF to optimal flow while preserving all original
                calibrations and sensor compatibility.
              </p>
            </div>
          </section>

          {/* Trusted by Various Customers */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Truck size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Trusted by Garages, Fleets and the Public</h2>
            </div>

            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Our DPF cleaning service is trusted by independent garages, fleet operators, and individual
                vehicle owners throughout the Totnes area. We understand the importance of reliable service
                and quick turnaround times for businesses that depend on their vehicles.
              </p>
              <p>
                Fast turnaround - often same-day within 30 miles of Totnes when the filter is with us
                before 10am - keeps disruption to a minimum, whether you're managing a single vehicle or an entire fleet.
              </p>
            </div>
          </section>

          {/* Nationwide Service */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Nationwide Postal DPF Cleaning Available</h2>
            </div>

            <div className="text-white/60 leading-relaxed text-lg md:text-xl font-medium relative z-10">
              <p>
                For customers outside our local service area, we offer comprehensive nationwide postal
                DPF cleaning with tracked next-day return. This service provides the same professional
                cleaning standards we deliver locally in Totnes, extending our expertise across the UK.
              </p>
            </div>
          </section>

          {/* Totnes DPF FAQs */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item overflow-hidden shadow-xl shadow-black">
            <h2 className="relative z-10 text-2xl md:text-3xl font-bold text-white mb-8 tracking-tight">Totnes DPF Cleaning FAQs</h2>
            <div className="relative z-10 space-y-6 text-white/60 text-lg font-medium leading-relaxed">
              <div>
                <p className="text-white font-bold mb-1">Where do I drop my DPF off in Totnes?</p>
                <p>Our workshop is at The Old Barn Industrial Estate, Webbers Yard, Totnes TQ9. Call ahead on 01803 269895 so we can have the bench ready. Filters dropped before 10am are usually returned the same working day.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-1">How much does DPF cleaning cost?</p>
                <p>DPF cleaning starts from £210, with nationwide postal DPF cleaning from £230. Collection and return may vary depending on location and availability. It is a fixed price with before-and-after flow testing included - no hidden extras.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-1">Is the DPF cleaned on or off the vehicle?</p>
                <p>Off the vehicle. The filter is removed and deep cleaned on our workshop equipment, which is far more effective than an in-car regen or additive. It is a workshop service - we do not clean DPFs at the roadside.</p>
              </div>
            </div>
          </section>

          {/* DPF services & booking links */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">DPF Services & Booking</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/dpf-cleaning', label: 'DPF cleaning Devon - main hub' },
                { to: '/dpf-diagnostics-devon', label: 'DPF diagnostics - find the cause first' },
                { to: '/blocked-dpf-cleaning-devon', label: 'Blocked DPF? Warning light & limp mode help' },
                { to: '/postal-dpf', label: 'Nationwide postal DPF cleaning' },
                { to: '/pricing', label: 'DPF cleaning prices' },
                { to: '/book', label: 'Book a DPF clean' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all group/link"
                >
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
                  source="dpf-cleaning-totnes"
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
                Contact AutoCleanse for DPF Cleaning <span className="text-[#FF7A00]">in Totnes</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Get in touch to discuss your DPF cleaning requirements or arrange collection from the Totnes area.
              </p>

              <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
                <MagneticButton className="block">
                  <a
                    href="tel:01803269895"
                    className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg"
                  >
                    <Phone size={24} className="mr-3 text-[#FF7A00]" />
                    01803 269895
                  </a>
                </MagneticButton>
                <MagneticButton className="block">
                  <a
                    href="mailto:info@auto-cleanse.co.uk"
                    className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg"
                  >
                    <Mail size={24} className="mr-3" />
                    Send enquiry
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

export default DPFCleaningTotnes;