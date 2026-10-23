# Testing: Phase J2, fonts, motion and a contact form that doesn't block the page

Pairs with [`plan`](../plan/2026-10-23-phase-j2-fonts-motion-popup.md) and [`status`](../status/2026-10-23-phase-j2-fonts-motion-popup.md).

Check on a computer (Chrome or Edge) and a phone (or F12 → device toolbar).

## 0. Setup

In `Documents/house-of-jana-web`, run `npm run dev` and open http://localhost:3000.

- If the terminal shows a Next.js upgrade notice and stops, run it again.
- **Use a new private window for section C**, so the form hasn't been sent in this visit.

## A. Fonts

1. **Home, the big heading:**
   - **Expected:** a tall, elegant serif, with "to the world" in deep-blue italic.
2. **The small labels** above headings (e.g. "OUR HERITAGE"):
   - **Expected:** small spaced capitals in a clean, geometric font.
3. **Paragraphs and the form:**
   - **Expected:** a plain, easy-to-read sans-serif.
4. **Every section heading** has one or two words in blue italic (e.g. "Our *products*", "What our customers *say*").
   - **Expected:** no asterisks visible anywhere.
5. **Quotes:**
   - **Expected:** the CEO's quote, the testimonials and the About page mission are in italic serif.

## B. Motion

6. **Home hero:**
   - **Expected:** the background photo slowly moves closer over about 20 seconds.
7. **Under the hero:**
   - **Expected:** a navy strip of words moves slowly to the left, and stops while the mouse is over it.
8. **Scroll down:**
   - **Expected:** each section's small label appears, then its heading, then the short blue line draws itself.
   - **Expected:** photos settle in gently.
9. **Hover over a product card and a "Why businesses choose us" card:**
   - **Expected:** the card lifts, the photo circle turns slightly, and the icon box turns bright blue.
10. **Hover over a bright-blue button:**
    - **Expected:** a soft light sweeps across it.
11. **The round contact button:**
    - **Expected:** a soft ring pulses out from it every few seconds, until the form has been opened once.
12. **Reduced motion** (Windows: Settings → Accessibility → Visual effects → Animation effects off, then reload):
    - **Expected:** nothing moves, the strip of words stands still, and all content shows at once.

## C. The contact form (new private window)

13. **Open any page and wait.**
    - **Expected:** nothing at 10 seconds.
    - **Expected:** the form slides up at about 15 seconds, at the bottom right on a computer.
    - **Expected:** on Home too, it waits 15 seconds.
14. **While it's open, scroll the page with the mouse wheel or finger.**
    - **Expected:** the page scrolls normally and the form stays open.
15. **While it's open, click some text on the page.**
    - **Expected:** the form stays open.
16. **Type a name in the form, then click "About" in the menu.**
    - **Expected:** the About page opens, the form is still open, and the name is still there.
17. **While the form popped up by itself, type in the page or press Tab.**
    - **Expected:** the cursor didn't jump into the form.
18. **Press × (or Escape).**
    - **Expected:** it closes, then opens again about 15 seconds later.
19. **Send a message** (fill everything in correctly).
    - **Expected:** "Thank you!"; after closing, it doesn't pop up again in this visit.
20. **Phone:**
    - **Expected:** the form is a sheet from the bottom, about the lower 60% of the screen.
    - **Expected:** the page above it can be scrolled, and the form scrolls inside itself.
21. **Click a "Contact us" button.**
    - **Expected:** the form opens with the cursor in Name.

## D. Automated checks

22. Run `npm run check` and `npm run test:e2e`.
    - **Expected:** 23 and 18 pass.

## Results

| #     | Check              | Expected                                              | Result (Pass/Fail) | Notes |
| ----- | ------------------ | ----------------------------------------------------- | ------------------ | ----- |
| 1–5   | Fonts              | serif headings, italic highlights, labels, text       |                    |       |
| 6–12  | Motion             | zoom, strip, headings, cards, shine, ring, reduced    |                    |       |
| 13–21 | Contact form       | 15 s, page works behind it, focus, phone sheet        |                    |       |
| 22    | Automated checks   | 23 + 18                                               |                    |       |

QC sign-off: ____________________, ____ / ____ / ______
