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
    metaTitle: "Audi Q5 Remap | 8R & FY TDI Tuning Devon | AutoCleanse",
    metaDescription: "Audi Q5 remap in Devon, 8R and FY, 2.0 and 3.0 TDI. Straight advice on towing weights, S tronic, quattro ultra and the DPF. Stage 1 from £220.",
    h1: 'Audi Q5 Remap',
    intro: "Most of the Q5s we map have a towbar on the back, and that is the honest starting point for this page. It is a heavy SUV, almost all the ones sold here are diesel, and owners nearly all want the same thing: enough mid-range to hold a gear up Telegraph Hill with a caravan behind rather than shuffling through three of them. Two generations account for nearly every Q5 that comes to us, the 8R up to 2017 and the FY after it, and the four-cylinder and V6 cases are genuinely different jobs rather than one map with two labels. We map Q5s from the Totnes workshop and mobile across Devon, and for almost all of them Stage 1 is the right answer, from £220.",
    engineOptions: [
      { name: '2.0 TDI 150', stockPower: '150bhp', remapPower: '192bhp', stockTorque: '340Nm', remapTorque: '400Nm', mpgGain: 'up to 14%' },
      { name: '2.0 TDI 190', stockPower: '190bhp', remapPower: '235bhp', stockTorque: '400Nm', remapTorque: '460Nm', mpgGain: 'up to 12%' },
      { name: '2.0 TFSI 252', stockPower: '252bhp', remapPower: '300bhp', stockTorque: '370Nm', remapTorque: '440Nm' },
      { name: '3.0 TDI 231', stockPower: '231bhp', remapPower: '285bhp', stockTorque: '500Nm', remapTorque: '620Nm', mpgGain: 'up to 10%' },
    ],
    faqs: [
      {
        "q": "My Q5 had the EA189 emissions recall done. Can it still be remapped?",
        "a": "Yes, and it is one of the more common reasons 8R owners ring us. The recall software changed the EGR and injection strategy on the EA189 2.0 TDI, and plenty of owners felt the car went flatter and less willing to pull afterwards. A map is written over whatever software is currently in the ECU, so we read the car first to establish which version it is actually running, because a post-recall 8R and a pre-recall 8R do not want the same file even though the badge and the paperwork look identical. We keep your original either way, so it can go back to the post-recall calibration whenever you need it to be there."
      },
      {
        "q": "Why does my Q5's plate show a lower towing weight than my neighbour's, when the cars look the same?",
        "a": "Braked capacity on a Q5 varies by engine and by whether the car left the factory with the towing preparation pack, so an 8R 2.0 TDI and a 3.0 TDI quattro of the same year are not plated the same. It is also worth knowing that the detachable towbars retro-fitted to a lot of used Q5s do not change the plate, whatever the bar itself is rated to. Read your own VIN plate and V5C rather than a forum post about the same model year, and take the lower of the two figures where they disagree."
      },
      {
        "q": "Does a remap change how often my FY Q5 engages the rear axle?",
        "a": "No. On quattro with ultra technology the decision to clutch the rear axle in is made by its own controller from steering angle, throttle position, lateral load and wheel slip, and a Stage 1 engine map does not tell it what to do. What changes is how much torque is present at the moment it does engage, which is exactly why we ramp torque in rather than spiking it at the point boost arrives. On a wet Devon lane you should not notice drive arriving at the back any earlier or later than before, only that there is more of it once it is there. If you can feel a genuine hesitation in the handover, that is worth investigating at the rear clutch and its service history rather than blaming the file."
      },
      {
        "q": "There is no dipstick on my Q5 and the MMI says the oil level is too high. What is going on?",
        "a": "On an FY that message is usually diesel in the sump from regenerations that keep getting cut short, not somebody overfilling it at a service. We see it most on the EA288 2.0 TDI doing school-run mileage, and Audi's long-life servicing makes it worse because the diluted oil stays in the engine considerably longer than it would on a fixed annual interval. It is a filter and usage problem rather than a mapping one. Get the oil changed, change how the car is used if you can, and if the filter turns out to be genuinely loaded we clean it off the vehicle at our Totnes workshop. A map on a Q5 in that state only hides it for a few months."
      },
      {
        "q": "Is the petrol Q5 worth remapping, given the oil consumption stories?",
        "a": "It depends which EA888 you have, and the split is by engine generation rather than by bodyshell. The heavy oil consumption and chain tensioner reputation belongs to the Gen 2 unit in the first 8R petrol cars. Later 8Rs and the 252 in the FY are Gen 3 and do not carry the same history, and the 252 takes Stage 1 to around 300bhp and 440Nm comfortably. On any TFSI Q5 we check oil consumption and carry out the paid diagnostic before quoting for a map, because an engine already drinking oil is not a candidate for more boost."
      },
      {
        "q": "I tow every week. Should I buy a mapped 2.0 TDI or find a 3.0 TDI?",
        "a": "For a twin-axle caravan or a loaded horsebox most weekends, the V6 is the better car and a mapped one is better still, because 620Nm spread across a wide band is what keeps the box settled on a climb rather than shuffling. Be honest about the bills that come with it though: flap motors, oil cooler and thermostat housing seepage, and a chain drive at the back of the engine that is an engine-out job. For two or three trips a summer, a mapped 2.0 TDI 190 at around 235bhp and 460Nm does the work for far less money to run, and that is what we recommend to most people who ask."
      },
      {
        "q": "Will a remap change how my Q5's S tronic behaves in traffic?",
        "a": "Not on its own. The shift points and clutch strategy live in the transmission control unit, and a Stage 1 engine map does not write to it. The low-speed shunt or hesitation some owners blame on a map afterwards is almost always DL501 clutch adaptation, and it is nearly always present before anyone touches the ECU, which is one of the things we check on the diagnostic so there is no argument later. If you genuinely want the gearbox side altered, that is a separate TCU file, and we would only write one to a box with fresh fluid and filter and no stored adaptation faults."
      }
    ],
    contentSections: [
      {
        "heading": "8R or FY: which Q5 is on your driveway?",
        "paragraphs": [
          "The Q5 changes over during 2017, so a 2017 plate could be either car. Before that it is the 8R, engine mounted longitudinally on the older MLB platform. From mid-2017 it is the FY on MLB Evo, facelifted again in 2020. A newer Q5 arrived on a different platform again and has been on UK sale since 2025, so ring us with the registration if that is what you have. Within the two we work on daily, what changed underneath matters far more than the badge. Early 8R diesels run the EA189 2.0 TDI, the engine caught up in the emissions recall. From roughly 2015 the EA288 took over, and every FY diesel is EA288 with SCR and AdBlue dosing. If your car wears 40 TDI or 45 TFSI rather than a plain 2.0 TDI badge, it is a later FY, because Audi moved to the numeric naming from the 2018 model year.",
          "We read the ECU rather than ask what the badge says, and on a Q5 there is a specific reason for that. An 8R can be sitting on its original EA189 calibration, on the post-recall software, or on somebody else's map that never got mentioned when the car was sold. Those are three different starting points before anybody quotes a figure. The paid diagnostic we run before any Q5 map is where we settle it: which software version is actually in the ECU, what the filter's measured soot and ash loading is rather than what the dash says, and whether the S tronic has stored clutch adaptation faults. Those are three Q5 answers you cannot get by walking round the car."
        ]
      },
      {
        "heading": "2.0 TDI or 3.0 TDI: two genuinely different files",
        "paragraphs": [
          "The 2.0 TDI 150 goes to roughly 192bhp and 400Nm, the 190 to around 235bhp and 460Nm, and in a car this heavy the bhp figure is close to irrelevant. The useful comparison is an A4 of the same year with the same engine. Same block, same turbo, same software family, but the Q5 carries around 200kg more, sits taller, and has a four-wheel-drive system to turn as well as a body to push. That is why the standard car needs two gears to do what the A4 does in one, and why the extra 60Nm shows up as gears you stop having to take rather than as a number on a printout. Owners tend to describe the mapped car as feeling smaller rather than faster, which is the right description of what has actually changed.",
          "The V6 is a different proposition. The 3.0 TDI carries 500Nm as standard and takes around 620Nm at Stage 1, a 120Nm swing that is by some margin the biggest gain available in this car. The torque is spread wide rather than piled into a band, so on a long climb the box stays where it is instead of hunting. The trade is running cost and it is a real one: intake manifold flap motors that fail, oil cooler and thermostat housing seepage, and timing chains driven from the back of the engine, which is an engine-out job if it ever comes to it. None of that is a reason to avoid the V6, but it is a reason to price the whole ownership rather than just the map."
        ]
      },
      {
        "heading": "quattro ultra, the DL501, and where the torque actually goes",
        "paragraphs": [
          "Not all Q5 quattro is the same system, which is where a lot of generic tuning advice falls over. The 8R uses a self-locking centre differential with a rear-biased default split, and it absorbs a Stage 1 torque increase without complaint. Most FY four-cylinder cars use quattro with ultra technology instead, which drives the front wheels for economy and clutches the rear axle back in when it predicts traction is about to be needed. It is a good system, but it is predictive, and torque dumped at it the instant boost arrives can catch it mid-handover, usually felt as a brief scrabble pulling out of a wet junction. That is calibration rather than hardware. We ramp torque in across the rev range instead of spiking it, which is why an FY four-cylinder file is not the 8R file with a different checksum on it.",
          "The gearbox question splits along a similar line, and the interesting part is not that any one box is strong but that Audi gave the two engines different kinds of box. Most four-cylinder cars use the seven-speed S tronic dual clutch, the DL501, and a good number of 8Rs are six-speed manuals. From the 2012 facelift onward the V6 sits behind the eight-speed tiptronic torque converter, while earlier 8R V6s use the S tronic, which is one more reason we read the car before quoting. A dual-clutch file and a torque-converter file want different shapes, because the DL501 has less margin above standard torque and a well-documented mechatronic and clutch pack history on higher-mileage 8Rs. If your car has never had its S tronic fluid and filter done at the interval, that job comes before any map. A Q5 that is already slow to take up drive is one we will turn away until it is sorted."
        ]
      },
      {
        "heading": "Towing is why most Q5s end up on our ramp",
        "paragraphs": [
          "A Q5 is usually the household's only car, and that is what makes it hard on itself. The same vehicle drags a caravan to the north coast in August and then does four miles to school and back for the other eleven months, which is why the towing section and the filter section on this page are really one argument. The towing test owners describe to us never varies: Telegraph Hill on the A380, or the westbound climb over Haldon on the A38, in a standard 2.0 TDI, with the S tronic dropping two gears and the engine sat near 3,000rpm for the length of the hill. What changes after a map is specific rather than vague. The gear the box was giving up stays available on the gradient, the revs sit lower at the 60mph limit that applies to you on that dual carriageway anyway, and the transmission temperature that anyone who tows regularly keeps half an eye on stops climbing through a long pull.",
          "What no map changes is what you are allowed to tow. Your gross train weight is set by Audi and stamped on the VIN plate, with the braked trailer limit following from it and shown on newer V5Cs. A Q5 kerbs at roughly 1,750 to 1,900kg depending on engine and spec, so the usual 85 per cent guidance for a comfortable outfit lands somewhere between about 1,490kg and 1,615kg, and that is guidance rather than law. Noseweight, payload and the towbar's own rating are all unaffected too, as is the trailer stabilisation function, which lives in the ESP software and is not touched by an engine ECU map. The remap makes a legal load easier to pull. It does not make an illegal one legal."
        ]
      },
      {
        "heading": "The school run is what kills Q5 filters",
        "paragraphs": [
          "Four miles into Totnes and back never gets the exhaust hot enough to burn soot off passively, so the ECU keeps falling back on active regenerations, injecting fuel late in the cycle to raise the temperature. On a Q5 you can usually tell when one is running before any light appears: the regen that starts as you turn into your road, the cooling fan still working hard after you have parked up, and on later cars the driver display asking you to keep driving above a set speed. Switching off at that point is what does the damage rather than the short journey itself. Do it often enough and two problems stack up together, a filter holding soot and ash it never clears, and unburnt diesel washing past the bores into the sump.",
          "How you notice the second one depends on which Q5 you have. An 8R still has a dipstick, and the level creeps above the max mark on it. The FY has no dipstick at all, so the first sign is the oil level readout in the MMI or an oil level too high message, which is easy to leave alone for months on a car running Audi's variable long-life intervals rather than a fixed annual service. Telling a loaded filter apart from an AdBlue problem also matters more on an FY, because its filter is SCR-coated and dosed with AdBlue, so a soot loading fault and a NOx sensor or dosing fault can present on the dash looking much alike. That is what the diagnostic separates, and it is why nothing gets removed from the car before we have read it. If the filter is the problem we clean it off the vehicle at Totnes from £210, with Devon-wide collection and return, or UK-wide postal from £230. DPF cleaning is workshop-only here. The mobile service is remapping, never filters."
        ]
      },
      {
        "heading": "Stage 2 on a diesel Q5, and why Audi built the SQ5 instead",
        "paragraphs": [
          "We are asked about Stage 2 on diesel Q5s constantly and we talk most people out of it, and the clearest argument is what Audi itself did when it wanted meaningfully more than a mapped 3.0 TDI. It did not cut the exhaust about. It built the SQ5: sequential turbocharging on the 8R's 3.0 BiTDI, and on the later SQ5 TDI an electrically driven compressor working alongside the turbocharger, with the cooling and gearbox calibration to match. The single variable-geometry turbo on an ordinary Q5 TDI is already close to its flow ceiling at Stage 1 figures, so a mapped 231 lands around 285bhp, which is a genuinely quick Q5 and still short of a standard SQ5, and no file closes that gap. The only real routes above Stage 1 are hybrid turbo work or taking the emissions equipment out, and we do not remove DPFs, EGR or SCR hardware from road cars at any price.",
          "The petrol case is narrower but honest. The 2.0 TFSI 252 in the FY goes to around 300bhp and 440Nm on Stage 1 and would want intercooler and exhaust work beyond that, which is rarely money well spent on a family SUV of this weight. Warranty is worth one phone call before you book, and on a Q5 it is often not Audi UK you need to ask: a lot of FYs change hands as Audi Approved Used, where the cover is the selling dealer's twelve-month warranty rather than the original factory term, and S tronic and quattro clutch components are precisely what a dealer looks at first. Most of our 8R work is on cars long out of any cover, and most of our FY work is not. Tell your insurer either way, and know that the original file is saved before anything is written, so the car goes back to exactly how Audi left it whenever you want it to."
        ]
      }
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
          'Most 320ds sold in the last decade use the ZF 8-speed automatic, which comfortably handles Stage 1 torque levels - it is a strong, well-proven gearbox and our maps stay within its safe operating window. Manual cars are equally suitable at Stage 1, though as with any torque increase a very worn clutch may show its age sooner, so we will flag it if yours feels marginal.',
          'On economy, drivers who keep to a steady right foot typically see a real-world 8–12% MPG improvement, mostly from motorway and dual-carriageway cruising where the engine works less hard. If you use the extra performance at every opportunity, expect economy to stay roughly the same - the gain is a choice, not automatic.',
        ],
      },
      {
        heading: 'Is Stage 1 the right choice, and how we protect your engine',
        paragraphs: [
          'For the 320d we almost always recommend Stage 1. It needs no hardware changes, keeps the DPF and emissions equipment in place, and delivers the vast majority of the usable gain. Stage 2 offers limited additional benefit on this engine relative to the cost and supporting work involved, so it is rarely the sensible option for a road-going 320d.',
          'Every remap starts with a paid diagnostic health check - we are upfront that this is not a free add-on. We read the ECU for stored and pending faults, check the DPF, EGR and boost readings, and only proceed if the engine is healthy. If we find an underlying problem, we tell you before any remap is applied. We keep a backup of your original file so the car can be returned to stock at any time.',
        ],
      },
      {
        heading: 'Insurance, warranty and the law',
        paragraphs: [
          'A remap is a modification, and you must declare it to your insurer - many specialist and mainstream insurers cover remapped vehicles at a reasonable premium, but not declaring it can invalidate a claim. If your 320d is still within BMW warranty, be aware a remap may affect drivetrain cover, so it is worth checking your terms first. Stage 1 remapping keeps your DPF and emissions hardware intact and is legal for road use in the UK; we do not offer DPF or emissions-equipment removal for road cars.',
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
    metaTitle: 'VW Transporter T5/T6 Remap | Van Tuning Devon | AutoCleanse',
    metaDescription: 'VW Transporter T5/T6 ECU remapping - improve power, torque and MPG. Commercial van remapping in Devon from AutoCleanse.',
    h1: 'VW Transporter T5 & T6 Remap',
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
          'The lower-powered 102 and 140 vans benefit the most in relative terms - they go from feeling underpowered when loaded to genuinely comfortable. The 150 and 204 vans gain strong, usable mid-range that makes long runs far less tiring.',
        ],
      },
      {
        heading: 'T5, T6 and T6.1: engine variants',
        paragraphs: [
          'We remap the 2.0 TDI across the T5 (2009 on), T6 and T6.1. The single-turbo 102 and 150 and the twin-turbo 180/204 all respond well at Stage 1, but the safe, sensible gain differs by variant - a 102 will not reach 204 figures, and we would never claim it does. Tell us the exact model, year and power output when you book and we will confirm realistic numbers for your specific van.',
          'Many Transporters are camper conversions. These remap just the same, and the added torque is particularly welcome when the van is loaded with a full interior, water and gear on hilly or coastal routes.',
        ],
      },
      {
        heading: 'Gearbox, economy and fleet considerations',
        paragraphs: [
          'DSG-equipped Transporters are well suited to Stage 1 - our maps respect the gearbox\'s torque limits. On manual vans, a healthy clutch copes fine, but a clutch already worn from heavy loaded use may need attention sooner, and we will tell you honestly if yours feels close.',
          'Economy is the number one reason operators remap their vans: a better torque curve means less throttle to maintain speed, and drivers commonly report 10–18% real-world MPG improvements depending on load and route. Over 30,000+ miles a year that adds up quickly. For fleets we can apply a consistent map across multiple vans and schedule them around your work - ask about fleet pricing.',
        ],
      },
      {
        heading: 'Diagnostics first, and mobile visits to your yard',
        paragraphs: [
          'Every van gets a paid diagnostic health check before we touch the ECU - this is not a free add-on. We scan for faults, check the DPF and EGR condition and confirm the van is healthy before the remap is applied, because remapping a van with an existing problem simply masks it. We keep your original file backed up so the van can be returned to standard whenever you need.',
          'Because downtime costs you money, we offer mobile ECU remapping across Devon and can come to your depot, yard or home - the same equipment and process as our Totnes workshop, without taking the van off the road for a trip.',
        ],
      },
      {
        heading: 'Insurance and the law',
        paragraphs: [
          'A remap is a declarable modification. Make sure your commercial or fleet policy is informed - most insurers cover remapped vans, but an undeclared modification can invalidate a claim. Stage 1 remapping keeps your DPF and emissions equipment in place and is road-legal; we do not remove DPFs or emissions hardware on road-going vehicles.',
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
    metaTitle: "Mercedes E220d Remap | OM654 & OM651 Stage 1 | AutoCleanse",
    metaDescription: "Mercedes E220d remap in Devon. Stage 1 tuning for the OM651 (W212) and OM654 (W213) diesels, roughly +45bhp and +70Nm. Totnes workshop or mobile.",
    h1: 'Mercedes E220d Remap',
    intro: "Search for a Mercedes E220 remap and you almost certainly mean an E220d, and the first thing we ask is the registration year. W212 cars, 2009 to 2016, use the 2.1-litre OM651: cast-iron block, two timing chains running in series, badged E 220 CDI or E 220 BlueTEC. The W213 that replaced it in 2016 uses the OM654, a 1,950cc engine with an aluminium block, steel pistons and the DPF and SCR catalyst bolted close against the cylinder head. Both take Stage 1 well and both gain roughly 45bhp and 70Nm, but they get there differently and they age differently. We remap E220ds from our Totnes workshop and mobile across Devon.",
    engineOptions: [
      { name: '2.0d OM654 194 (W213)', stockPower: '194bhp', remapPower: '240bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 12%' },
      { name: '2.1d OM651 177 (W212)', stockPower: '177bhp', remapPower: '220bhp', stockTorque: '400Nm', remapTorque: '470Nm', mpgGain: 'up to 12%' },
    ],
    faqs: [
      {
        "q": "Is remapping an OM654 E220d different to the older OM651?",
        "a": "The end result is similar, the route there is not. The 2.0 OM654 in the W213 typically goes from 194bhp to around 240bhp. The W212's 2.1 OM651 was quoted at 170bhp on earlier cars and 177bhp on the later BlueTEC ones, and Stage 1 takes the 177bhp version to around 220bhp, with both engines picking up roughly 70Nm. The OM651 feels the bigger change because of the flat patch it has just off idle as standard. The OM654 leaves the factory far more tightly calibrated, so its gain shows up as a cleaner, less hesitant mid-range rather than a step change."
      },
      {
        "q": "How do I tell whether my E220d is a W212 or a W213?",
        "a": "Registration year first: the W212 ran from 2009 to roughly mid-2016, the W213 from 2016. Badging supports it, since W212s wear E 220 CDI or E 220 BlueTEC and the E 220 d name came in with the W213. You can confirm it yourself from the VIN, where the sixth and seventh digits give the body code, 212 or 213, and the estate reads S212 or S213. The engine number stamped on the block is the final word: an OM654 begins 654, an OM651 begins 651. Send us the registration if you would rather we just tell you."
      },
      {
        "q": "Will a remap clear my E220d AdBlue warning or NOx sensor fault?",
        "a": "No, and anyone telling you otherwise is not doing you a favour. AdBlue and SCR faults on the E220d, typically a failed NOx sensor or a crystallised metering valve, are a separate diagnosis and repair, and we do that work as its own paid job. We do not delete SCR or AdBlue systems on road cars. If your car is already counting down to a no-restart, the underlying fault gets dealt with first and the map comes afterwards, because a remap changes nothing about how the car doses urea."
      },
      {
        "q": "Does the gearbox need anything doing before a Stage 1 map?",
        "a": "On a healthy W213 with the 9G-Tronic, no. That box has considerably more torque capacity than an E220d ever asks of it. On a W212 we check which gearbox is actually fitted first, because later cars can have the nine-speed as well. If it is the 722.9 seven-speed and the car is high mileage, we are more cautious: a shudder on light-throttle upshifts, or an ATF service that has never been done at 120,000 miles, wants dealing with before the map. Adding torque to a marginal gearbox only brings the bill forward."
      },
      {
        "q": "Why does an E220d gain less MPG than a mapped van?",
        "a": "Because there is far less waste to recover. The OM654 comes with close-coupled aftertreatment, very high injection pressure and gearing long enough that ninth is a true overdrive, so the factory calibration is already near its efficiency ceiling. A loaded panel van is calibrated with much more thermal and emissions margin left on the table, which is why van figures look so much better on paper. On an E220d, expect the low-to-mid fifties a healthy standard car sees on a steady run to improve modestly rather than transform, and bear in mind 19-inch AMG Line wheels and 4MATIC both move that baseline down before the map is even considered."
      },
      {
        "q": "Is the E-Class Estate or All-Terrain mapped the same as the saloon?",
        "a": "It is the same file, but not the same car. The S213 All-Terrain is the heaviest E-Class body, sits higher on its air suspension and is 4MATIC only, so the extra low-down torque is more obvious there than in a rear-drive saloon. The estate's rear air suspension also means a loaded S213 keeps its ride height and puts the torque down, where a laden saloon squats and runs short of grip sooner. 4MATIC itself changes nothing about the map, it just deploys the torque more tidily on a wet Devon lane."
      },
      {
        "q": "My E220d is an ex-lease car on 130,000 miles. Is it too far gone?",
        "a": "At 130,000 the useful questions are which engine and what kind of miles. An ex-lease OM654 on motorway work is usually in better shape than a privately owned one at half that mileage doing short runs. Pull the Assyst Plus service record and look for two things: whether a NOx sensor has already been replaced, and whether AdBlue has been topped up outside of a service, which points at a dosing problem. Then we listen for chain rattle from cold on an OM651, or read DPF and SCR data on an OM654. If the car is healthy it maps fine. If it is not, we will say so first."
      }
    ],
    contentSections: [
      {
        "heading": "OM651 or OM654: which E220d have you actually got?",
        "paragraphs": [
          "The split is 2016. A W212 saloon or S212 estate registered up to roughly mid-2016 has the OM651, the 2.1-litre four Mercedes put in almost everything from the C-Class to the Sprinter. From the W213 onwards it is the OM654, a genuinely new 1,950cc unit with an aluminium block, Nanoslide-coated bores and steel pistons, somewhere around 30kg lighter than the engine it replaced. The badge is a useful tell in itself, since pre-2016 cars wear E 220 CDI or E 220 BlueTEC and the E 220 d name arrived with the W213, but the registration year is what we work from. If you want to check it yourself, the sixth and seventh digits of the VIN give the body code, 212 or 213.",
          "It matters more than a badge change suggests. The OM651 is a proven, torquey engine, but the earlier ones carry a documented history: two timing chains running in series that can stretch, wear at the chain sprockets and tensioner, and injector seals that can leak. A leaking seal on an OM651 normally announces itself as a diesel smell in the cabin and a rough thirty seconds from cold, leaving carbon build-up around the injector bores that makes removal a job in itself. If yours does that, the seals come first and the map comes later, because more cylinder pressure on a poor seal only accelerates it. Those are age and mileage faults in their own right, and adding torque to a tired OM651 is a waste of your money."
        ]
      },
      {
        "heading": "Why the OM654 responds differently to the old 2.1",
        "paragraphs": [
          "The OM654 is not a smaller OM651, it is a clean-sheet engine. It runs much higher injection pressure, a stepped-bowl piston crown Mercedes developed to speed combustion up, and thermal management aimed squarely at getting that close-coupled aftertreatment hot quickly. For tuning that means the factory calibration is already close to its efficiency ceiling, so the Stage 1 gain comes from boost and fuelling trims through the mid-range rather than from filling in an obvious hole. On the road it feels less dramatic than the headline figures imply, more like the engine has simply stopped pausing before it commits.",
          "The 2.1 OM651 is the cruder engine and, as usually happens, that makes the change far more obvious from the driver's seat. In standard form it has a breathless patch just off idle, and a Stage 1 map largely removes it, so a W212 goes from wanting a run-up to pulling cleanly from around 1,600rpm. The W213 gains a similar set of numbers with far less theatre. Owners who have run both tend to say the newer car feels smoother but less urgent, and in our experience that is broadly true of the two maps as well."
        ]
      },
      {
        "heading": "7G-Tronic or 9G-Tronic: does the box cope with the torque?",
        "paragraphs": [
          "Almost every UK E220d is an automatic, and the gearbox does not split as neatly as the engine does. Most W212s use the 7G-Tronic 722.9, a seven-speed torque converter box that takes Stage 1 torque without complaint, though from around 2014 Mercedes began fitting the nine-speed to later W212s too, so we confirm the actual box from the registration rather than from the year alone. If yours is the 722.9, it has habits worth knowing: the conductor plate and its connector are a known leak point, and the ATF service almost nobody actually does gets expensive to ignore on a car that has covered 120,000 motorway miles. A W212 that already shudders on a light-throttle upshift wants that sorted before it gets another 70Nm.",
          "The W213's 9G-Tronic was designed with far more torque headroom than an E220d ever asks of it, since the same basic gearbox sits behind six-cylinder Mercedes diesels making a great deal more, and it takes Stage 1 comfortably. What owners actually notice is behavioural. The nine-speed will not hold its tallest ratios once load rises, so on a long drag like Haldon on the A38 out of Exeter a standard car steps down a gear or two and sits there to the top. With more torque available at the engine speed it is already turning, it tends to hold on instead, and the difference shows up as refinement and quiet rather than as pace."
        ]
      },
      {
        "heading": "AdBlue, SCR and the DPF: what a remap will not fix",
        "paragraphs": [
          "Every W213 E220d runs AdBlue. Some later W212s do as well, depending on build date and emissions standard, but plenty of earlier E 220 CDIs have no SCR system at all, so we check from the registration rather than assume. In our experience the SCR side is the most common reason an E220d comes to us: a failed NOx sensor, a metering valve that has crystallised, and eventually the countdown message telling you how many miles remain before the car will not restart. We diagnose and repair AdBlue and SCR faults as a separate paid job, because that is genuinely what it is. A remap does not fix a NOx sensor and we will not sell you one as though it does.",
          "The DPF picture on the W213 is different to the older car. Because the filter and SCR catalyst are close-coupled as one unit near the head, a genuine motorway E220d reaches regeneration temperature quickly and rarely blocks. Short-run cars are another matter, and the W213 gives the driver no dashboard notice that a regeneration is running, so the usual pattern is an owner shutting off mid-cycle without knowing, over and over. The tells are a hot smell, a raised idle and the fan running on after shutdown. Dosing only starts once the catalyst is hot, so those cars often arrive with a soot load and a NOx fault together. Our DPF cleaning is off-vehicle and workshop-only, from £210, with Devon collection and return or UK-wide postal from £230."
        ]
      },
      {
        "heading": "Real economy on a car that is already efficient",
        "paragraphs": [
          "The E220d is the car people buy to cover big motorway mileage, and most of the ones we see are ex-lease, private hire or long-commute examples on their second or third owner. The W213 in particular is slippery and very long-geared: ninth in the 9G-Tronic is a genuine overdrive, and in Eco mode the box will decouple and let the car coast on a trailing throttle. A healthy standard one will often see the low-to-mid fifties on a steady run, depending on wheel size, whether it is 4MATIC and what the route looks like. That already-good baseline is precisely what caps what a map can add on this car.",
          "So we argue economy from the gearbox rather than from a percentage. More torque low down means the nine-speed stops dropping out of its top two ratios every time the road tilts, and the coasting function gets used more often rather than less, which is why the honest description is a car that holds a tall gear where it used to shuffle. At best, for a patient motorway driver, that is worth up to around 12 per cent. Most people see less. If your E220d only does local Devon miles, the A381 between Totnes and Newton Abbot, the A379 down to the coast, short hops in and out of Torbay, the box never gets near ninth in the first place, and driveability rather than payback is the honest reason to do it."
        ]
      },
      {
        "heading": "Stage 2, warranty and the checks we run first",
        "paragraphs": [
          "We do not recommend Stage 2 on an E220d, and the reason is the hardware rather than caution. Both engines use a single variable-geometry turbo sized for low-down response, behind a redline that arrives early, so there is no top end to chase and very little airflow left to buy: a Stage 2 spend on this car pays for capability the engine cannot use. What the £220 Stage 1 file actually targets is boost and fuelling between roughly 1,500 and 3,000rpm, which is where an E-Class spends effectively all of its life. On this engine that is the whole of the usable gain, and we would rather say so than sell you a second stage.",
          "The pre-map check on an E220d is chargeable and engine-specific, and we would rather state that plainly than dress it up as a free health check. On an OM651 we listen for chain rattle in the first couple of seconds from a cold start and look for soot staining and oil weep around the injector bases. On an OM654 we read DPF differential pressure and soot loading, AdBlue dosing quantity and both NOx sensors, because those are the faults that actually turn up on this car. Anything we find, you hear about it before the ECU is touched.",
          "Mercedes main dealers read the car through XENTRY at every service and a changed calibration is visible there, so if your E220d is inside a Mercedes-Benz Approved Used or extended warranty, read the terms before you book rather than afterwards. Your original file is always backed up, so the car can go back to the factory calibration if a drivetrain claim comes up. A remap is also a declarable modification for insurance. The map itself does not touch AdBlue dosing or the SCR model, so the car still meters urea exactly as Mercedes intended and still passes an MOT NOx check, which also means a remap is no route around the no-restart countdown."
        ]
      }
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
    metaTitle: "Vauxhall Astra Remap Devon | 1.6 CDTi | AutoCleanse",
    metaDescription: "Vauxhall Astra Stage 1 remaps in Devon. 1.6 CDTi Whisper diesel, 1.7 CDTi, 1.4T petrol, M32 gearbox advice and honest costings. Stage 1 from £220.",
    h1: 'Vauxhall Astra Remap',
    intro: "Most Astras we see are Mk6 (J) or Mk7 (K) cars on their second or third owner, and a large number began life as fleet or Motability vehicles. That matters more than the badge does. Whether a remap is worth it on an Astra turns on which engine is in front of you, whether the M32 gearbox is healthy, and how many miles a year you genuinely cover. The 1.6 CDTi Whisper Diesel, the older Isuzu-derived 1.7 CDTi and the 1.4 and 1.6 turbo petrols are four quite different propositions. We map Astras at our Totnes workshop or mobile across Devon, and we will say if yours is not a sensible candidate.",
    engineOptions: [
      { name: '1.6 CDTi 136', stockPower: '136bhp', remapPower: '165bhp', stockTorque: '320Nm', remapTorque: '380Nm', mpgGain: 'up to 15%' },
      { name: '2.0 CDTi 165', stockPower: '165bhp', remapPower: '200bhp', stockTorque: '350Nm', remapTorque: '420Nm', mpgGain: 'up to 12%' },
      { name: '1.4 Turbo 150', stockPower: '150bhp', remapPower: '175bhp', stockTorque: '245Nm', remapTorque: '290Nm' },
    ],
    faqs: [
      {
        "q": "How do I tell whether my Astra has the 1.6 CDTi or the older 1.7?",
        "a": "The engine code on the V5C is the quickest tell. A 1.7 CDTi carries an A17DT code, commonly A17DTJ, A17DTR or A17DTS. The Whisper Diesel is a B16, most often B16DTH in the 136bhp car and B16DTL in the 110. Plate year on its own is not enough, because a late Astra J can be either: the 1.6 arrived before the J went out of production. From outside the car the 1.7 is also noticeably gruffer at idle, which is usually enough to tell them apart in a car park."
      },
      {
        "q": "My Astra is not worth a great deal. Is a remap a waste of money?",
        "a": "It turns on which Astra and how far you drive it, not on what the car is worth. A 2.0 CDTi 165 or a 1.6 CDTi with a full history covering 20,000 miles a year is worth mapping. A 1.7 CDTi still on its original injectors at 140,000 miles usually is not. A 1.4 Turbo doing 7,000 town miles a year will not repay it in fuel, so you would be buying it purely for how the car feels. If the same money would do more good on a clutch, a service or a DPF clean, we will say so."
      },
      {
        "q": "My Astra whines in fifth and sixth. Can you still remap it?",
        "a": "We would rather not. That whine on the M32 six-speed is usually bearing wear, and adding torque to a box that is already complaining shortens whatever life is left in it. Get the gearbox sorted first and have the clutch done while it is out, then come back for the map. If the uprated bearing kit has already been fitted, mention it when you enquire, because that changes the answer entirely. We ask about the gearbox before we book an Astra in for exactly this reason."
      },
      {
        "q": "The DPF light keeps coming on in my 1.6 CDTi. Will a remap sort it?",
        "a": "No, and on an Astra K it is worth understanding why before spending anything. More often than not the car has been asking for a regeneration it never gets to finish, because the journeys are too short and the engine is switched off part way through the cycle. If the driver information centre has been prompting you and the prompt has been ignored, a 20 minute run at a steady 2,500rpm on the A38 will often clear a part-loaded filter. If it is genuinely blocked it comes off the car: from £210 at our Totnes workshop with Devon collection and return, or from £230 by post. A remap does not clear a loaded filter and will not stop a K asking for a regeneration it cannot complete."
      },
      {
        "q": "Can you remap the 2022-on Astra L?",
        "a": "Yes. The Stellantis-era Astra L uses the 1.2 PureTech petrol and the 1.5 diesel shared with the Peugeot 308, so it is a different job from mapping a Vauxhall-engined J or K. One caution: the earlier PureTech engines run a cambelt in oil, and belt condition and service history matter considerably more on those than on the older Vauxhall units. Later cars moved away from that design, so the first thing we establish is which version you have before adding torque to it."
      },
      {
        "q": "What about the Astra VXR?",
        "a": "The honest sequence differs between the two generations. On the Astra H VXR the clutch is frequently the practical ceiling rather than the engine, so on those we would want it checked, or budgeted for, before the map rather than after. The 280PS Astra J VXR does not have that problem in the same way, and Stage 1 typically takes its 2.0 turbo to around 310bhp. Either way the tyres and the front end work considerably harder afterwards, which matters more on a front-drive car than the power figure suggests."
      },
      {
        "q": "Do I have to bring my Astra to Totnes?",
        "a": "For most cars, no. An Astra K flashes through the OBD port on your driveway and the visit is usually well under an hour, so a K is a straightforward mobile job anywhere in Devon. Some of the older Astra J ECUs are the exception and need to come out of the car and go on the bench, which is a workshop appointment at Totnes rather than a driveway one. Send us the registration and we will tell you which side of that line yours falls before you book. DPF cleaning is always workshop-only: drop off, Devon collection, or post. There is no mobile DPF service."
      }
    ],
    contentSections: [
      {
        "heading": "Astra J or Astra K? The split that decides what you gain",
        "paragraphs": [
          "Vauxhall replaced the Astra J with the K in 2015, and the two respond differently to the same work. The J, sold here from late 2009, carried the Isuzu-derived 1.7 CDTi, the 2.0 CDTi 165, the 1.4 Turbo and the 1.6 SIDI Turbo petrols and the 280PS VXR, and it picked up the 1.6 CDTi Whisper Diesel late in its own life as the 1.7's replacement. The K kept that 1.6 CDTi, added a 1.0 three-cylinder and a new 1.4 turbo four in place of the J's earlier one, and from around 2019 the facelift brought PSA-derived 1.2 petrol and 1.5 diesel units.",
          "Plate years get you most of the way there. Broadly, a 59 to 15 plate is a J and a 65 to 71 plate a K, with one large exception: the Astra J GTC three-door carried on alongside the K until 2018, so a 16 or 17 plate GTC is still a J. A 22 plate onward is the Stellantis-based Astra L. The generation matters because Vauxhall claimed a saving of up to around 200kg on some K variants, so the same torque figure is moving less car. A 2015 registration is the awkward one, because build month decides it and the two take different files."
        ]
      },
      {
        "heading": "The 1.6 CDTi Whisper diesel against the older 1.7 CDTi",
        "paragraphs": [
          "The 1.7 CDTi is an Isuzu-derived unit that Vauxhall used for a long time, and it shows its age. It is coarser, it is unhappier on short journeys, and by now the EGR valve and cooler on most of them have carboned up at least once. We will still map a healthy 1.7, but we are deliberately cautious with it and would rather under-promise on a tired example than sell a headline number. If the injectors are still the originals at high mileage, that is the conversation to have first. Injector correction values read on a road test tell you more about whether £220 is well spent than any brochure figure does.",
          "The 1.6 CDTi that replaced it, sold as the Whisper Diesel, is a genuinely better engine and the better candidate. The 136bhp version runs 320Nm as standard and takes 380Nm at Stage 1, and because that torque arrives low down it fills in exactly where an Astra is normally short, pulling from about 1,500 to 2,500rpm in fourth or fifth. Telegraph Hill northbound on the A380 is the local test: a standard 136 typically wants fourth about two thirds of the way up, and in our experience a Stage 1 car will hold fifth. It starts out quieter than the 1.7 and it stays that way afterwards."
        ]
      },
      {
        "heading": "The 1.4 Turbo in a J is not the 1.4 Turbo in a K",
        "paragraphs": [
          "The A14NET 1.4 Turbo in the Astra J and the 1.4 Turbo 150 in the K share a badge and not a great deal else. The K car runs 245Nm as standard and roughly 290Nm at Stage 1, and it is doing that in a noticeably lighter body, so the mid-range change between about 2,000 and 4,000rpm genuinely alters how the car drives. The J's A14NET starts from a lower base and gains proportionally more on paper while hauling more weight, so it ends up feeling livelier rather than quick. On an A14NET we also want the cam cover breather and the plastic coolant outlet looked at, because both are well-documented weak points and both spoil the idle quality of an otherwise good map.",
          "Which of the two is worth £220 is a fair question, and the answer differs. A K 1.4 Turbo 150 that sees the A38 and A380 regularly is a sound spend. A J 1.4 Turbo doing school runs and town miles is not, because you will not see the fuel back and the car is not light enough to feel transformed by 45Nm. The 1.6 SIDI Turbo and the VXR are a different case again: they put respectable power through the front wheels, and worn front tyres on a wet Devon lane will find the traction limit long before the engine does."
        ]
      },
      {
        "heading": "The two Astras that come through the door, and why one is the problem",
        "paragraphs": [
          "Astras went to fleets and to Motability in enormous numbers, so the used population splits neatly in two. One is the ex-rep 2.0 CDTi with 140,000 motorway miles on it. The other is the ex-Motability car with 45,000 miles, a full main-dealer history and a life made up of three-mile journeys. Owners assume the first is the risk. In our experience it is usually the second, because it is the one whose DPF has spent years part-loaded and part-regenerated and whose EGR has never been hot enough for long enough to keep itself clean. On an Astra, journey length tells you far more than the odometer does.",
          "That is why the diagnostic here is a paid service and not a free health check thrown in to win the job. On an Astra it earns its money: DPF differential pressure and the stored regeneration history on a K, injector correction values on a high-mileage 1.7, boost and EGR readings, and a road test with the window down listening for M32 bearing noise. If the real complaint is a limp mode, a warning light, or a regeneration the car never finishes, a remap will not fix it and can hide it for a while, which is worse than leaving it alone.",
          "Where the filter itself is the problem, that is an off-vehicle job. DPF cleaning starts at £210 at our Totnes workshop, with Devon-wide collection and return, or from £230 by post if you are further afield. We clean filters off the car in the workshop only, so there is no mobile option for that part of the work. The remap is the part we can bring to you."
        ]
      },
      {
        "heading": "Will the M32 gearbox take another 60Nm?",
        "paragraphs": [
          "The M32 six-speed manual fitted behind a lot of the higher-torque Astras has a well-documented bearing weakness, and the test is not subtle once you know what to listen for. The whine changes pitch when you change gear at the same road speed, it is usually loudest in fifth and sixth, and it fades away when you coast in neutral. If yours does that, adding 60Nm is not the right next move, and we would rather send you to a gearbox specialist first than take the booking. A healthy M32 is not a fragile thing, and plenty of Astras have already had the uprated bearing kit fitted. If yours has, tell us, because it changes the answer.",
          "The clutch is something to plan around rather than worry about separately, because on an Astra it comes out with the gearbox. If the M32 needs bearings, the clutch is very nearly free labour and should be done while the box is on the bench. The reverse is the expensive mistake: paying for a clutch on its own while the gearbox is already whining means paying that labour twice inside a year. On automatic cars, the six-speed torque converter Vauxhall fitted is not in the class of the eight-speeds used in larger rear-drive cars, so on a high-mileage auto we keep the torque request conservative rather than chase the headline figure, and we say so when we quote."
        ]
      },
      {
        "heading": "Is £220 sensible money on a car that is not worth much?",
        "paragraphs": [
          "This is the question people actually want answered, so here is the arithmetic rather than a slogan. A 1.6 CDTi covering 20,000 miles a year at roughly 55mpg gets through about 1,650 litres. Lift that to roughly 60mpg and it uses about 1,515, so the saving is in the region of 140 litres over the year, which depending on the pump price is broadly in the region of the £220. Do that sort of mileage and it should pay for itself inside the first year or so, assuming you get the gain and do not spend all of it on the throttle. The ecoFLEX cars are where the economy gain tends to be most real, because their taller gearing already has them lugging low down and the extra torque lands in that hole.",
          "Cover 7,000 town miles a year in a 1.4 Turbo and it is not going to pay for itself in fuel, and we would not pretend otherwise. A remap also rarely adds anything to what an Astra is worth when you sell it, and some buyers will be put off by it. On a car with a slipping clutch, a loaded DPF or no service history, the same £220 does more good spent on the fault. Where it makes real sense is a sound, well-serviced diesel you intend to keep for another few years. Stage 1 starts at £220, and the original file is always backed up so the car can be returned to standard.",
          "Insurance is the cost people forget, and on an Astra it swings hard depending on which one you own. A 1.6 CDTi sits in a modest group and a declared Stage 1 map is usually a small adjustment to the premium. The 1.6 SIDI Turbo, and the VXR in particular, are rated far higher before anyone mentions modifications, and that is where a declared map can change the number materially. Get a quote for the modified car before you book, not after. Our Stage 1 maps leave the DPF, EGR and emissions hardware in place so the car MOTs as normal, and we do not remove emissions equipment from road cars for anyone."
        ]
      }
    ],
    relatedSlugs: ['vauxhall-corsa-remap', 'ford-focus-st-remap', 'vw-golf-gtd-remap'],
    category: 'mixed', fuelType: 'both'
  },

  {
    slug: 'vauxhall-corsa-remap',
    make: 'Vauxhall', model: 'Corsa', fullName: 'Vauxhall Corsa',
    metaTitle: "Vauxhall Corsa Remap | 1.4T, 1.3 CDTi, VXR | AutoCleanse",
    metaDescription: "Honest Corsa remap advice from our Totnes workshop: what the 1.4 Turbo, 1.3 CDTi and VXR gain, why non-turbo Corsas gain little, and the insurance catch.",
    h1: 'Vauxhall Corsa Remap',
    intro: "Most Corsas we are asked to map are small petrol cars, often a first or second car, and that changes the honest answer. If yours is turbocharged, the 1.4 Turbo, the Corsa E 1.0 Turbo, the Corsa F 1.2 PureTech Turbo or a VXR, there is real gain to be had at Stage 1. If it is a naturally aspirated 1.0, 1.2 or 1.4, there is very little, and we would rather say so before you book than after. Below is what each Corsa engine actually gains, what it costs against what the car is worth, and the insurance question that catches more Corsa owners out than owners of anything else we map.",
    engineOptions: [
      { name: '1.6T VXR 205 (Corsa E)', stockPower: '205bhp', remapPower: '235bhp', stockTorque: '280Nm', remapTorque: '340Nm' },
      { name: '1.4 Turbo 100', stockPower: '100bhp', remapPower: '140bhp', stockTorque: '200Nm', remapTorque: '260Nm', mpgGain: 'up to 5%' },
      { name: '1.3 CDTi 95', stockPower: '95bhp', remapPower: '120bhp', stockTorque: '210Nm', remapTorque: '260Nm', mpgGain: 'up to 15%' },
    ],
    faqs: [
      {
        "q": "Will a remap make my 1.2 Corsa faster?",
        "a": "Four or five bhp, and you would struggle to feel it. For scale, the 1.4 Turbo that sat next to it in the same showroom left the factory with 100bhp and maps to around 140bhp. That is the car you are comparing yours to when the 1.2 feels slow, and no file gets an A12XER anywhere near it. The same applies to the 1.0 12v and the naturally aspirated 1.4 16v. Tyres and a service will change how a Corsa D drives more than a map will."
      },
      {
        "q": "How do I tell whether my 1.4 Corsa is the turbo one?",
        "a": "It matters, because the naturally aspirated 1.4 16v and the 1.4 Turbo are quoted at similar power on paper but are nothing alike in torque or in tuning potential. The V5C engine code is the only reliable test: the turbocharged Corsa E cars carry B14NET at 100PS or B14NEL at 150PS, while the naturally aspirated 1.4 16v carries A14XER or B14XER. Trim is not a test, because Vauxhall put SXi and Limited Edition badges on both. There are a few variant codes about, so send us the registration and we will confirm it in a minute."
      },
      {
        "q": "My Corsa is on a black box policy. Can I still have it remapped?",
        "a": "Ask your insurer before you ask us. Telematics policies aimed at drivers under 25 are the most restrictive on modifications we come across, and some will decline or cancel rather than re-rate, but it varies by insurer and the only answer that counts is your own provider's. If they will not cover it, that is the end of the conversation as far as we are concerned. Driving a mapped Corsa on a policy that does not cover it puts the whole claim at risk over a few bhp."
      },
      {
        "q": "Will a remap hurt what my Corsa is worth when I sell it?",
        "a": "It can, and more than it would on a performance car. At the two to four thousand pound end of the used market, private buyers are actively suspicious of a modified small hatchback, because that is the corner of the market where abused cars live, and a mapped 1.4 Turbo can sit for sale longer than a standard one. Your original file stays backed up on our system, so if you decide to advertise the car as standard we can flash it back to stock beforehand. Tell us when you book and we will make a note of it."
      },
      {
        "q": "What does a Corsa VXR gain at Stage 1?",
        "a": "The Corsa E VXR is a 205PS car as standard, and typically goes to around 235PS with torque rising from 280Nm to 340Nm. That is a lot of torque for a front-wheel-drive car of that weight, so traction becomes the limit rather than power. If yours has the Performance Pack with the limited-slip differential it will put it down far better; on a standard car expect more wheelspin in the wet, which on unsalted Devon lanes in winter is worth thinking about. We would usually rather do a VXR at the workshop than mobile so we can drive it before and after, and we will say so when you book."
      },
      {
        "q": "Can I have the economy map and the extra 25bhp on the 1.3 CDTi at the same time?",
        "a": "Not both at their best. On a 95PS MultiJet there is only so much fuel and boost to work with, so the file is biased one way or the other. The power-biased version gets you towards the 120bhp figure in the table, but you only see the fuel saving if you stay out of it, which most people do not. The economy bias gives up some of the top end and concentrates the torque lower down where a commute actually lives. Corsa owners doing real mileage almost always take the economy bias once the trade-off is explained, and on this engine that is usually the right call."
      },
      {
        "q": "Can you remap the electric Corsa-e?",
        "a": "No. Our remapping work covers petrol and diesel ECUs, so the Corsa-e and the Corsa Electric are not something we tune. We do cover the petrol and diesel Corsa F, including the 1.2 PureTech Turbo and the 1.5 BlueHDi. The Corsa-e is styled almost identically to the petrol Corsa F apart from the badging, which catches people out on used forecourts, so if you are not certain which one you are looking at, the fuel type on the V5C settles it."
      }
    ],
    contentSections: [
      {
        "heading": "Turbo or not: the one question that decides everything",
        "paragraphs": [
          "The Corsa range splits cleanly in two, and which side yours falls on matters far more than the year on the plate. A naturally aspirated Corsa, the 1.0 12v and the A12XER 1.2 in the Corsa D, the A14XER or B14XER 1.4 16v, or the non-turbo 1.2 PureTech 75 in the Corsa F, has no boost pressure to raise, and boost is the single biggest lever a tuner has. On the A12XER and A14XER we would expect a low single-figure gain, four or five bhp, which is less than the spread you would see between two standard Corsas on the same rollers on the same afternoon. Vauxhall used the A14XER across the Corsa, the Adam and the Astra J, so there is not even a Corsa-specific factory calibration sitting there waiting to be sharpened.",
          "We will say that plainly rather than take the booking and let you find out afterwards. If someone rings about a 1.2 Corsa D wanting it to feel quicker, the honest advice is usually a decent set of tyres and a proper service instead. Turbocharged Corsas are a different conversation: on the 1.4 Turbo 100 the figures above show 140bhp and 260Nm, and that is not fantasy territory, because Vauxhall themselves sold the same 1.4 turbo family at 150PS in the Corsa GSi. A mapped 100PS car is sitting near a state of tune the factory signed off and warranted. The table above covers the three engines we are asked about most; for the Corsa E 1.0 Turbo and the Corsa F PureTech, send us the registration and we will quote the figures for your exact car."
        ]
      },
      {
        "heading": "Corsa D, E or F: three different cars wearing the same badge",
        "paragraphs": [
          "The Corsa D ran from 2006 to 2014 on the old GM platform, with the F17 five-speed in most cars and the smaller F13 behind the 1.0, plus the 1.3 CDTi diesel and the 1.7 CDTi at 125 to 130PS in SRi and SXi trims through the earlier part of the D's life. The Corsa E, 2014 to 2019, brought the B-series petrols: the 1.0 Turbo three-cylinder ecoFLEX, the 1.4 Turbo, and the VXR the table above covers. The Corsa F, 2019 onwards, is not a Vauxhall design underneath at all. It sits on the PSA, now Stellantis, CMP platform shared with the Peugeot 208, running the EB2 1.2 PureTech and, on early UK cars, a 1.5 BlueHDi diesel.",
          "That split matters more here than on most model ranges, because a Corsa D and a Corsa F do not share an ECU family at all. The GM-era cars run Delphi and Bosch units on Vauxhall's own calibration; the Corsa F runs the PSA Bosch MD1 generation, the same hardware and file structure as a 208. It is why a quoted price for 'a Corsa remap' with no generation attached tells you nothing. On Corsa F PureTech cars we will also ask about the wet timing belt, because the belt runs in the oil and can shed material into the oil pickup as it ages. If yours has not been looked at, that comes before any talk of tuning."
        ]
      },
      {
        "heading": "Insurance: the part Corsa owners get wrong",
        "paragraphs": [
          "On a diesel estate or a work van, insurance is a footnote. On a Corsa it is often the deciding factor. Declaring the map is not the hard part. The answer you get back is. A lot of Corsas are insured on telematics or black box policies for drivers under 25, and in our experience those are the policies most likely to refuse a modified car outright rather than simply re-rate it. On a first or second car the premium increase can also be larger in pounds than the remap itself, which is a sum that almost never arises on the vans and estates we normally map.",
          "So ring your insurer or broker before you book. Ask specifically whether they will cover an ECU remap with the DPF and emissions equipment left in place, which is all we do on road cars. If the answer is no, or the extra premium costs more than the map, do not do it. On a telematics policy an undeclared map is as likely to get the policy cancelled as it is to get a claim refused, and a cancelled policy on your record at twenty follows you into every quote for years, which costs far more than the premium rise you were trying to avoid. If the Corsa is on PCP or a lease it is not yours to modify either, so check the agreement first. We keep a backup of your original file, so putting it back to stock for handback is straightforward."
        ]
      },
      {
        "heading": "Is it worth the money on a car worth two grand?",
        "paragraphs": [
          "Stage 1 remaps start from £220, and every car gets a paid diagnostic health check before we touch the ECU rather than a free scan. On a late Corsa F that is a normal accessory spend. On a 2011 Corsa D 1.2 worth a couple of thousand pounds, it is roughly a tenth of the car's value for four or five bhp. The Corsas where the money genuinely stacks up are the 1.4 Turbo, where the percentage gain is the largest in the range, the 1.3 CDTi on a long daily commute, and the VXR.",
          "The Corsas where it does not are every naturally aspirated car, and any Corsa carrying an existing fault. A rough idle, a slipping clutch, a rattly chain or a DPF light means the money goes on fixing that first, and the paid health check exists to catch exactly that before a file goes anywhere near the ECU. One practical point specific to this model: a lot of Corsas are shared with a parent or a partner, or live at the far end of the county from us. Mobile remapping saves an owner in Plymouth or Barnstaple a round trip to the Totnes workshop, which on a car at this end of the market is a real fraction of a month's fuel budget rather than a rounding error."
        ]
      },
      {
        "heading": "Gearboxes, clutches and where the extra torque actually lands",
        "paragraphs": [
          "The F17 five-speed fitted to most 1.2 and 1.4 Corsas, and the smaller F13 behind the 1.0, is a light-duty box matched to light-duty torque. At Stage 1 levels on a 1.4 Turbo it copes, but a tired clutch will not hide. The extra 60Nm in the table above finds a worn friction plate quickly, and on a Corsa that has spent five years doing hill starts on the climb up Fore Street out of the bottom of Totnes, that clutch is often already halfway through its life. If yours judders or the bite point has crept up, deal with it before the map, not after. Corsa D VXR and 1.7 CDTi cars use the M32 six-speed instead, which has a well-documented bearing weakness, so listen for a whine on the overrun before you add torque to it.",
          "The Corsa D Easytronic is the one to be careful with. It is a robotised single-clutch manual rather than a true automatic, its actuator and its clutch are both common failure points, and it does not enjoy being asked for more. At the other end of the range, the Corsa F 1.2 Turbo 130 came with the EAT8 eight-speed automatic, a proper torque converter box that is comfortable at Stage 1 and, in our experience, tends to hunt between gears less afterwards because there is more mid-range for it to work with."
        ]
      },
      {
        "heading": "The 1.3 CDTi: the Corsa where MPG, not power, is the reason to map it",
        "paragraphs": [
          "The 1.3 CDTi is the GM and Fiat small diesel, the MultiJet unit rather than a Vauxhall design, and at 95PS it is the Corsa where an economy-biased map earns its keep. The gain shows up as torque low down, which in Devon terms means fewer downshifts on the long climb up Telegraph Hill on the A380 and on the pull out of Totnes towards Buckfastleigh. Read the 'up to 15%' figure in the table for what it is, a best case on steady long-distance running. In our experience the typical real-world improvement is single figures rather than fifteen percent, and it depends far more on how the car is driven than on the file. A Corsa that only does short town trips will see none of it, because the engine never spends time in the conditions where the saving happens.",
          "That same short-journey pattern is what blocks the filter on these cars. The 1.3's DPF is small and sits close to the engine, so it loads up faster on a school run than a bigger diesel's would, and a replacement costs a serious fraction of what a Corsa D is now worth. A map does nothing for a filter that is already full, so if your CDTi is in limp mode or showing a DPF warning, that is a cleaning job first. Cleaning is off-vehicle at our Totnes workshop from £210, never mobile and never on the car, and on a Corsa worth a couple of grand that price is the difference between keeping it and writing it off against the cost of a new filter. Get the filter sorted, confirm the car is healthy, then talk about a map."
        ]
      }
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
