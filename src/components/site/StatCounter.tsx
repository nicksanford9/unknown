"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Counts up when scrolled into view. Non-numeric parts ("24/7", "+", ".") pass through. */
export function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    // Only animate plain numbers (with optional decimal / trailing +): "18", "137+", "4.9"
    const m = value.match(/^(\d+(?:\.\d)?)(\+?)$/);
    if (!m || reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) {
      setDisplay(m[1].includes(".") ? "0.0" : "0");
      return;
    }
    const target = parseFloat(m[1]);
    const decimals = m[1].includes(".") ? 1 : 0;
    const suffix = m[2];
    const duration = 1100;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay((target * eased).toFixed(decimals) + (t === 1 ? suffix : ""));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return <span ref={ref}>{display}</span>;
}
