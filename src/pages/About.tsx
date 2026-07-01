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
      description: 'Consistent quality and reliability for both trade customers and private drivers - every DPF clean and every remap done properly.',
    },
    {
      icon: Shield,
      title: 'Diagnostics first',
      description: 'Every remap includes a paid diagnostic health check before and after. We only proceed on a healthy engine, and your original file is always saved.',
    },
    {
      icon: Zap,
      title: 'Honest & local',
      description: 'A genuine Totnes-based Devon business. Clear pricing, no off-the-shelf files, and we are upfront about what we do - including that DPF cleaning is workshop-based, not mobile.',
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
      <SEO title="About Auto-Cleanse | DPF Cleaning & ECU Remapping Devon" description="Auto-Cleanse is a Totnes-based DPF cleaning and ECU remapping specialist serving trade and private customers across Devon. DPF cleaning is workshop/off-vehicle or postal; ECU remapping is workshop or mobile." path="/about" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "AutomotiveService"],
        "name": "Auto-Cleanse",
        "description": "Devon-based DPF cleaning and ECU remapping specialists. Operating from Totnes, serving trade garages, fleet operators and individual vehicle owners across Devon and the UK.",
        "url": "https://www.auto-cleanse.co.uk/about",
        "telephone": "+441803269895",
        "email": "info@auto-cleanse.co.uk",
        "address": { "@type": "PostalAddress", "streetAddress": "The Old Barn Industrial Estate, Webbers Yard", "addressLocality": "Totnes", "addressRegion": "Devon", "postalCode": "TQ9 6JY", "addressCountry": "GB" },
        "geo": { "@type": "GeoCoordinates", "latitude": "50.4316", "longitude": "-3.6844" },
        "areaServed": { "@type": "AdministrativeArea", "name": "Devon" },
        "foundingDate": "2024",
        "sameAs": [
          "https://www.facebook.com/profile.php?id=61573744325360",
          "https://www.instagram.com/auto_cleansedpf/",
          "https://www.linkedin.com/in/alex-rabone-102786158/"
        ]
      })}} />
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('About', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Auto-Cleanse</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 reveal-container">
          {/* Story */}
          <div className="reveal-item">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">
              Devon's DPF cleaning and <br />
              <span className="text-[#FF7A00] font-mono">ECU remapping</span> specialist
            </h2>
            <div className="space-y-6 text-white/60 text-lg font-medium leading-relaxed">
              <p>
                Auto-Cleanse is a Totnes-based specialist in two things: professional DPF cleaning and
                ECU remapping. We work with both trade customers - garages, fleets and plant businesses -
                and private drivers across Devon, from Plymouth and Exeter to Torbay, the South Hams and
                North Devon.
              </p>

              <div className="p-6 bg-[#1A1D22] border border-[#FF7A00]/20 rounded-2xl shadow-lg border-l-4 border-l-[#FF7A00] relative overflow-hidden group hover:border-[#FF7A00]/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <p className="relative z-10 text-white/80">
                  DPF cleaning is carried out off the vehicle using our workshop equipment in Totnes, with
                  local collection across Devon and UK-wide postal cleaning - we do not offer mobile,
                  roadside DPF cleaning. ECU remapping is available at our Totnes workshop or mobile across
                  Devon, since remapping can be done at your home or workplace.
                </p>
              </div>

              <p>
                Every remap starts with a paid diagnostic health check before and after the work - not a
                free scan - and the remap we apply is a file matched to your exact vehicle, applied carefully;
                we don't write ECU files from scratch or use generic flash-and-go downloads. For road cars we
                keep the DPF, EGR and AdBlue systems intact and road-legal.
              </p>

              <p className="text-white/40 text-base">
                Auto-Cleanse is sometimes written as "AutoCleanse" online - it's the same Devon business either way.
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
                  href="tel:01803269895"
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg"
                >
                  01803 269895
                </a>
              </MagneticButton>
              <MagneticButton className="block">
                <a
                  href="mailto:info@auto-cleanse.co.uk"
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