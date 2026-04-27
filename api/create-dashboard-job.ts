import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.AUTOCLEANSE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.AUTOCLEANSE_SUPABASE_SERVICE_KEY!;
const CALENDLY_API_KEY = process.env.CALENDLY_API_KEY!;
const XERO_CUSTOMER_WEBHOOK = 'https://hook.eu2.make.com/d05n3zm6lrn2pvpu6j3cz5hxfxowpsy6';

// ── Supabase REST helper ───────────────────────────────────────────────────────

async function sb(path: string, opts: RequestInit & { prefer?: string } = {}) {
  const { prefer, ...rest } = opts;
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...rest,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: prefer ?? 'return=representation',
      ...(rest.headers as Record<string, string> | undefined ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${path}: ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

// ── Calendly API helper ───────────────────────────────────────────────────────

async function getCalendlyEvent(eventUri: string): Promise<{ start_time: string; end_time: string }> {
  const res = await fetch(eventUri, {
    headers: { Authorization: `Bearer ${CALENDLY_API_KEY}` },
  });
  if (!res.ok) throw new Error(`Calendly event fetch failed: ${res.status}`);
  const data = await res.json();
  return { start_time: data.resource.start_time, end_time: data.resource.end_time };
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    customerName,
    customerEmail,
    customerPhone,
    vehicleRegistration,
    vehicleMakeModel,
    serviceType,
    serviceLabel,
    bookingType,
    address,
    postcode,
    goals,
    notes,
    calendlyEventUri,
  } = req.body ?? {};

  if (!customerName || !customerEmail || !vehicleRegistration || !calendlyEventUri) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // ── 1. Fetch booking date/time from Calendly ────────────────────────────
    const { start_time } = await getCalendlyEvent(calendlyEventUri);
    const jobDate = start_time.slice(0, 10); // YYYY-MM-DD
    const jobTime = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/London',
    }).format(new Date(start_time));

    // ── 2. Find or create customer ──────────────────────────────────────────
    const existing: any[] = await sb(
      `/customers?email=eq.${encodeURIComponent(customerEmail)}&limit=1`,
      { method: 'GET', prefer: 'return=representation' },
    );

    let customerId: string;
    if (existing && existing.length > 0) {
      customerId = existing[0].id;
    } else {
      // Create in Xero first, then insert customer
      let xeroContactId: string | null = null;
      try {
        const xeroRes = await fetch(XERO_CUSTOMER_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customerName,
            email: customerEmail,
            phone: customerPhone ?? null,
            postcode: postcode ?? null,
            address: address ?? null,
            customer_type: 'Individual',
          }),
        });
        if (xeroRes.ok) {
          const xeroData = await xeroRes.json().catch(() => null);
          xeroContactId = xeroData?.xero_contact_id ?? null;
        }
      } catch {
        // Non-fatal — we still create the customer without a Xero ID
      }

      const [newCustomer] = await sb('/customers', {
        method: 'POST',
        body: JSON.stringify({
          type: 'Individual',
          contact_name: customerName,
          email: customerEmail,
          phone: customerPhone ?? null,
          postcode: postcode ?? null,
          address: address ?? null,
          xero_contact_id: xeroContactId,
        }),
      });
      customerId = newCustomer.id;
    }

    // ── 3. Find or create vehicle ───────────────────────────────────────────
    const reg = vehicleRegistration.toUpperCase();
    const existingVehicles: any[] = await sb(
      `/vehicles?customer_id=eq.${customerId}&registration=eq.${encodeURIComponent(reg)}&limit=1`,
      { method: 'GET', prefer: 'return=representation' },
    );

    let vehicleId: string;
    if (existingVehicles && existingVehicles.length > 0) {
      vehicleId = existingVehicles[0].id;
    } else {
      // Split make/model heuristic: first word = make, rest = model
      const parts = vehicleMakeModel?.trim().split(/\s+/) ?? [];
      const make = parts[0] ?? null;
      const model = parts.slice(1).join(' ') || null;

      const [newVehicle] = await sb('/vehicles', {
        method: 'POST',
        body: JSON.stringify({
          customer_id: customerId,
          registration: reg,
          make,
          model,
        }),
      });
      vehicleId = newVehicle.id;
    }

    // ── 4. Create job ───────────────────────────────────────────────────────
    const locationType = bookingType === 'mobile' ? 'Mobile' : 'Workshop';

    const [newJob] = await sb('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        vehicle_id: vehicleId,
        job_type: serviceLabel ?? serviceType ?? 'ECU Remap',
        location_type: locationType,
        job_address: bookingType === 'mobile' ? (address ?? null) : null,
        job_date: jobDate,
        time_preference: 'specific',
        specific_time: jobTime,
        technician: 'Unassigned',
        notes: goals ?? null,
        quoted_price: null,
        vat_included: false,
        internal_notes: notes
          ? `${notes}\n\nBooked via website. Calendly: ${calendlyEventUri}`
          : `Booked via website. Calendly: ${calendlyEventUri}`,
        status: 'booked',
      }),
    });

    return res.status(200).json({ ok: true, jobId: newJob.id, customerId, vehicleId });
  } catch (err: any) {
    console.error('[create-dashboard-job]', err);
    return res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
