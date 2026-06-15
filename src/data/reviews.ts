// Central store of genuine Auto-Cleanse customer reviews.
//
// IMPORTANT:
// - Every review here is real (Google reviews + direct customer/garage feedback).
// - Review text is preserved exactly as written. Do not edit wording.
// - `rating` reflects the positive feedback provided; if a specific Google review
//   was left at fewer than 5 stars, set that card's rating to the real value.
// - We deliberately do NOT emit Review / AggregateRating structured data: Google's
//   guidelines disallow self-serving review rich results for LocalBusiness, so any
//   such markup would be non-compliant. The text stays as crawlable HTML instead.

export type ReviewSource = 'Google Review' | 'Customer Feedback';
export type ServiceCategory =
  | 'DPF Cleaning'
  | 'DPF Diagnostics'
  | 'ECU Remapping'
  | 'General';

export interface Review {
  id: string;
  name: string;
  company?: string;
  source: ReviewSource;
  serviceCategory: ServiceCategory;
  rating: number;
  text: string;
  initials: string;
  featured?: boolean;
}

// Public Google Business Profile reviews URL for the "Read more Google reviews" CTA.
// When blank, the CTA is hidden. (A shorter g.page / maps.app.goo.gl link can be
// swapped in later if preferred; this is the profile's reviews view.)
export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=Auto-Cleanse&stick=H4sIAAAAAAAA_-NgU1IxqEhNNDNNTjUyNTQ1SzRMNLYyqEgyTDRJTEpMtkg2MkpNMrNcxMrjWFqSr-uck5qYV5wKANEzjGU3AAAA&hl=en-GB#mpd=~13653728452563673772/customers/reviews';

