// ─────────────────────────────────────────────────────────────────────────────
// Booking system configuration
// Adjust these values to match your business. API keys go in .env.local only.
// ─────────────────────────────────────────────────────────────────────────────

export interface DayHours {
  open: string;  // "HH:MM" 24-hour
  close: string; // "HH:MM" 24-hour
}

export const BOOKING_CONFIG = {
  // ── Business hours ──────────────────────────────────────────────────────
  // Set a day to null to mark it as closed
  businessHours: {
    monday:    { open: '08:00', close: '17:00' } as DayHours,
    tuesday:   { open: '08:00', close: '17:00' } as DayHours,
    wednesday: { open: '08:00', close: '17:00' } as DayHours,
    thursday:  { open: '08:00', close: '17:00' } as DayHours,
    friday:    { open: '08:00', close: '17:00' } as DayHours,
    saturday:  { open: '09:00', close: '14:00' } as DayHours,
    sunday:    null as DayHours | null,
  },

  // ── Appointment settings ─────────────────────────────────────────────────
  // How long each remap appointment takes (minutes)
  appointmentDurationMinutes: 60,

  // How often slots are offered, e.g. 60 = slots at 09:00, 10:00, 11:00…
  slotIntervalMinutes: 60,

  // ── Deposit ──────────────────────────────────────────────────────────────
  // Amount charged upfront via Stripe (in pence, e.g. 5000 = £50)
  depositAmountPence: 5000,
  depositAmountDisplay: '£50',

  // ── Mobile booking travel settings ───────────────────────────────────────
  // Extra padding added on top of the calculated Google Maps travel time
  travelBufferMinutes: 15,

  // Maximum service radius for mobile bookings (miles)
  // Bookings outside this radius are rejected
  maxServiceRadiusMiles: 50,

  // Set to false to disable mobile bookings entirely
  mobileBookingsEnabled: true,

  // ── Workshop details (shown to customers) ────────────────────────────────
  workshopName: 'AutoCleanse',
  workshopAddressDisplay: 'Totnes, Devon',

  // ── Booking window ────────────────────────────────────────────────────────
  // Earliest a customer can book (days from today)
  minDaysAdvance: 1,
  // Furthest ahead a customer can book (days from today)
  maxDaysAdvance: 90,

  // ── Blocked dates ─────────────────────────────────────────────────────────
  // Array of YYYY-MM-DD strings that are completely unavailable
  unavailableDates: [] as string[],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Remap service options
// ─────────────────────────────────────────────────────────────────────────────

export const REMAP_SERVICES = [
  {
    value: 'stage-1',
    label: 'Stage 1 Remap',
    description: 'Software-only tune — standard vehicle, no hardware changes needed',
    icon: '⚡',
  },
  {
    value: 'stage-2',
    label: 'Stage 2 Remap',
    description: 'Optimised tune for vehicles with hardware upgrades (intercooler, exhaust, etc.)',
    icon: '🔥',
  },
  {
    value: 'custom-fleet',
    label: 'Custom / Fleet Map',
    description: 'Tailored mapping for commercial or fleet vehicles',
    icon: '🚛',
  },
  {
    value: 'dpf-remap-bundle',
    label: 'DPF Clean + Remap Bundle',
    description: 'Combined DPF clean and ECU remap — best-value package',
    icon: '🛠️',
  },
  {
    value: 'not-sure',
    label: 'Not Sure — Need Advice',
    description: "Tell us your goals and we'll recommend the right option",
    icon: '💬',
  },
] as const;

export type RemapServiceValue = typeof REMAP_SERVICES[number]['value'];
