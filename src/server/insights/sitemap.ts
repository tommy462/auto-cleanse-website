// The public sitemaps are the page registry: every URL the site wants in
// Google, and the date its text last changed (the build only moves <lastmod>
// when a page's title, description or main text changes - scripts/prerender.mjs).
// Robots.txt lists the sitemaps, so a new one is picked up without a code change.

import { classifyPath, normaliseUrl } from './classify.js';
import type { PageInfo, SitemapPage } from './types.js';

async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'AutoCleanseInsights/1.0' } });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

export function parseSitemap(xml: string, sitemap: string, canonicalHost: string): SitemapPage[] {
  const out: SitemapPage[] = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(m[1])?.[1];
    const lastmod = /<lastmod>\s*(\d{4}-\d{2}-\d{2})/.exec(m[1])?.[1] ?? null;
    const n = loc ? normaliseUrl(loc, canonicalHost) : null;
    if (n && !n.host) out.push({ path: n.path, lastmod, sitemap });
  }
  return out;
}

export async function loadSitemaps(baseUrl: string, canonicalHost: string): Promise<(SitemapPage & PageInfo)[]> {
  const robots = await fetchText(`${baseUrl}/robots.txt`).catch(() => '');
  const urls = [...robots.matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  if (!urls.length) urls.push(`${baseUrl}/sitemap.xml`);
  const byPath = new Map<string, SitemapPage>();
  for (const u of urls.slice(0, 10)) {
    const name = u.split('/').pop() ?? u;
    for (const p of parseSitemap(await fetchText(u), name, canonicalHost)) {
      const prev = byPath.get(p.path);
      // A page listed in a specialised sitemap keeps that membership (it drives classification).
      if (!prev || prev.sitemap === 'sitemap.xml') byPath.set(p.path, { ...p, lastmod: p.lastmod ?? prev?.lastmod ?? null });
    }
  }
  if (byPath.size < 10) throw new Error(`Sitemaps listed only ${byPath.size} URLs; refusing to treat that as the whole site`);
  return [...byPath.values()].map((p) => ({ ...p, ...classifyPath(p.path, p.sitemap) }));
}

/** HEAD-checks up to `limit` URLs (no redirects followed) and returns their status codes. */
export async function checkStatuses(baseUrl: string, paths: string[], limit = 20): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const p of paths.slice(0, limit)) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10_000);
      const res = await fetch(`${baseUrl}${p}`, { method: 'HEAD', redirect: 'manual', signal: ctrl.signal });
      clearTimeout(t);
      out[p] = res.status;
    } catch {
      // unreachable: leave it out rather than guess
    }
  }
  return out;
}

