import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, MessageCircle, MessageSquare, ArrowRight, MapPin, ShieldCheck, Route as RouteIcon, Gauge, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import FaqSection, { type Faq } from '../components/FaqSection';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import { BUSINESS } from '../data/business';
import { inlineJson } from '../lib/town-data';
import { RemapTownDataContext, remapTownPath, REMAP_TOWNS_PATH, type RemapTownData } from '../lib/remap-town-data';
import NotFound from './NotFound';

// The path the browser first loaded. A town with no data on that first load is
// an unknown slug (show the 404); on a later in-app navigation we reload so the
// town's own prerendered page, which carries its data, is fetched.
const firstLoadPath = typeof window !== 'undefined' ? window.location.pathname : '';

const CARD = 'relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black';
const LINK = 'text-[#FF7A00] hover:text-[#FF9500] transition-colors';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const GUIDE_BASICS = { to: '/blog/what-changes-during-a-stage-1-remap', label: 'What actually changes during a Stage 1 remap' };

// The second guide follows what stands out in the town's figures, so the
// pages point readers at the post most relevant to local vehicles.
function localGuide(town: RemapTownData) {
  const v = town.vehicles;
  if (v && v.cars > 0 && (v.vans / v.cars) * 1000 >= 75) return { to: '/blog/van-and-commercial-remapping', label: 'Van and commercial remapping' };
  if ((town.census?.km30plusPct ?? 0) >= 6) return { to: '/blog/economy-remaps-and-realistic-fuel-savings', label: 'Economy remaps and realistic fuel savings' };
  if (v && v.carsDieselPct >= 33) return { to: '/blog/will-a-remap-cause-dpf-or-adblue-problems', label: 'Will a remap cause DPF or AdBlue problems?' };
  return { to: '/blog/remapping-and-your-insurance', label: 'Remapping and your insurance' };
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

// Fixed formatting so the prerendered HTML and the hydrated page always match.
function fmtNum(n: number) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function listText(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function useTown(slug: string): RemapTownData | null {
  const store = useContext(RemapTownDataContext);
  const fromServer = store?.towns[slug] ?? null;
  const [town] = useState<RemapTownData | null>(() => {
    if (fromServer) return fromServer;
    if (typeof window !== 'undefined' && window.__REMAP_TOWN__?.slug === slug) return window.__REMAP_TOWN__;
    return null;
  });
  // Town data only ships inside each town's own prerendered page. Arriving here
  // by in-app navigation (e.g. browser back) means loading that page properly.
  useEffect(() => {
    if (!town && typeof window !== 'undefined' && window.location.pathname !== firstLoadPath) {
      window.location.replace(window.location.href);
    }
  }, [town]);
  return town;
}

export default function RemapTown() {
  const { town: slug = '' } = useParams<{ town: string }>();
  const town = useTown(slug);
  if (!town) {
    const isFirstLoad = typeof window === 'undefined' || window.location.pathname === firstLoadPath;
    return isFirstLoad ? <NotFound /> : <div className="pt-32 pb-24 min-h-screen bg-[#0A0A0A]" />;
  }

  const name = town.name;
  const message = `Hi Auto-Cleanse, Stage 1 remap near ${name}. Reg: . Postcode: . Vehicle: `;
  const telHref = `tel:${BUSINESS.telephone}`;
  const waHref = `https://wa.me/${BUSINESS.telephone.replace('+', '')}?text=${encodeURIComponent(message)}`;
  const smsHref = `sms:${BUSINESS.telephone}?&body=${encodeURIComponent(message)}`;
  const districts = town.districts.slice(0, 6);
  const { vehicles, census, caz } = town;
  const censusYear = census?.census.match(/20\d\d/)?.[0] ?? '';
  const coverage = `An independent mobile technician from our national network does the remap at your home or workplace, booked and managed by us. Call with your reg and postcode and we'll tell you straight whether we can cover ${name}.`;
  const guides = [GUIDE_BASICS, localGuide(town)];

  const description = `Stage 1 ECU remapping in ${name} for diesel and petrol cars and vans${districts.length ? ` around ${listText(districts.slice(0, 3))}` : ''}. Diagnostics before and after, repair only. Call or WhatsApp ${BUSINESS.phoneDisplay}.`;

  const faqs: Faq[] = [
    {
      q: `Do you remap in ${districts.length ? listText(districts.slice(0, 4)) : name}?`,
      a: `We check on the phone who can get to you in ${name} before anything is booked.`,
    },
    { q: `How much is a Stage 1 remap in ${name}?`, a: 'We give you the price on the phone once we know your vehicle.' },
  ];
  if (caz) {
    faqs.push({
      q: `Does a remap change whether I pay the ${caz.name} charge?`,
      a: `No. The charge depends on fuel type and emissions standard, and a remap changes neither.${caz.scope ? ` ${caz.scope}` : ''}`,
    });
  }

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title={`Stage 1 Remapping in ${name} | Auto-Cleanse`} description={description} path={remapTownPath(town.slug)} />
      <script dangerouslySetInnerHTML={{ __html: `window.__REMAP_TOWN__=${inlineJson(town)};` }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ name: 'ECU remapping', path: '/ecu-remapping' }, { name: 'Areas', path: REMAP_TOWNS_PATH }, { name }]} />

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
            <span className="text-white">Stage 1 remapping in </span>
            <span className="text-[#FF7A00]">{name}</span>
          </h1>
          {/* Contact buttons sit straight under the H1 so they are on the first
              screen on a phone; the local intro follows. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-w-2xl">
            <a href={telHref} className="col-span-2 sm:col-span-1 btn-shine px-6 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2">
              <Phone size={18} /> Call {BUSINESS.phoneDisplay}
            </a>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="px-6 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={smsHref} className="px-6 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
              <MessageSquare size={18} /> Text us
            </a>
          </div>
          <p className="text-lg md:text-xl text-white/60 max-w-3xl leading-relaxed font-medium">{town.intro}</p>
        </header>

        <div className="space-y-8">
          <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#FF7A00]/[0.06] border border-[#FF7A00]/25">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#FF7A00] mb-5">Vehicles and driving in {name}</h2>
            <dl className="grid gap-5 md:grid-cols-2">
              {vehicles && (
                <div><dt className="text-white font-bold">Privately kept cars in {vehicles.area}</dt><dd className="text-white/65 mt-1">{fmtNum(vehicles.cars)}: {vehicles.carsDieselPct}% diesel, {vehicles.carsPetrolPct}% petrol (council area, {vehicles.quarter})</dd></div>
              )}
              {vehicles && vehicles.vans > 0 && (
                <div><dt className="text-white font-bold">Privately kept vans in {vehicles.area}</dt><dd className="text-white/65 mt-1">{fmtNum(vehicles.vans)}, {vehicles.vansDieselPct}% of them diesel</dd></div>
              )}
              {census && (
                <div><dt className="text-white font-bold">Drive to work ({censusYear})</dt><dd className="text-white/65 mt-1">{census.driveToWorkPct}% of working residents drive a car or van to work{census.national?.driveToWorkPct !== undefined ? ` (England and Wales: ${census.national.driveToWorkPct}%)` : ''}</dd></div>
              )}
              {census?.km30plusPct !== undefined && (
                <div><dt className="text-white font-bold">Long commutes ({censusYear})</dt><dd className="text-white/65 mt-1">{census.km30plusPct}% travel 30 km or more to work{census.national?.km30plusPct !== undefined ? ` (England and Wales: ${census.national.km30plusPct}%)` : ''}</dd></div>
              )}
              {census?.twoPlusCarsPct !== undefined && (
                <div><dt className="text-white font-bold">Households with two or more cars or vans ({censusYear})</dt><dd className="text-white/65 mt-1">{census.twoPlusCarsPct}%{census.national?.twoPlusCarsPct !== undefined ? ` (England and Wales: ${census.national.twoPlusCarsPct}%)` : ''}</dd></div>
              )}
              {caz && (
                <div><dt className="text-white font-bold">Clean air zone</dt><dd className="text-white/65 mt-1">{caz.name}</dd></div>
              )}
              {districts.length > 0 && (
                <div><dt className="text-white font-bold">Postcode districts</dt><dd className="text-white/65 mt-1">{districts.join(', ')}</dd></div>
              )}
              {town.roads.length > 0 && (
                <div><dt className="text-white font-bold">Main roads</dt><dd className="text-white/65 mt-1">{town.roads.join(', ')}</dd></div>
              )}
              <div><dt className="text-white font-bold">Population</dt><dd className="text-white/65 mt-1">About {fmtNum(town.pop)} ({town.county || town.region})</dd></div>
            </dl>
          </section>

          <section className={CARD}>
            <div className="flex items-center gap-4 mb-4">
              <RouteIcon size={22} className="text-[#FF7A00] shrink-0" />
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Driving in and around {name}</h2>
            </div>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">{town.driving}</p>
          </section>

          <section className={CARD}>
            <div className="flex items-center gap-4 mb-4">
              <MapPin size={22} className="text-[#FF7A00] shrink-0" />
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Who does the remap in {name}</h2>
            </div>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">{coverage}</p>
            <p className="text-white/50 text-sm leading-relaxed mt-3">
              <ShieldCheck size={15} className="inline mb-0.5 mr-1 text-[#FF7A00]" />
              Diagnostics before and after, a remap file matched to your vehicle, repair only: no DPF, EGR or AdBlue deletes.
            </p>
          </section>

          <section className={CARD}>
            {town.models && town.models.length > 0 && town.modelsArea && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <Gauge size={22} className="text-[#FF7A00] shrink-0" />
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Common diesels in {town.modelsArea.postcodeArea} postcodes</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {town.models.map((m) => (
                    <a key={m.slug} href={`/${m.slug}`} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 text-white/75 hover:text-white text-sm transition-all">{m.name}</a>
                  ))}
                </div>
              </>
            )}
            <div className={`grid gap-3 sm:grid-cols-2${town.models && town.models.length > 0 ? ' mt-8' : ''}`}>
              {guides.map((g) => (
                <a key={g.to} href={g.to} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/75 hover:text-white transition-all">
                  <ArrowRight size={18} className="text-[#FF7A00] mr-3 shrink-0" />
                  <span className="font-medium text-sm md:text-base">{g.label}</span>
                </a>
              ))}
            </div>
          </section>

          {town.adblueSlug && (
            <section className="relative p-6 md:p-8 rounded-[2rem] bg-white/[0.03] border border-white/10">
              <div className="flex items-start gap-4">
                <AlertTriangle size={22} className="text-[#FF7A00] shrink-0 mt-1" />
                <p className="text-white/65 text-sm md:text-base leading-relaxed">
                  AdBlue warning on? Repair comes before any remap:{' '}
                  <a href={`/adblue-repair/${town.adblueSlug}`} className={LINK}>AdBlue repair in {name}</a>
                </p>
              </div>
            </section>
          )}

          <section>
            <FaqSection faqs={faqs} />
          </section>

          <section id="enquiry" className={`${CARD} overflow-hidden scroll-mt-28`}>
            <div className="relative z-10">
              <QuickEnquiryForm
                defaultService="Mobile Remapping"
                source={`remap-town-${town.slug}`}
                heading={`Stage 1 remap in ${name}`}
                subheading="Your vehicle, reg and postcode, and we'll call you back."
              />
            </div>
          </section>

          {town.nearby.length > 0 && (
            <section className={CARD}>
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Stage 1 remapping near {name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {town.nearby.map((n) => (
                  <a key={n.slug} href={remapTownPath(n.slug)} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all">
                    <ArrowRight size={18} className="text-[#FF7A00] mr-3 shrink-0" />
                    <span className="font-medium">{n.name}</span>
                    <span className="ml-auto text-white/35 text-sm">{n.km} km</span>
                  </a>
                ))}
              </div>
              <p className="text-sm mt-5"><a href={REMAP_TOWNS_PATH} className={LINK}>All remapping areas</a></p>
            </section>
          )}

          <section className="px-2 text-white/40 text-xs leading-relaxed">
            <p>
              Sources: DfT VEH0105 (privately kept vehicles){census ? `, ${census.census} for ${census.area}${census.census.includes('2021') ? ' (taken in lockdown)' : ''}` : ''}
              {town.modelsArea ? `, DVSA MOT results ${town.modelsArea.year} (diesels, by test station postcode area)` : ''}
              {caz ? ', the zone operator' : ''}, OpenStreetMap (ODbL) and postcodes.io. Public sector information under the{' '}
              <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" className="underline underline-offset-2 hover:text-white/60">Open Government Licence v3.0</a>.
              Updated {formatDate(town.updated)}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
