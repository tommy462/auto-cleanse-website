import {
  memo, useCallback, useEffect, useReducer, useRef, useState,
  type CSSProperties, type MutableRefObject, type RefObject,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Car, Flame, FlaskConical, Droplets, ChevronRight, Repeat, RotateCcw, Pause, Play, SkipForward,
  ArrowRight, ZoomIn, ZoomOut, Lock, ShieldAlert, Layers, Wrench, ScanSearch, Gauge, ArrowLeftRight,
  Waves, Wind, CheckCircle2, Microscope, Check, X, CircleDashed, Phone, PhoneCall,
} from 'lucide-react';
import { trackEvent } from '../lib/tracking';

// Interactive cutaway of a wall-flow DPF (version 2).
// Drive loads soot and a little ash, Regen and Additive burn the soot but leave the ash,
// and the off-vehicle clean washes both out. Everything explanatory is in the
// renderToString output: render never touches window, document or matchMedia, and all
// decorative randomness is seeded at module level so server and client markup match.
// Ownership: GSAP owns every animated SVG attribute and the overlay opacities (React
// renders them once from constants and never writes them again). React owns the text,
// badges, tiles, meters, the step highlight, the close-up and the SVG <desc>.

gsap.registerPlugin(useGSAP);

/* ------------------------------------------------------------------ constants */

const PHONE_HREF = 'tel:07823649190';
const PHONE_TEXT = 'Call 07823 649190';
const TAU = Math.PI * 2;

// Geometry, viewBox 0 0 400 280. Channels are 18 high with 5 unit walls (pitch 23).
const CY = 152;
const chTop = (k: number) => 74 + 23 * k;
const chMid = (k: number) => chTop(k) + 9;
const CHANNELS = [0, 1, 2, 3, 4, 5, 6];
const INLETS = [0, 2, 4, 6];
const OUTLETS = [1, 3, 5];
const WALLS_Y = [92, 115, 138, 161, 184, 207];
const ASH_MAX = 130;
// Soot sits only on the inlet faces of walls that border an outlet channel.
const SOOT_FACES: [number, 1 | -1][] = [[92, -1], [120, 1], [138, -1], [166, 1], [184, -1], [212, 1]];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f2 = (n: number) => Math.round(n * 100) / 100;

// Seeded decoration, computed once so the server and the client draw the same thing.
const SOOT_PATHS = SOOT_FACES.map(([, dir], i) => {
  const r = mulberry32(11 + i * 7);
  let d = 'M72 0';
  for (let x = 72; x <= 312; x += 8) d += `L${x} ${f2(dir * (6 + (r() - 0.5) * 1.2))}`;
  return `${d}L312 0Z`;
});

const SPECKS = (() => {
  const r = mulberry32(97);
  const out: { x: number; y: number; r: number }[] = [];
  SOOT_FACES.forEach(([fy, dir]) => {
    for (let i = 0; i < 10; i++) {
      out.push({ x: f2(84 + 22 * i + (r() - 0.5) * 10), y: f2(fy + dir * (0.8 + r() * 1.4)), r: f2(0.55 + r() * 0.35) });
    }
  });
  return out;
})();

const ASH_BODY = 'M3 0Q0 3 2 6Q-1 9 1.5 12Q0 15.5 3 18H130V0Z';
const ASH_EDGE = 'M3 0Q0 3 2 6Q-1 9 1.5 12Q0 15.5 3 18';
const METAL = 'M-3.5 0Q-6.5 3-4.5 6Q-7.5 9-5 12Q-6.5 15.5-3.5 18L3 18Q0 15.5 1.5 12Q-1 9 2 6Q0 3 3 0Z';
const METAL_EDGE = 'M-3.5 0Q-6.5 3-4.5 6Q-7.5 9-5 12Q-6.5 15.5-3.5 18';

const hexPath = (cx: number, cy: number, r: number) => {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    d += `${i ? 'L' : 'M'}${f2(cx + r * Math.cos(a))} ${f2(cy + r * Math.sin(a))}`;
  }
  return `${d}Z`;
};
const BOLT_HEADS = `${hexPath(384, 122, 3.6)}${hexPath(384, 182, 3.6)}`;

// Soot cake thickness in viewBox units: about 2.6 at 10%, 5.8 at 50% and 7.8 at 90% of a 9 unit
// channel half-height, so every Drive visibly thickens it on a phone. The soot paths are drawn
// 6 units thick and scaled from there; SOOT_S0 is the start value the server renders.
const sootT = (v: number) => 8.2 * Math.sqrt(Math.max(0, Math.min(1, v)));
const sootScale = (v: number) => sootT(v) / 6;
const SOOT_S0 = sootScale(0.45).toFixed(4);
const TINT_K = 0.32; // inlet channels darken with the soot load
// Straight runs into and out of the cones: a channel height maps to this height at the pipe
// mouth, so every cone path is a straight line aimed at the cone's apex.
const coneY = (y: number) => CY + (y - CY) * 0.216;

const chev = (x: number, y: number) => `M${x} ${y - 4}l4 4-4 4`;
const ARROWS_X = [
  ...INLETS.map((k) => chev(128, chMid(k))),
  ...OUTLETS.map((k) => chev(288, chMid(k))),
].join('');
// The pipe chevrons go when the pipes do (the whole clean), so they never float in the bath.
const ARROWS_XP = 'M6 148l4 4-4 4M14 148l4 4-4 4M384 148l4 4-4 4M392 148l4 4-4 4';
// The crossings through the walls stay up (dimmed) while exhaust runs, since the moving gas
// hops through a wall without drawing a mark across it.
const ARROWS_XW = [
  'M222 86V103M219 100l3 3 3-3', 'M230 126V109M227 112l3-3 3 3', 'M222 132V149M219 146l3 3 3-3',
  'M230 172V155M227 158l3-3 3 3', 'M222 178V195M219 192l3 3 3-3', 'M230 218V201M227 204l3-3 3 3',
].join('');
const ARROWS_W = [
  'M10 148l4 4-4 4M18 148l4 4-4 4',
  ...OUTLETS.map((k) => chev(110, chMid(k))),
  'M200 103V86M197 89l3-3 3 3', 'M208 109V126M205 123l3 3 3-3', 'M200 149V132M197 135l3-3 3 3',
  'M208 155V172M205 169l3 3 3-3', 'M200 195V178M197 181l3-3 3 3', 'M208 201V218M205 215l3 3 3-3',
  ...INLETS.map((k) => chev(290, chMid(k))),
  'M384 148l4 4-4 4M392 148l4 4-4 4',
  'M380 196V250M377 247l3 3 3-3',
].join('');
// A pressure front for the impact bursts: a water wavefront, a shallow convex arc with a small
// ripple and a fading tail, tip at x 0.
const FRONT = (y: number) => `M-40 ${y}H-2.6C-.6 ${y + 3} .6 ${y + 5} -.2 ${y + 9}S-.6 ${y + 15} -2.6 ${y + 18}H-40Z`;
const LEADERS: [number, number, number, number][] = [
  [116, 252, 116, 209.5], [180, 252, 180, 214.5], [286, 252, 298, 222], [336, 252, 321, 222],
];
const LABELS: [string, number][] = [['IN', 3.5], ['WALL', 29], ['SOOT', 45], ['ASH', 71.5], ['PLUG', 84], ['OUT', 96.5]];

// Close-up of one wall (same viewBox): the warm, dirty inlet channel above, the porous wall in
// the middle and the cooler, cleaner outlet channel below, each running off the frame edges.
// The wall is packed ceramic grains with small voids between them everywhere (no through-gaps).
// Gas streams along both channels and crosses the wall as short arrows at many points; soot
// specks ride in and stop on the cake. The labels sit down the left edge (the cake label top
// right), and no arrow, stream or speck runs under any of them.
const CU_TOP = 140; // inlet face of the wall
const CU_BOT = 188; // outlet face of the wall
const CU_MID = (CU_TOP + CU_BOT) / 2;
const cakeT = (soot: number) => (soot >= 3 ? 4 + 0.17 * soot : 0);
// Through-wall arrows. The first two only show from 640px up, where the wall label is narrow
// enough to leave room for them (it ends at about x 198 at 360px, 142 at 1024px).
const CU_ARROWS = [160, 190, 220, 250, 280, 310, 340, 370];
const CU_ARROW = 'M0 -6.5V4.2M-3.3 .8L0 4.6L3.3 .8';
const CU_LANES_OUT = [208, 228];
const CU_SPECKS = [
  { x: 214, dx: -56, d: 0 }, { x: 262, dx: -48, d: 0.55 }, { x: 306, dx: -60, d: 1.1 }, { x: 238, dx: -44, d: 1.6 },
  { x: 286, dx: -52, d: 2.1 }, { x: 330, dx: -48, d: 2.6 }, { x: 196, dx: -50, d: 3 },
];
const CU_HAZE: [number, number, number][] = [
  [158, 58, 1.4], [204, 96, 1.1], [246, 62, 1.6], [276, 100, 1.2], [168, 104, 1.5], [228, 76, 1], [118, 100, 1.2], [292, 64, 1.3],
];

// Catmull-Rom through the points, written as cubic Béziers.
function smooth(pts: [number, number][]) {
  let d = `M${f2(pts[0][0])} ${f2(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f2(p1[0] + (p2[0] - p0[0]) / 6)} ${f2(p1[1] + (p2[1] - p0[1]) / 6)} ${f2(p2[0] - (p3[0] - p1[0]) / 6)} ${f2(p2[1] - (p3[1] - p1[1]) / 6)} ${f2(p2[0])} ${f2(p2[1])}`;
  }
  return d;
}

// Packed ceramic grains: a jittered hex packing of slightly tilted ellipses, so small voids show
// between them evenly all through the wall. Three tones, one path each. The tilts come from a
// fixed table (no trig at run time), so every JS engine draws exactly the same grains.
const CU_TILT: [number, number, number][] = [[-15, 0.9659, -0.2588], [-8, 0.9903, -0.1392], [0, 1, 0], [8, 0.9903, 0.1392], [15, 0.9659, 0.2588]];
const CU_GRAINS = (() => {
  const r = mulberry32(77);
  const tones = ['', '', ''];
  const f1 = (n: number) => Math.round(n * 10) / 10;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 38; col++) {
      const cx = -8 + col * 11 + (row % 2) * 5.5 + (r() - 0.5) * 2.2;
      const cy = CU_TOP + 2.5 + row * 7.2 + (r() - 0.5) * 1.6;
      const rx = 4.5 + r() * 1.2;
      const ry = 3.1 + r() * 0.8;
      const [deg, c, s] = CU_TILT[(r() * 5) | 0];
      const tone = (r() * 3) | 0;
      const x1 = f1(cx - rx * c), y1 = f1(cy - rx * s), x2 = f1(cx + rx * c), y2 = f1(cy + rx * s);
      const a = `A${f1(rx)} ${f1(ry)} ${deg} 1 0`;
      tones[tone] += `M${x1} ${y1}${a} ${x2} ${y2}${a} ${x1} ${y1}Z`;
    }
  }
  return tones;
})();
const CU_GRAIN_FILL = ['#CFC2A4', '#C2B494', '#DCD1B8'];

// Ash grains sitting on the wall face, clear of the arrow columns. Shown in proportion to wallAsh.
const CU_ASH = (() => {
  const r = mulberry32(43);
  const out: { x: number; r: number }[] = [];
  for (let n = 0; n < 200 && out.length < 14; n++) {
    const x = 8 + r() * 384;
    const rr = 1.7 + r() * 0.8;
    if (CU_ARROWS.some((p) => Math.abs(p - x) < 6) || out.some((o) => Math.abs(o.x - x) < 10)) continue;
    out.push({ x: f2(x), r: f2(rr) });
  }
  return out;
})();
const CU_BUMPS = (() => {
  const r = mulberry32(31);
  return Array.from({ length: 52 }, () => r() - 0.5);
})();
const cuCake = (T: number) => {
  const a = Math.min(1, T / 8) * 2;
  const pts: [number, number][] = CU_BUMPS.map((b, i) => [-2 + i * 8, f2(CU_TOP - T + b * a)]);
  const top = smooth(pts);
  return { body: `${top}L406 ${CU_TOP}L-2 ${CU_TOP}Z`, edge: top };
};

/* ----------------------------------------------------------------------- copy */

type MsgId =
  | 'start' | 'drive' | 'drivePassive' | 'driveHigh' | 'driveOver' | 'regenRun' | 'regenDone' | 'regenEmpty'
  | 'refused' | 'addDose' | 'addBurn' | 'addDone' | 'addRefused' | 'addEmpty'
  | 'cyclesRun' | 'cyclesDone' | 'cyclesBlocked' | 's1a' | 's1b' | 's2' | 's3' | 's4' | 's5a' | 's5' | 'cleaned' | 'close';

const MSG: Record<MsgId, string> = {
  start: "A filter with a few years' work: some soot, some ash. Tap Regen and watch what is left.",
  drive: 'Soot, which is carbon, is caught on the inlet side of the walls, with a little engine oil ash.',
  drivePassive: 'On catalysed systems some soot can burn off on the move, from about 250 to 300°C with NO2.',
  driveHigh: 'The soot load is high and the DPF light is on. A regen should burn it off before it gets worse.',
  driveOver: 'Too much soot now. Past this point the ECU will normally not allow a regeneration.',
  regenRun: 'Active regeneration: the filter is taken to around 600°C and the soot burns off as gas.',
  regenDone: 'Soot gone, ash left. Ash is already burnt, so it stays and packs towards the plugged end.',
  regenEmpty: 'Hardly any soot to burn, and a regeneration will not touch the ash.',
  refused: 'The ECU will normally refuse: burning this much soot at once can overheat and crack the filter.',
  addDose: 'Some additives can help soot burn at a lower temperature. A regen still needs a proper drive.',
  addBurn: 'The regen still does the burning. With the additive, the soot can burn off at a lower temperature.',
  addDone: 'Soot gone, ash still there. Additives do nothing for ash, and metal-based ones leave a little.',
  addRefused: 'An additive still needs a regen to finish, and the ECU will normally refuse one at this load.',
  addEmpty: 'Hardly any soot for it to work on, and additives do nothing for ash.',
  cyclesRun: 'Six drive-and-regen cycles. Watch the ash at the plugged end.',
  cyclesDone: 'Soot came and went. Ash only built up, which is how a DPF blocks even when every regen finishes.',
  cyclesBlocked: 'Six cycles needs a filter the ECU will regenerate. Reset it, or try the off-vehicle clean.',
  s1a: 'Step 1 of 5. Off the vehicle, and checked for cracks or melting before anything else.',
  s1b: 'Step 1 of 5. Checked for cracks or melting, then air flow tested: {band} band.',
  s2: 'Step 2 of 5. Fitted the opposite way round on the METclean XL, so water goes in at the outlet.',
  s3: 'Step 3 of 5. Reverse flush, heated water only. Short bursts break up the ash and wash it out.',
  s4: 'Step 4 of 5. Dried right through with hot air at up to 100°C.',
  s5a: 'Step 5 of 5. Turned back round and air flow tested again, the same way as before.',
  s5: 'Step 5 of 5. Air flow tested again, so the drop in back-pressure is measured: now OK band.',
  cleaned: 'Soot and ash both out, which no regen or additive can do.',
  close: 'Close up: gas passes through the pores in the ceramic wall. The soot stays on the inlet side.',
};

type BadgeId =
  | 'vehicle' | 'drive' | 'heat' | 'ashstays' | 'refused' | 'dosed' | 'driveneeded' | 'coolburn' | 'cycle'
  | 'offveh' | 'inspect' | 'testbefore' | 'reversed' | 'prewash' | 'wash' | 'impact' | 'dry' | 'testafter'
  | 'refit' | 'close';
type Tone = 'orange' | 'blue' | 'amber' | 'white';
type IconT = typeof Car;

const BADGES: Record<BadgeId, [IconT, Tone, string]> = {
  vehicle: [Car, 'orange', 'ON THE VEHICLE'],
  drive: [Car, 'orange', 'DRIVING'],
  heat: [Flame, 'orange', 'AROUND 600°C'],
  ashstays: [Layers, 'orange', 'ASH STAYS'],
  refused: [ShieldAlert, 'amber', 'REGEN NOT ALLOWED'],
  dosed: [FlaskConical, 'orange', 'ADDITIVE DOSED'],
  driveneeded: [Car, 'orange', 'PROPER DRIVE NEEDED'],
  coolburn: [Flame, 'orange', 'CAN HELP THE BURN'],
  cycle: [Repeat, 'orange', 'CYCLE {n} OF 6'],
  offveh: [Wrench, 'orange', 'OFF THE VEHICLE'],
  inspect: [ScanSearch, 'white', 'CHECKING FOR CRACKS'],
  testbefore: [Gauge, 'white', 'FLOW TEST: BEFORE'],
  reversed: [ArrowLeftRight, 'blue', 'FITTED REVERSED'],
  prewash: [Droplets, 'blue', 'PRE-WASH'],
  wash: [Droplets, 'blue', 'WASH'],
  impact: [Waves, 'blue', 'IMPACT BURSTS, SPED UP'],
  dry: [Wind, 'orange', 'HOT AIR, UP TO 100°C'],
  testafter: [Gauge, 'white', 'FLOW TEST: AFTER'],
  refit: [CheckCircle2, 'orange', 'READY TO REFIT'],
  close: [Microscope, 'orange', 'ONE WALL, CLOSE UP'],
};

const STEPS = [
  {
    title: 'Off and inspected',
    body: 'Off the vehicle, the filter is checked for cracks or melting first. A cracked or melted filter cannot be fixed by any method. Then an air flow test records its back-pressure in mbar.',
  },
  {
    title: 'Fitted the opposite way round',
    body: 'On the METclean XL the filter is mounted reversed, so the water goes in at the outlet side.',
  },
  {
    title: 'Reverse flush, water only',
    body: 'No chemicals. Heated water at 1 to 2 bar, set to suit the filter, flows from the outlet back to the inlet. The automatic cycle runs a pre-wash and a wash, then high-pressure impact with a short micro-cavitation burst every 30 to 60 seconds. The bursts are water, not air.',
  },
  { title: 'Hot-air dry', body: 'Dried right through with hot air at up to 100°C.' },
  {
    title: 'Flow tested again',
    body: 'The same air flow test as before, so the drop in back-pressure is measured, not assumed. On the METclean XL, 5 to 15 mbar is OK, 15 to 30 medium and over 30 blocked.',
  },
];

type Mark = 'check' | 'x' | 'part';
const COMPARE: { label: string; icon: IconT; soot: [Mark, string]; ash: [Mark, string]; clean?: boolean }[] = [
  { label: 'Regeneration', icon: Flame, soot: ['check', 'Burns it off'], ash: ['x', 'Stays in'] },
  { label: 'Additive or spray', icon: FlaskConical, soot: ['part', 'Helps a regen burn it'], ash: ['x', 'Stays in. Metal-based ones add a little'] },
  { label: 'Off-vehicle clean, water only', icon: Droplets, soot: ['check', 'Washed out'], ash: ['check', 'Washed out'], clean: true },
];

const LEGEND: [string, string][] = [
  ['soot', 'Soot: carbon, it burns'],
  ['ash', 'Ash: from engine oil additives, it does not burn'],
  ['metal', 'Ash from metal-based additives'],
  ['ceramic', 'Porous ceramic wall (cordierite or silicon carbide)'],
  ['plug', 'Plug: neighbouring channels are closed at opposite ends'],
  ['face', 'End face: every other cell plugged, in a chequerboard'],
  ['hatch', 'Steel can, cut open'],
  ['water', 'Heated water: clean only'],
  ['air', 'Air: flow test and drying only'],
];
const FOOTNOTE =
  'Simplified illustration of an example filter: not to scale, animation sped up, and walls drawn light so the soot and ash show clearly. Ash is mainly calcium, zinc, magnesium and phosphorus compounds from engine oil additives. Levels are simulated; real filters are measured on the machine.';

/* ---------------------------------------------------------------------- model */

