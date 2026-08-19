// ─────────────────────────────────────────────────────────────────────────────
// Private regional trade-outreach landing pages (postal-letter QR campaign).
//
// This file is the SINGLE source of truth for the campaign:
//   • every region shown at /trade-invite/<slug>
//   • the centrally managed offer expiry date
//   • the offer terms and turnaround terms
//   • the shared offer / process / partnership copy
//
// To add a future region, append one object to TRADE_INVITE_REGIONS. The route,
// prerendered page and sitemap exclusion all follow automatically.
//
// These pages are deliberately NOT public SEO pages: they are noindex/nofollow,
// excluded from the sitemap and never linked from the nav, footer or any public
// service page.
// ─────────────────────────────────────────────────────────────────────────────

export interface TradeInviteRegion {
  /** URL segment: /trade-invite/<slug> */
  slug: string;
  /** Display name for the region, e.g. "Exeter & East Devon". */
  regionName: string;
  /** Main town or city the letters are posted to. */
  mainTown: string;
  /** Nearby towns covered by the collection round. */
  nearbyTowns: string[];
  /** Regional H1. */
  headline: string;
  /** Local opening paragraph. */
  openingCopy: string;
  /** One line of regional service emphasis. */
  serviceEmphasis: string;
  /** Invitation code printed on the letter. */
  invitationCode: string;
  /** Campaign identifier, matches the utm_campaign on the printed QR code. */
  campaignId: string;
  /** Wording describing the collection area. */
  collectionAreaWording: string;
  /** <title> for the page. */
  metaTitle: string;
  /** Meta description. */
  metaDescription: string;
  /**
   * Optional per-region override of the central expiry date. Leave undefined to
   * use TRADE_OFFER.expiryDisplay.
   */
  offerExpiry?: string;
  /**
   * Optional per-region override of the WhatsApp message. Leave undefined to use
   * the generated default from buildWhatsAppMessage().
   */
  whatsappMessage?: string;
}

// ── Centrally managed offer settings ────────────────────────────────────────

export const TRADE_OFFER = {
  /** Headline offer used across every regional page. */
  title: 'Your First Trade DPF Clean Is Completely Free',
  /** Short form used on the offer card. */
  cardTitle: 'FIRST TRADE DPF CLEAN: FREE',
  /**
   * The offer expiry date. THIS is the single place to change it. Every
   * regional page, the offer card and the terms all read from here.
   */
  expiryDisplay: '31 October 2026',
  /** Machine-readable form of the same date. */
  expiryISO: '2026-10-31',
  cardBody:
    'We will collect the removed DPF from your workshop, test it, internally inspect it, professionally clean and dry it, test it again, provide before-and-after flow reports and return it to you.',
  noChargeLine: 'No cleaning, collection or return charge',
  noContractLine: 'No contract, no membership fee and no minimum monthly volume.',
} as const;

/** Exactly what the free service includes. */
export const OFFER_INCLUDES: string[] = [
  'Collection of the removed DPF from the garage',
  'Initial testing of the DPF',
  'Internal inspection of the DPF',
  'Professional DPF cleaning',
  'Controlled drying',
  'Post-clean testing',
  'Before-and-after flow reports',
  'Return of the cleaned DPF to the garage',
  'No cleaning charge',
  'No collection charge',
  'No return-delivery charge',
];

/** The eight-step process shown on every regional page. */
export const PROCESS_STEPS: { title: string; copy: string }[] = [
  { title: 'Collection', copy: 'We collect the removed DPF directly from your workshop.' },
  { title: 'Initial Testing', copy: 'The unit is tested before cleaning to assess its condition and airflow.' },
  { title: 'Internal Inspection', copy: 'Every DPF is internally inspected before the cleaning process.' },
  { title: 'Professional Cleaning', copy: "The DPF is professionally cleaned using Auto-Cleanse's specialist process." },
  { title: 'Controlled Drying', copy: 'The unit is thoroughly dried before final testing.' },
  { title: 'Final Testing', copy: 'The DPF is tested again following cleaning.' },
  { title: 'Flow Reports', copy: 'The garage receives clear before-and-after flow reports.' },
  { title: 'Return', copy: 'The cleaned DPF is returned directly to the workshop.' },
];

