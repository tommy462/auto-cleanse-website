import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
    title: string;
    desc: string;
}

interface ScrollVideoSectionProps {
    titlePrimary: string;
    titleAccent: string;
    subtitle: string;
    baseUrl: string;
    filenamePrefix: string;
    startFrame: number;
    endFrame: number;
    textBlocks: ProcessStep[];
    reverseLayout?: boolean;
}

const ScrollVideoSection: React.FC<ScrollVideoSectionProps> = ({
    titlePrimary,
    titleAccent,
    subtitle,
    baseUrl,
    filenamePrefix,
    startFrame,
    endFrame,
    textBlocks,
    reverseLayout = false,
}) => {
    const [framesLoaded, setFramesLoaded] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);

    // Use a unique ID for GSAP to avoid cross-component bleed
    const uniqueId = useId().replace(/:/g, '');
    const textClass = `process-text-block-${uniqueId}`;

    const TOTAL_FRAMES = endFrame - startFrame + 1;

    // Preload frames
    useEffect(() => {
        let isMounted = true;

        const loadFrames = async () => {
            const frames: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = startFrame; i <= endFrame; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(8, '0');
                img.src = `${baseUrl}${filenamePrefix}${frameNumber}.jpg`;

                img.onload = () => {
                    if (!isMounted) return;
                    loadedCount++;
                    if (loadedCount === TOTAL_FRAMES) {
                        setFramesLoaded(true);
                    }
                };

                frames.push(img);
            }

            if (isMounted) {
                framesRef.current = frames;
            }
        };

        loadFrames();

        return () => { isMounted = false; };
    }, [baseUrl, filenamePrefix, startFrame, endFrame, TOTAL_FRAMES]);

    // Frame painting logic
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const frames = framesRef.current;

        if (!canvas || !frames.length || frameIndex < 0 || frameIndex >= frames.length) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = frames[frameIndex];
        if (!img.complete) return;

        const maxWidth = 600;
        const maxHeight = 600;
        const aspectRatio = img.naturalWidth / img.naturalHeight;

        let canvasWidth = maxWidth;
        let canvasHeight = maxWidth / aspectRatio;

        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = maxHeight * aspectRatio;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Darken actual frame slightly for dramatic effect
        ctx.filter = 'brightness(0.9) contrast(1.1)';
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        currentFrameRef.current = frameIndex;
    }, []);

    // GSAP Triggers
    useEffect(() => {
        if (!framesLoaded) return;

        const section = sectionRef.current;
        const videoContainer = videoContainerRef.current;
        if (!section || !videoContainer) return;

        drawFrame(0);
        const playhead = { frame: 0 };

        // Set max frame slightly lower than total to ensure we don't jump indices
        const maxFrame = TOTAL_FRAMES - 1;

        // Pinning the video module and playing the frames
        const animation = gsap.to(playhead, {
            frame: maxFrame,
            ease: "none",
            onUpdate: () => {
                drawFrame(Math.round(playhead.frame));
            },
            scrollTrigger: {
                trigger: section,
                start: "top top+=100",
                end: "bottom bottom",
                pin: videoContainer,
                pinSpacing: false,
                scrub: 1,
            }
        });

        // Fading Text logic scoped to this component's text blocks
        const textBlocksDom = gsap.utils.toArray(`.${textClass}`);
        textBlocksDom.forEach((block: any) => {
            gsap.fromTo(block,
                { opacity: 0.1, x: reverseLayout ? -20 : 20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: block,
                        start: "top center+=150",
                        end: "bottom center-=150",
                        toggleActions: "play reverse play reverse" // Fade in, Fade out
                    }
                }
            );
        });

        return () => {
            // Clean up scoped triggers
            ScrollTrigger.getAll().forEach(t => {
                if (t.vars.trigger === section || textBlocksDom.includes(t.vars.trigger)) {
                    t.kill();
                }
            });
            animation.kill();
        };
    }, [framesLoaded, drawFrame, TOTAL_FRAMES, reverseLayout, textClass]);

    return (
        <section className="section-gradient-2 py-24 relative overflow-hidden">
            {/* Subtle Glow Effect */}
            <div className={`absolute top-0 ${reverseLayout ? 'right-1/4' : 'left-1/4'} w-[500px] h-[500px] bg-[#FF7A00]/5 rounded-full blur-[120px] pointer-events-none`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10">
                <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                    <span className="text-white">{titlePrimary} </span>
                    <span className="text-[#FF7A00]">{titleAccent}</span>
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
                    {subtitle}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={sectionRef} className={`relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-12`}>

                    {/* Pinned Video Container - Handles order with flex-col-reverse on mobile or tailwind orders */}
                    <div ref={videoContainerRef} className={`relative w-full max-w-lg mx-auto lg:mx-0 z-10 ${reverseLayout ? 'lg:order-last' : 'lg:order-first'}`}>
                        <div className="glass-panel p-2 rounded-2xl relative shadow-2xl shadow-black/50">
                            <canvas
                                ref={canvasRef}
                                role="img"
                                aria-label="Interactive animation showing the progressive stages of the DPF deep cleaning process"
                                className="w-full h-auto rounded-xl object-contain bg-black/40 min-h-[400px]"
                                style={{ display: 'block', margin: '0 auto', maxHeight: '70vh' }}
                            />

                            {/* Mouse Scroll UI Indicator */}
                            <div className={`absolute ${reverseLayout ? '-left-8 md:-left-16' : '-right-8 md:-right-16'} top-1/2 transform -translate-y-1/2 hidden sm:flex flex-col items-center opacity-80 pointer-events-none`}>
                                <svg
                                    width="32"
                                    height="48"
                                    viewBox="0 0 24 36"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mb-3 drop-shadow-lg"
                                >
                                    <rect x="2" y="2" width="20" height="32" rx="10" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                                    <line x1="12" y1="8" x2="12" y2="14" stroke="#FF7A00" strokeWidth="3" strokeLinecap="round" className="animate-pulse" style={{ animationDuration: '2s' }} />
                                </svg>
                                <span className="text-[#FF7A00] text-[10px] font-bold tracking-widest uppercase opacity-80" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                    Scroll
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Scrolling Text Content */}
                    <div className={`h-full flex flex-col justify-start lg:pt-32 pb-[30vh] space-y-[40vh] relative z-20 ${reverseLayout ? 'lg:order-first' : 'lg:order-last'}`}>
                        {textBlocks.map((step, idx) => (
                            <div key={idx} className={`${textClass} glass-panel-heavy p-8 rounded-2xl ${reverseLayout ? 'border-r-4 border-r-[#FF7A00] lg:mr-8' : 'border-l-4 border-l-[#FF7A00] ml-0 lg:ml-8'}`}>
                                <span className="text-[#FF7A00] font-black text-xl mb-2 block">0{idx + 1}</span>
                                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-white/80 text-lg leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ScrollVideoSection;
