"use client";

import { useActionState } from "react";
import { changePassword, updateProfile } from "@/lib/account/actions";
import { EMPTY } from "@/lib/shop/messages";
import { Field, FormNote, SubmitButton } from "./form-bits";

export function ProfileForm({ defaults }: { defaults: Record<string, string> }) {
  const [state, action] = useActionState(updateProfile, EMPTY);
  const shown = state.values ? state : { ...state, values: defaults };
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormNote state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="firstName" label="First name" autoComplete="given-name" state={shown} />
        <Field name="lastName" label="Last name" autoComplete="family-name" optional state={shown} />
      </div>
      <Field
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        state={shown}
        hint="An Indian mobile, or another number with its country code (e.g. +971 50 123 4567)."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="companyName" label="Company" autoComplete="organization" optional state={shown} />
        <Field name="gstNumber" label="GSTIN" optional maxLength={15} state={shown} hint="For GST invoices in your company's name." />
      </div>
      <SubmitButton className="self-start">Save</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, EMPTY);
  return (
    // A fresh form after each success, so the boxes are empty again.
    <form key={state.ok ? state.message : "form"} action={action} className="flex flex-col gap-4">
      <FormNote state={state} />
      <Field name="currentPassword" label="Current password" type="password" autoComplete="current-password" state={state} />
      <Field
        name="newPassword"
        label="New password"
        type="password"
        autoComplete="new-password"
        state={state}
        hint="At least 8 characters, with at least one letter and one number."
      />
      <Field name="confirmPassword" label="New password again" type="password" autoComplete="new-password" state={state} />
      <SubmitButton className="self-start">Change password</SubmitButton>
    </form>
  );
}
