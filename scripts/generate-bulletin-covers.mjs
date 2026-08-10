// Generates distinct, on-brand cover graphics for the technical-bulletin blog
// posts. One re-runnable script: edit a config entry, re-run:
//   node scripts/generate-bulletin-covers.mjs
//
// Same rasterisation path as generate-blog-covers.mjs (sharp -> librsvg -> jpg),
// which renders SVG text, gradients and inline images on this machine. Each
// cover is a shared brand frame (AC emblem, AUTO-CLEANSE pill, category tag,
// title, orange base bar) plus a per-article vector "motif" on the right.
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');
const EMBLEM = join(pub, 'UniversalUpscaler_2dfd4994-6f3d-4696-9702-f0cd99f34a8c (1).png');

const W = 1200, H = 675;
const ORANGE = '#FF7A00';
const INK = '#eef1f5';
const MUTE = '#8a929e';
const GRID = '#2a3342';
const AXIS = '#39435180';

// ── brand emblem, pre-scaled + base64 for inline <image> ─────────────────────
const emblemBuf = await sharp(EMBLEM).resize({ height: 96 }).png().toBuffer();
const emblemMeta = await sharp(emblemBuf).metadata();
const emblemURI = `data:image/png;base64,${emblemBuf.toString('base64')}`;
const EMW = emblemMeta.width, EMH = emblemMeta.height;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A title line = array of { t, o? } segments (o:true => orange). xml:space is
// preserved so the spaces between accent segments survive.
function titleBlock(lines, x, yStart, size, lh) {
  return lines
    .map((segs, i) => {
      const spans = segs.map((s) => `<tspan fill="${s.o ? ORANGE : INK}">${esc(s.t)}</tspan>`).join('');
      return `<text xml:space="preserve" x="${x}" y="${yStart + i * lh}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="800" letter-spacing="-0.5">${spans}</text>`;
    })
    .join('');
}

