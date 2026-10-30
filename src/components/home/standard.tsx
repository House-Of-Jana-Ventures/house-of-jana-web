import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { standard } from "@/content/home";

/** "The Jana standard": a navy band with a short checklist and a photo of the artisans at work. */
export function Standard() {
  return (
    <section aria-labelledby="standard-heading" className="bg-jh-navy py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-jh-bright uppercase">Our promise</p>
          <h2 id="standard-heading" className="mt-3 text-4xl font-medium sm:text-5xl">
            {standard.title}
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-white/80">{standard.intro}</p>
          <ul className="mt-8 flex flex-col gap-4">
            {standard.points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-white/90 sm:text-base">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-jh-bright" strokeWidth={1.75} />
                {point}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn-line btn-line-light mt-10 text-white">
            Learn more
          </Link>
        </Reveal>
        <Reveal zoom delay={0.1}>
          <div className="relative mx-auto aspect-square max-w-md">
            <Image
              src="/images/quality/handcrafted-round.webp"
              alt="Artisans sorting and drawing hair by hand in Midnapore"
              fill
              sizes="(min-width: 1024px) 28rem, 85vw"
              className="object-contain"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