type Band = 'OK' | 'Medium' | 'Blocked';
type Mode = 'idle' | 'refused' | 'drive' | 'regen' | 'additive' | 'cycles' | 'clean' | 'reset';
type Recommend = 'none' | 'ash' | 'check' | 'cycles';
type TileId = 'drive' | 'regen' | 'additive' | 'clean' | 'cycles';

interface S {
  soot: number; ash: number; wallAsh: number; metalAsh: boolean;
  mode: Mode; step: number; cycle: number; badge: BadgeId; msg: MsgId;
  flowShown: boolean; flowBefore: Band | null; flowAfter: Band | null;
  sw: number; // the soot level the SOOT word, the lamp and the labels show: it changes when the bar and the picture get there
  testing: boolean; // a flow test is running: the readout says Testing until the result is in
  ashBefore: number | null; // ash level when the clean started, marked on the ASH meter
  recommend: Recommend; ringNonce: number; cleanDone: boolean; coach: boolean; drives: number;
  close: boolean; prevMsg: MsgId; prevBadge: BadgeId; userPaused: boolean; stepWait: boolean;
  t: number; // meter transition time, seconds
}

const INIT: S = {
  soot: 45, sw: 45, ash: 28, wallAsh: 0.5, metalAsh: false, mode: 'idle', step: 0, cycle: 0, badge: 'vehicle', msg: 'start',
  flowShown: false, flowBefore: null, flowAfter: null, testing: false, ashBefore: null, recommend: 'none', ringNonce: 0,
  cleanDone: false, coach: true, drives: 0, close: false, prevMsg: 'start', prevBadge: 'vehicle', userPaused: false,
  stepWait: false, t: 0.6,
};

// Values GSAP tweens; the canvas reads them too. lift follows the unit's y on the machine.
interface Vis { soot: number; ash: number; front: number; tint: number; lift: number }
const VIS0: Vis = { soot: 0.45, ash: 0.28, front: 72, tint: TINT_K * 0.45, lift: 0 };
// Average speed of the inlet-channel pressure front (x 88 to 376 in 0.55s, starting 0.08s in);
// burst bubbles and ash flakes start as it reaches them.
const FRONT_V = 524;
const frontDelay = (x: number) => 0.08 + Math.max(0, x - 88) / FRONT_V;

const BUSY: Mode[] = ['drive', 'regen', 'additive', 'cycles', 'clean', 'reset'];
const isBusy = (m: Mode) => BUSY.includes(m);
const sootWord = (v: number) => (v < 3 ? 'Clear' : v < 20 ? 'Low' : v < 60 ? 'Building' : v <= 90 ? 'High' : 'Too high');
// Under 5 only happens after a clean: the same words as the What removes what table.
const ashWord = (v: number) => (v < 5 ? 'Washed out' : v < 15 ? 'Little' : v < 40 ? 'Some' : v < 65 ? 'A lot' : 'Heavy');
const restriction = (soot: number, ash: number) => 0.5 * soot + ash;
const band = (r: number): Band => (r < 30 ? 'OK' : r < 60 ? 'Medium' : 'Blocked');
const lampOn = (soot: number, ash: number) => soot >= 60 || ash >= 65;

function descText(s: S) {
  if (s.close) {
    return 'Close-up of one porous ceramic wall. Exhaust gas passes through the pores and the soot stays on the inlet side.';
  }
  let d = `A steel DPF can cut open to show the ceramic honeycomb. Neighbouring channels are plugged at opposite ends, so exhaust has to pass through the porous walls. Soot: ${sootWord(s.sw)}. Ash: ${ashWord(s.ash)}.`;
  if (s.mode === 'clean' && s.step >= 1) {
    d += s.step === 2 ? ' The filter is fitted reversed on the cleaning machine.'
      : s.step === 3 ? ' The filter is fitted reversed on the cleaning machine, with water flowing from the outlet side back to the inlet.'
        : s.step === 4 ? ' The filter is being dried with hot air.'
          : s.step >= 6 ? ' The filter is off the cleaning machine and ready to refit.'
            : ' The filter is off the vehicle on the cleaning machine.';
  }
  return d;
}

const msgText = (s: S) => (s.msg === 's1b' ? MSG.s1b.replace('{band}', s.flowBefore ?? 'Medium') : MSG[s.msg]);

type Act =
  | { type: 'START'; p: Partial<S> }
  | { type: 'PATCH'; p: Partial<S> }
  | { type: 'END'; p: Partial<S> }
  | { type: 'REFUSE'; msg: MsgId }
  | { type: 'RESET' }
  | { type: 'MSG'; msg: MsgId }
  | { type: 'CLOSE' }
  | { type: 'PAUSE'; on: boolean }
  | { type: 'STEPWAIT'; on: boolean };

// A patch that sets soot without saying when the word should follow moves both at once.
const withSw = (p: Partial<S>): Partial<S> => (p.soot !== undefined && p.sw === undefined ? { ...p, sw: p.soot } : p);

function reducer(s: S, a: Act): S {
  switch (a.type) {
    case 'START':
      return {
        ...s, step: 0, cycle: 0, coach: false, recommend: 'none', cleanDone: false, flowShown: false,
        flowBefore: null, flowAfter: null, testing: false, ashBefore: null, close: false, userPaused: false,
        stepWait: false, ...withSw(a.p),
      };
    case 'PATCH':
      return { ...s, ...withSw(a.p) };
    case 'END':
      // Every END patch carries absolute values, so dispatching it twice is harmless.
      return { ...s, mode: 'idle', badge: 'vehicle', userPaused: false, stepWait: false, ...withSw(a.p) };
    case 'REFUSE':
      return {
        ...s, mode: 'refused', badge: 'refused', msg: a.msg, recommend: 'check', ringNonce: s.ringNonce + 1,
        coach: false, close: false, cleanDone: false, flowShown: false, testing: false, ashBefore: null,
      };
    case 'RESET':
      return { ...INIT, coach: false, drives: 0 };
    case 'MSG':
      return { ...s, msg: a.msg, coach: false, close: false, badge: s.close ? s.prevBadge : s.badge };
    case 'CLOSE':
      return s.close
        ? { ...s, close: false, msg: s.prevMsg, badge: s.prevBadge }
        : { ...s, close: true, prevMsg: s.msg, prevBadge: s.badge, msg: 'close', badge: 'close', coach: false };
    case 'PAUSE':
      return { ...s, userPaused: a.on };
    case 'STEPWAIT':
      return { ...s, stepWait: a.on };
    default:
      return s;
  }
}

/* ------------------------------------------------------------ particle engine */

type Kind =
  | 'exhaust' | 'dose' | 'soot' | 'ashgrain' | 'glint' | 'spark' | 'sparkCool' | 'wisp' | 'air' | 'airRev'
  | 'murk' | 'bubble' | 'flake' | 'steam';
// Gas and air streaks, faded out together at the end of a run so no end frame has leftovers.
const GAS: Kind[] = ['exhaust', 'dose', 'wisp', 'air', 'airRev'];

class Pt {
  k: Kind = 'exhaust';
  xs = new Float32Array(10);
  ys = new Float32Array(10);
  ms = new Float32Array(10); // speed multiplier of the segment that starts at each point
  n = 0; seg = 0; d = 0; sp = 0;
  hop = -1; // index of the segment that hops through a wall: travelled, never drawn
  x = 0; y = 0; vx = 0; vy = 0; hx = 1; hy = 0;
  age = 0; life = 0; r = 0; rot = 0; vr = 0; st = 0;
  ax = 0; ay = 0; bx = 0; by = 0;
  face = 0; dir = 1;
}

// Fixed pool, drawn in viewBox units. Created on the first action and only when motion is
// allowed. The loop runs only while particles are alive or a run is emitting, and the
// director stops it while paused, off screen or in a hidden tab. No allocation per frame.
class Particles {
  private cv: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private vis: Vis;
  private pool: Pt[] = [];
  private n = 0;
  private rnd = mulberry32(20261028);
  private raf = 0;
  private last = 0;
  private sc = 1;
  private ox = 0;
  private oy = 0;
  private paused = false;
  private fadeT = 0;
  private fadeD = 1;
  private fadeK: Kind[] = [];
  cap = 320;
  hold = false;
  mute = false;

  constructor(cv: HTMLCanvasElement, vis: Vis) {
    this.cv = cv;
    this.vis = vis;
    this.ctx = cv.getContext('2d');
    for (let i = 0; i < 320; i++) this.pool.push(new Pt());
  }

  resize(w: number, h: number) {
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cv.width = Math.round(w * dpr);
    this.cv.height = Math.round(h * dpr);
    // Match the SVG's default meet scaling, so the canvas draws in viewBox units.
    const s = Math.min(w / 400, h / 280);
    this.sc = s * dpr;
    this.ox = ((w - 400 * s) / 2) * dpr;
    this.oy = ((h - 280 * s) / 2) * dpr;
    this.cap = window.innerWidth < 640 ? 160 : 320;
    this.draw();
  }

  start() { this.paused = false; this.kick(); }

  stop() {
    this.paused = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  clear() {
    this.n = 0;
    this.fadeT = 0;
    const c = this.ctx;
    if (c) {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, this.cv.width, this.cv.height);
    }
  }

  burst(k: Kind, count: number) { for (let i = 0; i < count; i++) this.spawn(k, 0, true); }

  private drop(k: Kind) {
    for (let i = 0; i < this.n;) {
      const p = this.pool[i];
      if (p.k !== k) { i++; continue; }
      this.n--;
      this.pool[i] = this.pool[this.n];
      this.pool[this.n] = p;
    }
  }

  // Drops every live particle of one kind at once.
  cull(k: Kind) {
    this.drop(k);
    this.draw();
  }

  // Fades the live particles of these kinds out over dur seconds, then drops them.
  fade(kinds: Kind[], dur: number) {
    this.fadeK = kinds;
    this.fadeD = dur;
    this.fadeT = dur;
    this.kick();
  }

  private fa(k: Kind) { return this.fadeT > 0 && this.fadeK.includes(k) ? this.fadeT / this.fadeD : 1; }

  spawn(k: Kind, arg = 0, isBurst = false) {
    if (this.mute || !this.ctx) return;
    // Continuous emitters leave 40 slots free so the impact bursts always show.
    if (this.n >= (isBurst ? this.cap : this.cap - 40)) return;
    const v = this.vis;
    if (k === 'wisp' && v.front > 300) return;
    const r = this.rnd;
    const p = this.pool[this.n++];
    p.k = k; p.age = 0; p.st = 0; p.seg = 0; p.d = 0; p.rot = 0; p.vr = 0; p.vx = 0; p.vy = 0; p.hx = 1; p.hy = 0; p.hop = -1;
    switch (k) {
      case 'exhaust': this.exPath(p, true, false); p.sp = 150; break;
      case 'dose': this.exPath(p, true, false); p.sp = 140; break;
      case 'air': this.exPath(p, true, true); p.sp = arg || 300; break;
      case 'airRev': this.revPath(p); p.sp = arg || 240; break;
      case 'soot': this.exPath(p, false, false); p.sp = 150; p.r = 1 + r() * 0.6; break;
      case 'ashgrain': this.exPath(p, false, false); p.sp = 150; p.r = 0.7 + r() * 0.3; break;
      case 'glint': this.exPath(p, false, false); p.sp = 150; p.r = 0.8; p.rot = r() * TAU; break;
      case 'murk': this.muPath(p); p.sp = 140 + r() * 60; p.r = 0.8 + r() * 0.6; break;
      case 'wisp': {
        // Burnt soot leaves as gas: along the channel from the burn front, a hop through the
        // wall, then straight out along the outlet channel, the cone and the pipe.
        const ki = INLETS[(r() * 4) | 0];
        const j = ki === 0 ? 1 : ki === 6 ? 5 : r() < 0.5 ? ki - 1 : ki + 1;
        const yi = chMid(ki) + (r() - 0.5) * 2;
        const yo = chMid(j) + (r() - 0.5) * 2;
        const xw = Math.min(306, v.front + 10 + r() * 30);
        this.pt(p, 0, v.front, yi, 1); this.pt(p, 1, xw, yi, 3); this.pt(p, 2, xw, yo, 1);
        this.pt(p, 3, 336, yo, 2.4); this.pt(p, 4, 370, coneY(yo), 1.8); this.pt(p, 5, 404, coneY(yo), 1);
        p.n = 6; p.hop = 1; p.x = v.front; p.y = yi; p.sp = 120;
        break;
      }
      case 'spark':
      case 'sparkCool': {
        const [fy, dir] = SOOT_FACES[(r() * 6) | 0];
        const cool = k === 'sparkCool';
        p.x = v.front + r() * 6;
        p.y = fy + dir * r() * sootT(v.soot);
        p.vy = dir * (8 + r() * 18);
        p.vx = -6 + r() * 16;
        p.life = cool ? 0.35 + r() * 0.25 : 0.45 + r() * 0.35;
        p.r = cool ? 0.4 + r() * 0.5 : 0.5 + r() * 0.7;
        break;
      }
      case 'bubble': {
        // Cavitation where the deposits are: mostly at the ash, the rest along the soot faces.
        // A burst's bubbles pop as the pressure front reaches them.
        const ki = INLETS[(r() * 4) | 0];
        const len = Math.max(6, ASH_MAX * v.ash);
        p.x = r() < 0.6 ? 88 + r() * (len + 6) : 90 + r() * 230;
        p.y = chMid(ki) + (r() - 0.5) * 12;
        p.r = 1 + r() * 0.7;
        p.age = isBurst ? -frontDelay(p.x) - r() * 0.05 : -r() * 0.25;
        break;
      }
      case 'flake': {
        // Ash broken off the plug end and carried out of the inlet face, through the cone and
        // down the drain; a burst's flakes leave as the front passes them.
        const ki = INLETS[(r() * 4) | 0];
        const y = chMid(ki) + (r() - 0.5) * 8;
        const x0 = 88 + r() * Math.max(4, ASH_MAX * v.ash);
        this.pt(p, 0, x0, y, 1); this.pt(p, 1, 328, y, 1.5); this.pt(p, 2, 368, coneY(y), 1.5);
        this.pt(p, 3, 380, 178, 1.5); this.pt(p, 4, 380, 262, 1);
        p.n = 5; p.x = x0; p.y = y; p.sp = 160 + r() * 60;
        p.rot = r() * TAU; p.vr = (r() - 0.5) * 16; p.r = 1.2 + r() * 1.4;
        p.age = isBurst ? -frontDelay(x0) : 0;
        break;
      }
      case 'steam':
        // Soft wisps rising off the inlet face (on the right while the filter is reversed).
        p.x = 326 + r() * 10; p.y = 100 + r() * 120;
        p.life = 1.2 + r() * 0.5; p.vy = -(14 + r() * 12); p.vx = 3 + r() * 5; p.rot = r() * TAU;
        break;
    }
    this.kick();
  }

  private pt(p: Pt, i: number, x: number, y: number, m: number) { p.xs[i] = x; p.ys[i] = y; p.ms[i] = m; }

  // Exhaust and the flow-test air in the normal orientation, on straight runs only: level along
  // the pipe, a straight line through the cone, level along an inlet channel to xc, a hop through
  // the wall (not drawn), level along the neighbouring outlet channel, the cone, the pipe. On the
  // machine there are no pipes, so the air starts and ends at the cone mouths.
  private exPath(p: Pt, full: boolean, machine: boolean) {
    const r = this.rnd;
    const k = INLETS[(r() * 4) | 0];
    const j = k === 0 ? 1 : k === 6 ? 5 : r() < 0.5 ? k - 1 : k + 1;
    const yi = chMid(k) + (r() - 0.5) * 2;
    // Gas crosses (and soot settles) only in front of the ash, never over the packed ash.
    const xMax = Math.min(300, 304 - ASH_MAX * this.vis.ash);
    const xc = 100 + r() * Math.max(20, xMax - 100);
    let n = 0;
    // Cones run faster than the channels, so their straight fans stay sparse.
    if (!machine) this.pt(p, n++, -4, coneY(yi), 1.8);
    this.pt(p, n++, 30, coneY(yi), 2.4);
    this.pt(p, n++, 64, yi, 1);
    if (full) {
      const yo = chMid(j) + (r() - 0.5) * 2;
      p.hop = n;
      this.pt(p, n++, xc, yi, 3);
      this.pt(p, n++, xc, yo, 1);
      this.pt(p, n++, 336, yo, 2.4);
      this.pt(p, n++, 370, coneY(yo), 1.8);
      if (!machine) this.pt(p, n++, 404, coneY(yo), 1);
    } else {
      this.pt(p, n++, xc, yi, 1);
    }
    p.n = n;
    // The wall this particle meets: below its inlet channel when the outlet is k + 1.
    if (j > k) { p.face = chTop(k) + 18; p.dir = -1; } else { p.face = chTop(k); p.dir = 1; }
    p.x = p.xs[0]; p.y = p.ys[0];
  }

  // Hot air through the reversed filter, in screen space: in at the outlet face on the left, along
  // an outlet channel, a hop through the wall, out along an inlet channel and the inlet face.
  private revPath(p: Pt) {
    const r = this.rnd;
    const j = OUTLETS[(r() * 3) | 0];
    const k = r() < 0.5 ? j - 1 : j + 1;
    const yo = chMid(j) + (r() - 0.5) * 2;
    const yi = chMid(k) + (r() - 0.5) * 2;
    const xc = 100 + r() * 200;
    this.pt(p, 0, 30, coneY(yo), 2.4);
    this.pt(p, 1, 64, yo, 1);
    this.pt(p, 2, xc, yo, 3);
    this.pt(p, 3, xc, yi, 1);
    this.pt(p, 4, 336, yi, 2.4);
    this.pt(p, 5, 370, coneY(yi), 1);
    p.n = 6; p.hop = 2; p.x = p.xs[0]; p.y = p.ys[0];
  }

  // Loosened soot (reversed filter, screen space), lifted off a face and carried out of the inlet
  // face on the right, through the cone and the adaptor, and down the drain.
  private muPath(p: Pt) {
    const r = this.rnd;
    const [fy, dir] = SOOT_FACES[(r() * 6) | 0];
    const ym = fy + dir * 9 + (r() - 0.5) * 4;
    const x0 = 92 + r() * 220;
    this.pt(p, 0, x0, fy + dir * 1.5, 1);
    this.pt(p, 1, x0 + 8, ym, 1);
    this.pt(p, 2, 328, ym, 1.6);
    this.pt(p, 3, 368, coneY(ym), 1.6);
    this.pt(p, 4, 380, 178, 1.6);
    this.pt(p, 5, 380, 262, 1);
    p.n = 6; p.x = p.xs[0]; p.y = p.ys[0];
  }

  private kick() {
    if (!this.raf && !this.paused && (this.n > 0 || this.hold)) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 1 / 60;
    this.last = now;
    for (let i = 0; i < this.n;) {
      const p = this.pool[i];
      if (this.step(p, dt)) i++;
      else {
        this.n--;
        this.pool[i] = this.pool[this.n];
        this.pool[this.n] = p;
      }
    }
    if (this.fadeT > 0) {
      this.fadeT -= dt;
      if (this.fadeT <= 0) {
        this.fadeT = 0;
        for (const k of this.fadeK) this.drop(k);
      }
    }
    this.draw();
    if (!this.paused && (this.n > 0 || this.hold)) this.raf = requestAnimationFrame(this.frame);
  };

  private follow(p: Pt, dt: number) {
    let move = p.sp * dt;
    while (p.seg < p.n - 1) {
      const x0 = p.xs[p.seg], y0 = p.ys[p.seg];
      const dx = p.xs[p.seg + 1] - x0, dy = p.ys[p.seg + 1] - y0;
      const len = Math.hypot(dx, dy) || 0.0001;
      const m = p.ms[p.seg];
      p.hx = dx / len; p.hy = dy / len;
      if (p.d + move * m < len) {
        p.d += move * m;
        p.x = x0 + p.hx * p.d; p.y = y0 + p.hy * p.d;
        return true;
      }
      move -= (len - p.d) / m;
      p.d = 0;
      p.seg++;
    }
    p.x = p.xs[p.n - 1]; p.y = p.ys[p.n - 1];
    return false;
  }

