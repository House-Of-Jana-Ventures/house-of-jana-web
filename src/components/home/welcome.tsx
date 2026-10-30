import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { ceo, stats, story } from "@/content/home";
import { Stat } from "./stat";

/**
 * The family story and the CEO's words, side by side with a photo of the
 * team: the warm, personal "welcome" (phase J3).
 */
export function Welcome() {
  return (
    <section aria-labelledby="story-heading" className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <Reveal zoom>
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-sm">
            <Image
              src="/images/about/team-gathering.webp"
              alt="A gathering of the Jana Human Hair team"
              fill
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div className="text-center lg:text-left">
          <Reveal>
            <p className="eyebrow">Our heritage</p>
            <h2 id="story-heading" className="mt-3 text-4xl font-medium sm:text-5xl">
              {story.title}
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">{story.paragraphs[0]}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <figure className="mt-8 border-l-2 border-jh-bright pl-5 text-left">
              <blockquote className="font-heading text-2xl leading-snug text-jh-navy italic sm:text-[1.7rem]">
                {ceo.quote}
              </blockquote>
              <figcaption className="mt-3 text-sm">
                <span className="font-semibold">{ceo.name}</span>
                <span className="text-muted-foreground">, CEO</span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-10 flex justify-center gap-14 lg:justify-start">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <Stat {...stat} />
                  </dd>
                </div>
              ))}
            </dl>
            <Link href="/about" className="btn-line mt-10 text-jh-navy">
              Our story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
