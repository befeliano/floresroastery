import type { MetadataRoute } from "next";
import { legalDocs } from "@/content/legal";
import { CITIES } from "@/content/seo/cities";
import { GUIDES } from "@/content/seo/guides";
import { localizePath, locales } from "@/i18n/config";
import { getCategories, getProducts, isSoldOut } from "@/lib/commerce";
import { absoluteUrl } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

/**
 * Katalogdan otomatik üretilen sitemap — ürün WordPress'te değişince "products"
 * önbelleği yenilenir, sitemap da güncellenir. Her sayfa üç dilde, hreflang eşleşmeleriyle;
 * şehir sayfaları ve rehber yazıları yalnızca Türkçe.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const multi = (path: string, priority: number, changeFrequency: Entry["changeFrequency"] = "weekly", images?: string[]): Entry[] => {
    const languages = Object.fromEntries(locales.map((l) => [l, absoluteUrl(localizePath(l, path))]));
    return locales.map((l) => ({
      url: absoluteUrl(localizePath(l, path)),
      changeFrequency,
      // Türkçe ana pazar: diğer diller bir kademe düşük öncelik
      priority: l === "tr" ? priority : Math.round(priority * 0.8 * 10) / 10,
      alternates: { languages },
      ...(images ? { images } : {}),
    }));
  };
  const trOnly = (path: string, priority: number, changeFrequency: Entry["changeFrequency"] = "monthly"): Entry => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });

  return [
    ...multi("/", 1, "daily"),
    ...multi("/kahveler", 0.9, "daily"),
    ...getCategories().flatMap((c) => multi(`/kategori/${c.slug}`, 0.8)),
    ...products.flatMap((p) => multi(`/kahveler/${p.slug}`, isSoldOut(p) ? 0.5 : 0.9, "weekly", [absoluteUrl(p.image.card)])),
    ...multi("/demleme-rehberi", 0.7, "monthly"),
    ...multi("/coffee-bar", 0.7, "weekly"),
    ...multi("/toptan", 0.7, "monthly"),
    ...multi("/hikayemiz", 0.6, "monthly"),
    ...multi("/iletisim", 0.5, "yearly"),
    trOnly("/rehber", 0.7, "weekly"),
    ...GUIDES.map((g) => trOnly(`/rehber/${g.slug}`, 0.7)),
    ...CITIES.map((c) => trOnly(`/kahve/${c.slug}`, 0.8, "weekly")),
    trOnly("/siparis-takip", 0.3, "yearly"),
    trOnly("/iade-talebi", 0.3, "yearly"),
    ...legalDocs.map((d) => trOnly(`/${d.slug}`, 0.2, "yearly")),
  ];
}
