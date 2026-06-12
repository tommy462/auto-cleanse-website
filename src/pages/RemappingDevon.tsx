import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Zap, BarChart3, Settings2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const RemappingDevon = () => {
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
        title="ECU Remapping Devon | Stage 1 & 2 Maps"
        description="Professional ECU remapping across Devon - Exeter, Plymouth, Torquay, Newton Abbot & beyond. Stage 1, Stage 2 and custom maps. Based in Totnes, South Devon."
        path="/remapping-devon"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["AutomotiveService", "LocalBusiness"],
        "name": "AutoCleanse",
        "description": "ECU remapping service across Devon. Stage 1 and Stage 2 maps for cars, vans, HGVs and commercial vehicles. Based in Totnes, South Devon.",
        "url": "https://www.auto-cleanse.co.uk/remapping-devon",
        "telephone": "01803 269895",
        "email": "info@auto-cleanse.co.uk",
        "address": { "@type": "PostalAddress", "streetAddress": "The Old Barn Industrial Estate, Webbers Yard Estate", "addressLocality": "Totnes", "addressRegion": "Devon", "postalCode": "TQ9 6JY", "addressCountry": "GB" },
        "geo": { "@type": "GeoCoordinates", "latitude": "50.4316", "longitude": "-3.6844" },
        "areaServed": [
          { "@type": "City", "name": "Exeter" }, { "@type": "City", "name": "Plymouth" },
          { "@type": "City", "name": "Torquay" }, { "@type": "City", "name": "Paignton" },
          { "@type": "City", "name": "Newton Abbot" }, { "@type": "City", "name": "Totnes" },
          { "@type": "AdministrativeArea", "name": "Devon" }
        ],
        "serviceType": "ECU Remapping",
        "priceRange": "££",
        "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00" }],
        "sameAs": ["https://www.facebook.com/profile.php?id=61573744325360"]
      })}} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 reveal-container">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-6 reveal-item">Performance Tuning - Devon</div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('ECU Remapping', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Devon.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              AutoCleanse provides Stage 1 and Stage 2 ECU remapping across Devon, operating from our Totnes workshop.
              More power, improved fuel economy, sharper throttle response - safely calibrated for your vehicle.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 reveal-container">
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Zap size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Stage 1 Remapping for Devon Drivers</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                A Stage 1 remap is the most popular choice for Devon drivers - no hardware changes required, road-legal, and immediately noticeable. We recalibrate your engine's fuelling, boost, ignition and torque curves to unlock performance that manufacturers deliberately restrict from the factory map.
              </p>
              <p>
                Typical gains on a diesel car or van include 20–50bhp and 40–80Nm of torque, alongside improved fuel economy at motorway speeds. Every map is written specifically for your make, model, engine variant and current mileage - not a generic flash file.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Settings2 size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Stage 2 & Custom Maps - Devon</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Stage 2 remapping is designed for vehicles that already have hardware upgrades - an uprated intercooler, performance exhaust, or modified intake. Our Stage 2 maps are calibrated to match your specific hardware, safely extracting maximum gains within your engine's mechanical limits.
              </p>
              <p>
                We also produce custom maps for agricultural machinery, commercial vehicles, and fleet operators across Devon who need an economy-biased map rather than a power-focused one. If you have specific requirements - towing, payload, fuel economy targets - we can calibrate to meet them.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <BarChart3 size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Is Remapping Worth It in Devon?</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                For Devon drivers covering rural A-roads, dual carriageways and motorways, a Stage 1 remap can make a noticeable difference to everyday driving. Better throttle response on overtakes, less gear-changing on hills, and improved MPG on longer runs between towns are all commonly reported after a remap.
              </p>
              <p>
                Fleet operators running vans or light commercials across the South West often find that economy-biased remaps reduce fuel spend meaningfully across their vehicles - especially when combined with a DPF clean to ensure the engine is breathing freely.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Devon Areas We Cover for Remapping</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-4 text-lg md:text-xl font-medium relative z-10">
              <p>
                We offer ECU remapping across Devon including Exeter, Plymouth, Torquay, Paignton, Newton Abbot, Totnes, Dartmouth, Kingsbridge, Tavistock, Barnstaple, Tiverton and surrounding areas. Contact us to confirm availability and book a consultation.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">Related Services</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/remapping', label: 'ECU remapping - full service overview' },
                { to: '/remapping-booking', label: 'Book a remap consultation' },
                { to: '/services', label: 'DPF, SCR & filter cleaning services' },
                { to: '/dpf-cleaning-devon', label: 'DPF cleaning across Devon' },
                { to: '/pricing', label: 'Service pricing' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all group/link">
                  <ArrowRight size={20} className="text-[#FF7A00] mr-4 group-hover/link:translate-x-2 transition-transform" />
                  <span className="font-medium text-lg">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="text-center mt-16 reveal-item">
            <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Book an ECU Remap <span className="text-[#FF7A00]">in Devon</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Call us to discuss your vehicle and get a remap quote, or submit an enquiry online for a same-day response.
              </p>
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
                <MagneticButton className="block">
                  <a href="tel:01803269895" className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg">
                    <Phone size={24} className="mr-3 text-[#FF7A00]" /> 01803 269895
                  </a>
                </MagneticButton>
                <MagneticButton className="block">
                  <Link to="/remapping-booking" className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg">
                    <Mail size={24} className="mr-3" /> Book a Remap
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RemappingDevon;
