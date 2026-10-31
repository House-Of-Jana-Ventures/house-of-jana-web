"use client";

import { BadgeCheck, Globe, Phone, TrendingDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { announcements, site, telHref } from "@/content/site";
import { cn } from "@/lib/utils";

const EVERY_MS = 4500;
const ICONS = [BadgeCheck, TrendingDown, Globe];

/**
 * The thin navy bar above the header (owner's design, phase J4): short
 * promises with icons on the left, the phone number on the right. On a phone
 * the promises take turns, fading every few seconds (and stay on the first
 * for visitors who prefer less motion). Screen readers hear all of them once.
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
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 text-[0.72rem] font-semibold sm:px-6">
        {/* Phones: one at a time. */}
        <div aria-hidden className="relative h-full flex-1 md:hidden">
          {announcements.map((text, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <p
                key={text}
                className={cn(
                  "absolute inset-0 flex items-center justify-center gap-1.5 text-center transition-opacity duration-700",
                  i === index ? "opacity-100" : "opacity-0",
                )}
              >
                <Icon aria-hidden className="size-3.5 shrink-0 text-jh-bright" />
                {text}
              </p>
            );
          })}
        </div>
        {/* Computers: all of them, with a thin divider. */}
        <p aria-hidden className="hidden items-center gap-4 md:flex">
          {announcements.map((text, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <span key={text} className={cn("items-center gap-1.5", i === 2 ? "hidden xl:flex" : "flex")}>
                {i > 0 ? <span className="mr-2.5 text-white/30">|</span> : null}
                <Icon aria-hidden className="size-3.5 text-jh-bright" />
                {text}
              </span>
            );
          })}
        </p>
        <a
          href={telHref(site.phones[0])}
          className="hidden shrink-0 items-center gap-1.5 text-jh-bright hover:underline md:flex"
        >
          <Phone aria-hidden className="size-3.5" />
          Call us: {site.phones[0]}
        </a>
      </div>
    </div>
  );
}
