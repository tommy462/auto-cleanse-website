import { useRef } from 'react';
import SEO from '../components/SEO';
import { Shield, Zap } from 'lucide-react';
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

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Service',
      description: 'We pride ourselves on our service, delivering consistent quality and reliability that trade professionals can depend on.',
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Clear pricing, honest communication, and detailed reporting ensure you always know exactly what you\'re getting.',
    },
    {
      icon: Zap,
      title: 'Speed',
      description: 'Same-day turnaround within 30 miles of Totnes when collected before 10am, minimising your vehicle downtime.',
    },
  ];

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

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="About Us | DPF Experts" description="Learn about AutoCleanse, the leading DPF, SCR, and DOC cleaning specialists based in Devon." path="/about" />
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('About', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">AutoCleanse</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 reveal-container">
          {/* Story */}
          <div className="reveal-item">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">
              Your local, reliable, <br />
              <span className="text-[#FF7A00] font-mono">trade-friendly</span> partner
            </h2>
            <div className="space-y-6 text-white/60 text-lg font-medium leading-relaxed">
              <p>
                Based in Totnes, Devon, AutoCleanse has established itself as the go-to specialist for
                DPF refurbishment services across South Devon and beyond. We understand the challenges
                faced by trade garages, fleet operators, and plant machinery businesses when dealing
                with blocked filters and the associated downtime.
              </p>

              <div className="p-6 bg-[#1A1D22] border border-[#FF7A00]/20 rounded-2xl shadow-lg border-l-4 border-l-[#FF7A00] relative overflow-hidden group hover:border-[#FF7A00]/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <p className="relative z-10 text-white/80">
                  Our commitment to same-day turnaround within a 30-mile radius of Totnes sets us apart
                  in the industry. When your filter is ready for collection before 10am, we guarantee
                  it will be back to you the same day, fully cleaned, tested, and certified.
                </p>
              </div>

              <p>
                We work exclusively with trade professionals, offering transparent pricing and
                reliable service that helps keep your operations running smoothly. From single
                vehicle repairs to fleet maintenance programmes, we scale our service to meet your needs.
              </p>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="reveal-item">
            <div className="relative p-2 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="w-full h-[500px] bg-[#0A0A0A] rounded-[2rem] flex items-center justify-center overflow-hidden border border-[#FF7A00]/20">
                <img
                  src="/UniversalUpscaler_6337f695-e031-407a-b241-03edf41e6182.jpg"
                  alt="Professional AutoCleanse DPF cleaning workshop facility"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-32 reveal-container">
          <div className="text-center mb-16 reveal-item">
            <h2 className="text-4xl md:text-5xl font-black text-white px-4">
              Our <span className="text-[#FF7A00] font-mono">Values</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="relative p-10 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 text-center reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black h-full flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="w-20 h-20 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                  <value.icon size={36} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-[#FF7A00] transition-colors">{value.title}</h3>
                <p className="text-white/60 text-lg font-medium leading-relaxed flex-grow">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="text-center mt-20 reveal-container">
          <div className="reveal-item relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to <span className="text-[#FF7A00]">work with us?</span>
            </h3>
            <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Get in touch to discuss your requirements or arrange a collection. Let's build a lasting partnership.
            </p>

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton className="block">
                <a
                  href="tel:08000430609"
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg"
                >
                  0800 043 0609
                </a>
              </MagneticButton>
              <MagneticButton className="block">
                <a
                  href="mailto:info@autocleanse.co.uk"
                  className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg"
                >
                  Send enquiry
                </a>
              </MagneticButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;