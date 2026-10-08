import { getCategories, getCategory, getProduct, getProducts, toCard, type Category, type Product } from "@/lib/commerce";
import { localizeCard, localizeCategory, localizeProduct } from "./content";
import { getLocale } from "./server";

/** Sayfalar için dile çevrilmiş katalog (API ve fiyatlandırma ham kataloğu kullanır) */
export async function catalogL() {
  const locale = await getLocale();
  return {
    locale,
    product: (p: Product) => localizeProduct(p, locale),
    card: (p: Product) => localizeCard(toCard(p), locale),
    category: (c: Category) => localizeCategory(c, locale),
    products: getProducts,
    getProduct,
    categories: () => getCategories().map((c) => localizeCategory(c, locale)),
    getCategory: (slug: string) => {
      const c = getCategory(slug);
      return c ? localizeCategory(c, locale) : undefined;
    },
  };
}
