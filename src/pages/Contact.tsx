import { useRef } from 'react';
import SEO from '../components/SEO';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import QuickEnquiryForm from '../components/QuickEnquiryForm';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

const Contact = () => {
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

  const socialLinks = [
    { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61573744325360', name: 'Facebook' },
    { Icon: Instagram, href: 'https://www.instagram.com/auto_cleansedpf/', name: 'Instagram' },
    { Icon: Youtube, href: 'https://www.youtube.com/@Auto-Cleanse', name: 'YouTube' },
  ];

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="Contact AutoCleanse | DPF Cleaning & Remapping" description="Contact AutoCleanse for DPF cleaning or ECU remapping in Devon. Call us on 01803 269895 or send an enquiry. Same-day response." path="/contact" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact AutoCleanse",
        "description": "Contact AutoCleanse for DPF cleaning and ECU remapping services in Devon.",
        "url": "https://www.auto-cleanse.co.uk/contact",
        "mainEntity": {
          "@type": ["LocalBusiness", "AutomotiveService"],
          "name": "Auto-Cleanse",
          "telephone": "+441803269895",
          "email": "info@auto-cleanse.co.uk",
          "address": { "@type": "PostalAddress", "streetAddress": "The Old Barn Industrial Estate, Webbers Yard", "addressLocality": "Totnes", "addressRegion": "Devon", "postalCode": "TQ9 6JY", "addressCountry": "GB" },
          "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00" }],
          "contactPoint": { "@type": "ContactPoint", "telephone": "+441803269895", "contactType": "customer service", "areaServed": "GB", "availableLanguage": "English" }
        }
      })}} />

      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FF7A00]/5 blur-[120px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Contact', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">AutoCleanse.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto leading-relaxed font-medium reveal-item">
            Get in touch to discuss your requirements, arrange a collection, or ask any questions about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 reveal-container">
          {/* Contact Information */}
          {/* Contact Information */}
          <div className="space-y-8 reveal-item">
            <div className="relative p-10 rounded-3xl bg-[#1A1D22] border border-white/5 overflow-hidden group hover:border-[#FF7A00]/20 transition-colors duration-500">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br from-[#FF7A00] to-transparent"></div>

              <h2 className="relative z-10 text-3xl font-bold text-white mb-10 tracking-tight">Direct Access</h2>

              <div className="relative z-10 space-y-8">
                <div className="flex items-start space-x-6 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-[#FF7A00]/50 group-hover/item:bg-[#FF7A00]/10 transition-all duration-300">
                    <Phone size={24} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:01803269895" className="text-2xl font-bold text-white hover:text-[#FF7A00] transition-colors">
                      01803 269895
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-[#FF7A00]/50 group-hover/item:bg-[#FF7A00]/10 transition-all duration-300">
                    <Mail size={24} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:info@auto-cleanse.co.uk" className="text-xl font-bold text-white hover:text-[#FF7A00] transition-colors break-all">
                      info@auto-cleanse.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-[#FF7A00]/50 group-hover/item:bg-[#FF7A00]/10 transition-all duration-300">
                    <MapPin size={24} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-wider mb-1">Workshop</p>
                    <p className="text-lg font-bold text-white leading-snug">Auto-Cleanse</p>
                    <p className="text-white/60 text-sm mt-1 leading-relaxed">
                      The Old Barn Industrial Estate, Webbers Yard,<br />Totnes, Devon, TQ9 6JY
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-[#FF7A00]/50 group-hover/item:bg-[#FF7A00]/10 transition-all duration-300">
                    <Clock size={24} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-wider mb-1">Opening Hours</p>
                    <p className="text-lg font-bold text-white">Monday-Friday, 08:00-17:00</p>
                    <p className="text-white/50 text-sm mt-1">Serving trade &amp; private customers across Devon. DPF cleaning is workshop/off-vehicle or postal; ECU remapping is workshop or mobile across Devon.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="relative p-10 rounded-3xl bg-[#1A1D22] border border-white/5 overflow-hidden group hover:border-[#FF7A00]/20 transition-colors duration-500">
              <h3 className="relative z-10 text-xl font-bold text-white mb-6">Follow Us</h3>
              <div className="relative z-10 flex flex-wrap gap-4">
                {socialLinks.map(({ Icon, href, name }) => (
                  <MagneticButton key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00] hover:shadow-[0_0_20px_rgba(255,122,0,0.4)] rounded-2xl flex items-center justify-center transition-all duration-300 group/icon"
                      aria-label={`Follow us on ${name}`}
                    >
                      <Icon size={24} className="text-white/70 group-hover/icon:text-black transition-colors" />
                    </a>
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {/* Contact Form */}
          <div className="relative p-10 rounded-3xl bg-[#1A1D22] border border-white/5 overflow-hidden reveal-item shadow-2xl shadow-black/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A00]/5 blur-[80px] rounded-full pointer-events-none"></div>

            <h2 className="relative z-10 text-3xl font-bold text-white mb-2 tracking-tight">Send an Enquiry</h2>
            <p className="relative z-10 text-white/50 text-sm mb-8">
              Leave your details and we&rsquo;ll call you back. Fields marked * are required.
            </p>

            <div className="relative z-10">
              <QuickEnquiryForm source="contact_page" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;