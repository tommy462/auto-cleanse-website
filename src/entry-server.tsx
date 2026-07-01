import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import App from './App';
import { REMAP_LOCATIONS } from './data/remapping-locations';
import { VEHICLE_REMAPS } from './data/vehicle-remapping';
import { PUBLISHED_POSTS } from './lib/blog';

export interface RenderResult {
  html: string;
  helmet: HelmetServerState;
}

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet! };
}

const STATIC_ROUTES = [
  '/',
  '/services',
  '/dpf-cleaning',
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
  '/vehicle-performance-lookup',
  '/remapping-booking',
];

export const routes: string[] = [
  ...STATIC_ROUTES,
  '/blog',
  ...PUBLISHED_POSTS.map((p) => `/blog/${p.slug}`),
  ...REMAP_LOCATIONS.map((loc) => `/${loc.slug}`),
  ...VEHICLE_REMAPS.map((veh) => `/${veh.slug}`),
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
