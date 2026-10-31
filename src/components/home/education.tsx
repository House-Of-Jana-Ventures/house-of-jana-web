import { ArrowRight, AlignJustify, Check, Ruler } from "lucide-react";
import Link from "next/link";
import { education } from "@/content/home";
import { cn } from "@/lib/utils";

const ICONS = [Ruler, AlignJustify];

/**
 * "Understanding human hair" (owner's design, phase J4): two side-by-side
 * comparisons, Remy vs Non-Remy and single vs double drawn, with a small
 * thickness bar for the drawn kinds.
 */
export function Education() {
  return (
    <section id="hair-education" aria-labelledby="education-heading" className="w-full scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold tracking-[0.15em] text-jh-deep uppercase">Hair education</p>
          <h2 id="education-heading" className="mt-2 text-3xl font-semibold text-jh-navy sm:text-4xl">
            Understanding human hair
          </h2>
          <p className="mt-3 text-muted-foreground">
            Choose with confidence. Hair behaves differently depending on its cuticles, how it&apos;s sorted and how
            it&apos;s drawn.
          </p>
        </div>

        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          {education.map((card, c) => {
            const Icon = ICONS[c];
            return (
              <div key={card.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md sm:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.12em] text-jh-deep uppercase">{card.eyebrow}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-jh-navy">{card.title}</h3>
                  </div>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-jh-light text-jh-deep">
                    <Icon aria-hidden className="size-6" />
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {card.items.map((item, i) => (
                    <div key={item.name} className="rounded-xl bg-jh-light/70 p-4">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="font-bold text-jh-navy">{item.name}</span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold",
                            i === 0 ? "bg-jh-bright/20 text-jh-deep" : "bg-white text-muted-foreground",
                          )}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                      {"points" in item ? (
                        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-jh-deep">
                          {item.points.map((point) => (
                            <li key={point} className="flex items-center gap-1">
                              <Check aria-hidden className="size-3.5" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {"bar" in item ? (
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <span className="w-16 text-muted-foreground">Thickness:</span>
                          <span aria-hidden className="flex h-3 flex-1 overflow-hidden rounded-full bg-white">
                            {item.bar === "full" ? (
                              <span className="w-full rounded-full bg-jh-deep" />
                            ) : (
                              <>
                                <span className="w-2/3 rounded-l-full bg-jh-deep" />
                                <span className="w-1/3 rounded-r-full bg-jh-deep/40" />
                              </>
                            )}
                          </span>
                          <span className="font-semibold text-jh-deep">{item.bar === "full" ? "Even, full" : "Tapered ends"}</span>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 font-bold text-jh-navy transition-colors hover:text-jh-deep">
            Shop all hair <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
