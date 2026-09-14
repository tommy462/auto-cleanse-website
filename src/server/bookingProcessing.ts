// Post-payment processing for remap bookings.
//
// Once a Stripe Checkout Session is paid, this:
//   1. Creates the job in the AutoCleanse dashboard (Supabase) - idempotent
//   2. Fires the Make.com webhook for email/SMS notifications
//   3. Creates a Google Calendar event, if Google credentials are configured
//
// Called from /api/stripe-webhook (primary) and /api/booking-details (fallback,
// in case the webhook is misconfigured or delayed). The dashboard job is the
// idempotency anchor: the Stripe session id is stored in the job's internal_notes
// and looked up before anything is created.

import type Stripe from 'stripe';
import { google } from 'googleapis';
import { createDashboardJob, findJobByMarker } from './dashboardJob.js';
import { isSupabaseConfigured } from './supabase.js';

// Same Make.com scenario the site has always used for booking notifications.
const DEFAULT_MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/uw0b9gab1m4qdj1zhs4m4mkkn9kt5fva';

/** Metadata keys written by /api/create-checkout and read back here. */
export type BookingMetadata = {
  booking_ref: string;
  service_type: string;
  service_label: string;
  booking_type: string;         // 'workshop' | 'mobile'
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_reg: string;
  vehicle_make_model: string;
  goals: string;
  notes: string;
  address: string;              // '' for workshop
  postcode: string;             // '' for workshop
  selected_options: string;     // comma-separated
  quoted_price: string;         // e.g. '349'
  job_date: string;             // YYYY-MM-DD
  job_time: string;             // HH:MM
  slot_start: string;           // ISO
  slot_end: string;             // ISO
  slot_display: string;         // human readable
};

const METADATA_KEYS: Array<keyof BookingMetadata> = [
  'booking_ref', 'service_type', 'service_label', 'booking_type', 'customer_name', 'customer_email',
  'customer_phone', 'vehicle_reg', 'vehicle_make_model', 'goals', 'notes', 'address', 'postcode',
  'selected_options', 'quoted_price', 'job_date', 'job_time', 'slot_start', 'slot_end', 'slot_display',
];

export function readBookingMetadata(session: Stripe.Checkout.Session): BookingMetadata {
  const raw = (session.metadata ?? {}) as Partial<BookingMetadata>;
  const out = {} as BookingMetadata;
  for (const k of METADATA_KEYS) out[k] = raw[k] ?? '';
  return out;
}

function splitOptions(csv: string): string[] {
  return csv ? csv.split(',').map((o) => o.trim()).filter(Boolean) : [];
}

export interface ProcessResult {
  jobId: string | null;
  alreadyProcessed: boolean;
  errors: string[];
}

/** Has the dashboard job for this session already been created? */
export async function isSessionProcessed(sessionId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    return (await findJobByMarker(sessionId)) !== null;
  } catch {
    return false;
  }
}

