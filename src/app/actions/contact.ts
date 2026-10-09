"use server";

import { headers } from "next/headers";
import nodemailer, { type Transporter } from "nodemailer";
import { enquiryEmail, thankYouEmail } from "@/lib/contact-email";
import { emailDomainAccepts } from "@/lib/email-domain";
import {
  checkContact,
  readContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact-rules";
import { site } from "@/content/site";

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors; values: ContactValues }
  | { status: "sent" }
  | { status: "error"; message: string; values: ContactValues };

/** At most 5 messages per visitor in 10 minutes (per server; resets on restart). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function allowed(visitor: string, now = Date.now()): boolean {
  const times = (recent.get(visitor) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) {
    recent.set(visitor, times);
    return false;
  }
  times.push(now);
  recent.set(visitor, times);
  return true;
}

let transporter: Transporter | undefined;

/** Gmail, signed in with an app password (GMAIL_USER, GMAIL_APP_PASSWORD). */
function gmail(user: string, pass: string): Transporter {
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

/**
 * Emails the enquiry to the business inbox (CONTACT_TO), then a thank-you
 * with a copy of the message to the visitor, both from the Gmail account.
 * Only the first must succeed: if the thank-you fails, the enquiry still
 * arrived, so the visitor is told it worked and the failure is logged.
 *
 * With CONTACT_DRY_RUN=true (the browser tests, even if a password is set),
 * or without the Gmail settings outside production, nothing is sent and the
 * enquiry is only logged; in production missing settings are an error.
 */
async function deliver(values: ContactValues, page: string): Promise<boolean> {
  const user = process.env.GMAIL_USER?.trim();
  // Google shows app passwords in groups of four ("abcd efgh ..."); the spaces aren't part of it.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const dryRun = process.env.CONTACT_DRY_RUN === "true";
  const to = process.env.CONTACT_TO?.trim() || site.email;
  const enquiry = enquiryEmail(values, page, new Date());
  if (!user || !pass || dryRun) {
    if (process.env.NODE_ENV === "production" && !dryRun) {
      console.error("Contact form: GMAIL_USER or GMAIL_APP_PASSWORD is not set, so the message could not be sent.");
      return false;
    }
    console.info(`[contact form, not sent: ${dryRun ? "dry run" : "no Gmail settings"}] to ${to}\n${enquiry.text}`);
    return true;
  }

  const from = { name: site.name, address: user };
  try {
    await gmail(user, pass).sendMail({
      from,
      to,
      replyTo: { name: values.name, address: values.email },
      ...enquiry,
    });
  } catch (error) {
    console.error(`Contact form: Gmail refused the enquiry. ${describe(error)}`);
    return false;
  }
  try {
    await gmail(user, pass).sendMail({
      from,
      to: { name: values.name, address: values.email },
      replyTo: to,
      ...thankYouEmail(values),
    });
  } catch (error) {
    console.error(`Contact form: the enquiry arrived, but the thank-you to the visitor failed. ${describe(error)}`);
    return true;
  }
  console.info(`Contact form: sent the enquiry from ${values.email} to ${to}, and the thank-you to ${values.email}.`);
  return true;
}

/** Gmail's reason, without anything secret (nodemailer errors don't include the password). */
function describe(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const { code, responseCode, response } = error as Error & {
    code?: string;
    responseCode?: number;
    response?: string;
  };
  return [code, responseCode, response ?? error.message].filter(Boolean).join(" ").slice(0, 300);
}

export async function sendContact(_previous: ContactState, form: FormData): Promise<ContactState> {
  const values = readContact(form);
  // A field people never see: bots fill it in. Pretend it worked, send nothing.
  if (String(form.get("jh_trap") ?? "").trim()) {
    console.warn(`Contact form: not sent, the hidden bot trap was filled in (from ${values.email || "no email"}).`);
    return { status: "sent" };
  }

  const errors = checkContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors, values };

  // The address looks right; does its domain really take email? (Skipped in the
  // browser tests, which use made-up addresses and must not depend on the network.)
  if (process.env.CONTACT_DRY_RUN !== "true" && !(await emailDomainAccepts(values.email))) {
    const domain = values.email.slice(values.email.lastIndexOf("@") + 1);
    return {
      status: "invalid",
      errors: { email: `We couldn't find "${domain}". Please check the email address for typos.` },
      values,
    };
  }

  const requestHeaders = await headers();
  const visitor =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (!allowed(visitor))
    return {
      status: "error",
      message: `You've sent several messages just now. Please try again in a few minutes, or email us at ${site.email}.`,
      values,
    };

  const page = String(form.get("page") ?? "").slice(0, 200);
  if (!(await deliver(values, page)))
    return {
      status: "error",
      message: `Sorry, we couldn't send your message just now. Please try again, or email us at ${site.email}.`,
      values,
    };
  return { status: "sent" };
}
