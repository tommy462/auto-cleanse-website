import { Link } from 'react-router-dom';
import LegalPage, { LegalSection, legalLinkClass } from '../components/LegalLayout';
import { openCookieSettings } from '../lib/consent';

// Cookie policy. Lists every cookie and browser-storage item the site uses.
// Nothing from Google loads until the visitor accepts (src/lib/consent.ts), so
// the "only if you accept" list must stay in step with that file.

interface Item {
  name: string;
  setBy: string;
  purpose: string;
  lasts: string;
}

const ESSENTIAL: Item[] = [
  {
    name: 'ac-cookie-consent',
    setBy: 'This website (browser storage)',
    purpose: 'Remembers whether you chose Accept or Reject, so we don\'t ask on every page.',
    lasts: 'Until you change your choice or clear your browser data',
  },
];

const WITH_CONSENT: Item[] = [
  {
    name: '_ga',
    setBy: 'Google Analytics',
    purpose: 'Tells repeat visits apart from new ones, so we can count visitors.',
    lasts: '2 years',
  },
  {
    name: '_ga_ followed by our account ID',
    setBy: 'Google Analytics',
    purpose: 'Keeps track of your current visit.',
    lasts: '2 years',
  },
  {
    name: '_gcl_au, and _gcl_aw if you arrive from a Google ad',
    setBy: 'Google Ads',
    purpose: 'Links a call tap or enquiry back to the ad that brought you here, so we know which ads work.',
    lasts: '90 days',
  },
  {
    name: 'ac_trade_campaign_ followed by the area',
    setBy: 'This website (browser storage), trade invitation pages only',
    purpose: 'Remembers which of our printed letters brought you to the page, so a trade claim form shows where it came from.',
    lasts: 'Until you close the browser tab',
  },
];

function ItemList({ items }: { items: Item[] }) {
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <dl key={c.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <div className="mb-2">
            <dt className="sr-only">Name</dt>
            <dd className="font-mono text-white break-words">{c.name}</dd>
          </div>
          <div className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5">
            <dt className="text-white/40">Set by</dt>
            <dd className="text-white/75">{c.setBy}</dd>
            <dt className="text-white/40">Why</dt>
            <dd className="text-white/75">{c.purpose}</dd>
            <dt className="text-white/40">Lasts</dt>
            <dd className="text-white/75">{c.lasts}</dd>
          </div>
        </dl>
      ))}
    </div>
  );
}

export default function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      seoTitle="Cookie Policy | Auto-Cleanse"
      description="The cookies and browser storage the Auto-Cleanse website uses, what each one does, and how to accept, reject or change your choice."
      path="/cookie-policy"
      intro={
        <p>
          Cookies are small files a website stores in your browser. Similar technology, such as
          browser storage and tracking scripts, is covered by the same rules, so this page lists all
          of it. In short: Google Analytics and Google Ads don't load until you choose
          &ldquo;Accept&rdquo;, and the website works the same whichever you choose.
        </p>
      }
    >
      <LegalSection title="Always on: needed for the site to work">
        <p>These don't need your consent because the site can't do what you ask without them.</p>
        <ItemList items={ESSENTIAL} />
        <p>
          When you pay a remap deposit you are taken to Stripe's secure payment page. Stripe sets its
          own cookies there to process the payment and prevent fraud.
        </p>
      </LegalSection>

      <LegalSection title="Only if you choose Accept">
        <p>
          These help us see which pages and adverts bring in calls and enquiries. Google Analytics
          and Google Ads don't load at all, and none of these are set, unless you accept.
        </p>
        <ItemList items={WITH_CONSENT} />
        <p>
          The Google lifetimes above are Google's standard settings. Google may also set cookies on
          its own websites (such as google.com) to measure adverts. Google explains how it uses this
          information at policies.google.com/technologies/cookies.
        </p>
      </LegalSection>

      <LegalSection title="Changing your mind">
        <p>
          You can change your choice at any time. If you switch from Accept to Reject, we remove the
          Google cookies stored for our website and reload the page, so Google Analytics and Google
          Ads stop from that point.
        </p>
        <p>
          <button
            type="button"
            onClick={openCookieSettings}
            className="min-h-[44px] rounded-xl border border-white/25 px-5 text-white text-sm font-bold hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
          >
            Change cookie settings
          </button>
        </p>
        <p>
          You can also use &ldquo;Cookie Settings&rdquo; at the bottom of every page, or delete
          cookies in your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="Things we don't use">
        <p>
          We don't embed videos, maps or social media feeds, and we don't use Facebook, TikTok or
          other social media tracking. Links to our Facebook, Instagram, YouTube and WhatsApp take
          you to those services, which use their own cookies.
        </p>
        <p>
          Our website fonts are loaded from Google Fonts. That doesn't set cookies, but Google
          receives your IP address when the fonts load. See our{' '}
          <Link to="/privacy" className={legalLinkClass}>Privacy Policy</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