export async function processPaidSession(
  session: Stripe.Checkout.Session,
  source: 'stripe-webhook' | 'booking-details-fallback',
): Promise<ProcessResult> {
  const m = readBookingMetadata(session);
  const errors: string[] = [];
  const isMobile = m.booking_type === 'mobile';
  const paymentIntent = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id ?? null;

  // ── 1. Dashboard job (idempotent) ─────────────────────────────────────────
  let jobId: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const existingJobId = await findJobByMarker(session.id);
      if (existingJobId) {
        console.log(`[booking] ${session.id} already processed (job ${existingJobId}) - skipping`);
        return { jobId: existingJobId, alreadyProcessed: true, errors };
      }
      const created = await createDashboardJob({
        customerName: m.customer_name,
        customerEmail: m.customer_email,
        customerPhone: m.customer_phone || null,
        vehicleRegistration: m.vehicle_reg,
        vehicleMakeModel: m.vehicle_make_model || null,
        serviceType: m.service_type || null,
        serviceLabel: m.service_label || null,
        bookingType: m.booking_type || null,
        address: isMobile ? m.address || null : null,
        postcode: isMobile ? m.postcode || null : null,
        goals: m.goals || null,
        notes: m.notes || null,
        selectedOptions: splitOptions(m.selected_options),
        quotedPrice: m.quoted_price ? Number(m.quoted_price) : null,
        jobDate: m.job_date,
        jobTime: m.job_time,
        sourceNote: [
          'Booked via website. £50 deposit paid via Stripe.',
          `Booking ref: ${m.booking_ref}`,
          `Stripe session: ${session.id}`,
          paymentIntent ? `Payment intent: ${paymentIntent}` : null,
        ].filter(Boolean).join('\n'),
      });
      jobId = created.jobId;
      console.log(`[booking] Dashboard job ${jobId} created for ${m.booking_ref} (${source})`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[booking] Dashboard job creation failed:', msg);
      errors.push(`dashboard: ${msg}`);
    }
  } else {
    errors.push('dashboard: Supabase not configured');
  }

  // ── 2. Make.com notification ──────────────────────────────────────────────
  const makeUrl = process.env.MAKE_WEBHOOK_URL ?? DEFAULT_MAKE_WEBHOOK_URL;
  try {
    const res = await fetch(makeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'remap_booking_confirmed',
        source,
        timestamp: new Date().toISOString(),
        bookingRef: m.booking_ref,
        stripeSessionId: session.id,
        paymentIntent,
        depositPaid: true,
        depositAmount: '£50',
        dashboardJobId: jobId,
        customerName: m.customer_name,
        customerEmail: m.customer_email,
        customerPhone: m.customer_phone,
        serviceType: m.service_type,
        serviceLabel: m.service_label,
        bookingType: m.booking_type,
        vehicleRegistration: m.vehicle_reg,
        vehicleMakeModel: m.vehicle_make_model,
        goals: m.goals,
        notes: m.notes || null,
        address: isMobile ? m.address || null : null,
        postcode: isMobile ? m.postcode || null : null,
        selectedOptions: splitOptions(m.selected_options),
        quotedPrice: m.quoted_price ? Number(m.quoted_price) : null,
        jobDate: m.job_date,
        jobTime: m.job_time,
        slotStart: m.slot_start,
        slotDisplay: m.slot_display,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`[booking] Make.com notified for ${m.booking_ref}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[booking] Make.com notification failed:', msg);
    errors.push(`make: ${msg}`);
  }

  // ── 3. Google Calendar (optional) ─────────────────────────────────────────
  try {
    await createCalendarEvent(session, m, paymentIntent);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[booking] Calendar event failed:', msg);
    errors.push(`calendar: ${msg}`);
  }

  return { jobId, alreadyProcessed: false, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// Google Calendar
// ─────────────────────────────────────────────────────────────────────────────

function getCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) return null;
  const auth = new google.auth.JWT({ email, key, scopes: ['https://www.googleapis.com/auth/calendar.events'] });
  return google.calendar({ version: 'v3', auth });
}

async function createCalendarEvent(
  session: Stripe.Checkout.Session,
  m: BookingMetadata,
  paymentIntent: string | null,
): Promise<void> {
  const cal = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!cal || !calendarId) return; // Not configured - the dashboard is the source of truth
  if (!m.slot_start || !m.slot_end) return;

  const isMobile = m.booking_type === 'mobile';
  const workshopAddress = process.env.WORKSHOP_ADDRESS ?? 'AutoCleanse, Totnes, Devon';

  const description = [
    '=== BOOKING DETAILS ===',
    `Reference:      ${m.booking_ref}`,
    `Service:        ${m.service_label || m.service_type}`,
    `Type:           ${isMobile ? 'MOBILE (we go to customer)' : 'WORKSHOP (customer comes to us)'}`,
    '',
    '=== CUSTOMER ===',
    `Name:           ${m.customer_name}`,
    `Email:          ${m.customer_email}`,
    `Phone:          ${m.customer_phone}`,
    '',
    '=== VEHICLE ===',
    `Registration:   ${m.vehicle_reg}`,
    `Make / Model:   ${m.vehicle_make_model}`,
    '',
    ...(isMobile ? ['=== MOBILE ADDRESS ===', `Address:        ${m.address}`, `Postcode:       ${m.postcode}`, ''] : []),
    '=== GOALS / NOTES ===',
    m.goals,
    m.notes ? `Notes: ${m.notes}` : '',
    m.selected_options ? `Add-ons: ${m.selected_options}` : '',
    '',
    '=== PAYMENT ===',
    'Deposit paid:   £50',
    `Quoted price:   £${m.quoted_price || '?'}`,
    `Stripe session: ${session.id}`,
    `Payment intent: ${paymentIntent ?? 'N/A'}`,
    'Balance due on the day.',
  ].join('\n');

  await cal.events.insert({
    calendarId,
    requestBody: {
      summary: `Remap - ${m.customer_name || 'Customer'} - ${m.vehicle_reg}`,
      description,
      location: isMobile ? m.address : workshopAddress,
      start: { dateTime: m.slot_start, timeZone: 'Europe/London' },
      end:   { dateTime: m.slot_end,   timeZone: 'Europe/London' },
      extendedProperties: {
        private: {
          source: 'autocleanse-website',
          booking_ref: m.booking_ref,
          booking_type: m.booking_type,
          customer_postcode: m.postcode,
          stripe_session: session.id,
          payment_intent: paymentIntent ?? '',
        },
      },
      colorId: isMobile ? '6' : '9', // Tangerine for mobile, Blueberry for workshop
    },
  });
  console.log(`[booking] Calendar event created for ${m.booking_ref}`);
}
