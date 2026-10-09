"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  checkField,
  CONTACT_FIELDS,
  emptyContact,
  LIMITS,
  suggestEmail,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact-rules";
import { site } from "@/content/site";
import { markSent } from "./contact-context";

/** A red star after a required field's name (screen readers hear "required" from the field itself). */
function Required() {
  return (
    <span aria-hidden className="text-destructive">
      *
    </span>
  );
}

/** WhatsApp's logo, in its own green. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="#25D366">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.2-4.24 9.43-9.46 9.43m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.3l5.7-1.5a11.33 11.33 0 0 0 5.77 1.47h.01c6.26 0 11.36-5.1 11.36-11.37 0-3.04-1.18-5.89-3.33-8.04" />
    </svg>
  );
}

const FIELDS: {
  name: ContactField;
  label: string;
  type?: string;
  autoComplete: string;
  inputMode?: "email" | "tel";
}[] = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", inputMode: "tel" },
  { name: "company", label: "Company", autoComplete: "organization" },
];

/**
 * The contact form: Name, Email, Phone, Company and Message, all required.
 * Checks each field when you leave it, checks again on the server, and says
 * thank you when sent. A hidden trap field catches bots.
 */
export function ContactForm({ topic, onDone }: { topic: string | null; onDone: () => void }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, {
    status: "idle",
  });

  // Once a message is sent, the form stops opening by itself.
  useEffect(() => {
    if (state.status === "sent") markSent();
  }, [state.status]);

  if (state.status === "sent")
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 aria-hidden className="size-12 text-jh-deep" strokeWidth={1.5} />
        <p className="font-heading text-2xl">Thank you!</p>
        <p className="text-muted-foreground">
          We&apos;ve received your message and will be in touch shortly.
        </p>
        <Button className="mt-2" variant="outline" onClick={onDone}>
          Close
        </Button>
      </div>
    );

  // A fresh form for each answer from the server: React resets a form after
  // its action, and the new one starts from what was typed and its problems.
  return (
    <FormFields
      key={state.status === "idle" ? "new" : JSON.stringify(state)}
      state={state}
      action={action}
      pending={pending}
      topic={topic}
    />
  );
}

function FormFields({
  state,
  action,
  pending,
  topic,
}: {
  state: Exclude<ContactState, { status: "sent" }>;
  action: (form: FormData) => void;
  pending: boolean;
  topic: string | null;
}) {
  const [errors, setErrors] = useState<ContactErrors>(
    state.status === "invalid" ? state.errors : {},
  );
  // "Did you mean mei@gmail.com?": offered as a one-click fix.
  const [suggestion, setSuggestion] = useState<string | undefined>(
    state.status === "invalid" ? suggestEmail(state.values.email) : undefined,
  );
  const pathname = usePathname();
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);

  // After the server finds problems, take the visitor to the first one.
  useEffect(() => {
    if (state.status !== "invalid") return;
    const first = CONTACT_FIELDS.find((f) => state.errors[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  const values = state.status === "idle" ? null : state.values;
  const initial = {
    ...emptyContact(),
    message: topic ? `I'd like to know more about ${topic}. ` : "",
  };
  const check = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.currentTarget.name as ContactField;
    const value = event.currentTarget.value;
    // Only once something was typed, so tabbing through doesn't shout.
    if (!value && !errors[field]) return;
    setErrors((current) => ({ ...current, [field]: checkField(field, value) }));
    if (field === "email") setSuggestion(suggestEmail(value));
  };
  // Once a field shows a problem, check again as they type, so it clears when fixed.
  const recheck = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.currentTarget.name as ContactField;
    if (!errors[field]) return;
    const value = event.currentTarget.value;
    setErrors((current) => ({ ...current, [field]: checkField(field, value) }));
    if (field === "email") setSuggestion(suggestEmail(value));
  };
  const applySuggestion = () => {
    const input = formRef.current?.elements.namedItem("email");
    if (!(input instanceof HTMLInputElement) || !suggestion) return;
    input.value = suggestion;
    setErrors((current) => ({ ...current, email: checkField("email", suggestion) }));
    setSuggestion(undefined);
    input.focus();
  };
  const describedBy = (field: ContactField) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-3.5">
      <p className="-mt-1 text-xs text-muted-foreground">
        Fields marked <span className="text-destructive">*</span> are required.
      </p>
      <input type="hidden" name="page" value={pathname} />
      {/* A trap for spam bots, which fill in every box they find in the page's code.
          Fully hidden (display: none), so browsers' autofill and assistants that
          fill forms for people never touch it; a plain name autofill doesn't know. */}
      <div hidden>
        <input type="text" name="jh_trap" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-${field.name}`} className="gap-0.5">
              {field.label}
              <Required />
            </Label>
            <Input
              id={`${id}-${field.name}`}
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              inputMode={field.inputMode}
              required
              maxLength={LIMITS[field.name]}
              defaultValue={values?.[field.name] ?? initial[field.name]}
              aria-invalid={errors[field.name] ? true : undefined}
              aria-describedby={describedBy(field.name)}
              onBlur={check}
              onChange={recheck}
              className="h-10 bg-white"
            />
            {errors[field.name] ? (
              <p id={`${id}-${field.name}-error`} className="text-xs text-destructive">
                {errors[field.name]}
              </p>
            ) : null}
            {field.name === "email" && suggestion && errors.email ? (
              <button
                type="button"
                onClick={applySuggestion}
                className="self-start rounded-full bg-jh-light px-3 py-1 text-xs font-medium text-jh-navy ring-1 ring-jh-bright/40 transition-colors hover:bg-jh-bright/20"
              >
                Yes, use {suggestion}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-message`} className="gap-0.5">
          How can we help?
          <Required />
        </Label>
        <Textarea
          id={`${id}-message`}
          name="message"
          required
          rows={4}
          maxLength={LIMITS.message}
          defaultValue={values?.message ?? initial.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
          onBlur={check}
          onChange={recheck}
          placeholder="The products, textures, lengths or quantities you're interested in…"
          className="min-h-24 bg-white"
        />
        {errors.message ? (
          <p id={`${id}-message-error`} className="text-xs text-destructive">
            {errors.message}
          </p>
        ) : null}
      </div>

      {state.status === "error" ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="mt-1 h-11 text-base font-semibold">
        {pending ? (
          <>
            <Loader2 aria-hidden className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send aria-hidden /> Send message
          </>
        )}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/50 bg-white text-base font-semibold text-jh-navy transition-colors hover:bg-[#25D366]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        <WhatsAppIcon className="size-5" />
        Chat with us on WhatsApp
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </form>
  );
}
