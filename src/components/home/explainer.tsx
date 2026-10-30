import Link from "next/link";
import { explainer } from "@/content/home";

/** A short, plain explainer of the kinds of hair, for customers and search engines. */
export function Explainer() {
  return (
    <section aria-labelledby="explainer-heading" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="explainer-heading" className="text-3xl font-medium sm:text-4xl">
          {explainer.title}
        </h2>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {explainer.parts.map((part) => (
            <div key={part.title}>
              <h3 className="text-2xl font-medium">{part.title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{part.text}</p>
            </div>
          ))}
        </div>
        <Link href="/shop" className="link-line mt-10 text-jh-navy">
          Shop all hair
        </Link>
      </div>
    </section>
  );
}
