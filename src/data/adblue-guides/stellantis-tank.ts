import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-repair/peugeot-citroen-vauxhall-adblue-tank',
  kind: 'vehicle',
  seoTitle: 'Peugeot, Citroen & Vauxhall AdBlue Tank Fault | Auto-Cleanse',
  metaDescription:
    'Starting impossible in X miles on a Peugeot, Citroen, DS or Vauxhall diesel? AdBlue tank faults, codes, initialisation and Stellantis cover explained.',
  breadcrumb: 'Peugeot, Citroen and Vauxhall AdBlue tank',
  h1: 'Peugeot, Citroen and Vauxhall',
  h1Accent: 'AdBlue tank faults',
  intro:
    'If your Peugeot, Citroen, DS or Vauxhall diesel says "Starting impossible in" a number of miles, check the AdBlue tank early: on these vehicles it holds the pump, heater and sensors. Some vehicles built from January 2014 to August 2020 can still get a Stellantis contribution towards the tank, so ask a franchised dealer first. If you are not covered, we find the fault, fit the right part and initialise it properly.',
  quickAnswer: [
    {
      label: 'What has failed',
      text: 'The tank houses the pump, the heater and the level and temperature sensing. A fault in any of them can start the countdown.',
    },
    {
      label: 'Check your cover first',
      text: 'Stellantis contributes to tank repairs on some vehicles built 2014 to 2020 that are still under 8 years old, through franchised dealers only. Ask before you pay anyone, including us.',
    },
    {
      label: "Don't run it to zero",
      text: 'At zero the vehicle will not restart once switched off. A top-up only helps if the level was the problem.',
    },
    {
      label: 'What we do',
      text: 'Find the actual fault, fit the correct part, initialise the system and check it on the road.',
    },
  ],
  sections: [
    {
      heading: 'Which vehicles this page covers',
      paragraphs: [
        'Peugeot, Citroen and DS diesels badged BlueHDi, the Vauxhalls that share their engines, and vans built on the same Stellantis platforms.',
        'On all of them the AdBlue tank is an assembly, not just a container. The pump, the heater that stops the fluid freezing, the level and temperature sensing and the electronics that control them are built into it.',
      ],
      bullets: [
        'Peugeot and Citroen cars and vans, including the Partner, Rifter, Expert, Boxer, Berlingo, Dispatch and Relay',
        'DS models with BlueHDi diesel engines',
        'Vauxhalls with Peugeot and Citroen engines: the Vivaro from 2019, the Combo from 2018, the Grandland X and Crossland X diesels, and later Stellantis-platform diesels',
        'Toyota Proace and Proace City, and Fiat Scudo and Doblo vans from 2022, which share the same platforms and engine families',
      ],
      note: 'Not every Vauxhall diesel is in this family. Earlier models developed with GM, Renault or Fiat, including the Vivaro before 2019 and the Combo before 2018, use different engines and AdBlue hardware. Tell us the reg and we will check which system you have.',
    },
    {
      heading: 'Signs the tank assembly is at fault',
      paragraphs: [
        'These vehicles warn you with a message as well as a lamp. The wording varies by model and year, but expect one or more of these:',
      ],
      bullets: [
        '"Starting impossible in X miles" (kilometres on some vehicles), with a figure that counts down as you drive',
        'A UREA or AdBlue warning lamp, often with the engine management or Service light',
        'An "Emissions fault" or "AdBlue fault" message that stays after a top-up',
        'The AdBlue warning showing low or empty when you know the tank has fluid in it',
        'Warnings that appear in cold weather or after the vehicle has stood for a while',
      ],
      note: 'Top up first, because a low level starts the same countdown. If the message is still there after a few restarts and a short drive, treat it as a fault. Clearing it with a code reader fixes nothing: the fault returns and so does the countdown.',
    },
    {
      heading: 'Fault codes linked to the tank',
      paragraphs: [
        'These generic codes, in SAE J2012 wording, point towards the tank assembly or its wiring. Dealer software shows Stellantis descriptions, which can read differently, and one failure often sets several codes at once.',
      ],
      bullets: [
        'P20E8, Reductant Pressure Too Low: the pump is not building pressure, or the pressure is leaking away',
        'P20E9, Reductant Pressure Too High: check the line and dosing injector for a blockage before blaming the tank',
        'P208A, Reductant Pump "A" Control Circuit/Open',
        'P20B9, Reductant Heater "A" Control Circuit/Open',
        'P203B, Reductant Level Sensor "A" Circuit Range/Performance',
        'P205B, Reductant Tank Temperature Sensor "A" Circuit Range/Performance',
        'A lost-communication fault with the AdBlue electronics: the tank itself, its power supply or the wiring',
      ],
      note: 'P20EE (SCR efficiency) and P204F (reductant system performance) can follow a tank fault, but both have causes well away from the tank. Read our guides to those codes before anyone orders a tank.',
    },
    {
      heading: 'Why the whole tank is usually replaced',
      paragraphs: [
        'Because the pump, heater and sensors are built in, a failure in one of them normally means fitting a complete tank assembly rather than just the pump or heater.',
        'Diagnose before you buy, though. A faulty heated AdBlue line, a blocked injector, a wiring fault or a failing NOx sensor can bring up similar warnings, and a tank fitted on a guess leaves you with the same countdown.',
        'Used tanks are the same design as the one that failed, often a similar age, and they still need initialising.',
        'Removing or emulating the system to stop the countdown is not a repair. The MOT fails emission control equipment that is missing or obviously modified, and the government has proposed making it an offence to use any road vehicle from 2001 onwards altered that way. We repair the system instead.',
      ],
    },
    {
      heading: 'Check the Stellantis cover before you pay anyone',
      paragraphs: [
        'Stellantis runs a voluntary programme that contributes to urea tank repairs on some Citroen, DS, Opel/Vauxhall and Peugeot Euro 6 diesels with SCR.',
        'Age is the catch now. Vehicles built before about October 2018 are past eight years old, and even the last ones built in August 2020 are past five. If you still qualify, expect a share of the parts cost rather than a free tank, with the dealer confirming the exact share. The Peugeot and DS UK owner pages set out these terms:',
      ],
      bullets: [
        'Vehicles built between January 2014 and August 2020',
        'Up to 8 years old or 130,000 miles, whichever comes first',
        'Under 5 years old and up to 94,000 miles: parts paid in full',
        '5 to 8 years old: between 30 and 90 per cent of parts, depending on mileage, plus a contribution towards labour',
        'Repairs carried out by an authorised dealer, with servicing to the manufacturer\'s schedule among the conditions',
        'Conditions stated as valid until August 2028',
      ],
      steps: [
        {
          title: 'Get your details together',
          body: 'Your VIN (on the V5C), the mileage and your service history.',
        },
        {
          title: 'Ask a franchised dealer for your make',
          body: 'Ask whether the urea tank (AdBlue) special coverage applies to your car or van, and what share of the cost it would cover. The published terms do not list models, so only the dealer can confirm it.',
        },
        {
          title: 'Not covered? Call us',
          body: 'If the dealer says no, call with your reg and the dash message. If you ring us first, we ask your build date and mileage and tell you honestly if you look covered.',
        },
      ],
      note: 'Paid an authorised dealer for a tank between January 2021 and December 2023? Ask Stellantis customer support whether you can claim extra.',
    },
    {
      heading: 'What a proper tank repair involves',
      paragraphs: [
        'The job is finished when the system has been initialised and proven on the road, not when the new tank is bolted in.',
      ],
      steps: [
        {
          title: 'Check the level and the fluid',
          body: 'Confirm the tank holds enough of the right fluid. Diesel or water in the AdBlue changes the job completely.',
        },
        {
          title: 'Read codes and live data',
          body: 'Read the SCR faults and look at live AdBlue pressure, temperature and level to see which part has failed.',
        },
        {
          title: 'Rule out the rest',
          body: 'Test the wiring, power supply, heated line and injector, and check the NOx sensor readings, before condemning the tank.',
        },
        {
          title: 'Fit the correct tank',
          body: 'Match the part to the VIN. Tanks differ between models, engines and build dates.',
        },
        {
          title: 'Initialise the system',
          body: 'Run the tank replacement procedure with diagnostic equipment that supports it, so the system is primed and reset and the countdown cleared. Some tanks also need a software update.',
        },
        {
          title: 'Prove it on the road',
          body: 'Drive the vehicle, then recheck pressure and fault memory before handing it back.',
        },
      ],
      note: 'Some software updates need an online connection to the manufacturer\'s systems. If any step on your vehicle needs dealer-only access, we tell you before any work is booked.',
    },
  ],
  costFactors: [
    'Whether manufacturer cover applies to your vehicle',
    'Whether the fault is in the tank assembly or in the wiring, heated line, injector or NOx sensor',
    'The exact tank for your model, engine and build date',
    'Whether the tank needs a software update as well as initialisation',
    'Whether the AdBlue is contaminated and the lines need flushing',
    'Where the vehicle is and where the work can be done',
  ],
  faqs: [
    {
      q: 'My van says "Starting impossible in 1100 miles". How long have I got?',
      a: 'That figure is the distance left before the system blocks a restart, and it falls as you drive. Use it to get the fault diagnosed, because at zero the vehicle will not start again once switched off.',
    },
    {
      q: 'I topped up the AdBlue but the warning is still on. Why?',
      a: 'If the level was not the cause, a top-up will not clear it. Give it a few restarts and a short drive; if the message stays, a part has failed and needs diagnosing.',
    },
    {
      q: 'Is my AdBlue tank covered by Stellantis?',
      a: 'It may be if it was built between January 2014 and August 2020 and is still under 8 years old and 130,000 miles. Only a franchised dealer can confirm it from your VIN, and the contribution only applies to work they carry out.',
    },
    {
      q: 'Should I go to the dealer or to you?',
      a: 'If you look covered, go to the dealer first; we will tell you that honestly when you call. If you are not covered, call with your reg and the dash message and we will quote for the repair.',
    },
    {
      q: 'Does a new AdBlue tank need coding?',
      a: 'Yes. It has to be initialised with diagnostic equipment that supports the procedure, and some tanks also need a software update. Without that step the warning can carry on with a new tank fitted.',
    },
    {
      q: 'Does the Toyota Proace have the same AdBlue tank?',
      a: 'The Proace and Proace City are built on Stellantis platforms with the same engine families and can show the same "Starting impossible" message. Toyota is not named in the Stellantis tank programme, so ask a Toyota dealer about any cover.',
    },
  ],
  related: [
    '/adblue-fault-codes/p20e8',
    '/adblue-countdown-no-start',
    '/adblue-fault-codes/p20ee',
    '/adblue-warning-light',
    '/adblue-fault-codes/p204f',
    '/adblue-repair',
  ],
  sources: [
    'Stellantis - Urea tank (AdBlue) compensation platform and voluntary coverage terms',
    'Peugeot UK - Urea tank (AdBlue) special coverage owner page',
    'DS Automobiles UK - Urea tank (AdBlue) warranty extension owner page',
    'Italian Competition Authority (AGCM) - case PS12483, Peugeot and Citroen urea tank coverage commitments',
    'SAE International - J2012 diagnostic trouble code definitions',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
  ],
  updated: '2026-10-13',
  messageTopic: 'AdBlue tank fault (Peugeot/Citroen/Vauxhall)',
  firstHandTodo: [
    'A scan-tool screenshot from a real Stellantis tank job showing the stored codes (for example P20E8) with live AdBlue pressure and temperature, VIN masked',
    'A photo of a real "Starting impossible in X miles" dash message from a customer van, reg hidden',
    'Photos of a failed tank assembly removed from a Peugeot, Citroen or Vauxhall, showing where the pump, heater and sensors sit',
    'An anonymised example of a caller Tom sent back to the dealer under the Stellantis cover, to back up the honesty point',
    'Confirm which diagnostic equipment runs the tank initialisation for us, and list any models where the software update has turned out to be dealer-only',
  ],
};

export default guide;
