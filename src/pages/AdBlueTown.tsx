import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, MessageCircle, MessageSquare, ArrowRight, Check, MapPin, ShieldCheck, Route as RouteIcon } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import FaqSection, { type Faq } from '../components/FaqSection';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import { BUSINESS } from '../data/business';
import { TownDataContext, inlineJson, townPath, TOWNS_PATH, type TownData } from '../lib/town-data';
import NotFound from './NotFound';

// The path the browser first loaded. A town with no data on that first load is
// an unknown slug (show the 404); on a later in-app navigation we reload so the
// town's own prerendered page, which carries its data, is fetched.
const firstLoadPath = typeof window !== 'undefined' ? window.location.pathname : '';

const CARD = 'relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black';
const LINK = 'text-[#FF7A00] hover:text-[#FF9500] transition-colors';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const GUIDES = [
  { to: '/adblue-countdown-no-start', label: 'Countdown or no-start: what to do now' },
  { to: '/adblue-warning-light', label: 'AdBlue warning light explained' },
  { to: '/adblue-fault-codes/p20ee', label: 'Fault code P20EE' },
  { to: '/adblue-repair/nox-sensor', label: 'NOx sensor faults' },
  { to: '/adblue-repair/peugeot-citroen-vauxhall-adblue-tank', label: 'Peugeot, Citroen and Vauxhall AdBlue tanks' },
];

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

