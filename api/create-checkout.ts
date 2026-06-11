// POST /api/create-checkout
// Body: BookingPayload (see interface below)
//
// Performs a final slot availability check, then creates a Stripe Checkout
// session for the £50 deposit. All booking data is stored in Stripe metadata
// so no separate database is needed. The webhook reads it back after payment.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { google } from 'googleapis';
import { BOOKING_CONFIG, REMAP_SERVICES } from '../src/config/booking.js';

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

interface BookingPayload {
  serviceType: string;
  bookingType: 'workshop' | 'mobile';
  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  postcode?: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleRegistration: string;
  vehicleMakeModel: string;
  goals: string;
  notes?: string;
  slotStart: string; // ISO string
  slotEnd: string;   // ISO string
}

function getCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) return null;

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
  return google.calendar({ version: 'v3', auth });
}

async function isSlotStillAvailable(slotStart: Date, slotEnd: Date): Promise<boolean> {
  const cal = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!cal || !calendarId) return true; // Cannot verify — allow and rely on manual management

  try {
    const { data } = await cal.events.list({
      calendarId,
      timeMin: slotStart.toISOString(),
      timeMax: slotEnd.toISOString(),
      singleEvents: true,
    });
    return (data.items ?? []).length === 0;
  } catch {
    return true; // On error, allow the booking — don't block customers
  }
}

function generateJobRef(): string {
  const ts = Date.now().toString().slice(-5);
  const rand = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `AC-R-${ts}${rand}`;
}

function serviceLabel(value: string): string {
  return REMAP_SERVICES.find((s) => s.value === value)?.label ?? value;
}

function truncate(s: string, max = 490): string {
  return s.length > max ? s.substring(0, max) : s;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(500).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' });
  }

  const body = req.body as BookingPayload;

  // Basic validation
  const required: Array<keyof BookingPayload> = [
    'serviceType', 'bookingType', 'fullName', 'email', 'phone',
    'vehicleRegistration', 'vehicleMakeModel', 'goals', 'slotStart', 'slotEnd',
  ];
  for (const field of required) {
    if (!body[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }

  if (body.bookingType === 'mobile' && !body.postcode) {
    return res.status(400).json({ error: 'postcode is required for mobile bookings' });
  }

  const slotStart = new Date(body.slotStart);
  const slotEnd = new Date(body.slotEnd);

  if (isNaN(slotStart.getTime()) || isNaN(slotEnd.getTime())) {
    return res.status(400).json({ error: 'Invalid slot times' });
  }

  // Final availability check to prevent race conditions
  const available = await isSlotStillAvailable(slotStart, slotEnd);
  if (!available) {
    return res.status(409).json({
      error: 'This time slot was just taken. Please go back and choose another.',
    });
  }

  const jobRef = generateJobRef();
  const siteUrl = process.env.SITE_URL ?? 'http://localhost:5173';

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as never });

  // Format slot for display
  const slotDisplay = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  }).format(slotStart);

  const addressParts = [body.addressLine1, body.addressLine2, body.townCity, body.postcode]
    .filter(Boolean)
    .join(', ');

  // All booking data stored in Stripe metadata — no separate DB needed
  const metadata: Stripe.MetadataParam = {
    booking_ref: jobRef,
    service_type: body.serviceType,
    service_label: serviceLabel(body.serviceType),
    booking_type: body.bookingType,
    customer_name: truncate(body.fullName),
    customer_email: truncate(body.email),
    customer_phone: truncate(body.phone),
    vehicle_reg: truncate(body.vehicleRegistration.toUpperCase()),
    vehicle_make_model: truncate(body.vehicleMakeModel),
    goals: truncate(body.goals),
    notes: truncate(body.notes ?? ''),
    slot_start: body.slotStart,
    slot_end: body.slotEnd,
    slot_display: truncate(slotDisplay),
    ...(body.bookingType === 'mobile' && {
      address: truncate(addressParts),
      postcode: truncate(body.postcode ?? ''),
    }),
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `ECU Remap Deposit — ${serviceLabel(body.serviceType)}`,
            description: [
              `Booking: ${slotDisplay}`,
              `Vehicle: ${body.vehicleMakeModel} (${body.vehicleRegistration.toUpperCase()})`,
              body.bookingType === 'mobile' ? `Mobile — ${addressParts}` : 'Workshop visit',
              'Full balance due on the day.',
            ].join(' · '),
          },
          unit_amount: BOOKING_CONFIG.depositAmountPence,
        },
        quantity: 1,
      },
    ],
    customer_email: body.email,
    metadata,
    success_url: `${siteUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/booking-cancel`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30-minute window to pay
  });

  return res.status(200).json({ url: session.url, sessionId: session.id });
}
