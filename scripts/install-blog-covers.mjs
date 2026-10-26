// Installs supplied cover artwork for blog posts (the filename -> slug map
// lives in scripts/blog-cover-map.mjs).
//
// Source PNGs live in the workspace root, named after the post title. They are
// resized to the 1200x675 the blog layout reserves (prevents layout shift) and
// written as JPG to public/blog/<slug>/cover.jpg.
//
// Re-runnable: node scripts/install-blog-covers.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync, statSync } from 'fs';
import { COVER_ART } from './blog-cover-map.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const pub = join(projectRoot, 'public');
// workspace root, two levels above project (…/autocleansewebsite/project)
const srcRoot = join(projectRoot, '..', '..');

const W = 1200, H = 675;

const MAP = COVER_ART;

console.log('\nInstalling blog covers...\n');
let done = 0, missing = [];

for (const [file, slug] of Object.entries(MAP)) {
  const src = join(srcRoot, file);
  if (!existsSync(src)) { missing.push(file); console.log(`  ! MISSING source: ${file}`); continue; }

  const out = join(pub, 'blog', slug, 'cover.jpg');
  mkdirSync(dirname(out), { recursive: true });

  // 'cover' keeps the 16:9 framing; these sources are already ~16:9 so the crop
  // is sub-pixel. mozjpeg at q82 keeps these dark, flat graphics well under
  // 100KB with no visible banding, which matters on a mobile-first site.
  await sharp(src)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(out);

  const kb = (statSync(out).size / 1024).toFixed(0);
  console.log(`  ✓ ${slug}/cover.jpg  (${kb} KB)`);
  done++;
}

console.log(`\nDone. ${done}/${Object.keys(MAP).length} covers installed.`);
if (missing.length) console.log(`Missing sources: ${missing.join(', ')}`);
console.log('');
