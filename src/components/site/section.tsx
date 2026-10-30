import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DrawLine, Reveal } from "./reveal";

/**
 * A section's small label, heading and intro, with a thin bright-blue rule.
 * They come in one after another: the label, the heading, then the line draws
 * itself.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
      {eyebrow ? (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      ) : null}
      <Reveal delay={0.08}>
        <h2 id={id} className="mt-3 text-4xl font-medium sm:text-5xl md:leading-tight">
          {title}
        </h2>
      </Reveal>
      <DrawLine center={align === "center"} />
      {intro ? (
        <Reveal delay={0.16}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/**
 * The top of an inner page: a photo under an even navy shade, with a small
 * label, the page title and a line of text in white (phase J3).
 */
export function PageBanner({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-jh-navy text-white">
      {/* The photo slowly moves closer (a soft "Ken Burns"), unless less motion is preferred. */}
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover motion-safe:animate-[jh-zoom_24s_ease-out_forwards]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-jh-navy/65" />
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.25em] text-white/80 uppercase">{eyebrow}</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-medium sm:text-6xl">{title}</h1>
          {intro ? (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{intro}</p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

/** A page section with even spacing. */
export function Section({
  children,
  className,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
