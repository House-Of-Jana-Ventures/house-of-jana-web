import { describe, expect, it } from "vitest";
import {
  checkContact,
  checkField,
  emptyContact,
  readContact,
  suggestEmail,
} from "@/lib/contact-rules";
import { site, telHref } from "@/content/site";

const good = {
  name: "Mei Ling",
  email: "mei@example.com",
  phone: "+86 138 0013 8000",
  company: "Silk Hair Co.",
  message: "We'd like 50 kg of Virgin Remy single drawn hair, 20 inch.",
};

describe("the contact form's checks", () => {
  it("accepts a complete enquiry", () => {
    expect(checkContact(good)).toEqual({});
  });

  it("needs every field", () => {
    const errors = checkContact(emptyContact());
    expect(Object.keys(errors).sort()).toEqual(["company", "email", "message", "name", "phone"]);
    expect(errors.email).toBe("Please enter your email address.");
  });

  it("accepts real-looking email addresses", () => {
    for (const ok of [
      "a@b.co",
      "esha.kar20@gmail.com",
      "mei.ling+orders@silk-hair.co.uk",
      "o'neil@example.ie",
      "sales@janahumanhair.com",
      "buyer@mail.com",
      "x@xn--80ak6aa92e.com",
    ])
      expect(checkField("email", ok), ok).toBeUndefined();
  });

  it("explains what's wrong with an email address", () => {
    expect(checkField("email", "not-an-email")).toMatch(/include an @/);
    expect(checkField("email", "a@@b.com")).toMatch(/only one @/);
    expect(checkField("email", "@gmail.com")).toMatch(/before the @/);
    expect(checkField("email", "esha@")).toMatch(/after the @/);
    expect(checkField("email", "esha kar@gmail.com")).toMatch(/remove the spaces/);
    expect(checkField("email", "esha..kar@gmail.com")).toMatch(/part before the @/);
    expect(checkField("email", ".esha@gmail.com")).toMatch(/part before the @/);
    expect(checkField("email", "esha@gmail")).toMatch(/missing its ending.*esha@gmail.com|gmail\.com\)/);
    expect(checkField("email", "esha@gmail..com")).toMatch(/part after the @/);
    expect(checkField("email", "esha@-gmail.com")).toMatch(/part after the @/);
    expect(checkField("email", "esha@gmail.c")).toMatch(/part after the @/);
    expect(checkField("email", "esha@gmail.c0m")).toMatch(/part after the @/);
    expect(checkField("email", "esha@gm#ail.com")).toMatch(/part after the @/);
  });

  it("spots common typos and suggests the right address", () => {
    expect(checkField("email", "esha@gmial.com")).toBe("Did you mean esha@gmail.com?");
    expect(checkField("email", "esha@gmail.con")).toBe("Did you mean esha@gmail.com?");
    expect(checkField("email", "esha@GMIAL.CON")).toBe("Did you mean esha@gmail.com?");
    expect(checkField("email", "esha@yahooo.com")).toBe("Did you mean esha@yahoo.com?");
    expect(checkField("email", "sales@company.con")).toBe("Did you mean sales@company.com?");
    expect(suggestEmail("esha@gmail.com")).toBeUndefined();
    expect(suggestEmail("esha")).toBeUndefined();
  });

  it("checks phone formats", () => {
    expect(checkField("phone", "12345")).toMatch(/valid phone/);
    expect(checkField("phone", "call me")).toMatch(/valid phone/);
    expect(checkField("phone", "080176 79521")).toBeUndefined();
    expect(checkField("phone", "+1 (555) 010-9999")).toBeUndefined();
  });

  it("asks for a little detail and keeps fields within limits", () => {
    expect(checkField("message", "Hi")).toMatch(/more detail/);
    expect(checkField("name", "x".repeat(101))).toMatch(/under 100/);
  });

  it("reads and trims only the form's own fields", () => {
    const form = new FormData();
    form.set("name", "  Mei Ling ");
    form.set("email", "mei@example.com");
    form.set("extra", "ignored");
    expect(readContact(form)).toEqual({ ...emptyContact(), name: "Mei Ling", email: "mei@example.com" });
  });
});

describe("site details", () => {
  it("dials the phone numbers", () => {
    expect(site.phones.map(telHref)).toEqual(["tel:+918017679521", "tel:+918282906789"]);
  });
});
