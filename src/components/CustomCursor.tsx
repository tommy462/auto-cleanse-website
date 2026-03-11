import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Use gsap.quickTo for maximum framerate physics lagging
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });

        const onMouseMove = (e: MouseEvent) => {
            // Offset by half width/height to center the cursor
            xTo(e.clientX - 10);
            yTo(e.clientY - 10);

            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Robust check for interactive elements even if OS cursor is hidden via CSS
            const isClickable = target.closest('a, button, input, textarea, select, details, [role="button"], [tabindex]:not([tabindex="-1"]), .card-hover, .group');

            setIsHovering(!!isClickable);
        };

        const onMouseLeave = () => {
            setIsVisible(false);
        };

        const onMouseEnter = () => {
            setIsVisible(true);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
        };
    }, [isVisible]);

    return (
        <div
            ref={cursorRef}
            className={`fixed top-0 left-0 w-5 h-5 bg-white rounded-full pointer-events-none z-[99999] mix-blend-difference
        transition-all duration-300 ease-out hidden md:block
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${isHovering ? 'scale-[3] bg-white opacity-100 border-[0.5px] border-white/20' : 'scale-100 opacity-80 border-none'}
      `}
            style={{
                willChange: 'transform',
            }}
        />
    );
};

export default CustomCursor;
