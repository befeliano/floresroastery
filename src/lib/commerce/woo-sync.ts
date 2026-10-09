import "server-only";
import { photos } from "@/lib/photos";
import { GRIND_OPTIONS } from "./grind";
import type { CategorySlug, Product, ProductVariant } from "./types";
import { getJson, wooBase } from "./woocommerce";

/**
 * WordPress (WooCommerce) → site senkronizasyonu — Store API (herkese açık, anahtar gerekmez)
 * ------------------------------------------------------------------------------------------
 * Bağır her şeyi WordPress'ten yönetir; site saatte bir ve ürün kaydedildiğinde anında
 * (docs/wordpress-snippet.php → /api/revalidate) güncellenir:
 *  - Katalogdaki (catalog.ts) ürünler: AD, FİYAT, İNDİRİM, STOK ve PAKET BOYLARI WordPress'ten;
 *    künye, hikâye, demleme gibi editoryal alanlar sitede kalır (ürün kimliğiyle eşlenir).
 *  - Katalogda olmayan her yayındaki ürün (yeni kahve, set, aksesuar) OTOMATİK eklenir:
 *    ad, açıklama, görseller, varyasyonlar ve fiyatlar WordPress'ten gelir.
 *  - Gizli ürünler (B2B 1735) vitrine çıkmaz.
 */

type StorePrices = { price: string; regular_price: string; currency_minor_unit: number };
type StoreAttribute = { name: string; terms?: { name: string }[] };
type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  type: string;
  sku: string;
  is_in_stock: boolean;
  is_purchasable: boolean;
  prices: StorePrices;
  description: string;
  short_description: string;
  images: { src: string; alt: string }[];
  categories: { slug: string; name: string }[];
  attributes: StoreAttribute[];
  variations: { id: number; attributes: { name: string; value: string }[] }[];
};
type StoreVariation = { id: number; sku: string; is_in_stock: boolean; prices: StorePrices };

/** Vitrine hiç çıkmayacak ürünler (B2B özel satış ürünü sipariş oluşturucuda kullanılır) */
const HIDDEN_IDS = new Set(["1735"]);

