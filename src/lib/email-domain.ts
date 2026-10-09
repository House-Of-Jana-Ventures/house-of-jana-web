/**
 * Checks, on the server, that an email address's domain exists and accepts
 * email (has mail servers, or at least an address, in DNS). Catches made-up
 * or mistyped domains (name@gmaill.co.in) before a message is sent.
 * If DNS can't be reached or is slow, it lets the address through: our own
 * network trouble should never stop a real customer from writing.
 */
import { promises as dns } from "node:dns";

export interface Resolver {
  resolveMx(domain: string): Promise<{ exchange: string; priority: number }[]>;
  resolve4(domain: string): Promise<string[]>;
}

const TIMEOUT_MS = 4_000;
/** Answers are remembered for an hour so repeat visitors don't wait. */
const CACHE_MS = 60 * 60 * 1000;
const cache = new Map<string, { ok: boolean; at: number }>();

/** "No such domain" or "no records of that kind", as opposed to a network problem. */
const missing = (error: unknown) =>
  ["ENOTFOUND", "ENODATA", "NXDOMAIN"].includes((error as { code?: string })?.code ?? "");

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error("DNS timeout"), { code: "ETIMEOUT" })), TIMEOUT_MS),
    ),
  ]);
}

async function lookUp(domain: string, resolver: Resolver): Promise<boolean> {
  try {
    const records = await withTimeout(resolver.resolveMx(domain));
    // A "null MX" (a single record pointing at ".") means the domain takes no email.
    return records.some((record) => record.exchange && record.exchange !== ".");
  } catch (error) {
    if (!missing(error)) return true;
  }
  // No mail servers listed: email still goes to the domain's own address, if it has one.
  try {
    return (await withTimeout(resolver.resolve4(domain))).length > 0;
  } catch (error) {
    return !missing(error);
  }
}

/** True if email to this address's domain can be delivered (or we couldn't tell). */
export async function emailDomainAccepts(email: string, resolver: Resolver = dns): Promise<boolean> {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  if (!domain) return false;
  const known = cache.get(domain);
  if (known && Date.now() - known.at < CACHE_MS) return known.ok;
  const ok = await lookUp(domain, resolver);
  cache.set(domain, { ok, at: Date.now() });
  return ok;
}
