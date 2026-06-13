"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  delay?: number;
};

/**
 * Fade/slide content in as it scrolls into view — with a hard guarantee that it
 * NEVER stays invisible. The old version gated visibility purely on framer's
 * `whileInView`; when the IntersectionObserver didn't fire (bfcache "back"
 * navigation, slow hydration, odd viewports) the element was stuck at
 * `opacity: 0` — including the hero headline + CTA. That's a conversion killer.
 *
 * Safeguards here:
 *  - `prefers-reduced-motion` → render visible immediately, no animation.
 *  - A mount-time fallback: if, shortly after mount, the element is already in
 *    the viewport but the observer hasn't reported it, force it visible. This
 *    catches above-the-fold content (hero) without forcing below-the-fold
 *    sections to appear early — they still wait for a real scroll.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -10% 0px",
  });
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) setForceVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const visible = reduceMotion || inView || forceVisible;

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
