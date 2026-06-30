// Generates branded blog cover images (the fallback + the two example posts).
// Re-run after editing: node scripts/generate-blog-covers.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');
const EMBLEM = join(pub, 'UniversalUpscaler_2dfd4994-6f3d-4696-9702-f0cd99f34a8c (1).png');
const DARK = '#0A0A0A';
const ORANGE = '#FF7A00';

async function cover(out, label) {
  const W = 1200;
  const H = 675;
  mkdirSync(dirname(out), { recursive: true });

  const emblem = await sharp(EMBLEM).resize({ height: 150 }).png().toBuffer();
  const em = await sharp(emblem).metadata();

  const svg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
       <rect x="0" y="${H - 10}" width="${W}" height="10" fill="${ORANGE}"/>
       <text x="${W / 2}" y="${H / 2 + 80}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="56" font-weight="800" fill="#FFFFFF">${label}</text>
       <text x="${W / 2}" y="${H / 2 + 128}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="${ORANGE}" letter-spacing="5">AUTO-CLEANSE &#183; DEVON</text>
     </svg>`
  );

  await sharp({ create: { width: W, height: H, channels: 4, background: DARK } })
    .composite([
      { input: emblem, top: Math.round(H / 2 - 160), left: Math.round((W - em.width) / 2) },
      { input: svg, top: 0, left: 0 },
    ])
    .jpeg({ quality: 85 })
    .toFile(out);
  console.log('  ✓', out.replace(pub, 'public'));
}

console.log('\nGenerating blog covers...\n');
await cover(join(pub, 'blog/default-cover.jpg'), 'Workshop Notes');
await cover(join(pub, 'blog/blocked-dpf-ford-transit-custom/cover.jpg'), 'DPF Cleaning');
await cover(join(pub, 'blog/adblue-no-start-countdown-sprinter/cover.jpg'), 'AdBlue Repair');
console.log('\nDone.\n');