/** Honest caveat shown with the process: not every unit can be recovered. */
export const PROCESS_CAVEAT =
  'Not every DPF can be recovered. Physical damage, melting, internal collapse or severe contamination may make a unit unsuitable for cleaning. If our internal inspection finds a problem, we will contact you before going any further.';

/** The removal requirement, stated plainly. */
export const REMOVAL_REQUIREMENT =
  'The DPF must be removed from the vehicle and ready for collection. DPF removal and refitting are not included in the free offer unless separately agreed for that job.';

// ── Turnaround guarantee ────────────────────────────────────────────────────

export const TURNAROUND = {
  headline: 'Collected Before 12:00 PM? Same-Day Return Guaranteed.',
  before:
    'If we collect the removed DPF from your workshop before 12:00 PM, we guarantee that it will be cleaned, dried, tested and returned the same day.',
  after:
    'For collections after 12:00 PM, we will always do our best to complete and return the unit the same day. Where this is not possible, return is guaranteed the following working day.',
} as const;

export const TURNAROUND_TERMS: string[] = [
  'The timing applies from the point at which Auto-Cleanse physically collects the removed DPF.',
  'The DPF must be accessible and ready for collection.',
  'The DPF must be suitable for the normal professional cleaning process.',
  'The guarantee applies on normal working days.',
  "Exceptional circumstances outside Auto-Cleanse's reasonable control may affect collection or return timing.",
  'Severely damaged, melted, internally collapsed, contaminated or otherwise unserviceable DPFs may not be suitable for cleaning.',
  'Auto-Cleanse will contact the garage if an internal inspection identifies physical damage or another reason the unit cannot be cleaned normally.',
];

// ── Offer terms ─────────────────────────────────────────────────────────────

export const OFFER_TERMS: string[] = [
  'The offer is available to genuine automotive garages, workshops, MOT centres, mechanics or related automotive businesses.',
  'One free introductory DPF clean per eligible business.',
  'The offer applies to the first eligible trade DPF clean.',
  'The DPF must be removed from the vehicle and ready for collection.',
  'DPF removal and refitting are not included unless separately agreed.',
  'Vehicle diagnostics and unrelated repairs are not included.',
  'Collection, cleaning, drying, testing, reports and return are included.',
  'There is no cash alternative.',
  'The offer cannot be combined with another introductory promotion.',
  'Auto-Cleanse may verify the applicant and business details.',
  'Auto-Cleanse may decline duplicate, fraudulent or ineligible claims.',
  'The DPF must be suitable for the normal professional cleaning process.',
  'Physically damaged, melted, internally collapsed, heavily contaminated or otherwise unserviceable units may be unsuitable.',
  'The same-day guarantee applies when the removed DPF is collected before 12:00 PM on a normal working day.',
  'Collections after 12:00 PM will be returned the same day where reasonably possible, otherwise the following working day.',
  "Exceptional events outside Auto-Cleanse's reasonable control may affect collection or return.",
  'The offer must be claimed before the displayed expiry date.',
  'Booking and collection remain subject to confirmation by Auto-Cleanse.',
  'The promotion does not create an obligation to use Auto-Cleanse again.',
];

// ── Why the first clean is free ─────────────────────────────────────────────

export const WHY_FREE = {
  heading: 'Why Are We Offering This Free?',
  copy: 'We want local garages to experience the complete Auto-Cleanse trade service before deciding whether to use us for future customer vehicles. We are confident that our collection service, internal inspection, professional cleaning process, detailed flow reports and rapid turnaround will demonstrate the quality and value we can provide to your workshop.',
  supporting: 'There is no contract and no obligation to send us another DPF.',
} as const;

// ── How the ongoing trade relationship works ────────────────────────────────

export const PARTNERSHIP_STEPS: { title: string; copy: string }[] = [
  {
    title: 'You Keep the Customer',
    copy: "The garage remains the customer's main point of contact and stays in control of the job.",
  },
  {
    title: 'We Handle the Specialist Cleaning',
    copy: 'Auto-Cleanse collects, inspects, cleans, dries, tests and returns the removed DPF.',
  },
  {
    title: 'You Retain Your Margin',
    copy: 'For future paid jobs, you can invoice your customer directly and include your own commercial margin.',
  },
];

