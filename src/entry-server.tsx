import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import App from './App';
import { REMAP_LOCATIONS } from './data/remapping-locations';
import { VEHICLE_REMAPS } from './data/vehicle-remapping';
import { DPF_LOCATIONS } from './data/dpf-locations';
import { TRADE_INVITE_ROUTES } from './data/trade-invite-regions';
import { PUBLISHED_POSTS } from './lib/blog';
import { ADBLUE_GUIDES } from './data/adblue-guides';
import townsData from './data/adblue-towns/towns.json';
import { TownDataContext, TOWNS_PATH, townPath, type TownData, type TownStore } from './lib/town-data';
import remapTownsData from './data/remap-towns/towns.json';
import { RemapTownDataContext, REMAP_TOWNS_PATH, remapTownPath, type RemapTownData, type RemapTownStore } from './lib/remap-town-data';

// AdBlue town pages go live in waves. Raise this to publish the next wave.
const PUBLISHED_TOWN_WAVE = 2;

type TownRecord = Omit<TownData, 'nearby'> & { lat: number; lng: number; wave: number };

// Towns that share a name (three Newports) get "Name, County" in the title and
// H1, or "Name, Region" when the county is the town itself. Counted over the
// whole dataset, so a name does not change when a later wave is published.
function placeNames(towns: { name: string; county: string; region: string }[]) {
  const count = new Map<string, number>();
  for (const t of towns) count.set(t.name, (count.get(t.name) ?? 0) + 1);
  return (t: { name: string; county: string; region: string }) =>
    (count.get(t.name) ?? 0) > 1 ? { place: `${t.name}, ${t.county && t.county !== t.name ? t.county : t.region}` } : {};
}
const publishedTowns = (townsData as TownRecord[]).filter((t) => t.wave <= PUBLISHED_TOWN_WAVE);
const townPlace = placeNames(townsData as TownRecord[]);

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Nearby links only point at published towns, so they never lead to a 404.
const TOWN_STORE: TownStore = {
  towns: Object.fromEntries(
    publishedTowns.map((t) => {
      const { lat: _lat, lng: _lng, wave: _wave, ...rest } = t;
      const nearby = publishedTowns
        .filter((o) => o.slug !== t.slug)
        .map((o) => ({ slug: o.slug, name: o.name, km: Math.round(distanceKm(t, o) * 10) / 10 }))
        .filter((o) => o.km <= 60)
        .sort((a, b) => a.km - b.km)
        .slice(0, 6);
      return [t.slug, { ...rest, nearby, ...townPlace(t) }];
    }),
  ),
  index: publishedTowns.map((t) => ({ slug: t.slug, name: t.name, region: t.region, county: t.county })),
};

// National Stage 1 remap town pages, also published in waves. Each page links
// to the same town's AdBlue page when that town is published.
const PUBLISHED_REMAP_WAVE = 2;

type RemapTownRecord = Omit<RemapTownData, 'nearby' | 'adblueSlug'> & { lat: number; lng: number; wave: number };
const publishedRemapTowns = (remapTownsData as RemapTownRecord[]).filter((t) => t.wave <= PUBLISHED_REMAP_WAVE);
const remapTownPlace = placeNames(remapTownsData as RemapTownRecord[]);

const REMAP_TOWN_STORE: RemapTownStore = {
  towns: Object.fromEntries(
    publishedRemapTowns.map((t) => {
      const { lat: _lat, lng: _lng, wave: _wave, ...rest } = t;
      const nearby = publishedRemapTowns
        .filter((o) => o.slug !== t.slug)
        .map((o) => ({ slug: o.slug, name: o.name, km: Math.round(distanceKm(t, o) * 10) / 10 }))
        .filter((o) => o.km <= 80)
        .sort((a, b) => a.km - b.km)
        .slice(0, 6);
      const adblueSlug = TOWN_STORE.towns[t.slug] ? t.slug : undefined;
      return [t.slug, { ...rest, nearby, ...(adblueSlug ? { adblueSlug } : {}), ...remapTownPlace(t) }];
    }),
  ),
  index: publishedRemapTowns.map((t) => ({ slug: t.slug, name: t.name, region: t.region })),
};

