// Shared drawing kit for generated blog cover graphics.
//
// Holds the Auto-Cleanse cover frame (background, emblem, badges, title block,
// base bar) and the small geometry helpers the article motifs are built from.
// Imported by the per-batch generator scripts; it draws nothing on its own.
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const pub = join(__dirname, '..', 'public');
const EMBLEM = join(pub, 'UniversalUpscaler_2dfd4994-6f3d-4696-9702-f0cd99f34a8c (1).png');

export const W = 1200, H = 675;
export const ORANGE = '#FF7A00';
export const INK = '#eef1f5';
export const MUTE = '#8a929e';
export const GRID = '#2a3342';
export const AXIS = '#39435180';
export const BLUE = '#8fb0d8';
export const RED = '#ff5a4d';

// motif anchor: the right-hand column
export const CX = 872, CY = 348;

const emblemBuf = await sharp(EMBLEM).resize({ height: 96 }).png().toBuffer();
const emblemMeta = await sharp(emblemBuf).metadata();
const emblemURI = `data:image/png;base64,${emblemBuf.toString('base64')}`;
const EMW = emblemMeta.width, EMH = emblemMeta.height;

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const rad = (d) => (Math.PI / 180) * d;

function titleBlock(lines, x, yStart, size, lh) {
  return lines
    .map((segs, i) => {
      const spans = segs.map((s) => `<tspan fill="${s.o ? ORANGE : INK}">${esc(s.t)}</tspan>`).join('');
      return `<text xml:space="preserve" x="${x}" y="${yStart + i * lh}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="800" letter-spacing="-0.5">${spans}</text>`;
    })
    .join('');
}

export function frame({ eyebrow, titleLines, category, motif, defs = '' }) {
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
export function hex(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) pts.push(`${(cx + r * Math.cos(rad(60 * i))).toFixed(1)},${(cy + r * Math.sin(rad(60 * i))).toFixed(1)}`);
  return pts.join(' ');
}

/** Semicircle gauge opening upward. frac 0..1 */
export function gauge(gx, gy, R, frac, label) {
  const th = 180 * (1 - frac);
  const ex = gx + R * Math.cos(rad(th)), ey = gy - R * Math.sin(rad(th));
  const nx = gx + (R - 20) * Math.cos(rad(th)), ny = gy - (R - 20) * Math.sin(rad(th));
  return `
    <path d="M ${gx - R} ${gy} A ${R} ${R} 0 0 1 ${gx + R} ${gy}" fill="none" stroke="${GRID}" stroke-width="12" stroke-linecap="round"/>
    <path d="M ${gx - R} ${gy} A ${R} ${R} 0 0 1 ${ex} ${ey}" fill="none" stroke="url(#orange)" stroke-width="12" stroke-linecap="round"/>
    <line x1="${gx}" y1="${gy}" x2="${nx}" y2="${ny}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${gx}" cy="${gy}" r="8" fill="${INK}"/>
    ${label ? `<text x="${gx}" y="${gy + 34}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="1.5" fill="${MUTE}">${esc(label)}</text>` : ''}`;
}

export function axes(x0, y0, x1, yTop, xlab, ylab) {
  return `
    <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="${AXIS}" stroke-width="2"/>
    <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${yTop}" stroke="${AXIS}" stroke-width="2"/>
    <text x="${x1}" y="${y0 + 26}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="1" fill="${MUTE}">${esc(xlab)}</text>
    <text x="${x0 - 8}" y="${yTop + 2}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="1" fill="${MUTE}" transform="rotate(-90 ${x0 - 8} ${yTop + 2})">${esc(ylab)}</text>`;
}

export function caption(text, y = 560, cx = CX) {
  return `<text x="${cx}" y="${y}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="2" fill="${MUTE}">${text}</text>`;
}

/** Rounded panel with an optional heading. */
export function panel(x, y, w, h, fill = '#0c1116', stroke = '#242c3a', rx = 14) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
}

export function label(x, y, text, size = 15, fill = MUTE, anchor = 'middle', weight = 800, ls = 1.5) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}">${esc(text)}</text>`;
}

/** Right-pointing flow arrow starting at (x,y). */
export function arrow(x, y, len = 28, colour = ORANGE, wdt = 5) {
  return `<path d="M ${x} ${y} l ${len} 0 m ${-(len * 0.3)} ${-(wdt + 4)} l ${len * 0.3} ${wdt + 4} l ${-(len * 0.3)} ${wdt + 4}" fill="none" stroke="${colour}" stroke-width="${wdt}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export function tick(x, y, r = 17, colour = ORANGE) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${colour}" stroke-width="4"/>
    <path d="M ${x - r * 0.45} ${y} l ${r * 0.32} ${r * 0.4} l ${r * 0.62} ${-r * 0.78}" fill="none" stroke="${colour}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export function cross(x, y, r = 15, colour = RED) {
  return `<g stroke="${colour}" stroke-width="4" stroke-linecap="round">
    <line x1="${x - r * 0.6}" y1="${y - r * 0.6}" x2="${x + r * 0.6}" y2="${y + r * 0.6}"/>
    <line x1="${x + r * 0.6}" y1="${y - r * 0.6}" x2="${x - r * 0.6}" y2="${y + r * 0.6}"/></g>`;
}

/** Render a cover config to public/blog/<slug>/cover.jpg */
export async function renderCover(cfg, motifSvg, outPath, quality = 86) {
  const svg = frame({
    eyebrow: cfg.eyebrow,
    titleLines: cfg.titleLines,
    category: cfg.category,
    motif: motifSvg,
    defs: cfg.defs || '',
  });
  await sharp(svg).jpeg({ quality }).toFile(outPath);
}
