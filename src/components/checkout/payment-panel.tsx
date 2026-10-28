"use client";

import { Landmark, Loader2, Lock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { startPayment, verifyPayment } from "@/lib/checkout/actions";
import { deadlineText, failedMessage, type PanelState } from "@/lib/checkout/payment";
import { rupees } from "@/lib/shop/prices";
import { cn } from "@/lib/utils";

/** Razorpay Checkout's browser API (the parts used here). */
interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", callback: (response: { error?: { description?: unknown } }) => void): void;
}
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

/** Loads Razorpay's script once per page, only when someone pays. */
let scriptLoading: Promise<void> | null = null;
function loadScript(src: string): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  scriptLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoading = null;
      script.remove();
      reject(new Error("Razorpay's script didn't load"));
    };
    document.head.appendChild(script);
  });
  return scriptLoading;
}

type Note = { tone: "info" | "error"; text: string } | null;

/** A payment the bank is still confirming is looked at again every 5 seconds for a minute. */
const RECHECK_MS = 5000;
const RECHECKS = 12;

/**
 * How to pay an order: online with Razorpay (when switched on) and by bank
 * transfer (when the shop gives its bank details). The page is read again
 * from the API after each step, so it always shows the order's real state.
 */
export function PaymentPanel({
  orderNumber,
  amount,
  state,
  expiresAt,
  lastFailureMessage,
  online,
  bankDetails,
  autoStart,
  scriptUrl,
}: {
  orderNumber: string;
  amount: string;
  state: PanelState;
  expiresAt: string | null;
  lastFailureMessage: string | null;
  online: boolean;
  bankDetails: string[];
  /** Open the payment window straight away (just after placing the order). */
  autoStart: boolean;
  scriptUrl: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>(lastFailureMessage ? { tone: "error", text: lastFailureMessage } : null);
  const [rechecking, setRechecking] = useState(state === "waiting");
  const [now, setNow] = useState(() => Date.now());
  const started = useRef(false);

  // The time left, kept roughly current.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  // A payment the bank is still confirming: look again for a minute.
  useEffect(() => {
    if (!rechecking || state !== "waiting") return;
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      router.refresh();
      if (count >= RECHECKS) {
        window.clearInterval(timer);
        setRechecking(false);
      }
    }, RECHECK_MS);
    return () => window.clearInterval(timer);
  }, [rechecking, state, router]);

  const pay = useCallback(async () => {
    setBusy(true);
    setNote(null);
    const start = await startPayment(orderNumber);
    if (!start.ok) {
      setBusy(false);
      if (start.signIn) {
        router.push(start.signIn);
        return;
      }
      setNote({ tone: "error", text: start.outcome.message });
      if (start.outcome.kind === "changed") router.refresh();
      return;
    }
    try {
      await loadScript(scriptUrl);
    } catch {
      setBusy(false);
      setNote({
        tone: "error",
        text: "We couldn't open the payment window. Nothing has been charged. Please check your connection (or turn off an ad blocker) and try again.",
      });
      return;
    }
    const c = start.checkout;
    const checkout = new window.Razorpay!({
      key: c.keyId,
      order_id: c.razorpayOrderId,
      amount: c.amount,
      currency: c.currency,
      name: c.name,
      description: c.description,
      prefill: { name: c.prefill.name, email: c.prefill.email, contact: c.prefill.contact ?? "" },
      notes: c.notes,
      timeout: c.timeoutSeconds,
      theme: { color: "#00abe4" },
      modal: {
        ondismiss: () => {
          setBusy(false);
          setNote((current) =>
            current?.tone === "error" ? current : { tone: "info", text: "Payment not completed. You can try again." },
          );
        },
      },
      handler: async (response: unknown) => {
        setNote({ tone: "info", text: "Confirming your payment…" });
        const verified = await verifyPayment(orderNumber, response);
        setBusy(false);
        if (verified.ok) {
          setNote(null);
          router.refresh();
          return;
        }
        if (verified.signIn) {
          router.push(verified.signIn);
          return;
        }
        setNote({ tone: verified.outcome.kind === "pending" ? "info" : "error", text: verified.outcome.message });
        if (verified.outcome.kind === "pending") setRechecking(true);
        else router.refresh();
      },
    });
    checkout.on("payment.failed", (response) =>
      setNote({ tone: "error", text: failedMessage(response.error?.description) }),
    );
    checkout.open();
  }, [orderNumber, router, scriptUrl]);

  // Just after placing the order: open the window once, and drop ?placed=1 so a reload doesn't reopen it
  // (from the address only: the page keeps its thank-you note).
  useEffect(() => {
    if (!autoStart || started.current) return;
    // From a timer, so it runs once even when React runs effects twice (development).
    const timer = window.setTimeout(() => {
      if (started.current) return;
      started.current = true;
      window.history.replaceState(null, "", pathname);
      if (state === "payable" && online) void pay();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [autoStart, state, online, pay, pathname]);

  if (state === "paid" || state === "cancelled" || state === "quote") return null;

  const deadline = deadlineText(expiresAt, now);
  return (
    <section aria-labelledby="payment-title" className="rounded-3xl bg-white p-6 ring-2 ring-jh-bright">
      <h2 id="payment-title" className="text-2xl font-semibold">
        {state === "waiting" ? "Waiting for your bank" : `Pay ${rupees(amount)}`}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {state === "waiting"
          ? "Your payment is being confirmed. This page updates by itself; there's no need to pay again."
          : deadline}
      </p>
      {note ? (
        <p
          role={note.tone === "error" ? "alert" : "status"}
          className={cn(
            "mt-4 rounded-2xl px-4 py-3 text-sm",
            note.tone === "error" ? "bg-destructive/10 text-destructive" : "bg-jh-light text-jh-navy",
          )}
        >
          {note.text}
        </p>
      ) : null}

      {state === "payable" && online ? (
        <div className="mt-5">
          <Button
            type="button"
            disabled={busy}
            aria-busy={busy}
            onClick={() => void pay()}
            className="h-12 w-full rounded-full px-6 text-base sm:w-auto"
          >
            {busy ? <Loader2 aria-hidden className="animate-spin" /> : <Lock aria-hidden />}
            Pay {rupees(amount)} online
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Secure payment by Razorpay: UPI, cards, net banking and wallets.</p>
          <noscript>
            <p className="mt-2 text-sm text-destructive">Paying online needs JavaScript. Please turn it on, or pay by bank transfer.</p>
          </noscript>
        </div>
      ) : state === "waiting" && !rechecking ? (
        <Button type="button" variant="outline" className="mt-5 h-11 rounded-full px-5" onClick={() => router.refresh()}>
          Check again
        </Button>
      ) : null}

      {state === "payable" && bankDetails.length > 0 ? (
        <div className={cn("rounded-2xl bg-jh-light p-4 text-sm", online ? "mt-6" : "mt-5")}>
          <p className="flex items-center gap-2 font-semibold">
            <Landmark aria-hidden className="size-4 text-jh-deep" />
            {online ? "Or pay by bank transfer" : "Pay by bank transfer"}
          </p>
          <ul className="mt-2 flex flex-col gap-0.5">
            {bankDetails.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <p className="mt-2">
            Amount: <strong className="tabular-nums">{rupees(amount)}</strong>. Use <strong>{orderNumber}</strong> as the
            payment reference. We confirm your order by email once the money arrives.
          </p>
        </div>
      ) : null}

      {state === "payable" && !online && bankDetails.length === 0 ? (
        <p className="mt-4 text-sm">We&apos;ll email you how to pay shortly. You can also contact us any time.</p>
      ) : null}
    </section>
  );
}
