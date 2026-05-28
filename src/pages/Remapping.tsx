import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, BarChart3, Settings2, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import RemapPortfolio from '../components/RemapPortfolio';

gsap.registerPlugin(ScrollTrigger);

const REMAP_IMAGE_1 = 'https://hdegxhrhakxvgnadulgq.supabase.co/storage/v1/object/public/website-media/websiteremapimage1.png';
const REMAP_IMAGE_1_MOBILE = 'https://hdegxhrhakxvgnadulgq.supabase.co/storage/v1/object/public/website-media/websiteremapimage1mobile.png';
const REMAP_IMAGE_2 = 'https://hdegxhrhakxvgnadulgq.supabase.co/storage/v1/object/public/website-media/websiteremapimage2.png';
const REMAP_IMAGE_2_MOBILE = 'https://hdegxhrhakxvgnadulgq.supabase.co/storage/v1/object/public/website-media/websiteremapimage2mobile.png';

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is ECU remapping legal in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, ECU remapping is legal in the UK. However, you must notify your insurance provider after a remap as it is a modification. Failure to do so could invalidate your policy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will a remap affect my warranty?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Remapping may affect your manufacturer warranty if the vehicle is still within the warranty period. We advise checking with your dealer or waiting until the warranty has expired. On older vehicles this is rarely a concern.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Stage 1 and Stage 2 remapping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Stage 1 remap is a software-only change optimised for a standard vehicle with no hardware modifications. Stage 2 maps are calibrated to work alongside hardware upgrades such as an uprated intercooler, performance exhaust, or intake modifications.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does an ECU remap take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most ECU remaps can be completed within 1–2 hours, depending on the vehicle and the type of map. We will give you a more specific time estimate when you book.',
      },
    },
  ],
};

