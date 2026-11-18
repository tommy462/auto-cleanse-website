import { Phone, CalendarClock, Clock, PoundSterling, MessageCircle } from 'lucide-react';
import { DPF_FITTED, DPF_FITTED_WHATSAPP } from '../data/dpf-fitting';

const ICONS = [CalendarClock, Clock, PoundSterling];

interface Props {
  /** Called when the call button is tapped (pages pass their own CTA tracking). */
  onCall?: () => void;
  /** Called when the WhatsApp button is tapped. */
  onWhatsApp?: () => void;
  /** Extra classes for the card, e.g. `reveal-item` inside a reveal container. */
  className?: string;
}

// The fitted DPF offer (remove, clean, refit at the workshop). Replaces the old
// "Need help with removal & refitting? Call to discuss availability" box on the DPF
// pages. Wording lives in data/dpf-fitting.ts.
export default function DpfFittedService({ onCall, onWhatsApp, className = '' }: Props) {
  return (
    <div className={`rounded-2xl bg-[#1A1D22] border border-white/5 border-l-4 border-l-[#FF7A00] p-5 sm:p-6 md:p-8 ${className}`}>
      <p className="text-[11px] sm:text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
        {DPF_FITTED.eyebrow}
      </p>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">
        {DPF_FITTED.headline}
      </h2>
      <p className="text-white/65 text-[15px] md:text-base leading-relaxed max-w-3xl mb-5 md:mb-6">
        {DPF_FITTED.intro}
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
        {DPF_FITTED.points.map((p, i) => {
          const Icon = ICONS[i] ?? Clock;
          return (
            <li key={p.title} className="flex items-start gap-3 rounded-xl bg-black/30 border border-white/5 p-4">
              <Icon size={20} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-white font-bold text-[15px] leading-snug mb-1">{p.title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{p.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-white/55 text-sm leading-relaxed max-w-3xl mb-2">{DPF_FITTED.labour}</p>
      <p className="text-white/55 text-sm leading-relaxed max-w-3xl mb-6">{DPF_FITTED.noSurprises}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="tel:07823649190"
          onClick={onCall}
          className="btn-shine w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2.5 min-h-[48px]"
          aria-label="Call Auto-Cleanse on 07823 649190 for a fitted DPF price"
        >
          <Phone size={18} aria-hidden="true" /> Call for a fitted price
        </a>
        <a
          href={DPF_FITTED_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsApp}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2.5 min-h-[48px]"
          aria-label="Message Auto-Cleanse on WhatsApp for a fitted DPF price"
        >
          <MessageCircle size={18} className="text-[#25D366]" aria-hidden="true" /> WhatsApp your reg
        </a>
      </div>
      <p className="text-white/45 text-sm mt-4">{DPF_FITTED.cantDrive}</p>
    </div>
  );
}
