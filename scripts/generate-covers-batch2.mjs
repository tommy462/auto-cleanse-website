// Generates cover graphics for the 19 weekly posts dated 6 Apr - 10 Aug 2026.
//
//   node scripts/generate-covers-batch2.mjs
//
// These are house-style placeholders in the same design language as the rest of
// the blog; supplied artwork can replace any of them later via
// scripts/install-blog-covers.mjs. Writes public/blog/<slug>/cover.jpg.
//
// Only touches the 19 slugs listed at the bottom, so it can never overwrite the
// artwork belonging to the earlier 13 posts.
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import {
  pub, renderCover, hex, gauge, axes, caption, panel, label, arrow, tick, cross, esc,
  ORANGE, INK, MUTE, GRID, BLUE, RED, CX, CY,
} from './cover-kit.mjs';

// ── motifs ───────────────────────────────────────────────────────────────────
const M = {
  // 1 — pressure sensor + its two pipes, one of them faulty
  sensorPipes() {
    const sx = CX, sy = 236;                     // sensor body
    const fx = 742, gx = 1002, fy = 452;         // pipe take-off points
    return `
      ${panel(fx - 60, fy - 34, 380, 92, '#0c1015', '#2c3444', 18)}
      ${Array.from({ length: 7 }, (_, i) => `<polygon points="${hex(fx - 18 + i * 46, fy + 12, 15)}" fill="#12171f" stroke="${GRID}" stroke-width="1.6"/>`).join('')}
      ${panel(sx - 92, sy - 42, 184, 84, '#101620', '#33404f', 16)}
      ${label(sx, sy + 6, 'DP SENSOR', 17, INK)}
      <path d="M ${fx} ${fy - 34} C ${fx} ${sy + 96}, ${sx - 70} ${sy + 110}, ${sx - 46} ${sy + 42}" fill="none" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round"/>
      <path d="M ${gx} ${fy - 34} C ${gx} ${sy + 96}, ${sx + 70} ${sy + 110}, ${sx + 46} ${sy + 42}" fill="none" stroke="${RED}" stroke-width="5" stroke-linecap="round" stroke-dasharray="16 12"/>
      ${cross(gx + 26, sy + 150, 16)}
      ${label(gx + 96, sy + 156, 'BLOCKED / SPLIT', 14, RED)}
      ${caption('CHECK THE MEASURING PATH', 566)}`;
  },

  // 2 — Stage 1 (software) vs Stage 2 (software + hardware)
  stageCompare() {
    const bx = 654, by = 196, bw = 460, bh = 128, gap = 26;
    const chip = (x, y) => `<rect x="${x}" y="${y}" width="34" height="34" rx="7" fill="none" stroke="${ORANGE}" stroke-width="3"/><rect x="${x + 10}" y="${y + 10}" width="14" height="14" fill="${ORANGE}"/>`;
    const cog = (x, y) => `<circle cx="${x + 17}" cy="${y + 17}" r="13" fill="none" stroke="${BLUE}" stroke-width="3"/><circle cx="${x + 17}" cy="${y + 17}" r="4" fill="${BLUE}"/>`;
    return `
      ${panel(bx, by, bw, bh)}
      ${label(bx + 24, by + 38, 'STAGE 1', 20, ORANGE, 'start')}
      ${chip(bx + 24, by + 60)}
      ${label(bx + 74, by + 84, 'Software only', 16, INK, 'start', 600, 0)}
      ${label(bx + 24, by + 112, 'Within standard hardware limits', 14, MUTE, 'start', 600, 0)}

      ${panel(bx, by + bh + gap, bw, bh + 26)}
      ${label(bx + 24, by + bh + gap + 38, 'STAGE 2', 20, BLUE, 'start')}
      ${chip(bx + 24, by + bh + gap + 60)}
      ${cog(bx + 72, by + bh + gap + 60)}
      ${label(bx + 122, by + bh + gap + 84, 'Software + hardware', 16, INK, 'start', 600, 0)}
      ${label(bx + 24, by + bh + gap + 112, 'Calibration matched to fitted parts', 14, MUTE, 'start', 600, 0)}
      ${label(bx + 24, by + bh + gap + 136, 'Vehicle and use dependent', 14, MUTE, 'start', 600, 0)}`;
  },

  // 3 — the off-vehicle cleaning process chain
  processChain() {
    const steps = ['REMOVE', 'MEASURE', 'CLEAN', 'DRY', 'FLOW TEST'];
    const x0 = 646, y = 300, step = 104;
    let out = '';
    steps.forEach((s, i) => {
      const x = x0 + i * step;
      const done = i < 4;
      out += `<circle cx="${x}" cy="${y}" r="30" fill="${done ? 'url(#orange)' : '#12171f'}" stroke="${done ? 'none' : GRID}" stroke-width="2"/>`;
      out += label(x, y + 7, String(i + 1), 21, done ? '#0a0a0a' : MUTE);
      out += `<text x="${x}" y="${y + 62}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="12.5" font-weight="800" letter-spacing="1" fill="${MUTE}">${esc(s)}</text>`;
      if (i < steps.length - 1) out += `<line x1="${x + 32}" y1="${y}" x2="${x + step - 32}" y2="${y}" stroke="${GRID}" stroke-width="3"/>`;
    });
    return `${out}${caption('MEASURED BEFORE AND AFTER', 470)}`;
  },

  // 4 — AdBlue / SCR schematic
  scrSchematic() {
    const y = 340;
    return `
      ${panel(636, y - 56, 104, 112, '#0c1015', '#2c3444', 16)}
      ${label(688, y - 6, 'ADBLUE', 14, ORANGE)}
      ${label(688, y + 16, 'TANK', 14, MUTE)}
      ${arrow(752, y, 40)}
      <circle cx="828" cy="${y}" r="26" fill="#101620" stroke="${ORANGE}" stroke-width="3"/>
      ${label(828, y + 6, 'DOS', 13, INK)}
      ${arrow(866, y, 40)}
      ${panel(920, y - 56, 168, 112, '#0c1015', '#2c3444', 16)}
      ${Array.from({ length: 4 }, (_, i) => `<line x1="${938 + i * 38}" y1="${y - 38}" x2="${938 + i * 38}" y2="${y + 38}" stroke="${GRID}" stroke-width="6"/>`).join('')}
      ${label(1004, y + 78, 'SCR CATALYST', 14, MUTE)}
      <circle cx="900" cy="${y - 92}" r="15" fill="none" stroke="${BLUE}" stroke-width="3"/>
      <circle cx="1104" cy="${y - 92}" r="15" fill="none" stroke="${BLUE}" stroke-width="3"/>
      <line x1="900" y1="${y - 77}" x2="900" y2="${y - 58}" stroke="${GRID}" stroke-width="2" stroke-dasharray="4 4"/>
      <line x1="1104" y1="${y - 77}" x2="1104" y2="${y - 58}" stroke="${GRID}" stroke-width="2" stroke-dasharray="4 4"/>
      ${label(1002, y - 118, 'NOx SENSORS', 14, BLUE)}
      ${caption('UREA DOSED, NOx REDUCED', 520)}`;
  },

  // 5 — declaration document with shield tick
  declareShield() {
    const dx = CX - 92, dy = 214, dw = 184, dh = 232;
    let lines = '';
    for (let i = 0; i < 6; i++) lines += `<rect x="${dx + 24}" y="${dy + 44 + i * 26}" width="${(i % 3 === 2 ? 82 : 136)}" height="8" rx="4" fill="${GRID}"/>`;
    return `
      ${panel(dx, dy, dw, dh, '#0c1116', '#2c3444', 16)}
      ${lines}
      <path d="M ${CX + 74} ${dy + dh - 34} l 0 -70 l 46 -22 l 46 22 l 0 70 c 0 34 -46 52 -46 52 c 0 0 -46 -18 -46 -52 z" transform="translate(-44,26)" fill="#151008" stroke="${ORANGE}" stroke-width="3"/>
      ${tick(CX + 76, dy + dh - 14, 18)}
      ${caption('DECLARE THE MODIFICATION', 540)}`;
  },

  // 6 — EGR recirculation loop feeding soot back
  egrLoop() {
    const y = 356;
    return `
      ${panel(650, y - 34, 150, 74, '#0c1015', '#2c3444', 14)}
      ${label(725, y + 10, 'INTAKE', 15, MUTE)}
      ${panel(950, y - 34, 150, 74, '#0c1015', '#2c3444', 14)}
      ${label(1025, y + 10, 'EXHAUST', 15, MUTE)}
      <path d="M 950 ${y} L 800 ${y}" stroke="${GRID}" stroke-width="4"/>
      <path d="M 1025 ${y - 34} C 1025 ${y - 150}, 725 ${y - 150}, 725 ${y - 34}" fill="none" stroke="url(#orange)" stroke-width="6" stroke-linecap="round"/>
      <circle cx="875" cy="${y - 116}" r="30" fill="#101620" stroke="${ORANGE}" stroke-width="3"/>
      ${label(875, y - 110, 'EGR', 16, INK)}
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${812 + (i % 5) * 26}" cy="${y + 74 + Math.floor(i / 5) * 22}" r="4.5" fill="#8a6a3a"/>`).join('')}
      ${label(940, y + 96, 'MORE SOOT', 14, '#8a6a3a', 'start')}
      ${caption('A DPF SYMPTOM, AN EGR CAUSE', 552)}`;
  },

  // 7 — NOx conversion efficiency across the catalyst
  noxEfficiency() {
    const y = 348;
    return `
      ${panel(760, y - 60, 224, 120, '#0c1015', '#2c3444', 16)}
      ${Array.from({ length: 5 }, (_, i) => `<line x1="${782 + i * 45}" y1="${y - 42}" x2="${782 + i * 45}" y2="${y + 42}" stroke="${GRID}" stroke-width="6"/>`).join('')}
      ${label(872, y + 84, 'SCR CATALYST', 14, MUTE)}
      <circle cx="700" cy="${y}" r="30" fill="#101620" stroke="${BLUE}" stroke-width="3"/>
      ${label(700, y + 6, 'IN', 15, BLUE)}
      <circle cx="1044" cy="${y}" r="30" fill="#101620" stroke="${BLUE}" stroke-width="3"/>
      ${label(1044, y + 6, 'OUT', 14, BLUE)}
      ${arrow(736, y, 22, ORANGE, 4)}
      ${arrow(990, y, 22, ORANGE, 4)}
      ${label(872, y - 108, 'CONVERSION EFFICIENCY', 15, ORANGE)}
      ${cross(1044, y - 62, 15)}
      ${caption('SENSOR OR DOSING? PROVE IT', 540)}`;
  },

  // 8 — ECU original file backed up and restorable
  backupFile() {
    const ex = CX - 150, ey = CY - 56;
    return `
      ${panel(ex, ey, 120, 112, '#101620', '#33404f', 14)}
      ${label(ex + 60, ey + 52, 'ECU', 20, ORANGE)}
      ${label(ex + 60, ey + 76, 'ORIGINAL', 12, MUTE)}
      ${panel(CX + 40, ey, 120, 112, '#0c1116', '#2c3444', 14)}
      <path d="M ${CX + 76} ${ey + 40} l 24 0 l 0 30 l 14 0 l -26 26 l -26 -26 l 14 0 z" fill="${ORANGE}"/>
      ${label(CX + 100, ey + 132, 'SAVED FILE', 13, MUTE)}
      <path d="M ${ex + 128} ${ey + 36} L ${CX + 32} ${ey + 36}" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round"/>
      <path d="M ${CX + 24} ${ey + 28} l 10 8 l -10 8" fill="none" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M ${CX + 32} ${ey + 84} L ${ex + 128} ${ey + 84}" stroke="${BLUE}" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 8"/>
      <path d="M ${ex + 136} ${ey + 76} l -10 8 l 10 8" fill="none" stroke="${BLUE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      ${label(CX - 20, ey - 26, 'BACK UP BEFORE YOU WRITE', 15, ORANGE)}
      ${caption('ALWAYS RETURNABLE TO STANDARD', 552)}`;
  },

  // 9 — short trips never reaching regeneration temperature
  shortTrips() {
    const x0 = 640, y0 = 500, x1 = 1130, yTop = 196, thr = 272;
    const trips = `M ${x0 + 10} ${y0 - 14} L ${x0 + 54} ${thr + 66} L ${x0 + 92} ${y0 - 14}
                   L ${x0 + 140} ${thr + 74} L ${x0 + 178} ${y0 - 14}
                   L ${x0 + 226} ${thr + 60} L ${x0 + 264} ${y0 - 14}`;
    const longRun = `M ${x0 + 300} ${y0 - 14} C ${x0 + 342} ${thr - 6}, ${x0 + 380} ${thr - 24}, ${x0 + 430} ${thr - 26} L ${x1 - 16} ${thr - 26}`;
    return `
      ${axes(x0, y0, x1, yTop, 'TIME', '°C')}
      <line x1="${x0}" y1="${thr}" x2="${x1}" y2="${thr}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="7 7"/>
      ${label(x1, thr - 12, 'REGEN THRESHOLD', 14, ORANGE, 'end')}
      <path d="${trips}" fill="none" stroke="${BLUE}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="${longRun}" fill="none" stroke="url(#orange)" stroke-width="5" stroke-linecap="round"/>
      ${label(x0 + 136, y0 + 44, 'SHORT TRIPS', 13, BLUE)}
      ${label(x0 + 396, y0 + 44, 'SUSTAINED RUN', 13, ORANGE)}`;
  },

  // 10 — ash accumulating irreversibly over service life
  ashBuild() {
    const x0 = 646, y0 = 486, x1 = 1128, yTop = 200;
    let bars = '';
    const n = 7;
    for (let i = 0; i < n; i++) {
      const bw = 46, gap = 22;
      const x = x0 + 18 + i * (bw + gap);
      const soot = 34 + (i % 2) * 10;
      const ash = 16 + i * 22;
      bars += `<rect x="${x}" y="${y0 - ash}" width="${bw}" height="${ash}" rx="5" fill="url(#orange)"/>`;
      bars += `<rect x="${x}" y="${y0 - ash - soot}" width="${bw}" height="${soot}" rx="5" fill="#2b3442"/>`;
    }
    return `
      ${axes(x0, y0, x1, yTop, 'SERVICE LIFE', 'LOADING')}
      ${bars}
      <g font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800">
        <rect x="${x0 + 18}" y="${yTop - 14}" width="13" height="13" rx="3" fill="url(#orange)"/><text x="${x0 + 38}" y="${yTop - 2}" fill="${INK}">ASH (PERMANENT)</text>
        <rect x="${x0 + 250}" y="${yTop - 14}" width="13" height="13" rx="3" fill="#2b3442"/><text x="${x0 + 270}" y="${yTop - 2}" fill="${MUTE}">SOOT (BURNS OFF)</text>
      </g>
      ${caption('ASH ONLY EVER GOES UP', 546)}`;
  },

  // 11 — legality: cleaned filter passes, removed filter fails
  legalCheck() {
    const cw = 214, ch = 168, gapx = 30, gx = CX - cw - gapx / 2, gy = 244;
    let honeycomb = '';
    for (let i = 0; i < 6; i++) honeycomb += `<polygon points="${hex(gx + 62 + (i % 3) * 44, gy + 62 + Math.floor(i / 3) * 40, 18)}" fill="#12171f" stroke="${GRID}" stroke-width="1.8"/>`;
    return `
      ${panel(gx, gy, cw, ch)}
      ${honeycomb}
      ${tick(gx + cw / 2, gy + ch - 34, 18)}
      ${label(gx + cw / 2, gy + ch + 34, 'CLEANED - LEGAL', 15, ORANGE)}
      ${panel(gx + cw + gapx, gy, cw, ch)}
      <line x1="${gx + cw + gapx + 46}" y1="${gy + 46}" x2="${gx + cw + gapx + cw - 46}" y2="${gy + ch - 78}" stroke="${RED}" stroke-width="4" stroke-linecap="round"/>
      <line x1="${gx + cw + gapx + cw - 46}" y1="${gy + 46}" x2="${gx + cw + gapx + 46}" y2="${gy + ch - 78}" stroke="${RED}" stroke-width="4" stroke-linecap="round"/>
      ${cross(gx + cw + gapx + cw / 2, gy + ch - 34, 18)}
      ${label(gx + cw + gapx + cw / 2, gy + ch + 34, 'REMOVED - MOT FAIL', 15, RED)}`;
  },

  // 12 — turbo compressor wheel + boost leak
  turboBoost() {
    const tx = 826, ty = CY;
    let blades = '';
    for (let i = 0; i < 10; i++) {
      const a = 36 * i;
      blades += `<path d="M ${tx} ${ty} L ${(tx + 68 * Math.cos((Math.PI / 180) * a)).toFixed(1)} ${(ty + 68 * Math.sin((Math.PI / 180) * a)).toFixed(1)} A 68 68 0 0 1 ${(tx + 68 * Math.cos((Math.PI / 180) * (a + 22))).toFixed(1)} ${(ty + 68 * Math.sin((Math.PI / 180) * (a + 22))).toFixed(1)} Z" fill="${i % 2 ? '#182030' : '#1e2836'}" stroke="${GRID}" stroke-width="1.4"/>`;
    }
    return `
      <circle cx="${tx}" cy="${ty}" r="92" fill="#0c1015" stroke="#2c3444" stroke-width="2"/>
      ${blades}
      <circle cx="${tx}" cy="${ty}" r="18" fill="#101620" stroke="${ORANGE}" stroke-width="3"/>
      <path d="M ${tx + 96} ${ty} L 1064 ${ty}" stroke="${GRID}" stroke-width="8" stroke-linecap="round"/>
      <path d="M 1040 ${ty - 6} l 26 -26 M 1052 ${ty} l 30 -8 M 1044 ${ty + 8} l 28 14" stroke="${RED}" stroke-width="4" stroke-linecap="round"/>
      ${label(1092, ty + 52, 'BOOST LEAK', 14, RED, 'end')}
      ${caption('AIR-SIDE FAULTS MAKE SOOT', 528)}`;
  },

  // 13 — diesel vs petrol calibration parameters
  dieselPetrol() {
    const cw = 216, gapx = 28, gx = CX - cw - gapx / 2, gy = 208, ch = 244;
    const rows = (items, x, colour) => items.map((t, i) =>
      `<rect x="${x + 22}" y="${gy + 74 + i * 38}" width="10" height="10" rx="2" fill="${colour}"/>` +
      `<text x="${x + 42}" y="${gy + 84 + i * 38}" font-family="Segoe UI, Arial, sans-serif" font-size="14.5" font-weight="600" fill="${INK}">${esc(t)}</text>`).join('');
    return `
      ${panel(gx, gy, cw, ch)}
      ${label(gx + cw / 2, gy + 42, 'DIESEL', 20, ORANGE)}
      ${rows(['Fuel quantity', 'Injection timing', 'Rail pressure', 'Smoke limit'], gx, ORANGE)}
      ${panel(gx + cw + gapx, gy, cw, ch)}
      ${label(gx + cw + gapx + cw / 2, gy + 42, 'PETROL', 20, BLUE)}
      ${rows(['Lambda target', 'Ignition timing', 'Boost target', 'Knock control'], gx + cw + gapx, BLUE)}
      ${caption('DIFFERENT ROUTES, SAME RIGOUR', 512)}`;
  },

  // 14 — injector spray: good atomisation vs poor
  injectorSpray() {
    const y = 250, h = 150;
    const nozzle = (x) => `<path d="M ${x - 13} ${y} l 26 0 l -5 34 l -16 0 z" fill="#1b2331" stroke="${GRID}" stroke-width="2"/><rect x="${x - 9}" y="${y - 40}" width="18" height="42" rx="4" fill="#101620" stroke="#33404f" stroke-width="2"/>`;
    // fine, even cone of droplets = good atomisation
    let good = '', bad = '';
    for (let row = 0; row < 7; row++) {
      const spread = 12 + row * 11;
      const cy = y + 48 + row * 15;
      for (let k = -2; k <= 2; k++) {
        good += `<circle cx="${(762 + (k * spread) / 2).toFixed(1)}" cy="${cy}" r="2.6" fill="${ORANGE}" opacity="0.85"/>`;
      }
    }
    // few coarse blobs = poor atomisation
    for (let i = 0; i < 9; i++) {
      bad += `<circle cx="${(1006 + ((i % 3) - 1) * 26).toFixed(1)}" cy="${(y + 52 + Math.floor(i / 3) * 34).toFixed(1)}" r="${5 + (i % 3) * 2}" fill="${RED}" opacity="0.75"/>`;
    }
    return `
      ${nozzle(762)}${good}
      ${label(762, y + h + 44, 'ATOMISED', 15, ORANGE)}
      ${nozzle(1006)}${bad}
      ${label(1006, y + h + 44, 'POOR SPRAY', 15, RED)}
      ${caption('FUELLING FAULTS LOAD THE FILTER', 546)}`;
  },

  // 15 — urea crystal deposits around the dosing injector
  crystals() {
    const ix = CX, iy = 300;
    const crystal = (x, y, r, c) => `<polygon points="${x},${y - r} ${x + r * 0.86},${y - r * 0.5} ${x + r * 0.86},${y + r * 0.5} ${x},${y + r} ${x - r * 0.86},${y + r * 0.5} ${x - r * 0.86},${y - r * 0.5}" fill="${c}" opacity="0.9"/>`;
    let cl = '';
    const spots = [[-58, 70, 13], [-30, 96, 9], [4, 78, 15], [40, 100, 10], [66, 72, 12], [-76, 104, 8], [86, 98, 9], [16, 116, 8]];
    spots.forEach(([dx, dy, r], i) => { cl += crystal(ix + dx, iy + dy, r, i % 3 === 0 ? '#dfe6ee' : '#aab6c4'); });
    return `
      <rect x="${ix - 130}" y="${iy + 128}" width="260" height="20" rx="8" fill="#151b24" stroke="${GRID}" stroke-width="2"/>
      <rect x="${ix - 20}" y="${iy - 56}" width="40" height="96" rx="8" fill="#101620" stroke="#33404f" stroke-width="2"/>
      <path d="M ${ix - 12} ${iy + 40} l 24 0 l -6 34 l -12 0 z" fill="#1b2331" stroke="${GRID}" stroke-width="2"/>
      ${cl}
      ${label(ix, iy - 82, 'DOSING INJECTOR', 15, ORANGE)}
      ${caption('CRYSTALLISED UREA DEPOSITS', 546)}`;
  },

  // 16 — odometer + pre-remap health checklist
  highMileage() {
    const ox = CX, oy = 244;
    let digits = '';
    '184627'.split('').forEach((d, i) => {
      const x = ox - 138 + i * 46;
      digits += `<rect x="${x}" y="${oy - 30}" width="40" height="60" rx="7" fill="#0c1116" stroke="${GRID}" stroke-width="2"/>`;
      digits += label(x + 20, oy + 14, d, 30, INK, 'middle', 800, 0);
    });
    const items = ['Compression & health', 'Turbo condition', 'Clutch & gearbox', 'DPF / EGR state'];
    let list = '';
    items.forEach((t, i) => {
      const y = oy + 96 + i * 46;
      list += tick(ox - 132, y, 14);
      list += `<text x="${ox - 104}" y="${y + 6}" font-family="Segoe UI, Arial, sans-serif" font-size="15.5" font-weight="600" fill="${INK}">${esc(t)}</text>`;
    });
    return `${digits}${label(ox, oy - 52, 'MILES', 14, MUTE)}${list}`;
  },

  // 17 — post-clean resets: counters returning to zero
  postCleanReset() {
    const bx = 646, by = 218, bw = 470, rowH = 62;
    const rows = [['SOOT VALUE', 'RESET'], ['ASH VALUE', 'RESET'], ['FAULT MEMORY', 'CLEAR'], ['DIFF. PRESSURE', 'VERIFY']];
    let out = '';
    rows.forEach((r, i) => {
      const y = by + i * rowH;
      out += panel(bx, y, bw, 48, '#0c1116', '#242c3a', 12);
      out += `<text x="${bx + 22}" y="${y + 31}" font-family="Segoe UI, Arial, sans-serif" font-size="15.5" font-weight="700" fill="${INK}">${esc(r[0])}</text>`;
      out += `<rect x="${bx + bw - 118}" y="${y + 11}" width="96" height="26" rx="13" fill="${i < 3 ? '#151008' : '#0f1620'}" stroke="${i < 3 ? ORANGE : BLUE}" stroke-width="2"/>`;
      out += label(bx + bw - 70, y + 29, r[1], 12.5, i < 3 ? ORANGE : BLUE);
    });
    return `${out}${caption('CLOSE THE JOB PROPERLY', 528)}`;
  },

  // 18 — van torque for load and towing
  vanTorque() {
    const vx = 660, vy = 236, vw = 250, vh = 116;
    const van = `
      <path d="M ${vx} ${vy + vh} l 0 -66 l 30 -50 l 96 0 l 0 50 l 124 0 l 0 66 z" fill="#151d29" stroke="${ORANGE}" stroke-width="3"/>
      <circle cx="${vx + 56}" cy="${vy + vh}" r="20" fill="#0c1015" stroke="#55606f" stroke-width="3"/>
      <circle cx="${vx + 208}" cy="${vy + vh}" r="20" fill="#0c1015" stroke="#55606f" stroke-width="3"/>
      <rect x="${vx + 34}" y="${vy + 22}" width="56" height="30" rx="4" fill="#22314a"/>`;
    const x0 = 660, y0 = 520, x1 = 1130, yTop = 402;
    const curve = `M ${x0} ${y0 - 8} C ${x0 + 90} ${yTop + 26}, ${x0 + 150} ${yTop + 6}, ${x0 + 230} ${yTop + 10} L ${x1 - 12} ${yTop + 34}`;
    return `
      ${van}
      ${label(vx + vw + 34, vy + 46, 'LOAD', 14, MUTE, 'start')}
      ${label(vx + vw + 34, vy + 74, 'TOWING', 14, MUTE, 'start')}
      <path d="${curve}" fill="none" stroke="url(#orange)" stroke-width="6" stroke-linecap="round"/>
      ${label(x0, y0 + 22, 'LOW-DOWN TORQUE', 14, ORANGE, 'start')}`;
  },

  // 19 — dashboard warning lights
  warningLights() {
    const y = 300, x0 = 700;
    const cell = (x, active, glyph, name) => `
      <circle cx="${x}" cy="${y}" r="52" fill="${active ? '#1a1206' : '#0c1116'}" stroke="${active ? ORANGE : GRID}" stroke-width="3"/>
      ${glyph(x, y, active ? ORANGE : MUTE)}
      ${label(x, y + 92, name, 13.5, active ? ORANGE : MUTE)}`;
    const dpfGlyph = (x, yy, c) => {
      let g = `<rect x="${x - 26}" y="${yy - 16}" width="52" height="32" rx="9" fill="none" stroke="${c}" stroke-width="3"/>`;
      for (let i = 0; i < 3; i++) g += `<line x1="${x - 12 + i * 12}" y1="${yy - 8}" x2="${x - 12 + i * 12}" y2="${yy + 8}" stroke="${c}" stroke-width="3"/>`;
      g += `<circle cx="${x - 34}" cy="${yy - 22}" r="3" fill="${c}"/><circle cx="${x + 34}" cy="${yy - 22}" r="3" fill="${c}"/>`;
      return g;
    };
    const engGlyph = (x, yy, c) => `<path d="M ${x - 24} ${yy + 12} l 0 -16 l 10 0 l 0 -10 l 12 0 l 0 -8 l 16 0 l 0 34 z" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`;
    const glowGlyph = (x, yy, c) => `<path d="M ${x - 16} ${yy - 14} c 14 8, 14 20, 0 28 M ${x + 2} ${yy - 14} c 14 8, 14 20, 0 28" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`;
    return `
      ${cell(x0, true, dpfGlyph, 'DPF / FILTER')}
      ${cell(x0 + 172, true, engGlyph, 'ENGINE MGMT')}
      ${cell(x0 + 344, false, glowGlyph, 'GLOW PLUG')}
      ${caption('THE HANDBOOK IS AUTHORITATIVE', 522)}`;
  },
};

// ── cover configs ────────────────────────────────────────────────────────────
const COVERS = [
  { slug: 'dpf-pressure-sensor-and-pipe-faults', category: 'DPF DIAGNOSTICS', eyebrow: 'THE MEASURING PATH',
    titleLines: [[{ t: 'DPF pressure sensor' }], [{ t: 'and ' }, { t: 'pipe faults', o: true }]], motif: 'sensorPipes' },
  { slug: 'stage-1-versus-stage-2-remap', category: 'ECU CALIBRATION', eyebrow: 'CHOOSING A STAGE',
    titleLines: [[{ t: 'Stage 1 vs Stage 2:' }], [{ t: 'what ' }, { t: 'actually differs', o: true }]], motif: 'stageCompare' },
  { slug: 'what-happens-during-off-vehicle-dpf-cleaning', category: 'DPF MAINTENANCE', eyebrow: 'INSIDE THE PROCESS',
    titleLines: [[{ t: 'What happens in an' }], [{ t: 'off-vehicle ', o: true }, { t: 'clean' }]], motif: 'processChain' },
  { slug: 'how-adblue-and-scr-systems-work', category: 'ADBLUE & SCR', eyebrow: 'SYSTEM BASICS',
    titleLines: [[{ t: 'How AdBlue and' }], [{ t: 'SCR ', o: true }, { t: 'systems work' }]], motif: 'scrSchematic' },
  { slug: 'remapping-and-your-insurance', category: 'ECU CALIBRATION', eyebrow: 'BEFORE YOU BOOK',
    titleLines: [[{ t: 'Remapping and' }], [{ t: 'your ' }, { t: 'insurance', o: true }]], motif: 'declareShield' },
  { slug: 'egr-faults-and-dpf-loading', category: 'DPF DIAGNOSTICS', eyebrow: 'CAUSE AND SYMPTOM',
    titleLines: [[{ t: 'EGR faults and' }], [{ t: 'DPF ', o: true }, { t: 'loading' }]], motif: 'egrLoop' },
  { slug: 'nox-sensor-faults-on-scr-systems', category: 'ADBLUE & SCR', eyebrow: 'SENSOR OR DOSING?',
    titleLines: [[{ t: 'NOx sensor faults' }], [{ t: 'on ' }, { t: 'SCR systems', o: true }]], motif: 'noxEfficiency' },
  { slug: 'why-we-back-up-the-original-ecu-file', category: 'ECU CALIBRATION', eyebrow: 'THE SAFETY NET',
    titleLines: [[{ t: 'Why the original' }], [{ t: 'ECU file ', o: true }, { t: 'is backed up' }]], motif: 'backupFile' },
  { slug: 'short-journeys-driving-style-and-dpf-health', category: 'DPF SYSTEMS', eyebrow: 'DUTY CYCLE',
    titleLines: [[{ t: 'Short journeys and' }], [{ t: 'DPF ', o: true }, { t: 'health' }]], motif: 'shortTrips' },
  { slug: 'engine-oil-ash-and-dpf-service-life', category: 'DPF MAINTENANCE', eyebrow: 'WHY OIL SPEC MATTERS',
    titleLines: [[{ t: 'Engine oil, ash and' }], [{ t: 'DPF ', o: true }, { t: 'service life' }]], motif: 'ashBuild' },
  { slug: 'dpf-removal-and-the-law', category: 'DPF & COMPLIANCE', eyebrow: 'WHY WE CLEAN INSTEAD',
    titleLines: [[{ t: 'DPF removal' }], [{ t: 'and ' }, { t: 'the law', o: true }]], motif: 'legalCheck' },
  { slug: 'turbo-and-boost-faults-behind-dpf-problems', category: 'DPF DIAGNOSTICS', eyebrow: 'THE AIR SIDE',
    titleLines: [[{ t: 'Turbo and boost' }], [{ t: 'faults ', o: true }, { t: 'behind DPFs' }]], motif: 'turboBoost' },
  { slug: 'diesel-versus-petrol-remapping', category: 'ECU CALIBRATION', eyebrow: 'TWO APPROACHES',
    titleLines: [[{ t: 'Diesel vs petrol' }], [{ t: 'remapping', o: true }]], motif: 'dieselPetrol' },
  { slug: 'injector-and-fuelling-faults-behind-excess-soot', category: 'DPF DIAGNOSTICS', eyebrow: 'WHERE SOOT COMES FROM',
    titleLines: [[{ t: 'Injector faults' }], [{ t: 'behind ' }, { t: 'excess soot', o: true }]], motif: 'injectorSpray' },
  { slug: 'adblue-crystallisation-and-dosing-faults', category: 'ADBLUE & SCR', eyebrow: 'DEPOSITS AND DOSING',
    titleLines: [[{ t: 'AdBlue crystallisation' }], [{ t: 'and ' }, { t: 'dosing faults', o: true }]], motif: 'crystals' },
  { slug: 'remapping-a-high-mileage-vehicle', category: 'ECU CALIBRATION', eyebrow: 'CONDITION, NOT MILEAGE',
    titleLines: [[{ t: 'Remapping a' }], [{ t: 'high-mileage ', o: true }, { t: 'vehicle' }]], motif: 'highMileage' },
  { slug: 'after-a-dpf-clean-resets-and-checks', category: 'DPF MAINTENANCE', eyebrow: 'FINISHING THE JOB',
    titleLines: [[{ t: 'After a DPF clean:' }], [{ t: 'resets ', o: true }, { t: '& checks' }]], motif: 'postCleanReset' },
  { slug: 'van-and-commercial-remapping', category: 'ECU CALIBRATION', eyebrow: 'WORKING VEHICLES',
    titleLines: [[{ t: 'Van and commercial' }], [{ t: 'remapping', o: true }]], motif: 'vanTorque' },
  { slug: 'dpf-warning-lights-explained', category: 'DPF DIAGNOSTICS', eyebrow: 'DASHBOARD TRIAGE',
    titleLines: [[{ t: 'DPF warning lights' }], [{ t: 'explained', o: true }]], motif: 'warningLights' },
];

console.log('\nGenerating batch-2 covers...\n');
for (const c of COVERS) {
  const out = join(pub, 'blog', c.slug, 'cover.jpg');
  mkdirSync(dirname(out), { recursive: true });
  await renderCover(c, M[c.motif](), out);
  console.log('  ✓', out.replace(pub, 'public'));
}
console.log(`\nDone. ${COVERS.length} covers generated.\n`);
