# Status: Phase J2, fonts, motion and a contact form that doesn't block the page

Pairs with [`plan`](../plan/2026-10-23-phase-j2-fonts-motion-popup.md) and [`testing`](../testing/2026-10-23-phase-j2-fonts-motion-popup.md).

**Status: Built (2026-10-23), waiting for review.** Not committed.

## What was built

### J2.1 Fonts (the "Elegant salon" set)

`src/app/layout.tsx` loads three typefaces with `next/font/google`, self-hosted:

| Font | Role | Where |
| ---- | ---- | ----- |
| **Cormorant Garamond** | display | headings |
| **Cormorant Garamond Italic** | accent | highlighted words, quotes, the product numbers |
| **Jost** | labels | small spaced capitals, menus, buttons, form labels, footer headings |
| **Manrope** | text | paragraphs and the form fields |

**Highlighted words:**

- A title marks them with asterisks, e.g. `"Our *products*"`. They show in deep-blue italic, through the `accent` style.
- They're drawn by `src/components/site/titled.tsx`, or by BlurText in the hero.
- The asterisks are never shown or read aloud, so headings keep their plain names (e.g. "Our products").
- Used on all the page and section titles, and on "human hair" in the closing invitation.

**Supporting changes:**

- **New styles in `globals.css`:**
  - `eyebrow` for the small labels (replaces five copies of the same classes)
  - `accent` for highlighted words
  - `shine` for buttons
- **Sizes:** headings are a size larger, because Cormorant is light. Numbers use lining figures.
- **The hero** was tightened so the whole panel, numbers included, fits a 1280×720 laptop screen.

### J2.2 Simple motions

All motions are off for visitors whose device asks for reduced motion.

| Motion | Where |
| ------ | ----- |
| **Slow zoom** of the background photo (7% over 24 s) | Home hero and page banners |
| **Moving word strip** (Virgin Remy · Single drawn · … · Exported to 4 continents), 40 s loop, pauses on hover; stands still and wraps for reduced motion | Under the home hero, `src/components/home/marquee.tsx` |
| **Headings in order:** label, then heading, then the blue line draws itself (`DrawLine`) | Every section heading |
| **Photos settle in** from slightly smaller (`Reveal zoom`) | Story, team, product and gallery photos |
| **Card hovers:** lift; photo circle turns a little; icon box turns bright blue and tilts | Products, why us, what we do |
| **Gallery hover:** a slow zoom with a slight turn | Community photos |
| **Button shine:** a soft light sweeps across | All bright-blue buttons |
| **Breathing ring** around the round contact button, until the form has been seen once | Every page |

Kept from J1:

- the hero title appearing word by word
- the count-up numbers
- the testimonial cross-fade
- the menu underline

### J2.3 The contact form

**Timing:**

- The form opens by itself **15 seconds** after arriving, on every page including Home. The 1-second Home opening is gone.
- It opens again 15 seconds after each close, until a message is sent during the visit.
- The rule lives in `src/lib/contact-popup.ts`.

**The page keeps working behind it:**

- **How:** Base UI dialog with `modal={false}` and `disablePointerDismissal`. `DialogContent` gained an `overlay` prop to drop the dimmed backdrop.
- **What the visitor gets:**
  - the page scrolls
  - links and buttons work
  - clicking the page doesn't close the form
  - going to another page keeps the form open, with what was typed
  - × or Escape close it

**Focus:**

- When the timer opens the form, focus isn't moved, so typing or reading isn't interrupted.
- When the visitor opens it, focus goes into the form as before.
- The context records who opened it (`openedBy`).

**Phones:** the sheet is at most 62% of the screen tall and scrolls inside, so the page above stays visible and scrollable.

## Deviations from the plan

