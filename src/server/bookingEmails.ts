// Booking emails via Resend - one to the business, one to the customer.
// Uses the same RESEND_API_KEY the technical bulletin already uses.
//
// Env (all optional, sensible defaults):
//   BOOKING_NOTIFY_EMAIL  where new-booking alerts go       (default info@auto-cleanse.co.uk)
//   BOOKING_FROM_EMAIL    the From address, must be on a     (default AutoCleanse <bookings@auto-cleanse.co.uk>)
//                         domain verified in Resend

import { Resend } from 'resend';
import type { BookingMetadata } from './bookingProcessing.js';
import { COMPANY } from '../data/business.js';
import { DEPOSIT_NOTICE_HOURS } from '../data/legal.js';
import { SITE_URL } from '../lib/site-url.js';

const DEFAULT_NOTIFY = 'info@auto-cleanse.co.uk';
const DEFAULT_FROM = 'AutoCleanse <bookings@auto-cleanse.co.uk>';

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] ?? c));
}

function rows(pairs: Array<[string, string | null | undefined]>): { text: string; html: string } {
  const kept = pairs.filter((p): p is [string, string] => Boolean(p[1]));
  const width = Math.max(...kept.map(([k]) => k.length));
  const text = kept.map(([k, v]) => `${k.padEnd(width)}  ${v}`).join('\n');
  const html = kept
    .map(([k, v]) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
      `<td style="padding:6px 0;color:#111">${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('');
  return { text, html: `<table style="border-collapse:collapse;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif">${html}</table>` };
}

export interface BookingEmailContext {
  m: BookingMetadata;
  sessionId: string;
  paymentIntent: string | null;
  jobId: string | null;
}

/** Sends the internal alert and the customer confirmation. Throws on the first failure. */
export async function sendBookingEmails(ctx: BookingEmailContext): Promise<{ business: string | null; customer: string | null }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  const resend = new Resend(apiKey);

  const { m, sessionId, paymentIntent, jobId } = ctx;
  const isMobile = m.booking_type === 'mobile';
  const from = process.env.BOOKING_FROM_EMAIL ?? DEFAULT_FROM;
  const notify = process.env.BOOKING_NOTIFY_EMAIL ?? DEFAULT_NOTIFY;
  const service = m.service_label || m.service_type;
  const vehicle = `${m.vehicle_make_model} (${m.vehicle_reg})`;

  // ── Business alert ────────────────────────────────────────────────────────
  const biz = rows([
    ['Booking ref', m.booking_ref],
    ['When', m.slot_display],
    ['Service', service],
    ['Type', isMobile ? 'MOBILE - we go to the customer' : 'WORKSHOP - customer comes to us'],
    ['Customer', m.customer_name],
    ['Phone', m.customer_phone],
    ['Email', m.customer_email],
    ['Vehicle', vehicle],
    ['Address', isMobile ? `${m.address}` : null],
    ['Add-ons', m.selected_options || null],
    ['Goals', m.goals],
    ['Notes', m.notes || null],
    ['Quoted', m.quoted_price ? `£${m.quoted_price} (£50 deposit paid, balance on the day)` : '£50 deposit paid'],
    ['Dashboard job', jobId ?? 'NOT CREATED - check Vercel logs'],
    ['Stripe', `https://dashboard.stripe.com/payments/${paymentIntent ?? sessionId}`],
  ]);

  const bizSubject = `New remap booking: ${m.customer_name} - ${m.vehicle_reg} - ${m.slot_display}`;
  const bizRes = await resend.emails.send({
    from,
    to: [notify],
    replyTo: m.customer_email,
    subject: bizSubject,
    text: `${bizSubject}\n\n${biz.text}\n`,
    html: `<h2 style="font:600 18px -apple-system,Segoe UI,Roboto,sans-serif;color:#111">${esc(bizSubject)}</h2>${biz.html}`,
  });
  if (bizRes.error) throw new Error(`business email: ${bizRes.error.message}`);

  // ── Customer confirmation ─────────────────────────────────────────────────
  const cust = rows([
    ['Booking ref', m.booking_ref],
    ['When', m.slot_display],
    ['Service', service],
    ['Vehicle', vehicle],
    ['Where', isMobile ? `We'll come to you: ${m.address}` : 'Our workshop - please bring the vehicle with a full tank of fuel'],
    ['Add-ons', m.selected_options || null],
    ['Deposit', '£50 paid - remaining balance due on the day'],
  ]);

  const custSubject = `Booking confirmed - ${service} on ${m.slot_display}`;
  const firstName = m.customer_name.split(/\s+/)[0] || 'there';
  const intro = `Hi ${firstName},\n\nThanks for booking with AutoCleanse - your £50 deposit has been received and your slot is confirmed.`;
  const outro = `We may call before the appointment to confirm vehicle details and any preparation needed.\n\nNeed to change anything? Reply to this email or call us on 07823 649190.\n\nAutoCleanse\nwww.auto-cleanse.co.uk`;

  // Cancellation terms on a durable medium, as the Consumer Contracts
  // Regulations 2013 require for bookings made online. Mirrors /refund-policy.
  const terms = [
    `Cancelling or moving: give us at least ${DEPOSIT_NOTICE_HOURS} hours' notice before your appointment and we'll refund your £50 deposit in full, or move your booking for free. With less notice, or if you don't turn up, we keep the deposit.`,
    `Your right to cancel: if you booked as a private customer, you can also cancel within 14 days of booking and get everything back, as long as the work hasn't been done. To cancel, reply to this email or call us.`,
    m.terms_accepted
      ? `When you booked, you agreed to our terms, asked us to do the work on your booked date and confirmed that once the work is done you can no longer cancel.`
      : '',
    `Terms & Conditions: ${SITE_URL}/terms\nCancellation & Refund Policy: ${SITE_URL}/refund-policy`,
    `AutoCleanse is a trading name of ${COMPANY.legalName}, registered in ${COMPANY.registeredIn}, company no. ${COMPANY.companyNumber}. Registered office: ${COMPANY.registeredOffice}.`,
  ].filter(Boolean).join('\n\n');

  const custRes = await resend.emails.send({
    from,
    to: [m.customer_email],
    replyTo: notify,
    subject: custSubject,
    text: `${intro}\n\n${cust.text}\n\n${outro}\n\n${terms}\n`,
    html:
      `<div style="font:14px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#111;max-width:560px">` +
      `<p>${esc(intro).replace(/\n\n/g, '</p><p>')}</p>${cust.html}<p>${esc(outro).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>` +
      `<div style="margin-top:20px;padding-top:12px;border-top:1px solid #ddd;font-size:12px;color:#555"><p>${esc(terms).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p></div></div>`,
  });
  if (custRes.error) throw new Error(`customer email: ${custRes.error.message}`);

  return { business: bizRes.data?.id ?? null, customer: custRes.data?.id ?? null };
}
