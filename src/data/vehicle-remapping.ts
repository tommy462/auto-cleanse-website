export interface EngineOption {
  name: string;
  stockPower: string;
  remapPower: string;
  stockTorque: string;
  remapTorque: string;
  mpgGain?: string;
}

export interface VehicleContentSection {
  heading: string;
  paragraphs: string[];
}

export interface VehicleRemapData {
  slug: string;
  make: string;
  model: string;
  fullName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  engineOptions: EngineOption[];
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  category: 'performance' | 'economy' | 'commercial' | 'mixed';
  fuelType: 'diesel' | 'petrol' | 'both';
  /** Optional long-form, vehicle-specific prose rendered below the engine table
   *  to add genuine depth on priority/rewritten pages. */
  contentSections?: VehicleContentSection[];
  /** Optional slug of a related /blog/<slug> case study, surfaced as a
   *  "recent work" link for social proof and reciprocal internal linking. */
  caseStudySlug?: string;
}

export const VEHICLE_REMAPS: VehicleRemapData[] = [

  // ── AUDI ──────────────────────────────────────────────────────────────────

  {
    slug: 'audi-a3-remap',
    make: 'Audi', model: 'A3', fullName: 'Audi A3',
    metaTitle: 'Audi A3 Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'Audi A3 ECU remapping in Devon - diesel and petrol Stage 1 remaps from our Totnes workshop or mobile. Up to +40bhp and 15% MPG gain.',
    h1: 'Audi A3 Remap',
    intro: 'The Audi A3 is one of the most remapped cars in the UK, and for good reason - Audi tune these engines conservatively from the factory, leaving substantial power and economy on the table. Whether you drive the 2.0 TDI diesel or the 1.4/2.0 TFSI petrol, a Stage 1 remap delivers meaningful gains with no hardware changes required. AutoCleanse remaps Audi A3s from our Totnes workshop or mobile across Devon.',
    engineOptions: [
      { name: '2.0 TDI 150', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 15%' },
      { name: '2.0 TDI 184', stockPower: '184bhp', remapPower: '225bhp', stockTorque: '380Nm', remapTorque: '440Nm', mpgGain: 'up to 12%' },
      { name: '1.4 TFSI 150', stockPower: '150bhp', remapPower: '185bhp', stockTorque: '250Nm', remapTorque: '300Nm' },
      { name: '2.0 TFSI 190', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '320Nm', remapTorque: '390Nm' },
    ],
    faqs: [
      { q: 'How much power does an Audi A3 remap add?', a: 'The 2.0 TDI 150 typically gains around 40bhp and 60Nm of torque at Stage 1. Petrol variants see similar gains. Diesel A3s also improve real-world MPG by up to 15% thanks to the improved torque curve reducing the need to change down.' },
      { q: 'Will remapping my A3 void the warranty?', a: 'If your A3 is within the manufacturer warranty period, remapping may affect Audi\'s obligation to cover drivetrain faults. We recommend checking your warranty terms first. Once out of warranty, this is not a concern.' },
      { q: 'Is an A3 remap safe and reliable?', a: 'Yes - Stage 1 remapping operates within the factory hardware limits. We adjust boost pressure, fuelling, and ignition timing within safe parameters, and we always carry out a pre-remap diagnostic to identify any existing faults before the remap is applied.' },
      { q: 'Can I get Stage 2 on my A3?', a: 'Stage 2 is possible on most A3 variants but requires supporting modifications - typically an uprated intercooler and a freer-flowing exhaust. Most A3 owners find Stage 1 delivers excellent real-world results without the added cost.' },
      { q: 'Do you offer mobile remapping for the A3 across Devon?', a: 'Yes - we cover the whole of Devon with our mobile remapping service. We come to your home or workplace with all the equipment needed to carry out the full remap on-site, no need to drive to us.' },
    ],
    relatedSlugs: ['audi-a4-remap', 'audi-s3-remap', 'vw-golf-gti-remap'],
    category: 'mixed', fuelType: 'both',
  },

  {
    slug: 'audi-a4-remap',
    make: 'Audi', model: 'A4', fullName: 'Audi A4',
    metaTitle: 'Audi A4 Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'Audi A4 ECU remapping - Stage 1 diesel and petrol remaps from Totnes or mobile across Devon. Gain up to +45bhp and improved real-world MPG.',
    h1: 'Audi A4 Remap',
    intro: 'The Audi A4 is a firm favourite with company car drivers, commuters, and enthusiasts alike - and it responds brilliantly to ECU remapping. The 2.0 TDI variants in particular are heavily restricted from the factory, making them ideal candidates for a Stage 1 remap that transforms both performance and economy. AutoCleanse has remapped numerous A4s across Devon from our workshop in Totnes and via mobile visit.',
    engineOptions: [
      { name: '2.0 TDI 150', stockPower: '150bhp', remapPower: '195bhp', stockTorque: '340Nm', remapTorque: '410Nm', mpgGain: 'up to 15%' },
      { name: '2.0 TDI 190', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TFSI 190', stockPower: '190bhp', remapPower: '230bhp', stockTorque: '320Nm', remapTorque: '390Nm' },
      { name: '3.0 TDI 272', stockPower: '272bhp', remapPower: '330bhp', stockTorque: '600Nm', remapTorque: '700Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'What are the gains from an Audi A4 2.0 TDI remap?', a: 'The 2.0 TDI 150 typically gains around 45bhp and 70Nm of torque, moving from 150 to 195bhp. MPG improvements of 10–15% are common for motorway drivers as the engine works less hard at cruising speeds.' },
      { q: 'Which A4 engine benefits most from remapping?', a: 'All TDI variants respond very well. The 2.0 TDI 150 offers the biggest proportional gains. The 3.0 TDI 272 also gains significantly and delivers particularly impressive torque figures after remapping.' },
      { q: 'Do I need to tell my insurer about an A4 remap?', a: 'Yes - you are legally obliged to declare any vehicle modification, including ECU remapping, to your insurance provider. Failure to do so may invalidate your policy. Many specialist insurers handle remapped vehicles at reasonable premiums.' },
      { q: 'Can my A4 be remapped on-site in Devon?', a: 'Yes - our mobile remapping service covers all of Devon. We connect via the OBD port and complete the full remap at your location. The process typically takes 1–2 hours including our pre-remap health check.' },
      { q: 'Does remapping affect A4 reliability long-term?', a: 'A quality Stage 1 remap, properly executed on a healthy engine, does not reduce reliability. We stay within the safe limits of the factory hardware. It\'s poorly done remaps - or remapping an engine with pre-existing issues - that cause problems, which is why our pre-remap diagnostic is essential.' },
    ],
    relatedSlugs: ['audi-a3-remap', 'audi-a6-remap', 'audi-s4-remap'],
    category: 'mixed', fuelType: 'both',
  },

  {
    slug: 'audi-a5-remap',
    make: 'Audi', model: 'A5', fullName: 'Audi A5',
    metaTitle: 'Audi A5 Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'Audi A5 ECU remapping in Devon - Stage 1 diesel and petrol remaps. Gain up to +45bhp and improved torque from our Totnes workshop or mobile.',
    h1: 'Audi A5 Remap',
    intro: 'The Audi A5 coupe and Sportback offer one of the best combinations of style and everyday performance in the segment, and a Stage 1 remap sharpens that further. Both the TDI diesel and TFSI petrol engines respond well, with diesel variants in particular gaining significant torque that transforms the A5\'s in-gear pull. AutoCleanse remaps A5s from our Totnes base and via mobile service throughout Devon.',
    engineOptions: [
      { name: '2.0 TDI 150', stockPower: '150bhp', remapPower: '192bhp', stockTorque: '340Nm', remapTorque: '405Nm', mpgGain: 'up to 14%' },
      { name: '2.0 TDI 190', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TFSI 190', stockPower: '190bhp', remapPower: '230bhp', stockTorque: '320Nm', remapTorque: '385Nm' },
      { name: '3.0 TDI 218', stockPower: '218bhp', remapPower: '270bhp', stockTorque: '500Nm', remapTorque: '600Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'How much does an Audi A5 remap cost?', a: 'A Stage 1 remap for the A5 starts from £220 at our Totnes workshop or £240 for a mobile visit. Pricing depends on the specific variant - contact us with your registration for an exact quote.' },
      { q: 'Will my A5 still be driveable after the remap?', a: 'Absolutely - a Stage 1 remap enhances everyday driveability. You\'ll notice stronger in-gear pull, less need to change down on hills, and a more responsive throttle. The character of the car improves rather than changes dramatically.' },
      { q: 'Is the A5 2.0 TDI a good candidate for remapping?', a: 'Yes, it\'s an excellent candidate. The 150 variant is tuned conservatively by Audi to sit beneath the 190 model in the range. A remap removes this artificial restriction and unlocks what the engine hardware is genuinely capable of.' },
      { q: 'Can I have my A5 remapped at home?', a: 'Yes - our mobile service brings the remapping equipment to you. We need a 240V power point nearby and approximately 1.5–2 hours. We cover all of Devon including Exeter, Plymouth, Torbay, and the surrounding areas.' },
      { q: 'Do A5 owners typically go Stage 1 or Stage 2?', a: 'The vast majority of A5 owners opt for Stage 1, which requires no hardware changes and delivers excellent real-world results. Stage 2 requires an uprated intercooler and exhaust and suits those looking for maximum power rather than everyday performance.' },
    ],
    relatedSlugs: ['audi-a4-remap', 'audi-a6-remap', 'audi-s4-remap'],
    category: 'mixed', fuelType: 'both',
  },

  {
    slug: 'audi-a6-remap',
    make: 'Audi', model: 'A6', fullName: 'Audi A6',
    metaTitle: 'Audi A6 Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'Audi A6 ECU remapping - gain up to +60bhp and 100Nm on the 3.0 TDI. Stage 1 remaps from our Totnes workshop or mobile across Devon.',
    h1: 'Audi A6 Remap',
    intro: 'The Audi A6 is a premium executive car that frequently covers high mileages, making economy remapping particularly attractive for its diesel variants. The 3.0 TDI is especially rewarding to remap - the gains in torque are substantial and translate directly into more relaxed, effortless motorway cruising. AutoCleanse provides A6 remapping from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0 TDI 204', stockPower: '204bhp', remapPower: '250bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '3.0 TDI 218', stockPower: '218bhp', remapPower: '272bhp', stockTorque: '500Nm', remapTorque: '610Nm', mpgGain: 'up to 10%' },
      { name: '3.0 TDI 272', stockPower: '272bhp', remapPower: '335bhp', stockTorque: '600Nm', remapTorque: '700Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'What gains does the Audi A6 3.0 TDI see from remapping?', a: 'The 3.0 TDI 272 typically gains around 60bhp and 100Nm of torque at Stage 1, moving from 272 to approximately 335bhp. More notable for most A6 owners is the dramatic improvement in mid-range torque, which makes overtaking and motorway driving effortless.' },
      { q: 'Is the A6 good for economy remapping?', a: 'Yes - the A6 is an ideal economy remap candidate, particularly for high-mileage drivers. The improved torque curve means the engine doesn\'t work as hard at motorway speeds. Many customers report 8–12% real-world MPG improvements.' },
      { q: 'Can the A6 quattro be remapped?', a: 'Yes - quattro drivetrain makes no difference to ECU remapping. We remap 2WD and quattro A6s equally. The quattro\'s traction advantage means the extra power is particularly well-deployed.' },
      { q: 'How long does an A6 remap take?', a: 'An A6 remap typically takes 1.5–2 hours including our pre-remap diagnostic check and a short road test to verify the result. We don\'t rush the process - a proper verification is essential.' },
      { q: 'Do you cover Exeter and Plymouth for A6 remapping?', a: 'Yes - both cities are within our mobile coverage area. We also cover Torbay, South Hams, and the wider Devon area. Contact us to check availability for your location.' },
    ],
    relatedSlugs: ['audi-a4-remap', 'audi-q5-remap', 'bmw-520d-remap'],
    category: 'economy', fuelType: 'diesel',
  },

  {
    slug: 'audi-q5-remap',
    make: 'Audi', model: 'Q5', fullName: 'Audi Q5',
    metaTitle: 'Audi Q5 Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: "Audi Q5 ECU remapping - Stage 1 diesel and petrol remaps. Transform your Q5's performance and economy. Workshop or mobile across Devon.",
    h1: 'Audi Q5 Remap',
    intro: 'The Audi Q5 is a popular family SUV that benefits enormously from ECU remapping - particularly the diesel variants, which are used heavily for towing and motorway driving where improved torque makes a real difference. A Stage 1 remap transforms the Q5\'s character without any hardware changes. AutoCleanse remaps Q5s throughout Devon from our Totnes workshop and via mobile.',
    engineOptions: [
      { name: '2.0 TDI 150', stockPower: '150bhp', remapPower: '192bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 14%' },
      { name: '2.0 TDI 190', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TFSI 252', stockPower: '252bhp', remapPower: '300bhp', stockTorque: '370Nm', remapTorque: '440Nm' },
      { name: '3.0 TDI 231', stockPower: '231bhp', remapPower: '285bhp', stockTorque: '500Nm', remapTorque: '620Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Does remapping a Q5 improve towing performance?', a: 'Yes - towing performance improves significantly, especially on diesel Q5s. The extra torque means less strain on the engine when pulling a trailer or caravan, and you won\'t need to drop so many gears on inclines. The Q5 becomes notably more composed under load.' },
      { q: 'Is the Q5 quattro suitable for remapping?', a: 'Absolutely - all Q5 drivetrain variants can be remapped equally. The quattro system handles the additional power well, making it an excellent platform for Stage 1.' },
      { q: 'Will the DSG gearbox handle the extra power?', a: 'Yes - Stage 1 power levels are within the safe operating limits of the Q5\'s DSG/S-tronic gearbox. We do not recommend going beyond Stage 1 on a standard gearbox without a gearbox remap alongside it.' },
      { q: 'How does an A5 remap compare to a Q5 remap?', a: 'They share many of the same engines so gains are very similar. The Q5 is heavier, so you\'ll feel the performance improvement slightly differently - more in the mid-range pull than at the top end.' },
      { q: 'What areas of Devon do you cover for Q5 remapping?', a: 'We cover all of Devon with our mobile service - Exeter, Plymouth, Torquay, Paignton, Totnes, Newton Abbot, Tiverton, and surrounding areas. Contact us to book a mobile slot.' },
    ],
    relatedSlugs: ['audi-a6-remap', 'land-rover-discovery-remap', 'range-rover-sport-remap'],
    category: 'mixed', fuelType: 'both',
  },

  {
    slug: 'audi-s3-remap',
    make: 'Audi', model: 'S3', fullName: 'Audi S3',
    metaTitle: 'Audi S3 Remap | Stage 1 Performance Tuning Devon | AutoCleanse',
    metaDescription: 'Audi S3 Stage 1 remap - unlock up to +60bhp from the 2.0 TFSI. Performance ECU tuning from our Totnes workshop or mobile across Devon.',
    h1: 'Audi S3 Remap',
    intro: 'The Audi S3 is one of the most exciting performance hatchbacks to remap - the 2.0 TFSI engine has proven hardware capable of handling significant power increases beyond the factory 310bhp. A Stage 1 remap takes the S3 to around 370bhp with no hardware changes, transforming it into a genuinely rapid car that rivals much more expensive machinery. AutoCleanse provides S3 remapping from our Totnes workshop and across Devon.',
    engineOptions: [
      { name: '2.0 TFSI 300 (8V)', stockPower: '300bhp', remapPower: '360bhp', stockTorque: '380Nm', remapTorque: '460Nm' },
      { name: '2.0 TFSI 310 (8Y)', stockPower: '310bhp', remapPower: '370bhp', stockTorque: '400Nm', remapTorque: '480Nm' },
    ],
    faqs: [
      { q: 'How much power can an S3 gain at Stage 1?', a: 'The 8Y S3 310 typically reaches around 370bhp and 480Nm at Stage 1, a gain of 60bhp and 80Nm with no hardware changes. The 8V 300 gains similarly proportionally. These figures transform the real-world performance of the car dramatically.' },
      { q: 'What\'s the difference between Stage 1 and Stage 2 on an S3?', a: 'Stage 1 requires no hardware changes. Stage 2 typically adds an uprated intercooler and high-flow sports catalyst, pushing power beyond 400bhp. Most S3 owners find Stage 1 delivers an excellent balance of performance and reliability without the significant added cost.' },
      { q: 'Is the EA888 engine reliable after remapping?', a: 'The EA888 TFSI engine is well known in the tuning world and has a strong track record when remapped correctly. We work within proven power limits and always perform a pre-remap health check to ensure the engine is in good condition.' },
      { q: 'Will S3 Stage 1 affect my insurance significantly?', a: 'Performance remapping does affect insurance premiums. We recommend using a specialist broker (e.g. Adrian Flux, Reis) who can often offer competitive premiums for remapped performance cars. Always declare the modification.' },
      { q: 'How does S3 Stage 1 compare to a standard RS3?', a: 'Stage 1 S3 figures (around 370bhp) are close to the standard RS3 (400bhp), but you\'re saving a significant amount over the price of an RS3. For the money, it\'s an outstanding upgrade that fundamentally changes how the car feels.' },
    ],
    relatedSlugs: ['audi-rs3-remap', 'audi-a3-remap', 'vw-golf-r-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'audi-s4-remap',
    make: 'Audi', model: 'S4', fullName: 'Audi S4',
    metaTitle: 'Audi S4 Remap | Stage 1 Performance Tuning Devon | AutoCleanse',
    metaDescription: 'Audi S4 Stage 1 remap - up to +70bhp from the 3.0 TFSI supercharged or turbocharged engine. Performance ECU tuning in Devon by AutoCleanse.',
    h1: 'Audi S4 Remap',
    intro: 'The Audi S4 is a car we know intimately - it\'s in our own fleet. Whether you\'re running the supercharged V6 3.0 TFSI of the B8 generation or the turbocharged 3.0 TFSI in the B9, both respond brilliantly to ECU remapping. The S4 is already a fast car; remapped, it becomes genuinely rapid while retaining all the everyday refinement that makes it such a compelling all-rounder. AutoCleanse remaps S4s in Devon from our Totnes workshop.',
    engineOptions: [
      { name: '3.0 TFSI 333 (B8, supercharged)', stockPower: '333bhp', remapPower: '395bhp', stockTorque: '440Nm', remapTorque: '530Nm' },
      { name: '3.0 TFSI 354 (B9, turbocharged)', stockPower: '354bhp', remapPower: '420bhp', stockTorque: '500Nm', remapTorque: '580Nm' },
    ],
    faqs: [
      { q: 'How much power does an S4 gain from a Stage 1 remap?', a: 'The B9 S4 354 typically gains around 65–70bhp at Stage 1, reaching around 420bhp and 580Nm. The B8 supercharged variant gains similarly proportionally. In both cases the real-world impact is dramatic - 0–60 drops noticeably and in-gear acceleration is transformed.' },
      { q: 'Is the B9 S4 turbocharged engine better for remapping than the B8 supercharged?', a: 'Both respond very well. The B9 turbocharged engine generally allows slightly higher gains at Stage 1. The B8 supercharged engine is also excellent and has a well-established tuning history. We carry maps for both generations.' },
      { q: 'What supporting modifications does S4 Stage 1 require?', a: 'None - Stage 1 is a software-only upgrade. We read the ECU, apply the new map, and verify the result. No hardware changes are required at Stage 1.' },
      { q: 'Does the S tronic DSG handle S4 Stage 1 power?', a: 'Yes - the S tronic in the S4 is well-engineered and handles Stage 1 power levels without issue. If you plan to go Stage 2 or beyond, a gearbox remap or transmission service is advisable.' },
      { q: 'Do you offer a home visit for S4 remapping in Devon?', a: 'Yes - we offer mobile remapping across Devon for the S4. Book a slot and we\'ll come to you with all the equipment needed. The remap typically takes around 1.5–2 hours including our pre-remap health check.' },
    ],
    relatedSlugs: ['audi-rs3-remap', 'audi-a4-remap', 'mercedes-c63-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'audi-rs3-remap',
    make: 'Audi', model: 'RS3', fullName: 'Audi RS3',
    metaTitle: 'Audi RS3 Remap | Stage 1 Performance Tuning Devon | AutoCleanse',
    metaDescription: 'Audi RS3 Stage 1 remap - unlock beyond 460bhp from the 2.5 TFSI five-cylinder. Expert performance ECU tuning in Devon by AutoCleanse.',
    h1: 'Audi RS3 Remap',
    intro: 'The Audi RS3\'s 2.5 TFSI five-cylinder is one of the finest performance engines ever fitted to a hot hatchback - and it responds to remapping in exceptional fashion. Even at Stage 1, the RS3 moves well beyond 460bhp, making it genuinely supercar-fast in real-world driving. AutoCleanse provides RS3 remapping from our Totnes workshop for enthusiasts across Devon and the South West.',
    engineOptions: [
      { name: '2.5 TFSI 400 (8V)', stockPower: '400bhp', remapPower: '460bhp', stockTorque: '480Nm', remapTorque: '560Nm' },
      { name: '2.5 TFSI 400 (8Y)', stockPower: '400bhp', remapPower: '465bhp', stockTorque: '500Nm', remapTorque: '580Nm' },
    ],
    faqs: [
      { q: 'What does Stage 1 remapping achieve on the RS3?', a: 'The RS3 2.5 TFSI typically reaches 460–470bhp and 560–580Nm at Stage 1 with no hardware changes. In a car weighing around 1,500kg, these figures produce extraordinary real-world acceleration - 0–60 in the low 3-second range is achievable.' },
      { q: 'Is Stage 2 worthwhile on the RS3?', a: 'Stage 2 pushes beyond 500bhp with a high-flow catalyst and uprated intercooler. At this level, gearbox and drivetrain durability become considerations. For road use, Stage 1 offers the ideal balance. Stage 2 suits track-focused builds.' },
      { q: 'Does remapping affect the RS3\'s launch control or Torque Splitter?', a: 'On the 8Y RS3 with Torque Splitter rear differential, remapping optimises power delivery to complement these systems rather than fight them. The result is improved traction and sharper responses from Torque Splitter-enabled modes.' },
      { q: 'Will the RS3 pass an MOT after remapping?', a: 'Yes - Stage 1 remapping does not increase emissions beyond MOT limits. We do not remove or disable any emissions systems. The RS3 will pass its MOT as normal.' },
      { q: 'How do I book an RS3 remap in Devon?', a: 'Use our booking form or contact us directly. We\'ll confirm your specific RS3 variant and generation, and book you in for a workshop or mobile appointment. We aim to turn most remaps around within 2 hours.' },
    ],
    relatedSlugs: ['audi-s3-remap', 'audi-s4-remap', 'vw-golf-r-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  // ── BMW ───────────────────────────────────────────────────────────────────

  {
    slug: 'bmw-320d-remap',
    make: 'BMW', model: '320d', fullName: 'BMW 320d',
    metaTitle: 'BMW 320d Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'BMW 320d ECU remapping - Stage 1 diesel remap gains up to +45bhp and improved MPG. Workshop in Totnes or mobile across Devon.',
    h1: 'BMW 320d Remap',
    intro: 'The BMW 320d is one of the most popular diesel saloons in the UK and responds excellently to ECU remapping. The B47 engine used in the F30/G20 generations is factory-restricted to differentiate it from more expensive 330d and 340d models - a Stage 1 remap unlocks the headroom that BMW deliberately leave available. AutoCleanse remaps 320ds from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0d B47 190 (F30/G20)', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0d N47 163 (E90/F30 pre-2015)', stockPower: '163bhp', remapPower: '205bhp', stockTorque: '360Nm', remapTorque: '420Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'How much power does a BMW 320d gain from remapping?', a: 'The B47 190 variant typically gains around 45bhp and 60Nm at Stage 1, reaching approximately 235bhp and 460Nm. The N47 163 gains similar proportional improvements. In real-world driving this transforms the 320d from capable to genuinely quick.' },
      { q: 'Does the 320d remap improve MPG?', a: 'Yes - the torque improvements allow the engine to work less hard at motorway speeds. Drivers regularly report 10–12% real-world MPG gains after remapping, making the remap pay for itself quickly for high-mileage users.' },
      { q: 'Is the BMW B47 engine reliable after remapping?', a: 'Yes - the B47 is a modern, robust diesel engine with good headroom at Stage 1 power levels. We always carry out a pre-remap diagnostic to identify any existing issues before the remap is applied.' },
      { q: 'Can I get Stage 2 on my 320d?', a: 'The 320d is generally best suited to Stage 1. The B47 hardware doesn\'t offer as much headroom for Stage 2 as larger engines. Stage 1 delivers excellent results without the added cost and complexity of hardware upgrades.' },
      { q: 'Do you offer 320d remapping in Exeter and Plymouth?', a: 'Yes - both are within our mobile coverage area. We also cover Torbay, Totnes, Newton Abbot, and the wider Devon area. Book online or call us to arrange a mobile visit.' },
    ],
    contentSections: [
      {
        heading: 'What to expect from a BMW 320d remap',
        paragraphs: [
          'A Stage 1 remap on the 320d is less about outright top speed and more about how the car feels in everyday driving. The biggest change is mid-range torque: the extra 60Nm arrives from around 1,800–2,500rpm, which is exactly where you spend most of your time on Devon A-roads and the A38. Overtakes that previously needed a downshift happen in the current gear, and the car pulls cleanly out of roundabouts and junctions without the slightly hesitant, over-emissions-tuned feel BMW ships from the factory.',
          'On the motorway the difference shows up as more relaxed cruising. Because the engine is doing the same work at lower effort, you sit in a higher gear for longer and the drivetrain feels less busy. It is a genuinely useful upgrade for high-mileage company-car and commuter drivers rather than a novelty.',
        ],
      },
      {
        heading: 'N47 vs B47: which 320d do you have?',
        paragraphs: [
          'Pre-2015 320ds (E90, early F30) use the N47 2.0 diesel, while F30 facelift and G20 cars use the newer B47. Both respond well to Stage 1, but they are not identical. The N47 is a proven, torquey unit that we remap regularly; on higher-mileage examples it is worth being aware of the well-documented timing-chain history, which is exactly why we run a full health check first. The B47 is smoother, cleaner and slightly more tuneable, and it is the engine in most F30 facelift and G20 cars on the road today.',
          'Tell us your registration when you book and we will confirm the exact engine, the realistic gains for that variant, and whether your car is a good candidate before you commit to anything.',
        ],
      },
      {
        heading: 'Gearbox and economy: the ZF8 auto and real-world MPG',
        paragraphs: [
          'Most 320ds sold in the last decade use the ZF 8-speed automatic, which comfortably handles Stage 1 torque levels — it is a strong, well-proven gearbox and our maps stay within its safe operating window. Manual cars are equally suitable at Stage 1, though as with any torque increase a very worn clutch may show its age sooner, so we will flag it if yours feels marginal.',
          'On economy, drivers who keep to a steady right foot typically see a real-world 8–12% MPG improvement, mostly from motorway and dual-carriageway cruising where the engine works less hard. If you use the extra performance at every opportunity, expect economy to stay roughly the same — the gain is a choice, not automatic.',
        ],
      },
      {
        heading: 'Is Stage 1 the right choice, and how we protect your engine',
        paragraphs: [
          'For the 320d we almost always recommend Stage 1. It needs no hardware changes, keeps the DPF and emissions equipment in place, and delivers the vast majority of the usable gain. Stage 2 offers limited additional benefit on this engine relative to the cost and supporting work involved, so it is rarely the sensible option for a road-going 320d.',
          'Every remap starts with a paid diagnostic health check — we are upfront that this is not a free add-on. We read the ECU for stored and pending faults, check the DPF, EGR and boost readings, and only proceed if the engine is healthy. If we find an underlying problem, we tell you before any remap is applied. We keep a backup of your original file so the car can be returned to stock at any time.',
        ],
      },
      {
        heading: 'Insurance, warranty and the law',
        paragraphs: [
          'A remap is a modification, and you must declare it to your insurer — many specialist and mainstream insurers cover remapped vehicles at a reasonable premium, but not declaring it can invalidate a claim. If your 320d is still within BMW warranty, be aware a remap may affect drivetrain cover, so it is worth checking your terms first. Stage 1 remapping keeps your DPF and emissions hardware intact and is legal for road use in the UK; we do not offer DPF or emissions-equipment removal for road cars.',
        ],
      },
    ],
    relatedSlugs: ['bmw-330d-remap', 'bmw-520d-remap', 'audi-a4-remap'],
    category: 'economy', fuelType: 'diesel',
  },

  {
    slug: 'bmw-330d-remap',
    make: 'BMW', model: '330d', fullName: 'BMW 330d',
    metaTitle: 'BMW 330d Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'BMW 330d ECU remapping - gain up to +60bhp and 100Nm from the B57 engine. Stage 1 diesel remap in Devon from AutoCleanse.',
    h1: 'BMW 330d Remap',
    intro: 'The BMW 330d with its B57 straight-six diesel is one of the most rewarding cars to remap in the BMW range - the engine has significant headroom and the gains from Stage 1 are substantial. Moving from 265bhp to around 325bhp with torque jumping to over 680Nm, the 330d becomes an exceptionally fast diesel with genuine sports car pace. AutoCleanse remaps 330ds in Devon from our Totnes workshop.',
    engineOptions: [
      { name: '3.0d B57 265 (G20/G21)', stockPower: '265bhp', remapPower: '325bhp', stockTorque: '580Nm', remapTorque: '680Nm', mpgGain: 'up to 10%' },
      { name: '3.0d N57 258 (F30/F31)', stockPower: '258bhp', remapPower: '315bhp', stockTorque: '560Nm', remapTorque: '660Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'What performance gains does a 330d get from Stage 1?', a: 'The B57 330d typically gains around 60bhp and 100Nm at Stage 1, reaching 325bhp and 680Nm. This transforms the 330d into an exceptionally rapid diesel with 0–60 times that rival many petrol performance cars.' },
      { q: 'Is the 330d B57 a good engine to remap?', a: 'The B57 is one of the best inline-six diesels ever made and one of the finest remapping platforms available. It has ample headroom at Stage 1 and a strong tuning history. Many tuners consider it one of their favourite engines to work with.' },
      { q: 'Does the 330d xDrive respond the same as the RWD?', a: 'Yes - the drivetrain configuration doesn\'t affect the ECU remap. Both xDrive and RWD 330ds see identical power gains. The xDrive\'s extra traction means the additional power is perhaps even better deployed in all conditions.' },
      { q: 'How does a remapped 330d compare to an M340i?', a: 'The M340i uses the petrol B58 and is a different driving experience. A remapped 330d doesn\'t match M340i power at Stage 1, but the torque delivery from the B57 diesel is extraordinary - in many real-world situations it\'s equally as fast.' },
      { q: 'What\'s the turnaround time for a 330d remap?', a: 'Including our pre-remap diagnostic check and post-remap road test, a 330d remap typically takes around 1.5–2 hours. We don\'t rush - a thorough job is more important than speed.' },
    ],
    relatedSlugs: ['bmw-320d-remap', 'bmw-x5-remap', 'bmw-520d-remap'],
    category: 'performance', fuelType: 'diesel',
  },

  {
    slug: 'bmw-118d-remap',
    make: 'BMW', model: '118d', fullName: 'BMW 118d',
    metaTitle: 'BMW 118d Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'BMW 118d ECU remapping - gain up to +40bhp from the B37/B47 diesel engine. Improve MPG and performance. Workshop or mobile across Devon.',
    h1: 'BMW 118d Remap',
    intro: 'The BMW 118d is an ideal candidate for ECU remapping - it\'s often driven by owners who want economy and refinement, and a Stage 1 remap delivers improved MPG alongside a useful power boost that makes the 1 Series genuinely responsive on A-roads and motorways. The gains are proportionally significant on this smaller engine. AutoCleanse remaps 118ds across Devon from our Totnes workshop and via mobile.',
    engineOptions: [
      { name: '1.5d B37 116 (F20/F40)', stockPower: '116bhp', remapPower: '155bhp', stockTorque: '270Nm', remapTorque: '330Nm', mpgGain: 'up to 18%' },
      { name: '2.0d B47 150 (F20/F40)', stockPower: '150bhp', remapPower: '192bhp', stockTorque: '320Nm', remapTorque: '390Nm', mpgGain: 'up to 14%' },
    ],
    faqs: [
      { q: 'Is it worth remapping a BMW 118d?', a: 'Yes - especially for drivers covering significant mileage. The MPG improvements are proportionally the largest of any 1 Series remap, and the power gains make the car feel genuinely brisk. The remap often pays for itself in fuel savings within 6–12 months for regular commuters.' },
      { q: 'Which 118d engine is better to remap - B37 or B47?', a: 'Both respond very well. The B47 2.0d generally allows slightly higher gains due to the larger engine. However, the B37 three-cylinder sees excellent proportional improvements and the MPG gains are particularly strong on that engine.' },
      { q: 'Does remapping a 118d affect reliability?', a: 'No - Stage 1 remapping works within the safe limits of the engine hardware. The 118d engines are well-proven and handle Stage 1 power levels without concern. Our pre-remap diagnostic ensures we\'re starting with a healthy engine.' },
      { q: 'Can the 118d be remapped on a mobile visit?', a: 'Yes - we carry out full mobile remaps across Devon. We come to your home or workplace with all the equipment needed. There\'s no need to drive to a workshop.' },
      { q: 'Will a remapped 118d feel very different to drive?', a: 'Yes - the difference is immediately noticeable, particularly in the mid-range. The engine feels more willing, gear changes are less frequent, and the overall driving experience is more relaxed despite being faster. Most customers are pleasantly surprised by how significant the real-world difference is.' },
    ],
    relatedSlugs: ['bmw-120d-remap', 'bmw-320d-remap', 'audi-a3-remap'],
    category: 'economy', fuelType: 'diesel',
  },

  {
    slug: 'bmw-120d-remap',
    make: 'BMW', model: '120d', fullName: 'BMW 120d',
    metaTitle: 'BMW 120d Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'BMW 120d ECU remapping in Devon - Stage 1 diesel remap gains up to +45bhp and 60Nm. Workshop in Totnes or mobile across Devon.',
    h1: 'BMW 120d Remap',
    intro: 'The BMW 120d with the B47 2.0d engine is one of the most popular 1 Series variants and responds particularly well to ECU remapping. Starting at 190bhp, Stage 1 takes it to around 235bhp with a significant torque increase that transforms the car\'s character on the road. AutoCleanse remaps 120ds from our Totnes workshop and via mobile across Devon.',
    engineOptions: [
      { name: '2.0d B47 190 (F20/F40)', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'What does a 120d Stage 1 remap achieve?', a: 'The B47 190 gains around 45bhp and 60Nm at Stage 1, reaching approximately 235bhp and 460Nm. In a compact 1 Series body this makes the car feel very fast - 0–60 drops noticeably and in-gear acceleration is transformed.' },
      { q: 'Is the 120d remap the same as the 320d remap?', a: 'The same B47 engine is used in both, so the maps are very similar and the gains are identical. The 120d is lighter than the 320d, so the performance improvement is arguably felt more strongly.' },
      { q: 'Does the 120d M Sport handling cope with the extra power?', a: 'Yes - the M Sport suspension and chassis setup of the 120d handles the Stage 1 power increase well. The car remains balanced and composed. Tyre quality matters more at higher power levels, and we\'d recommend ensuring you have decent rubber fitted.' },
      { q: 'How do I book a 120d remap in Devon?', a: 'Book online using our booking form or call us directly. We offer both workshop and mobile appointments across Devon. Turnaround is typically 1.5–2 hours.' },
      { q: 'Will my MPG improve after remapping the 120d?', a: 'For most driving styles, yes. The improved torque curve allows the engine to work less hard, particularly at motorway speeds. Real-world MPG improvements of 10–12% are typical for regular motorway users.' },
    ],
    relatedSlugs: ['bmw-118d-remap', 'bmw-320d-remap', 'audi-a3-remap'],
    category: 'mixed', fuelType: 'diesel',
  },

  {
    slug: 'bmw-m140i-remap',
    make: 'BMW', model: 'M140i', fullName: 'BMW M140i',
    metaTitle: 'BMW M140i Remap | Stage 1 Performance Tuning Devon | AutoCleanse',
    metaDescription: 'BMW M140i Stage 1 remap - unlock up to 400bhp from the B58 straight-six. Expert performance ECU tuning in Devon by AutoCleanse.',
    h1: 'BMW M140i Remap',
    intro: 'The BMW M140i is a cult performance car with a deeply capable B58 straight-six under the bonnet - and it\'s one of the finest remapping platforms in the hot hatch segment. Stage 1 takes the M140i from 340bhp to well over 400bhp with no hardware changes, making it a genuinely supercar-baiting sleeper. AutoCleanse provides M140i remapping from our Totnes workshop for enthusiasts across Devon and the South West.',
    engineOptions: [
      { name: '3.0T B58 340 (F20)', stockPower: '340bhp', remapPower: '400bhp', stockTorque: '500Nm', remapTorque: '580Nm' },
    ],
    faqs: [
      { q: 'What does Stage 1 achieve on the BMW M140i?', a: 'The B58 M140i typically reaches 400–410bhp and 580Nm at Stage 1 with no hardware changes. In an F20 1 Series body the performance is exceptional - 0–60 in the low 4s is achievable, putting it among the fastest hot hatches available.' },
      { q: 'What Stage 2 potential does the M140i have?', a: 'The B58 engine has extraordinary Stage 2 potential. With an uprated intercooler, high-flow exhaust, and supporting modifications, 480–500bhp is achievable. However, Stage 1 at 400bhp is already remarkable and most M140i owners stop there.' },
      { q: 'Is the B58 engine reliable after remapping?', a: 'The BMW B58 is one of the most respected performance engines in the tuning world. It has proven to be extremely reliable even at significantly elevated power levels when the remap is done correctly. We use maps from established tuners with a track record on B58s.' },
      { q: 'Will the ZF 8-speed auto handle M140i Stage 1 power?', a: 'Yes - the ZF 8HP is extremely robust and handles Stage 1 power without issue. Many B58-powered cars run these gearboxes at much higher power levels without problem.' },
      { q: 'Do you remap M140is across Devon?', a: 'Yes - we remap M140is at our Totnes workshop and across Devon via mobile. Given the performance nature of the car, we recommend a workshop visit so we can carry out a thorough post-remap test drive on suitable roads.' },
    ],
    relatedSlugs: ['bmw-m340i-remap', 'audi-s3-remap', 'vw-golf-r-remap'],
    caseStudySlug: 'bmw-m140i-stage-1-remap',
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'bmw-m340i-remap',
    make: 'BMW', model: 'M340i', fullName: 'BMW M340i',
    metaTitle: 'BMW M340i Remap | Stage 1 Performance Tuning Devon | AutoCleanse',
    metaDescription: 'BMW M340i Stage 1 remap - take the B58 beyond 440bhp. Expert performance ECU tuning in Devon by AutoCleanse.',
    h1: 'BMW M340i Remap',
    intro: 'The BMW M340i is a brilliant all-rounder - fast, refined, and practical - and the B58 straight-six responds to ECU remapping in impressive fashion. A Stage 1 remap takes the M340i from 374bhp to beyond 440bhp, adding significantly to the already impressive performance without changing the everyday character of the car. AutoCleanse provides M340i remapping in Devon from our Totnes workshop.',
    engineOptions: [
      { name: '3.0T B58 374 (G20/G21)', stockPower: '374bhp', remapPower: '445bhp', stockTorque: '500Nm', remapTorque: '600Nm' },
    ],
    faqs: [
      { q: 'How much power does the M340i gain at Stage 1?', a: 'The B58 M340i typically gains around 70bhp and 100Nm at Stage 1, reaching 445bhp and 600Nm. In the G20 3 Series body this delivers exceptional performance - the M340i becomes genuinely very fast across all conditions.' },
      { q: 'How does a remapped M340i compare to an M3?', a: 'The standard M3 produces around 510bhp (Competition). A Stage 1 M340i at 445bhp isn\'t far behind, at a fraction of the M3\'s cost. For drivers who want M-class performance with M340i running costs and purchase price, remapping is an outstanding value proposition.' },
      { q: 'Does the M340i xDrive benefit from remapping equally?', a: 'Yes - the xDrive AWD system handles the additional power superbly. In wet conditions particularly, the remapped xDrive M340i is strikingly capable - traction is never an issue regardless of power output.' },
      { q: 'Is Stage 1 the limit for the M340i?', a: 'Stage 1 is the software limit without hardware changes. Stage 2 with intercooler and exhaust work can push beyond 500bhp. For a road car, Stage 1 is the sensible stopping point - it delivers extraordinary performance without reliability compromises.' },
      { q: 'Can I book an M340i remap at your Devon workshop?', a: 'Yes - our Totnes workshop is set up for performance remapping of all BMW models. Contact us to book, and we\'ll arrange a time that suits you. The remap takes 1.5–2 hours including our thorough pre-remap diagnostic.' },
    ],
    relatedSlugs: ['bmw-m140i-remap', 'bmw-330d-remap', 'audi-s4-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'bmw-x5-remap',
    make: 'BMW', model: 'X5', fullName: 'BMW X5',
    metaTitle: 'BMW X5 Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'BMW X5 ECU remapping - gain up to +65bhp and 100Nm from the B57 diesel. Stage 1 remapping from our Totnes workshop or mobile across Devon.',
    h1: 'BMW X5 Remap',
    intro: 'The BMW X5 is a large luxury SUV that benefits significantly from ECU remapping, particularly for towing and long-distance motorway use. The B57 three-litre diesel is one of the finest engines in its class and has substantial headroom at Stage 1. AutoCleanse remaps X5s throughout Devon from our Totnes workshop and via mobile service.',
    engineOptions: [
      { name: 'xDrive30d B57 265 (G05)', stockPower: '265bhp', remapPower: '330bhp', stockTorque: '620Nm', remapTorque: '720Nm', mpgGain: 'up to 10%' },
      { name: 'xDrive40d B57 340 (G05)', stockPower: '340bhp', remapPower: '400bhp', stockTorque: '700Nm', remapTorque: '820Nm', mpgGain: 'up to 8%' },
      { name: 'M50d B57S 400 (G05)', stockPower: '400bhp', remapPower: '460bhp', stockTorque: '760Nm', remapTorque: '880Nm' },
    ],
    faqs: [
      { q: 'Does an X5 remap improve towing?', a: 'Significantly - the X5 is a popular tow vehicle and the additional torque makes a real difference when pulling heavy loads. The engine is under less strain, gearshifts are reduced on inclines, and the overall driving experience towing is transformed. Many X5 owners remap specifically for this benefit.' },
      { q: 'What does the X5 30d B57 gain at Stage 1?', a: 'The B57 30d gains around 65bhp and 100Nm at Stage 1, reaching approximately 330bhp and 720Nm. In a large SUV this delivers genuinely rapid performance and substantially improved real-world economy.' },
      { q: 'Is the X5 a suitable vehicle for mobile remapping?', a: 'Yes - our mobile service covers X5s across Devon. We need access to the OBD port and approximately 1.5–2 hours. Some customers prefer a workshop visit for performance vehicles, and we\'re happy to accommodate either preference.' },
      { q: 'Does the X5 diesel remap improve fuel economy?', a: 'Yes - for motorway drivers, 8–10% MPG improvements are typical. The X5\'s size means even modest MPG improvements translate to meaningful fuel savings over a year of typical mileage.' },
      { q: 'Can the X5 M50d be remapped further?', a: 'The M50d is already an exceptional performance SUV, and Stage 1 still unlocks meaningful gains. Beyond Stage 1, the M50d\'s quad-turbo B57S engine has limited additional headroom without significant hardware investment.' },
    ],
    relatedSlugs: ['bmw-330d-remap', 'land-rover-discovery-remap', 'range-rover-sport-remap'],
    category: 'mixed', fuelType: 'diesel',
  },

  {
    slug: 'bmw-520d-remap',
    make: 'BMW', model: '520d', fullName: 'BMW 520d',
    metaTitle: 'BMW 520d Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'BMW 520d ECU remapping - Stage 1 diesel remap gains +45bhp and improved MPG. Workshop in Totnes or mobile across Devon.',
    h1: 'BMW 520d Remap',
    intro: 'The BMW 520d is the classic high-mileage executive car - frequently covering 30,000–50,000 miles per year in the hands of sales reps and business users. A Stage 1 remap significantly improves both economy and performance, making it an outstanding value upgrade for anyone covering significant annual mileage. AutoCleanse remaps 520ds from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0d B47 190 (G30/G31)', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0d N47 184 (F10/F11)', stockPower: '184bhp', remapPower: '225bhp', stockTorque: '380Nm', remapTorque: '440Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Is the 520d a good candidate for economy remapping?', a: 'It\'s one of the best - the 520d is typically driven on long motorway journeys where the improved torque curve has the most impact on real-world MPG. Business drivers covering 30,000+ miles per year often recoup the cost of remapping in fuel savings within 6 months.' },
      { q: 'What gains does the B47 520d see at Stage 1?', a: 'Around 45bhp and 60Nm - moving from 190 to 235bhp. Combined with the improved torque delivery, the 520d becomes noticeably more capable and relaxed at motorway speeds.' },
      { q: 'Does the 520d Touring respond the same as the saloon?', a: 'Yes - the remap is to the engine ECU, which is identical across saloon and Touring variants. The extra weight of the Touring estate is barely perceptible in everyday driving after remapping.' },
      { q: 'Can my company 520d be remapped?', a: 'Yes - remapping doesn\'t affect the car\'s visual appearance or any systems visible during a routine service. Many company car users have their vehicles remapped. Check your company\'s policy on modifications first.' },
      { q: 'Do you cover corporate fleet remapping in Devon?', a: 'Yes - we offer fleet remapping services and can accommodate multiple vehicles. Contact us to discuss fleet pricing and scheduling.' },
    ],
    relatedSlugs: ['bmw-320d-remap', 'bmw-330d-remap', 'audi-a6-remap'],
    category: 'economy', fuelType: 'diesel',
  },

  // ── VOLKSWAGEN ────────────────────────────────────────────────────────────

  {
    slug: 'vw-golf-gti-remap',
    make: 'Volkswagen', model: 'Golf GTI', fullName: 'VW Golf GTI',
    metaTitle: 'VW Golf GTI Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'VW Golf GTI ECU remapping - Stage 1 gains up to +60bhp from the EA888. Performance tuning in Devon from our Totnes workshop or mobile.',
    h1: 'VW Golf GTI Remap',
    intro: 'The VW Golf GTI is the benchmark hot hatch, and the EA888 2.0 TSI engine is one of the most extensively tuned platforms in the world. A Stage 1 remap takes the GTI from 245bhp to around 305bhp with no hardware changes, transforming it into a genuinely rapid machine. AutoCleanse provides Golf GTI remapping from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0 TSI EA888 245 (Mk7/7.5)', stockPower: '245bhp', remapPower: '305bhp', stockTorque: '370Nm', remapTorque: '440Nm' },
      { name: '2.0 TSI EA888 300 (Mk8 GTI)', stockPower: '300bhp', remapPower: '360bhp', stockTorque: '400Nm', remapTorque: '470Nm' },
    ],
    faqs: [
      { q: 'How much power does a Golf GTI gain at Stage 1?', a: 'The Mk7 GTI 245 typically gains around 60bhp at Stage 1, reaching approximately 305bhp. The Mk8 300 similarly reaches 360bhp. In both cases the improvement in throttle response and mid-range pull is immediately noticeable.' },
      { q: 'Is the EA888 engine reliable after remapping?', a: 'The EA888 is one of the most-tuned engines in existence with an extensive track record. At Stage 1 power levels it is highly reliable when the map is produced by an experienced tuner and applied to a healthy engine.' },
      { q: 'What is Stage 2 on a Golf GTI?', a: 'Stage 2 typically adds an intercooler upgrade, a high-flow sports cat, and a freer-flowing exhaust, pushing power beyond 370bhp. Most GTI owners find Stage 1 delivers excellent real-world results without the added hardware cost.' },
      { q: 'Does DSG remapping help the GTI?', a: 'A DSG remap alongside the engine remap is optional but beneficial - it allows the gearbox to hold gears longer and shift more aggressively. Many customers choose to combine both for the best overall experience.' },
      { q: 'Do you remap Golf GTIs across Devon?', a: 'Yes - both workshop and mobile appointments are available across Devon. Contact us to book.' },
    ],
    relatedSlugs: ['vw-golf-r-remap', 'audi-s3-remap', 'vw-golf-gtd-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'vw-golf-r-remap',
    make: 'Volkswagen', model: 'Golf R', fullName: 'VW Golf R',
    metaTitle: 'VW Golf R Remap | Stage 1 Performance Tuning Devon | AutoCleanse',
    metaDescription: 'VW Golf R ECU remapping - Stage 1 takes the EA888 beyond 380bhp. Expert performance tuning in Devon by AutoCleanse.',
    h1: 'VW Golf R Remap',
    intro: 'The VW Golf R is the flagship performance Golf - 4Motion AWD, 320bhp from the factory, and one of the finest all-round performance cars available. Stage 1 remapping takes the Golf R beyond 380bhp, further into genuine supercar territory for a fraction of the cost. AutoCleanse provides Golf R remapping from our Totnes workshop for enthusiasts across Devon.',
    engineOptions: [
      { name: '2.0 TSI EA888 310 (Mk7 R)', stockPower: '310bhp', remapPower: '375bhp', stockTorque: '380Nm', remapTorque: '460Nm' },
      { name: '2.0 TSI EA888 320 (Mk8 R)', stockPower: '320bhp', remapPower: '385bhp', stockTorque: '420Nm', remapTorque: '500Nm' },
    ],
    faqs: [
      { q: 'How much power does a Golf R Stage 1 produce?', a: 'The Mk7 R typically reaches 375bhp at Stage 1; the Mk8 R reaches around 385bhp. Both are astonishing figures for a hot hatch and, combined with 4Motion AWD traction, provide extraordinary real-world performance.' },
      { q: 'How does a remapped Golf R compare to the Audi S3?', a: 'Both share the EA888 engine and similar architecture. Remapped figures are very close - the Golf R and S3 are essentially equals in performance terms. The Golf R arguably handles better; the S3 offers more premium interior.' },
      { q: 'Is Stage 2 worthwhile on the Golf R?', a: 'Stage 2 with intercooler and exhaust work pushes the R beyond 420bhp. For a road car, Stage 1 is the ideal balance. Stage 2 suits those who want maximum power and use the car on track.' },
      { q: 'Does 4Motion handle the Stage 1 power well?', a: 'Yes - 4Motion AWD is one of the great assets of the Golf R at higher power levels. Traction is never an issue, even on wet roads. The system deploys the Stage 1 power efficiently in all conditions.' },
      { q: 'Can my Golf R be remapped in Devon?', a: 'Yes - workshop and mobile appointments available. Contact us to book at our Totnes workshop or arrange a mobile visit anywhere in Devon.' },
    ],
    relatedSlugs: ['vw-golf-gti-remap', 'audi-s3-remap', 'audi-rs3-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'vw-golf-gtd-remap',
    make: 'Volkswagen', model: 'Golf GTD', fullName: 'VW Golf GTD',
    metaTitle: 'VW Golf GTD Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'VW Golf GTD ECU remapping - gain up to +50bhp and improved MPG from the 2.0 TDI. Stage 1 diesel tuning in Devon by AutoCleanse.',
    h1: 'VW Golf GTD Remap',
    intro: 'The VW Golf GTD is the diesel performance Golf - offering the GTI look and feel with diesel economy. Its 2.0 TDI engine responds brilliantly to ECU remapping, gaining around 50bhp and significant torque at Stage 1 while also improving real-world MPG. AutoCleanse remaps Golf GTDs in Devon from our Totnes workshop and mobile.',
    engineOptions: [
      { name: '2.0 TDI 184 (Mk7/7.5 GTD)', stockPower: '184bhp', remapPower: '235bhp', stockTorque: '380Nm', remapTorque: '440Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TDI 200 (Mk8 GTD)', stockPower: '200bhp', remapPower: '255bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Why remap a Golf GTD when a GTI exists?', a: 'The GTD offers diesel economy with performance styling - the ideal daily driver for high-mileage users. A remap enhances both aspects: more performance AND better real-world MPG. For commuters covering 20,000+ miles per year, the GTD remapped is a compelling package.' },
      { q: 'What gains does the GTD 184 see at Stage 1?', a: 'Around 50bhp and 60Nm, reaching approximately 235bhp and 440Nm. The improvement in mid-range torque is immediately noticeable - the GTD feels genuinely fast in everyday driving.' },
      { q: 'Does a GTD remap improve MPG?', a: 'Yes - real-world MPG improvements of 10–12% are typical for motorway drivers. The improved torque means the engine works less hard at cruise speed.' },
      { q: 'Is the GTD 2.0 TDI a reliable engine after remapping?', a: 'The VW 2.0 TDI is one of the most-remapped diesel engines in Europe with an extensive tuning history. At Stage 1 power levels it is highly reliable when mapped correctly on a healthy engine.' },
      { q: 'Do you cover Golf GTD remapping across Devon?', a: 'Yes - workshop and mobile appointments available. Contact us or book online.' },
    ],
    relatedSlugs: ['vw-golf-gti-remap', 'audi-a3-remap', 'vw-passat-remap'],
    category: 'mixed', fuelType: 'diesel',
  },

  {
    slug: 'vw-transporter-remap',
    make: 'Volkswagen', model: 'Transporter', fullName: 'VW Transporter',
    metaTitle: 'VW Transporter Remap | Van Tuning Devon | AutoCleanse',
    metaDescription: 'VW Transporter T5/T6 ECU remapping - improve power, torque and MPG. Commercial van remapping in Devon from AutoCleanse.',
    h1: 'VW Transporter Remap',
    intro: 'The VW Transporter is the premium choice for tradespeople and small fleet operators, and it responds very well to ECU remapping. Both T5 and T6 variants with the 2.0 TDI engine gain significant torque that transforms their pulling power under load - particularly important for those carrying heavy tool kits or towing. AutoCleanse remaps Transporters from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0 TDI 102 (T5/T6)', stockPower: '102bhp', remapPower: '140bhp', stockTorque: '250Nm', remapTorque: '310Nm', mpgGain: 'up to 18%' },
      { name: '2.0 TDI 150 (T6)', stockPower: '150bhp', remapPower: '192bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 14%' },
      { name: '2.0 TDI 204 (T6.1)', stockPower: '204bhp', remapPower: '250bhp', stockTorque: '450Nm', remapTorque: '520Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Does remapping a VW Transporter improve fuel economy?', a: 'Yes - this is often the primary reason commercial operators remap their Transporters. MPG improvements of 12–18% are common depending on load profile and driving style. For a vehicle covering 30,000+ miles per year, the savings are substantial.' },
      { q: 'Will the Transporter pull better after remapping?', a: 'Significantly - the extra torque makes carrying heavy loads or towing much less stressful. Hills that previously required significant downshifting become easier, and the engine runs more comfortably at sustained higher speeds when loaded.' },
      { q: 'Can you remap a T5 Transporter as well as a T6?', a: 'Yes - we remap both T5 and T6 Transporters. The 2.0 TDI engine used in the T5 from 2009 onwards responds well to remapping, as does the T6 and T6.1.' },
      { q: 'Do you offer fleet pricing for multiple Transporters?', a: 'Yes - contact us to discuss fleet pricing and scheduling. We can accommodate multiple vehicles and come to your premises.' },
      { q: 'Is mobile remapping available for Transporters?', a: 'Yes - our mobile service covers all Transporter variants across Devon. We come to your depot, yard, or home.' },
    ],
    contentSections: [
      {
        heading: 'What to expect from a Transporter remap',
        paragraphs: [
          'For a working van, the point of a Transporter remap is loaded driveability rather than headline power. The extra torque arrives low in the rev range, so a fully laden T5 or T6 pulls away from junctions and climbs Devon hills without you having to work the gearbox or bury the throttle. If you carry a tool-heavy payload, tow a trailer or plant, or run motorway miles between jobs, that is exactly where the difference is felt every day.',
          'The lower-powered 102 and 140 vans benefit the most in relative terms — they go from feeling underpowered when loaded to genuinely comfortable. The 150 and 204 vans gain strong, usable mid-range that makes long runs far less tiring.',
        ],
      },
      {
        heading: 'T5, T6 and T6.1: engine variants',
        paragraphs: [
          'We remap the 2.0 TDI across the T5 (2009 on), T6 and T6.1. The single-turbo 102 and 150 and the twin-turbo 180/204 all respond well at Stage 1, but the safe, sensible gain differs by variant — a 102 will not reach 204 figures, and we would never claim it does. Tell us the exact model, year and power output when you book and we will confirm realistic numbers for your specific van.',
          'Many Transporters are camper conversions. These remap just the same, and the added torque is particularly welcome when the van is loaded with a full interior, water and gear on hilly or coastal routes.',
        ],
      },
      {
        heading: 'Gearbox, economy and fleet considerations',
        paragraphs: [
          'DSG-equipped Transporters are well suited to Stage 1 — our maps respect the gearbox\'s torque limits. On manual vans, a healthy clutch copes fine, but a clutch already worn from heavy loaded use may need attention sooner, and we will tell you honestly if yours feels close.',
          'Economy is the number one reason operators remap their vans: a better torque curve means less throttle to maintain speed, and drivers commonly report 10–18% real-world MPG improvements depending on load and route. Over 30,000+ miles a year that adds up quickly. For fleets we can apply a consistent map across multiple vans and schedule them around your work — ask about fleet pricing.',
        ],
      },
      {
        heading: 'Diagnostics first, and mobile visits to your yard',
        paragraphs: [
          'Every van gets a paid diagnostic health check before we touch the ECU — this is not a free add-on. We scan for faults, check the DPF and EGR condition and confirm the van is healthy before the remap is applied, because remapping a van with an existing problem simply masks it. We keep your original file backed up so the van can be returned to standard whenever you need.',
          'Because downtime costs you money, we offer mobile ECU remapping across Devon and can come to your depot, yard or home — the same equipment and process as our Totnes workshop, without taking the van off the road for a trip.',
        ],
      },
      {
        heading: 'Insurance and the law',
        paragraphs: [
          'A remap is a declarable modification. Make sure your commercial or fleet policy is informed — most insurers cover remapped vans, but an undeclared modification can invalidate a claim. Stage 1 remapping keeps your DPF and emissions equipment in place and is road-legal; we do not remove DPFs or emissions hardware on road-going vehicles.',
        ],
      },
    ],
    relatedSlugs: ['vw-amarok-remap', 'ford-transit-remap', 'mercedes-sprinter-remap'],
    category: 'commercial', fuelType: 'diesel',
  },

  {
    slug: 'vw-amarok-remap',
    make: 'Volkswagen', model: 'Amarok', fullName: 'VW Amarok',
    metaTitle: 'VW Amarok Remap | Stage 1 Diesel Tuning Devon | AutoCleanse',
    metaDescription: 'VW Amarok ECU remapping - Stage 1 gains up to +80bhp from the V6 TDI. Towing and performance remapping in Devon by AutoCleanse.',
    h1: 'VW Amarok Remap',
    intro: 'The VW Amarok is the premium pick-up truck choice, and the V6 TDI in particular is one of the finest engines fitted to any commercial vehicle. Stage 1 remapping adds dramatic torque to the Amarok, transforming its towing capability and on-road performance. AutoCleanse remaps Amaroks from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0 TDI 163 (2H)', stockPower: '163bhp', remapPower: '205bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 14%' },
      { name: '3.0 V6 TDI 224 (2H)', stockPower: '224bhp', remapPower: '285bhp', stockTorque: '550Nm', remapTorque: '680Nm', mpgGain: 'up to 10%' },
      { name: '3.0 V6 TDI 258 (2H)', stockPower: '258bhp', remapPower: '320bhp', stockTorque: '580Nm', remapTorque: '720Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Is the Amarok V6 TDI a good engine to remap?', a: 'It is one of the best commercial vehicle engines to remap. The V6 TDI has significant headroom and the gains in torque are extraordinary - the Amarok becomes genuinely exceptional for towing after Stage 1.' },
      { q: 'How much does the Amarok V6 gain at Stage 1?', a: 'The V6 258 typically gains around 60bhp and 140Nm, reaching 320bhp and 720Nm. In towing terms this is transformative - the Amarok becomes one of the strongest tow vehicles on the road at this power level.' },
      { q: 'Does remapping the Amarok improve towing?', a: 'Significantly - the added torque is directly beneficial for towing. Load and incline performance improves dramatically, and the engine works more comfortably under sustained towing loads.' },
      { q: 'Can the Amarok 2.0 TDI be remapped too?', a: 'Yes - the 2.0 TDI Amarok also gains well at Stage 1. Gains are proportionally strong and the MPG improvements make it particularly worthwhile for high-mileage commercial use.' },
      { q: 'Do you remap Amaroks in Devon?', a: 'Yes - workshop and mobile appointments available across Devon. Contact us to book.' },
    ],
    relatedSlugs: ['vw-transporter-remap', 'ford-ranger-remap', 'nissan-navara-remap'],
    category: 'commercial', fuelType: 'diesel',
  },

  {
    slug: 'vw-passat-remap',
    make: 'Volkswagen', model: 'Passat', fullName: 'VW Passat',
    metaTitle: 'VW Passat Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'VW Passat ECU remapping - Stage 1 diesel and petrol remaps. Gain up to +45bhp and improved MPG. Workshop or mobile across Devon.',
    h1: 'VW Passat Remap',
    intro: 'The VW Passat is one of the most popular executive-class family cars in the UK - a high-mileage workhorse that responds very well to ECU remapping. The 2.0 TDI diesel in particular offers significant headroom from the factory, making Stage 1 remapping an outstanding value upgrade for Passat drivers covering substantial annual mileage. AutoCleanse remaps Passats from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0 TDI 150 (B8)', stockPower: '150bhp', remapPower: '192bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 14%' },
      { name: '2.0 TDI 190 (B8)', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TSI 220 (B8)', stockPower: '220bhp', remapPower: '275bhp', stockTorque: '350Nm', remapTorque: '420Nm' },
    ],
    faqs: [
      { q: 'Is the Passat TDI a good candidate for economy remapping?', a: 'One of the best - the Passat is typically driven on long motorway runs where the improved torque curve has maximum impact on real-world MPG. Business users covering 25,000+ miles annually frequently recoup the remap cost in fuel savings within 6 months.' },
      { q: 'What does a Passat 2.0 TDI 150 gain at Stage 1?', a: 'Around 42bhp and 60Nm - moving to approximately 192bhp and 400Nm. The real-world difference is immediately apparent: more confident overtaking, less downshifting on hills, and a more relaxed motorway cruise.' },
      { q: 'Does the Passat Estate remap the same as the saloon?', a: 'Yes - the engine ECU is identical across saloon and estate variants. All respond identically to remapping.' },
      { q: 'Can a company car Passat be remapped?', a: 'Yes - the remap makes no visible change and leaves no trace on routine service. Check your company policy on modifications before proceeding.' },
      { q: 'Do you offer mobile remapping for the Passat in Devon?', a: 'Yes - full mobile remapping available across Devon. Contact us to book.' },
    ],
    relatedSlugs: ['vw-golf-gtd-remap', 'vw-tiguan-remap', 'audi-a4-remap'],
    category: 'economy', fuelType: 'both',
  },

  {
    slug: 'vw-tiguan-remap',
    make: 'Volkswagen', model: 'Tiguan', fullName: 'VW Tiguan',
    metaTitle: 'VW Tiguan Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'VW Tiguan ECU remapping - Stage 1 diesel and petrol remaps. Gain up to +45bhp and improved MPG. Workshop or mobile across Devon.',
    h1: 'VW Tiguan Remap',
    intro: 'The VW Tiguan is a hugely popular family SUV across Devon and the wider South West, and it responds very well to ECU remapping - particularly the diesel variants used for family motoring and occasional towing. Stage 1 remapping improves both performance and real-world economy without any hardware changes. AutoCleanse remaps Tiguans from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0 TDI 150 (AD1)', stockPower: '150bhp', remapPower: '192bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 14%' },
      { name: '2.0 TDI 190 (AD1)', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TSI 190 (AD1)', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '320Nm', remapTorque: '390Nm' },
    ],
    faqs: [
      { q: 'Does remapping a Tiguan help with towing?', a: 'Yes - particularly for diesel Tiguans used to tow caravans or trailers. The additional torque makes inclines much easier, reduces the need to downshift, and overall makes the Tiguan more composed under load.' },
      { q: 'What gains does the Tiguan 2.0 TDI 150 see at Stage 1?', a: 'Around 42bhp and 60Nm, reaching approximately 192bhp and 400Nm. For a family SUV this is a meaningful improvement - the car becomes noticeably more responsive and easier to drive.' },
      { q: 'Is the 4Motion Tiguan suitable for remapping?', a: 'Yes - 4Motion makes no difference to ECU remapping. Both 2WD and 4Motion variants respond identically.' },
      { q: 'Will the Tiguan DSG gearbox handle the extra power?', a: 'Yes - Stage 1 power levels are well within the safe limits of the DSG used in the Tiguan.' },
      { q: 'Can my Tiguan be remapped at home in Devon?', a: 'Yes - mobile remapping available across Devon. We come to you with all the equipment needed.' },
    ],
    relatedSlugs: ['vw-passat-remap', 'audi-q5-remap', 'vw-golf-gtd-remap'],
    category: 'mixed', fuelType: 'both',
  },

  // ── MERCEDES ──────────────────────────────────────────────────────────────

  {
    slug: 'mercedes-a35-remap',
    make: 'Mercedes', model: 'A35', fullName: 'Mercedes A35 AMG',
    metaTitle: 'Mercedes A35 AMG Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Mercedes A35 AMG ECU remapping - Stage 1 remap gains up to +60bhp from the 2.0T engine. Expert performance tuning in Devon by AutoCleanse.',
    h1: 'Mercedes A35 AMG Remap',
    intro: 'The Mercedes A35 AMG is a serious performance hatchback that responds very well to ECU remapping - the 2.0T turbocharged engine shares architecture with the A45 and has headroom for meaningful Stage 1 gains without hardware changes. Taking the A35 from 306bhp to around 365bhp transforms it into a substantially quicker car. AutoCleanse provides A35 remapping in Devon from our Totnes workshop.',
    engineOptions: [
      { name: '2.0T M260 306 (W177)', stockPower: '306bhp', remapPower: '365bhp', stockTorque: '400Nm', remapTorque: '460Nm' },
    ],
    faqs: [
      { q: 'What does Stage 1 achieve on the A35 AMG?', a: 'The A35 2.0T typically gains around 60bhp and 60Nm at Stage 1, reaching approximately 365bhp and 460Nm. The improvement in throttle response and top-end pull is immediately noticeable - the car feels considerably more urgent and rapid.' },
      { q: 'How does a remapped A35 compare to an A45?', a: 'A remapped A35 at 365bhp approaches standard A45 (387bhp) performance. The A45 S at 421bhp remains ahead, but the gap narrows considerably. For A35 owners who want near-A45 performance without the purchase price, remapping is an excellent option.' },
      { q: 'Is the M260 engine reliable after remapping?', a: 'Yes - the M260 is a modern engine with good headroom at Stage 1 power levels. We carry out a thorough pre-remap diagnostic and use proven maps from established tuners. The engine handles Stage 1 well when starting from a good base condition.' },
      { q: 'Does the A35 4MATIC handle the extra power?', a: 'The 4MATIC AWD system handles Stage 1 power levels without issue. Traction is excellent in all conditions at 365bhp on a factory 4MATIC chassis.' },
      { q: 'How do I book an A35 remap in Devon?', a: 'Book via our online form or call us directly. We offer workshop appointments at our Totnes base and mobile visits across Devon. Turnaround is typically 1.5–2 hours.' },
    ],
    relatedSlugs: ['mercedes-a45-remap', 'mercedes-c63-remap', 'audi-s3-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'mercedes-a45-remap',
    make: 'Mercedes', model: 'A45', fullName: 'Mercedes A45 AMG',
    metaTitle: 'Mercedes A45 AMG Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Mercedes A45 AMG S ECU remapping - Stage 1 gains beyond 480bhp from the 2.0T. Expert performance tuning in Devon by AutoCleanse.',
    h1: 'Mercedes A45 AMG Remap',
    intro: 'The Mercedes A45 AMG S produces a factory 421bhp from a 2.0-litre engine - the highest specific output of any production four-cylinder engine. Even at this level, ECU remapping still unlocks further performance: a Stage 1 remap takes the A45 S beyond 480bhp, making it one of the fastest front-biased hot hatches on the road. AutoCleanse provides A45 AMG remapping in Devon from our Totnes workshop.',
    engineOptions: [
      { name: '2.0T M139 387 (A45, W177)', stockPower: '387bhp', remapPower: '450bhp', stockTorque: '480Nm', remapTorque: '550Nm' },
      { name: '2.0T M139 421 (A45 S, W177)', stockPower: '421bhp', remapPower: '485bhp', stockTorque: '500Nm', remapTorque: '580Nm' },
    ],
    faqs: [
      { q: 'What does a Stage 1 remap do to an A45 AMG S?', a: 'The A45 S at 421bhp typically reaches 480–490bhp at Stage 1 with no hardware changes. Combined with the Drift mode and 4MATIC+ AWD system, the remapped A45 S offers extraordinary performance that rivals cars costing twice the price.' },
      { q: 'Is the M139 engine a safe engine to remap?', a: 'The M139 is an exceptional engineering achievement and has a growing tuning history. At Stage 1 power levels it remains within proven limits. We strongly recommend using only reputable, proven maps - not generic files - on an engine of this calibre.' },
      { q: 'What Stage 2 potential does the A45 have?', a: 'Stage 2 with an uprated intercooler and exhaust work can push the A45 S towards 550bhp. At these levels the DSG and drivetrain become limiting factors. Stage 1 at 485bhp is the sensible stopping point for a road car.' },
      { q: 'Does the Torque Vectoring system work with a remapped A45?', a: 'Yes - the 4MATIC+ Torque Vectoring rear differential continues to function as designed after remapping. If anything, the additional power makes the system\'s capabilities more apparent and engaging.' },
      { q: 'Can I have my A45 remapped in Devon?', a: 'Yes - we remap A45 AMG models at our Totnes workshop. We recommend a workshop visit for performance vehicles of this calibre to allow for a proper road test on suitable roads after the remap.' },
    ],
    relatedSlugs: ['mercedes-a35-remap', 'mercedes-c63-remap', 'audi-rs3-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'mercedes-c220-remap',
    make: 'Mercedes', model: 'C220', fullName: 'Mercedes C220d',
    metaTitle: 'Mercedes C220d Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'Mercedes C220d ECU remapping - Stage 1 diesel remap gains +45bhp and improved MPG. Workshop in Totnes or mobile across Devon.',
    h1: 'Mercedes C220d Remap',
    intro: 'The Mercedes C220d is a popular executive saloon for company car users and high-mileage private drivers, and the OM654 diesel engine responds very well to ECU remapping. A Stage 1 remap improves both economy and performance, making the C220d a more capable and rewarding daily driver. AutoCleanse remaps C220ds from our Totnes workshop and via mobile across Devon.',
    engineOptions: [
      { name: '2.0d OM654 194 (W205/W206)', stockPower: '194bhp', remapPower: '240bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 12%' },
      { name: '2.1d OM651 170 (W204)', stockPower: '170bhp', remapPower: '210bhp', stockTorque: '350Nm', remapTorque: '420Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'What gains does the C220d OM654 see from a Stage 1 remap?', a: 'The OM654 194 typically gains around 45bhp and 70Nm at Stage 1, reaching approximately 240bhp and 470Nm. Combined with the 9G-Tronic gearbox, the C-Class becomes notably more responsive and relaxed at motorway speeds.' },
      { q: 'Does C220d remapping improve fuel economy?', a: 'Yes - particularly for motorway users. The improved torque means the engine works less hard at cruise, and the 9G gearbox changes up earlier. MPG improvements of 10–12% are typical for regular long-distance drivers.' },
      { q: 'Is the OM654 a good diesel to remap?', a: 'The OM654 is Mercedes\' modern modular diesel and has a solid tuning track record. It responds well at Stage 1 and is a reliable, well-engineered engine that handles the extra power without concern.' },
      { q: 'Will my C220d warranty be affected?', a: 'If within warranty, remapping may affect Mercedes\' obligation to cover drivetrain faults. We advise checking your warranty status before proceeding. For out-of-warranty vehicles, this is not a concern.' },
      { q: 'Can the C220d Estate be remapped equally?', a: 'Yes - the remap is to the engine ECU, which is identical across saloon and estate variants. The C220d Estate responds identically to the saloon.' },
    ],
    relatedSlugs: ['mercedes-e220-remap', 'mercedes-sprinter-remap', 'bmw-320d-remap'],
    category: 'economy', fuelType: 'diesel',
  },

  {
    slug: 'mercedes-c63-remap',
    make: 'Mercedes', model: 'C63', fullName: 'Mercedes C63 AMG',
    metaTitle: 'Mercedes C63 AMG Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Mercedes C63 AMG ECU remapping - gain up to +65bhp from the 4.0T V8 biturbo. Expert performance tuning in Devon by AutoCleanse.',
    h1: 'Mercedes C63 AMG Remap',
    intro: 'The Mercedes C63 AMG with its 4.0-litre twin-turbocharged V8 is one of the most sonorous and thrilling performance saloons available - and remapping takes its already exceptional performance to another level. A Stage 1 remap adds around 65bhp and significant torque to the M177 engine, producing a car that\'s genuinely extraordinary on the road. AutoCleanse provides C63 remapping in Devon from our Totnes workshop.',
    engineOptions: [
      { name: '4.0T M177 476 (C63, W205/W206)', stockPower: '476bhp', remapPower: '542bhp', stockTorque: '650Nm', remapTorque: '730Nm' },
      { name: '4.0T M177 510 (C63 S, W205)', stockPower: '510bhp', remapPower: '575bhp', stockTorque: '700Nm', remapTorque: '790Nm' },
    ],
    faqs: [
      { q: 'What does Stage 1 achieve on a C63 AMG?', a: 'The C63 476 typically gains around 65bhp and 80Nm at Stage 1, reaching approximately 542bhp and 730Nm. The C63 S gains similarly proportionally. In either case the improvement in mid-range thrust and top-end pull is immediately apparent and dramatic.' },
      { q: 'Is the M177 V8 safe to remap?', a: 'The M177 is a purpose-built AMG performance engine with significant engineering margin. At Stage 1 power levels it operates within proven boundaries. We use maps from tuners with an established track record specifically on M177-engined vehicles.' },
      { q: 'Does the C63 exhaust note change after remapping?', a: 'The exhaust note is not directly affected by the ECU remap. However, many customers report that the engine pulls more freely to the rev limiter after remapping, which naturally results in the V8 being used more enthusiastically - and the exhaust note being heard more often.' },
      { q: 'Can the MCT 9-speed gearbox handle C63 Stage 1 power?', a: 'Yes - the AMG MCT gearbox is engineered to handle power well above stock C63 levels. Stage 1 power is within comfortable margins for this transmission.' },
      { q: 'Do you remap C63 AMGs at your Devon workshop?', a: 'Yes - we remap C63 AMGs at our Totnes workshop. We recommend a workshop visit for high-performance vehicles so we can carry out a proper verification drive. Contact us to discuss and book.' },
    ],
    relatedSlugs: ['mercedes-c220-remap', 'mercedes-glc63-remap', 'audi-s4-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'mercedes-glc63-remap',
    make: 'Mercedes', model: 'GLC63', fullName: 'Mercedes GLC63 AMG',
    metaTitle: 'Mercedes GLC63 AMG Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Mercedes GLC63 AMG ECU remapping - gain beyond 580bhp from the 4.0T V8. Expert performance tuning in Devon by AutoCleanse.',
    h1: 'Mercedes GLC63 AMG Remap',
    intro: 'The Mercedes GLC63 AMG is a car we know personally - it\'s part of our own fleet. The M177 4.0-litre twin-turbo V8 in this performance SUV responds brilliantly to remapping: Stage 1 takes the GLC63 S from 510bhp to beyond 580bhp, transforming an already exceptional vehicle into something genuinely extraordinary. AutoCleanse provides GLC63 remapping in Devon from our Totnes workshop.',
    engineOptions: [
      { name: '4.0T M177 476 (GLC63, X253)', stockPower: '476bhp', remapPower: '542bhp', stockTorque: '650Nm', remapTorque: '730Nm' },
      { name: '4.0T M177 510 (GLC63 S, X253)', stockPower: '510bhp', remapPower: '582bhp', stockTorque: '700Nm', remapTorque: '800Nm' },
    ],
    faqs: [
      { q: 'What does Stage 1 achieve on the GLC63 AMG S?', a: 'The GLC63 S 510 typically reaches 580–590bhp and 800Nm at Stage 1, a gain of around 70bhp and 100Nm. In a performance SUV context this is extraordinary - 0–60 drops to around 3.5 seconds and mid-range acceleration is genuinely shocking.' },
      { q: 'Is remapping a GLC63 worth it given the stock performance?', a: 'In our view, yes - the GLC63 is already a fast car, but Stage 1 adds a dimension that genuinely changes how it feels. The extra torque in particular transforms the mid-range, making overtaking and motorway driving feel effortless in a way the stock car doesn\'t quite match.' },
      { q: 'What\'s Stage 2 potential on the GLC63?', a: 'Stage 2 with downpipes, high-flow cats, and supporting modifications can push beyond 650bhp. At these levels the gearbox and drivetrain require assessment. For a road-used GLC63, Stage 1 delivers an exceptional result without complexity.' },
      { q: 'Does AMG Dynamic Plus mode benefit from remapping?', a: 'Remapping optimises the engine output, which feeds into all driving modes including AMG Dynamic Plus. The car feels more responsive in every mode, but the differences are most apparent in Sport+ and Manual.' },
      { q: 'Can you remap my GLC63 at your Totnes workshop?', a: 'Yes - contact us to book. We have hands-on experience with the GLC63 specifically. Turnaround is typically 1.5–2 hours including a thorough pre-remap health check.' },
    ],
    relatedSlugs: ['mercedes-c63-remap', 'range-rover-sport-remap', 'bmw-x5-remap'],
    category: 'performance', fuelType: 'petrol',
  },

  {
    slug: 'mercedes-sprinter-remap',
    make: 'Mercedes', model: 'Sprinter', fullName: 'Mercedes Sprinter',
    metaTitle: 'Mercedes Sprinter Remap | Commercial Van Tuning Devon | AutoCleanse',
    metaDescription: 'Mercedes Sprinter ECU remapping - improve power, torque and MPG for your Sprinter van. Commercial remapping in Devon by AutoCleanse.',
    h1: 'Mercedes Sprinter Remap',
    intro: 'The Mercedes Sprinter is the workhorse of choice for trades businesses, courier companies, and fleet operators across Devon - and ECU remapping transforms its performance and economy for everyday commercial use. Whether you\'re running a 2.0d 143 or the more powerful 190, a Stage 1 remap adds meaningful torque and can improve MPG by up to 18%, making a significant difference to running costs over time. AutoCleanse offers Sprinter remapping from our Totnes workshop and via mobile across Devon.',
    engineOptions: [
      { name: '2.0d OM654 143 (VS30)', stockPower: '143bhp', remapPower: '185bhp', stockTorque: '330Nm', remapTorque: '400Nm', mpgGain: 'up to 18%' },
      { name: '2.0d OM654 163 (VS30)', stockPower: '163bhp', remapPower: '210bhp', stockTorque: '360Nm', remapTorque: '430Nm', mpgGain: 'up to 15%' },
      { name: '2.0d OM654 190 (VS30)', stockPower: '190bhp', remapPower: '240bhp', stockTorque: '440Nm', remapTorque: '510Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Does remapping a Sprinter improve fuel economy?', a: 'Yes - this is often the primary reason trade and fleet customers remap their Sprinters. The improved torque means the engine works less hard under load, and MPG improvements of 12–18% are common depending on the load profile and driving style.' },
      { q: 'Will a Sprinter remap help with heavy loads?', a: 'Significantly - the extra torque makes carrying heavy loads or towing much less stressful on the engine. Hills that previously required significant downshifting become much easier, and the engine isn\'t working as hard at sustained high speed when loaded.' },
      { q: 'Can the 143bhp base Sprinter be remapped to the 190 spec?', a: 'Not quite - the maps are different and hardware limitations prevent reaching 190bhp from the 143 base tune. However, gains of around 40bhp are typical, taking the 143 to around 185bhp. This is a very significant improvement for a commercial vehicle.' },
      { q: 'Do you offer fleet pricing for multiple Sprinters?', a: 'Yes - we offer fleet remapping pricing for businesses with multiple vehicles. Contact us to discuss your fleet requirements and we\'ll arrange competitive pricing and flexible scheduling.' },
      { q: 'Can my Sprinter be remapped at my depot or yard?', a: 'Yes - our mobile remapping service is ideal for commercial operators. We\'ll come to your premises, carry out the remap on-site, and minimise vehicle downtime. Contact us to arrange a visit.' },
    ],
    relatedSlugs: ['ford-transit-remap', 'vw-transporter-remap', 'vauxhall-vivaro-remap'],
    category: 'commercial', fuelType: 'diesel',
  },

  {
    slug: 'mercedes-e220-remap',
    make: 'Mercedes', model: 'E220', fullName: 'Mercedes E220d',
    metaTitle: 'Mercedes E220d Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'Mercedes E220d ECU remapping - Stage 1 diesel remap gains +45bhp and improved MPG. Workshop in Totnes or mobile across Devon.',
    h1: 'Mercedes E220d Remap',
    intro: 'The Mercedes E220d is the archetypal long-distance executive car - refined, comfortable, and efficient. A Stage 1 remap improves all three: more power reduces effort at motorway speeds, improved torque reduces gear changes, and better fuelling efficiency improves real-world MPG. AutoCleanse remaps E220ds from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '2.0d OM654 194 (W213)', stockPower: '194bhp', remapPower: '240bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 12%' },
      { name: '2.1d OM651 177 (W212)', stockPower: '177bhp', remapPower: '220bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Is the E220d a good car for economy remapping?', a: 'One of the best - the E-Class typically covers high mileage and is used predominantly on motorways and A-roads where the improved torque curve has maximum impact on economy. Business users regularly report significant annual fuel savings.' },
      { q: 'Does the 9G-Tronic gearbox respond well after remapping?', a: 'Yes - the 9G-Tronic adapts to the improved power delivery and the overall driving experience becomes more fluid. The gearbox changes up earlier in normal driving, contributing to the MPG improvement.' },
      { q: 'Is the E220d Estate remapped the same as the saloon?', a: 'Yes - the engine ECU is identical across saloon, estate, and coupé variants. All respond identically to remapping.' },
      { q: 'How long does an E220d remap take?', a: 'Approximately 1.5–2 hours including our pre-remap diagnostic check and a verification drive. We carry out the whole process thoroughly - not a rushed job.' },
      { q: 'Do you cover the E220d in all of Devon?', a: 'Yes - mobile remapping is available across Devon including Exeter, Plymouth, Torbay, and all surrounding areas. We also welcome workshop visits at our Totnes base.' },
    ],
    relatedSlugs: ['mercedes-c220-remap', 'bmw-520d-remap', 'audi-a6-remap'],
    category: 'economy', fuelType: 'diesel',
  },

  // ── FORD ──────────────────────────────────────────────────────────────────

  {
    slug: 'ford-transit-remap',
    make: 'Ford', model: 'Transit', fullName: 'Ford Transit',
    metaTitle: 'Ford Transit Remap | Commercial Van Tuning Devon | AutoCleanse',
    metaDescription: 'Ford Transit ECU remapping - improve power, torque and MPG for your Transit van. Commercial remapping in Devon by AutoCleanse.',
    h1: 'Ford Transit Remap',
    intro: 'The Ford Transit is the backbone of British trade, and the 2.0 EcoBlue and older 2.2 TDCi engines respond brilliantly to ECU remapping. A Stage 1 remap adds significant torque, making the Transit much more capable when fully loaded, while also improving real-world MPG by up to 15%. AutoCleanse offers Transit remapping from our Totnes workshop and via mobile across Devon.',
    engineOptions: [
      { name: '2.0 EcoBlue 130', stockPower: '130bhp', remapPower: '180bhp', stockTorque: '385Nm', remapTorque: '450Nm', mpgGain: 'up to 15%' },
      { name: '2.0 EcoBlue 170', stockPower: '170bhp', remapPower: '210bhp', stockTorque: '405Nm', remapTorque: '480Nm', mpgGain: 'up to 12%' },
      { name: '2.2 TDCi 125', stockPower: '125bhp', remapPower: '160bhp', stockTorque: '350Nm', remapTorque: '420Nm', mpgGain: 'up to 15%' },
    ],
    faqs: [
      { q: 'Will remapping improve my Transit\'s fuel economy?', a: 'Yes - the improved torque allows the engine to pull heavier loads with less effort, reducing the need for downshifting. Most drivers see 10-15% improvements in real-world MPG.' },
      { q: 'Is it safe to remap a fully loaded working Transit?', a: 'Yes, a Stage 1 remap is designed to be safe and reliable for daily use. It provides extra torque precisely when you need it for heavy loads or towing without over-stressing the engine components.' },
      { q: 'Can you remap both FWD and RWD Transits?', a: 'Yes, the ECU remap applies equally well to both Front-Wheel Drive and Rear-Wheel Drive Transits.' },
      { q: 'Do you offer mobile remapping at our depot?', a: 'Absolutely. We offer a fully mobile service across Devon and can remap your Transit at your depot or yard to minimize downtime.' },
      { q: 'Do you offer fleet discounts?', a: 'Yes, we provide competitive rates for businesses remapping multiple Transits or other fleet vehicles. Contact us to discuss your requirements.' }
    ],
    relatedSlugs: ['ford-transit-custom-remap', 'vw-transporter-remap', 'mercedes-sprinter-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  {
    slug: 'ford-transit-custom-remap',
    make: 'Ford', model: 'Transit Custom', fullName: 'Ford Transit Custom',
    metaTitle: 'Ford Transit Custom Remap | Van Tuning Devon | AutoCleanse',
    metaDescription: 'Ford Transit Custom ECU remapping - boost power, torque and MPG. Expert van tuning in Devon by AutoCleanse.',
    h1: 'Ford Transit Custom Remap',
    intro: 'The Ford Transit Custom is the UK\'s best-selling commercial vehicle. The 2.0 EcoBlue engines are heavily restricted from the factory to create different power outputs. This means the lower output models (like the 105bhp and 130bhp) have massive headroom and can see transformative gains from a Stage 1 remap. AutoCleanse provides Transit Custom remapping across Devon.',
    engineOptions: [
      { name: '2.0 EcoBlue 105', stockPower: '105bhp', remapPower: '180bhp', stockTorque: '360Nm', remapTorque: '440Nm', mpgGain: 'up to 18%' },
      { name: '2.0 EcoBlue 130', stockPower: '130bhp', remapPower: '180bhp', stockTorque: '385Nm', remapTorque: '450Nm', mpgGain: 'up to 15%' },
      { name: '2.0 EcoBlue 170', stockPower: '170bhp', remapPower: '210bhp', stockTorque: '405Nm', remapTorque: '480Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Can the 105bhp Transit Custom really reach 180bhp?', a: 'Yes, because the 105bhp, 130bhp, and 170bhp EcoBlue engines are mechanically identical. The lower outputs are purely software-restricted by Ford. A remap removes these limits.' },
      { q: 'Will a remap affect the reliability of my Transit Custom?', a: 'No, because we are simply unlocking the performance the engine was designed to handle safely. A Stage 1 tune keeps everything well within safe limits.' },
      { q: 'Does remapping affect the MOT emissions test?', a: 'No, a Stage 1 remap maintains all factory emissions equipment (like the DPF) and will pass a standard MOT without issue.' },
      { q: 'Is it worth remapping the 170bhp model?', a: 'Yes, while the jump isn\'t as large as the 105bhp model, taking it to 210bhp adds significant torque that makes overtaking and towing much more effortless.' },
      { q: 'Do you offer mobile remapping for Transit Customs?', a: 'Yes, our mobile service covers all of Devon, meaning we can tune your van at your home or workplace.' }
    ],
    relatedSlugs: ['ford-transit-remap', 'vw-transporter-remap', 'vauxhall-vivaro-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  {
    slug: 'ford-ranger-remap',
    make: 'Ford', model: 'Ranger', fullName: 'Ford Ranger',
    metaTitle: 'Ford Ranger Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Ford Ranger ECU remapping - gain up to +50bhp and improved torque for towing. 4x4 tuning in Devon from our Totnes workshop or mobile.',
    h1: 'Ford Ranger Remap',
    intro: 'The Ford Ranger is Europe\'s most popular pickup truck. Whether you have the 2.2 TDCi, the 3.2 TDCi five-cylinder, or the newer 2.0 EcoBlue, a Stage 1 remap dramatically improves towing performance and overall drivability. The extra torque transforms how the Ranger handles heavy loads and inclines. AutoCleanse remaps Rangers across Devon.',
    engineOptions: [
      { name: '2.0 EcoBlue 213 (Bi-Turbo)', stockPower: '213bhp', remapPower: '250bhp', stockTorque: '500Nm', remapTorque: '580Nm', mpgGain: 'up to 10%' },
      { name: '3.2 TDCi 200', stockPower: '200bhp', remapPower: '240bhp', stockTorque: '470Nm', remapTorque: '550Nm', mpgGain: 'up to 12%' },
      { name: '2.2 TDCi 150', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '375Nm', remapTorque: '450Nm', mpgGain: 'up to 14%' },
    ],
    faqs: [
      { q: 'Does remapping a Ford Ranger improve towing?', a: 'Significantly. The increased torque means the engine doesn\'t have to work as hard when pulling heavy loads, making towing smoother and more relaxed.' },
      { q: 'Is the 3.2 TDCi a good engine to remap?', a: 'Yes, the five-cylinder 3.2 TDCi responds very well to remapping, producing a noticeable surge in low-down torque that suits the character of the Ranger perfectly.' },
      { q: 'Will remapping improve the fuel economy of my Ranger?', a: 'Yes, particularly on longer runs and when cruising. By not having to push the engine as hard, drivers often see a 10-12% improvement in MPG.' },
      { q: 'Can you remap the newer 2.0 Bi-Turbo Rangers?', a: 'Yes, the newer 2.0 EcoBlue Bi-Turbo engines remap exceptionally well, pushing power to around 250bhp and making the truck much more responsive.' },
      { q: 'Do you provide mobile remapping for the Ranger in Devon?', a: 'Yes, we can travel to your home or workplace anywhere in Devon to carry out the remap.' }
    ],
    relatedSlugs: ['vw-amarok-remap', 'ford-transit-custom-remap', 'nissan-navara-remap'],
    category: 'mixed', fuelType: 'diesel'
  },

  {
    slug: 'ford-fiesta-st-remap',
    make: 'Ford', model: 'Fiesta ST', fullName: 'Ford Fiesta ST',
    metaTitle: 'Ford Fiesta ST Remap | Stage 1 Performance Tuning Devon',
    metaDescription: 'Ford Fiesta ST ECU remapping - unlock more power from the 1.5T or 1.6T EcoBoost. Expert performance tuning in Devon by AutoCleanse.',
    h1: 'Ford Fiesta ST Remap',
    intro: 'The Ford Fiesta ST is widely regarded as one of the best handling hot hatches of all time. Whether you have the Mk7 1.6 EcoBoost or the Mk8 1.5 EcoBoost 3-cylinder, a Stage 1 remap elevates the performance to match the chassis, making the ST an absolute giant-killer on twisty roads. AutoCleanse offers Fiesta ST remapping in Devon.',
    engineOptions: [
      { name: '1.5T EcoBoost 200 (Mk8)', stockPower: '200bhp', remapPower: '235bhp', stockTorque: '290Nm', remapTorque: '350Nm' },
      { name: '1.6T EcoBoost 182 (Mk7)', stockPower: '182bhp', remapPower: '215bhp', stockTorque: '240Nm', remapTorque: '320Nm' },
    ],
    faqs: [
      { q: 'How much power does a Stage 1 remap add to a Fiesta ST?', a: 'The Mk8 1.5T gains around 35bhp and 60Nm of torque, while the Mk7 1.6T gains around 33bhp and 80Nm. In a light car like the Fiesta, this transforms the acceleration.' },
      { q: 'Do I need any hardware modifications for Stage 1?', a: 'No, Stage 1 is designed to work safely with all standard factory components. No intake or exhaust upgrades are necessary.' },
      { q: 'Is the Mk8 3-cylinder engine safe to remap?', a: 'Yes, the 1.5 EcoBoost is a very robust engine that handles Stage 1 power comfortably. It retains its characterful sound while pulling much harder through the rev range.' },
      { q: 'Will remapping affect the ST\'s driving modes?', a: 'The remap works in harmony with the factory driving modes (Normal, Sport, Track), providing enhanced performance across the board.' },
      { q: 'Can you remap my Fiesta ST at your Totnes workshop?', a: 'Yes, we recommend a workshop visit for performance vehicles, allowing for a thorough pre- and post-remap diagnostic and test drive.' }
    ],
    relatedSlugs: ['ford-focus-st-remap', 'vw-golf-gti-remap', 'audi-s3-remap'],
    category: 'performance', fuelType: 'petrol'
  },

  {
    slug: 'ford-focus-st-remap',
    make: 'Ford', model: 'Focus ST', fullName: 'Ford Focus ST',
    metaTitle: 'Ford Focus ST Remap | Stage 1 Performance Tuning Devon',
    metaDescription: 'Ford Focus ST ECU remapping - gain up to +50bhp from the 2.3 EcoBoost or 2.0 EcoBoost. Expert performance tuning in Devon.',
    h1: 'Ford Focus ST Remap',
    intro: 'The Ford Focus ST offers fantastic performance and practicality. The Mk4\'s 2.3 EcoBoost (shared with the Mustang and Focus RS) has massive tuning potential, and the Mk3\'s 2.0 EcoBoost responds excellently too. A Stage 1 remap unleashes the true potential of the engine, delivering relentless acceleration. AutoCleanse provides Focus ST tuning in Devon.',
    engineOptions: [
      { name: '2.3 EcoBoost 280 (Mk4)', stockPower: '280bhp', remapPower: '330bhp', stockTorque: '420Nm', remapTorque: '510Nm' },
      { name: '2.0 EcoBoost 250 (Mk3)', stockPower: '250bhp', remapPower: '285bhp', stockTorque: '360Nm', remapTorque: '440Nm' },
      { name: '2.0 TDCi 185 (Mk3 Diesel)', stockPower: '185bhp', remapPower: '220bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'What does a Stage 1 remap do for the Mk4 Focus ST 2.3?', a: 'The 2.3 EcoBoost typically reaches 330bhp and 510Nm of torque at Stage 1. This turns the Focus ST into a seriously fast car that can rival much more expensive machinery.' },
      { q: 'Can you remap the Focus ST diesel?', a: 'Yes, the 2.0 TDCi ST responds beautifully to a remap, reaching around 220bhp and offering huge mid-range torque along with improved fuel economy.' },
      { q: 'Is torque steer an issue after remapping an ST?', a: 'The Focus ST\'s electronic limited-slip differential (eLSD) handles the extra power very well, ensuring the power is put down effectively without excessive torque steer.' },
      { q: 'Is it safe to push the 2.3 EcoBoost to 330bhp without mods?', a: 'Yes, the 2.3 engine is heavily engineered (used in the 350bhp Focus RS) and handles 330bhp at Stage 1 very comfortably.' },
      { q: 'Do you offer mobile remapping for the Focus ST?', a: 'Yes, we cover all of Devon and can remap your Focus ST at your home or workplace.' }
    ],
    relatedSlugs: ['ford-fiesta-st-remap', 'vw-golf-gti-remap', 'vw-golf-r-remap'],
    category: 'performance', fuelType: 'both'
  },

  {
    slug: 'ford-kuga-remap',
    make: 'Ford', model: 'Kuga', fullName: 'Ford Kuga',
    metaTitle: 'Ford Kuga Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'Ford Kuga ECU remapping - Stage 1 diesel remaps for improved towing, torque and MPG. Workshop in Totnes or mobile across Devon.',
    h1: 'Ford Kuga Remap',
    intro: 'The Ford Kuga is a popular family SUV that benefits greatly from ECU remapping, especially the TDCi and EcoBlue diesel models which are frequently used for towing caravans or long journeys. A Stage 1 remap improves power, sharpens responsiveness, and reduces fuel consumption. AutoCleanse offers Kuga remapping in Devon.',
    engineOptions: [
      { name: '2.0 TDCi 150', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '370Nm', remapTorque: '440Nm', mpgGain: 'up to 14%' },
      { name: '2.0 TDCi 180', stockPower: '180bhp', remapPower: '210bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 EcoBlue 190', stockPower: '190bhp', remapPower: '225bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Does a remap help the Kuga tow better?', a: 'Yes, the additional 60-70Nm of torque is a game-changer for towing, allowing the Kuga to handle inclines and heavy loads with much less effort and fewer gear changes.' },
      { q: 'Will a remap improve my Kuga\'s MPG?', a: 'Yes, particularly on motorway journeys or when cruising. By not having to work the engine as hard, you can expect real-world MPG improvements of 10-14%.' },
      { q: 'Is the remap safe for the Kuga\'s automatic gearbox?', a: 'Yes, whether you have the manual or the Powershift/automatic gearbox, a Stage 1 tune operates well within the safe torque limits of the transmission.' },
      { q: 'Can the 150bhp Kuga be mapped to the 180bhp spec?', a: 'Yes, and then some. Because the engines are very similar, the 150bhp model can safely be tuned up to 190bhp, offering huge value for money.' },
      { q: 'Do you offer mobile Kuga remapping in Devon?', a: 'Yes, we can perform the remap at your location anywhere in Devon.' }
    ],
    relatedSlugs: ['vw-tiguan-remap', 'ford-focus-st-remap', 'audi-q5-remap'],
    category: 'economy', fuelType: 'diesel'
  },

  {
    slug: 'ford-mondeo-remap',
    make: 'Ford', model: 'Mondeo', fullName: 'Ford Mondeo',
    metaTitle: 'Ford Mondeo Remap | Stage 1 ECU Tuning Devon | AutoCleanse',
    metaDescription: 'Ford Mondeo ECU remapping - Stage 1 diesel remap for more power and better MPG. Workshop in Totnes or mobile across Devon.',
    h1: 'Ford Mondeo Remap',
    intro: 'The Ford Mondeo has long been the vehicle of choice for high-mileage drivers and families. The 2.0 TDCi engines are reliable and respond very well to ECU remapping. A Stage 1 tune provides a stronger surge of mid-range torque, making motorway overtakes effortless while simultaneously improving fuel economy. AutoCleanse remaps Mondeos across Devon.',
    engineOptions: [
      { name: '2.0 TDCi 150', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '350Nm', remapTorque: '420Nm', mpgGain: 'up to 15%' },
      { name: '2.0 TDCi 180', stockPower: '180bhp', remapPower: '210bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 EcoBlue 190', stockPower: '190bhp', remapPower: '225bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Is the Mondeo a good car for an economy remap?', a: 'Excellent. Because it spends a lot of time on A-roads and motorways, the improved torque curve from a remap allows the engine to sit in a higher gear comfortably, improving MPG by up to 15%.' },
      { q: 'What performance gains can I expect on the 2.0 TDCi 150?', a: 'You can expect an increase of around 40bhp and 70Nm of torque, bringing it to roughly 190bhp. This makes the car feel significantly lighter and more responsive.' },
      { q: 'Does remapping affect the Mondeo\'s reliability?', a: 'Not at all. The 2.0 TDCi is a robust engine, and a Stage 1 tune stays well within the factory safety limits.' },
      { q: 'Can you remap a Mondeo Estate?', a: 'Yes, the ECU remap is identical for the Estate and the Hatchback models.' },
      { q: 'Can my company car Mondeo be remapped?', a: 'Yes, the remap is undetectable during standard servicing. However, you should always check your company\'s vehicle policy regarding modifications.' }
    ],
    relatedSlugs: ['vw-passat-remap', 'ford-focus-st-remap', 'ford-kuga-remap'],
    category: 'economy', fuelType: 'diesel'
  },

  // ── LAND ROVER / RANGE ROVER ──────────────────────────────────────────────

  {
    slug: 'range-rover-sport-remap',
    make: 'Land Rover', model: 'Range Rover Sport', fullName: 'Range Rover Sport',
    metaTitle: 'Range Rover Sport Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Range Rover Sport ECU remapping - unlock massive torque and better MPG from the TDV6/SDV6. Expert 4x4 tuning in Devon.',
    h1: 'Range Rover Sport Remap',
    intro: 'The Range Rover Sport combines luxury with serious capability. Its heavy chassis means the factory engines, especially the 3.0 SDV6, can feel a little restricted. A Stage 1 remap liberates a huge amount of mid-range torque, transforming how it accelerates, overtakes, and tows, while also improving fuel economy on long journeys. AutoCleanse offers mobile and workshop remapping in Devon.',
    engineOptions: [
      { name: '3.0 SDV6 292', stockPower: '292bhp', remapPower: '330bhp', stockTorque: '600Nm', remapTorque: '680Nm', mpgGain: 'up to 10%' },
      { name: '3.0 SDV6 306', stockPower: '306bhp', remapPower: '345bhp', stockTorque: '700Nm', remapTorque: '780Nm', mpgGain: 'up to 10%' },
      { name: '4.4 SDV8 339', stockPower: '339bhp', remapPower: '390bhp', stockTorque: '740Nm', remapTorque: '840Nm', mpgGain: 'up to 8%' },
    ],
    faqs: [
      { q: 'Will a remap reduce the turbo lag on my Range Rover Sport?', a: 'Yes, absolutely. By optimizing the torque delivery and throttle response, the initial lag is significantly reduced, making the car feel much more eager off the line and out of junctions.' },
      { q: 'Is it safe to add 80Nm of torque to the SDV6?', a: 'Yes. The ZF 8-speed automatic gearbox used in the Range Rover Sport is incredibly strong and handles the Stage 1 torque limits with ease.' },
      { q: 'Can a remap improve fuel economy on a heavy 4x4?', a: 'Yes. Because the engine doesn\'t have to work as hard to move the vehicle\'s weight, especially at cruising speeds, drivers often see a 10% improvement in MPG.' },
      { q: 'Does this affect the Terrain Response system?', a: 'No, all off-road modes function perfectly. In fact, the additional low-down torque often makes off-road driving and towing even easier.' },
      { q: 'Can you remap my Range Rover Sport at my house?', a: 'Yes, we provide a mobile remapping service across Devon, meaning you don\'t need to bring the car to a workshop.' }
    ],
    relatedSlugs: ['land-rover-discovery-remap', 'range-rover-vogue-remap', 'bmw-x5-remap'],
    category: 'mixed', fuelType: 'diesel'
  },

  {
    slug: 'range-rover-evoque-remap',
    make: 'Land Rover', model: 'Range Rover Evoque', fullName: 'Range Rover Evoque',
    metaTitle: 'Range Rover Evoque Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Range Rover Evoque ECU remapping - more power, sharper response, and better MPG for the 2.0 TD4 and 2.2 SD4. Devon tuning specialists.',
    h1: 'Range Rover Evoque Remap',
    intro: 'The Range Rover Evoque is stylish and capable, but the heavy body can make the 2.0 and 2.2 diesel engines feel sluggish. A Stage 1 ECU remap from AutoCleanse transforms the Evoque, delivering a surge of low-down torque that makes the car feel much lighter, sharper, and more effortless to drive, while improving MPG.',
    engineOptions: [
      { name: '2.0 TD4/eD4 150 (Ingenium)', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '380Nm', remapTorque: '450Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TD4 180 (Ingenium)', stockPower: '180bhp', remapPower: '215bhp', stockTorque: '430Nm', remapTorque: '490Nm', mpgGain: 'up to 12%' },
      { name: '2.2 SD4 190 (Older Gen)', stockPower: '190bhp', remapPower: '225bhp', stockTorque: '420Nm', remapTorque: '480Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Why does my Evoque feel sluggish, and will a remap help?', a: 'The Evoque is a heavy vehicle for its engine size. The remap increases mid-range torque, which completely changes the power-to-weight dynamic, making the car feel much lighter and faster.' },
      { q: 'Will a remap fix the slow automatic gearbox changes?', a: 'The remap dramatically improves engine response and torque. Because there is more power available, the gearbox doesn\'t need to hunt for gears as often, making the driving experience much smoother.' },
      { q: 'Is the 2.0 Ingenium engine safe to remap?', a: 'Yes, the Ingenium engines have a lot of restricted headroom. A Stage 1 remap keeps the engine safely within its mechanical limits.' },
      { q: 'Can I get better fuel economy?', a: 'Yes, the extra torque allows you to reach cruising speeds quicker and hold higher gears on inclines, usually resulting in a 10-12% MPG gain.' },
      { q: 'Do you offer mobile remapping for the Evoque?', a: 'Yes, we cover the whole of Devon and can map the vehicle at your home or workplace.' }
    ],
    relatedSlugs: ['range-rover-velar-remap', 'range-rover-sport-remap', 'ford-kuga-remap'],
    category: 'mixed', fuelType: 'diesel'
  },

  {
    slug: 'range-rover-velar-remap',
    make: 'Land Rover', model: 'Range Rover Velar', fullName: 'Range Rover Velar',
    metaTitle: 'Range Rover Velar Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Range Rover Velar ECU remapping - unleash the true performance of the 2.0 or 3.0 diesel engines. Workshop or mobile tuning in Devon.',
    h1: 'Range Rover Velar Remap',
    intro: 'The Range Rover Velar is one of the most stunning SUVs on the road, but the factory engine mapping is heavily tuned for emissions over drivability. A Stage 1 ECU remap removes the frustrating turbo lag and sluggishness, replacing it with smooth, relentless torque that matches the Velar\'s premium feel. AutoCleanse maps Velars across Devon.',
    engineOptions: [
      { name: '2.0 D180', stockPower: '180bhp', remapPower: '215bhp', stockTorque: '430Nm', remapTorque: '490Nm', mpgGain: 'up to 12%' },
      { name: '2.0 D240 (Bi-Turbo)', stockPower: '240bhp', remapPower: '280bhp', stockTorque: '500Nm', remapTorque: '560Nm', mpgGain: 'up to 10%' },
      { name: '3.0 D300', stockPower: '300bhp', remapPower: '345bhp', stockTorque: '700Nm', remapTorque: '780Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Does remapping the Velar invalidate the warranty?', a: 'If your Velar is still under the Land Rover warranty, an ECU remap could affect powertrain claims. Many owners wait until the warranty has expired, while others feel the performance gain is worth it immediately.' },
      { q: 'Will the remap fix the delay when I press the accelerator?', a: 'Yes, the factory map suffers from significant throttle delay and turbo lag. Our remap sharpens the throttle response and brings the torque in much earlier.' },
      { q: 'Is the 2.0 D180 engine powerful enough once remapped?', a: 'Yes, gaining around 35bhp and 60Nm of torque transforms the D180, making it feel much closer to the D240 in daily driving scenarios.' },
      { q: 'Can you remap the 3.0 D300 V6?', a: 'Yes, the D300 responds incredibly well, gaining huge torque (up to 780Nm), making the Velar feel effortlessly fast.' },
      { q: 'Do you offer a mobile service for the Velar?', a: 'Yes, we provide fully mobile remapping throughout Devon.' }
    ],
    relatedSlugs: ['range-rover-sport-remap', 'range-rover-evoque-remap', 'land-rover-discovery-remap'],
    category: 'mixed', fuelType: 'diesel'
  },

  {
    slug: 'land-rover-discovery-remap',
    make: 'Land Rover', model: 'Discovery', fullName: 'Land Rover Discovery',
    metaTitle: 'Land Rover Discovery Remap | 4x4 Tuning Devon | AutoCleanse',
    metaDescription: 'Land Rover Discovery ECU remapping - gain huge torque for towing and better MPG on the Discovery 4 and 5. Devon 4x4 tuning.',
    h1: 'Land Rover Discovery Remap',
    intro: 'The Land Rover Discovery (both 4 and 5) is the ultimate family workhorse and tow vehicle. However, weighing nearly 2.5 tonnes, the SDV6 and TDV6 engines need all the help they can get. A Stage 1 ECU remap delivers exactly what the Discovery needs: massive low-down torque. This transforms towing, improves MPG, and makes overtaking much safer.',
    engineOptions: [
      { name: '3.0 SDV6 255 (Discovery 4)', stockPower: '255bhp', remapPower: '300bhp', stockTorque: '600Nm', remapTorque: '680Nm', mpgGain: 'up to 12%' },
      { name: '3.0 SDV6 306 (Discovery 5)', stockPower: '306bhp', remapPower: '345bhp', stockTorque: '700Nm', remapTorque: '780Nm', mpgGain: 'up to 10%' },
      { name: '2.0 SD4 240 (Discovery 5)', stockPower: '240bhp', remapPower: '280bhp', stockTorque: '500Nm', remapTorque: '560Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Is a remap worth it for towing a large caravan?', a: 'Absolutely. The Discovery is already a great tow car, but the extra 80Nm of torque means the engine isn\'t straining on hills, the gearbox doesn\'t constantly shift down, and the whole experience is much more relaxed.' },
      { q: 'Will remapping improve my Discovery 4\'s fuel economy?', a: 'Yes, the Discovery 4 is heavy and thirsty. The added torque allows the car to reach cruising speeds with less throttle input, regularly improving MPG by 10-12%.' },
      { q: 'Are there any risks to the air suspension or 4x4 systems?', a: 'No, the ECU remap solely focuses on the engine management. The air suspension, Terrain Response, and braking systems are completely unaffected and work exactly as factory.' },
      { q: 'Is the 2.0 SD4 powerful enough for the Discovery 5?', a: 'From the factory it can feel a bit strained under full load. A Stage 1 remap taking it to 280bhp and 560Nm transforms the car, giving it the grunt it desperately needs.' },
      { q: 'Can you come to my location to remap my Discovery?', a: 'Yes, our mobile tuning van covers the entirety of Devon.' }
    ],
    relatedSlugs: ['range-rover-sport-remap', 'land-rover-defender-remap', 'vw-amarok-remap'],
    category: 'mixed', fuelType: 'diesel'
  },

  {
    slug: 'land-rover-defender-remap',
    make: 'Land Rover', model: 'Defender', fullName: 'Land Rover Defender',
    metaTitle: 'Land Rover Defender Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Land Rover Defender ECU remapping - classic Puma and new generation Defender tuning. Improve torque and towing. Devon tuning specialists.',
    h1: 'Land Rover Defender Remap',
    intro: 'Whether you drive a classic Defender TDCi (Puma) or the brand new L663 generation, ECU remapping completely changes the driving dynamic. For classic models, it removes the dreadful sluggishness and makes modern traffic manageable. For the new generation, it unlocks serious performance and towing capability that rivals the very best SUVs. AutoCleanse provides Defender mapping in Devon.',
    engineOptions: [
      { name: '2.4/2.2 TDCi Puma (Classic)', stockPower: '122bhp', remapPower: '160bhp', stockTorque: '360Nm', remapTorque: '430Nm', mpgGain: 'up to 10%' },
      { name: '2.0 D200 (New Gen)', stockPower: '200bhp', remapPower: '240bhp', stockTorque: '430Nm', remapTorque: '500Nm', mpgGain: 'up to 10%' },
      { name: '3.0 D250 (New Gen)', stockPower: '250bhp', remapPower: '310bhp', stockTorque: '570Nm', remapTorque: '650Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Does remapping a classic Puma Defender make a big difference?', a: 'It is arguably the best modification you can do to a Puma Defender. Taking it from 122bhp to 160bhp completely removes the sluggishness, making it much safer to pull out of junctions and overtake on country lanes.' },
      { q: 'Will a remap affect my classic Defender\'s reliability?', a: 'No, the 2.4 and 2.2 Ford Transit-derived engines are very strong. A Stage 1 map is highly reliable and simply makes the Defender drive the way it should have from the factory.' },
      { q: 'Can you remap the new generation D250 engine?', a: 'Yes, the D250 is essentially a detuned version of the D300. A remap unlocks the software restrictions, giving you massive performance gains (up to 310bhp) safely.' },
      { q: 'Will a remap help my Defender off-road?', a: 'Yes, the increased low-end torque is highly beneficial off-road, allowing you to crawl over obstacles with less throttle input and greater control.' },
      { q: 'Do you offer mobile Defender tuning?', a: 'Yes, we offer fully mobile remapping for all Defender models across Devon.' }
    ],
    relatedSlugs: ['land-rover-discovery-remap', 'ford-ranger-remap', 'range-rover-sport-remap'],
    category: 'mixed', fuelType: 'diesel'
  },

  {
    slug: 'range-rover-vogue-remap',
    make: 'Land Rover', model: 'Range Rover Vogue', fullName: 'Range Rover Vogue',
    metaTitle: 'Range Rover Vogue Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Range Rover Vogue ECU remapping - unlock more power and better MPG from the SDV8 and SDV6. Luxury 4x4 tuning in Devon.',
    h1: 'Range Rover Vogue Remap',
    intro: 'The full-size Range Rover (Vogue/Autobiography) is the pinnacle of luxury, but dragging over 2.5 tonnes around takes its toll on fuel economy and responsiveness. A Stage 1 ECU remap enhances the effortless nature of the car. By boosting torque by up to 100Nm, the engine doesn\'t have to work as hard, resulting in a smoother drive, faster overtakes, and better MPG. AutoCleanse offers mobile mapping across Devon.',
    engineOptions: [
      { name: '3.0 TDV6/SDV6 258', stockPower: '258bhp', remapPower: '310bhp', stockTorque: '600Nm', remapTorque: '680Nm', mpgGain: 'up to 10%' },
      { name: '4.4 SDV8 339', stockPower: '339bhp', remapPower: '390bhp', stockTorque: '740Nm', remapTorque: '840Nm', mpgGain: 'up to 8%' },
    ],
    faqs: [
      { q: 'Does remapping a Range Rover Vogue make it less smooth?', a: 'The opposite. A remap provides more torque earlier in the rev range, meaning the 8-speed gearbox doesn\'t need to kick down as often. The car feels more effortless and luxurious.' },
      { q: 'How much torque can the 4.4 SDV8 gain?', a: 'The SDV8 is an absolute powerhouse and can reach an immense 840Nm of torque at Stage 1. This makes the Vogue feel incredibly light and fast.' },
      { q: 'Will a remap improve my fuel economy?', a: 'Yes, especially on A-roads and motorways. The extra torque means the engine requires less effort to maintain speed, often yielding an 8-10% MPG gain.' },
      { q: 'Is it safe for the gearbox?', a: 'Yes, the ZF automatic transmissions used in the Range Rover are rated for massive torque outputs and handle the Stage 1 gains effortlessly.' },
      { q: 'Do you offer a home service for the Range Rover?', a: 'Yes, our premium mobile service covers all of Devon, allowing the work to be carried out on your driveway.' }
    ],
    relatedSlugs: ['range-rover-sport-remap', 'land-rover-discovery-remap', 'bmw-x5-remap'],
    category: 'economy', fuelType: 'diesel'
  },

  // ── VAUXHALL / OTHER HIGH VOLUME ──────────────────────────────────────────

  {
    slug: 'vauxhall-vivaro-remap',
    make: 'Vauxhall', model: 'Vivaro', fullName: 'Vauxhall Vivaro',
    metaTitle: 'Vauxhall Vivaro Remap | Van Tuning Devon | AutoCleanse',
    metaDescription: 'Vauxhall Vivaro ECU remapping - gain power, torque and MPG. Commercial van tuning in Devon from AutoCleanse.',
    h1: 'Vauxhall Vivaro Remap',
    intro: 'The Vauxhall Vivaro (and its Renault Trafic / Nissan Primastar siblings) is a ubiquitous site on UK roads. The 1.6 and 2.0 CDTi / BiTurbo engines respond incredibly well to a Stage 1 remap. By unlocking restricted software, the Vivaro gains the torque needed to easily carry heavy loads or tow, while simultaneously returning better MPG. AutoCleanse offers Vivaro remapping in Devon.',
    engineOptions: [
      { name: '1.6 CDTi 120 (BiTurbo)', stockPower: '120bhp', remapPower: '160bhp', stockTorque: '320Nm', remapTorque: '380Nm', mpgGain: 'up to 15%' },
      { name: '2.0 CDTi 115', stockPower: '115bhp', remapPower: '165bhp', stockTorque: '300Nm', remapTorque: '380Nm', mpgGain: 'up to 12%' },
      { name: '1.5 Turbo D 100 (New Gen)', stockPower: '100bhp', remapPower: '130bhp', stockTorque: '270Nm', remapTorque: '320Nm', mpgGain: 'up to 15%' },
    ],
    faqs: [
      { q: 'Can a remap help my Vivaro get better fuel economy?', a: 'Yes, this is the main reason fleet owners remap the Vivaro. By boosting torque, the van doesn\'t have to be driven as hard when fully loaded, typically yielding a 10-15% improvement in MPG.' },
      { q: 'Is the 1.6 BiTurbo engine reliable after remapping?', a: 'Yes, the BiTurbo setup provides excellent airflow, and the engine handles Stage 1 power increases very comfortably while retaining factory reliability.' },
      { q: 'My Vivaro is very sluggish on hills, will this fix it?', a: 'Absolutely. A Stage 1 tune adds up to 80Nm of torque, completely transforming how the van pulls up hills, even with a heavy payload in the back.' },
      { q: 'Can you remap the newer PSA-based Vivaros?', a: 'Yes, we map the newer 1.5 and 2.0 Turbo D engines (shared with Peugeot and Citroen), unlocking significant gains.' },
      { q: 'Do you offer a mobile service for tradesmen?', a: 'Yes, we understand time is money. We can come to your site or yard in Devon and perform the remap with minimal downtime.' }
    ],
    relatedSlugs: ['renault-trafic-remap', 'ford-transit-custom-remap', 'vw-transporter-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  {
    slug: 'vauxhall-astra-remap',
    make: 'Vauxhall', model: 'Astra', fullName: 'Vauxhall Astra',
    metaTitle: 'Vauxhall Astra Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Vauxhall Astra ECU remapping - Stage 1 diesel and petrol remaps for improved performance and MPG. Devon tuning specialists.',
    h1: 'Vauxhall Astra Remap',
    intro: 'The Vauxhall Astra is a staple on British roads. Whether you drive the punchy 1.4 or 1.6 Turbo petrols, or the highly efficient 1.6 and 2.0 CDTi diesels, an ECU remap unlocks the true potential of the engine. A Stage 1 tune provides a sharper throttle, smoother power delivery, and better fuel economy for diesel models. AutoCleanse maps Astras across Devon.',
    engineOptions: [
      { name: '1.6 CDTi 136', stockPower: '136bhp', remapPower: '165bhp', stockTorque: '320Nm', remapTorque: '380Nm', mpgGain: 'up to 15%' },
      { name: '2.0 CDTi 165', stockPower: '165bhp', remapPower: '200bhp', stockTorque: '350Nm', remapTorque: '420Nm', mpgGain: 'up to 12%' },
      { name: '1.4 Turbo 150', stockPower: '150bhp', remapPower: '175bhp', stockTorque: '245Nm', remapTorque: '290Nm' },
    ],
    faqs: [
      { q: 'Is the Astra 1.6 CDTi a good car for an economy remap?', a: 'Yes, it\'s an excellent candidate. The 1.6 CDTi is already efficient, but a Stage 1 tune optimizes it further, often giving an extra 10-15% MPG on long runs.' },
      { q: 'Will a remap make my 1.4 Turbo Astra faster?', a: 'Yes, the 1.4T engine gains a very noticeable bump in mid-range torque, making it feel much punchier when overtaking or joining motorways.' },
      { q: 'Does remapping affect the MOT?', a: 'No, our Stage 1 remaps keep all emissions equipment fully intact and legal, meaning your Astra will pass an MOT as normal.' },
      { q: 'Can you remap the Astra VXR?', a: 'Yes, the Astra VXR responds brilliantly to tuning, with Stage 1 taking the 2.0T engine to around 310bhp.' },
      { q: 'Do you offer mobile remapping for the Astra?', a: 'Yes, we provide fully mobile remapping for all Astra models throughout Devon.' }
    ],
    relatedSlugs: ['vauxhall-corsa-remap', 'ford-focus-st-remap', 'vw-golf-gtd-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'vauxhall-corsa-remap',
    make: 'Vauxhall', model: 'Corsa', fullName: 'Vauxhall Corsa',
    metaTitle: 'Vauxhall Corsa Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Vauxhall Corsa ECU remapping - unleash more power from the VXR or 1.4T. Expert tuning in Devon by AutoCleanse.',
    h1: 'Vauxhall Corsa Remap',
    intro: 'The Vauxhall Corsa, particularly the 1.4 Turbo and the high-performance VXR models, are fantastic platforms for tuning. A Stage 1 ECU remap transforms these lightweight cars, making them significantly faster and more responsive without the need for expensive hardware modifications. AutoCleanse offers Corsa tuning from our Totnes workshop and mobile across Devon.',
    engineOptions: [
      { name: '1.6T VXR 205 (Corsa E)', stockPower: '205bhp', remapPower: '235bhp', stockTorque: '280Nm', remapTorque: '340Nm' },
      { name: '1.4 Turbo 100', stockPower: '100bhp', remapPower: '140bhp', stockTorque: '200Nm', remapTorque: '260Nm', mpgGain: 'up to 5%' },
      { name: '1.3 CDTi 95', stockPower: '95bhp', remapPower: '120bhp', stockTorque: '210Nm', remapTorque: '260Nm', mpgGain: 'up to 15%' },
    ],
    faqs: [
      { q: 'How much power does the Corsa VXR gain at Stage 1?', a: 'The Corsa E VXR typically gains around 30bhp and 60Nm of torque. Because the car is so light, this transforms the acceleration and makes it a serious hot hatch contender.' },
      { q: 'Is the 1.4 Turbo engine worth remapping?', a: 'Absolutely. The 100bhp 1.4T is heavily restricted via software. A remap takes it to around 140bhp, which is a massive 40% power increase.' },
      { q: 'Will remapping my Corsa affect my insurance?', a: 'Yes, you must inform your insurance company of any modifications. We recommend using specialist brokers who often offer good rates for Stage 1 tuned cars.' },
      { q: 'Can you map the diesel Corsa?', a: 'Yes, the 1.3 CDTi responds very well, gaining around 25bhp and offering excellent fuel economy improvements.' },
      { q: 'Can you remap the newer PSA-based Corsa F?', a: 'Yes, we cover the newer 1.2 Turbo engines as well, unlocking great performance gains.' }
    ],
    relatedSlugs: ['vauxhall-astra-remap', 'ford-fiesta-st-remap', 'vw-golf-gti-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'nissan-navara-remap',
    make: 'Nissan', model: 'Navara', fullName: 'Nissan Navara',
    metaTitle: 'Nissan Navara Remap | 4x4 Tuning Devon | AutoCleanse',
    metaDescription: 'Nissan Navara ECU remapping - gain torque, improve towing, and increase MPG. Devon 4x4 tuning specialists.',
    h1: 'Nissan Navara Remap',
    intro: 'The Nissan Navara is a rugged and dependable pickup, but like many commercial 4x4s, the factory tune is conservative. A Stage 1 remap on the 2.3 dCi or the older 2.5 dCi engine unleashes substantial low-end torque. This makes pulling heavy trailers or navigating off-road terrain effortless, while also providing better fuel economy on the road. AutoCleanse tunes Navaras in Devon.',
    engineOptions: [
      { name: '2.3 dCi 190 (NP300 Bi-Turbo)', stockPower: '190bhp', remapPower: '230bhp', stockTorque: '450Nm', remapTorque: '520Nm', mpgGain: 'up to 12%' },
      { name: '2.3 dCi 163 (NP300)', stockPower: '163bhp', remapPower: '200bhp', stockTorque: '425Nm', remapTorque: '480Nm', mpgGain: 'up to 14%' },
      { name: '2.5 dCi 190 (D40)', stockPower: '190bhp', remapPower: '225bhp', stockTorque: '450Nm', remapTorque: '510Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Does a remap help the Navara with towing?', a: 'Yes, this is the main benefit. An extra 70Nm of torque means the engine doesn\'t struggle on inclines when pulling a heavy trailer, making towing much safer and smoother.' },
      { q: 'Will I get better MPG from my Navara?', a: 'Yes, when cruising or towing, the increased torque allows the engine to work at lower RPMs with less effort, typically improving MPG by 10-14%.' },
      { q: 'Is the NP300 2.3 Bi-Turbo safe to tune?', a: 'Yes, the Renault/Nissan 2.3 engine is very strong and handles the Stage 1 power comfortably without compromising long-term reliability.' },
      { q: 'Will the remap cause more black smoke?', a: 'No, a high-quality Stage 1 map maintains correct air-to-fuel ratios and works perfectly with the factory DPF, meaning no smoke.' },
      { q: 'Can you map my Navara at my farm or workplace?', a: 'Yes, we offer a completely mobile service across Devon for your convenience.' }
    ],
    relatedSlugs: ['ford-ranger-remap', 'vw-amarok-remap', 'toyota-hilux-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  {
    slug: 'toyota-hilux-remap',
    make: 'Toyota', model: 'Hilux', fullName: 'Toyota Hilux',
    metaTitle: 'Toyota Hilux Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Toyota Hilux ECU remapping - unlock more power and torque for the legendary 2.4 and 2.8 D-4D engines. Devon 4x4 tuning.',
    h1: 'Toyota Hilux Remap',
    intro: 'The Toyota Hilux is legendary for its indestructibility, but the 2.4 and 2.8 D-4D engines are tuned very conservatively from the factory. A Stage 1 ECU remap wakes the Hilux up, delivering a huge surge of torque that transforms its towing capabilities and makes it far more responsive on the road. AutoCleanse offers Hilux remapping across Devon.',
    engineOptions: [
      { name: '2.8 D-4D 204 (8th Gen)', stockPower: '204bhp', remapPower: '240bhp', stockTorque: '500Nm', remapTorque: '580Nm', mpgGain: 'up to 10%' },
      { name: '2.4 D-4D 150 (8th Gen)', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 12%' },
      { name: '3.0 D-4D 171 (7th Gen)', stockPower: '171bhp', remapPower: '210bhp', stockTorque: '360Nm', remapTorque: '440Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Why is the Hilux so sluggish, and will a remap help?', a: 'Toyota tunes the Hilux for global reliability, often running them far below their potential. A Stage 1 remap safely unlocks this power, making the truck feel much more eager and responsive.' },
      { q: 'Is it safe to remap the new 2.8 D-4D engine?', a: 'Yes, the 2.8 engine is fantastic and responds brilliantly to tuning, reaching 240bhp and massive torque while remaining completely reliable.' },
      { q: 'Will remapping improve the Hilux\'s towing?', a: 'Significantly. Gaining 70-80Nm of torque means the Hilux can pull heavy trailers up hills without constantly dropping gears.' },
      { q: 'Does a remap affect the legendary Toyota reliability?', a: 'Our Stage 1 remaps are designed to stay well within the factory safety limits of the engine and drivetrain, ensuring it remains as dependable as ever.' },
      { q: 'Do you offer mobile tuning for the Hilux?', a: 'Yes, we provide mobile remapping across the whole of Devon.' }
    ],
    relatedSlugs: ['ford-ranger-remap', 'nissan-navara-remap', 'vw-amarok-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  {
    slug: 'peugeot-boxer-remap',
    make: 'Peugeot', model: 'Boxer', fullName: 'Peugeot Boxer',
    metaTitle: 'Peugeot Boxer Remap | Motorhome & Van Tuning Devon',
    metaDescription: 'Peugeot Boxer ECU remapping - gain torque and MPG. Perfect for vans and motorhomes. Expert tuning in Devon by AutoCleanse.',
    h1: 'Peugeot Boxer Remap',
    intro: 'The Peugeot Boxer (along with its Fiat Ducato and Citroen Relay siblings) is a staple for both tradespeople and the motorhome industry. The 2.0 and 2.2 BlueHDi engines are reliable but often struggle when heavily loaded or built into a large motorhome. A Stage 1 ECU remap delivers the low-end torque needed to pull effortlessly, while also improving fuel economy. AutoCleanse tunes Boxers across Devon.',
    engineOptions: [
      { name: '2.0 BlueHDi 130', stockPower: '130bhp', remapPower: '170bhp', stockTorque: '350Nm', remapTorque: '420Nm', mpgGain: 'up to 15%' },
      { name: '2.2 BlueHDi 140', stockPower: '140bhp', remapPower: '180bhp', stockTorque: '340Nm', remapTorque: '410Nm', mpgGain: 'up to 15%' },
      { name: '2.2 HDi 130 (Older Gen)', stockPower: '130bhp', remapPower: '165bhp', stockTorque: '320Nm', remapTorque: '390Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Is remapping a Peugeot Boxer motorhome a good idea?', a: 'Yes, it\'s highly recommended. Motorhomes are permanently heavy. A remap adds the necessary torque to pull that weight up hills without constantly dropping down to 3rd or 4th gear.' },
      { q: 'Will I save fuel by remapping my Boxer van?', a: 'Yes. Because the engine produces more torque lower down the rev range, you can carry loads with less throttle input, improving MPG by up to 15%.' },
      { q: 'Is the 2.0 BlueHDi engine safe to remap?', a: 'Yes, the BlueHDi engines handle Stage 1 power comfortably. The remap works perfectly alongside the factory AdBlue and DPF systems.' },
      { q: 'Can you remap the Fiat Ducato and Citroen Relay too?', a: 'Yes, the Boxer, Ducato, and Relay share the same platform and engines. We remap all of them with equally great results.' },
      { q: 'Can you come to my campsite or storage yard to remap it?', a: 'Yes, we provide a fully mobile service across Devon, ideal for motorhomes and working vans.' }
    ],
    relatedSlugs: ['ford-transit-remap', 'vw-transporter-remap', 'mercedes-sprinter-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  {
    slug: 'renault-trafic-remap',
    make: 'Renault', model: 'Trafic', fullName: 'Renault Trafic',
    metaTitle: 'Renault Trafic Remap | Van Tuning Devon | AutoCleanse',
    metaDescription: 'Renault Trafic ECU remapping - gain power, torque and MPG. Commercial van tuning in Devon from AutoCleanse.',
    h1: 'Renault Trafic Remap',
    intro: 'The Renault Trafic is a brilliant mid-sized van, sharing its platform with the Vauxhall Vivaro. The 1.6 and 2.0 dCi engines are highly capable, and a Stage 1 ECU remap unlocks their true potential. Delivering up to 40% more power on restricted models, a remap transforms the Trafic into a punchy, effortless workhorse while simultaneously improving MPG. AutoCleanse maps Trafics across Devon.',
    engineOptions: [
      { name: '1.6 dCi 120 (BiTurbo)', stockPower: '120bhp', remapPower: '160bhp', stockTorque: '320Nm', remapTorque: '380Nm', mpgGain: 'up to 15%' },
      { name: '2.0 dCi 130', stockPower: '130bhp', remapPower: '170bhp', stockTorque: '330Nm', remapTorque: '400Nm', mpgGain: 'up to 14%' },
      { name: '2.0 dCi 115 (Older Gen)', stockPower: '115bhp', remapPower: '165bhp', stockTorque: '300Nm', remapTorque: '380Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Does remapping the Renault Trafic improve fuel economy?', a: 'Yes, fleet owners frequently report 10-15% improvements in MPG. The extra torque means the van is less stressed when carrying loads, leading to better efficiency.' },
      { q: 'Is the 1.6 BiTurbo engine reliable tuned?', a: 'Yes, the BiTurbo engine is very robust and responds exceptionally well to tuning, providing a very smooth, factory-like power delivery.' },
      { q: 'Why is my Trafic so slow, and will this fix it?', a: 'Many Trafic models are software-restricted by Renault for insurance and tax reasons. A remap safely removes these limits, giving you the power the engine is capable of.' },
      { q: 'Can you map both the panel van and passenger crew cab models?', a: 'Yes, the ECU tuning process is exactly the same regardless of the body style.' },
      { q: 'Do you offer mobile tuning for the Trafic?', a: 'Yes, our mobile remapping service covers all of Devon, meaning we come to your home or workplace.' }
    ],
    relatedSlugs: ['vauxhall-vivaro-remap', 'ford-transit-custom-remap', 'vw-transporter-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  // ── SEAT / SKODA (VAG) ────────────────────────────────────────────────────

  {
    slug: 'seat-leon-remap',
    make: 'Seat', model: 'Leon', fullName: 'Seat Leon',
    metaTitle: 'Seat Leon Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Seat Leon ECU remapping - unlock massive gains on the Cupra 2.0 TSI or better MPG on the 2.0 TDI. Expert VAG tuning in Devon.',
    h1: 'Seat Leon Remap',
    intro: 'Sharing its platform with the VW Golf, the Seat Leon is a fantastic car to tune. Whether you have the ultra-efficient 2.0 TDI, the punchy 1.4 TSI, or the high-performance Leon Cupra 2.0 TSI, a Stage 1 ECU remap safely unlocks the restricted power within the factory software. AutoCleanse offers Seat Leon remapping across Devon.',
    engineOptions: [
      { name: '2.0 TSI Cupra 290', stockPower: '290bhp', remapPower: '360bhp', stockTorque: '350Nm', remapTorque: '450Nm' },
      { name: '2.0 TDI 150', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 15%' },
      { name: '1.4 TSI 150', stockPower: '150bhp', remapPower: '185bhp', stockTorque: '250Nm', remapTorque: '300Nm' },
    ],
    faqs: [
      { q: 'Is the Leon Cupra the same engine as the Golf R?', a: 'Yes, the Cupra 280/290/300 shares the EA888 engine with the Golf R and Audi S3. This means it responds incredibly well to Stage 1 tuning, safely reaching 360bhp.' },
      { q: 'Will a remap improve my Leon TDI fuel economy?', a: 'Yes, the 2.0 TDI gains a massive amount of mid-range torque, allowing you to hold higher gears on hills and motorways, typically improving MPG by 10-15%.' },
      { q: 'Is it safe for the DSG gearbox?', a: 'Yes, Stage 1 torque limits are designed to be well within the tolerances of the DSG and manual gearboxes.' },
      { q: 'Can you map the older 1.9 TDI Leons?', a: 'Yes, the legendary 1.9 TDI responds brilliantly to a remap, making it much more responsive for modern traffic.' },
      { q: 'Do you offer mobile tuning for the Seat Leon?', a: 'Yes, we provide fully mobile remapping throughout Devon.' }
    ],
    relatedSlugs: ['vw-golf-gti-remap', 'vw-golf-r-remap', 'skoda-octavia-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'seat-ibiza-remap',
    make: 'Seat', model: 'Ibiza', fullName: 'Seat Ibiza',
    metaTitle: 'Seat Ibiza Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Seat Ibiza ECU remapping - gain power and torque on the 1.0 TSI, 1.2 TSI and Cupra models. Expert tuning in Devon.',
    h1: 'Seat Ibiza Remap',
    intro: 'The Seat Ibiza is light, agile, and an excellent candidate for tuning. The popular 1.0 TSI and 1.2 TSI engines are heavily restricted from the factory and transform with a Stage 1 remap. The high-performance Ibiza Cupra 1.8 TSI also sees massive gains, turning it into a true pocket rocket. AutoCleanse maps Ibizas across Devon.',
    engineOptions: [
      { name: '1.8 TSI Cupra 192', stockPower: '192bhp', remapPower: '240bhp', stockTorque: '320Nm', remapTorque: '390Nm' },
      { name: '1.0 TSI 95', stockPower: '95bhp', remapPower: '135bhp', stockTorque: '175Nm', remapTorque: '240Nm' },
      { name: '1.2 TSI 110', stockPower: '110bhp', remapPower: '135bhp', stockTorque: '175Nm', remapTorque: '220Nm' },
    ],
    faqs: [
      { q: 'Can you really get 135bhp from the 1.0 TSI engine?', a: 'Yes, the 1.0 TSI 95bhp and 115bhp are mechanically identical, just software-restricted. A remap unlocks the full safe potential of the turbo.' },
      { q: 'Does remapping affect reliability?', a: 'No, a Stage 1 remap works safely within the factory limits of the engine components and turbocharger.' },
      { q: 'Will a remap make my Ibiza better on the motorway?', a: 'Absolutely. The increased torque means you won\'t have to drop down a gear to overtake or tackle long inclines.' },
      { q: 'Is the 1.8 TSI Cupra safe to map?', a: 'Yes, the 1.8 TSI EA888 engine is incredibly strong and comfortably handles 240bhp at Stage 1.' },
      { q: 'Can you remap my Ibiza at home?', a: 'Yes, we offer a mobile service that covers all of Devon.' }
    ],
    relatedSlugs: ['seat-leon-remap', 'vw-golf-gti-remap', 'vauxhall-corsa-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'skoda-octavia-remap',
    make: 'Skoda', model: 'Octavia', fullName: 'Skoda Octavia',
    metaTitle: 'Skoda Octavia Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Skoda Octavia ECU remapping - VAG tuning specialists in Devon. Huge gains for the Octavia vRS and better MPG for the TDI.',
    h1: 'Skoda Octavia Remap',
    intro: 'The Skoda Octavia is renowned for its practicality, but its VAG-group engines mean it also has incredible tuning potential. A Stage 1 ECU remap turns the Octavia vRS into a serious performance car, while tuning the 2.0 TDI models provides effortless towing ability and substantial fuel savings on long journeys. AutoCleanse offers Octavia tuning across Devon.',
    engineOptions: [
      { name: '2.0 TSI vRS 245', stockPower: '245bhp', remapPower: '310bhp', stockTorque: '370Nm', remapTorque: '450Nm' },
      { name: '2.0 TDI vRS 184', stockPower: '184bhp', remapPower: '225bhp', stockTorque: '380Nm', remapTorque: '440Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TDI 150', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 15%' },
    ],
    faqs: [
      { q: 'What does a Stage 1 remap do to the Octavia vRS?', a: 'The petrol vRS 245 shares its engine with the Golf GTI Performance. A Stage 1 tune takes it to around 310bhp, transforming the acceleration and overall dynamics.' },
      { q: 'Will a remap help the Octavia tow a caravan?', a: 'Yes, the extra 60Nm of torque on the 2.0 TDI 150 makes a huge difference when towing, reducing the need for gear changes.' },
      { q: 'Is the remap safe for the high-mileage diesel engines?', a: 'Yes, the 2.0 TDI is a very robust engine. As long as it has been well-maintained, a Stage 1 map is completely safe.' },
      { q: 'Will the dealer overwrite my remap?', a: 'If Skoda updates the ECU software during a service, the remap may be overwritten. Let us know if this happens and we can reapply it.' },
      { q: 'Do you offer mobile tuning in Devon for the Octavia?', a: 'Yes, we provide fully mobile remapping for all Skoda models across Devon.' }
    ],
    relatedSlugs: ['skoda-superb-remap', 'vw-golf-gti-remap', 'seat-leon-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'skoda-superb-remap',
    make: 'Skoda', model: 'Superb', fullName: 'Skoda Superb',
    metaTitle: 'Skoda Superb Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Skoda Superb ECU remapping - VAG tuning specialists in Devon. Improve MPG on the 2.0 TDI or unleash the 280 TSI.',
    h1: 'Skoda Superb Remap',
    intro: 'The Skoda Superb is a premium executive car with the engines to match. Whether you are doing high mileage in the 2.0 TDI and looking for maximum MPG, or you own the sleeper 2.0 TSI 280 (which shares the Golf R engine), a Stage 1 ECU remap from AutoCleanse will completely transform the driving experience.',
    engineOptions: [
      { name: '2.0 TSI 280 (4x4)', stockPower: '280bhp', remapPower: '360bhp', stockTorque: '350Nm', remapTorque: '450Nm' },
      { name: '2.0 TDI 150', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 15%' },
      { name: '2.0 TDI 190', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      { q: 'Can the Superb 280 really reach 360bhp?', a: 'Yes, the 2.0 TSI 280 uses the exact same EA888 engine and IS38 turbocharger as the VW Golf R and Audi S3. It is heavily detuned from the factory and safely maps to 360bhp.' },
      { q: 'Is the Superb a good car for an economy remap?', a: 'Excellent. Due to its aerodynamics and long gearing, the added torque from a remap allows the Superb to cruise at lower RPMs, improving MPG significantly.' },
      { q: 'Will the extra torque damage the DSG gearbox?', a: 'No, the DQ250 and DQ381 DSG gearboxes used in the Superb are rated for much higher torque than the factory outputs.' },
      { q: 'Does remapping affect the Superb\'s ride comfort?', a: 'No, an ECU remap only changes engine mapping. The suspension and DCC (Dynamic Chassis Control) remain completely unaffected.' },
      { q: 'Do you offer mobile tuning in Devon?', a: 'Yes, our mobile technicians cover the whole of Devon.' }
    ],
    relatedSlugs: ['skoda-octavia-remap', 'vw-passat-remap', 'audi-a6-remap'],
    category: 'mixed', fuelType: 'both'
  },

  // ── PORSCHE / VOLVO (PREMIUM) ─────────────────────────────────────────────

  {
    slug: 'porsche-macan-remap',
    make: 'Porsche', model: 'Macan', fullName: 'Porsche Macan',
    metaTitle: 'Porsche Macan Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Porsche Macan ECU remapping - unlock massive performance gains from the 2.0T, 3.0T, and 3.0 SD V6 engines in Devon.',
    h1: 'Porsche Macan Remap',
    intro: 'The Porsche Macan is the best-handling SUV on the market, but the factory engine mapping can leave it feeling a little restrained. A Stage 1 ECU remap unlocks serious performance. Whether you have the VAG-derived 2.0T, the punchy 3.0T V6, or the high-torque 3.0 SD diesel, remapping transforms the Macan into a true sports car. AutoCleanse offers Macan tuning in Devon.',
    engineOptions: [
      { name: '3.0T V6 S (Petrol)', stockPower: '340bhp', remapPower: '400bhp', stockTorque: '460Nm', remapTorque: '540Nm' },
      { name: '2.0T (Petrol)', stockPower: '252bhp', remapPower: '310bhp', stockTorque: '370Nm', remapTorque: '450Nm' },
      { name: '3.0 SD V6 (Diesel)', stockPower: '258bhp', remapPower: '310bhp', stockTorque: '580Nm', remapTorque: '680Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Does remapping a Macan affect the PDK gearbox?', a: 'The PDK is one of the strongest dual-clutch gearboxes in the world. It handles the Stage 1 torque increases easily and shifting remains incredibly fast and smooth.' },
      { q: 'Will my Macan S be noticeably faster?', a: 'Yes, gaining 60bhp and 80Nm transforms the Macan S. The throttle response is sharper, turbo lag is reduced, and it pulls significantly harder through the rev range.' },
      { q: 'Is it safe to remap a Porsche engine?', a: 'Absolutely. We use safe, tested calibrations that stay within the mechanical limits of the turbocharger and fuelling system.' },
      { q: 'Will it improve fuel economy on the Macan SD?', a: 'Yes, the diesel Macan benefits from increased low-end torque, which means less throttle is needed to maintain cruising speeds, improving MPG.' },
      { q: 'Can you remap my Macan at home in Devon?', a: 'Yes, we provide a fully mobile service, bringing our workshop-level equipment to your location.' }
    ],
    relatedSlugs: ['audi-q5-remap', 'bmw-x5-remap', 'range-rover-velar-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'volvo-xc60-remap',
    make: 'Volvo', model: 'XC60', fullName: 'Volvo XC60',
    metaTitle: 'Volvo XC60 Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Volvo XC60 ECU remapping - improve performance, torque, and MPG on the D4 and D5 diesel engines. Volvo tuning specialists in Devon.',
    h1: 'Volvo XC60 Remap',
    intro: 'The Volvo XC60 is incredibly safe and comfortable, but the heavy body means the D4 and D5 diesel engines have to work hard. A Stage 1 ECU remap adds significant mid-range torque, making the XC60 much more responsive, easier to overtake with, and better at towing, while also improving fuel economy on long runs. AutoCleanse maps Volvos across Devon.',
    engineOptions: [
      { name: '2.0 D4 190 (SPA Gen)', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '480Nm', mpgGain: 'up to 12%' },
      { name: '2.0 D5 235 (SPA Gen)', stockPower: '235bhp', remapPower: '275bhp', stockTorque: '480Nm', remapTorque: '550Nm', mpgGain: 'up to 10%' },
      { name: '2.4 D5 215 (Older Gen)', stockPower: '215bhp', remapPower: '260bhp', stockTorque: '440Nm', remapTorque: '520Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Will a remap make the XC60 better at towing?', a: 'Yes, the extra 70-80Nm of torque makes a massive difference when towing caravans, reducing gear hunting and making inclines much easier.' },
      { q: 'Does it improve fuel economy?', a: 'Yes, the XC60 is heavy. Extra torque means the engine doesn\'t have to be pushed as hard to get up to speed, typically yielding a 10-12% MPG improvement.' },
      { q: 'Are Volvo engines safe to remap?', a: 'Volvo engines are notoriously over-engineered and robust. A Stage 1 tune is completely safe and maintains excellent reliability.' },
      { q: 'Will it fix the slow gearbox response?', a: 'By providing more power earlier in the rev range, the gearbox doesn\'t need to shift down as often, which makes the whole driving experience feel much more fluid.' },
      { q: 'Do you offer a mobile service in Devon for Volvos?', a: 'Yes, we provide fully mobile remapping for all Volvo models across Devon.' }
    ],
    relatedSlugs: ['volvo-xc90-remap', 'audi-q5-remap', 'ford-kuga-remap'],
    category: 'mixed', fuelType: 'diesel'
  },

  {
    slug: 'volvo-xc90-remap',
    make: 'Volvo', model: 'XC90', fullName: 'Volvo XC90',
    metaTitle: 'Volvo XC90 Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Volvo XC90 ECU remapping - gain huge torque and better MPG for the D5 and B5 engines. Expert SUV tuning in Devon.',
    h1: 'Volvo XC90 Remap',
    intro: 'The Volvo XC90 is the ultimate family SUV, but its large size means the 2.0-litre D5 engine works extremely hard. A Stage 1 ECU remap delivers a massive boost in torque, which completely transforms the driving dynamics. The car feels lighter, accelerates more smoothly, and returns better fuel economy on motorways. AutoCleanse provides XC90 tuning in Devon.',
    engineOptions: [
      { name: '2.0 D5 235 (PowerPulse)', stockPower: '235bhp', remapPower: '280bhp', stockTorque: '480Nm', remapTorque: '550Nm', mpgGain: 'up to 10%' },
      { name: '2.4 D5 200 (Older Gen)', stockPower: '200bhp', remapPower: '245bhp', stockTorque: '420Nm', remapTorque: '500Nm', mpgGain: 'up to 12%' },
      { name: '2.0 T6 320 (Petrol)', stockPower: '320bhp', remapPower: '360bhp', stockTorque: '400Nm', remapTorque: '460Nm' },
    ],
    faqs: [
      { q: 'Why does the XC90 need a remap?', a: 'The new generation XC90 is very heavy for a 2.0-litre engine. A remap gives it the low-end grunt of a larger 3.0-litre engine, making it much more effortless to drive.' },
      { q: 'Will a remap damage the PowerPulse system?', a: 'No, the PowerPulse system (which uses compressed air to spool the turbo) works perfectly in conjunction with the remap, providing even better off-the-line response.' },
      { q: 'Does remapping improve MPG on the XC90?', a: 'Yes, especially on the motorway. The extra torque allows the engine to sit in 8th gear comfortably without constantly downshifting on slight inclines.' },
      { q: 'Is it safe for the 8-speed automatic gearbox?', a: 'Yes, the Aisin 8-speed gearbox handles the Stage 1 torque limits with ease.' },
      { q: 'Can you remap my XC90 at my home?', a: 'Yes, our premium mobile tuning service covers the entirety of Devon.' }
    ],
    relatedSlugs: ['volvo-xc60-remap', 'land-rover-discovery-remap', 'audi-q7-remap'],
    category: 'mixed', fuelType: 'both'
  },

  // ── PEUGEOT / CITROEN / RENAULT / DACIA (FRENCH / BUDGET) ─────────────────

  {
    slug: 'peugeot-208-remap',
    make: 'Peugeot', model: '208', fullName: 'Peugeot 208',
    metaTitle: 'Peugeot 208 Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Peugeot 208 ECU remapping - gain power on the 1.2 PureTech and 1.6 BlueHDi. Mobile remapping across Devon.',
    h1: 'Peugeot 208 Remap',
    intro: 'The Peugeot 208 is a stylish and popular hatchback. The 1.2 PureTech petrol engines and the highly efficient 1.6 BlueHDi diesels are fantastic tuning platforms. A Stage 1 ECU remap safely unlocks more power, providing a punchier drive and even better fuel economy on diesel models. AutoCleanse offers Peugeot 208 tuning in Devon.',
    engineOptions: [
      { name: '1.2 PureTech 110', stockPower: '110bhp', remapPower: '140bhp', stockTorque: '205Nm', remapTorque: '250Nm' },
      { name: '1.6 BlueHDi 100', stockPower: '100bhp', remapPower: '130bhp', stockTorque: '254Nm', remapTorque: '310Nm', mpgGain: 'up to 12%' },
      { name: '1.6 THP GTi 208', stockPower: '208bhp', remapPower: '235bhp', stockTorque: '300Nm', remapTorque: '360Nm' },
    ],
    faqs: [
      { q: 'Is the 1.2 PureTech engine safe to tune?', a: 'Yes, the turbocharged 1.2 PureTech engine responds incredibly well to Stage 1 tuning and handles the increased power perfectly.' },
      { q: 'Will my 208 GTi be much faster?', a: 'Gaining nearly 30bhp and 60Nm transforms the GTi, making it pull much harder through the gears.' },
      { q: 'Does remapping improve MPG on the diesel?', a: 'Yes, the BlueHDi engines typically see a 10-12% improvement in real-world fuel economy after a remap.' },
      { q: 'Is remapping detectable during an MOT?', a: 'No, a Stage 1 remap keeps all factory emissions equipment intact and will pass an MOT without issue.' },
      { q: 'Can you remap my 208 at my workplace?', a: 'Yes, we provide fully mobile remapping for all Peugeot models in Devon.' }
    ],
    relatedSlugs: ['peugeot-3008-remap', 'renault-clio-remap', 'citroen-berlingo-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'peugeot-3008-remap',
    make: 'Peugeot', model: '3008', fullName: 'Peugeot 3008',
    metaTitle: 'Peugeot 3008 Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Peugeot 3008 ECU remapping - improve performance and MPG on the 1.5 and 2.0 BlueHDi engines. SUV tuning in Devon.',
    h1: 'Peugeot 3008 Remap',
    intro: 'The Peugeot 3008 is a superb family SUV, but the 1.5 and 2.0 BlueHDi engines can feel a little breathless when fully loaded. A Stage 1 ECU remap delivers a substantial increase in mid-range torque, transforming how the car overtakes and climbs hills, while also providing excellent fuel savings. AutoCleanse maps 3008s across Devon.',
    engineOptions: [
      { name: '2.0 BlueHDi 150', stockPower: '150bhp', remapPower: '190bhp', stockTorque: '370Nm', remapTorque: '430Nm', mpgGain: 'up to 15%' },
      { name: '1.5 BlueHDi 130', stockPower: '130bhp', remapPower: '160bhp', stockTorque: '300Nm', remapTorque: '360Nm', mpgGain: 'up to 12%' },
      { name: '1.2 PureTech 130', stockPower: '130bhp', remapPower: '155bhp', stockTorque: '230Nm', remapTorque: '280Nm' },
    ],
    faqs: [
      { q: 'Does remapping a 3008 make it better for towing?', a: 'Yes, the additional torque, especially on the 2.0 BlueHDi, makes a massive difference when towing caravans or trailers.' },
      { q: 'Will I get better MPG from the 1.5 BlueHDi?', a: 'Yes, because the engine produces more torque, it doesn\'t have to work as hard, which typically improves MPG by 10-12%.' },
      { q: 'Is the 8-speed automatic gearbox safe to tune?', a: 'Yes, the EAT8 gearbox handles Stage 1 torque increases very comfortably.' },
      { q: 'Will this fix the sluggish throttle response?', a: 'Yes, our remap significantly sharpens the throttle response, making the car feel much more eager off the line.' },
      { q: 'Do you offer a mobile service for the Peugeot 3008?', a: 'Yes, our technicians cover the entirety of Devon.' }
    ],
    relatedSlugs: ['peugeot-208-remap', 'citroen-berlingo-remap', 'ford-kuga-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'renault-clio-remap',
    make: 'Renault', model: 'Clio', fullName: 'Renault Clio',
    metaTitle: 'Renault Clio Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Renault Clio ECU remapping - unleash the Clio RS or improve the 0.9 and 1.5 dCi engines. Expert tuning in Devon.',
    h1: 'Renault Clio Remap',
    intro: 'The Renault Clio is agile and fun, particularly the Renaultsport (RS) models. Whether you are looking to squeeze maximum performance from the 1.6T RS, or you want better drivability and economy from the 1.5 dCi or 0.9 TCe, a Stage 1 ECU remap unlocks the car\'s true potential. AutoCleanse offers Clio remapping across Devon.',
    engineOptions: [
      { name: '1.6T RS 200 (Mk4)', stockPower: '200bhp', remapPower: '230bhp', stockTorque: '240Nm', remapTorque: '310Nm' },
      { name: '1.5 dCi 90', stockPower: '90bhp', remapPower: '120bhp', stockTorque: '220Nm', remapTorque: '270Nm', mpgGain: 'up to 15%' },
      { name: '0.9 TCe 90', stockPower: '90bhp', remapPower: '115bhp', stockTorque: '135Nm', remapTorque: '180Nm' },
    ],
    faqs: [
      { q: 'How does a remap affect the Clio RS 200 EDC?', a: 'The remap adds significant mid-range punch and sharpens the throttle response, making the EDC automatic gearbox feel more decisive.' },
      { q: 'Is the 1.5 dCi worth remapping for economy?', a: 'Absolutely. The 1.5 dCi is already incredibly economical, but a remap adds much-needed torque and often improves MPG by a further 10-15%.' },
      { q: 'Can you remap the 0.9 TCe 3-cylinder?', a: 'Yes, the small turbo engine responds very well, gaining around 25bhp which transforms how the car drives.' },
      { q: 'Will remapping affect my car insurance?', a: 'Yes, you must declare the modification to your insurer. Specialist brokers often provide excellent rates for mapped cars.' },
      { q: 'Do you offer mobile tuning in Devon for the Clio?', a: 'Yes, we provide fully mobile remapping for all Renault models across Devon.' }
    ],
    relatedSlugs: ['renault-megane-remap', 'peugeot-208-remap', 'vauxhall-corsa-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'renault-megane-remap',
    make: 'Renault', model: 'Megane', fullName: 'Renault Megane',
    metaTitle: 'Renault Megane Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Renault Megane ECU remapping - massive gains for the RS 280/300 and excellent economy for the 1.5 dCi. Devon tuning experts.',
    h1: 'Renault Megane Remap',
    intro: 'The Renault Megane RS is one of the greatest hot hatches on the market, and the standard models are fantastic cruisers. A Stage 1 ECU remap turns the Megane RS into a supercar-slayer, while tuning the 1.5 and 1.6 dCi diesels delivers massive improvements in MPG and overtaking ability. AutoCleanse maps Meganes across Devon.',
    engineOptions: [
      { name: '1.8T RS 280 (Mk4)', stockPower: '280bhp', remapPower: '320bhp', stockTorque: '390Nm', remapTorque: '450Nm' },
      { name: '2.0T RS 250 (Mk3)', stockPower: '250bhp', remapPower: '300bhp', stockTorque: '340Nm', remapTorque: '410Nm' },
      { name: '1.5 dCi 110', stockPower: '110bhp', remapPower: '140bhp', stockTorque: '260Nm', remapTorque: '310Nm', mpgGain: 'up to 15%' },
    ],
    faqs: [
      { q: 'Does the Megane RS 280 respond well to a remap?', a: 'Incredibly well. The 1.8T engine easily reaches 320bhp at Stage 1, completely transforming the acceleration and top-end pull.' },
      { q: 'Is it safe to push the older Megane RS 250 to 300bhp?', a: 'Yes, the F4Rt engine is legendary for its strength and handles 300bhp on standard internals perfectly safely.' },
      { q: 'Can you remap the EDC automatic gearbox models?', a: 'Yes, the EDC gearbox handles the Stage 1 torque increases easily.' },
      { q: 'Will a remap improve fuel economy on the dCi models?', a: 'Yes, the 1.5 and 1.6 dCi engines see fantastic economy gains (up to 15%) while becoming much punchier to drive.' },
      { q: 'Can you remap my Megane at home in Devon?', a: 'Yes, our mobile tuning service covers the whole of Devon.' }
    ],
    relatedSlugs: ['renault-clio-remap', 'seat-leon-remap', 'vw-golf-gti-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'citroen-berlingo-remap',
    make: 'Citroen', model: 'Berlingo', fullName: 'Citroen Berlingo',
    metaTitle: 'Citroen Berlingo Remap | Van Tuning Devon | AutoCleanse',
    metaDescription: 'Citroen Berlingo ECU remapping - gain power, torque and MPG. Commercial van and MPV tuning in Devon.',
    h1: 'Citroen Berlingo Remap',
    intro: 'The Citroen Berlingo (and its Peugeot Partner sibling) is the ultimate compact van and family MPV. However, when fully loaded with tools or passengers, the 1.6 HDi and 1.5 BlueHDi engines can struggle. A Stage 1 ECU remap delivers essential mid-range torque, making the Berlingo feel effortless to drive while improving MPG. AutoCleanse tunes Berlingos across Devon.',
    engineOptions: [
      { name: '1.6 BlueHDi 100', stockPower: '100bhp', remapPower: '130bhp', stockTorque: '254Nm', remapTorque: '310Nm', mpgGain: 'up to 15%' },
      { name: '1.5 BlueHDi 130', stockPower: '130bhp', remapPower: '160bhp', stockTorque: '300Nm', remapTorque: '360Nm', mpgGain: 'up to 12%' },
      { name: '1.6 HDi 75 (Older Gen)', stockPower: '75bhp', remapPower: '110bhp', stockTorque: '185Nm', remapTorque: '260Nm', mpgGain: 'up to 15%' },
    ],
    faqs: [
      { q: 'Will a remap help my Berlingo when it is fully loaded?', a: 'Yes, this is the biggest benefit. A remap adds around 60Nm of torque, which means the van pulls much harder even with a heavy payload in the back.' },
      { q: 'Can the 75bhp version be mapped to match the 110bhp version?', a: 'Yes, they share the exact same engine hardware. A remap safely removes the factory software restrictions.' },
      { q: 'Does remapping improve fuel economy for a working van?', a: 'Yes, because the van doesn\'t have to be driven as hard to keep up with traffic, fleet drivers often report a 10-15% improvement in MPG.' },
      { q: 'Will a remap affect my MOT or emissions?', a: 'No, all our Stage 1 remaps keep the DPF, EGR, and AdBlue systems fully intact and legal.' },
      { q: 'Do you offer a mobile service for tradesmen in Devon?', a: 'Yes, we can come to your site or driveway to map the van with minimal downtime.' }
    ],
    relatedSlugs: ['peugeot-boxer-remap', 'ford-transit-custom-remap', 'vauxhall-vivaro-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  {
    slug: 'dacia-duster-remap',
    make: 'Dacia', model: 'Duster', fullName: 'Dacia Duster',
    metaTitle: 'Dacia Duster Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Dacia Duster ECU remapping - gain more power and better fuel economy from the 1.5 dCi engine. Expert tuning in Devon.',
    h1: 'Dacia Duster Remap',
    intro: 'The Dacia Duster is fantastic value for money, but the Renault-sourced 1.5 dCi engines are tuned very conservatively. A Stage 1 ECU remap wakes the Duster up, delivering a strong surge of torque that transforms how it drives on the road and off it, while providing excellent MPG gains. AutoCleanse offers Duster remapping in Devon.',
    engineOptions: [
      { name: '1.5 dCi 110/115', stockPower: '110bhp', remapPower: '140bhp', stockTorque: '260Nm', remapTorque: '310Nm', mpgGain: 'up to 15%' },
      { name: '1.5 dCi 90', stockPower: '90bhp', remapPower: '120bhp', stockTorque: '200Nm', remapTorque: '260Nm', mpgGain: 'up to 15%' },
      { name: '1.3 TCe 150 (Petrol)', stockPower: '150bhp', remapPower: '175bhp', stockTorque: '250Nm', remapTorque: '300Nm' },
    ],
    faqs: [
      { q: 'Why is the Duster so sluggish from the factory?', a: 'The 1.5 dCi engine is deliberately restricted for emissions and insurance purposes. A remap safely unlocks the power the engine was designed to produce.' },
      { q: 'Will a remap help the Duster off-road?', a: 'Yes, the increased low-end torque makes the Duster much more capable on steep inclines and rough terrain.' },
      { q: 'Does remapping the Duster improve MPG?', a: 'Yes, particularly on the 1.5 dCi diesel, where owners regularly see a 10-15% improvement in fuel economy.' },
      { q: 'Is the 1.3 TCe petrol engine worth remapping?', a: 'Absolutely, gaining 25bhp and 50Nm makes the petrol Duster significantly punchier and better at overtaking.' },
      { q: 'Do you offer mobile Dacia tuning in Devon?', a: 'Yes, we provide fully mobile remapping for all Dacia models across Devon.' }
    ],
    relatedSlugs: ['renault-clio-remap', 'renault-megane-remap', 'ford-kuga-remap'],
    category: 'economy', fuelType: 'both'
  },

  // ── FIAT / ALFA (ITALIAN) ─────────────────────────────────────────────────

  {
    slug: 'fiat-500-remap',
    make: 'Fiat', model: '500', fullName: 'Fiat 500 / Abarth',
    metaTitle: 'Fiat 500 & Abarth Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Fiat 500 & Abarth 595 ECU remapping - unlock massive performance gains on the 1.4 T-Jet engines. Expert tuning in Devon.',
    h1: 'Fiat 500 & Abarth Remap',
    intro: 'The Fiat 500 and particularly the Abarth 595/695 models are some of the most characterful hot hatches on the road. The 1.4 T-Jet turbocharged engines are highly tuneable, and a Stage 1 ECU remap delivers explosive mid-range punch and sharpens the throttle response, making the car incredibly fun to drive. AutoCleanse offers Abarth tuning across Devon.',
    engineOptions: [
      { name: '1.4 T-Jet 145/160 (Abarth 595)', stockPower: '145bhp', remapPower: '175bhp', stockTorque: '206Nm', remapTorque: '290Nm' },
      { name: '1.4 T-Jet 180 (Abarth Competizione)', stockPower: '180bhp', remapPower: '205bhp', stockTorque: '250Nm', remapTorque: '310Nm' },
      { name: '1.2 8V 69 (Fiat 500)', stockPower: '69bhp', remapPower: '78bhp', stockTorque: '102Nm', remapTorque: '115Nm', mpgGain: 'up to 5%' },
    ],
    faqs: [
      { q: 'Can the 145bhp Abarth 595 safely reach 175bhp?', a: 'Yes, the base 145bhp engine is mechanically identical to higher output models. A remap simply removes the software restrictions safely.' },
      { q: 'Will a remap change how the Abarth sounds?', a: 'The remap itself doesn\'t change the exhaust, but the increased boost pressure often results in a slightly deeper, more aggressive tone under hard acceleration.' },
      { q: 'Is it worth remapping the standard Fiat 500 1.2?', a: 'While gains on naturally aspirated engines are small, a remap significantly sharpens the throttle response, making the 1.2 feel much less sluggish around town.' },
      { q: 'Will the remap affect my Sport mode button?', a: 'We can retain the functionality of the Sport button, ensuring the remap works seamlessly with the factory modes.' },
      { q: 'Can you remap my Abarth at my home in Devon?', a: 'Yes, we provide fully mobile remapping for all Fiat and Abarth models.' }
    ],
    relatedSlugs: ['ford-fiesta-st-remap', 'vauxhall-corsa-remap', 'renault-clio-remap'],
    category: 'performance', fuelType: 'petrol'
  },

  {
    slug: 'fiat-ducato-remap',
    make: 'Fiat', model: 'Ducato', fullName: 'Fiat Ducato',
    metaTitle: 'Fiat Ducato Remap | Motorhome & Van Tuning Devon',
    metaDescription: 'Fiat Ducato ECU remapping - gain torque and MPG. Perfect for vans and motorhomes. Expert tuning in Devon by AutoCleanse.',
    h1: 'Fiat Ducato Remap',
    intro: 'The Fiat Ducato is the undisputed king of the motorhome chassis, as well as a popular commercial van. Because motorhomes carry maximum payload permanently, the 2.3 MultiJet engines often feel underpowered on inclines. A Stage 1 ECU remap delivers the exact low-end torque needed to pull effortlessly, drastically improving the driving experience and MPG. AutoCleanse tunes Ducatos across Devon.',
    engineOptions: [
      { name: '2.3 MultiJet 130', stockPower: '130bhp', remapPower: '165bhp', stockTorque: '320Nm', remapTorque: '390Nm', mpgGain: 'up to 15%' },
      { name: '2.3 MultiJet 150', stockPower: '150bhp', remapPower: '185bhp', stockTorque: '350Nm', remapTorque: '420Nm', mpgGain: 'up to 15%' },
      { name: '2.3 MultiJet 180', stockPower: '180bhp', remapPower: '210bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Is remapping my Fiat Ducato motorhome safe for the engine?', a: 'Yes, the 2.3 MultiJet engine is an incredibly strong commercial unit designed for high mileage. A Stage 1 remap simply optimizes the power curve safely.' },
      { q: 'Will it stop my motorhome from struggling on hills?', a: 'Yes. Gaining 70Nm of torque completely transforms the motorhome, meaning you won\'t have to constantly drop down gears on long motorway inclines.' },
      { q: 'Can I get better fuel economy on long trips?', a: 'Yes, because the engine produces more torque lower down the rev range, you can cruise with less throttle input, improving MPG by up to 15%.' },
      { q: 'Will the remap cause black smoke?', a: 'No, our remaps maintain correct air-to-fuel ratios and work perfectly with the factory DPF, ensuring no smoke.' },
      { q: 'Can you come to my campsite or storage yard in Devon?', a: 'Yes, we provide a fully mobile service tailored to motorhomes and commercial vans.' }
    ],
    relatedSlugs: ['peugeot-boxer-remap', 'ford-transit-remap', 'mercedes-sprinter-remap'],
    category: 'commercial', fuelType: 'diesel'
  },

  // ── NISSAN / TOYOTA / MAZDA (JAPANESE) ────────────────────────────────────

  {
    slug: 'mazda-cx-5-remap',
    make: 'Mazda', model: 'CX-5', fullName: 'Mazda CX-5',
    metaTitle: 'Mazda CX-5 Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Mazda CX-5 ECU remapping - gain power and huge torque on the 2.2 SkyActiv-D engine. Expert Mazda tuning in Devon.',
    h1: 'Mazda CX-5 Remap',
    intro: 'The Mazda CX-5 is an excellent handling SUV, but the 2.2 SkyActiv-D engine, particularly the 150bhp version, is heavily restricted. A Stage 1 ECU remap safely unlocks an enormous amount of power and torque, making the CX-5 significantly faster, more responsive, and better at towing, while improving fuel economy. AutoCleanse offers Mazda tuning in Devon.',
    engineOptions: [
      { name: '2.2 SkyActiv-D 150', stockPower: '150bhp', remapPower: '210bhp', stockTorque: '380Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.2 SkyActiv-D 175', stockPower: '175bhp', remapPower: '210bhp', stockTorque: '420Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 SkyActiv-G (Petrol)', stockPower: '165bhp', remapPower: '180bhp', stockTorque: '210Nm', remapTorque: '230Nm' },
    ],
    faqs: [
      { q: 'How can the 150bhp diesel gain 60bhp?', a: 'The 150bhp and 175bhp 2.2 SkyActiv-D engines are mechanically identical. The 150bhp is purely software restricted. Our remap safely takes both engines to their natural 210bhp limit.' },
      { q: 'Will a remap affect the Mazda DPF?', a: 'No, the remap works seamlessly with the factory DPF system and does not cause premature clogging or regeneration issues.' },
      { q: 'Does remapping improve the CX-5 for towing?', a: 'Significantly. Gaining 80Nm of torque on the 150bhp model makes it an incredibly capable tow car for caravans.' },
      { q: 'Can you map the naturally aspirated petrol engines?', a: 'Yes, although the gains on the SkyActiv-G petrols are smaller (around 15bhp), the remap dramatically improves throttle response and removes flat spots.' },
      { q: 'Do you offer mobile tuning in Devon for Mazda?', a: 'Yes, we provide fully mobile remapping for all Mazda models across Devon.' }
    ],
    relatedSlugs: ['ford-kuga-remap', 'nissan-qashqai-remap', 'vw-tiguan-remap'],
    category: 'economy', fuelType: 'diesel'
  },

  {
    slug: 'nissan-qashqai-remap',
    make: 'Nissan', model: 'Qashqai', fullName: 'Nissan Qashqai',
    metaTitle: 'Nissan Qashqai Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Nissan Qashqai ECU remapping - improve performance and MPG on the 1.5 dCi and 1.6 dCi engines. Expert tuning in Devon.',
    h1: 'Nissan Qashqai Remap',
    intro: 'The Nissan Qashqai is the UK\'s definitive family crossover, but the 1.5 dCi and 1.6 dCi engines can feel a bit flat on the motorway or when fully loaded. A Stage 1 ECU remap safely increases power and mid-range torque, providing a much smoother, effortless drive and improving long-distance fuel economy. AutoCleanse offers Qashqai tuning in Devon.',
    engineOptions: [
      { name: '1.5 dCi 110', stockPower: '110bhp', remapPower: '140bhp', stockTorque: '260Nm', remapTorque: '310Nm', mpgGain: 'up to 15%' },
      { name: '1.6 dCi 130', stockPower: '130bhp', remapPower: '160bhp', stockTorque: '320Nm', remapTorque: '380Nm', mpgGain: 'up to 12%' },
      { name: '1.3 DIG-T 140 (Petrol)', stockPower: '140bhp', remapPower: '165bhp', stockTorque: '240Nm', remapTorque: '290Nm' },
    ],
    faqs: [
      { q: 'Is the 1.5 dCi engine reliable after remapping?', a: 'Yes, the Renault-sourced 1.5 dCi is a robust engine that handles Stage 1 power perfectly, retaining factory reliability.' },
      { q: 'Will a remap fix the Qashqai\'s slow acceleration?', a: 'Absolutely. The increased mid-range torque completely removes the sluggishness, making joining motorways and overtaking much safer.' },
      { q: 'Does remapping improve fuel economy on the Qashqai?', a: 'Yes, particularly on the diesel models, drivers regularly report 10-15% improvements in real-world MPG.' },
      { q: 'Is it safe for the automatic X-Tronic gearbox?', a: 'Yes, our Stage 1 remaps are designed to stay safely within the torque limits of the X-Tronic CVT gearbox.' },
      { q: 'Can you remap my Qashqai at my home in Devon?', a: 'Yes, we offer fully mobile remapping across the whole of Devon.' }
    ],
    relatedSlugs: ['mazda-cx-5-remap', 'nissan-juke-remap', 'ford-kuga-remap'],
    category: 'economy', fuelType: 'both'
  },

  {
    slug: 'nissan-juke-remap',
    make: 'Nissan', model: 'Juke', fullName: 'Nissan Juke',
    metaTitle: 'Nissan Juke Remap | Stage 1 Tuning Devon | AutoCleanse',
    metaDescription: 'Nissan Juke ECU remapping - gain power and better MPG from the 1.5 dCi, 1.2 DIG-T, and 1.6 Nismo models. Expert tuning in Devon.',
    h1: 'Nissan Juke Remap',
    intro: 'The Nissan Juke is a quirky and popular crossover. Whether you have the punchy 1.6T Nismo, the economical 1.5 dCi, or the 1.2 DIG-T, a Stage 1 ECU remap makes a world of difference. It sharpens the throttle, boosts mid-range torque, and transforms the driving experience from sluggish to genuinely fun. AutoCleanse maps Nissan Jukes across Devon.',
    engineOptions: [
      { name: '1.6 DIG-T Nismo RS 214', stockPower: '214bhp', remapPower: '240bhp', stockTorque: '280Nm', remapTorque: '340Nm' },
      { name: '1.5 dCi 110', stockPower: '110bhp', remapPower: '140bhp', stockTorque: '260Nm', remapTorque: '310Nm', mpgGain: 'up to 15%' },
      { name: '1.2 DIG-T 115', stockPower: '115bhp', remapPower: '135bhp', stockTorque: '190Nm', remapTorque: '240Nm' },
    ],
    faqs: [
      { q: 'Does a remap make the Juke Nismo significantly faster?', a: 'Yes, gaining 25bhp and 60Nm turns the Nismo into a seriously quick crossover with much more aggressive mid-range pull.' },
      { q: 'Will a remap fix the turbo lag on the 1.2 DIG-T?', a: 'Yes, the remap optimizes the boost pressure earlier in the rev range, dramatically reducing turbo lag and improving responsiveness.' },
      { q: 'Is the 1.5 dCi good for an economy remap?', a: 'It is one of the best. The 1.5 dCi is already efficient, but a remap adds torque, meaning you can cruise in higher gears, improving MPG by up to 15%.' },
      { q: 'Does remapping affect the driving modes (Eco, Normal, Sport)?', a: 'The remap works harmoniously with the factory driving modes, enhancing the characteristics of each.' },
      { q: 'Do you offer mobile tuning in Devon for the Juke?', a: 'Yes, we provide fully mobile remapping for all Nissan models across Devon.' }
    ],
    relatedSlugs: ['nissan-qashqai-remap', 'renault-clio-remap', 'peugeot-208-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'toyota-land-cruiser-remap',
    make: 'Toyota', model: 'Land Cruiser', fullName: 'Toyota Land Cruiser',
    metaTitle: 'Toyota Land Cruiser Remap | 4x4 Tuning Devon | AutoCleanse',
    metaDescription: 'Toyota Land Cruiser ECU remapping - unlock massive torque and towing ability from the 2.8 and 3.0 D-4D engines. Devon tuning experts.',
    h1: 'Toyota Land Cruiser Remap',
    intro: 'The Toyota Land Cruiser is arguably the toughest 4x4 in the world, but Toyota tunes the 3.0 and 2.8 D-4D engines very conservatively for global fuel variations. A Stage 1 ECU remap wakes the Land Cruiser up, providing a massive surge of torque that completely transforms its towing capabilities and on-road drivability. AutoCleanse offers Land Cruiser tuning across Devon.',
    engineOptions: [
      { name: '2.8 D-4D 177 (150 Series)', stockPower: '177bhp', remapPower: '215bhp', stockTorque: '450Nm', remapTorque: '530Nm', mpgGain: 'up to 12%' },
      { name: '3.0 D-4D 190 (150 Series)', stockPower: '190bhp', remapPower: '230bhp', stockTorque: '420Nm', remapTorque: '500Nm', mpgGain: 'up to 10%' },
      { name: '4.5 V8 D-4D 286 (200 Series)', stockPower: '286bhp', remapPower: '340bhp', stockTorque: '650Nm', remapTorque: '780Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      { q: 'Why is the Land Cruiser so sluggish, and will a remap help?', a: 'Toyota heavily detunes these engines for extreme global environments. A Stage 1 remap safely unlocks the power the engine was actually designed to produce, making the car much more responsive.' },
      { q: 'Does remapping improve towing performance?', a: 'Massively. Gaining 80Nm of torque means the Land Cruiser will pull heavy trailers and horseboxes up inclines effortlessly without dropping gears.' },
      { q: 'Will a remap affect the legendary Toyota reliability?', a: 'No, our Stage 1 remaps operate well within the safe mechanical limits of the D-4D engines, preserving their legendary longevity.' },
      { q: 'Can you remap the big 4.5 V8 diesel?', a: 'Yes, the V8 D-4D responds incredibly well, producing a colossal 780Nm of torque which makes it feel like an unstoppable freight train.' },
      { q: 'Do you offer a mobile service for the Land Cruiser in Devon?', a: 'Yes, our technicians offer fully mobile remapping across the whole of Devon.' }
    ],
    relatedSlugs: ['toyota-hilux-remap', 'land-rover-discovery-remap', 'nissan-navara-remap'],
    category: 'commercial', fuelType: 'diesel'
  },
];

export function getVehicleBySlug(slug: string): VehicleRemapData | undefined {
  return VEHICLE_REMAPS.find((v) => v.slug === slug);
}
