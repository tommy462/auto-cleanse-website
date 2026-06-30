import { Link } from 'react-router-dom';
import { Phone, ArrowRight, Search, ShieldCheck, MapPin, Wrench, Truck, Check } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import InfoSection from '../components/InfoSection';
import SymptomList from '../components/SymptomList';
import FaqSection, { type Faq } from '../components/FaqSection';
import Reviews from '../components/Reviews';
import LatestPosts from '../components/LatestPosts';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import { getReviews, DPF_DIAGNOSTICS_REVIEW_IDS } from '../data/reviews';

const SYMPTOMS = [
  'A dashboard message such as "Refill AdBlue: starting prevented in 800 miles"',
  'AdBlue, emissions or engine warning light staying on',
  'The vehicle dropping into limp mode or refusing to rev past a certain point',
  'Repeated AdBlue warnings even after a top-up',
  'Reduced power or restricted performance',
  'A no-start that has already happened',
];

const FAULTS = [
  'NOx sensor faults - the single most common culprit, and often misdiagnosed',
  'AdBlue dosing and metering pump failure',
  'AdBlue heater faults, especially after cold snaps',
  'Tank level sensor faults',
  'Crystallised AdBlue blocking injectors and lines',
  'Wiring and connector faults in the SCR circuit',
  'Software and coding - clearing stored faults and running the correct drive cycle so the fix is confirmed',
];

const STEPS = [
  { n: '1', t: 'Call us', d: 'Tell us your vehicle, the warning message and any fault codes. We will tell you the likely cause and next step.' },
  { n: '2', t: 'Diagnosis', d: 'We read the SCR system properly and pinpoint the actual fault, rather than guessing.' },
  { n: '3', t: 'Quote', d: 'Clear, fixed pricing before any work starts.' },
  { n: '4', t: 'Repair', d: 'Carried out at our workshop or at your location.' },
  { n: '5', t: 'Confirmation', d: 'We run the correct drive cycle so the fault is genuinely cleared, not just reset.' },
];

const FAQS: Faq[] = [
  {
    q: 'My van says "no start in X miles" - what do I do?',
    a: 'Act now rather than waiting. The countdown almost always ends in the vehicle refusing to start. Call us with the message and any fault codes and we will get you booked in, garage or mobile.',
  },
  {
    q: 'Can I drive with the AdBlue warning light on?',
    a: 'Usually yes, for a short while, but it is a countdown, not a suggestion. Once it reaches zero many vehicles will not restart until the fault is fixed. Do not ignore it.',
  },
  {
    q: 'Will repairing it pass the MOT?',
    a: 'Yes. A correct repair restores the system to how it was designed to work, which is exactly what keeps you MOT-compliant and road-legal.',
  },
  {
    q: 'How much does AdBlue repair cost?',
    a: 'It depends on the fault - a NOx sensor is very different to a dosing pump. We diagnose first and give you a fixed quote before any work starts. Call us with your fault codes for a free initial assessment over the phone.',
  },
  {
    q: 'Do you offer mobile AdBlue repair in Devon?',
    a: 'Yes. We cover Devon with both garage and mobile service, which is handy when the vehicle is already in a no-start. Tell us your location when you call and we will confirm availability.',
  },
  {
    q: 'Is an "AdBlue delete" legal?',
    a: 'No. Disabling the AdBlue system is illegal on any vehicle used on UK roads, fails the MOT and can void your insurance. That is why we repair the fault properly instead.',
  },
  {
    q: 'How long does it take?',
    a: 'Most common faults are a same-day or next-day job once diagnosed. We will tell you up front when you call.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['AutomotiveService', 'LocalBusiness'],
      '@id': 'https://www.auto-cleanse.co.uk/#business',
      name: 'Auto-Cleanse',
      url: 'https://www.auto-cleanse.co.uk/adblue-repair-devon',
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
      name: 'AdBlue Repair and Diagnostics',
      serviceType: 'AdBlue and SCR System Repair',
      provider: { '@id': 'https://www.auto-cleanse.co.uk/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Devon' },
      url: 'https://www.auto-cleanse.co.uk/adblue-repair-devon',
      description:
        'Diagnosis and repair of AdBlue and SCR system faults across Devon - NOx sensors, dosing pumps, heaters, tank sensors, crystallisation and wiring faults. Garage and mobile service from our Totnes workshop.',
    },
  ],
};

