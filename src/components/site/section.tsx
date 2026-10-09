import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** A section's small label, heading and intro, with a thin bright-blue rule. */
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
    <Reveal className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.25em] text-jh-deep uppercase">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="mt-3 text-3xl font-semibold sm:text-4xl md:text-[2.75rem] md:leading-tight">
        {title}
      </h2>
      <span
        aria-hidden
        className={cn("mt-5 block h-1 w-14 rounded-full bg-jh-bright", align === "center" && "mx-auto")}
      />
      {intro ? <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p> : null}
    </Reveal>
  );
}

/** The top of an inner page: a soft photo banner, a label and the page title. */
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
    <section className="relative isolate overflow-hidden">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      {/* Only a soft fade at the very bottom, where the banner meets the page. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-b from-transparent to-jh-light" />
      <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-24">
        {/* The photo stays clear; the words sit on a soft frosted panel. */}
        <Reveal className="mx-auto max-w-3xl rounded-[2rem] bg-white/80 px-6 py-8 shadow-2xl shadow-jh-navy/15 ring-1 ring-white/70 backdrop-blur-md sm:px-10 sm:py-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-jh-deep uppercase">{eyebrow}</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl md:text-6xl">{title}</h1>
          {intro ? (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {intro}
            </p>
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
