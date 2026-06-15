import { Link } from 'react-router-dom';
import { Phone, ArrowRight, Gauge, Filter, ShieldCheck, MapPin, Wrench } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import InfoSection from '../components/InfoSection';
import SymptomList from '../components/SymptomList';
import FaqSection, { type Faq } from '../components/FaqSection';
import Reviews from '../components/Reviews';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import { getReviews, BLOCKED_DPF_REVIEW_IDS } from '../data/reviews';

const SYMPTOMS = [
  'A DPF or engine warning light that stays on',
  'Limp mode or a sudden loss of power',
  'A regeneration that fails or never completes',
  'Rising fuel consumption',
  'Excessive exhaust smoke or soot',
  'A strong smell of diesel',
  'Rough running, hesitation or poor throttle response',
  'Failed or borderline MOT emissions',
];

const FAQS: Faq[] = [
  {
    q: 'What are the signs of a blocked DPF?',
    a: 'The most common signs are a DPF or engine management warning light, a drop into limp mode or reduced power, a regeneration that will not complete, higher fuel use, excessive exhaust soot, and sometimes a smell of diesel. A diagnostic check confirms whether the filter is genuinely blocked.',
  },
  {
    q: 'Can a blocked DPF be cleaned, or does it need replacing?',
    a: 'In the large majority of cases a blocked DPF can be professionally cleaned and restored rather than replaced. A new filter can cost many hundreds to several thousand pounds, whereas an off-car clean keeps your original, vehicle-matched filter. We only suggest replacement if the filter is physically damaged.',
  },
  {
    q: 'Why does my DPF keep blocking?',
    a: 'Repeated blocking usually points to an underlying cause - a faulty pressure sensor, an EGR issue, injector problems, or a driving pattern of mostly short journeys that never allow a full regeneration. We diagnose the cause so the clean lasts, rather than just treating the symptom.',
  },
  {
    q: 'Will a blocked DPF fail my MOT?',
    a: 'It can. A heavily blocked or warning-lit DPF can cause excessive smoke and an emissions failure, and a missing or tampered DPF is an automatic MOT failure. Cleaning the filter and resolving the fault is the legal, road-safe route.',
  },
  {
    q: 'Can I keep driving with a blocked DPF or in limp mode?',
    a: 'It is not advisable. Limp mode is the car protecting itself, and continuing to drive can put extra strain on other components. It is best to get it checked promptly - call us on 01803 269895.',
  },
  {
    q: 'How quickly can you turn a DPF clean around?',
    a: 'For off-car cleaning at our Totnes workshop, filters received early in the day can often be returned the same working day locally in Devon. We confirm timing when you contact us.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['AutomotiveService', 'LocalBusiness'],
      '@id': 'https://www.auto-cleanse.co.uk/#business',
      name: 'Auto-Cleanse',
      url: 'https://www.auto-cleanse.co.uk/blocked-dpf-cleaning-devon',
      telephone: '01803 269895',
      email: 'info@auto-cleanse.co.uk',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'The Old Barn Industrial Estate, Webbers Yard Estate',
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
      name: 'Blocked DPF Cleaning',
      serviceType: 'Diesel Particulate Filter Cleaning',
      provider: { '@id': 'https://www.auto-cleanse.co.uk/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Devon' },
      url: 'https://www.auto-cleanse.co.uk/blocked-dpf-cleaning-devon',
      description:
        'Diagnosis and professional off-car cleaning of blocked diesel particulate filters in Devon - warning light, limp mode, failed regeneration and poor performance. Workshop-based machine cleaning with before-and-after flow testing.',
    },
  ],
};