  private step(p: Pt, dt: number) {
    p.age += dt;
    switch (p.k) {
      case 'spark':
      case 'sparkCool':
      case 'steam':
        p.x += p.vx * dt; p.y += p.vy * dt;
        return p.age < p.life;
      case 'bubble':
        return p.age < 0.37;
      case 'flake':
        if (p.age < 0) return true;
        p.rot += p.vr * dt;
        return this.follow(p, dt);
      case 'soot':
      case 'ashgrain':
      case 'glint': {
        if (p.st === 0) {
          if (this.follow(p, dt)) return true;
          // Reached xc: settle onto the soot surface (ash grains settle inside the cake).
          p.st = 1; p.age = 0; p.ax = p.x; p.ay = p.y; p.bx = p.x + (this.rnd() - 0.5) * 4;
          p.by = p.k === 'ashgrain' ? p.face + p.dir * (0.8 + this.rnd() * 1.4) : p.face + p.dir * sootT(this.vis.soot);
          return true;
        }
        if (p.st === 1) {
          const t = Math.min(1, p.age / 0.15);
          p.x = p.ax + (p.bx - p.ax) * t; p.y = p.ay + (p.by - p.ay) * t;
          if (t >= 1) { p.st = 2; p.age = 0; }
          return true;
        }
        return p.age < 0.35; // stuck, fading into the layer the SVG draws
      }
      default:
        return this.follow(p, dt);
    }
  }

  // Short trailing streaks along the heading. Nothing is drawn on a wall hop, and on the first
  // segment the trail never reaches back past the path's start (the cone mouth on the machine).
  private lines(c: CanvasRenderingContext2D, k: Kind, len: number, col: string, w: number) {
    let any = false;
    for (let i = 0; i < this.n; i++) {
      const p = this.pool[i];
      if (p.k !== k || p.seg === p.hop) continue;
      const l = p.seg === 0 ? Math.min(len, p.d) : len;
      if (l < 0.5) continue;
      if (!any) { c.beginPath(); any = true; }
      c.moveTo(p.x - p.hx * l, p.y - p.hy * l);
      c.lineTo(p.x, p.y);
    }
    if (any) {
      c.globalAlpha = this.fa(k);
      c.strokeStyle = col; c.lineWidth = w; c.stroke();
      c.globalAlpha = 1;
    }
  }

  private draw() {
    const c = this.ctx;
    if (!c) return;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.cv.width, this.cv.height);
    if (!this.n) return;
    c.setTransform(this.sc, 0, 0, this.sc, this.ox, this.oy + this.vis.lift * this.sc);
    c.lineCap = 'round';
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
    const pool = this.pool, n = this.n;

    // White is only ever air: the flow tests and the hot-air dry.
    this.lines(c, 'air', 7, 'rgba(255,255,255,.62)', 1);
    this.lines(c, 'airRev', 7, 'rgba(255,255,255,.62)', 1);
    this.lines(c, 'exhaust', 6, 'rgba(255,170,90,.5)', 1.2);
    this.lines(c, 'dose', 6, 'rgba(255,196,64,.7)', 1.3);
    this.lines(c, 'wisp', 8, 'rgba(190,195,200,.3)', 1.6);

    // Murk: one path.
    let any = false;
    for (let i = 0; i < n; i++) {
      const p = pool[i];
      if (p.k !== 'murk') continue;
      if (!any) { c.beginPath(); any = true; }
      c.moveTo(p.x + p.r, p.y); c.arc(p.x, p.y, p.r, 0, TAU);
    }
    if (any) { c.fillStyle = '#2C3540'; c.fill(); }

    // Ash flakes tumbling out: rotated squares in one path.
    any = false;
    for (let i = 0; i < n; i++) {
      const p = pool[i];
      if (p.k !== 'flake' || p.age < 0) continue;
      if (!any) { c.beginPath(); any = true; }
      const h = p.r * 0.5, ca = Math.cos(p.rot) * h, sa = Math.sin(p.rot) * h;
      c.moveTo(p.x + ca - sa, p.y + sa + ca);
      c.lineTo(p.x - ca - sa, p.y - sa + ca);
      c.lineTo(p.x - ca + sa, p.y - sa - ca);
      c.lineTo(p.x + ca + sa, p.y + sa - ca);
      c.closePath();
    }
    if (any) { c.fillStyle = '#E4DFD3'; c.fill(); c.strokeStyle = '#B5AC98'; c.lineWidth = 0.3; c.stroke(); }

    // Soot specks, ash grains and additive glints settle and fade into the SVG layers.
    c.lineWidth = 0.35;
    for (let i = 0; i < n; i++) {
      const p = pool[i];
      if (p.k !== 'soot' && p.k !== 'ashgrain' && p.k !== 'glint') continue;
      c.globalAlpha = p.st === 2 ? Math.max(0, 1 - p.age / 0.35) : 1;
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU);
      if (p.k === 'soot') {
        c.fillStyle = '#141414'; c.fill(); c.strokeStyle = 'rgba(255,154,51,.6)'; c.stroke();
      } else if (p.k === 'ashgrain') {
        c.fillStyle = '#EAE5D8'; c.fill();
      } else {
        c.fillStyle = '#F2C76A'; c.fill();
        const L = 1.6, ca = Math.cos(p.rot) * L, sa = Math.sin(p.rot) * L;
        c.beginPath();
        c.moveTo(p.x - ca, p.y - sa); c.lineTo(p.x + ca, p.y + sa);
        c.moveTo(p.x + sa, p.y - ca); c.lineTo(p.x - sa, p.y + ca);
        c.strokeStyle = '#F2C76A'; c.stroke();
      }
    }
    c.globalAlpha = 1;

    // Cavitation bubbles (water blue, so the only white is air): grow, collapse, then a small
    // ring as each one implodes.
    for (let i = 0; i < n; i++) {
      const p = pool[i];
      if (p.k !== 'bubble' || p.age < 0) continue;
      if (p.age < 0.25) {
        const rr = p.age < 0.18 ? (p.r * p.age) / 0.18 : p.r * (1 - (p.age - 0.18) / 0.07);
        if (rr <= 0.05) continue;
        c.beginPath(); c.arc(p.x, p.y, rr, 0, TAU);
        c.fillStyle = 'rgba(124,203,255,.16)'; c.fill();
        c.strokeStyle = '#7CCBFF'; c.lineWidth = 0.4; c.stroke();
      } else {
        const t = Math.min(1, (p.age - 0.25) / 0.12);
        c.globalAlpha = 0.8 * (1 - t);
        c.beginPath(); c.arc(p.x, p.y, 0.5 + 2 * t, 0, TAU);
        c.strokeStyle = '#8FDBFF'; c.lineWidth = 0.35; c.stroke();
        c.globalAlpha = 1;
      }
    }

    // Steam wisps rising off the inlet face while drying: soft S-shaped strands that lengthen
    // as they rise and fade in and out.
    c.strokeStyle = '#E8EEF4';
    c.lineWidth = 1.6;
    const sf = this.fa('steam');
    for (let i = 0; i < n; i++) {
      const p = pool[i];
      if (p.k !== 'steam') continue;
      const t = p.age / p.life;
      const L = 7 + 10 * t;
      const b = 2.6 * Math.sin(p.rot + 5 * t);
      c.globalAlpha = 0.26 * Math.sin(Math.PI * Math.min(1, t)) * sf;
      c.beginPath();
      c.moveTo(p.x, p.y + L / 2);
      c.quadraticCurveTo(p.x + b, p.y + L / 4, p.x, p.y);
      c.quadraticCurveTo(p.x - b, p.y - L / 4, p.x + b * 0.3, p.y - L / 2);
      c.stroke();
    }
    c.globalAlpha = 1;

    // Sparks at the burn front, additive.
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const p = pool[i];
      if (p.k !== 'spark' && p.k !== 'sparkCool') continue;
      const t = p.age / p.life;
      const cool = p.k === 'sparkCool';
      // The additive burn is drawn cooler: amber sparks rather than orange-white ones.
      c.fillStyle = t < 0.3 ? (cool ? '#FFE3A0' : '#FFF1C9') : t < 0.6 ? (cool ? '#FFB020' : '#FFB347') : (cool ? '#A86A00' : '#FF7A00');
      c.globalAlpha = Math.max(0, 1 - t);
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill();
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
  }
}

// Timeline-driven emission, so Pause, Skip and off-screen behave. No-ops without an engine.
function emit(tl: gsap.core.Timeline, eng: Particles | null, kind: Kind, rate: number, dur: number, at: number, arg = 0) {
  if (!eng) return;
  const p = { t: 0 };
  let last = 0;
  let acc = 0;
  tl.to(p, {
    t: dur, duration: dur, ease: 'none',
    onUpdate: () => {
      const d = p.t - last;
      last = p.t;
      if (d <= 0 || d > 0.25) return;
      acc += rate * d;
      while (acc >= 1) { acc -= 1; eng.spawn(kind, arg); }
    },
  }, at);
}
function burstAt(tl: gsap.core.Timeline, eng: Particles | null, kind: Kind, count: number, at: number) {
  if (eng) tl.call(() => eng.burst(kind, count), [], at);
}

/* ------------------------------------------------------------------- drawing */

const STEEL_STOPS = (
  <>
    <stop offset="0" stopColor="#5D6670" />
    <stop offset=".3" stopColor="#E1E7EE" />
    <stop offset=".55" stopColor="#6B7480" />
    <stop offset="1" stopColor="#2F353D" />
  </>
);
const BORE_STOPS = (
  <>
    <stop offset="0" stopColor="#0B0D10" />
    <stop offset=".5" stopColor="#22262C" />
    <stop offset="1" stopColor="#0B0D10" />
  </>
);

function Defs() {
  return (
    <defs>
      <radialGradient id="dpfx-stage" gradientUnits="userSpaceOnUse" cx="200" cy="140" r="260">
        <stop offset="0" stopColor="#1A1D22" />
        <stop offset="1" stopColor="#0C0E11" />
      </radialGradient>
      <pattern id="dpfx-grid" width="12.5" height="12.5" patternUnits="userSpaceOnUse">
        <path d="M12.5 0H0V12.5" fill="none" stroke="#FFF" strokeOpacity=".035" strokeWidth=".5" />
      </pattern>
      <radialGradient id="dpfx-floor">
        <stop offset="0" stopColor="#000" stopOpacity=".5" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <pattern id="dpfx-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="4" height="4" fill="#2A2F36" />
        <rect width=".8" height="4" fill="#8A94A1" />
      </pattern>
      <linearGradient id="dpfx-bore" gradientUnits="userSpaceOnUse" x1="0" y1="58" x2="0" y2="246">{BORE_STOPS}</linearGradient>
      <linearGradient id="dpfx-bore-pipe" gradientUnits="userSpaceOnUse" x1="0" y1="132" x2="0" y2="172">{BORE_STOPS}</linearGradient>
      <linearGradient id="dpfx-steel" x1="0" y1="0" x2="0" y2="1">{STEEL_STOPS}</linearGradient>
      <linearGradient id="dpfx-steel-h" x1="0" y1="0" x2="1" y2="0">{STEEL_STOPS}</linearGradient>
      <pattern id="dpfx-fibre" width="10" height="4" patternUnits="userSpaceOnUse">
        <rect width="10" height="4" fill="#6F6A60" />
        <path d="M0 1.2q2.5-1 5 0t5 0M0 3q2.5-1 5 0t5 0" fill="none" stroke="#8B857A" strokeWidth=".4" />
      </pattern>
      <pattern id="dpfx-ceramic" width="6" height="5" patternUnits="userSpaceOnUse">
        <rect width="6" height="5" fill="#D2C5A6" />
        <circle cx="1.5" cy="1.4" r=".55" fill="#A39678" />
        <circle cx="4.4" cy="3.6" r=".5" fill="#9C8F72" />
      </pattern>
      <linearGradient id="dpfx-back" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#574F41" />
        <stop offset=".35" stopColor="#6A6150" />
        <stop offset=".6" stopColor="#6F6655" />
        <stop offset="1" stopColor="#554D40" />
      </linearGradient>
      {/* outlet channels: a cooler, lighter neutral than the warm inlet channels */}
      <linearGradient id="dpfx-back-o" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#625E57" />
        <stop offset=".35" stopColor="#77746C" />
        <stop offset=".6" stopColor="#7B786F" />
        <stop offset="1" stopColor="#5F5C55" />
      </linearGradient>
      <pattern id="dpfx-plug" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="3" height="3" fill="#D6CAAE" />
        <rect width=".7" height="3" fill="#B5A88B" />
      </pattern>
      <pattern id="dpfx-soot" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#0D0D0E" />
        <circle cx="1" cy="1.2" r=".55" fill="#232325" />
        <circle cx="3" cy="3" r=".45" fill="#2E2E31" />
      </pattern>
      <pattern id="dpfx-dosed" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="2" r=".5" fill="#E0AE4A" />
        <circle cx="4" cy="4.2" r=".4" fill="#F2C76A" />
      </pattern>
      <pattern id="dpfx-lock" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="1.2" height="4" fill="#FFB020" />
      </pattern>
      <pattern id="dpfx-ash" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#E4DFD3" />
        <circle cx="1.4" cy="1.6" r=".8" fill="#C9C1AF" />
        <circle cx="4.3" cy="4.1" r=".55" fill="#B5AC98" />
        <circle cx="4.6" cy="1.2" r=".45" fill="#F4F0E6" />
      </pattern>
      {/* ash from metal-based additives: a clearly darker grey than the engine-oil ash */}
      <pattern id="dpfx-metal" width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill="#45433F" />
        <circle cx="1" cy="1" r=".45" fill="#9AA0A8" />
        <circle cx="2.3" cy="2.2" r=".4" fill="#2E2D2A" />
      </pattern>
      <linearGradient id="dpfx-ember" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFF3D6" />
        <stop offset=".2" stopColor="#FFD08A" />
        <stop offset=".55" stopColor="#FF7A00" />
        <stop offset=".85" stopColor="#C2410C" />
        <stop offset="1" stopColor="#C2410C" stopOpacity="0" />
      </linearGradient>
      {/* the additive burn front: amber, visibly cooler than the regen's orange-white */}
      <linearGradient id="dpfx-ember-cool" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFE6A8" />
        <stop offset=".35" stopColor="#FFB020" />
        <stop offset=".8" stopColor="#A86A00" />
        <stop offset="1" stopColor="#A86A00" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="dpfx-heat" r=".6">
        <stop offset="0" stopColor="#FF7A00" stopOpacity=".38" />
        <stop offset="1" stopColor="#FF7A00" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="dpfx-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2E9BE0" />
        <stop offset=".5" stopColor="#5CC8FF" />
        <stop offset="1" stopColor="#2E9BE0" />
      </linearGradient>
      {/* reverse flush: water in the channels, its moving streaks and the pressure fronts */}
      <linearGradient id="dpfx-wfill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2F8FD0" stopOpacity=".66" />
        <stop offset=".5" stopColor="#6CCBFF" stopOpacity=".52" />
        <stop offset="1" stopColor="#2F8FD0" stopOpacity=".66" />
      </linearGradient>
      <pattern id="dpfx-streak" width="60" height="23" y="74" patternUnits="userSpaceOnUse">
        <path d="M4 4.5H17M34 9H50M20 13.5H31M47 4.5H55" stroke="#A8E4FF" strokeOpacity=".6" strokeWidth=".9" strokeLinecap="round" />
      </pattern>
      {/* impact burst wavefront: water blues only, no white (white is air) */}
      <linearGradient id="dpfx-front" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2E9BE0" stopOpacity="0" />
        <stop offset=".6" stopColor="#5CC8FF" stopOpacity=".5" />
        <stop offset=".9" stopColor="#8FDBFF" stopOpacity=".9" />
        <stop offset="1" stopColor="#A8E4FF" />
      </linearGradient>
      {/* hot-air dry: a warm fill behind a brighter front that sweeps from the outlet face */}
      <linearGradient id="dpfx-warmg" gradientUnits="userSpaceOnUse" x1="64" y1="0" x2="336" y2="0">
        <stop offset="0" stopColor="#FFB347" stopOpacity=".3" />
        <stop offset="1" stopColor="#FF9A33" stopOpacity=".16" />
      </linearGradient>
      <linearGradient id="dpfx-warmf" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFC46B" stopOpacity="0" />
        <stop offset="1" stopColor="#FFC46B" stopOpacity=".6" />
      </linearGradient>
      <radialGradient id="dpfx-chamber" gradientUnits="userSpaceOnUse" cx="200" cy="130" r="280">
        <stop offset="0" stopColor="#10283A" />
        <stop offset="1" stopColor="#050B12" />
      </radialGradient>
      <pattern id="dpfx-caustic" width="80" height="40" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="#5CC8FF" strokeWidth=".6" strokeOpacity=".07">
          <path d="M0 8Q10 4 20 8T40 8T60 8T80 8" />
          <path d="M0 21Q10 25 20 21T40 21T60 21T80 21" />
          <path d="M0 33Q13.3 29 26.7 33T53.3 33T80 33" />
        </g>
      </pattern>
      <linearGradient id="dpfx-scan" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFF" stopOpacity="0" />
        <stop offset=".5" stopColor="#FFF" stopOpacity=".42" />
        <stop offset="1" stopColor="#FFF" stopOpacity="0" />
      </linearGradient>
      <clipPath id="dpfx-burn" clipPathUnits="userSpaceOnUse">
        <rect className="dpfx-burnrect" x="72" y="-12" width="348" height="24" />
      </clipPath>
      <clipPath id="dpfx-ashclip" clipPathUnits="userSpaceOnUse">
        <rect x="170" y="70" width="142" height="164" />
      </clipPath>
    </defs>
  );
}

