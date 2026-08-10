// Installs supplied cover artwork for the technical-bulletin posts.
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const pub = join(projectRoot, 'public');
// workspace root, two levels above project (…/autocleansewebsite/project)
const srcRoot = join(projectRoot, '..', '..');

const W = 1200, H = 675;

// filename (in workspace root) -> post slug
const MAP = {
  'Why Does a DPF Block Again After Regeneration.png': 'why-dpf-blocks-again-after-regeneration',
  'Calculated Soot vs Measured Soot.png': 'calculated-soot-versus-measured-soot',
  'Five Checks Before You Condemn a DPF.png': 'five-checks-before-condemning-a-dpf',
  'What Actually Changes During a Stage 1 Remap.png': 'what-changes-during-a-stage-1-remap',
  'When Does a DPF Need Off-Vehicle Cleaning.png': 'when-does-a-dpf-need-off-vehicle-cleaning',
  'Why Vehicle Condition Matters Before a Remap.png': 'why-vehicle-condition-matters-before-a-remap',
  'Understanding DPF Differential Pressure.png': 'understanding-dpf-differential-pressure',
  'Engine Torque, Gearbox Limits and Stage 1 Calibration.png': 'engine-torque-gearbox-limits-and-stage-1-calibration',
  'Passive, Active and Forced DPF Regeneration Explained.png': 'passive-active-and-forced-dpf-regeneration',
  'Peak Power vs Usable Torque.png': 'peak-power-versus-usable-torque',
  'Temperature Data and Failed DPF Regeneration.png': 'temperature-data-and-failed-dpf-regeneration',
  'Economy Remaps and Realistic Fuel Savings.png': 'economy-remaps-and-realistic-fuel-savings',
  'Soot, Ash, Contamination or Physical Damage.png': 'soot-ash-contamination-or-physical-damage',

  // ── second batch: the 19 weekly posts, 6 Apr - 10 Aug 2026 ────────────────
  'DPF Pressure Sensor and Pipe Faults.png': 'dpf-pressure-sensor-and-pipe-faults',
  'Stage 1 vs Stage 2 Remaps.png': 'stage-1-versus-stage-2-remap',
  'What Happens During a Professional Off-Vehicle DPF Clean.png': 'what-happens-during-off-vehicle-dpf-cleaning',
  'How AdBlue and SCR Systems Work.png': 'how-adblue-and-scr-systems-work',
  'Remapping and Your Insurance.png': 'remapping-and-your-insurance',
  'EGR Faults and DPF Loading.png': 'egr-faults-and-dpf-loading',
  'NOx Sensor Faults on SCR Systems.png': 'nox-sensor-faults-on-scr-systems',
  'Why the Original ECU File Must Always Be Backed Up.png': 'why-we-back-up-the-original-ecu-file',
  'Short Journeys, Driving Style and DPF Health.png': 'short-journeys-driving-style-and-dpf-health',
  'Engine Oil, Ash and DPF Service Life.png': 'engine-oil-ash-and-dpf-service-life',
  'DPF Removal and the Law.png': 'dpf-removal-and-the-law',
  'Turbo and Boost Faults Behind DPF Problems.png': 'turbo-and-boost-faults-behind-dpf-problems',
  'Diesel vs Petrol Remapping.png': 'diesel-versus-petrol-remapping',
  'Injector and Fuelling Faults Behind Excess Soot.png': 'injector-and-fuelling-faults-behind-excess-soot',
  'AdBlue Crystallisation and Dosing Faults.png': 'adblue-crystallisation-and-dosing-faults',
  'Remapping a High-Mileage Vehicle.png': 'remapping-a-high-mileage-vehicle',
  'After a DPF Clean.png': 'after-a-dpf-clean-resets-and-checks',
  'Van and Commercial Remapping.png': 'van-and-commercial-remapping',
  'DPF Warning Lights.png': 'dpf-warning-lights-explained',
};

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
