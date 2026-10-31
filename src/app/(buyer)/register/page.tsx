import type { Metadata } from "next";
import { Suspense } from "react";
import { carriedQuery } from "@/components/account/auth-split";
import { RegisterForm } from "@/components/account/auth-forms";
import { SignUpLayout } from "@/components/account/sign-up-layout";
import { parsePendingAdd } from "@/lib/session/pending-add";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage(props: PageProps<"/register">) {
  return (
    <Suspense fallback={<SignUpLayout signInHref="/sign-in">{null}</SignUpLayout>}>
      <Register {...props} />
    </Suspense>
  );
}

async function Register({ searchParams }: PageProps<"/register">) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const add = parsePendingAdd(one(params.add)) ? one(params.add) : "";
  const query = carriedQuery(one(params.next), add);
  return (
    <SignUpLayout signInHref={`/sign-in${query}`}>
      <RegisterForm next={one(params.next)} add={add} />
    </SignUpLayout>
  );
}
