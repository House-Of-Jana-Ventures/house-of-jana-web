import { describe, expect, it } from "vitest";
import { enquiryEmail, escapeHtml, indiaTime, thankYouEmail } from "@/lib/contact-email";

const good = {
  name: "Mei Ling",
  email: "mei@example.com",
  phone: "+86 138 0013 8000",
  company: "Silk Hair Co.",
  message: "We'd like 50 kg of Virgin Remy single drawn hair.\nLength: 20 inch.",
};
const received = new Date("2026-10-09T10:35:00Z");

describe("the enquiry email to the business", () => {
  const email = enquiryEmail(good, "/products", received);

  it("names the sender in the subject", () => {
    expect(email.subject).toMatch(/^New enquiry from Mei Ling, Silk Hair Co\. \(9 October 2026(,| at) 4:05 pm IST\)$/);
  });

  it("has every detail, in HTML and plain text", () => {
    for (const value of ["Mei Ling", "mei@example.com", "+86 138 0013 8000", "Silk Hair Co.", "janahumanhair.com/products"]) {
      expect(email.html).toContain(value);
      expect(email.text).toContain(value);
    }
    expect(email.html).toContain("Length: 20 inch.");
    expect(email.html).toContain("single drawn hair.<br>Length");
    expect(email.html).toContain('href="tel:+8613800138000"');
    expect(email.html).toContain('href="mailto:mei@example.com?subject=');
    expect(email.text).toMatch(/Received: 9 October 2026(,| at) 4:05 pm IST/);
  });

  it("can't be broken or tricked by what visitors type", () => {
    const sneaky = enquiryEmail(
      { ...good, name: "Mei\r\nBcc: x@y.z <b>", message: '<script>alert("x")</script> please' },
      "",
      received,
    );
    expect(sneaky.subject).not.toMatch(/[\r\n]/);
    expect(sneaky.html).not.toContain("<script>");
    expect(sneaky.html).not.toContain("<b>");
    expect(sneaky.html).toContain("&lt;script&gt;");
  });
});

describe("the thank-you email to the visitor", () => {
  const email = thankYouEmail(good);

  it("thanks them by first name", () => {
    expect(email.subject).toBe("Thank you for contacting Jana Human Hair");
    expect(email.html).toContain("Thank you for contacting us, Mei!");
    expect(email.text).toContain("Thank you for contacting us, Mei Ling!");
  });

  it("includes a copy of what they sent and how to reach us", () => {
    for (const value of ["mei@example.com", "+86 138 0013 8000", "Silk Hair Co.", "Length: 20 inch.", "+91 80176 79521", "jweindia@gmail.com"]) {
      expect(email.text).toContain(value);
    }
    expect(email.html).toContain("What you sent us");
  });
});

describe("helpers", () => {
  it("escapes HTML", () => {
    expect(escapeHtml(`<a href="x">Tom & 'Jo'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jo&#39;&lt;/a&gt;");
  });
  it("shows Indian time", () => {
    expect(indiaTime(new Date("2026-01-01T00:00:00Z"))).toMatch(/^1 January 2026(,| at) 5:30 am IST$/);
  });
});
