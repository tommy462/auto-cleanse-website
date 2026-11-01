// Business outcomes: jobs from the dashboard database and deposits from
// Stripe. Only counts, values and traffic-source fields leave this file:
// no names, emails, phone numbers or registrations are read into the
// analytics tables.

import Stripe from 'stripe';
import { sb } from '../supabase.js';
import { addDays } from './dates.js';

const ukDay = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date(iso));

export interface BusinessDay { date: string; service_category: string; jobs_created: number; jobs_done: number; revenue_done: number; website_bookings: number }

async function paged<T>(path: string): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < 50_000; from += 1000) {
    const rows = await sb<T[]>(`${path}&limit=1000&offset=${from}`, { method: 'GET' });
    out.push(...(rows ?? []));
    if (!rows || rows.length < 1000) break;
  }
  return out;
}

/** Jobs created (by UK day) and done (by job date), per service category. */
export async function businessDaily(from: string, to: string): Promise<BusinessDay[]> {
  const created = await paged<{ id: string; created_at: string; service_category: string | null }>(
    `/jobs?select=id,created_at,service_category&created_at=gte.${from}T00:00:00Z&created_at=lt.${addDays(to, 1)}T12:00:00Z&order=id`);
  // The website booking code stamps "Stripe session: cs_..." into internal_notes; the filter runs in
  // the database so the notes themselves (which can hold customer text) are never read here.
  const web = await paged<{ id: string }>(
    `/jobs?select=id&internal_notes=like.*Stripe%20session*&created_at=gte.${from}T00:00:00Z&order=id`);
  const webIds = new Set(web.map((w) => w.id));
  const done = await paged<{ id: string; job_date: string; quoted_price: number | string | null; service_category: string | null }>(
    `/jobs?select=id,job_date,quoted_price,service_category&status=in.(completed,invoiced,paid)&job_date=gte.${from}&job_date=lte.${to}&order=id`);
  const map = new Map<string, BusinessDay>();
  const row = (date: string, cat: string | null) => {
    const c = (cat || 'Other').slice(0, 40);
    const k = `${date}|${c}`;
    let r = map.get(k);
    if (!r) { r = { date, service_category: c, jobs_created: 0, jobs_done: 0, revenue_done: 0, website_bookings: 0 }; map.set(k, r); }
    return r;
  };
  for (const j of created) {
    const d = ukDay(j.created_at);
    if (d < from || d > to) continue;
    const r = row(d, j.service_category);
    r.jobs_created++;
    if (webIds.has(j.id)) r.website_bookings++;
  }
  for (const j of done) {
    const r = row(j.job_date, j.service_category);
    r.jobs_done++;
    r.revenue_done += Number(j.quoted_price) || 0;
  }
  return [...map.values()];
}

export interface ConversionRow {
  occurred_at: string;
  event: 'lead_submitted' | 'checkout_started' | 'deposit_paid';
  source: 'website' | 'stripe';
  page_path: string | null;
  landing_path: string | null;
  channel: string | null;
  referrer_host: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  service: string | null;
  form: string | null;
  device: 'mobile' | 'tablet' | 'desktop' | null;
  value: number | null;
  consent: 'granted' | 'denied' | 'unknown';
  dedupe_key: string;
}

const clean = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const cleanPath = (v: unknown) => {
  const s = clean(v, 300);
  return s && s.startsWith('/') ? s.split(/[?#]/)[0] : null;
};

/**
 * Checkout sessions from Stripe: every session is a booking started, a paid one
 * is a deposit. Attribution comes from the attr_* metadata the booking page adds
 * (create-checkout); sessions from before that existed simply have none.
 */
export async function stripeConversions(from: string, to: string): Promise<ConversionRow[]> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not set');
  const stripe = new Stripe(key);
  const gte = Math.floor(Date.parse(`${from}T00:00:00Z`) / 1000) - 3600;
  const lte = Math.floor(Date.parse(`${addDays(to, 1)}T00:00:00Z`) / 1000) + 3600;
  const out: ConversionRow[] = [];
  for await (const s of stripe.checkout.sessions.list({ created: { gte, lte }, limit: 100 })) {
    const m = (s.metadata ?? {}) as Record<string, string>;
    // Only the website's remap deposit sessions (they carry a booking_ref).
    if (!m.booking_ref) continue;
    const base = {
      source: 'stripe' as const,
      page_path: cleanPath(m.attr_page) ?? '/remapping-booking',
      landing_path: cleanPath(m.attr_landing),
      channel: clean(m.attr_channel, 40),
      referrer_host: clean(m.attr_ref, 100),
      utm_source: clean(m.attr_utm_source, 100),
      utm_medium: clean(m.attr_utm_medium, 100),
      utm_campaign: clean(m.attr_utm_campaign, 100),
      service: clean(m.service_type, 60),
      form: 'remap_booking',
      device: (['mobile', 'tablet', 'desktop'].includes(m.attr_device) ? m.attr_device : null) as ConversionRow['device'],
      consent: (['granted', 'denied'].includes(m.attr_consent) ? m.attr_consent : 'unknown') as ConversionRow['consent'],
    };
    const at = new Date(s.created * 1000).toISOString();
    out.push({ ...base, occurred_at: at, event: 'checkout_started', value: null, dedupe_key: `stripe-start:${s.id}` });
    if (s.payment_status === 'paid') {
      out.push({ ...base, occurred_at: at, event: 'deposit_paid', value: (s.amount_total ?? 0) / 100, dedupe_key: `stripe-paid:${s.id}` });
    }
  }
  return out;
}
