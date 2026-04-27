// POST /api/stripe-webhook
//
// Receives events from Stripe. On checkout.session.completed:
//   1. Verifies the Stripe signature (requires raw body — stream-read, not parsed)
//   2. Creates a Google Calendar event with full booking details
//   3. Fires the Make.com webhook for email/SMS notifications
//
// Register this URL in Stripe Dashboard → Webhooks → Add endpoint:
//   https://auto-cleanse.co.uk/api/stripe-webhook
// Events to listen for: checkout.session.completed

import type { IncomingMessage, ServerResponse } from 'http';
import Stripe from 'stripe';
import { google } from 'googleapis';

// Read raw body from Node.js IncomingMessage stream (needed for Stripe sig verification)
function readRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function getCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) return null;

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  });
  return google.calendar({ version: 'v3', auth });
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  }).format(new Date(iso));
}

async function createCalendarEvent(session: Stripe.Checkout.Session): Promise<void> {
  const cal = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!cal || !calendarId) {
    console.warn('[webhook] Google Calendar not configured — skipping event creation');
    return;
  }

  const m = session.metadata ?? {};
  const isMobile = m.booking_type === 'mobile';

  const summary = `🔧 Remap — ${m.customer_name ?? 'Customer'} — ${m.vehicle_reg ?? ''}`;

  const description = [
    `━━━ BOOKING DETAILS ━━━`,
    `Reference:      ${m.booking_ref ?? 'N/A'}`,
    `Service:        ${m.service_label ?? m.service_type ?? 'N/A'}`,
    `Type:           ${isMobile ? '🚗 MOBILE (we go to customer)' : '🏪 WORKSHOP (customer comes to us)'}`,
    '',
    `━━━ CUSTOMER ━━━`,
    `Name:           ${m.customer_name ?? ''}`,
    `Email:          ${m.customer_email ?? ''}`,
    `Phone:          ${m.customer_phone ?? ''}`,
    '',
    `━━━ VEHICLE ━━━`,
    `Registration:   ${m.vehicle_reg ?? ''}`,
    `Make / Model:   ${m.vehicle_make_model ?? ''}`,
    '',
    ...(isMobile
      ? [
          `━━━ MOBILE ADDRESS ━━━`,
          `Address:        ${m.address ?? ''}`,
          `Postcode:       ${m.postcode ?? ''}`,
          '',
        ]
      : []),
    `━━━ GOALS / NOTES ━━━`,
    m.goals ?? '',
    m.notes ? `Notes: ${m.notes}` : '',
    '',
    `━━━ PAYMENT ━━━`,
    `Deposit paid:   £50 ✅`,
    `Stripe session: ${session.id}`,
    `Payment intent: ${session.payment_intent ?? 'N/A'}`,
    `Balance due on the day.`,
  ]
    .filter((line) => line !== undefined)
    .join('\n');

  const workshopAddress = process.env.WORKSHOP_ADDRESS ?? 'AutoCleanse, Totnes, Devon';

  await cal.events.insert({
    calendarId,
    requestBody: {
      summary,
      description,
      location: isMobile ? (m.address ?? '') : workshopAddress,
      start: {
        dateTime: m.slot_start,
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: m.slot_end,
        timeZone: 'Europe/London',
      },
      // Extended properties allow us to query our own bookings programmatically
      extendedProperties: {
        private: {
          source: 'autocleanse-website',
          booking_ref: m.booking_ref ?? '',
          booking_type: m.booking_type ?? '',
          customer_postcode: m.postcode ?? '',
          stripe_session: session.id,
          payment_intent: String(session.payment_intent ?? ''),
        },
      },
      colorId: isMobile ? '6' : '9', // Tangerine for mobile, Blueberry for workshop
    },
  });

  console.log(`[webhook] Calendar event created for ${m.booking_ref}`);
}

async function notifyMakeWebhook(session: Stripe.Checkout.Session): Promise<void> {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) return;

  const m = session.metadata ?? {};

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'remap_booking_confirmed',
        bookingRef: m.booking_ref,
        stripeSessionId: session.id,
        paymentIntent: session.payment_intent,
        depositPaid: true,
        depositAmount: '£50',
        serviceType: m.service_label ?? m.service_type,
        bookingType: m.booking_type,
        slotStart: m.slot_start,
        slotDisplay: m.slot_display,
        customerName: m.customer_name,
        customerEmail: m.customer_email,
        customerPhone: m.customer_phone,
        vehicleReg: m.vehicle_reg,
        vehicleMakeModel: m.vehicle_make_model,
        goals: m.goals,
        notes: m.notes,
        address: m.address ?? null,
        postcode: m.postcode ?? null,
        timestamp: new Date().toISOString(),
        source: 'stripe-webhook',
      }),
    });
    console.log(`[webhook] Make.com notified for ${m.booking_ref}`);
  } catch (err) {
    console.error('[webhook] Make.com notification failed:', err);
    // Non-fatal — don't fail the webhook response
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error('[webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set');
    res.writeHead(500);
    res.end();
    return;
  }

  const rawBody = await readRawBody(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing Stripe signature' }));
    return;
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as never });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid signature' }));
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only act on paid sessions (not free/trial)
    if (session.payment_status === 'paid') {
      try {
        await createCalendarEvent(session);
        await notifyMakeWebhook(session);
      } catch (err) {
        console.error('[webhook] Post-payment processing error:', err);
        // Still return 200 — Stripe should not retry for app errors
      }
    }
  }

  // Always return 200 quickly so Stripe doesn't retry
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ received: true }));
}
