import type { MetadataRoute } from "next";
import { legalDocs } from "@/content/legal";
import { getCategories, getProducts, isSoldOut } from "@/lib/commerce";
import { absoluteUrl } from "@/lib/site";

/**
 * Katalogdan otomatik üretilen sitemap — ürün eklendiğinde WooCommerce
 * webhook'u "products" önbelleğini yeniler, sitemap da güncellenir.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "daily"),
    page("/kahveler", 0.9, "daily"),
    ...getCategories().map((c) => page(`/kategori/${c.slug}`, 0.8)),
    ...products.map((p) => ({
      ...page(`/kahveler/${p.slug}`, isSoldOut(p) ? 0.5 : 0.9),
      images: [absoluteUrl(p.image.card)],
    })),
    page("/demleme-rehberi", 0.7, "monthly"),
    page("/coffee-bar", 0.7, "weekly"),
    page("/toptan", 0.7, "monthly"),
    page("/hikayemiz", 0.6, "monthly"),
    page("/iletisim", 0.5, "yearly"),
    page("/siparis-takip", 0.3, "yearly"),
    page("/iade-talebi", 0.3, "yearly"),
    ...legalDocs.map((d) => page(`/${d.slug}`, 0.2, "yearly")),
  ];
}
