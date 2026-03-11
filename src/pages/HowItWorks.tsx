import { useRef } from 'react';
import SEO from '../components/SEO';
import { Search, Settings, Wind, TestTube, Truck } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const HowItWorks = () => {
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
  const timelineSteps = [
    {
      icon: Search,
      title: 'Pre-test',
      description: 'Comprehensive visual inspection and initial flow testing to assess the filter condition and cleaning requirements.',
    },
    {
      icon: Settings,
      title: 'Cleaning Process',
      description: 'Professional deep-cleaning using the METclean XL with high-pressure water to remove all accumulated soot, ash, and particulates, restoring optimal flow.',
    },
    {
      icon: Wind,
      title: 'Hot Air Drying',
      description: 'Controlled hot-air drying phase after aqueous processes to ensure complete moisture removal and optimal performance.',
    },
    {
      icon: TestTube,
      title: 'Flow Test & Report',
      description: 'Final flow and back-pressure testing with detailed reporting to verify performance restoration and provide documentation.',
    },
    {
      icon: Truck,
      title: 'Return & Refit',
      description: 'Same-day return within 30 miles of Totnes.',
    },
  ];

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="How It Works | The Cleaning Process" description="Discover our 5-step advanced aqueous and pneumatic DPF cleaning process." path="/how-it-works" />

      {/* Background ambient light */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#FF7A00]/5 blur-[120px] rounded-[100%] pointer-events-none"></div>
      <div className="absolute top-[40%] left-0 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('How It', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Works.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-white/50 max-w-4xl mx-auto leading-relaxed font-medium reveal-item">
            Our clear 5-step process puts speed and quality first, ensuring your filters are cleaned,
            tested, and returned with minimal downtime for your operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 reveal-container">
          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="space-y-12">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6 md:space-x-10 group reveal-item">
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#1A1D22] border border-white/10 flex items-center justify-center group-hover:border-[#FF7A00]/50 group-hover:bg-[#FF7A00]/5 transition-all duration-500 z-10 relative group-hover:shadow-[0_0_30px_rgba(255,122,0,0.2)]">
                      <step.icon size={32} className="text-white/70 group-hover:text-[#FF7A00] transition-colors duration-500 md:w-10 md:h-10" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#0A0A0A] border-2 border-[#FF7A00] rounded-full flex items-center justify-center z-20 shadow-[0_0_15px_rgba(255,122,0,0.4)]">
                      <span className="text-[#FF7A00] font-black">{index + 1}</span>
                    </div>

                    {/* Connecting Line */}
                    {index < timelineSteps.length - 1 && (
                      <div className="absolute top-[100px] left-10 md:left-12 w-0.5 h-[calc(100%+24px)] md:h-[calc(100%+32px)] bg-white/5 -translate-x-1/2 overflow-hidden z-0">
                        {/* Animated glowing line fragment inside the border */}
                        <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#FF7A00] to-transparent opacity-0 group-hover:opacity-100 animate-[pulse_2s_ease-in-out_infinite] transition-opacity duration-1000 -translate-y-full group-hover:translate-y-[200%]"></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 relative p-8 md:p-10 rounded-3xl bg-[#1A1D22] border border-white/5 group-hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden mt-2 group-hover:-translate-y-2 shadow-xl shadow-black">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="relative z-10 text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">{step.title}</h3>
                    <p className="relative z-10 text-white/60 leading-relaxed font-medium md:text-lg">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 reveal-item mt-12 lg:mt-0">
            <div className="relative rounded-[2.5rem] p-8 md:p-10 bg-[#1A1D22] border border-white/5 sticky top-32 group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-2xl shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF7A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              {/* Service Area */}
              <div className="text-center relative z-10">
                <div className="w-full mb-8 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#FF7A00]/50 transition-colors duration-500 relative">
                  <div className="absolute inset-0 bg-[#FF7A00]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img
                    src="/image.png"
                    alt="Map showing AutoCleanse's 30-mile service radius covering South Devon, starting from Totnes"
                    className="w-full object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-[#FF7A00] transition-colors">30-mile radius from Totnes</h3>
                <p className="text-white/50 leading-relaxed font-medium">
                  Our local service area covers most of South Devon, ensuring rapid collection and same-day return
                  for filters ready before 10am on weekdays.
                </p>
              </div>

              {/* Service Promise */}
              <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                <p className="text-[#FF7A00] font-mono text-sm text-center uppercase tracking-widest leading-relaxed">
                  We pride ourselves on our service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;