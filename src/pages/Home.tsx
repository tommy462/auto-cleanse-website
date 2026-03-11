import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Truck, Clock, Shield, Settings, Wrench, Zap, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, Droplets, Leaf, Settings2, BarChart3, ArrowRight, MousePointer2, Play, Facebook, Instagram, Youtube } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollVideoSection from '../components/ScrollVideoSection';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import CountUp from '../components/CountUp';
import LogoLoop from '../components/LogoLoop';

gsap.registerPlugin(ScrollTrigger);

const customerLogos = [
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_22_01 AM.png', alt: 'Customer 1' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_22_47 AM.png', alt: 'Customer 2' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_23_26 AM.png', alt: 'Customer 3' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_24_11 AM.png', alt: 'Customer 4' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_27_16 AM.png', alt: 'Customer 5' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_27_45 AM.png', alt: 'Customer 6' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_33_10 AM.png', alt: 'Customer 7' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_33_47 AM.png', alt: 'Customer 8' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_40_28 AM.png', alt: 'Customer 9' },
  { src: '/customer/ChatGPT Image Mar 11, 2026, 10_41_22 AM.png', alt: 'Customer 10' }
];

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline - block word - reveal ${className} `}>{word}</span>
    </span>
  ));
};

const Home = () => {
  const container = useRef(null);

  useGSAP(() => {
    const revealContainers = gsap.utils.toArray('.reveal-container');

    revealContainers.forEach((container: any) => {
      const items = container.querySelectorAll('.reveal-item');

      gsap.fromTo(items,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Cinematic Hero Animation
    gsap.fromTo('.hero-title .word-reveal',
      {
        y: 150,
        opacity: 0,
        rotate: 5
      },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2
      }
    );

    gsap.fromTo('.hero-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 1.2, ease: 'power3.out' }
    );

    // Parallax effect on scroll
    gsap.to('.hero-bg', {
      y: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.hero-content', {
      y: '40%',
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

  }, { scope: container });

  const services = [
    {
      icon: Settings,
      title: 'DPF Cleaning',
      description: 'Professional deep clean',
      features: ['98% Ash & Soot Removal', 'Advanced Flow Testing', 'Restores Original Performance']
    },
    {
      icon: Wrench,
      title: 'SCR Cleaning',
      description: 'Selective Catalytic Reduction',
      features: ['AdBlue line clearance', 'NOx sensor safe', 'Crystallization removal']
    },
    {
      icon: Shield,
      title: 'DOC Cleaning',
      description: 'Diesel Oxidation Catalyst',
      features: ['Core structure safety', 'Unblocks initial flow', 'Optimizes regeneration']
    },
    {
      icon: Settings,
      title: 'GPF Cleaning',
      description: 'Gasoline Particulate Filter',
      features: ['High-temp backwash', 'Preserves petrol coatings', 'Restores engine power']
    },
    {
      icon: Wrench,
      title: 'OPF Cleaning',
      description: 'Otto Particulate Filter',
      features: ['Specialized flow testing', 'Soot layer extraction', 'Prevents limp-mode']
    },
    {
      icon: Settings,
      title: 'EGR Cleaning',
      description: 'Exhaust Gas Recirculation',
      features: ['Carbon build-up removal', 'Valve motion restoration', 'Improves fuel economy']
    },
    {
      icon: Wrench,
      title: 'Intercoolers',
      description: 'Performance optimisation',
      features: ['Oil sludge extraction', 'Fin pressure testing', 'Maximizes air density']
    },
    {
      icon: Shield,
      title: 'Radiators',
      description: 'Cooling system service',
      features: ['Internal core flushing', 'External blockage clearing', 'Prevents overheating']
    },
    {
      icon: Zap,
      title: 'Catalytic Converters',
      description: 'Emission control cleaning',
      features: ['Precious metal safe formulation', 'Unblocks exhaust flow', 'Clears engine lights']
    },
  ];

  const reviews = [
    {
      text: "Auto Cleanse removed, cleaned and replaced my dpf effectively and promptly, all in all a trouble free service. Communication was excellent and I'm no longer scared of my DPF. I'd recommend this company.",
      author: "James Riggs",
      company: ""
    },
    {
      text: "I took my VW Golf diesel to AutoClean after it went into limp mode with a flashing glow-plug light and suspected DPF blockage. Tom carried out proper diagnostics and confirmed the DPF itself was healthy. Instead of replacing parts unnecessarily, they identified a faulty DPF differential pressure sensor as the root cause. The issue was explained clearly, the costs were transparent, and the repair was completed promptly. Limp mode resolved immediately.",
      author: "Martin Amis",
      company: "Local Guide"
    },
    {
      text: "Alex was so helpful in getting car in immediately to VMS in Paignton and kept me updated on progress and likely resolution. Couldn't fault how he dealt with it",
      author: "Mordiford Man",
      company: ""
    },
    {
      text: "Just wanted to say thanks again for the super quick response and turnaround for DPF Cleaning, picked up and dropped off within two hours. Can't fault the service and advice from Alex at Auto Cleanse, we will definitely be using your services in the future. Would 100% recommend Auto Cleanse to anyone.",
      author: "Antony Moore",
      company: "TSH Garage"
    },
    {
      text: "Quick, efficient and professional service from start to finish. would highly recommend .",
      author: "Luke Thomas",
      company: "LT Garage"
    },
    {
      text: "Absolutely brilliant service, called Alex explained the problem, advised him of heavy oil contamination from a failed turbo, explained needed it turned around quick. Alex turned up within 20mins and said a time of 11am next day and he was with me by 10.30 will definitely be using him from now on for all my off car DPF cleans.",
      author: "OTR Mobile Mechanic & Garage Services",
      company: ""
    },
    {
      text: "Brilliant. Fast efficient service. Collected, cleaned and returned quickly.",
      author: "Win Scutt",
      company: ""
    },
    {
      text: "Efficient service provided, good lines of communication, fairly priced.",
      author: "Claire",
      company: "Honeywill Vehicle Repairs"
    },
    {
      text: "Excellent service spoke to Alex who was really helpful. Collected the part from us and had it cleaned and returned all within a few hours definitely would use them again. 5 star service",
      author: "Danny Hunt",
      company: ""
    }
  ];

  const whyChooseUs = [
    {
      icon: Truck,
      title: 'Free Pickup & Delivery',
      description: 'No hassle collection service',
    },
    {
      icon: Settings,
      title: 'State-of-the-Art Tools',
      description: 'Latest cleaning technology',
    },
    {
      icon: Clock,
      title: 'Local Same-Day Service',
      description: 'Fastest turnaround guaranteed',
    },
    {
      icon: Shield,
      title: 'Nationwide Service',
      description: 'Coverage across the UK',
      comingSoon: true,
    },
  ];





  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0: return 'md:col-span-2 md:row-span-2 p-8';
      case 3: return 'md:col-span-2 md:row-span-1 p-6';
      case 4: return 'md:col-span-1 md:row-span-2 p-6';
      case 6: return 'md:col-span-2 md:row-span-1 p-6';
      case 7: return 'md:col-span-2 md:row-span-1 p-6';
      default: return 'md:col-span-1 md:row-span-1 p-6';
    }
  };

  return (
    <main ref={container} className="block">
      <SEO
        title="DPF Cleaning Specialists | Devon & Nationwide"
        description="Professional off-vehicle DPF, SCR, DOC, GPF, and OPF cleaning services. Same-day return within Devon & nationwide postal service available."
        path="/"
      />
      {/* JSON-LD Schema Stacking */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "AutomotiveService",
              "name": "AutoCleanse",
              "alternateName": "Auto Cleanse",
              "description": "Professional DPF cleaning and filter refurbishment services. Specialising in off-vehicle DPF cleaning for cars, vans, HGVs and commercial fleets.",
              "url": "https://auto-cleanse.co.uk",
              "telephone": "0800 043 0609",
              "email": "info@autocleanse.co.uk",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Totnes",
                "addressRegion": "Devon",
                "addressCountry": "United Kingdom"
              },
              "areaServed": [
                {
                  "@type": "State",
                  "name": "Devon"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "South West England"
                },
                {
                  "@type": "Country",
                  "name": "United Kingdom"
                }
              ],
              "serviceType": "DPF Cleaning",
              "hasOfferingCatalog": {
                "@type": "OfferingCatalog",
                "name": "DPF and Filter Cleaning Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "DPF Cleaning",
                      "description": "Professional off-vehicle DPF cleaning with same-day return"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "SCR Cleaning",
                      "description": "Selective Catalytic Reduction system cleaning"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "DOC Cleaning",
                      "description": "Diesel Oxidation Catalyst cleaning and testing"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Postal DPF Cleaning",
                      "description": "Nationwide postal DPF cleaning service with tracked return"
                    }
                  }
                ]
              },
              "openingHours": [
                "Mo 08:00-17:00",
                "Tu 08:00-17:00",
                "We 08:00-17:00",
                "Th 08:00-17:00",
                "Fr 08:00-17:00"
              ],
              "paymentAccepted": "Cash, Card, Bank Transfer",
              "currenciesAccepted": "GBP",
              "priceRange": "££",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=61573744325360",
                "https://www.linkedin.com/in/alex-rabone-102786158/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "0800 043 0609",
                "contactType": "customer service",
                "availableLanguage": "English",
                "areaServed": "GB"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "50.4316",
                "longitude": "-3.6844"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "4",
                "bestRating": "5",
                "worstRating": "5"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Off-Vehicle DPF Cleaning",
              "provider": {
                "@type": "AutomotiveService",
                "name": "AutoCleanse"
              },
              "areaServed": "United Kingdom",
              "description": "Professional off-vehicle Diesel Particulate Filter (DPF) cleaning using aqueous and pneumatic systems. Next-day return nationwide or same-day local service.",
              "offers": {
                "@type": "Offer",
                "priceCurrency": "GBP",
                "price": "210.00",
                "url": "https://auto-cleanse.co.uk/pricing"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Can you clean a completely blocked DPF?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Our METclean XL process uses a combination of aqueous solutions and high-pressure pneumatics to clear even 100% blocked DPFs, returning them to 98% of their original flow capacity."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long does DPF cleaning take?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Locally in Devon, we offer same-day service. For our nationwide postal service, it is a 24-48 hour turnaround from collection to return delivery."
                  }
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://auto-cleanse.co.uk/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Services",
                  "item": "https://auto-cleanse.co.uk/services"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Nationwide Postal DPF",
                  "item": "https://auto-cleanse.co.uk/postal-dpf"
                }
              ]
            }
          ])
        }}
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden hero-section">
        {/* Background Image - Parallax */}
        <div
          className="absolute inset-x-0 -top-[20%] h-[140%] bg-cover bg-center bg-no-repeat hero-bg"
          style={{
            backgroundImage: `url('/very-dark-grey-and-black-honeycomb-effect-backgrou.png')`
          }}
        ></div>

        {/* Subtle tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0A0A]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center hero-content">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center hero-title drop-shadow-2xl">
            {splitText('DPF cleaning is our', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-2">thing.</span>
            </span>
          </h1>

          <div className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed space-y-4 hero-subtitle">
            <p className="font-semibold tracking-wide">Professional filter cleaning with same-day return within 30 miles of Totnes, Devon.</p>
            <p className="text-[#FF7A00]/80 font-mono text-lg uppercase tracking-widest">We specialise in one thing: DPF cleaning.</p>
          </div>
        </div>
      </section>

      {/* Premium Anatomy of a Clean Section (Moved up) */}
      <ScrollVideoSection
        titlePrimary="The Anatomy of a"
        titleAccent="Clean"
        subtitle="See our state-of-the-art DPF cleaning process in action as you scroll."
        baseUrl="https://hdegxhrhakxvgnadulgq.supabase.co/storage/v1/object/public/website-media/frames/"
        filenamePrefix="Timeline 1_"
        startFrame={399}
        endFrame={713}
        reverseLayout={false}
        textBlocks={[
          { title: "Arrival & Inspection", desc: "Every filter is carefully logged and endoscoped before cleaning begins." },
          { title: "Aqueous Cleaning Stage", desc: "Subjected to specialized environmentally safe solutions to safely break down compacted soot, ash, and oil." },
          { title: "High-Pressure Flushing", desc: "A high-pressure reverse flush ensures absolutely zero particulate blockage remains deep within the honeycomb." },
          { title: "Drying & Final Test", desc: "Thoroughly dried and back-pressure tested to confirm the filter has been returned to 98% of its new condition." }
        ]}
      />

      {/* Customer Logos Carousel */}
      <section className="py-20 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <h3 className="text-sm font-bold tracking-[0.2em] text-white/40 uppercase">Trusted by leading fleets & local businesses</h3>
        </div>
        <div className="w-full relative overflow-hidden" style={{ height: '80px' }}>
          <LogoLoop
            logos={customerLogos}
            speed={40}
            direction="left"
            logoHeight={60}
            gap={80}
            fadeOut
            fadeOutColor="#0A0A0A"
            ariaLabel="Customer partner logos"
          />
        </div>
      </section>

      {/* Why Choose AutoCleanse - Immersive List */}
      <section className="py-32 section-gradient-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">

            {/* Left Column: Sticky Header */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-40 reveal-item">
                <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
                  <span className="text-white">Why Choose </span>
                  <br className="hidden lg:block" />
                  <span className="text-[#FF7A00]">Auto Cleanse</span>
                  <span className="text-[#FF7A00]">?</span>
                </h2>
                <p className="text-white/60 text-lg md:text-xl font-medium max-w-sm hidden lg:block leading-relaxed mt-6">
                  We don't just clean filters. We engineer complete flow restorations using state-of-the-art diagnostic and fluid dynamics technology.
                </p>

                {/* DPFs Cleaned Counter */}
                <div className="mt-12 p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 relative overflow-hidden group shadow-2xl shadow-black/50 hidden lg:block max-w-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  {/* Decorative glow */}
                  <div className="absolute -inset-x-20 -top-20 h-[150px] bg-[#FF7A00]/20 blur-[60px] rounded-full pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>

                  <div className="relative z-10">
                    <div className="text-xs font-black tracking-[0.2em] uppercase text-[#FF7A00] mb-3">Track Record</div>
                    <div className="flex items-baseline gap-1">
                      <CountUp
                        from={0}
                        to={100}
                        separator=","
                        direction="up"
                        duration={2.5}
                        className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 tracking-tighter"
                        startWhen={true}
                      />
                      <span className="text-6xl font-black text-[#FF7A00] ml-1">+</span>
                    </div>
                    <div className="text-white/50 font-medium mt-3 text-lg">DPF Systems Restored</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Interactive List */}
            <div className="lg:col-span-7 reveal-container flex flex-col">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 py-10 sm:py-12 border-b border-white/10 last:border-0 hover:-translate-y-1 transition-all duration-500 reveal-item cursor-default"
                >
                  {/* Big Number Ambient Effect */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[100px] sm:text-[140px] font-black text-white/[0.02] group-hover:text-[#FF7A00]/[0.05] group-hover:scale-105 group-hover:-translate-x-4 transition-all duration-700 pointer-events-none z-0">
                    0{index + 1}
                  </div>

                  {/* Icon Block */}
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[#1A1D22] border border-white/5 flex items-center justify-center group-hover:rotate-6 group-hover:border-[#FF7A00]/50 group-hover:shadow-[0_0_30px_rgba(255,122,0,0.2)] transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:text-[#FF7A00] transition-colors duration-500" strokeWidth={1.5} />
                  </div>

                  {/* Text Content */}
                  <div className="relative z-10 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#FF7A00] transition-colors duration-500 tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-white/50 text-lg font-medium leading-relaxed max-w-md group-hover:text-white/70 transition-colors duration-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 section-gradient-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-[#FF7A00]">Our Pricing</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto reveal-container">
            <div className="pricing-card rounded-2xl p-8 text-center reveal-item">
              <h3 className="text-xl font-bold text-white mb-4">Within 10 Miles</h3>
              <div className="text-4xl font-bold text-[#FF7A00] mb-2">£210</div>
              <p className="text-white/60">From Totnes, Devon</p>
            </div>

            <div className="pricing-card rounded-2xl p-8 text-center reveal-item">
              <h3 className="text-xl font-bold text-white mb-4">Outside 10 Miles</h3>
              <div className="text-4xl font-bold text-[#FF7A00] mb-2">£230</div>
              <p className="text-white/60">Nationwide coverage</p>
            </div>

            <div className="pricing-card rounded-2xl p-8 text-center reveal-item">
              <h3 className="text-xl font-bold text-white mb-4">HGV/Plant</h3>
              <div className="text-4xl font-bold text-[#FF7A00] mb-2">£299</div>
              <p className="text-white/60">Heavy vehicles</p>
            </div>
          </div>
        </div>
      </section >

      {/* Specialists in Professional DPF Cleaning */}
      < section className="py-20 section-gradient-2" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="gradient-card rounded-2xl p-8 card-hover">
              <h2 className="text-3xl font-bold text-center mb-8">
                <span className="text-white">Specialists in Professional </span>
                <span className="text-[#FF7A00]">DPF Cleaning</span>
              </h2>

              <div className="text-white/80 leading-relaxed space-y-4 mb-8">
                <p>
                  AutoCleanse specialises primarily in professional off-vehicle DPF cleaning services.
                  Operating from Totnes, Devon, we provide same-day local service within a 30-mile radius,
                  ensuring minimal downtime for trade garages, fleet operators, and individual vehicle owners.
                  Our expertise extends across all vehicle types including cars, vans, HGVs, and plant machinery.
                </p>

                <p>
                  For customers beyond our local service area, we offer comprehensive nationwide postal DPF
                  cleaning with tracked next-day return. Whether you're managing a single vehicle or an
                  entire fleet, our professional cleaning process restores filters to optimal performance
                  while maintaining MOT compliance and emissions standards.
                </p>
              </div>

              <div className="border-t border-[#1A1D22] pt-6">
                <h3 className="text-lg font-bold text-white mb-4">Learn More</h3>
                <div className="space-y-2">
                  <Link
                    to="/why-clean"
                    className="block text-[#FF7A00] hover:text-[#FFB37A] transition-colors text-sm font-medium"
                  >
                    Why clean your DPF instead of replacing it? →
                  </Link>
                  <Link
                    to="/postal-dpf"
                    className="block text-[#FF7A00] hover:text-[#FFB37A] transition-colors text-sm font-medium"
                  >
                    Nationwide postal DPF cleaning →
                  </Link>
                  <Link
                    to="/services"
                    className="block text-[#FF7A00] hover:text-[#FFB37A] transition-colors text-sm font-medium"
                  >
                    View all DPF and emissions services →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >



      {/* 2nd Premium Scroll Video Instance - Zigzag Layout */}
      < ScrollVideoSection
        titlePrimary="Advanced Filter"
        titleAccent="Recovery"
        subtitle="Uncompromising deep cleaning that restores performance."
        baseUrl="https://hdegxhrhakxvgnadulgq.supabase.co/storage/v1/object/public/website-media/2ndframes/"
        filenamePrefix="scroll2_"
        startFrame={0}
        endFrame={149}
        reverseLayout={true}
        textBlocks={
          [
            { title: "Blockage Removal", desc: "Targeted elimination of deep-seated particulate matter." },
            { title: "Performance Uplift", desc: "Restoring airflow to OEM specifications." },
            { title: "Longevity Ensured", desc: "A clean core prevents recurring warning lights." }
          ]}
      />

      {/* Customer Reviews Section */}
      <section className="py-32 section-gradient-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-white">What Our </span>
            <span className="text-[#FF7A00]">Customers Say</span>
          </h2>

          <div className="relative w-full overflow-hidden mt-8">
            {/* Left and Right fade gradients for smooth entrance/exit */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-max animate-marquee py-4">
              {/* Duplicate array mapping twice to create an infinite loop effect */}
              {[...reviews, ...reviews].map((review, index) => (
                <div
                  key={index}
                  className="gradient-card rounded-2xl p-8 card-hover w-[320px] md:w-[450px] mx-4 flex flex-col justify-between flex-shrink-0 whitespace-normal group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex text-[#FF7A00]">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current group-hover:drop-shadow-[0_0_8px_rgba(255,122,0,0.8)] transition-all duration-300" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="bg-[#FF7A00]/10 px-3 py-1 rounded-full border border-[#FF7A00]/20">
                        <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Verified</span>
                      </div>
                    </div>

                    <blockquote className="text-white/90 text-sm md:text-[15px] leading-relaxed mb-6 font-medium">
                      "{review.text}"
                    </blockquote>
                  </div>

                  <div className="border-t border-[#1A1D22] pt-6 flex items-center justify-between group-hover:border-[#FF7A00]/30 transition-colors duration-500">
                    <div>
                      <p className="text-white font-bold">{review.author}</p>
                      {review.company && (
                        <p className="text-xs text-[#FF7A00] font-bold mt-1 uppercase tracking-wider">
                          {review.company}
                        </p>
                      )}
                    </div>
                    {/* Minimal Avatar Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A1D22] to-black border border-white/5 flex items-center justify-center group-hover:border-[#FF7A00]/50 transition-colors duration-500">
                      <span className="text-white/40 font-bold text-sm group-hover:text-[#FF7A00] transition-colors duration-500">
                        {review.author.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Box Services Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">Our </span>
            <span className="text-[#FF7A00]">Capabilities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px] reveal-container">
            {services.map((service, index) => {
              // Determine if this is a large block or wide block to inject extra visuals
              const isLarge = index === 0; // 2x2
              const isWide = index === 3 || index === 6 || index === 7; // 2x1
              const isTall = index === 4; // 1x2

              return (
                <div
                  key={index}
                  className={`glass - panel - heavy rounded - 3xl card - hover reveal - item flex flex - col justify - center items - center text - center group overflow - hidden relative ${getBentoClasses(index)} `}
                >
                  {/* Subtle Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

                  {/* Giant Faded Icon for Wide/Tall Blocks */}
                  {(isWide || isTall) && (
                    <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 text-white/[0.03] group-hover:text-white/[0.05] transition-colors duration-500 z-0 pointer-events-none transform group-hover:scale-110 group-hover:-rotate-12 transition-transform">
                      <service.icon size={160} strokeWidth={1} />
                    </div>
                  )}

                  {/* Specific Image Background for the massive 2x2 DPF block */}
                  {isLarge && (
                    <>
                      <div
                        className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: 'url("/very-dark-grey-and-black-honeycomb-effect-backgrou.png")' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-0"></div>
                    </>
                  )}

                  {/* Core Content */}
                  <div className="relative z-10 flex flex-col items-center w-full transition-all duration-500 group-hover:-translate-y-2">
                    <div className="w-14 h-14 gradient-orange rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,122,0,0.4)] transition-all duration-500 shadow-xl shadow-[#FF7A00]/20">
                      <service.icon size={28} className="text-white" />
                    </div>

                    <h3 className={`font - bold text - white mb - 2 tracking - tight ${isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'} `}>
                      {service.title}
                    </h3>

                    {/* Description: Hides on hover for small cards to make vertical room for the 3 bullet points */}
                    <p className={`text - white / 60 font - medium leading - relaxed transition - all duration - 300 origin - top ${isLarge ? 'text-lg max-w-sm' : 'text-sm group-hover:opacity-0 group-hover:max-h-0 group-hover:mb-0 group-hover:scale-95 max-h-20 mb-2'} `}>
                      {service.description}
                    </p>

                    {/* Feature List Content Revealed On Hover */}
                    <ul className={`font - medium transition - all duration - 500 flex flex - col items - center justify - center w - full ${isLarge ? 'mt-6 opacity-100 text-white/80 text-sm space-y-3' : 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2 text-white/70 text-[13px] space-y-2'} `}>
                      {service.features.map((feature, idx) => (
                        <li key={idx} className={`flex items - center justify - center gap - 2.5 transform translate - y - 3 opacity - 0 transition - all duration - 300 ${isLarge ? 'translate-y-0 opacity-100' : 'group-hover:translate-y-0 group-hover:opacity-100'} `} style={{ transitionDelay: isLarge ? '0ms' : `${idx * 75} ms` }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] flex-shrink-0 shadow-[0_0_8px_rgba(255,122,0,0.8)]"></div>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* We Don't Monkey Around */}
      <section className="py-20 section-gradient-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-white">We don't </span>
            <span className="text-[#FF7A00]">Monkey</span>
            <span className="text-white"> around</span>
          </h2>

          <div className="flex justify-center mb-12">
            <ChevronDown size={32} className="text-[#FF7A00]" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative gradient-card rounded-3xl overflow-hidden aspect-video">
              <iframe
                src="https://drive.google.com/file/d/1R1ZApKEnYmqV6Fkua9HfAxEEHUduej1f/preview"
                className="w-full h-full"
                allow="autoplay"
                title="AutoCleanse DPF Cleaning Process"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 section-gradient-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Trade garages welcome. Fleet operators supported.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <MagneticButton>
              <Link
                to="/postal-dpf"
                className="btn-shine px-8 py-4 rounded-xl font-semibold text-lg text-white hover:text-white inline-block"
              >
                Book now
              </Link>
            </MagneticButton>

            <a
              href="tel:08000430609"
              className="btn-secondary text-white hover:text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center"
            >
              <Phone size={20} className="mr-2" />
              0800 043 0609
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;