import { Link } from 'react-router-dom';
import { Phone, ArrowRight, Activity, Search, ShieldCheck, MapPin, Wrench } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import InfoSection from '../components/InfoSection';
import SymptomList from '../components/SymptomList';
import FaqSection, { type Faq } from '../components/FaqSection';
import Reviews from '../components/Reviews';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import { getReviews, DPF_DIAGNOSTICS_REVIEW_IDS } from '../data/reviews';

const SYMPTOMS = [
  'DPF or engine management warning light',
  'Reduced power or limp mode',
  'Flashing glow-plug light on the dashboard',
  'Frequent or incomplete regeneration cycles',
  'Noticeably higher fuel consumption',
  'A smell of diesel or heavy exhaust soot',
  'Failed or borderline MOT emissions',
  'Active regeneration that never seems to finish',
];

const FAQS: Faq[] = [
  {
    q: 'My DPF warning light is on - does that mean the filter is blocked?',
    a: 'Not necessarily. A DPF or engine management light can be triggered by a genuine blockage, but also by a faulty differential pressure sensor, an EGR problem, a glow-plug fault, or a run of short journeys that never let the car complete a regeneration. That is exactly why we diagnose before recommending any cleaning or parts.',
  },
  {
    q: 'Can you tell whether I need a DPF clean or just a sensor repair?',
    a: 'Yes. We read the live data from your vehicle - differential pressure, soot and ash load, regeneration history and stored fault codes - and use that to identify the actual cause. Sometimes the filter is healthy and the fix is a sensor or a completed regeneration; sometimes a professional off-car clean is the right answer.',
  },
  {
    q: 'Is DPF removal or a DPF delete legal?',
    a: 'No. Removing a diesel particulate filter, or mapping a vehicle to run without one, is illegal for road use in the UK and will fail the MOT. We focus on diagnosing the fault and restoring the filter, not removing it.',
  },
  {
    q: 'How long does a DPF diagnostic take?',
    a: 'A diagnostic check is usually completed within around an hour, depending on the vehicle and what we find. We explain the results and the options clearly before any further work is agreed.',
  },
  {
    q: 'Where are you based and do I need to bring the car to you?',
    a: 'We are based at our workshop in Totnes, Devon. For diagnostics the vehicle normally needs to come to us so we can read live data and road test if required. Call us on 01803 269895 and we will arrange a convenient time.',
  },
  {
    q: 'What happens after the diagnosis?',
    a: 'We give you honest, evidence-based findings and a proportionate recommendation - whether that is a sensor repair, a professional DPF clean, advice on your driving pattern, or no work at all if nothing is wrong. You decide how to proceed.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['AutomotiveService', 'LocalBusiness'],
      '@id': 'https://www.auto-cleanse.co.uk/#business',
      name: 'Auto-Cleanse',
      url: 'https://www.auto-cleanse.co.uk/dpf-diagnostics-devon',
      telephone: '+441803269895',
      email: 'info@auto-cleanse.co.uk',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'The Old Barn Industrial Estate, Webbers Yard',
        addressLocality: 'Totnes',
        addressRegion: 'Devon',
        postalCode: 'TQ9 6JY',
        addressCountry: 'GB',
      },
      geo: { '@type': 'GeoCoordinates', latitude: '50.4316', longitude: '-3.6844' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Devon' },
      priceRange: '££',
    },
    {
      '@type': 'Service',
      name: 'DPF Diagnostics',
      serviceType: 'Diesel Particulate Filter Diagnostics',
      provider: { '@id': 'https://www.auto-cleanse.co.uk/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Devon' },
      url: 'https://www.auto-cleanse.co.uk/dpf-diagnostics-devon',
      description:
        'Evidence-based DPF diagnostics in Devon. We read live engine data, differential pressure, regeneration history and fault codes to find the real cause of a DPF warning light before any cleaning or parts are recommended.',
    },
  ],
};

