import type { ReactNode } from "react";

/** The sign-in pages' frame: a white card on the light-blue page. */
export function AuthCard({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-md rounded-md bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {intro ? <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</div> : null}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
