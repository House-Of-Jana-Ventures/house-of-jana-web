import { CheckCircle2, Home, Quote } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { ceo, standard, stats, story } from "@/content/home";
import { site } from "@/content/site";
import { Stat } from "./stat";

/**
 * The family's story on a navy band (owner's design, phase J4): a photo of
 * the team with the founders, the story, the CEO's words, the Jana standard
 * and the two numbers.
 */
export function Heritage() {
  return (
    <section aria-labelledby="story-heading" className="relative w-full overflow-hidden bg-jh-navy py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        <Reveal zoom className="lg:col-span-5">
          <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/about/team-gathering.webp"
              alt="A gathering of the Jana Human Hair team"
              width={644}
              height={875}
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:h-[520px]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-jh-navy via-transparent to-transparent opacity-80" />
            <div className="absolute inset-x-5 bottom-5 rounded-xl bg-jh-navy/90 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-jh-bright text-jh-navy">
                  <Home aria-hidden className="size-5" />
                </span>
                <p>
                  <span className="block text-xs font-bold tracking-wider text-jh-bright uppercase">{site.legalName}</span>
                  <span className="text-sm text-white/90">Founded by Shri Bishnupada Jana &amp; Smt Manimala Jana</span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 lg:col-span-7">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-jh-bright uppercase">Our heritage</p>
            <h2 id="story-heading" className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {story.title}
            </h2>
          </div>
          <p className="leading-relaxed text-white/75">{story.paragraphs[0]}</p>
          <p className="leading-relaxed text-white/75">{story.paragraphs[1]}</p>

          <figure className="relative rounded-xl bg-white/[0.06] p-6">
            <Quote aria-hidden className="absolute top-4 right-4 size-10 text-jh-bright/30" />
            <blockquote className="relative font-heading text-xl leading-snug text-white italic sm:text-2xl">
              “{ceo.quote}”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-jh-bright text-xs font-bold text-jh-navy">
                SJ
              </span>
              <span>
                <span className="block text-sm font-bold text-white">{ceo.name}</span>
                <span className="text-xs text-jh-bright">CEO, Jana Human Hair</span>
              </span>
            </figcaption>
          </figure>

          <div>
            <h3 className="font-sans text-base font-semibold text-jh-bright">The Jana standard</h3>
            <ul className="mt-3 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {standard.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-jh-bright" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <dl className="flex items-center gap-8 pt-2">
            {stats.map((stat, i) => (
              <div key={stat.label} className={i > 0 ? "border-l border-white/20 pl-8" : undefined}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <Stat {...stat} tone="light" />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