export const REVIEWS: Review[] = [
  {
    id: 'jamie-webb',
    name: 'Jamie Webb',
    source: 'Google Review',
    serviceCategory: 'ECU Remapping',
    rating: 5,
    initials: 'JW',
    featured: true,
    text: "Had my Renault Trafic 1.6 remapped by Auto-Cleanse and honestly the difference is night and day. Pulls much better, smoother to drive and feels far more responsive, especially in lower gears.\n\nTom carried out full diagnostics beforehand and explained everything properly before touching the vehicle, which gave me confidence straight away. Proper professional setup and quick turnaround too.\n\nIf anyone is looking for ECU remapping in Devon I'd definitely recommend Auto-Cleanse. Top service from start to finish.",
  },
  {
    id: 'dave-lewis',
    name: 'Dave Lewis',
    source: 'Google Review',
    serviceCategory: 'General',
    rating: 5,
    initials: 'DL',
    text: "Fantastic service knows what is doing sorted my car out I'm well pleased thank you so much",
  },
  {
    id: 'reece-lloyd',
    name: 'Reece Lloyd',
    source: 'Google Review',
    serviceCategory: 'ECU Remapping',
    rating: 5,
    initials: 'RL',
    featured: true,
    text: "Just wanted to say a massive thanks again from Auto-Cleanse been in today to get stage 1 and added burbles on my ford focus st mk3 couldn't be happier car drives so smooth and I love the pops! Cheers 💪",
  },
  {
    id: 'martin-amis',
    name: 'Martin Amis',
    source: 'Google Review',
    serviceCategory: 'DPF Diagnostics',
    rating: 5,
    initials: 'MA',
    featured: true,
    text: "I took my VW Golf diesel to AutoClean after it went into limp mode with a flashing glow-plug light and suspected DPF blockage. Tom carried out proper diagnostics and confirmed the DPF itself was healthy. Instead of replacing parts unnecessarily, they identified a faulty DPF differential pressure sensor as the root cause. The issue was explained clearly, the costs were transparent, and the repair was completed promptly. Limp mode resolved immediately and no further work was pushed.\n\nI appreciated that they didn't default to a costly DPF removal when it wasn't needed. Good diagnostics, straightforward communication, and a proportionate fix.\n\nWould recommend if you're dealing with DPF or emissions-related issues.",
  },
  {
    id: 'luke-thomas',
    name: 'Luke Thomas',
    source: 'Google Review',
    serviceCategory: 'General',
    rating: 5,
    initials: 'LT',
    text: "Quick, efficient and professional service from start to finish. would highly recommend .",
  },
  {
    id: 'win-scutt',
    name: 'Win Scutt',
    source: 'Google Review',
    serviceCategory: 'DPF Cleaning',
    rating: 5,
    initials: 'WS',
    text: "Brilliant. Fast efficient service. Collected, cleaned and returned quickly.",
  },
  {
    id: 'james-riggs',
    name: 'James Riggs',
    source: 'Google Review',
    serviceCategory: 'DPF Cleaning',
    rating: 5,
    initials: 'JR',
    featured: true,
    text: "Auto Cleanse removed, cleaned and replaced my dpf effectively and promptly, all in all a trouble free service. Communication was excellent and I'm no longer scared of my DPF. I'd recommend this company.",
  },
  {
    id: 'mordiford-man',
    name: 'Mordiford Man',
    source: 'Google Review',
    serviceCategory: 'General',
    rating: 5,
    initials: 'MM',
    text: "Alex was so helpful in getting car in immediately to VMS in Paignton and kept me updated on progress and likely resolution. Couldn't fault how he dealt with it",
  },
  {
    id: 'antony-moore',
    name: 'Antony Moore',
    company: 'TSH Garage',
    source: 'Customer Feedback',
    serviceCategory: 'DPF Cleaning',
    rating: 5,
    initials: 'AM',
    featured: true,
    text: "Just wanted to say thanks again for the super quick response and turnaround for DPF Cleaning, picked up and dropped off within two hours. Can't fault the service and advice from Alex at Auto Cleanse, we will definitely be using your services in the future. Would 100% recommend Auto Cleanse to anyone.",
  },
  {
    id: 'otr-mobile',
    name: 'OTR Mobile Mechanic & Garage Services',
    source: 'Customer Feedback',
    serviceCategory: 'DPF Cleaning',
    rating: 5,
    initials: 'OTR',
    text: "Absolutely brilliant service, called Alex explained the problem, advised him of heavy oil contamination from a failed turbo, explained needed it turned around quick. Alex turned up within 20mins and said a time of 11am next day and he was with me by 10.30 will definitely be using him from now on for all my off car DPF cleans.",
  },
  {
    id: 'claire-honeywill',
    name: 'Claire',
    company: 'Honeywill Vehicle Repairs',
    source: 'Customer Feedback',
    serviceCategory: 'General',
    rating: 5,
    initials: 'C',
    text: "Efficient service provided, good lines of communication, fairly priced.",
  },
  {
    id: 'danny-hunt',
    name: 'Danny Hunt',
    source: 'Customer Feedback',
    serviceCategory: 'DPF Cleaning',
    rating: 5,
    initials: 'DH',
    text: "Excellent service spoke to Alex who was really helpful. Collected the part from us and had it cleaned and returned all within a few hours definitely would use them again. 5 star service",
  },
];

// Curated selections per context (balanced mix of DPF cleaning, DPF diagnostics,
// ECU remapping and trade feedback).
export const HOMEPAGE_REVIEW_IDS = [
  'martin-amis', 'james-riggs', 'jamie-webb', 'antony-moore',
  'reece-lloyd', 'otr-mobile', 'win-scutt', 'danny-hunt',
];
export const DPF_REVIEW_IDS = [
  'james-riggs', 'martin-amis', 'antony-moore', 'otr-mobile', 'win-scutt', 'danny-hunt',
];
export const DPF_TOWN_REVIEW_IDS = ['james-riggs', 'martin-amis', 'antony-moore'];
// Diagnostics page leads with Martin Amis (sensor fault found, no unnecessary work).
export const DPF_DIAGNOSTICS_REVIEW_IDS = ['martin-amis', 'james-riggs', 'antony-moore'];
export const BLOCKED_DPF_REVIEW_IDS = ['james-riggs', 'martin-amis', 'danny-hunt'];
export const ECU_REVIEW_IDS = ['jamie-webb', 'reece-lloyd', 'dave-lewis', 'luke-thomas'];
export const ECU_COMPACT_REVIEW_IDS = ['jamie-webb', 'reece-lloyd', 'dave-lewis'];

const REVIEW_BY_ID = new Map(REVIEWS.map((r) => [r.id, r]));

export function getReviews(ids: string[]): Review[] {
  return ids.map((id) => REVIEW_BY_ID.get(id)).filter((r): r is Review => Boolean(r));
}
