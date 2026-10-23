/**
 * When the contact form opens by itself: a moment after landing on (or
 * reloading) the home page, 15 seconds after arriving on any other page, and
 * again 15 seconds after each time it's closed, until the visitor sends a
 * message during the visit.
 */
export const POPUP_DELAY_MS = 15_000;
/** Landing on the home page: just long enough for the page to appear first. */
export const HOME_LANDING_DELAY_MS = 1_000;

/** How long to wait before the timer opens the form. */
export function popupDelay({ landedOn, openedBefore }: { landedOn: string; openedBefore: boolean }): number {
  return landedOn === "/" && !openedBefore ? HOME_LANDING_DELAY_MS : POPUP_DELAY_MS;
}

/** Whether the timer should open the form now. */
export function shouldPopUp({ open, sent }: { open: boolean; sent: boolean }): boolean {
  return !open && !sent;
}
