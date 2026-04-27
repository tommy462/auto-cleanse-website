// GET /api/availability?date=YYYY-MM-DD&type=workshop|mobile&postcode=EX12AB
//
// Returns available time slots for a given date, booking type, and (if mobile)
// customer postcode. Reads existing Google Calendar events to avoid conflicts.
// For mobile bookings, travel time + buffer is included in the availability check.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { BOOKING_CONFIG } from '../src/config/booking';

// ── Helpers ────────────────────────────────────────────────────────────────

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getDayKey(date: Date): keyof typeof BOOKING_CONFIG.businessHours {
  const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return names[date.getDay()] as keyof typeof BOOKING_CONFIG.businessHours;
}

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Google Calendar ────────────────────────────────────────────────────────

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

interface CalEvent {
  start: Date;
  end: Date;
}

async function getEventsForDay(date: Date): Promise<CalEvent[]> {
  const cal = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!cal || !calendarId) return [];

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  try {
    const { data } = await cal.events.list({
      calendarId,
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return (data.items ?? []).flatMap((ev) => {
      const s = ev.start?.dateTime ? new Date(ev.start.dateTime) : null;
      const e = ev.end?.dateTime ? new Date(ev.end.dateTime) : null;
      if (!s || !e) return [];
      return [{ start: s, end: e }];
    });
  } catch (err) {
    console.error('[availability] Google Calendar error:', err);
    return [];
  }
}

// ── Travel time ────────────────────────────────────────────────────────────

async function getTravelMinutes(origin: string, destination: string): Promise<number> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const resp = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
        },
        body: JSON.stringify({
          origin: { address: `${origin}, UK` },
          destination: { address: `${destination}, UK` },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const durationStr: string = data.routes?.[0]?.duration ?? '';
        if (durationStr) {
          return Math.ceil(parseInt(durationStr, 10) / 60);
        }
      }
    } catch (err) {
      console.error('[availability] Google Maps API error:', err);
    }
  }

  // Fallback: postcode area distance table from TQ (Totnes area)
  return estimateTravelFromPostcodeArea(destination);
}

// Approximate one-way driving minutes from the TQ postcode area (Totnes/Devon)
// to common UK postcode areas. Adjust as needed.
const POSTCODE_TRAVEL_MINUTES: Record<string, number> = {
  TQ: 15, EX: 35, PL: 40, TA: 50, DT: 60, BA: 70,
  BS: 90, TR: 85, GL: 100, SP: 90, BH: 80, SN: 100,
  SO: 110, GU: 140, RG: 150,
};

function estimateTravelFromPostcodeArea(postcode: string): number {
  const area = postcode.replace(/\s/g, '').toUpperCase().match(/^[A-Z]{1,2}/)?.[0] ?? '';
  return POSTCODE_TRAVEL_MINUTES[area] ?? 45;
}

function estimateDistanceMiles(postcode: string): number {
  // Very rough: assume 0.8 miles per minute of estimated travel at 30mph avg
  const mins = estimateTravelFromPostcodeArea(postcode);
  return Math.round(mins * 0.5);
}

// ── Main handler ───────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { date, type, postcode } = req.query as {
    date?: string;
    type?: string;
    postcode?: string;
  };

  if (!date || !type) {
    return res.status(400).json({ error: 'date and type are required' });
  }

  if (type !== 'workshop' && type !== 'mobile') {
    return res.status(400).json({ error: 'type must be workshop or mobile' });
  }

  if (type === 'mobile' && !BOOKING_CONFIG.mobileBookingsEnabled) {
    return res.status(200).json({ slots: [], reason: 'mobile_disabled' });
  }

  // Parse date (treat as local midnight to avoid timezone shifts)
  const targetDate = new Date(`${date}T00:00:00`);
  if (isNaN(targetDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  // Booking window check
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + BOOKING_CONFIG.minDaysAdvance);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + BOOKING_CONFIG.maxDaysAdvance);

  if (targetDate < minDate || targetDate > maxDate) {
    return res.status(200).json({ slots: [], reason: 'outside_booking_window' });
  }

  // Blocked dates
  const dateStr = date.substring(0, 10);
  if ((BOOKING_CONFIG.unavailableDates as readonly string[]).includes(dateStr)) {
    return res.status(200).json({ slots: [], reason: 'unavailable' });
  }

  // Business hours
  const dayKey = getDayKey(targetDate);
  const hours = BOOKING_CONFIG.businessHours[dayKey];
  if (!hours) {
    return res.status(200).json({ slots: [], reason: 'closed' });
  }

  const openMins = timeToMinutes(hours.open);
  const closeMins = timeToMinutes(hours.close);
  const duration = BOOKING_CONFIG.appointmentDurationMinutes;
  const interval = BOOKING_CONFIG.slotIntervalMinutes;

  // Generate all candidate slots
  const allSlots: Date[] = [];
  for (let start = openMins; start + duration <= closeMins; start += interval) {
    const slot = new Date(targetDate);
    slot.setHours(Math.floor(start / 60), start % 60, 0, 0);
    allSlots.push(slot);
  }

  // Fetch calendar events
  const events = await getEventsForDay(targetDate);

  // Travel time for mobile bookings
  let travelMinutes = 0;
  if (type === 'mobile' && postcode) {
    const workshopPostcode = process.env.WORKSHOP_POSTCODE ?? 'TQ9 5JA';
    travelMinutes = await getTravelMinutes(workshopPostcode, postcode);

    // Radius check: reject if travel implies out-of-range
    const estimatedMiles = estimateDistanceMiles(postcode);
    if (estimatedMiles > BOOKING_CONFIG.maxServiceRadiusMiles) {
      return res.status(200).json({
        slots: [],
        reason: 'out_of_range',
        travelMinutes,
        estimatedMiles,
      });
    }
  }

  const buffer = BOOKING_CONFIG.travelBufferMinutes;
  const dayStart = new Date(targetDate);
  dayStart.setHours(Math.floor(openMins / 60), openMins % 60, 0, 0);

  // Evaluate each slot
  const slots = allSlots.map((slotStart) => {
    const slotEnd = new Date(slotStart.getTime() + duration * 60_000);
    let available = true;
    let reason = '';

    for (const ev of events) {
      if (type === 'mobile' && travelMinutes > 0) {
        // For mobile: the effective window we need clear is
        // [slotStart - (travel+buffer), slotEnd + (travel+buffer)]
        const effectiveStart = new Date(slotStart.getTime() - (travelMinutes + buffer) * 60_000);
        const effectiveEnd = new Date(slotEnd.getTime() + (travelMinutes + buffer) * 60_000);

        if (effectiveStart < ev.end && effectiveEnd > ev.start) {
          available = false;
          reason = 'travel_conflict';
          break;
        }
      } else {
        // Workshop: plain overlap
        if (slotStart < ev.end && slotEnd > ev.start) {
          available = false;
          reason = 'booked';
          break;
        }
      }
    }

    // For mobile: also verify we can leave during business hours
    if (available && type === 'mobile' && travelMinutes > 0) {
      const departureTime = new Date(slotStart.getTime() - (travelMinutes + buffer) * 60_000);
      if (departureTime < dayStart) {
        available = false;
        reason = 'too_early_for_travel';
      }
    }

    return {
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      available,
      reason: available ? undefined : reason,
    };
  });

  return res.status(200).json({
    slots,
    travelMinutes: travelMinutes > 0 ? travelMinutes : undefined,
    calendarConnected: !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_CALENDAR_ID),
  });
}
