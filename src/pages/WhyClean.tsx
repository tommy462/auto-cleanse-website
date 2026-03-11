import { useRef } from 'react';
import SEO from '../components/SEO';
import { Shield, Zap, DollarSign, Clock, Settings, Truck, CheckCircle, Leaf } from 'lucide-react';
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

const WhyClean = () => {
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

  const keyFacts = [
    {
      icon: Shield,
      title: 'Aftermarket DPFs Rarely Meet OEM Standards',
      description: 'Most aftermarket filters don\'t meet the same engineering or emissions specs as OEM (original equipment manufacturer) parts risking failed MOTs or poor performance.',
    },
    {
      icon: Zap,
      title: 'Cleaning Restores Original Flow Efficiency',
      description: 'Our process restores flow rates to over 98% of original performance - without compromise to fit, calibration, or emissions compliance.',
    },
    {
      icon: Clock,
      title: 'Replacements Are Often Just Temporary Fixes',
      description: 'Many aftermarket DPFs act as short-term patches they clog quickly, lack thermal resilience, and often aren\'t compatible with modern regeneration cycles.',
    },
    {
      icon: Settings,
      title: 'Regeneration Alone Isn\'t Enough',
      description: 'Passive or forced regeneration only burns off surface soot it can\'t remove deeper ash buildup or oil residue. Cleaning removes both.',
    },
    {
      icon: Leaf,
      title: 'Environmentally Responsible',
      description: 'Cleaning avoids unnecessary manufacturing waste and reduces the need for shipping new components, lowering your carbon footprint. Our process uses only high-pressure water with no harmful chemicals.',
    },
    {
      icon: DollarSign,
      title: 'Saves Money Without Compromising Quality',
      description: 'A full clean and test costs a fraction of replacement and includes flow testing and certification. With aftermarket parts, you\'re paying more for less.',
    },
    {
      icon: Truck,
      title: 'Fleet Operators Choose Cleaning for Uptime',
      description: 'For fleets, downtime is costly. Cleaning is faster, more predictable, and avoids issues with part sourcing or fitting.',
    },
    {
      icon: CheckCircle,
      title: 'Keeps Sensors and Systems Happy',
      description: 'Modern vehicles use pressure sensors, O2 sensors, and regeneration timing. Replacing DPFs can throw off calibration. Cleaning maintains continuity.',
    },
    {
      icon: Shield,
      title: 'OEM Filters Are Built to Last - They Just Need Cleaning',
      description: 'Factory-fitted DPFs are designed for the lifespan of the vehicle, they fail due to blockage, not structural wear. Cleaning brings them back to spec.',
    },
  ];

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="Why Clean Your DPF? | Save Money & Time" description="Discover why cleaning your Diesel Particulate Filter is faster, cheaper, and more effective than buying a replacement." path="/why-clean" />

      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[#FF7A00]/3 blur-[120px] rounded-[100%] pointer-events-none"></div>
      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is professional DPF cleaning legal in the UK?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, professional cleaning maintains the original filter and emissions system, keeping vehicles MOT compliant."
                }
              },
              {
                "@type": "Question",
                "name": "Will a cleaned DPF pass an MOT?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A properly cleaned OEM DPF will pass MOT emissions tests as it retains all original specifications and performance characteristics."
                }
              },
              {
                "@type": "Question",
                "name": "Is cleaning better than an aftermarket replacement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "OEM filters are engineered specifically for your vehicle. Cleaning preserves these exact specifications, while aftermarket parts may not meet the same standards."
                }
              },
              {
                "@type": "Question",
                "name": "How long does a professionally cleaned DPF last?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A professionally cleaned OEM DPF can last as long as the original, often requiring cleaning only every 80,000-120,000 miles depending on driving conditions."
                }
              }
            ]
          })
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Why Clean Your DPF Instead of', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Replacing It?</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-white/50 max-w-4xl mx-auto leading-relaxed font-medium reveal-item">
            Before you consider replacing your DPF, understand why professional cleaning is the smarter,
            more cost-effective, and environmentally responsible choice.
          </p>
        </div>

        {/* Callout Section */}
        <div className="mb-24 reveal-container">
          <div className="relative p-10 md:p-14 rounded-[2.5rem] bg-[#1A1D22] border border-[#FF7A00]/20 overflow-hidden text-center reveal-item shadow-2xl shadow-black/50 group hover:border-[#FF7A00]/40 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">
                🧼 Thinking of replacing your DPF?
              </h2>
              <p className="text-xl md:text-2xl text-white/70 mb-0 leading-relaxed font-medium">
                <span className="text-[#FF7A00] font-bold">Don't.</span> Factory filters are built to last.
                Our cleaning process restores over <span className="text-[#FF7A00] font-black underline decoration-[#FF7A00]/30 underline-offset-4">98% flow performance </span>
                for less than half the cost of a replacement.
              </p>
            </div>
          </div>
        </div>

        {/* Key Facts Grid */}
        <div className="mb-32 reveal-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Key Facts & <span className="text-[#FF7A00]">Talking Points</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFacts.map((fact, index) => (
              <div
                key={index}
                className="relative p-8 rounded-3xl bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden hover:-translate-y-2 shadow-xl shadow-black"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#FF7A00]/10 group-hover:border-[#FF7A00]/50 transition-all duration-500 group-hover:scale-110 shadow-[0_0_15px_rgba(255,122,0,0)] group-hover:shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                  <fact.icon size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="relative z-10 text-xl font-bold text-white mb-4 group-hover:text-[#FF7A00] transition-colors duration-300 leading-tight">{fact.title}</h3>
                <p className="relative z-10 text-white/60 leading-relaxed font-medium">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mb-32 reveal-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Cleaning vs <span className="text-[#FF7A00]">Replacement</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Cleaning Benefits */}
            <div className="relative p-10 rounded-[2.5rem] bg-[#1A1D22] border border-green-500/20 reveal-item group hover:border-green-500/50 transition-all duration-500 overflow-hidden hover:-translate-y-2 shadow-2xl shadow-green-900/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="text-center mb-10 relative z-10">
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">Professional Cleaning</h3>
              </div>

              <ul className="space-y-4 relative z-10">
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <span>98%+ flow performance restoration</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <span>Maintains OEM specifications</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <span>Same-day turnaround available</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <span>Fraction of replacement cost</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <span>Environmentally responsible</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <span>Preserves sensor calibration</span>
                </li>
              </ul>
            </div>

            {/* Replacement Drawbacks */}
            <div className="relative p-10 rounded-[2.5rem] bg-[#1A1D22] border border-red-500/20 reveal-item group hover:border-red-500/50 transition-all duration-500 overflow-hidden hover:-translate-y-2 shadow-2xl shadow-red-900/10">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="text-center mb-10 relative z-10">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <Settings size={36} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">Aftermarket Replacement</h3>
              </div>

              <ul className="space-y-4 relative z-10">
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <span>Often fails to meet OEM standards</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <span>Risk of MOT failures</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <span>Longer downtime for sourcing/fitting</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <span>Significantly higher cost</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <span>Environmental waste</span>
                </li>
                <li className="flex items-start text-white/70 font-medium text-lg">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <span>May disrupt sensor calibration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* DPF Cleaning vs Replacement – What You Should Know */}
        <div className="mb-32 reveal-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              DPF Cleaning vs Replacement –<br />
              <span className="text-[#FF7A00]">What You Should Know</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto reveal-item">
            <div className="relative p-10 md:p-14 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black/50">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A00]/5 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="text-white/60 text-lg md:text-xl leading-relaxed space-y-8 mb-16 relative z-10 font-medium font-serif">
                <p>
                  Original Equipment Manufacturer (OEM) DPFs are engineered to last the lifetime of the vehicle
                  when properly maintained. These filters are designed with cleaning in mind – their ceramic
                  substrates and precious metal coatings are built to withstand multiple cleaning cycles without
                  degradation. Most DPF <span className="text-white">"failures" are actually blockages</span> caused by accumulated soot and ash,
                  not structural damage to the filter itself.
                </p>

                <p>
                  Genuine replacement is only required when physical damage occurs – such as thermal shock
                  from overheating, substrate cracking, or complete melting of the ceramic structure. These
                  scenarios are relatively rare and typically result from severe engine problems or improper
                  regeneration cycles. In the UK, <span className="text-white">professional DPF cleaning maintains MOT compliance</span> and
                  emissions standards, as the original filter specifications remain unchanged.
                </p>

                <p>
                  Understanding this distinction is crucial for vehicle operators. A blocked DPF can often
                  be <span className="text-[#FF7A00] font-bold">restored to over 98%</span> of its original flow capacity through professional cleaning,
                  maintaining all original calibrations and sensor compatibility that aftermarket parts
                  may not provide.
                </p>
              </div>

              {/* FAQ Section */}
              <div className="border-t border-white/10 pt-12 relative z-10">
                <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Frequently Asked Questions</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <h4 className="text-white font-bold mb-3 group-hover:text-[#FF7A00] transition-colors">Is professional DPF cleaning legal in the UK?</h4>
                    <p className="text-white/50 leading-relaxed">Yes, professional cleaning maintains the original filter and emissions system, keeping vehicles MOT compliant.</p>
                  </div>

                  <div className="group">
                    <h4 className="text-white font-bold mb-3 group-hover:text-[#FF7A00] transition-colors">Will a cleaned DPF pass an MOT?</h4>
                    <p className="text-white/50 leading-relaxed">A properly cleaned OEM DPF will pass MOT emissions tests as it retains all original specifications and performance characteristics.</p>
                  </div>

                  <div className="group">
                    <h4 className="text-white font-bold mb-3 group-hover:text-[#FF7A00] transition-colors">Is cleaning better than an aftermarket replacement?</h4>
                    <p className="text-white/50 leading-relaxed">OEM filters are engineered specifically for your vehicle. Cleaning preserves these exact specifications, while aftermarket parts may not meet the same standards.</p>
                  </div>

                  <div className="group">
                    <h4 className="text-white font-bold mb-3 group-hover:text-[#FF7A00] transition-colors">How long does a professionally cleaned DPF last?</h4>
                    <p className="text-white/50 leading-relaxed">A professionally cleaned OEM DPF can last as long as the original, often requiring cleaning only every 80,000-120,000 miles depending on driving conditions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center reveal-container">
          <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 max-w-4xl mx-auto reveal-item shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to restore your DPF to <span className="text-[#FF7A00]">like-new performance?</span>
            </h3>
            <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Contact us today to discuss your requirements and arrange collection.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton>
                <a
                  href="tel:08000430609"
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all text-center block text-lg"
                >
                  0800 043 0609
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="mailto:info@autocleanse.co.uk"
                  className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] text-center block text-lg"
                >
                  Send enquiry
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyClean;
