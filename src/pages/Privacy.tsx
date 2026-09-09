import SEO from '../components/SEO';

// Privacy notice. Written to reflect what the Auto-Cleanse site actually does
// (enquiry forms, online booking + payment, the technical-bulletin email, and
// analytics). It is a solid starting point - Auto-Cleanse should review it and,
// if in doubt, have it checked, then keep the "last updated" date current.

const LAST_UPDATED = '24 July 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">{title}</h2>
      <div className="space-y-3 text-white/70 text-sm sm:text-base leading-relaxed">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <SEO
        title="Privacy Policy | AutoCleanse"
        description="How Auto-Cleanse collects, uses and protects your personal data across our enquiry forms, online booking, technical bulletin and website analytics."
        path="/privacy"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">Privacy Policy</h1>
        <p className="text-white/50 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="Who we are">
          <p>
            Auto-Cleanse (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides DPF cleaning, ECU remapping
            and related vehicle services. We are the data controller for the personal information
            described here.
          </p>
          <p>
            Auto-Cleanse, The Old Barn Industrial Estate, Webbers Yard, Totnes, Devon, TQ9 6JY.
            <br />
            Email:{' '}
            <a href="mailto:info@auto-cleanse.co.uk" className="text-[#FF7A00] hover:underline">
              info@auto-cleanse.co.uk
            </a>{' '}
            &middot; Phone:{' '}
            <a href="tel:01803269895" className="text-[#FF7A00] hover:underline">
              01803 269895
            </a>
          </p>
        </Section>

        <Section title="Information we collect">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white/90">Enquiries &amp; callbacks.</strong> When you use an
              enquiry or callback form we collect your name, phone number, email, vehicle
              registration or details, and anything you write in the message.
            </li>
            <li>
              <strong className="text-white/90">Bookings &amp; payments.</strong> When you book a
              service we collect your contact details, vehicle details, collection or workshop
              address and booking preferences. Card payments are processed by Stripe; we do not
              store your full card details.
            </li>
            <li>
              <strong className="text-white/90">Trade offers.</strong> If you claim a trade offer we
              collect your business name, contact details, postcode and any DPF or vehicle details
              you provide.
            </li>
            <li>
              <strong className="text-white/90">Technical bulletin.</strong> If you subscribe to our
              technical bulletin we collect your email address so we can send it to you.
            </li>
            <li>
              <strong className="text-white/90">Website usage.</strong> Like most websites we collect
              limited analytics data (see &ldquo;Cookies and analytics&rdquo; below).
            </li>
          </ul>
        </Section>

        <Section title="How we use your information and our lawful basis">
          <ul className="list-disc pl-5 space-y-2">
            <li>To respond to your enquiry and provide the service you asked for (to take steps at your request and to perform our contract with you).</li>
            <li>To arrange collection, cleaning, testing, return and payment for a job (performance of a contract).</li>
            <li>To send you the technical bulletin, where you have subscribed (your consent, which you can withdraw at any time).</li>
            <li>To run and improve our website and understand how it is used (our legitimate interests in operating our business).</li>
            <li>To keep records and meet our legal and accounting obligations (legal obligation).</li>
          </ul>
        </Section>

        <Section title="Who we share it with">
          <p>
            We do not sell your personal data. We share it only with service providers who process
            it on our behalf to run our business, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Make.com - receives and routes enquiry and booking form submissions.</li>
            <li>Resend - delivers our technical bulletin and related emails.</li>
            <li>Supabase - stores booking and job records.</li>
            <li>Stripe - processes card payments.</li>
            <li>Calendly - schedules booking appointments.</li>
            <li>Google (Analytics and Ads) - website analytics and advertising measurement.</li>
            <li>The DVLA vehicle-enquiry service - used to look up basic vehicle data from a registration.</li>
          </ul>
          <p>
            Some of these providers are based outside the UK. Where personal data is transferred
            internationally, it is protected by appropriate safeguards such as the UK
            International Data Transfer Agreement or equivalent contractual protections.
          </p>
        </Section>

        <Section title="Cookies and analytics">
          <p>
            We use Google Analytics and Google Ads to understand how the site is used and to measure
            our advertising. These set cookies or similar identifiers. You can control cookies through
            your browser settings, and you can opt out of Google Analytics using Google&rsquo;s
            browser add-on.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep enquiry and booking records for as long as needed to provide our service and to
            meet our legal, accounting and tax obligations, then delete or anonymise them. We keep
            bulletin subscriptions until you unsubscribe.
          </p>
        </Section>

        <Section title="Your rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>ask for a copy of the personal data we hold about you;</li>
            <li>ask us to correct or delete it;</li>
            <li>object to, or ask us to restrict, certain processing;</li>
            <li>ask us to transfer it to another provider; and</li>
            <li>withdraw consent at any time where we rely on consent.</li>
          </ul>
          <p>
            To exercise any of these, email{' '}
            <a href="mailto:info@auto-cleanse.co.uk" className="text-[#FF7A00] hover:underline">
              info@auto-cleanse.co.uk
            </a>
            . If you are unhappy with how we handle your data you can complain to the Information
            Commissioner&rsquo;s Office (ICO) at ico.org.uk.
          </p>
        </Section>

        <Section title="Unsubscribing from the bulletin">
          <p>
            Every technical bulletin email includes an unsubscribe link. You can also email us and we
            will remove you. Unsubscribing from marketing does not affect emails about a service you
            have booked.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. When we do, we will change the &ldquo;last
            updated&rdquo; date above.
          </p>
        </Section>
      </div>
    </div>
  );
}
