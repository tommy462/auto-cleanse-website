// Genuine, measured DPF cleaning results shown on /dpf-cleaning.
//
// CONTENT RULES - read before adding anything here:
// 1. Only add entries copied from a real Auto-Cleanse before/after test sheet.
//    Whatever is in this array is rendered on the page as fact.
// 2. Never estimate, round up, average or invent a reading. If the sheet is not
//    to hand, leave it out.
// 3. Include the unit in the string exactly as it was measured ("142 mbar",
//    "0.42 bar"), so no unit conversion happens in the UI.
// 4. An EMPTY array is a valid, safe state: the results section falls back to a
//    non-numeric "how we measure it" panel instead of showing made-up figures.
// 5. Do not name a customer or show a registration.

export interface DpfResult {
  /** Vehicle description, e.g. "Ford Transit 2.2 TDCi". No registrations. */
  vehicle: string;
  /** Pre-clean reading including its unit, e.g. "142 mbar". */
  before: string;
  /** Post-clean reading including its unit, e.g. "31 mbar". */
  after: string;
  /** Short factual summary of the outcome. No guarantees or superlatives. */
  outcome: string;
}

export const DPF_RESULTS: DpfResult[] = [];
