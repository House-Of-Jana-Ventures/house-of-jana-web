# Plan: Phase J2, fonts, motion and a contact form that doesn't block the page

**Status: Approved (2026-10-23), built the same day (see status)** with the "Elegant salon" fonts (Cormorant Garamond headings and italic highlights, Jost labels, Manrope text) and 15 seconds on every page, Home included.

## Context

**What the owner asked for** (2026-10-23):

- **different font styles,** so the site looks more attractive
- **more simple motions** across the site
- **the contact form pops up every 15 seconds**
- **while the form is open, the page behind it still scrolls and works.** The form stays open while the visitor reads, scrolls and clicks around.

**How the site works today** (phase J1):

- **Fonts:** two. Playfair Display for headings and Geist for everything else, so labels, buttons, numbers and quotes all look alike.
- **Motion:**
  - the hero title blurs in word by word
  - sections fade up as they scroll into view
  - numbers count up
  - cards lift on hover
  - the testimonials carousel moves gently
- **The form:** a modal dialog. It dims the page, locks scrolling and blocks clicks until it's closed. It opens by itself:
  - 1 second after landing on Home
  - 10 seconds after arriving on any other page
  - again 10 seconds after each close, until a message is sent

## Scope

### J2.1 Fonts: one family per job

**Four roles instead of two,** each with its own font (the choice is open question 1):

| Role | Where |
| ---- | ----- |
| **Display** | page and section headings |
| **Accent** | one or two highlighted words in the big headings (e.g. "From the heart of Midnapore *to the world*"), quotes, the "Purba Midnapore" card |
| **Labels** | small spaced capitals above headings, menu, buttons, the numbers |
| **Text** | paragraphs and the form |

- Loaded with `next/font/google`, so fonts are self-hosted, with no layout shift.
- Only the weights actually used.

### J2.2 Simple motions

All motions are short (0.3–0.8 s) and smooth, play once, and are switched off for visitors who ask their device for less motion.

- **Hero:** the background photo slowly zooms in (about 6% over 20 s).
- **A moving strip** under the hero, slowly scrolling: "Virgin Remy · Single drawn · Double drawn · Weft · Extensions · Wigs · Made in Midnapore". It pauses on hover.
- **Section headings:** the small blue line under each heading draws itself from left to right, and the label fades in a moment before the heading.
- **Cards** (products, why us): the photo circle turns slightly and the icon box fills blue on hover. Cards come in one after another.
- **Photos** (story, products, community gallery): they open up softly as they appear, with a gentle zoom from 105% to 100%.
- **Buttons:** a soft shine sweeps across the main buttons on hover, and the arrows nudge.
- **The round contact button:** a gentle "breathing" ring every few seconds until the form has been opened once.
- **Header:** the underline under the menu item slides to the item the mouse is over.

### J2.3 The contact form

**Timing:**

- The form opens by itself **15 seconds** after arriving on any page, and again 15 seconds after each time it's closed.
- It stops once a message is sent during the visit, as today.
- Home's 1-second opening: open question 2.

**The page keeps working behind it** (Base UI dialog `modal={false}`):

- no dimmed backdrop and no scroll lock
- links, buttons and scrolling work as normal
- clicking the page doesn't close the form; only × or Escape do
- typing in the form isn't lost while the visitor scrolls

**Size:**

- **Computers:** stays the small panel above the round button.
- **Phones:** a shorter sheet, at most about 70% of the screen, scrolling inside, so part of the page is always visible and can be scrolled.

**Accessibility:**

- When the form opens by itself, focus stays where the visitor was. It doesn't jump into the form, so it doesn't interrupt typing or reading.
- When it's opened by a button, focus goes to the first field, as today.
- Screen readers hear the dialog's name either way.

## Not in scope

- New content or pages.
- Colour changes. The light blue, bright blue and white stay.

## Testing

**Unit:** the popup timing rules (15 s, stops after sending).

**Browser (Playwright):**

- the form opens by itself after 15 s and again 15 s after closing (with a fake clock)
- while it's open, the page scrolls, and a link behind it works
- clicking the page doesn't close it
- Escape and × close it
- reduced motion: nothing moves
- all the J1 tests still pass, with the old 10 s and 1 s timings updated

**By eye:** screenshots at phone, tablet and computer widths.

**Docs:** `dev/status` and `dev/testing` for J2 when done.

## Open questions

1. **Which fonts?** Chosen: Elegant salon. Replaced later the same day by Glacial Indifference everywhere (see the status follow-up).
2. **Home page:** chosen: 15 s everywhere. Changed later the same day: at once on landing on Home (see the status follow-up).
