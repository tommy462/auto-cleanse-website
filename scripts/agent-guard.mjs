#!/usr/bin/env node
/**
 * The gate for the website improvement agent's changes (docs/insights-agent.md).
 * .github/workflows/agent-ship.yml runs THIS copy from main against a pull
 * request, and merges it only if this passes and the site builds. The agent can
 * run it too, but it cannot change the copy that decides: scripts/ is outside
 * what it may edit.
 *
 *   node scripts/agent-guard.mjs --repo <dir> --base <sha|ref> --head <sha|ref> --branch claude/insights-...
 *
 * It allows only content edits (page data, page components, blog posts, the
 * sitemap dates) and checks every added line against Tom's copy rules: no new
 * prices, phone numbers, emails, links, percentages or banned claims, and no
 * code beyond plain content. A phrase the file already had is fine where the
 * change only carries it over (it is counted, not just matched). An undo branch
 * passes when it is exactly a revert of an earlier change. Exit 1 on any
 * problem, with one line per problem.
 */
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MAX_ADDED = 400;
export const MAX_REMOVED = 400;
export const MAX_FILES = 40;
export const MAX_LASTMOD_LINES = 45;

const BRANCH = /^claude\/(insights|undo)-[a-z0-9._-]{1,80}$/;
const LASTMOD = 'scripts/page-lastmod.json';
const ALLOWED_FILES = [
  /^src\/data\/(vehicle-remapping|remapping-locations|dpf-locations)\.ts$/,
  /^src\/data\/adblue-guides\/[a-z0-9-]+\.ts$/,
  /^content\/blog\/[a-z0-9-]+\.md$/,
  /^src\/pages\/[A-Za-z0-9]+\.tsx$/,
  /^scripts\/page-lastmod\.json$/,
];
// Pages that are templates for many URLs, take payments or personal details, set prices, quote reviews or are legal text.
const DENIED_PAGES = new Set([
  'AdBlueGuide', 'AdBlueTown', 'BlogIndex', 'BlogPost', 'BookNow', 'BookingCancel', 'BookingSuccess', 'Contact', 'CookiePolicy',
  'DPFCleaningLocation', 'DVLADiagnostic', 'DiagnosticMatcher', 'DynamicPage', 'FuelSavingsCalculator', 'Maintenance', 'NotFound',
  'Pricing', 'Privacy', 'RefundPolicy', 'RemapTown', 'RemappingBooking', 'RemappingLocation', 'ReviewsPage', 'Terms', 'TradeInvite',
  'VehiclePerformanceLookup', 'VehicleRemap',
]);

// The only prices a change may introduce (as published, see the playbook). Others must already be in the file.
const ALLOWED_PRICES = new Set(['50', '210', '230', '250', '270', '299']);
const OWN_PHONE = new Set(['07823649190', '447823649190']);
const OWN_EMAIL = 'info@auto-cleanse.co.uk';

