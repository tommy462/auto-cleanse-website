// GET /api/booking-details?session_id=cs_xxx
//
// Called by the /booking-success page to display booking confirmation details.
// Retrieves the Stripe session and returns safe metadata - never exposes raw keys.
//
// Also acts as a safety net for the webhook: if the session is paid but no
// dashboard job exists yet after FALLBACK_AFTER_SEC, the booking is processed
// here (idempotently). The success page polls until `processed` is true, so a
// misconfigured or delayed webhook can no longer swallow a paid booking.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { isSessionProcessed, processPaidSession, readBookingMetadata } from '../src/server/bookingProcessing.js';

// Give the webhook a head start so the two paths don't race on the first page load
const FALLBACK_AFTER_SEC = 15;

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id } = req.query as { session_id?: string };
  if (!session_id || !/^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    return res.status(400).json({ error: 'Invalid session_id' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error('[booking-details] STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as never });

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch (err) {
    console.error('[booking-details] Stripe error:', err instanceof Error ? err.message : err);
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (session.payment_status !== 'paid') {
    return res.status(402).json({ error: 'Payment not completed', status: session.payment_status });
  }

  // ── Webhook safety net ────────────────────────────────────────────────────
  let processed = await isSessionProcessed(session.id);
  const ageSec = Math.floor(Date.now() / 1000) - session.created;
  if (!processed && ageSec >= FALLBACK_AFTER_SEC) {
    console.warn(`[booking-details] ${session.id} paid ${ageSec}s ago but not processed - running fallback`);
    try {
      const result = await processPaidSession(session, 'booking-details-fallback');
      processed = result.jobId !== null;
      if (result.errors.length) console.error('[booking-details] fallback errors:', result.errors.join(' | '));
    } catch (err) {
      console.error('[booking-details] fallback failed:', err);
    }
  }

  const m = readBookingMetadata(session);
  const isMobile = m.booking_type === 'mobile';

  return res.status(200).json({
    bookingRef: m.booking_ref,
    serviceType: m.service_type,
    serviceLabel: m.service_label || m.service_type,
    bookingType: m.booking_type,
    customerName: m.customer_name,
    customerEmail: m.customer_email,
    customerPhone: m.customer_phone,
    vehicleRegistration: m.vehicle_reg,
    vehicleMakeModel: m.vehicle_make_model,
    jobDate: m.job_date,
    jobTime: m.job_time,
    slotStart: m.slot_start,
    slotEnd: m.slot_end,
    slotDisplay: m.slot_display,
    address: isMobile ? m.address || null : null,
    postcode: isMobile ? m.postcode || null : null,
    selectedOptions: m.selected_options ? m.selected_options.split(',').map((o) => o.trim()).filter(Boolean) : [],
    quotedPrice: m.quoted_price ? Number(m.quoted_price) : null,
    depositPaid: true,
    depositAmount: '£50',
    processed,
  });
}
