import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ProfileForm } from "@/components/account/account-forms";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { api } from "@/lib/api/client";
import { isSessionEnded, requireSession, signInUrl } from "@/lib/session/session";

export const metadata: Metadata = { title: "Your details" };

interface Profile {
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  companyName: string | null;
  gstNumber: string | null;
}

export default function ProfilePage() {
  return (
    <>
      <h1 className="text-4xl font-semibold">Your details</h1>
      <Suspense fallback={<p className="mt-6 text-muted-foreground">Loading…</p>}>
        <ProfileContent />
      </Suspense>
    </>
  );
}

async function ProfileContent() {
  const session = await requireSession("/account/profile");
  let profile: Profile;
  try {
    profile = await api<Profile>("/profile", { token: session.token });
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl("/account/profile"));
    return (
      <div className="mt-6">
        <ShopUnavailable />
      </div>
    );
  }
  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="rounded-3xl bg-white p-5 ring-1 ring-border sm:p-6">
        <p className="mb-5 text-sm">
          <span className="text-muted-foreground">Email: </span>
          <span className="font-medium">{profile.email}</span>
          <span className="block text-xs text-muted-foreground">To use another email, contact us.</span>
        </p>
        <ProfileForm
          defaults={{
            firstName: profile.firstName,
            lastName: profile.lastName ?? "",
            phone: profile.phone ?? "",
            companyName: profile.companyName ?? "",
            gstNumber: profile.gstNumber ?? "",
          }}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        To close your account, contact us with the contact button. We keep past orders as GST rules require.
      </p>
    </div>
  );
}
