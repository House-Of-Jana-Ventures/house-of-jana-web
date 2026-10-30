"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import { cn } from "@/lib/utils";

/**
 * Fades and lifts its content in as it scrolls into view (React Bits'
 * AnimatedContent), gently: 24 px, 0.6 s. With `zoom` (for photos) it also
 * settles from slightly smaller. Visitors who prefer less motion get the
 * content as it is, and without JavaScript it shows normally (see the
 * <noscript> style in the root layout).
 */
export function Reveal({
  children,
  delay = 0,
  zoom = false,
  className,
}: {
  children: ReactNode;
  delay?: number;
  zoom?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <AnimatedContent
      distance={zoom ? 16 : 24}
      duration={zoom ? 0.8 : 0.6}
      ease="power2.out"
      scale={zoom ? 0.94 : 1}
      delay={delay}
      threshold={0.12}
      className={className}
      data-reveal=""
    >
      {children}
    </AnimatedContent>
  );
}

/** The short bright-blue line under a heading, drawing itself from the left when it comes into view. */
export function DrawLine({ center = false }: { center?: boolean }) {
  const reduced = useReducedMotion();
  const className = cn("mt-5 block h-px w-12 origin-left bg-jh-bright", center && "mx-auto origin-center");
  if (reduced) return <span aria-hidden className={className} />;
  return (
    <motion.span
      aria-hidden
      className={className}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
