// ─────────────────────────────────────────────────────────────────────────────
// May 2026 Launch Campaign — configurable data
// All values you need to edit during the campaign are at the top of this file.
// ─────────────────────────────────────────────────────────────────────────────

// ── Element 1: Offer Banner ───────────────────────────────────────────────────
// Decrement slotsRemaining as bookings come in.
// When it reaches 0, the offer banner is replaced with "fully booked" message.

export const MAY_OFFER = {
  slotsRemaining: 10,   // ← UPDATE THIS as each booking is confirmed
  slotsTotal: 10,
};

// ── Element 3: Recent Remaps ──────────────────────────────────────────────────
// Add a new entry here when each customer remap completes.
// Set framingText to '' once you have 5+ real entries and no longer need the
// "we're new to remapping" context line.

export const RECENT_REMAPS_FRAMING =
  "We launched remapping services in early 2026. The entries below are our first completed customer remaps — more are added as jobs complete.";
// To remove the framing text: set the above to ''

export interface RemapCard {
  month: string;         // e.g. "April 2026"
  vehicle: string;       // e.g. "Audi S4 (B9)"
  serviceType?: string;  // e.g. "Stage 1" — omit if not applicable
  ownerNote: string;     // Brief honest note (shown in quotes)
  customerQuote?: string; // Optional separate customer quote line
}

export const RECENT_REMAPS: RemapCard[] = [
  {
    month: 'April 2026',
    vehicle: 'Audi S4 (B9)',
    serviceType: 'Stage 1',
    ownerNote: 'Smoother throttle response and noticeably better mid-range pull.',
  },
  {
    month: 'April 2026',
    vehicle: 'Mercedes GLC63s',
    ownerNote:
      'Stronger torque delivery without compromising emissions hardware. Customer reports better drivability.',
  },
];

// ── Priority pages ─────────────────────────────────────────────────────────────
// Only these slugs will show the three campaign elements.
// Add or remove slugs here to expand / narrow the campaign.

export const PRIORITY_SLUGS = new Set<string>([
  'ecu-remapping-plymouth',
  'ecu-remapping-exeter',
  'ecu-remapping-torquay',
  'ecu-remapping-paignton',
  'ecu-remapping-totnes',
  'van-remapping-devon',
  'ford-transit-remap',
  'audi-s4-remap',
  'bmw-320d-remap',
  'mercedes-glc63-remap',
]);
