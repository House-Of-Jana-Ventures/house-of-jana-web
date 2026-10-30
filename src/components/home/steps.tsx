import { Reveal } from "@/components/site/reveal";
import { steps } from "@/content/home";

/** How ordering works, in four numbered steps. */
export function Steps() {
  return (
    <section aria-labelledby="steps-heading" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Ordering</p>
          <h2 id="steps-heading" className="mt-3 text-4xl font-medium sm:text-5xl">
            {steps.title}
          </h2>
          <p className="mt-4 text-muted-foreground">{steps.intro}</p>
        </div>
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.items.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={0.06 * i} className="text-center">
                <span aria-hidden className="font-heading text-5xl font-normal text-jh-deep">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-2xl font-medium">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