export default function BlockedDPFCleaningDevon() {
  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Blocked DPF Cleaning Devon | Warning Light & Limp Mode Help | Auto-Cleanse"
        description="Blocked DPF in Devon? Auto-Cleanse diagnoses and professionally cleans blocked diesel particulate filters - warning light, limp mode, failed regen and poor performance. Totnes-based, same-day local return."
        path="/blocked-dpf-cleaning-devon"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'Blocked DPF Cleaning' }]} />

        {/* Hero */}
        <header className="mb-14">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
            <span className="text-white">Blocked DPF Cleaning in </span>
            <span className="text-[#FF7A00]">Devon</span>
          </h1>
          <p className="text-lg md:text-xl text-white/55 max-w-3xl leading-relaxed font-medium">
            Warning light on, stuck in limp mode, or a regeneration that will not finish? Auto-Cleanse
            diagnoses the cause and professionally cleans blocked diesel particulate filters from our
            Totnes workshop - so the fix actually lasts.
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
          <InfoSection icon={<Filter size={26} />} title="What a blocked DPF actually is">
            <p>
              A blocked diesel particulate filter happens when soot and ash build up faster than the
              vehicle can burn it off during regeneration. Once the filter is restricted, the car
              protects itself - usually by triggering a warning light and dropping into limp mode.
            </p>
            <p>
              Left unresolved, a blocked DPF affects performance, fuel economy and emissions, and can
              lead to further faults. The good news is that in most cases the filter can be cleaned
              and restored rather than replaced.
            </p>
          </InfoSection>

          {/* Symptoms */}
          <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
              Blocked DPF symptoms
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Recognise any of these? Get it checked before it gets worse.
            </p>
            <SymptomList items={SYMPTOMS} />
          </section>

          <InfoSection icon={<ShieldCheck size={26} />} title="Why diagnosis matters first">
            <p>
              A blocked DPF is very often a symptom of something else - a faulty differential pressure
              sensor, an EGR fault, worn injectors, or simply too many short, stop-start journeys that
              never allow a full regeneration.
            </p>
            <p>
              If the filter is cleaned but the underlying cause is left, it will block again. That is
              why we check the root cause before we clean, so the result lasts rather than returning a
              few weeks later.
            </p>
          </InfoSection>

          <InfoSection icon={<Wrench size={26} />} title="What Auto-Cleanse does">
            <p>
              We begin with a diagnostic check to confirm the blockage and look for any underlying
              cause. If a clean is the right answer, we carry out professional off-car DPF cleaning at
              our Totnes workshop using a dedicated cleaning machine, with before-and-after flow and
              weight testing so you can see the result.
            </p>
            <p>
              We also advise on how to reduce the chance of it happening again. Same-day return is
              available locally in Devon, and{' '}
              <Link to="/postal-dpf" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">nationwide postal DPF cleaning</Link>{' '}
              is available if you can remove the filter yourself.
            </p>
          </InfoSection>

          <InfoSection icon={<MapPin size={26} />} title="Blocked DPF help across Devon">
            <p>
              Auto-Cleanse cleans blocked DPFs for drivers, independent garages and fleets right
              across Devon - including{' '}
              <Link to="/dpf-cleaning-newton-abbot" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">Newton Abbot</Link>,
              Exeter, Plymouth, Torquay and the South Hams - from our workshop near Totnes.
            </p>
          </InfoSection>

          {/* Reviews */}
          <section>
            <Reviews
              reviews={getReviews(BLOCKED_DPF_REVIEW_IDS)}
              heading={<><span className="text-white">Real Devon </span><span className="text-[#FF7A00]">DPF Results</span></>}
              intro="Genuine feedback from customers who came to us with blocked DPF and warning-light problems."
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
                defaultService="DPF Cleaning"
                source="blocked-dpf-cleaning-devon"
                heading="Get Your Blocked DPF Sorted"
                subheading="Tell us your symptoms and reg, and we'll call you back to get it diagnosed and cleaned."
              />
            </div>
          </section>

          {/* Related links */}
          <section className="rounded-[2rem] bg-[#1A1D22] border border-white/5 p-7 md:p-10 shadow-xl shadow-black">
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Related services</h2>
            <div className="space-y-3">
              {[
                { to: '/dpf-diagnostics-devon', label: 'DPF diagnostics - find the real cause first' },
                { to: '/dpf-cleaning-devon', label: 'Professional DPF cleaning across Devon' },
                { to: '/dpf-cleaning-newton-abbot', label: 'DPF cleaning near Newton Abbot' },
                { to: '/postal-dpf', label: 'Nationwide postal DPF cleaning' },
                { to: '/pricing', label: 'DPF cleaning prices' },
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
              Blocked DPF? <span className="text-[#FF7A00]">Let's get you moving.</span>
            </h2>
            <p className="text-white/55 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              <Gauge size={15} className="inline mb-0.5 mr-1 text-[#FF7A00]" />
              Diagnosed and cleaned properly, with same-day local return where possible.
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
