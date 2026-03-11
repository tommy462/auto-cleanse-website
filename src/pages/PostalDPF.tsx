import React, { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { Package, Truck, CheckCircle, Clock, Mail, Phone, MapPin, FileText } from 'lucide-react';
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

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
  county: string;
  postcode: string;
  vehicleRegistration: string;
  vehicleMakeModel: string;
  additionalNotes: string;
}

interface JobResponse {
  jobReference: string;
  uuid: string;
}

const PostalDPF = () => {
  // FAQ Schema Markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does postal DPF cleaning work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Send your DPF to us via courier, we professionally clean it using our METclean XL system, then return it via tracked next-day delivery. The process includes full inspection, deep cleaning, flow testing, and detailed reporting."
        }
      },
      {
        "@type": "Question",
        "name": "Who is postal DPF cleaning suitable for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our postal DPF cleaning service is suitable for independent garages, fleet operators, plant machinery businesses, agricultural contractors, and individual vehicle owners across the UK who need professional off-vehicle filter refurbishment."
        }
      },
      {
        "@type": "Question",
        "name": "What is the turnaround time for postal DPF cleaning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Once we receive your DPF, we complete the cleaning process and dispatch it back via tracked next-day delivery. Total turnaround depends on courier collection and delivery times in your area."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide nationwide postal DPF cleaning coverage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our postal DPF cleaning service covers the entire UK. We work with trusted courier partners to provide collection and tracked return delivery to any UK address."
        }
      }
    ]
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    town: '',
    county: '',
    postcode: '',
    vehicleRegistration: '',
    vehicleMakeModel: '',
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [jobDetails, setJobDetails] = useState<JobResponse | null>(null);
  const [showStep2, setShowStep2] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const scrollToStep1 = () => {
    document.getElementById('step1-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate unique job reference using timestamp + random component
    const timestamp = Date.now();
    const randomComponent = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const jobReference = `AC-P-${timestamp.toString().slice(-4)}${randomComponent.slice(-1)}`;
    const uuid = crypto.randomUUID();

    const webhookData = {
      type: 'postal_dpf_booking',
      jobReference: jobReference,
      uuid: uuid,
      ...formData,
      timestamp: new Date().toISOString(),
    };

    try {
      // Send to both webhooks simultaneously
      const [dashboardResponse, newWebhookResponse] = await Promise.all([
        fetch('https://hook.eu2.make.com/evn7araur9v4nmczy9qdhrcpxsmbx7x5', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        }),
        fetch('https://hook.eu2.make.com/hgo0e3xl6pkrpbana7zj4uuy1vexa6u4', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        })
      ]);

      // Check if at least one webhook succeeded
      if (dashboardResponse.ok || newWebhookResponse.ok) {
        let data = {};

        // Try to get response data from the first successful webhook
        try {
          if (dashboardResponse.ok) {
            const contentType = dashboardResponse.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
              data = await dashboardResponse.json();
            }
          } else if (newWebhookResponse.ok) {
            const contentType = newWebhookResponse.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
              data = await newWebhookResponse.json();
            }
          }
        } catch (parseError) {
          console.log('Could not parse webhook response as JSON, using generated values');
        }

        // Use webhook response if available, otherwise use our generated values
        const finalJobReference = (data as any).jobReference || jobReference;
        const finalUuid = (data as any).uuid || uuid;

        setJobDetails({ jobReference: finalJobReference, uuid: finalUuid });
        setSubmitStatus('success');
        setShowStep2(true);

        // Smooth scroll to step 2
        setTimeout(() => {
          document.getElementById('step2-courier')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
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

  const processSteps = [
    {
      icon: Package,
      title: 'Your DPF is collected or dropped off',
      description: 'Courier collects from your address or you drop off at a depot',
    },
    {
      icon: CheckCircle,
      title: 'We receive and inspect it',
      description: 'Full inspection and pre-cleaning assessment',
    },
    {
      icon: Clock,
      title: 'Deep cleaning and flow testing',
      description: 'Professional cleaning using our METclean XL system',
    },
    {
      icon: Mail,
      title: 'Payment requested',
      description: 'Invoice sent once cleaning is complete',
    },
    {
      icon: Truck,
      title: 'DPF returned via tracked next-day delivery',
      description: 'Secure packaging with full tracking information',
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
      <SEO title="Nationwide Postal DPF Cleaning | Next-Day Return" description="Send us your blocked DPF from anywhere in the UK. We'll clean it to 98% efficiency and return it next day." path="/postal-dpf" />
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Postal DPF Cleaning –', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Nationwide</span>
            </span>
            {splitText('Service', 'text-[#FF7A00]')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium mb-10">
              Send your DPF to us, we'll deep-clean and return it via tracked next-day delivery.
            </p>
            <MagneticButton className="inline-block">
              <button
                onClick={scrollToStep1}
                className="bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg mx-auto"
              >
                Book a Postal Clean
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Professional Nationwide Postal DPF Cleaning Section */}
        <section className="mb-24 reveal-container">
          <div className="max-w-5xl mx-auto">
            <div className="relative p-10 md:p-14 rounded-[3rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <h2 className="text-4xl font-black text-white mb-8 text-center tracking-tight leading-tight">
                Professional Nationwide <span className="text-[#FF7A00] font-mono">Postal DPF Cleaning</span>
              </h2>

              <div className="text-white/60 text-lg font-medium leading-relaxed space-y-6 mb-12 max-w-4xl mx-auto">
                <p>
                  Our postal DPF cleaning service provides professional off-vehicle filter refurbishment
                  for garages, fleet operators, plant machinery businesses, and individual vehicle owners
                  across the UK. When local services aren't available or convenient, our nationwide
                  postal service ensures your DPF receives the same professional cleaning standards
                  we deliver locally in Devon.
                </p>

                <p>
                  Using our METclean XL system, we restore filters to optimal performance, ensuring
                  MOT compliance and emissions standards are met. Each filter undergoes comprehensive
                  flow testing before and after cleaning, with detailed reporting provided for your records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0A0A0A]/50 p-8 rounded-[2rem] border border-white/5">
                  <h3 className="text-2xl font-bold text-white mb-6">Service Benefits</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start text-white/70 text-lg font-medium">
                      <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                      <span>Cost-effective alternative to replacement</span>
                    </li>
                    <li className="flex items-start text-white/70 text-lg font-medium">
                      <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                      <span>Fully cleaned, tested and reported</span>
                    </li>
                    <li className="flex items-start text-white/70 text-lg font-medium">
                      <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                      <span>Suitable for cars, vans, HGVs and plant</span>
                    </li>
                    <li className="flex items-start text-white/70 text-lg font-medium">
                      <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                      <span>Tracked next-day return</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0A]/50 p-8 rounded-[2rem] border border-white/5">
                  <h3 className="text-2xl font-bold text-white mb-6">Who We Serve</h3>
                  <div className="space-y-4 text-white/70 text-lg font-medium">
                    <p className="flex items-center"><span className="text-[#FF7A00] mr-3">•</span> Independent garages</p>
                    <p className="flex items-center"><span className="text-[#FF7A00] mr-3">•</span> Fleet operators</p>
                    <p className="flex items-center"><span className="text-[#FF7A00] mr-3">•</span> Plant machinery businesses</p>
                    <p className="flex items-center"><span className="text-[#FF7A00] mr-3">•</span> Agricultural contractors</p>
                    <p className="flex items-center"><span className="text-[#FF7A00] mr-3">•</span> Individual vehicle owners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 1: Booking Form */}
        <section id="step1-form" className="mb-24 reveal-container">
          <div className="max-w-3xl mx-auto">
            <div className="relative p-10 md:p-14 rounded-[3rem] bg-[#1A1D22] border-2 border-[#FF7A00]/10 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>

              <div className="text-center mb-10 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                  <FileText size={36} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Step 1: Booking Details</h2>
                <p className="text-white/60 text-lg font-medium">Provide your details and we'll set up your postal cleaning job</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="fullName" className="block text-white/80 font-bold mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0A0A0A] border z-20 border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white/80 font-bold mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-white/80 font-bold mb-3">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg"
                    placeholder="Your phone number"
                  />
                </div>

                <div className="bg-[#0A0A0A]/50 p-6 rounded-2xl border border-white/5 space-y-6">
                  <label className="block text-[#FF7A00] font-bold text-xl mb-2">
                    Collection Address
                  </label>
                  <div className="space-y-6">
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg"
                      placeholder="Address Line 1 *"
                    />
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg"
                      placeholder="Address Line 2"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input
                        type="text"
                        id="town"
                        name="town"
                        value={formData.town}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg"
                        placeholder="Town/City *"
                      />
                      <input
                        type="text"
                        id="county"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg"
                        placeholder="County"
                      />
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg uppercase"
                        placeholder="Postcode *"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="vehicleRegistration" className="block text-white/80 font-bold mb-3">
                      Vehicle Registration *
                    </label>
                    <input
                      type="text"
                      id="vehicleRegistration"
                      name="vehicleRegistration"
                      value={formData.vehicleRegistration}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg uppercase font-mono"
                      placeholder="e.g. AB12 CDE"
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicleMakeModel" className="block text-white/80 font-bold mb-3">
                      Vehicle Make & Model *
                    </label>
                    <input
                      type="text"
                      id="vehicleMakeModel"
                      name="vehicleMakeModel"
                      value={formData.vehicleMakeModel}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg"
                      placeholder="e.g. Ford Transit"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="additionalNotes" className="block text-white/80 font-bold mb-3">
                    Additional Notes
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#FF7A00] rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/20 transition-all text-lg resize-none"
                    placeholder="Any additional information about your DPF or special requirements"
                  />
                </div>

                <MagneticButton className="block w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Continue to Courier Booking'}
                  </button>
                </MagneticButton>
              </form>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl relative z-10 text-center animate-pulse">
                  <p className="text-green-400 text-lg font-bold">Booking created successfully! Please continue to Step 2 below.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl relative z-10 text-center">
                  <p className="text-red-400 text-lg font-bold">Failed to create booking. Please try again or call us directly.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Step 2: Courier Booking (only shown after Step 1 success) */}
        {showStep2 && (
          <section id="step2-courier" className="mb-24 reveal-container">
            <div className="max-w-3xl mx-auto">
              <div className="relative p-10 md:p-14 rounded-[3rem] bg-[#1A1D22] border-2 border-[#FF7A00] reveal-item shadow-[0_0_50px_rgba(255,122,0,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-[#FF7A00] text-black border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,122,0,0.4)]">
                    <Truck size={36} />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Step 2: Book Your Courier Collection</h2>
                  <p className="text-white/70 text-lg font-medium max-w-xl mx-auto">
                    We partner with Parcel2Go to give you access to multiple trusted couriers at the best available prices.
                    Please book your courier below to send your DPF to us.
                  </p>
                </div>

                {/* Job Reference Highlight */}
                {jobDetails && (
                  <div className="bg-[#0A0A0A] rounded-[2rem] p-8 mb-10 border border-[#FF7A00]/50 relative z-10 shadow-inner">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#FF7A00]/20 flex items-center justify-center mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]">
                        <Package size={20} className="text-[#FF7A00]" />
                      </div>
                      Your Auto-Cleanse Reference
                    </h3>
                    <div className="text-4xl font-black text-[#FF7A00] mb-4 tracking-wider font-mono bg-[#1A1D22] p-4 rounded-xl text-center border border-[#FF7A00]/20">
                      {jobDetails.jobReference}
                    </div>
                    <p className="text-white/60 font-medium mb-6 text-center text-lg">
                      Please include this reference inside the parcel
                    </p>

                    <div className="border-t border-white/10 pt-6">
                      <h4 className="text-white font-bold mb-4 flex items-center text-lg">
                        <MapPin size={20} className="mr-3 text-[#FF7A00]" />
                        Delivery Address:
                      </h4>
                      <div className="text-white/70 text-lg font-medium space-y-1 bg-[#1A1D22] p-6 rounded-xl border border-white/5">
                        <p className="text-white font-bold">Auto-Cleanse</p>
                        <p>The Old Barn Industrial Estate</p>
                        <p>Webbers Yard Estate</p>
                        <p>Totnes, Devon</p>
                        <p className="text-[#FF7A00] font-bold text-xl mt-2">TQ9 6JY</p>
                        <p>United Kingdom</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Courier Booking CTA */}
                <div className="text-center mb-10 relative z-10">
                  <MagneticButton className="inline-block w-full sm:w-auto">
                    <a
                      href="https://www.parcel2go.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-10 py-5 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(255,122,0,0.4)] hover:shadow-[0_0_40px_rgba(255,122,0,0.6)] flex items-center justify-center text-xl uppercase tracking-wider"
                    >
                      Book Courier via Parcel2Go
                    </a>
                  </MagneticButton>
                </div>

                {/* Reassurance Block */}
                <div className="bg-[#0A0A0A]/30 rounded-2xl p-6 mb-6 relative z-10 border border-white/5">
                  <ul className="space-y-4">
                    <li className="flex items-start text-white/70 text-lg font-medium">
                      <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                      <span>Book collection or drop-off via Parcel2Go</span>
                    </li>
                    <li className="flex items-start text-white/70 text-lg font-medium">
                      <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                      <span>Package securely and drain excess fluids</span>
                    </li>
                    <li className="flex items-start text-white/70 text-lg font-medium">
                      <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                      <span>We'll notify you as soon as your DPF arrives</span>
                    </li>
                  </ul>
                </div>

                {/* Legal Disclaimer */}
                <p className="text-white/40 text-sm text-center relative z-10 font-medium max-w-lg mx-auto">
                  Courier services are provided directly by the selected carrier via Parcel2Go.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* What Happens Next */}
        <section className="mb-24 reveal-container">
          <div className="text-center mb-12 reveal-item">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              What Happens <span className="text-[#FF7A00] font-mono">Next</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6 lg:space-x-8 group reveal-item">
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-20 h-20 bg-[#1A1D22] border border-[#FF7A00]/30 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.15)] relative z-10">
                      <step.icon size={36} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#0A0A0A] border-2 border-[#FF7A00] rounded-full flex items-center justify-center z-20 shadow-lg">
                      <span className="text-[#FF7A00] font-black">{index + 1}</span>
                    </div>

                    {/* Connecting Line */}
                    {index < processSteps.length - 1 && (
                      <div className="absolute top-20 left-10 w-0.5 h-full bg-gradient-to-b from-[#FF7A00] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-[#1A1D22] border border-white/5 rounded-[2rem] p-8 group-hover:border-[#FF7A00]/20 transition-all duration-500 shadow-xl shadow-black relative overflow-hidden mt-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#FF7A00] transition-colors relative z-10">{step.title}</h3>
                    <p className="text-white/60 text-lg font-medium leading-relaxed relative z-10">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center mt-20 reveal-container pb-10">
          <div className="reveal-item relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Questions about <span className="text-[#FF7A00]">postal cleaning?</span>
            </h3>
            <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Contact us if you need help with packaging, have special requirements, or want to discuss your specific needs.
            </p>

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton className="block">
                <a
                  href="tel:08000430609"
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg"
                >
                  <Phone size={20} className="mr-3 text-[#FF7A00]" />
                  0800 043 0609
                </a>
              </MagneticButton>
              <MagneticButton className="block">
                <a
                  href="mailto:info@autocleanse.co.uk"
                  className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg"
                >
                  <Mail size={20} className="mr-3" />
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

export default PostalDPF;