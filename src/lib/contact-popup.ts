/**
 * When the contact form opens by itself (phase J3): once per visit, 30
 * seconds after arriving, and only if the visitor hasn't already opened the
 * form themselves or sent a message.
 */
export const POPUP_DELAY_MS = 30_000;

/** Whether the timer should open the form now. */
export function shouldPopUp({ open, sent, seen }: { open: boolean; sent: boolean; seen: boolean }): boolean {
  return !open && !sent && !seen;
}
