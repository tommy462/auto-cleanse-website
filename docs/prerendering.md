# Static Prerendering

All 128 pages are statically prerendered at build time. Googlebot and other crawlers receive full HTML including `<title>`, `<meta>`, canonical, Open Graph tags, and JSON-LD — no JavaScript required.

## How it works

Three-step build pipeline (`npm run build`):

1. **`vite build`** — standard client bundle → `dist/`
2. **`vite build --ssr src/entry-server.tsx --outDir dist-server --mode ssr`** — server bundle that can `renderToString` every page → `dist-server/entry-server.js`
3. **`node scripts/prerender.mjs`** — calls `render(url)` for every route, injects the resulting HTML + Helmet head tags into the `dist/index.html` template, writes each page to `dist/[path]/index.html`

Vercel's `cleanUrls: true` (in `vercel.json`) ensures requests for `/ecu-remapping-plymouth` are served from `dist/ecu-remapping-plymouth/index.html` before the SPA fallback rewrite kicks in.

## Key files

| File | Purpose |
|------|---------|
| `src/entry-server.tsx` | SSR entry — exports `render(url)` and `routes[]` |
| `scripts/prerender.mjs` | Iterates every route, injects HTML + head tags |
| `src/lib/gsap-ssr-mock.ts` | No-op GSAP default export (Node.js has no DOM) |
| `src/lib/gsap-scroll-trigger-ssr-mock.ts` | No-op ScrollTrigger |
| `src/lib/gsap-react-ssr-mock.ts` | No-op `useGSAP` hook |
| `vite.config.ts` | GSAP aliases active when `--mode ssr`; sitemap plugin disabled in SSR mode |

## Route list

Routes are generated dynamically in `src/entry-server.tsx`:

```ts
export const routes = [
  ...STATIC_ROUTES,           // 20 hardcoded pages
  ...REMAP_LOCATIONS.map(...), // all location slugs from data file
  ...VEHICLE_REMAPS.map(...),  // all vehicle slugs from data file
];
```

When you add a new location or vehicle entry to the data files, it is automatically included in the next build — no manual sitemap maintenance needed.

## Hydration

`src/main.tsx` uses `hydrateRoot` when the `#root` div already has children (prerendered content) and falls back to `createRoot` for pages not in the prerender list (e.g. `/booking-success`, `/booking-cancel`).

## GSAP in SSR mode

GSAP and `@gsap/react` call browser APIs at import time. In SSR mode (`--mode ssr`), `vite.config.ts` aliases them to lightweight no-ops:

```
gsap/ScrollTrigger  →  src/lib/gsap-scroll-trigger-ssr-mock.ts
@gsap/react         →  src/lib/gsap-react-ssr-mock.ts
gsap                →  src/lib/gsap-ssr-mock.ts
```

These mocks are only active during the server bundle build — the client bundle is unaffected.

## Adding new pages

1. Add the component and route to `src/components/PageTransition.tsx`
2. If it's a data-driven page (location / vehicle), add the entry to the relevant data file — the route is picked up automatically via `entry-server.tsx`
3. If it's a standalone page, add the path to `STATIC_ROUTES` in `src/entry-server.tsx` and to `dynamicRoutes` in `vite.config.ts` (for the sitemap)

## Re-running prerender only

If you've already built the client and server bundles and only want to regenerate the static HTML (e.g. after a content change in data files):

```bash
npm run build:ssr && npm run prerender
```

The prerender script is fully idempotent — it strips any previously injected Helmet tags from `dist/index.html` before processing, so running it multiple times produces the same result.
