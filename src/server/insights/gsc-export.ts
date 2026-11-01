// Reads a Search Console "Export > Download CSV" folder (Chart.csv, Pages.csv,
// Queries.csv, Devices.csv) so the engine can work on real history before the
// API is connected. Exports are coarser than the API: page and query totals
// for the whole period (no daily split per page, no query-to-page link), so
// findings built from them are marked data_source 'export'.

import Papa from 'papaparse';
import { classifyPath, normaliseUrl } from './classify.js';
import { daysBetween, isValidDay, rangeLabel } from './dates.js';
import type { AnalysisWindow, PageWindow, QueryRow, SitemapPage } from './types.js';

type Row = Record<string, string>;
const parse = (csv: string): Row[] => Papa.parse<Row>(csv.replace(/^\uFEFF/, ''), { header: true, skipEmptyLines: true }).data;
const num = (s: string | undefined) => {
  const n = Number(String(s ?? '').replace(/[%,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export interface ExportData {
  window: AnalysisWindow;
  siteDaily: { date: string; clicks: number; impressions: number; position: number }[];
  pages: PageWindow[];
  queries: QueryRow[];
  devices: { device: string; clicks: number; impressions: number; position: number }[];
}

export function readExport(files: { chart: string; pages: string; queries?: string; devices?: string }, canonicalHost: string, sitemap: (SitemapPage & { group: string })[]): ExportData {
  const chart = parse(files.chart)
    .map((r) => ({ date: r.Date, clicks: num(r.Clicks), impressions: num(r.Impressions), position: num(r.Position) }))
    .filter((r) => isValidDay(r.date))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!chart.length) throw new Error('Chart.csv has no dated rows');
  const from = chart[0].date;
  const to = chart[chart.length - 1].date;
  const days = daysBetween(from, to) + 1;
  const window: AnalysisWindow = { from, to, prevFrom: from, prevTo: from, days, label: rangeLabel(from, to) };

  const sm = new Map(sitemap.map((p) => [p.path, p]));
  const pages = new Map<string, PageWindow & { posW: number }>();
  const get = (path: string) => {
    let p = pages.get(path);
    if (!p) {
      const s = sm.get(path);
      p = {
        path, group: s?.group ?? classifyPath(path).group, clicks: 0, impressions: 0, position: null, posW: 0, mobileImpressions: 0,
        otherHostImpressions: 0, prevClicks: null, prevImpressions: null, prevPosition: null, sessions: null, engagedSessions: null,
        engagementSeconds: null, mobileSessions: null, mobileEngaged: null, views: null, leads: null, phoneClicks: null,
        whatsappClicks: null, bookingStarts: null, deposits: null, clarity: null, inSitemap: Boolean(s), contentChangedOn: s?.lastmod ?? null,
      };
      pages.set(path, p);
    }
    return p;
  };
  for (const s of sitemap) get(s.path);
  for (const r of parse(files.pages)) {
    const url = r['Top pages'] ?? r.Page ?? Object.values(r)[0];
    const n = normaliseUrl(url, canonicalHost);
    if (!n) continue;
    const p = get(n.path);
    const impressions = num(r.Impressions);
    p.clicks += num(r.Clicks);
    p.impressions += impressions;
    p.posW += num(r.Position) * impressions;
    if (n.host) p.otherHostImpressions += impressions;
  }
  const out = [...pages.values()].map(({ posW, ...p }) => ({ ...p, position: p.impressions ? Math.round((posW / p.impressions) * 100) / 100 : null }));

  const queries: QueryRow[] = files.queries
    ? parse(files.queries).map((r) => ({
      query: (r['Top queries'] ?? r.Query ?? Object.values(r)[0] ?? '').slice(0, 300),
      path: '', clicks: num(r.Clicks), impressions: num(r.Impressions), position: num(r.Position),
    })).filter((q) => q.query)
    : [];
  const devices = files.devices
    ? parse(files.devices).map((r) => ({ device: r.Device, clicks: num(r.Clicks), impressions: num(r.Impressions), position: num(r.Position) }))
    : [];
  return { window, siteDaily: chart, pages: out, queries, devices };
}
