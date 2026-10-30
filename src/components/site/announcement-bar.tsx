"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { announcements } from "@/content/site";
import { cn } from "@/lib/utils";

const EVERY_MS = 4500;

/**
 * The thin navy bar above the header. On a computer the three messages sit
 * side by side; on a phone they take turns, fading every few seconds (and
 * stay on the first for visitors who prefer less motion). Screen readers
 * hear all three once, as a list.
 */
export function AnnouncementBar() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % announcements.length), EVERY_MS);
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <div className="bg-jh-navy text-white print:hidden">
      <ul className="sr-only">
        {announcements.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <div aria-hidden className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Phones: one at a time. */}
        <div className="relative h-9 md:hidden">
          {announcements.map((text, i) => (
            <p
              key={text}
              className={cn(
                "absolute inset-0 flex items-center justify-center text-center text-[0.7rem] tracking-[0.12em] uppercase transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0",
              )}
            >
              {text}
            </p>
          ))}
        </div>
        {/* Computers: all three. */}
        <p className="hidden h-9 items-center justify-between text-[0.7rem] tracking-[0.12em] uppercase md:flex">
          {announcements.map((text) => (
            <span key={text}>{text}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