/** Phrases a change may not add (beyond what the file already has). Matched case-insensitively unless noted. */
const BANNED = [
  ['98 percent claim', /98\s?%/gi],
  ['guarantee', /guarante/gi],
  ['24/7', /\b24\s?\/\s?7\b/gi],
  ['no fix no fee', /no[\s-]fix,?\s*no[\s-]fee/gi],
  ['lifetime warranty', /lifetime warrant/gi],
  ['nationwide', /nationwide/gi],
  ['free diagnosis', /free diagnos/gi],
  ['trusted by', /trusted by/gi],
  ['thousands/hundreds of', /\b(thousands|hundreds) of\b/gi],
  ['years of experience', /years'?\s+(of\s+)?experience/gi],
  ['award', /award/gi],
  ['cheapest / best / number one', /\b(cheapest|best in|number one|no\.?\s?1\b|#\s?1\b)/gi],
  ['air flushing', /\b(air[\s-]flush|pneumatic)/gi],
  ['delete or removal of emissions kit', /\b(delete|deleted|deletes|emulator|(dpf|egr|adblue|scr|nox)\s*(removal|off\b|blank|bypass))/gi],
  ['claims to write ECU files', /\b(we|our team)\s+(write|writes|wrote|develop|create|build)\b[^.]{0,40}\b(file|map|software|tune)/gi],
  ['naming the national network', /\bMET\b(?!clean)/g],
  ['brand spelling (use Auto-Cleanse)', /\bAutoCleanse\b|\bAuto Cleanse\b(?! Services)/g],
  ['em or en dash', new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`, 'g')],
];
/** Phrases allowed only when the same line also carries the qualifier. */
const QUALIFIED = [
  ['same day without "where possible"', /same[\s-]day/i, /where possible/i],
  ['mobile DPF cleaning offered', /mobile\s+dpf/i, /\b(no|not|never|don't|doesn't|isn't|cannot|can't)\b/i],
  ['chemicals', /chemical/i, /\b(no|without|free of|not)\b[^.]{0,20}chemical|chemical[\s-]free/i],
];
/** Code that has no place in a content edit. */
const CODE = [
  ['import from a package', /^\s*import\b(?!.*\bfrom\s+['"](react-router-dom|\.{1,2}\/[^'"]*)['"])/],
  ['runs code', /\b(fetch|eval|Function|setTimeout|setInterval|require|useEffect|useState|useRef|useMemo|useCallback)\s*\(/],
  ['page scripting', /dangerouslySetInnerHTML|innerHTML|\bdocument\.|\bwindow\.|localStorage|sessionStorage|process\.env|import\.meta|<script|<iframe|<form|javascript:/i],
  ['event handler', /\bon[A-Z][A-Za-z]+\s*=\s*\{/],
];

const count = (re, lines) => lines.reduce((n, l) => n + (l.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`)) ?? []).length, 0);
const digits = (s) => s.replace(/\D/g, '');

/**
 * Checks one change. files: [{ path, status ('A'|'M'|'D'|'R...'), added: string[], removed: string[] }].
 * Returns a list of problems (empty = allowed).
 */
export function checkChange({ branch, files, isRevert = false }) {
  const problems = [];
  const bad = (path, rule, text) => problems.push(`${path}: ${rule}${text ? `: ${String(text).trim().slice(0, 140)}` : ''}`);
  if (!BRANCH.test(branch ?? '')) bad('branch', 'must be claude/insights-... or claude/undo-...', branch);
  if (!files.length) bad('change', 'is empty');
  if (files.length > MAX_FILES) bad('change', `touches ${files.length} files (max ${MAX_FILES})`);

  let added = 0;
  let removed = 0;
  for (const f of files) {
    const page = /^src\/pages\/([A-Za-z0-9]+)\.tsx$/.exec(f.path)?.[1];
    if (!ALLOWED_FILES.some((re) => re.test(f.path)) || (page && DENIED_PAGES.has(page))) {
      bad(f.path, 'is not a file the agent may change');
      continue;
    }
    if (f.status !== 'M') {
      bad(f.path, 'files may only be edited, not added, deleted or renamed', f.status);
      continue;
    }
    if (f.path === LASTMOD) {
      const lines = [...f.added, ...f.removed];
      if (f.added.length > MAX_LASTMOD_LINES) bad(f.path, `changes ${f.added.length} pages' dates (max ${MAX_LASTMOD_LINES})`);
      for (const l of lines) if (!/^\s*"\/[a-z0-9\-/._~%]*": \["\d{4}-\d{2}-\d{2}", ?"[0-9a-f]{6,64}"\],?\s*$/i.test(l)) bad(f.path, 'only page dates may change', l);
      continue;
    }
    added += f.added.length;
    removed += f.removed.length;
    // A revert puts back text that was live before; its copy was checked when it was first written.
    if (isRevert) continue;

    for (const l of f.added) {
      for (const [rule, re] of CODE) if (re.test(l)) bad(f.path, rule, l);
      for (const m of l.matchAll(/https?:\/\/[^\s'"`)<>]+/gi)) {
        if (!/^https:\/\/www\.auto-cleanse\.co\.uk(\/|$)/i.test(m[0])) bad(f.path, 'links outside the site', m[0]);
      }
      // Protocol-relative addresses (//host) leave the site too.
      for (const m of l.matchAll(/['"`(=]\s*(\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s'"`)<>]*)/gi)) bad(f.path, 'links outside the site', m[1]);
      for (const m of l.matchAll(/\b(?:href|to)\s*=\s*\{?\s*['"`]([^'"`]*)/g)) {
        const t = m[1];
        if (!((t.startsWith('/') && !t.startsWith('//')) || t.startsWith('#') || t === `mailto:${OWN_EMAIL}` || OWN_PHONE.has(digits(t)) || /^https:\/\/www\.auto-cleanse\.co\.uk/i.test(t))) bad(f.path, 'link target', t);
      }
      for (const m of l.matchAll(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g)) if (m[0].toLowerCase() !== OWN_EMAIL) bad(f.path, 'email address', m[0]);
      for (const m of l.matchAll(/(?:\+44\s?\(?0?\)?|\b0)\d[\d\s-]{8,12}\d/g)) if (!OWN_PHONE.has(digits(m[0]))) bad(f.path, 'phone number', m[0]);
      if (f.path.startsWith('content/blog/') && /^(date|slug|draft|published|cover|coverAlt)\s*:/.test(l)) bad(f.path, 'blog dates, slugs and covers stay as they are', l);
    }

    // Prices and percentages: allowed ones, or ones the file already had in the lines being replaced.
    const prices = (lines) => lines.flatMap((l) => [...l.matchAll(/£\s?(\d[\d,]*(?:\.\d+)?)/g)].map((m) => m[1].replace(/,/g, '')));
    const before = prices(f.removed);
    const national = f.path.startsWith('src/data/adblue-guides/');
    for (const p of prices(f.added)) {
      const i = before.indexOf(p);
      if (i >= 0) before.splice(i, 1);
      else if (national || !ALLOWED_PRICES.has(p)) bad(f.path, national ? 'national AdBlue pages show no prices' : 'price not in the published price list', `£${p}`);
    }
    const pct = (lines) => lines.flatMap((l) => [...l.matchAll(/\d+(?:\.\d+)?\s?%/g)].map((m) => m[0].replace(/\s/g, '')));
    const pctBefore = pct(f.removed);
    for (const p of pct(f.added)) {
      const i = pctBefore.indexOf(p);
      if (i >= 0) pctBefore.splice(i, 1);
      else bad(f.path, 'new percentage (no invented statistics)', p);
    }

    for (const [rule, re] of BANNED) {
      if (count(re, f.added) > count(re, f.removed)) bad(f.path, rule, f.added.find((l) => new RegExp(re.source, re.flags.replace('g', '')).test(l)));
    }
    for (const [rule, re, needs] of QUALIFIED) {
      const unq = (lines) => lines.filter((l) => re.test(l) && !needs.test(l));
      if (unq(f.added).length > unq(f.removed).length) bad(f.path, rule, unq(f.added)[0]);
    }
  }
  if (added > MAX_ADDED) bad('change', `adds ${added} lines (max ${MAX_ADDED})`);
  if (removed > MAX_REMOVED) bad('change', `removes ${removed} lines (max ${MAX_REMOVED})`);
  return problems;
}

/* ── Reading the change from git ─────────────────────────────────────────── */

const git = (repo, args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/** Added and removed lines per file between the merge base and head (as a pull request shows them). */
export function readChange(repo, base, head) {
  const mb = git(repo, ['merge-base', base, head]).trim();
  const files = git(repo, ['diff', '--name-status', '--no-renames', mb, head]).trim().split('\n').filter(Boolean).map((l) => {
    const [status, path] = l.split('\t');
    return { path, status: status[0], added: [], removed: [] };
  });
  for (const f of files) {
    if (f.status !== 'M') continue;
    const patch = git(repo, ['diff', '-U0', '--no-color', mb, head, '--', f.path]);
    for (const l of patch.split('\n')) {
      if (l.startsWith('+++') || l.startsWith('---')) continue;
      if (l.startsWith('+')) f.added.push(l.slice(1));
      else if (l.startsWith('-')) f.removed.push(l.slice(1));
    }
  }
  return { mb, files };
}

const patchId = (repo, diff) => {
  if (!diff.trim()) return '';
  return execFileSync('git', ['-C', repo, 'patch-id', '--stable'], { input: diff, encoding: 'utf8' }).split(' ')[0];
};

/**
 * True when the change is exactly the undo of an earlier change on main: each
 * commit says "This reverts commit X", and the change (sitemap dates aside)
 * equals X's own change backwards.
 */
export function isExactRevert(repo, mb, head) {
  const shas = git(repo, ['log', '--format=%B%x00', `${mb}..${head}`]).split('\0').map((b) => /This reverts commit ([0-9a-f]{7,40})/.exec(b)?.[1]).filter(Boolean);
  if (shas.length !== 1) return false;
  const target = shas[0];
  try {
    git(repo, ['merge-base', '--is-ancestor', target, mb]);
  } catch {
    return false;
  }
  const parents = git(repo, ['rev-list', '--parents', '-n', '1', target]).trim().split(' ');
  const exclude = ['--', '.', `:(exclude)${LASTMOD}`];
  const undo = git(repo, ['diff', '--no-color', mb, head, ...exclude]);
  const original = git(repo, ['diff', '--no-color', target, parents[1], ...exclude]);
  return Boolean(undo.trim()) && patchId(repo, undo) === patchId(repo, original);
}

function main() {
  const arg = (name) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : undefined;
  };
  const repo = arg('repo') ?? '.';
  const base = arg('base');
  const head = arg('head') ?? 'HEAD';
  const branch = arg('branch');
  if (!base || !branch) {
    console.error('usage: node scripts/agent-guard.mjs --repo <dir> --base <ref> --head <ref> --branch claude/...');
    process.exit(2);
  }
  const { mb, files } = readChange(repo, base, head);
  let isRevert = false;
  if (branch.startsWith('claude/undo-')) {
    isRevert = isExactRevert(repo, mb, head);
    if (!isRevert) {
      console.log('agent-guard: an undo branch must be exactly a revert of an earlier change');
      process.exit(1);
    }
  }
  const problems = checkChange({ branch, files, isRevert });
  const summary = files.map((f) => `${f.path} (+${f.added.length} -${f.removed.length})`).join(', ');
  if (problems.length) {
    console.log(`agent-guard: STOPPED (${problems.length} problem${problems.length === 1 ? '' : 's'}) in ${summary}`);
    for (const p of problems) console.log(`  - ${p}`);
    process.exit(1);
  }
  console.log(`agent-guard: OK${isRevert ? ' (exact revert)' : ''}: ${summary}`);
}

if (process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])) main();
