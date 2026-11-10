import type { MenuCategory, MenuProduct } from "./types";

/**
 * Categories go three levels deep (category → sub-category →
 * sub-sub-category). Pure helpers over the shop's menu tree.
 */

/** The categories from the top down to the one with this slug, or null. */
export function categoryTrail(menu: MenuCategory[] | null, slug: string): MenuCategory[] | null {
  for (const category of menu ?? []) {
    if (category.slug === slug) return [category];
    const below = categoryTrail(category.children, slug);
    if (below) return [category, ...below];
  }
  return null;
}

/** The products of a category and everything below it, each once, in menu order. */
export function productsUnder(category: MenuCategory): MenuProduct[] {
  const seen = new Set<string>();
  const out: MenuProduct[] = [];
  const walk = (node: MenuCategory) => {
    for (const product of node.products) {
      if (seen.has(product.slug)) continue;
      seen.add(product.slug);
      out.push(product);
    }
    node.children.forEach(walk);
  };
  walk(category);
  return out;
}
