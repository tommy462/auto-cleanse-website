import { useRef } from 'react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { localBusinessNode, BUSINESS_ID } from '../data/business';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Settings, Shield, Truck, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import Reviews from '../components/Reviews';
import { getReviews, DPF_TOWN_REVIEW_IDS } from '../data/reviews';
import FaqSection, { type Faq } from '../components/FaqSection';

gsap.registerPlugin(ScrollTrigger);

// Long-form, workshop-specific copy. Totnes is where the machine physically is,
// so this page is the only one on the site that can talk about the counter, the
// bench and the drop-off itself. Kept as data so it stays easy to edit.
const LOCAL_SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "You are nearer the machine than most of the filters on it",
    paragraphs: [
      "Most of what goes through this workshop arrives on a courier or in the back of the van, from Exeter, Plymouth, Torbay and by tracked post from further afield. Those customers are in the from £230 band, because outside ten miles the price has to carry the distance. Totnes sits inside the ten-mile band, so cleaning starts from £210, and that figure already includes local collection and return. Being on the doorstep does not buy you a discount so much as a choice: wait for a collection slot like everyone else, or take the filter off, put it in the boot and hand it over yourself the same morning.",
      "The second thing being local buys is one address instead of two. The remapping side and the DPF bench are in the same building at Webbers Yard, so a Totnes driver can bring the vehicle in for a paid diagnostic and leave a removed filter at the same counter on the same morning. From Exeter that is two separate journeys with a decision made over the phone in between. Ring 01803 269895 before anyone undoes a clamp. We cannot tell you what is actually wrong down a phone line, and confirming it is a paid DPF diagnostic rather than a free scan, but we can tell you whether the drop-off is worth making today.",
    ],
  },
  {
    heading: "What actually gets handed over the counter",
    paragraphs: [
      "People underestimate the object. A car DPF is a one-hand carry and about as clean as the inside of an exhaust, which is to say not at all. On a lot of newer vehicles the DPF, the oxidation catalyst and the SCR come out as one welded assembly, so what arrives is a box the size of a small suitcase and a genuine two-person lift on something like a Transit or a Sprinter. Bring a bin bag or a crate rather than laying it on a boot carpet you care about, and tell us what is still attached when you hand it over, because the sensors and pipework change how it is handled on the bench.",
      "Then it stays, and you do not. The METclean XL MKII is bolted to the floor with a water feed and a drain, and it works aqueous solution and high-pressure pneumatics through the channels in cycles, one filter at a time. After that there is a controlled hot-air dry, and the dry is not optional: a wet substrate will not give an honest flow reading and should not go back on a vehicle damp. That is the whole reason nobody waits for one. It is also the reason there is no mobile DPF cleaning, in Totnes or anywhere else, however close you happen to live to the machine.",
    ],
  },
  {
    heading: "Nothing leaves Totnes quickly, and filters notice",
    paragraphs: [
      "Look at where the roads go. Everything out of town crosses the Dart at The Plains and then stays single carriageway: the A385 east to Paignton and west to the A38, the A381 north to Newton Abbot and south to Kingsbridge, the A384 up through Dartington to Buckfastleigh. The A38 itself is several miles off in either direction, so the nearest road where a diesel can hold a steady load and temperature is a deliberate journey rather than one you make by accident. Add a town built on a hill, where a fair share of local mileage is the climb back up from the river, and you get a pattern that starts regenerations and rarely finishes them.",
      "An interrupted regeneration is worse than a warning light, because the fuel injected to raise exhaust temperature has to go somewhere. On plenty of vehicles it works past the rings into the sump, and the first honest symptom is an oil level creeping above the maximum mark on the dipstick rather than anything on the dashboard. Worth checking before you assume the filter is the whole story. The other local pattern is load: South Hams driving is full of vehicles that spend eleven months on school runs and short town trips, then drag a horsebox, a boat or a plant trailer up out of the valley for one weekend. That is a lot to ask of a filter that has never been properly hot.",
    ],
  },
  {
    heading: "Dropping one in: hours, parking and ringing first",
    paragraphs: [
      "The Old Barn Industrial Estate, Webbers Yard, Totnes TQ9 6JY, with parking on site, open Monday to Friday from 09:00 to 17:00. It is on the edge of town rather than in it, so do not aim for the town centre car parks. Ring 01803 269895 before you set off rather than after. The machine runs one filter at a time in cycles, so a call tells you whether the bench is free this morning or this afternoon, and it means we know what is coming and roughly what size it is. Filters with us before 10am are often cleaned, tested and ready the same working day. That is a where possible, not a promise.",
      "Bring the filter rather than the vehicle. The standard service is cleaning the part itself, with removal normally handled by your own garage. If you have nobody lined up to take it off, ring and we will tell you honestly what we can help with rather than leaving you guessing. And if you would rather not do the running about at all, local collection and return is included in the £210 band, so a Totnes filter can be collected exactly like an Exeter one. Most people here do not bother, because the drive is shorter than the wait for a slot, but the option is there and it costs the same either way.",
    ],
  },
  {
    heading: "If it is not worth cleaning, you can stand there and look at it",
    paragraphs: [
      "Every filter is inspected and flow tested before it goes near the machine, and if replacement is the more sensible option you are told then rather than afterwards. What being local changes is what that conversation looks like. Somebody in Plymouth gets a description down the phone. Somebody who has carried it over from Bridgetown gets shown the thing itself, on the bench, and there is a visible difference between a filter that is simply loaded and one that is finished: channels melted and glazed shut at the inlet face, a cracked or soft substrate, or ash packed into a hard grey plug rather than the loose loading that flushes out.",
      "Take a photograph while you are stood there. Whoever removed it will want to know why it is not going back on, and a picture of the inlet face settles that faster than anything we could write down for you. The other question that gets asked at this counter, usually because people can see the remapping side of the workshop from where they are standing, is whether we can simply take the filter out of the equation and map around it. The answer is the same in person as it would be on the phone from Exeter: Stage 1 keeps the DPF and emissions hardware intact, and DPF removal on a road car is not a service we offer.",
    ],
  },
];

