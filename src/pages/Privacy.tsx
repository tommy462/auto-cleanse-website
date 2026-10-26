import { Link } from 'react-router-dom';
import LegalPage, { LegalSection, ContactLines, legalLinkClass } from '../components/LegalLayout';
import { BUSINESS, COMPANY } from '../data/business';

// Privacy notice. Every form, service and provider listed here was checked
// against the code (forms, /api, src/server, index.html) in October 2026. If a
// new form, provider or tracking tag is added, update this page in the same
// change, and keep the "last updated" date (src/data/legal.ts) current.

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      seoTitle="Privacy Policy | Auto-Cleanse"
      description="How Auto-Cleanse collects, uses and protects your personal data: enquiries, bookings, payments, the chat assistant, the technical bulletin and website analytics."
      path="/privacy"
      intro={
        <p>
          This explains what personal information we collect, why we need it, who we share it with,
          how long we keep it and what your rights are. It covers our website, phone calls, texts,
          WhatsApp and email.
        </p>
      }
    >
      <LegalSection title="Who is responsible for your data">
        <p>
          {COMPANY.legalName}, trading as {BUSINESS.name}, is the controller of your personal data.
          That means we decide how it is used and we are responsible for looking after it.
        </p>
        <ContactLines />
      </LegalSection>

      <LegalSection title="What we collect and why">
        <p>
          The law says we need a lawful basis for each use of your data. We have listed it in brackets.
        </p>
        <ul>
          <li>
            <strong>Calls, texts, WhatsApp and emails.</strong> Your name, number or email address,
            your vehicle details and whatever you tell us about the problem. We use it to answer you,
            quote and do the job (to take steps you ask for before a contract, and to carry out our
            contract with you).
          </li>
          <li>
            <strong>Enquiry and callback forms.</strong> Your name, phone number, vehicle
            registration if you give it, the service you choose, your message and the page you sent
            it from. We use it to call you back and quote (steps you ask for before a contract).
          </li>
          <li>
            <strong>Remap bookings.</strong> Your name, email, phone number, vehicle registration,
            make and model, what you want from the remap, any notes and add-ons, the appointment you
            choose and the price. For mobile bookings, your address and postcode too. We also record
            that you accepted our booking terms and when. We use it to book and carry out the work
            (contract).
          </li>
          <li>
            <strong>Card payments.</strong> Deposits are paid through Stripe. Stripe handles your card
            details and we never see your full card number. We see the payment, the amount and its
            status (contract).
          </li>
          <li>
            <strong>Postal DPF bookings.</strong> Your name, email, phone number, address, vehicle
            registration, make and model and any notes, and that you accepted our terms. We use it to
            log your filter in and send it back (contract).
          </li>
          <li>
            <strong>Trade applications and trade offers.</strong> Your business name, your name,
            phone number, email, postcode and the details you give about your business, your files
            or your DPF. We use it to set up and run the trade service you asked for (steps before a
            contract, contract, and our legitimate interest in dealing with business customers).
          </li>
          <li>
            <strong>Technical bulletin.</strong> Your email address, so we can send you the
            bulletin (your consent). Every email has an unsubscribe link.
          </li>
          <li>
            <strong>Chat assistant.</strong> What you type into the chat on our website, so it can
            answer your question (our legitimate interest in answering questions about our services).
            The answers are automated. Please don't type personal, vehicle-owner or payment details
            into the chat; call us instead.
          </li>
          <li>
            <strong>Registration lookups.</strong> When you use our vehicle lookup, the registration
            you enter is sent to the DVLA Vehicle Enquiry Service, the DVSA MOT history service and
            totalcarcheck.co.uk to find the vehicle's details and power figures. We don't link the
            registration to you unless you then contact us (our legitimate interest in showing you
            accurate vehicle information).
          </li>
          <li>
            <strong>Website analytics and advertising measurement.</strong> Only if you choose
            &ldquo;Accept&rdquo; in our cookie banner: Google Analytics and Google Ads record which
            pages you visit, your device and browser type, roughly where you are (town level), how
            you found us (for example from one of our ads) and whether you tapped a call or WhatsApp
            button or sent a form. They do not receive what you type into our forms (your consent).
            See our{' '}
            <Link to="/cookie-policy" className={legalLinkClass}>Cookie Policy</Link>.
          </li>
          <li>
            <strong>Running the website.</strong> Like any website, our hosting provider logs your IP
            address, browser and the pages requested, to deliver the site and keep it secure. Your
            browser also fetches our fonts from Google Fonts, which means Google receives your IP
            address (our legitimate interest in running a secure, working website).
          </li>
          <li>
            <strong>Letters to garages.</strong> We post information about our trade services to
            garages and workshops, using business names and addresses that are publicly available
            (our legitimate interest in telling businesses about our services). Tell us if you'd
            rather not hear from us and we'll stop.
          </li>
          <li>
            <strong>Job records.</strong> Details of the work we do, your vehicle, invoices and
            payments (contract, and our legal obligation to keep tax and accounting records).
          </li>
        </ul>
        <p>
          You don't have to give us your details, but we can't quote, book or carry out work without
          the ones marked as required.
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <p>
          We never sell your data. We share it only with the people and providers who help us run the
          business, and only what they need:
        </p>
        <ul>
          <li><strong>Vercel</strong> hosts our website and the parts of it that process bookings.</li>
          <li><strong>Make.com</strong> receives form submissions and chat messages and passes them to us. Chat messages are also passed to the AI service that writes the chat replies.</li>
          <li><strong>Supabase</strong> stores our booking and job records, and some of the images and videos on our website.</li>
          <li><strong>Stripe</strong> takes deposit payments.</li>
          <li><strong>Resend</strong> sends booking confirmation emails and the technical bulletin.</li>
          <li><strong>Google</strong> provides our appointment calendar, our website fonts and, only if you accept cookies, Google Analytics and Google Ads.</li>
          <li><strong>DVLA, DVSA and totalcarcheck.co.uk</strong> receive a registration number when you use our vehicle lookup.</li>
          <li><strong>Independent technicians in our national network.</strong> For AdBlue work outside Devon, the technician who attends gets your name, phone number, vehicle details and where the vehicle is.</li>
          <li><strong>Couriers.</strong> If you book a courier through Parcel2Go to send us a DPF, you deal with them directly and their own privacy policy applies.</li>
          <li><strong>WhatsApp.</strong> If you message us on WhatsApp, WhatsApp (Meta) handles that message under its own terms.</li>
          <li><strong>Our accountant, insurers and professional advisers</strong>, and HMRC, the police or a court where the law requires it.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Data sent outside the UK">
        <p>
          Some of these providers are based in, or use servers in, the European Union or the United
          States. Where your data leaves the UK, it is protected by UK adequacy regulations (for the
          EU, and for US companies certified under the UK-US data bridge) or by the ICO's approved
          contract terms for international transfers.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <ul>
          <li><strong>Enquiries that don't become a job:</strong> up to 12 months after we last spoke, in case you come back to us, then deleted.</li>
          <li><strong>Bookings, job records and invoices:</strong> 6 years after the job, because tax and accounting law requires it.</li>
          <li><strong>Technical bulletin:</strong> until you unsubscribe. After that we keep only a note that you unsubscribed, so you aren't added again by mistake.</li>
          <li><strong>Chat messages:</strong> we don't keep them as customer records. They may stay in our providers' logs for a limited time.</li>
          <li><strong>Analytics:</strong> for the period set in our Google Analytics account, no longer than 14 months.</li>
          <li><strong>Hosting logs:</strong> a short period set by our hosting provider.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>You have the right to:</p>
        <ul>
          <li>ask for a copy of the personal data we hold about you;</li>
          <li>ask us to correct it if it is wrong;</li>
          <li>ask us to delete it, or to restrict how we use it;</li>
          <li>object to how we use it, including at any time to any marketing;</li>
          <li>ask us to send it to you or another organisation in a usable format; and</li>
          <li>withdraw your consent at any time where we rely on consent (for the bulletin and for cookies).</li>
        </ul>
        <p>
          To use any of these rights, email{' '}
          <a href={`mailto:${BUSINESS.email}`} className={legalLinkClass}>{BUSINESS.email}</a>{' '}
          or call us. We will reply within one month. Some rights have limits: for example, we must
          keep invoices for 6 years even if you ask us to delete them.
        </p>
      </LegalSection>

      <LegalSection title="Complaints">
        <p>
          If you are unhappy with how we have handled your data, please tell us first using the
          details above. We will acknowledge your complaint within 30 days and tell you what we have
          done about it.
        </p>
        <p>
          You can also complain to the Information Commissioner's Office (ICO), the UK regulator for
          data protection, at ico.org.uk or on 0303 123 1113.
        </p>
      </LegalSection>

      <LegalSection title="Automated decisions">
        <p>
          We don't make decisions about you by automated means. The chat assistant gives automated
          answers to general questions, but quotes, bookings and anything about your job are always
          dealt with by us.
        </p>
      </LegalSection>

      <LegalSection title="Keeping your data safe">
        <p>
          Our website uses an encrypted (https) connection, and the providers we use to store and
          process your data have their own security controls.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          If we change how we use your data, we will update this page and the &ldquo;last
          updated&rdquo; date at the top.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
