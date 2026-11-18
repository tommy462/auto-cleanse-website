// DPF remove, clean and refit at the Totnes workshop (from 25 Nov 2026: a part-time
// mechanic Wednesday to Friday). Every page that offers the fitted job reads its wording
// from here, so the days, the turnaround and the price promise change in one place.
//
// Facts from Tom (18 Nov 2026): labour is vehicle dependent (some vans about half an
// hour, a Nissan Qashqai needs the subframe dropped), quoted per vehicle for a fair,
// transparent price; Wednesday to Friday only; vehicle in the morning, ready the same
// day where possible; all vehicles; workshop only (no driveway removal, no collection
// of vehicles). The clean itself is priced as on /pricing.

export const DPF_FITTED_DAYS = 'Wednesday to Friday';

export const DPF_FITTED = {
  eyebrow: 'Remove, clean and refit',
  headline: 'No garage needed: we take it off, clean it and put it back',
  intro:
    'Bring the vehicle to our Totnes workshop and we remove the DPF, clean and flow test it, and refit it for you. Cars, vans, 4x4s, motorhomes, HGVs and plant.',
  points: [
    { title: DPF_FITTED_DAYS, body: 'Removal and refitting are booked Wednesday to Friday at our Totnes workshop.' },
    { title: 'Back the same day', body: 'Drop the vehicle off in the morning and, where possible, it is ready to collect the same day.' },
    { title: 'Full price before you book', body: 'The clean is from £210 (HGV and plant £299), plus removal and refit labour quoted for your vehicle.' },
  ],
  labour:
    'Labour depends on the vehicle. On some vans the DPF can be off in about half an hour; on a Nissan Qashqai the subframe has to come down. So we price your vehicle, not an average.',
  noSurprises:
    'If we find something unexpected once it is on the ramp, such as a snapped stud or a damaged sensor, we call you before doing any extra work.',
  cantDrive: "Can't drive it to us? Call and we'll talk it through.",
  /** One line for hero copy, cards and short descriptions. */
  short: 'We remove, clean and refit at our Totnes workshop, Wednesday to Friday, the same day where possible.',
  /** Price line for price lists and price FAQs. */
  priceLine:
    'Removal and refitting at our Totnes workshop (Wednesday to Friday) is extra: the labour depends on the vehicle, and we quote it for yours before you book.',
  /** Plain sentence for schema descriptions and llms.txt. */
  schema:
    'DPF removal, off-vehicle cleaning and refitting at the Totnes workshop, Wednesday to Friday, with labour quoted per vehicle before booking.',
};

export const DPF_FITTED_FAQ = {
  q: 'Can you remove and refit the DPF for me?',
  a: `Yes. Bring the vehicle to our Totnes workshop, ${DPF_FITTED_DAYS}, and we remove the DPF, clean and flow test it, and refit it. Drop it off in the morning and, where possible, it is ready the same day. The clean is from £210 (HGV and plant £299). Removal and refit labour depends on the vehicle, so we quote it for yours before you book, and if we find anything unexpected, such as a snapped stud or a damaged sensor, we call you before doing any extra work. If your garage has already taken the filter off, you can drop it in or post it to us instead.`,
};

/** WhatsApp link pre-filled for a fitted-job quote (the labour price needs the reg). */
export const DPF_FITTED_WHATSAPP = `https://wa.me/447823649190?text=${encodeURIComponent(
  "Hi Auto-Cleanse, I'd like a price to remove, clean and refit my DPF. Reg: . Postcode: . What's happening: ",
)}`;
