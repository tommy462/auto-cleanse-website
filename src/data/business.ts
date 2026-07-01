// Single source of truth for the Auto-Cleanse business entity used across all
// JSON-LD schema. Keeping one canonical NAP + a stable @id lets search engines
// and AI answer engines consolidate every page onto one business entity.
//
// Canonical brand: "Auto-Cleanse" (matches the domain/email). "AutoCleanse" and
// "Auto Cleanse" are accepted alternates (alternateName).

export const BUSINESS_ID = 'https://www.auto-cleanse.co.uk/#business';

export const BUSINESS = {
  name: 'Auto-Cleanse',
  alternateName: ['AutoCleanse', 'Auto Cleanse'],
  telephone: '+441803269895', // E.164 for schema / tel: hrefs
  phoneDisplay: '01803 269895',
  email: 'info@auto-cleanse.co.uk',
  url: 'https://www.auto-cleanse.co.uk',
  logo: 'https://www.auto-cleanse.co.uk/autocleanse-text-logo.png',
  image: 'https://www.auto-cleanse.co.uk/og-image.jpg',
  streetAddress: 'The Old Barn Industrial Estate, Webbers Yard',
  addressLocality: 'Totnes',
  addressRegion: 'Devon',
  postalCode: 'TQ9 6JY',
  addressCountry: 'GB',
  latitude: '50.4316',
  longitude: '-3.6844',
  priceRange: '££',
  // Official profiles already used across the site. LinkedIn is the owner's
  // personal profile (flagged for owner review — swap for a company page if made).
  sameAs: [
    'https://www.facebook.com/profile.php?id=61573744325360',
    'https://www.instagram.com/auto_cleansedpf/',
    'https://www.youtube.com/@Auto-Cleanse',
    'https://www.linkedin.com/in/alex-rabone-102786158/',
  ] as string[],
};

export const OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  },
];

// Reference the business entity by @id (e.g. as a Service provider) without
// redefining the whole thing.
export const businessRef = { '@id': BUSINESS_ID };

// LocalBusiness/AutomotiveService node WITHOUT @context — for nesting (provider,
// @graph, arrays). Pass per-page extras (description, serviceType, areaServed…).
export function localBusinessNode(overrides: Record<string, unknown> = {}) {
  return {
    '@type': ['AutomotiveService', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: BUSINESS.name,
    alternateName: BUSINESS.alternateName,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    url: BUSINESS.url,
    logo: BUSINESS.logo,
    image: BUSINESS.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.latitude, longitude: BUSINESS.longitude },
    openingHoursSpecification: OPENING_HOURS,
    priceRange: BUSINESS.priceRange,
    sameAs: BUSINESS.sameAs,
    ...overrides,
  };
}

// Top-level standalone LocalBusiness schema (with @context) for a single
// <script type="application/ld+json"> block.
export function localBusinessSchema(overrides: Record<string, unknown> = {}) {
  return { '@context': 'https://schema.org', ...localBusinessNode(overrides) };
}