// ── Final CTA ───────────────────────────────────────────────────────────────

export const FINAL_CTA = {
  heading: 'Let Us Prove the Quality of Our DPF Cleaning Service.',
  supporting:
    'Your first eligible trade DPF clean is completely free, including collection, internal inspection, cleaning, drying, testing, reports and return.',
} as const;

// ── Contact details (existing Auto-Cleanse numbers) ─────────────────────────

export const TRADE_CONTACT = {
  phoneDisplay: '01803 269895',
  phoneHref: 'tel:01803269895',
  mobileDisplay: '07823 649190',
  mobileHref: 'tel:07823649190',
  whatsappNumber: '447823649190',
  website: 'auto-cleanse.co.uk',
} as const;

/** Builds the pre-filled WhatsApp message for a region. */
export function buildWhatsAppMessage(region: TradeInviteRegion): string {
  return (
    region.whatsappMessage ??
    `Hi Auto-Cleanse, I received your ${region.regionName} trade invitation and would like to claim my free first DPF clean. My invitation code is ${region.invitationCode}.`
  );
}

/** Builds the full wa.me link for a region. */
export function buildWhatsAppLink(region: TradeInviteRegion): string {
  return `https://wa.me/${TRADE_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    buildWhatsAppMessage(region)
  )}`;
}

/** The expiry date shown for a region (per-region override, else central). */
export function offerExpiryFor(region: TradeInviteRegion): string {
  return region.offerExpiry ?? TRADE_OFFER.expiryDisplay;
}

// ── Regions ─────────────────────────────────────────────────────────────────

