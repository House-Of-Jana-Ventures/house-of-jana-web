import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/account/auth-card";
import { RegisterForm } from "@/components/account/auth-forms";
import { parsePendingAdd } from "@/lib/session/pending-add";

export const metadata: Metadata = { title: "Create an account" };

const INTRO = "One account for ordering, paying and following your orders. Bulk prices apply from a set number of pieces, shown on each product.";

export default function RegisterPage(props: PageProps<"/register">) {
  return (
    <Suspense fallback={<AuthCard title="Create an account" intro={INTRO}>{null}</AuthCard>}>
      <Register {...props} />
    </Suspense>
  );
}

async function Register({ searchParams }: PageProps<"/register">) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const add = parsePendingAdd(one(params.add)) ? one(params.add) : "";
  return (
    <AuthCard title="Create an account" intro={INTRO}>
      <RegisterForm next={one(params.next)} add={add} />
    </AuthCard>
  );
}
