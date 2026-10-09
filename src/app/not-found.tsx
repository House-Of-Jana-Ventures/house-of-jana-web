import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.3em] text-jh-deep uppercase">Page not found</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">We couldn&apos;t find that page</h1>
      <p className="mt-4 text-muted-foreground">
        It may have moved when we updated our website. Try the home page or our products.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants(), "h-11 rounded-full px-6 font-semibold")}>
          Home
        </Link>
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full bg-white px-6 font-semibold")}
        >
          Products
        </Link>
      </div>
    </section>
  );
}