export const TRADE_INVITE_REGIONS: TradeInviteRegion[] = [
  {
    slug: 'exeter',
    regionName: 'Exeter & East Devon',
    mainTown: 'Exeter',
    nearbyTowns: ['Exeter', 'Exmouth', 'Crediton', 'Cullompton', 'Honiton', 'East Devon'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Exeter & East Devon',
    openingCopy:
      'Auto-Cleanse is expanding its trade DPF cleaning service across Exeter, Exmouth, Crediton, Cullompton, Honiton and the surrounding East Devon area. We collect removed DPFs directly from local garages, professionally test and clean them, and return them with detailed before-and-after flow reports.',
    serviceEmphasis:
      'Collection, professional cleaning and before-and-after flow reports for garages across Exeter and East Devon.',
    invitationCode: 'EXETERFREE',
    campaignId: 'trade-outreach-exeter',
    collectionAreaWording:
      'We collect from garages across Exeter, Exmouth, Crediton, Cullompton, Honiton and the surrounding East Devon area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Exeter & East Devon Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Exeter and East Devon. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'plymouth',
    regionName: 'Plymouth & South Hams',
    mainTown: 'Plymouth',
    nearbyTowns: ['Plymouth', 'Saltash', 'Ivybridge', 'Tavistock', 'Plympton', 'South Hams'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Plymouth & South Hams',
    openingCopy:
      'Auto-Cleanse is introducing its trade DPF cleaning service across Plymouth, Saltash, Ivybridge, Tavistock, Plympton and the surrounding South Hams area. Our collection and return service allows garages to access professional DPF cleaning without investing in specialist cleaning and testing equipment.',
    serviceEmphasis:
      'Professional off-vehicle DPF cleaning for Plymouth and South Hams garages, without buying specialist equipment.',
    invitationCode: 'PLYMOUTHFREE',
    campaignId: 'trade-outreach-plymouth',
    collectionAreaWording:
      'We collect from garages across Plymouth, Saltash, Ivybridge, Tavistock, Plympton and the surrounding South Hams area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Plymouth & South Hams Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Plymouth and the South Hams. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'torbay',
    regionName: 'Torbay & South Devon',
    mainTown: 'Torquay',
    nearbyTowns: ['Torquay', 'Paignton', 'Brixham', 'Newton Abbot', 'Totnes'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Torbay & South Devon',
    openingCopy:
      'Based in South Devon, Auto-Cleanse supports garages across Torquay, Paignton, Brixham, Newton Abbot, Totnes and the surrounding area. We collect removed DPFs, internally inspect them, professionally clean and test them, and return them with before-and-after flow reports.',
    serviceEmphasis:
      'Our workshop is in South Devon, so collection and return across Torbay is quick and straightforward.',
    invitationCode: 'TORBAYFREE',
    campaignId: 'trade-outreach-torbay',
    collectionAreaWording:
      'We collect from garages across Torquay, Paignton, Brixham, Newton Abbot, Totnes and the surrounding area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Torbay & South Devon Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Torbay and South Devon. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'north-devon',
    regionName: 'North Devon',
    mainTown: 'Barnstaple',
    nearbyTowns: ['Barnstaple', 'Bideford', 'South Molton', 'Ilfracombe', 'Torrington'],
    headline: 'Professional Trade DPF Cleaning for Garages Across North Devon',
    openingCopy:
      'Auto-Cleanse is introducing its trade DPF cleaning service to automotive businesses across Barnstaple, Bideford, South Molton, Ilfracombe, Torrington and the wider North Devon area. Garages can use our specialist collection, cleaning, testing and return service whenever a customer vehicle requires professional off-vehicle DPF cleaning.',
    serviceEmphasis:
      'Specialist off-vehicle DPF cleaning for North Devon workshops, collected and returned to your door.',
    invitationCode: 'NORTHDEVONFREE',
    campaignId: 'trade-outreach-north-devon',
    collectionAreaWording:
      'We collect from garages across Barnstaple, Bideford, South Molton, Ilfracombe, Torrington and the wider North Devon area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for North Devon Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across North Devon. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'cornwall',
    regionName: 'Cornwall',
    mainTown: 'Truro',
    nearbyTowns: ['Truro', 'St Austell', 'Newquay', 'Bodmin', 'Redruth'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Cornwall',
    openingCopy:
      'Auto-Cleanse is expanding its trade DPF cleaning support across Truro, St Austell, Newquay, Bodmin, Redruth and the wider Cornwall area. Our service includes collection of the removed DPF, internal inspection, professional cleaning, drying, testing, detailed reports and return to the workshop.',
    serviceEmphasis:
      'A complete collection, inspection, cleaning, testing and return service for Cornish garages.',
    invitationCode: 'CORNWALLFREE',
    campaignId: 'trade-outreach-cornwall',
    collectionAreaWording:
      'We collect from garages across Truro, St Austell, Newquay, Bodmin, Redruth and the wider Cornwall area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Cornwall Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Cornwall. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'somerset',
    regionName: 'Somerset',
    mainTown: 'Taunton',
    nearbyTowns: ['Taunton', 'Bridgwater', 'Yeovil', 'Weston-super-Mare', 'Wellington'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Somerset',
    openingCopy:
      'Auto-Cleanse is introducing its trade DPF cleaning service across Taunton, Bridgwater, Yeovil, Weston-super-Mare, Wellington and the surrounding Somerset area. We provide garages with a straightforward collection and return service backed by internal inspection and before-and-after flow testing.',
    serviceEmphasis:
      'A straightforward collection and return service backed by internal inspection and flow testing.',
    invitationCode: 'SOMERSETFREE',
    campaignId: 'trade-outreach-somerset',
    collectionAreaWording:
      'We collect from garages across Taunton, Bridgwater, Yeovil, Weston-super-Mare, Wellington and the surrounding Somerset area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Somerset Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Somerset. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'bristol',
    regionName: 'Bristol & Surrounding Areas',
    mainTown: 'Bristol',
    nearbyTowns: ['Bristol', 'Bath', 'Keynsham', 'Portishead', 'South Gloucestershire'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Bristol',
    openingCopy:
      'Auto-Cleanse is expanding its trade DPF cleaning service to automotive businesses across Bristol, Bath, Keynsham, Portishead and South Gloucestershire. Our professional off-vehicle cleaning process gives garages access to specialist testing, cleaning and reporting without purchasing dedicated equipment.',
    serviceEmphasis:
      'Specialist testing, cleaning and reporting for Bristol-area workshops without buying dedicated equipment.',
    invitationCode: 'BRISTOLFREE',
    campaignId: 'trade-outreach-bristol',
    collectionAreaWording:
      'We collect from garages across Bristol, Bath, Keynsham, Portishead and South Gloucestershire.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Bristol Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Bristol and the surrounding area. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'dorset',
    regionName: 'Dorset',
    mainTown: 'Dorchester',
    nearbyTowns: ['Dorchester', 'Weymouth', 'Poole', 'Bournemouth', 'Bridport'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Dorset',
    openingCopy:
      'Auto-Cleanse is introducing its trade DPF cleaning service across Dorchester, Weymouth, Poole, Bournemouth, Bridport and the wider Dorset area. We collect removed units from garages, inspect and professionally clean them, and return them with clear before-and-after flow reports.',
    serviceEmphasis:
      'Collection, internal inspection, professional cleaning and clear flow reports for Dorset garages.',
    invitationCode: 'DORSETFREE',
    campaignId: 'trade-outreach-dorset',
    collectionAreaWording:
      'We collect from garages across Dorchester, Weymouth, Poole, Bournemouth, Bridport and the wider Dorset area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Dorset Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Dorset. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'wiltshire',
    regionName: 'Wiltshire',
    mainTown: 'Swindon',
    nearbyTowns: ['Swindon', 'Salisbury', 'Chippenham', 'Trowbridge', 'Devizes'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Wiltshire',
    openingCopy:
      'Auto-Cleanse is expanding its trade DPF cleaning service across Swindon, Salisbury, Chippenham, Trowbridge, Devizes and the wider Wiltshire area. We provide a professional collection, internal inspection, cleaning, drying, testing and return service for removed DPF units.',
    serviceEmphasis:
      'A professional collection, inspection, cleaning, drying, testing and return service for removed DPF units.',
    invitationCode: 'WILTSHIREFREE',
    campaignId: 'trade-outreach-wiltshire',
    collectionAreaWording:
      'We collect from garages across Swindon, Salisbury, Chippenham, Trowbridge, Devizes and the wider Wiltshire area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Wiltshire Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Wiltshire. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
  {
    slug: 'gloucestershire',
    regionName: 'Gloucestershire',
    mainTown: 'Gloucester',
    nearbyTowns: ['Gloucester', 'Cheltenham', 'Stroud', 'Cirencester', 'Tewkesbury'],
    headline: 'Professional Trade DPF Cleaning for Garages Across Gloucestershire',
    openingCopy:
      'Auto-Cleanse is introducing its trade DPF cleaning service to automotive businesses across Gloucester, Cheltenham, Stroud, Cirencester, Tewkesbury and the wider Gloucestershire area. Garages can use our collection and return service whenever they require professional off-vehicle DPF cleaning and testing.',
    serviceEmphasis:
      'Collection and return whenever your workshop needs professional off-vehicle DPF cleaning and testing.',
    invitationCode: 'GLOUCESTERFREE',
    campaignId: 'trade-outreach-gloucestershire',
    collectionAreaWording:
      'We collect from garages across Gloucester, Cheltenham, Stroud, Cirencester, Tewkesbury and the wider Gloucestershire area.',
    metaTitle: 'Trade Invitation | Free First DPF Clean for Gloucestershire Garages | Auto-Cleanse',
    metaDescription:
      'Private trade invitation for garages across Gloucestershire. Claim your first trade DPF clean completely free, including collection, cleaning, testing and return.',
  },
];

/** Look up a region by slug. Returns undefined for unknown slugs (→ 404). */
export function getTradeInviteRegion(slug?: string): TradeInviteRegion | undefined {
  if (!slug) return undefined;
  return TRADE_INVITE_REGIONS.find((r) => r.slug === slug.toLowerCase());
}

/** Every campaign route, used for prerendering and for sitemap exclusion. */
export const TRADE_INVITE_ROUTES: string[] = TRADE_INVITE_REGIONS.map(
  (r) => `/trade-invite/${r.slug}`
);
