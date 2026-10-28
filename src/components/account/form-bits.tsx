"use client";

import { Loader2 } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormState } from "@/lib/shop/messages";
import { cn } from "@/lib/utils";

/**
 * A labelled box with the API's message under it, like the contact form's
 * fields. Ids are unique per page visit: Next keeps recently visited pages
 * mounted (hidden), and a shared id would tie the label to the hidden box.
 */
export function Field({
  name,
  label,
  state,
  optional,
  hint,
  className,
  ...input
}: ComponentProps<"input"> & {
  name: string;
  label: string;
  state: FormState;
  optional?: boolean;
  hint?: ReactNode;
}) {
  const id = `${useId()}-${name}`;
  const errors = state.errors?.[name];
  const describedBy = [errors ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="gap-1">
        {label}
        {optional ? <span className="font-normal text-muted-foreground">(optional)</span> : null}
      </Label>
      <Input
        id={id}
        name={name}
        required={!optional}
        defaultValue={state.values?.[name]}
        aria-invalid={errors ? true : undefined}
        aria-describedby={describedBy}
        className="h-11 bg-white"
        {...input}
      />
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {errors ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {errors.join(" ")}
        </p>
      ) : null}
    </div>
  );
}

/** The form's note: an alert for a refusal, a status message otherwise. */
export function FormNote({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok === false ? "alert" : "status"}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm",
        state.ok === false ? "bg-destructive/10 text-destructive" : "bg-jh-bright/15 text-jh-navy",
      )}
    >
      {state.message}
    </p>
  );
}

/** The form's main button, busy while the form is being sent. */
export function SubmitButton({ children, className }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} className={cn("h-12 rounded-full px-6 text-base", className)}>
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
      {children}
    </Button>
  );
}
