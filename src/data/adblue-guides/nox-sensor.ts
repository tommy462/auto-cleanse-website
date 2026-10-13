import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-repair/nox-sensor',
  kind: 'component',
  seoTitle: 'NOx Sensor Fault? Diagnosis and Replacement | Auto-Cleanse',
  metaDescription:
    'NOx sensor fault? What upstream and downstream sensors do, P2200 and U029D codes, why sensors fail and why a reset after fitting stops the light returning.',
  breadcrumb: 'NOx sensor faults',
  h1: 'NOx Sensor Fault Diagnosis and',
  h1Accent: 'Replacement',
  intro:
    'A NOx sensor fault usually shows as an engine or AdBlue warning light with a code in the P2200 range, or a U-code for lost communication with the sensor. It may be the sensor, but wiring, exhaust leaks and dosing faults can make a good one look bad. We prove which it is before fitting anything, then do the reset and road test the repair needs.',
  quickAnswer: [
    {
      label: 'What it does',
      text: 'Measures NOx before and after the SCR catalyst, so the engine computer can dose AdBlue and check it is working.',
    },
    {
      label: 'Typical codes',
      text: 'P2200 to P2209 (upstream), P229E, P229F and P22A_ (downstream), U029D or U029E (lost communication).',
    },
    {
      label: 'Can I keep driving?',
      text: 'Usually for now, but book it in. Many vehicles start a no-start countdown.',
    },
    {
      label: 'Before you buy a sensor',
      text: 'Get the fault proved first. A new sensor won\'t fix wiring, leaks or dosing faults.',
    },
  ],
  sections: [
    {
      heading: 'Upstream and downstream: what each sensor does',
      paragraphs: [
        'Many AdBlue (SCR) systems use two NOx sensors. The upstream one, before the SCR catalyst, measures NOx coming out of the engine so the engine computer can decide how much AdBlue to inject. The downstream one, after the catalyst, measures what is left, to check the exhaust is being cleaned.',
        'In fault codes the upstream sensor is usually Bank 1 Sensor 1 and the downstream one Bank 1 Sensor 2. Layouts vary by make, so we confirm which sensors your vehicle has before quoting.',
        'Each sensor is a heated ceramic probe with a small control box that sends readings over the vehicle\'s data network. It only reports once the exhaust is hot and dry, so a cold check at idle tells you little.',
        'One quirk matters for diagnosis: NOx sensors also read ammonia. If too much AdBlue is injected, or a dosing injector leaks, ammonia slipping past the catalyst reads as high NOx downstream and can make a healthy sensor look faulty.',
      ],
    },
    {
      heading: 'Symptoms and the codes you\'ll see',
      paragraphs: [
        'Expect a warning light rather than a change in how the vehicle drives. On many vans and cars an AdBlue warning follows and, if left, a no-start countdown, because the system can no longer check its own performance. Which faults trigger the countdown varies by make.',
        'These are the generic SAE J2012 descriptions. Manufacturers sometimes word or use them differently.',
      ],
      bullets: [
        'P2200: NOx sensor circuit, Bank 1 Sensor 1 (upstream).',
        'P2201: NOx sensor circuit range/performance, Bank 1 Sensor 1. The signal is there but doesn\'t make sense.',
        'P2202 and P2203: circuit low and circuit high, Bank 1 Sensor 1.',
        'P2205 to P2209: upstream sensor heater control and heater sense circuit faults.',
        'P229E and P229F: circuit, and circuit range/performance, Bank 1 Sensor 2 (downstream). The P22A_ codes cover its other circuit and heater faults.',
        'U029D and U029E: lost communication with NOx sensor A and NOx sensor B.',
        'U059E and U059F: invalid data received from NOx sensor A and NOx sensor B.',
      ],
      note: 'Sensor A is often upstream and B downstream, but labels vary by make. Manufacturers also log their own codes, which a basic code reader may not show.',
    },
    {
      heading: 'Why NOx sensors are replaced so often',
      paragraphs: [
        'Industry warranty data puts NOx sensors at the top of the list. A 2026 analysis of more than 3,000 authorised UK van warranty claims found they were the single most common repair, just ahead of alternators. A matching analysis of almost 2,500 HGV claims put them top by a wide margin.',
        'In the US, BMW extended the warranty on the NOx sensors before and after the SCR catalyst on some of its diesels to 10 years or 120,000 miles.',
        'Much of it comes down to where the sensor lives:',
      ],
      bullets: [
        'The ceramic element runs very hot, and water in a cold exhaust can crack it, so the sensor waits for the exhaust to warm up before heating fully.',
        'Contamination can kill it. Ford has warned, for some North American diesels including the Transit, that aftermarket EGR and intake cleaning foams can cause sodium poisoning of NOx sensors and permanent damage.',
        'The control box, wiring and plugs sit under the vehicle in heat and road spray, so a connector fault can set the same codes as a failed sensor.',
      ],
    },
    {
      heading: 'Cheap sensors and the wrong sensor',
      paragraphs: [
        'A NOx sensor\'s accuracy depends on its sensing element and the calibration in its control box. A cheap one can talk to the engine computer yet read slightly wrong. That may not set a sensor code, but it makes the catalyst look inefficient and the warning comes back.',
        'Volvo\'s truck service information says third-party NOx sensors have been found to cause false fault codes and system failures, and tells technicians to replace them with genuine sensors.',
        'Upstream and downstream sensors can look alike but are often different part numbers and aren\'t usually interchangeable. We match the replacement to your vehicle\'s part number and position, and tell you what we\'re fitting.',
      ],
    },
    {
      heading: 'How we prove the sensor is at fault',
      paragraphs: [
        'A NOx code shows where the system noticed a problem, not always what caused it. Before recommending a sensor, we check:',
      ],
      steps: [
        {
          title: 'Full scan and history',
          body: 'Every module, noting whether each code is active or stored from earlier, and the conditions when it set.',
        },
        {
          title: 'Check other causes',
          body: 'Software updates and manufacturer campaigns, related EGR, leak or dosing codes, and the quality of the AdBlue in the tank.',
        },
        {
          title: 'Test the wiring',
          body: 'Supply, earth and data lines at the sensor\'s control box, for circuit and lost-communication codes.',
        },
        {
          title: 'Live data on a warm road test',
          body: 'Upstream NOx should follow load, both sensors should drop close to zero when you lift off, and downstream should read well below upstream once dosing. A reading stuck on one value or slow to react points to the sensor.',
        },
        {
          title: 'Rule out leaks and overdosing',
          body: 'An exhaust leak near a sensor, or ammonia slipping past the catalyst, can make a good sensor read wrong.',
        },
      ],
      note: 'If the evidence points somewhere other than the sensor, we tell you and quote for that instead.',
    },
    {
      heading: 'After fitting: reset, adaptation and a road test',
      paragraphs: [
        'The engine computer stores learned correction values for the sensors and the AdBlue dosing. Applied to a new sensor, old values can throw its readings off, and the light can come back days later.',
        'What\'s needed depends on the make. Mercedes-Benz diagnostics, for example, include a routine to reset the learned values of the NOx sensors. Some makes also need the new part coded or a guided test, and on others clearing the codes and a drive is enough.',
        'The self-test that set the code must then run and pass on a road test before the warning stays off, which can take more than one drive. If a no-start countdown had started, some makes also need it reset with diagnostic equipment once the repair is confirmed.',
      ],
      note: 'A NOx emulator, or software that switches the sensors off, hides the fault rather than fixing it. We don\'t fit them, and our guide to the law on AdBlue deletes explains why.',
    },
  ],
  costFactors: [
    'Which sensor has failed: upstream, downstream or both',
    'Your make, model and the sensor part number',
    'Access, including heat shields and sensors seized in the exhaust',
    'Any wiring, connector or other fault found alongside it',
    'The reset, adaptation or coding needed after fitting',
    'Where the vehicle is and whether it can still be driven',
  ],
  faqs: [
    {
      q: 'Can I drive with a NOx sensor fault?',
      a: 'Usually for a short while, but get it booked in. Many vehicles start a no-start countdown, and once it reaches zero the engine may not restart until the fault is fixed.',
    },
    {
      q: 'Is it the upstream or downstream NOx sensor?',
      a: 'Sensor 1 in the code is normally upstream and Sensor 2 downstream. A and B labels on U-codes vary by make, so we confirm with live data before ordering a part.',
    },
    {
      q: 'Will clearing the code fix it?',
      a: 'No. If the fault is still there the code returns when the self-test runs again, and clearing it wipes information that helps diagnosis.',
    },
    {
      q: 'Does a new NOx sensor need coding or resetting?',
      a: 'On many vehicles, yes. Learned values often need resetting and some makes need the sensor coded, or the light can come back.',
    },
    {
      q: 'Will a NOx sensor fault fail the MOT?',
      a: 'It can. A NOx sensor fault usually puts the engine warning light on, and on diesels first used from 1 July 2008 that light showing a fault is a major defect.',
    },
    {
      q: 'How much does NOx sensor replacement cost?',
      a: 'It depends on which sensor, your make and model, access, and the reset or coding needed. Call for a quote for your vehicle.',
    },
    {
      q: 'Why has the warning come back after a new NOx sensor?',
      a: 'Usually because the learned values weren\'t reset, the replacement reads slightly wrong, or the sensor was never the cause. An exhaust leak or over-dosing can make a brand new sensor report the same problem.',
    },
  ],
  related: [
    '/adblue-fault-codes/p20ee',
    '/blog/nox-sensor-faults-on-scr-systems',
    '/adblue-countdown-no-start',
    '/adblue-warning-light',
    '/adblue-delete-law',
    '/adblue-repair',
  ],
  sources: [
    'SAE International - J2012 diagnostic trouble code definitions',
    'SAE International - technical paper 2011-01-1157, NOx sensor cross-sensitivity to ammonia',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
    'Volvo Trucks - NOx sensor replacement guide and third-party NOx sensor identification (service information)',
    'BMW of North America - service bulletin SI B01 19 18, NOx sensor limited warranty extension',
    'Ford Motor Company - Special Service Message 49065, aftermarket EGR cleaning and NOx sensor damage',
    'Mercedes-Benz - diagnostic routine to reset NOx sensor learned values after replacement',
    'Industry warranty data - 2026 analyses of authorised UK van and HGV warranty claims by component',
  ],
  updated: '2026-10-13',
  messageTopic: 'NOx sensor fault',
  firstHandTodo: [
    'A scan-tool screenshot from a real job showing upstream and downstream NOx live readings on a road test, VIN masked, ideally one where the sensor was proved faulty and one where it was not.',
    'A photo of a failed NOx sensor from a van next to its replacement, showing the part numbers and which position it came from.',
    'A short write-up of a real job where a NOx code turned out to be wiring, a plug or an exhaust leak rather than the sensor (vehicle type only, no customer details).',
    'Confirm the parts policy for NOx sensors (genuine or named original-equipment-supplier parts) so the page can state it plainly.',
    'List the makes whose NOx sensor reset or coding routines our diagnostic equipment covers, so the reset section can name them.',
  ],
};

export default guide;
