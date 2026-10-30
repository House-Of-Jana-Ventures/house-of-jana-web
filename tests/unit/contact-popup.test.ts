import { describe, expect, it } from "vitest";
import { POPUP_DELAY_MS, shouldPopUp } from "@/lib/contact-popup";

describe("the contact form popping up by itself", () => {
  it("waits 30 seconds", () => {
    expect(POPUP_DELAY_MS).toBe(30_000);
  });

  it("pops up once per visit: only while closed, never seen and nothing sent", () => {
    expect(shouldPopUp({ open: false, sent: false, seen: false })).toBe(true);
    expect(shouldPopUp({ open: true, sent: false, seen: false })).toBe(false);
    expect(shouldPopUp({ open: false, sent: true, seen: false })).toBe(false);
    expect(shouldPopUp({ open: false, sent: false, seen: true })).toBe(false);
  });
});
