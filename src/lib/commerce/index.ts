import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { categories, products as catalog } from "./catalog";
import { isSoldOut, type CategorySlug, type Product } from "./types";
import { isWooConfigured, syncWithWoo } from "./woocommerce";

export type * from "./types";
export { isSoldOut, primaryCategory, toCard } from "./types";

/**
 * Katalog verisi — tek giriş noktası.
 * WOOCOMMERCE_URL tanımlıysa fiyat/stok canlı WooCommerce'den güncellenir.
 * Sonuç "use cache" ile önbelleğe alınır; ürün değiştiğinde WooCommerce
 * webhook'u /api/revalidate'i çağırarak "products" etiketini yeniler.
 */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  if (isWooConfigured()) {
    try {
      return await syncWithWoo(catalog);
    } catch (err) {
      console.error("[commerce] WooCommerce okunamadı, yerel kataloğa düşülüyor:", err);
    }
  }
  return catalog;
}

/** Stokta olanlar önce, tükenenler sona */
const byAvailability = (a: Product, b: Product) => Number(isSoldOut(a)) - Number(isSoldOut(b));

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductsByCategory(slug: CategorySlug) {
  return (await getProducts()).filter((p) => p.categories.includes(slug)).sort(byAvailability);
}

export async function getFeaturedProducts() {
  return (await getProducts()).filter((p) => p.featured && !isSoldOut(p));
}

export async function getCollection(name: NonNullable<Product["collection"]>) {
  return (await getProducts()).filter((p) => p.collection === name);
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const all = (await getProducts()).filter((p) => p.slug !== product.slug && !isSoldOut(p));
  const shared = (p: Product) => p.categories.filter((c) => product.categories.includes(c)).length;
  return [...all].sort((a, b) => shared(b) - shared(a)).slice(0, limit);
}

export function getCategories() {
  return categories;
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export const fromPrice = (p: Product) => (p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : null);
