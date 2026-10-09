# Testing: Phase J1, the Jana Human Hair website

Pairs with [`plan`](../plan/2026-10-09-phase-j1-website.md) and [`status`](../status/2026-10-09-phase-j1-website.md).

Check on a computer (Chrome or Edge) and a phone (or F12 → device toolbar).

## 0. Setup

In `Documents/house-of-jana-web`: `npm install`, then `npm run dev`, and open http://localhost:3000.

## A. Pages

1. **Home:**
   - **Expected:** the heading appears word by word, 50+ and 4 count up, and "Explore our products" and "Contact us" work.
   - **Expected:** sections fade in gently as you scroll.
2. **Home, testimonials:**
   - **Expected:** they change every few seconds, stop while the mouse is over them, and the arrows and dots work.
3. **About, Products, Community Initiatives:**
   - **Expected:** the text matches the old site (tidied), the photos load, and the menu highlights the current page.
4. **Products → Enquire about Weft.**
   - **Expected:** the form opens with "I'd like to know more about Weft." in the message.
5. **Community → tap a product photo.**
   - **Expected:** it opens large; the arrows and ← → move; Escape closes.

## B. The contact button and form

6. **The round blue button** at the bottom right of every page.
   - **Expected:** "Contact us" appears on hover, and a click opens the form above it.
7. **Press Send message with nothing filled in.**
   - **Expected:** a clear message under each field, and the cursor in Name.
8. **Type an email like "abc" and move on.** **Expected:** "Please enter a valid email address…".
9. **Fill everything correctly and send.**
   - **Expected:** "Thank you!".
   - In development the message appears in the terminal, unless `GMAIL_APP_PASSWORD` is set in `.env.local`. With it, two emails arrive: the enquiry in jweindia@gmail.com and the thank-you in the address you typed (use your own to check both).
10. **Escape, × and clicking outside** all close the form.
11. **Visit `/contact`.** **Expected:** the home page with the form open.

## C. Phone

12. **The menu (☰):** **Expected:** it slides out; tapping a page goes there.
13. **The contact form:** **Expected:** it opens as a sheet from the bottom, and the keyboard doesn't hide the fields as you type.
14. **Nothing scrolls sideways,** on any page.

## D. Comfort and access

15. **Reduced motion** (Windows: Settings → Accessibility → Visual effects → Animation effects off):
    - **Expected:** no animations, and everything shows at once.
16. **Keyboard:**
    - **Expected:** Tab moves through links and buttons with a visible outline.
    - **Expected:** the form keeps focus inside while open, and returns it to the button when closed.

## E. Automated checks

17. `npm run check` and `npm run test:e2e`. **Expected:** 7 and 10 pass.

## Results

| #     | Check                | Expected                                          | Result (Pass/Fail) | Notes |
| ----- | -------------------- | ------------------------------------------------- | ------------------ | ----- |
| 1–2   | Home                 | animations, counts, testimonials                  |                    |       |
| 3–5   | Other pages          | content, photos, enquire, gallery                 |                    |       |
| 6–11  | Contact form         | opens, checks, sends, closes, /contact            |                    |       |
| 12–14 | Phone                | menu, sheet, fits                                 |                    |       |
| 15–16 | Comfort and access   | reduced motion, keyboard                          |                    |       |
| 17    | Automated checks     | 7 + 10                                            |                    |       |

**Wording corrections** (page, section, what to change):

QC sign-off: ____________________, ____ / ____ / ______
