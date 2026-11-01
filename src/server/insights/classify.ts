// URL normalisation and page grouping for Auto-Cleanse. Grouping turns 1,600
// near-identical pages into a dozen kinds of page, so the engine can say "the
// remap town pages under-perform" once instead of 447 times.

import type { PageInfo } from './types.js';

export interface NormalisedUrl {
  path: string;
  /** '' when the URL was on the canonical host, otherwise the host it was on */
  host: string;
}

/**
 * Accepts a full URL (Search Console, Clarity) or a bare path (GA4) and returns
 * a clean path: no query string or fragment, no trailing slash (except "/"),
 * lower-case, percent-decoded where safe.
 */
export function normaliseUrl(raw: string, canonicalHost: string): NormalisedUrl | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed === '(not set)' || trimmed === '(other)') return null;
  let host = '';
  let path = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      host = u.hostname.toLowerCase() === canonicalHost ? '' : u.hostname.toLowerCase();
      path = u.pathname;
    } catch {
      return null;
    }
  } else {
    path = trimmed.split(/[?#]/)[0];
  }
  try {
    path = decodeURIComponent(path);
  } catch {
    // keep the raw path if it is not valid percent-encoding
  }
  path = path.toLowerCase().replace(/\/{2,}/g, '/');
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/, '');
  if (path.length > 300) path = path.slice(0, 300);
  return { path, host };
}

const DPF_HUBS = new Set([
  '/dpf-cleaning', '/dpf-cleaning-near-me', '/dpf-cleaning-devon', '/postal-dpf', '/blocked-dpf-cleaning-devon',
  '/dpf-diagnostics-devon', '/why-clean', '/how-it-works', '/maintenance',
]);
const ECU_HUBS = new Set([
  '/ecu-remapping', '/ecu-remapping-locations', '/ecu-remapping/areas', '/stage-1-remaps-devon', '/mobile-ecu-remapping-devon',
  '/petrol-remapping-devon', '/diesel-remapping-devon', '/van-remapping-devon', '/fleet-vehicle-remapping-devon',
  '/4x4-remapping-devon', '/vehicle-performance-lookup', '/ecu-cloning',
]);
const ADBLUE_HUBS = new Set(['/adblue-repair', '/adblue-repair-devon', '/adblue-repair/areas']);
const BOOKING = new Set(['/remapping-booking', '/book', '/pricing', '/how-we-quote']);
const CONTACT = new Set(['/contact', '/about', '/reviews', '/services']);
const LEGAL = new Set(['/privacy', '/terms', '/cookie-policy', '/refund-policy']);
const UTILITY = new Set(['/booking-success', '/booking-cancel', '/diagnostic-matcher', '/debug/dvla', '/404']);

/** Title-cases a slug fragment: "newton-abbot" -> "Newton Abbot". */
function place(slug: string): string {
  return slug.split('-').map((w) => (w.length <= 2 && w !== 'st' ? w : w[0].toUpperCase() + w.slice(1))).join(' ');
}

/**
 * Sitemap membership is the most reliable signal for the two big national
 * sets, so the collector passes it in when it knows it.
 */
export function classifyPath(path: string, sitemap?: string): PageInfo {
  const p = path;
  const out = (group: string, service: string | null, pageType: string, location: string | null = null): PageInfo =>
    ({ path: p, group, service, location, pageType });

  if (p === '/') return out('home', null, 'home');
  if (sitemap?.includes('adblue-towns')) return out('adblue-town', 'adblue', 'town', place(p.split('/').pop() ?? ''));
  if (sitemap?.includes('remap-towns')) return out('ecu-national-town', 'ecu', 'town', place(p.split('/').pop() ?? ''));
  if (LEGAL.has(p)) return out('legal', null, 'legal');
  if (UTILITY.has(p)) return out('utility', null, 'utility');
  if (BOOKING.has(p)) return out('booking', p === '/remapping-booking' || p === '/book' ? 'ecu' : null, 'booking');
  if (CONTACT.has(p)) return out('contact', null, 'contact');
  if (p === '/blog' || p.startsWith('/blog/')) return out('blog', null, p === '/blog' ? 'index' : 'article');
  if (p === '/partners' || p === '/trade-file-service' || p.startsWith('/trade-invite')) return out('trade', null, 'trade');
  if (DPF_HUBS.has(p)) return out('dpf-hub', 'dpf', 'service');
  let m = /^\/dpf-cleaning-([a-z-]+)$/.exec(p);
  if (m) return out('dpf-town', 'dpf', 'town', place(m[1]));
  if (ECU_HUBS.has(p)) return out('ecu-hub', 'ecu', 'service');
  m = /^\/ecu-remapping-([a-z-]+)$/.exec(p);
  if (m) return out('ecu-devon-town', 'ecu', 'town', place(m[1]));
  m = /^\/ecu-remapping\/([a-z-]+)$/.exec(p);
  if (m) return out('ecu-national-town', 'ecu', 'town', place(m[1]));
  if (ADBLUE_HUBS.has(p)) return out('adblue-hub', 'adblue', 'service');
  if (/^\/adblue-(countdown|warning|delete|fault-codes)/.test(p) || /^\/adblue-repair\/(nox-sensor|peugeot-citroen-vauxhall-adblue-tank)$/.test(p)) {
    return out('adblue-guide', 'adblue', 'guide');
  }
  m = /^\/adblue-repair\/([a-z-]+)$/.exec(p);
  if (m) return out('adblue-town', 'adblue', 'town', place(m[1]));
  if (/^\/[a-z0-9-]+-remap$/.test(p)) return out('vehicle', 'ecu', 'vehicle');
  return out('other', null, 'other');
}

/** Rough search intent of a query, for spotting a query that lands on the wrong kind of page. */
export function queryService(q: string): 'dpf' | 'ecu' | 'adblue' | null {
  const s = q.toLowerCase();
  if (/\b(dpf|diesel particulate|particulate filter|regen)/.test(s)) return 'dpf';
  if (/\b(adblue|ad blue|scr|nox|p20ee|p20e8|p204f|def fluid)/.test(s)) return 'adblue';
  if (/\b(remap|remapping|ecu|chip tun|tuning|stage 1|stage 2|bhp)/.test(s)) return 'ecu';
  return null;
}

export function isBrandQuery(q: string): boolean {
  return /auto[\s-]?cleanse|autocleanse/i.test(q);
}