const Remapping = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );

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

  const stages = [
    {
      icon: Zap,
      title: 'Stage 1 Remap',
      tag: 'Most Popular',
      description: 'A software-only calibration optimised for a standard, unmodified vehicle. Safe, road-legal, and immediately noticeable.',
      highlights: [
        'No hardware changes required',
        'Improved throttle response',
        'Better fuel economy on most vehicles',
        'Increased power and torque within safe limits',
        'Road and MOT legal',
      ],
    },
    {
      icon: Settings2,
      title: 'Stage 2 Remap',
      tag: 'Performance',
      description: 'A higher-performance calibration designed to work alongside hardware upgrades. Matched to your specific modifications for safe, maximised output.',
      highlights: [
        'Requires hardware upgrades (intercooler, exhaust, intake)',
        'Significantly higher power and torque gains',
        'Custom torque and boost curves',
        'Matched to your specific hardware setup',
        'Dyno verification available',
      ],
    },
    {
      icon: BarChart3,
      title: 'Custom & Fleet Maps',
      tag: 'Commercial',
      description: 'Bespoke calibration for commercial operators, agricultural machinery, and specialist vehicles. Economy, power, or towing bias - tailored to your exact use case.',
      highlights: [
        'Fleet and commercial operators',
        'Agricultural and plant machinery',
        'Economy or performance bias to order',
        'HGV and specialist vehicle support',
        'Multi-vehicle fleet pricing available',
      ],
    },
  ];

  const benefits = [
    { icon: Zap, title: 'More Power', description: 'Unlock hidden performance that manufacturers deliberately restrict from the factory map.' },
    { icon: BarChart3, title: 'Better Economy', description: 'A well-calibrated map can improve MPG, reducing fuel costs - especially on diesel vehicles.' },
    { icon: Shield, title: 'Safer Calibration', description: 'Every map is written within safe mechanical limits. We do not push components beyond their design tolerance.' },
    { icon: Settings2, title: 'Sharper Response', description: 'Reduced turbo lag and more linear throttle response make the vehicle more predictable and enjoyable to drive.' },
  ];

  return (
    <div ref={container} className="bg-[#0A0A0A] min-h-screen relative">
      <SEO
        title="ECU Remapping | Stage 1, Stage 2 & Custom Maps"
        description="Professional ECU remapping in Devon. Stage 1 and Stage 2 maps for cars, vans, HGVs and commercial vehicles. Improved power, torque, and fuel economy - safely calibrated."
        path="/remapping"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="pt-32 pb-24 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[#FF7A00]/10 blur-[120px] rounded-[100%] pointer-events-none opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-0 reveal-container">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-6 reveal-item">Performance Tuning</div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
              {splitText('ECU Remapping.', 'text-white')}
              <br />
              <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
                <span className="inline-block word-reveal text-[#FF7A00] ml-2">Unlocked.</span>
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full" />
            <p className="text-xl md:text-2xl text-white/60 max-w-4xl mx-auto leading-relaxed font-medium reveal-item">
              Stage 1 &amp; 2 maps tailored to your vehicle. More power, better economy, sharper response -
              every remap written within safe mechanical limits.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-10 reveal-item">
              <MagneticButton>
                <Link to="/remapping-booking" className="btn-shine px-8 py-4 rounded-xl font-bold text-base text-white hover:text-white inline-block">
                  Book a Remap
                </Link>
              </MagneticButton>
              <MagneticButton>
                <a href="tel:01803269895" className="px-8 py-4 rounded-xl font-bold text-base text-white border border-white/20 hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                  <Phone size={18} /> 01803 269895
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL-BLEED IMAGE 1 ────────────────────────────────────────────────── */}

      {/* Mobile: full portrait image, no cropping */}
      <div className="block md:hidden relative" style={{ zIndex: 1 }}>
        <img src={REMAP_IMAGE_1_MOBILE} alt="ECU remapping in action" className="w-full h-auto" loading="eager" />
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-transparent" style={{ height: '20%' }} />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" style={{ height: '25%' }} />
      </div>

      {/* Desktop: sticky parallax */}
      <div className="hidden md:block relative h-[80vh]" style={{ zIndex: 1 }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <img src={REMAP_IMAGE_1} alt="ECU remapping in action" className="w-full h-full object-cover object-center" loading="eager" />
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-transparent" style={{ height: '35%' }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" style={{ height: '40%' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]/30" />
          <div className="absolute inset-0 bg-[#FF7A00]/5 mix-blend-screen pointer-events-none" />
        </div>
      </div>

      {/* ── STAGES + BENEFITS ────────────────────────────────────────────────── */}
      {/* z-index 2 so this slides over the sticky image on scroll */}
      <div className="relative bg-[#0A0A0A] py-32" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Remap Stages Grid */}
          <div className="mb-32 reveal-container">
            <div className="text-center mb-16 reveal-item">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Choose Your <span className="text-[#FF7A00]">Map</span>
              </h2>
              <p className="text-white/50 text-lg font-medium max-w-2xl mx-auto">
                From a simple road-legal Stage 1 to fully custom commercial calibrations - we have a map for every vehicle and goal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stages.map((stage, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col p-8 sm:p-10 rounded-3xl bg-[#1A1D22] border border-white/5 hover:-translate-y-2 transition-all duration-500 reveal-item overflow-hidden shadow-2xl shadow-black hover:shadow-[0_20px_40px_rgba(255,122,0,0.1)] hover:border-[#FF7A00]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute right-4 -top-6 text-[120px] font-black text-white/[0.02] group-hover:text-[#FF7A00]/[0.05] group-hover:scale-110 transition-all duration-700 pointer-events-none select-none">
                    0{index + 1}
                  </div>

                  <div className="relative z-10 flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#1A1D22] border border-white/10 flex items-center justify-center group-hover:rotate-12 group-hover:border-[#FF7A00] group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500">
                      <stage.icon size={32} className="text-white group-hover:text-[#FF7A00] transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-mono text-[#FF7A00]/70 uppercase tracking-wider border border-[#FF7A00]/20 px-2 py-1 rounded-md">
                      {stage.tag}
                    </span>
                  </div>

                  <h3 className="relative z-10 text-2xl font-bold text-white mb-3 group-hover:text-[#FF7A00] transition-colors duration-500 tracking-tight">{stage.title}</h3>
                  <p className="relative z-10 text-white/50 text-base font-medium mb-6 flex-grow">{stage.description}</p>

                  <ul className="relative z-10 space-y-3">
                    {stage.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start text-white/70 text-sm font-medium">
                        <div className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full mr-3 mt-1.5 shadow-[0_0_10px_rgba(255,122,0,0.5)] shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="reveal-container">
            <div className="text-center mb-16 reveal-item">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Why <span className="text-[#FF7A00]">Remap?</span>
              </h2>
              <p className="text-white/50 text-lg font-medium max-w-2xl mx-auto">
                Manufacturers tune ECUs conservatively to accommodate global fuel quality variations, emissions regulations, and model tier differentiation.
                A professional remap unlocks what your engine was already capable of.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-6 p-8 rounded-3xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 reveal-item"
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#1A1D22] border border-white/10 flex items-center justify-center group-hover:border-[#FF7A00]/50 group-hover:shadow-[0_0_20px_rgba(255,122,0,0.2)] transition-all duration-500">
                    <benefit.icon size={28} className="text-white group-hover:text-[#FF7A00] transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors duration-300">{benefit.title}</h3>
                    <p className="text-white/50 text-base font-medium leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── FULL-BLEED IMAGE 2 ────────────────────────────────────────────────── */}

      {/* Mobile: full portrait image, no cropping */}
      <div className="block md:hidden relative" style={{ zIndex: 1 }}>
        <img src={REMAP_IMAGE_2_MOBILE} alt="Remapped vehicle performance" className="w-full h-auto" loading="lazy" />
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-transparent" style={{ height: '20%' }} />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" style={{ height: '25%' }} />
      </div>

      {/* Desktop: sticky parallax */}
      <div className="hidden md:block relative h-[65vh]" style={{ zIndex: 1 }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <img src={REMAP_IMAGE_2} alt="Remapped vehicle performance" className="w-full h-full object-cover object-center" loading="lazy" />
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-transparent" style={{ height: '35%' }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" style={{ height: '40%' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]/30" />
          <div className="absolute inset-0 bg-[#FF7A00]/5 mix-blend-screen pointer-events-none" />
        </div>
      </div>

      {/* ── PORTFOLIO ─────────────────────────────────────────────────────────── */}
      <div className="relative" style={{ zIndex: 2 }}>
        <RemapPortfolio />
      </div>

      {/* ── FAQ + RELATED + CTA ───────────────────────────────────────────────── */}
      <div className="relative bg-[#0A0A0A] py-32" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* FAQ Section */}
          <div className="mb-32 reveal-container">
            <div className="text-center mb-16 reveal-item">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Common <span className="text-[#FF7A00]">Questions</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqSchema.mainEntity.map((faq, index) => (
                <div key={index} className="group p-8 rounded-2xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/20 transition-colors duration-300 reveal-item">
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#FF7A00] transition-colors duration-300 flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#FF7A00] shrink-0 mt-0.5" strokeWidth={2} />
                    {faq.name}
                  </h3>
                  <p className="text-white/60 font-medium leading-relaxed pl-8">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Services */}
          <div className="mt-32 reveal-container">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 reveal-item">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  Also from <span className="text-[#FF7A00]">AutoCleanse</span>
                </h3>
              </div>
              <div className="hidden md:block w-full max-w-md h-px bg-gradient-to-r from-[#FF7A00]/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-item">
              <Link to="/services" className="group p-8 rounded-3xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-[#FF7A00] mb-2 uppercase tracking-widest">Filter Cleaning</div>
                  <div className="text-xl font-bold text-white group-hover:text-[#FF7A00] transition-colors">DPF, SCR &amp; DOC Cleaning</div>
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

              <Link to="/contact" className="group p-8 rounded-3xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 hover:-translate-y-2 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-[#FF7A00] mb-2 uppercase tracking-widest">Get in Touch</div>
                  <div className="text-xl font-bold text-white group-hover:text-[#FF7A00] transition-colors">Contact AutoCleanse</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF7A00]/20 transition-colors">
                  <ArrowRight className="text-white/50 group-hover:text-[#FF7A00]" size={20} />
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-32 reveal-container">
            <div className="relative rounded-[3rem] p-12 lg:p-16 max-w-4xl mx-auto overflow-hidden group bg-[#1A1D22] border border-white/10 reveal-item hover:border-[#FF7A00]/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
              <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-700 bg-[#FF7A00]/20 blur-[100px]" />

              <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                <div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">
                    Ready to unlock your vehicle?
                  </h3>
                  <p className="text-white/60 text-lg font-medium max-w-lg">
                    Book a remap consultation or call us to discuss which map is right for your vehicle.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                  <MagneticButton className="w-full sm:w-auto">
                    <a href="tel:01803269895" className="flex items-center justify-center gap-2 bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 w-full">
                      <Phone size={20} />
                      01803 269895
                    </a>
                  </MagneticButton>

                  <MagneticButton className="w-full sm:w-auto">
                    <Link to="/remapping-booking" className="flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 w-full shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]">
                      <Zap size={20} />
                      Book a Remap
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Remapping;
