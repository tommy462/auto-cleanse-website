import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/how-we-quote',
  kind: 'process',
  seoTitle: 'How We Quote AdBlue Repairs and Remaps | Auto-Cleanse',
  metaDescription:
    'Why we don\'t list AdBlue repair prices, what we ask when you call, who attends, and how the price is agreed with you before any repair is started.',
  breadcrumb: 'How we quote',
  h1: 'How we quote',
  h1Accent: 'AdBlue repairs and remaps',
  intro:
    'We quote your actual job, not a figure from a price list. Send us your reg and the dash warning, and we\'ll tell you what it\'s likely to be, who would attend and what happens next. The repair price is agreed before any repair, and nothing is done without your OK.',
  quickAnswer: [
    {
      label: 'Why there\'s no price list',
      text: 'The same warning can be a sensor or the catalyst. Those are very different jobs, so we price yours.',
    },
    {
      label: 'What to have ready',
      text: 'Your reg, the dash message or a photo of it, any fault codes, miles left on any countdown, and your postcode.',
    },
    {
      label: 'Who attends',
      text: 'Our own technician in Devon. Elsewhere, an independent mobile technician from our national network. We check who can get to you and ring you back with who\'s coming.',
    },
    {
      label: 'Who you deal with',
      text: 'Us, throughout. We take the payment and handle anything that isn\'t right afterwards.',
    },
  ],
  sections: [
    {
      heading: 'Why we don\'t publish AdBlue repair prices',
      paragraphs: [
        'A warning on the dash tells you the system has a problem, not which part has failed.',
        'Take fault code P20EE, which SAE J2012 defines as SCR NOx catalyst efficiency below threshold (bank 1). The cause can be a NOx sensor giving false readings, poor or contaminated AdBlue, a dosing fault, an exhaust leak ahead of the catalyst, or a catalyst that really has worn out.',
        'A sensor and a catalyst are very different bills, so any single published figure would be wrong for most people. We quote your confirmed fault instead. Our P20EE guide shows how each of those causes is ruled in or out.',
      ],
      note: 'We only quote to repair. We don\'t quote for deletes or emulators, which fail the MOT when found and can be an offence, or for clearing a countdown without fixing the fault, which just brings the warning back.',
    },
    {
      heading: 'What we ask when you call',
      paragraphs: [
        'Each question is there for a reason. If you can\'t answer one, call anyway and we\'ll work with what you have.',
      ],
      bullets: [
        'Your reg. It tells us the model and engine, which narrows down the parts that fit.',
        'The exact dash message, or a photo of it. Makes word these warnings differently, and the wording often shows whether it\'s the AdBlue level, the fluid quality or a system fault.',
        'Any fault codes, exactly as shown, and all of them rather than just the first. Generic codes from a basic reader still help.',
        'Miles left on any countdown. On many vehicles the engine won\'t restart once it reaches zero, though makers differ, so this tells us how urgent it is.',
        'Your postcode and where the vehicle is parked. This decides who can attend and whether they can work on it there.',
        'Business or private, and how many vehicles you run. It sets how we quote, and if other vehicles show the same warning we can quote them together.',
        'What\'s already been done: recent parts, a recent top-up, or anything removed or disabled in the past.',
      ],
    },
    {
      heading: 'What happens after the call',
      paragraphs: ['This is the order things happen in.'],
      steps: [
        {
          title: 'We find who can attend',
          body: 'In Devon, that\'s our own technician. Outside Devon, we check which independent mobile technician from our national network can get to you, then ring you back with who\'s coming and the price. If we can\'t get someone to you, we say so.',
        },
        {
          title: 'You know first if a diagnostic visit is needed',
          body: 'If we need to see the vehicle to find the fault, you\'ll know that before anyone sets off, along with any charge for the visit.',
        },
        {
          title: 'The repair price is agreed before the repair',
          body: 'Once the fault is confirmed, we give you the price for the repair. Nothing is repaired until you\'ve agreed it.',
        },
        {
          title: 'Nothing extra without your OK',
          body: 'If the technician finds something else once work starts, they stop and we call you. Nothing more is done until you\'ve agreed the new price.',
        },
      ],
    },
    {
      heading: 'You deal with us from start to finish',
      paragraphs: [
        'Even when an independent technician attends, your booking and your payment are with Auto-Cleanse. If something isn\'t right afterwards, call us, not the technician, and we\'ll deal with it.',
        'The terms for your job, including any warranty and when payment is due, are confirmed with your quote. Private customers also have rights under the Consumer Rights Act 2015: a repair must be carried out with reasonable care and skill, and if it isn\'t, you can ask for it to be put right at no extra cost.',
        'If the vehicle belongs to a business, give us the business name when you call so the quote and invoice are made out correctly.',
      ],
    },
    {
      heading: 'Remapping quotes',
      paragraphs: [
        'For a remap, the price depends on the engine, the ECU and how it has to be read, and what you want from the vehicle. Tell us the reg, any existing modifications and what you use it for, such as towing or heavy loads.',
        'We check a vehicle is healthy before remapping it. If it has an AdBlue, DPF or EGR fault, we\'ll quote to repair that first, because a remap doesn\'t fix an emissions fault.',
      ],
    },
  ],
  costFactors: [
    'Which part has failed: a sensor, the pump or injector, a heater, the tank, the wiring or the catalyst',
    'Whether a diagnostic visit is needed first',
    'How parts are supplied: on some makes a part only comes as a larger assembly',
    'Whether the new part needs coding with diagnostic software, which varies by make',
    'How much has to come off the vehicle to reach the part',
  ],
  faqs: [
    {
      q: 'Why won\'t you put an AdBlue repair price online?',
      a: 'Because the same warning can be a sensor, a dosing fault or the catalyst, and those are very different jobs. We\'d rather quote your actual fault.',
    },
    {
      q: 'Can you tell me anything on the phone?',
      a: 'Usually, yes. From your reg, the dash message and any codes, we can tell you what it\'s likely to be and what the next step is. The repair price is agreed once the fault is confirmed.',
    },
    {
      q: 'I don\'t have any fault codes. Can you still help?',
      a: 'Yes. Your reg and a photo of the dash message are enough to start. If the codes need reading, that becomes part of the diagnosis.',
    },
    {
      q: 'Who will actually come out?',
      a: 'In Devon, our own technician. Outside Devon, an independent mobile technician from our national network, booked and managed by us. Call and we\'ll check who can get to you, then ring you back with who\'s coming and the price.',
    },
    {
      q: 'If an independent technician does the work, who do I pay?',
      a: 'You pay Auto-Cleanse. You deal with us throughout, and if anything isn\'t right afterwards, you call us.',
    },
    {
      q: 'Can you quote and invoice my business?',
      a: 'Yes. Give us the business name when you call and the quote and invoice are made out to it. If several of your vehicles need work, mention them all on the same call.',
    },
    {
      q: 'What warranty do I get?',
      a: 'We confirm the terms for your job with your quote, before you agree to anything. Private customers also have rights under the Consumer Rights Act 2015.',
    },
  ],
  related: [
    '/adblue-repair',
    '/adblue-fault-codes/p20ee',
    '/adblue-countdown-no-start',
    '/adblue-repair-devon',
    '/adblue-delete-law',
    '/ecu-remapping',
  ],
  sources: [
    'SAE International - J2012 diagnostic trouble code definitions',
    'UK legislation - Commission Regulation (EU) 2017/1151, Annex XVI: reagent warning and driver inducement',
    'UK legislation - Consumer Rights Act 2015, sections 49 and 55 (services)',
    'UK legislation - Road Vehicles (Construction and Use) Regulations 1986, regulation 61A',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
  ],
  updated: '2026-10-13',
  messageTopic: 'I\'d like a quote',
  firstHandTodo: [
    'Confirm the warranty on AdBlue repairs (parts and labour, and whether it differs when an independent technician does the work), then add it to "You deal with us" and the warranty FAQ.',
    'Confirm when payment is taken (deposit, on completion, or account terms for business customers), and whether Auto-Cleanse is VAT-registered; if so, add back that business quotes can be ex-VAT and private quotes include VAT (removed until confirmed).',
    'Decide whether to state response times in Devon and outside Devon; only add them once they can be met reliably.',
    'Confirm whether diagnostic visits are charged and how, so the diagnostic-visit step can say it plainly.',
    'Add one real, anonymised quote example: the dash photo and codes a customer sent, what we said was likely on the call, and what the confirmed fault turned out to be (reg and VIN masked).',
  ],
};

export default guide;