const money = (p: StorePrices, key: "price" | "regular_price") => Number(p[key]) / 10 ** p.currency_minor_unit;

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#8211": "–", "#8212": "—", "#8217": "’", "#8216": "‘", "#8220": "“", "#8221": "”", "#038": "&", "#8230": "…" };
export const decode = (s: string) =>
  s.replace(/&(#?\w+);/g, (m, e: string) => ENTITIES[e] ?? (e.startsWith("#") ? String.fromCharCode(Number(e.slice(1))) : m)).trim();

/** WordPress açıklama HTML'i → düz paragraflar (HTML siteye hiç basılmaz) */
export function htmlToParagraphs(html: string): string[] {
  return decode(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
      .replace(/<\/(p|h[1-6]|li|div)>|<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .split(/\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 1);
}

/** "100 Gram" → 100 g · "1 Kg" → 1 kg · "100 Gram x 4" → 4 × 100 g; diğer nitelikler aynen */
function variantLabel(raw: (string | null | undefined)[]): { label: string; weight: number } {
  let weight = 0;
  const values = raw.filter((v): v is string => typeof v === "string" && v.trim() !== "");
  const parts = values.map((v) => {
    const m = /^(\d+(?:[.,]\d+)?)\s*(gram|gr|g|kg|kilo)\b(?:\s*x\s*(\d+))?/i.exec(v.trim());
    if (!m) return v.trim();
    const n = Number(m[1].replace(",", "."));
    const kg = /^k/i.test(m[2]);
    const times = m[3] ? Number(m[3]) : 1;
    weight = (kg ? n * 1000 : n) * times;
    const unit = kg ? `${n} kg` : `${n} g`;
    return times > 1 ? `${times} × ${unit}` : unit;
  });
  return { label: parts.join(" · "), weight };
}

async function liveVariants(root: string, lp: StoreProduct, fresh: string): Promise<ProductVariant[]> {
  if (!lp.variations.length) {
    const price = money(lp.prices, "price");
    const regular = money(lp.prices, "regular_price");
    if (!(price > 0)) return [];
    const pkg = lp.attributes.find((a) => /package|paket/i.test(a.name))?.terms?.[0]?.name;
    const { label, weight } = variantLabel(pkg ? [pkg] : []);
    return [{ id: String(lp.id), sku: lp.sku, weight, label: label || "Standart", price, compareAtPrice: regular > price ? regular : undefined, inStock: lp.is_in_stock }];
  }
  const details = await Promise.all(lp.variations.map((v) => getJson<StoreVariation>(`${root}/products/${v.id}?${fresh}`).catch(() => null)));
  return lp.variations
    .map((v, i) => {
      const d = details[i];
      if (!d) return null;
      const price = money(d.prices, "price");
      const regular = money(d.prices, "regular_price");
      if (!(price > 0)) return null;
      const { label, weight } = variantLabel(v.attributes.map((a) => a.value));
      return { id: String(v.id), sku: d.sku || lp.sku, weight, label, price, compareAtPrice: regular > price ? regular : undefined, inStock: lp.is_in_stock && d.is_in_stock } as ProductVariant;
    })
    .filter((v): v is ProductVariant => v !== null)
    .sort((a, b) => a.weight - b.weight || a.price - b.price);
}

const hasGrind = (lp: StoreProduct) => lp.attributes.some((a) => /grind|öğütme/i.test(a.name));

function guessCategory(lp: StoreProduct): CategorySlug {
  const text = `${lp.name} ${lp.categories.map((c) => `${c.slug} ${c.name}`).join(" ")}`.toLocaleLowerCase("tr-TR");
  if (/\b(set|box|kutu|paket seti)\b/.test(text)) return "sets";
  if (/kılıf|kilif|kettle|aksesuar|ekipman|filtre kağıdı|dripper|değirmen/.test(text)) return "accessories";
  if (/blend|harman/.test(text)) return "blends";
  if (/espresso/.test(text)) return "espresso";
  return "single-origin";
}

/** Katalogda olmayan WordPress ürününden site ürünü */
function autoProduct(lp: StoreProduct, variants: ProductVariant[]): Product {
  const name = decode(lp.name);
  const paragraphs = htmlToParagraphs(lp.description);
  const short = htmlToParagraphs(lp.short_description)[0];
  const category = guessCategory(lp);
  const img = lp.images[0]?.src ?? (category === "accessories" ? photos.brewKit.src : photos.boxesNature.src);
  return {
    id: String(lp.id),
    slug: lp.slug,
    name,
    fullName: name,
    subtitle: decode(lp.categories[0]?.name ?? ""),
    categories: [category],
    headline: short,
    origin: { country: "", region: "" },
    elevation: "",
    process: "",
    variety: [],
    harvest: "",
    roastLevel: "Orta",
    recommendedFor: "",
    tastingNotes: [],
    description: (short ?? paragraphs[0] ?? name).slice(0, 300),
    story: paragraphs.slice(0, 12),
    image: { card: img, front: img, bg: "#1b1916", packaging: "photo", aspect: 1 },
    gallery: lp.images.slice(0, 6).map((i) => ({ src: i.src, alt: decode(i.alt || name) })),
    variants,
    grindOptions: hasGrind(lp) ? [...GRIND_OPTIONS] : [],
    brewGuides: {},
    auto: true,
  };
}

/** Katalog + WordPress'teki canlı veri → sitenin ürün listesi */
export async function syncWithWoo(catalog: Product[]): Promise<Product[]> {
  const root = `${wooBase()}/wp-json/wc/store/v1`;
  // WordPress'teki LiteSpeed Cache Store API cevaplarını önbelleğe alıyor (başlıkla atlanamıyor);
  // her senkronda farklı bir sorgu parametresi, kaydedilen fiyatın hemen okunmasını sağlar
  const fresh = `_fresh=${Date.now().toString(36)}`;
  const live = await getJson<StoreProduct[]>(`${root}/products?per_page=100&${fresh}`);
  const byId = new Map(live.map((p) => [String(p.id), p]));
  const known = new Set(catalog.map((p) => p.id));

  const curated = await Promise.all(
    catalog.map(async (product) => {
      const lp = byId.get(product.id);
      if (!lp) return product;
      // tek ürünün verisindeki sorun bütün kataloğu düşürmesin
      const variants = await liveVariants(root, lp, fresh).catch((e) => {
        console.error(`[woo-sync] ${product.slug} varyasyonları okunamadı:`, e);
        return [] as ProductVariant[];
      });
      return {
        ...product,
        // Türkçe tam ad WordPress'ten (Bağır adı değiştirirse sitede de değişir)
        fullName: decode(lp.name) || product.fullName,
        variants: variants.length ? variants : product.variants.map((v) => ({ ...v, inStock: v.inStock && lp.is_in_stock })),
        grindOptions: hasGrind(lp) || !lp.attributes.length ? product.grindOptions : [],
      };
    }),
  );

  const extra = await Promise.all(
    live
      .filter((lp) => !known.has(String(lp.id)) && !HIDDEN_IDS.has(String(lp.id)))
      .map(async (lp) => {
        try {
          const variants = await liveVariants(root, lp, fresh);
          return variants.length ? autoProduct(lp, variants) : null;
        } catch (e) {
          console.error(`[woo-sync] ${lp.slug} eklenemedi:`, e);
          return null;
        }
      }),
  );

  return [...curated, ...extra.filter((p): p is Product => p !== null)];
}
