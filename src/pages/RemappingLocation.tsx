import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  MapPin, Phone, Zap, ArrowRight, CheckCircle, ChevronDown,
  Wrench, BarChart3, Settings2, Truck, Fuel, Shield,
} from 'lucide-react';
import SEO from '../components/SEO';
import MagneticButton from '../components/MagneticButton';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import { getReviews, ECU_COMPACT_REVIEW_IDS } from '../data/reviews';
import { getLocationBySlug, REMAP_LOCATIONS } from '../data/remapping-locations';
import { localBusinessSchema } from '../data/business';
import { getVehicleBySlug } from '../data/vehicle-remapping';
import { DpfTrustSignal, RecentRemaps } from '../components/CampaignSections';
import { PRIORITY_SLUGS } from '../data/campaign';

// Curated default set of high-interest vehicles to cross-link from location pages.
const DEFAULT_POPULAR_VEHICLES = [
  'bmw-320d-remap',
  'vw-transporter-remap',
  'ford-transit-custom-remap',
  'ford-ranger-remap',
  'audi-a3-remap',
  'vw-golf-gtd-remap',
];

// Major towns that get a dedicated, richer "Popular vehicles we remap in {town}" section.
const MAJOR_TOWN_SLUGS = new Set([
  'ecu-remapping-torquay',
  'ecu-remapping-exeter',
  'ecu-remapping-newton-abbot',
  'ecu-remapping-paignton',
  'ecu-remapping-plymouth',
  'ecu-remapping-totnes',
  'ecu-remapping-barnstaple',
]);

// Cross-links to core remapping services shown on every location page.
const RELATED_SERVICES = [
  { to: '/ecu-remapping', label: 'ECU Remapping (main guide)' },
  { to: '/mobile-ecu-remapping-devon', label: 'Mobile ECU Remapping in Devon' },
  { to: '/stage-1-remaps-devon', label: 'Stage 1 Remaps in Devon' },
];

const SERVICES = [
  { icon: <Zap size={20} />, title: 'Stage 1 Remap', desc: 'Software-only tune for standard vehicles - the most popular upgrade. More power, better torque, sharper throttle.' },
  { icon: <BarChart3 size={20} />, title: 'Stage 2 Remap', desc: 'For vehicles with hardware upgrades. Optimised maps to match intercooler, exhaust or intake changes.' },
  { icon: <Fuel size={20} />, title: 'Economy Remap', desc: 'Diesel-focused tuning to reduce fuel consumption - popular with van drivers and high-mileage commuters.' },
  { icon: <Truck size={20} />, title: 'Van & Commercial', desc: 'Transit, Sprinter, Crafter, Trafic and more. Better pulling power and economy for working vehicles.' },
  { icon: <Settings2 size={20} />, title: 'Custom / Fleet Map', desc: 'Consistent mapping across multiple vehicles, tailored for fleet operators and commercial customers.' },
  { icon: <Wrench size={20} />, title: 'DPF Clean + Remap Bundle', desc: 'Combine a professional DPF clean with an ECU remap where suitable. Removal and refit can be arranged subject to availability, or trade customers can supply the filter off the vehicle.' },
];

const TRUST = [
  'Pre and post-remap diagnostic check included',
  'Real vehicle footage - see our results on social media',
  'Professional OBD and bench flashing equipment',
  'Experienced with petrol, diesel, 4x4 and commercial vehicles',
  'Google-reviewed local business',
  'DPF and EGR experience across hundreds of vehicles',
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-white font-semibold text-sm leading-snug group-hover:text-[#FF7A00] transition-colors">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-[#FF7A00] shrink-0 mt-0.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Answer is always rendered in the DOM so it appears in the prerendered
          HTML (indexable); it is only visually collapsed when the accordion is
          closed, preserving the click-to-expand UX. */}
      <p
        className={`text-white/50 text-sm leading-relaxed pb-5 -mt-1${open ? '' : ' hidden'}`}
        aria-hidden={!open}
      >
        {a}
      </p>
    </div>
  );
}

