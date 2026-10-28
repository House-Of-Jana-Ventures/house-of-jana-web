"use client";

import { AddressForm } from "@/components/checkout/address-form";
import { saveBookAddress } from "@/lib/account/actions";

/** The address book's add / edit form: the checkout form with the book's own saving. */
export function BookAddressForm({
  id,
  countries,
  defaults,
  isDefault,
}: {
  id: string;
  countries: { code: string; name: string }[];
  defaults: Record<string, string>;
  isDefault: boolean;
}) {
  return (
    <AddressForm
      countries={countries}
      defaults={defaults}
      action={saveBookAddress.bind(null, id)}
      submitLabel={id ? "Save address" : "Add address"}
      defaultChoice={isDefault ? "" : "Make this my default address"}
    />
  );
}
