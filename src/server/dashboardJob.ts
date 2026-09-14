// Creates a customer + vehicle + job in the AutoCleanse dashboard (Supabase).
// Used by the Stripe post-payment processing in src/server/bookingProcessing.ts.

import { sb } from './supabase.js';

const XERO_CUSTOMER_WEBHOOK = 'https://hook.eu2.make.com/d05n3zm6lrn2pvpu6j3cz5hxfxowpsy6';

export interface DashboardJobInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  vehicleRegistration: string;
  vehicleMakeModel?: string | null;
  serviceType?: string | null;
  serviceLabel?: string | null;
  bookingType?: string | null;      // 'workshop' | 'mobile'
  address?: string | null;
  postcode?: string | null;
  goals?: string | null;
  notes?: string | null;
  selectedOptions?: string[] | null;
  quotedPrice?: number | null;
  jobDate: string;                  // YYYY-MM-DD
  jobTime: string;                  // HH:MM
  /** Free-text provenance line stored in internal_notes, e.g. Stripe session id */
  sourceNote?: string | null;
}

export interface DashboardJobResult {
  jobId: string;
  customerId: string;
  vehicleId: string;
}

/**
 * Look up an existing job by a marker string stored in internal_notes.
 * Used to make Stripe post-payment processing idempotent without a schema change.
 */
export async function findJobByMarker(marker: string): Promise<string | null> {
  const safe = marker.replace(/[^A-Za-z0-9_]/g, '');
  if (!safe) return null;
  const rows = await sb<{ id: string }[]>(
    `/jobs?internal_notes=like.*${safe}*&select=id&limit=1`,
    { method: 'GET' },
  );
  return rows?.[0]?.id ?? null;
}

export async function createDashboardJob(input: DashboardJobInput): Promise<DashboardJobResult> {
  const {
    customerName, customerEmail, customerPhone, vehicleRegistration, vehicleMakeModel,
    serviceType, serviceLabel, bookingType, address, postcode, goals, notes,
    selectedOptions, quotedPrice, jobDate, jobTime, sourceNote,
  } = input;

  // ── 1. Find or create customer ──────────────────────────────────────────
  const existing = await sb<{ id: string }[]>(
    `/customers?email=eq.${encodeURIComponent(customerEmail)}&limit=1`,
    { method: 'GET' },
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
      // Non-fatal - we still create the customer without a Xero ID
    }

    const [newCustomer] = await sb<{ id: string }[]>('/customers', {
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

  // ── 2. Find or create vehicle ───────────────────────────────────────────
  const reg = vehicleRegistration.toUpperCase();
  const existingVehicles = await sb<{ id: string }[]>(
    `/vehicles?customer_id=eq.${customerId}&registration=eq.${encodeURIComponent(reg)}&limit=1`,
    { method: 'GET' },
  );

  let vehicleId: string;
  if (existingVehicles && existingVehicles.length > 0) {
    vehicleId = existingVehicles[0].id;
  } else {
    // Split make/model heuristic: first word = make, rest = model
    const parts = vehicleMakeModel?.trim().split(/\s+/) ?? [];
    const make = parts[0] ?? null;
    const model = parts.slice(1).join(' ') || null;

    const [newVehicle] = await sb<{ id: string }[]>('/vehicles', {
      method: 'POST',
      body: JSON.stringify({ customer_id: customerId, registration: reg, make, model }),
    });
    vehicleId = newVehicle.id;
  }

  // ── 3. Create job ───────────────────────────────────────────────────────
  const locationType = bookingType === 'mobile' ? 'Mobile' : 'Workshop';

  const [newJob] = await sb<{ id: string }[]>('/jobs', {
    method: 'POST',
    body: JSON.stringify({
      customer_id: customerId,
      vehicle_id: vehicleId,
      job_type: serviceLabel ?? serviceType ?? 'ECU Remap',
      location_type: locationType,
      job_date: jobDate,
      time_preference: 'specific',
      specific_time: jobTime,
      technician: 'Unassigned',
      notes: goals ?? null,
      quoted_price: typeof quotedPrice === 'number' && quotedPrice > 0 ? quotedPrice : 0,
      vat_included: true,
      internal_notes: [
        bookingType === 'mobile' && address ? `Address: ${address}` : null,
        notes ? `Customer notes: ${notes}` : null,
        selectedOptions?.length ? `Add-ons: ${selectedOptions.join(', ')}` : null,
        sourceNote ?? 'Booked via website (internal booking system).',
      ].filter(Boolean).join('\n\n'),
      status: 'booked',
      service_category: 'ECU',
    }),
  });

  return { jobId: newJob.id, customerId, vehicleId };
}