// The whole static drawing at the INIT state. Memoised with no props: React renders it
// once and GSAP owns every animated attribute from then on.
const DrawingBody = memo(function DrawingBody() {
  return (
    <>
      <Defs />
      {/* 1. stage */}
      <rect width="400" height="280" fill="url(#dpfx-stage)" />
      <rect width="400" height="280" fill="url(#dpfx-grid)" />
      <ellipse className="dpfx-floor" cx="200" cy="256" rx="150" ry="6" fill="url(#dpfx-floor)" />

      {/* 2. cleaning machine chamber */}
      <g className="dpfx-chamber" opacity="0">
        <rect width="400" height="280" fill="url(#dpfx-chamber)" />
        <rect width="400" height="280" fill="url(#dpfx-caustic)" />
        <rect x="2" y="2" width="396" height="276" rx="14" fill="none" stroke="url(#dpfx-steel-h)" strokeWidth="3" />
        <rect x="4.5" y="4.5" width="391" height="271" rx="12" fill="none" stroke="#000" strokeOpacity=".5" strokeWidth=".8" />
        <rect x="352" y="262" width="46" height="8" fill="#20252B" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={f2(354.5 + 8.4 * i)} y="264.5" width="6" height="3" fill="#0A0C0F" />
        ))}
      </g>

      {/* 3, 4. exhaust pipes */}
      <g className="dpfx-pipe-in">
        <rect x="0" y="128" width="30" height="4" fill="url(#dpfx-hatch)" />
        <rect x="0" y="172" width="30" height="4" fill="url(#dpfx-hatch)" />
        <rect x="0" y="132" width="30" height="40" fill="url(#dpfx-bore-pipe)" />
        <path d="M0 128.5H30" stroke="#D7DEE6" strokeOpacity=".7" strokeWidth=".9" />
      </g>
      <g className="dpfx-pipe-out">
        <rect x="370" y="128" width="30" height="4" fill="url(#dpfx-hatch)" />
        <rect x="370" y="172" width="30" height="4" fill="url(#dpfx-hatch)" />
        <rect x="370" y="132" width="30" height="40" fill="url(#dpfx-bore-pipe)" />
        <path d="M370 128.5H400" stroke="#D7DEE6" strokeOpacity=".7" strokeWidth=".9" />
        <rect x="370" y="114" width="6" height="76" rx="1" fill="url(#dpfx-steel)" />
      </g>

      {/* 5. the filter unit: flips about 200 152 for the reverse flush */}
      <g className="dpfx-unit">
        {/* a. cones */}
        <polygon points="30,133 64,64 64,240 30,171" fill="url(#dpfx-bore)" />
        <polygon points="370,133 336,64 336,240 370,171" fill="url(#dpfx-bore)" />
        <polygon points="30,128 64,58 64,64 30,133" fill="url(#dpfx-hatch)" />
        <polygon points="30,176 64,246 64,240 30,171" fill="url(#dpfx-hatch)" />
        <polygon points="370,128 336,58 336,64 370,133" fill="url(#dpfx-hatch)" />
        <polygon points="370,176 336,246 336,240 370,171" fill="url(#dpfx-hatch)" />
        <path d="M30 128L64 58M370 128L336 58" stroke="#D7DEE6" strokeOpacity=".6" strokeWidth=".8" />
        <path d="M30 176L64 246M370 176L336 246" stroke="#FF9A33" strokeOpacity=".22" strokeWidth=".8" />
        <rect x="28" y="124" width="4" height="56" fill="url(#dpfx-steel)" />
        <rect x="364" y="114" width="6" height="76" rx="1" fill="url(#dpfx-steel)" />
        {/* b. pressure sensor stubs */}
        <rect x="43" y="89" width="8" height="4" rx="1" fill="url(#dpfx-steel)" />
        <rect x="349" y="89" width="8" height="4" rx="1" fill="url(#dpfx-steel)" />
        <path d="M47 89V78Q47 74 51 74H57M353 89V78Q353 74 349 74H343" fill="none" stroke="#8A94A1" strokeWidth="2.2" strokeLinecap="round" />
        {/* d. shell, cut open */}
        <rect x="64" y="58" width="272" height="8" fill="url(#dpfx-hatch)" />
        <rect x="64" y="238" width="272" height="8" fill="url(#dpfx-hatch)" />
        <path d="M64 58.5H336" stroke="#D7DEE6" strokeOpacity=".7" strokeWidth=".9" />
        <path d="M64 66H336M64 238H336" stroke="#C9D0D8" strokeOpacity=".5" strokeWidth=".6" />
        <path d="M64 245.5H336" stroke="#FF9A33" strokeOpacity=".22" strokeWidth=".8" />
        {/* c. weld beads, drawn over the seam */}
        <path d="M64 58V66M336 58V66M64 238V246M336 238V246" stroke="#AEB7C2" strokeOpacity=".7" strokeWidth="1.4" strokeDasharray="1.2 1.4" />
        {/* e. support mat and cavities */}
        <rect x="72" y="66" width="256" height="4" fill="url(#dpfx-fibre)" />
        <rect x="72" y="234" width="256" height="4" fill="url(#dpfx-fibre)" />
        <rect x="64" y="66" width="8" height="172" fill="url(#dpfx-bore)" />
        <rect x="328" y="66" width="8" height="172" fill="url(#dpfx-bore)" />
        {/* f. skins, channel back faces, soot tint on the inlet channels */}
        <rect x="72" y="70" width="256" height="4" fill="#A99D85" />
        <rect x="72" y="230" width="256" height="4" fill="#A99D85" />
        {CHANNELS.map((k) => (
          <rect key={k} x="72" y={chTop(k)} width="256" height="18" fill={k % 2 ? 'url(#dpfx-back-o)' : 'url(#dpfx-back)'} />
        ))}
        {INLETS.map((k) => (
          <rect key={k} className="dpfx-tint" x="72" y={chTop(k)} width="240" height="18" fill="#000" opacity={VIS0.tint.toFixed(4)} />
        ))}
        {/* additive arriving with the exhaust: an amber tint that runs down the inlet channels */}
        <g className="dpfx-dose" opacity="0">
          <defs>
            <clipPath id="dpfx-dclip" clipPathUnits="userSpaceOnUse">
              <rect className="dpfx-dosec" x="72" y="70" width="0" height="164" />
            </clipPath>
          </defs>
          <g clipPath="url(#dpfx-dclip)" fill="#FFB020" fillOpacity=".24">
            {INLETS.map((k) => <rect key={k} x="72" y={chTop(k)} width="240" height="18" />)}
          </g>
        </g>
        {/* g. soot layers, scaled from the face; the burn front clips them */}
        {SOOT_FACES.map(([fy, dir], i) => (
          <g key={fy} transform={`translate(0 ${fy})`}>
            <g className="dpfx-soot-s" transform={`scale(1 ${SOOT_S0})`}>
              <g clipPath="url(#dpfx-burn)">
                <path d={SOOT_PATHS[i]} fill="url(#dpfx-soot)" stroke="#3A3A3D" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
                <path className="dpfx-dosed" d={SOOT_PATHS[i]} fill="url(#dpfx-dosed)" opacity="0" />
                <path className="dpfx-lock" d={SOOT_PATHS[i]} fill="url(#dpfx-lock)" opacity="0" />
                <rect className="dpfx-ember" x="72" y={dir > 0 ? 0 : -6.6} width="14" height="6.6" fill="url(#dpfx-ember)" opacity="0" />
              </g>
            </g>
          </g>
        ))}
        {/* h. ash grains caught in the soot */}
        <g className="dpfx-speckle" opacity="0.5" fill="#EAE5D8">
          {SPECKS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} />)}
        </g>
        {/* i. porous walls */}
        {WALLS_Y.map((y) => (
          <g key={y}>
            <rect x="72" y={y} width="256" height="5" fill="url(#dpfx-ceramic)" />
            <path d={`M72 ${y + 0.25}H328`} stroke="#EFE6D2" strokeOpacity=".6" strokeWidth=".5" />
            <path d={`M72 ${y + 4.75}H328`} stroke="#8C8068" strokeOpacity=".6" strokeWidth=".5" />
          </g>
        ))}
        <path d="M72 70V234M328 70V234" stroke="#EDE5D2" strokeOpacity=".45" strokeWidth=".8" />
        {/* j. ash, packed towards the plugged end */}
        <g clipPath="url(#dpfx-ashclip)">
          {INLETS.map((k) => (
            <g key={k} transform={`translate(182 ${chTop(k)})`}>
              <g className="dpfx-ash-x" transform="translate(93.6 0)">
                <path d={ASH_BODY} fill="url(#dpfx-ash)" />
                <path d={ASH_EDGE} fill="none" stroke="#A79F8C" strokeWidth=".7" />
                <g className="dpfx-metal" opacity="0">
                  <path d={METAL} fill="url(#dpfx-metal)" />
                  <path d={METAL_EDGE} fill="none" stroke="#D5D9DF" strokeWidth=".7" />
                </g>
              </g>
            </g>
          ))}
        </g>
        {/* k. plugs: inlet channels closed at the rear, outlet channels at the front */}
        {INLETS.map((k) => (
          <g key={k}>
            <rect x="312" y={chTop(k)} width="16" height="18" fill="url(#dpfx-plug)" />
            <path d={`M312 ${chTop(k)}V${chTop(k) + 18}`} stroke="#3A342B" strokeWidth="1" />
          </g>
        ))}
        {OUTLETS.map((k) => (
          <g key={k}>
            <rect x="72" y={chTop(k)} width="16" height="18" fill="url(#dpfx-plug)" />
            <path d={`M88 ${chTop(k)}V${chTop(k) + 18}`} stroke="#3A342B" strokeWidth="1" />
          </g>
        ))}
        {/* l. overlays */}
        <rect className="dpfx-heat" x="72" y="70" width="256" height="164" fill="url(#dpfx-heat)" opacity="0" />
        <g className="dpfx-shellheat" fill="#FF7A00" opacity="0">
          <rect x="64" y="58" width="272" height="8" />
          <rect x="64" y="238" width="272" height="8" />
        </g>
        {/* Reverse flush. The matrix undoes the unit's flip, so this group is drawn in screen
            space for the reversed filter: water comes in on the left at the outlet face, runs
            down the open outlet channels, crosses the walls into the inlet channels and leaves
            on the right at the inlet face. The fills flood in through two growing clips. */}
        <g className="dpfx-water" opacity="0" transform="matrix(-1 0 0 1 400 0)">
          <defs>
            <clipPath id="dpfx-wc-o" clipPathUnits="userSpaceOnUse">
              <rect className="dpfx-wc-o" x="28" y="60" width="290" height="184" />
            </clipPath>
            <clipPath id="dpfx-wc-i" clipPathUnits="userSpaceOnUse">
              <rect className="dpfx-wc-i" x="86" y="60" width="290" height="184" />
            </clipPath>
            <clipPath id="dpfx-wc-cho" clipPathUnits="userSpaceOnUse">
              {OUTLETS.map((k) => <rect key={k} x="72" y={chTop(k)} width="240" height="18" />)}
            </clipPath>
            <clipPath id="dpfx-wc-chi" clipPathUnits="userSpaceOnUse">
              {INLETS.map((k) => <rect key={k} x="88" y={chTop(k)} width="240" height="18" />)}
            </clipPath>
            <clipPath id="dpfx-wc-fo" clipPathUnits="userSpaceOnUse">
              <polygon points="30,133 64,64 72,66 72,238 64,240 30,171" />
              {OUTLETS.map((k) => <rect key={k} x="72" y={chTop(k)} width="240" height="18" />)}
            </clipPath>
            <clipPath id="dpfx-wc-fi" clipPathUnits="userSpaceOnUse">
              {INLETS.map((k) => <rect key={k} x="88" y={chTop(k)} width="240" height="18" />)}
              <polygon points="328,66 336,64 370,133 370,171 336,240 328,238" />
            </clipPath>
            <clipPath id="dpfx-wc-core" clipPathUnits="userSpaceOnUse">
              <rect x="72" y="70" width="256" height="164" />
            </clipPath>
          </defs>
          {/* streaks march through the water, and only where the water has reached */}
          <g clipPath="url(#dpfx-wc-o)">
            <polygon points="30,133 64,64 72,66 72,238 64,240 30,171" fill="#2E8CCB" fillOpacity=".34" />
            <g fill="url(#dpfx-wfill)">
              {OUTLETS.map((k) => <rect key={k} x="72" y={chTop(k)} width="240" height="18" />)}
            </g>
            <g clipPath="url(#dpfx-wc-cho)">
              <g className="dpfx-flow">
                <rect x="-48" y="74" width="420" height="156" fill="url(#dpfx-streak)" />
              </g>
            </g>
          </g>
          <g clipPath="url(#dpfx-wc-i)">
            <g fill="url(#dpfx-wfill)">
              {INLETS.map((k) => <rect key={k} x="88" y={chTop(k)} width="240" height="18" />)}
            </g>
            <polygon points="328,66 336,64 370,133 370,171 336,240 328,238" fill="#2E8CCB" fillOpacity=".3" />
            <g clipPath="url(#dpfx-wc-chi)">
              <g className="dpfx-flow">
                <rect x="-48" y="74" width="420" height="156" fill="url(#dpfx-streak)" />
              </g>
            </g>
          </g>
          {/* impact bursts: a pressure front down every outlet channel at once, through the
              walls, then down every inlet channel and out of the inlet face */}
          <g clipPath="url(#dpfx-wc-fo)">
            <g className="dpfx-front-o" opacity="0" fill="url(#dpfx-front)">
              {OUTLETS.map((k) => <path key={k} d={FRONT(chTop(k))} />)}
            </g>
          </g>
          <g clipPath="url(#dpfx-wc-core)">
            <g className="dpfx-front-w" opacity="0" fill="url(#dpfx-front)">
              {WALLS_Y.map((y) => <rect key={y} x="-12" y={y} width="12" height="5" />)}
            </g>
          </g>
          <g clipPath="url(#dpfx-wc-fi)">
            <g className="dpfx-front-i" opacity="0" fill="url(#dpfx-front)">
              {INLETS.map((k) => <path key={k} d={FRONT(chTop(k))} />)}
            </g>
          </g>
          {/* ripples where each burst enters the open outlet channels */}
          {OUTLETS.map((k) => (
            <circle key={k} className="dpfx-ringc" cx="72" cy={chMid(k)} r="2" fill="none" stroke="#7CCBFF" strokeWidth="1.2" opacity="0" />
          ))}
        </g>
        {/* hot-air dry, also in screen space for the reversed filter: a warm front sweeps from the
            outlet face (left) to the inlet face, and the core stays warm behind it */}
        <g className="dpfx-warm" opacity="0" transform="matrix(-1 0 0 1 400 0)">
          <defs>
            <clipPath id="dpfx-warmclip" clipPathUnits="userSpaceOnUse">
              <rect className="dpfx-warmc" x="72" y="70" width="0" height="164" />
            </clipPath>
          </defs>
          <g clipPath="url(#dpfx-wc-core)">
            <rect x="72" y="70" width="256" height="164" fill="url(#dpfx-warmg)" clipPath="url(#dpfx-warmclip)" />
            <rect className="dpfx-warmfront" x="58" y="70" width="14" height="164" fill="url(#dpfx-warmf)" />
          </g>
        </g>
        {/* crack check: a bright line with a soft glow sweeps the core, then a tick */}
        <g className="dpfx-scan" transform="translate(72 0)" opacity="0">
          <rect x="-7" y="70" width="14" height="164" fill="url(#dpfx-scan)" />
          <rect x="-1.2" y="70" width="2.4" height="164" fill="#FFF" fillOpacity=".95" />
        </g>
        <g className="dpfx-check" opacity="0">
          <circle cx="346" cy="152" r="7.5" fill="#0B0F14" stroke="#FFF" strokeOpacity=".85" strokeWidth="1.1" />
          <path d="M342.6 152.3l2.4 2.5 4.6-5" fill="none" stroke="#FFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* m. ash front after each of the six cycles */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} className="dpfx-tick" opacity="0">
            <path d="M0 72V232" stroke="#E4DFD3" strokeOpacity=".7" strokeWidth=".8" strokeDasharray="2 2.5" />
          </g>
        ))}
      </g>

      {/* pipe hardware, drawn over the flanges; it leaves with the pipes */}
      <g className="dpfx-pipe-in">
        <rect x="24" y="120" width="12" height="64" rx="2.5" fill="url(#dpfx-steel)" stroke="#2F353D" strokeWidth=".6" />
        <rect x="26" y="112" width="8" height="8" rx="1" fill="url(#dpfx-steel)" />
        <path d="M30 104V112" stroke="#AEB7C2" strokeWidth="1.2" />
      </g>
      <g className="dpfx-pipe-out">
        <rect x="360" y="120" width="22" height="4" fill="#8A94A1" />
        <rect x="360" y="180" width="22" height="4" fill="#8A94A1" />
        <path d={BOLT_HEADS} fill="#C9CED6" stroke="#2F353D" strokeWidth=".5" />
      </g>

      {/* 6, 7. machine adaptors */}
      <g className="dpfx-adapt-l" transform="translate(-60 0)" opacity="0">
        {/* the supply comes up from below, clear of the badge in the top-left corner */}
        <path d="M20 188V280" stroke="#1E3A52" strokeWidth="8" />
        <path d="M18 188V280" stroke="#5CC8FF" strokeOpacity=".35" strokeWidth="1.5" />
        {/* feed water running up the hose into the adaptor */}
        <path className="dpfx-hoseflow" d="M21 278V190" stroke="#9EDCFF" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 8" opacity="0" />
        <rect x="6" y="116" width="28" height="72" rx="6" fill="url(#dpfx-steel)" stroke="#2F353D" strokeWidth=".6" />
        <path d="M33 120V184" stroke="#1D2228" strokeWidth="1.5" />
      </g>
      <g className="dpfx-adapt-r" transform="translate(60 0)" opacity="0">
        <path d="M380 188V262" stroke="#2A3036" strokeWidth="8" />
        {/* dirty water leaving down the drain */}
        <path className="dpfx-drainflow" d="M380 190V260" stroke="#7CCBFF" strokeOpacity=".85" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 8" opacity="0" />
        <rect x="366" y="116" width="28" height="72" rx="6" fill="url(#dpfx-steel)" stroke="#2F353D" strokeWidth=".6" />
        <path d="M367 120V184" stroke="#1D2228" strokeWidth="1.5" />
      </g>

      {/* 8, 9. static flow arrows */}
      <g className="dpfx-arrows-x" fill="none" stroke="#FF9A33" strokeOpacity=".6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={ARROWS_X} />
      </g>
      <g className="dpfx-arrows-xp" fill="none" stroke="#FF9A33" strokeOpacity=".6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={ARROWS_XP} />
      </g>
      <g className="dpfx-arrows-xw" fill="none" stroke="#FF9A33" strokeOpacity=".6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={ARROWS_XW} />
      </g>
      {/* reduced motion only: water arrows for the reverse flush, in water blue (white is air),
          with a dark under-stroke so they read over the water and the walls */}
      <g className="dpfx-arrows-w" opacity="0" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={ARROWS_W} stroke="#06131D" strokeOpacity=".7" strokeWidth="2.8" />
        <path d={ARROWS_W} stroke="#5CC8FF" strokeWidth="1.4" />
      </g>

      {/* 10. label leaders */}
      <g className="dpfx-leaders">
        {LEADERS.map(([x1, y1, x2, y2]) => (
          <g key={x1}>
            <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke="#FFF" strokeOpacity=".55" strokeWidth=".8" />
            <circle cx={x2} cy={y2} r="1.3" fill="#FFF" fillOpacity=".9" />
          </g>
        ))}
      </g>

    </>
  );
});

