// Data-driven DPF location pages.
//
// CONTENT RULES (learned from the SEO uniqueness audit — keep these):
// 1. Every entry MUST have a unique intro, TWO unique local sections and THREE
//    unique FAQs written for that town. No copy-pasting between towns — each
//    page needs a genuinely different local angle or it becomes a doorway page.
// 2. DPF cleaning is workshop-based / off-vehicle at Totnes. NEVER imply a
//    mobile DPF service. Mobile visits are for ECU remapping only.
// 3. Diagnostics are paid, never "free".
// 4. Same-day wording must stay hedged: "often", "where possible", "before 10am".
// 5. Keep distances consistent with the rest of the site.

export interface DpfContentSection {
  heading: string;
  paragraphs: string[];
}

export interface DpfFaq {
  q: string;
  a: string;
}

export interface DpfLocation {
  slug: string;
  name: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  h1Prefix: string; // e.g. "DPF Cleaning in" — town name is rendered in orange after it
  intro: string;
  /** Two genuinely local sections — the unique core of the page. */
  sections: [DpfContentSection, DpfContentSection];
  /** Three town-specific FAQs. */
  faqs: [DpfFaq, DpfFaq, DpfFaq];
  nearbyAreas: string[];
  /** Slugs of related DPF pages (existing or new). */
  relatedSlugs: string[];
}

/** Name + path for every DPF page on the site, for related links and the
 *  near-me directory. Distances are approximate road miles from the Totnes
 *  workshop, consistent with figures already published on each page. */
export const DPF_DIRECTORY: { name: string; path: string; distance: string; note: string }[] = [
  { name: 'Totnes', path: '/dpf-cleaning-totnes', distance: 'Workshop', note: 'Our home base — drop off in person' },
  { name: 'Newton Abbot', path: '/dpf-cleaning-newton-abbot', distance: '~8 miles', note: 'Collection & drop-off' },
  { name: 'Paignton', path: '/dpf-cleaning-paignton', distance: '~12 miles', note: 'Torbay collection' },
  { name: 'Torquay', path: '/dpf-cleaning-torquay', distance: '~12 miles', note: 'Torbay collection' },
  { name: 'Kingsbridge', path: '/dpf-cleaning-kingsbridge', distance: '~14 miles', note: 'South Hams' },
  { name: 'Ivybridge', path: '/dpf-cleaning-ivybridge', distance: '~15 miles', note: 'A38 corridor' },
  { name: 'Dartmouth', path: '/dpf-cleaning-dartmouth', distance: '~16 miles', note: 'No ferry needed' },
  { name: 'Teignmouth', path: '/dpf-cleaning-teignmouth', distance: '~16 miles', note: 'Teign Estuary' },
  { name: 'Brixham', path: '/dpf-cleaning-brixham', distance: '~18 miles', note: 'Torbay collection' },
  { name: 'Dawlish', path: '/dpf-cleaning-dawlish', distance: '~20 miles', note: 'Coastal East Devon' },
  { name: 'Plymouth', path: '/dpf-cleaning-plymouth', distance: '~25 miles', note: 'Regular collection route' },
  { name: 'Exeter', path: '/dpf-cleaning-exeter', distance: '~27 miles', note: 'Regular collection route' },
  { name: 'Exmouth', path: '/dpf-cleaning-exmouth', distance: '~30 miles', note: 'Collection or postal' },
  { name: 'South Hams', path: '/dpf-cleaning-south-hams', distance: 'Our district', note: 'The workshop is here' },
];

