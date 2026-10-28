"use client";

import { CheckCircle2, ImageOff, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { setLineQuantity } from "@/lib/cart/actions";
import { bulkNote, groupByProduct, lineProblem, pieces } from "@/lib/cart/rules";
import type { Cart } from "@/lib/cart/types";
import { rupees } from "@/lib/shop/prices";

/**
 * The cart sliding in after "Add to cart": what was added, the lines with
 * quick quantity changes, how far the bulk price is, and the way on
 * (Continue shopping, View cart, Checkout).
 */
export function CartDrawer({
  cart,
  added,
  open,
  onOpenChange,
  onCart,
}: {
  cart: Cart | null;
  /** The line just added, highlighted. */
  added: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCart: (cart: Cart) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  const change = (lineId: string, quantity: number) =>
    startTransition(async () => {
      setNote(null);
      const result = await setLineQuantity(lineId, quantity);
      if (result.ok) {
        onCart(result.cart);
        router.refresh();
      } else if ("signIn" in result) router.push(result.signIn);
      else setNote(result.message);
    });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-[92%] flex-col gap-0 bg-white p-0 sm:max-w-md">
        <div className="border-b border-border p-5 pr-12">
          <SheetTitle className="flex items-center gap-2 font-heading text-2xl">
            <CheckCircle2 aria-hidden className="size-6 text-jh-deep" /> Added to your cart
          </SheetTitle>
          <SheetDescription className="mt-1 text-sm">
            {cart ? `${pieces(cart.itemCount)} in your cart` : "Loading your cart…"}
          </SheetDescription>
        </div>
        {cart ? (
          <div aria-busy={pending} className="flex-1 overflow-y-auto p-5">
            {note ? (
              <p role="alert" className="mb-3 rounded-2xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {note}
              </p>
            ) : null}
            <ul className="flex flex-col gap-5">
              {groupByProduct(cart).map(({ product, lines }) => (
                <li key={product.productId}>
                  <p className="font-semibold">{product.productName}</p>
                  <p className="text-xs text-jh-deep">{bulkNote(product)}</p>
                  <ul className="mt-2 flex flex-col gap-3">
                    {lines.map((line) => {
                      const problem = lineProblem(line);
                      return (
                        <li
                          key={line.id}
                          className={`flex gap-3 rounded-2xl p-2 ${line.id === added ? "bg-jh-light ring-1 ring-jh-bright/50" : ""}`}
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-jh-light">
                            {line.image ? (
                              <Image src={line.image.thumbnail} alt="" fill unoptimized sizes="56px" className="object-cover" />
                            ) : (
                              <ImageOff aria-hidden className="m-auto mt-4 size-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 text-sm">
                            <div className="flex justify-between gap-2">
                              <span className="font-medium">{line.variantLabel}</span>
                              <span className="font-semibold tabular-nums">{rupees(line.lineTotal)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {rupees(line.unitPrice)} per {line.unitLabel} ({line.tier === "bulk" ? "bulk" : "single"} price)
                            </p>
                            {problem ? <p className="mt-1 text-xs text-destructive">{problem}</p> : null}
                            <div className="mt-1.5 flex items-center gap-1">
                              <button
                                type="button"
                                disabled={pending}
                                onClick={() => change(line.id, line.quantity - 1)}
                                aria-label={`One less ${line.variantLabel}`}
                                className="flex size-8 items-center justify-center rounded-full ring-1 ring-border hover:bg-jh-light"
                              >
                                <Minus aria-hidden className="size-3.5" />
                              </button>
                              <span className="w-10 text-center font-semibold tabular-nums">{line.quantity}</span>
                              <button
                                type="button"
                                disabled={pending}
                                onClick={() => change(line.id, line.quantity + 1)}
                                aria-label={`One more ${line.variantLabel}`}
                                className="flex size-8 items-center justify-center rounded-full ring-1 ring-border hover:bg-jh-light"
                              >
                                <Plus aria-hidden className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <div className="border-t border-border p-5">
          {cart ? (
            <p className="mb-4 flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span className="tabular-nums">{rupees(cart.subtotal)}</span>
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <Link
              href="/checkout"
              onClick={() => onOpenChange(false)}
              aria-disabled={!cart?.readyForCheckout}
              className="flex h-12 items-center justify-center rounded-full bg-jh-bright font-semibold text-jh-navy hover:bg-jh-bright/85 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              Checkout
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-11 rounded-full text-sm font-medium ring-1 ring-border hover:bg-jh-light"
              >
                Continue shopping
              </button>
              <Link
                href="/cart"
                onClick={() => onOpenChange(false)}
                className="flex h-11 items-center justify-center rounded-full text-sm font-medium ring-1 ring-border hover:bg-jh-light"
              >
                View cart
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
