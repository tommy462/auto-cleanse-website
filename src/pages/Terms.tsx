import { Link } from 'react-router-dom';
import LegalPage, { LegalSection, ContactLines, legalLinkClass } from '../components/LegalLayout';
import { BUSINESS, COMPANY } from '../data/business';
import { BOOKING_CONFIG } from '../config/booking';

// Terms and conditions for every service. Built from what the site already
// promises (booking flow, postal page, AdBlue "how we quote" guide, remap pages)
// plus the Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013.
// The deposit and cancellation rules live on /refund-policy; keep both in step.

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      seoTitle="Terms & Conditions | Auto-Cleanse"
      description="The terms that apply when you book DPF cleaning, ECU remapping, diagnostics, AdBlue repair or trade services with Auto-Cleanse."
      path="/terms"
      intro={
        <>
          <p>
            These terms apply whenever you book or buy a service from us: online, by phone, text,
            WhatsApp, email or in person. Please read them with our{' '}
            <Link to="/refund-policy" className={legalLinkClass}>Cancellation &amp; Refund Policy</Link>.
          </p>
          <p>
            If you are a private customer, nothing in these terms takes away your legal rights.
          </p>
        </>
      }
    >
      <LegalSection title="1. About us">
        <p>
          {BUSINESS.name} is a trading name of {COMPANY.legalName} (company number{' '}
          {COMPANY.companyNumber}). In these terms, &ldquo;we&rdquo; and &ldquo;us&rdquo; means{' '}
          {COMPANY.legalName}.
        </p>
        <ContactLines />
      </LegalSection>

      <LegalSection title="2. Private and business customers">
        <p>
          You are a <strong>private customer</strong> if you are booking mainly for yourself rather
          than for a trade, business or profession. You are a <strong>business customer</strong> if
          you are booking for a business, for example as a garage, fleet or trader. Some of these
          terms are different for business customers, and we say where.
        </p>
      </LegalSection>

      <LegalSection title="3. What we do">
        <ul>
          <li>
            <strong>DPF cleaning</strong> is done off the vehicle at our workshop in Totnes, or by
            post. We don't offer mobile DPF cleaning. Need help with removal and refitting? Call us
            to discuss current availability.
          </li>
          <li>
            <strong>ECU remapping</strong> is done at our workshop, or at your address if you are in
            Devon.
          </li>
          <li>
            <strong>Diagnostics and AdBlue repair</strong> are done by us in Devon. Elsewhere in the
            UK, the work is done by an independent mobile technician from our national network (see
            section 9).
          </li>
          <li>
            <strong>Trade services</strong>, including our ECU file service, are for garages and
            other businesses.
          </li>
        </ul>
        <p>
          We only repair. We don't remove, disable or bypass DPF, EGR, AdBlue/SCR or any other
          emissions equipment, and we don't supply files that do.
        </p>
      </LegalSection>

      <LegalSection title="4. Quotes and prices">
        <ul>
          <li>
            The price for your job is the one shown when you book online, or the one we give you
            when we quote. We are not VAT-registered, so no VAT is added.
          </li>
          <li>
            Online weekend remap bookings carry a {`£${BOOKING_CONFIG.weekendSurchargePounds}`}{' '}
            surcharge, which is shown before you pay.
          </li>
          <li>
            If we find that your vehicle or part needs more work than we quoted for, we will explain
            why and tell you the price. We won't do extra work without your OK.
          </li>
          <li>
            We offer same-day turnaround where possible, but we can't promise it unless we have
            agreed a time with you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Online bookings and deposits">
        <ul>
          <li>
            Online remap bookings need a {BOOKING_CONFIG.depositAmountDisplay} deposit to secure your
            slot. Your booking is confirmed once the payment goes through and we send you a
            confirmation email.
          </li>
          <li>
            The deposit comes off the price of the job. The rest is due on the day, when the work is
            done.
          </li>
          <li>
            How to cancel or move a booking, and when the deposit is refunded, is set out in our{' '}
            <Link to="/refund-policy" className={legalLinkClass}>Cancellation &amp; Refund Policy</Link>.
          </li>
          <li>
            If we have to cancel or move your appointment, you can choose a full refund of your
            deposit or a new date.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Paying">
        <p>
          Unless we have agreed different terms with you (for example a trade account), payment is
          due when the work is finished.
        </p>
      </LegalSection>

      <LegalSection title="7. ECU remapping">
        <ul>
          <li>
            We check the vehicle's health before we remap it, and we only remap a vehicle that is in
            good mechanical condition. If we find a fault, we will explain it, and we won't remap
            until it has been put right.
          </li>
          <li>
            We save a copy of your vehicle's original file before we write anything, so it can be
            returned to standard.
          </li>
          <li>
            The remap we apply is a file matched to your vehicle. Power and torque figures on our
            website are estimates. Real results depend on the vehicle, its condition and its use.
          </li>
          <li>
            We won't remove or change a speed limiter where the law requires the vehicle to have
            one, such as most goods vehicles over 3.5 tonnes, and buses and coaches.
          </li>
          <li>
            We can refuse a remap or add-on if the vehicle isn't safe to work on, or if what's asked
            for would make it illegal to use on the road.
          </li>
        </ul>
        <p><strong>What you need to do:</strong></p>
        <ul>
          <li>
            Tell your insurer about the remap and any add-ons before you drive. A remap is a
            modification, and not telling them can invalidate your cover.
          </li>
          <li>
            If the vehicle is on finance, leased or a company vehicle, check you are allowed to have
            it remapped.
          </li>
          <li>
            Be aware that a remap may affect a manufacturer's warranty.
          </li>
          <li>
            Tell us about any known faults, earlier tuning or modifications before we start.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. DPF cleaning and postal DPFs">
        <ul>
          <li>
            We clean and flow-test your DPF off the vehicle at our workshop.
          </li>
          <li>
            Cleaning removes soot and ash. It can't repair a filter that is cracked, melted or
            otherwise damaged, and it doesn't fix whatever caused the filter to block (such as a
            sensor, EGR, injector or turbo fault, or lots of short journeys). If that cause isn't
            fixed, the filter can block again. If we find damage, we will tell you.
          </li>
          <li>
            We are not responsible for damage or faults that were there before the filter or vehicle
            reached us. We are responsible for damage we cause by not taking reasonable care.
          </li>
        </ul>
        <p><strong>Sending a DPF by post:</strong></p>
        <ul>
          <li>
            You book and pay for the courier to send your filter to us, for example through
            Parcel2Go. Pack it securely, drain any excess fluid and include your job reference.
          </li>
          <li>
            Until it reaches us, the parcel is the courier's and your responsibility, so check the
            courier's cover is enough for the filter's value.
          </li>
          <li>
            We send it back by tracked courier to the address you give us. For private customers,
            the filter is our responsibility until it is delivered back to you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. AdBlue repairs and our national network">
        <ul>
          <li>
            In Devon our own technician attends. Elsewhere, an independent mobile technician from
            our national network attends, booked and managed by us.
          </li>
          <li>
            Your booking and payment are with us, even when an independent technician does the work.
            If anything isn't right afterwards, contact us, not the technician.
          </li>
          <li>
            If a diagnostic visit is needed, you will know that and any charge for it before anyone
            sets off. The repair price is agreed with you before any repair is done.
          </li>
          <li>
            If the technician finds something else once work starts, they stop and we call you.
            Nothing more is done until you have agreed the new price.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Trade customers">
        <ul>
          <li>
            ECU files are supplied for the vehicle and ECU you tell us about. You are responsible for
            reading and writing the ECU, and for making sure the vehicle and the way it's used stay
            legal.
          </li>
          <li>
            If you claim a trade invitation offer, the offer terms on that invitation page apply as
            well as these terms.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="11. If something isn't right">
        <p>
          Please tell us as soon as you can, and give us the chance to look at it and put it right.
        </p>
        <p>
          If you are a private customer, the Consumer Rights Act 2015 says our work must be carried
          out with reasonable care and skill, and anything we told you about the service that you
          relied on is binding. If it isn't, you can ask us to put it right at no extra cost. If we
          can't, or can't do it within a reasonable time and without great inconvenience to you, you
          can ask for some or all of your money back. This is a short summary of your rights; Citizens
          Advice can tell you more.
        </p>
      </LegalSection>

      <LegalSection title="12. Our responsibility for loss or damage">
        <p>
          <strong>Private customers:</strong> we are responsible for loss or damage you suffer that
          is a foreseeable result of us breaking these terms or not using reasonable care and skill.
          Loss or damage is foreseeable if it was obvious it would happen, or if we both knew it
          might happen when the contract was made. We are not responsible for loss or damage that
          was not foreseeable.
        </p>
        <p>
          <strong>Business customers:</strong> we are not responsible for loss of profit, business,
          revenue or use of the vehicle (downtime), or for any indirect or consequential loss. Our
          total responsibility for any job is limited to the price paid for that job.
        </p>
        <p>
          <strong>For everyone:</strong> nothing in these terms limits our responsibility for death
          or personal injury caused by our negligence, for fraud, or for anything else the law does
          not allow us to limit.
        </p>
      </LegalSection>

      <LegalSection title="13. Information on our website">
        <p>
          Our blog posts, guides and chat assistant give general information, not advice about your
          vehicle. The chat assistant's answers are automated and can be wrong. Prices,
          availability and bookings are only confirmed by us, by phone, email or our online booking
          page. Prices on our website were correct when published; the price you pay is the one
          confirmed when you book or when we quote.
        </p>
      </LegalSection>

      <LegalSection title="14. Complaints">
        <p>
          If you have a complaint, contact us using the details in section 1 and we will try to
          sort it out. If we can't agree, Citizens Advice can help private customers with their next
          steps.
        </p>
      </LegalSection>

      <LegalSection title="15. Which law applies">
        <p>
          These terms are governed by the law of England and Wales. If you are a private customer
          living in Scotland or Northern Ireland, you can also bring a claim in your local courts.
        </p>
      </LegalSection>

      <LegalSection title="16. Changes to these terms">
        <p>
          We may update these terms from time to time. The version on this page when you book is
          the one that applies to that booking.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