- **Menu underline:** the plan said it would "slide to the hovered item". It was left as each item's own underline growing from the left, which already exists and reads the same.
- **The phone sheet** is 62% tall instead of the planned ~70%, which leaves more of the page in view.
- **Next.js upgrade notice:** `next dev` and `next build` now stop once to show a "security upgrade recommended" notice for Next 16.4.0, and run on a retry. No upgrade was made; it's for the owner to decide.

## Verification

- **Checks:** `tsc --noEmit` and `eslint src tests` are clean.
- **Unit:** 23 pass, including the new `contact-popup.test.ts`.
- **Browser (Playwright, production build): 18 pass.**
  - New tests:
    - pops up at 15 s and again 15 s after closing
    - Home waits 15 s too
    - while open, the page scrolls, a page click doesn't close it, a menu link works, the typed name survives, focus isn't taken, and Escape closes it
    - the phone sheet is ≤ 63% tall and the page scrolls behind it
    - reduced motion stops the word strip
  - The old 10 s and 1 s tests were replaced.
  - The accessibility (axe) test still passes on every page.
- **By eye:** desktop and phone screenshots of all four pages, plus the open form on both.

## Follow-up (2026-10-23): one font, no word strip, Home opens the form on landing

Owner's changes after review (a glassmorphism look was tried and dropped at the owner's request):

### One font

**Glacial Indifference** everywhere:

- headings, labels, menus, buttons, text and the form
- replaces Cormorant Garamond, Jost and Manrope

How it's set up:

- **Files:** regular and bold, self-hosted with `next/font/local` from `src/app/fonts/` (SIL Open Font License, copied next to the files).
- **No italic cut:** highlighted words (`accent`) and quotes use the browser's slanted version of the regular.
- **Weights:** medium (500) shows as regular, and semibold (600) as bold.

### The moving word strip is gone

- **Removed:** `src/components/home/marquee.tsx` and its `jh-marquee` animation.
- **Test:** the reduced-motion test no longer checks it.

### The form on landing on Home

- **Timing:** it opens 1 second after landing on (or reloading) Home. Other pages wait 15 seconds, and it comes back 15 seconds after each close, as before.
- **Code:** the rule is `popupDelay` in `src/lib/contact-popup.ts`.
- **Unchanged:** the page still scrolls and works behind it.

**Checks:** 24 unit tests and 18 browser tests pass, including axe on every page.

### Plainer headings (owner's follow-up)

**Highlighted words are gone.** The blue italic words in titles ("*to the world*", "*products*", "human hair" in the invitation) now show as plain text.

- `Titled` and `BlurText` drop the asterisks that marked them.
- The `accent` style is removed.

**Headings are regular weight (not bold) and a size smaller:**

| Heading | Size |
| ------- | ---- |
| Home hero | 28px on phones, 48px on tablets, 52px on computers |
| Page banners | 36px, rising to 52px on wide screens |
| Section headings | 30px, rising to 44px on wide screens |
| Card titles | 24px |
| Hero numbers | 36px on phones, 48px on larger screens |

**The hero title fits on two lines** at every width measured: 360, 390, 768, 1024, 1280, 1366 and 1920 px. The whole hero panel also fits on a 1280×720 screen.

## Follow-up 2 (2026-10-23): fonts and sizes back to J1

At the owner's request, the type is exactly as it was before J2:

- **Fonts:** Geist for text and Playfair Display for headings, as in the last commit. Glacial Indifference (`src/app/fonts/`) and `titled.tsx` are removed.
- **Sizes, weights and styles:** every heading, label, quote, number and button is back to its J1 size and weight, with no italics or spaced-label font. The `eyebrow` style and the heading/label base rules are gone. Titles no longer carry asterisks.
- **Kept from J2:** all the motions (photo zoom, headings in order with the drawing line, photos settling in, card hovers, button shine, breathing ring) and the contact-form behaviour (Home at once, 15 s elsewhere and after closing, page usable behind it).

**Checks:** tsc and eslint clean; 24 unit and 18 browser tests pass, including axe.
