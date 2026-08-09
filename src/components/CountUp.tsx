import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
}

export function CountUp({ value, duration = 1200, className }: CountUpProps) {
  const [display, setDisplay] = useState(value > 0 ? 1 : 0);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || value <= 1) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.max(1, Math.round(eased * value)));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return (
    <span className={className} aria-label={String(value)}>
      {display.toLocaleString()}
    </span>
  );
}
