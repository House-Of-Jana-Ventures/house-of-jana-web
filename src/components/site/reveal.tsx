"use client";

import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

/**
 * Fades and lifts its content in as it scrolls into view (React Bits'
 * AnimatedContent), gently: 24 px, 0.6 s. Visitors who prefer less motion get
 * the content as it is, and without JavaScript it shows normally (see the
 * <noscript> style in the root layout).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <AnimatedContent
      distance={24}
      duration={0.6}
      ease="power2.out"
      delay={delay}
      threshold={0.12}
      className={className}
      data-reveal=""
    >
      {children}
    </AnimatedContent>
  );
}
