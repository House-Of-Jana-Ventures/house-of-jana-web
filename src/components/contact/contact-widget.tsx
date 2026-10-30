"use client";

import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { site } from "@/content/site";
import { POPUP_DELAY_MS, shouldPopUp } from "@/lib/contact-popup";
import { cn } from "@/lib/utils";
import { markSeen, seenThisVisit, sentThisVisit, useContact } from "./contact-context";
import { ContactForm } from "./contact-form";

/**
 * The round contact button, bottom right of every page, and the small form it
 * opens: a panel above the button on computers, a short sheet from the bottom
 * on phones. Any "Contact" link on the site opens the same form, and
 * `?contact` in the address opens it on arrival (old /contact links redirect
 * there).
 *
 * It also opens by itself once per visit, 30 seconds after arriving, unless
 * the visitor has already opened it or sent a message. It never blocks the
 * page: no dimming, no scroll lock, the page's links and buttons keep
 * working, and clicking the page doesn't close it (only × or Escape do).
 * When the timer opens it, focus stays where the visitor was.
 */
export function ContactWidget() {
  const { open, topic, openedBy, openContact, setOpen } = useContact();
  // A fresh form each time it opens (and after "Thank you").
  const [round, setRound] = useState(0);
  // Until the form has been seen once, the round button breathes gently.
  const [seen, setSeen] = useState(false);
  const params = useSearchParams();

  // The form's latest open state, for the one-off timer below.
  const openNow = useRef(open);

  useEffect(() => {
    if (params.has("contact")) openContact();
  }, [params, openContact]);

  // Once it has been open, by anyone, it never pops up by itself again this visit.
  useEffect(() => {
    openNow.current = open;
    if (open) markSeen();
  }, [open]);

  // Once, 30 seconds after arriving (this component lives for the whole visit).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (shouldPopUp({ open: openNow.current, sent: sentThisVisit(), seen: seenThisVisit() })) {
        openContact(undefined, "timer");
      }
    }, POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [openContact]);

  const byTimer = openedBy === "timer";

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
          className="pointer-events-none absolute right-full mr-3 hidden rounded-sm bg-jh-navy px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 sm:block"
        >
          Contact us
        </span>
        {/* A soft ring that breathes every few seconds, until the form has been seen. */}
        {!seen ? (
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-jh-bright/50 motion-safe:animate-[jh-breathe_3.2s_ease-out_1.2s_infinite]"
          />
        ) : null}
      </button>

      <Dialog
        open={open}
        modal={false}
        disablePointerDismissal
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setRound((r) => r + 1);
        }}
        onOpenChangeComplete={(isOpen) => {
          if (isOpen) setSeen(true);
        }}
      >
        <DialogContent
          overlay={false}
          showCloseButton={false}
          // Opened by the timer: don't pull focus away from what the visitor is doing.
          initialFocus={!byTimer}
          finalFocus={!byTimer}
          className={cn(
            // Phones: a short sheet from the bottom, so the page above stays in view and scrolls.
            "top-auto bottom-0 left-0 max-h-[62dvh] w-full max-w-full translate-x-0 translate-y-0 gap-4 overflow-y-auto overscroll-contain rounded-t-3xl rounded-b-none p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-12px] shadow-jh-navy/30 data-open:slide-in-from-bottom-8 data-open:zoom-in-100",
            // Computers: a panel above the button.
            "sm:top-auto sm:right-6 sm:bottom-24 sm:left-auto sm:max-h-[calc(100dvh-8rem)] sm:max-w-md sm:rounded-3xl sm:p-6 sm:shadow-2xl sm:data-open:slide-in-from-bottom-4",
            "data-open:duration-300 data-closed:duration-200",
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
