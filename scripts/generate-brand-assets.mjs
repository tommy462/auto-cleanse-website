// One-off brand asset generator.
// Produces the social share image (og-image.jpg) and favicons from the
// existing AutoCleanse "AC" emblem + wordmark. Re-run after a logo change:
//   node scripts/generate-brand-assets.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');

const EMBLEM = join(pub, 'UniversalUpscaler_2dfd4994-6f3d-4696-9702-f0cd99f34a8c (1).png');
const WORDMARK = join(pub, 'autocleanse-text-logo.png');
const DARK = '#0A0A0A';
const ORANGE = '#FF7A00';

// Recolour a dark-on-transparent PNG to solid white, preserving its alpha.
async function whiten(src, width) {
  const resized = await sharp(src).resize({ width }).ensureAlpha().png().toBuffer();
  const meta = await sharp(resized).metadata();
  const alpha = await sharp(resized).extractChannel('alpha').toBuffer();
  return sharp({ create: { width: meta.width, height: meta.height, channels: 3, background: '#FFFFFF' } })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

// ---------- OG / social share image (1200 x 630) ----------
async function buildOgImage() {
  const W = 1200;
  const H = 630;

  const emblem = await sharp(EMBLEM).resize({ height: 230 }).png().toBuffer();
  const emblemMeta = await sharp(emblem).metadata();

  // Wordmark artwork is dark-on-transparent. Recolour it to solid white by
  // filling a white canvas and re-using the original artwork's alpha as the mask.
  const wordmark = await whiten(WORDMARK, 560);
  const wordmarkMeta = await sharp(wordmark).metadata();

  const tagSvg = Buffer.from(
    `<svg width="${W}" height="140" xmlns="http://www.w3.org/2000/svg">
       <text x="${W / 2}" y="56" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="700" fill="${ORANGE}" letter-spacing="1">DPF Cleaning &amp; ECU Remapping</text>
       <text x="${W / 2}" y="112" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="500" fill="#FFFFFF" letter-spacing="6">DEVON &#160;&#183;&#160; 01803 269895</text>
     </svg>`
  );

  const emblemTop = 80;
  const wordmarkTop = emblemTop + emblemMeta.height + 34;
  const tagTop = wordmarkTop + wordmarkMeta.height + 40;

  await sharp({ create: { width: W, height: H, channels: 4, background: DARK } })
    .composite([
      { input: emblem, top: emblemTop, left: Math.round((W - emblemMeta.width) / 2) },
      { input: wordmark, top: wordmarkTop, left: Math.round((W - wordmarkMeta.width) / 2) },
      { input: tagSvg, top: tagTop, left: 0 },
      // thin orange rule under the lockup
      { input: { create: { width: 220, height: 4, channels: 4, background: ORANGE } }, top: wordmarkTop + wordmarkMeta.height + 16, left: Math.round((W - 220) / 2) },
    ])
    .jpeg({ quality: 88 })
    .toFile(join(pub, 'og-image.jpg'));
  console.log('  ✓ public/og-image.jpg (1200x630)');
}

// ---------- Favicons ----------
async function buildFavicon(size, file) {
  const inner = Math.round(size * 0.74);
  const emblem = await sharp(EMBLEM).resize({ width: inner, fit: 'inside' }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: DARK } })
    .composite([{ input: emblem, gravity: 'center' }])
    .png()
    .toFile(join(pub, file));
  console.log(`  ✓ public/${file} (${size}x${size})`);
}

console.log('\nGenerating brand assets...\n');
await buildOgImage();
await buildFavicon(32, 'favicon-32x32.png');
await buildFavicon(180, 'apple-touch-icon.png');
await buildFavicon(512, 'favicon-512x512.png');
console.log('\nDone.\n');
