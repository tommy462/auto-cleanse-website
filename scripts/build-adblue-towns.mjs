// Builds src/data/adblue-towns/towns.json for the AdBlue town pages from the
// gathered research data. Run when the source data changes:
//   node scripts/build-adblue-towns.mjs <input dir>
// Input dir holds base.json, postcodes.json, osm.json, vans.json and
// content/*.json (the written local copy). Towns without local copy are left
// out, and a short report of what was dropped is printed.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/build-adblue-towns.mjs <input dir>');
  process.exit(1);
}
const read = (name, fallback) => (existsSync(join(input, name)) ? JSON.parse(readFileSync(join(input, name), 'utf8')) : fallback);

const base = read('base.json', []);
const postcodes = read('postcodes.json', {});
const osm = read('osm.json', {});
const vans = read('vans.json', { meta: {}, districts: {} });
const content = {};
const contentDir = join(input, 'content');
if (existsSync(contentDir)) {
  for (const f of readdirSync(contentDir).filter((n) => n.endsWith('.json'))) {
    for (const row of JSON.parse(readFileSync(join(contentDir, f), 'utf8'))) content[row.slug] = row;
  }
}

const EXCLUDE = new Set(['lisburn-belfast']);
const IN_HOUSE_COUNTIES = new Set(['Devon', 'Plymouth', 'Torbay']);
const BANNED = /(£\s?\d|24\/7|same[- ]day|\bfree\b|guarantee|nationwide|adblue\.repair|\bdelete|nestled|bustling|vibrant|hidden gem|whether you're|!|—)/i;
const UPDATED = new Date().toISOString().slice(0, 10);

const dropped = { excluded: 0, noCopy: [], banned: [] };
const towns = [];
for (const t of base) {
  if (EXCLUDE.has(t.slug)) { dropped.excluded++; continue; }
  const c = content[t.slug];
  if (!c || !c.intro) { dropped.noCopy.push(t.slug); continue; }
  if (BANNED.test(c.intro) || BANNED.test(c.roads || '')) { dropped.banned.push(t.slug); continue; }
  const districts = postcodes[t.slug]?.districts ?? [];
  const o = osm[t.slug] ?? {};
  let vansRec = null;
  if (vans.districts && districts.length) {
    const counts = districts.map((d) => vans.districts[d]).filter((v) => typeof v === 'number');
    if (counts.length) vansRec = { count: Math.round(counts.reduce((a, b) => a + b, 0) / 10) * 10, quarter: vans.meta?.quarter ?? '' };
  }
  towns.push({
    slug: t.slug,
    name: t.display,
    county: t.county ?? '',
    region: t.region,
    country: t.country,
    lat: t.lat,
    lng: t.lng,
    pop: Math.round(t.pop / 100) * 100,
    kmFromTotnes: t.kmFromTotnes,
    // The South West is home turf (our own technicians in Devon), so every
    // South West town goes out in the first wave whatever its size.
    wave: t.region === 'South West' ? 1 : t.wave,
    inHouse: IN_HOUSE_COUNTIES.has(t.county),
    districts,
    roads: (o.roads ?? []).slice(0, 8),
    services: (o.services ?? []).slice(0, 3).map((s) => ({ name: s.name, ...(s.road ? { road: s.road } : {}), km: s.km })),
    pumps: (o.adbluePumps ?? []).slice(0, 3).map((p) => ({ name: p.name, km: p.km, ...(p.town ? { town: p.town } : {}) })),
    vans: vansRec,
    intro: c.intro.trim(),
    roadsText: (c.roads ?? '').trim(),
    updated: UPDATED,
  });
}
towns.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

const out = join(root, 'src', 'data', 'adblue-towns');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'towns.json'), JSON.stringify(towns));
console.log(`towns.json: ${towns.length} towns (wave 1: ${towns.filter((t) => t.wave === 1).length}, wave 2: ${towns.filter((t) => t.wave === 2).length})`);
console.log(`dropped: excluded ${dropped.excluded}, no copy ${dropped.noCopy.length}, banned wording ${dropped.banned.length}`);
if (dropped.noCopy.length) console.log('  no copy:', dropped.noCopy.slice(0, 20).join(', '), dropped.noCopy.length > 20 ? '...' : '');
if (dropped.banned.length) console.log('  banned:', dropped.banned.join(', '));
