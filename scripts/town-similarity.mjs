// Near-duplicate check for generated town pages. Run after `npm run build`:
//   node scripts/town-similarity.mjs [sitemap file in dist] [compare sitemap]
// Defaults to the remap towns, compared with the AdBlue towns.
//
// Reads each page's visible <main> text from dist (header and footer are not in
// <main>), splits it into overlapping 5-word shingles and reports:
// - Jaccard overlap for every pair of pages in the set (worst pairs listed),
// - each page's unique share: shingles found on no other page in the set,
// - the overlap of each page with the same town's page in the compare set,
// - the same pairwise figures for the compare set, as a baseline.
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const setFile = process.argv[2] ?? 'sitemap-remap-towns.xml';
const compareFile = process.argv[3] ?? 'sitemap-adblue-towns.xml';
const SHINGLE = 5;

function routesFrom(file) {
  const xml = readFileSync(join(dist, file), 'utf-8');
  return [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function mainText(route) {
  const file = join(dist, route.slice(1), 'index.html');
  if (!existsSync(file)) return null;
  const html = readFileSync(file, 'utf-8');
  const start = html.indexOf('<main');
  const end = html.lastIndexOf('</main>');
  return html
    .slice(start, end)
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shingles(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9%' ]+/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + SHINGLE <= words.length; i++) set.add(words.slice(i, i + SHINGLE).join(' '));
  return { set, words: words.length };
}

function jaccard(a, b) {
  let inter = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const s of small) if (big.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

function load(file) {
  return routesFrom(file)
    .map((route) => {
      const text = mainText(route);
      return text ? { route, slug: route.split('/').pop(), ...shingles(text) } : null;
    })
    .filter(Boolean);
}

function pairwise(pages, sampleLimit = Infinity) {
  const list = pages.length > sampleLimit ? pages.filter((_, i) => i % Math.ceil(pages.length / sampleLimit) === 0) : pages;
  const pairs = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) pairs.push({ a: list[i].slug, b: list[j].slug, j: jaccard(list[i].set, list[j].set) });
  }
  pairs.sort((x, y) => y.j - x.j);
  const mean = pairs.reduce((s, p) => s + p.j, 0) / (pairs.length || 1);
  return { pairs, mean, sampled: list.length };
}

function uniqueShare(pages) {
  const counts = new Map();
  for (const p of pages) for (const s of p.set) counts.set(s, (counts.get(s) ?? 0) + 1);
  return pages
    .map((p) => {
      let unique = 0;
      for (const s of p.set) if (counts.get(s) === 1) unique++;
      return { slug: p.slug, share: unique / p.set.size, words: p.words };
    })
    .sort((x, y) => x.share - y.share);
}

const pct = (n) => `${(n * 100).toFixed(1)}%`;
const pages = load(setFile);
const compare = existsSync(join(dist, compareFile)) ? load(compareFile) : [];

const set = pairwise(pages);
const uniq = uniqueShare(pages);
console.log(`\n${setFile}: ${pages.length} pages, ${Math.round(pages.reduce((s, p) => s + p.words, 0) / pages.length)} words of main text on average`);
console.log(`Pairwise 5-word-shingle overlap (Jaccard): mean ${pct(set.mean)}, worst ${pct(set.pairs[0]?.j ?? 0)}`);
console.log('Worst 10 pairs:');
for (const p of set.pairs.slice(0, 10)) console.log(`  ${pct(p.j).padStart(6)}  ${p.a}  vs  ${p.b}`);
console.log(`Unique share (text found on no other page in the set): median ${pct(uniq[Math.floor(uniq.length / 2)].share)}, lowest:`);
for (const u of uniq.slice(0, 5)) console.log(`  ${pct(u.share).padStart(6)}  ${u.slug} (${u.words} words)`);

if (compare.length) {
  const bySlug = new Map(compare.map((p) => [p.slug, p]));
  const cross = pages
    .filter((p) => bySlug.has(p.slug))
    .map((p) => ({ slug: p.slug, j: jaccard(p.set, bySlug.get(p.slug).set) }))
    .sort((x, y) => y.j - x.j);
  if (cross.length) {
    console.log(`\nSame town vs ${compareFile}: mean ${pct(cross.reduce((s, c) => s + c.j, 0) / cross.length)}, worst:`);
    for (const c of cross.slice(0, 5)) console.log(`  ${pct(c.j).padStart(6)}  ${c.slug}`);
  }
  // Baseline: the compare set's own overlap, on the same towns where possible.
  const slugs = new Set(pages.map((p) => p.slug));
  const sameTowns = compare.filter((p) => slugs.has(p.slug));
  const base = pairwise(sameTowns.length >= 20 ? sameTowns : compare, 150);
  const baseUniq = uniqueShare(sameTowns.length >= 20 ? sameTowns : compare);
  console.log(`\nBaseline, ${compareFile} (${base.sampled} pages): pairwise mean ${pct(base.mean)}, worst ${pct(base.pairs[0]?.j ?? 0)}, median unique share ${pct(baseUniq[Math.floor(baseUniq.length / 2)].share)}`);
}
