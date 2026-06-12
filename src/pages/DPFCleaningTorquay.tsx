import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Settings, Shield, Truck, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import QuickEnquiryForm from '../components/QuickEnquiryForm';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const DPFCleaningTorquay = () => {
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
        title="DPF Cleaning Torquay | AutoCleanse Devon"
        description="Professional DPF cleaning in Torquay. AutoCleanse collects from Torquay and the English Riviera, deep cleans and returns same day. Trade & fleet welcome."
        path="/dpf-cleaning-torquay"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["AutomotiveService", "LocalBusiness"],
        "name": "AutoCleanse",
        "description": "Professional DPF cleaning service for Torquay, Paignton, Brixham and the English Riviera. Based in Totnes, Devon.",
        "url": "https://www.auto-cleanse.co.uk/dpf-cleaning-torquay",
        "telephone": "01803 269895",
        "email": "info@auto-cleanse.co.uk",
        "address": { "@type": "PostalAddress", "streetAddress": "The Old Barn Industrial Estate, Webbers Yard Estate", "addressLocality": "Totnes", "addressRegion": "Devon", "postalCode": "TQ9 6JY", "addressCountry": "GB" },
        "geo": { "@type": "GeoCoordinates", "latitude": "50.4316", "longitude": "-3.6844" },
        "areaServed": [
          { "@type": "City", "name": "Torquay" }, { "@type": "City", "name": "Paignton" },
          { "@type": "City", "name": "Brixham" }, { "@type": "AdministrativeArea", "name": "Devon" }
        ],
        "priceRange": "££",
        "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00" }]
      })}} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('DPF Cleaning in', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Torquay.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              AutoCleanse provides professional DPF cleaning for Torquay, Paignton, Brixham and the wider Torbay area.
              We collect, deep clean and return - fast, reliable, trade-friendly.
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
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Local DPF Collection - Torquay & Torbay</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Torquay is one of our closest collection areas - just 12 miles from our Totnes workshop. We regularly collect from Torquay, Paignton, Brixham and the surrounding Torbay area. With same-day return for filters received before 10am, we're the most convenient DPF cleaning option for local garages and vehicle owners.
              </p>
              <p>
                Our METclean XL process removes soot, ash and oil contamination from even the most blocked DPFs, restoring them to 98% of original flow capacity with before-and-after test documentation provided.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Shield size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">DPF Cleaning Cost for Torquay Drivers</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                For Torquay-area customers, DPF cleaning with AutoCleanse starts from £210 for vehicles within 10 miles of Totnes - which includes most of the Torbay area. This is a fixed, transparent price with no hidden extras. Nationwide postal cleaning is also available from £230 if you prefer to arrange courier delivery.
              </p>
              <p>
                Compare that to a replacement DPF, which can cost Torquay drivers £600–£2,000+ fitted, often using an aftermarket part that doesn't meet OEM specifications. Professional cleaning is the smarter choice for most blocked filters.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Settings size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Garages & Fleets in Torquay</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Torbay has a busy independent garage sector and a range of fleet operators across tourism, construction and logistics. AutoCleanse supports all of these with trade accounts, fast turnaround and the flexibility to handle multiple filters simultaneously. Our process is fully documented, which is ideal for warranty or insurance records.
              </p>
              <p>
                We also offer <Link to="/remapping" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">ECU remapping</Link> for Torquay-area vehicles seeking a Stage 1 or Stage 2 performance map alongside DPF cleaning.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Areas Near Torquay We Cover</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-4 text-lg md:text-xl font-medium relative z-10">
              <p>As well as Torquay, we regularly cover Paignton, Brixham, Newton Abbot, Totnes, Dartmouth, Kingsbridge, Teignmouth and Dawlish. Call 01803 269895 to confirm collection availability in your area.</p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">Related Services</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/services', label: 'Full range of filter cleaning services' },
                { to: '/dpf-cleaning-paignton', label: 'DPF cleaning Paignton' },
                { to: '/remapping', label: 'ECU remapping - Stage 1 & Stage 2' },
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
            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none"></div>
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

          <section className="text-center mt-16 reveal-item">
            <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                DPF Cleaning for <span className="text-[#FF7A00]">Torquay & Torbay</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Call or send an enquiry to book a DPF collection from Torquay. Trade accounts available.
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

export default DPFCleaningTorquay;
