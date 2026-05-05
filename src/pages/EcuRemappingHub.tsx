import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Zap, Settings2, Car, Truck, Fuel, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import Breadcrumbs from '../components/Breadcrumbs';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const EcuRemappingHub = () => {
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
        title="ECU Remapping Devon | Stage 1 & 2 Tuning | AutoCleanse"
        description="Professional ECU remapping services. We offer Stage 1, Stage 2, Economy and Commercial Van tuning across Devon. Select your vehicle or location to learn more."
        path="/ecu-remapping"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["AutomotiveService", "LocalBusiness"],
        "name": "AutoCleanse",
        "description": "ECU remapping service across Devon. Stage 1 and Stage 2 maps for cars, vans, HGVs and commercial vehicles.",
        "url": "https://www.auto-cleanse.co.uk/ecu-remapping",
        "telephone": "08000430609",
        "email": "info@autocleanse.co.uk",
        "address": { "@type": "PostalAddress", "streetAddress": "The Old Barn Industrial Estate, Webbers Yard Estate", "addressLocality": "Totnes", "addressRegion": "Devon", "postalCode": "TQ9 6JY", "addressCountry": "GB" },
        "geo": { "@type": "GeoCoordinates", "latitude": "50.4316", "longitude": "-3.6844" },
        "serviceType": "ECU Remapping",
        "priceRange": "££"
      })}} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <Breadcrumbs items={[
          { name: 'ECU Remapping' }
        ]} />

        <div className="text-center mb-20 reveal-container">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-6 reveal-item">Performance & Economy</div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Professional ECU', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Remapping.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              Transform your vehicle's performance with our custom-calibrated ECU remaps. 
              Whether you want maximum power, better towing torque, or increased MPG, we have a solution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 reveal-container">
          
          {/* Core Services */}
          <Link to="/stage-1-remaps-devon" className="group p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
            <Zap className="text-[#FF7A00] mb-6" size={32} />
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF7A00] transition-colors">Stage 1 Remapping</h3>
            <p className="text-white/60 mb-6">The perfect balance of power and reliability. No hardware changes required.</p>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform">
              Learn more <ArrowRight size={16} className="ml-2" />
            </div>
          </Link>

          <Link to="/fuel-economy-remaps-devon" className="group p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
            <Fuel className="text-[#FF7A00] mb-6" size={32} />
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF7A00] transition-colors">Economy Remaps</h3>
            <p className="text-white/60 mb-6">Optimised for maximum MPG. Ideal for high-mileage drivers and fleet operators.</p>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform">
              Learn more <ArrowRight size={16} className="ml-2" />
            </div>
          </Link>

          <Link to="/van-remapping-devon" className="group p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
            <Truck className="text-[#FF7A00] mb-6" size={32} />
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF7A00] transition-colors">Van & Commercial</h3>
            <p className="text-white/60 mb-6">Increase torque for heavy payloads and towing, whilst reducing your fuel costs.</p>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform">
              Learn more <ArrowRight size={16} className="ml-2" />
            </div>
          </Link>

          {/* Directory Hubs */}
          <Link to="/vehicle-performance-lookup" className="group md:col-span-2 lg:col-span-1 p-8 rounded-[2rem] bg-[#FF7A00]/10 border border-[#FF7A00]/20 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/15 transition-all duration-300 reveal-item">
            <Zap className="text-[#FF7A00] mb-6" size={32} />
            <h3 className="text-2xl font-bold text-white mb-3">Check My Vehicle</h3>
            <p className="text-white/70 mb-6">Enter your reg plate or search manually to see exact Stage 1 BHP, torque and economy gains for your vehicle.</p>
            <div className="flex items-center text-[#FF7A00] font-bold group-hover:translate-x-2 transition-transform">
              Look Up My Car <ArrowRight size={16} className="ml-2" />
            </div>
          </Link>

          <Link to="/ecu-remapping-locations" className="group md:col-span-2 p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item flex flex-col justify-between">
            <div>
              <MapPin className="text-[#FF7A00] mb-6" size={32} />
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF7A00] transition-colors">Mobile Remapping Locations</h3>
              <p className="text-white/60 mb-6 max-w-lg">We offer a fully mobile remapping service across Devon. Find your nearest town or city to see our local coverage and services.</p>
            </div>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform">
              View All Locations <ArrowRight size={16} className="ml-2" />
            </div>
          </Link>
        </div>

        <section className="text-center mt-16 reveal-item">
          <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
            <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to unlock your <span className="text-[#FF7A00]">engine's potential?</span>
            </h3>
            <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Get in touch to discuss your vehicle and get a tailored remapping quote.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton className="block">
                <a href="tel:08000430609" className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg">
                  <Phone size={24} className="mr-3 text-[#FF7A00]" /> 0800 043 0609
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
  );
};

export default EcuRemappingHub;
