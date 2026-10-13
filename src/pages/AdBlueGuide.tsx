import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MessageSquare, ArrowRight, Check, ShieldCheck, MapPin, Search } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import FaqSection from '../components/FaqSection';
import Reviews from '../components/Reviews';
import LatestPosts from '../components/LatestPosts';
import QuickEnquiryForm from '../components/QuickEnquiryForm';
import { getReviews, ADBLUE_REVIEW_IDS } from '../data/reviews';
import { BUSINESS, BUSINESS_ID, businessRef } from '../data/business';
import { ADBLUE_GUIDES, ADBLUE_HUB_PATH, guideLabel } from '../data/adblue-guides';
import type { AdBlueGuide as Guide, GuideSection } from '../data/adblue-guides/types';

const CARD = 'relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black';
const LINK = 'text-[#FF7A00] hover:text-[#FF9500] transition-colors';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Fixed formatting so the prerendered HTML and the hydrated page always match.
function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function messageBody(topic: string) {
  return `Hi Auto-Cleanse, ${topic}. Reg: . Postcode: . Dash message: `;
}

function Section({ section }: { section: GuideSection }) {
  return (
    <section className={CARD}>
      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-5">{section.heading}</h2>
      <div className="text-white/60 leading-relaxed space-y-4 text-base md:text-lg font-medium">
        {section.paragraphs.map((p) => <p key={p}>{p}</p>)}
      </div>
      {section.bullets && section.bullets.length > 0 && (
        <ul className="space-y-3 mt-6">
          {section.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-white/70 text-sm md:text-base leading-relaxed">
              <Check size={18} className="text-[#FF7A00] shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {section.steps && section.steps.length > 0 && (
        <ol className="space-y-4 mt-6">
          {section.steps.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center shrink-0 text-[#FF7A00] font-black text-sm">
                {i + 1}
              </span>
              <div>
                <p className="text-white font-bold text-base">{s.title}</p>
                <p className="text-white/55 text-sm leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {section.note && (
        <p className="mt-6 text-sm text-white/70 border-l-2 border-[#FF7A00] pl-4 leading-relaxed">{section.note}</p>
      )}
    </section>
  );
}

export default function AdBlueGuide({ guide }: { guide: Guide }) {
  const url = `${BUSINESS.url}${guide.path}`;
  const telHref = `tel:${BUSINESS.telephone}`;
  const waHref = `https://wa.me/${BUSINESS.telephone.replace('+', '')}?text=${encodeURIComponent(messageBody(guide.messageTopic))}`;
  const smsHref = `sms:${BUSINESS.telephone}?&body=${encodeURIComponent(messageBody(guide.messageTopic))}`;
  const isHub = guide.path === ADBLUE_HUB_PATH;
  const headline = guide.h1Accent ? `${guide.h1} ${guide.h1Accent}` : guide.h1;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      isHub
        ? {
            '@type': 'Service',
            name: 'AdBlue and SCR repair',
            serviceType: 'AdBlue and SCR system diagnosis and repair',
            provider: businessRef,
            url,
            description: guide.metaDescription,
          }
        : {
            '@type': 'TechArticle',
            headline,
            description: guide.metaDescription,
            dateModified: guide.updated,
            author: { '@id': BUSINESS_ID },
            publisher: { '@id': BUSINESS_ID },
            mainEntityOfPage: url,
          },
    ],
  };

  const crumbs = isHub
    ? [{ name: guide.breadcrumb }]
    : guide.kind === 'process'
      ? [{ name: guide.breadcrumb }]
      : [{ name: 'AdBlue repair', path: ADBLUE_HUB_PATH }, { name: guide.breadcrumb }];

  const childGuides = isHub ? ADBLUE_GUIDES.filter((g) => g.path !== ADBLUE_HUB_PATH) : [];

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title={guide.seoTitle} description={guide.metaDescription} path={guide.path} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={crumbs} />

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
            <span className="text-white">{guide.h1}</span>
            {guide.h1Accent && <span className="text-[#FF7A00]"> {guide.h1Accent}</span>}
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-3xl leading-relaxed font-medium">{guide.intro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-2xl">
            <a href={telHref} className="btn-shine px-6 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2">
              <Phone size={18} /> Call {BUSINESS.phoneDisplay}
            </a>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="px-6 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={smsHref} className="px-6 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
              <MessageSquare size={18} /> Text us
            </a>
          </div>
          <p className="text-white/40 text-sm mt-4">
            Have your reg, the exact dash message and any fault codes to hand. We'll tell you on the call what it's likely to be and what happens next.
          </p>
        </header>

        <div className="space-y-8">
          {guide.quickAnswer.length > 0 && (
            <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#FF7A00]/[0.06] border border-[#FF7A00]/25">
              <h2 className="text-sm font-mono uppercase tracking-widest text-[#FF7A00] mb-5">The short answer</h2>
              <dl className="grid gap-4 md:grid-cols-2">
                {guide.quickAnswer.map((qa) => (
                  <div key={qa.label}>
                    <dt className="text-white font-bold">{qa.label}</dt>
                    <dd className="text-white/65 text-sm md:text-base leading-relaxed mt-1">{qa.text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {guide.sections.map((s) => <Section key={s.heading} section={s} />)}

          {isHub && childGuides.length > 0 && (
            <section className={CARD}>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-6">AdBlue guides</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {childGuides.map((g) => (
                  <Link key={g.path} to={g.path} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/75 hover:text-white transition-all group/link">
                    <ArrowRight size={18} className="text-[#FF7A00] mr-3 shrink-0 group-hover/link:translate-x-1 transition-transform" />
                    <span className="font-medium">{g.breadcrumb}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {guide.costFactors && guide.costFactors.length > 0 && (
            <section className={CARD}>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-5">What affects the cost</h2>
              <ul className="space-y-3">
                {guide.costFactors.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-white/70 text-sm md:text-base leading-relaxed">
                    <Check size={18} className="text-[#FF7A00] shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="text-white/55 text-sm md:text-base leading-relaxed mt-6">
                We don't put AdBlue repair prices online because the same warning can mean very different repairs. Call with your reg and the warning message and we'll quote for your vehicle.{' '}
                {guide.path !== '/how-we-quote' && <Link to="/how-we-quote" className={LINK}>How we quote</Link>}
              </p>
            </section>
          )}

          {guide.kind !== 'process' && (
            <div className="grid gap-8 md:grid-cols-2">
              <section className={CARD}>
                <div className="flex items-center gap-4 mb-4">
                  <MapPin size={22} className="text-[#FF7A00] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">Who comes out</h2>
                </div>
                <div className="text-white/60 text-sm md:text-base leading-relaxed space-y-3">
                  <p>In Devon, our own technicians from the Totnes workshop. Outside Devon, we book a vetted independent technician near you where we have one.</p>
                  <p>Either way you deal with us: we quote, take payment and look after anything afterwards. Call and we'll tell you straight away whether we can get someone to you.</p>
                </div>
              </section>
              {guide.kind !== 'legal' && (
                <section className={CARD}>
                  <div className="flex items-center gap-4 mb-4">
                    <ShieldCheck size={22} className="text-[#FF7A00] shrink-0" />
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">We repair. We don't delete.</h2>
                  </div>
                  <div className="text-white/60 text-sm md:text-base leading-relaxed space-y-3">
                    <p>We find the actual fault and fix it, so the vehicle stays road-legal and passes its MOT. We don't remove, disable or emulate AdBlue systems.</p>
                    <p><Link to="/adblue-delete-law" className={LINK}>Why an AdBlue delete isn't the answer</Link></p>
                  </div>
                </section>
              )}
            </div>
          )}

          <section>
            <Reviews
              reviews={getReviews(ADBLUE_REVIEW_IDS)}
              heading={<><span className="text-white">What customers </span><span className="text-[#FF7A00]">say</span></>}
              intro="Genuine Google feedback on our AdBlue, SCR and diagnostic work."
              columns={3}
              showGoogleCta
              showCallCta
            />
          </section>

          <section>
            <FaqSection faqs={guide.faqs} />
          </section>

          <section id="enquiry" className={`${CARD} overflow-hidden scroll-mt-28`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <QuickEnquiryForm
                defaultService="AdBlue / SCR Repair"
                source={`adblue-guide${guide.path.replace(/\//g, '-')}`}
                heading="Get a call back"
                subheading="Tell us your vehicle, where you are, the warning message and any fault codes, and we'll call you back."
              />
            </div>
          </section>

          {guide.related.length > 0 && (
            <section className={CARD}>
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Related</h2>
              <div className="space-y-3">
                {guide.related.map((to) => (
                  <Link key={to} to={to} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/5 text-white/70 hover:text-white transition-all group/link">
                    <ArrowRight size={18} className="text-[#FF7A00] mr-4 shrink-0 group-hover/link:translate-x-2 transition-transform" />
                    <span className="font-medium">{guideLabel(to)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <LatestPosts category="AdBlue" />
          </section>

          <section className="text-center rounded-[2.5rem] bg-[#1A1D22] border border-white/5 p-10 md:p-14 shadow-2xl shadow-black">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Talk to someone who <span className="text-[#FF7A00]">fixes these.</span>
            </h2>
            <p className="text-white/55 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              <Search size={15} className="inline mb-0.5 mr-1 text-[#FF7A00]" />
              Ring with your reg and the warning message. We'll tell you what it's likely to be, who'd come out and what happens next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={telHref} className="btn-shine px-7 py-4 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2">
                <Phone size={18} /> Call {BUSINESS.phoneDisplay}
              </a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="px-7 py-4 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
                <MessageCircle size={18} /> WhatsApp us
              </a>
            </div>
          </section>

          {guide.sources.length > 0 && (
            <section className="px-2 text-white/40 text-xs leading-relaxed">
              <p className="font-mono uppercase tracking-widest mb-2">Sources</p>
              <ul className="space-y-1 list-disc pl-5">
                {guide.sources.map((s) => <li key={s}>{s}</li>)}
              </ul>
              <p className="mt-3">Last reviewed {formatDate(guide.updated)}.</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
