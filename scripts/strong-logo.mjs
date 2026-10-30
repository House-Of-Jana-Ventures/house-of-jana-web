/**
 * Makes `public/images/logo-strong.png` from `logo.png`: the same logo with
 * its thin blue and grey lettering ("Jana", "Human", "Hair", the circle)
 * drawn deeper and a little more solid, so it reads clearly at header size.
 * The pink and orange of the hair symbol and the tagline stay as they are.
 *
 * Run again after replacing the logo:  node scripts/strong-logo.mjs
 */
import { join } from "node:path";
import sharp from "sharp";

const IMAGES = join(import.meta.dirname, "..", "public", "images");

const { data, info } = await sharp(join(IMAGES, "logo.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.from(data);
for (let i = 0; i < out.length; i += 4) {
  const [r, g, b] = [out[i], out[i + 1], out[i + 2]];
  // Blue, grey and black ink (not the warm pink/orange/red of the symbol and tagline).
  const cool = b >= r - 8;
  if (!cool) continue;
  out[i] = Math.round(r * 0.7);
  out[i + 1] = Math.round(g * 0.7);
  out[i + 2] = Math.round(b * 0.82);
  out[i + 3] = Math.min(255, Math.round(out[i + 3] * 1.4));
}
await sharp(out, { raw: info }).png().toFile(join(IMAGES, "logo-strong.png"));
console.log("logo-strong.png written");
