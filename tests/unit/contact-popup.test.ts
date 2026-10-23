import { describe, expect, it } from "vitest";
import { HOME_LANDING_DELAY_MS, POPUP_DELAY_MS, popupDelay, shouldPopUp } from "@/lib/contact-popup";

describe("the contact form popping up by itself", () => {
  it("waits 15 seconds elsewhere", () => {
    expect(POPUP_DELAY_MS).toBe(15_000);
  });

  it("opens at once on landing on the home page, the first time only", () => {
    expect(HOME_LANDING_DELAY_MS).toBe(1_000);
    expect(popupDelay({ landedOn: "/", openedBefore: false })).toBe(HOME_LANDING_DELAY_MS);
    expect(popupDelay({ landedOn: "/", openedBefore: true })).toBe(POPUP_DELAY_MS);
    expect(popupDelay({ landedOn: "/about", openedBefore: false })).toBe(POPUP_DELAY_MS);
  });

  it("pops up only while closed, and never after a message is sent", () => {
    expect(shouldPopUp({ open: false, sent: false })).toBe(true);
    expect(shouldPopUp({ open: true, sent: false })).toBe(false);
    expect(shouldPopUp({ open: false, sent: true })).toBe(false);
  });
});
