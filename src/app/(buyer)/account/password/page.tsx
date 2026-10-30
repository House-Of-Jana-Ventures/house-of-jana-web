import type { Metadata } from "next";
import { PasswordForm } from "@/components/account/account-forms";
import { signOutEverywhere } from "@/lib/account/actions";

export const metadata: Metadata = { title: "Password" };

export default function PasswordPage() {
  return (
    <>
      <h1 className="text-4xl font-semibold">Password</h1>
      <div className="mt-6 flex flex-col gap-6">
        <section aria-labelledby="change-title" className="rounded-3xl bg-white p-5 ring-1 ring-border sm:p-6">
          <h2 id="change-title" className="mb-1 text-xl font-semibold">
            Change your password
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">You stay signed in here; other devices are signed out.</p>
          <PasswordForm />
        </section>
        <section aria-labelledby="everywhere-title" className="rounded-3xl bg-white p-5 ring-1 ring-border sm:p-6">
          <h2 id="everywhere-title" className="mb-1 text-xl font-semibold">
            Sign out everywhere
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            For example after using a shared computer. You&apos;ll need to sign in again on every device, this one too.
          </p>
          <form action={signOutEverywhere}>
            <button
              type="submit"
              className="rounded-sm px-5 py-2.5 text-sm font-semibold ring-1 ring-border hover:bg-destructive/10 hover:text-destructive"
            >
              Sign out everywhere
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