export default function RemappingLocation() {
  const { slug } = useParams<{ slug: string }>();
  const location = getLocationBySlug(slug ?? '');

  if (!location) return <Navigate to="/ecu-remapping" replace />;

  const relatedLocations = location.relatedSlugs
    .map((s) => REMAP_LOCATIONS.find((l) => l.slug === s))
    .filter(Boolean) as typeof REMAP_LOCATIONS;

  const isMajorTown = MAJOR_TOWN_SLUGS.has(location.slug);
  const popularVehicles = (location.popularVehicles ?? DEFAULT_POPULAR_VEHICLES)
    .map((s) => getVehicleBySlug(s))
    .filter(Boolean)
    .slice(0, 6) as ReturnType<typeof getVehicleBySlug>[];
  // Don't self-link (e.g. the mobile-ecu-remapping-devon page shouldn't link to itself).
  const relatedServices = RELATED_SERVICES.filter((s) => s.to !== `/${location.slug}`);

  const schema = localBusinessSchema({
    description: `ECU remapping service covering ${location.name} and ${location.region}. Stage 1, Stage 2, economy and mobile remapping for cars, vans and commercial vehicles. DPF cleaning is carried out off the vehicle at our Totnes workshop, not at the roadside.`,
    serviceType: 'ECU Remapping',
    areaServed: [
      { '@type': 'City', name: location.name },
      { '@type': 'AdministrativeArea', name: 'Devon' },
      ...location.nearbyAreas.map((a) => ({ '@type': 'City', name: a })),
    ],
  });

  // FAQPage schema built from the same location.faqs data that renders on the
  // page, so the structured data always matches the visible FAQ text exactly.
  const faqSchema =
    location.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: location.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <SEO
        title={location.metaTitle}
        description={location.metaDescription}
        path={`/${location.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[400px] bg-[#FF7A00]/6 blur-[130px] rounded-[100%] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <Breadcrumbs items={[
            { name: 'ECU Remapping', path: '/ecu-remapping' },
            { name: 'Locations', path: '/ecu-remapping-locations' },
            { name: location.name }
          ]} />

          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-[#FF7A00]" />
            <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest">
              {location.region}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05] mb-6">
            {location.h1.split(location.name).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-[#FF7A00]">{location.name}</span>
                )}
              </span>
            ))}
          </h1>

          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-10">
            {location.intro}
          </p>

          <div className="flex flex-wrap gap-3">
            <MagneticButton>
              <Link
                to="/remapping-booking"
                className="btn-shine px-7 py-3.5 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2"
              >
                <Zap size={15} /> Book a Remap <ArrowRight size={14} />
              </Link>
            </MagneticButton>
            <a
              href="tel:01803269895"
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
            >
              <Phone size={15} /> 01803 269895
            </a>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10">
            {['Pre & post diagnostic included', 'Mobile remapping available', 'Petrol & diesel covered', 'Cars, vans & 4x4s'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/40 text-xs font-medium">
                <CheckCircle size={12} className="text-[#FF7A00]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Page-specific content (unique, non-templated) ─────────────────── */}
      {location.extraSections && location.extraSections.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {location.extraSections.map((sec) => (
              <div key={sec.heading}>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white mb-5">
                  {sec.heading}
                </h2>
                <div className="space-y-4">
                  {sec.paragraphs.map((para, i) => (
                    <p key={i} className="text-white/55 text-sm sm:text-base leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">What we offer</p>
            <h2 className="text-3xl font-black tracking-tighter text-white">
              Remapping Services in {location.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl bg-[#1A1D22] border border-white/5 p-5 hover:border-[#FF7A00]/20 transition-colors">
                <div className="text-[#FF7A00] mb-3">{s.icon}</div>
                <h3 className="text-white font-bold text-sm mb-2">{s.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile remapping callout ───────────────────────────────────────── */}
      {location.mobileAvailable && (
        <section className="py-12 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#FF7A00]/6 border border-[#FF7A00]/20 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/15 flex items-center justify-center shrink-0">
                <MapPin size={22} className="text-[#FF7A00]" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-black text-xl mb-2">
                  Mobile Remapping Available in {location.name}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  We come to your home, driveway or workplace - {location.distanceNote}. No need to take time off or arrange transport.
                  Our mobile setup carries the same professional OBD and bench equipment as our workshop.
                </p>
              </div>
              <MagneticButton>
                <Link
                  to="/remapping-booking"
                  className="btn-shine px-6 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2 shrink-0"
                >
                  Book Mobile <ArrowRight size={14} />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </section>
      )}

      {/* ── Towing ────────────────────────────────────────────────────────── */}
      {location.towingContent && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#1A1D22] border border-white/5 p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center shrink-0">
                  <Truck size={22} className="text-[#FF7A00]" />
                </div>
                <div>
                  <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-1">Towing</p>
                  <h2 className="text-2xl font-black tracking-tighter text-white">Remapping for Towing Vehicles</h2>
                </div>
              </div>
              <div className="space-y-4">
                {location.towingContent.map((para, i) => (
                  <p key={i} className="text-white/55 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Why AutoCleanse ───────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">Why choose us</p>
              <h2 className="text-3xl font-black tracking-tighter text-white mb-6">
                Professional ECU Tuning - Not Just a Flash and Go
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Every vehicle we remap gets a full diagnostic check before we touch the ECU - and another one after. We don't use generic off-the-shelf files or rush through jobs. Our remaps are applied carefully, tested properly, and backed by our real-world experience with hundreds of vehicles across Devon.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                We're a genuine local Devon business, not a national franchise. When you call us, you speak to the people doing the work.
              </p>
            </div>
            <div className="space-y-3">
              {TRUST.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-[#1A1D22] border border-white/5 rounded-xl px-4 py-3">
                  <CheckCircle size={15} className="text-[#FF7A00] shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DPF Trust Signal + Recent Remaps ───────────────────��─────────── */}
      {PRIORITY_SLUGS.has(location.slug) && (
        <>
          <DpfTrustSignal />
          <RecentRemaps />
        </>
      )}

      {/* ── Nearby areas ──────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">Coverage</p>
            <h2 className="text-2xl font-black tracking-tighter text-white">
              Areas Near {location.name} We Also Cover
            </h2>
            <p className="text-white/40 text-sm mt-2">
              As well as {location.name} itself, we regularly serve customers from across the surrounding area.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {location.nearbyAreas.map((area) => (
              <span
                key={area}
                className="px-4 py-2 rounded-xl bg-[#1A1D22] border border-white/5 text-white/60 text-sm font-medium hover:border-[#FF7A00]/30 hover:text-white/80 transition-colors"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular vehicles we remap ─────────────────────────────────────── */}
      {popularVehicles.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">Vehicles we tune</p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                {isMajorTown
                  ? `Popular Vehicles We Remap in ${location.name}`
                  : 'Popular Vehicles We Remap'}
              </h2>
              <p className="text-white/40 text-sm mt-2">
                {location.popularVehiclesIntro ?? 'See typical Stage 1 gains, engine options and FAQs for some of the models we remap most.'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {popularVehicles.map((veh) => (
                <Link
                  key={veh!.slug}
                  to={`/${veh!.slug}`}
                  className="rounded-2xl bg-[#1A1D22] border border-white/5 p-4 sm:p-5 hover:border-[#FF7A00]/30 transition-colors group"
                >
                  <p className="text-white font-bold text-sm group-hover:text-[#FF7A00] transition-colors">
                    {veh!.fullName} Remap
                  </p>
                  <p className="text-white/30 text-xs mt-1 flex items-center gap-1">
                    Gains & FAQs <ArrowRight size={11} />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related remapping services ─────────────────────────────────────── */}
      <section className="py-14 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-6">Related services</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {relatedServices.map((svc) => (
              <Link
                key={svc.to}
                to={svc.to}
                className="rounded-2xl bg-[#1A1D22] border border-white/5 p-5 hover:border-[#FF7A00]/30 transition-colors group flex items-center justify-between gap-3"
              >
                <span className="text-white font-bold text-sm group-hover:text-[#FF7A00] transition-colors">{svc.label}</span>
                <ArrowRight size={14} className="text-[#FF7A00] shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-black tracking-tighter text-white">
              Common Questions - {location.name}
            </h2>
          </div>
          <div className="rounded-3xl bg-[#1A1D22] border border-white/5 px-6 sm:px-8">
            {location.faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Related locations ─────────────────────────────────────────────── */}
      {relatedLocations.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-6">Also nearby</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  to={`/${loc.slug}`}
                  className="rounded-2xl bg-[#1A1D22] border border-white/5 p-5 hover:border-[#FF7A00]/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={13} className="text-[#FF7A00]" />
                    <span className="text-white/30 text-xs">{loc.region}</span>
                  </div>
                  <p className="text-white font-bold text-sm group-hover:text-[#FF7A00] transition-colors">
                    ECU Remapping {loc.name}
                  </p>
                  <p className="text-white/30 text-xs mt-1 flex items-center gap-1">
                    View page <ArrowRight size={11} />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reviews
            reviews={getReviews(ECU_COMPACT_REVIEW_IDS)}
            heading={<><span className="text-white">Remapping </span><span className="text-[#FF7A00]">Reviews</span></>}
            columns={3}
            showGoogleCta
            showCallCta
          />
        </div>
      </section>

      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-4">
            Ready to book?
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white mb-4">
            Get a Quote for ECU Remapping<br />
            <span className="text-[#FF7A00]">in {location.name}.</span>
          </h2>
          <p className="text-white/40 text-base mb-8 max-w-md mx-auto">
            Book online in minutes. Choose your service, tell us about your vehicle and pick a slot - workshop or mobile.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <MagneticButton>
              <Link
                to="/remapping-booking"
                className="btn-shine px-8 py-4 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2"
              >
                <Zap size={15} /> Book Online <ArrowRight size={14} />
              </Link>
            </MagneticButton>
            <a
              href="tel:01803269895"
              className="px-8 py-4 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
            >
              <Phone size={15} /> 01803 269895
            </a>
          </div>
          <p className="text-white/20 text-xs mt-6">
            <Shield size={11} className="inline mb-0.5 mr-1" />
            Pre & post diagnostic check included with every remap
          </p>

          <div className="mt-12 text-left rounded-3xl bg-[#1A1D22] border border-white/5 p-6 sm:p-8 shadow-2xl shadow-black/40">
            <QuickEnquiryForm
              defaultService="ECU Remapping"
              source={location.slug}
              heading={`Request a Callback in ${location.name}`}
              subheading="No obligation — tell us about your vehicle and we'll get back to you."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
