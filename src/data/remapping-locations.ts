export interface RemapFaq {
  q: string;
  a: string;
}

export interface RemapLocation {
  slug: string;
  name: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  distanceNote: string;
  mobileAvailable: boolean;
  nearbyAreas: string[];
  faqs: RemapFaq[];
  relatedSlugs: string[];
}

export const REMAP_LOCATIONS: RemapLocation[] = [
  {
    slug: 'ecu-remapping-plymouth',
    name: 'Plymouth',
    region: 'South West Devon',
    metaTitle: 'ECU Remapping Plymouth | Stage 1 & Mobile Remapping | AutoCleanse',
    metaDescription: 'Professional ECU remapping in Plymouth — Stage 1, Stage 2, economy and mobile remapping. Cars, vans, diesels and 4x4s. Book online or call AutoCleanse.',
    h1: 'ECU Remapping in Plymouth',
    intro: 'Looking for ECU remapping in Plymouth? AutoCleanse provides professional ECU tuning across Plymouth and the surrounding area — from Stage 1 performance remaps to economy tunes for diesel vans and fleet vehicles. Whether you want more power, better fuel economy or a custom map to match your modifications, our experienced technicians handle it all. We offer both workshop appointments at our Totnes base and mobile remapping where we come directly to you in Plymouth — so there\'s no need to travel if you\'d prefer we come to you.',
    distanceNote: 'approximately 25 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Plympton', 'Plymstock', 'Saltash', 'Ivybridge', 'Tavistock', 'Roborough', 'Derriford', 'Crownhill'],
    faqs: [
      {
        q: 'Do you offer mobile ECU remapping in Plymouth?',
        a: 'Yes — we offer mobile remapping across Plymouth and surrounding areas including Plympton, Plymstock and Saltash. We\'ll come to your home or workplace, so you don\'t need to drive to us. Mobile bookings are available subject to slot availability.'
      },
      {
        q: 'How far is AutoCleanse from Plymouth?',
        a: 'Our workshop is based in Totnes, South Devon — approximately 25 miles from Plymouth city centre. Most customers from Plymouth either book a mobile visit or make the short drive to our workshop for the appointment.'
      },
      {
        q: 'How long does a Stage 1 remap take in Plymouth?',
        a: 'A Stage 1 ECU remap typically takes between 1–2 hours depending on the vehicle. We carry out a full diagnostic check before and after the remap to ensure everything is running correctly.'
      },
      {
        q: 'Can you remap diesel vans in Plymouth?',
        a: 'Absolutely. We regularly remap diesel vans including Transit, Sprinter, Crafter, Vivaro and Trafic variants. A diesel van remap can improve both performance and fuel economy — particularly useful for tradespeople and delivery drivers covering high mileage.'
      },
      {
        q: 'Is ECU remapping safe for my car?',
        a: 'When carried out professionally, ECU remapping is safe and reliable. We only work within the safe operating limits of your engine, and all our remaps are backed by a diagnostic check. We don\'t use generic off-the-shelf files — every map is applied carefully to your specific vehicle.'
      },
      {
        q: 'Do you cover Saltash and the Cornwall border areas?',
        a: 'Yes — our mobile remapping service covers Saltash and areas just across the Tamar. If you\'re unsure whether we cover your exact location, give us a call and we\'ll confirm.'
      },
    ],
    relatedSlugs: ['ecu-remapping-ivybridge', 'ecu-remapping-tavistock', 'ecu-remapping-torbay'],
  },

  {
    slug: 'ecu-remapping-exeter',
    name: 'Exeter',
    region: 'East Devon',
    metaTitle: 'ECU Remapping Exeter | Stage 1 Tuning & Mobile Remapping | AutoCleanse',
    metaDescription: 'ECU remapping in Exeter — Stage 1, Stage 2, economy remaps and mobile tuning. Cars, vans and diesels covered. AutoCleanse, based in Totnes, Devon.',
    h1: 'ECU Remapping in Exeter',
    intro: 'AutoCleanse provides professional ECU remapping to customers across Exeter and East Devon. From Stage 1 power upgrades to diesel economy remaps for company vans, our technicians deliver results you can feel from the first drive. Exeter sits at the heart of Devon\'s road network, and many of our customers travel the A38 or A380 to our Totnes workshop — or choose our mobile remapping service for added convenience. We cover the full Exeter area including Heavitree, Alphington, Topsham and the surrounding villages.',
    distanceNote: 'approximately 27 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Exmouth', 'Topsham', 'Crediton', 'Dawlish', 'Newton Abbot', 'Heavitree', 'Alphington', 'Pinhoe'],
    faqs: [
      {
        q: 'Do you offer mobile remapping in Exeter?',
        a: 'Yes — we offer mobile ECU remapping across Exeter and surrounding areas including Exmouth, Topsham and Crediton. We come to your home or place of work, meaning no time off work or long journeys required.'
      },
      {
        q: 'What\'s the best route from Exeter to your Totnes workshop?',
        a: 'Most Exeter customers take the A38 towards Plymouth and exit at the A383/Buckfastleigh junction. The drive is typically around 30–35 minutes. Alternatively, the A380 via Newton Abbot is equally straightforward.'
      },
      {
        q: 'Can you remap petrol cars as well as diesels?',
        a: 'Yes — we remap both petrol and diesel vehicles. Stage 1 remaps on modern turbocharged petrol engines can yield very noticeable gains in power and throttle response. We also handle naturally aspirated vehicles where gains are more modest but still worthwhile.'
      },
      {
        q: 'Do you cover Exmouth and Topsham?',
        a: 'Yes — Exmouth, Topsham, Cranbrook and the wider East Devon area are all within our mobile service coverage. We regularly visit customers across these areas.'
      },
      {
        q: 'Will a remap affect my car\'s warranty?',
        a: 'This depends on your manufacturer and dealer. Technically, a remap modifies the ECU software and some dealers may use it to void a warranty claim. Many customers with older vehicles or those outside manufacturer warranty choose to remap freely. We\'re happy to discuss your specific situation before you book.'
      },
      {
        q: 'How long does a remap take?',
        a: 'Most remaps are completed within 1–2 hours. We always carry out a pre-remap diagnostic check and a post-remap verification drive to confirm everything is performing as expected.'
      },
    ],
    relatedSlugs: ['ecu-remapping-newton-abbot', 'ecu-remapping-torbay', 'ecu-remapping-plymouth'],
  },

  {
    slug: 'ecu-remapping-torquay',
    name: 'Torquay',
    region: 'Torbay',
    metaTitle: 'ECU Remapping Torquay | Stage 1 & Mobile Tuning | AutoCleanse',
    metaDescription: 'ECU remapping in Torquay and Torbay — Stage 1, economy remaps and mobile tuning for cars, vans and 4x4s. AutoCleanse, South Devon.',
    h1: 'ECU Remapping in Torquay',
    intro: 'AutoCleanse offers professional ECU remapping to customers across Torquay, Torbay and the surrounding South Devon coastline. Whether you\'re after a Stage 1 performance remap to sharpen up your daily drive, an economy tune to cut fuel costs on a diesel van, or a full Stage 2 map to match your hardware upgrades, we\'ve got you covered. Our Totnes workshop is just 15 miles from Torquay, making it an easy trip — or opt for our mobile remapping service and we\'ll come straight to you.',
    distanceNote: 'approximately 15 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Paignton', 'Brixham', 'Newton Abbot', 'Teignmouth', 'Cockington', 'St Marychurch', 'Babbacombe', 'Chelston'],
    faqs: [
      {
        q: 'Do you offer mobile remapping in Torquay?',
        a: 'Yes — we provide mobile ECU remapping across Torquay and the wider Torbay area, including Paignton and Brixham. We\'ll come to your home or business, saving you the drive to our workshop.'
      },
      {
        q: 'How far is AutoCleanse from Torquay?',
        a: 'Our workshop in Totnes is approximately 15 miles from Torquay centre — around 25 minutes via the A385. Many Torquay customers find the journey straightforward and enjoy a quick coffee while the work is completed.'
      },
      {
        q: 'Can you remap 4x4s and SUVs?',
        a: 'Absolutely — we remap a wide range of 4x4s and SUVs including Land Rover Defender, Discovery, Range Rover, BMW X5, VW Touareg and many more. Both diesel and petrol variants are catered for.'
      },
      {
        q: 'Will a Stage 1 remap improve my fuel economy?',
        a: 'For diesel vehicles in particular, a Stage 1 economy-focused remap can significantly improve fuel efficiency — especially at motorway speeds and for vehicles used in stop-start traffic. We tailor the map to your driving style and goals.'
      },
      {
        q: 'Is remapping legal on UK roads?',
        a: 'Yes — ECU remapping is legal in the UK. The modification must be declared to your insurance company, as it may affect your premium. Some insurers are now very familiar with remapping and have specialist performance vehicle policies available.'
      },
      {
        q: 'Do you cover Brixham and Paignton too?',
        a: 'Yes — Brixham, Paignton, Goodrington and the wider Torbay area are all covered by both our workshop appointments and mobile remapping service.'
      },
    ],
    relatedSlugs: ['ecu-remapping-paignton', 'ecu-remapping-newton-abbot', 'ecu-remapping-torbay'],
  },

  {
    slug: 'ecu-remapping-paignton',
    name: 'Paignton',
    region: 'Torbay',
    metaTitle: 'ECU Remapping Paignton | Stage 1 Tuning & Mobile Remap | AutoCleanse',
    metaDescription: 'Professional ECU remapping in Paignton — Stage 1, economy and performance tuning for cars and vans. Mobile remapping available. AutoCleanse, Devon.',
    h1: 'ECU Remapping in Paignton',
    intro: 'AutoCleanse serves Paignton and the Torbay area with professional ECU remapping for cars, vans and commercial vehicles. Based in Totnes — just 12 miles away — we\'re well placed to handle remaps for Paignton customers quickly and efficiently. Whether you\'re looking to unlock more power from a turbocharged petrol, reduce diesel consumption on your van, or get a bespoke Stage 2 map to match performance upgrades, we\'ll get your vehicle running at its best. Mobile remapping is also available if you\'d prefer we come to you.',
    distanceNote: 'approximately 12 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Torquay', 'Brixham', 'Totnes', 'Newton Abbot', 'Goodrington', 'Churston Ferrers', 'Galmpton', 'Stoke Gabriel'],
    faqs: [
      {
        q: 'Do you do mobile remapping in Paignton?',
        a: 'Yes — we offer mobile ECU remapping in Paignton and across the surrounding Torbay area. We carry all the necessary equipment to carry out a full remap at your home or workplace.'
      },
      {
        q: 'What services do you offer in the Paignton area?',
        a: 'We offer Stage 1 remaps, Stage 2 remaps (for modified vehicles), economy remaps for diesels, van remapping, DPF software solutions and custom fleet maps. Both mobile appointments and workshop visits are available.'
      },
      {
        q: 'Can you remap my diesel van in Paignton?',
        a: 'Absolutely — diesel van remapping is one of our most popular services. We remap Transits, Sprinters, Crafters, Viveths and most other commercial vans, improving pulling power and fuel economy.'
      },
      {
        q: 'How long does a remap take?',
        a: 'A typical ECU remap takes 1–2 hours including our pre and post diagnostic checks. We aim to get you back on the road as quickly as possible.'
      },
      {
        q: 'Is AutoCleanse local to Paignton?',
        a: 'Our workshop is in Totnes — just 12 miles from Paignton, roughly a 20-minute drive via the A385. We also offer mobile remapping if you\'d prefer we come to you in Paignton.'
      },
    ],
    relatedSlugs: ['ecu-remapping-torquay', 'ecu-remapping-torbay', 'ecu-remapping-newton-abbot'],
  },

  {
    slug: 'ecu-remapping-newton-abbot',
    name: 'Newton Abbot',
    region: 'South Devon',
    metaTitle: 'ECU Remapping Newton Abbot | Stage 1 & Economy Remaps | AutoCleanse',
    metaDescription: 'ECU remapping in Newton Abbot — Stage 1, Stage 2, economy and mobile remapping for cars and vans. Just 8 miles from Totnes. AutoCleanse Devon.',
    h1: 'ECU Remapping in Newton Abbot',
    intro: 'Newton Abbot is one of our busiest service areas — just 8 miles from our Totnes workshop and sitting right at the crossroads of South Devon\'s road network. AutoCleanse provides ECU remapping for cars, vans, 4x4s and commercial vehicles across Newton Abbot and the surrounding towns. Stage 1 and Stage 2 remaps, economy diesel tunes and custom fleet mapping are all available. With easy access via the A381 and A380, getting to us is simple — or we can come to you with our mobile service.',
    distanceNote: 'approximately 8 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Torquay', 'Paignton', 'Totnes', 'Teignmouth', 'Ashburton', 'Bovey Tracey', 'Kingsteignton', 'Abbotskerswell'],
    faqs: [
      {
        q: 'How close is AutoCleanse to Newton Abbot?',
        a: 'Our Totnes workshop is just 8 miles from Newton Abbot — approximately 15 minutes via the A381. Newton Abbot is one of our closest major service areas, and we regularly serve customers from across the town and surrounding villages.'
      },
      {
        q: 'Do you offer mobile remapping in Newton Abbot?',
        a: 'Yes — we offer mobile ECU remapping across Newton Abbot and nearby areas including Kingsteignton, Bovey Tracey and Teignmouth. We come to your preferred location with all the equipment needed to complete the remap on-site.'
      },
      {
        q: 'Can you remap a turbocharged petrol car?',
        a: 'Absolutely — modern turbocharged petrols respond very well to remapping. A Stage 1 remap on a petrol turbo can unlock significant improvements in power, torque and throttle response without any hardware changes needed.'
      },
      {
        q: 'What van brands do you remap?',
        a: 'We remap virtually all modern van makes — Ford Transit, Mercedes Sprinter, VW Crafter, Vauxhall Vivaro, Renault Trafic, Peugeot Boxer, Citroen Relay, Fiat Ducato and more. Diesel vans see the best results from remapping.'
      },
      {
        q: 'Will remapping void my insurance?',
        a: 'You must declare a remap to your insurance provider as it is a modification. Some insurers will add a small premium, while others — particularly specialist performance or commercial vehicle insurers — treat it as standard. Always declare to stay fully covered.'
      },
      {
        q: 'Do you cover Bovey Tracey and Ashburton?',
        a: 'Yes — Bovey Tracey, Ashburton, Buckfastleigh and the surrounding Dartmoor edge villages are all within our service area. Contact us to confirm availability for mobile appointments.'
      },
    ],
    relatedSlugs: ['ecu-remapping-torquay', 'ecu-remapping-exeter', 'ecu-remapping-totnes'],
  },

  {
    slug: 'ecu-remapping-torbay',
    name: 'Torbay',
    region: 'Torbay',
    metaTitle: 'ECU Remapping Torbay | Torquay, Paignton & Brixham | AutoCleanse',
    metaDescription: 'ECU remapping across Torbay — covering Torquay, Paignton and Brixham. Stage 1, Stage 2, economy and mobile remapping. AutoCleanse, South Devon.',
    h1: 'ECU Remapping in Torbay',
    intro: 'AutoCleanse provides ECU remapping services across the entire Torbay area — covering Torquay, Paignton and Brixham — as well as the villages and coastal communities in between. Whether you\'re a Torquay tradesperson looking to cut fuel costs on your diesel van, a Paignton driver wanting more performance from a turbo petrol, or a Brixham fleet operator after consistent maps across multiple vehicles, we handle it all. Our Totnes workshop is a short drive inland, or we can come to you with our mobile remapping service.',
    distanceNote: 'approximately 13 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Torquay', 'Paignton', 'Brixham', 'Newton Abbot', 'Totnes', 'Teignmouth', 'Dartmouth', 'Kingswear'],
    faqs: [
      {
        q: 'Do you cover the whole Torbay area?',
        a: 'Yes — we cover Torquay, Paignton and Brixham as well as surrounding villages like Kingswear, Churston Ferrers, Galmpton and Stoke Gabriel. Both mobile remapping and workshop appointments are available.'
      },
      {
        q: 'What types of vehicles do you remap in Torbay?',
        a: 'We remap cars, vans, 4x4s, light commercial vehicles and HGVs. Petrol and diesel engines are both catered for, including turbocharged and naturally aspirated variants.'
      },
      {
        q: 'Is mobile remapping available in Torbay?',
        a: 'Yes — mobile remapping is available across Torbay. We\'ll bring all the necessary equipment to your driveway, workplace car park or any suitable location and complete the remap on-site.'
      },
      {
        q: 'What are the benefits of a Stage 1 remap?',
        a: 'A Stage 1 remap optimises your engine\'s ECU software without requiring any hardware modifications. Typical benefits include increased power output (often 15–30%), improved torque, better throttle response and — particularly for diesel vehicles — improved fuel economy.'
      },
      {
        q: 'How do I book a remap for my Torbay vehicle?',
        a: 'You can book online via our booking page, or call us on 0800 043 0609. Choose your service, tell us about your vehicle, and pick a slot. We offer both workshop and mobile appointment options.'
      },
    ],
    relatedSlugs: ['ecu-remapping-torquay', 'ecu-remapping-paignton', 'ecu-remapping-newton-abbot'],
  },

  {
    slug: 'ecu-remapping-totnes',
    name: 'Totnes',
    region: 'South Devon',
    metaTitle: 'ECU Remapping Totnes | Local Workshop | AutoCleanse',
    metaDescription: 'ECU remapping in Totnes — AutoCleanse is based here. Stage 1, Stage 2, economy remaps and DPF solutions. Local workshop, professional service.',
    h1: 'ECU Remapping in Totnes',
    intro: 'AutoCleanse is based right here in Totnes — so if you\'re looking for ECU remapping locally, you\'ve found us. Our workshop on the edge of Totnes handles everything from Stage 1 performance remaps to economy diesel tunes, DPF software solutions and full Stage 2 custom maps. As a Totnes-based business, we serve the surrounding South Hams area daily — from Dartington and Buckfastleigh to Newton Abbot and Kingsbridge. Local, professional and with genuine expertise in modern ECU tuning.',
    distanceNote: 'our workshop is based in Totnes',
    mobileAvailable: true,
    nearbyAreas: ['Dartington', 'Buckfastleigh', 'Newton Abbot', 'Ashburton', 'Kingsbridge', 'Dartmouth', 'Ivybridge', 'South Brent'],
    faqs: [
      {
        q: 'Where is your Totnes workshop?',
        a: 'We\'re based at The Old Barn Industrial Estate, Webbers Yard, Totnes TQ9. We\'re easy to find with good parking on-site — just call ahead or book online to confirm your slot.'
      },
      {
        q: 'Do you offer mobile remapping around Totnes?',
        a: 'Yes — even as a Totnes-based business, we offer mobile remapping for customers who can\'t easily get to our workshop. We regularly cover Dartington, Buckfastleigh, Ashburton and surrounding villages.'
      },
      {
        q: 'What services are available at your Totnes workshop?',
        a: 'Our Totnes workshop offers Stage 1 remaps, Stage 2 remaps, economy diesel tunes, custom fleet mapping, DPF cleans, DPF software solutions, diagnostic checks and more. It\'s a full ECU tuning and diesel health service under one roof.'
      },
      {
        q: 'Can I drop in without booking?',
        a: 'We work by appointment to ensure every customer gets our full attention. Booking takes just a few minutes online, or call us on 0800 043 0609 and we\'ll get you booked in quickly.'
      },
      {
        q: 'Do you remap camper vans and motorhomes near Totnes?',
        a: 'Yes — we\'ve remapped a wide variety of motorhome and camper van base vehicles including Fiat Ducato, VW Crafter, Mercedes Sprinter and Peugeot Boxer conversions. A diesel remap can meaningfully improve pulling power when towing or loaded.'
      },
    ],
    relatedSlugs: ['ecu-remapping-newton-abbot', 'ecu-remapping-kingsbridge', 'ecu-remapping-ivybridge'],
  },

  {
    slug: 'ecu-remapping-ivybridge',
    name: 'Ivybridge',
    region: 'South Hams',
    metaTitle: 'ECU Remapping Ivybridge | Stage 1 & Mobile Remap | AutoCleanse',
    metaDescription: 'ECU remapping in Ivybridge and South Hams — Stage 1, economy remaps and mobile tuning. AutoCleanse covers Ivybridge, Modbury, Ugborough and surrounding areas.',
    h1: 'ECU Remapping in Ivybridge',
    intro: 'Ivybridge sits at the southern edge of Dartmoor with easy access to both Plymouth and South Hams — making it a natural hub for customers across this part of Devon. AutoCleanse provides ECU remapping for Ivybridge customers both at our Totnes workshop and via our mobile service. Stage 1 remaps, diesel economy tunes and commercial van mapping are all available, with a pre and post diagnostic check included as standard. Whether you\'re commuting to Plymouth, working across South Hams or covering Dartmoor, we\'ll get your vehicle performing at its best.',
    distanceNote: 'approximately 15 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Plymouth', 'Modbury', 'Ugborough', 'Ermington', 'South Brent', 'Bittaford', 'Harford', 'Wrangaton'],
    faqs: [
      {
        q: 'Do you offer mobile remapping in Ivybridge?',
        a: 'Yes — we cover Ivybridge and the surrounding South Hams villages with our mobile remapping service. We\'ll come to your home, farm or business premises with all the kit to complete the remap on-site.'
      },
      {
        q: 'How far is Ivybridge from your workshop?',
        a: 'Ivybridge is approximately 15 miles from our Totnes workshop — around 20–25 minutes via the A38. The A38 dual carriageway makes the route very straightforward.'
      },
      {
        q: 'Can you remap agricultural and farm vehicles near Ivybridge?',
        a: 'We specialise in road vehicles rather than tractors and agricultural machinery. For cars, vans, 4x4s and light commercials used in farming or rural trades, we\'re well equipped to help.'
      },
      {
        q: 'What\'s the difference between Stage 1 and Stage 2?',
        a: 'Stage 1 is a software-only remap for a standard, unmodified vehicle. Stage 2 is for vehicles with hardware upgrades — such as an uprated intercooler, intake or exhaust — and extracts more performance to match those modifications. We\'ll advise which is right for your car.'
      },
      {
        q: 'Do you cover South Brent and Modbury?',
        a: 'Yes — South Brent, Modbury, Ugborough, Ermington and the wider rural South Hams area are all within our mobile remapping coverage. Call or book online to check availability.'
      },
    ],
    relatedSlugs: ['ecu-remapping-plymouth', 'ecu-remapping-totnes', 'ecu-remapping-kingsbridge'],
  },

  {
    slug: 'ecu-remapping-tavistock',
    name: 'Tavistock',
    region: 'West Devon',
    metaTitle: 'ECU Remapping Tavistock | Stage 1 & Mobile Remap | AutoCleanse',
    metaDescription: 'ECU remapping in Tavistock and West Devon — Stage 1, economy and performance remaps for cars and vans. Mobile remapping available. AutoCleanse Devon.',
    h1: 'ECU Remapping in Tavistock',
    intro: 'AutoCleanse provides ECU remapping to customers across Tavistock and West Devon, covering everything from Stage 1 performance remaps on turbocharged cars to economy diesel tunes for vans and commercial vehicles. Tavistock is a popular base for businesses and tradespeople working across Dartmoor and into Plymouth — areas where strong engine performance and good fuel economy really count. Our Totnes workshop is roughly 25 miles away, or we can bring our mobile remapping service directly to you in Tavistock.',
    distanceNote: 'approximately 25 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Plymouth', 'Okehampton', 'Yelverton', 'Bere Alston', 'Gunnislake', 'Launceston', 'Horrabridge', 'Princetown'],
    faqs: [
      {
        q: 'Do you offer mobile remapping in Tavistock?',
        a: 'Yes — mobile remapping is available in Tavistock and across the West Devon area including Yelverton, Bere Alston and Horrabridge. We\'ll come to you with everything needed to complete the remap.'
      },
      {
        q: 'How do I get to your workshop from Tavistock?',
        a: 'From Tavistock, the quickest route is via Plymouth and then the A38 east towards Totnes — approximately 45 minutes. Alternatively, you can take the B3357 across Dartmoor, which is a scenic but slightly longer route.'
      },
      {
        q: 'Can you remap Land Rovers and off-road vehicles?',
        a: 'Yes — Land Rover Defender, Discovery and Range Rover remapping is something we do regularly. Both TDI and SDV engines respond well to remapping, and West Devon\'s terrain is exactly the kind of environment where the extra torque really shows.'
      },
      {
        q: 'Does a remap improve towing ability?',
        a: 'Yes — one of the most common reasons customers in rural areas remap their vehicles is to improve towing performance. A diesel remap increases torque significantly, making towing trailers, horse boxes and livestock transporters considerably easier.'
      },
      {
        q: 'Do you cover Okehampton and the Dartmoor area?',
        a: 'Yes — Okehampton, Princetown, Yelverton and the wider Dartmoor area are within our mobile service coverage. Contact us to confirm slot availability for your location.'
      },
    ],
    relatedSlugs: ['ecu-remapping-plymouth', 'ecu-remapping-ivybridge', 'ecu-remapping-exeter'],
  },

  {
    slug: 'ecu-remapping-kingsbridge',
    name: 'Kingsbridge',
    region: 'South Hams',
    metaTitle: 'ECU Remapping Kingsbridge | South Hams Mobile Remap | AutoCleanse',
    metaDescription: 'ECU remapping in Kingsbridge and South Hams — Stage 1, economy remaps and mobile tuning. Covering Salcombe, Dartmouth, Modbury and surrounding areas.',
    h1: 'ECU Remapping in Kingsbridge',
    intro: 'Kingsbridge sits at the heart of the South Hams — one of Devon\'s most scenic and rural areas, where reliable, efficient vehicles really matter. AutoCleanse provides ECU remapping across Kingsbridge and the surrounding South Hams coastline, with both workshop appointments and mobile remapping available. From Stage 1 performance tunes to diesel economy remaps for working vehicles, we serve farmers, tradespeople and everyday drivers across this part of Devon. Our Totnes workshop is just 14 miles away via the A381.',
    distanceNote: 'approximately 14 miles from our Totnes workshop',
    mobileAvailable: true,
    nearbyAreas: ['Salcombe', 'Dartmouth', 'Modbury', 'Ivybridge', 'Totnes', 'Bigbury-on-Sea', 'Loddiswell', 'Malborough'],
    faqs: [
      {
        q: 'Do you offer mobile remapping in Kingsbridge?',
        a: 'Yes — mobile remapping is available across Kingsbridge and the South Hams area including Salcombe, Modbury, Loddiswell and surrounding villages. We come to your home, farm or business.'
      },
      {
        q: 'How far is AutoCleanse from Kingsbridge?',
        a: 'Our Totnes workshop is approximately 14 miles from Kingsbridge via the A381 — around 25 minutes in normal traffic. It\'s a simple and scenic drive through South Hams.'
      },
      {
        q: 'Can you remap diesel pickups and 4x4s used in farming?',
        a: 'Absolutely — diesel pickups such as Ford Ranger, Toyota Hilux, Mitsubishi L200 and Isuzu D-Max all respond well to remapping. Increased torque is particularly useful for working vehicles in agricultural and rural settings.'
      },
      {
        q: 'Does remapping improve fuel economy as well as performance?',
        a: 'Yes — we can tune specifically for economy if that\'s your priority. Diesel vehicles covering high rural mileage often see noticeable fuel savings after a properly calibrated economy remap.'
      },
      {
        q: 'Do you cover Salcombe and Dartmouth?',
        a: 'Yes — Salcombe, Dartmouth, Torcross and the South Devon coast are all within our mobile remapping coverage. Access to some areas can be tricky so let us know your location when booking and we\'ll confirm.'
      },
      {
        q: 'Do I need to declare a remap to DVLA?',
        a: 'No — ECU remapping does not need to be declared to the DVLA. However, you must declare it to your insurance provider as it constitutes a modification to your vehicle.'
      },
    ],
    relatedSlugs: ['ecu-remapping-totnes', 'ecu-remapping-ivybridge', 'ecu-remapping-paignton'],
  },
];

export function getLocationBySlug(slug: string): RemapLocation | undefined {
  return REMAP_LOCATIONS.find((l) => l.slug === slug);
}
