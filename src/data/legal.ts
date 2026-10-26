// Shared facts for the legal pages (privacy, cookies, terms, refunds) so the
// footer, the pages, the booking form and the booking emails never disagree.

// Shown as "Last updated" on every legal page. Change it whenever a policy's
// wording changes, and bump TERMS_VERSION when the terms or refund policy do.
export const LEGAL_LAST_UPDATED = '26 October 2026';

// Recorded on each online booking (Stripe metadata) so we can show which
// version of the terms a customer agreed to.
export const TERMS_VERSION = '2026-10-26';

export const LEGAL_PAGES = [
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Cookie Policy', path: '/cookie-policy' },
  { name: 'Terms & Conditions', path: '/terms' },
  { name: 'Cancellation & Refunds', path: '/refund-policy' },
] as const;

// Remap deposit rules (see /refund-policy). Kept here so the booking page and
// the confirmation email quote the same notice period.
export const DEPOSIT_NOTICE_HOURS = 48;
