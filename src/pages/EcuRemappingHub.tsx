import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Zap, Truck, ArrowRight, Cpu } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import Breadcrumbs from '../components/Breadcrumbs';
import RemapPortfolio from '../components/RemapPortfolio';
import Reviews from '../components/Reviews';
import { getReviews, ECU_REVIEW_IDS } from '../data/reviews';

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
    <div ref={container} className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
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
        "telephone": "01803269895",
        "email": "info@auto-cleanse.co.uk",
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

        <div className="text-center mb-12 md:mb-20 reveal-container">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4 reveal-item">Performance & Economy</div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-5 md:mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Professional ECU', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Remapping.</span>
            </span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-6 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-base md:text-xl lg:text-2xl text-white/50 leading-relaxed font-medium">
              Transform your vehicle's performance with our custom-calibrated ECU remaps.
              Whether you want maximum power, better towing torque, or increased MPG, we have a solution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 reveal-container">

          {/* Core Services - 3 equal columns on lg */}
          <Link to="/stage-1-remaps-devon" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
            <Zap className="text-[#FF7A00] mb-4 md:mb-6" size={28} />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-[#FF7A00] transition-colors">Stage 1 Remapping</h3>
            <p className="text-white/60 text-sm md:text-base mb-4 md:mb-6">The perfect balance of power and reliability. No hardware changes required.</p>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
              Learn more <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>

          <Link to="/van-remapping-devon" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
            <Truck className="text-[#FF7A00] mb-4 md:mb-6" size={28} />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-[#FF7A00] transition-colors">Van & Commercial</h3>
            <p className="text-white/60 text-sm md:text-base mb-4 md:mb-6">Increase torque for heavy payloads and towing, whilst reducing your fuel costs.</p>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
              Learn more <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>

          {/* ECU Cloning */}
          <Link to="/ecu-cloning" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
            <Cpu className="text-[#FF7A00] mb-4 md:mb-6" size={28} />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-[#FF7A00] transition-colors">ECU Cloning</h3>
            <p className="text-white/60 text-sm md:text-base mb-4 md:mb-6">Faulty or incompatible donor ECU? We clone your original image — VIN, immobiliser and tune preserved.</p>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
              Learn more <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>

          {/* Check My Vehicle - highlighted card */}
          <Link to="/vehicle-performance-lookup" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#FF7A00]/10 border border-[#FF7A00]/20 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/15 transition-all duration-300 reveal-item">
            <Zap className="text-[#FF7A00] mb-4 md:mb-6" size={28} />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Check My Vehicle</h3>
            <p className="text-white/70 text-sm md:text-base mb-4 md:mb-6">Enter your reg plate or search manually to see exact Stage 1 BHP, torque and economy gains for your vehicle.</p>
            <div className="flex items-center text-[#FF7A00] font-bold group-hover:translate-x-2 transition-transform text-sm">
              Look Up My Car <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>

          {/* Locations - spans remaining columns */}
          <Link to="/ecu-remapping-locations" className="group md:col-span-2 lg:col-span-3 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div>
              <MapPin className="text-[#FF7A00] mb-3 md:mb-4" size={28} />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">Mobile Remapping Locations</h3>
              <p className="text-white/60 text-sm md:text-base max-w-2xl">We offer a fully mobile remapping service across Devon. Find your nearest town or city to see our local coverage and services.</p>
            </div>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform shrink-0 text-sm">
              View All Locations <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>
        </div>

        <RemapPortfolio />

        {/* Reviews */}
        <section className="mb-12 md:mb-16 reveal-container">
          <Reviews
            reviews={getReviews(ECU_REVIEW_IDS)}
            heading={<><span className="text-white">Remapping </span><span className="text-[#FF7A00]">Reviews</span></>}
            intro="What Devon drivers say after a remap with Auto-Cleanse."
            columns={3}
            showGoogleCta
            showCallCta
          />
        </section>

        <section className="text-center mt-12 md:mt-16 reveal-item">
          <div className="relative p-8 md:p-12 lg:p-16 rounded-[2rem] lg:rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
            <h3 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Ready to unlock your <span className="text-[#FF7A00]">engine's potential?</span>
            </h3>
            <p className="relative z-10 text-white/60 text-base md:text-lg font-medium mb-7 md:mb-10 max-w-2xl mx-auto">
              Get in touch to discuss your vehicle and get a tailored remapping quote.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <MagneticButton className="block">
                <a href="tel:01803269895" className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all flex items-center justify-center text-base sm:text-lg">
                  <Phone size={20} className="mr-3 text-[#FF7A00]" /> 01803 269895
                </a>
              </MagneticButton>
              <MagneticButton className="block">
                <Link to="/remapping-booking" className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-base sm:text-lg">
                  <Mail size={20} className="mr-3" /> Book a Remap
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
