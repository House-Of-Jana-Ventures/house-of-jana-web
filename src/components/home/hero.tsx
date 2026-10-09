import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContactButton } from "@/components/contact/contact-button";
import BlurText from "@/components/reactbits/BlurText";
import { Reveal } from "@/components/site/reveal";
import { buttonVariants } from "@/components/ui/button";
import { hero, stats } from "@/content/home";
import { cn } from "@/lib/utils";
import { Stat } from "./stat";

/** The home page's opening: the promise, two ways in, and two numbers. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/banners/home.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* The photo stays clear; the words sit on a soft frosted panel so they read easily. */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-3xl rounded-[2rem] bg-white/80 p-6 shadow-2xl shadow-jh-navy/15 ring-1 ring-white/70 backdrop-blur-md sm:p-10">
        <p className="text-xs font-semibold tracking-[0.3em] text-jh-deep uppercase">
          {hero.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl text-[2.6rem] leading-[1.08] font-semibold sm:text-6xl lg:text-7xl">
          <BlurText text={hero.title} delay={90} animateBy="words" direction="bottom" />
        </h1>
        <Reveal delay={0.4}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {hero.text}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className={cn(
                buttonVariants(),
                "group h-12 rounded-full px-6 text-base font-semibold",
              )}
            >
              Explore our products
              <ArrowRight
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <ContactButton variant="outline" className="h-12 bg-white/80 px-6 text-base">
              Contact us
            </ContactButton>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-6 sm:mt-14 sm:flex sm:gap-x-14">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <Stat {...stat} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
