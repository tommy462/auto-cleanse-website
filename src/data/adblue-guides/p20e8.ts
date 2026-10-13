import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-fault-codes/p20e8',
  kind: 'fault-code',
  seoTitle: 'P20E8 Reductant Pressure Too Low Explained | Auto-Cleanse',
  metaDescription:
    'P20E8 means the AdBlue pump can\'t build or hold pressure. The real causes, how the pump, lines and injector are tested, and why it leads to a countdown.',
  breadcrumb: 'Fault code P20E8',
  h1: 'Fault code P20E8:',
  h1Accent: 'AdBlue pressure too low',
  intro:
    'P20E8 means the AdBlue pump has not built, or could not hold, the pressure the system asked for, so it can\'t dose properly. The code names the symptom, not the failed part. Left alone, it leads to a countdown to no-start or a similar restriction, so get it tested rather than cleared.',
  quickAnswer: [
    {
      label: 'What it means',
      text: 'Pressure in the line to the AdBlue injector is below target. The generic SAE description is "Reductant Pressure Too Low".',
    },
    {
      label: 'Is it the pump?',
      text: 'Sometimes. A starved inlet, frozen fluid, heater faults, leaks, air and contaminated AdBlue give the same code. Test before buying parts.',
    },
    {
      label: 'Can I keep driving?',
      text: 'Usually, for now. On Euro 6 cars and light vans, if dosing isn\'t put right within 50 km of the warning, the rules require a no-start countdown, a speed limit or similar.',
    },
    {
      label: 'What to do now',
      text: 'Don\'t keep clearing it. Note every code and the exact dash message, then call us with your reg.',
    },
  ],
  sections: [
    {
      heading: 'What P20E8 is telling you',
      paragraphs: [
        'A pump draws AdBlue from the tank and holds it under pressure in the line to the dosing injector in the exhaust. A sensor reports that pressure to the control unit. If the reading stays below target for longer than the software allows, it stores P20E8.',
        'Makes and scan tools word it differently: reductant, AdBlue or DEF pressure too low, or just low pressure. Some add a suffix to the code with extra detail. The meaning is the same.',
        'It is not a pressure sensor circuit fault: those have their own codes, P204A to P204D. With P20E8 the reading passes those checks and is simply low, so the job is finding out why.',
      ],
    },
    {
      heading: 'What causes low AdBlue pressure',
      paragraphs: [
        'Anything that stops the pump getting fluid, stops it pushing, or lets pressure escape can set this code.',
      ],
      bullets: [
        'Pump or delivery module: a worn or failing pump can\'t reach target. A pump with an electrical or control fault may also store a pump code such as P208A or P208B.',
        'Blocked supply: crystallised AdBlue or debris in the tank pick-up, filter or pump inlet starves the pump.',
        'Frozen fluid: AdBlue freezes at about minus 11°C. The system waits for its heater to thaw enough fluid before it primes, so on a cold morning it may not get there.',
        'Heater faults: if the heater isn\'t working, frozen fluid stays frozen. Heater codes such as P20B9 may be stored alongside.',
        'Leaks: a split line, a loose or crystal-crusted connector, the pump outlet, or an injector that doesn\'t seal. Wetness or white crystals around a joint point to a leak.',
        'Level and quality: a very low tank, the wrong fluid, or AdBlue contaminated with diesel or another oil-based product. A Stellantis service bulletin lists P20E8 among the codes this contamination can cause.',
        'Air in the system: after the tank has run dry, or after a new pump, tank or line is fitted. Stellantis and General Motors bulletins describe P20E8 setting soon after a new pump or tank, and call for the system to be bled or primed.',
        'A pressure sensor that reads low: it can pass its circuit checks and still set the code on a healthy pump, which is why the reading is checked against a gauge where possible.',
      ],
      note: 'On some vans the pump, heater and level sender are one assembly inside the tank; on others the pump is a separate module. That changes the repair, not the diagnosis.',
    },
    {
      heading: 'How P20E8 is diagnosed',
      paragraphs: [
        'The first question is whether the pump can\'t build pressure, or builds it and then loses it. That gets answered before any parts are ordered.',
      ],
      steps: [
        {
          title: 'Read everything first',
          body: 'All stored codes, not just P20E8, plus the freeze-frame data showing temperatures and conditions when it set. A report is saved before anything is cleared.',
        },
        {
          title: 'Check the fluid and look for leaks',
          body: 'Tank level, a quality check of the AdBlue, and a close look along the pump, lines and injector for wet joints or crystals.',
        },
        {
          title: 'Live data and actuator tests',
          body: 'Commanded against actual pressure, tank temperature and heater operation. Then the pump, heater and injector, and the line purge where fitted, are run from the scan tool to see each respond.',
        },
        {
          title: 'Pressure build and hold test',
          body: 'Never reaching target points to the supply, the pump or air. Reaching it then falling away with the injector shut points to a leak or a leaking injector. Where the system allows, a gauge confirms the sensor is telling the truth.',
        },
        {
          title: 'Dosing quantity test',
          body: 'The injector doses into a measuring container during a scan-tool routine. If the routine aborts because pressure won\'t build, it points back to the pump once leaks and air are ruled out. If it runs but the amount is outside the maker\'s figure, the injector is suspect.',
        },
        {
          title: 'Repair, bleed and prove it',
          body: 'The system is bled or primed, codes are cleared, and the maker\'s check routine and a road test confirm it builds pressure and doses.',
        },
      ],
    },
    {
      heading: 'Can you keep driving with P20E8?',
      paragraphs: [
        'Usually the van drives normally at first. The trouble is what comes next. Under the type-approval rules for Euro 6 cars and light vans, if dosing is interrupted and not put right within 50 km of the warning, the driver inducement system has to come into play.',
        'Depending on the make, that can mean a countdown to no restart, no start after refuelling, or a speed restriction. The same rules say it must not switch itself off until the cause is fixed. Heavier vans approved under the heavy-duty rules have their own warning and inducement system, with different triggers.',
        'Then there is the MOT. On diesels first used from 1 July 2008, an engine warning light showing a fault is a major defect.',
      ],
      note: 'If a countdown is already showing, call before it reaches zero. A van that still starts is far easier to diagnose and repair.',
    },
    {
      heading: 'Codes you may see with P20E8',
      paragraphs: [
        'The combination matters. P20E8 alone after a hard frost reads very differently from P20E8 with a pump circuit code.',
      ],
      bullets: [
        'P20E9, reductant pressure too high: the opposite reading, with different causes and a different set of checks.',
        'P204A to P204D, reductant pressure sensor circuit: fixed first, because until then the pressure reading can\'t be trusted.',
        'P208A and P208B, reductant pump control circuit and pump control performance: these point at the pump or the way it is driven.',
        'P20B9 and other heater codes: a heater fault can leave the fluid frozen.',
        'P204F, reductant system performance: a broader code for the system not doing what it was told.',
        'P20EE, SCR NOx catalyst efficiency below threshold: can follow once dosing stops, because NOx is no longer being reduced.',
      ],
    },
  ],
  costFactors: [
    'Which part is at fault: a connector or line, a heater, the pump module, the dosing injector or the whole tank assembly',
    'Whether the pump is a separate part or built into the tank on your vehicle',
    'Whether the AdBlue has been contaminated, which can mean replacing several parts rather than one',
    'Access to the tank, under-floor lines and exhaust-mounted injector on your van',
    'Whether crystallised parts can be cleaned or need replacing',
    'Any bleed, coding or test routines the maker requires after the repair',
  ],
  faqs: [
    {
      q: 'Is P20E8 always a failed AdBlue pump?',
      a: 'No. The pump is one cause, but the same code comes from frozen fluid, heater faults, leaks, a starved inlet, air and contaminated AdBlue. A pressure and dosing test shows which.',
    },
    {
      q: 'P20E8 came on in a cold snap. Will it go away?',
      a: 'It can, if frozen fluid was the only cause and the system builds pressure once it has thawed. If it keeps coming back on cold mornings, the heater and its wiring need testing.',
    },
    {
      q: 'Can I just clear P20E8?',
      a: 'Clearing it doesn\'t fix the cause, so it comes back if the fault is still there, and a basic code reader may not cancel a countdown. Save or write down the codes first, because they help with diagnosis.',
    },
    {
      q: 'Will topping up the AdBlue fix P20E8?',
      a: 'Only if the tank was low enough for the pump to draw air, and even then the system may need priming before the code clears. If diesel or the wrong fluid went in, don\'t add more or drive further: call us first.',
    },
    {
      q: 'Will my van pass its MOT with P20E8?',
      a: 'Not if it has put the engine warning light on. For diesels first used from 1 July 2008, an engine warning light showing a fault is a major defect.',
    },
    {
      q: 'What is the difference between P20E8 and P20E9?',
      a: 'P20E8 is pressure too low, P20E9 pressure too high. Low suggests the pump is starved, weak or losing fluid; high suggests fluid isn\'t getting away as it should, or a pump control or sensor fault, so the checks differ.',
    },
  ],
  related: [
    '/adblue-countdown-no-start',
    '/blog/adblue-crystallisation-and-dosing-faults',
    '/adblue-fault-codes/p204f',
    '/adblue-repair/peugeot-citroen-vauxhall-adblue-tank',
    '/adblue-fault-codes/p20ee',
    '/adblue-repair',
  ],
  sources: [
    'SAE International - J2012 diagnostic trouble code definitions',
    'FCA US (Stellantis) - STAR case S1925000008, P20E8 and P208B: trapped air, leaks at line connections and the dosing quantity test',
    'FCA US (Stellantis) - STAR case S1425000019, AdBlue (DEF) system codes caused by hydrocarbon contamination',
    'General Motors - bulletin 24-NA-020 and TechLink, P20E8 and crystallised fluid at the injector supply pipe',
    'UK legislation - Commission Regulation (EU) 2017/1151, Annex XVI: reagent warning and driver inducement',
    'UK legislation - Commission Regulation (EU) No 582/2011, Annex XIII: heavy-duty driver warning and inducement',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
    'Vauxhall - What is AdBlue: freezing point and tank heaters',
  ],
  updated: '2026-10-13',
  messageTopic: 'Fault code P20E8',
  firstHandTodo: [
    'A scan-tool screenshot of P20E8 with live commanded vs actual AdBlue pressure from a real job, VIN masked',
    'Photos of white AdBlue crystals at a leaking line connector or injector on a real van, before and after the repair',
    'A photo of a dosing quantity test (injector dosing into a measuring container) from a real job',
    'A short real case with customer permission: the van, the codes, and which test found the cause (heater, leak, pump or air)',
  ],
};

export default guide;
