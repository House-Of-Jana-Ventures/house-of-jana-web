import type { Metadata } from "next";
import { AuthCard } from "@/components/account/auth-card";
import { ForgotPasswordForm } from "@/components/account/auth-forms";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Forgot your password?" intro="Enter your account's email and we'll send you a link to choose a new password.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
