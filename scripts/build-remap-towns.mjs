// Builds src/data/remap-towns/towns.json for the national Stage 1 remap town
// pages. Run when the source data or copy changes:
//   node scripts/build-remap-towns.mjs <input dir>
// The input dir holds sheets/all.json (one fact sheet per town: DfT VEH0105 and
// VEH0142 council figures, Census travel to work, clean air zone, MOT models)
// and content/*.json (the written intro and driving copy). Base fields come
// from the AdBlue towns.json. Towns without copy, or with banned wording, are
// left out and listed.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/build-remap-towns.mjs <input dir>');
  process.exit(1);
}

const sheets = JSON.parse(readFileSync(join(input, 'sheets', 'all.json'), 'utf8'));
const adblue = Object.fromEntries(JSON.parse(readFileSync(join(root, 'src/data/adblue-towns/towns.json'), 'utf8')).map((t) => [t.slug, t]));
const content = {};
const contentDir = join(input, 'content');
if (existsSync(contentDir)) {
  for (const f of readdirSync(contentDir).filter((n) => n.endsWith('.json'))) {
    for (const row of JSON.parse(readFileSync(join(contentDir, f), 'utf8'))) content[row.slug] = row;
  }
}

// Our vehicle remap pages for the generic models MOT data names (DfT generic
// model names). Only models with a page that covers their diesel are linked.
const MODEL_PAGES = {
  'FORD TRANSIT': ['ford-transit-remap', 'Ford Transit'],
  'FORD TRANSIT CUSTOM': ['ford-transit-custom-remap', 'Ford Transit Custom'],
  'VAUXHALL VIVARO': ['vauxhall-vivaro-remap', 'Vauxhall Vivaro'],
  'VOLKSWAGEN TRANSPORTER': ['vw-transporter-remap', 'VW Transporter'],
  'MERCEDES-BENZ SPRINTER': ['mercedes-sprinter-remap', 'Mercedes Sprinter'],
  'RENAULT TRAFIC': ['renault-trafic-remap', 'Renault Trafic'],
  'CITROEN BERLINGO': ['citroen-berlingo-remap', 'Citroen Berlingo'],
  'FORD RANGER': ['ford-ranger-remap', 'Ford Ranger'],
  'BMW 1 SERIES': ['bmw-118d-remap', 'BMW 1 Series'],
  'BMW 3 SERIES': ['bmw-320d-remap', 'BMW 3 Series'],
  'BMW 5 SERIES': ['bmw-520d-remap', 'BMW 5 Series'],
  'MERCEDES-BENZ C CLASS': ['mercedes-c220-remap', 'Mercedes C-Class'],
  'MERCEDES-BENZ E CLASS': ['mercedes-e220-remap', 'Mercedes E-Class'],
  'NISSAN QASHQAI': ['nissan-qashqai-remap', 'Nissan Qashqai'],
  'NISSAN JUKE': ['nissan-juke-remap', 'Nissan Juke'],
  'FORD KUGA': ['ford-kuga-remap', 'Ford Kuga'],
  'LAND ROVER DISCOVERY': ['land-rover-discovery-remap', 'Land Rover Discovery'],
  'LAND ROVER RANGE ROVER EVOQUE': ['range-rover-evoque-remap', 'Range Rover Evoque'],
  'AUDI A3': ['audi-a3-remap', 'Audi A3'],
  'VAUXHALL ASTRA': ['vauxhall-astra-remap', 'Vauxhall Astra'],
  'VOLKSWAGEN TIGUAN': ['vw-tiguan-remap', 'VW Tiguan'],
};
const vehicleSource = readFileSync(join(root, 'src/data/vehicle-remapping.ts'), 'utf8');
for (const [slug] of Object.values(MODEL_PAGES)) {
  if (!vehicleSource.includes(`slug: '${slug}'`)) throw new Error(`MODEL_PAGES points at a missing vehicle page: ${slug}`);
}