const TOTNES_FAQS: Faq[] = [
  { q: "Where exactly is the workshop, and do I need to ring first?", a: "The Old Barn Industrial Estate, Webbers Yard, Totnes TQ9 6JY, with parking on site, open Monday to Friday 09:00 to 17:00. It is on the edge of town rather than in the centre, so ignore the town centre signs when you get close. Ring 01803 269895 before you set out. It is not us being awkward: the cleaning machine runs one filter at a time in cycles, so a call tells you whether it is free this morning and saves you standing about holding a heavy box." },
  { q: "I only live in Totnes, so can you come and do it here?", a: "No, and living five minutes away makes that less likely rather than more. The machine is bolted to a floor with a water feed and a drain, and the filter has to be off the vehicle and flow tested either side of the clean. You would wait longer for a van to be loaded and driven to you than it takes to bring the filter over yourself. Mobile visits are for ECU remapping only, and that we genuinely will bring to you in Totnes, Dartington and the surrounding villages." },
  { q: "Is it cheaper because I am on your doorstep?", a: "It is the lower of the two bands, yes. Cleaning starts from £210 within ten miles of the workshop, which covers Totnes and the villages around it, and that price includes local collection and return. Outside ten miles, and for UK-wide postal filters, it is from £230. So driving it in yourself does not knock anything further off the bill, it just means you are not waiting on a collection slot. We confirm the exact price on the phone once we know the vehicle and the filter." },
  { q: "Can I wait while it is cleaned?", a: "No. It goes on the machine in turn, and after the aqueous cycle it needs a controlled hot-air dry before the second flow test means anything, so it is a workshop job rather than a while-you-wait one. Something handed over at ten to five is realistically a next-morning start, and the quickest returns are always the ones that arrive first thing. The advantage of being local is that you can drop it off and walk back into town rather than sitting in a doorway." },
  { q: "Do I need to take the filter off first, or can I just bring the car?", a: "Bring the filter. The clean is carried out off the vehicle and removal is normally handled by your own garage. If you have nobody to do it, ring 01803 269895 and we will tell you honestly what we can help with. Where being local genuinely helps is earlier than that: if the vehicle still drives and you are ten minutes away, bringing it in for a paid diagnostic before anyone undoes a clamp is one short trip rather than a day off work. A split differential pressure pipe looks exactly like a blocked filter and is not one." },
  { q: "Mine has come off as one huge welded lump. Will you still take it?", a: "Yes. On a lot of Euro 6 vehicles the DPF, the oxidation catalyst and the SCR are a single assembly and they come off together, which is normal here. It is heavy, and on a van-sized unit expect a two-person lift at both ends. This is the job where being in Totnes is worth the most, because a postal customer has to box something that awkward securely and trust a courier with it, and you can simply carry it in. Bring a crate or a bag, and say what sensors are still attached." },
  { q: "It blocked again a few months after the last clean. Is another clean the answer?", a: "Probably not on its own. A cleaned filter behaves like a new one, so if it loads up again quickly the filter is the symptom rather than the fault, and a second clean buys you the same few months back. A paid DPF diagnostic looking at the differential pressure sensor and its pipework, the EGR, the injectors and the oil level is a better use of the money. Diagnostics are a paid check, not a free scan. Being local, you can leave the vehicle and the removed filter at the same address on the same morning, which nobody driving in from Exeter can do." },
];


