"use client";

import { useReducedMotion } from "motion/react";
import CountUp from "@/components/reactbits/CountUp";

/**
 * A number that counts up when it scrolls into view (React Bits' CountUp).
 * Screen readers and visitors without JavaScript get the number itself;
 * reduced motion shows it without counting.
 */
export function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-col">
      <span className="font-heading text-4xl font-semibold text-jh-navy sm:text-5xl">
        <span className="sr-only">
          {value}
          {suffix}
        </span>
        <span aria-hidden>
          {reduced ? value : <CountUp to={value} duration={1.6} />}
          <noscript>{value}</noscript>
          {suffix}
        </span>
      </span>
      <span className="mt-1 text-sm leading-snug text-muted-foreground">{label}</span>
    </div>
  );
}
