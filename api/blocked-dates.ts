// GET /api/blocked-dates
//
// Returns upcoming blocked dates from the AutoCleanse dashboard Supabase instance.
// Used by the booking form to warn customers before they reach the Calendly widget.
// No auth required — this is public availability information.

import type { VercelRequest, VercelResponse } from '@vercel/node';

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseUrl = process.env.DASHBOARD_SUPABASE_URL;
  const supabaseKey = process.env.DASHBOARD_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Silently return empty — don't break the booking form if not configured
    return res.status(200).json({ dates: [] });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `${supabaseUrl}/rest/v1/blocked_dates?select=date,reason&date=gte.${today}&order=date.asc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    if (!response.ok) {
      console.error('[blocked-dates] Supabase error:', response.status, await response.text());
      return res.status(200).json({ dates: [] });
    }

    const data = await response.json();
    return res.status(200).json({ dates: data ?? [] });
  } catch (err) {
    console.error('[blocked-dates] Fetch error:', err);
    return res.status(200).json({ dates: [] });
  }
}
