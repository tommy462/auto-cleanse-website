// Generates placeholder covers for the 20 weekly posts dated 17 Aug - 28 Dec 2026.
//
//   node scripts/generate-covers-batch3.mjs            all 20
//   node scripts/generate-covers-batch3.mjs <slug>...  just those
//
// Writes public/blog/<slug>/cover.jpg, plus a 2x PNG of each into
// <workspace root>/blog-covers-to-enhance/ for Tom to enhance. His finished
// artwork goes in the workspace root under the same filename (see
// scripts/blog-cover-map.mjs) and is installed with `npm run blog:covers`.
//
// Skips any post whose supplied artwork is already in the workspace root, so
// re-running it can never overwrite Tom's covers.
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  pub, frame, hex, gauge, axes, caption, panel, label, arrow, tick, cross, esc,
  ORANGE, INK, MUTE, GRID, BLUE, RED, CX,
} from './cover-kit.mjs';
import { COVER_ART } from './blog-cover-map.mjs';

const workspaceRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const enhanceDir = join(workspaceRoot, 'blog-covers-to-enhance');
const AMBER = '#b7894a';
const FONT = 'Segoe UI, Arial, sans-serif';
const text = (x, y, t, size = 15.5, fill = INK, weight = 600, anchor = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(t)}</text>`;
const pill = (x, y, t, colour = ORANGE, w = 96) =>
  `<rect x="${x - w / 2}" y="${y - 15}" width="${w}" height="30" rx="15" fill="#120f0a" stroke="${colour}" stroke-width="2"/>${label(x, y + 5, t, 12.5, colour, 'middle', 800, 1.2)}`;
const honeycomb = (cx, cy, r, cols, rows, size = 15) => {
  let out = '';
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const x = cx - ((cols - 1) * size * 1.6) / 2 + i * size * 1.6 + (j % 2 ? size * 0.8 : 0);
      const y = cy - ((rows - 1) * size * 1.4) / 2 + j * size * 1.4;
      if ((x - cx) ** 2 + (y - cy) ** 2 < (r - size) ** 2) out += `<polygon points="${hex(x, y, size * 0.92)}" fill="#12171f" stroke="${GRID}" stroke-width="1.6"/>`;
    }
  return out;
};

/** Receipt-style list with a price in the corner. */
function priceList(head, price, rows, cap) {
  const x = 652, y = 168, w = 470, h = 340;
  let list = '';
  rows.forEach((r, i) => {
    const ry = y + 140 + i * 48;
    list += tick(x + 46, ry - 5, 13);
    list += text(x + 72, ry, r, 16.5);
  });
  return `
    ${panel(x, y, w, h)}
    ${label(x + 28, y + 52, head, 17, MUTE, 'start')}
    ${label(x + w - 28, y + 34, 'FROM', 12, MUTE, 'end')}
    ${label(x + w - 28, y + 74, price, 42, ORANGE, 'end', 800, 0)}
    <line x1="${x + 24}" y1="${y + 98}" x2="${x + w - 24}" y2="${y + 98}" stroke="${GRID}" stroke-width="2" stroke-dasharray="6 6"/>
    ${list}
    ${caption(cap, 560)}`;
}

/** Checklist rows with a status pill on the right. */
function pillRows(rows, cap) {
  const bx = 646, by = 200, bw = 470, rowH = 64;
  let out = '';
  rows.forEach(([name, status, colour = ORANGE], i) => {
    const y = by + i * rowH;
    out += panel(bx, y, bw, 50, '#0c1116', '#242c3a', 12);
    out += text(bx + 22, y + 32, name, 16, INK, 700);
    out += `<rect x="${bx + bw - 118}" y="${y + 12}" width="96" height="26" rx="13" fill="#151008" stroke="${colour}" stroke-width="2"/>`;
    out += label(bx + bw - 70, y + 30, status, 12.5, colour);
  });
  return `${out}${caption(cap, 492 + rows.length * 8)}`;
}

const M = {
  dpfPrice: () => priceList('DPF CLEAN', '£210', ['Off-vehicle machine clean', 'Flow tested before and after', 'Back-pressure checked', 'Honest report on the filter'], 'WHAT THE PRICE SHOULD COVER'),

  remapPrice: () => priceList('STAGE 1 REMAP', '£250', ['Health check before mapping', 'Your original file backed up', 'Calibration for your vehicle', 'Checked after the write'], 'WHAT A STAGE 1 PRICE INCLUDES'),

  lntVsScr() {
    const y = 214, h = 250, w = 220;
    const lx = 640, rx = 884;
    return `
      ${label(CX, y - 30, 'EURO 6 DIESEL', 15, MUTE)}
      ${panel(lx, y, w, h)}
      ${label(lx + w / 2, y + 48, 'LEAN NOx TRAP', 17, BLUE)}
      ${text(lx + w / 2, y + 96, 'Stores NOx, then', 15, INK, 600, 'middle')}
      ${text(lx + w / 2, y + 120, 'burns it off with', 15, INK, 600, 'middle')}
      ${text(lx + w / 2, y + 144, 'rich running', 15, INK, 600, 'middle')}
      ${label(lx + w / 2, y + h - 30, 'NO ADBLUE', 14, MUTE)}
      ${panel(rx, y, w, h)}
      ${label(rx + w / 2, y + 48, 'SCR', 17, ORANGE)}
      <circle cx="${rx + w / 2}" cy="${y + 124}" r="44" fill="#0f1a2b" stroke="${BLUE}" stroke-width="4"/>
      <circle cx="${rx + w / 2}" cy="${y + 124}" r="32" fill="none" stroke="${BLUE}" stroke-width="1.5" stroke-dasharray="3 5"/>
      ${label(rx + w / 2, y + 130, 'AdBlue', 15, BLUE, 'middle', 800, 0)}
      ${label(rx + w / 2, y + h - 30, 'ADBLUE TANK', 14, ORANGE)}
      ${caption('TWO WAYS TO CUT NOx', 530)}`;
  },

  smokeLimit() {
    const x0 = 668, y0 = 496, x1 = 1124, yTop = 196, lim = 300;
    return `
      ${axes(x0, y0, x1, yTop, 'FUEL DELIVERED', 'SOOT')}
      <line x1="${x0}" y1="${lim}" x2="${x1}" y2="${lim}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="7 7"/>
      ${label(x1, lim - 12, 'SMOKE LIMIT', 14, ORANGE, 'end')}
      <path d="M ${x0 + 8} ${y0 - 10} C ${x0 + 200} ${y0 - 60}, ${x0 + 280} ${lim + 40}, ${x1 - 16} ${lim + 16}" fill="none" stroke="url(#orange)" stroke-width="5" stroke-linecap="round"/>
      <path d="M ${x0 + 8} ${y0 - 10} C ${x0 + 170} ${y0 - 70}, ${x0 + 250} ${lim - 20}, ${x0 + 330} ${yTop + 12}" fill="none" stroke="${RED}" stroke-width="4" stroke-linecap="round" stroke-dasharray="12 9"/>
      ${label(x0 + 350, yTop + 16, 'OVER-FUELLED', 13, RED, 'start')}
      ${label(x1 - 16, lim + 50, 'CALIBRATED', 13, ORANGE, 'end')}
      ${caption('A GOOD MAP STAYS IN LIMITS', 552)}`;
  },

  additiveTank() {
    const y = 336, h = 112;
    const box = (x, w, name, inner, colour = '#2c3444') =>
      `${panel(x, y - h / 2, w, h, '#0c1015', colour, 16)}${inner}${label(x + w / 2, y + h / 2 + 32, name, 14, MUTE)}`;
    let drops = '';
    [[-18, -14], [12, -20], [-4, 10], [22, 14], [-24, 22]].forEach(([dx, dy]) => {
      drops += `<path d="M ${700 + dx} ${y + dy - 9} q 7 9 0 15 q -7 -6 0 -15 z" fill="${ORANGE}"/>`;
    });
    return `
      ${label(CX, y - 112, 'HELPS SOOT BURN AT A LOWER TEMPERATURE', 14, ORANGE)}
      ${box(640, 120, 'ADDITIVE', drops, ORANGE)}
      ${arrow(772, y, 36)}
      ${box(824, 120, 'FUEL TANK', `<path d="M 884 ${y - 22} q 18 22 0 40 q -18 -18 0 -40 z" fill="none" stroke="${AMBER}" stroke-width="3"/>`)}
      ${arrow(956, y, 36)}
      ${box(1008, 120, 'DPF', honeycomb(1068, y, 56, 4, 4, 13))}
      ${caption('WHEN THE ADDITIVE RUNS OUT', 540)}`;
  },

  wrongFluid() {
    const tx = 650, ty = 236, tw = 270, th = 230;
    return `
      <rect x="${tx + 110}" y="${ty - 34}" width="50" height="36" rx="6" fill="#101620" stroke="#33404f" stroke-width="2"/>
      <rect x="${tx + 100}" y="${ty - 50}" width="70" height="20" rx="8" fill="#0f1a2b" stroke="${BLUE}" stroke-width="3"/>
      ${panel(tx, ty, tw, th, '#0c1015', '#33404f', 20)}
      <rect x="${tx + 10}" y="${ty + 70}" width="${tw - 20}" height="46" fill="${AMBER}" opacity="0.75"/>
      <rect x="${tx + 10}" y="${ty + 116}" width="${tw - 20}" height="${th - 126}" rx="12" fill="#1c2c45"/>
      ${label(tx + tw / 2, ty + 99, 'DIESEL', 15, '#1a1206')}
      ${label(tx + tw / 2, ty + 178, 'ADBLUE', 15, BLUE)}
      <circle cx="1034" cy="${ty + 92}" r="58" fill="#140b0b" stroke="${RED}" stroke-width="3"/>
      <circle cx="1012" cy="${ty + 92}" r="16" fill="none" stroke="${INK}" stroke-width="4"/>
      <path d="M 1028 ${ty + 92} l 38 0 m -12 0 l 0 12 m -12 -12 l 0 9" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      ${cross(1034, ty + 92, 50)}
      ${label(1034, ty + 184, "DON'T START IT", 15, RED)}
      ${caption('DRAIN AND FLUSH BEFORE ANYTHING', 540)}`;
  },

  sootVsAsh() {
    const y = 300, w = 220, h = 92;
    const channel = (x) => `<rect x="${x}" y="${y - h / 2}" width="${w}" height="${h}" rx="10" fill="#0c1015" stroke="#2c3444" stroke-width="2"/><rect x="${x + w - 18}" y="${y - h / 2 + 6}" width="12" height="${h - 12}" rx="3" fill="#2b3442"/>`;
    let soot = '';
    for (let i = 0; i < 16; i++) soot += `<circle cx="${660 + (i % 8) * 22}" cy="${y - 18 + Math.floor(i / 8) * 34}" r="5" fill="#3a3a3a"/>`;
    let ash = '';
    for (let i = 0; i < 4; i++) ash += `<rect x="${884 + w - 30 - i * 24}" y="${y - h / 2 + 8}" width="20" height="${h - 16}" rx="3" fill="#9aa3ad" opacity="${0.95 - i * 0.12}"/>`;
    return `
      ${label(CX, y - 96, 'WHAT AN ADDITIVE CAN REACH', 15, MUTE)}
      ${channel(640)}${soot}
      ${label(750, y + 86, 'SOOT', 17, INK)}
      ${tick(750, y + 128, 18)}
      ${label(750, y + 176, 'BURNS OFF', 14, ORANGE)}
      ${channel(884)}${ash}
      ${label(994, y + 86, 'ASH', 17, INK)}
      ${cross(994, y + 128, 20)}
      ${label(994, y + 176, 'STAYS IN', 14, RED)}`;
  },

  consumption() {
    const x0 = 660, y0 = 486, x1 = 1124, yTop = 196;
    const hi = 300, lo = 372;
    return `
      ${axes(x0, y0, x1, yTop, 'MILES', 'ADBLUE USED')}
      <rect x="${x0 + 2}" y="${hi}" width="${x1 - x0 - 2}" height="${lo - hi}" fill="${ORANGE}" opacity="0.08"/>
      <line x1="${x0}" y1="${hi}" x2="${x1}" y2="${hi}" stroke="${ORANGE}" stroke-width="1.5" stroke-dasharray="5 6" opacity="0.7"/>
      <line x1="${x0}" y1="${lo}" x2="${x1}" y2="${lo}" stroke="${ORANGE}" stroke-width="1.5" stroke-dasharray="5 6" opacity="0.7"/>
      ${label(x0 + 14, hi - 12, 'YOUR NORMAL', 13, ORANGE, 'start')}
      <path d="M ${x0 + 10} ${lo - 30} L ${x0 + 70} ${lo - 42} L ${x0 + 130} ${lo - 26} L ${x0 + 190} ${lo - 40} L ${x0 + 250} ${lo - 30}" fill="none" stroke="url(#orange)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M ${x0 + 250} ${lo - 30} L ${x0 + 310} ${hi - 40} L ${x0 + 360} ${hi - 70}" fill="none" stroke="${RED}" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 8"/>
      ${label(x0 + 372, hi - 66, 'TOO HIGH', 13, RED, 'start')}
      <path d="M ${x0 + 250} ${lo - 30} L ${x0 + 320} ${y0 - 34} L ${x1 - 20} ${y0 - 34}" fill="none" stroke="${BLUE}" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 8"/>
      ${label(x1 - 20, y0 - 50, 'TOO LOW', 13, BLUE, 'end')}
      ${caption('BOTH ARE A WARNING SIGN', 552)}`;
  },

  limpGauge() {
    const gx = CX, gy = 452, R = 150, frac = 0.3;
    const th = 180 * (1 - frac);
    const sx = gx + R * Math.cos((Math.PI / 180) * th), sy = gy - R * Math.sin((Math.PI / 180) * th);
    const tags = ['BOOST', 'DPF', 'EGR', 'FUEL', 'SENSORS'];
    return `
      ${tags.map((t, i) => pill(668 + i * 102, 214, t, i === 1 ? ORANGE : MUTE, 88)).join('')}
      ${gauge(gx, gy, R, frac, '')}
      <path d="M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${R} ${R} 0 0 1 ${gx + R} ${gy}" fill="none" stroke="${RED}" stroke-width="12" stroke-linecap="round" stroke-dasharray="4 14" opacity="0.8"/>
      ${label(gx, gy + 40, 'REDUCED POWER', 15, MUTE)}
      ${caption('PROTECTION, NOT A DIAGNOSIS', 560)}`;
  },

  remapDay() {
    const steps = ['CHECK', 'BACK UP', 'WRITE', 'VERIFY', 'ROAD TEST'];
    const x0 = 652, y = 344, step = 104;
    let out = '';
    steps.forEach((s, i) => {
      const x = x0 + i * step;
      out += `<circle cx="${x}" cy="${y}" r="30" fill="url(#orange)"/>`;
      out += label(x, y + 7, String(i + 1), 21, '#0a0a0a');
      out += label(x, y + 62, s, 12.5, MUTE, 'middle', 800, 1);
      if (i < steps.length - 1) out += `<line x1="${x + 32}" y1="${y}" x2="${x + step - 32}" y2="${y}" stroke="${GRID}" stroke-width="3"/>`;
    });
    const clock = `<circle cx="${CX - 112}" cy="226" r="24" fill="none" stroke="${ORANGE}" stroke-width="3.5"/><path d="M ${CX - 112} 210 l 0 16 l 12 8" fill="none" stroke="${ORANGE}" stroke-width="3.5" stroke-linecap="round"/>`;
    return `${clock}${label(CX - 74, 233, 'TYPICALLY 1-2 HOURS', 18, INK, 'start')}${out}${caption('WORKSHOP OR MOBILE', 494)}`;
  },

  parcel() {
    const bx = 646, by = 300, bw = 170, bh = 130;
    const box = `
      <path d="M ${bx} ${by} l 40 -34 l ${bw} 0 l -40 34 z" fill="#1d2532" stroke="#3a4556" stroke-width="2"/>
      <path d="M ${bx + bw} ${by} l 40 -34 l 0 ${bh} l -40 34 z" fill="#141a24" stroke="#3a4556" stroke-width="2"/>
      <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#18202c" stroke="#3a4556" stroke-width="2"/>
      <rect x="${bx + bw / 2 - 14}" y="${by}" width="28" height="${bh}" fill="${ORANGE}" opacity="0.85"/>
      <path d="M ${bx + bw / 2 + 6} ${by} l 40 -34 l 28 0 l -40 34 z" fill="${ORANGE}" opacity="0.7"/>`;
    const pin = (x, y) => `<path d="M ${x} ${y + 30} c -26 -30 -26 -60 0 -60 c 26 0 26 30 0 60 z" fill="#151008" stroke="${ORANGE}" stroke-width="3"/><circle cx="${x}" cy="${y - 8}" r="8" fill="${ORANGE}"/>`;
    return `
      ${box}
      ${pin(1060, 270)}
      ${label(1060, 326, 'TOTNES', 14, ORANGE)}
      <path d="M ${bx + 120} ${by - 44} C ${bx + 220} 160, 960 150, 1030 236" fill="none" stroke="${ORANGE}" stroke-width="3.5" stroke-dasharray="10 9" stroke-linecap="round"/>
      ${label(900, 168, 'SENT TO US', 13, ORANGE)}
      <path d="M 1060 344 C 1050 470, 900 500, ${bx + bw + 46} ${by + bh}" fill="none" stroke="${BLUE}" stroke-width="3.5" stroke-dasharray="10 9" stroke-linecap="round"/>
      ${label(980, 494, 'CLEANED, TESTED, RETURNED', 13, BLUE)}
      ${caption('UK-WIDE POSTAL SERVICE', 560)}`;
  },

  winter() {
    const tx = 700, top = 200, bulbY = 470;
    let ticks = '';
    for (let i = 0; i < 7; i++) ticks += `<line x1="${tx + 22}" y1="${top + 30 + i * 32}" x2="${tx + 36}" y2="${top + 30 + i * 32}" stroke="${GRID}" stroke-width="2"/>`;
    const flake = (x, y, r) => {
      let s = '';
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        s += `<line x1="${x}" y1="${y}" x2="${(x + r * Math.cos(a)).toFixed(1)}" y2="${(y + r * Math.sin(a)).toFixed(1)}" stroke="${BLUE}" stroke-width="3.5" stroke-linecap="round"/>`;
      }
      return s;
    };
    const coil = Array.from({ length: 7 }, (_, i) => `${i ? 'L' : 'M'} ${880 + i * 28} ${i % 2 ? 452 : 426}`).join(' ');
    return `
      <rect x="${tx - 14}" y="${top}" width="28" height="${bulbY - top}" rx="14" fill="#0c1015" stroke="#33404f" stroke-width="2"/>
      <rect x="${tx - 6}" y="${top + 200}" width="12" height="${bulbY - top - 200}" fill="${BLUE}"/>
      <circle cx="${tx}" cy="${bulbY + 10}" r="26" fill="${BLUE}" stroke="#33404f" stroke-width="2"/>
      ${ticks}
      <line x1="${tx - 30}" y1="${top + 200}" x2="${tx + 50}" y2="${top + 200}" stroke="${ORANGE}" stroke-width="2.5" stroke-dasharray="5 5"/>
      ${label(tx + 58, top + 206, '-11°C', 20, ORANGE, 'start', 800, 0)}
      ${flake(1050, 230, 34)}
      ${panel(860, 330, 220, 150, '#0c1015', '#33404f', 18)}
      ${label(970, 370, 'TANK HEATER', 14, MUTE)}
      <path d="${coil}" fill="none" stroke="url(#orange)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      ${caption('HEATERS DO THE HARD WORK', 560)}`;
  },

  dynoBand() {
    const x0 = 668, y0 = 490, x1 = 1124, yTop = 214;
    const curve = (dy) => `M ${x0 + 10} ${y0 - 30 + dy} C ${x0 + 140} ${yTop + 80 + dy}, ${x0 + 260} ${yTop + 20 + dy}, ${x1 - 20} ${yTop + 60 + dy}`;
    return `
      ${axes(x0, y0, x1, yTop, 'RPM', 'POWER')}
      <path d="${curve(-18)}" fill="none" stroke="${MUTE}" stroke-width="2.5" stroke-dasharray="6 6" opacity="0.7"/>
      <path d="${curve(20)}" fill="none" stroke="${BLUE}" stroke-width="2.5" stroke-dasharray="6 6" opacity="0.8"/>
      <path d="${curve(0)}" fill="none" stroke="url(#orange)" stroke-width="5" stroke-linecap="round"/>
      ${pill(760, 184, 'DIN 70020', MUTE, 110)}
      ${pill(884, 184, 'SAE J1349', MUTE, 110)}
      ${pill(1008, 184, 'UN R85', MUTE, 110)}
      ${caption('SAME CAR, DIFFERENT NUMBERS', 552)}`;
  },

  motCheck() {
    const items = ['Warning lamps off', 'No visible smoke', 'DPF in place', 'Smoke opacity test'];
    let list = '';
    items.forEach((t, i) => {
      const y = 254 + i * 56;
      list += tick(918, y - 5, 14);
      list += text(944, y, t, 16);
    });
    return `
      ${gauge(744, 410, 104, 0.26, 'SMOKE OPACITY')}
      <line x1="${744 + 104 * Math.cos(Math.PI * 0.45)}" y1="${410 - 104 * Math.sin(Math.PI * 0.45)}" x2="${744 + 128 * Math.cos(Math.PI * 0.45)}" y2="${410 - 128 * Math.sin(Math.PI * 0.45)}" stroke="${RED}" stroke-width="4" stroke-linecap="round"/>
      ${label(744 + 140 * Math.cos(Math.PI * 0.45), 410 - 140 * Math.sin(Math.PI * 0.45), 'LIMIT', 12, RED)}
      ${list}
      ${caption('WHAT THE MOT LOOKS AT', 548)}`;
  },

  warrantyTerms() {
    const dx = 680, dy = 186, dw = 250, dh = 320;
    let lines = '';
    for (let i = 0; i < 8; i++) {
      const y = dy + 82 + i * 28;
      const hit = i === 4;
      lines += `<rect x="${dx + 26}" y="${y}" width="${[170, 196, 140, 186, 176, 120, 190, 150][i]}" height="9" rx="4.5" fill="${hit ? ORANGE : GRID}"/>`;
    }
    return `
      ${panel(dx, dy, dw, dh, '#0c1116', '#2c3444', 16)}
      ${label(dx + 26, dy + 50, 'WARRANTY TERMS', 15, MUTE, 'start')}
      ${lines}
      <circle cx="${dx + 214}" cy="${dy + 196}" r="62" fill="#0b0e12" fill-opacity="0.55" stroke="${INK}" stroke-width="5"/>
      <line x1="${dx + 258}" y1="${dy + 240}" x2="${dx + 316}" y2="${dy + 298}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
      ${label(dx + 214, dy + 202, 'MODS?', 18, ORANGE)}
      ${caption('READ YOUR TERMS FIRST', 556)}`;
  },

  bigFilter() {
    const small = { x: 718, y: 404, r: 62 }, big = { x: 966, y: 330, r: 140 };
    return `
      <circle cx="${small.x}" cy="${small.y}" r="${small.r}" fill="#0c1015" stroke="#3a4556" stroke-width="4"/>
      ${honeycomb(small.x, small.y, small.r, 6, 6, 11)}
      ${label(small.x, small.y + small.r + 40, 'CAR', 15, MUTE)}
      <circle cx="${big.x}" cy="${big.y}" r="${big.r}" fill="#0c1015" stroke="${ORANGE}" stroke-width="5"/>
      ${honeycomb(big.x, big.y, big.r, 11, 12, 14)}
      ${label(big.x, big.y + big.r + 40, 'HGV / PLANT', 15, ORANGE)}
      ${caption('BIGGER FILTERS, HARDER DUTY', 562)}`;
  },

  fleetCare: () => pillRows([
    ['Sealed ISO 22241 fluid', 'CHECK'],
    ['Clean filler neck and cap', 'CHECK'],
    ['Stored cool, used in date', 'CHECK'],
    ['First warning acted on', 'ACT', BLUE],
  ], 'PREVENTION BEATS REPAIR'),

  towing() {
    const slope = `M 640 520 L 1130 360`;
    const mh = `
      <g transform="translate(800 447) rotate(-18)">
        <rect x="0" y="-92" width="190" height="92" rx="10" fill="#151d29" stroke="${ORANGE}" stroke-width="3"/>
        <path d="M 190 -92 l 34 0 l 22 40 l 0 52 l -56 0 z" fill="#151d29" stroke="${ORANGE}" stroke-width="3"/>
        <rect x="18" y="-72" width="44" height="26" rx="4" fill="#22314a"/>
        <rect x="76" y="-72" width="44" height="26" rx="4" fill="#22314a"/>
        <path d="M 196 -84 l 22 0 l 16 30 l -38 0 z" fill="#22314a"/>
        <circle cx="46" cy="2" r="18" fill="#0c1015" stroke="#55606f" stroke-width="3"/>
        <circle cx="206" cy="2" r="18" fill="#0c1015" stroke="#55606f" stroke-width="3"/>
      </g>`;
    return `
      <path d="${slope}" stroke="${GRID}" stroke-width="5" stroke-linecap="round"/>
      ${mh}
      ${panel(650, 196, 196, 112, '#0c1116', '#2c3444', 12)}
      ${label(670, 228, 'VIN PLATE', 13, MUTE, 'start')}
      ${text(670, 258, 'Gross weight', 14.5, INK)}
      ${text(670, 284, 'Train weight', 14.5, INK)}
      ${label(830, 270, 'LOCKED', 12, ORANGE, 'end')}
      ${caption('THE PLATED WEIGHTS DO NOT CHANGE', 572)}`;
  },

  buyerChecklist() {
    const x = 676, y = 196, w = 400, h = 340;
    const items = ['MOT history checked', 'Warning lamps behave', 'Service and oil spec', 'AdBlue level and warnings', 'Remap declared?'];
    let list = '';
    items.forEach((t, i) => {
      const ry = y + 92 + i * 50;
      list += `<rect x="${x + 30}" y="${ry - 18}" width="24" height="24" rx="5" fill="none" stroke="${ORANGE}" stroke-width="3"/>`;
      if (i < 3) list += `<path d="M ${x + 35} ${ry - 6} l 6 7 l 10 -13" fill="none" stroke="${ORANGE}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      list += text(x + 70, ry, t, 16.5);
    });
    return `
      ${panel(x, y, w, h, '#0c1116', '#2c3444', 16)}
      <rect x="${x + w / 2 - 54}" y="${y - 16}" width="108" height="34" rx="8" fill="#1d2532" stroke="#3a4556" stroke-width="2"/>
      ${list}
      ${caption('CHECK BEFORE YOU PAY', 572)}`;
  },

  ecuClone() {
    const y = 292, w = 170, h = 150;
    const ecu = (x, stroke, name, colour) => {
      let pins = '';
      for (let i = 0; i < 8; i++) pins += `<rect x="${x + 16 + i * 18}" y="${y + h - 2}" width="9" height="16" rx="2" fill="#2b3442"/>`;
      return `${panel(x, y, w, h, '#101620', stroke, 14)}<rect x="${x + 50}" y="${y + 40}" width="70" height="56" rx="6" fill="none" stroke="${colour}" stroke-width="3"/><rect x="${x + 70}" y="${y + 56}" width="30" height="24" fill="${colour}" opacity="0.8"/>${pins}${label(x + w / 2, y + h + 50, name, 14, colour)}`;
    };
    const tags = ['VIN', 'IMMO', 'CODING', 'CALIBRATION'];
    return `
      ${ecu(640, RED, 'FAILED ECU', RED)}
      ${ecu(950, ORANGE, 'REPLACEMENT', ORANGE)}
      ${tags.map((t, i) => pill(880, 222 + i * 54, t, i === 3 ? ORANGE : BLUE, i === 3 ? 124 : 92)).join('')}
      ${arrow(826, y + h + 4, 104, ORANGE, 4)}
      ${caption('THE DATA MOVES ACROSS', 566)}`;
  },
};

// ── cover configs ────────────────────────────────────────────────────────────
const t = (s, o = false) => ({ t: s, o });
const COVERS = [
  { slug: 'how-much-does-dpf-cleaning-cost', category: 'DPF CLEANING', eyebrow: 'WHAT YOU PAY FOR',
    titleLines: [[t('How much does')], [t('DPF cleaning '), t('cost?', true)]], motif: 'dpfPrice' },
  { slug: 'does-my-diesel-use-adblue', category: 'ADBLUE & SCR', eyebrow: 'EURO 6 EXPLAINED',
    titleLines: [[t('Does my diesel')], [t('use '), t('AdBlue?', true)]], motif: 'lntVsScr' },
  { slug: 'will-a-remap-cause-dpf-or-adblue-problems', category: 'ECU CALIBRATION', eyebrow: 'DPF AND ADBLUE',
    titleLines: [[t('Will a remap')], [t('cause '), t('problems?', true)]], motif: 'smokeLimit' },
  { slug: 'dpf-additive-fluid-peugeot-citroen-ford', category: 'DPF SYSTEMS', eyebrow: 'PEUGEOT, CITROEN, FORD',
    titleLines: [[t('DPF additive')], [t('fluid '), t('explained', true)]], motif: 'additiveTank' },
  { slug: 'diesel-in-the-adblue-tank', category: 'ADBLUE & SCR', eyebrow: 'WRONG FLUID',
    titleLines: [[t('Diesel in the')], [t('AdBlue tank', true)]], motif: 'wrongFluid' },
  { slug: 'how-much-does-a-remap-cost', category: 'ECU CALIBRATION', eyebrow: 'WHAT YOU PAY FOR',
    titleLines: [[t('How much does')], [t('a '), t('remap', true), t(' cost?')]], motif: 'remapPrice' },
  { slug: 'dpf-cleaner-additives-what-they-can-and-cannot-do', category: 'DPF MAINTENANCE', eyebrow: 'HONEST LIMITS',
    titleLines: [[t('DPF cleaner')], [t('additives', true)]], motif: 'sootVsAsh' },
  { slug: 'how-much-adblue-should-a-vehicle-use', category: 'ADBLUE & SCR', eyebrow: 'CONSUMPTION',
    titleLines: [[t('How much AdBlue')], [t('should it '), t('use?', true)]], motif: 'consumption' },
  { slug: 'diesel-limp-mode-common-causes', category: 'DPF DIAGNOSTICS', eyebrow: 'REDUCED POWER',
    titleLines: [[t('Diesel limp mode:')], [t('the '), t('common causes', true)]], motif: 'limpGauge' },
  { slug: 'how-long-does-a-remap-take', category: 'ECU CALIBRATION', eyebrow: 'ON THE DAY',
    titleLines: [[t('How long does')], [t('a '), t('remap', true), t(' take?')]], motif: 'remapDay' },
  { slug: 'postal-dpf-cleaning-how-to-send-a-filter', category: 'DPF CLEANING', eyebrow: 'UK-WIDE SERVICE',
    titleLines: [[t('How to send a')], [t('DPF for '), t('cleaning', true)]], motif: 'parcel' },
  { slug: 'adblue-in-winter-freezing-and-heater-faults', category: 'ADBLUE & SCR', eyebrow: 'COLD WEATHER',
    titleLines: [[t('AdBlue in')], [t('winter', true)]], motif: 'winter' },
  { slug: 'remap-power-figures-where-the-numbers-come-from', category: 'ECU CALIBRATION', eyebrow: 'READING THE NUMBERS',
    titleLines: [[t('Remap power')], [t('figures', true), t(' explained')]], motif: 'dynoBand' },
  { slug: 'diesel-mot-smoke-test-dpf-and-adblue', category: 'DPF & COMPLIANCE', eyebrow: 'MOT DAY',
    titleLines: [[t('The diesel MOT')], [t('smoke test', true)]], motif: 'motCheck' },
  { slug: 'remapping-and-your-warranty', category: 'ECU CALIBRATION', eyebrow: 'BEFORE YOU BOOK',
    titleLines: [[t('Remapping and')], [t('your '), t('warranty', true)]], motif: 'warrantyTerms' },
  { slug: 'hgv-plant-and-agricultural-dpf-cleaning', category: 'DPF CLEANING', eyebrow: 'HEAVY DUTY',
    titleLines: [[t('HGV, plant and')], [t('tractor '), t('DPFs', true)]], motif: 'bigFilter' },
  { slug: 'looking-after-an-adblue-system-vans-and-fleets', category: 'ADBLUE & SCR', eyebrow: 'FOR VANS AND FLEETS',
    titleLines: [[t('Looking after')], [t('an '), t('AdBlue', true), t(' system')]], motif: 'fleetCare' },
  { slug: 'remapping-a-motorhome-or-tow-vehicle', category: 'ECU CALIBRATION', eyebrow: 'LEISURE AND TOWING',
    titleLines: [[t('Motorhome and')], [t('towing', true), t(' remaps')]], motif: 'towing' },
  { slug: 'buying-a-used-diesel-dpf-adblue-and-remap-checks', category: 'DPF DIAGNOSTICS', eyebrow: "BUYER'S CHECKLIST",
    titleLines: [[t('Buying a')], [t('used '), t('diesel', true)]], motif: 'buyerChecklist' },
  { slug: 'failed-ecu-cloning-versus-replacing', category: 'ECU CALIBRATION', eyebrow: 'FAILED ECU',
    titleLines: [[t('ECU cloning vs')], [t('replacement', true)]], motif: 'ecuClone' },
];

const artFor = new Map(Object.entries(COVER_ART).map(([file, slug]) => [slug, file]));
const only = process.argv.slice(2);
mkdirSync(enhanceDir, { recursive: true });

console.log('\nGenerating batch-3 covers...\n');
let made = 0;
for (const c of COVERS) {
  if (only.length && !only.includes(c.slug)) continue;
  const art = artFor.get(c.slug);
  if (!art) throw new Error(`No cover filename for ${c.slug} in scripts/blog-cover-map.mjs`);
  if (existsSync(join(workspaceRoot, art))) {
    console.log(`  - ${c.slug}: your artwork is in place, skipped`);
    continue;
  }
  const svg = frame({ eyebrow: c.eyebrow, titleLines: c.titleLines, category: c.category, motif: M[c.motif]() });
  const out = join(pub, 'blog', c.slug, 'cover.jpg');
  mkdirSync(dirname(out), { recursive: true });
  await sharp(svg).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
  await sharp(svg, { density: 144 }).png().toFile(join(enhanceDir, art));
  console.log('  ✓', c.slug);
  made++;
}
console.log(`\nDone. ${made} covers generated. 2x PNGs for enhancing are in ${enhanceDir}\n`);
