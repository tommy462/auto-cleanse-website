// POST /api/stripe-webhook
//
// Receives events from Stripe. On a paid checkout.session.completed (or
// checkout.session.async_payment_succeeded) it runs processPaidSession():
//   1. Creates the job in the AutoCleanse dashboard (idempotent)
//   2. Fires the Make.com webhook for email/SMS notifications
//   3. Creates a Google Calendar event, if configured
//
// Register this URL in Stripe Dashboard -> Developers -> Webhooks -> Add endpoint:
//   https://www.auto-cleanse.co.uk/api/stripe-webhook      <-- MUST be www
// (the apex domain 301/308-redirects to www and Stripe treats redirects as failures)
// Events: checkout.session.completed, checkout.session.async_payment_succeeded
// Then copy the endpoint's signing secret into STRIPE_WEBHOOK_SECRET on Vercel.

import type { IncomingMessage, ServerResponse } from 'http';
import Stripe from 'stripe';
import { processPaidSession } from '../src/server/bookingProcessing.js';

// Read raw body from Node.js IncomingMessage stream (needed for Stripe sig verification)
function readRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error('[webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set');
    return json(res, 500, { error: 'Webhook not configured' });
  }

  const rawBody = await readRawBody(req);
  const sig = req.headers['stripe-signature'];
  if (!sig) return json(res, 400, { error: 'Missing Stripe signature' });

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as never });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err instanceof Error ? err.message : err);
    return json(res, 400, { error: 'Invalid signature' });
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`[webhook] ${event.type} ${session.id} payment_status=${session.payment_status}`);

    // Only act on paid sessions. Delayed payment methods arrive as 'unpaid' on
    // completed and come back later via async_payment_succeeded.
    if (session.payment_status === 'paid') {
      try {
        const result = await processPaidSession(session, 'stripe-webhook');
        if (result.errors.length) {
          console.error(`[webhook] ${session.id} processed with errors:`, result.errors.join(' | '));
        }
      } catch (err) {
        console.error('[webhook] Post-payment processing error:', err);
        // Still return 200 - the booking-details fallback will retry when the customer lands
      }
    }
  }

  // Always return 200 quickly so Stripe doesn't retry
  return json(res, 200, { received: true });
}