export default function AdBlueRepairDevon() {
  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="AdBlue Repair & Diagnostics Devon | SCR & NOx Faults | Auto-Cleanse"
        description="AdBlue warning, a no-start countdown or limp mode? Auto-Cleanse diagnose and repair AdBlue and SCR faults properly across Devon - garage or mobile. NOx sensors, dosing pumps and more."
        path="/adblue-repair-devon"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ name: 'Services', path: '/services' }, { name: 'AdBlue Repair & Diagnostics' }]} />

        {/* Hero */}
        <header className="mb-14">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
            <span className="text-white">AdBlue Repair & Diagnostics in </span>
            <span className="text-[#FF7A00]">Devon</span>
          </h1>
          <p className="text-lg md:text-xl text-white/55 max-w-3xl leading-relaxed font-medium">
            Seeing an AdBlue warning, a "no start in X miles" countdown, or your van dropping into limp
            mode? Do not panic, and do not keep clearing the warning, because that rarely stops the
            countdown. Auto-Cleanse diagnose and repair AdBlue and SCR system faults properly. Garage
            or mobile across Devon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href="tel:01803269895"
              className="btn-shine px-7 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2"
            >
              <Phone size={18} /> Call 01803 269895
            </a>
            <a
              href="#enquiry"
              className="px-7 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2"
            >
              Get a quote <ArrowRight size={16} />
            </a>
          </div>
          <p className="text-white/40 text-sm mt-4">
            Call for same-day help, or request a quote below.
          </p>
        </header>

        <div className="space-y-8">
          {/* Symptoms */}
          <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
              Got an AdBlue fault? Here is what you are probably seeing
            </h2>
            <p className="text-white/50 text-sm mb-6">
              AdBlue faults almost always announce themselves before they strand you. The common warning signs:
            </p>
            <SymptomList items={SYMPTOMS} />
            <p className="text-white/55 text-sm leading-relaxed mt-6">
              If you are already in a countdown, act early. It almost always ends in the vehicle
              refusing to start, usually at the worst possible moment.
            </p>
            <p className="text-white/45 text-sm leading-relaxed mt-3">
              Common fault codes we see: P20EE, P204F, P207F, P20E8, P229F and P203F - SCR efficiency,
              dosing, NOx sensor and reductant faults.
            </p>
          </section>

          {/* Faults we repair */}
          <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-5 shrink-0 text-[#FF7A00]">
                <Wrench size={26} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">AdBlue faults we repair</h2>
            </div>
            <p className="text-white/60 text-base md:text-lg mb-6">
              The system fails in a handful of predictable ways. We diagnose the actual cause rather
              than guessing, then fix it:
            </p>
            <ul className="space-y-3">
              {FAULTS.map((fault) => (
                <li key={fault} className="flex items-start gap-3 text-white/70 text-sm md:text-base leading-relaxed">
                  <Check size={18} className="text-[#FF7A00] shrink-0 mt-0.5" />
                  <span>{fault}</span>
                </li>
              ))}
            </ul>
          </section>

          <InfoSection icon={<ShieldCheck size={26} />} title="Why we diagnose, rather than guess">
            <p>
              AdBlue and SCR faults are routinely misdiagnosed, and the most common culprit, a NOx
              sensor, is easy to get wrong. Throwing parts at the problem is expensive and often does
              not fix it.
            </p>
            <p>
              We read the system properly, pinpoint the actual fault, and only then quote. After the
              repair we run the correct drive cycle so the fault is genuinely cleared and confirmed,
              not simply reset to reappear days later. It is the same evidence-based approach we bring
              to{' '}
              <Link to="/dpf-diagnostics-devon" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">DPF fault diagnostics</Link>.
            </p>
          </InfoSection>

          <InfoSection icon={<MapPin size={26} />} title="Garage or mobile, across Devon">
            <p>
              Two ways to get sorted: bring it to us at our Totnes workshop, or we come to you with
              mobile AdBlue diagnostics and repair across Devon - ideal if the van is already in a
              no-start.
            </p>
            <p>
              We are based at The Old Barn Industrial Estate, Webbers Yard, Totnes. For mobile visits,
              tell us your location when you call and we will confirm availability and timing.
            </p>
          </InfoSection>

          {/* How it works */}
          <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-6">How it works</h2>
            <div className="space-y-4">
              {STEPS.map((step) => (
                <div key={step.n} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center shrink-0 text-[#FF7A00] font-black text-sm">
                    {step.n}
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{step.t}</p>
                    <p className="text-white/55 text-sm leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <InfoSection icon={<Truck size={26} />} title="Vehicles we cover">
            <p>
              Vans and commercial diesels are our bread and butter - Ford Transit and Custom, Mercedes
              Sprinter and Vito, VW Crafter and Transporter, Vauxhall Vivaro, Peugeot Boxer, Citroen
              Relay, Renault and Nissan - plus Euro 6 diesel cars. If it runs AdBlue, we can almost
              certainly help.
            </p>
            <p>
              Many of these are the same vehicles we{' '}
              <Link to="/ecu-remapping" className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">remap</Link>{' '}
              and clean DPFs for, so the diagnostics carry across.
            </p>
          </InfoSection>

          {/* Reviews */}
          <section>
            <Reviews
              reviews={getReviews(DPF_DIAGNOSTICS_REVIEW_IDS)}
              heading={<><span className="text-white">Honest Diagnostics, </span><span className="text-[#FF7A00]">Not Guesswork</span></>}
              intro="Genuine feedback on our diagnostic work, including a customer whose limp mode turned out to be a faulty sensor rather than a costly repair."
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
                defaultService="AdBlue / SCR Repair"
                source="adblue-repair-devon"
                heading="Get Your AdBlue Fault Sorted"
                subheading="Tell us your vehicle, the warning message and any fault codes, and we'll call you back."
              />
            </div>
          </section>

          {/* Related links */}
          <section className="rounded-[2rem] bg-[#1A1D22] border border-white/5 p-7 md:p-10 shadow-xl shadow-black">
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Related services</h2>
            <div className="space-y-3">
              {[
                { to: '/dpf-diagnostics-devon', label: 'DPF fault diagnostics' },
                { to: '/dpf-cleaning-devon', label: 'DPF cleaning across Devon' },
                { to: '/ecu-remapping', label: 'ECU remapping' },
                { to: '/contact', label: 'Contact us for a quote' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all group/link">
                  <ArrowRight size={18} className="text-[#FF7A00] mr-4 group-hover/link:translate-x-2 transition-transform" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Latest from the workshop */}
          <section>
            <LatestPosts category="AdBlue" />
          </section>

          {/* Final CTA */}
          <section className="text-center rounded-[2.5rem] bg-[#1A1D22] border border-white/5 p-10 md:p-14 shadow-2xl shadow-black">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Don't get stranded. <span className="text-[#FF7A00]">Get it sorted.</span>
            </h2>
            <p className="text-white/55 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              <Search size={15} className="inline mb-0.5 mr-1 text-[#FF7A00]" />
              We'll diagnose and repair your AdBlue fault properly, before it leaves you stuck.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:01803269895" className="btn-shine px-7 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2">
                <Phone size={18} /> Call 01803 269895
              </a>
              <a href="#enquiry" className="px-7 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
                Request a quote
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
