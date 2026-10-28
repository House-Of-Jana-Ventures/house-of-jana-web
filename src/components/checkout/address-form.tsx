"use client";

import { useActionState, useId, useState } from "react";
import { Field, FormNote, SubmitButton } from "@/components/account/form-bits";
import { Label } from "@/components/ui/label";
import { INDIAN_STATES } from "@/lib/checkout/address";
import { saveAddress } from "@/lib/checkout/actions";
import { EMPTY, type FormState } from "@/lib/shop/messages";

const SELECT =
  "h-11 w-full rounded-lg border border-input bg-white px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm";

/**
 * A delivery address in India or abroad. The form changes with the
 * country: India asks for the state from a list and a 6-digit PIN (and
 * takes a GSTIN); elsewhere the region and postcode are free text.
 * Checkout uses it as it is; the address book passes its own action, the
 * saved address to edit and the button's words.
 */
export function AddressForm({
  countries,
  defaults,
  action: save = saveAddress,
  submitLabel = "Deliver to this address",
  defaultChoice = "Use this address next time too",
}: {
  countries: { code: string; name: string }[];
  /** The fields to start from: the account's name and phone, or the address being edited. */
  defaults: Record<string, string>;
  action?: (state: FormState, form: FormData) => Promise<FormState>;
  submitLabel?: string;
  /** The "make default" box's words; empty hides it (editing the default address). */
  defaultChoice?: string;
}) {
  const [state, action] = useActionState(save, EMPTY);
  const uid = useId();
  const [country, setCountry] = useState(state.values?.country || defaults.country || "IN");
  const india = country === "IN";
  // What was typed comes back after a refusal; before that, the starting fields.
  const shown: FormState = state.values ? state : { ...state, values: defaults };

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormNote state={state} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${uid}-country`}>Country</Label>
        <select
          id={`${uid}-country`}
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          autoComplete="country"
          className={SELECT}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="fullName" label="Full name" autoComplete="name" state={shown} />
        <Field
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          state={shown}
          hint={india ? "A 10-digit Indian mobile number." : "With the country code, e.g. +971 50 123 4567."}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="company" label="Company" autoComplete="organization" optional state={shown} />
        {india ? (
          <Field
            name="gstNumber"
            label="GSTIN"
            optional
            state={shown}
            maxLength={15}
            hint="For a GST invoice in your company's name."
          />
        ) : null}
      </div>
      <Field name="line1" label="Address" autoComplete="address-line1" state={shown} placeholder="Building, street" />
      <Field name="line2" label="Address line 2" autoComplete="address-line2" optional state={shown} placeholder="Area, locality" />
      <Field name="landmark" label="Landmark" optional state={shown} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field name="city" label="City" autoComplete="address-level2" state={shown} />
        {india ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${uid}-state`}>State</Label>
            <select
              id={`${uid}-state`}
              name="state"
              required
              defaultValue={shown.values?.state ?? ""}
              autoComplete="address-level1"
              aria-invalid={state.errors?.state ? true : undefined}
              aria-describedby={state.errors?.state ? `${uid}-state-error` : undefined}
              className={SELECT}
            >
              <option value="" disabled>
                Choose…
              </option>
              {INDIAN_STATES.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            {state.errors?.state ? (
              <p id={`${uid}-state-error`} className="text-xs text-destructive">
                {state.errors.state.join(" ")}
              </p>
            ) : null}
          </div>
        ) : (
          <Field name="state" label="State / region" autoComplete="address-level1" optional state={shown} />
        )}
        <Field
          name="postalCode"
          label={india ? "PIN code" : "Postcode"}
          autoComplete="postal-code"
          inputMode={india ? "numeric" : "text"}
          maxLength={12}
          state={shown}
        />
      </div>
      {defaultChoice ? (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isDefault" className="size-4 accent-jh-bright" />
          {defaultChoice}
        </label>
      ) : null}
      <SubmitButton className="self-start">{submitLabel}</SubmitButton>
    </form>
  );
}
