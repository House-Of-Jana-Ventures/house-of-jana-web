"use client";

import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { sentThisVisit, useContact } from "./contact-context";
import { ContactForm } from "./contact-form";

/**
 * The round contact button, bottom right of every page, and the small form it
 * opens: a panel above the button on computers, a sheet from the bottom on
 * phones. Any "Contact" link on the site opens the same form, and `?contact`
 * in the address opens it on arrival (old /contact links redirect there).
 * It also opens by itself 10 seconds after a visitor arrives, and again 10
 * seconds after each time it's closed, until they send a message.
 */
const AUTO_OPEN_MS = 10_000;

export function ContactWidget() {
  const { open, topic, openContact, setOpen } = useContact();
  // A fresh form each time it opens (and after "Thank you").
  const [round, setRound] = useState(0);
  const params = useSearchParams();

  useEffect(() => {
    if (params.has("contact")) openContact();
  }, [params, openContact]);

  // Whenever the form is closed (and on arrival), open it again after 10 seconds,
  // unless the visitor has already sent a message during this visit.
  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => {
      if (!sentThisVisit()) openContact();
    }, AUTO_OPEN_MS);
    return () => window.clearTimeout(timer);
  }, [open, openContact]);

  return (
    <>
      <button
        type="button"
        onClick={() => openContact()}
        aria-label="Contact us"
        aria-haspopup="dialog"
        className={cn(
          "group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-jh-bright text-jh-navy shadow-lg shadow-jh-navy/20 ring-4 ring-white/80 transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-jh-navy active:scale-95 sm:right-6 sm:bottom-6 print:hidden",
          open && "pointer-events-none scale-90 opacity-0",
        )}
      >
        <MessageCircle aria-hidden className="size-6" strokeWidth={2} />
        <span
          aria-hidden
          className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-jh-navy px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 sm:block"
        >
          Contact us
        </span>
        {/* A soft ping, once, so people notice it. */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-jh-bright/60 motion-safe:animate-[ping_1.6s_ease-out_1_1.2s]"
        />
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setRound((r) => r + 1);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className={cn(
            // Phones: a sheet from the bottom.
            "top-auto bottom-0 left-0 max-h-[92dvh] w-full max-w-full translate-x-0 translate-y-0 gap-4 overflow-y-auto rounded-t-3xl rounded-b-none p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] data-open:slide-in-from-bottom-8 data-open:zoom-in-100",
            // Computers: a panel above the button.
            "sm:top-auto sm:right-6 sm:bottom-24 sm:left-auto sm:max-w-md sm:rounded-3xl sm:p-6 sm:data-open:slide-in-from-bottom-4",
          )}
        >
          <DialogHeader className="pr-10">
            <DialogTitle className="text-2xl font-semibold">Contact us</DialogTitle>
            <DialogDescription>
              Tell us what you need and we&apos;ll get back to you shortly. Or email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-jh-bright"
          >
            <X aria-hidden className="size-5" />
          </button>
          <ContactForm key={round} topic={topic} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