const CloseUp = memo(function CloseUp({ soot, wallAsh, rm }: { soot: number; wallAsh: number; rm: boolean }) {
  const T = cakeT(soot);
  const top = CU_TOP - T;
  const cake = T > 0 ? cuCake(T) : null;
  const ash = CU_ASH.slice(0, Math.round(CU_ASH.length * Math.max(0, Math.min(1, wallAsh))));
  const lanesIn = [f2(top - 9), f2(top - 22)];
  // The arrows run from the cake surface to just below the wall, around their resting place at
  // the middle of the wall (where they sit, still, without motion).
  const arrowY = { '--y0': `${f2(top - 5 - CU_MID)}px`, '--y1': `${CU_BOT + 8 - CU_MID}px` };
  // Solid chips, drawn above the SVG; the streams, arrows and specks are kept clear of them.
  const chip = 'absolute -translate-y-1/2 whitespace-nowrap rounded bg-[#0A0A0A]/90 px-1.5 py-0.5 leading-none ring-1 ring-white/10';
  return (
    <>
      <svg viewBox="0 0 400 280" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {/* inlet: warm and dirty; outlet: cooler and cleaner */}
          <linearGradient id="dpfx-cu-in" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#261E16" />
            <stop offset=".65" stopColor="#3B3024" />
            <stop offset="1" stopColor="#4A3C2D" />
          </linearGradient>
          <linearGradient id="dpfx-cu-out" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#66707A" />
            <stop offset=".4" stopColor="#535C65" />
            <stop offset="1" stopColor="#3B4249" />
          </linearGradient>
          {/* gas thins out along the inlet channel as it leaves through the wall, and builds up
              along the outlet channel */}
          <linearGradient id="dpfx-cu-lin" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="0">
            <stop offset="0" stopColor="#FFF" stopOpacity=".95" />
            <stop offset="1" stopColor="#FFF" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="dpfx-cu-lout" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="0">
            <stop offset="0" stopColor="#FFF" stopOpacity=".3" />
            <stop offset="1" stopColor="#FFF" stopOpacity=".95" />
          </linearGradient>
          <linearGradient id="dpfx-cu-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0C0E11" stopOpacity=".7" />
            <stop offset=".07" stopColor="#0C0E11" stopOpacity="0" />
            <stop offset=".93" stopColor="#0C0E11" stopOpacity="0" />
            <stop offset="1" stopColor="#0C0E11" stopOpacity=".7" />
          </linearGradient>
          <pattern id="dpfx-soot-xl" width="7" height="6" patternUnits="userSpaceOnUse">
            <rect width="7" height="6" fill="#0E0E0F" />
            <circle cx="1.6" cy="1.7" r="1.15" fill="#202022" />
            <circle cx="5.2" cy="4.4" r="1" fill="#29292C" />
            <circle cx="4.6" cy="1" r=".55" fill="#1A1A1C" />
          </pattern>
          <clipPath id="dpfx-cu-wall" clipPathUnits="userSpaceOnUse">
            <rect x="-2" y={CU_TOP} width="404" height={CU_BOT - CU_TOP} />
          </clipPath>
        </defs>
        {/* channels, running off the frame */}
        <rect width="400" height={CU_TOP} fill="url(#dpfx-cu-in)" />
        <rect y={CU_BOT} width="400" height={280 - CU_BOT} fill="url(#dpfx-cu-out)" />
        {/* soot haze drifting in the inlet channel */}
        <g fill="#0E0C0A" fillOpacity=".45">
          {CU_HAZE.map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} />)}
        </g>
        {/* the wall: packed ceramic grains, with small voids between them all through it */}
        <g clipPath="url(#dpfx-cu-wall)">
          <rect x="-2" y={CU_TOP} width="404" height={CU_BOT - CU_TOP} fill="#4B4237" />
          {CU_GRAINS.map((d, i) => <path key={i} d={d} fill={CU_GRAIN_FILL[i]} />)}
        </g>
        {/* soot cake on the inlet face, as thick as the soot load */}
        {cake && (
          <g>
            <path d={cake.body} fill="url(#dpfx-soot-xl)" />
            <path d={cake.edge} fill="none" stroke="#4A4A50" strokeWidth=".9" />
          </g>
        )}
        {/* ash caught on the wall face, under the soot */}
        <g fill="#ECE7DA" stroke="#B5AC98" strokeWidth=".5">
          {ash.map((g) => <circle key={g.x} cx={g.x} cy={f2(CU_TOP - g.r * 0.8)} r={g.r} />)}
        </g>
        {/* gas streams along both channels */}
        <g fill="none" strokeWidth="1.6" strokeLinecap="round">
          {lanesIn.map((y) => <path key={y} className="dpfx-culane" d={`M-12 ${y}H412`} stroke="url(#dpfx-cu-lin)" />)}
          {CU_LANES_OUT.map((y) => <path key={y} className="dpfx-culane" d={`M-12 ${y}H412`} stroke="url(#dpfx-cu-lout)" />)}
          {rm && (
            <path
              d={[...lanesIn, ...CU_LANES_OUT].map((y) => `M386 ${f2(y - 3.5)}l4.5 3.5-4.5 3.5`).join('')}
              stroke="#FFF" strokeLinejoin="round"
            />
          )}
        </g>
        {/* and crosses the wall at many points: short arrows that pass down through the cake
            and the wall and fade out below it */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {CU_ARROWS.map((x, i) => (
            <g key={x} transform={`translate(${x} ${CU_MID})`} className={i < 2 ? 'dpfx-cu-wide' : undefined}>
              <g className="dpfx-cuarrow" style={{ ...arrowY, animationDelay: `${-f2((i * 0.53) % 1.5)}s` } as CSSProperties}>
                <path d={CU_ARROW} stroke="#1E1912" strokeOpacity=".6" strokeWidth="4" />
                <path d={CU_ARROW} stroke="#FFF" strokeWidth="1.8" />
              </g>
            </g>
          ))}
        </g>
        {/* soot specks ride in with the gas and stop on the cake */}
        {cake && CU_SPECKS.map((p) => (
          <g key={p.x} transform={`translate(${p.x} ${f2(top - 2.2)})`}>
            <circle
              className="dpfx-cuspeck" r="2.2" fill="#121212" stroke="#FF9A33" strokeOpacity=".7" strokeWidth=".6"
              style={{ '--dx': `${p.dx}px`, animationDelay: `${p.d}s` } as CSSProperties}
            />
          </g>
        ))}
        {/* leader from the cake label */}
        {cake && (
          <g>
            <path d={`M352 95V${f2(top - 3)}`} stroke="#FFF" strokeOpacity=".6" strokeWidth=".8" />
            <circle cx="352" cy={f2(top - 1.6)} r="1.6" fill="#FFF" fillOpacity=".9" />
          </g>
        )}
        <rect width="400" height="280" fill="url(#dpfx-cu-edge)" />
      </svg>
      <div className="pointer-events-none absolute inset-0 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-white/90 md:text-[12px]" aria-hidden="true">
        <span className={chip} style={{ left: '3.5%', top: '27%' }}>Inlet channel</span>
        <span className={`${chip} ${cake ? '' : 'text-white/60 line-through decoration-white/60'}`} style={{ right: '3.5%', top: '30%' }}>Soot cake</span>
        <span className={chip} style={{ left: '3.5%', top: `${f2((CU_MID / 280) * 100)}%` }}>Porous ceramic wall</span>
        <span className={chip} style={{ left: '3.5%', top: '92%' }}>Outlet channel</span>
        <span className={chip} style={{ right: '3.5%', top: '92%' }}>Filtered gas out</span>
      </div>
    </>
  );
});

// The badge is a flat, opaque label (only the icon carries the tone), so it never reads as a
// button and nothing in the drawing shows through it.
const TONE: Record<Tone, [string, string]> = {
  orange: ['text-white', 'text-[#FF9A33]'],
  blue: ['text-white', 'text-[#7CCBFF]'],
  amber: ['text-[#FFB020]', 'text-[#FFB020]'],
  white: ['text-white', 'text-white'],
};

function Badge({ id, cycle, rm, maxW }: { id: BadgeId; cycle: number; rm: boolean; maxW: string }) {
  const [Icon, tone, raw] = BADGES[id];
  const text = id === 'cycle' ? raw.replace('{n}', String(cycle || 1)) : id === 'impact' && rm ? 'IMPACT BURSTS' : raw;
  const [box, icon] = TONE[tone];
  return (
    <div
      key={text}
      aria-hidden="true"
      className={`dpfx-fade absolute left-2 top-2 inline-flex h-7 items-center gap-1.5 rounded-full border border-white/10 bg-[#0B0F14] px-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.04em] md:left-3 md:top-3 md:h-8 md:px-3 md:text-[12px] ${box}`}
      style={{ maxWidth: maxW }}
    >
      <Icon size={14} className={`shrink-0 ${icon}`} aria-hidden="true" />
      <span className="truncate">{text}</span>
    </div>
  );
}

// The real controls in the drawing get the orange outline, so they read as buttons next to the
// flat badge.
const OVERLAY_BTN =
  'inline-flex h-11 items-center justify-center rounded-full border border-[#FF9A33]/50 bg-[#0A0A0A]/[0.82] text-white backdrop-blur-sm transition-colors hover:border-[#FF9A33]/80 hover:bg-[#0A0A0A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9A33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] aria-disabled:opacity-50';

type CtlMode = 'look' | 'pause' | 'next' | 'none';

