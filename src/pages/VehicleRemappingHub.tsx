import { useRef, useMemo } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Car, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Breadcrumbs from '../components/Breadcrumbs';
import { VEHICLE_REMAPS } from '../data/vehicle-remapping';

gsap.registerPlugin(ScrollTrigger);

const VehicleRemappingHub = () => {
  const container = useRef(null);

  // Group vehicles by manufacturer
  const vehiclesByMake = useMemo(() => {
    return VEHICLE_REMAPS.reduce((acc, vehicle) => {
      if (!acc[vehicle.make]) {
        acc[vehicle.make] = [];
      }
      acc[vehicle.make].push(vehicle);
      return acc;
    }, {} as Record<string, typeof VEHICLE_REMAPS>);
  }, []);

  // Sort manufacturers alphabetically
  const sortedMakes = Object.keys(vehiclesByMake).sort();

  useGSAP(() => {
    gsap.utils.toArray('.reveal-container').forEach((container: any) => {
      const items = container.querySelectorAll('.reveal-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out',
        scrollTrigger: { trigger: container, start: 'top 90%' }
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Vehicle Remapping Database | AutoCleanse"
        description="Select your make and model to see exact Stage 1 power, torque and MPG gains. We map Audi, BMW, VW, Ford, Mercedes and more."
        path="/vehicle-remapping"
      />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <Breadcrumbs items={[
          { name: 'ECU Remapping', path: '/ecu-remapping' },
          { name: 'Vehicles' }
        ]} />

        <div className="mb-16 reveal-container">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4 reveal-item">Performance Database</div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 reveal-item">
            Vehicle Remapping
          </h1>
          <p className="text-xl text-white/50 max-w-2xl reveal-item">
            Select your manufacturer below to find your specific model and view the expected performance and economy gains from our Stage 1 remaps.
          </p>
        </div>

        <div className="space-y-16 reveal-container">
          {sortedMakes.map((make) => (
            <div key={make} className="reveal-item">
              <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center">
                <Car className="text-[#FF7A00] mr-4" size={28} />
                {make}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vehiclesByMake[make].map((vehicle) => (
                  <Link 
                    key={vehicle.slug} 
                    to={`/${vehicle.slug}`}
                    className="p-6 rounded-2xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 hover:bg-white/5 transition-all group flex flex-col justify-between h-full"
                  >
                    <div>
                      <h3 className="font-bold text-xl text-white/90 group-hover:text-white transition-colors mb-2">
                        {vehicle.model}
                      </h3>
                      <p className="text-sm text-white/40 mb-4 capitalize">
                        {vehicle.fuelType} / {vehicle.category}
                      </p>
                    </div>
                    <div className="flex items-center text-[#FF7A00] text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                      View Gains <ArrowRight size={14} className="ml-1" />
                    </div>
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

export default VehicleRemappingHub;
