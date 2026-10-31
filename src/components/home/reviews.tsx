import { BadgeCheck, Factory, HeartHandshake, Star } from "lucide-react";
import { testimonials, trustBadges } from "@/content/home";

/** Which customers' words show, with a true short note about each (from their own words). */
const SHOWN = [
  { name: "Mei Ling", note: "5+ year customer" },
  { name: "Emily Roberts", note: "United States" },
  { name: "Sophia Klein", note: "Salon owner · Germany" },
];
const BADGE_ICONS = [BadgeCheck, HeartHandshake, Factory];

/** "What our customers say" (owner's design, phase J4): three quote cards and a line of promises. */
export function Reviews() {
  const cards = SHOWN.flatMap(({ name, note }) => {
    const t = testimonials.find((x) => x.name === name);
    return t ? [{ ...t, note }] : [];
  });
  return (
    <section aria-labelledby="reviews-heading" className="w-full bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.15em] text-jh-deep uppercase">Trusted worldwide</p>
          <h2 id="reviews-heading" className="mt-2 text-3xl font-semibold text-jh-navy sm:text-4xl">
            What our customers say
          </h2>
          <p className="mt-3 text-muted-foreground">
            From salon owners and wig makers who have built their businesses on Jana Human Hair.
          </p>
        </div>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.name} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md">
              <figure className="flex h-full flex-col justify-between gap-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <span role="img" aria-label="5 out of 5 stars" className="flex text-jh-bright">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} aria-hidden className="size-4 fill-current" />
                      ))}
                    </span>
                    <span className="rounded bg-jh-light px-2 py-0.5 text-[0.7rem] font-semibold text-muted-foreground">{card.note}</span>
                  </div>
                  <blockquote className="leading-relaxed text-jh-navy italic">“{card.quote}”</blockquote>
                </div>
                <figcaption className="flex items-center gap-3 pt-2">
                  <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-jh-deep text-sm font-bold text-white">
                    {card.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block font-bold text-jh-navy">{card.name}</span>
                    {card.place ? <span className="text-xs text-muted-foreground">{card.place}</span> : null}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          {trustBadges.map((badge, i) => {
            const Icon = BADGE_ICONS[i % BADGE_ICONS.length];
            return (
              <li key={badge} className="flex items-center gap-1.5">
                <Icon aria-hidden className="size-4 text-jh-deep" />
                {badge}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
