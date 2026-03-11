import { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { Check, ChevronDown } from 'lucide-react';
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

const Pricing = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
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

  const pricingTiers = [
    {
      title: 'Within 10 Miles',
      price: '£210',
      subtitle: 'From Totnes, Devon',
      popular: true,
    },
    {
      title: 'Outside 10 Miles',
      price: '£230',
      subtitle: 'Nationwide coverage',
      popular: false,
    },
    {
      title: 'HGV/Plant',
      price: '£299',
      subtitle: 'Heavy vehicles',
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'Do you offer trade accounts?',
      answer: 'Yes, we offer trade accounts with preferential terms for regular customers. Contact us to discuss your requirements and set up an account.',
    },
    {
      question: 'What areas do you cover locally?',
      answer: 'We cover a 10-mile radius from Totnes, Devon. This includes most of South Devon and parts of Cornwall. Same-day return is guaranteed within this area when collected before 10am.',
    },
    {
      question: 'How do you test filters?',
      answer: 'We conduct comprehensive flow and back-pressure testing before and after cleaning. All results are documented in detailed reports for your records.',
    },
    {
      question: 'Do you clean catalytic converters?',
      answer: 'Yes, we provide professional catalytic converter cleaning with high-pressure water to maintain performance and restoring optimal flow.',
    },
    {
      question: 'What are your turnaround times?',
      answer: 'Same-day return within 10 miles of Totnes when collected before 10am on weekdays. Outside this area, typical turnaround is 24-48 hours subject to logistics.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="DPF Cleaning Prices | Clear, Transparent Costs" description="Honest, upfront DPF cleaning prices. No hidden fees. Starting from £180." path="/pricing" />

      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Straightforward', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">pricing.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 mb-32 reveal-container">
          {/* Pricing Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`relative p-8 rounded-3xl bg-[#1A1D22] border transition-all duration-500 reveal-item group ${tier.popular
                    ? 'border-[#FF7A00]/50 shadow-[0_0_30px_rgba(255,122,0,0.15)] hover:shadow-[0_0_50px_rgba(255,122,0,0.3)] hover:-translate-y-2 relative z-10 scale hover:scale-105'
                    : 'border-white/5 hover:border-[#FF7A00]/30 hover:shadow-2xl hover:shadow-black hover:-translate-y-2 md:scale-95'
                    }`}
                >
                  {tier.popular && (
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-[#FF7A00]/50 to-transparent rounded-3xl opacity-50 z-[-1]"></div>
                  )}

                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <span className="bg-[#FF7A00] text-black px-6 py-1.5 rounded-full text-xs uppercase tracking-widest font-black shadow-[0_0_20px_rgba(255,122,0,0.5)]">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center h-full flex flex-col justify-center relative z-10">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4 opacity-80">{tier.title}</h3>
                    <div className="text-5xl md:text-6xl font-black text-[#FF7A00] mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(255,122,0,0.3)]">{tier.price}</div>
                    <p className="text-white/50 text-sm font-medium uppercase tracking-widest">{tier.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Notes */}
            <div className="mt-12 space-y-4 reveal-item">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 hover:border-[#FF7A00]/20 transition-colors">
                <Check className="text-[#FF7A00] shrink-0 mt-0.5" size={20} />
                <p className="text-white/70 text-sm md:text-base">
                  No hidden fees, no complicated pricing tiers. What you see is what you <span className="text-[#FF7A00] font-bold">pay</span>.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 hover:border-[#FF7A00]/20 transition-colors">
                <Check className="text-[#FF7A00] shrink-0 mt-0.5" size={20} />
                <p className="text-white/70 text-sm md:text-base">
                  Courier collection available - contact us for options.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 hover:border-[#FF7A00]/20 transition-colors">
                <Check className="text-[#FF7A00] shrink-0 mt-0.5" size={20} />
                <p className="text-white/70 text-sm md:text-base">
                  Same-day return guarantee applies when ready for collection before 10am and within 30 miles of Totnes.
                </p>
              </div>
            </div>
          </div>

          {/* Nationwide Service Badge */}
          <div className="lg:col-span-1 reveal-item mt-8 lg:mt-0">
            <div className="relative p-8 rounded-3xl bg-[#1A1D22] border border-white/5 sticky top-32 group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden text-center h-[calc(100%-2rem)] flex flex-col justify-center min-h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FF7A00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                  <div className="w-8 h-8 rounded bg-[#FF7A00]"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[#FF7A00] transition-colors">Nationwide Service</h3>
                <p className="text-[#FF7A00] font-mono text-xs uppercase tracking-widest mb-8">Coming Soon</p>

                {/* Progress Indicator */}
                <div className="w-full bg-black/50 rounded-full h-1.5 mb-3 border border-white/5 overflow-hidden">
                  <div className="bg-[#FF7A00] h-full rounded-full w-3/4 transition-all duration-1000 shadow-[0_0_10px_rgba(255,122,0,1)] relative">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-white/40 text-xs font-mono">75% Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto reveal-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Protocol <span className="text-[#FF7A00]">FAQ</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 reveal-item overflow-hidden ${openFAQ === index
                  ? 'bg-[#1A1D22] border-[#FF7A00]/50 shadow-[0_0_20px_rgba(255,122,0,0.1)]'
                  : 'bg-[#1A1D22]/50 border-white/5 hover:border-[#FF7A00]/30 hover:bg-[#1A1D22]'
                  }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus-visible:outline-none"
                  aria-expanded={openFAQ === index}
                >
                  <span className={`font-bold transition-colors ${openFAQ === index ? 'text-[#FF7A00]' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFAQ === index ? 'bg-[#FF7A00] text-black rotate-180' : 'bg-white/5 text-white/50 group-hover:bg-[#FF7A00]/20 group-hover:text-[#FF7A00]'}`}>
                    <ChevronDown size={18} strokeWidth={3} />
                  </div>
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="h-px w-full bg-gradient-to-r from-[#FF7A00]/20 to-transparent mb-4"></div>
                  <p className="text-white/60 leading-relaxed font-medium">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;