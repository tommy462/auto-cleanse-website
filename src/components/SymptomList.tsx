import { AlertTriangle } from 'lucide-react';

// Renders a grid of symptom items (crawlable text). Used on DPF landing pages.
export default function SymptomList({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((s) => (
        <div
          key={s}
          className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-4 hover:border-[#FF7A00]/20 transition-colors"
        >
          <AlertTriangle size={18} className="text-[#FF7A00] shrink-0 mt-0.5" />
          <span className="text-white/70 text-sm leading-relaxed">{s}</span>
        </div>
      ))}
    </div>
  );
}
