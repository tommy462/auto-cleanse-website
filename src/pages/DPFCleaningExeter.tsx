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

const DPFCleaningExeter = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );
    gsap.utils.toArray('.reveal-container').forEach((container: any) => {
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
        title="DPF Cleaning Exeter | AutoCleanse Devon"
        description="Professional DPF cleaning near Exeter. AutoCleanse collects from Exeter, deep cleans your DPF and returns it same day. Trade garages and fleets welcome."
        path="/dpf-cleaning-exeter"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["AutomotiveService", "LocalBusiness"],
        "name": "Auto-Cleanse",
        "description": "Professional DPF cleaning service collecting from Exeter and across Devon. Based in Totnes, Devon.",
        "url": "https://www.auto-cleanse.co.uk/dpf-cleaning-exeter",
        "telephone": "+441803269895",
        "email": "info@auto-cleanse.co.uk",
        "address": { "@type": "PostalAddress", "streetAddress": "The Old Barn Industrial Estate, Webbers Yard", "addressLocality": "Totnes", "addressRegion": "Devon", "postalCode": "TQ9 6JY", "addressCountry": "GB" },
        "geo": { "@type": "GeoCoordinates", "latitude": "50.4316", "longitude": "-3.6844" },
        "areaServed": [{ "@type": "City", "name": "Exeter" }, { "@type": "AdministrativeArea", "name": "Devon" }],
        "priceRange": "££",
        "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00" }]
      })}} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('DPF Cleaning Near', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Exeter.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              AutoCleanse provides professional DPF cleaning for Exeter drivers, garages and fleet operators.
              We collect from Exeter, deep clean your filter at our Totnes workshop, and return it - often the same day.
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
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">DPF Collection from Exeter</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Exeter is within our regular collection route, making professional DPF cleaning fast and convenient for Exeter-based garages, fleet operators and individual vehicle owners. We collect your filter, transport it to our Totnes workshop, and complete a full deep clean using our METclean XL system - restoring it to 98% of original flow capacity.
              </p>
              <p>
                For Exeter customers who prefer to drop off directly, our workshop at The Old Barn Industrial Estate, Totnes is a straightforward drive down the A38. Filters dropped off before 10am are typically returned the same working day.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Shield size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">DPF Cleaning vs Replacement - Exeter</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                A replacement DPF can cost Exeter drivers anywhere from £500 to over £2,000 fitted - and many aftermarket units don't match OEM performance. Professional DPF cleaning by AutoCleanse starts from £210, with nationwide postal DPF cleaning from £230, and restores the original filter to factory specification, including full flow testing and a detailed report. Collection and return may vary depending on location and availability.
              </p>
              <p>
                For Exeter garages managing customer vehicles, our trade-friendly process minimises downtime and provides a cost-effective, documented solution that keeps vehicles on the road and customers satisfied.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Settings size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Signs Your DPF Needs Cleaning</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-4 text-lg md:text-xl font-medium relative z-10">
              <p>Common signs Exeter drivers notice before a DPF clean:</p>
              <ul className="space-y-3">
                {['DPF warning light on the dashboard', 'Vehicle entering limp mode', 'Reduced power and sluggish acceleration', 'Increased fuel consumption', 'Excessive black smoke from the exhaust', 'Failed or borderline MOT emissions test'].map((sign) => (
                  <li key={sign} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full mt-2.5 shrink-0 shadow-[0_0_8px_rgba(255,122,0,0.5)]"></div>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Also Covering Exeter Surroundings</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-4 text-lg md:text-xl font-medium relative z-10">
              <p>
                As well as Exeter itself, we regularly collect from Exmouth, Topsham, Crediton, Honiton, Sidmouth and the wider East Devon area. If you're not sure whether we cover your location, call us on 01803 269895 - we'll confirm quickly.
              </p>
              <p>
                We also offer <Link to="/ecu-remapping" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">ECU remapping</Link> for Exeter drivers looking to improve performance or fuel economy alongside their DPF service.
              </p>
            </div>
          </section>

          {/* Exeter DPF FAQs */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item overflow-hidden shadow-xl shadow-black">
            <h2 className="relative z-10 text-2xl md:text-3xl font-bold text-white mb-8 tracking-tight">Exeter DPF Cleaning FAQs</h2>
            <div className="relative z-10 space-y-6 text-white/60 text-lg font-medium leading-relaxed">
              <div>
                <p className="text-white font-bold mb-1">How does collection from Exeter work?</p>
                <p>Exeter sits on our regular collection route. We arrange to collect your removed filter, deep clean it at our Totnes workshop and return it - often the same working day for filters received before 10am. Exmouth, Topsham, Crediton and the wider East Devon area are covered too.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-1">Can I just drop the filter off myself?</p>
                <p>Yes. Our workshop at The Old Barn Industrial Estate, Totnes is a straightforward 30-35 minute drive from Exeter down the A38. Filters dropped before 10am are typically ready the same day.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-1">Do you diagnose why the DPF blocked?</p>
                <p>We can. A blocked DPF is often a symptom of another fault, so where needed we recommend our DPF diagnostics before cleaning to make sure the problem does not simply return. Diagnostics are a paid service, not a free check.</p>
              </div>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">Related Services</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/dpf-cleaning', label: 'DPF cleaning Devon - main hub' },
                { to: '/dpf-diagnostics-devon', label: 'DPF diagnostics - find the cause first' },
                { to: '/blocked-dpf-cleaning-devon', label: 'Blocked DPF? Warning light & limp mode help' },
                { to: '/postal-dpf', label: 'Nationwide postal DPF cleaning' },
                { to: '/ecu-remapping', label: 'ECU remapping - Stage 1 & Stage 2' },
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
                  source="dpf-cleaning-exeter"
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
                DPF Cleaning for <span className="text-[#FF7A00]">Exeter</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Call us or send an enquiry to arrange collection from Exeter. Trade accounts and fleet rates available.
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

export default DPFCleaningExeter;
