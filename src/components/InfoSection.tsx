interface InfoSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

// Reusable dark/orange content card used on the DPF landing pages.
export default function InfoSection({ icon, title, children }: InfoSectionProps) {
  return (
    <section className="relative p-7 md:p-10 rounded-[2rem] bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/20 transition-colors duration-500 overflow-hidden shadow-xl shadow-black">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mr-5 shrink-0 text-[#FF7A00]">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <div className="text-white/60 leading-relaxed space-y-4 text-base md:text-lg font-medium">
        {children}
      </div>
    </section>
  );
}