function useTown(slug: string): TownData | null {
  const store = useContext(TownDataContext);
  const fromServer = store?.towns[slug] ?? null;
  const [town] = useState<TownData | null>(() => {
    if (fromServer) return fromServer;
    if (typeof window !== 'undefined' && window.__ADBLUE_TOWN__?.slug === slug) return window.__ADBLUE_TOWN__;
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

export default function AdBlueTown() {
  const { town: slug = '' } = useParams<{ town: string }>();
  const town = useTown(slug);
  if (!town) {
    const isFirstLoad = typeof window === 'undefined' || window.location.pathname === firstLoadPath;
    return isFirstLoad ? <NotFound /> : <div className="pt-32 pb-24 min-h-screen bg-[#0A0A0A]" />;
  }

  const name = town.name;
  const message = `Hi Auto-Cleanse, AdBlue fault near ${name}. Reg: . Postcode: . Dash message: `;
  const telHref = `tel:${BUSINESS.telephone}`;
  const waHref = `https://wa.me/${BUSINESS.telephone.replace('+', '')}?text=${encodeURIComponent(message)}`;
  const smsHref = `sms:${BUSINESS.telephone}?&body=${encodeURIComponent(message)}`;
  const districts = town.districts.slice(0, 6);
  const coverage = town.inHouse
    ? `Our own technicians cover ${name} from our Totnes workshop, about ${town.kmFromTotnes} km away.`
    : `Outside Devon, we book an independent mobile technician from our national network to come to you in ${name}, and manage the job for you. Call with your postcode and we'll tell you straight away who can get to you.`;

  const description = `AdBlue warning, countdown or no-start in ${name}? Repair-only AdBlue diagnosis and repair${districts.length ? ` around ${listText(districts.slice(0, 3))}` : ''}. Call or WhatsApp ${BUSINESS.phoneDisplay}.`;

  const pumpText = town.pumps.length
    ? `OpenStreetMap lists ${listText(town.pumps.map((p) => `${p.name}${p.town ? ` (${p.town})` : ''}, about ${p.km} km away`))} as selling AdBlue at the pump. Listings can be out of date, so check before you set off. AdBlue is also widely sold in cans.`
    : 'AdBlue is widely sold in cans at fuel stations and motor factors, and many larger stations on main roads have it at the pump. If the warning stays on after a correct top-up, the problem is a fault rather than the level.';

  const faqs: Faq[] = [
    { q: `Do you cover ${districts.length ? listText(districts.slice(0, 4)) : name}?`, a: coverage },
    { q: `Where can I buy AdBlue near ${name}?`, a: pumpText },
    { q: `Can an AdBlue fault in ${name} be fixed where the vehicle is?`, a: 'Often, yes. Many AdBlue faults can be diagnosed and repaired on site, but some jobs need a workshop. We will tell you which on the call once we know the reg and the fault.' },
    { q: `How much does AdBlue repair cost in ${name}?`, a: 'It depends on the fault, the vehicle and whether parts are needed, so we do not publish prices. Call with your reg and the warning message and we will quote for your vehicle.' },
  ];

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title={`AdBlue Repair in ${name} | Auto-Cleanse`} description={description} path={townPath(town.slug)} />
      <script dangerouslySetInnerHTML={{ __html: `window.__ADBLUE_TOWN__=${inlineJson(town)};` }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ name: 'AdBlue repair', path: '/adblue-repair' }, { name: 'Areas', path: TOWNS_PATH }, { name }]} />

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
            <span className="text-white">AdBlue repair in </span>
            <span className="text-[#FF7A00]">{name}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-3xl leading-relaxed font-medium">{town.intro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-2xl">
            <a href={telHref} className="btn-shine px-6 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2">
              <Phone size={18} /> Call {BUSINESS.phoneDisplay}
            </a>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="px-6 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={smsHref} className="px-6 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
              <MessageSquare size={18} /> Text us
            </a>
          </div>
        </header>

        <div className="space-y-8">
          <section className={CARD}>
            <div className="flex items-center gap-4 mb-4">
              <MapPin size={22} className="text-[#FF7A00] shrink-0" />
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Who comes out in {name}</h2>
            </div>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">{coverage}</p>
            <p className="text-white/50 text-sm leading-relaxed mt-3">You deal with us throughout: we quote, take payment and look after anything afterwards.</p>
          </section>

          <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#FF7A00]/[0.06] border border-[#FF7A00]/25">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#FF7A00] mb-5">{name} at a glance</h2>
            <dl className="grid gap-5 md:grid-cols-2">
              {districts.length > 0 && (
                <div><dt className="text-white font-bold">Postcode districts</dt><dd className="text-white/65 mt-1">{districts.join(', ')}</dd></div>
              )}
              {town.roads.length > 0 && (
                <div><dt className="text-white font-bold">Main roads</dt><dd className="text-white/65 mt-1">{town.roads.join(', ')}</dd></div>
              )}
              {town.services.length > 0 && (
                <div><dt className="text-white font-bold">Nearest service areas</dt><dd className="text-white/65 mt-1">{town.services.map((s) => `${s.name}${s.road ? ` (${s.road})` : ''}, ${s.km} km`).join('; ')}</dd></div>
              )}
              {town.pumps.length > 0 && (
                <div><dt className="text-white font-bold">AdBlue at the pump nearby</dt><dd className="text-white/65 mt-1">{town.pumps.map((p) => `${p.name}, ${p.km} km`).join('; ')}</dd></div>
              )}
              {town.vans && (
                <div><dt className="text-white font-bold">Vans registered locally</dt><dd className="text-white/65 mt-1">About {fmtNum(town.vans.count)} in these postcode districts ({town.vans.quarter})</dd></div>
              )}
              <div><dt className="text-white font-bold">Population</dt><dd className="text-white/65 mt-1">About {fmtNum(town.pop)} ({town.county || town.region})</dd></div>
            </dl>
          </section>

          {town.roadsText && (
            <section className={CARD}>
              <div className="flex items-center gap-4 mb-4">
                <RouteIcon size={22} className="text-[#FF7A00] shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Roads and services around {name}</h2>
              </div>
              <p className="text-white/65 text-base md:text-lg leading-relaxed">{town.roadsText}</p>
            </section>
          )}

          <section className={CARD}>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-5">AdBlue warning near {name}? Start here</h2>
            <ol className="space-y-3 text-white/65 text-sm md:text-base leading-relaxed list-decimal pl-5">
              <li>If you're on a live road, get somewhere safe first.</li>
              <li>Note the exact dash message and any miles left on a countdown, and don't keep clearing codes.</li>
              <li>If the tank is genuinely low, top up with good-quality AdBlue. If the warning stays after a short drive, it's a fault.</li>
              <li>Call or message us with your reg, postcode and the message. We'll tell you what it's likely to be and who would come out.</li>
            </ol>
            <div className="grid gap-3 sm:grid-cols-2 mt-6">
              {GUIDES.map((g) => (
                <a key={g.to} href={g.to} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/75 hover:text-white transition-all">
                  <ArrowRight size={18} className="text-[#FF7A00] mr-3 shrink-0" />
                  <span className="font-medium text-sm md:text-base">{g.label}</span>
                </a>
              ))}
            </div>
          </section>

          <section className={CARD}>
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck size={22} className="text-[#FF7A00] shrink-0" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">We repair. We don't delete.</h2>
            </div>
            <ul className="space-y-2">
              {['We find the actual fault and fix it, so the vehicle stays road-legal and passes its MOT.', 'We don’t remove, disable or emulate AdBlue systems.', 'Prices are given on the phone, for your vehicle and fault.'].map((t) => (
                <li key={t} className="flex items-start gap-3 text-white/65 text-sm md:text-base leading-relaxed">
                  <Check size={18} className="text-[#FF7A00] shrink-0 mt-0.5" /><span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm mt-4"><a href="/adblue-delete-law" className={LINK}>Why an AdBlue delete isn't the answer</a> · <a href="/how-we-quote" className={LINK}>How we quote</a></p>
          </section>

          <section>
            <FaqSection faqs={faqs} />
          </section>

          <section id="enquiry" className={`${CARD} overflow-hidden scroll-mt-28`}>
            <div className="relative z-10">
              <QuickEnquiryForm
                defaultService="AdBlue / SCR Repair"
                source={`adblue-town-${town.slug}`}
                heading={`AdBlue help in ${name}`}
                subheading="Tell us your vehicle, where it is, the warning message and any fault codes, and we'll call you back."
              />
            </div>
          </section>

          {town.nearby.length > 0 && (
            <section className={CARD}>
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight">AdBlue repair near {name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {town.nearby.map((n) => (
                  <a key={n.slug} href={townPath(n.slug)} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all">
                    <ArrowRight size={18} className="text-[#FF7A00] mr-3 shrink-0" />
                    <span className="font-medium">{n.name}</span>
                    <span className="ml-auto text-white/35 text-sm">{n.km} km</span>
                  </a>
                ))}
              </div>
              <p className="text-sm mt-5"><a href={TOWNS_PATH} className={LINK}>All AdBlue repair areas</a></p>
            </section>
          )}

          <section className="px-2 text-white/40 text-xs leading-relaxed">
            <p>
              Local data: road and fuel-station details © OpenStreetMap contributors (ODbL); postcode districts from postcodes.io (ONS);
              population from ONS Census 2021, NRS (Scotland) and NISRA (Northern Ireland) figures
              {town.vans ? '; van numbers from DfT vehicle licensing statistics' : ''}. Last updated {formatDate(town.updated)}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