// ── shared frame ─────────────────────────────────────────────────────────────
function frame({ eyebrow, titleLines, category, motif, defs = '' }) {
  const titleSize = 50, titleLH = 60;
  const blockH = titleLines.length * titleLH;
  const titleY = Math.round((H - blockH) / 2) + 44;
  return Buffer.from(
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0e12"/><stop offset="1" stop-color="#0e1218"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.80" cy="0.16" r="0.85">
      <stop offset="0" stop-color="${ORANGE}" stop-opacity="0.22"/>
      <stop offset="0.55" stop-color="${ORANGE}" stop-opacity="0.03"/>
      <stop offset="1" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="orange" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ff7a00"/>
    </linearGradient>
    ${defs}
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#1c2230" stroke-width="2"/>

  <image xlink:href="${emblemURI}" x="72" y="54" width="${EMW}" height="${EMH}"/>
  <g transform="translate(${72 + EMW + 16}, ${54 + EMH / 2})">
    <rect x="0" y="-16" rx="6" ry="6" width="150" height="32" fill="${ORANGE}"/>
    <text x="75" y="6" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="1.6" fill="#0a0a0a">AUTO-CLEANSE</text>
  </g>
  <text x="${W - 72}" y="76" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="2.6" fill="${MUTE}">${esc(category)}</text>

  <text x="80" y="${titleY - 78}" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="800" letter-spacing="3.4" fill="${ORANGE}">${esc(eyebrow)}</text>
  ${titleBlock(titleLines, 80, titleY, titleSize, titleLH)}
  <rect x="82" y="${titleY + blockH - 30}" width="64" height="5" rx="2.5" fill="${ORANGE}"/>

  ${motif}

  <rect x="0" y="${H - 9}" width="${W}" height="9" fill="${ORANGE}"/>
  <text x="80" y="${H - 30}" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.2" fill="#5a626e">auto-cleanse.co.uk</text>
</svg>`
  );
}

// ── geometry helpers ─────────────────────────────────────────────────────────
const CX = 872, CY = 348; // motif centre
const rad = (d) => (Math.PI / 180) * d;

function hex(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) pts.push(`${(cx + r * Math.cos(rad(60 * i))).toFixed(1)},${(cy + r * Math.sin(rad(60 * i))).toFixed(1)}`);
  return pts.join(' ');
}

// semicircle gauge (opens upward), value 0..1
function gauge(gx, gy, R, frac, label) {
  const th = 180 * (1 - frac); // 180 = left, 0 = right
  const ex = gx + R * Math.cos(rad(th)), ey = gy - R * Math.sin(rad(th));
  const nx = gx + (R - 20) * Math.cos(rad(th)), ny = gy - (R - 20) * Math.sin(rad(th));
  return `
    <path d="M ${gx - R} ${gy} A ${R} ${R} 0 0 1 ${gx + R} ${gy}" fill="none" stroke="${GRID}" stroke-width="12" stroke-linecap="round"/>
    <path d="M ${gx - R} ${gy} A ${R} ${R} 0 0 1 ${ex} ${ey}" fill="none" stroke="url(#orange)" stroke-width="12" stroke-linecap="round"/>
    <line x1="${gx}" y1="${gy}" x2="${nx}" y2="${ny}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${gx}" cy="${gy}" r="8" fill="${INK}"/>
    <text x="${gx}" y="${gy + 34}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="1.5" fill="${MUTE}">${label}</text>`;
}

function axes(x0, y0, x1, yTop, xlab, ylab) {
  return `
    <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="${AXIS}" stroke-width="2"/>
    <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${yTop}" stroke="${AXIS}" stroke-width="2"/>
    <text x="${x1}" y="${y0 + 26}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="1" fill="${MUTE}">${xlab}</text>
    <text x="${x0 - 8}" y="${yTop + 2}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="1" fill="${MUTE}" transform="rotate(-90 ${x0 - 8} ${yTop + 2})">${ylab}</text>`;
}

function caption(text) {
  return `<text x="${CX}" y="560" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="2" fill="${MUTE}">${text}</text>`;
}

// ── motifs ───────────────────────────────────────────────────────────────────
const MOTIFS = {
  // 1 — DPF honeycomb + regeneration loop
  regenLoop() {
    const r = 20, dx = r * 1.5, dy = r * Math.sqrt(3);
    let cells = '';
    for (let row = -2; row <= 2; row++)
      for (let col = -2; col <= 2; col++) {
        const cx = CX + col * dx, cy = CY + row * dy + (col % 2 ? dy / 2 : 0);
        if (Math.hypot(cx - CX, cy - CY) > 92) continue;
        const soot = cx <= CX - 2;
        cells += `<polygon points="${hex(cx, cy, r - 2.5)}" fill="${soot ? '#20160c' : '#12171f'}" stroke="${soot ? '#6b4a20' : GRID}" stroke-width="2"/>`;
      }
    const R = 132;
    return `
      <circle cx="${CX}" cy="${CY}" r="110" fill="#0c1015" stroke="#242c3a" stroke-width="2"/>
      ${cells}
      <path d="M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - R} ${CY}" fill="none" stroke="url(#orange)" stroke-width="7" stroke-linecap="round"/>
      <path d="M ${CX - R - 12} ${CY - 16} L ${CX - R} ${CY + 6} L ${CX - R + 14} ${CY - 14} Z" fill="${ORANGE}"/>
      ${caption('REGENERATION &#8800; REPAIR')}`;
  },

  // 2 — modelled vs pressure-derived soot (two dials)
  twoDials() {
    return `
      ${gauge(762, 372, 96, 0.42, 'MODELLED')}
      ${gauge(986, 372, 96, 0.74, 'PRESSURE')}
      <text x="${CX}" y="250" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="800" fill="${ORANGE}">&#8800;</text>
      ${caption('TWO ESTIMATES, ONE UNKNOWN')}`;
  },

  // 3 — five-step diagnostic sequence
  checklist5() {
    const x = 648, y0 = 196, gap = 68, bw = 486;
    let rows = '';
    for (let i = 0; i < 5; i++) {
      const y = y0 + i * gap, done = i < 4;
      rows += `
        <rect x="${x}" y="${y}" width="40" height="40" rx="9" fill="${done ? 'url(#orange)' : '#12171f'}" stroke="${done ? 'none' : GRID}" stroke-width="2"/>
        <text x="${x + 20}" y="${y + 27}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="800" fill="${done ? '#0a0a0a' : MUTE}">${i + 1}</text>
        <rect x="${x + 58}" y="${y + 9}" width="${bw - 58}" height="9" rx="4.5" fill="#151b24"/>
        <rect x="${x + 58}" y="${y + 9}" width="${(bw - 58) * (0.9 - i * 0.13)}" height="9" rx="4.5" fill="${GRID}"/>
        <rect x="${x + 58}" y="${y + 24}" width="${(bw - 58) * (0.6 - i * 0.08)}" height="7" rx="3.5" fill="#151b24"/>`;
    }
    return `${rows}<text x="${x}" y="${y0 - 22}" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="2.4" fill="${MUTE}">DIAGNOSTIC SEQUENCE</text>`;
  },

  // 4 — ECU chip coordinating control areas
  ecuChip() {
    const s = 116, x = CX - s / 2, y = CY - s / 2;
    let pins = '';
    for (let i = 0; i < 5; i++) {
      const p = x + 18 + i * 20;
      pins += `<rect x="${p}" y="${y - 12}" width="8" height="12" fill="${GRID}"/><rect x="${p}" y="${y + s}" width="8" height="12" fill="${GRID}"/>`;
      pins += `<rect x="${x - 12}" y="${y + 18 + i * 20}" width="12" height="8" fill="${GRID}"/><rect x="${x + s}" y="${y + 18 + i * 20}" width="12" height="8" fill="${GRID}"/>`;
    }
    const nodes = [[CX, CY - 168], [CX + 168, CY - 60], [CX + 120, CY + 150], [CX - 120, CY + 150], [CX - 168, CY - 60]];
    let net = '';
    nodes.forEach((n, i) => {
      net += `<line x1="${CX}" y1="${CY}" x2="${n[0]}" y2="${n[1]}" stroke="${GRID}" stroke-width="2"/>`;
      net += `<circle cx="${n[0]}" cy="${n[1]}" r="12" fill="${i === 0 ? 'url(#orange)' : '#12171f'}" stroke="${i === 0 ? 'none' : GRID}" stroke-width="2"/>`;
    });
    return `
      ${net}${pins}
      <rect x="${x}" y="${y}" width="${s}" height="${s}" rx="14" fill="#101620" stroke="#33404f" stroke-width="2"/>
      <text x="${CX}" y="${CY - 6}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="1" fill="${ORANGE}">ECU</text>
      <text x="${CX}" y="${CY + 18}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5" fill="${MUTE}">TORQUE MODEL</text>
      ${caption('ONE COORDINATED CALIBRATION')}`;
  },

  // 5 — off-vehicle clean: flow through a filter body
  filterFlow() {
    const x = 700, y = 250, w = 348, h = 200;
    const r = 17, dx = r * 1.5, dy = r * Math.sqrt(3);
    let cells = '';
    for (let row = -3; row <= 3; row++) {
      for (let col = 0; col < 9; col++) {
        const cx = x + 40 + col * dx;
        const cy = y + h / 2 + row * dy + (col % 2 ? dy / 2 : 0);
        if (cy < y + 24 || cy > y + h - 24) continue;
        const soot = col < 4;      // inlet half still loaded
        const part = col === 4;    // transition column
        cells += `<polygon points="${hex(cx, cy, r - 2)}" fill="${soot ? '#20160c' : part ? '#191a16' : '#12171f'}" stroke="${soot ? '#6b4a20' : part ? '#4a4630' : GRID}" stroke-width="1.6"/>`;
      }
    }
    const arrow = (ax) => `<path d="M ${ax} ${y + h / 2} l 28 0 m -9 -9 l 9 9 l -9 9" fill="none" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `
      ${arrow(614)}
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="#0c1015" stroke="#2c3444" stroke-width="2"/>
      <rect x="${x + 16}" y="${y + 14}" width="${w - 32}" height="${h - 28}" rx="14" fill="none" stroke="#1d2531" stroke-width="2"/>
      ${cells}
      ${arrow(x + w + 6)}
      ${caption('DIAGNOSE, THEN CLEAN')}`;
  },

  // 6 — pre-remap health check waveform
  healthWave() {
    const x0 = 636, x1 = 1128, y = 250, h = 200, mid = y + h / 2;
    const p = `M ${x0 + 20} ${mid} L ${x0 + 120} ${mid} L ${x0 + 150} ${mid - 20} L ${x0 + 185} ${mid + 66} L ${x0 + 225} ${mid - 88} L ${x0 + 262} ${mid} L ${x1 - 120} ${mid} L ${x1 - 92} ${mid - 22} L ${x1 - 60} ${mid + 20} L ${x1 - 20} ${mid}`;
    return `
      <rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="18" fill="#0c1116" stroke="#242c3a" stroke-width="2"/>
      <path d="${p}" fill="none" stroke="url(#orange)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${x1 - 44}" cy="${y + 40}" r="17" fill="none" stroke="${ORANGE}" stroke-width="4"/>
      <path d="M ${x1 - 52} ${y + 40} l 6 7 l 11 -14" fill="none" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      ${caption('HEALTH CHECK BEFORE TUNE')}`;
  },

  // 7 — differential pressure across the filter
  deltaP() {
    const x = 700, y = 320, w = 344, h = 96;
    let hatch = '';
    for (let i = 0; i < 8; i++) hatch += `<polygon points="${hex(x + 30 + i * 40, y + h / 2, 13)}" fill="#12171f" stroke="${GRID}" stroke-width="1.5"/>`;
    const tap = (tx, lab, v) => `
      <line x1="${tx}" y1="${y}" x2="${tx}" y2="${y - 44}" stroke="${GRID}" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="${tx}" cy="${y - 70}" r="26" fill="#0c1015" stroke="#33404f" stroke-width="2"/>
      <line x1="${tx}" y1="${y - 70}" x2="${tx + (v ? 12 : -10)}" y2="${y - 70 - (v ? 14 : 16)}" stroke="${ORANGE}" stroke-width="3" stroke-linecap="round"/>
      <text x="${tx}" y="${y - 104}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" fill="${MUTE}">${lab}</text>`;
    const arrow = (ax) => `<path d="M ${ax} ${y + h / 2} l 24 0 m -8 -7 l 8 7 l -8 7" fill="none" stroke="${ORANGE}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `
      ${arrow(636)}
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#0c1015" stroke="#2c3444" stroke-width="2"/>
      ${hatch}
      ${arrow(x + w + 6)}
      ${tap(x + 40, 'P1', true)}${tap(x + w - 40, 'P2', false)}
      <text x="${CX}" y="500" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="800" fill="${ORANGE}">&#916;P = P1 &#8722; P2</text>`;
  },

  // 8 — torque curve clipped by the safe limit line
  torqueLimit() {
    const x0 = 640, y0 = 500, x1 = 1130, yTop = 190, limitY = 262;
    const curve = `M ${x0} ${y0 - 10} C ${x0 + 120} ${y0 - 20}, ${x0 + 180} ${limitY + 8}, ${x0 + 250} ${limitY + 4} L ${x1 - 10} ${limitY + 4}`;
    return `
      ${axes(x0, y0, x1, yTop, 'RPM', 'TORQUE')}
      <line x1="${x0}" y1="${limitY}" x2="${x1}" y2="${limitY}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="7 7" opacity="0.85"/>
      <text x="${x1}" y="${limitY - 12}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="1" fill="${ORANGE}">SAFE TORQUE LIMIT</text>
      <path d="${curve} L ${x1 - 10} ${y0} L ${x0} ${y0} Z" fill="${ORANGE}" opacity="0.10"/>
      <path d="${curve}" fill="none" stroke="url(#orange)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      ${caption('CALIBRATED WITHIN THE LIMITS')}`;
  },

  // 9 — passive / active / forced regeneration states
  threeStates() {
    const base = 500, x0 = 700, gap = 122, w = 72;
    const items = [['PASSIVE', 92, 0.34], ['ACTIVE', 168, 0.64], ['FORCED', 244, 0.96]];
    let bars = '';
    items.forEach((it, i) => {
      const bx = x0 + i * gap, bh = it[1];
      bars += `
        <rect x="${bx}" y="${base - 250}" width="${w}" height="250" rx="8" fill="#12171f" stroke="${GRID}" stroke-width="2"/>
        <rect x="${bx}" y="${base - bh}" width="${w}" height="${bh}" rx="8" fill="url(#orange)" opacity="${0.55 + i * 0.22}"/>
        <text x="${bx + w / 2}" y="${base + 26}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="1" fill="${MUTE}">${it[0]}</text>`;
    });
    return `${bars}<text x="${x0}" y="${base - 274}" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="2" fill="${MUTE}">EXHAUST TEMPERATURE &#8594;</text>`;
  },

  // 10 — peak power vs usable torque
  powerTorque() {
    const x0 = 640, y0 = 500, x1 = 1130, yTop = 180;
    const power = `M ${x0} ${y0 - 8} C ${x0 + 180} ${y0 - 30}, ${x0 + 300} ${y0 - 180}, ${x1} ${yTop}`;
    const torque = `M ${x0} ${y0 - 40} C ${x0 + 150} ${y0 - 210}, ${x0 + 250} ${y0 - 250}, ${x0 + 330} ${y0 - 200} S ${x1 - 40} ${y0 - 120}, ${x1} ${y0 - 150}`;
    return `
      ${axes(x0, y0, x1, yTop, 'RPM', 'OUTPUT')}
      <path d="${torque}" fill="none" stroke="url(#orange)" stroke-width="6" stroke-linecap="round"/>
      <path d="${power}" fill="none" stroke="#8fb0d8" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="2 9"/>
      <g font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="800">
        <circle cx="${x0 + 14}" cy="215" r="6" fill="${ORANGE}"/><text x="${x0 + 28}" y="220" fill="${INK}">TORQUE</text>
        <circle cx="${x0 + 154}" cy="215" r="6" fill="#8fb0d8"/><text x="${x0 + 168}" y="220" fill="${MUTE}">POWER</text>
      </g>`;
  },

  // 11 — exhaust temperature vs regeneration threshold (failed regen)
  tempThreshold() {
    const x0 = 640, y0 = 500, x1 = 1130, yTop = 190, thr = 268;
    const line = `M ${x0 + 10} ${y0 - 30} L ${x0 + 80} ${y0 - 70} L ${x0 + 150} ${thr + 40} L ${x0 + 220} ${y0 - 90} L ${x0 + 300} ${thr + 24} L ${x0 + 380} ${y0 - 60} L ${x1 - 20} ${thr + 54}`;
    return `
      ${axes(x0, y0, x1, yTop, 'TIME', '°C')}
      <line x1="${x0}" y1="${thr}" x2="${x1}" y2="${thr}" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="7 7"/>
      <text x="${x1}" y="${thr - 12}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="1" fill="${ORANGE}">REGEN THRESHOLD</text>
      <path d="${line}" fill="none" stroke="#8fb0d8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <g stroke="#ff5a4d" stroke-width="4" stroke-linecap="round"><line x1="${x0 + 292}" y1="${thr + 16}" x2="${x0 + 308}" y2="${thr + 32}"/><line x1="${x0 + 308}" y1="${thr + 16}" x2="${x0 + 292}" y2="${thr + 32}"/></g>
      ${caption('NEVER REACHES TEMPERATURE')}`;
  },

  // 12 — economy: MPG gauge + fuel drop. The MPG label sits BELOW the pivot so
  // the needle never crosses it.
  mpgGauge() {
    const gy = 380;
    return `
      ${gauge(CX, gy, 138, 0.68, '')}
      <g transform="translate(${CX}, 196)">
        <path d="M 0 -24 C 16 -2, 21 13, 0 13 C -21 13, -16 -2, 0 -24 Z" fill="url(#orange)"/>
      </g>
      <text x="${CX}" y="${gy + 62}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="800" letter-spacing="1" fill="${INK}">MPG</text>
      ${caption('DEPENDS ON MORE THAN THE MAP')}`;
  },

  // 13 — soot / ash / contamination / physical damage
  fourQuadrant() {
    const cw = 236, ch = 150, gx = CX - cw - 8, gy = 200, gap = 16;
    const cell = (cx, cy, label, icon) => `
      <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="14" fill="#0c1116" stroke="#242c3a" stroke-width="2"/>
      ${icon(cx + cw / 2, cy + 58)}
      <text x="${cx + cw / 2}" y="${cy + ch - 20}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="1.5" fill="${MUTE}">${label}</text>`;
    const soot = (x, y) => { let d = ''; for (let i = 0; i < 11; i++) d += `<circle cx="${x - 34 + (i % 4) * 22}" cy="${y - 14 + Math.floor(i / 4) * 18}" r="4.5" fill="#8a6a3a"/>`; return d; };
    const ash = (x, y) => `<g fill="none" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round"><line x1="${x - 30}" y1="${y - 12}" x2="${x + 30}" y2="${y - 12}"/><line x1="${x - 30}" y1="${y}" x2="${x + 30}" y2="${y}"/><line x1="${x - 30}" y1="${y + 12}" x2="${x + 30}" y2="${y + 12}"/></g>`;
    const contam = (x, y) => `<path d="M ${x} ${y - 18} C ${x + 16} ${y + 2}, ${x + 12} ${y + 16}, ${x} ${y + 16} C ${x - 12} ${y + 16}, ${x - 16} ${y + 2}, ${x} ${y - 18} Z" fill="none" stroke="#8fb0d8" stroke-width="4"/><circle cx="${x + 22}" cy="${y + 6}" r="4" fill="#8fb0d8"/><circle cx="${x - 20}" cy="${y - 4}" r="3" fill="#8fb0d8"/>`;
    const damage = (x, y) => `<path d="M ${x - 26} ${y - 16} L ${x - 6} ${y - 4} L ${x - 16} ${y + 4} L ${x + 8} ${y + 18} L ${x - 2} ${y + 2} L ${x + 12} ${y - 6} L ${x + 26} ${y - 14}" fill="none" stroke="#ff5a4d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `
      ${cell(gx, gy, 'SOOT', soot)}
      ${cell(gx + cw + gap, gy, 'ASH', ash)}
      ${cell(gx, gy + ch + gap, 'CONTAMINATION', contam)}
      ${cell(gx + cw + gap, gy + ch + gap, 'PHYSICAL DAMAGE', damage)}`;
  },
};

// ── cover configs (all 13) ───────────────────────────────────────────────────
const COVERS = [
  { slug: 'why-dpf-blocks-again-after-regeneration', category: 'DPF DIAGNOSTICS', eyebrow: 'RECURRING BLOCKAGE',
    titleLines: [[{ t: 'Why a DPF blocks' }], [{ t: 'again ' }, { t: 'after a regen', o: true }]], motif: 'regenLoop' },
  { slug: 'calculated-soot-versus-measured-soot', category: 'DPF LIVE DATA', eyebrow: 'READING THE MODELS',
    titleLines: [[{ t: 'Calculated vs' }], [{ t: 'measured ' }, { t: 'soot', o: true }]], motif: 'twoDials' },
  { slug: 'five-checks-before-condemning-a-dpf', category: 'DPF DIAGNOSTICS', eyebrow: 'THE DIAGNOSTIC SEQUENCE',
    titleLines: [[{ t: 'Five checks before' }], [{ t: 'you ' }, { t: 'condemn a DPF', o: true }]], motif: 'checklist5' },
  { slug: 'what-changes-during-a-stage-1-remap', category: 'ECU CALIBRATION', eyebrow: 'INSIDE THE ECU',
    titleLines: [[{ t: 'What changes in a' }], [{ t: 'Stage 1 ', o: true }, { t: 'remap' }]], motif: 'ecuChip' },
  { slug: 'when-does-a-dpf-need-off-vehicle-cleaning', category: 'DPF MAINTENANCE', eyebrow: 'WHEN CLEANING IS RIGHT',
    titleLines: [[{ t: 'When a DPF needs' }], [{ t: 'off-vehicle ', o: true }, { t: 'cleaning' }]], motif: 'filterFlow' },
  { slug: 'why-vehicle-condition-matters-before-a-remap', category: 'ECU CALIBRATION', eyebrow: 'BEFORE YOU TUNE',
    titleLines: [[{ t: 'Why condition' }], [{ t: 'matters ' }, { t: 'before a remap', o: true }]], motif: 'healthWave' },
  { slug: 'understanding-dpf-differential-pressure', category: 'DPF DIAGNOSTICS', eyebrow: 'PRESSURE, EXPLAINED',
    titleLines: [[{ t: 'Understanding DPF' }], [{ t: 'differential ' }, { t: 'pressure', o: true }]], motif: 'deltaP' },
  { slug: 'engine-torque-gearbox-limits-and-stage-1-calibration', category: 'ECU CALIBRATION', eyebrow: 'STAGE 1 CALIBRATION',
    titleLines: [[{ t: 'Torque, gearbox' }], [{ t: 'limits ', o: true }, { t: '& Stage 1' }]], motif: 'torqueLimit' },
  { slug: 'passive-active-and-forced-dpf-regeneration', category: 'DPF SYSTEMS', eyebrow: 'THREE REGEN TYPES',
    titleLines: [[{ t: 'Passive, active &' }], [{ t: 'forced ', o: true }, { t: 'regeneration' }]], motif: 'threeStates' },
  { slug: 'peak-power-versus-usable-torque', category: 'ECU CALIBRATION', eyebrow: 'WHAT A REMAP DELIVERS',
    titleLines: [[{ t: 'Peak power vs' }], [{ t: 'usable ' }, { t: 'torque', o: true }]], motif: 'powerTorque' },
  { slug: 'temperature-data-and-failed-dpf-regeneration', category: 'DPF DIAGNOSTICS', eyebrow: 'WHY REGEN FAILS',
    titleLines: [[{ t: 'Temperature data &' }], [{ t: 'failed ', o: true }, { t: 'regeneration' }]], motif: 'tempThreshold' },
  { slug: 'economy-remaps-and-realistic-fuel-savings', category: 'ECU CALIBRATION', eyebrow: 'HONEST NUMBERS',
    titleLines: [[{ t: 'Economy remaps &' }], [{ t: 'realistic ' }, { t: 'fuel savings', o: true }]], motif: 'mpgGauge' },
  { slug: 'soot-ash-contamination-or-physical-damage', category: 'DPF DIAGNOSTICS', eyebrow: 'FOUR DIAGNOSES',
    titleLines: [[{ t: 'Soot, ash, or' }], [{ t: 'physical ' }, { t: 'damage?', o: true }]], motif: 'fourQuadrant' },
];

// ⚠ SAFETY GUARD --------------------------------------------------------------
// The 13 covers this script produces have since been REPLACED by supplied
// artwork (installed via scripts/install-blog-covers.mjs). Running this script
// unguarded would overwrite that artwork with the generated fallbacks, so it
// now refuses to run without an explicit --force.
if (!process.argv.includes('--force')) {
  console.log(
    '\nSkipped: these 13 covers now use supplied artwork.\n' +
    'Running this script would overwrite public/blog/<slug>/cover.jpg for the\n' +
    'original 13 bulletin posts.\n\n' +
    'To reinstall the supplied artwork:  node scripts/install-blog-covers.mjs\n' +
    'To regenerate the fallbacks anyway: node scripts/generate-bulletin-covers.mjs --force\n'
  );
  process.exit(0);
}

console.log('\nGenerating bulletin covers...\n');
for (const c of COVERS) {
  const svg = frame({ eyebrow: c.eyebrow, titleLines: c.titleLines, category: c.category, motif: MOTIFS[c.motif](), defs: c.defs || '' });
  const out = join(pub, 'blog', c.slug, 'cover.jpg');
  mkdirSync(dirname(out), { recursive: true });
  await sharp(svg).jpeg({ quality: 86 }).toFile(out);
  console.log('  ✓', out.replace(pub, 'public'));
}
console.log(`\nDone. ${COVERS.length} covers generated.\n`);
