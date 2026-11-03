// /api/insights - one function for the website insights engine (the Hobby
// plan allows 12 functions, so the three jobs share one file):
//
//   GET  (Vercel Cron, Authorization: Bearer CRON_SECRET)
//        The daily run. vercel.json fires it at 07:00 UTC (Hobby: some time in
//        that hour): 7-8am UK in winter, 8-9am in summer. Vercel keeps one
//        schedule per path, so a second, earlier trigger is not possible here.
//        It never works before 7am UK, and the database claim stops a repeat
//        trigger from processing the same day twice.
//   POST (Authorization: Bearer CRON_SECRET) {"task": "daily" | "weekly", "force"?: true}
//        Manual run from a terminal.
//   POST (no auth, from the site's own pages) {"e":"lead_submitted", ...}
//        Counts a successful enquiry-form submission. No cookies, nothing
//        stored on the visitor's device, no IP address or personal details
//        stored: only the page, form, service and traffic source.
//
// Env: CRON_SECRET (Vercel generates the Authorization header from it),
// AUTOCLEANSE_SUPABASE_URL / _SERVICE_KEY, and the INSIGHTS_* variables
// documented in docs/website-insights.md.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'node:crypto';
import { runDaily } from '../src/server/insights/pipeline.js';
import { ukNow } from '../src/server/insights/dates.js';
import { insertIgnore } from '../src/server/insights/store.js';
import { sb } from '../src/server/supabase.js';

const SITE = 'auto-cleanse';
const ALLOWED_ORIGINS = ['https://www.auto-cleanse.co.uk', 'https://auto-cleanse.co.uk'];
const DAILY_LEAD_CAP = 300;

function authorised(req: VercelRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.authorization ?? '';
  if (!secret || secret.length < 16) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ── Lead counter ─────────────────────────────────────────────────────────── */

const hits = new Map<string, { n: number; at: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.at > 60_000) { hits.set(ip, { n: 1, at: now }); return false; }
  h.n++;
  return h.n > 5;
}

const str = (v: unknown, max: number, re?: RegExp) => {
  if (typeof v !== 'string') return null;
  const s = v.trim().slice(0, max);
  return s && (!re || re.test(s)) ? s : null;
};
const PATH = /^\/[a-z0-9\-/._~%]*$/i;

async function recordLead(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin ?? '';
  if (origin && !ALLOWED_ORIGINS.includes(origin) && !/^http:\/\/localhost:\d+$/.test(origin)) {
    return res.status(403).json({ ok: false });
  }
  // Vercel sets x-forwarded-for itself; the first entry is the client. Used only in memory, never stored.
  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ ok: false });

  let body: Record<string, unknown> = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    return res.status(400).json({ ok: false });
  }
  const allowed = new Set(['e', 'id', 'f', 's', 'p', 'l', 'r', 'c', 'us', 'um', 'uc', 'd', 'k']);
  if (Object.keys(body).some((k) => !allowed.has(k)) || body.e !== 'lead_submitted') return res.status(400).json({ ok: false });
  const id = str(body.id, 40, /^[a-z0-9-]{8,40}$/i);
  const page = str(body.p, 300, PATH);
  if (!id || !page) return res.status(400).json({ ok: false });

  const since = `${ukNow().date}T00:00:00Z`;
  const today = await sb<{ id: number }[]>(`/web_conversions?site_id=eq.${SITE}&source=eq.website&occurred_at=gte.${since}&select=id&limit=${DAILY_LEAD_CAP + 1}`, { method: 'GET' });
  if ((today?.length ?? 0) > DAILY_LEAD_CAP) return res.status(429).json({ ok: false });

  await insertIgnore('web_conversions', [{
    site_id: SITE,
    occurred_at: new Date().toISOString(),
    event: 'lead_submitted',
    source: 'website',
    page_path: page,
    landing_path: str(body.l, 300, PATH),
    channel: str(body.c, 40, /^[a-z_ ]+$/i),
    referrer_host: str(body.r, 100, /^[a-z0-9.-]+$/i),
    utm_source: str(body.us, 100),
    utm_medium: str(body.um, 100),
    utm_campaign: str(body.uc, 100),
    service: str(body.s, 60),
    form: str(body.f, 40, /^[a-z0-9_-]+$/i),
    device: ['mobile', 'tablet', 'desktop'].includes(String(body.d)) ? body.d : null,
    consent: ['granted', 'denied'].includes(String(body.k)) ? body.k : 'unknown',
    dedupe_key: `web:${id}`,
  }], 'site_id,dedupe_key');
  return res.status(204).end();
}

/* ── Handler ──────────────────────────────────────────────────────────────── */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      if (!authorised(req)) return res.status(401).json({ error: 'Unauthorised' });
      const uk = ukNow();
      if (uk.hour < 7 && req.query.force !== '1') {
        return res.status(200).json({ status: 'skipped', reason: `UK time is ${uk.hour}:xx; the run waits for 7am` });
      }
      const result = await runDaily({ trigger: 'cron', force: req.query.force === '1' });
      return res.status(200).json(result);
    }
    if (req.method === 'POST') {
      if (req.headers.authorization) {
        if (!authorised(req)) return res.status(401).json({ error: 'Unauthorised' });
        const task = (req.body ?? {}).task;
        if (task !== 'daily' && task !== 'weekly') return res.status(400).json({ error: 'task must be daily or weekly' });
        const result = await runDaily({ trigger: 'manual', force: Boolean(req.body.force), weekly: task === 'weekly' });
        return res.status(200).json(result);
      }
      return await recordLead(req, res);
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('[insights]', e instanceof Error ? e.message : e);
    return res.status(500).json({ error: 'Insights run failed; see the Vercel log and web_runs.' });
  }
}
