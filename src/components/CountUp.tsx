import { useCallback, useEffect, useMemo, useRef } from 'react';

interface CountUpProps {
    to: number;
    from?: number;
    direction?: 'up' | 'down';
    delay?: number;
    duration?: number;
    className?: string;
    startWhen?: boolean;
    separator?: string;
    onStart?: () => void;
    onEnd?: () => void;
}

const getDecimalPlaces = (num: number) => {
    const str = num.toString();

    if (str.includes('.')) {
        const decimals = str.split('.')[1];

        if (parseInt(decimals) !== 0) {
            return decimals.length;
        }
    }

    return 0;
};

// Lightweight count-up with no animation library. Uses IntersectionObserver to
// start when scrolled into view and requestAnimationFrame with an ease-out curve
// to mimic the previous spring settle. Removing framer-motion here lets it be
// tree-shaken out of the bundle entirely.
export default function CountUp({
    to,
    from = 0,
    direction = 'up',
    delay = 0,
    duration = 2,
    className = '',
    startWhen = true,
    separator = '',
    onStart,
    onEnd
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const rafRef = useRef<number | null>(null);

    const startValue = direction === 'down' ? to : from;
    const endValue = direction === 'down' ? from : to;

    const maxDecimals = useMemo(
        () => Math.max(getDecimalPlaces(from), getDecimalPlaces(to)),
        [from, to]
    );

    const formatValue = useCallback(
        (latest: number) => {
            const hasDecimals = maxDecimals > 0;

            const options = {
                useGrouping: !!separator,
                minimumFractionDigits: hasDecimals ? maxDecimals : 0,
                maximumFractionDigits: hasDecimals ? maxDecimals : 0
            };

            const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);

            return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
        },
        [maxDecimals, separator]
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Reset to the starting value whenever inputs change.
        el.textContent = formatValue(startValue);

        if (!startWhen) return;

        let started = false;

        const animate = () => {
            if (started) return;
            started = true;

            if (typeof onStart === 'function') onStart();

            const beginAt = performance.now() + delay * 1000;
            const totalMs = Math.max(duration * 1000, 1);
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

            const tick = (now: number) => {
                const elapsed = now - beginAt;

                if (elapsed < 0) {
                    rafRef.current = requestAnimationFrame(tick);
                    return;
                }

                const progress = Math.min(elapsed / totalMs, 1);
                const current = startValue + (endValue - startValue) * easeOut(progress);

                if (ref.current) ref.current.textContent = formatValue(current);

                if (progress < 1) {
                    rafRef.current = requestAnimationFrame(tick);
                } else if (typeof onEnd === 'function') {
                    onEnd();
                }
            };

            rafRef.current = requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate();
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '0px' }
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [startWhen, delay, duration, startValue, endValue, formatValue, onStart, onEnd]);

    return (
        <span className={className} ref={ref}>
            {formatValue(startValue)}
        </span>
    );
}
