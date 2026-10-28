import "server-only";
import { cacheLife } from "next/cache";
import type { FilterOptions, MenuCategory, Page, ProductCard, ShopProduct } from "./types";

/**
 * The shop's data, from the Jana API. Every read is cached for about a
 * minute, so changes made in the admin panel show within a minute, and the
 * site never waits on the API more than once a minute per page.
 *
 * When the API can't be reached, reads return `null` (or an empty menu):
 * the site keeps working and the shop shows a short "being updated" note.
 */
function apiBase(): string {
  return (process.env.API_URL ?? "http://localhost:4100/api/v1").replace(/\/+$/, "");
}

/** About a minute in every cache; kept up to an hour if the API is slow to answer. */
const SHOP_CACHE = { stale: 60, revalidate: 60, expire: 3600 } as const;

type Outcome<T> = { ok: true; data: T; meta?: { total: number; page: number; totalPages: number } } | { ok: false; status: number };

async function get<T>(path: string, query: Record<string, string | number | undefined> = {}): Promise<Outcome<T>> {
  const url = new URL(`${apiBase()}${path}`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8_000) });
    if (!res.ok) return { ok: false, status: res.status };
    const body = (await res.json()) as { data: T; meta?: { total: number; page: number; totalPages: number } };
    return { ok: true, data: body.data, meta: body.meta };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** The Products menu: categories with their products on sale; `null` when the API is down. */
export async function getMenu(): Promise<MenuCategory[] | null> {
  "use cache";
  cacheLife(SHOP_CACHE);
  const result = await get<MenuCategory[]>("/categories");
  return result.ok ? result.data : null;
}

export interface ShopRules {
  bulkMinQty: number;
  currency: string;
  gstRatePercent: number;
  india: { shippingFee: string; freeShippingThreshold: string; paymentWindowHours: number };
  abroad: { quoted: true; paymentWindowHours: number };
  payments: { online: boolean; bankTransfer: { enabled: boolean; details: string[] } };
}

/** The selling rules (also: whether the shop's data can be read right now, for the "being updated" note). */
export async function getShopRules(): Promise<ShopRules | null> {
  "use cache";
  cacheLife(SHOP_CACHE);
  const result = await get<ShopRules>("/shop/rules");
  return result.ok ? result.data : null;
}

export interface ListQuery {
  category?: string;
  /** "Texture:Curly;Length:18 in" */
  options?: string;
  available?: boolean;
  page?: number;
}

/** Product cards; `null` when the API is down. */
export async function getProducts(query: ListQuery): Promise<Page<ProductCard> | null> {
  "use cache";
  cacheLife(SHOP_CACHE);
  const result = await get<ProductCard[]>("/products", {
    category: query.category,
    options: query.options,
    available: query.available ? "true" : undefined,
    page: query.page,
    limit: 24,
  });
  if (!result.ok) return null;
  return {
    items: result.data,
    total: result.meta?.total ?? result.data.length,
    page: result.meta?.page ?? 1,
    totalPages: result.meta?.totalPages ?? 1,
  };
}

/** Filter choices for a category; `null` when the API is down. */
export async function getFilters(category: string): Promise<FilterOptions | null> {
  "use cache";
  cacheLife(SHOP_CACHE);
  const result = await get<FilterOptions>("/products/filters", { category });
  return result.ok ? result.data : null;
}

/** One product: the product, "missing" (404), or "unavailable" (API down). */
export async function getProduct(slug: string): Promise<ShopProduct | "missing" | "unavailable"> {
  "use cache";
  cacheLife(SHOP_CACHE);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return "missing";
  const result = await get<ShopProduct>(`/products/${slug}`);
  if (result.ok) return result.data;
  return result.status === 404 ? "missing" : "unavailable";
}

/** Finds a category (top level or inside one) in the menu. */
export function findCategory(menu: MenuCategory[] | null, slug: string): MenuCategory | null {
  for (const top of menu ?? []) {
    if (top.slug === slug) return top;
    const child = top.children.find((c) => c.slug === slug);
    if (child) return child;
  }
  return null;
}
