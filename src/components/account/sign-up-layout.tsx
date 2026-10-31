import { ArrowRight, BadgeIndianRupee, Clock, MessageCircle, Palette, ReceiptText, Sparkles, Tag, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ceo } from "@/content/home";
import { site } from "@/content/site";

const EYEBROW = "text-xs font-bold tracking-[0.15em] uppercase";

/** True reasons to order direct (in place of the design's invented mill privileges). */
const REASONS = [
  {
    icon: BadgeIndianRupee,
    title: "Single and bulk prices",
    text: "Every product shows both. The bulk price applies on its own from the product's bulk minimum.",
  },
  {
    icon: Sparkles,
    title: "Temple-sourced hair",
    text: "Single-donor temple hair, sorted and drawn by hand in Purba Midnapore.",
  },
  {
    icon: Palette,
    title: "Custom bleaching and colouring",
    text: "Tell us the shade you need, such as 613 blonde, and we colour to order.",
  },
  {
    icon: Tag,
    title: "Private labelling",
    text: "Your own label and branded wraps, ready for your salon or store.",
  },
  {
    icon: ReceiptText,
    title: "Follow every order",
    text: "Pay online or by bank transfer for bulk orders, and see every order in your account.",
  },
];

/** The three steps, as they really happen: no approval wait, the account works straight away. */
const STEPS = [
  {
    title: "Create your account",
    text: "Fill in the form once. You're signed in straight away, with no approval to wait for.",
    note: "Takes a minute",
  },
  {
    title: "Choose your hair",
    text: "Pick textures and lengths in the shop. Bigger quantities move to the bulk price on their own.",
    note: "Single and bulk prices",
  },
  {
    title: "Pay and follow",
    text: "Pay online with UPI, cards or net banking, or by bank transfer for bulk orders, then follow the order in My account.",
    note: "All orders in one place",
  },
];

/**
 * The create-account page (owner's design, phase J4): an opening with the
 * page's title, the reasons to order direct and the CEO's words beside the
 * real form, and how an account works below. The design's invented parts
 * (approval desk, kg tiers, tax numbers, two-factor codes, live batches,
 * certifications) are left out.
 */
export function SignUpLayout({ signInHref, children }: { signInHref: string; children: ReactNode }) {
  return (
    <>
      {/* Opening */}
      <section className="w-full bg-jh-light px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-5">
          <p className={`${EYEBROW} text-jh-deep`}>
            Jana Human Hair <span className="text-muted-foreground">/ New account</span>
          </p>
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="text-3xl font-semibold tracking-tight text-jh-navy sm:text-4xl">Create an account</h1>
              <p className="mt-2 max-w-3xl text-muted-foreground sm:text-lg">
                One account for ordering natural human hair straight from Purba Midnapore, for salons, wig makers,
                extension brands and anyone buying for themselves.
              </p>
            </div>
            <div className="flex lg:col-span-4 lg:justify-end">
              <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-jh-light text-jh-deep">
                  <Clock aria-hidden className="size-6" />
                </span>
                <div>
                  <p className={`${EYEBROW} text-jh-deep`}>Questions or quotes</p>
                  <p className="font-bold text-jh-navy">We reply within 2 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reasons beside the form */}
      <section className="w-full px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-12">
          <aside className="order-2 flex flex-col gap-5 lg:order-1 lg:col-span-4">
            <div className="relative overflow-hidden rounded-xl bg-jh-navy p-6 text-white shadow-xl">
              <div aria-hidden className="pointer-events-none absolute -right-10 -bottom-10 size-44 rounded-full bg-jh-bright/15 blur-2xl" />
              <div className="relative">
                <p className={`${EYEBROW} inline-flex rounded-full bg-white/10 px-2.5 py-1 text-white`}>Order direct</p>
                <h2 className="mt-3 text-xl font-semibold">Why buy from Jana Human Hair</h2>
                <ul className="mt-5 flex flex-col gap-4">
                  {REASONS.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex items-start gap-3">
                      <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-jh-bright" />
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-white/75">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <figure className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
              <div className="relative h-48">
                <Image
                  src="/images/about/team-gathering.webp"
                  alt="A gathering of the Jana Human Hair team"
                  fill
                  sizes="(min-width: 1024px) 30vw, 92vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4">
                <blockquote className="font-heading text-sm leading-relaxed text-jh-navy italic">“{ceo.quote}”</blockquote>
                <p className="mt-2 text-sm">
                  <span className="font-bold text-jh-navy">{ceo.name}</span>
                  <span className="text-muted-foreground"> · CEO, Jana Human Hair</span>
                </p>
              </figcaption>
            </figure>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
              <div>
                <p className="font-bold text-jh-navy">Already have an account?</p>
                <p className="text-sm text-muted-foreground">See your orders and order again.</p>
              </div>
              <Link
                href={signInHref}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-jh-deep shadow-sm hover:bg-muted"
              >
                Go to sign in <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </aside>

          <div className="order-1 flex flex-col gap-6 rounded-xl bg-white p-6 shadow-md ring-1 ring-border sm:p-10 lg:order-2 lg:col-span-8">
            <p className="flex items-center gap-2 text-sm font-semibold text-jh-deep">
              <UserPlus aria-hidden className="size-5" /> Your new account
            </p>
            {children}
            <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-jh-light p-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-jh-deep text-white">
                  <MessageCircle aria-hidden className="size-5" />
                </span>
                <div>
                  <p className={`${EYEBROW} text-jh-deep`}>Need help first?</p>
                  <p className="text-sm">Chat with us on WhatsApp, or call {site.phones[0]}.</p>
                </div>
              </div>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-bold text-jh-navy shadow-sm hover:bg-muted"
              >
                <MessageCircle aria-hidden className="size-4 text-jh-deep" />
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="w-full bg-jh-light px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className={`${EYEBROW} text-jh-deep`}>Simple from the start</p>
            <h2 id="how-heading" className="mt-2 text-2xl font-semibold text-jh-navy sm:text-3xl">
              How your account works
            </h2>
          </div>
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm">
                <span className="font-heading flex size-12 items-center justify-center rounded-lg bg-jh-light text-xl font-bold text-jh-navy">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-sans text-lg font-bold text-jh-navy">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.text}</p>
                <p className="mt-auto pt-1 text-sm font-semibold text-jh-deep">{step.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
