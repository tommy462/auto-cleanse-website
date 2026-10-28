import { readFileSync, mkdirSync, writeFileSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Load the SSR bundle produced by: vite build --ssr src/entry-server.tsx --outDir dist-server --mode ssr
const { render, routes, blogPosts, privateRoutes, utilityRoutes, townRoutes } = await import('../dist-server/entry-server.js');

// Read the client-side index.html template (produced by: vite build)
const rawTemplate = readFileSync(join(projectRoot, 'dist/index.html'), 'utf-8');

// Make the template idempotent: strip any Helmet tags and rendered root content
// from a previous prerender run so the script can safely be re-run.
const template = rawTemplate
  // Remove self-closing Helmet meta/link tags (e.g. <meta data-rh="true" .../>)
  .replace(/<(?:meta|link)\s[^>]*data-rh="true"[^>]*\/?>/g, '')
  // Remove Helmet script blocks (JSON-LD etc.)
  .replace(/<script\s[^>]*data-rh="true"[^>]*>[\s\S]*?<\/script>/g, '')
  // Remove any static <meta name="description"> - Helmet injects the correct one per page
  .replace(/<meta\s[^>]*name="description"[^>]*\/?>/g, '')
  // Normalise any existing <title> tag (with or without data-rh) to a plain placeholder
  .replace(/<title[^>]*>[\s\S]*?<\/title>/, '<title>__SSR_TITLE__</title>')
  // Clear any previously rendered root div content (greedy match finds the outermost </div>
  // before the first <script>, which is always the root div's closing tag in a Vite build)
  .replace(/<div id="root">[\s\S]*(<\/div>\s*<script)/, '<div id="root">$1');

// De-duplicate routes so a page (e.g. "/") is never rendered or listed twice.
const uniqueRoutes = [...new Set(routes)];

// ── Remove stale prerendered routes ────────────────────────────────────────
// Any dist/<route>/index.html that this app previously prerendered but which is
// no longer in `routes` is deleted, so retired pages never linger in the build
// output (defensive - also protects standalone `npm run prerender` runs).
// Only files that carry our SSR app-root marker are ever removed, so genuine
// static assets are never touched.
const SSR_MARKER = 'min-h-screen bg-[#0A0A0A]';
const distDir = join(projectRoot, 'dist');
const expectedRoutes = new Set(uniqueRoutes);

function findPrerenderedRoutes(dir) {
  const found = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (['assets', 'data', 'blog-covers'].includes(entry.name)) continue;
    const full = join(dir, entry.name);
    const route = full.slice(distDir.length).replace(/\\/g, '/');
    found.push(...findPrerenderedRoutes(full));
    try {
      const html = readFileSync(join(full, 'index.html'), 'utf-8');
      if (html.includes(SSR_MARKER)) found.push(route);
    } catch {
      /* no index.html in this directory */
    }
  }
  return found;
}

let removedStale = 0;
for (const route of findPrerenderedRoutes(distDir)) {
  if (expectedRoutes.has(route)) continue;
  rmSync(join(distDir, route.slice(1)), { recursive: true, force: true });
  console.log(`  ✗ removed stale route ${route}`);
  removedStale++;
}
if (removedStale > 0) {
  console.log(`Removed ${removedStale} stale prerendered route(s).`);
}

// ── Page fingerprints for honest sitemap <lastmod> dates ──────────────────
// Google only trusts <lastmod> when it moves with the page, so a page keeps its
// date until its text changes. The fingerprint covers the title, description
// and <main> text, minus blocks marked data-lastmod-skip (post lists that change
// whenever a new blog post goes out).
function stripSkippedBlocks(html) {
  const open = /<([a-z][a-z0-9]*)\b[^>]*\sdata-lastmod-skip[^>]*>/i;
  let m;
  while ((m = open.exec(html))) {
    const tags = new RegExp(`<${m[1]}\b[^>]*>|</${m[1]}>`, 'gi');
    tags.lastIndex = m.index + m[0].length;
    let depth = 1;
    let end = html.length;
    let t;
    while (depth > 0 && (t = tags.exec(html))) {
      depth += t[0][1] === '/' ? -1 : 1;
      if (depth === 0) end = tags.lastIndex;
    }
    html = html.slice(0, m.index) + html.slice(end);
  }
  return html;
}

