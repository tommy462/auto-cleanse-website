import React, { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import Tooltip from '../components/Tooltip';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://hook.eu2.make.com/nh3pvoagqc4y22cg5240jqwcjzjdrpa8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          timestamp: new Date().toISOString(),
          source: 'contact_form'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);

      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const socialLinks = [
    { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61573744325360', name: 'Facebook' },
    { Icon: Instagram, href: 'https://www.instagram.com/auto_cleansedpf/', name: 'Instagram' },
    { Icon: Youtube, href: 'https://www.youtube.com/@Auto-Cleanse', name: 'YouTube' },
  ];

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="Contact Us | AutoCleanse" description="Get in touch for professional DPF cleaning services. Call 0800 043 0609 or book a collection." path="/contact" />

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
                    <a href="tel:08000430609" className="text-2xl font-bold text-white hover:text-[#FF7A00] transition-colors">
                      0800 043 0609
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-[#FF7A00]/50 group-hover/item:bg-[#FF7A00]/10 transition-all duration-300">
                    <Mail size={24} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:info@autocleanse.co.uk" className="text-xl font-bold text-white hover:text-[#FF7A00] transition-colors break-all">
                      info@auto-cleanse.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-[#FF7A00]/50 group-hover/item:bg-[#FF7A00]/10 transition-all duration-300">
                    <MapPin size={24} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-wider mb-1">Service Area</p>
                    <p className="text-xl font-bold text-white">Totnes, Devon</p>
                    <p className="text-white/50 text-sm mt-1">30-mile collection radius</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="relative p-10 rounded-3xl bg-[#1A1D22] border border-white/5 overflow-hidden group hover:border-[#FF7A00]/20 transition-colors duration-500">
              <h3 className="relative z-10 text-xl font-bold text-white mb-6">Social Resonance</h3>
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

            <h2 className="relative z-10 text-3xl font-bold text-white mb-8 tracking-tight">Transmission Protocol</h2>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="group/input">
                <label htmlFor="name" className="block text-white/50 font-mono text-sm uppercase tracking-wider mb-2 group-focus-within/input:text-[#FF7A00] transition-colors">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all"
                  placeholder="Lead Engineer"
                />
              </div>

              <div className="group/input">
                <label htmlFor="email" className="block text-white/50 font-mono text-sm uppercase tracking-wider mb-2 group-focus-within/input:text-[#FF7A00] transition-colors">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all"
                  placeholder="contact@fleet.com"
                />
              </div>

              <div className="group/input">
                <label htmlFor="phone" className="block text-white/50 font-mono text-sm uppercase tracking-wider mb-2 group-focus-within/input:text-[#FF7A00] transition-colors">
                  Comms Link
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all"
                  placeholder="07700 900000"
                />
              </div>

              <div className="group/input">
                <label htmlFor="message" className="block text-white/50 font-mono text-sm uppercase tracking-wider mb-2 group-focus-within/input:text-[#FF7A00] transition-colors">
                  Payload *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all resize-none"
                  placeholder="Define requirements... (e.g. 5x Volvo FH DPFs requiring strict turnaround)"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Tooltip content="Direct booking portal pending deployment">
                  <div className="flex-1">
                    <MagneticButton className="w-full h-full block">
                      <button
                        type="button"
                        disabled
                        className="w-full h-full bg-white/5 border border-white/10 text-white/50 px-6 py-4 rounded-xl font-bold opacity-60 cursor-not-allowed transition-all"
                        aria-label="Book now - Coming soon"
                      >
                        Initialize Booking
                      </button>
                    </MagneticButton>
                  </div>
                </Tooltip>

                <div className="flex-1">
                  <MagneticButton className="w-full block">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-black px-6 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Transmitting...' : 'Transmit Data'}
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </form>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">Failed to send message. Please try again or call us directly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;