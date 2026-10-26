import { Link } from 'react-router-dom';
import LegalPage, { LegalSection, ContactLines, legalLinkClass } from '../components/LegalLayout';
import { BUSINESS, COMPANY, WORKSHOP_ADDRESS_LINE } from '../data/business';
import { BOOKING_CONFIG } from '../config/booking';
import { DEPOSIT_NOTICE_HOURS } from '../data/legal';

// Cancellation and refund policy. Section 2 restates the 14-day cancellation
// right from the Consumer Contracts Regulations 2013 (distance and off-premises
// contracts) and the deposit rule must never override it. The booking page
// tick box and the confirmation email (src/server/bookingEmails.ts) quote this.

const deposit = BOOKING_CONFIG.depositAmountDisplay;

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Cancellation & Refund Policy"
      seoTitle="Cancellation & Refund Policy | Auto-Cleanse"
      description={`How to cancel or move an Auto-Cleanse booking, when the ${deposit} remap deposit is refunded, and your 14-day right to cancel as a private customer.`}
      path="/refund-policy"
      intro={
        <p>
          How to cancel or move a booking, and when you get your money back. These rules sit
          alongside our{' '}
          <Link to="/terms" className={legalLinkClass}>Terms &amp; Conditions</Link>.
        </p>
      }
    >
      <LegalSection title={`1. Remap bookings and the ${deposit} deposit`}>
        <ul>
          <li>
            <strong>{DEPOSIT_NOTICE_HOURS} hours' notice or more:</strong> if you cancel or move your
            appointment at least {DEPOSIT_NOTICE_HOURS} hours before it starts, we refund your deposit
            in full, or move your booking for free.
          </li>
          <li>
            <strong>Less than {DEPOSIT_NOTICE_HOURS} hours' notice, or not turning up:</strong> we keep
            the deposit, because a slot given up at short notice usually can't be filled.
          </li>
          <li>
            This doesn't affect your legal right to cancel in section 2, which comes first.
          </li>
          <li>
            The deposit comes off the price of the job when the work is done.
          </li>
          <li>
            If we have to cancel or move your appointment, you choose: a full refund of your
            deposit, or a new date.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Your legal right to cancel (private customers)">
        <p>
          If you are a private customer and you book online, by phone, by message or away from our
          premises (for example at your home), you can cancel within <strong>14 days</strong> of
          the day you booked, without giving a reason.
        </p>
        <ul>
          <li>
            If we haven't started the work, you get everything you paid back, including the deposit.
          </li>
          <li>
            If you asked us to do the work within those 14 days (for example by booking an
            appointment inside that time) and you cancel after we have started, you pay for the work
            done up to the point you told us.
          </li>
          <li>
            Once the work is finished, you can no longer cancel. You still have your rights if the
            work wasn't done properly (see section 5).
          </li>
        </ul>
        <p>
          <strong>How to cancel:</strong> tell us clearly that you want to cancel, by email, phone,
          text or letter, before the 14 days are up. You can use the form at the bottom of this page,
          but you don't have to.
        </p>
        <ContactLines />
      </LegalSection>

      <LegalSection title="3. DPF cleaning, diagnostics, AdBlue and postal jobs">
        <p>
          These are usually paid for when the work is finished, so there is normally nothing to
          refund. If you change your mind before we start, just tell us; there is nothing to pay for
          work we haven't started. If we already have your filter, we'll agree with you how to get
          it back to you.
        </p>
      </LegalSection>

      <LegalSection title="4. How refunds are paid">
        <p>
          We refund to the card or account you paid with, within 14 days of you telling us you are
          cancelling. Card refunds can take a few working days to show on your statement.
        </p>
      </LegalSection>

      <LegalSection title="5. If our work wasn't right">
        <p>
          Tell us as soon as you can. Private customers have rights under the Consumer Rights Act
          2015: if our work wasn't carried out with reasonable care and skill, we will put it right
          at no extra cost, and if we can't, you can ask for some or all of your money back. See
          section 11 of our <Link to="/terms" className={legalLinkClass}>Terms &amp; Conditions</Link>.
        </p>
      </LegalSection>

      <LegalSection title="6. Business customers">
        <p>
          The 14-day right to cancel in section 2 is for private customers only. The deposit rules
          in section 1 apply to everyone.
        </p>
      </LegalSection>

      <LegalSection id="cancellation-form" title="Cancellation form">
        <p>
          Copy this into an email or letter, fill it in and send it to us. You don't have to use it.
        </p>
        <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4 sm:p-5 text-sm text-white/80 space-y-3">
          <p>
            To: {COMPANY.legalName} ({BUSINESS.name}), {WORKSHOP_ADDRESS_LINE}. Email:{' '}
            {BUSINESS.email}
          </p>
          <p>I give notice that I cancel my contract for the supply of the following service:</p>
          <p>Service: ____________________</p>
          <p>Booked on: ____________________</p>
          <p>Your name: ____________________</p>
          <p>Your address: ____________________</p>
          <p>Signature (only if you send this on paper): ____________________</p>
          <p>Date: ____________________</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
