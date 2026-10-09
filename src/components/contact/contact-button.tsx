"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContact } from "./contact-context";

/** Any "Contact us" / "Enquire" button: opens the contact form, optionally about a topic. */
export function ContactButton({
  children,
  topic,
  variant = "default",
  className,
}: {
  children: ReactNode;
  topic?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  className?: string;
}) {
  const { openContact } = useContact();
  return (
    <Button
      type="button"
      variant={variant}
      aria-haspopup="dialog"
      onClick={() => openContact(topic)}
      className={cn("h-11 rounded-full px-5 text-sm font-semibold", className)}
    >
      {children}
    </Button>
  );
}
