import { Link } from 'react-router-dom';
import SEO from './SEO';
import { BUSINESS, COMPANY, WORKSHOP_ADDRESS_LINE } from '../data/business';
import { LEGAL_LAST_UPDATED, LEGAL_PAGES } from '../data/legal';

// Shared shell for the legal pages. Everything renders in the prerendered
// HTML (no collapsed sections), so the full text is readable without JS.

export const legalLinkClass = 'text-[#FF7A00] underline underline-offset-2 hover:text-[#FF9500]';

export function LegalSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-28">
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">{title}</h2>
      <div className="space-y-3 text-white/70 text-[15px] sm:text-base leading-relaxed [&_strong]:text-white/90 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2">
        {children}
      </div>
    </section>
  );
}

export function ContactLines() {
  return (
    <p>
      Email{' '}
      <a href={`mailto:${BUSINESS.email}`} className={legalLinkClass}>{BUSINESS.email}</a>
      , call or text{' '}
      <a href={`tel:${BUSINESS.telephone}`} className={legalLinkClass}>{BUSINESS.phoneDisplay}</a>
      , or write to us at {WORKSHOP_ADDRESS_LINE}.
    </p>
  );
}

interface LegalPageProps {
  title: string;
  seoTitle: string;
  description: string;
  path: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

export default function LegalPage({ title, seoTitle, description, path, intro, children }: LegalPageProps) {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <SEO title={seoTitle} description={description} path={path} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">{title}</h1>
        <p className="text-white/50 text-sm mb-8">Last updated: {LEGAL_LAST_UPDATED}</p>
        {intro && <div className="text-white/80 text-base sm:text-lg leading-relaxed mb-10 space-y-3">{intro}</div>}

        {children}

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 text-sm text-white/60 leading-relaxed">
          <h2 className="text-white font-bold text-base mb-2">Who we are</h2>
          <p>
            {BUSINESS.name} is a trading name of {COMPANY.legalName}, a company registered in{' '}
            {COMPANY.registeredIn}, company number {COMPANY.companyNumber}. Registered office:{' '}
            {COMPANY.registeredOffice}. Workshop: {WORKSHOP_ADDRESS_LINE}.
          </p>
          <p className="mt-2">
            {BUSINESS.email} &middot; {BUSINESS.phoneDisplay}
          </p>
          <nav aria-label="Our policies" className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {LEGAL_PAGES.filter((p) => p.path !== path).map((p) => (
              <Link key={p.path} to={p.path} className={legalLinkClass}>{p.name}</Link>
            ))}
          </nav>
        </section>
      </div>
    </div>
  );
}
