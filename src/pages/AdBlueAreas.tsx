import { useContext, useEffect, useState } from 'react';
import { Phone, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { BUSINESS } from '../data/business';
import { TownDataContext, inlineJson, townPath, TOWNS_PATH, type TownIndexEntry } from '../lib/town-data';

const REGION_ORDER = [
  'South West', 'South East', 'London', 'East of England', 'West Midlands', 'East Midlands', 'Wales',
  'North West', 'Yorkshire and the Humber', 'North East', 'Scotland', 'Northern Ireland',
];

function useIndex(): TownIndexEntry[] | null {
  const store = useContext(TownDataContext);
  const [index] = useState<TownIndexEntry[] | null>(() => {
    if (store) return store.index;
    if (typeof window !== 'undefined' && window.__ADBLUE_TOWN_INDEX__) return window.__ADBLUE_TOWN_INDEX__;
    return null;
  });
  useEffect(() => {
    if (!index && typeof window !== 'undefined') window.location.replace(window.location.href);
  }, [index]);
  return index;
}

export default function AdBlueAreas() {
  const index = useIndex();
  if (!index) return <div className="pt-32 pb-24 min-h-screen bg-[#0A0A0A]" />;

  // The index arrives sorted by name from the data build, so server and client render the same order.
  const byRegion = new Map<string, TownIndexEntry[]>();
  for (const t of index) {
    const list = byRegion.get(t.region) ?? [];
    list.push(t);
    byRegion.set(t.region, list);
  }
  const regions = [...byRegion.keys()].sort((a, b) => (REGION_ORDER.indexOf(a) + 1 || 99) - (REGION_ORDER.indexOf(b) + 1 || 99));

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="AdBlue Repair Areas: Find Your Town | Auto-Cleanse"
        description={`Repair-only AdBlue diagnosis and repair. Find your town to see local roads, service areas and who comes out, then call or WhatsApp ${BUSINESS.phoneDisplay}.`}
        path={TOWNS_PATH}
      />
      <script dangerouslySetInnerHTML={{ __html: `window.__ADBLUE_TOWN_INDEX__=${inlineJson(index)};` }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ name: 'AdBlue repair', path: '/adblue-repair' }, { name: 'Areas' }]} />
        <header className="mb-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
            <span className="text-white">AdBlue repair </span>
            <span className="text-[#FF7A00]">areas</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-3xl leading-relaxed font-medium">
            Pick your town for local roads, nearby service areas, places listed as selling AdBlue at the pump, and who would come out.
            In Devon that's our own technicians. Elsewhere we book an independent mobile technician from our national network and manage the job for you. Call and we'll tell you straight away who can get to you.
          </p>
          <a href={`tel:${BUSINESS.telephone}`} className="btn-shine mt-8 px-7 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2">
            <Phone size={18} /> Call {BUSINESS.phoneDisplay}
          </a>
        </header>

        <div className="space-y-8">
          {regions.map((region) => (
            <section key={region} className="relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5">
              <div className="flex items-center gap-3 mb-5">
                <MapPin size={20} className="text-[#FF7A00]" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{region}</h2>
                <span className="ml-auto text-white/35 text-sm">{byRegion.get(region)!.length} towns</span>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                {byRegion.get(region)!.map((t) => (
                  <li key={t.slug}>
                    <a href={townPath(t.slug)} className="text-white/65 hover:text-[#FF7A00] transition-colors text-sm md:text-base">{t.name}</a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
