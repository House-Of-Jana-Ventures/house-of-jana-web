"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ContactTrigger } from "@/components/contact/contact-button";
import { slides } from "@/content/home";
import { cn } from "@/lib/utils";

const EVERY_MS = 3000;

/**
 * The home page's banner: four photo slides that fade from one to the next
 * every 3 seconds (owner's photos and words, phase J3). Each photo is shown
 * whole: they're on white, so on a large screen the photo sits to one side
 * and the words in navy on its white side; on phones and tablets the photo
 * comes first and the words below it. It stops while the pointer (or the
 * keyboard) is on it and carries on when it leaves; the dots move between
 * slides. It never moves by itself for visitors who prefer less motion.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const count = slides.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    if (reduced || held) return;
    const timer = window.setTimeout(next, EVERY_MS);
    return () => window.clearTimeout(timer);
  }, [index, reduced, held, next]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Jana Human Hair"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      className="relative bg-white"
    >
      <h1 className="sr-only">Jana Human Hair: natural human hair extensions from Midnapore</h1>

      {/* All slides share one grid cell, so the banner is as tall as the tallest. */}
      <div className="grid">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.title}`}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                "relative col-start-1 row-start-1 transition-opacity duration-700 ease-out motion-reduce:transition-none",
                active ? "z-10 opacity-100" : "opacity-0",
              )}
            >
              {/* The whole photo: its own shape on phones, a fixed height beside the words on large screens. */}
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[clamp(26rem,38vw,36rem)]">
                {/* Large screens: the photo at its own shape on one side, its inner edge fading into the white. */}
                <div
                  className={cn(
                    "absolute inset-0 lg:inset-x-auto lg:aspect-[16/9]",
                    slide.side === "right"
                      ? "lg:left-0 lg:[mask-image:linear-gradient(to_left,transparent,black_16%)]"
                      : "lg:right-0 lg:[mask-image:linear-gradient(to_right,transparent,black_16%)]",
                  )}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="lg:absolute lg:inset-0">
                <div
                  className={cn(
                    "mx-auto flex h-full max-w-6xl items-center px-4 pt-6 pb-4 sm:px-6 lg:py-0",
                    slide.side === "right" && "lg:justify-end",
                  )}
                >
                  <div className="max-w-md lg:max-w-sm xl:max-w-md">
                    <h2 className="text-4xl leading-[1.05] font-medium sm:text-5xl">{slide.title}</h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{slide.text}</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href="/shop" className="btn-line bg-white/70 text-jh-navy">
                        Shop hair
                      </Link>
                      <ContactTrigger topic="bulk orders" className="btn-line bg-white/70 text-jh-navy">
                        Bulk enquiry
                      </ContactTrigger>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* The dots: below the words on phones and tablets, along the bottom on large screens. */}
      <div className="z-20 flex items-center justify-center gap-1 px-4 pb-6 lg:absolute lg:inset-x-0 lg:bottom-5 lg:pb-0">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}: ${slide.title}`}
            aria-current={i === index ? "true" : undefined}
            className="flex size-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-jh-bright"
          >
            <span
              aria-hidden
              className={cn(
                "block h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-jh-navy" : "w-1.5 bg-jh-navy/30",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