// Each word gets its own span so it can be revealed individually. The spans must
// be separated by a real whitespace text node: without one the H1's textContent
// reads "DPFCleaninginTotnes" to a crawler or a screen reader, because the visual
// gap comes only from the CSS margin. The H1 is a flex container, and a
// whitespace-only text node between flex items is not rendered (CSS Flexbox
// spec), so this restores the spaces in the text layer without moving anything.
const splitText = (text: string, className: string = '') => {
  return text.split(' ').flatMap((word, index) => [
    index > 0 ? ' ' : null,
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>,
  ]);
};

const DPFCleaningTotnes = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );

    gsap.utils.toArray<HTMLElement>('.reveal-container').forEach((container) => {
      const items = container.querySelectorAll('.reveal-item');
      gsap.fromTo(items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
          }
        }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="DPF Cleaning Totnes | Our Home Workshop | AutoCleanse" description="Our DPF cleaning workshop is in Totnes: Webbers Yard, TQ9 6JY. Off-vehicle machine clean and flow testing from £210 inside 10 miles. Call 01803 269895." path="/dpf-cleaning-totnes" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          localBusinessNode({
            description: 'Professional off-vehicle DPF cleaning in Totnes, Devon - our home workshop. Filters are machine cleaned and flow tested before and after. Drop-off, local collection or UK-wide postal cleaning. We do not offer mobile or roadside DPF cleaning.',
            serviceType: 'DPF Cleaning',
            areaServed: [{ '@type': 'City', name: 'Totnes' }, { '@type': 'AdministrativeArea', name: 'Devon' }],
          }),
          {
            '@type': 'Service',
            name: 'DPF Cleaning Totnes',
            serviceType: 'Diesel Particulate Filter Cleaning',
            provider: { '@id': BUSINESS_ID },
            areaServed: [{ '@type': 'City', name: 'Totnes' }, { '@type': 'AdministrativeArea', name: 'Devon' }],
            url: 'https://www.auto-cleanse.co.uk/dpf-cleaning-totnes',
            description: 'Professional off-vehicle DPF cleaning in Totnes, Devon - our home workshop. Filters are machine cleaned and flow tested before and after. Drop-off, local collection or UK-wide postal cleaning. We do not offer mobile or roadside DPF cleaning.',
            offers: [
              { '@type': 'Offer', name: 'DPF Cleaning - from', priceCurrency: 'GBP', price: '210.00', availability: 'https://schema.org/InStock' },
              { '@type': 'Offer', name: 'DPF Cleaning - UK postal', priceCurrency: 'GBP', price: '230.00', availability: 'https://schema.org/InStock' },
            ],
          },
        ],
      }) }} />

      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <Breadcrumbs items={[{ name: 'DPF Cleaning', path: '/dpf-cleaning' }, { name: 'Totnes' }]} />
        {/* Header */}
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('DPF Cleaning in', 'text-white')}{' '}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Totnes.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>

          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              Totnes is not a service area on a map, it is the address the filters come to. Everything cleaned for Exeter, Plymouth, Torbay and the tracked-post customers from the rest of the UK is done on one bench at The Old Barn Industrial Estate, Webbers Yard, on the edge of town. If you live here, the workshop is a few minutes away rather than a courier job. Cleaning starts from £210 inside the ten-mile band, which already includes local collection and return, and the workshop is open Monday to Friday, 09:00 to 17:00. The number is 01803 269895.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 reveal-container">
          {/* Professional Off-Vehicle DPF Cleaning */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Settings size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Professional Off-Vehicle DPF Cleaning</h2>
            </div>

            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Off-vehicle DPF cleaning involves removing the diesel particulate filter from your vehicle
                for comprehensive cleaning using professional equipment. This process allows for thorough
                cleaning that cannot be achieved through on-vehicle regeneration or additives.
              </p>
              <p>
                Our service is suitable for all vehicle types including cars, vans, HGVs, and fleet vehicles.
                Professional cleaning maintains emissions compliance and ensures your vehicle will pass MOT
                emissions tests, as the original filter specifications and performance characteristics are preserved.
              </p>
            </div>
          </section>

          {/* Cost-Effective Alternative */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Shield size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Cost-Effective Alternative to DPF Replacement</h2>
            </div>

            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Professional DPF cleaning is often preferable to replacement because original equipment
                manufacturer (OEM) filters are designed to be cleaned and reused. Most DPF issues are
                caused by blockages rather than structural failure, making cleaning the appropriate solution.
              </p>
              <p>
                DPF cleaning at our Totnes workshop starts from £210, with UK-wide postal DPF cleaning
                from £230 - transparent, fixed pricing and no hidden costs. Collection and return may vary
                depending on location and availability. Compared with a replacement filter, which runs from many
                hundreds to several thousand pounds depending on the vehicle, a professional clean restores
                flow to your existing DPF while preserving its original calibrations and sensor compatibility.
              </p>
            </div>
          </section>

          {/* Trusted by Various Customers */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <Truck size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Trusted by Garages, Fleets and the Public</h2>
            </div>

            <div className="text-white/60 leading-relaxed space-y-6 text-lg md:text-xl font-medium relative z-10">
              <p>
                Our DPF cleaning service is trusted by independent garages, fleet operators, and individual
                vehicle owners throughout the Totnes area. We understand the importance of reliable service
                and quick turnaround times for businesses that depend on their vehicles.
              </p>
              <p>
                Fast turnaround - often same-day within 30 miles of Totnes when the filter is with us
                before 10am - keeps disruption to a minimum, whether you're managing a single vehicle or an entire fleet.
              </p>
            </div>
          </section>

          {/* Nationwide Service */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <MapPin size={28} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">Nationwide Postal DPF Cleaning Available</h2>
            </div>

            <div className="text-white/60 leading-relaxed text-lg md:text-xl font-medium relative z-10">
              <p>
                For customers outside our local service area, we offer comprehensive nationwide postal
                DPF cleaning with tracked next-day return. This service provides the same professional
                cleaning standards we deliver locally in Totnes, extending our expertise across the UK.
              </p>
            </div>
          </section>

          {/* Long-form local sections - the unique core of this page. */}
          {LOCAL_SECTIONS.map((sec) => (
            <section
              key={sec.heading}
              className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item overflow-hidden shadow-xl shadow-black"
            >
              <h2 className="relative z-10 text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                {sec.heading}
              </h2>
              <div className="relative z-10 space-y-4">
                {sec.paragraphs.map((para, i) => (
                  <p key={i} className="text-white/60 leading-relaxed text-base md:text-lg font-medium">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Totnes DPF FAQs */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item overflow-hidden shadow-xl shadow-black">
            {/* FaqSection keeps every answer in the DOM and emits FAQPage schema.
                The previous hand-rolled block did neither. */}
            <FaqSection
              faqs={TOTNES_FAQS}
              heading={
                <>
                  <span className="text-white">Totnes DPF Cleaning </span>
                  <span className="text-[#FF7A00]">FAQs</span>
                </>
              }
            />
          </section>

          {/* DPF services & booking links */}
          <section className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/30 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="relative z-10 text-2xl font-bold text-white mb-8 tracking-tight">DPF Services & Booking</h3>
            <div className="relative z-10 space-y-4">
              {[
                { to: '/dpf-cleaning', label: 'DPF cleaning Devon - main hub' },
                { to: '/dpf-diagnostics-devon', label: 'DPF diagnostics - find the cause first' },
                { to: '/blocked-dpf-cleaning-devon', label: 'Blocked DPF? Warning light & limp mode help' },
                { to: '/postal-dpf', label: 'Nationwide postal DPF cleaning' },
                { to: '/pricing', label: 'DPF cleaning prices' },
                { to: '/book', label: 'Book a DPF clean' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all group/link"
                >
                  <ArrowRight size={20} className="text-[#FF7A00] mr-4 group-hover/link:translate-x-2 transition-transform" />
                  <span className="font-medium text-lg">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="reveal-item">
            <Reviews
              reviews={getReviews(DPF_TOWN_REVIEW_IDS)}
              heading={<><span className="text-white">Trusted for </span><span className="text-[#FF7A00]">DPF Cleaning</span></>}
              columns={3}
              showGoogleCta
              showCallCta
            />
          </section>

          <section className="reveal-item">
            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <QuickEnquiryForm
                  defaultService="DPF Cleaning"
                  source="dpf-cleaning-totnes"
                  heading="Request a DPF Cleaning Callback"
                  subheading="Send your details and we'll call you back about your DPF clean."
                />
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center mt-16 reveal-item">
            <div className="relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

              <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Contact AutoCleanse for DPF Cleaning <span className="text-[#FF7A00]">in Totnes</span>
              </h3>
              <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Get in touch to discuss your DPF cleaning requirements or arrange collection from the Totnes area.
              </p>

              <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
                <MagneticButton className="block">
                  <a
                    href="tel:01803269895"
                    className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg"
                  >
                    <Phone size={24} className="mr-3 text-[#FF7A00]" />
                    01803 269895
                  </a>
                </MagneticButton>
                <MagneticButton className="block">
                  <a
                    href="mailto:info@auto-cleanse.co.uk"
                    className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg"
                  >
                    <Mail size={24} className="mr-3" />
                    Send enquiry
                  </a>
                </MagneticButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DPFCleaningTotnes;