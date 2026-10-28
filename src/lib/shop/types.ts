/** Shapes of the Jana API's public catalogue answers (see its /api/docs). */

export interface Option {
  name: string;
  values: string[];
}

export interface PriceRange {
  min: string;
  max: string;
}

export interface Prices {
  single: PriceRange;
  bulk: PriceRange;
}

export interface ImageUrls {
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}

export interface MenuProduct {
  name: string;
  slug: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
  products: MenuProduct[];
  children: MenuCategory[];
}

export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  image: ImageUrls | null;
  imageAlt: string | null;
  unitLabel: string;
  /** From this many pieces of the product (all variants together), the bulk price. */
  bulkMinQty: number;
  prices: Prices;
  available: boolean;
}

export interface ShopVariant {
  id: string;
  sku: string;
  options: Record<string, string>;
  label: string;
  singlePrice: string;
  bulkPrice: string;
  stockMode: "IN_STOCK" | "MADE_TO_ORDER";
  leadTimeDays: number | null;
  available: boolean;
  maxQuantity: number | null;
}

export interface ShopImage {
  id: string;
  urls: ImageUrls;
  altText: string | null;
  variantId: string | null;
  isPrimary: boolean;
}

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  attributes: Record<string, string>;
  unitLabel: string;
  bulkMinQty: number;
  options: Option[];
  categories: { id: string; name: string; slug: string }[];
  images: ShopImage[];
  variants: ShopVariant[];
  prices: Prices;
  available: boolean;
}

export interface FilterOptions {
  options: Option[];
  bulkPrice: PriceRange | null;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