function OverlayControls({ ctl, close, paused, finish, waiting, onLook, onPause, onSkip, onNext }: {
  ctl: CtlMode; close: boolean; paused: boolean; finish: boolean; waiting: boolean;
  onLook: () => void; onPause: () => void; onSkip: () => void; onNext: () => void;
}) {
  if (ctl === 'none') return null;
  const skip = (
    <button type="button" data-runctl="" className={`${OVERLAY_BTN} w-11`} aria-label="Skip to the end" onClick={onSkip}>
      <SkipForward size={18} aria-hidden="true" />
    </button>
  );
  return (
    <div className="absolute right-1.5 top-1.5 flex gap-1">
      {ctl === 'look' && (
        <button
          type="button"
          className={`${OVERLAY_BTN} gap-1.5 px-3 text-[12px] font-semibold`}
          aria-label={close ? 'Back to the whole filter' : 'Look closer at one filter wall'}
          onClick={onLook}
        >
          {close ? <ZoomOut size={16} aria-hidden="true" /> : <ZoomIn size={16} aria-hidden="true" />}
          {close ? 'Back' : 'Look closer'}
        </button>
      )}
      {ctl === 'pause' && (
        <>
          <button
            type="button"
            data-runctl=""
            className={`${OVERLAY_BTN} w-11`}
            aria-label={paused ? 'Resume animation' : 'Pause animation'}
            onClick={onPause}
          >
            {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
          </button>
          {skip}
        </>
      )}
      {ctl === 'next' && (
        <>
          <button
            type="button"
            data-runctl=""
            className={`${OVERLAY_BTN} gap-1.5 px-3 text-[12px] font-semibold`}
            aria-label={finish ? undefined : 'Next step'}
            aria-disabled={waiting ? undefined : true}
            onClick={onNext}
          >
            <ArrowRight size={16} aria-hidden="true" />
            {finish ? 'Finish' : 'Next'}
          </button>
          {skip}
        </>
      )}
    </div>
  );
}

function DrawingLabels({ soot, ash }: { soot: number; ash: number }) {
  return (
    <div className="dpfx-labels pointer-events-none absolute inset-0 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-white/80 md:text-[12px]" aria-hidden="true">
      {LABELS.map(([t, x]) => {
        // An absent part keeps a readable label (white/60, about 6:1 on the stage), struck
        // through, rather than relying on low contrast alone.
        const dim = (t === 'SOOT' && soot < 5) || (t === 'ASH' && ash < 10);
        return (
          <span
            key={t}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap leading-none transition-colors duration-300 ${dim ? 'text-white/60 line-through decoration-white/60 decoration-[1.5px]' : ''}`}
            style={{ left: `${x}%`, top: '93.57%' }}
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}

function FaceLabels() {
  return (
    <div className="dpfx-faces pointer-events-none absolute inset-0 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-white/85 opacity-0 md:text-[12px]" aria-hidden="true">
      <span className="absolute -translate-y-1/2 whitespace-nowrap leading-none" style={{ left: '18%', top: '93.57%' }}>Outlet face</span>
      <span className="absolute -translate-x-full -translate-y-1/2 whitespace-nowrap leading-none" style={{ left: '82%', top: '93.57%' }}>Inlet face</span>
    </div>
  );
}

/* ------------------------------------------------------------------ readouts */

const trackCall = () =>
  trackEvent('dpf_cta_click', { cta_location: 'explainer', cta_type: 'phone', page_path: '/dpf-cleaning' });

function Status({ s, barRef }: { s: S; barRef: RefObject<HTMLSpanElement> }) {
  const refused = s.mode === 'refused';
  // Blue (heated water) only while water flows.
  const blue = s.mode === 'clean' && s.step === 3;
  // Min heights fit the longest message at each width (measured with spare), so the box never
  // changes height between messages: 3 lines on phones, 2 lines plus the call line from sm,
  // 2 lines at 16px from md, 3 lines in the lg rail (the call link flows inline) and 2 from xl.
  return (
    <p
      id="dpfx-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`relative min-h-[80px] rounded-xl border px-3 py-[9px] text-[14px] leading-5 text-white/85 sm:min-h-[62px] md:min-h-[78px] md:px-4 md:py-3 md:text-[16px] md:leading-6 lg:min-h-[98px] xl:min-h-[74px] ${refused ? 'border-[#FFB020]/50 bg-[#FFB020]/[0.08]' : 'border-white/5 bg-[#0D0F12]'}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden rounded-t-xl">
        <span ref={barRef} className={`dpfx-sbar ${blue ? 'bg-[#5CC8FF]' : 'bg-[#FF9A33]'}`} />
      </span>
      {msgText(s)}
      {s.stepWait && (
        <span className="sr-only">
          {s.step === 5 ? ' Press Finish, above the drawing, to end.' : ' Press Next, above the drawing, to continue.'}
        </span>
      )}
      {s.msg === 'cleaned' && (
        <>
          {' '}
          <span className="sm:mt-0.5 sm:block lg:mt-0 lg:inline">
            {'DPF clean from £210. '}
            <a
              href={PHONE_HREF}
              onClick={trackCall}
              className="-my-3 inline-flex items-center gap-1.5 py-3 align-top font-semibold text-[#FF9A33] underline underline-offset-4 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#FF9A33]"
            >
              <PhoneCall size={16} aria-hidden="true" />
              {PHONE_TEXT}
            </a>
          </span>
        </>
      )}
    </p>
  );
}

function Meter({ v, fill, limit, ghost }: { v: number; fill: string; limit?: boolean; ghost?: number }) {
  return (
    <span className="dpfx-meter block" aria-hidden="true">
      <i />
      <i style={{ '--v': `${v}%`, background: fill } as CSSProperties} />
      {limit && <span className="absolute top-1/2 h-[9px] w-px -translate-y-1/2 bg-white/60" style={{ left: '90%' }} />}
      {ghost !== undefined && (
        <span className="absolute top-1/2 h-[9px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55" style={{ left: `${ghost}%` }} />
      )}
    </span>
  );
}

const STRIP_TILE = 'flex h-12 min-w-0 flex-col justify-between rounded-xl bg-[#1A1D22] px-2.5 py-1.5 sm:h-14 md:h-16 md:px-3 lg:h-20 lg:py-2';
const STRIP_LABEL = 'block font-mono text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-white/65 md:text-[11px] md:leading-4 lg:text-[12px]';
const STRIP_WORD = 'block truncate text-[12px] font-bold leading-[14px] text-white md:text-[15px] md:leading-5 lg:text-[16px]';
// The band cursor outlines one segment of the 3-part bar (segments are (100% - 4px) / 3 wide
// with 2px gaps), so it never sits over the word above it.
const BAND_POS: Record<Band, string> = { OK: '-2px', Medium: 'calc((100% - 4px) / 3)', Blocked: 'calc((100% - 4px) * 2 / 3 + 2px)' };

function Lamp({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 28 16" width="28" height="16" className="dpfx-lamp shrink-0 text-white/45" data-on={on} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M0 8H5M23 8H28" />
        <rect x="5" y="2" width="18" height="12" rx="3" />
      </g>
      <g fill="currentColor">
        <circle cx="10" cy="6" r="1.1" /><circle cx="14" cy="6" r="1.1" /><circle cx="18" cy="6" r="1.1" />
        <circle cx="10" cy="10" r="1.1" /><circle cx="14" cy="10" r="1.1" /><circle cx="18" cy="10" r="1.1" />
      </g>
    </svg>
  );
}

function Strip({ s }: { s: S }) {
  // While a test runs the word says Testing and only the earlier result (if any) stays marked.
  const current = s.testing ? null : s.flowAfter ?? s.flowBefore;
  const ghost = s.flowAfter || s.testing ? s.flowBefore : null;
  const lamp = lampOn(s.sw, s.ash);
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3" style={{ '--dpfx-t': `${s.t}s` } as CSSProperties}>
      <div className={STRIP_TILE}>
        <span className="relative block">
          <span className={STRIP_LABEL}>Soot</span>
          {/* The ECU limit: a lock over the 90% tick, only once the load gets near it. */}
          {s.sw > 75 && (
            <Lock
              size={10}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 ${s.sw > 90 ? 'text-[#FFB020]' : 'text-white/70'}`}
              style={{ left: '90%' }}
              aria-hidden="true"
            />
          )}
        </span>
        <span className={STRIP_WORD}>{sootWord(s.sw)}</span>
        <Meter v={s.soot} fill="#FF9A33" limit />
      </div>
      <div className={STRIP_TILE}>
        <span className={STRIP_LABEL}>Ash</span>
        <span className={STRIP_WORD}>{ashWord(s.ash)}</span>
        <Meter v={s.ash} fill="#E4DFD3" ghost={s.flowShown && s.ashBefore !== null ? s.ashBefore : undefined} />
      </div>
      {s.flowShown ? (
        <div className={STRIP_TILE}>
          <span className={STRIP_LABEL}>Flow test</span>
          <span className={STRIP_WORD}>{s.testing ? 'Testing' : current ?? 'Waiting'}</span>
          <span className="relative block" aria-hidden="true">
            <span className="relative block">
              <span className="flex gap-0.5">
                <span className="dpfx-band dpfx-band--ok flex-1" />
                <span className="dpfx-band dpfx-band--med flex-1" />
                <span className="dpfx-band dpfx-band--blk flex-1" />
              </span>
              {ghost && <span className="dpfx-cur dpfx-cur--was" style={{ left: BAND_POS[ghost] }} />}
              {current && <span className="dpfx-cur dpfx-cur--now" style={{ left: BAND_POS[current] }} />}
            </span>
            <span className="relative mt-1 hidden h-3 font-mono text-[10px] leading-3 text-white/60 lg:block">
              <span className="absolute left-0">5</span>
              <span className="absolute -translate-x-1/2" style={{ left: '33.3%' }}>15</span>
              <span className="absolute -translate-x-1/2" style={{ left: '66.7%' }}>30</span>
              <span className="absolute right-0">mbar</span>
            </span>
          </span>
        </div>
      ) : (
        <div className={STRIP_TILE}>
          <span className={STRIP_LABEL}>DPF light</span>
          <span className="flex min-w-0 items-center gap-2">
            <Lamp on={lamp} />
            <span className={STRIP_WORD}>{lamp ? 'On' : 'Off'}</span>
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ controls */

type TileRefs = MutableRefObject<Partial<Record<TileId, HTMLButtonElement | null>>>;
type ProgRefs = MutableRefObject<Partial<Record<TileId, HTMLSpanElement | null>>>;

function SmallTile({ id, Icon, label, aria, sub, busy, running, locked, coach, onClick, tileRefs, progRefs }: {
  id: TileId; Icon: IconT; label: string; aria: string; sub: string; busy: boolean; running: boolean; locked: boolean;
  coach: boolean; onClick: () => void; tileRefs: TileRefs; progRefs: ProgRefs;
}) {
  const subId = `dpfx-sub-${id}`;
  return (
    <button
      ref={(el) => { tileRefs.current[id] = el; }}
      type="button"
      className="dpfx-tile"
      aria-label={aria}
      aria-describedby={locked ? `${subId} dpfx-status` : subId}
      aria-disabled={busy ? true : undefined}
      data-running={running ? 'true' : undefined}
      data-locked={locked ? 'true' : undefined}
      onClick={onClick}
    >
      <span className="flex items-center gap-1.5">
        <span className="relative inline-flex shrink-0">
          <Icon size={18} className="dpfx-tile-icon text-[#FF9A33]" aria-hidden="true" />
          {locked && (
            <span className="absolute -right-1 -top-1 rounded-full bg-[#0A0A0A] p-px text-[#FFB020]">
              <Lock size={10} aria-hidden="true" />
            </span>
          )}
        </span>
        <span className="whitespace-nowrap text-[14px] font-bold leading-[18px] text-white md:text-[16px] md:leading-5">{label}</span>
      </span>
      <span id={subId} className="mt-0.5 block h-[14px] truncate text-[11px] font-medium leading-[14px] text-white/70 md:mt-1 md:h-[18px] md:text-[13px] md:leading-[18px]">
        {sub}
      </span>
      {running && <span className="dpfx-dot absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#FF9A33]" aria-hidden="true" />}
      {coach && !running && <span className="dpfx-coach" aria-hidden="true" />}
      <span ref={(el) => { progRefs.current[id] = el; }} className="dpfx-prog" aria-hidden="true" />
    </button>
  );
}

function cleanSub(s: S) {
  if (s.mode === 'clean' && s.stepWait && s.step <= 5) {
    return `Step ${Math.max(1, s.step)} of 5. Press ${s.step === 5 ? 'Finish' : 'Next'} above`;
  }
  if (s.mode === 'clean') return s.step <= 5 ? `Cleaning, step ${Math.max(1, s.step)} of 5` : 'Refitting';
  if (s.cleanDone) return 'Clean done. Run it again';
  if (s.recommend === 'ash') return 'The only way to remove the ash';
  if (s.recommend === 'check') return 'Workshop check first';
  if (s.recommend === 'cycles') return 'The only way the ash comes out';
  return 'Water only. Removes soot and ash.';
}

function Tiles({ s, busy, onDrive, onRegen, onAdditive, onClean, tileRefs, progRefs }: {
  s: S; busy: boolean; onDrive: () => void; onRegen: () => void; onAdditive: () => void; onClean: () => void;
  tileRefs: TileRefs; progRefs: ProgRefs;
}) {
  const locked = s.soot > 90 && !busy;
  const full = s.soot > 90;
  const run = (m: Mode) => s.mode === m;
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <SmallTile
        id="drive" Icon={Car} label="Drive" aria="Drive"
        sub={run('drive') ? 'Driving' : full ? 'Already full' : 'Load soot'}
        busy={busy || full} running={run('drive')} locked={false} coach={false}
        onClick={onDrive} tileRefs={tileRefs} progRefs={progRefs}
      />
      <SmallTile
        id="regen" Icon={Flame} label="Regen" aria="Regenerate"
        sub={run('regen') ? 'Burning' : locked ? 'Not allowed' : 'Burn soot'}
        busy={busy} running={run('regen')} locked={locked} coach={s.coach && !busy}
        onClick={onRegen} tileRefs={tileRefs} progRefs={progRefs}
      />
      <SmallTile
        id="additive" Icon={FlaskConical} label="Additive" aria="Additive or spray"
        sub={run('additive') ? 'Running' : locked ? 'Not allowed' : 'or a spray'}
        busy={busy} running={run('additive')} locked={locked} coach={false}
        onClick={onAdditive} tileRefs={tileRefs} progRefs={progRefs}
      />
      <button
        ref={(el) => { tileRefs.current.clean = el; }}
        type="button"
        className="dpfx-tile dpfx-tile--clean col-span-3"
        aria-label="Off-vehicle clean"
        aria-describedby="dpfx-sub-clean"
        aria-disabled={busy ? true : undefined}
        data-running={run('clean') ? 'true' : undefined}
        onClick={onClean}
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF7A00]/15 md:h-10 md:w-10">
          <Droplets size={20} className="dpfx-tile-icon text-[#FF9A33]" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold leading-5 text-white md:text-[17px] md:leading-6">Off-vehicle clean</span>
          <span id="dpfx-sub-clean" className="block truncate text-[12px] font-medium leading-4 text-white/70 md:text-[14px] md:leading-5">{cleanSub(s)}</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-white/50" aria-hidden="true" />
        {s.recommend !== 'none' && !busy && <span key={s.ringNonce} className="dpfx-ring" aria-hidden="true" />}
        {run('clean') && <span className="dpfx-dot absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#FF9A33]" aria-hidden="true" />}
        <span ref={(el) => { progRefs.current.clean = el; }} className="dpfx-prog" aria-hidden="true" />
      </button>
    </div>
  );
}

const SECONDARY =
  'inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-[14px] font-semibold text-white/75 md:text-[15px] transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9A33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111317] aria-disabled:cursor-not-allowed aria-disabled:opacity-[0.45]';

function Secondary({ s, busy, onCycles, onReset, tileRefs }: {
  s: S; busy: boolean; onCycles: () => void; onReset: () => void; tileRefs: TileRefs;
}) {
  // Over 90% soot it stays pressable, like the locked Regen and Additive tiles: pressing it
  // puts the reason in the status, which the button also points at.
  const locked = s.soot > 90 && !busy;
  return (
    <div className="flex min-h-[44px] items-center gap-1 pr-16">
      <button
        ref={(el) => { tileRefs.current.cycles = el; }}
        type="button"
        className={SECONDARY}
        aria-disabled={busy ? true : undefined}
        aria-describedby={locked ? 'dpfx-status' : undefined}
        data-locked={locked ? 'true' : undefined}
        onClick={onCycles}
      >
        {locked
          ? <Lock size={18} className="text-[#FFB020]" aria-hidden="true" />
          : <Repeat size={18} className="text-[#FF9A33]" aria-hidden="true" />}
        Watch six cycles
      </button>
      <button type="button" className={SECONDARY} aria-disabled={busy ? true : undefined} onClick={onReset}>
        <RotateCcw size={18} className="text-[#FF9A33]" aria-hidden="true" />
        Reset
      </button>
    </div>
  );
}

/* -------------------------------------------------------------- below the fold */

function Swatch({ kind }: { kind: string }) {
  const inner = kind === 'face'
    ? Array.from({ length: 16 }, (_, i) => {
      const cx = i % 4, cy = (i / 4) | 0;
      return <rect key={i} x={cx * 4} y={cy * 4} width="4" height="4" fill={(cx + cy) % 2 ? 'url(#dpfx-plug)' : '#14110D'} />;
    })
    : kind === 'air'
      ? (
        <>
          <rect width="16" height="16" fill="#0C0E11" />
          <path d="M2 5H9M5 8H13M3 11H10" stroke="#FFF" strokeOpacity=".75" strokeWidth="1.1" strokeLinecap="round" />
        </>
      )
      : <rect width="16" height="16" fill={`url(#dpfx-${kind})`} />;
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className="mt-px shrink-0 overflow-hidden rounded-[3px]" aria-hidden="true">
      {inner}
      <rect x=".5" y=".5" width="15" height="15" rx="2.5" fill="none" stroke="#FFF" strokeOpacity=".18" />
    </svg>
  );
}

function Legend() {
  return (
    <div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white/60">Key</p>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-6">
        {LEGEND.map(([kind, text]) => (
          <li key={kind} className="flex items-start gap-2 text-[13px] leading-[18px] text-white/70">
            <Swatch kind={kind} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] leading-[18px] text-white/55">{FOOTNOTE}</p>
    </div>
  );
}

function Steps({ active, done }: { active: number; done: number }) {
  return (
    <section className="mt-6 lg:mt-8" aria-labelledby="dpfx-steps-h">
      <h3 id="dpfx-steps-h" className="text-lg font-bold text-white">Our off-vehicle clean, step by step</h3>
      <ol className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3 lg:mt-7 lg:grid-cols-5">
        {STEPS.map((st, i) => {
          const n = i + 1;
          const isActive = active === n;
          const isDone = done >= n;
          return (
            <li
              key={st.title}
              className={`relative rounded-xl border-l-2 p-3 transition-colors ${isActive ? 'border-[#FF7A00] bg-[#FF7A00]/10' : 'border-transparent bg-[#1A1D22]'} ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-4 left-0 hidden h-px bg-white/10 lg:block ${i < 4 ? '-right-3' : 'right-0'}`}
              >
                <span className={`absolute inset-0 origin-left bg-[#FF7A00] transition-transform duration-500 ${isDone ? 'scale-x-100' : 'scale-x-0'}`} />
                <span className={`absolute -left-px -top-[3px] h-[7px] w-[7px] rounded-full ${isDone || isActive ? 'bg-[#FF7A00]' : 'bg-[#2A2F36]'}`} />
              </span>
              <span className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 size={18} className="shrink-0 text-[#FF9A33]" aria-hidden="true" />
                ) : (
                  <span
                    aria-hidden="true"
                    className={`shrink-0 rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[12px] font-bold leading-4 ${isActive ? 'text-[#FF7A00]' : 'text-white/60'}`}
                  >
                    {String(n).padStart(2, '0')}
                  </span>
                )}
                <span className="text-[14px] font-bold leading-5 text-white">{st.title}</span>
                {isDone && <span className="sr-only"> (done)</span>}
                {isActive && (
                  <span className="ml-auto shrink-0 rounded-full bg-[#FF7A00]/20 px-1.5 py-px font-mono text-[10px] font-bold text-[#FF9A33]">NOW</span>
                )}
              </span>
              <p className="mt-1.5 text-[13px] leading-5 text-white/65">{st.body}</p>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[13px] leading-5 text-white/60">Compressed air is only used for the flow test and the drying.</p>
    </section>
  );
}

function MarkIcon({ m }: { m: Mark }) {
  if (m === 'check') return <Check size={14} className="mt-[3px] shrink-0 text-[#FF9A33]" aria-hidden="true" />;
  if (m === 'x') return <X size={14} className="mt-[3px] shrink-0 text-white/45" aria-hidden="true" />;
  return <CircleDashed size={14} className="mt-[3px] shrink-0 text-white/60" aria-hidden="true" />;
}

// Phones get one card per option (name, then Soot and Ash rows with their own labels); from
// sm up the same markup is a real table with column headers.
function Compare() {
  return (
    <section aria-labelledby="dpfx-compare-h">
      <h3 id="dpfx-compare-h" className="text-lg font-bold text-white">What removes what</h3>
      <table className="mt-3 block w-full text-[13px] leading-5 sm:table sm:table-fixed">
        <caption className="sr-only">What each option removes from a DPF</caption>
        <colgroup className="hidden sm:table-column-group">
          <col className="w-[38%]" />
          <col />
          <col />
        </colgroup>
        <thead className="hidden sm:table-header-group">
          <tr className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60">
            <th scope="col" className="px-2 py-2 text-left font-bold">Option</th>
            <th scope="col" className="px-2 py-2 text-left font-bold">Soot</th>
            <th scope="col" className="px-2 py-2 text-left font-bold">Ash</th>
          </tr>
        </thead>
        <tbody className="grid gap-2 sm:table-row-group">
          {COMPARE.map((row) => (
            <tr
              key={row.label}
              className={`block rounded-xl p-3 sm:table-row sm:rounded-none sm:border-t sm:border-white/5 sm:p-0 sm:align-top ${row.clean ? 'bg-[#FF7A00]/[0.08] ring-1 ring-inset ring-[#FF7A00]/30 sm:ring-0' : 'bg-[#1A1D22] sm:bg-transparent'}`}
            >
              <th scope="row" className={`block text-left text-[14px] font-bold sm:table-cell sm:px-2 sm:py-3 sm:text-[13px] ${row.clean ? 'text-[#FF9A33]' : 'text-white'}`}>
                <span className="flex items-start gap-1.5">
                  <row.icon size={15} className="mt-[2px] shrink-0" aria-hidden="true" />
                  <span>{row.label}</span>
                </span>
              </th>
              {[row.soot, row.ash].map(([m, text], i) => (
                <td key={i} className="mt-2 flex items-start text-white/75 sm:mt-0 sm:table-cell sm:px-2 sm:py-3">
                  <span className="w-12 shrink-0 pt-[3px] font-mono text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-white/60 sm:hidden">
                    {i ? 'Ash' : 'Soot'}
                  </span>
                  <span className="flex min-w-0 items-start gap-1.5">
                    <MarkIcon m={m} />
                    <span>{text}</span>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 flex items-start gap-2 text-[13px] leading-5 text-white/65">
        <ScanSearch size={16} className="mt-0.5 shrink-0 text-[#FF9A33]" aria-hidden="true" />
        <span>None of these can fix a cracked or melted filter. That is why the filter is inspected before it is cleaned.</span>
      </p>
    </section>
  );
}

function CyclesChart() {
  return (
    <figure className="m-0 rounded-xl bg-[#1A1D22] p-4">
      <h3 className="text-lg font-bold text-white">Six drive-and-regen cycles</h3>
      <svg viewBox="0 0 320 100" className="mt-3 block h-auto w-full" role="img" aria-label="Soot rises and falls with every regen while ash only rises">
        <path d="M16 88H304" stroke="#FFF" strokeOpacity=".15" />
        <path
          d="M16 88L56 40L60 88L100 40L104 88L144 40L148 88L188 40L192 88L232 40L236 88L276 40L280 88"
          fill="none" stroke="#FF9A33" strokeWidth="2" strokeLinejoin="round"
        />
        <path d="M16 78H60V72H104V66H148V60H192V54H236V48H280V42" fill="none" stroke="#E4DFD3" strokeWidth="3.5" strokeLinecap="square" />
        <text x="284" y="92" fontSize="12" fontWeight="700" fill="#FF9A33">Soot</text>
        <text x="284" y="46" fontSize="12" fontWeight="700" fill="#E4DFD3">Ash</text>
      </svg>
      <figcaption className="mt-2 text-[13px] leading-5 text-white/65">
        Soot rises and falls with every regen. Ash only rises. Illustration, not measured data.
      </figcaption>
    </figure>
  );
}

function EndLine() {
  return (
    <div className="rounded-xl bg-[#1A1D22] p-4 ring-1 ring-inset ring-[#FF7A00]/30">
      <p className="text-[14px] leading-6 text-white/80">
        Ash only comes out with the filter off. Our off-vehicle clean is water only, flow tested before and after, from £210.
      </p>
      {/* The page's call style: solid orange with black text and icon (8:1; white on this
          orange is only 2.6:1). */}
      <a
        href={PHONE_HREF}
        onClick={trackCall}
        className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A00] px-5 text-[15px] font-bold text-black shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-colors hover:bg-[#FF9500] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1D22] sm:inline-flex sm:w-auto"
      >
        <Phone size={18} aria-hidden="true" />
        {PHONE_TEXT}
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ director */

interface Els {
  unit: Element; floor: Element; chamber: Element; adaptL: Element; adaptR: Element;
  heat: Element; shellheat: Element; water: Element; warm: Element; scan: Element; check: Element;
  burnRect: Element; speckle: Element; arrowsX: Element; arrowsXP: Element; arrowsXW: Element; arrowsW: Element; leaders: Element;
  labels: Element; faces: Element; dose: Element; doseClip: Element; warmClip: Element; warmFront: Element;
  wcO: Element; wcI: Element; frontO: Element; frontW: Element; frontI: Element;
  hoseFlow: Element; drainFlow: Element;
  flow: Element[]; pipeIn: Element[]; pipeOut: Element[]; tints: Element[]; sootS: SVGGElement[]; dosed: Element[];
  lock: Element[]; ember: Element[]; ashX: Element[]; metal: Element[]; ticks: Element[]; rings: Element[];
}

function collect(root: HTMLElement): Els | null {
  const one = (c: string) => root.querySelector(`.dpfx-${c}`);
  const all = (c: string) => Array.from(root.querySelectorAll(`.dpfx-${c}`));
  const single = {
    unit: one('unit'), floor: one('floor'), chamber: one('chamber'), adaptL: one('adapt-l'), adaptR: one('adapt-r'),
    heat: one('heat'), shellheat: one('shellheat'), water: one('water'), warm: one('warm'),
    scan: one('scan'), check: one('check'), burnRect: one('burnrect'), speckle: one('speckle'), arrowsX: one('arrows-x'),
    arrowsXP: one('arrows-xp'), arrowsXW: one('arrows-xw'), arrowsW: one('arrows-w'), leaders: one('leaders'), labels: one('labels'), faces: one('faces'),
    dose: one('dose'), doseClip: one('dosec'), warmClip: one('warmc'), warmFront: one('warmfront'),
    wcO: one('wc-o'), wcI: one('wc-i'), frontO: one('front-o'), frontW: one('front-w'),
    frontI: one('front-i'), hoseFlow: one('hoseflow'), drainFlow: one('drainflow'),
  };
  if (Object.values(single).some((e) => !e)) return null;
  return {
    ...(single as Record<keyof typeof single, Element>),
    flow: all('flow'), pipeIn: all('pipe-in'), pipeOut: all('pipe-out'), tints: all('tint'), sootS: all('soot-s') as SVGGElement[],
    dosed: all('dosed'), lock: all('lock'), ember: all('ember'), ashX: all('ash-x'), metal: all('metal'),
    ticks: all('tick'), rings: all('ringc'),
  };
}

const track = (action: string) => trackEvent('dpf_explainer', { action });
// Inverse eases (power1.inOut, power1.in, power1.out): when the eased picture reaches fraction f.
const invInOut = (f: number) => (f < 0.5 ? Math.sqrt(f / 2) : 1 - Math.sqrt((1 - f) / 2));
const invIn = (f: number) => Math.sqrt(f);
const invOut = (f: number) => 1 - Math.sqrt(1 - f);

type Build = (tl: gsap.core.Timeline, o: number, E: Els, eng: Particles | null) => void;

export default function DpfCutaway() {
  const [s, dispatch] = useReducer(reducer, INIT);
  const [rm, setRm] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const tileRefs = useRef<Partial<Record<TileId, HTMLButtonElement | null>>>({});
  const progRefs = useRef<Partial<Record<TileId, HTMLSpanElement | null>>>({});
  const els = useRef<Els | null>(null);
  const vis = useRef<Vis>({ ...VIS0 });
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const engRef = useRef<Particles | null>(null);
  const rmRef = useRef(false);
  const inViewRef = useRef(true);
  const userPausedRef = useRef(false);
  const stepWaitRef = useRef(false);
  const focusBack = useRef<HTMLElement | null>(null);
  const size = useRef({ w: 0, h: 0 });

  const busy = isBusy(s.mode);

  // Writes the tweened soot, burn front and ash values into the SVG.
  const applyVis = useCallback(() => {
    const E = els.current;
    if (!E) return;
    const v = vis.current;
    const sy = v.soot > 0.004 ? sootScale(v.soot) : 0;
    const tr = `scale(1 ${sy.toFixed(4)})`;
    for (const g of E.sootS) {
      g.setAttribute('transform', tr);
      g.style.display = sy ? '' : 'none';
    }
    const tint = Math.max(0, v.tint).toFixed(4);
    for (const t of E.tints) t.setAttribute('opacity', tint);
    const fx = v.front.toFixed(2);
    E.burnRect.setAttribute('x', fx);
    E.burnRect.setAttribute('width', (420 - v.front).toFixed(2));
    for (const e of E.ember) e.setAttribute('x', fx);
    const ax = `translate(${(ASH_MAX * (1 - v.ash)).toFixed(2)} 0)`;
    for (const g of E.ashX) g.setAttribute('transform', ax);
  }, []);

  // paused = userPaused || off screen || hidden tab. A step pause (reduced motion) holds.
  const syncPause = useCallback(() => {
    const tl = tlRef.current;
    const eng = engRef.current;
    if (userPausedRef.current || !inViewRef.current || document.hidden) {
      tl?.pause();
      eng?.stop();
      return;
    }
    if (tl && !stepWaitRef.current) tl.resume();
    if (!rmRef.current) eng?.start();
  }, []);

  const stopAll = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = null;
    engRef.current?.stop();
    engRef.current?.clear();
  }, []);

  // Same values as the server markup; also caches the SVG transform origins.
  const initVisuals = () => {
    const E = els.current;
    if (!E) return;
    Object.assign(vis.current, VIS0);
    applyVis();
    gsap.set(E.unit, { svgOrigin: '200 152', scaleX: 1, y: 0, opacity: 1 });
    gsap.set(E.floor, { svgOrigin: '200 256', scaleX: 1, opacity: 1 });
    gsap.set([...E.pipeIn, ...E.pipeOut], { x: 0, autoAlpha: 1 });
    gsap.set(E.adaptL, { x: -60, autoAlpha: 0 });
    gsap.set(E.adaptR, { x: 60, autoAlpha: 0 });
    gsap.set([E.chamber, E.heat, E.shellheat, E.water, E.warm, E.arrowsW, E.faces, E.frontO, E.frontW, E.frontI,
      E.hoseFlow, E.drainFlow, E.dose, E.check, ...E.dosed, ...E.lock, ...E.ember, ...E.metal, ...E.rings], { opacity: 0 });
    gsap.set([...E.flow, E.frontO, E.frontW, E.frontI, E.warmFront], { x: 0 });
    gsap.set(E.wcO, { attr: { x: 28, width: 290 } });
    gsap.set(E.wcI, { attr: { x: 86, width: 290 } });
    gsap.set([E.doseClip, E.warmClip], { attr: { width: 0 } });
    gsap.set(E.scan, { x: 72, opacity: 0 });
    gsap.set(E.check, { svgOrigin: '346 152', scale: 1 });
    gsap.set(E.speckle, { x: 0, opacity: 0.5 });
    gsap.set(E.ticks, { x: 0, opacity: 0 });
    gsap.set(E.ember, { attr: { fill: 'url(#dpfx-ember)' } });
    gsap.set(E.rings, { attr: { r: 2 } });
    gsap.set([E.arrowsX, E.arrowsXP, E.arrowsXW], { opacity: 1, attr: { stroke: '#FF9A33', 'stroke-opacity': 0.6 } });
    gsap.set([E.leaders, E.labels], { opacity: 1 });
    // The main layer only ever fades (never visibility: hidden), so the patterns the legend
    // swatches borrow from its defs keep rendering while the close-up is open, and its
    // <desc> stays readable.
    if (mainRef.current) gsap.set(mainRef.current, { scale: 1, opacity: 1, transformOrigin: '50% 66.6%' });
    if (canvasRef.current) gsap.set(canvasRef.current, { opacity: 1 });
    if (closeRef.current) gsap.set(closeRef.current, { scale: 0.7, autoAlpha: 0, transformOrigin: '50% 56%' });
  };

  // Run handlers are plain functions, not contextSafe: every target is an element ref, and
  // a context would keep every finished run's timeline referenced until unmount.
  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    els.current = collect(root);
    initVisuals();
  }, { scope: rootRef });

  useEffect(() => {
    const root = rootRef.current;
    const box = boxRef.current;
    if (!root || !box) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // A real change mid-run finishes that run the way Skip does, so neither the pause
    // controls nor the reduced-motion stepper can be left stuck with no way out.
    const onMq = (ev?: MediaQueryListEvent) => {
      rmRef.current = mq.matches;
      setRm(mq.matches);
      const eng = engRef.current;
      if (mq.matches) {
        eng?.stop();
        eng?.clear();
      }
      const tl = tlRef.current;
      if (!ev || !tl) return;
      userPausedRef.current = false;
      stepWaitRef.current = false;
      dispatch({ type: 'PAUSE', on: false });
      dispatch({ type: 'STEPWAIT', on: false });
      if (eng) eng.mute = true;
      tl.progress(1);
      if (eng) { eng.mute = false; eng.clear(); }
      applyVis();
    };
    onMq();
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else mq.addListener(onMq);

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        inViewRef.current = e.isIntersecting;
        root.classList.toggle('is-visible', e.isIntersecting);
        syncPause();
      }, { threshold: 0.15 });
      io.observe(root);
    } else {
      root.classList.add('is-visible');
    }
    const onVis = () => syncPause();
    document.addEventListener('visibilitychange', onVis);

    const measure = () => {
      size.current = { w: box.clientWidth, h: box.clientHeight };
      engRef.current?.resize(size.current.w, size.current.h);
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(box);
    }

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onMq);
      else mq.removeListener(onMq);
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      stopAll();
    };
  }, [syncPause, stopAll, applyVis]);

  // When the focused Pause, Skip or Next button unmounts at the end of a run, focus goes
  // back to the control that started it. Focus never moves at any other time.
  useEffect(() => {
    if (s.mode !== 'idle' || !focusBack.current) return;
    const el = focusBack.current;
    focusBack.current = null;
    el.focus({ preventScroll: true });
  }, [s.mode]);

  const ensureEngine = () => {
    if (rmRef.current || !canvasRef.current) return null;
    if (!engRef.current) {
      const eng = new Particles(canvasRef.current, vis.current);
      eng.resize(size.current.w, size.current.h);
      engRef.current = eng;
    }
    return engRef.current;
  };

  const P = (tl: gsap.core.Timeline, at: number, p: Partial<S>) => { tl.call(dispatch, [{ type: 'PATCH', p }], at); };
  const V = (tl: gsap.core.Timeline, to: Partial<Vis>, duration: number, ease: string, at: number) => {
    tl.to(vis.current, { ...to, duration, ease, onUpdate: applyVis }, at);
  };
  const settle = (tl: gsap.core.Timeline, E: Els, at: number) => {
    tl.call(() => { vis.current.soot = 0; vis.current.front = 72; applyVis(); }, [], at);
    tl.set(E.speckle, { x: 0 }, at);
  };
  // The SOOT readout follows the burn front, the wash or the drive. The bar slides on to each
  // step value as the (eased) picture gets there, and the word, lamp and labels change when it
  // arrives, so none of them runs ahead of the drawing. inv is the inverse of the picture's ease.
  const rampSoot = (tl: gsap.core.Timeline, at: number, dur: number, from: number, to: number, steps: number,
    inv: (f: number) => number = invInOut) => {
    let t0 = at;
    let w = from;
    for (let i = 1; i <= steps; i++) {
      const ti = at + dur * inv(i / steps);
      const v = Math.round(from + ((to - from) * i) / steps);
      P(tl, t0, { soot: v, sw: w, t: Math.max(0.05, ti - t0) });
      t0 = ti;
      w = v;
    }
    P(tl, t0, { sw: w });
  };

  // On phones and tablets a run can start with the drawing under the floating header or the
  // status down by the call bar and the chat bubble; bring the drawing back to just under the
  // header. Nothing moves when it already fits.
  const keepInView = () => {
    const box = boxRef.current;
    const st = document.getElementById('dpfx-status');
    if (!box || !st || window.innerWidth >= 1024) return;
    const top = box.getBoundingClientRect().top;
    const bottom = st.getBoundingClientRect().bottom;
    if (top >= 72 && bottom <= window.innerHeight - 140) return;
    window.scrollBy({ top: top - 80, behavior: rmRef.current ? 'auto' : 'smooth' });
  };

  // Zoom between the whole filter and the close-up. Inside a run it is part of that
  // run's timeline (0.4s); on its own it lasts 0.6s, or is instant with reduced motion.
  const zoom = (inn: boolean, tl?: gsap.core.Timeline) => {
    const main = mainRef.current;
    const close = closeRef.current;
    if (!main || !close) return;
    // Always kill a standalone zoom still in flight, or it keeps writing over a run's zoom.
    gsap.killTweensOf([main, close]);
    if (!tl && rmRef.current) {
      gsap.set(main, inn ? { scale: 2.4, opacity: 0 } : { scale: 1, opacity: 1 });
      gsap.set(close, inn ? { scale: 1, autoAlpha: 1 } : { scale: 0.7, autoAlpha: 0 });
      return;
    }
    const t = tl ?? gsap.timeline();
    if (inn) {
      t.to(main, { scale: 2.4, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0);
      t.fromTo(close, { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, 0.15);
    } else {
      const d = tl ? 0.4 : 0.6;
      t.to(close, { scale: 0.7, autoAlpha: 0, duration: d * 0.6, ease: 'power2.in' }, 0);
      t.to(main, { scale: 1, opacity: 1, duration: d * 0.75, ease: 'power2.out' }, d * 0.25);
    }
  };

  // Every run: kill the old timeline, clear leftovers, zoom out if needed, fade the labels,
  // build, fade the labels back, END. Reduced motion plays the same timeline at 1000x.
  const launch = (mode: Mode, tile: TileId, dur: number, start: Partial<S>, end: Partial<S>, build: Build, onEnd?: () => void) => {
    const E = els.current;
    if (!E) return;
    tlRef.current?.kill();
    const motion = !rmRef.current;
    const eng = ensureEngine();
    eng?.clear();
    const o = s.close ? 0.4 : 0;
    userPausedRef.current = false;
    stepWaitRef.current = false;
    keepInView();
    dispatch({ type: 'START', p: { mode, ...start } });
    const tl = gsap.timeline({ paused: true });
    if (o) zoom(false, tl);
    // A refusal's standalone lock fade may still be running; stop it before this run's fade.
    gsap.killTweensOf(E.lock);
    tl.to([...E.lock, ...E.ticks], { opacity: 0, duration: 0.2 }, 0);
    // Labels and the channel chevrons make way for the moving particles. The wall crossings stay
    // up, dimmed, while exhaust runs (the particles hop the walls without a mark); the clean
    // hides them. With reduced motion the clean sets its own static arrows.
    tl.to(!motion && mode === 'clean' ? [E.labels, E.leaders, E.arrowsXP] : [E.labels, E.leaders, E.arrowsX, E.arrowsXP], { opacity: 0, duration: 0.2 }, o);
    if (motion || mode !== 'clean') tl.to(E.arrowsXW, { opacity: mode === 'clean' ? 0 : 0.5, duration: 0.2 }, o);
    build(tl, o, E, eng);
    // Gas still in flight fades out before the end, so no end frame has leftovers.
    if (eng) tl.call(() => eng.fade(GAS, 0.3), [], o + dur - 0.35);
    tl.to([E.labels, E.leaders, E.arrowsX, E.arrowsXP, E.arrowsXW], { opacity: 1, duration: 0.3 }, o + dur - 0.3);
    const prog = progRefs.current[tile] ?? null;
    const bar = barRef.current;
    const finish = () => {
      if (tlRef.current !== tl) return;
      tlRef.current = null;
      if (eng) eng.hold = false;
      userPausedRef.current = false;
      stepWaitRef.current = false;
      if (prog) prog.style.transform = '';
      if (bar) bar.style.transform = '';
      const ae = document.activeElement;
      if (ae instanceof HTMLElement && ae.closest('[data-runctl]')) focusBack.current = tileRefs.current[tile] ?? null;
      dispatch({ type: 'END', p: end });
      onEnd?.();
    };
    tl.call(finish, [], o + dur);
    tl.eventCallback('onComplete', finish);
    tl.eventCallback('onUpdate', () => {
      if (tlRef.current !== tl) return;
      const t = `scaleX(${tl.progress().toFixed(4)})`;
      if (prog) prog.style.transform = t;
      if (bar) bar.style.transform = t;
    });
    if (!motion) tl.timeScale(1000);
    if (eng) eng.hold = true;
    tlRef.current = tl;
    tl.play();
    syncPause();
  };

  const runDrive = () => {
    const ns = Math.min(100, s.soot + 25);
    const nw = Math.min(1, s.wallAsh + 0.4);
    const endMsg: Partial<S> = ns > 90 ? { msg: 'driveOver' } : ns >= 60 ? { msg: 'driveHigh' } : {};
    track('drive');
    launch('drive', 'drive', 2.5,
      { badge: 'drive', msg: s.drives >= 1 && ns < 60 ? 'drivePassive' : 'drive' },
      { ...endMsg, drives: s.drives + 1 },
      (tl, o, E, eng) => {
        emit(tl, eng, 'exhaust', 30, 1.4, o + 0.05);
        emit(tl, eng, 'soot', 26, 1.4, o + 0.05);
        emit(tl, eng, 'ashgrain', 3, 1.4, o + 0.05);
        P(tl, o + 0.3, { wallAsh: nw });
        rampSoot(tl, o + 0.3, 1.4, s.soot, ns, 3);
        V(tl, { soot: ns / 100, tint: (TINT_K * ns) / 100 }, 1.4, 'power1.inOut', o + 0.3);
        tl.to(E.speckle, { opacity: nw, duration: 1.4 }, o + 0.3);
      });
  };

  const runRegen = () => {
    const na = Math.min(100, s.ash + Math.round(8 * s.wallAsh));
    track('regen');
    launch('regen', 'regen', 3.5, { badge: 'heat', msg: 'regenRun' }, { recommend: 'ash', ringNonce: s.ringNonce + 1 },
      (tl, o, E, eng) => {
        tl.to(E.heat, { opacity: 1, duration: 0.6, ease: 'power2.out' }, o);
        tl.to(E.shellheat, { opacity: 0.25, duration: 0.6, ease: 'power2.out' }, o);
        V(tl, { front: 314 }, 1.9, 'power1.inOut', o + 0.5);
        V(tl, { tint: 0 }, 1.9, 'none', o + 0.5);
        rampSoot(tl, o + 0.5, 1.9, s.soot, 0, 4);
        tl.to(E.ember, { opacity: 1, duration: 0.2 }, o + 0.5);
        tl.to(E.ember, { opacity: 0, duration: 0.2 }, o + 2.3);
        emit(tl, eng, 'spark', 60, 1.9, o + 0.5);
        emit(tl, eng, 'wisp', 16, 1.9, o + 0.5);
        P(tl, o + 2.5, { badge: 'ashstays', msg: 'regenDone', ash: na, wallAsh: 0, t: 0.6 });
        tl.to(E.speckle, { x: 36, opacity: 0, duration: 0.6, ease: 'power2.in' }, o + 2.5);
        V(tl, { ash: na / 100 }, 0.6, 'power2.out', o + 2.5);
        tl.to([E.heat, E.shellheat], { opacity: 0, duration: 0.5 }, o + 2.7);
        settle(tl, E, o + 3.2);
      });
  };

  // Dose (amber arriving with the exhaust), the drive it still needs, a cooler amber burn, and
  // the ash left behind with a darker band of metal-based ash in front. Each status line stays
  // up for at least 2.5s.
  const runAdditive = () => {
    const w = Math.min(1, s.wallAsh + 0.4);
    const na = Math.min(100, s.ash + Math.round(8 * w) + 1);
    track('additive');
    launch('additive', 'additive', 6, { badge: 'dosed', msg: 'addDose' }, { recommend: 'ash', ringNonce: s.ringNonce + 1 },
      (tl, o, E, eng) => {
        tl.set(E.dose, { opacity: 1 }, o);
        tl.fromTo(E.doseClip, { attr: { width: 0 } }, { attr: { width: 240 }, duration: 1.2, ease: 'power1.out', immediateRender: false }, o + 0.1);
        tl.to(E.dose, { opacity: 0, duration: 1.1, ease: 'power1.in' }, o + 1.4);
        emit(tl, eng, 'dose', 26, 1.1, o);
        emit(tl, eng, 'glint', 18, 1, o + 0.1);
        tl.to(E.dosed, { opacity: 1, duration: 0.8 }, o + 0.4);
        P(tl, o + 1.3, { badge: 'driveneeded' });
        emit(tl, eng, 'exhaust', 26, 1.2, o + 1.3);
        P(tl, o + 2.6, { badge: 'coolburn', msg: 'addBurn' });
        tl.set(E.ember, { attr: { fill: 'url(#dpfx-ember-cool)' } }, o + 2.6);
        tl.to(E.heat, { opacity: 0.4, duration: 0.5 }, o + 2.6);
        V(tl, { front: 314 }, 1.9, 'power1.inOut', o + 2.7);
        V(tl, { tint: 0 }, 1.9, 'none', o + 2.7);
        rampSoot(tl, o + 2.7, 1.9, s.soot, 0, 4);
        tl.to(E.ember, { opacity: 1, duration: 0.2 }, o + 2.7);
        tl.to(E.ember, { opacity: 0, duration: 0.2 }, o + 4.5);
        emit(tl, eng, 'sparkCool', 36, 1.9, o + 2.7);
        emit(tl, eng, 'wisp', 12, 1.9, o + 2.7);
        P(tl, o + 5.1, { badge: 'ashstays', msg: 'addDone', ash: na, wallAsh: 0, metalAsh: true, t: 0.6 });
        tl.to(E.speckle, { x: 36, opacity: 0, duration: 0.6, ease: 'power2.in' }, o + 5.1);
        V(tl, { ash: na / 100 }, 0.6, 'power2.out', o + 5.1);
        tl.to(E.metal, { opacity: 1, duration: 0.6 }, o + 5.1);
        tl.to(E.heat, { opacity: 0, duration: 0.4 }, o + 4.9);
        settle(tl, E, o + 5.7);
        tl.set(E.dosed, { opacity: 0 }, o + 5.7);
        tl.set(E.ember, { attr: { fill: 'url(#dpfx-ember)' } }, o + 5.7);
      });
  };

  // Each cycle peaks at Building (soot 50): an automatic regen that finishes does not light the
  // DPF lamp. Only the ash ratchets up, and the lamp comes on once it reaches Heavy.
  const runCycles = () => {
    track('cycles');
    launch('cycles', 'cycles', 9.4, { badge: 'cycle', cycle: 1, msg: 'cyclesRun' },
      { msg: 'cyclesDone', recommend: 'cycles', ringNonce: s.ringNonce + 1 },
      (tl, o, E, eng) => {
        let a = s.ash;
        for (let n = 1; n <= 6; n++) {
          const t0 = o + 0.2 + 1.5 * (n - 1);
          P(tl, t0, { badge: 'cycle', cycle: n, wallAsh: 0.9 });
          rampSoot(tl, t0, 0.6, n === 1 ? s.soot : 0, 50, 2, invOut);
          V(tl, { soot: 0.5, tint: TINT_K * 0.5 }, 0.6, 'power1.out', t0);
          tl.to(E.speckle, { opacity: 0.9, duration: 0.6 }, t0);
          emit(tl, eng, 'exhaust', 24, 0.6, t0);
          emit(tl, eng, 'soot', 30, 0.6, t0);
          tl.to(E.heat, { opacity: 0.8, duration: 0.15 }, t0 + 0.7);
          rampSoot(tl, t0 + 0.7, 0.55, 50, 0, 2, invIn);
          V(tl, { front: 314 }, 0.55, 'power1.in', t0 + 0.7);
          V(tl, { tint: 0 }, 0.55, 'none', t0 + 0.7);
          tl.to(E.ember, { opacity: 1, duration: 0.1 }, t0 + 0.7);
          tl.to(E.ember, { opacity: 0, duration: 0.1 }, t0 + 1.2);
          emit(tl, eng, 'spark', 70, 0.55, t0 + 0.7);
          a = Math.min(100, a + 7);
          P(tl, t0 + 1.25, { ash: a, wallAsh: 0, t: 0.3 });
          tl.to(E.speckle, { x: 36, opacity: 0, duration: 0.3 }, t0 + 1.25);
          V(tl, { ash: a / 100 }, 0.3, 'power2.out', t0 + 1.25);
          tl.set(E.ticks[n - 1], { x: f2(312 - (ASH_MAX * a) / 100) }, t0 + 1.25);
          tl.to(E.ticks[n - 1], { opacity: 0.9, duration: 0.2 }, t0 + 1.25);
          settle(tl, E, t0 + 1.4);
          tl.to(E.heat, { opacity: 0, duration: 0.1 }, t0 + 1.4);
        }
      });
  };

  const runClean = () => {
    const r = restriction(s.soot, s.ash);
    const before = band(r);
    const soot0 = s.soot / 100;
    const ash0 = s.ash;
    const motion = !rmRef.current;
    // Stage times (s). Every status line stays up for at least 2s (most for 2.5s or more), and a
    // flow test result is only shown once its air has been flowing for a moment.
    const T = {
      scan: 1, check: 2, test1: 2.2, res1: 2.8, s2: 4.8, s3: 7.3, wash: 8.8, impact: 10.4,
      s4: 13, s5: 15.5, turn2: 15.8, test2: 16.6, res2: 18, refit: 19.4, end: 20.5,
    };
    track('off_vehicle_clean');
    launch('clean', 'clean', T.end, { step: 1, badge: 'offveh', msg: 's1a', flowShown: true, ashBefore: s.ash },
      { msg: 'cleaned', soot: 0, ash: 3, wallAsh: 0, metalAsh: false, cleanDone: true, flowShown: true, testing: false, step: 6 },
      (tl, o, E, eng) => {
        // Reduced motion: a user-paced stepper. Pausing just before each boundary shows the
        // end frame of the step; Next plays on into the following one.
        const pause = (t: number) => {
          if (motion) return;
          tl.addPause(o + t - 0.001, () => { stepWaitRef.current = true; dispatch({ type: 'STEPWAIT', on: true }); });
        };
        const pipes = (out: boolean, at: number) => {
          const v = { duration: out ? 0.7 : 0.6, ease: out ? 'power2.in' : 'power2.out', autoAlpha: out ? 0 : 1 };
          tl.to(E.pipeIn, { ...v, x: out ? -40 : 0 }, at);
          tl.to(E.pipeOut, { ...v, x: out ? 40 : 0 }, at);
        };
        // Turning the filter round on the machine: lift it, a quick turn (0.33s) that dips
        // out at its narrowest so no squashed frame ever reads, then set it back down.
        const turn = (at: number, to: 1 | -1) => {
          tl.to(E.unit, { y: -12, duration: 0.25, ease: 'power2.out' }, at);
          tl.to(E.unit, { scaleX: -0.12 * to, duration: 0.15, ease: 'power2.in' }, at + 0.12);
          tl.to(E.unit, { opacity: 0.08, duration: 0.15, ease: 'power1.in' }, at + 0.12);
          tl.set(E.unit, { scaleX: 0.12 * to }, at + 0.27);
          tl.to(E.unit, { scaleX: to, duration: 0.2, ease: 'power2.out' }, at + 0.27);
          tl.to(E.unit, { opacity: 1, duration: 0.2, ease: 'power2.in' }, at + 0.27);
          tl.to(E.unit, { y: -4, duration: 0.3, ease: 'power2.inOut' }, at + 0.47);
        };
        // The water streaks march along the channels: one pattern period (60) per loop, so
        // the streak rect never runs short and each stage picks up seamlessly from 0.
        const flow = (at: number, dur: number, loops: number) => {
          if (!motion) return;
          tl.fromTo(E.flow, { x: 0 }, { x: 60, duration: dur / loops, ease: 'none', repeat: loops - 1, immediateRender: false }, at);
        };
        // Static arrows for reduced motion: white air for the tests, blue water only while water
        // flows, nothing in between, then back to orange.
        const arrows = (at: number, x: number, w: number, white: boolean) => {
          if (motion) return;
          tl.set([E.arrowsX, E.arrowsXW], { opacity: x, attr: { stroke: white ? '#FFFFFF' : '#FF9A33', 'stroke-opacity': white ? 0.85 : 0.6 } }, at);
          tl.set(E.arrowsW, { opacity: w }, at);
        };
        const at = (t: number) => o + t;

        // S1: off the vehicle, checked for cracks, then the flow test before
        arrows(at(0), 0, 0, false);
        pipes(true, at(0));
        tl.to(E.unit, { y: -4, duration: 0.4 }, at(0.2));
        V(tl, { lift: -4 }, 0.4, 'none', at(0.2));
        tl.to(E.floor, { scaleX: 0.92, opacity: 0.7, duration: 0.4 }, at(0.2));
        tl.to(E.chamber, { opacity: 1, duration: 0.6 }, at(0.5));
        P(tl, at(T.scan), { badge: 'inspect' });
        tl.fromTo(E.scan, { x: 72 }, { x: 328, duration: T.check - T.scan, ease: 'power1.inOut', immediateRender: false }, at(T.scan));
        tl.to(E.scan, { opacity: 1, duration: 0.15 }, at(T.scan));
        tl.to(E.scan, { opacity: 0, duration: 0.2 }, at(T.check - 0.1));
        tl.fromTo(E.check, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)', immediateRender: false }, at(T.check));
        tl.to(E.check, { opacity: 0, duration: 0.25 }, at(T.check + 0.75));
        P(tl, at(T.test1), { badge: 'testbefore', testing: true });
        arrows(at(T.test1), 1, 0, true);
        emit(tl, eng, 'air', 36, T.s2 - 0.4 - T.test1, at(T.test1), 260 * (1 - (0.55 * Math.min(r, 100)) / 100));
        P(tl, at(T.res1), { msg: 's1b', flowBefore: before, testing: false });
        // The test air still in flight fades out before the turn, rather than flowing on through
        // a filter that is being turned round.
        if (eng) tl.call(() => eng.fade(['air'], 0.25), [], at(T.s2 - 0.3));
        pause(T.s2);

        // S2: fitted the opposite way round (no water yet, so no water arrows)
        P(tl, at(T.s2), { step: 2, badge: 'reversed', msg: 's2' });
        arrows(at(T.s2), 0, 0, false);
        turn(at(T.s2), -1);
        tl.to(E.faces, { opacity: 1, duration: 0.3 }, at(T.s2 + 0.65));
        tl.to([E.adaptL, E.adaptR], { x: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.4)' }, at(T.s2 + 0.9));
        pause(T.s3);

        // S3: reverse flush, heated water only. Water floods in at the outlet face (left),
        // fills the outlet channels, then the inlet channels through the walls, and leaves
        // at the inlet face (right) for the drain.
        P(tl, at(T.s3), { step: 3, badge: 'prewash', msg: 's3' });
        arrows(at(T.s3), 0, 1, false);
        tl.set(E.water, { opacity: 1 }, at(T.s3));
        tl.fromTo(E.wcO, { attr: { x: 28, width: 0 } }, { attr: { width: 290 }, duration: 0.6, ease: 'power1.out', immediateRender: false }, at(T.s3));
        tl.fromTo(E.wcI, { attr: { x: 86, width: 0 } }, { attr: { width: 290 }, duration: 0.6, ease: 'power1.out', immediateRender: false }, at(T.s3 + 0.3));
        tl.to(E.hoseFlow, { opacity: 0.9, duration: 0.3 }, at(T.s3));
        tl.to(E.drainFlow, { opacity: 1, duration: 0.3 }, at(T.s3 + 0.5));
        if (motion) {
          tl.fromTo([E.hoseFlow, E.drainFlow], { attr: { 'stroke-dashoffset': 0 } },
            { attr: { 'stroke-dashoffset': -240 }, duration: T.s4 - T.s3, ease: 'none', immediateRender: false }, at(T.s3));
        }
        const half = Math.round(s.soot / 2);
        // Loosened soot is shown only in proportion to what was there to wash out.
        const mk = soot0 / 0.45;
        flow(at(T.s3), T.wash - T.s3, 3);
        V(tl, { soot: soot0 / 2, tint: (TINT_K * soot0) / 2 }, T.wash - T.s3, 'power1.inOut', at(T.s3));
        rampSoot(tl, at(T.s3), T.wash - T.s3, s.soot, half, 2);
        if (soot0 >= 0.03) emit(tl, eng, 'murk', Math.round(24 * mk), T.wash - T.s3 - 0.2, at(T.s3 + 0.2));
        P(tl, at(T.wash), { badge: 'wash' });
        flow(at(T.wash), T.impact - T.wash, 5);
        V(tl, { soot: 0, tint: 0 }, T.impact - T.wash, 'power1.inOut', at(T.wash));
        rampSoot(tl, at(T.wash), T.impact - T.wash, half, 0, 3);
        tl.to(E.speckle, { opacity: 0, duration: T.impact - T.wash, ease: 'power1.inOut' }, at(T.wash));
        if (soot0 >= 0.03) emit(tl, eng, 'murk', Math.round(36 * mk), T.impact - T.wash, at(T.wash));
        emit(tl, eng, 'flake', 4, T.impact - T.wash, at(T.wash));
        P(tl, at(T.impact), { badge: 'impact' });
        flow(at(T.impact), T.s4 - T.impact, 4);
        // Impact bursts: one pressure pulse down every outlet channel at once (with a ripple
        // where it enters), pushed through the walls, then down every inlet channel. It
        // breaks ash off the plug end and carries it out of the inlet face to the drain.
        [0.15, 0.85, 1.55].forEach((d, i) => {
          const tb = at(T.impact + d);
          const left = i === 2 ? 3 : Math.max(3, Math.round(ash0 * (i === 0 ? 0.55 : 0.2)));
          if (motion) {
            tl.fromTo(E.rings, { opacity: 0.9, attr: { r: 2 } }, { opacity: 0, attr: { r: 14 }, duration: 0.5, ease: 'power2.out', immediateRender: false }, tb);
            tl.fromTo(E.frontO, { x: 40, opacity: 1 }, { x: 322, duration: 0.42, ease: 'power2.out', immediateRender: false }, tb);
            tl.to(E.frontO, { opacity: 0, duration: 0.12 }, tb + 0.34);
            tl.fromTo(E.frontW, { x: 78, opacity: 0.95 }, { x: 318, duration: 0.42, ease: 'power2.out', immediateRender: false }, tb + 0.03);
            tl.to(E.frontW, { opacity: 0, duration: 0.12 }, tb + 0.37);
            tl.fromTo(E.frontI, { x: 88, opacity: 1 }, { x: 376, duration: 0.55, ease: 'power1.out', immediateRender: false }, tb + 0.08);
            tl.to(E.frontI, { opacity: 0, duration: 0.14 }, tb + 0.52);
          }
          burstAt(tl, eng, 'bubble', 34, tb);
          burstAt(tl, eng, 'flake', 14, tb);
          P(tl, tb + 0.1, { ash: left, t: 0.35 });
          V(tl, { ash: left / 100 }, 0.35, 'power3.out', tb + 0.1);
        });
        tl.to(E.metal, { opacity: 0, duration: 0.3 }, at(T.impact + 0.95));
        pause(T.s4);

        // S4: hot-air dry. The water drains out ahead of the hot air, from the outlet face (left)
        // across to the inlet face; a warm front sweeps after it, white air streaks run along the
        // channels in the same direction, and steam wisps rise off the inlet face.
        P(tl, at(T.s4), { step: 4, badge: 'dry', msg: 's4' });
        arrows(at(T.s4), 0, 0, false);
        if (eng) tl.call(() => eng.cull('bubble'), [], at(T.s4));
        tl.to(E.wcO, { attr: { x: 318, width: 0 }, duration: 0.9, ease: 'power1.in' }, at(T.s4));
        tl.to(E.wcI, { attr: { x: 376, width: 0 }, duration: 0.9, ease: 'power1.in' }, at(T.s4 + 0.25));
        tl.to([E.hoseFlow, E.drainFlow], { opacity: 0, duration: 0.5 }, at(T.s4));
        tl.set(E.water, { opacity: 0 }, at(T.s4 + 1.2));
        tl.set(E.warm, { opacity: 1 }, at(T.s4 + 0.2));
        tl.fromTo(E.warmClip, { attr: { width: 0 } }, { attr: { width: 256 }, duration: 1.6, ease: 'power1.inOut', immediateRender: false }, at(T.s4 + 0.2));
        tl.fromTo(E.warmFront, { x: 0, opacity: 1 }, { x: 256, duration: 1.6, ease: 'power1.inOut', immediateRender: false }, at(T.s4 + 0.2));
        tl.to(E.warmFront, { opacity: 0, duration: 0.3 }, at(T.s4 + 1.7));
        emit(tl, eng, 'airRev', 40, T.s5 - T.s4 - 0.6, at(T.s4 + 0.2), 240);
        emit(tl, eng, 'steam', 7, T.s5 - T.s4 - 0.9, at(T.s4 + 0.6));
        if (eng) tl.call(() => eng.fade(['airRev', 'steam'], 0.3), [], at(T.s5 - 0.3));
        pause(T.s5);

        // S5: turned back round and flow tested again, the same way as before; the result
        // shows once the test air has been flowing for a moment.
        P(tl, at(T.s5), { step: 5, badge: 'testafter', msg: 's5a' });
        tl.to(E.adaptL, { x: -60, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, at(T.s5));
        tl.to(E.adaptR, { x: 60, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, at(T.s5));
        tl.to(E.faces, { opacity: 0, duration: 0.3 }, at(T.s5));
        tl.to(E.warm, { opacity: 0, duration: 0.4 }, at(T.s5));
        turn(at(T.turn2), 1);
        P(tl, at(T.test2), { testing: true });
        arrows(at(T.test2), 1, 0, true);
        emit(tl, eng, 'air', 50, T.refit - 0.5 - T.test2, at(T.test2), 300);
        P(tl, at(T.res2), { flowAfter: 'OK', testing: false, msg: 's5' });
        if (eng) tl.call(() => eng.fade(['air'], 0.3), [], at(T.refit - 0.3));
        pause(T.refit);

        // Refit
        P(tl, at(T.refit), { step: 6, badge: 'refit' });
        arrows(at(T.refit), 1, 0, false);
        tl.to(E.chamber, { opacity: 0, duration: 0.6 }, at(T.refit));
        pipes(false, at(T.refit));
        tl.to(E.unit, { y: 0, duration: 0.6 }, at(T.refit));
        V(tl, { lift: 0 }, 0.6, 'none', at(T.refit));
        tl.to(E.floor, { scaleX: 1, opacity: 1, duration: 0.6 }, at(T.refit));
        tl.set([E.warmClip, E.doseClip], { attr: { width: 0 } }, at(T.refit));
        tl.set(E.wcO, { attr: { x: 28, width: 290 } }, at(T.refit));
        tl.set(E.wcI, { attr: { x: 86, width: 290 } }, at(T.refit));
      },
      () => track('clean_done'));
  };

  const refuse = (kind: 'regen' | 'additive') => {
    const E = els.current;
    const el = tileRefs.current[kind];
    if (el && !rmRef.current) {
      gsap.killTweensOf(el);
      // The tile's CSS transition on transform would damp every frame of the shake.
      gsap.set(el, { transition: 'none' });
      gsap.to(el, {
        keyframes: [{ x: -5 }, { x: 5 }, { x: -4 }, { x: 4 }, { x: -2 }, { x: 0 }].map((k) => ({ ...k, duration: 0.06 })),
        ease: 'none',
        onComplete: () => { gsap.set(el, { clearProps: 'transform,transition' }); },
      });
    }
    if (s.close) zoom(false);
    dispatch({ type: 'REFUSE', msg: kind === 'regen' ? 'refused' : 'addRefused' });
    if (E) {
      if (rmRef.current) gsap.set(E.lock, { opacity: 0.6 });
      else gsap.to(E.lock, { opacity: 0.6, duration: 0.4 });
    }
    track(`${kind}_refused`);
  };

  const onDrive = () => {
    if (busy || s.soot > 90) return;
    runDrive();
  };

  const onBurn = (kind: 'regen' | 'additive') => {
    if (busy) return;
    if (s.soot > 90) { refuse(kind); return; }
    if (s.soot < 8) {
      if (s.close) zoom(false);
      dispatch({ type: 'MSG', msg: kind === 'regen' ? 'regenEmpty' : 'addEmpty' });
      track(`${kind}_empty`);
      return;
    }
    if (kind === 'regen') runRegen();
    else runAdditive();
  };

  const onClean = () => {
    if (busy) return;
    runClean();
  };

  const onCycles = () => {
    if (busy) return;
    if (s.soot > 90) {
      if (s.close) zoom(false);
      dispatch({ type: 'MSG', msg: 'cyclesBlocked' });
      return;
    }
    runCycles();
  };

  const onLook = () => {
    if (busy) return;
    if (!s.close) track('look_closer');
    zoom(!s.close);
    dispatch({ type: 'CLOSE' });
  };

  const onReset = () => {
    const E = els.current;
    if (busy || !E) return;
    track('reset');
    tlRef.current?.kill();
    engRef.current?.clear();
    const zoomed = s.close;
    dispatch({ type: 'PATCH', p: { mode: 'reset', close: false, coach: false } });
    const tl = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: 'power2.inOut' } });
    if (zoomed) zoom(false, tl);
    tl.to(vis.current, { ...VIS0, onUpdate: applyVis }, 0)
      .to(E.unit, { scaleX: 1, y: 0, opacity: 1 }, 0)
      .to(E.floor, { scaleX: 1, opacity: 1 }, 0)
      .to([...E.pipeIn, ...E.pipeOut], { x: 0, autoAlpha: 1 }, 0)
      .to(E.adaptL, { x: -60, autoAlpha: 0 }, 0)
      .to(E.adaptR, { x: 60, autoAlpha: 0 }, 0)
      .to([E.chamber, E.heat, E.shellheat, E.water, E.warm, E.scan, E.check, E.faces, E.arrowsW, E.frontO, E.frontW, E.frontI,
        E.hoseFlow, E.drainFlow, E.dose, ...E.dosed, ...E.lock, ...E.ember, ...E.metal, ...E.ticks, ...E.rings], { opacity: 0 }, 0)
      .to(E.speckle, { x: 0, opacity: 0.5 }, 0)
      .to([E.arrowsX, E.arrowsXP, E.arrowsXW, E.leaders, E.labels], { opacity: 1 }, 0)
      .set([E.arrowsX, E.arrowsXP, E.arrowsXW], { attr: { stroke: '#FF9A33', 'stroke-opacity': 0.6 } }, 0)
      .set(E.ember, { attr: { fill: 'url(#dpfx-ember)' } }, 0.6)
      .set(E.scan, { x: 72 }, 0.6)
      .set(E.ticks, { x: 0 }, 0.6)
      .set(E.rings, { attr: { r: 2 } }, 0.6)
      .set([E.warmFront], { x: 0 }, 0.6)
      .set([E.warmClip, E.doseClip], { attr: { width: 0 } }, 0.6)
      .set(E.wcO, { attr: { x: 28, width: 290 } }, 0.6)
      .set(E.wcI, { attr: { x: 86, width: 290 } }, 0.6);
    const finish = () => {
      if (tlRef.current !== tl) return;
      tlRef.current = null;
      dispatch({ type: 'RESET' });
    };
    tl.call(finish, [], 0.6);
    tl.eventCallback('onComplete', finish);
    if (rmRef.current) tl.timeScale(1000);
    userPausedRef.current = false;
    stepWaitRef.current = false;
    tlRef.current = tl;
    tl.play();
    syncPause();
  };

  const onPause = () => {
    const on = !s.userPaused;
    userPausedRef.current = on;
    dispatch({ type: 'PAUSE', on });
    if (on) track('pause');
    syncPause();
  };

  const onSkip = () => {
    const tl = tlRef.current;
    if (!tl) return;
    track('skip');
    const eng = engRef.current;
    if (eng) eng.mute = true;
    stepWaitRef.current = false;
    tl.progress(1); // passes the step pauses and fires every callback, END included
    if (eng) { eng.mute = false; eng.clear(); }
    applyVis();
  };

  const onNext = () => {
    if (!tlRef.current || !s.stepWait) return;
    stepWaitRef.current = false;
    dispatch({ type: 'STEPWAIT', on: false });
    syncPause();
  };

  const longRun = s.mode === 'clean' || s.mode === 'cycles';
  const ctl: CtlMode = !busy ? 'look' : longRun ? (rm ? (s.mode === 'clean' ? 'next' : 'none') : 'pause') : 'none';
  const finishNext = s.step === 5 && s.stepWait;
  const badgeMax = ctl === 'none' ? 'calc(100% - 1rem)'
    : ctl === 'pause' ? 'calc(100% - 7rem)'
      : ctl === 'next' ? (finishNext ? 'calc(100% - 9.5rem)' : 'calc(100% - 8.75rem)')
        : s.close ? 'calc(100% - 7rem)' : 'calc(100% - 9rem)';
  const activeStep = s.mode === 'clean' && s.step >= 1 && s.step <= 5 ? s.step : 0;
  const doneSteps = s.mode === 'clean' ? Math.max(0, Math.min(5, s.step - 1)) : s.cleanDone ? 5 : 0;

  return (
    <div ref={rootRef} className="dpfx overflow-hidden rounded-2xl border border-white/5 bg-[#111317] sm:p-6 md:rounded-[2rem] lg:p-8">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
        <div className="lg:col-span-7">
          <div ref={boxRef} className="relative aspect-[400/280] overflow-hidden bg-[#0C0E11] sm:rounded-xl sm:border sm:border-white/5">
            <div ref={mainRef} className="absolute inset-0">
              <svg viewBox="0 0 400 280" className="absolute inset-0 h-full w-full" role="img" aria-labelledby="dpfx-title dpfx-desc">
                <title id="dpfx-title">Cutaway of a diesel particulate filter</title>
                <desc id="dpfx-desc">{descText(s)}</desc>
                <DrawingBody />
              </svg>
              <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
              <DrawingLabels soot={s.sw} ash={s.ash} />
              <FaceLabels />
            </div>
            <div ref={closeRef} className="dpfx-close invisible absolute inset-0 opacity-0" data-on={s.close ? 'true' : 'false'}>
              <CloseUp soot={s.soot} wallAsh={s.wallAsh} rm={rm} />
            </div>
            <Badge id={s.badge} cycle={s.cycle} rm={rm} maxW={badgeMax} />
            <OverlayControls
              ctl={ctl} close={s.close} paused={s.userPaused} finish={finishNext} waiting={s.stepWait}
              onLook={onLook} onPause={onPause} onSkip={onSkip} onNext={onNext}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 p-3 sm:mt-4 sm:gap-3 sm:p-0 lg:col-span-5 lg:mt-0">
          <Status s={s} barRef={barRef} />
          <Strip s={s} />
          <div role="group" aria-label="DPF explainer controls" className="flex flex-col gap-2 sm:gap-3">
            <Tiles
              s={s} busy={busy} tileRefs={tileRefs} progRefs={progRefs}
              onDrive={onDrive} onRegen={() => onBurn('regen')} onAdditive={() => onBurn('additive')} onClean={onClean}
            />
            <Secondary s={s} busy={busy} onCycles={onCycles} onReset={onReset} tileRefs={tileRefs} />
          </div>
        </div>
      </div>

      <div className="mt-3 px-3 pb-5 sm:mt-6 sm:px-0 sm:pb-0 lg:mt-8">
        <Legend />
        <Steps active={activeStep} done={doneSteps} />
        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Compare />
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:items-start lg:col-span-5 lg:grid-cols-1">
            <CyclesChart />
            <EndLine />
          </div>
        </div>
      </div>
    </div>
  );
}
