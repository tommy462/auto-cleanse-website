// Slot availability for the remap booking system.
// Shared by /api/available-slots (what the calendar shows) and
// /api/create-checkout (final check before taking a deposit) so both
// agree on exactly the same rules.

import { sb } from './supabase.js';

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
export const APPOINTMENT_DURATION_MIN = 60;
const SLOT_INTERVAL_MIN        = 30;  // 30-minute increments
const POST_APPOINTMENT_BUFFER  = 30;  // 30-min travel buffer after each job

export interface AvailabilityResult {
  slots: string[];
  reason?: 'blocked' | 'closed';
  message?: string;
}

export function isValidDateString(date: unknown): date is string {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function getAvailableSlots(date: string): Promise<AvailabilityResult> {
  // 1. Check blocked_dates - full-day blocks return immediately, partial blocks are applied later
  let partialBlocks: { start_time: string; end_time: string }[] = [];
  try {
    const blocked = await sb<{ reason: string | null; start_time: string | null; end_time: string | null }[]>(
      `/blocked_dates?date=eq.${date}&select=date,reason,start_time,end_time`,
      { method: 'GET' },
    );
    if (blocked && blocked.length > 0) {
      const fullDay = blocked.find((b) => !b.start_time);
      if (fullDay) {
        return { slots: [], reason: 'blocked', message: fullDay.reason ?? 'Unavailable' };
      }
      partialBlocks = blocked.filter(
        (b): b is { reason: string | null; start_time: string; end_time: string } =>
          Boolean(b.start_time && b.end_time),
      );
    }
  } catch {
    // Non-fatal - continue
  }

  // 2. Business hours for the day of week
  // Use T12:00:00 to avoid DST ambiguity when parsing a date-only string
  const dayIndex = new Date(`${date}T12:00:00`).getDay();
  const hours = BUSINESS_HOURS[DAY_NAMES[dayIndex]];
  if (!hours) return { slots: [], reason: 'closed' };

  // 3. All theoretical slots for this day
  const [oh, om] = hours.open.split(':').map(Number);
  const [ch, cm] = hours.close.split(':').map(Number);
  const openMin  = oh * 60 + om;
  const closeMin = ch * 60 + cm;

  const allSlots: string[] = [];
  for (let m = openMin; m + APPOINTMENT_DURATION_MIN <= closeMin; m += SLOT_INTERVAL_MIN) {
    const hh = Math.floor(m / 60).toString().padStart(2, '0');
    const mm = (m % 60).toString().padStart(2, '0');
    allSlots.push(`${hh}:${mm}`);
  }

  // 4. Subtract booked slots (+ post-appointment buffer) from the dashboard
  try {
    const jobs = await sb<{ specific_time?: string }[]>(
      `/jobs?job_date=eq.${date}&select=specific_time&status=neq.cancelled`,
      { method: 'GET' },
    );

    const bookedRanges = (jobs ?? [])
      .map((j) => {
        const [h, m] = (j.specific_time ?? '').slice(0, 5).split(':').map(Number);
        if (isNaN(h) || isNaN(m)) return null;
        const start = h * 60 + m;
        return { start, end: start + APPOINTMENT_DURATION_MIN + POST_APPOINTMENT_BUFFER };
      })
      .filter((r): r is { start: number; end: number } => r !== null);

    const slots = allSlots.filter((slot) => {
      const [sh, sm] = slot.split(':').map(Number);
      const slotMin = sh * 60 + sm;
      for (const { start, end } of bookedRanges) {
        if (slotMin >= start && slotMin < end) return false;
      }
      for (const pb of partialBlocks) {
        if (slot >= pb.start_time && slot < pb.end_time) return false;
      }
      return true;
    });

    return { slots };
  } catch {
    // If Supabase is unreachable, return all slots rather than blocking bookings
    return { slots: allSlots };
  }
}

/** True if the given HH:MM slot on the given date is currently bookable. */
export async function isSlotAvailable(date: string, time: string): Promise<boolean> {
  const { slots } = await getAvailableSlots(date);
  return slots.includes(time);
}

/**
 * Convert a Europe/London wall-clock date + time into a UTC ISO string.
 * Vercel functions run in UTC, so `new Date('2026-06-01T09:00')` would be wrong by an hour in summer.
 */
export function londonToIso(date: string, time: string): string {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  // First guess: treat the wall-clock time as UTC, then correct by the zone offset at that instant
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const offsetMin = londonOffsetMinutes(new Date(guess));
  return new Date(guess - offsetMin * 60_000).toISOString();
}

function londonOffsetMinutes(at: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
  return Math.round((asUtc - at.getTime()) / 60_000);
}
