import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-fault-codes/p204f',
  kind: 'fault-code',
  seoTitle: 'P204F AdBlue Fault Code: Causes and Tests | Auto-Cleanse',
  metaDescription:
    'P204F means the AdBlue dosing side of your SCR system isn\'t performing as expected. How it differs from P20EE and P20E8, and how it\'s tested and fixed.',
  breadcrumb: 'Fault code P204F',
  h1: 'Fault code P204F:',
  h1Accent: 'reductant system performance',
  intro:
    'P204F means the engine computer has decided the AdBlue side of your SCR system isn\'t doing its job properly. It points at the dosing system as a whole, not one named part, so the fix comes from testing rather than guessing. Depending on the make, it can start a no-start countdown, so get it looked at while the vehicle still drives.',
  quickAnswer: [
    {
      label: 'What it means',
      text: 'AdBlue delivery isn\'t performing as the engine computer expects. The code names the system, not a part.',
    },
    {
      label: 'Can you keep driving?',
      text: 'Usually, for now. If a "no start in X miles" message appears, get the repair booked before it reaches zero.',
    },
    {
      label: 'What gets checked',
      text: 'Fluid quality, the injector and how much it delivers, the supply side, tank sensors, NOx readings and software updates.',
    },
    {
      label: 'What to send us',
      text: 'Your reg, the exact dash message, any other codes stored with P204F, and when the AdBlue was last topped up.',
    },
  ],
  sections: [
    {
      heading: 'What P204F actually means',
      paragraphs: [
        'The generic description is "Reductant System Performance Bank 1". Reductant is the AdBlue. The code is stored when the engine computer\'s check of AdBlue delivery doesn\'t come out as expected.',
        'Bank 1 is the side of the engine with cylinder number one. On a van with one exhaust and one SCR system, it simply means that system.',
        'Makes differ in exactly which check sets P204F, so the manufacturer\'s test plan for your vehicle decides the order of tests. It can be stored with other AdBlue codes: a Volkswagen tech tip on poor AdBlue quality in the Touareg 3.0 TDI lists it alongside P20EE and P207F (Reductant Quality Performance).',
      ],
    },
    {
      heading: 'How P204F differs from P20EE and P20E8',
      paragraphs: ['These codes look alike on a scan tool, but each asks a different question.'],
      bullets: [
        'P20E8, Reductant Pressure Too Low: the pump can\'t build or hold pressure. It points upstream, at the tank, pump, filter, lines or a frozen system.',
        'P20EE, SCR NOx Catalyst Efficiency Below Threshold Bank 1: the NOx sensor after the catalyst sees more NOx than it should. It is a result, and many faults can cause it.',
        'P204F, Reductant System Performance Bank 1: AdBlue delivery isn\'t performing as expected. It can be stored with pressure in range, because a part-blocked injector or weak fluid doesn\'t stop the pump building pressure.',
      ],
      note: 'If P20E8 is stored too, the pressure fault comes first. If P20EE is stored with P204F, the dosing side is tested before anyone condemns a catalyst or NOx sensor.',
    },
    {
      heading: 'What can cause P204F',
      paragraphs: ['A proper diagnosis works through these. None should be assumed until it has been tested.'],
      bullets: [
        'AdBlue quality: diluted, old or contaminated fluid, or the wrong fluid in the tank. AdBlue made to ISO 22241 contains 31.8 to 33.2 per cent urea by mass.',
        'Crystallised AdBlue building up on the injector nozzle and cutting or distorting the spray.',
        'The injector (dosing valve) sticking, leaking or delivering the wrong amount.',
        'Supply faults short of a pressure code: a weak pump, blocked pump filter, air in the line or a small leak.',
        'Tank level or quality sensors and their wiring giving the engine computer a wrong picture of the fluid.',
        'On systems that judge dosing from the NOx readings, a NOx sensor reading wrongly can make a healthy dosing system look like it is under-performing.',
        'Engine software. On some models the manufacturer\'s answer to P204F has been an update, not a part.',
      ],
      note: 'Volkswagen\'s 2014 bulletin for P204F on the US-market Passat 2.0 TDI put it down to an over-sensitive SCR self-check, and told technicians not to diagnose or replace parts before fitting the software update. That\'s why updates are checked early, before any parts.',
    },
    {
      heading: 'The dosing quantity test',
      paragraphs: [
        'This shows whether the injector delivers what the engine computer asks for. The injector comes out of the exhaust but stays connected to its line and wiring. A diagnostic tool commands it to spray into a measuring container for a set time, and the amount is compared with the manufacturer\'s figure.',
        'That figure is specific to the vehicle. Volkswagen once had to correct a guided test that showed the figure for a different engine, so the result has to be judged against the figure for your exact model.',
        'Ford\'s bulletin for its 6.7-litre US pickups links P204F to urea crystals forming on the injector nozzle. It uses this measurement to decide the repair, replacing the injector only if the amount is outside specification.',
      ],
      note: 'With the injector out, the nozzle is inspected too. Cleaning off crystals without finding why they formed, such as a dribbling injector or a leaking joint, risks P204F coming back.',
    },
    {
      heading: 'Fluid contamination and the tank sensors',
      paragraphs: [
        'Fluid is checked with a refractometer, which reads the urea concentration of a sample. Mercedes-Benz advises against judging AdBlue from a frozen, part-thawed or unmixed tank. AdBlue starts to freeze at about minus 11°C, so the sample is taken once the tank has fully thawed and been mixed by driving.',
        'If anything other than AdBlue has gone into the tank, tell us before the vehicle is driven further. Manufacturers have their own clean-out procedures, and what is needed depends on what went in.',
        'On the Mercedes-Benz Sprinter (906 from July 2013, 651 and 642 engines), Mercedes\' service information for a different code, P203B (AdBlue fill level sensor), lists wrong fluid in the tank, poor contact at the sensor plug and resistance in the wiring connectors to the tank module as causes. If a Sprinter has P203B stored alongside P204F, those checks come first.',
      ],
    },
    {
      heading: 'How P204F gets diagnosed and cleared',
      paragraphs: ['The order matters, because several causes look the same from the driver\'s seat.'],
      steps: [
        { title: 'Read everything', body: 'All stored codes, freeze-frame data and the countdown status, not just P204F.' },
        { title: 'Check the fluid', body: 'A refractometer test on a thawed, mixed sample, and where the last top-up came from.' },
        { title: 'Check for updates', body: 'Known software updates and bulletins for the vehicle, before any parts are ordered.' },
        { title: 'Test supply and dosing', body: 'Pressure, leaks and wiring, then the dosing quantity test with the injector out.' },
        { title: 'Check the NOx readings', body: 'Live sensor data before and after the catalyst, to see whether the sensors make sense.' },
        {
          title: 'Repair, reset and confirm',
          body: 'Learned AdBlue dosing values are reset where the manufacturer calls for it, and the SCR check is run to clear the warning and countdown.',
        },
      ],
      note: 'A basic code reader doesn\'t always stop the countdown. Volkswagen\'s P204F bulletin for the Passat, for example, has an SCR efficiency test run to clear the no-start message.',
    },
  ],
  costFactors: [
    'What testing finds: fluid, a sensor reading, software or a failed part',
    'Whether the injector can be cleaned and refitted or needs replacing, and how easy it is to reach',
    'Whether the tank needs draining and cleaning out after wrong or contaminated fluid',
    'Whether a tank sensor fault means one sensor or a whole tank module on your model',
    'Where the vehicle is and whether it can still be driven',
  ],
  faqs: [
    {
      q: 'Can I keep driving with P204F?',
      a: 'Usually, for now. If a "no start in X miles" message appears, get the repair booked before it runs out, because the vehicle may refuse to start at zero.',
    },
    {
      q: 'Will topping up the AdBlue clear P204F?',
      a: 'Not on its own. If the tank holds weak or contaminated fluid, topping up just mixes good with bad, so the fluid is tested first. Even after a fluid fix, the code and any countdown need clearing with the correct test.',
    },
    {
      q: 'Is P204F the same as P20EE?',
      a: 'No. P20EE says the catalyst isn\'t cutting NOx enough, which is a result. P204F says AdBlue delivery isn\'t performing, which is closer to the cause, and the two can be stored together.',
    },
    {
      q: 'Does P204F mean I need a new AdBlue injector?',
      a: 'Not on its own. The dosing quantity test shows whether the injector delivers the right amount, and one that tests within specification goes back in.',
    },
    {
      q: 'Can a software update fix P204F?',
      a: 'On some models, yes. Volkswagen and Jeep have both issued engine software updates for P204F on particular vehicles, so we check before replacing parts.',
    },
    {
      q: 'Can I just clear the code with my own reader?',
      a: 'If the fault is still there it will come back, and a basic reader doesn\'t always cancel the countdown. Clearing codes also wipes the freeze-frame data a technician uses to find the fault.',
    },
    {
      q: 'Can the AdBlue system be disabled instead?',
      a: 'Not as a fix for a road vehicle. The MOT manual lists missing or obviously modified emission control equipment as a major defect, and using a vehicle with it disabled can be an offence depending on the vehicle. We find and repair the fault instead.',
    },
  ],
  related: [
    '/adblue-fault-codes/p20ee',
    '/adblue-fault-codes/p20e8',
    '/blog/adblue-crystallisation-and-dosing-faults',
    '/adblue-countdown-no-start',
    '/adblue-repair/nox-sensor',
    '/adblue-repair',
  ],
  sources: [
    'SAE International - J2012 diagnostic trouble code definitions',
    'Volkswagen Group of America - Technical Bulletin 26 14 01, DTC P204F and AdBlue no-restart warning (Passat 2.0 TDI)',
    'Volkswagen Group of America - Tech Tips 26-18-01TT (P20EE, P204F and P207F with poor AdBlue quality) and TT 26-15-02 (AdBlue injector quantity test)',
    'Ford Motor Company - TSB 16-0034, urea crystals on the reductant injector setting P204F',
    'Mercedes-Benz AG - service information LI49.20-N-080376, AdBlue concentration testing and ISO 22241 limits',
    'Mercedes-Benz AG - service information LI14.40-N-069569, Sprinter 906 AdBlue fill level sensor fault P203B',
    'FCA US (Stellantis) - service bulletin 18-023-15, Jeep Grand Cherokee 3.0 diesel P204F software update',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
  ],
  updated: '2026-10-13',
  messageTopic: 'Fault code P204F',
  firstHandTodo: [
    'A scan-tool screenshot of P204F from a real van showing the other codes stored with it, VIN masked',
    'A photo of a removed AdBlue injector with crystal build-up on the nozzle from a real P204F job',
    'A photo of a dosing quantity test in progress (injector into a measuring container) with the result against the manufacturer figure',
    'A refractometer reading from a real diluted or contaminated tank, and what the repair turned out to be',
    'A short anonymised case note: vehicle, codes stored, what the cause was, and how the countdown was cleared',
  ],
};

export default guide;
