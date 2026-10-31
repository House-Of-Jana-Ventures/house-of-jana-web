"use client";

import { ArrowRight, Factory, FileText, Globe, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { hero, specimens } from "@/content/home";
import { cn } from "@/lib/utils";

/**
 * The home page's opening (owner's design, phase J4): the promise, two ways
 * in and three numbers on the left; on the right a card showing the kinds of
 * hair, one tab each, with the owner's photos and what each kind is.
 */
export function Hero() {
  const [active, setActive] = useState(0);
  const id = useId();
  const specimen = specimens[active];

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12">
        {/* The words */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-jh-bright/15 px-3 py-1 text-xs font-semibold text-jh-deep">
              <Globe aria-hidden className="size-3.5" />
              {hero.pills[0]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-jh-light px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Factory aria-hidden className="size-3.5" />
              {hero.pills[1]}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-jh-navy sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              {hero.title}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{hero.text}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-lg bg-jh-navy px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-bright"
            >
              Explore the shop
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#quick-rfq"
              className="inline-flex items-center gap-2 rounded-lg bg-jh-light px-6 py-3.5 text-sm font-semibold text-jh-navy transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-bright"
            >
              <FileText aria-hidden className="size-4 text-jh-deep" />
              Quick bulk enquiry
            </a>
          </div>
          <dl className="grid max-w-lg grid-cols-3 gap-2 pt-2">
            {hero.metrics.map((metric, i) => (
              <div key={metric.label} className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-border">
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span
                    className={cn(
                      "block font-heading text-xl font-bold sm:text-2xl",
                      i === 1 ? "text-jh-deep" : "text-jh-navy",
                    )}
                  >
                    {metric.value}
                  </span>
                  <span aria-hidden className="text-[0.7rem] font-semibold text-muted-foreground sm:text-xs">
                    {metric.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The hair-type card */}
        <div className="lg:col-span-5">
          <div className="rounded-xl bg-white p-4 shadow-xl ring-1 ring-border sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[0.7rem] font-bold tracking-[0.12em] text-jh-deep uppercase">From our workshop</p>
                <h2 className="font-sans text-lg font-bold text-jh-navy">Purba Midnapore hair</h2>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded bg-jh-bright/15 px-2.5 py-1 text-[0.7rem] font-bold text-jh-deep">
                <span aria-hidden className="size-2 rounded-full bg-jh-deep motion-safe:animate-pulse" />
                Temple-sourced
              </span>
            </div>

            <div role="tablist" aria-label="Kinds of hair" className="mb-3 flex items-center gap-1 rounded-lg bg-jh-light p-1">
              {specimens.map((item, i) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${item.key}`}
                  aria-selected={i === active}
                  aria-controls={`${id}-panel`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "min-w-0 flex-1 rounded px-1 py-1.5 text-[0.7rem] font-semibold whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-jh-bright sm:px-2 sm:text-xs",
                    i === active ? "bg-white text-jh-navy shadow-sm" : "text-muted-foreground hover:text-jh-navy",
                  )}
                >
                  {item.tab}
                </button>
              ))}
            </div>

            <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${specimen.key}`}>
              <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-jh-light">
                {specimens.map((item, i) => (
                  <Image
                    key={item.key}
                    src={item.image}
                    alt={i === active ? item.alt : ""}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 420px, 92vw"
                    className={cn(
                      "object-cover object-[50%_20%] transition-all duration-500 group-hover:scale-105",
                      i === active ? "opacity-100" : "opacity-0",
                    )}
                  />
                ))}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-jh-navy/85 via-transparent to-transparent" />
                <div className="absolute inset-x-3 bottom-3 text-white">
                  <p className="font-sans text-base font-bold">{specimen.title}</p>
                  <p className="text-xs text-white/85">{specimen.subtitle}</p>
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                {specimen.specs.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-2 rounded bg-jh-light/70 p-2">
                    <dt>{label}:</dt>
                    <dd className="text-right font-semibold text-jh-navy">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 pt-1 text-xs">
              <span className="text-muted-foreground">Single and bulk prices in the shop</span>
              <Link href="/shop" className="flex items-center gap-1 font-bold text-jh-navy transition-colors hover:text-jh-deep">
                See the shop <MoveRight aria-hidden className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