export const DPF_LOCATIONS: DpfLocation[] = [
  {
    slug: 'dpf-cleaning-brixham',
    name: 'Brixham',
    region: 'Torbay',
    metaTitle: 'DPF Cleaning Brixham | Torbay Collection & Return | AutoCleanse',
    metaDescription:
      'Off-vehicle DPF cleaning for Brixham cars, vans and working diesels. Collection from Brixham often combined with our Torbay runs, or drop off at our Totnes workshop. From £210.',
    h1Prefix: 'DPF Cleaning in',
    intro:
      "Brixham runs on working diesels - trades vans, harbour-side deliveries and the pickups that keep the town moving. Short, hilly, stop-start runs around town are exactly the driving pattern that stops a DPF regenerating, which is why blocked filters are so common here. AutoCleanse deep-cleans DPFs off the vehicle at our Totnes workshop, about 18 miles away, with collection from Brixham available or a straightforward drop-off via the A3022 and A385.",
    sections: [
      {
        heading: 'Why Brixham driving blocks DPFs',
        paragraphs: [
          "A DPF cleans itself by regenerating at sustained temperature - typically a steady 15-20 minutes at speed. Brixham's driving profile rarely allows that: the run to Paignton is short and slow in season, the climbs out of the harbour are low-gear work, and many local vans spend the day idling between jobs. Soot builds faster than it burns off, the warning light appears, and eventually the vehicle drops into limp mode.",
          'An off-vehicle deep clean removes that accumulated soot properly - along with the incombustible ash that no amount of driving or forced regeneration can ever shift.',
        ],
      },
      {
        heading: 'Collection from Brixham, or drop off at the workshop',
        paragraphs: [
          'Collection from Brixham can usually be combined with our Torbay runs covering Torquay and Paignton - we collect the removed filter, deep clean and flow-test it at the workshop, and return it with before-and-after figures. Trade garages in Brixham can send several filters on one collection.',
          "If you'd rather drop it in yourself, the workshop at Webbers Yard, Totnes is around 35 minutes via the A3022 and A385, and filters with us before 10am are often turned around the same working day.",
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you collect DPFs from Brixham?',
        a: 'Yes - collection from Brixham is available and can often be combined with our Torbay runs covering Torquay and Paignton. Call 01803 269895 to arrange a slot; trade garages can batch several filters into one collection.',
      },
      {
        q: 'How long will my van be off the road?',
        a: 'If the filter reaches us before 10am, cleaning is often completed the same working day. Most Brixham customers are back on the road within 24-48 hours including removal and refitting time at their garage.',
      },
      {
        q: 'Is this a mobile DPF service?',
        a: "No - DPF cleaning is an off-vehicle workshop process using cleaning and flow-testing equipment that can't be replicated at the roadside. We collect and return, or you can drop the filter to us in Totnes. Mobile visits are available for ECU remapping only.",
      },
    ],
    nearbyAreas: ['Kingswear', 'Churston Ferrers', 'Galmpton', 'Paignton', 'Hillhead', "St Mary's Bay"],
    relatedSlugs: ['dpf-cleaning-paignton', 'dpf-cleaning-torquay', 'dpf-cleaning-dartmouth'],
  },

  {
    slug: 'dpf-cleaning-dartmouth',
    name: 'Dartmouth',
    region: 'South Hams',
    metaTitle: 'DPF Cleaning Dartmouth | Collection & Drop-Off, No Ferry | AutoCleanse',
    metaDescription:
      'Off-vehicle DPF cleaning for Dartmouth drivers and businesses. Collection available, or a 30-minute drop-off to our Totnes workshop with no ferry crossing required.',
    h1Prefix: 'DPF Cleaning in',
    intro:
      "Dartmouth's beautiful but awkward geography is hard on diesels. Short trips around steep lanes, queuing for the ferries and slow seasonal traffic mean many local DPFs never get the sustained run they need to regenerate. AutoCleanse provides off-vehicle DPF cleaning for Dartmouth drivers, trades and hospitality businesses from our Totnes workshop - about 16 miles away, with no ferry required.",
    sections: [
      {
        heading: 'Short trips, steep lanes and blocked filters',
        paragraphs: [
          'A diesel particulate filter needs regular sustained-temperature driving to burn off soot. Around Dartmouth that rarely happens: runs to the shops, school or the boat are short, the hills demand low gears, and summer traffic crawls. The filter loads up gradually until the warning light - and eventually limp mode - appears.',
          'Rather than gamble £1,000+ on a replacement, an off-vehicle deep clean restores your original filter to near-new flow, with before-and-after test figures to prove it.',
        ],
      },
      {
        heading: 'Getting your DPF to us from Dartmouth',
        paragraphs: [
          "The direct road route avoids the Higher Ferry entirely: take the B3207 to Halwell, then the A381 into Totnes - around 30 minutes. Drop the removed filter to us at Webbers Yard and it's often cleaned the same working day if it arrives before 10am.",
          'Collection from Dartmouth and Kingswear can also be arranged, which many local garages and busy hospitality businesses prefer - we collect, clean, flow-test and return with full documentation.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I have to use the ferry to reach your workshop?',
        a: 'No - the direct road route runs via the B3207 to Halwell and then the A381 into Totnes, around 30 minutes with no ferry crossing or queue.',
      },
      {
        q: 'Can you collect from a garage in Dartmouth?',
        a: 'Yes - collection from Dartmouth and Kingswear is available by arrangement, and trade garages can batch several filters into one collection. Call 01803 269895 to book a slot.',
      },
      {
        q: 'My car only does short local trips - will the DPF just block again?',
        a: "A cleaned filter behaves like a new one, so with the same short-trip driving it will load again over time - an occasional sustained 20-minute run helps a lot. If a filter keeps blocking quickly, there's usually an underlying fault, and our paid DPF diagnostics can find the cause before you spend money cleaning twice.",
      },
    ],
    nearbyAreas: ['Kingswear', 'Stoke Fleming', 'Strete', 'Dittisham', 'Torcross', 'Halwell'],
    relatedSlugs: ['dpf-cleaning-kingsbridge', 'dpf-cleaning-totnes', 'dpf-cleaning-brixham'],
  },

  {
    slug: 'dpf-cleaning-kingsbridge',
    name: 'Kingsbridge',
    region: 'South Hams',
    metaTitle: 'DPF Cleaning Kingsbridge | South Hams DPF Specialists | AutoCleanse',
    metaDescription:
      'Off-vehicle DPF cleaning for Kingsbridge and the South Hams. Rural short-trip diesels are prime DPF-blocking territory - we clean and flow-test filters 14 miles up the A381 in Totnes.',
    h1Prefix: 'DPF Cleaning in',
    intro:
      "Kingsbridge diesels live a rural life - lanes, school routes and journeys that rarely break 40mph. It's classic DPF-blocking territory, because filters need sustained speed and temperature to self-clean. AutoCleanse is the South Hams' local DPF specialist: our workshop is 14 miles up the A381 in Totnes, cleaning filters off the vehicle with documented before-and-after flow testing.",
    sections: [
      {
        heading: "Rural driving and DPFs don't mix",
        paragraphs: [
          'Farm pickups, trades vans and family diesels around Kingsbridge spend their lives on short, low-speed journeys down high-hedged lanes - exactly the pattern that stops passive regeneration ever completing. Soot accumulates, active regens abort mid-cycle on short trips, and the filter gradually chokes.',
          'An off-vehicle deep clean clears both the soot and the incombustible ash that driving can never remove - typically restoring flow to near-new at a fraction of the cost of a replacement filter.',
        ],
      },
      {
        heading: "The South Hams' nearest DPF workshop",
        paragraphs: [
          "We're around 25 minutes up the A381 - drop the removed filter to Webbers Yard, Totnes, and filters with us before 10am are often ready the same working day. Collection from Kingsbridge, Salcombe and the surrounding villages can be arranged for garages and businesses.",
          "Working pickups - Ranger, Hilux, L200, Navara - and rural 4x4s are a big part of our workload, so we're well used to filters that have lived an agricultural life.",
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you clean DPFs from HGVs or plant machinery?',
        a: "We clean filters from cars, vans, 4x4s, HGVs and plant - if the filter can be removed and brought to us, we can usually clean it. Call with the filter type and dimensions and we'll confirm before you commit.",
      },
      {
        q: 'Should I clean my DPF or just replace it?',
        a: 'Most blocked filters are clogged, not broken - cleaning restores the original OEM part to near-new flow for a fraction of the £500-£2,000+ a replacement typically costs. If we test a filter and find it genuinely damaged, we tell you before any work is done.',
      },
      {
        q: 'Do you cover Salcombe and the villages around Kingsbridge?',
        a: 'Yes - collection can be arranged across the southern South Hams including Salcombe, Loddiswell, Modbury and Aveton Gifford, or you can drop the filter to Totnes yourself.',
      },
    ],
    nearbyAreas: ['Salcombe', 'Loddiswell', 'Modbury', 'Aveton Gifford', 'Malborough', 'Frogmore'],
    relatedSlugs: ['dpf-cleaning-south-hams', 'dpf-cleaning-dartmouth', 'dpf-cleaning-totnes'],
  },

  {
    slug: 'dpf-cleaning-ivybridge',
    name: 'Ivybridge',
    region: 'South Hams / A38 corridor',
    metaTitle: 'DPF Cleaning Ivybridge | A38 Drop-Off & Collection | AutoCleanse',
    metaDescription:
      'Off-vehicle DPF cleaning for Ivybridge - 20 minutes up the A38 from our Totnes workshop. Drop-off before 10am is often cleaned the same working day. Collection available.',
    h1Prefix: 'DPF Cleaning in',
    intro:
      'Ivybridge sits right on the A38, which makes us unusually easy to reach - our Totnes workshop is about 15 miles away, junction to junction. Plenty of Ivybridge diesels still arrive with blocked DPFs though: the daily pattern of short hops around town and the school run never gets the filter hot enough for long enough, whatever the dual carriageway outside promises.',
    sections: [
      {
        heading: 'Commuter diesels and half-finished regens',
        paragraphs: [
          'Many Ivybridge drivers commute a short hop to Plymouth or work locally - journeys that end just as the DPF reaches regeneration temperature. Active regens that keep getting interrupted leave unburnt soot behind, and over months the filter loads to the point of warning lights, poor MPG and limp mode.',
          'Off-vehicle cleaning strips the filter back properly - soot and ash - with flow-test figures before and after so you can see exactly what was recovered.',
        ],
      },
      {
        heading: 'Easy drop-off, or collection by arrangement',
        paragraphs: [
          "From Ivybridge it's a 20-25 minute run east on the A38 to the A385 Totnes junction. Drop the removed filter with us before 10am and it's often cleaned the same working day.",
          'Collection from Ivybridge, Lee Mill and South Brent can be arranged, and Plymouth-side garages can combine filters with our Plymouth collections.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I drop my DPF off on the way to work?',
        a: "Yes - we're open from 9am on weekdays at Webbers Yard, Totnes, an easy detour off the A38/A385. Filters dropped off in the morning are often cleaned the same working day, so many commuters drop off on the way to work and collect on the way home.",
      },
      {
        q: 'Do you work with garages in Ivybridge?',
        a: 'Yes - trade work is a large part of what we do. We provide documented before-and-after flow testing with every clean, which garages use for their customer records, and multiple filters can go on one collection.',
      },
      {
        q: 'Will a clean fix my limp mode?',
        a: "If the blockage is the cause, yes - restoring flow clears the fault once the codes are reset. If a sensor or another underlying fault triggered it, cleaning alone won't cure it, which is why we offer paid DPF diagnostics to confirm the cause first.",
      },
    ],
    nearbyAreas: ['Lee Mill', 'South Brent', 'Ermington', 'Ugborough', 'Modbury', 'Wrangaton'],
    relatedSlugs: ['dpf-cleaning-plymouth', 'dpf-cleaning-south-hams', 'dpf-cleaning-totnes'],
  },

  {
    slug: 'dpf-cleaning-teignmouth',
    name: 'Teignmouth',
    region: 'Teign Estuary',
    metaTitle: 'DPF Cleaning Teignmouth | Collection & Return | AutoCleanse',
    metaDescription:
      'Off-vehicle DPF cleaning for Teignmouth, Shaldon and the Teign Estuary. Collection often combines with our Newton Abbot runs, or drop off at our Totnes workshop.',
    h1Prefix: 'DPF Cleaning in',
    intro:
      'Between the sea and the Teign estuary, Teignmouth driving is a mix of tight town streets, the hill over to Shaldon and commuter runs to Newton Abbot and Exeter. For diesels that stay local, that is prime DPF-clogging mileage. AutoCleanse deep-cleans DPFs off the vehicle at our Totnes workshop - and collection from Teignmouth is straightforward because it slots into our regular Newton Abbot direction runs.',
    sections: [
      {
        heading: 'Estuary town driving and your DPF',
        paragraphs: [
          "Filters regenerate on sustained runs - the A380 to Exeter will do it; a lap of the town centre won't. Vehicles that mostly potter around town, do the school run or sit in seasonal seafront traffic gradually load with soot until the warning light appears. Taxi and delivery work around the estuary makes it worse: high idle time, low road speed.",
          'Off-vehicle cleaning restores the filter properly, including the ash that no regeneration - forced or otherwise - can remove.',
        ],
      },
      {
        heading: 'Collection via Newton Abbot, or drop off in Totnes',
        paragraphs: [
          'Teignmouth collections can usually be combined with our regular Newton Abbot runs - we collect the removed filter, clean and flow-test it, and return it with documentation.',
          'Prefer to bring it yourself? The A381 through Newton Abbot to Totnes takes around 35 minutes, and filters with us before 10am are often ready the same working day.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you cover Shaldon and Bishopsteignton?',
        a: 'Yes - collection from Shaldon, Bishopsteignton and Kingsteignton can be arranged alongside our Teignmouth and Newton Abbot collections.',
      },
      {
        q: 'Can my garage in Teignmouth send you filters regularly?',
        a: 'Yes - we support several South Devon garages on a trade basis. Batch collections combine well with our Newton Abbot runs, and every filter comes back with before-and-after flow figures for your records.',
      },
      {
        q: 'How do I know the clean actually worked?',
        a: 'Every filter is flow-tested before and after cleaning, and you get both figures. It is an objective back-pressure measurement, not a visual once-over - so you can see exactly how much capacity was recovered.',
      },
    ],
    nearbyAreas: ['Shaldon', 'Bishopsteignton', 'Kingsteignton', 'Dawlish', 'Newton Abbot', 'Holcombe'],
    relatedSlugs: ['dpf-cleaning-newton-abbot', 'dpf-cleaning-dawlish', 'dpf-cleaning-torquay'],
  },

  {
    slug: 'dpf-cleaning-dawlish',
    name: 'Dawlish',
    region: 'East Devon coast',
    metaTitle: 'DPF Cleaning Dawlish | Collection & Return | AutoCleanse',
    metaDescription:
      'Off-vehicle DPF cleaning for Dawlish, Dawlish Warren and Starcross. Collection by arrangement or UK postal cleaning from £230. Workshop in Totnes, around 20 miles away.',
    h1Prefix: 'DPF Cleaning in',
    intro:
      'Dawlish diesels split two ways: commuters running the A379 or A380 to Exeter, and local vehicles that rarely leave town. The second group is where blocked DPFs come from - short trips and summer holiday traffic never generate the sustained heat a filter needs to self-clean. AutoCleanse cleans DPFs off the vehicle at our Totnes workshop, about 20 miles away, with collection from Dawlish available.',
    sections: [
      {
        heading: 'Holiday-town traffic is hard on filters',
        paragraphs: [
          'In season, Dawlish traffic crawls - and a diesel crawling behind beach traffic is a diesel whose DPF is loading, not regenerating. Add short school-run and shopping trips through the rest of the year and the filter gradually blocks: rising back-pressure, worse MPG, then the warning light.',
          'A proper off-vehicle clean strips soot and ash back to near-new flow rates - far more thorough than additives or a forced regen, and documented with before-and-after figures.',
        ],
      },
      {
        heading: 'Getting your filter to us from Dawlish',
        paragraphs: [
          'Collections from Dawlish, Dawlish Warren and Starcross can be arranged and often combine with our Exeter-direction runs.',
          "Or drop the removed filter to Webbers Yard, Totnes - around 40 minutes via the A380 and A381 - and if it's with us before 10am it's often cleaned the same working day.",
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you collect from Dawlish Warren and Starcross?',
        a: 'Yes - collections along the Exe estuary side including Dawlish Warren, Starcross and Kenton can be arranged, often alongside our Exeter runs. Call 01803 269895 to book.',
      },
      {
        q: 'Is posting the filter an option instead?',
        a: 'Yes - our UK postal DPF cleaning starts from £230. Send the removed filter to us tracked, we clean and flow-test it, and it is usually on its way back to you the next working day.',
      },
      {
        q: 'My DPF warning light comes and goes - do I need a clean yet?',
        a: 'An intermittent light usually means the filter is part-loaded and struggling to regenerate - the ideal time to act, before limp mode. Our paid DPF diagnostics can read the soot and ash levels and confirm whether a clean is needed before you commit.',
      },
    ],
    nearbyAreas: ['Dawlish Warren', 'Starcross', 'Holcombe', 'Kenton', 'Teignmouth', 'Exminster'],
    relatedSlugs: ['dpf-cleaning-teignmouth', 'dpf-cleaning-exeter', 'dpf-cleaning-exmouth'],
  },

  {
    slug: 'dpf-cleaning-exmouth',
    name: 'Exmouth',
    region: 'East Devon',
    metaTitle: 'DPF Cleaning Exmouth | East Devon Collection & Postal | AutoCleanse',
    metaDescription:
      'DPF cleaning for Exmouth and East Devon - arranged collection or fast UK postal service with next-working-day return. Off-vehicle deep clean and flow testing at our Totnes workshop.',
    h1Prefix: 'DPF Cleaning in',
    intro:
      'Exmouth is one of the biggest towns in East Devon - and, at around 30 miles, one of the furthest we serve by road. Distance matters less than you might think for DPF cleaning though: the filter comes off the vehicle anyway, so most Exmouth customers either use our arranged collection or simply courier the filter to us for a next-working-day return.',
    sections: [
      {
        heading: 'Estuary-town miles and blocked filters',
        paragraphs: [
          "Exmouth's driving mix - seafront stop-start, the A376 crawl to Exeter in rush hour, marina and trade work at low speed - keeps a lot of local diesels below regeneration temperature for weeks at a time. When soot builds beyond what active regens can clear, power drops, MPG worsens and the DPF light arrives.",
          'Off-vehicle cleaning at our workshop restores original flow, verified by before-and-after testing - at a fraction of the £1,000+ a replacement filter typically costs.',
        ],
      },
      {
        heading: 'Collection, courier, or combine with our Exeter runs',
        paragraphs: [
          'We arrange collections from Exmouth, Lympstone and Budleigh Salterton, often alongside our Exeter-direction runs.',
          'Alternatively, our UK postal service (from £230) is genuinely quick from East Devon: send the removed filter tracked and it is usually back with you the next working day after cleaning. Trade garages in Exmouth can batch multiple filters either way.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is Exmouth too far for collection?',
        a: 'No - collection from Exmouth is available by arrangement and often combines with our Exeter runs. For a single filter, though, the postal service is frequently the fastest option from East Devon.',
      },
      {
        q: 'How does the postal option work from Exmouth?',
        a: 'Have the filter removed, box it securely and send it tracked to our Totnes workshop. We deep clean and flow-test it, then return it tracked - usually the next working day. Postal cleaning starts from £230.',
      },
      {
        q: 'Do you cover Budleigh Salterton and Lympstone?',
        a: 'Yes - arranged collections cover the Exmouth area including Lympstone, Exton and Budleigh Salterton, and the postal service covers everywhere else.',
      },
    ],
    nearbyAreas: ['Lympstone', 'Budleigh Salterton', 'Topsham', 'Woodbury', 'Exton', 'Sandy Bay'],
    relatedSlugs: ['dpf-cleaning-exeter', 'dpf-cleaning-dawlish', 'dpf-cleaning-teignmouth'],
  },

  {
    slug: 'dpf-cleaning-south-hams',
    name: 'South Hams',
    region: 'South Devon',
    metaTitle: 'DPF Cleaning South Hams | Local Workshop in Totnes | AutoCleanse',
    metaDescription:
      'The South Hams DPF specialists - our cleaning workshop is in Totnes, at the heart of the district. Off-vehicle deep cleaning and flow testing for Kingsbridge, Dartmouth, Ivybridge, Salcombe and the villages.',
    h1Prefix: 'DPF Cleaning Across the',
    intro:
      'The South Hams is home ground - our DPF cleaning workshop is at Webbers Yard, Totnes, right in the middle of the district. From Ivybridge to Dartmouth and Salcombe to South Brent, we are the local option for off-vehicle DPF cleaning: no courier required, no long round trips, and collection available across the towns and villages.',
    sections: [
      {
        heading: 'Why South Hams diesels block their DPFs',
        paragraphs: [
          "The district's driving is short-run and low-speed by nature: high-hedged lanes, village limits, farm tracks and small-town hops. Diesel particulate filters need sustained temperature to regenerate, so vehicles that live on local mileage accumulate soot they cannot burn off. It is why so much of our work comes from our own doorstep.",
          'We clean filters off the vehicle with professional equipment, removing both soot and ash, and flow-test every filter before and after so you can see the result in numbers.',
        ],
      },
      {
        heading: 'One workshop, the whole district',
        paragraphs: [
          'Totnes, Dartington and Berry Pomeroy can simply drop in. Kingsbridge, Dartmouth, Ivybridge, Modbury, Salcombe and the coastal villages can arrange collection - or make the short drive, since nowhere in the South Hams is much more than half an hour from the workshop.',
          'Filters with us before 10am are often cleaned the same working day, and we have dedicated local pages for Kingsbridge, Dartmouth and Ivybridge with routes and collection detail for each.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Where exactly is the workshop?',
        a: 'The Old Barn Industrial Estate, Webbers Yard, Totnes TQ9 - easy to find with parking on site. Call 01803 269895 before setting out so we can be ready for your filter.',
      },
      {
        q: 'Do you collect from the villages?',
        a: 'Yes - collection can be arranged across the district, from the Avon and Erme valleys down to the coast. Tell us your village when you call and we will sort a slot.',
      },
      {
        q: 'Can you clean filters from farm and estate vehicles?',
        a: 'We clean DPFs from road vehicles, pickups, 4x4s, HGVs and plant machinery - if the filter can be removed and brought to us, we can usually help. We do not work on tractors themselves, but a removable filter is worth a call.',
      },
    ],
    nearbyAreas: ['Totnes', 'Kingsbridge', 'Dartmouth', 'Salcombe', 'Modbury', 'Ivybridge', 'South Brent', 'Dartington'],
    relatedSlugs: ['dpf-cleaning-totnes', 'dpf-cleaning-kingsbridge', 'dpf-cleaning-ivybridge'],
  },
];

export function getDpfLocationBySlug(slug: string): DpfLocation | undefined {
  return DPF_LOCATIONS.find((l) => l.slug === slug);
}