// What each zone charges, in plain words (from the operators' pages, checked 29 Oct 2026).
const CAZ_SCOPE = {
  // Every London page is in the ULEZ, so a scope line would only repeat across 32 pages.
  'London Ultra Low Emission Zone (ULEZ)': '',
  'Birmingham Clean Air Zone': 'It covers the city centre inside the A4540 Middleway and applies to cars and vans.',
  'Bristol Clean Air Zone': 'It covers a small area of central Bristol and applies to cars and vans.',
  'Bath Clean Air Zone': 'It covers central Bath and charges vans, not private cars.',
  'Bradford Clean Air Zone': 'It covers Bradford city centre and the outer ring road area and charges vans, not private cars.',
  'Sheffield Clean Air Zone': 'It covers Sheffield city centre and the inner ring road and charges vans, not private cars.',
  'Newcastle and Gateshead (Tyneside) Clean Air Zone': 'It covers part of central Newcastle and Gateshead, including the Tyne crossings, and charges vans, not private cars.',
  'Oxford Zero Emission Zone (pilot)': 'It is a pilot covering a few city-centre streets and charges any vehicle that is not zero emission.',
  'Glasgow Low Emission Zone': 'It covers about one square mile of the city centre and issues penalty charges to vehicles that do not meet its standards.',
  'Edinburgh Low Emission Zone': 'It covers the city centre and issues penalty charges to vehicles that do not meet its standards.',
  'Aberdeen Low Emission Zone': 'It covers the city centre and issues penalty charges to vehicles that do not meet its standards.',
  'Dundee Low Emission Zone': 'It covers the area inside the A991 Inner Ring Road and issues penalty charges to vehicles that do not meet its standards.',
};

const BANNED = /(£|24\/7|same[- ]day|\bfree\b|guarantee|nationwide|\bdelet|nestled|bustling|vibrant|hidden gem|whether you're|!|—|–)/i;
const UPDATED = new Date().toISOString().slice(0, 10);

const dropped = { noCopy: [], banned: [], noCaz: [] };
const towns = [];
for (const s of sheets) {
  const c = content[s.slug];
  if (!c?.intro || !c?.driving) { dropped.noCopy.push(s.slug); continue; }
  if (BANNED.test(c.intro) || BANNED.test(c.driving)) { dropped.banned.push(s.slug); continue; }
  const base = adblue[s.slug];
  const v = s.council;
  const census = s.census;
  let caz = null;
  if (s.cleanAirZone) {
    const scope = CAZ_SCOPE[s.cleanAirZone.name];
    if (scope !== undefined) caz = { name: s.cleanAirZone.name.replace(/ \(pilot\)$/, ''), ...(scope ? { scope } : {}) };
    else dropped.noCaz.push(s.slug);
  }
  // Most-tested diesel models first, cars and vans interleaved by count.
  const models = [];
  const tested = [...(s.mot?.topDieselCars ?? []), ...(s.mot?.topDieselVans ?? [])].sort((a, b) => b.vehicles - a.vehicles);
  for (const m of tested) {
    const page = MODEL_PAGES[m.model];
    if (page && !models.some((x) => x.slug === page[0])) models.push({ slug: page[0], name: page[1] });
  }
  towns.push({
    slug: s.slug,
    name: s.name,
    county: s.county ?? '',
    region: s.region,
    country: s.country,
    lat: base.lat,
    lng: base.lng,
    pop: s.population,
    wave: 1,
    districts: s.postcodeDistricts,
    roads: s.mainRoadsOSM.slice(0, 8),
    vehicles: {
      area: v.area,
      quarter: v.quarter,
      cars: v.privateCars,
      carsDieselPct: Math.round(v.dieselCarsPct),
      carsPetrolPct: Math.round(v.petrolCarsPct),
      vans: v.privateVans,
      vansDieselPct: Math.round(v.dieselVansPct),
    },
    census: census
      ? {
          area: census.area,
          census: census.census,
          driveToWorkPct: census.driveToWorkPct,
          ...(census.km30plusPct !== undefined ? { km30plusPct: census.km30plusPct } : {}),
          ...(census.twoPlusCarsPct !== undefined ? { twoPlusCarsPct: census.twoPlusCarsPct } : {}),
          ...(census.englandAndWales ? { national: census.englandAndWales } : {}),
        }
      : null,
    caz,
    models: models.slice(0, 6),
    ...(models.length ? { modelsArea: { postcodeArea: s.mot.postcodeArea, year: s.mot.year } } : {}),
    intro: c.intro.trim(),
    driving: c.driving.trim(),
    updated: UPDATED,
  });
}
towns.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

const out = join(root, 'src', 'data', 'remap-towns');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'towns.json'), JSON.stringify(towns));
console.log(`towns.json: ${towns.length} remap towns`);
console.log(`dropped: no copy ${dropped.noCopy.length}, banned wording ${dropped.banned.length}`);
if (dropped.noCopy.length) console.log('  no copy:', dropped.noCopy.join(', '));
if (dropped.banned.length) console.log('  banned:', dropped.banned.join(', '));
if (dropped.noCaz.length) console.log('  clean air zone without a scope line (left off):', dropped.noCaz.join(', '));