function pageFingerprint(appHtml, headTags) {
  const title = headTags.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '';
  const description = headTags.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1] ?? '';
  const start = appHtml.indexOf('<main');
  const end = appHtml.lastIndexOf('</main>');
  const main = start >= 0 && end > start ? appHtml.slice(start, end) : appHtml;
  const text = stripSkippedBlocks(main)
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return createHash('sha1').update(`${title}\n${description}\n${text}`).digest('hex').slice(0, 12);
}

const fingerprints = new Map();
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
    fingerprints.set(url, pageFingerprint(appHtml, headTags));

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

// ── Prerender a real 404 page (dist/404.html) ──────────────────────────────
// Vercel serves a root 404.html with an HTTP 404 status for any path that
// matches no static file, redirect or rewrite. Rendering an unknown slug hits
// the app's NotFound page, which carries noindex via <SEO noindex>.
try {
  const { html: appHtml, helmet } = render('/__404__');
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
  const finalHtml = template
    .replace('<title>__SSR_TITLE__</title>', headTags)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  writeFileSync(join(projectRoot, 'dist/404.html'), finalHtml, 'utf-8');
  console.log('404 page written to dist/404.html');
} catch (err) {
  errors++;
  process.stderr.write(`  ✗ 404.html: ${err.message}\n`);
  if (process.env.PRERENDER_STRICT) process.exit(1);
}

// ── Generate sitemap.xml with tiered priorities ───────────────────────────
const HOSTNAME = 'https://www.auto-cleanse.co.uk';
const lastmod = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (build date)

// Blog posts are never dated before their own updated/publish date.
function normaliseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(+d) ? null : d.toISOString().slice(0, 10);
}
const blogLastmod = new Map(
  (blogPosts ?? []).map((p) => [`/blog/${p.slug}`, normaliseDate(p.updated) || normaliseDate(p.date) || lastmod])
);
// The blog index moves with its newest post.
const newestPost = [...blogLastmod.values()].sort().at(-1);
if (newestPost) blogLastmod.set('/blog', newestPost);

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
  // Blog index + posts
  if (url === '/blog') return { priority: '0.7', changefreq: 'weekly' };
  if (url.startsWith('/blog/')) return { priority: '0.6', changefreq: 'monthly' };
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

// Private campaign landing pages (e.g. /trade-invite/*) are prerendered so the
// printed QR codes resolve, and utility pages (/booking-success, /debug/dvla…)
// are prerendered so they serve their own noindex HTML rather than a copy of the
// homepage - but neither may appear in the public XML sitemap.
const excludedFromSitemap = new Set([...(privateRoutes ?? []), ...(utilityRoutes ?? [])]);
const sitemapRoutes = uniqueRoutes.filter((url) => !excludedFromSitemap.has(url));

// ── Per-page lastmod ───────────────────────────────────────────────────────
// scripts/page-lastmod.json holds [date, fingerprint] for every sitemap URL.
// A page whose fingerprint changed is dated today on a local build, which then
// rewrites the file: commit it with the change. On Vercel the file is only
// read, and a changed page gets the deployed commit's date, so the weekly blog
// rebuilds (same commit) never re-date pages that did not change.
const LASTMOD_FILE = join(__dirname, 'page-lastmod.json');
let savedLastmod = {};
try {
  savedLastmod = JSON.parse(readFileSync(LASTMOD_FILE, 'utf-8'));
} catch {
  /* first run: every page is dated today */
}
let changedOn = lastmod;
if (process.env.VERCEL) {
  try {
    changedOn = execSync('git log -1 --format=%cs', { encoding: 'utf-8' }).trim() || lastmod;
  } catch {
    /* no git metadata: fall back to the build date */
  }
}
const pageLastmod = new Map();
const changedPages = [];
for (const url of sitemapRoutes) {
  const hash = fingerprints.get(url);
  const saved = savedLastmod[url];
  const unchanged = saved && hash && saved[1] === hash;
  if (!unchanged) changedPages.push(url);
  const date = [unchanged ? saved[0] : changedOn, blogLastmod.get(url)].filter(Boolean).sort().at(-1);
  pageLastmod.set(url, date);
}
if (!process.env.VERCEL) {
  const lines = [...pageLastmod.keys()]
    .sort()
    .map((url) => `  ${JSON.stringify(url)}: ${JSON.stringify([pageLastmod.get(url), fingerprints.get(url) ?? ''])}`);
  writeFileSync(LASTMOD_FILE, `{\n${lines.join(',\n')}\n}\n`, 'utf-8');
}
console.log(
  changedPages.length === 0
    ? 'lastmod: no page text changed.'
    : `lastmod: ${changedPages.length} page(s) changed, dated ${changedOn}` +
        (process.env.VERCEL ? ' (page-lastmod.json was not committed with them).' : '. Commit scripts/page-lastmod.json.')
);

