// POST /api/travel-time
// Body: { postcode: string }
//
// Calculates driving time from the workshop base to a customer postcode.
// Used by the booking form to validate radius and show estimated travel time.
// Tries Google Maps Routes API first; falls back to postcode area lookup.
// The Google Maps API key is NEVER exposed to the client.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BOOKING_CONFIG } from '../src/config/booking';

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Approximate one-way driving minutes from the TQ (Totnes) postcode area.
// Extend or override as needed for your base location.
const POSTCODE_TRAVEL_MINUTES: Record<string, number> = {
  TQ: 15, EX: 35, PL: 40, TA: 50, DT: 60, BA: 70,
  BS: 90, TR: 85, GL: 100, SP: 90, BH: 80, SN: 100,
  SO: 110, GU: 140, RG: 150, KT: 180, SW: 200, SE: 200,
  E: 210, N: 210, W: 210, NW: 210, EC: 210, WC: 210,
};

function postcodeArea(postcode: string): string {
  return postcode.replace(/\s/g, '').toUpperCase().match(/^[A-Z]{1,2}/)?.[0] ?? '';
}

function fallbackTravelMinutes(postcode: string): number {
  const area = postcodeArea(postcode);
  return POSTCODE_TRAVEL_MINUTES[area] ?? 45;
}

// Rough miles estimate based on fallback table (used for radius check without Maps API)
function roughMilesFromMinutes(minutes: number): number {
  return Math.round(minutes * 0.5); // ~30 mph average for UK rural driving
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body as { postcode?: string };
  const postcode = body?.postcode?.trim();

  if (!postcode) {
    return res.status(400).json({ error: 'postcode is required' });
  }

  // Basic UK postcode format validation
  const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
  if (!postcodeRegex.test(postcode)) {
    return res.status(400).json({ error: 'Invalid UK postcode format' });
  }

  const workshopPostcode = process.env.WORKSHOP_POSTCODE ?? 'TQ9 5JA';
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  let travelMinutes: number;
  let distanceMeters: number | null = null;
  let method: 'google_maps' | 'postcode_estimate' = 'postcode_estimate';

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
          origin: { address: `${workshopPostcode}, UK` },
          destination: { address: `${postcode}, UK` },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const durationStr: string = data.routes?.[0]?.duration ?? '';
        distanceMeters = data.routes?.[0]?.distanceMeters ?? null;

        if (durationStr) {
          travelMinutes = Math.ceil(parseInt(durationStr, 10) / 60);
          method = 'google_maps';
        } else {
          travelMinutes = fallbackTravelMinutes(postcode);
        }
      } else {
        travelMinutes = fallbackTravelMinutes(postcode);
      }
    } catch (err) {
      console.error('[travel-time] Google Maps API error:', err);
      travelMinutes = fallbackTravelMinutes(postcode);
    }
  } else {
    travelMinutes = fallbackTravelMinutes(postcode);
  }

  const distanceMiles = distanceMeters
    ? Math.round(distanceMeters / 1609.34)
    : roughMilesFromMinutes(travelMinutes);

  const withinRange = distanceMiles <= BOOKING_CONFIG.maxServiceRadiusMiles;

  return res.status(200).json({
    travelMinutes,
    distanceMiles,
    withinRange,
    method,
    maxRadiusMiles: BOOKING_CONFIG.maxServiceRadiusMiles,
  });
}
