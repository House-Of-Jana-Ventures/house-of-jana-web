/**
 * Makes calm copies of the site's circle photos (phase J3).
 *
 * The original photos are round pictures on a square of strong blue. For the
 * new, simpler design:
 *
 * - quality/handcrafted.webp → quality/handcrafted-round.webp: the corners
 *   made see-through, so the round photo sits cleanly on the navy band
 *
 * The originals are kept. Run again after replacing a photo:
 *   node scripts/clean-photos.mjs
 */
import { join } from "node:path";
import sharp from "sharp";

const IMAGES = join(import.meta.dirname, "..", "public", "images");

/** The circle drawn slightly inside the edge, so the blue fringe goes too. */
const INSET = 0.985;

/** An SVG of a white circle, as a mask. */
function circleSvg(size) {
  const c = size / 2;
  const r = c * INSET;
  const d = `M ${c - r},${c} a ${r},${r} 0 1,0 ${2 * r},0 a ${r},${r} 0 1,0 ${-2 * r},0 z`;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><path fill="#fff" fill-rule="evenodd" d="${d}"/></svg>`,
  );
}

async function squareSize(file) {
  const { width, height } = await sharp(file).metadata();
  if (width !== height) throw new Error(`${file} is ${width}x${height}, expected a square`);
  return width;
}

/** Blue corners → see-through. */
async function round(src, dest) {
  const size = await squareSize(src);
  await sharp(src)
    .ensureAlpha()
    .composite([{ input: circleSvg(size), blend: "dest-in" }])
    .webp({ quality: 82 })
    .toFile(dest);
  console.log("round:", dest);
}

await round(join(IMAGES, "quality", "handcrafted.webp"), join(IMAGES, "quality", "handcrafted-round.webp"));
