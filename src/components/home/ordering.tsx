import { steps } from "@/content/home";
import { getProducts } from "@/lib/shop/api";
import { BulkCalculator } from "./bulk-calculator";

/**
 * "How ordering works" (owner's design, phase J4): four numbered steps, then
 * the bulk price estimator with the shop's products. The estimator is left
 * out while the shop has no products on sale.
 */
export async function Ordering() {
  const page = await getProducts({ available: true });
  const products = page?.items ?? [];
  return (
    <section aria-labelledby="ordering-heading" className="w-full bg-jh-light py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.15em] text-jh-deep uppercase">Simple, direct ordering</p>
          <h2 id="ordering-heading" className="mt-2 text-3xl font-semibold text-jh-navy sm:text-4xl">
            {steps.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{steps.intro}</p>
        </div>
        <ol className="mb-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.items.map((step, i) => (
            <li key={step.title} className="group rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <span
                aria-hidden
                className="mb-4 flex size-12 items-center justify-center rounded-lg bg-jh-light font-heading text-xl font-bold text-jh-navy transition-colors group-hover:bg-jh-navy group-hover:text-white"
              >
                {i + 1}
              </span>
              <h3 className="font-sans text-base font-bold text-jh-navy">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
        {products.length > 0 ? <BulkCalculator products={products} /> : null}
      </div>
    </section>
  );
}
