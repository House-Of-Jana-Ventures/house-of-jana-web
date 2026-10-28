/**
 * What a form shows after a server action: a note and field errors, with
 * the API's answers in the shop's words. Pure, so tested.
 */
export interface FormState {
  ok?: boolean;
  message?: string;
  /** Field → messages, as the API reports them (e.g. "postalCode"). */
  errors?: Record<string, string[]>;
  /** What was typed, so the form keeps it after a refusal. */
  values?: Record<string, string>;
}

export const EMPTY: FormState = {};

export interface ErrorLike {
  status: number;
  code: string;
  message: string;
  errors: { field: string; messages: string[] }[];
}

export const isErrorLike = (error: unknown): error is ErrorLike =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  "code" in error &&
  Array.isArray((error as { errors?: unknown }).errors);

/** Plain words for the answers buyers may meet. */
export function friendlyMessage(error: ErrorLike): string {
  if (error.status === 0 || error.status >= 500)
    return "The shop can't be reached right now. Please try again in a minute.";
  switch (error.code) {
    case "INSUFFICIENT_STOCK":
      return "We don't have that many in stock. The most you can order is shown on the product.";
    case "PRODUCT_UNAVAILABLE":
      return "This item isn't on sale any more.";
    case "CART_EMPTY":
      return "Your cart is empty.";
    case "CART_NOT_READY":
      return "Some items in your cart need attention first (see the notes on them).";
    case "PRICE_CHANGED":
      return "The total has changed since you opened this page. Please check the new total and place the order again.";
    case "ADDRESS_REQUIRED":
      return "Choose a delivery address first.";
    case "INVALID_RESET_TOKEN":
      return "This link has expired or was already used. Ask for a new one below.";
    case "EMAIL_ALREADY_REGISTERED":
      return "There's already an account with this email. Sign in instead, or reset your password.";
    case "ACCOUNT_LOCKED":
    case "ACCOUNT_SUSPENDED":
      return error.message;
  }
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (error.status === 400 && error.errors.length > 0) return "Please check the highlighted fields.";
  return error.message;
}

/** Turns an API error into form state; anything else is re-thrown. */
export function toFormState(error: unknown, values?: Record<string, string>): FormState {
  if (!isErrorLike(error)) throw error;
  const errors: Record<string, string[]> = {};
  for (const item of error.errors) errors[item.field] = [...(errors[item.field] ?? []), ...item.messages.map(sentence)];
  return { ok: false, message: friendlyMessage(error), errors, values };
}

/** "postalCode must be a 6-digit PIN code" → "Must be a 6-digit PIN code." (the label already names the field). */
export function sentence(message: string): string {
  const trimmed = message.replace(/^[a-z][A-Za-z0-9.]*\s+(?=must|should|is|cannot|can't|has)/, "").trim();
  const text = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

/** Text fields of a submitted form, for keeping what was typed. */
export function formValues(form: FormData, names: readonly string[]): Record<string, string> {
  return Object.fromEntries(names.map((name) => [name, String(form.get(name) ?? "")]));
}
