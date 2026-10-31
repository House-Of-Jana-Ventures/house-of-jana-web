import { Factory, Phone, Zap } from "lucide-react";
import { site, telHref } from "@/content/site";

/**
 * The floating bar at the bottom of the home page (owner's design, phase J4):
 * call us, or jump to the quote form. On computers only, leaving room on the
 * right for the round contact button.
 */
export function WholesaleDock() {
  return (
    <aside aria-label="Wholesale quick bar" className="sticky bottom-4 z-30 mx-auto hidden w-full max-w-5xl px-4 pr-24 md:block print:hidden">
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/95 p-3 shadow-2xl ring-1 ring-border backdrop-blur-xl md:p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-jh-bright/20 text-jh-deep">
            <Factory aria-hidden className="size-5" />
          </span>
          <p>
            <span className="block leading-tight font-bold text-jh-navy">Need wholesale prices or samples?</span>
            <span className="text-sm text-muted-foreground">Straight from our workshop, with lower bulk prices on every product.</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <a
            href={telHref(site.phones[0])}
            className="hidden items-center gap-1.5 rounded-lg bg-jh-light px-4 py-2.5 text-sm font-semibold text-jh-navy transition-colors hover:bg-muted lg:flex"
          >
            <Phone aria-hidden className="size-4 text-jh-deep" />
            {site.phones[0]}
          </a>
          <a
            href="#quick-rfq"
            className="flex items-center gap-1.5 rounded-lg bg-jh-navy px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-jh-deep"
          >
            <Zap aria-hidden className="size-4" />
            Request a quote
          </a>
        </div>
      </div>
    </aside>
  );
}
