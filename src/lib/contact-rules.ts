/**
 * The contact form's fields and checks, shared by the form (checks as people
 * type) and the server action (checks again before sending). Pure, so tested.
 */
export const CONTACT_FIELDS = [
  "name",
  "email",
  "phone",
  "company",
  "message",
] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const LIMITS: Record<ContactField, number> = {
  name: 100,
  email: 200,
  phone: 30,
  company: 150,
  message: 3000,
};

/** The part before the @: letters, digits and the symbols email allows; dots only between characters. */
const EMAIL_LOCAL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
/** One part of the domain: letters, digits and hyphens, not starting or ending with a hyphen. */
const DOMAIN_LABEL = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
/** The ending (.com, .in, the .uk of .co.uk): letters only, or an international one (xn--). */
const TLD = /^([a-z]{2,24}|xn--[a-z0-9-]{1,59})$/i;

/** Common slips in the big email providers' domains, and what people meant. */
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmali.com": "gmail.com",
  "gemail.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.in": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhoo.com": "yahoo.com",
  "yahoo.cm": "yahoo.com",
  "yahoo.co.on": "yahoo.co.in",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllook.com": "outlook.com",
  "otlook.com": "outlook.com",
  "iclod.com": "icloud.com",
  "icoud.com": "icloud.com",
  "redifmail.com": "rediffmail.com",
  "rediffmal.com": "rediffmail.com",
};
/** Endings that are always a slip for .com. */
const TLD_TYPOS: Record<string, string> = {
  con: "com",
  cmo: "com",
  comm: "com",
  ocm: "com",
  vom: "com",
  xom: "com",
  cpm: "com",
};

/** The address someone probably meant, if theirs has a well-known slip in it (gmial.com, .con). */
export function suggestEmail(value: string): string | undefined {
  const v = value.trim();
  const at = v.lastIndexOf("@");
  if (at < 1) return undefined;
  const local = v.slice(0, at);
  const domain = v.slice(at + 1).toLowerCase();
  if (DOMAIN_TYPOS[domain]) return `${local}@${DOMAIN_TYPOS[domain]}`;
  const dot = domain.lastIndexOf(".");
  const tld = domain.slice(dot + 1);
  if (dot > 0 && TLD_TYPOS[tld]) {
    // Fix the ending, then any slip in the name too (gmial.con → gmail.com).
    const fixed = `${local}@${domain.slice(0, dot)}.${TLD_TYPOS[tld]}`;
    return suggestEmail(fixed) ?? fixed;
  }
  return undefined;
}

/** What's wrong with an email address, in plain words; undefined if it looks right. */
function emailProblem(v: string): string | undefined {
  const example = "like name@company.com";
  if (/\s/.test(v)) return "Please remove the spaces from the email address.";
  const ats = v.split("@").length - 1;
  if (ats === 0) return `Please include an @ in the email address, ${example}.`;
  if (ats > 1) return `An email address has only one @, ${example}.`;
  const [local, domain] = v.split("@");
  if (!local) return `Please add the part before the @, ${example}.`;
  if (!domain) return `Please add the part after the @, ${example}.`;
  if (local.length > 64 || !EMAIL_LOCAL.test(local))
    return `Please check the part before the @ (letters, numbers, dots, - or _), ${example}.`;
  const labels = domain.split(".");
  if (labels.length < 2) return `The address is missing its ending, like .com or .in (name@${domain}.com).`;
  if (domain.length > 253 || labels.some((label) => !DOMAIN_LABEL.test(label)) || !TLD.test(labels.at(-1)!))
    return `Please check the part after the @, ${example}.`;
  const suggestion = suggestEmail(v);
  if (suggestion) return `Did you mean ${suggestion}?`;
  return undefined;
}
/** Digits, spaces, +, -, ( ), with 7–15 digits in all (international numbers). */
const PHONE = /^[+\d][\d\s()-]*$/;

export function emptyContact(): ContactValues {
  return { name: "", email: "", phone: "", company: "", message: "" };
}

/** Trimmed values from a form submission (anything else is ignored). */
export function readContact(form: FormData): ContactValues {
  const values = emptyContact();
  for (const field of CONTACT_FIELDS) {
    const raw = form.get(field);
    values[field] =
      typeof raw === "string" ? raw.trim().slice(0, LIMITS[field] + 1) : "";
  }
  return values;
}

/** One field's problem, or undefined. All five are required, as on the current site. */
export function checkField(
  field: ContactField,
  value: string,
): string | undefined {
  const v = value.trim();
  if (!v)
    return {
      name: "Please enter your name.",
      email: "Please enter your email address.",
      phone: "Please enter a phone number.",
      company: "Please enter your company's name.",
      message: "Please tell us how we can help.",
    }[field];
  if (v.length > LIMITS[field])
    return `Please keep this under ${LIMITS[field]} characters.`;
  if (field === "email") {
    const problem = emailProblem(v);
    if (problem) return problem;
  }
  if (field === "phone") {
    const digits = v.replace(/\D/g, "").length;
    if (!PHONE.test(v) || digits < 7 || digits > 15)
      return "Please enter a valid phone number, with the country code if outside India.";
  }
  if (field === "message" && v.length < 10)
    return "Please add a little more detail.";
  return undefined;
}

export function checkContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const problem = checkField(field, values[field]);
    if (problem) errors[field] = problem;
  }
  return errors;
}
