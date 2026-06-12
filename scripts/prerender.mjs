import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Load the SSR bundle produced by: vite build --ssr src/entry-server.tsx --outDir dist-server --mode ssr
const { render, routes } = await import('../dist-server/entry-server.js');

// Read the client-side index.html template (produced by: vite build)
const rawTemplate = readFileSync(join(projectRoot, 'dist/index.html'), 'utf-8');

// Make the template idempotent: strip any Helmet tags and rendered root content
// from a previous prerender run so the script can safely be re-run.
const template = rawTemplate
  // Remove self-closing Helmet meta/link tags (e.g. <meta data-rh="true" .../>)
  .replace(/<(?:meta|link)\s[^>]*data-rh="true"[^>]*\/?>/g, '')
  // Remove Helmet script blocks (JSON-LD etc.)
  .replace(/<script\s[^>]*data-rh="true"[^>]*>[\s\S]*?<\/script>/g, '')
  // Remove any static <meta name="description"> — Helmet injects the correct one per page
  .replace(/<meta\s[^>]*name="description"[^>]*\/?>/g, '')
  // Normalise any existing <title> tag (with or without data-rh) to a plain placeholder
  .replace(/<title[^>]*>[\s\S]*?<\/title>/, '<title>__SSR_TITLE__</title>')
  // Clear any previously rendered root div content (greedy match finds the outermost </div>
  // before the first <script>, which is always the root div's closing tag in a Vite build)
  .replace(/<div id="root">[\s\S]*(<\/div>\s*<script)/, '<div id="root">$1');

// De-duplicate routes so a page (e.g. "/") is never rendered or listed twice.
const uniqueRoutes = [...new Set(routes)];

const total = uniqueRoutes.length;
let rendered = 0;
let errors = 0;

console.log(`\nPrerendering ${total} pages...\n`);

for (const url of uniqueRoutes) {
  try {
    const { html: appHtml, helmet } = render(url);

    // Build head tags from Helmet SSR context
    const headTags = [
      helmet.title?.toString() ?? '',
      helmet.meta?.toString() ?? '',
      helmet.link?.toString() ?? '',
      helmet.script?.toString() ?? '',
      helmet.style?.toString() ?? '',
      helmet.noscript?.toString() ?? '',
    ]
      .filter(Boolean)
      .join('\n    ');

    // Inject into template:
    // 1. Replace the placeholder <title> with all Helmet head tags
    // 2. Inject rendered body HTML into #root
    const finalHtml = template
      .replace('<title>__SSR_TITLE__</title>', headTags)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    // Write to dist/[path]/index.html
    const outputPath =
      url === '/'
        ? join(projectRoot, 'dist/index.html')
        : join(projectRoot, 'dist', url.slice(1), 'index.html');

    const outputDir = dirname(outputPath);
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputPath, finalHtml, 'utf-8');

    rendered++;
    process.stdout.write(`  ✓ ${url}\n`);
  } catch (err) {
    errors++;
    process.stderr.write(`  ✗ ${url}: ${err.message}\n`);
    if (process.env.PRERENDER_STRICT) {
      process.exit(1);
    }
  }
}

console.log(`\n${rendered} pages rendered${errors > 0 ? `, ${errors} errors` : ''}.`);

// ── Generate sitemap.xml with tiered priorities ───────────────────────────
const HOSTNAME = 'https://www.auto-cleanse.co.uk';
const lastmod = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const CORE_HUBS = new Set([
  '/services',
  '/dpf-cleaning',
  '/dpf-cleaning-devon',
  '/ecu-remapping',
  '/ecu-remapping-locations',
  '/postal-dpf',
  '/ecu-cloning',
]);

function rankFor(url) {
  if (url === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (CORE_HUBS.has(url)) return { priority: '0.9', changefreq: 'weekly' };
  // Town/location landing pages (highest local-SEO value after hubs)
  if (url.startsWith('/ecu-remapping-') || url.startsWith('/dpf-cleaning-'))
    return { priority: '0.8', changefreq: 'monthly' };
  // Service-type "…-devon" pages (e.g. van-remapping-devon)
  if (url.endsWith('-devon')) return { priority: '0.7', changefreq: 'monthly' };
  // Vehicle remap pages
  if (url.endsWith('-remap')) return { priority: '0.6', changefreq: 'monthly' };
  // Conversion / utility pages (book, contact, pricing, about, tools…)
  return { priority: '0.5', changefreq: 'monthly' };
}

const sitemapBody = uniqueRoutes
  .map((url) => {
    const { priority, changefreq } = rankFor(url);
    const loc = `${HOSTNAME}${url === '/' ? '/' : url}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`;

writeFileSync(join(projectRoot, 'dist/sitemap.xml'), sitemapXml, 'utf-8');
console.log(`Sitemap written with ${uniqueRoutes.length} URLs.`);

if (errors > 0) {
  process.exit(1);
}
