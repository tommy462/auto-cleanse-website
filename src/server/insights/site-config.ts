// Everything about Auto-Cleanse that the insights engine needs to know, in one
// place. The engine itself is generic: another business gets its own config
// (page groups, what counts as a conversion, how much each kind of page is
// worth) and its own credentials, and nothing else changes.

export interface GroupDef {
  key: string;
  label: string;
  service: 'dpf' | 'ecu' | 'adblue' | 'general' | 'none';
  /**
   * Relative commercial weight of one extra visit to this kind of page, used
   * ONLY to rank recommendations against each other. It is a business
   * assumption, not a measurement: set from the price list and Tom's job
   * economics (Devon jobs are ours at full price; national jobs go to the
   * partner network for a margin; articles and legal pages rarely sell).
   * Once enough conversions are recorded, the engine ranks on measured
   * conversion rates instead and says so on the recommendation.
   */
  weight: number;
  commercial: boolean;
}

export interface SiteConfig {
  id: string;
  name: string;
  baseUrl: string;
  canonicalHost: string;
  groups: GroupDef[];
  /** GA4 event names the collector pulls per page, and what each means. */
  events: Record<string, 'lead' | 'phone' | 'whatsapp' | 'booking_start' | 'cta' | 'other'>;
  /** Plain facts the AI write-up may use. Never invent anything beyond these. */
  businessFacts: string[];
  /** Copy rules for any proposed wording. */
  copyRules: string[];
  /** Pages whose URLs, prices or booking flow must never be changed by the engine. */
  protectedPaths: string[];
  /**
   * Page groups whose sitemap date is the date the page was launched (generated
   * sets that are never edited one by one). Only these are treated as "too new
   * to judge"; elsewhere a recent sitemap date is an edit to an established page.
   */
  launchDatedGroups: string[];
  clarityProjectId?: string;
  /** First full day the site's own enquiry counter (POST /api/insights) was live. Days before it are not compared against GA4. */
  siteLeadsFrom?: string;
}

export const AUTO_CLEANSE: SiteConfig = {
  id: 'auto-cleanse',
  name: 'Auto-Cleanse',
  baseUrl: 'https://www.auto-cleanse.co.uk',
  canonicalHost: 'www.auto-cleanse.co.uk',
  // The counter shipped on 3 Nov 2026; the 4th was its first full day.
  siteLeadsFrom: '2026-11-04',
  groups: [
    { key: 'home', label: 'Home page', service: 'general', weight: 0.8, commercial: true },
    { key: 'dpf-hub', label: 'DPF service pages', service: 'dpf', weight: 1, commercial: true },
    { key: 'dpf-town', label: 'DPF town pages (Devon)', service: 'dpf', weight: 1, commercial: true },
    { key: 'ecu-hub', label: 'Remapping service pages', service: 'ecu', weight: 1.2, commercial: true },
    { key: 'ecu-devon-town', label: 'Remapping town pages (Devon)', service: 'ecu', weight: 1.2, commercial: true },
    { key: 'ecu-national-town', label: 'Remapping town pages (national)', service: 'ecu', weight: 0.5, commercial: true },
    { key: 'vehicle', label: 'Vehicle remap pages', service: 'ecu', weight: 1, commercial: true },
    { key: 'adblue-hub', label: 'AdBlue service pages', service: 'adblue', weight: 0.8, commercial: true },
    { key: 'adblue-town', label: 'AdBlue town pages (national)', service: 'adblue', weight: 0.5, commercial: true },
    { key: 'adblue-guide', label: 'AdBlue guides', service: 'adblue', weight: 0.3, commercial: false },
    { key: 'booking', label: 'Booking and pricing', service: 'general', weight: 1.5, commercial: true },
    { key: 'contact', label: 'Contact and about', service: 'general', weight: 1, commercial: true },
    { key: 'trade', label: 'Trade pages', service: 'general', weight: 0.6, commercial: true },
    { key: 'blog', label: 'Blog articles', service: 'general', weight: 0.15, commercial: false },
    { key: 'legal', label: 'Legal and policy pages', service: 'none', weight: 0, commercial: false },
    { key: 'utility', label: 'Utility pages', service: 'none', weight: 0, commercial: false },
    { key: 'other', label: 'Other pages', service: 'general', weight: 0.3, commercial: false },
  ],
  events: {
    generate_lead: 'lead',
    phone_click: 'phone',
    contact_click: 'whatsapp',
    booking_click: 'booking_start',
    begin_checkout: 'booking_start',
    dpf_cta_click: 'cta',
    bulletin_signup: 'other',
  },
  businessFacts: [
    'Auto-Cleanse (Auto Cleanse Services Ltd) is a workshop in Totnes, Devon. Phone 07823 649190. Mon-Fri 09:00-17:00.',
    'DPF cleaning is off-vehicle only, at the Totnes workshop or by post. There is NO mobile DPF cleaning.',
    'DPF cleaning: £210 within 10 miles of Totnes, £230 outside that or posted, £299 HGV and plant.',
    'The clean is water only (high-pressure aqueous and micro-cavitation, reverse flushed), hot-air dried, flow tested before and after.',
    'ECU remapping: Stage 1 £250 at the workshop, £270 mobile within Devon; Stage 2 price on application; £50 online deposit to book.',
    'Mobile remapping by Auto-Cleanse is Devon only. National town pages state that the town is an area we cover and offer remapping and AdBlue repair through an independent national technician network; who is coming and the price are confirmed by phone after checking the postcode; no national prices are published.',
    'Repair only: no DPF, EGR or AdBlue deletes. Auto-Cleanse applies remap files matched to the vehicle; it does not claim to write files from scratch.',
    'Nearly all visitors use phones. Most enquiries arrive as phone calls.',
    'The DPF town pages are already long (1,500-3,200 words) and the results above them are mostly directories (ClickMechanic, WhoCanFixMyCar), so their main lever is off-site: Google Business Profile, reviews, citations and links from trade garages (Oct 2026 review).',
    'Pages must not be mass-reworded or re-dated; change a few, measure, then roll out.',
  ],
  copyRules: [
    'Never use em dashes or en dashes; use commas, colons, full stops or a spaced hyphen.',
    'British spelling.',
    'No invented reviews, statistics, prices, guarantees, case studies or local facts.',
    'Never say "guaranteed", "24/7", "same day" (only "same day where possible"), "free diagnosis", "no fix no fee", "lifetime warranty" or "nationwide".',
    'Never name the national partner network\'s suppliers; say "our national network".',
    'Do not suggest changing prices, URLs, the booking flow, or the legal pages.',
  ],
  launchDatedGroups: ['adblue-town', 'ecu-national-town'],
  protectedPaths: ['/remapping-booking', '/book', '/booking-success', '/booking-cancel', '/privacy', '/terms', '/cookie-policy', '/refund-policy'],
};

export function groupDef(config: SiteConfig, key: string): GroupDef {
  return config.groups.find((g) => g.key === key) ?? config.groups.find((g) => g.key === 'other')!;
}
