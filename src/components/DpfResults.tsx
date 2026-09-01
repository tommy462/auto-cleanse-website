import { Gauge, ClipboardCheck, Wind, Microscope } from 'lucide-react';
import { DPF_RESULTS } from '../data/dpf-results';

// "Real DPF Cleaning Results" section.
//
// Deliberately evidence-led rather than marketing-led. When genuine before/after
// readings exist in src/data/dpf-results.ts they are rendered as measured pairs;
// while that file is empty the section explains what is actually measured instead
// of showing invented numbers. Both states carry the same honest disclaimer.
const MEASURED = [
  {
    icon: Microscope,
    title: 'Inspected first',
    body: 'The filter is visually inspected for cracks, melted or collapsed substrate and oil contamination before any cleaning starts.',
  },
  {
    icon: Gauge,
    title: 'Flow tested before',
    body: 'A pre-clean flow and back-pressure reading records the condition the filter arrived in.',
  },
  {
    icon: Wind,
    title: 'Machine cleaned & dried',
    body: 'Off-vehicle machine cleaning to remove accumulated soot and ash, followed by a controlled hot-air drying stage.',
  },
  {
    icon: ClipboardCheck,
    title: 'Flow tested after',
    body: 'The same test is repeated after cleaning, so the change is measured rather than assumed, and reported back to you.',
  },
];

export default function DpfResults() {
  const hasReadings = DPF_RESULTS.length > 0;

  return (
    <div>
      <div className="max-w-3xl mb-8 md:mb-10">
        <div className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase mb-3">
          Evidence, not guesswork
        </div>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-4">
          Real DPF cleaning results
        </h2>
        <p className="text-white/55 text-base md:text-lg leading-relaxed">
          Every filter is tested before and after cleaning, so you get a measured result rather than
          a promise. Here is exactly what we check.
        </p>
      </div>

      {hasReadings ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {DPF_RESULTS.map((r) => (
            <div
              key={`${r.vehicle}-${r.before}-${r.after}`}
              className="rounded-2xl bg-[#111317] border border-white/5 p-6 hover:border-[#FF7A00]/25 transition-colors duration-300"
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">
                Vehicle
              </div>
              <div className="text-white font-bold text-lg leading-snug mb-5">{r.vehicle}</div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">
                    Before
                  </div>
                  <div className="text-white font-mono font-bold text-xl">{r.before}</div>
                </div>
                <div className="rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/25 p-3">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#FF7A00]/80 mb-1">
                    After
                  </div>
                  <div className="text-[#FF7A00] font-mono font-bold text-xl">{r.after}</div>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">
                Result
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{r.outcome}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/5 border border-white/5">
          {MEASURED.map((m, i) => (
            <div key={m.title} className="bg-[#111317] p-6 md:p-7">
              <div className="flex items-center gap-3 mb-4">
                <m.icon size={20} className="text-[#FF7A00] shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs text-white/30 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-white font-bold text-base mb-2 leading-snug">{m.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-white/40 text-sm leading-relaxed mt-6 max-w-3xl">
        Results vary depending on filter condition. Filters with internal or physical damage may not
        be recoverable. We test first and tell you honestly if cleaning is not the right answer.
      </p>
    </div>
  );
}
