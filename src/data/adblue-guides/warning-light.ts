import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-warning-light',
  kind: 'symptom',
  seoTitle: 'AdBlue Warning Light: Low, Quality or Fault? | Auto-Cleanse',
  metaDescription:
    'AdBlue light on, even after filling? How to tell a low level from a quality or SCR fault, what amber, red and flashing mean, and what to do next.',
  breadcrumb: 'AdBlue warning light',
  h1: 'AdBlue warning light:',
  h1Accent: 'low level, bad fluid or a fault?',
  intro:
    'An AdBlue warning means one of three things: the tank is low, the fluid in it is wrong, or part of the SCR system has a fault. Only a low level is fixed by topping up. The other two need diagnosing, and if they are left they can lead to a countdown and a no-start.',
  quickAnswer: [
    {
      label: 'Low level',
      text: 'Top up with AdBlue to ISO 22241. The first low warning comes well before the tank is empty, so a top-up soon is normally all it needs.',
    },
    {
      label: 'Quality or system fault',
      text: 'More AdBlue won\'t clear it. It needs the fault codes and live data reading, and restrictions can start within about 30 miles, so call before you drive much further.',
    },
    {
      label: 'Still on after filling',
      text: 'Give the system time to register the new level and check you added enough. If it stays on after a drive, get it checked.',
    },
  ],
  sections: [
    {
      heading: 'Which warning have you got, and what to do',
      paragraphs: [
        'The wording on the dash is your best clue, so read the whole message or photograph it before you switch off. Makes word it differently, but nearly every AdBlue warning is one of these.',
      ],
      bullets: [
        'Low level: a message to refill or top up AdBlue, often with a range in miles. Top up with AdBlue that meets ISO 22241, never water or additives. This is the only warning a top-up fixes.',
        'Quality: a message about incorrect or poor-quality AdBlue. It can mean diluted or contaminated fluid, but the rules let makers judge quality from NOx sensor readings, so a sensor or dosing fault can bring up the same message. Don\'t keep topping up and driving. Under the rules for cars and vans, if it isn\'t put right within 50 km (about 30 miles), restrictions such as a no-start countdown can begin.',
        'System fault: a message about an AdBlue, SCR or emissions fault, sometimes with the engine management light. Something in the system has failed or is reading out of range. If dosing has stopped, the same 30-mile rule applies, so note the message and any mileage shown and get the codes read soon.',
        'Countdown: miles or starts remaining. Treat it as urgent, book the repair while it still starts, and avoid switching off anywhere you can\'t leave the vehicle.',
      ],
      note: 'A code reader confirms which it is. Generic codes include P203F (reductant level too low) and P207F (reductant quality performance), though manufacturer software can word them differently.',
    },
    {
      heading: 'Amber, red or flashing: what it tells you',
      paragraphs: [
        'Dashboard lights follow a broad international colour code: amber or yellow means caution or a system malfunction, red means act now. AdBlue warnings mostly follow it, but makes differ in symbols, colours and wording, so check your handbook.',
        'The rules for cars and vans also require the warning to escalate as the tank nears empty and restrictions get closer. Depending on the make, that can mean a light that starts flashing, a repeating chime, a colour change or a count of miles or starts left. Some heavier vans are approved under the heavy-duty rules, which work differently.',
      ],
      bullets: [
        'Steady amber with a range shown: usually the early low-level stage. Top up soon. If the message mentions a fault, book it in.',
        'Flashing, red, chimes or a countdown: the warning has escalated and the vehicle is heading for a speed or power limit or a no-start, depending on the model.',
        'AdBlue light plus engine management light: this points to a stored emissions fault, not just a low tank.',
      ],
    },
    {
      heading: 'AdBlue light on after filling',
      paragraphs: [
        'If you have topped up and the warning is still there, check these before assuming the worst.',
      ],
      bullets: [
        'It hasn\'t registered yet. Some vehicles only update the level after the ignition has been on for a while or after a short drive. Your handbook gives the procedure.',
        'Not enough went in. Once restarts are blocked, the rules don\'t let the block lift until the fault is fixed or a minimum amount has gone in: at least 10 per cent of the tank, or enough to last one and a half tanks of diesel, depending on the system. If the tank ran dry, a small bottle may not do it.',
        'The level sender has failed. If the gauge or range doesn\'t change after a proper fill, suspect the sender. On some vans it is part of a combined tank unit with the pump and heater.',
        'It wasn\'t only a level warning. A quality or system fault can sit alongside a low level, so filling up clears one warning and leaves the other.',
      ],
    },
    {
      heading: 'When topping up won\'t fix it',
      paragraphs: [
        'A quality or system fault, or a low-level warning that keeps coming back, means the SCR system needs diagnosing. Different faults bring up the same message, so the codes and live data matter more than the wording. Typical causes:',
      ],
      bullets: [
        'NOx sensors before and after the SCR catalyst.',
        'The dosing pump, or an AdBlue injector blocked by urea crystals.',
        'Tank and line heaters. AdBlue freezes at about minus 11°C, so a heater fault can show up first on a cold morning.',
        'The level or quality sensor in the tank.',
        'Wiring and connectors under the vehicle, exposed to road spray and exhaust heat.',
        'Contaminated fluid, which means draining and cleaning the system.',
        'Engine-side faults, such as EGR problems, that change how much NOx the SCR system has to deal with.',
      ],
    },
    {
      heading: 'Why the light comes back after a reset or a cheap sensor',
      paragraphs: [
        'Clearing the codes fixes nothing. The engine computer re-runs its checks as you drive, and the light returns as soon as the fault is seen again. That can take more than one journey, so a clear can look like a fix at first. The system also keeps a record of why restrictions were triggered that a code reader can\'t erase.',
        'A cheap part can do the same. A NOx sensor or tank sender that isn\'t right for the vehicle, or isn\'t built to the original specification, can give readings the engine computer rejects. Some new parts also need coding or an adaptation reset before the system accepts them.',
        'And sometimes the replaced part was never the cause. A NOx sensor can report a problem that started with dosing, bad fluid or the engine itself.',
      ],
      note: 'We diagnose before fitting parts, then confirm the repair on a drive with live data, so the fault is fixed rather than just cleared.',
    },
  ],
  costFactors: [
    'Which fault it is: a level sender is a different job from a NOx sensor or a dosing pump.',
    'Whether the part is replaced on its own or is built into a combined tank unit, as on some vans.',
    'Whether the system is contaminated and needs draining and cleaning.',
    'Whether new parts need coding or adaptation after fitting.',
    'Whether the vehicle still drives or is already in a no-start, and where it is.',
  ],
  faqs: [
    {
      q: 'Can I keep driving with the AdBlue warning light on?',
      a: 'With a low-level warning, yes for now, as the first warning comes well before the tank is empty, but top up soon. With a quality or fault warning, get it checked quickly, because restrictions such as a no-start countdown can begin within about 30 miles.',
    },
    {
      q: 'Why is my AdBlue light still on after filling up?',
      a: 'It may not have registered the new level yet, you may not have added enough, or the warning was a fault rather than a low level. If it is still on after a drive, have the codes read.',
    },
    {
      q: 'Is an amber AdBlue light different from a red or flashing one?',
      a: 'Broadly, amber means sort it soon and red means act now, but makes use different colours and symbols. Flashing, chimes or a countdown mean the warning has escalated.',
    },
    {
      q: 'Will an AdBlue warning fail the MOT?',
      a: 'The MOT has no separate check for the AdBlue light. But an engine management light showing a fault is a major fail on diesels first used from 1 July 2008, and SCR faults can bring it on.',
    },
    {
      q: 'Can a garage just reset the AdBlue warning?',
      a: 'A reset after a genuine repair is normal. Without a repair the fault is detected again and the warning returns.',
    },
    {
      q: 'I put diesel or water in the AdBlue tank. What now?',
      a: 'Don\'t start the engine, as running it draws the wrong fluid through the system. The tank and lines will need draining and cleaning, and parts that have had it through them may need replacing.',
    },
    {
      q: 'Can the warning just be switched off instead?',
      a: 'No. Coding out the warning or the system only hides the fault. A missing or obviously modified system is a major MOT fail and running without it can be an offence depending on the vehicle, so we repair the fault instead.',
    },
  ],
  related: [
    '/adblue-countdown-no-start',
    '/adblue-repair/nox-sensor',
    '/adblue-fault-codes/p20ee',
    '/adblue-repair/peugeot-citroen-vauxhall-adblue-tank',
    '/blog/adblue-crystallisation-and-dosing-faults',
    '/adblue-repair',
  ],
  sources: [
    'UK legislation - Commission Regulation (EU) 2017/1151, Annex XVI: reagent warning and driver inducement',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
    'ISO - ISO 22241-1, AUS 32 (AdBlue) quality requirements',
    'ISO - ISO 2575, symbols and colour coding for controls, indicators and tell-tales',
    'SAE International - J2012 diagnostic trouble code definitions',
  ],
  updated: '2026-10-13',
  messageTopic: 'AdBlue warning light',
  firstHandTodo: [
    'A photo of a real dash showing an AdBlue quality or system fault message, next to the scan-tool codes read from the same vehicle (reg and VIN masked).',
    'A real job where the light stayed on after a top-up and the cause was a failed level sender or tank unit, with the codes found and what was replaced.',
    'A real vehicle that came in after a code clear or a cheap NOx sensor, showing the warning returning and the live NOx readings before and after the proper repair.',
    'A photo of contaminated fluid drained from an AdBlue tank (diesel or water) beside clean AdBlue, from a real job.',
    'Handbook-checked refill minimums and refill-registration steps for the vans Tom sees most, to make the "after filling" section model-specific.',
  ],
};

export default guide;
