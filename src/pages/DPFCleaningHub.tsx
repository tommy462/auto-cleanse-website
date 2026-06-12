import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Settings, Package, Shield, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';

gsap.registerPlugin(ScrollTrigger);

const locations = [
  { name: 'Devon', path: '/dpf-cleaning-devon', note: 'Full county coverage' },
  { name: 'Exeter', path: '/dpf-cleaning-exeter', note: 'East Devon' },
  { name: 'Plymouth', path: '/dpf-cleaning-plymouth', note: 'South West Devon' },
  { name: 'Torquay', path: '/dpf-cleaning-torquay', note: 'Torbay' },
  { name: 'Paignton', path: '/dpf-cleaning-paignton', note: 'Torbay' },
  { name: 'Totnes', path: '/dpf-cleaning-totnes', note: 'Our workshop base' },
];

const DPFCleaningHub = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.utils.toArray('.reveal-container').forEach((c: any) => {
      const items = c.querySelectorAll('.reveal-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: c, start: 'top 85%' },
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="DPF Cleaning Devon | Professional DPF Clean | AutoCleanse"
        description="Professional DPF cleaning in Devon. Workshop in Totnes with local collection, UK-wide postal DPF cleaning, and same-day return where possible. Cars, vans and commercials."
        path="/dpf-cleaning"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['AutomotiveService', 'LocalBusiness'],
        'name': 'AutoCleanse',
        'description': 'Professional DPF cleaning service in Devon. Workshop drop-off, local collection, and UK-wide postal DPF cleaning.',
        'url': 'https://www.auto-cleanse.co.uk/dpf-cleaning',
        'telephone': '01803 269895',
        'email': 'info@auto-cleanse.co.uk',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'The Old Barn Industrial Estate, Webbers Yard Estate',
          'addressLocality': 'Totnes',
          'addressRegion': 'Devon',
          'postalCode': 'TQ9 6JY',
          'addressCountry': 'GB',
        },
        'geo': { '@type': 'GeoCoordinates', 'latitude': '50.4316', 'longitude': '-3.6844' },
        'serviceType': 'DPF Cleaning',
        'priceRange': '££',
        'openingHoursSpecification': [{
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '08:00',
          'closes': '17:00',
        }],
        'sameAs': ['https://www.facebook.com/profile.php?id=61573744325360'],
      })}} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[{ name: 'DPF Cleaning' }]} />

        {/* Hero */}
        <div className="text-center mb-12 md:mb-20 reveal-container">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4 reveal-item">
            Filter Restoration Service
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-5 md:mb-8 leading-[1.1] drop-shadow-2xl reveal-item">
            Professional DPF Cleaning <span className="text-[#FF7A00] font-mono">Devon.</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-6 rounded-full" />
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-base md:text-xl lg:text-2xl text-white/50 leading-relaxed font-medium">
              AutoCleanse provides professional DPF cleaning from our Totnes workshop.
              Workshop drop-off, local collection across Devon, and UK-wide postal DPF cleaning —
              all with detailed reporting and same-day return where possible.
            </p>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 reveal-container">

          <Link to="/how-it-works" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
            <Settings className="text-[#FF7A00] mb-4 md:mb-6" size={28} />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-[#FF7A00] transition-colors">How DPF Cleaning Works</h3>
            <p className="text-white/60 text-sm md:text-base mb-4 md:mb-6">Our professional cleaning process restores your filter to near-new flow rates — without costly replacement.</p>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
              See the process <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>

          <Link to="/postal-dpf" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#FF7A00]/10 border border-[#FF7A00]/20 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/15 transition-all duration-300 reveal-item">
            <Package className="text-[#FF7A00] mb-4 md:mb-6" size={28} />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Postal DPF Cleaning</h3>
            <p className="text-white/70 text-sm md:text-base mb-4 md:mb-6">UK-wide service — remove your DPF, send it to us, and we return it cleaned next working day.</p>
            <div className="flex items-center text-[#FF7A00] font-bold group-hover:translate-x-2 transition-transform text-sm">
              Book postal clean <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>

          <Link to="/why-clean" className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item">
            <Shield className="text-[#FF7A00] mb-4 md:mb-6" size={28} />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-[#FF7A00] transition-colors">Why Clean vs Replace?</h3>
            <p className="text-white/60 text-sm md:text-base mb-4 md:mb-6">Professional cleaning costs a fraction of a new filter and keeps your vehicle's OEM specifications intact.</p>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform text-sm">
              Learn more <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>

          <Link to="/dpf-cleaning-devon" className="group md:col-span-2 lg:col-span-3 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div>
              <MapPin className="text-[#FF7A00] mb-3 md:mb-4" size={28} />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">DPF Cleaning Across Devon</h3>
              <p className="text-white/60 text-sm md:text-base max-w-2xl">We collect and return across Devon with our local collection service — or drop your DPF directly to our Totnes workshop.</p>
            </div>
            <div className="flex items-center text-[#FF7A00] font-medium group-hover:translate-x-2 transition-transform shrink-0 text-sm">
              Devon coverage <ArrowRight size={14} className="ml-2" />
            </div>
          </Link>

        </div>

        {/* Location sub-pages */}
        <section className="mb-12 md:mb-16 reveal-container">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 reveal-item">DPF Cleaning by Location</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {locations.map((loc) => (
              <Link
                key={loc.path}
                to={loc.path}
                className="group p-4 md:p-6 rounded-xl md:rounded-2xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white group-hover:text-[#FF7A00] transition-colors">{loc.name}</span>
                  <ArrowRight size={14} className="text-[#FF7A00] group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-white/50 text-sm">{loc.note}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick enquiry */}
        <section className="mb-12 md:mb-16 reveal-container">
          <div className="max-w-3xl mx-auto relative p-8 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden reveal-item">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none"></div>
            <div className="relative z-10">
              <QuickEnquiryForm
                defaultService="DPF Cleaning"
                source="dpf-cleaning"
                heading="Request a DPF Cleaning Callback"
                subheading="Send your details and we'll call you back about your DPF clean."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mt-12 md:mt-16 reveal-item">
          <div className="relative p-8 md:p-12 lg:p-16 rounded-[2rem] lg:rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            <h3 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Book your DPF clean <span className="text-[#FF7A00]">today.</span>
            </h3>
            <p className="relative z-10 text-white/60 text-base md:text-lg font-medium mb-7 md:mb-10 max-w-2xl mx-auto">
              Call us to discuss your DPF requirements, or send an email and we will get back to you quickly.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <MagneticButton className="block">
                <a href="tel:01803269895" className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all flex items-center justify-center text-base sm:text-lg">
                  <Phone size={20} className="mr-3 text-[#FF7A00]" />
                  01803 269895
                </a>
              </MagneticButton>
              <MagneticButton className="block">
                <Link to="/postal-dpf" className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-base sm:text-lg">
                  <Mail size={20} className="mr-3" />
                  Book a DPF Clean
                </Link>
              </MagneticButton>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DPFCleaningHub;
