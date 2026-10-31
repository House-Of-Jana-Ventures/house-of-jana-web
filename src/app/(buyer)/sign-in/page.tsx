import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSplit, carriedQuery } from "@/components/account/auth-split";
import { SignInForm } from "@/components/account/auth-forms";
import { parsePendingAdd } from "@/lib/session/pending-add";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage(props: PageProps<"/sign-in">) {
  return (
    <Suspense fallback={<AuthSplit active="sign-in" query="" title="Sign in">{null}</AuthSplit>}>
      <SignIn {...props} />
    </Suspense>
  );
}

async function SignIn({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const add = parsePendingAdd(one(params.add)) ? one(params.add) : "";
  const note = one(params.note);
  return (
    <AuthSplit
      active="sign-in"
      query={carriedQuery(one(params.next), add)}
      title="Sign in"
      intro={
        note === "password-changed" ? (
          <p role="status" className="rounded-2xl bg-jh-bright/15 px-4 py-3 text-jh-navy">
            Your password has been changed. Sign in with the new one.
          </p>
        ) : note === "signed-out-everywhere" ? (
          <p role="status" className="rounded-2xl bg-jh-bright/15 px-4 py-3 text-jh-navy">
            You&apos;re signed out on every device.
          </p>
        ) : add ? (
          "Sign in or create an account to order. Your item goes into the cart straight after."
        ) : (
          "Sign in to order, pay and follow your orders."
        )
      }
    >
      <SignInForm next={one(params.next)} add={add} />
    </AuthSplit>
  );
}
