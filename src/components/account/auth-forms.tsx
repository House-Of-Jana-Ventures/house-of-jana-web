"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPassword, register, resetPassword, signIn } from "@/lib/session/actions";
import { EMPTY } from "@/lib/shop/messages";
import { Field, FormNote, SubmitButton } from "./form-bits";

const PASSWORD_HINT = "At least 8 characters, with at least one letter and one number.";

/** Where to go after signing in, and an item waiting to be added, carried between the sign-in pages. */
interface Carry {
  next: string;
  add: string;
}

const carried = ({ next, add }: Carry) =>
  `?next=${encodeURIComponent(next)}${add ? `&add=${encodeURIComponent(add)}` : ""}`;

function Hidden({ next, add }: Carry) {
  return (
    <>
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="add" value={add} />
    </>
  );
}

export function SignInForm(carry: Carry) {
  const [state, action] = useActionState(signIn, EMPTY);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Hidden {...carry} />
      <FormNote state={state} />
      <Field name="email" label="Email" type="email" autoComplete="email" inputMode="email" state={state} />
      <Field name="password" label="Password" type="password" autoComplete="current-password" state={state} />
      <Link href="/forgot-password" className="-mt-2 self-end text-sm text-jh-deep hover:underline">
        Forgot password?
      </Link>
      <SubmitButton>Sign in</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href={`/register${carried(carry)}`} className="font-semibold text-jh-deep hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm(carry: Carry) {
  const [state, action] = useActionState(register, EMPTY);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Hidden {...carry} />
      <FormNote state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="firstName" label="First name" autoComplete="given-name" state={state} />
        <Field name="lastName" label="Last name" autoComplete="family-name" optional state={state} />
      </div>
      <Field name="email" label="Email" type="email" autoComplete="email" inputMode="email" state={state} />
      <Field
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        state={state}
        hint="An Indian mobile, or another number with its country code (e.g. +971 50 123 4567)."
      />
      <Field name="companyName" label="Company" autoComplete="organization" optional state={state} />
      <Field name="password" label="Password" type="password" autoComplete="new-password" state={state} hint={PASSWORD_HINT} />
      <Field name="confirmPassword" label="Password again" type="password" autoComplete="new-password" state={state} />
      <SubmitButton>Create account</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={`/sign-in${carried(carry)}`} className="font-semibold text-jh-deep hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPassword, EMPTY);
  if (state.ok) return <FormNote state={state} />;
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormNote state={state} />
      <Field name="email" label="Email" type="email" autoComplete="email" inputMode="email" state={state} />
      <SubmitButton>Email me a link</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPassword, EMPTY);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <FormNote state={state} />
      {state.errors?.token || state.message?.startsWith("This link") ? (
        <Link href="/forgot-password" className="text-sm font-semibold text-jh-deep hover:underline">
          Ask for a new link
        </Link>
      ) : null}
      <Field name="newPassword" label="New password" type="password" autoComplete="new-password" state={state} hint={PASSWORD_HINT} />
      <Field name="confirmPassword" label="New password again" type="password" autoComplete="new-password" state={state} />
      <SubmitButton>Save the new password</SubmitButton>
    </form>
  );
}
