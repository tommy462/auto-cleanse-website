import React, { useRef } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}

export default function MagneticButton({ children, className = '', strength = 0.3 }: MagneticButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !contentRef.current) return;

        const { clientX, clientY } = e;
        const { height, width, left, top } = containerRef.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        // Move the container
        gsap.to(containerRef.current, {
            x: x * strength,
            y: y * strength,
            duration: 1,
            ease: 'power3.out'
        });

        // Parallax the text slightly more
        gsap.to(contentRef.current, {
            x: x * (strength * 0.5),
            y: y * (strength * 0.5),
            duration: 1,
            ease: 'power3.out'
        });
    };

    const handleMouseLeave = () => {
        if (!containerRef.current || !contentRef.current) return;

        gsap.to(containerRef.current, {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
        });

        gsap.to(contentRef.current, {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
        });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative inline-block ${className}`}
            style={{ willChange: 'transform' }}
        >
            <div
                ref={contentRef}
                style={{ willChange: 'transform' }}
            >
                {children}
            </div>
        </div>
    );
}
