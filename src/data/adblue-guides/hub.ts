import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-repair',
  kind: 'hub',
  seoTitle: 'AdBlue Repair Specialist for Vans and Cars | Auto-Cleanse',
  metaDescription:
    'AdBlue fault or no-start countdown? Call with your reg and dash message. We triage by phone, agree the price before any repair and fix it. Never a delete.',
  breadcrumb: 'AdBlue repair',
  h1: 'AdBlue Repair',
  h1Accent: 'for Vans and Cars',
  intro:
    'An AdBlue warning or a "no start in X miles" countdown means the emissions system has found a problem, and left alone it ends in a no-start on many vehicles. Call with your reg and the dash message: we triage it by phone, tell you who can attend, agree the price, then repair it properly.',
  quickAnswer: [
    {
      label: 'Warning or countdown?',
      text: 'If the AdBlue is low, add the amount the dash or handbook asks for. If the level was fine, or the warning stays after a top-up and a short drive, it is a fault: book a repair while the vehicle still starts. On many makes it won\'t restart at zero.',
    },
    {
      label: 'Who comes out',
      text: 'Our own technicians in Devon. Elsewhere, an independent mobile technician from our national network, booked through us.',
    },
    {
      label: 'Cost',
      text: 'Agreed with you before any repair. Call for a quote for your vehicle.',
    },
    {
      label: 'What we won\'t do',
      text: 'Delete the system, fit an emulator or reset the countdown without a repair.',
    },
  ],
  sections: [
    {
      heading: 'What the AdBlue system does, in plain words',
      paragraphs: [
        'AdBlue is urea in purified water, made to a set standard (ISO 22241). It is sprayed into the exhaust ahead of the SCR catalyst, which uses it to turn nitrogen oxides (NOx) into nitrogen and water. NOx sensors check that it is working.',
        'If the tank runs low or the system stops working properly, type-approval rules require the vehicle to warn you, then restrict you if it isn\'t put right. Makes differ: a countdown to a no-start, reduced power or speed, or no restart after the next refuel. The countdown isn\'t the fault. It is the vehicle telling you something needs fixing.',
      ],
    },
    {
      heading: 'The faults behind AdBlue warnings',
      paragraphs: [
        'One dash message can come from several different parts, so we prove the fault before quoting for a repair. These are the areas we check:',
      ],
      bullets: [
        'NOx sensors. A sensor that reads wrong can make a working system look faulty.',
        'The dosing injector. It can block with crystallised AdBlue or stick.',
        'The pump and lines. Leaks, blocked filters or a weak pump show up as low pressure.',
        'The tank assembly. On some vehicles the pump, heater and level sensor are built into the tank and only sold as one unit.',
        'Heaters. AdBlue freezes at about minus 11°C, so the tank and lines are heated, and a failed heater circuit sets its own faults.',
        'Wiring and connectors. Corroded plugs and chafed wiring can look exactly like a failed part.',
        'The fluid. Contaminated, diluted or wrong fluid in the tank can set quality or efficiency faults.',
        'The SCR catalyst. Only judged once everything feeding it has been proved good.',
      ],
      note: 'Peugeot, Citroen, DS or Vauxhall? Stellantis runs a voluntary support scheme for AdBlue (urea) tank faults on some diesels built between January 2014 and August 2020, with age and mileage limits. Ask a franchised dealer whether yours qualifies before paying anyone, us included.',
    },
    {
      heading: 'Fault codes and dash messages',
      paragraphs: [
        'A generic fault code tells you which part of the system the engine computer is unhappy with, not which part has failed. Makes also use their own codes and wording, so treat these as a starting point:',
      ],
      bullets: [
        'P20EE, SCR NOx catalyst efficiency below threshold (bank 1). Too little NOx is being removed. We rule out sensors, dosing and fluid before blaming the catalyst.',
        'P20E8, reductant pressure too low. The cause can be an empty or frozen tank, a leak, a blocked filter or pick-up, or a tired pump.',
        'P204F, reductant system performance (bank 1). A broad code, so the other stored codes and the live data matter more than the code itself.',
      ],
      note: 'Each of these codes, the countdown message and the warning light has its own guide in the list further down this page.',
    },
    {
      heading: 'How it works with us',
      paragraphs: ['The same steps for one car or a yard full of vans.'],
      steps: [
        {
          title: 'Call, WhatsApp or text',
          body: 'Give us the reg, the exact dash message (a photo is ideal), the miles left on any countdown, any fault codes and where the vehicle is. No codes is fine.',
        },
        {
          title: 'Phone triage',
          body: 'We ask when it started, about recent top-ups or repairs and what else is on the dash. That narrows down what needs testing.',
        },
        {
          title: 'We tell you who attends',
          body: 'In Devon, one of our own technicians. Elsewhere, an independent mobile technician from our national network. We tell you who on the call, and if we can\'t cover your area we say so.',
        },
        {
          title: 'Price agreed before any repair',
          body: 'Nothing is fitted until you have agreed the price. If the fault needs confirming on the vehicle first, we tell you that up front.',
        },
        {
          title: 'Repair and set-up',
          body: 'We fit the part, then run the teach-in, initialisation or adaptation reset the manufacturer requires. Skip that step and a good new part can still leave the warning on.',
        },
        {
          title: 'Confirm the fix',
          body: 'We clear the codes, check live NOx and dosing data, and make sure the warning and countdown have gone. Some systems need a drive to finish rechecking.',
        },
      ],
    },
    {
      heading: 'Coverage: Devon and beyond',
      paragraphs: [
        'In Devon, our own technicians attend from our Totnes workshop. Some repairs are done where the vehicle is and some need a workshop, depending on the fault and where the part sits. We tell you which before anyone sets off.',
        'Outside Devon, we book an independent mobile technician from our national network of agents and manage the job for you. Call with your postcode and we\'ll tell you straight away who can get to you.',
      ],
    },
    {
      heading: 'Why we repair and never delete',
      paragraphs: [
        'We don\'t delete AdBlue systems, fit emulators or reset countdowns without a repair. Here is why:',
      ],
      bullets: [
        'It fails the MOT. Manufacturer-fitted emission control equipment that is missing, obviously modified or obviously defective is a major defect.',
        'The law is tightening. Using a vehicle altered so it no longer meets its emissions standard is already an offence on some vehicles. The Department for Transport has proposed extending that to all road vehicles from 2001 onwards, names AdBlue deletes, and expects new law in 2027.',
        'Lorry operators have been caught. DVSA roadside checks have found emissions cheat devices on lorries, and Traffic Commissioners can take away an operator\'s licence.',
        'A reset fixes nothing. The fault is still there, so the warning comes back.',
      ],
    },
    {
      heading: 'Vans and small fleets',
      paragraphs: [
        'Vans are a big part of our AdBlue work. If you run several, call about them together: each gets its own triage and agreed price.',
      ],
      bullets: [
        'Ask drivers to photograph the dash message and report it the day it appears.',
        'If several vehicles show AdBlue quality or efficiency faults around the same time, tell us. A shared bulk supply should be checked.',
        'Buy AdBlue made to ISO 22241 and keep containers sealed and clean.',
      ],
    },
  ],
  costFactors: [
    'Which part has failed, and whether it is sold on its own or only as an assembly',
    'The make, model and engine, including the set-up routine needed after the repair',
    'How much testing it takes to prove the fault',
    'Whether there is more than one fault',
    'Where the vehicle is, and whether the repair needs a workshop',
    'Whether a manufacturer support scheme covers part of the repair',
  ],
  faqs: [
    {
      q: 'Do you do mobile AdBlue repair?',
      a: 'In Devon, yes, where the fault allows; some repairs need our Totnes workshop. Outside Devon, an independent mobile technician from our national network comes to you; call with your postcode and we\'ll tell you who.',
    },
    {
      q: 'Can I keep driving with an AdBlue countdown?',
      a: 'Usually, until it reaches zero. Many vehicles then won\'t restart until the fault is fixed, and makes differ, so book the repair while it still runs.',
    },
    {
      q: 'I\'ve topped up the AdBlue and the warning is still on. Why?',
      a: 'Check you added the amount the dash or handbook asks for. If the warning stays after a short drive, the system has logged a fault that more fluid won\'t clear. Send us the codes or the dash message and we\'ll tell you what it points to.',
    },
    {
      q: 'How much does AdBlue repair cost?',
      a: 'It depends on which part has failed, the vehicle and where it is, so we don\'t publish prices. The price is agreed before any repair. Call for a quote for your vehicle.',
    },
    {
      q: 'Is an AdBlue delete legal?',
      a: 'Not as a fix for a road vehicle. A missing or obviously modified system is a major MOT defect, using a vehicle altered that way can be an offence depending on the vehicle, and the government has proposed covering all road vehicles from 2001 onwards. We only repair.',
    },
    {
      q: 'Do you work on van fleets?',
      a: 'Yes. Call about several vehicles at once: each gets its own triage and agreed price, and you deal with one business for all of them.',
    },
  ],
  related: [
    '/adblue-repair-devon',
    '/adblue-countdown-no-start',
    '/blog/how-adblue-and-scr-systems-work',
    '/blog/nox-sensor-faults-on-scr-systems',
    '/blog/adblue-crystallisation-and-dosing-faults',
    '/dpf-diagnostics-devon',
  ],
  sources: [
    'SAE International - J2012 diagnostic trouble code definitions',
    'UK legislation - Commission Regulation (EU) 2017/1151, Annex XVI: reagent warning and driver inducement',
    'ISO - ISO 22241-1, AUS 32 (AdBlue) quality requirements',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
    'UK legislation - Road Vehicles (Construction and Use) Regulations 1986, regulation 61A',
    'Department for Transport - In-use emissions of road vehicles: regulating environmental impacts (consultation, 2026)',
    'DVSA - roadside checks for lorry emissions cheat devices',
    'Stellantis - urea (AdBlue) tank voluntary coverage',
  ],
  updated: '2026-10-13',
  messageTopic: 'AdBlue fault',
  firstHandTodo: [
    'A scan-tool screenshot from a real van job showing the stored AdBlue codes and live NOx readings before and after the repair, with VIN and reg masked.',
    'A photo of a real dash countdown message from a customer vehicle, with the miles showing, to sit near the top of the page.',
    'One short real job write-up per common fault (make, model, codes, what was found, what was replaced, how the fix was confirmed), with the customer\'s permission.',
    'Which network agents take AdBlue work (and for which makes), so the coverage section can be specific.',
    'A photo of a crystallised dosing injector or other failed part removed on a real job.',
  ],
};

export default guide;
