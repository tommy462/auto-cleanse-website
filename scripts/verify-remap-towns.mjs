// Check the built HTML, rather than just the React data, before publishing.
// Run after npm run build: node scripts/verify-remap-towns.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, privateRoutes, remapTownRoutes } from '../dist-server/entry-server.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const towns = JSON.parse(readFileSync(join(root, 'src/data/remap-towns/towns.json'), 'utf8'));
const read = (path) => readFileSync(join(root, 'dist', path), 'utf8');
const locs = (file) => [...read(file).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const host = 'https://www.auto-cleanse.co.uk';
const mainSitemap = new Set(locs('sitemap.xml'));
const remapSitemap = locs('sitemap-remap-towns.xml');
const adblueSitemap = new Set(locs('sitemap-adblue-towns.xml'));
const published = new Set(remapTownRoutes);
const data = new Map(towns.map((town) => [town.slug, town]));
assert.equal(data.size, towns.length, 'Duplicate town slugs');
assert.equal(remapSitemap.length, published.size, 'Incomplete remap sitemap');
assert.equal(new Set(remapSitemap).size, remapSitemap.length, 'Duplicate remap sitemap URLs');

for (const route of published) {
  const slug = route.split('/').at(-1);
  const town = data.get(slug);
  assert.ok(town, `Missing town data: ${route}`);
  assert.notEqual(town.county, 'Devon', `Devon town in national set: ${slug}`);
  const html = read(`${route.slice(1)}/index.html`);
  const main = html.slice(html.indexOf('<main'), html.lastIndexOf('</main>'));
  assert.ok(main.length > 0, `Missing main content: ${slug}`);
  const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(canonical, [`${host}${route}`], `Wrong canonical: ${slug}`);
  assert.equal((main.match(/<h1\b/g) ?? []).length, 1, `Expected one H1: ${slug}`);
  assert.ok(remapSitemap.includes(`${host}${route}`), `Missing town sitemap URL: ${slug}`);
  assert.ok(mainSitemap.has(`${host}${route}`), `Missing main sitemap URL: ${slug}`);
  assert.ok(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html), `Town is noindex: ${slug}`);
  const payload = html.match(/window\.__REMAP_TOWN__=([\s\S]*?);<\/script>/);
  assert.ok(payload, `Missing hydration data: ${slug}`);
  const inline = JSON.parse(payload[1]);
  assert.equal(inline.slug, slug, `Wrong hydration record: ${slug}`);
  assert.equal(inline.intro, town.intro, `Intro differs from saved copy: ${slug}`);
  assert.equal(inline.driving, town.driving, `Driving copy differs from saved copy: ${slug}`);
  assert.ok(!/placeholder|TODO|lorem ipsum|[—–]/i.test(`${town.intro} ${town.driving}`), `Draft copy: ${slug}`);
  assert.ok(!/£|\bguarantee|\bnationwide\b|\bMET\b/i.test(main.replace(/<script[\s\S]*?<\/script>/g, '')), `Unapproved national claim: ${slug}`);
  if (town.country === 'Scotland' && town.census) {
    assert.equal(town.census.nationalLabel, 'Scotland', `Wrong Scottish comparison: ${slug}`);
    assert.ok(town.census.census.includes('2022'), `Wrong Scottish Census year: ${slug}`);
  }
  if (town.country === 'Northern Ireland') {
    assert.equal(town.models.length, 0, `DVSA model data on NI page: ${slug}`);
    if (town.census?.national) assert.equal(town.census.nationalLabel, 'Northern Ireland', `Wrong NI comparison: ${slug}`);
    if (town.census?.note?.includes('approximated')) assert.ok(main.includes('workers exclude full-time students'), `Missing NI data limitation: ${slug}`);
  }
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faq = schemas.find((schema) => schema['@type'] === 'FAQPage');
  assert.equal(faq?.mainEntity.length, town.caz ? 3 : 2, `Wrong FAQ schema: ${slug}`);
  for (const match of main.matchAll(/<a\b[^>]*href="(\/[^"?#]*)/g)) {
    const path = match[1].replace(/\/$/, '');
    assert.ok(existsSync(join(root, 'dist', path, 'index.html')), `Broken internal link ${path} on ${slug}`);
  }
}

const index = read('ecu-remapping/areas/index.html');
const indexPayload = index.match(/window\.__REMAP_TOWN_INDEX__=([\s\S]*?);<\/script>/);
assert.equal(JSON.parse(indexPayload[1]).length, published.size, 'Areas index is incomplete');
for (const route of privateRoutes) {
  const html = read(`${route.slice(1)}/index.html`);
  assert.ok(html.includes('noindex'), `Private route must remain noindex: ${route}`);
  assert.ok(!mainSitemap.has(`${host}${route}`), `Private route in sitemap: ${route}`);
  const response = await fetch(`http://127.0.0.1:4173${route}/`);
  assert.equal(response.status, 200, `Private route does not return 200: ${route}`);
  assert.ok((await response.text()).includes('noindex'), `Private route served wrong HTML: ${route}`);
}
assert.ok(render('/ecu-remapping/not-a-real-town').helmet.meta.toString().includes('noindex'), 'Unknown town must be noindex');
console.log(`PASS: ${published.size} remap pages, canonicals, rendered copy, FAQs, hydration data, internal links and areas index.`);
console.log(`PASS: ${adblueSitemap.size} AdBlue sitemap URLs; ${privateRoutes.length} private trade-invite pages return HTTP 200 and stay outside the sitemap.`);
