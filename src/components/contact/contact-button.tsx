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
      className={cn("h-11 rounded-sm px-5 text-sm font-semibold", className)}
    >
      {children}
    </Button>
  );
}

/**
 * A plain button that opens the contact form, styled entirely by its
 * `className` (for the thin outline buttons and underlined links of phase J3).
 */
export function ContactTrigger({
  children,
  topic,
  className,
}: {
  children: ReactNode;
  topic?: string;
  className?: string;
}) {
  const { openContact } = useContact();
  return (
    <button type="button" aria-haspopup="dialog" onClick={() => openContact(topic)} className={className}>
      {children}
    </button>
  );
}
