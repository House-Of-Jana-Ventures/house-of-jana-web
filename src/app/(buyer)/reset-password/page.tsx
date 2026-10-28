import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/account/auth-card";
import { ResetPasswordForm } from "@/components/account/auth-forms";

export const metadata: Metadata = { title: "Choose a new password" };

export default function ResetPasswordPage(props: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={<AuthCard title="Choose a new password">{null}</AuthCard>}>
      <ResetPassword {...props} />
    </Suspense>
  );
}

async function ResetPassword({ searchParams }: PageProps<"/reset-password">) {
  const raw = (await searchParams).token;
  const token = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) {
    return (
      <AuthCard title="This link doesn't work" intro="It may be incomplete: open it straight from the email, or ask for a new one.">
        <Link href="/forgot-password" className="font-semibold text-jh-deep hover:underline">
          Ask for a new link
        </Link>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Choose a new password" intro="You'll be signed out on every device, then you can sign in with the new password.">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
