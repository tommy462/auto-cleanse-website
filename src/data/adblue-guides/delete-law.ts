import type { AdBlueGuide } from './types';

const guide: AdBlueGuide = {
  path: '/adblue-delete-law',
  kind: 'legal',
  seoTitle: 'AdBlue Delete: UK Law and the Legal Fix | Auto-Cleanse',
  metaDescription:
    'Is an AdBlue delete or emulator legal in the UK? What the law, MOT, DVSA and insurers say, the changes expected in 2027 and the legal fix: a proper repair.',
  breadcrumb: 'AdBlue delete and the law',
  h1: 'AdBlue delete: the law and',
  h1Accent: 'the legal fix',
  intro:
    'An AdBlue delete or emulator is not a legal fix for a road vehicle. It fails the MOT when found, can already be an offence depending on the vehicle, puts your insurance at risk, and the law is expected to tighten in 2027. The legal fix is to repair the fault behind the warning.',
  quickAnswer: [
    {
      label: 'Is it legal?',
      text: 'Not as a fix for a road vehicle. It can already be an offence, depending on the vehicle, and proposed rules would cover road vehicles from 2001 onwards.',
    },
    {
      label: 'The MOT',
      text: 'Missing or obviously modified emissions equipment is a major defect. So is an engine warning light showing a fault.',
    },
    {
      label: 'Your insurance',
      text: 'An undeclared modification can give an insurer grounds to refuse a claim or void the policy.',
    },
    {
      label: 'The legal fix',
      text: 'Find the fault, repair it, and confirm the system works before any countdown is reset.',
    },
  ],
  sections: [
    {
      heading: 'What the law says today',
      paragraphs: [
        'Regulation 61A of the Road Vehicles (Construction and Use) Regulations 1986 covers vehicles first used from 1 January 2001. It bans using one on the road if it fails its emissions standard because the engine or exhaust has been altered, or an emission control device is not in good and efficient working order.',
        'Breaking that rule is an offence under section 42 of the Road Traffic Act 1988, for the driver and anyone who causes or permits the use, such as a fleet operator. Sections 75 and 76 cover the work: altering a vehicle, or fitting a part, so that road use would break these rules. In England and Wales both carry an unlimited fine.',
        "There is a gap, and the government admits it. Regulation 61A stops at Euro 4 cars and vans and Euro V lorries. The Department for Transport says there is currently no requirement to keep the emissions control system working on Euro 5 or 6 light vehicles or Euro VI heavy vehicles, which includes Euro 6 AdBlue vans. That is a gap in one regulation, not permission: the MOT, DVSA and insurance points below still apply.",
      ],
      note: 'This is general information about the law in Great Britain, not legal advice. Northern Ireland has similar but separate rules. Facing a prosecution or an insurance dispute? Speak to a solicitor.',
    },
    {
      heading: 'MOT: missing or tampered emissions equipment',
      paragraphs: [
        'Vans up to 3,500 kg are tested against the same MOT manual as cars. Emission control equipment fitted by the manufacturer that is missing, obviously modified or obviously defective is a major defect. On diesels first used from 1 July 2008, so is an engine warning light that does not work or shows a malfunction. Either one is a fail.',
        'A pass is not proof that a vehicle is legal. The test only checks what the tester can see and what the vehicle reports on the day.',
      ],
    },
    {
      heading: 'DVSA enforcement: emulators and the garages that fit them',
      paragraphs: [
        "DVSA added emissions cheat devices to its roadside lorry checks in August 2017, and across Great Britain from September 2018. They include devices that stop the emissions control system working, which is what an AdBlue emulator does. From August to November 2017 examiners found cheat devices on 293 of the 3,735 lorries they searched (DVSA figures).",
        "The driver and operator get 10 days to remove the device and repair the system, or face a fine and a prohibition taking the vehicle off the road. DVSA can refer the operator to the Traffic Commissioners, who can remove an operator's licence.",
        'In February 2025 DVSA said its enforcement teams continue to crack down on garages that offer removal or manipulation of emissions control devices, and that its work on garage services that make a vehicle illegal has led to prosecutions.',
      ],
    },
    {
      heading: 'Insurance',
      paragraphs: [
        'Insurers ask about modifications, and a delete or emulator is one. The Financial Ombudsman has backed an insurer that voided a policy over an undisclosed ECU remap and exhaust changes, and says owners should declare modifications even if they were made before they bought the vehicle. If your cover is voided, you can be left paying for a claim yourself, so ask your insurer if you are unsure.',
      ],
    },
    {
      heading: 'What is changing: the 2026 DfT consultation',
      paragraphs: [
        'The DfT consultation In-use emissions of road vehicles ran from 6 July to 6 September 2026. It proposes that all road vehicles in use in Great Britain from 1 January 2001 keep their emissions control system working to the standard they were built to, with offences for using such a vehicle, allowing its use, and modifying it or allowing it to be modified.',
        "It lists modifications it would always consider illegal, including SCR manipulation, \"often referred to as 'AdBlue Delete'\", and EGR manipulation, whether by hardware or software. DVSA would enforce, with the focus likely to be upstream, on where illegal modifications are done. The DfT expects new legislation in summer 2027 and has proposed a six-month lead-in. Its response is not yet published, so treat the detail as proposed.",
      ],
    },
    {
      heading: 'Why "off-road use only" doesn\'t make it legal',
      paragraphs: [
        'Some sellers label delete or emulator work "for off-road, export or competition use only". On a van that arrives by road, is taxed and insured, and drives away afterwards, that line does very little.',
      ],
      bullets: [
        'The off-road and export defences in sections 75 and 76 must be proved by whoever did the work. A tick-box on a road-going van is unlikely to show reasonable cause to believe it would stay off the road.',
        'The disclaimer does not change the vehicle. Whoever drives it on the road still faces the MOT, the construction and use rules and their insurer.',
        'The exemptions the DfT has proposed include off-road use and driving to a port for export. Motorsport is not mentioned.',
      ],
    },
    {
      heading: 'What we do instead',
      paragraphs: [
        'We repair AdBlue systems. We never delete, emulate or bypass them, and we do not reset a countdown without fixing the cause.',
        'Bought a vehicle that has already been deleted or emulated? Call and tell us what you know, and we will tell you straight away whether we can help put it back to standard.',
      ],
      steps: [
        {
          title: 'Read the faults and live data',
          body: 'Codes, NOx readings, dosing, tank and heater data show what the system is really doing.',
        },
        {
          title: 'Find the cause',
          body: 'We test the suspect part and its wiring before anything is ordered.',
        },
        {
          title: 'Repair it',
          body: 'The right part for the vehicle, plus any coding or adaptation it needs.',
        },
        {
          title: 'Confirm, then reset',
          body: 'We check the system works before any countdown is reset. A reset without a repair just brings the warning back.',
        },
      ],
    },
  ],
  costFactors: [
    'What has actually failed: a sensor, the dosing side, the heater, the tank unit or the wiring',
    'Whether earlier emulator or software work has to be undone first',
    'Make and model, as parts and coding differ between manufacturers',
  ],
  faqs: [
    {
      q: 'Is an AdBlue delete legal in the UK?',
      a: 'Not as a fix for a road vehicle. It is a major MOT failure when found, can be an offence depending on the vehicle, and proposed rules, expected to become law in 2027, would cover road vehicles from 2001 onwards.',
    },
    {
      q: 'Is an AdBlue emulator any different?',
      a: 'No. It makes the engine computer think the system works when it does not, which leaves the vehicle in the same position as a delete.',
    },
    {
      q: 'Will a deleted van pass its MOT?',
      a: 'Not if the tester finds the emissions equipment missing, obviously modified or obviously defective, or the engine warning light shows a fault. Getting through an MOT does not make a delete legal.',
    },
    {
      q: 'Does "off-road use only" on the invoice protect me?',
      a: 'No. Once the vehicle is used on the road, the MOT, the construction and use rules and your insurer all still apply.',
    },
    {
      q: 'Do I need to tell my insurer?',
      a: 'Insurers ask about modifications, and an undisclosed one can give them grounds to refuse a claim or void the policy. If you are unsure, ask your insurer.',
    },
    {
      q: 'What is changing in 2027?',
      a: "The DfT has proposed that road vehicles from 2001 onwards must keep their emissions system working, with 'AdBlue Delete' on its list of modifications it would always consider illegal. It expects new legislation in summer 2027, but its response is not out yet.",
    },
  ],
  related: [
    '/adblue-repair',
    '/adblue-countdown-no-start',
    '/adblue-warning-light',
    '/adblue-fault-codes/p20ee',
    '/how-we-quote',
  ],
  sources: [
    'UK legislation - Road Vehicles (Construction and Use) Regulations 1986, regulations 61 and 61A',
    'UK legislation - Road Traffic Act 1988, sections 42, 75 and 76, and Road Traffic Offenders Act 1988, Schedule 2',
    'DVSA - MOT inspection manual for cars and passenger vehicles, section 8.2.2',
    'DVSA - Lorry emissions cheat device roadside checks: announcement (2017), first results and national rollout (2018)',
    'DVSA - Matters of Testing blog, replies on emissions tampering enforcement (February 2025)',
    'Department for Transport - In-use emissions of road vehicles: regulating environmental impacts (consultation, 2026)',
    'Financial Ombudsman Service - Car modifications and insurance',
  ],
  updated: '2026-10-13',
  messageTopic: 'AdBlue repair, not a delete',
  firstHandTodo: [
    'A real case (reg and VIN masked) of a van whose owner asked about a delete, what the fault actually turned out to be, and the repair that fixed it',
    'Before-and-after scan-tool screenshots from a genuine AdBlue repair showing the SCR codes cleared and the countdown reset only after the fix',
    'Confirm whether you take on putting previously deleted or emulated vehicles back to standard (original software plus refitted parts); if yes, add one real example',
    "A photo, with the owner's permission, of an emulator or bypass loom removed from a vehicle during a repair",
  ],
};

export default guide;