export interface RenderResult {
  html: string;
  helmet: HelmetServerState;
}

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <TownDataContext.Provider value={TOWN_STORE}>
          <RemapTownDataContext.Provider value={REMAP_TOWN_STORE}>
            <App />
          </RemapTownDataContext.Provider>
        </TownDataContext.Provider>
      </StaticRouter>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet! };
}

const STATIC_ROUTES = [
  '/',
  '/services',
  '/dpf-cleaning',
  '/dpf-cleaning-near-me',
  '/postal-dpf',
  '/book',
  '/why-clean',
  '/maintenance',
  '/about',
  '/contact',
  '/pricing',
  '/how-it-works',
  '/dpf-cleaning-devon',
  '/dpf-cleaning-totnes',
  '/dpf-cleaning-exeter',
  '/dpf-cleaning-plymouth',
  '/dpf-cleaning-torquay',
  '/dpf-cleaning-paignton',
  '/dpf-cleaning-newton-abbot',
  '/dpf-diagnostics-devon',
  '/blocked-dpf-cleaning-devon',
  '/adblue-repair-devon',
  '/ecu-remapping',
  '/ecu-remapping-locations',
  '/ecu-cloning',
  '/trade-file-service',
  '/vehicle-performance-lookup',
  '/remapping-booking',
  '/reviews',
  '/privacy',
  '/cookie-policy',
  '/terms',
  '/refund-policy',
];

// Private campaign landing pages. These ARE prerendered (so the printed QR codes
// resolve to a real static page with a 200) but are deliberately excluded from
// the XML sitemap - see scripts/prerender.mjs - and carry noindex/nofollow.
export const privateRoutes: string[] = [...TRADE_INVITE_ROUTES];

// Utility / post-transaction pages. These used to be SPA-rewritten to "/" in
// vercel.json, which meant four different URLs all served the homepage's HTML
// (and its canonical + title) - a duplicate-content trap, and their `noindex`
// only appeared after hydration. Prerendering them instead gives each URL its
// own static HTML with `noindex` in the raw markup. They are excluded from the
// XML sitemap - see scripts/prerender.mjs.
export const utilityRoutes: string[] = [
  '/booking-success',
  '/booking-cancel',
  '/diagnostic-matcher',
  '/debug/dvla',
];

// Published AdBlue town pages. Also written to their own sitemap
// (sitemap-adblue-towns.xml) so Search Console can report how many are indexed.
export const townRoutes: string[] = publishedTowns.map((t) => townPath(t.slug));

// Published remap town pages, with their own sitemap (sitemap-remap-towns.xml).
export const remapTownRoutes: string[] = publishedRemapTowns.map((t) => remapTownPath(t.slug));

export const routes: string[] = [
  ...STATIC_ROUTES,
  ...ADBLUE_GUIDES.map((g) => g.path),
  TOWNS_PATH,
  ...townRoutes,
  REMAP_TOWNS_PATH,
  ...remapTownRoutes,
  '/blog',
  ...PUBLISHED_POSTS.map((p) => `/blog/${p.slug}`),
  ...REMAP_LOCATIONS.map((loc) => `/${loc.slug}`),
  ...VEHICLE_REMAPS.map((veh) => `/${veh.slug}`),
  ...DPF_LOCATIONS.map((loc) => `/${loc.slug}`),
  ...privateRoutes,
  ...utilityRoutes,
];

// Lightweight metadata for the RSS feed generated in scripts/prerender.mjs.
export const blogPosts = PUBLISHED_POSTS.map((p) => ({
  title: p.title,
  slug: p.slug,
  date: p.date,
  updated: p.updated,
  excerpt: p.excerpt,
  category: p.category,
}));