const sitemapBody = sitemapRoutes
  .map((url) => {
    const { priority, changefreq } = rankFor(url);
    const loc = `${HOSTNAME}${url === '/' ? '/' : url}`;
    const urlLastmod = pageLastmod.get(url) || lastmod;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${urlLastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`;

writeFileSync(join(projectRoot, 'dist/sitemap.xml'), sitemapXml, 'utf-8');
console.log(
  `Sitemap written with ${sitemapRoutes.length} URLs` +
    (excludedFromSitemap.size > 0
      ? ` (${excludedFromSitemap.size} private/utility route(s) excluded).`
      : '.')
);

// ── Guard: the sitemap must only ever contain canonical WWW URLs ───────────
// Any non-WWW, trailing-slash (other than the root) or duplicate <loc> is a
// build error rather than something to discover in Search Console later.
const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapProblems = [];
for (const loc of locs) {
  if (!loc.startsWith(`${HOSTNAME}/`)) sitemapProblems.push(`not on ${HOSTNAME}: ${loc}`);
  if (loc !== `${HOSTNAME}/` && loc.endsWith('/')) sitemapProblems.push(`trailing slash: ${loc}`);
}
const dupes = locs.filter((loc, i) => locs.indexOf(loc) !== i);
for (const dupe of [...new Set(dupes)]) sitemapProblems.push(`duplicate: ${dupe}`);
if (sitemapProblems.length > 0) {
  for (const problem of sitemapProblems) process.stderr.write(`  ✗ sitemap ${problem}
`);
  errors += sitemapProblems.length;
} else {
  console.log(`Sitemap check passed: ${locs.length} unique canonical ${HOSTNAME} URLs.`);
}

// ── AdBlue town sitemap ────────────────────────────────────────────────────
// The town pages are also listed on their own (they stay in sitemap.xml too),
// so Search Console's page-indexing report can be filtered to just the towns.
// That count decides when the next wave of towns is published.
const townSet = new Set(townRoutes ?? []);
const townLocs = sitemapRoutes.filter((url) => townSet.has(url)).map((url) => `${HOSTNAME}${url}`);
const townSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${townLocs
  .map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${pageLastmod.get(loc.slice(HOSTNAME.length)) || lastmod}</lastmod>\n  </url>`)
  .join('\n')}\n</urlset>\n`;
writeFileSync(join(projectRoot, 'dist/sitemap-adblue-towns.xml'), townSitemapXml, 'utf-8');
console.log(`Town sitemap written with ${townLocs.length} URLs.`);
if (townLocs.length !== townSet.size) {
  process.stderr.write(`  ✗ town sitemap has ${townLocs.length} URLs but ${townSet.size} towns are published\n`);
  errors++;
}

// ── RSS feed for the blog ──────────────────────────────────────────────────
function escapeXml(s = '') {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const rssItems = (blogPosts ?? [])
  .map((p) => {
    const link = `${HOSTNAME}/blog/${p.slug}`;
    const pub = p.date ? new Date(p.date).toUTCString() : new Date().toUTCString();
    return `    <item>\n      <title>${escapeXml(p.title)}</title>\n      <link>${link}</link>\n      <guid isPermaLink="true">${link}</guid>\n      <pubDate>${pub}</pubDate>\n      <category>${escapeXml(p.category)}</category>\n      <description>${escapeXml(p.excerpt)}</description>\n    </item>`;
  })
  .join('\n');
const rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Auto-Cleanse Workshop Blog</title>\n    <link>${HOSTNAME}/blog</link>\n    <description>DPF cleaning, AdBlue and ECU remapping advice from Auto-Cleanse, Devon.</description>\n    <language>en-GB</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${rssItems}\n  </channel>\n</rss>\n`;
mkdirSync(join(projectRoot, 'dist/blog'), { recursive: true });
writeFileSync(join(projectRoot, 'dist/blog/rss.xml'), rssXml, 'utf-8');
console.log(`RSS written with ${(blogPosts ?? []).length} posts.`);

if (errors > 0) {
  process.exit(1);
}
