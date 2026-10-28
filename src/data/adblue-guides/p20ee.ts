import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-fault-codes/p20ee',
  kind: 'fault-code',
  seoTitle: 'P20EE: SCR NOx Catalyst Efficiency Below Threshold | Auto-Cleanse',
  metaDescription:
    'P20EE means the SCR catalyst is removing too little NOx. It is a result, not a part. The checks to make before buying a catalyst, and how we repair it.',
  breadcrumb: 'Fault code P20EE',
  h1: 'P20EE fault code:',
  h1Accent: 'check before you buy a catalyst',
  intro:
    'P20EE means the engine computer has decided the SCR catalyst is removing less NOx than it should. It is a result, not a part. Sensors, dosing, the fluid, leaks and software can all set it, so prove the cause before anyone sells you a catalyst.',
  quickAnswer: [
    {
      label: 'What it means',
      text: 'The generic definition is "SCR NOx Catalyst Efficiency Below Threshold Bank 1". The NOx reading after the catalyst hasn\'t dropped as far as the engine computer expects.',
    },
    {
      label: 'Is the catalyst finished?',
      text: 'Not necessarily. The manufacturer procedures we\'ve read rule out the fluid, dosing, leaks, sensors and software before they condemn the catalyst.',
    },
    {
      label: 'Can I keep driving?',
      text: 'Usually, for now. Depending on the make, it can bring an AdBlue warning, reduced power or a "no start in X miles" countdown, so don\'t leave it.',
    },
    {
      label: 'What to do now',
      text: 'Note the dash message and any codes a scan has shown, and don\'t clear them. Then call us with your reg.',
    },
  ],
  sections: [
    {
      heading: 'Why P20EE is a result, not a part',
      paragraphs: [
        'Your vehicle has one NOx sensor before the SCR catalyst and another after it. While AdBlue is being dosed, the engine computer compares the two. If the reading after the catalyst doesn\'t fall by as much as it should, it logs P20EE.',
        'So the code says the numbers didn\'t add up, not which number is wrong. A sensor reading high, too little or too much AdBlue, weak fluid or a leak can all look like a worn catalyst. On a four-cylinder van engine there is one exhaust, so "bank 1" just means that system.',
        'The check only runs in set conditions, such as the catalyst being inside a temperature window, dosing active and no DPF regeneration under way. Mercedes-Benz notes that on the OM651 Sprinter it commonly sets during steady motorway cruising.',
      ],
      note: 'Euro 6 type-approval rules let manufacturers use the exhaust NOx sensors to detect poor AdBlue or under-dosing. A problem found that way must bring a warning and, if it isn\'t put right, a restriction such as a no-start countdown. That is why P20EE comes with a countdown on some vans.',
    },
    {
      heading: 'What can set P20EE',
      paragraphs: [
        'These are the causes to rule out before the catalyst. Most can be tested with the catalyst still fitted.',
      ],
      bullets: [
        'NOx sensor plausibility. A sensor that reads high or drifts makes good conversion look poor.',
        'Dosing injector faults. Crystals, a poor spray or a leaking seal change how much AdBlue reaches the exhaust. A white crust on the tip isn\'t proof on its own: a bulletin for Ram diesels (Stellantis) says to run a quantity test before replacing the injector.',
        'Over-dosing. Excess AdBlue lets ammonia slip past the catalyst, and NOx sensors also respond to ammonia, so the reading after the catalyst goes up. Mercedes-Benz lists both for P20EE on the Sprinter.',
        'AdBlue quality. Diluted, old or contaminated fluid converts less NOx. ISO 22241 sets AdBlue at 32.5 per cent urea, and a refractometer checks it in minutes.',
        'Exhaust and intake leaks. A leak ahead of the catalyst or near a sensor upsets the readings the calculation depends on. Mercedes-Benz has technicians smoke test the intake, charge air and exhaust for P20EE.',
        'Engine faults upstream. EGR, boost and fuel faults change how much NOx the engine makes. Coolant or oil reaching the exhaust, for example from a failed EGR cooler or turbo, can contaminate the catalyst.',
        'Software. Manufacturers have issued engine and SCR software updates as the fix for P20EE on some models.',
        'The catalyst itself. Age and contamination do finish catalysts off. It is a real cause, just the one to prove last.',
      ],
    },
    {
      heading: 'What manufacturer bulletins show',
      paragraphs: [
        'The published P20EE bulletins we found share one theme: check the system and software before the catalyst. All four come from US filings, so treat them as patterns, not a fix for a UK van.',
      ],
      bullets: [
        'Mercedes-Benz Sprinter (907) with the OM651, 2019 to 2021 model years: update the engine and SCR control unit software first, and replace no parts unless Mercedes-Benz says to.',
        'Ram 6.7 diesel (Stellantis): check for AdBlue leaks, run an injector quantity test and test the fluid for contamination. Replace the catalyst only if all of that passes.',
        'Ford F-250 diesel, 2024 to 2025: P20EE could set falsely because of the engine computer\'s calibration. The fix was a software reprogram, not a part.',
        'Volkswagen Touareg 3.0 TDI, 2011 to 2016: check AdBlue quality, fix any other stored faults, then reset the dosing system\'s learned values and run the SCR efficiency check.',
      ],
      note: 'We haven\'t found a public P20EE bulletin for the 2.0 EcoBlue Transit, Volkswagen\'s EA288 vans or Stellantis BlueHDi vans. What applies to yours has to be checked against the VIN.',
    },
    {
      heading: 'Diagnose before you buy a catalyst',
      paragraphs: [
        'This order draws on the manufacturer procedures above, though each make sets its own sequence. Mercedes-Benz, for example, starts with software. The aim is to prove the catalyst has failed before anyone fits one.',
      ],
      steps: [
        {
          title: 'Read every code and the freeze frame',
          body: 'Codes stored with P20EE, such as NOx sensor, dosing, EGR or temperature faults, point the way. The freeze frame shows the conditions when it set.',
        },
        {
          title: 'Check the AdBlue',
          body: 'Test the concentration with a refractometer and look for contamination in the tank.',
        },
        {
          title: 'Prove the NOx sensors',
          body: 'Compare live readings before and after the catalyst, including with dosing stopped, and inspect the wiring and connectors.',
        },
        {
          title: 'Test the dosing',
          body: 'Check the injector for crystals, leaks and a sound seal, and run the quantity test the manufacturer specifies.',
        },
        {
          title: 'Look for leaks and engine faults',
          body: 'Smoke test the intake and exhaust, check EGR, boost and temperature readings, and look for coolant or oil reaching the exhaust.',
        },
        {
          title: 'Check software and bulletins',
          body: 'Find out whether newer engine or SCR software, or a bulletin, applies to your VIN.',
        },
        {
          title: 'Re-run the efficiency check',
          body: 'Reset learned dosing values where required and run the SCR efficiency check or a qualifying drive. Only if efficiency is still low after all that is the catalyst condemned.',
        },
      ],
      note: 'Clearing P20EE doesn\'t fix it. The code returns once the efficiency check runs again, and on some vans so does the countdown.',
    },
  ],
  costFactors: [
    'What the diagnosis finds: fluid, a NOx sensor, the dosing injector, a leak, software or the catalyst',
    'Whether a software update or manufacturer bulletin applies to your VIN',
    'Whether the SCR catalyst is a separate part or shares a housing with the DPF on your vehicle',
    'Where the vehicle is, and whether it can be driven or needs a technician to come to it',
  ],
  faqs: [
    {
      q: 'What does P20EE mean?',
      a: 'SCR NOx catalyst efficiency below threshold, bank 1. The engine computer has compared the NOx sensors either side of the catalyst and decided too little NOx is being removed.',
    },
    {
      q: 'Does P20EE mean I need a new catalyst?',
      a: 'Not on its own. Sensors, dosing, fluid quality, leaks and software can all set it, and the catalyst should only be condemned once those are ruled out.',
    },
    {
      q: 'Can I drive with P20EE?',
      a: 'Usually, for now. Whether it brings a countdown or reduced power depends on the make, so get it diagnosed early rather than waiting for a countdown to start.',
    },
    {
      q: 'Will a new NOx sensor fix P20EE?',
      a: 'Only if the sensor is the cause. Live readings and plausibility checks should show a faulty sensor before one is fitted.',
    },
    {
      q: 'Can I just clear the code?',
      a: 'You can, but if the cause is still there it comes back once the efficiency check runs again. Clearing it also wipes the freeze-frame data that helps find the fault.',
    },
    {
      q: 'Why did P20EE come back after a part was fitted?',
      a: 'Either the part wasn\'t the cause, or the learned dosing values weren\'t reset and the efficiency check wasn\'t re-run. We confirm the fix after the repair rather than just clearing the code.',
    },
    {
      q: 'Will P20EE fail an MOT?',
      a: 'If it has the engine warning light on, yes. The MOT manual lists an engine malfunction indicator lamp showing a fault as a major defect on diesels first used from 1 July 2008.',
    },
    {
      q: 'Can bad AdBlue cause P20EE?',
      a: 'Yes. Diluted, old or contaminated fluid converts less NOx, so the efficiency check can fail with a healthy catalyst. A refractometer test on a sample from the tank shows whether the concentration is right.',
    },
  ],
  related: [
    '/adblue-repair/nox-sensor',
    '/adblue-fault-codes/p204f',
    '/blog/adblue-crystallisation-and-dosing-faults',
    '/adblue-countdown-no-start',
    '/adblue-fault-codes/p20e8',
    '/adblue-repair',
  ],
  sources: [
    'SAE International - J2012 diagnostic trouble code definitions',
    'Mercedes-Benz AG - service information LI49.20-N-079593, P20EE on Sprinter 907 with OM651',
    'FCA US (Stellantis) - service bulletins 18-090-15 and 18-038-16, P20EE SCR NOx catalyst efficiency',
    'NHTSA - published service bulletins for P20EE (Ford TSB 25-2420, Volkswagen tech tip 26-18-01TT)',
    'SAE International - paper 2013-01-1512, cross-sensitivities of NOx sensors in SCR operation',
    'ISO - ISO 22241-1, AUS 32 (AdBlue) quality requirements',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
    'UK legislation - Commission Regulation (EU) 2017/1151, Annex XVI: reagent warning and driver inducement',
  ],
  updated: '2026-10-13',
  messageTopic: 'Fault code P20EE',
  firstHandTodo: [
    'A scan-tool screenshot of P20EE with live upstream and downstream NOx readings from a real job, VIN masked',
    'A photo of a crystallised or leaking dosing injector removed on a P20EE job, with what the quantity test showed',
    'A short real case where P20EE turned out not to be the catalyst (sensor, fluid, leak or software), with make, engine and what fixed it',
    'Confirm which manufacturer software and bulletin access we use (Ford, Mercedes-Benz, VW, Stellantis) so the page can say plainly whether we apply updates ourselves',
    'A refractometer reading photo from a contaminated or diluted AdBlue sample, if we have one',
  ],
};

export default guide;
