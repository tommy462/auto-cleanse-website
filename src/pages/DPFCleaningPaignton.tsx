import { useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Settings, Shield, Truck, ArrowRight, CalendarClock } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import { getReviews, DPF_TOWN_REVIEW_IDS } from '../data/reviews';
import { localBusinessNode, BUSINESS_ID } from '../data/business';
import { trackEvent } from '../lib/tracking';

gsap.registerPlugin(ScrollTrigger);

// Matches the CTA event convention used on the other DPF location pages. Phone
// links are already counted site-wide as `phone_click` by <LeadTracking>.
const trackCta = (cta: string, type: 'phone' | 'booking') =>
  trackEvent('dpf_cta_click', { cta_location: cta, cta_type: type, page_path: '/dpf-cleaning-paignton' });

const DPFCleaningPaignton = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('.reveal-container').forEach((container) => {
      const items = container.querySelectorAll('.reveal-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: container, start: 'top 85%' }
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-10 pb-16 md:pt-28 md:pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="DPF Cleaning Paignton | From £210 | Auto-Cleanse"
        description="Professional off-vehicle DPF cleaning for Paignton from Auto-Cleanse. Machine cleaned and flow tested before and after, from £210. Call 01803 269895."
        path="/dpf-cleaning-paignton"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          localBusinessNode({
            description:
              'Professional off-vehicle DPF cleaning for Paignton and Torbay, carried out at the Auto-Cleanse workshop in Totnes, Devon, around 12 miles away. Filters are flow tested before and after cleaning. We do not offer mobile or roadside DPF cleaning.',
            serviceType: 'DPF Cleaning',
            areaServed: [
              { '@type': 'City', name: 'Paignton' },
              { '@type': 'City', name: 'Torquay' },
              { '@type': 'City', name: 'Brixham' },
              { '@type': 'AdministrativeArea', name: 'Devon' },
            ],
          }),
          {
            '@type': 'Service',
            name: 'DPF Cleaning Paignton',
            serviceType: 'Diesel Particulate Filter Cleaning',
            provider: { '@id': BUSINESS_ID },
            areaServed: [
              { '@type': 'City', name: 'Paignton' },
              { '@type': 'AdministrativeArea', name: 'Devon' },
            ],
            url: 'https://www.auto-cleanse.co.uk/dpf-cleaning-paignton',
            description:
              'Off-vehicle machine cleaning of diesel particulate filters for Paignton and Torbay, with flow testing before and after cleaning.',
            offers: [
              { '@type': 'Offer', name: 'DPF Cleaning - from', priceCurrency: 'GBP', price: '210.00', availability: 'https://schema.org/InStock' },
              { '@type': 'Offer', name: 'DPF Cleaning - collection or UK postal', priceCurrency: 'GBP', price: '230.00', availability: 'https://schema.org/InStock' },
            ],
          },
        ],
      }) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'Paignton' }]} />

        {/* Hero. Deliberately outside the GSAP reveal system: the previous
            word-reveal set the H1 to opacity 0 until hydration, which delayed the
            prerendered LCP element. Layout and styling are otherwise unchanged. */}
        <header className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.05] drop-shadow-2xl">
            <span className="text-white">DPF Cleaning </span>
            <span className="text-[#FF7A00] font-mono">Paignton.</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full" />

          <p className="text-lg md:text-2xl text-white/60 leading-relaxed font-medium max-w-3xl mx-auto">
            Professional off-vehicle DPF cleaning for Paignton and Torbay, machine cleaned at our
            Totnes workshop and flow tested before and after.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col items-center gap-5 sm:gap-6">
            <p className="inline-flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-2xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 px-5 py-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">From</span>
              <span className="text-3xl md:text-4xl font-black text-[#FF7A00] font-mono tracking-tight">£210</span>
              <span className="text-sm font-medium text-white/50">DPF machine clean</span>
            </p>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="tel:01803269895"
                onClick={() => trackCta('hero', 'phone')}
                className="btn-shine px-6 sm:px-7 py-4 rounded-xl font-bold text-white text-base sm:text-lg inline-flex items-center justify-center gap-2.5 min-h-[52px]"
                aria-label="Call Auto-Cleanse on 01803 269895"
              >
                <Phone size={20} aria-hidden="true" /> Call 01803 269895
              </a>
              <Link
                to="/book"
                onClick={() => trackCta('hero', 'booking')}
                className="px-6 sm:px-7 py-4 rounded-xl font-bold text-white text-base sm:text-lg border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2.5 min-h-[52px]"
              >
                Book DPF Cleaning <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto space-y-8 reveal-container">
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Truck size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Collection from Paignton, or drop it in</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Our Totnes workshop is around 12 miles from Paignton via the A385. DPF cleaning starts from £210, with collection and return or nationwide postal cleaning from £230. Filters from Paignton garages and private customers can be collected on our Torbay run alongside Torquay and Brixham, cleaned with our METclean XL process, and returned - often the same working day for filters with us before 10am. Collection depends on where we are running that week, so call to check rather than assume a slot.
              </p>
              <p>
                A lot of Paignton diesels do short, slow, stop-start miles that never let a regeneration finish, which is exactly how filters load up in the first place. Off-vehicle cleaning clears the soot a regen never burnt off along with the ash it never could, and the filter is flow tested before and after so the change is measured.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Shield size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">DPF Cleaning vs Replacement - Paignton</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Professional cleaning can often restore a serviceable blocked filter for a fraction of replacement cost. Cleaning starts from £210, with collection and return or nationwide postal cleaning from £230, against a replacement filter that runs from many hundreds to several thousand pounds depending on the vehicle.
              </p>
              <p>
                Cleaning also keeps your original, vehicle-matched filter in place rather than swapping in an aftermarket part. It is not always possible - a cracked, melted or collapsed substrate may not be recoverable - which is why we inspect and test the filter before cleaning it rather than promising an outcome up front.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Settings size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">All Vehicle Types Covered</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                We clean DPFs from cars, vans, taxis, HGVs, and plant machinery - covering the full range of vehicles operating in Paignton and the Torbay area. Our process includes full inspection, aqueous cleaning, high-pressure pneumatic flush, and back-pressure flow testing before and after.
              </p>
              <p>
                We also offer <Link to="/ecu-remapping" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">ECU remapping</Link> for Paignton vehicles - Stage 1 maps are particularly popular with van and taxi operators looking to improve fuel economy.
              </p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Also Near Paignton</h2>
            </div>
            <div className="text-white/60 leading-relaxed space-y-4 text-lg md:text-xl font-medium relative z-10">
              <p>As well as Paignton, we serve Torquay, Brixham, Totnes, Newton Abbot, Dartmouth and all of South Devon. Nationwide postal DPF cleaning is also available if you prefer to courier your filter directly to us.</p>
            </div>
          </section>

          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">Related Services</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/dpf-cleaning', label: 'DPF cleaning Devon - main hub' },
                { to: '/dpf-cleaning-torquay', label: 'DPF cleaning Torquay' },
                { to: '/dpf-diagnostics-devon', label: 'DPF diagnostics - find the cause first' },
                { to: '/blocked-dpf-cleaning-devon', label: 'Blocked DPF? Warning light & limp mode help' },
                { to: '/ecu-remapping', label: 'ECU remapping - Stage 1 & Stage 2' },
                { to: '/pricing', label: 'DPF cleaning prices from £210' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all group/link">
                  <ArrowRight size={20} className="text-[#FF7A00] mr-4 group-hover/link:translate-x-2 transition-transform" />
                  <span className="font-medium text-lg">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="reveal-item">
            <Reviews
              reviews={getReviews(DPF_TOWN_REVIEW_IDS)}
              heading={<><span className="text-white">Trusted for </span><span className="text-[#FF7A00]">DPF Cleaning</span></>}
              columns={3}
              showGoogleCta
              showCallCta
            />
          </section>

          <section className="reveal-item">
            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <QuickEnquiryForm
                  defaultService="DPF Cleaning"
                  source="dpf-cleaning-paignton"
                  heading="Request a DPF Cleaning Callback"
                  subheading="Send your details and we'll call you back about your DPF clean."
                />
              </div>
            </div>
          </section>

          <section className="text-center mt-16 reveal-item">
            <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                DPF Cleaning for <span className="text-[#FF7A00]">Paignton</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Around 12 miles from our Totnes workshop, on the Torbay collection run. Trade and private work both welcome.
              </p>
              <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <a
                  href="tel:01803269895"
                  onClick={() => trackCta('final', 'phone')}
                  className="btn-shine px-8 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-3 text-lg min-h-[52px]"
                  aria-label="Call Auto-Cleanse on 01803 269895"
                >
                  <Phone size={22} aria-hidden="true" /> Call 01803 269895
                </a>
                <Link
                  to="/book"
                  onClick={() => trackCta('final', 'booking')}
                  className="px-8 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-3 text-lg min-h-[52px]"
                >
                  <CalendarClock size={22} className="text-[#FF7A00]" aria-hidden="true" /> Book DPF Cleaning
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DPFCleaningPaignton;
