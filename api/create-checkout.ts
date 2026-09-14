// POST /api/create-checkout
// Body: PendingBooking (the same object the booking page builds - see RemappingBooking.tsx)
//
// Performs a final slot availability check against the dashboard, then creates
// a Stripe Checkout Session for the £50 deposit. Every booking detail is stored
// as metadata on BOTH the Checkout Session and the PaymentIntent, so the full
// booking is visible on the payment in the Stripe dashboard even if every
// downstream notification fails. /api/stripe-webhook reads it back after payment.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { BOOKING_CONFIG, REMAP_SERVICES } from '../src/config/booking.js';
import { APPOINTMENT_DURATION_MIN, isSlotAvailable, isValidDateString, londonToIso } from '../src/server/availability.js';
import type { BookingMetadata } from '../src/server/bookingProcessing.js';

// The live "Remap Deposit" product - reused so Stripe reporting stays grouped.
// Override with STRIPE_DEPOSIT_PRODUCT_ID when using a test-mode key.
const DEFAULT_DEPOSIT_PRODUCT_ID = 'prod_UPxucEIgvPDc6J';

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

interface BookingPayload {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  serviceLabel?: string;
  bookingType: 'workshop' | 'mobile';
  vehicleRegistration: string;
  vehicleMakeModel: string;
  goals: string;
  notes?: string;
  address?: string | null;
  postcode?: string | null;
  selectedOptions?: string[];
  quotedPrice?: number;
  jobDate: string;      // YYYY-MM-DD
  jobTime: string;      // HH:MM
  slotDisplay?: string;
}

function generateBookingRef(): string {
  const ts = Date.now().toString().slice(-5);
  const rand = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `AC-R-${ts}${rand}`;
}

function serviceLabel(value: string, fallback?: string): string {
  return REMAP_SERVICES.find((s) => s.value === value)?.label ?? fallback ?? value;
}

// Stripe metadata values are capped at 500 chars
function truncate(s: string | null | undefined, max = 490): string {
  const v = (s ?? '').trim();
  return v.length > max ? v.substring(0, max) : v;
}

function siteUrlFor(req: VercelRequest): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] ?? req.headers.host ?? 'www.auto-cleanse.co.uk';
  const proto = req.headers['x-forwarded-proto'] ?? 'https';
  return `${proto}://${host}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error('[create-checkout] STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ error: 'Online payment is temporarily unavailable. Please call us to book.' });
  }

  const body = (req.body ?? {}) as BookingPayload;

  // Basic validation
  const required: Array<keyof BookingPayload> = [
    'fullName', 'email', 'phone', 'serviceType', 'bookingType',
    'vehicleRegistration', 'vehicleMakeModel', 'goals', 'jobDate', 'jobTime',
  ];
  for (const field of required) {
    if (!body[field]) return res.status(400).json({ error: `${field} is required` });
  }
  if (body.bookingType === 'mobile' && !body.postcode) {
    return res.status(400).json({ error: 'postcode is required for mobile bookings' });
  }
  if (!isValidDateString(body.jobDate) || !/^\d{2}:\d{2}$/.test(body.jobTime)) {
    return res.status(400).json({ error: 'Invalid slot' });
  }

  // Final availability check against the dashboard to prevent double-booking
  if (!(await isSlotAvailable(body.jobDate, body.jobTime))) {
    return res.status(409).json({
      error: 'That time slot was just taken. Please go back and choose another.',
    });
  }

  const bookingRef = generateBookingRef();
  const siteUrl = siteUrlFor(req);
  const label = serviceLabel(body.serviceType, body.serviceLabel);
  const slotStart = londonToIso(body.jobDate, body.jobTime);
  const slotEnd = new Date(new Date(slotStart).getTime() + APPOINTMENT_DURATION_MIN * 60_000).toISOString();
  const slotDisplay = body.slotDisplay || new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London',
  }).format(new Date(slotStart));
  const reg = body.vehicleRegistration.toUpperCase().replace(/\s+/g, '');
  const isMobile = body.bookingType === 'mobile';

  const metadata: BookingMetadata = {
    booking_ref: bookingRef,
    service_type: truncate(body.serviceType),
    service_label: truncate(label),
    booking_type: body.bookingType,
    customer_name: truncate(body.fullName),
    customer_email: truncate(body.email),
    customer_phone: truncate(body.phone),
    vehicle_reg: truncate(reg),
    vehicle_make_model: truncate(body.vehicleMakeModel),
    goals: truncate(body.goals),
    notes: truncate(body.notes),
    address: isMobile ? truncate(body.address) : '',
    postcode: isMobile ? truncate(body.postcode) : '',
    selected_options: truncate((body.selectedOptions ?? []).join(', ')),
    quoted_price: typeof body.quotedPrice === 'number' ? String(body.quotedPrice) : '',
    job_date: body.jobDate,
    job_time: body.jobTime,
    slot_start: slotStart,
    slot_end: slotEnd,
    slot_display: truncate(slotDisplay),
  };

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as never });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: BOOKING_CONFIG.depositAmountPence,
            product: process.env.STRIPE_DEPOSIT_PRODUCT_ID ?? DEFAULT_DEPOSIT_PRODUCT_ID,
          },
          quantity: 1,
        },
      ],
      customer_email: body.email,
      customer_creation: 'always',
      metadata,
      // Same metadata on the PaymentIntent so it shows on the Payment in the Stripe dashboard
      payment_intent_data: {
        metadata,
        description: `Remap deposit - ${body.fullName} - ${reg} - ${slotDisplay}`,
      },
      success_url: `${siteUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/booking-cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30-minute window to pay
    });

    console.log(`[create-checkout] Session ${session.id} created for ${bookingRef} (${reg}, ${body.jobDate} ${body.jobTime})`);
    return res.status(200).json({ url: session.url, sessionId: session.id, bookingRef });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[create-checkout] Stripe error:', message);
    return res.status(502).json({ error: 'Could not start payment. Please try again or call us to book.' });
  }
}
