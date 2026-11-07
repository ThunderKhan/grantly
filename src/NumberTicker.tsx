// avoid-ai-design-ignore-file: M5 -- Requested state-change counters; initial render always uses actual state and never counts from a fabricated zero.
// Adapted from Magic UI NumberTicker, MIT. See THIRD_PARTY_NOTICES.md.
import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "./motion";

export function NumberTicker({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [initialValue] = useState(value);
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    visualDuration: 0.25,
    bounce: 0,
  });
  useEffect(() => {
    if (reduced) {
      springValue.jump(value);
      if (ref.current) ref.current.textContent = String(value);
      return;
    }
    motionValue.set(value);
    return springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = String(Math.round(latest));
    });
  }, [value, reduced, motionValue, springValue]);
  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true" className="number-ticker">
        {initialValue}
      </span>
    </>
  );
}
