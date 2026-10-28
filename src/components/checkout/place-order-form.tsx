"use client";

import { useActionState } from "react";
import { FormNote, SubmitButton } from "@/components/account/form-bits";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { placeOrder } from "@/lib/checkout/actions";
import { EMPTY } from "@/lib/shop/messages";

/** Place order: the note for the shop and the button. A double click places one order (the key). */
export function PlaceOrderForm({
  addressId,
  expectedGrandTotal,
  orderKey,
  label,
}: {
  addressId: string;
  expectedGrandTotal: string;
  orderKey: string;
  label: string;
}) {
  const [state, action] = useActionState(placeOrder, EMPTY);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="addressId" value={addressId} />
      <input type="hidden" name="expectedGrandTotal" value={expectedGrandTotal} />
      <input type="hidden" name="key" value={orderKey} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes" className="gap-1">
          A note for us <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          name="notes"
          maxLength={500}
          rows={3}
          defaultValue={state.values?.notes}
          placeholder="E.g. pack by length, or a delivery time that suits you."
          className="bg-white"
        />
      </div>
      <FormNote state={state} />
      <SubmitButton className="w-full">{label}</SubmitButton>
    </form>
  );
}
