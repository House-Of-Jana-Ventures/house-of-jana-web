"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { testimonials } from "@/content/home";
import { cn } from "@/lib/utils";

const AUTO_MS = 7000;

/**
 * Customer words, one at a time: a soft cross-fade every 7 s, paused while
 * the pointer or keyboard focus is on it, and never moving on its own for
 * reduced motion. Arrows and dots move between them.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const count = testimonials.length;
  const go = useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count]);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setTimeout(() => go(1), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduced, go]);

  const current = testimonials[index];
  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="What our customers say"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="mx-auto mt-12 max-w-3xl"
    >
      <div className="relative overflow-hidden rounded-md bg-white px-6 py-10 shadow-sm ring-1 ring-border sm:px-12 sm:py-12">
        <Quote aria-hidden className="absolute top-6 left-6 size-10 text-jh-bright/25" />
        <div aria-live={paused ? "polite" : "off"} className="min-h-64 sm:min-h-52">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={index}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
              aria-label={`${index + 1} of ${count}`}
            >
              <div role="img" className="flex gap-0.5 text-jh-bright" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} aria-hidden className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 text-lg leading-relaxed text-jh-navy sm:text-xl">
                “{current.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {current.image ? (
                  <Image
                    src={current.image}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover object-top ring-2 ring-jh-light"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex size-12 items-center justify-center rounded-full bg-jh-light font-heading text-lg text-jh-deep"
                  >
                    {current.name[0]}
                  </span>
                )}
                <span className="text-left">
                  <span className="block font-semibold">{current.name}</span>
                  {current.place ? (
                    <span className="block text-sm text-muted-foreground">{current.place}</span>
                  ) : null}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous review"
          className="flex size-11 items-center justify-center rounded-full bg-white text-jh-navy ring-1 ring-border transition hover:bg-jh-bright focus-visible:outline-2 focus-visible:outline-jh-bright"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Review ${i + 1}: ${t.name}`}
              aria-current={i === index || undefined}
              className="flex size-6 items-center justify-center"
            >
              <span
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-jh-bright" : "w-2 bg-jh-navy/25",
                )}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next review"
          className="flex size-11 items-center justify-center rounded-full bg-white text-jh-navy ring-1 ring-border transition hover:bg-jh-bright focus-visible:outline-2 focus-visible:outline-jh-bright"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
