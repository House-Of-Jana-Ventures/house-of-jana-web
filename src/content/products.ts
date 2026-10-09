/** The product range, as on janahumanhair.com/products (2026-10-09). */
export interface Product {
  slug: string;
  name: string;
  /** Short line for cards on the home page. */
  short: string;
  description: string;
  points: [string, string, string];
  image: string;
}

export const products: Product[] = [
  {
    slug: "non-remy-double-drawn",
    name: "Non-Remy Double Drawn",
    short: "Thick and full from root to tip, at a friendly price.",
    description:
      "Non-Remy double drawn hair is collected from various sources and processed to align the strands. Shorter hairs are removed to give a thick, full look from root to tip.",
    points: [
      "A voluminous, uniform look with evenly cut strands.",
      "More affordable than Remy hair, with a dense and polished finish.",
      "Treated to reduce tangling and last longer.",
    ],
    image: "/images/products/non-remy-double-drawn.webp",
  },
  {
    slug: "virgin-remy-single-drawn",
    name: "Virgin Remy Single Drawn",
    short: "Single-donor hair with cuticles intact and aligned.",
    description:
      "Virgin Remy single drawn hair comes from a single donor, with every cuticle intact and running in one direction for a natural, tangle-free feel. The strands keep their varying lengths, for a natural taper.",
    points: [
      "Naturally tapered ends for a light, realistic look.",
      "Made for natural, effortless styles with an authentic texture.",
      "High quality at a fair price, for everyday use or large orders.",
    ],
    image: "/images/products/virgin-remy-single-drawn.webp",
  },
  {
    slug: "weft",
    name: "Weft",
    short: "Hair sewn or bonded into bands, ready for wigs and extensions.",
    description:
      "Wefts are made by sewing or bonding hair strands together in a band, which makes them easy to use for wigs and extensions.",
    points: [
      "Machine-wefted for durability, or hand-tied for a light, natural feel.",
      "Versatile: for sewing, gluing or clipping in.",
      "Available in many textures and colours.",
    ],
    image: "/images/products/weft.webp",
  },
  {
    slug: "extensions",
    name: "Extensions",
    short: "Natural human hair to add length, volume, or both.",
    description:
      "Extensions are add-ons made from natural human hair, to add length, volume, or both, to natural hair.",
    points: [
      "Clip-ins, tape-ins or sew-ins, for easy application.",
      "Instant length and volume for a custom look.",
      "Styling freedom without damaging natural hair.",
    ],
    image: "/images/products/extensions.webp",
  },
  {
    slug: "wigs",
    name: "Wigs",
    short: "Complete style transformations in natural human hair.",
    description:
      "Wigs are crafted from natural human hair and cover the entire head, for a complete change of style.",
    points: [
      "Available in many styles, lengths and textures.",
      "Protective styling that keeps natural hair safe while adding versatility.",
      "Natural-looking for everyday wear or special occasions.",
    ],
    image: "/images/products/wigs.webp",
  },
];

/** "Our commitment to quality" on the products page. */
export const quality = [
  {
    title: "Handcrafted excellence",
    text: "Skilled artisans craft each product with precision, for a personal, authentic feel.",
    image: "/images/quality/handcrafted.webp",
  },
  {
    title: "Tradition and beauty",
    text: "We blend timeless tradition with modern style, for elegant, lasting beauty.",
    image: "/images/quality/tradition.webp",
  },
  {
    title: "Custom fitting",
    text: "Our products are tailored for comfort, fitting like a made-to-measure garment.",
    image: "/images/quality/custom-fitting.webp",
  },
];
