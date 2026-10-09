/**
 * The two emails a contact-form message sends: the enquiry to the business
 * inbox, and a thank-you (with a copy of what was sent) to the visitor.
 * In the site's colours: a bright-blue header, a white card on light blue.
 * Plain HTML tables with inline styles, so they look right in Gmail, Outlook
 * and phone mail apps; each also has a plain-text version. Pure, so tested.
 */
import { site, telHref } from "@/content/site";
import type { ContactValues } from "./contact-rules";

export type Email = { subject: string; html: string; text: string };

const C = {
  light: "#e9f1fa",
  bright: "#00abe4",
  white: "#ffffff",
  ink: "#0b2545",
  soft: "#5b6b80",
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

/** Makes visitor text safe to put in HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Line breaks and runs of spaces can't sneak into a subject line. */
const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

const paragraphs = (value: string) => escapeHtml(value).replace(/\r?\n/g, "<br>");

/** "9 October 2026 at 4:05 pm IST". */
export function indiaTime(date: Date): string {
  const formatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return `${formatted.replace(/\s?(am|pm)$/i, (m) => ` ${m.trim().toLowerCase()}`)} IST`;
}

const link = (href: string, label: string) =>
  `<a href="${href}" style="color:${C.ink};text-decoration:underline;text-decoration-color:${C.bright};">${label}</a>`;

/** Light-blue page, white card with a bright-blue header, and a short footer. */
function frame(preheader: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(site.name)}</title>
</head>
<body style="margin:0;padding:0;background:${C.light};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.light};">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.white};border-radius:18px;overflow:hidden;">
<tr><td align="center" style="background:${C.bright};padding:26px 24px;">
<div style="font-family:${SERIF};font-size:26px;font-weight:bold;letter-spacing:0.5px;color:${C.white};">${escapeHtml(site.name)}</div>
</td></tr>
<tr><td style="padding:32px 32px 8px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.ink};">
${body}
</td></tr>
<tr><td align="center" style="padding:24px 32px 30px;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.soft};">
${link(`mailto:${site.email}`, site.email)} &nbsp;·&nbsp; ${link(telHref(site.phones[0]), site.phones[0])}<br>
${escapeHtml(site.name)}, a unit of ${escapeHtml(site.legalName)}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Label/value rows in a light-blue box (values already HTML). */
function detailsBox(rows: [string, string][]): string {
  const cells = rows
    .map(
      ([label, value]) => `<tr>
<td style="padding:6px 12px 6px 0;font-family:${SANS};font-size:13px;color:${C.soft};width:96px;vertical-align:top;">${label}</td>
<td style="padding:6px 0;font-family:${SANS};font-size:15px;font-weight:bold;color:${C.ink};vertical-align:top;">${value}</td>
</tr>`,
    )
    .join("\n");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.light};border-radius:14px;margin:20px 0 0;">
<tr><td style="padding:16px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${cells}
</table></td></tr></table>`;
}

function messageBox(label: string, message: string): string {
  return `<div style="font-family:${SANS};font-size:13px;color:${C.soft};margin:22px 0 8px;">${label}</div>
<div style="border-left:4px solid ${C.bright};padding:4px 0 4px 16px;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.ink};">${paragraphs(message)}</div>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto 8px;"><tr>
<td align="center" style="background:${C.bright};border-radius:999px;">
<a href="${href}" style="display:inline-block;padding:13px 30px;font-family:${SANS};font-size:15px;font-weight:bold;color:${C.white};text-decoration:none;">${label}</a>
</td></tr></table>`;
}

const heading = (text: string) =>
  `<h1 style="margin:0 0 8px;font-family:${SERIF};font-size:25px;line-height:1.3;color:${C.ink};">${text}</h1>`;

/** To the business: everything the visitor typed, with a one-click reply. */
export function enquiryEmail(values: ContactValues, page: string, received: Date): Email {
  const name = escapeHtml(values.name);
  const email = escapeHtml(values.email);
  const when = indiaTime(received);
  const replySubject = encodeURIComponent(`Re: your enquiry to ${site.name}`);
  const body = `<div style="display:inline-block;background:${C.light};color:${C.ink};border-radius:999px;padding:4px 12px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">New enquiry</div>
${heading(`${name} wants to get in touch`)}
<p style="margin:0;color:${C.soft};">${when} · from ${escapeHtml(`${site.url.replace("https://", "")}${page || "/"}`)}</p>
${detailsBox([
  ["Name", name],
  ["Email", link(`mailto:${email}`, email)],
  ["Phone", link(escapeHtml(telHref(values.phone)), escapeHtml(values.phone))],
  ["Company", escapeHtml(values.company)],
])}
${messageBox("Message", values.message)}
${button(`mailto:${email}?subject=${replySubject}`, `Reply to ${name}`)}`;
  return {
    // The time keeps each enquiry its own conversation in Gmail (same subjects get grouped).
    subject: oneLine(`New enquiry from ${values.name}${values.company ? `, ${values.company}` : ""} (${when})`),
    html: frame(`${values.name} (${values.company}): ${oneLine(values.message).slice(0, 90)}`, body),
    text: [
      `New enquiry from ${values.name}`,
      "",
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Company: ${values.company}`,
      `Sent from: ${site.url}${page || "/"}`,
      `Received: ${when}`,
      "",
      "Message:",
      values.message,
    ].join("\n"),
  };
}

/** To the visitor: thank you, what happens next, and a copy of what they sent. */
export function thankYouEmail(values: ContactValues): Email {
  const firstName = escapeHtml(values.name.split(/\s+/)[0] || values.name);
  const body = `<div style="text-align:center;">
<div style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:50%;background:${C.light};color:${C.bright};font-size:28px;font-weight:bold;margin-bottom:14px;">&#10003;</div>
${heading(`Thank you for contacting us, ${firstName}!`)}
<p style="margin:0 auto;max-width:420px;">We've received your message, and our team will get back to you soon.</p>
</div>
<div style="font-family:${SANS};font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${C.ink};margin:28px 0 0;">What you sent us</div>
${detailsBox([
  ["Name", escapeHtml(values.name)],
  ["Email", escapeHtml(values.email)],
  ["Phone", escapeHtml(values.phone)],
  ["Company", escapeHtml(values.company)],
])}
${messageBox("Your message", values.message)}
<p style="margin:24px 0 0;">Need us sooner? Call ${link(telHref(site.phones[0]), site.phones[0])} or just reply to this email.</p>
<p style="margin:20px 0 0;">Warm regards,<br><strong>The ${escapeHtml(site.name)} team</strong></p>
${button(site.url, `Visit our website`)}`;
  return {
    subject: `Thank you for contacting ${site.name}`,
    html: frame("We've received your message and will get back to you soon.", body),
    text: [
      `Thank you for contacting us, ${values.name}!`,
      "",
      "We've received your message, and our team will get back to you soon.",
      "",
      "What you sent us:",
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Company: ${values.company}`,
      "",
      values.message,
      "",
      `Need us sooner? Call ${site.phones.join(" or ")}, or just reply to this email.`,
      "",
      "Warm regards,",
      `The ${site.name} team`,
      `${site.email} · ${site.url}`,
    ].join("\n"),
  };
}
