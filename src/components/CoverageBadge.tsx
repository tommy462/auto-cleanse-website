import { MapPin } from 'lucide-react';

// "<town> is an area we cover", shown straight under the H1 on the national
// AdBlue and remap town pages so coverage is clear on the first screen.
export default function CoverageBadge({ name }: { name: string }) {
  return (
    <p className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-white font-semibold text-sm md:text-base">
      <MapPin size={16} className="text-[#FF7A00] shrink-0" />
      <span>{name} is an area we cover</span>
    </p>
  );
}
