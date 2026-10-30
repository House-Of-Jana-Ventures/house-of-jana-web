"use client";

import { useActionState, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cancelOrder } from "@/lib/account/actions";
import { EMPTY } from "@/lib/shop/messages";
import { FormNote, SubmitButton } from "./form-bits";

/** Cancel an unpaid order: a small confirm step with an optional reason. */
export function CancelOrderForm({ orderNumber }: { orderNumber: string }) {
  const [state, action] = useActionState(cancelOrder.bind(null, orderNumber), EMPTY);
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="self-start rounded-sm px-5 py-2.5 text-sm font-semibold text-muted-foreground ring-1 ring-border hover:bg-destructive/10 hover:text-destructive"
      >
        Cancel this order
      </button>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-3 rounded-3xl bg-white p-5 ring-1 ring-border">
      <p className="font-semibold">Cancel order {orderNumber}?</p>
      <p className="text-sm text-muted-foreground">Nothing has been charged. The items go back on sale.</p>
      <FormNote state={state} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cancel-reason" className="gap-1">
          Why? <span className="font-normal text-muted-foreground">(optional, helps us)</span>
        </Label>
        <Textarea id="cancel-reason" name="reason" maxLength={300} rows={2} className="bg-white" />
      </div>
      <div className="flex flex-wrap gap-2">
        <SubmitButton className="bg-destructive/10 text-destructive hover:bg-destructive/20">Yes, cancel the order</SubmitButton>
        <button type="button" onClick={() => setAsking(false)} className="h-12 rounded-sm px-5 text-sm ring-1 ring-border hover:bg-jh-light">
          Keep the order
        </button>
      </div>
    </form>
  );
}
