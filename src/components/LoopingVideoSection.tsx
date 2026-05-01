import React, { useRef } from 'react';

interface ProcessStep {
  title: string;
  desc: string;
}

interface LoopingVideoSectionProps {
  titlePrimary: string;
  titleAccent: string;
  subtitle: string;
  videoUrl: string;
  textBlocks: ProcessStep[];
  reverseLayout?: boolean;
  variant?: 'steps' | 'editorial';
}

const LoopingVideoSection: React.FC<LoopingVideoSectionProps> = ({
  titlePrimary,
  titleAccent,
  subtitle,
  videoUrl,
  textBlocks,
  reverseLayout = false,
  variant = 'steps',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="section-gradient-2 py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className={`absolute top-0 ${reverseLayout ? 'right-1/4' : 'left-1/4'} w-[500px] h-[500px] bg-[#FF7A00]/5 rounded-full blur-[120px] pointer-events-none`} />

      {/* Section heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10">
        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
          <span className="text-white">{titlePrimary} </span>
          <span className="text-[#FF7A00]">{titleAccent}</span>
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">{subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Video */}
          <div className={`relative w-full max-w-lg mx-auto lg:mx-0 ${reverseLayout ? 'lg:order-last' : 'lg:order-first'}`}>
            <div className="glass-panel p-2 rounded-2xl shadow-2xl shadow-black/50">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-xl object-cover bg-black/40"
                style={{ minHeight: '320px', maxHeight: '70vh' }}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Text content */}
          <div className={`flex flex-col justify-center ${reverseLayout ? 'lg:order-first' : 'lg:order-last'}`}>
            {variant === 'steps' ? (
              <div className="space-y-6">
                {textBlocks.map((step, idx) => (
                  <div
                    key={idx}
                    className={`glass-panel-heavy p-8 rounded-2xl ${reverseLayout ? 'border-r-4 border-r-[#FF7A00] lg:mr-8' : 'border-l-4 border-l-[#FF7A00] lg:ml-8'}`}
                  >
                    <span className="text-[#FF7A00] font-black text-xl mb-2 block">0{idx + 1}</span>
                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/80 text-lg leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${reverseLayout ? 'lg:pr-8' : 'lg:pl-8'}`}>
                {/* Bold editorial headline */}
                <div className="mb-10">
                  <p className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                    {textBlocks[0]?.title}.
                    <br />
                    <span className="text-[#FF7A00]">No Compromise.</span>
                  </p>
                </div>

                {/* Punchy statements */}
                <div className="space-y-6">
                  {textBlocks.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="mt-1 w-2 h-2 rounded-full bg-[#FF7A00] shrink-0" />
                      <div>
                        <p className="text-white font-bold text-lg">{step.title}</p>
                        <p className="text-white/60 mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default LoopingVideoSection;
