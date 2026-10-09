import { describe, expect, it } from "vitest";
import { emailDomainAccepts, type Resolver } from "@/lib/email-domain";

const fail = (code: string) => Promise.reject(Object.assign(new Error(code), { code }));

/** A pretend DNS: each domain's mail servers and address, or a DNS error code. */
function fakeDns(table: Record<string, { mx?: string[] | string; a?: string[] | string }>): Resolver {
  return {
    resolveMx: (d) => {
      const mx = table[d]?.mx ?? "ENOTFOUND";
      return typeof mx === "string" ? fail(mx) : Promise.resolve(mx.map((exchange) => ({ exchange, priority: 10 })));
    },
    resolve4: (d) => {
      const a = table[d]?.a ?? "ENOTFOUND";
      return typeof a === "string" ? fail(a) : Promise.resolve(a);
    },
  };
}

const dns = fakeDns({
  "gmail.test": { mx: ["gmail-smtp-in.l.google.com"] },
  "nomx.test": { mx: "ENODATA", a: ["93.184.216.34"] },
  "nomail.test": { mx: ["."], a: ["93.184.216.34"] },
  "down.test": { mx: "ESERVFAIL" },
  "empty.test": { mx: "ENODATA", a: "ENODATA" },
});

describe("does the email's domain take email?", () => {
  it("yes, when it lists mail servers", async () => {
    expect(await emailDomainAccepts("a@gmail.test", dns)).toBe(true);
  });
  it("yes, when it has no mail servers but has an address", async () => {
    expect(await emailDomainAccepts("a@nomx.test", dns)).toBe(true);
  });
  it("no, when the domain doesn't exist", async () => {
    expect(await emailDomainAccepts("a@madeup.test", dns)).toBe(false);
  });
  it("no, when it says it takes no email, or has nothing at all", async () => {
    expect(await emailDomainAccepts("a@nomail.test", dns)).toBe(false);
    expect(await emailDomainAccepts("a@empty.test", dns)).toBe(false);
  });
  it("lets it through when DNS itself is having trouble", async () => {
    expect(await emailDomainAccepts("a@down.test", dns)).toBe(true);
  });
});
