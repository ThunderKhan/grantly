import {
  Children,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useAnimate } from "motion/react-mini";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true,
  );
}
const ease = [0.22, 1, 0.36, 1] as const;

// Adapted from Motion Primitives AnimatedGroup (MIT). Stable record keys,
// capped staggering, FLIP reorder and reduced-motion handling are GRANTLY additions.
export function AnimatedGroup({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const items = Children.toArray(children);
  const signature = items
    .map((item, index) =>
      typeof item === "object" && "key" in item ? item.key : index,
    )
    .join("|");
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  const positions = useRef(new Map<string, DOMRect>());
  useLayoutEffect(() => {
    const elements = Array.from(
      scope.current.querySelectorAll<HTMLElement>(
        ":scope > [data-motion-item]",
      ),
    );
    const next = new Map<string, DOMRect>();
    const controls: { stop: () => void }[] = [];
    let entering = 0;
    // Read all geometry before starting any animations.
    const measured = elements.map((element) => ({
      element,
      rect: element.getBoundingClientRect(),
    }));
    for (const { element, rect } of measured) {
      const key = element.dataset.motionItem!;
      next.set(key, rect);
      if (reduced || rect.top > innerHeight || rect.bottom < 0) continue;
      const previous = positions.current.get(key);
      if (!previous) {
        controls.push(
          animate(
            element,
            {
              transform: ["translateY(6px)", "translateY(0px)"],
            },
            { duration: 0.22, delay: Math.min(entering++ * 0.02, 0.08), ease },
          ),
        );
      } else {
        const x = previous.left - rect.left,
          y = previous.top - rect.top;
        if (Math.abs(x) + Math.abs(y) > 1)
          controls.push(
            animate(
              element,
              {
                transform: [`translate(${x}px, ${y}px)`, "translate(0px, 0px)"],
              },
              { duration: 0.22, ease },
            ),
          );
      }
    }
    positions.current = next;
    return () => {
      controls.forEach((control) => control.stop());
      elements.forEach((element) => {
        element.style.removeProperty("transform");
      });
    };
  }, [signature, reduced, animate, scope]);
  return (
    <div ref={scope} className={className}>
      {items.map((item, index) => (
        <div
          className="motion-item"
          data-motion-item={
            typeof item === "object" && "key" in item
              ? String(item.key)
              : String(index)
          }
          key={typeof item === "object" && "key" in item ? item.key : index}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

// UI Layouts' moving active background, adapted to native filter buttons.
// FLIP transforms handle wrapped rows without animating text or layout dimensions.
export function StageIndicator({ value }: { value: string }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const previous = useRef<DOMRect | null>(null);
  useLayoutEffect(() => {
    const indicator = scope.current;
    const list = indicator.parentElement!;
    const selected = list.querySelector<HTMLElement>(
      'button[aria-pressed="true"]',
    );
    if (!selected) return;
    const position = (transition: boolean) => {
      const rect = selected.getBoundingClientRect(),
        parent = list.getBoundingClientRect();
      indicator.getAnimations().forEach((animation) => animation.cancel());
      Object.assign(indicator.style, {
        left: `${rect.left - parent.left}px`,
        top: `${rect.bottom - parent.top + 3}px`,
        width: `${rect.width}px`,
        height: "3px",
        transform: "none",
      });
      const old = previous.current;
      if (transition && old && !reduced)
        animate(
          indicator,
          {
            transform: [
              `translate(${old.left - rect.left}px, ${old.top - rect.top}px) scale(${old.width / rect.width}, ${old.height / rect.height})`,
              "translate(0px, 0px) scale(1, 1)",
            ],
          },
          { duration: 0.22, ease },
        );
      previous.current = rect;
    };
    position(true);
    let firstResize = true;
    const observer = new ResizeObserver(() => {
      if (firstResize) {
        firstResize = false;
        return;
      }
      position(false);
    });
    observer.observe(list);
    return () => {
      observer.disconnect();
      indicator.getAnimations().forEach((animation) => animation.cancel());
    };
  }, [value, reduced, animate, scope]);
  return <span ref={scope} className="stage-indicator" aria-hidden="true" />;
}

export function AnimatedProgress({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  return (
    <div
      className="motion-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <span style={{ transform: `scaleX(${max ? value / max : 0})` }} />
    </div>
  );
}

// Adapted from Magic UI AnimatedCircularProgressBar (MIT); counts are document
// readiness, never an eligibility score. Fixed geometry avoids layout movement.
export function CircularProgress({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const reduced = useReducedMotion();
  const circumference = 2 * Math.PI * 45;
  const percent = max ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <span
      className="document-ring"
      role="progressbar"
      aria-label="Document readiness"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max} documents ready`}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="45" stroke="var(--border)" />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="var(--focus)"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent)}
          style={{
            transition: reduced
              ? "none"
              : "stroke-dashoffset 240ms var(--ease-out)",
          }}
        />
      </svg>
      <span aria-hidden="true">
        {value}/{max}
      </span>
    </span>
  );
}
