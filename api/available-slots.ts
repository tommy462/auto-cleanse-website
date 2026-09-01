// GET /api/available-slots?date=YYYY-MM-DD
//
// Returns available time slots for a given date.
// Checks blocked_dates table and existing jobs so no double-booking is possible.
// Used by the internal booking calendar on the remapping booking page.

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.AUTOCLEANSE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.AUTOCLEANSE_SUPABASE_SERVICE_KEY!;

// Mirrors BOOKING_CONFIG in src/config/booking.ts - keep in sync
const BUSINESS_HOURS: Record<string, { open: string; close: string } | null> = {
  sunday:    { open: '09:00', close: '14:00' },
  monday:    { open: '09:00', close: '17:30' }, // last slot 16:30 + 60 min = 17:30
  tuesday:   { open: '09:00', close: '17:30' },
  wednesday: { open: '09:00', close: '17:30' },
  thursday:  { open: '09:00', close: '17:30' },
  friday:    { open: '09:00', close: '17:30' },
  saturday:  { open: '09:00', close: '14:00' }, // last slot 13:00
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const APPOINTMENT_DURATION_MIN = 60;
const SLOT_INTERVAL_MIN        = 30;  // 30-minute increments
const POST_APPOINTMENT_BUFFER  = 30;  // 30-min travel buffer after each job

async function sbGet(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

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
  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date. Use YYYY-MM-DD.' });
  }

  // 1. Check blocked_dates - full-day blocks return immediately, partial blocks are applied later
  let partialBlocks: { start_time: string; end_time: string }[] = [];
  try {
    const blocked = await sbGet(`/blocked_dates?date=eq.${date}&select=date,reason,start_time,end_time`);
    if (blocked && blocked.length > 0) {
      // If any entry has no start_time it is a full-day block
      const hasFullDayBlock = blocked.some((b: { start_time: string | null }) => !b.start_time);
      if (hasFullDayBlock) {
        const entry = blocked.find((b: { start_time: string | null }) => !b.start_time);
        return res.status(200).json({ slots: [], reason: 'blocked', message: entry?.reason ?? 'Unavailable' });
      }
      // Otherwise collect partial blocks to subtract specific slots below
      partialBlocks = blocked.filter(
        (b: { start_time: string | null; end_time: string | null }) => b.start_time && b.end_time,
      );
    }
  } catch {
    // Non-fatal - continue
  }

  // 2. Get business hours for the day of week
  // Use T12:00:00 to avoid DST ambiguity when parsing a date-only string
  const dayIndex = new Date(`${date}T12:00:00`).getDay();
  const dayName = DAY_NAMES[dayIndex];
  const hours = BUSINESS_HOURS[dayName];

  if (!hours) {
    return res.status(200).json({ slots: [], reason: 'closed' });
  }

  // 3. Generate all theoretical slots for this day
  const [oh, om] = hours.open.split(':').map(Number);
  const [ch, cm] = hours.close.split(':').map(Number);
  const openMin  = oh * 60 + om;
  const closeMin = ch * 60 + cm;

  const allSlots: string[] = [];
  for (let m = openMin; m + APPOINTMENT_DURATION_MIN <= closeMin; m += SLOT_INTERVAL_MIN) {
    const hh  = Math.floor(m / 60).toString().padStart(2, '0');
    const mm  = (m % 60).toString().padStart(2, '0');
    allSlots.push(`${hh}:${mm}`);
  }

  // 4. Subtract booked slots (+ post-appointment buffer) from the dashboard
  try {
    const jobs = await sbGet(
      `/jobs?job_date=eq.${date}&select=specific_time&status=neq.cancelled`,
    );

    // Convert each booked time to minutes-from-midnight for range comparisons
    const bookedRanges: { start: number; end: number }[] = (jobs ?? [])
      .map((j: { specific_time?: string }) => {
        const t = (j.specific_time ?? '').slice(0, 5);
        const [h, m] = t.split(':').map(Number);
        if (isNaN(h) || isNaN(m)) return null;
        const start = h * 60 + m;
        // Block from job start until end of appointment + travel buffer
        return { start, end: start + APPOINTMENT_DURATION_MIN + POST_APPOINTMENT_BUFFER };
      })
      .filter(Boolean) as { start: number; end: number }[];

    const available = allSlots.filter((slot) => {
      const [sh, sm] = slot.split(':').map(Number);
      const slotMin = sh * 60 + sm;

      // Blocked if this slot starts inside any booked range [start, end)
      for (const { start, end } of bookedRanges) {
        if (slotMin >= start && slotMin < end) return false;
      }

      // Remove slots that fall within a partial blocked-date range
      for (const pb of partialBlocks) {
        if (slot >= pb.start_time && slot < pb.end_time) return false;
      }

      return true;
    });

    return res.status(200).json({ slots: available });
  } catch {
    // If Supabase is unreachable, return all slots rather than blocking bookings
    return res.status(200).json({ slots: allSlots });
  }
}
