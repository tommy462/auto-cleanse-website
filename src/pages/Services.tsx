import React, { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Settings, Shield, TestTube, Wind, Wrench, Zap, Phone, Mail, ArrowRight } from 'lucide-react';
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

const Services = () => {
  const container = useRef(null);

  useGSAP(() => {
    // Title reveal
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );

    // Staggered lists
    gsap.utils.toArray('.reveal-container').forEach((container: any) => {
      const items = container.querySelectorAll('.reveal-item');
      gsap.fromTo(items,
        { y: 50, opacity: 0 },
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

  const services = [
    {
      icon: Settings,
      title: 'DPF Cleaning',
      description: 'Professional deep clean',
      fullDescription: 'Professional deep-clean, flow-test, and certification for optimal performance and emissions compliance.',
      highlights: ['Safe for modern systems', 'Proven results', 'Rapid turnaround'],
      showLabourNote: true,
    },
    {
      icon: Wrench,
      title: 'SCR Cleaning',
      description: 'Selective Catalytic Reduction',
      fullDescription: 'Careful cleaning for performance and emissions integrity using appropriate media and processes.',
      highlights: ['NOx reduction system cleaning', 'AdBlue system maintenance'],
      showLabourNote: true,
    },
    {
      icon: Shield,
      title: 'DOC Cleaning',
      description: 'Diesel Oxidation Catalyst',
      fullDescription: 'Comprehensive before/after flow and back-pressure checks with detailed reports for your records.',
      highlights: ['Pre and post testing', 'Detailed reporting', 'Performance verification'],
      showLabourNote: false,
    },
    {
      icon: Settings,
      title: 'GPF Cleaning',
      description: 'Gasoline Particulate Filter',
      fullDescription: 'Controlled hot-air drying phase after aqueous processes to ensure complete moisture removal.',
      highlights: ['Controlled temperature', 'Complete drying', 'Quality assurance'],
      showLabourNote: false,
    },
    {
      icon: Wrench,
      title: 'OPF Cleaning',
      description: 'Otto Particulate Filter',
      fullDescription: 'Professional cleaning for Otto Particulate Filters with comprehensive testing.',
      highlights: ['Specialised cleaning', 'Performance testing'],
      showLabourNote: true,
    },
    {
      icon: Settings,
      title: 'EGR Cleaning',
      description: 'Exhaust Gas Recirculation',
      fullDescription: 'EGR valve and system cleaning to restore proper function and reduce emissions.',
      highlights: ['System restoration', 'Emissions compliance'],
      showLabourNote: true,
    },
    {
      icon: Wrench,
      title: 'Intercoolers',
      description: 'Performance optimisation',
      fullDescription: 'Intercooler cleaning and maintenance for optimal engine performance.',
      highlights: ['Performance optimisation', 'Efficiency improvement'],
      showLabourNote: false,
    },
    {
      icon: Shield,
      title: 'Radiators',
      description: 'Cooling system service',
      fullDescription: 'Professional radiator cleaning and cooling system maintenance.',
      highlights: ['Cooling efficiency', 'System maintenance'],
      showLabourNote: false,
    },
    {
      icon: Zap,
      title: 'Catalytic Converters',
      description: 'Emission control cleaning',
      fullDescription: 'Careful cleaning for performance and emissions integrity using appropriate media and processes.',
      highlights: ['Precious metal catalyst cleaning', 'Emission control restoration'],
      showLabourNote: true,
    },
  ];

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="Our Services | DPF, SCR & DOC Cleaning" description="Comprehensive commercial and passenger vehicle DPF cleaning services. Mobile, HQ drop-off, and nationwide postal options." path="/services" />

      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[#FF7A00]/10 blur-[120px] rounded-[100%] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Professional filter refurbishment,', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-2">end-to-end.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-white/60 max-w-4xl mx-auto leading-relaxed font-medium reveal-item">
            From collection to return, we handle every aspect of your filter refurbishment with precision and care.
            Our process guarantees optimal flow and emissions compliance.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-container">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative flex flex-col p-8 sm:p-10 rounded-3xl bg-[#1A1D22] border border-white/5 hover:-translate-y-2 transition-all duration-500 reveal-item cursor-default overflow-hidden shadow-2xl shadow-black hover:shadow-[0_20px_40px_rgba(255,122,0,0.1)] hover:border-[#FF7A00]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Massive background number */}
              <div className="absolute right-4 -top-6 text-[120px] font-black text-white/[0.02] group-hover:text-[#FF7A00]/[0.05] group-hover:scale-110 transition-all duration-700 pointer-events-none select-none">
                0{index + 1}
              </div>

              <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#1A1D22] border border-white/10 flex items-center justify-center mb-8 group-hover:rotate-12 group-hover:border-[#FF7A00] group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500">
                <service.icon size={32} className="text-white group-hover:text-[#FF7A00] transition-colors duration-500" strokeWidth={1.5} />
              </div>

              <h3 className="relative z-10 text-2xl font-bold text-white mb-3 group-hover:text-[#FF7A00] transition-colors duration-500 tracking-tight">{service.title}</h3>
              <p className="relative z-10 text-white/50 text-base font-medium mb-6 flex-grow">{service.fullDescription}</p>

              <ul className="relative z-10 space-y-3 mb-6">
                {service.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start text-white/70 text-sm font-medium">
                    <div className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full mr-3 mt-1.5 shadow-[0_0_10px_rgba(255,122,0,0.5)]"></div>
                    {highlight}
                  </li>
                ))}
              </ul>

              {service.showLabourNote && (
                <div className="relative z-10 mt-auto pt-4 border-t border-white/5 text-xs font-mono text-[#FF7A00]/70 uppercase tracking-wider">
                  Labour / Replacement Not Inc.
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-32 reveal-container">
          <div className="relative rounded-[3rem] p-12 lg:p-16 max-w-4xl mx-auto overflow-hidden group bg-[#1A1D22] border border-white/10 reveal-item hover:border-[#FF7A00]/30 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
            <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-700 bg-[#FF7A00]/20 blur-[100px]"></div>

            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
              <div>
                <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">
                  Ready to optimize your fleet?
                </h3>
                <p className="text-white/60 text-lg font-medium max-w-lg">
                  Reach out today for a consultation or directly book a high-performance filter clean.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                <MagneticButton className="w-full sm:w-auto">
                  <a href="tel:08000430609" className="flex items-center justify-center gap-2 bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 w-full">
                    <Phone size={20} />
                    0800 043 0609
                  </a>
                </MagneticButton>

                <MagneticButton className="w-full sm:w-auto">
                  <a href="mailto:info@autocleanse.co.uk" className="flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 w-full shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]">
                    <Mail size={20} />
                    Email Us
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Related DPF Services */}
        <div className="mt-32 reveal-container">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 reveal-item">
            <div>
              <h3 className="text-3xl font-black text-white tracking-tight">
                Related <span className="text-[#FF7A00]">Services</span>
              </h3>
            </div>
            <div className="hidden md:block w-full max-w-md h-px bg-gradient-to-r from-[#FF7A00]/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-item">
            <Link to="/why-clean" className="group p-8 rounded-3xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-[#FF7A00] mb-2 uppercase tracking-widest">Learn More</div>
                <div className="text-xl font-bold text-white group-hover:text-[#FF7A00] transition-colors">Why Clean Your DPF?</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF7A00]/20 transition-colors">
                <ArrowRight className="text-white/50 group-hover:text-[#FF7A00]" size={20} />
              </div>
            </Link>

            <Link to="/postal-dpf" className="group p-8 rounded-3xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-[#FF7A00] mb-2 uppercase tracking-widest">Nationwide</div>
                <div className="text-xl font-bold text-white group-hover:text-[#FF7A00] transition-colors">Postal DPF Cleaning</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF7A00]/20 transition-colors">
                <ArrowRight className="text-white/50 group-hover:text-[#FF7A00]" size={20} />
              </div>
            </Link>

            <Link to="/maintenance" className="group p-8 rounded-3xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-[#FF7A00] mb-2 uppercase tracking-widest">Prevention</div>
                <div className="text-xl font-bold text-white group-hover:text-[#FF7A00] transition-colors">Maintenance Plans</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF7A00]/20 transition-colors">
                <ArrowRight className="text-white/50 group-hover:text-[#FF7A00]" size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;