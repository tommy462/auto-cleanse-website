import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Truck, Clock, Shield, Settings, Wrench, Zap, ChevronLeft, ChevronRight, CheckCircle2, Droplets, Leaf, Settings2, BarChart3, ArrowRight, MousePointer2, Play, Facebook, Instagram, Youtube } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoopingVideoSection from '../components/LoopingVideoSection';
import SEO from '../components/SEO';
import VehicleSchema from '../components/VehicleSchema';
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
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
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
        title="DPF Cleaning & ECU Remapping | Devon & Nationwide"
        description="Professional DPF cleaning and ECU remapping services. Same-day filter return within Devon, nationwide postal service, and Stage 1 & 2 remap tuning available."
        path="/"
      />
      <VehicleSchema />
      {/* JSON-LD Schema Stacking */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": ["AutomotiveService", "LocalBusiness"],
              "name": "AutoCleanse",
              "alternateName": ["Auto Cleanse", "AutoCleanse DPF", "AutoCleanse Remapping"],
              "description": "Professional DPF cleaning and ECU remapping services based in Totnes, Devon. Specialists in off-vehicle DPF cleaning, Stage 1 & 2 ECU remapping, SCR, DOC and GPF cleaning for cars, vans, HGVs and commercial fleets across Devon and the UK.",
              "url": "https://auto-cleanse.co.uk",
              "telephone": "0800 043 0609",
              "email": "info@autocleanse.co.uk",
              "image": "https://auto-cleanse.co.uk/og-image.jpg",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "The Old Barn Industrial Estate, Webbers Yard Estate",
                "addressLocality": "Totnes",
                "addressRegion": "Devon",
                "postalCode": "TQ9 6JY",
                "addressCountry": "GB"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "50.4316",
                "longitude": "-3.6844"
              },
              "areaServed": [
                { "@type": "City", "name": "Totnes" },
                { "@type": "City", "name": "Exeter" },
                { "@type": "City", "name": "Plymouth" },
                { "@type": "City", "name": "Torquay" },
                { "@type": "City", "name": "Paignton" },
                { "@type": "City", "name": "Newton Abbot" },
                { "@type": "City", "name": "Dartmouth" },
                { "@type": "City", "name": "Kingsbridge" },
                { "@type": "City", "name": "Salcombe" },
                { "@type": "City", "name": "Ashburton" },
                { "@type": "City", "name": "Buckfastleigh" },
                { "@type": "City", "name": "Ivybridge" },
                { "@type": "City", "name": "Tavistock" },
                { "@type": "City", "name": "Okehampton" },
                { "@type": "City", "name": "Barnstaple" },
                { "@type": "City", "name": "Tiverton" },
                { "@type": "City", "name": "Teignmouth" },
                { "@type": "City", "name": "Dawlish" },
                { "@type": "City", "name": "Bovey Tracey" },
                { "@type": "AdministrativeArea", "name": "Devon" },
                { "@type": "AdministrativeArea", "name": "Cornwall" },
                { "@type": "AdministrativeArea", "name": "South West England" },
                { "@type": "Country", "name": "United Kingdom" }
              ],
              "serviceType": ["DPF Cleaning", "ECU Remapping", "SCR Cleaning", "DOC Cleaning", "GPF Cleaning", "EGR Cleaning"],
              "hasOfferingCatalog": {
                "@type": "OfferingCatalog",
                "name": "DPF Cleaning & ECU Remapping Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "DPF Cleaning",
                      "description": "Professional off-vehicle DPF cleaning restoring filters to 98% of original flow capacity. Same-day return locally in Devon.",
                      "url": "https://auto-cleanse.co.uk/services"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "ECU Remapping",
                      "description": "Stage 1 and Stage 2 ECU remapping for cars, vans and HGVs in Devon. Improved power, torque and fuel economy. Safely calibrated.",
                      "url": "https://auto-cleanse.co.uk/remapping"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Postal DPF Cleaning",
                      "description": "Nationwide postal DPF cleaning with tracked next-day return. Send your DPF from anywhere in the UK.",
                      "url": "https://auto-cleanse.co.uk/postal-dpf"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "SCR Cleaning",
                      "description": "Selective Catalytic Reduction system cleaning and AdBlue line clearance."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "DOC Cleaning",
                      "description": "Diesel Oxidation Catalyst cleaning with pre and post flow testing."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "GPF Cleaning",
                      "description": "Gasoline Particulate Filter cleaning for petrol vehicles."
                    }
                  }
                ]
              },
              "openingHoursSpecification": [
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": "08:00", "closes": "17:00" },
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "08:00", "closes": "17:00" },
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "08:00", "closes": "17:00" },
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "08:00", "closes": "17:00" },
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "08:00", "closes": "17:00" }
              ],
              "paymentAccepted": "Cash, Card, Bank Transfer",
              "currenciesAccepted": "GBP",
              "priceRange": "££",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=61573744325360",
                "https://www.instagram.com/auto_cleansedpf/",
                "https://www.youtube.com/@Auto-Cleanse",
                "https://www.linkedin.com/in/alex-rabone-102786158/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "0800 043 0609",
                "contactType": "customer service",
                "availableLanguage": "English",
                "areaServed": "GB",
                "contactOption": "TollFree"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "9",
                "bestRating": "5",
                "worstRating": "1"
              },
              "keywords": "DPF cleaning Devon, DPF cleaning near me, ECU remapping Devon, car remapping Devon, DPF cleaning Exeter, DPF cleaning Plymouth, DPF cleaning Torquay, engine tuning Devon, blocked DPF Devon, DPF cleaning cost UK"
            },
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Off-Vehicle DPF Cleaning Devon",
              "provider": { "@type": "LocalBusiness", "name": "AutoCleanse", "url": "https://auto-cleanse.co.uk" },
              "areaServed": [
                { "@type": "AdministrativeArea", "name": "Devon" },
                { "@type": "Country", "name": "United Kingdom" }
              ],
              "description": "Professional off-vehicle Diesel Particulate Filter (DPF) cleaning using aqueous and pneumatic systems. Same-day return locally in Devon, next-day return nationwide.",
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "GBP",
                "lowPrice": "210.00",
                "highPrice": "299.00",
                "url": "https://auto-cleanse.co.uk/pricing"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "ECU Remapping Devon",
              "provider": { "@type": "LocalBusiness", "name": "AutoCleanse", "url": "https://auto-cleanse.co.uk" },
              "areaServed": { "@type": "AdministrativeArea", "name": "Devon" },
              "description": "Stage 1 and Stage 2 ECU remapping for cars, vans, HGVs and commercial vehicles in Devon. Improved power, torque and fuel economy. Custom fleet maps available.",
              "url": "https://auto-cleanse.co.uk/remapping"
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
                    "text": "Locally in Devon, we offer same-day service for collections before 10am. For our nationwide postal service, turnaround is 24-48 hours from collection to return delivery."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much does DPF cleaning cost?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DPF cleaning starts from £210 within 10 miles of Totnes, Devon. Outside 10 miles is £230, and HGV/plant vehicles are £299. All prices include collection, deep clean, flow testing and return."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is ECU remapping legal in the UK?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, ECU remapping is legal in the UK. You should notify your insurance provider as it counts as a modification. We write all maps within safe mechanical limits."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you offer ECU remapping in Devon?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. AutoCleanse offers Stage 1 and Stage 2 ECU remapping for cars, vans, HGVs and commercial vehicles across Devon. Custom and fleet maps are also available."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What areas of Devon do you cover for DPF cleaning?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We cover all of Devon including Totnes, Exeter, Plymouth, Torquay, Paignton, Newton Abbot, Dartmouth, Kingsbridge, Tavistock and beyond. Nationwide postal DPF cleaning is also available."
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

      {/* Hero Section - Split */}
      <section className="relative overflow-hidden hero-section">
        {/* Background Image - Parallax */}
        <div
          className="absolute inset-x-0 -top-[20%] h-[140%] bg-cover bg-center bg-no-repeat hero-bg"
          style={{ backgroundImage: `url('/very-dark-grey-and-black-honeycomb-effect-backgrou.png')` }}
        ></div>

        {/* Tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0A0A0A]"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 py-32 pt-36 lg:py-28 lg:min-h-[90vh] hero-content">

          {/* Left Panel — DPF Cleaning */}
          <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-14 rounded-3xl bg-black/50 border border-white/10 backdrop-blur-sm">
            <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4 hero-subtitle">Emission Control</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-5 leading-[1.05] hero-title drop-shadow-2xl">
              {splitText('DPF Cleaning.', 'text-white')}
              <br />
              <span className="inline-block overflow-hidden pb-2 -mb-2">
                <span className="inline-block word-reveal text-[#FF7A00]">Done right.</span>
              </span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg md:text-xl font-medium mb-6 max-w-md leading-relaxed hero-subtitle">
              Professional off-vehicle filter cleaning with same-day return within Devon. Nationwide postal service available.
            </p>
            <div className="flex flex-wrap gap-3 hero-subtitle">
              <Link to="/postal-dpf" className="btn-shine px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white hover:text-white inline-block">
                Book DPF Clean
              </Link>
              <Link to="/services" className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white border border-white/20 hover:bg-white/10 transition-colors inline-block">
                Our Process
              </Link>
            </div>
          </div>

          {/* Right Panel — ECU Remapping */}
          <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-14 rounded-3xl bg-[#FF7A00]/8 border border-[#FF7A00]/25 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle orange glow behind the right panel */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF7A00]/15 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4 hero-subtitle">Performance Tuning</div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-5 leading-[1.05] drop-shadow-2xl">
                <span className="text-white block">ECU</span>
                <span className="text-white block">Remapping.</span>
                <span className="text-white/30 italic font-medium block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">Unlocked.</span>
              </h2>
              <p className="text-white/70 text-base sm:text-lg md:text-xl font-medium mb-6 max-w-md leading-relaxed hero-subtitle">
                Stage 1 &amp; 2 maps tailored to your vehicle. More power, better economy, sharper throttle response — safely calibrated.
              </p>
              <div className="flex flex-wrap gap-3 hero-subtitle">
                <Link to="/remapping" className="btn-shine px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white hover:text-white inline-block">
                  Explore Remapping
                </Link>
                <Link to="/remapping-booking" className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white border border-[#FF7A00]/30 hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 transition-all inline-block">
                  Book a Remap
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Premium Anatomy of a Clean Section */}
      <LoopingVideoSection
        titlePrimary="The Anatomy of a"
        titleAccent="Clean"
        subtitle="Watch our state-of-the-art DPF cleaning process in action."
        videoUrl="https://hdegxhrhakxvgnadulgq.supabase.co/storage/v1/object/public/website-media/websitevid1.mp4"
        reverseLayout={false}
        variant="steps"
        textBlocks={[
          { title: "Arrival & Inspection", desc: "Every filter is carefully logged and endoscoped before cleaning begins." },
          { title: "Aqueous Cleaning Stage", desc: "Eco-safe solutions break down compacted soot, ash, and oil." },
          { title: "High-Pressure Flushing", desc: "A reverse flush ensures zero particulate blockage remains deep within the honeycomb." },
          { title: "Drying & Final Test", desc: "Every filter back-pressure tested before it leaves us — restored to 98% of new." }
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
                <div className="mt-12 p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 relative overflow-hidden group shadow-2xl shadow-black/50 block max-w-sm">
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
                <span className="text-white">Specialists in </span>
                <span className="text-[#FF7A00]">DPF Cleaning & ECU Remapping</span>
              </h2>

              <div className="text-white/80 leading-relaxed space-y-4 mb-8">
                <p>
                  AutoCleanse provides two core services: professional off-vehicle DPF cleaning and ECU remapping.
                  Operating from Totnes, Devon, we deliver same-day local filter cleaning within a 30-mile radius
                  alongside tailored Stage 1 &amp; 2 remap tuning for cars, vans, HGVs, and plant machinery.
                </p>

                <p>
                  For customers beyond our local area, we offer nationwide postal DPF cleaning with tracked
                  next-day return. Whether you need a blocked filter restored to OEM performance or an ECU
                  map that unlocks more power and better economy, AutoCleanse has you covered.
                </p>
              </div>

              <div className="border-t border-[#1A1D22] pt-6">
                <h3 className="text-lg font-bold text-white mb-4">Explore Our Services</h3>
                <div className="space-y-2">
                  <Link
                    to="/remapping"
                    className="block text-[#FF7A00] hover:text-[#FFB37A] transition-colors text-sm font-medium"
                  >
                    ECU remapping — Stage 1, Stage 2 &amp; custom maps →
                  </Link>
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
                    View all filter and emissions services →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >



      {/* Advanced Filter Recovery Section */}
      <LoopingVideoSection
        titlePrimary="Advanced Filter"
        titleAccent="Recovery"
        subtitle="Uncompromising deep cleaning that restores performance."
        videoUrl="https://hdegxhrhakxvgnadulgq.supabase.co/storage/v1/object/public/website-media/websitevid2.mp4"
        reverseLayout={true}
        variant="editorial"
        textBlocks={[
          { title: "Blockage Removal", desc: "Targeted elimination of deep-seated particulate matter." },
          { title: "Performance Uplift", desc: "Airflow restored to factory spec — guaranteed." },
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
                  className={`glass-panel-heavy rounded-3xl card-hover reveal-item flex flex-col justify-center items-center text-center group overflow-hidden relative ${getBentoClasses(index)}`}
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

                    <h3 className={`font-bold text-white mb-2 tracking-tight ${isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                      {service.title}
                    </h3>

                    {/* Description: Hides on hover for small cards to make vertical room for the 3 bullet points */}
                    <p className={`text-white/60 font-medium leading-relaxed transition-all duration-300 origin-top ${isLarge ? 'text-lg max-w-sm' : 'text-sm group-hover:opacity-0 group-hover:max-h-0 group-hover:mb-0 group-hover:scale-95 max-h-20 mb-2'}`}>
                      {service.description}
                    </p>

                    {/* Feature List Content Revealed On Hover */}
                    <ul className={`font-medium transition-all duration-500 flex flex-col items-center justify-center w-full ${isLarge ? 'mt-6 opacity-100 text-white/80 text-sm space-y-3' : 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2 text-white/70 text-[13px] space-y-2'}`}>
                      {service.features.map((feature, idx) => (
                        <li key={idx} className={`flex items-center justify-center gap-2.5 transform translate-y-3 opacity-0 transition-all duration-300 ${isLarge ? 'translate-y-0 opacity-100' : 'group-hover:translate-y-0 group-hover:opacity-100'}`} style={{ transitionDelay: isLarge ? '0ms' : `${idx * 75}ms` }}>
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




      {/* ECU Remapping Promo Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/20 transition-colors duration-500 reveal-container">
            {/* Background glow */}
            <div className="absolute -inset-x-20 -top-20 h-[250px] bg-[#FF7A00]/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00]/5 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Content */}
              <div className="p-10 lg:p-14 flex flex-col justify-center reveal-item">
                <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">Now Available</div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4 leading-tight">
                  ECU Remapping<br />
                  <span className="text-white/40 italic font-medium">for every vehicle.</span>
                </h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed mb-8 max-w-lg">
                  Stage 1 maps for everyday drivers. Stage 2 for those who want more. Custom maps for fleet and commercial operators.
                  Every remap is tailored, dyno-verified, and safe.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/remapping"
                    className="btn-shine px-8 py-4 rounded-xl font-bold text-base text-white hover:text-white inline-block"
                  >
                    Learn About Remapping
                  </Link>
                  <Link
                    to="/remapping-booking"
                    className="px-8 py-4 rounded-xl font-bold text-base text-white border border-white/20 hover:bg-white/10 transition-colors inline-block"
                  >
                    Book a Remap
                  </Link>
                </div>
              </div>

              {/* Right: Stats / Features */}
              <div className="border-t lg:border-t-0 lg:border-l border-white/5 p-10 lg:p-14 grid grid-cols-2 gap-6 reveal-item">
                {[
                  { stat: 'Stage 1', label: 'Safe, road-legal power gain', mono: true },
                  { stat: 'Stage 2', label: 'Hardware-matched performance', mono: true },
                  { stat: 'MPG+', label: 'Improved fuel economy on most maps', mono: false },
                  { stat: 'Custom', label: 'Fleet & commercial bespoke maps', mono: true },
                ].map(({ stat, label, mono }) => (
                  <div key={stat} className="flex flex-col justify-center">
                    <div className={`text-3xl font-black text-[#FF7A00] mb-2 ${mono ? 'font-mono' : ''}`}>{stat}</div>
                    <div className="text-white/50 text-sm font-medium leading-snug">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 section-gradient-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trade garages welcome. Fleet operators supported.
          </h2>
          <p className="text-white/50 text-lg font-medium mb-8">DPF cleaning &amp; ECU remapping — one trusted team.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <MagneticButton>
              <Link
                to="/postal-dpf"
                className="btn-shine px-8 py-4 rounded-xl font-semibold text-lg text-white hover:text-white inline-block"
              >
                Book DPF Clean
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link
                to="/remapping-booking"
                className="px-8 py-4 rounded-xl font-semibold text-lg text-white border border-white/20 hover:bg-white/10 transition-colors inline-block"
              >
                Book a Remap
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