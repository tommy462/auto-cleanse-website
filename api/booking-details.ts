// GET /api/booking-details?session_id=cs_xxx
//
// Called by the /booking-success page to display booking confirmation details.
// Retrieves the Stripe session and returns safe metadata - never exposes raw keys.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id } = req.query as { session_id?: string };

  if (!session_id || !session_id.startsWith('cs_')) {
    return res.status(400).json({ error: 'Invalid session_id' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as never });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed', status: session.payment_status });
    }

    const m = session.metadata ?? {};

    return res.status(200).json({
      bookingRef: m.booking_ref,
      serviceLabel: m.service_label ?? m.service_type,
      bookingType: m.booking_type,
      customerName: m.customer_name,
      customerEmail: m.customer_email,
      vehicleReg: m.vehicle_reg,
      vehicleMakeModel: m.vehicle_make_model,
      slotStart: m.slot_start,
      slotEnd: m.slot_end,
      slotDisplay: m.slot_display,
      address: m.address ?? null,
      postcode: m.postcode ?? null,
      depositPaid: true,
      depositAmount: '£50',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[booking-details] Stripe error:', message);
    return res.status(404).json({ error: 'Booking not found' });
  }
}
