// GET /api/available-slots?date=YYYY-MM-DD
//
// Returns available time slots for a given date.
// Checks blocked_dates table and existing jobs so no double-booking is possible.
// Used by the internal booking calendar on the remapping booking page.
// The rules live in src/server/availability.ts and are shared with /api/create-checkout.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAvailableSlots, isValidDateString } from '../src/server/availability.js';

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;
  if (!isValidDateString(date)) {
    return res.status(400).json({ error: 'Invalid date. Use YYYY-MM-DD.' });
  }

  const result = await getAvailableSlots(date);
  return res.status(200).json(result);
}