export default function DPFDiagnosticsDevon() {
  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="DPF Diagnostics Devon | Diagnose Before You Replace"
        description="Professional DPF diagnostics in Devon. We find the real cause of a DPF warning light or limp mode before any cleaning or removal. Call 01803 269895."
        path="/dpf-diagnostics-devon"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'DPF Diagnostics' }]} />

        {/* Hero */}
        <header className="mb-14">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
            <span className="text-white">DPF Diagnostics in </span>
            <span className="text-[#FF7A00]">Devon</span>
          </h1>
          <p className="text-lg md:text-xl text-white/55 max-w-3xl leading-relaxed font-medium">
            Before you pay for DPF cleaning, sensors or a costly replacement, find out what is
            actually wrong. Auto-Cleanse diagnoses the real cause of your DPF warning light using
            live engine data - not guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href="tel:01803269895"
              className="btn-shine px-7 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2"
            >
              <Phone size={18} /> 01803 269895
            </a>
            <a
              href="#enquiry"
              className="px-7 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2"
            >
              Request a callback <ArrowRight size={16} />
            </a>
          </div>
        </header>

        <div className="space-y-8">
          <InfoSection icon={<Search size={26} />} title="What DPF diagnostics involves">
            <p>
              DPF diagnostics is the process of finding the real reason your diesel particulate
              filter warning light is on - before spending money on cleaning, sensors or, worst of
              all, an unnecessary replacement. Using OBD diagnostics and live engine data, we check
              differential pressure readings, soot and ash loading, regeneration history and any
              stored fault codes.
            </p>
            <p>
              As DPF specialists who also clean filters in-house, we know what a healthy DPF looks
              like and how to tell a genuine blockage apart from a sensor or driving-related issue.
            </p>
          </InfoSection>

          {/* Symptoms */}
          <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
              Symptoms you may be experiencing
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Any of these can point to a DPF or emissions issue. Diagnostics tells us which.
            </p>
            <SymptomList items={SYMPTOMS} />
          </section>

          <InfoSection icon={<ShieldCheck size={26} />} title="Why proper diagnostics matter">
            <p>
              A DPF warning light is a symptom, not a diagnosis. The filter itself is often healthy,
              with the real fault lying in a differential pressure sensor, the EGR system, injectors,
              or a run of short journeys that never let the car complete a regeneration.
            </p>
            <p>
              Cleaning or replacing a filter without finding the underlying cause usually means the
              problem comes straight back - and a new DPF can cost many hundreds of pounds. Proper
              diagnostics protect you from paying for work you do not need.
            </p>
          </InfoSection>

          <InfoSection icon={<Activity size={26} />} title="What Auto-Cleanse does">
            <p>
              We start every DPF job with diagnostics, not assumptions. We read your vehicle's live
              data and fault history, confirm whether the filter is actually blocked, and identify
              anything else contributing to the problem.
            </p>
            <p>
              From there we recommend the proportionate fix - a sensor repair, a professional off-car
              DPF clean at our workshop, guidance on regeneration and driving, or simply reassurance
              that nothing further is needed. Everything is explained clearly with transparent
              pricing before we proceed.
            </p>
          </InfoSection>

          <InfoSection icon={<MapPin size={26} />} title="DPF diagnostics across Devon">
            <p>
              Auto-Cleanse is based in Totnes and provides DPF diagnostics for drivers, garages and
              fleets across Devon - including{' '}
              <Link to="/dpf-cleaning-newton-abbot" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">Newton Abbot</Link>,
              Exeter, Plymouth, Torquay and the South Hams. Many customers come to us after being
              quoted for a full DPF replacement elsewhere, wanting a second opinion grounded in real
              data.
            </p>
          </InfoSection>

          {/* Reviews */}
          <section>
            <Reviews
              reviews={getReviews(DPF_DIAGNOSTICS_REVIEW_IDS)}
              heading={<><span className="text-white">Diagnostics Done </span><span className="text-[#FF7A00]">Honestly</span></>}
              intro="Genuine feedback, including a customer whose limp mode was caused by a faulty pressure sensor - not the DPF."
              columns={3}
              showGoogleCta
              showCallCta
            />
          </section>

          {/* FAQ */}
          <section>
            <FaqSection faqs={FAQS} />
          </section>

          {/* Enquiry form */}
          <section id="enquiry" className="relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden scroll-mt-28">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <QuickEnquiryForm
                defaultService="DPF Diagnostics"
                source="dpf-diagnostics-devon"
                heading="Get a DPF Diagnostic Booked"
                subheading="Tell us your symptoms and reg, and we'll call you back to arrange a diagnostic."
              />
            </div>
          </section>

          {/* Related links */}
          <section className="rounded-[2rem] bg-[#1A1D22] border border-white/5 p-7 md:p-10 shadow-xl shadow-black">
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Related services</h2>
            <div className="space-y-3">
              {[
                { to: '/blocked-dpf-cleaning-devon', label: 'Blocked DPF cleaning - symptoms and help' },
                { to: '/dpf-cleaning-devon', label: 'Professional DPF cleaning across Devon' },
                { to: '/dpf-cleaning-newton-abbot', label: 'DPF cleaning near Newton Abbot' },
                { to: '/pricing', label: 'DPF cleaning and diagnostics pricing' },
                { to: '/contact', label: 'Contact Auto-Cleanse' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all group/link">
                  <ArrowRight size={18} className="text-[#FF7A00] mr-4 group-hover/link:translate-x-2 transition-transform" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center rounded-[2.5rem] bg-[#1A1D22] border border-white/5 p-10 md:p-14 shadow-2xl shadow-black">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Not sure if it's the <span className="text-[#FF7A00]">DPF</span>? Let's find out.
            </h2>
            <p className="text-white/55 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              <Wrench size={15} className="inline mb-0.5 mr-1 text-[#FF7A00]" />
              Evidence-based diagnosis before any cleaning or parts. Call us or request a callback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:01803269895" className="btn-shine px-7 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2">
                <Phone size={18} /> 01803 269895
              </a>
              <a href="#enquiry" className="px-7 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
                Request a callback
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
