// The one canonical origin for the whole site. Every canonical, og:url and
// twitter:url is built from this, so no page can emit a non-WWW URL.
//
// The apex (auto-cleanse.co.uk) 301s to this host - see vercel.json - so the
// WWW form is the only URL that should ever appear in markup or the sitemap.
export const SITE_URL = 'https://www.auto-cleanse.co.uk';

/**
 * Normalises a route path into the site's single canonical URL form:
 * WWW host, no trailing slash (except the root), no query string or fragment.
 *
 * Pages pass a plain path (e.g. "/audi-a3-remap"); this defends against a page
 * passing a full URL, a non-WWW URL, a missing leading slash or a trailing one,
 * so a mistake in one page can never produce a duplicate canonical.
 */
export function canonicalUrl(path = ''): string {
  let p = path.trim();
  // Accept (and normalise) a full URL as well as a bare path.
  p = p.replace(/^https?:\/\/(?:www\.)?auto-cleanse\.co\.uk/i, '');
  // Canonicals never carry a query string or fragment.
  p = p.split(/[?#]/)[0];
  if (p && !p.startsWith('/')) p = `/${p}`;
  // Strip the trailing slash so /about and /about/ share one canonical.
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return `${SITE_URL}${p}`;
}
