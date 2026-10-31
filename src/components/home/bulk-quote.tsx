"use client";

import { CheckCircle2, Clock, Send, Truck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { markSent } from "@/components/contact/contact-context";
import { rfq } from "@/content/home";
import { site } from "@/content/site";
import type { ContactField } from "@/lib/contact-rules";
import { rfqMessage } from "@/lib/rfq";
import { cn } from "@/lib/utils";

const FIELD = "h-11 w-full rounded-lg bg-white px-3.5 text-sm text-jh-navy ring-1 ring-border focus:ring-2 focus:ring-jh-bright focus:outline-none";
const LABEL = "mb-1 block text-xs font-bold text-jh-navy uppercase";

/**
 * "Bulk & trade desk" (owner's design, phase J4): the quote form, sent like
 * the contact form (same checks, same inbox), with the choices written into
 * the message. The promises beside it were confirmed by the owner.
 */
export function BulkQuote() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  // Kept outside the form, so they survive the form being redrawn after an answer.
  const [textures, setTextures] = useState<string[]>(["Straight"]);
  const [lengths, setLengths] = useState<string>(rfq.lengths[1]);
  const [quantity, setQuantity] = useState<string>(rfq.quantities[1]);
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");
  const pathname = usePathname();
  const id = useId();

  useEffect(() => {
    if (state.status === "sent") markSent();
  }, [state.status]);

  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" || state.status === "error" ? state.values : null;
  const error = (field: ContactField) =>
    errors[field] ? (
      <p id={`${id}-${field}-error`} className="mt-1 text-xs text-destructive">
        {errors[field]}
      </p>
    ) : null;
  const described = (field: ContactField) => (errors[field] ? { "aria-invalid": true, "aria-describedby": `${id}-${field}-error` } : {});

  const submit = (form: FormData) => {
    form.set(
      "message",
      rfqMessage({ textures, lengths, quantity, destination, notes }),
    );
    action(form);
  };

  return (
    <section id="quick-rfq" aria-labelledby="rfq-heading" className="w-full scroll-mt-24 bg-jh-light py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-border md:p-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col gap-4 lg:col-span-5">
              <p className="text-xs font-bold tracking-[0.15em] text-jh-deep uppercase">Bulk &amp; trade desk</p>
              <h2 id="rfq-heading" className="text-3xl font-semibold text-jh-navy sm:text-4xl">
                Buying for a salon or a wig business?
              </h2>
              <p className="text-muted-foreground">
                Tell us the textures, lengths, colours and quantities you need, and we&apos;ll send you a quote by
                email or WhatsApp.
              </p>
              <div className="flex flex-col gap-2 rounded-xl bg-jh-light/70 p-4 text-sm">
                <p className="flex items-center gap-2 font-bold text-jh-navy">
                  <Truck aria-hidden className="size-5 text-jh-deep" />
                  Straight from Midnapore:
                </p>
                <ul className="flex flex-col gap-1.5 text-muted-foreground">
                  {rfq.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-jh-deep" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-jh-navy">
                <Clock aria-hidden className="size-4 text-jh-deep" />
                {rfq.response}
              </p>
            </div>

            <div className="rounded-2xl bg-jh-light/70 p-5 sm:p-6 lg:col-span-7">
              {state.status === "sent" ? (
                <div role="status" className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
                  <CheckCircle2 aria-hidden className="size-12 text-jh-deep" strokeWidth={1.5} />
                  <p className="font-heading text-2xl text-jh-navy">Thank you!</p>
                  <p className="max-w-sm text-muted-foreground">
                    Your quote request has reached our bulk desk. We&apos;ll reply within 2 hours with your quote.
                  </p>
                </div>
              ) : (
                // A fresh form for each answer from the server (React resets a form after its
                // action), starting from what was typed and its problems.
                <form
                  key={state.status === "idle" ? "new" : JSON.stringify(state)}
                  action={submit}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  <input type="hidden" name="page" value={`${pathname}#quick-rfq`} />
                  <div hidden>
                    <input type="text" name="jh_trap" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </div>

                  <fieldset>
                    <legend className={LABEL}>1. Textures</legend>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {rfq.textures.map((texture) => {
                        const on = textures.includes(texture);
                        return (
                          <button
                            key={texture}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setTextures((t) => (on ? t.filter((x) => x !== texture) : [...t, texture]))}
                            className={cn(
                              "rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-jh-bright",
                              on ? "bg-jh-navy text-white" : "bg-white text-jh-navy ring-1 ring-border hover:bg-muted",
                            )}
                          >
                            {texture}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${id}-lengths`} className={LABEL}>
                        2. Lengths
                      </label>
                      <select id={`${id}-lengths`} name="lengths" className={FIELD} value={lengths} onChange={(e) => setLengths(e.target.value)}>
                        {rfq.lengths.map((length) => (
                          <option key={length}>{length}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`${id}-quantity`} className={LABEL}>
                        3. Quantity
                      </label>
                      <select id={`${id}-quantity`} name="quantity" className={FIELD} value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                        {rfq.quantities.map((q) => (
                          <option key={q}>{q}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${id}-name`} className={LABEL}>
                        Your name
                      </label>
                      <input id={`${id}-name`} name="name" autoComplete="name" required defaultValue={values?.name} className={FIELD} {...described("name")} />
                      {error("name")}
                    </div>
                    <div>
                      <label htmlFor={`${id}-company`} className={LABEL}>
                        Company / salon
                      </label>
                      <input id={`${id}-company`} name="company" autoComplete="organization" required defaultValue={values?.company} className={FIELD} {...described("company")} />
                      {error("company")}
                    </div>
                    <div>
                      <label htmlFor={`${id}-email`} className={LABEL}>
                        Email
                      </label>
                      <input id={`${id}-email`} name="email" type="email" autoComplete="email" required defaultValue={values?.email} className={FIELD} {...described("email")} />
                      {error("email")}
                    </div>
                    <div>
                      <label htmlFor={`${id}-phone`} className={LABEL}>
                        Phone / WhatsApp
                      </label>
                      <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" required defaultValue={values?.phone} placeholder="+91 / +44 / +1 …" className={FIELD} {...described("phone")} />
                      {error("phone")}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${id}-destination`} className={LABEL}>
                      Deliver to (city, country)
                    </label>
                    <input
                      id={`${id}-destination`}
                      name="destination"
                      autoComplete="address-level2"
                      placeholder="e.g. Mumbai, India / London, UK"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      maxLength={200}
                      className={FIELD}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${id}-notes`} className={LABEL}>
                      Anything else? (colours, bleaching, labelling)
                    </label>
                    <textarea
                      id={`${id}-notes`}
                      name="notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      maxLength={2500}
                      className={cn(FIELD, "h-auto py-2.5")}
                    />
                    {error("message")}
                  </div>

                  {state.status === "error" ? (
                    <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {state.message}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={pending}
                    aria-busy={pending}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-jh-navy py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-jh-deep disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Send my quote request"}
                    <Send aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Or email{" "}
                    <a href={`mailto:${site.email}`} className="underline">
                      {site.email}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
