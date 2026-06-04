/**
 * Compress portfolio images for the RemapPortfolio carousel.
 * Resizes to max 800px wide (2× retina for 320px card) and compresses at quality 78.
 * Writes to a temp file then replaces the original.
 */
import sharp from 'sharp';
import { stat, rename, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const targets = [
  'ranger2013.jpg',
  'ranger.jpg',
  'transit2.jpg',
  'aygo.jpg',
  'tiguan.jpg',
  'portfolio-0.jpg',
  'portfolio-1.jpg',
  'portfolio-2.jpg',
  'portfolio-3.jpg',
];

for (const filename of targets) {
  const filePath = join(publicDir, filename);
  const tmpPath  = filePath + '.tmp';
  try {
    const before = (await stat(filePath)).size;

    // Compress into a buffer first (file is fully read before we touch it)
    const buffer = await sharp(filePath)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();

    if (buffer.length < before) {
      // Write to temp, then atomically replace original
      await writeFile(tmpPath, buffer);
      await unlink(filePath);
      await rename(tmpPath, filePath);
      const saving = Math.round((1 - buffer.length / before) * 100);
      console.log(`✓ ${filename}: ${Math.round(before/1024)}KB → ${Math.round(buffer.length/1024)}KB (−${saving}%)`);
    } else {
      console.log(`= ${filename}: already small enough (${Math.round(before/1024)}KB)`);
    }
  } catch (e) {
    // Clean up temp if it exists
    try { await unlink(tmpPath); } catch {}
    console.log(`✗ ${filename}: ${e.message}`);
  }
}

console.log('\nDone.');
