import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Faq {
  q: string;
  a: string;
}

function FaqItem({ q, a }: Faq) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-white font-semibold text-base leading-snug group-hover:text-[#FF7A00] transition-colors">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-[#FF7A00] shrink-0 mt-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Answer stays in the DOM at all times (crawlable + matches FAQ schema);
          it is only collapsed visually via CSS grid rows, never removed. */}
      <div
        className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="text-white/55 text-sm md:text-[15px] leading-relaxed pb-5">{a}</p>
        </div>
      </div>
    </div>
  );
}

interface FaqSectionProps {
  faqs: Faq[];
  heading?: React.ReactNode;
  /** Emit FAQPage JSON-LD. Safe because answers are always rendered/visible. */
  includeSchema?: boolean;
}

export default function FaqSection({ faqs, heading, includeSchema = true }: FaqSectionProps) {
  if (!faqs.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div>
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
        {heading ?? (
          <>
            <span className="text-white">Frequently Asked </span>
            <span className="text-[#FF7A00]">Questions</span>
          </>
        )}
      </h2>
      <div className="rounded-2xl bg-[#111317] border border-white/5 px-6 sm:px-8">
        {faqs.map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </div>
  );
}
