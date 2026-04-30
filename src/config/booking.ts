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
    description: 'DPF clean and ECU remap inc. labour to remove and refit — best-value package',
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

// ─────────────────────────────────────────────────────────────────────────────
// Add-on options (shown as checkboxes on the booking form)
// extraCost is the additional charge in pounds (0 = included free)
// offRoadOnly: true means the option is for off-road/export vehicles only and
//   is not road-legal in the UK — a legal disclaimer must be shown and accepted
// ─────────────────────────────────────────────────────────────────────────────

export interface RemapOption {
  value: string;
  label: string;
  extraCost: number;
  offRoadOnly?: boolean;
}

export const REMAP_OPTIONS: RemapOption[] = [
  { value: 'dpf-gpf-opf-disable',  label: 'DPF/GPF/OPF Disable',               extraCost: 24, offRoadOnly: true  },
  { value: 'egr-disable',          label: 'EGR Delete',                          extraCost: 24, offRoadOnly: true  },
  { value: 'speed-limiter-disable',label: 'Speed Limiter Disable',               extraCost: 0  },
  { value: 'dtc-disable',          label: 'DTC Disable',                         extraCost: 0  },
  { value: 'lambda-o2-delete',     label: 'Lambda/O2 Delete',                    extraCost: 0  },
  { value: 'flaps',                label: 'Flap Removal',                        extraCost: 24, offRoadOnly: true  },
  { value: 'scr-adblue-delete',    label: 'SCR/AdBlue Delete',                   extraCost: 24, offRoadOnly: true  },
  { value: 'additive-pats-eolys',  label: 'Additive/PATS/Eolys',                extraCost: 0  },
  { value: 'possibly-is-tuned',    label: 'Possibly/Is Tuned',                   extraCost: 0  },
  { value: 'cold-start-remove',    label: 'Cold Start Remove',                   extraCost: 0  },
  { value: 'hard-cut-diesel',      label: 'Hard Cut Diesel',                     extraCost: 36 },
  { value: 'immo-off',             label: 'IMMO Off',                            extraCost: 36 },
  { value: 'crackles-petrol',      label: 'Crackles Petrol (only with CAT off)', extraCost: 36 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Base prices per service type (£)
// workshop = customer comes to us, mobile = we go to them
// 0 = no price (e.g. advice call — quoted later)
// ─────────────────────────────────────────────────────────────────────────────

export const BASE_PRICES: Record<RemapServiceValue, { workshop: number; mobile: number; fromPrice?: boolean }> = {
  'stage-1':         { workshop: 220, mobile: 240 },
  'stage-2':         { workshop: 400, mobile: 420 },
  'custom-fleet':    { workshop: 220, mobile: 240 },
  'dpf-remap-bundle':{ workshop: 850, mobile: 850, fromPrice: true },
  'not-sure':        { workshop: 0,   mobile: 0   },
};
