import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Breadcrumbs from '../components/Breadcrumbs';
import { REMAP_LOCATIONS } from '../data/remapping-locations';

gsap.registerPlugin(ScrollTrigger);

const RemappingLocationsHub = () => {
  const container = useRef(null);

  // Group locations by region
  const locationsByRegion = REMAP_LOCATIONS.reduce((acc, location) => {
    if (!acc[location.region]) {
      acc[location.region] = [];
    }
    acc[location.region].push(location);
    return acc;
  }, {} as Record<string, typeof REMAP_LOCATIONS>);

  useGSAP(() => {
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
        title="Mobile ECU Remapping Locations in Devon | AutoCleanse"
        description="Find our ECU remapping coverage areas across Devon. We offer mobile Stage 1 and Stage 2 tuning in Plymouth, Exeter, Torquay, Newton Abbot and more."
        path="/ecu-remapping-locations"
      />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <Breadcrumbs items={[
          { name: 'ECU Remapping', path: '/ecu-remapping' },
          { name: 'Locations' }
        ]} />

        <div className="mb-16 reveal-container">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4 reveal-item">Coverage Area</div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 reveal-item">
            Remapping Locations
          </h1>
          <p className="text-xl text-white/50 max-w-2xl reveal-item">
            AutoCleanse provides a fully mobile ECU remapping service across Devon. 
            Select your nearest town or city below to see our local services.
          </p>
        </div>

        <div className="space-y-16 reveal-container">
          {Object.entries(locationsByRegion).map(([region, locations]) => (
            <div key={region} className="reveal-item">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center">
                <MapPin className="text-[#FF7A00] mr-3" size={24} />
                {region}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {locations.map((loc) => (
                  <Link 
                    key={loc.slug} 
                    to={`/${loc.slug}`}
                    className="p-6 rounded-2xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 hover:bg-white/5 transition-all group flex items-center justify-between"
                  >
                    <span className="font-bold text-lg text-white/90 group-hover:text-white transition-colors">
                      {loc.name}
                    </span>
                    <ArrowRight size={18} className="text-[#FF7A00] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RemappingLocationsHub;
