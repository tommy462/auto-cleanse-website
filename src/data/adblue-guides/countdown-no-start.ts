import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-countdown-no-start',
  kind: 'symptom',
  seoTitle: 'AdBlue No-Start Countdown: What to Do Now | Auto-Cleanse',
  metaDescription:
    '"Starting impossible in X miles" or "No start in X miles"? Why the AdBlue countdown starts, what to do before it hits zero, and why a reset is not a fix.',
  breadcrumb: 'AdBlue countdown and no start',
  h1: 'AdBlue countdown or no start:',
  h1Accent: 'what to do now',
  intro:
    'A message such as "Starting impossible in X miles" means the AdBlue system is low, has poor fluid or has found a fault, and the vehicle is counting down to the point where it will not restart. Until it reaches zero you can normally still drive, so use those miles to get somewhere safe and book the repair. A top-up only helps if the tank is genuinely low.',
  quickAnswer: [
    {
      label: 'What it means',
      text: 'The countdown is a restriction the type-approval rules require after low fluid, poor fluid or an SCR fault. It is not the fault itself.',
    },
    {
      label: 'Can you keep driving?',
      text: 'Usually, until it reaches zero. After that the engine will not restart once switched off, so choose where you stop.',
    },
    {
      label: 'Top up or not?',
      text: 'Only if the level is genuinely low or the message asks for AdBlue. Fluid will not clear a fault.',
    },
    {
      label: 'Clear the codes?',
      text: 'No. The countdown comes back if the fault is still there, and you lose clues to the cause.',
    },
    {
      label: 'Already stopped?',
      text: 'On a fast road, get yourself and any passengers to safety first. Then call with your reg, the exact message and where the vehicle is.',
    },
  ],
  sections: [
    {
      heading: 'Why the vehicle is counting down',
      paragraphs: [
        'Cars and vans that use AdBlue are built to type-approval rules, still part of UK law, which say the vehicle must not keep running without working NOx control. The rules call this a driver inducement system. The countdown is deliberate.',
        'There are two ways in. The first is level: after an earlier low AdBlue warning, the countdown starts once the AdBlue left would only last around a tank of fuel\'s driving, or less, depending on the make.',
        'The second is a fault. If the system sees fluid that is not to specification, dosing that has stopped, AdBlue use well off what the engine asks for, or too much NOx at the sensors, it warns you first. If it is not put right within 50 km (about 30 miles) of that warning, the countdown starts, set at roughly the distance the vehicle covers on a full tank of fuel.',
        'Some vehicles count down engine starts rather than miles. Others also restrict speed, to no more than 50 km/h (about 30 mph) shortly before restarts are blocked. Heavier vans approved to the heavy-duty standard follow separate rules.',
      ],
    },
    {
      heading: 'What the message looks like',
      paragraphs: [
        'Wording varies by make, model and year. You might see "Starting impossible in X miles", "No start in X miles", "No engine start in X km" or "Engine start not possible". Volkswagen pairs its AdBlue level lamp with "No engine start in XXX km". Mercedes-Benz uses "No start in" with a distance, sometimes alongside "Check AdBlue".',
        'The rules expect the warning to give the reason, such as a low level, incorrect AdBlue or a dosing fault, so read the whole message, not just the number. If it says top up or refill, fluid is the first step. If it mentions a fault or the emissions system, more AdBlue will not clear it. Our AdBlue warning light guide covers the message types in more detail.',
      ],
    },
    {
      heading: 'What to do while it is still counting',
      paragraphs: ['The miles left are your window to sort it on your terms.'],
      steps: [
        {
          title: 'Record it',
          body: 'Photograph the dash. Note whether it counts miles, kilometres or starts, and how fast it drops.',
        },
        {
          title: 'Top up only if it is low',
          body: 'Add AdBlue if the gauge is low or the message asks for it. Use fluid made to ISO 22241 from a sealed container, never water or additives.',
        },
        {
          title: 'Leave the codes alone',
          body: 'Clearing them fixes nothing, and the countdown comes back if the fault is still there.',
        },
        {
          title: 'Book the repair before zero',
          body: 'A vehicle that still drives gives you far more options than one stuck where it stopped.',
        },
      ],
      note: 'If the countdown started soon after a top-up, tell us where that fluid came from. Wrong or contaminated fluid changes the repair.',
    },
    {
      heading: 'Safety first: get off the live carriageway',
      paragraphs: [
        'If the count is in its last few miles, or the van has dropped into a speed-limited mode, treat it as a breakdown. Leave the motorway or fast road at the next exit or service area, and only switch off somewhere you can safely leave the vehicle.',
        'Do not stop on a hard shoulder or verge just to check something. It may not restart, and the Highway Code warns that hard shoulders give less protection than other places to stop.',
        'If it has already stopped somewhere unsafe, follow Highway Code rules 275 to 277: hazard lights on, get out on the side away from traffic if it is safe to, and wait well away from the vehicle, behind a barrier where there is one. If you are stuck in a live lane and cannot get out safely, stay in with your seat belt on and call 999.',
      ],
      note: 'Call us once you and any passengers are safe, not before.',
    },
    {
      heading: 'If it has already reached zero',
      paragraphs: [
        'Where the system blocks restarts, it does not stop an engine that is already running. The block applies the next time you switch off.',
        'If the tank ran dry, add at least the quantity your handbook gives. The rules let the system stay locked until a set minimum has gone in, and that minimum differs between makes. Park level if you can and follow the handbook\'s restart steps, as some vehicles need the ignition on for a short time before they read the new level.',
        'If a fault caused it, fluid will not help, and repeated attempts to start can flatten the battery. The fault has to be repaired where the vehicle is, or the vehicle moved to a workshop. In Devon, our own technicians attend. Outside Devon, we book a vetted independent technician near you where we have one, and we\'ll tell you on the call whether we can get someone to you.',
      ],
    },
    {
      heading: 'Why a reset is not a fix',
      paragraphs: [
        'The rules say the restriction must not switch itself off until its cause has been put right. A reset is allowed after a repair, so the vehicle can run up to 50 km (about 30 miles) to confirm it. If the fault is still there, the full restriction comes back.',
        'The vehicle also keeps a record. The reason for each countdown and the distance driven with it active are stored where a code reader cannot erase them, for at least 800 days or 30,000 km. You may also see a code from the P2BA7 to P2BAD group. SAE J2012 titles these "NOx Exceedence" codes by cause, such as "Empty Reagent Tank" or "Insufficient Reagent Quality". They tell you why, not which part failed.',
        'Clearing codes also wipes freeze-frame data, one of the best clues to the real fault. So we do not reset a countdown without repairing the fault. The reset is the last step of the repair, followed by a check that the system is working.',
      ],
      note: 'Emulators and deletes are no way round it. Emission control equipment that is missing, obviously modified or obviously defective is a major MOT defect, and DVSA checks lorries at the roadside for emissions cheat devices.',
    },
    {
      heading: 'What to tell us when you call',
      paragraphs: ['These let us give you a straight answer first time.'],
      bullets: [
        'Your registration and where the vehicle is now.',
        'The exact message and number, or a photo of the dash.',
        'Whether it is still counting or has reached zero.',
        'When you last topped up, how much, and where the fluid came from.',
        'Any fault codes, and whether anyone has cleared them.',
        'Recent work on the AdBlue or exhaust system, such as a new NOx sensor.',
        'For fleets, whether other vehicles show the same message.',
      ],
    },
  ],
  costFactors: [
    'What caused the countdown: fluid, a sensor, the dosing side or software',
    'Whether the vehicle still drives or has to be repaired where it stopped',
    'Where the vehicle is, and who can attend',
    'Whether contaminated fluid means draining and cleaning the tank',
    'Which parts, if any, your make and model needs',
  ],
  faqs: [
    {
      q: 'How long do I have once the AdBlue countdown starts?',
      a: 'It depends on the make, the model and the cause. For a fault, the rules for cars and vans set it at roughly a full tank of fuel\'s driving, but go by the number on your dash and book the repair early.',
    },
    {
      q: 'Will the engine cut out when the countdown reaches zero?',
      a: 'Where the system blocks restarts, it stops the next start, not a running engine. Some makes restrict speed near the end, so get off fast roads before the count runs out.',
    },
    {
      q: 'I topped up but it still says starting impossible. Why?',
      a: 'Some vehicles need a minimum quantity, or the ignition left on for a while, before they read the new level. If it still will not clear, a fault is the likely cause and it needs diagnosing.',
    },
    {
      q: 'Can I reset the AdBlue countdown myself?',
      a: 'A code reader may clear the codes, but if the fault is still there the countdown returns, and the vehicle keeps a record you cannot erase.',
    },
    {
      q: 'Will you just reset the countdown for me?',
      a: 'No. We find and repair the fault first, then reset the system and check the repair has worked.',
    },
    {
      q: 'Can I put water in to get me home?',
      a: 'No. Diluted or wrong fluid can set a quality fault and start a countdown of its own. Only add AdBlue made to ISO 22241.',
    },
    {
      q: 'My van has stopped on the hard shoulder and will not restart. What now?',
      a: 'Get everyone out on the side away from traffic if it is safe, and wait well away from the vehicle, behind the barrier where there is one. Use the emergency phone or a breakdown service to get the vehicle moved, then call us about the repair.',
    },
  ],
  related: [
    '/adblue-warning-light',
    '/adblue-repair',
    '/adblue-fault-codes/p20ee',
    '/adblue-repair/nox-sensor',
    '/blog/adblue-crystallisation-and-dosing-faults',
    '/adblue-repair-devon',
  ],
  sources: [
    'UK legislation - Commission Regulation (EU) 2017/1151, Annex XVI: reagent warning and driver inducement',
    'Department for Transport - The Highway Code, rules 275 to 277 (breakdowns and incidents)',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
    'SAE International - J2012 diagnostic trouble code definitions',
    'ISO - ISO 22241-1, AUS 32 (AdBlue) quality requirements',
    'Volkswagen - AdBlue level low warning lamp guidance',
    'Mercedes-Benz - service information on the "Check AdBlue" and "No start in" messages',
    'DVSA - roadside checks for lorry emissions cheat devices',
  ],
  updated: '2026-10-13',
  messageTopic: 'AdBlue no-start countdown',
  firstHandTodo: [
    'A photo of a real customer dash showing a no-start countdown message (with permission), noting make, model and the exact wording, to back up the wording examples',
    'A scan-tool screenshot from a real job showing the countdown or inducement status alongside the stored codes (for example a P2BA code), VIN masked',
    'The starting countdown figures Tom has actually seen on the vans he works on most, to replace the general "varies by make" line',
    'A short anonymised case note of a real roadside no-start: the message, what caused it, and how the vehicle was got going',
    'Which makes needed manufacturer-level software to reset the system after a repair, from Tom\'s own jobs',
  ],
};

export default guide;
