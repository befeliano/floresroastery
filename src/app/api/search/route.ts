import { NextResponse, type NextRequest } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import { GUIDES } from "@/content/seo/guides";
import { isLocale, type Locale } from "@/i18n/config";
import { localizeProduct } from "@/i18n/content";
import { fromPrice, getProducts, isSoldOut } from "@/lib/commerce";

/**
 * Site içi arama verisi — arama penceresi açılınca bir kez çekilir (sayfalara gömülmez).
 * Kahveler (ad, köken, tat notaları, işleme), rehber yazıları (yalnızca Türkçe) ve sabit sayfalar.
 */
export type SearchItem = {
  type: "coffee" | "guide" | "page";
  title: string;
  sub: string;
  href: string;
  image?: string;
  bg?: string;
  price?: number | null;
  soldOut?: boolean;
  /** aranan metin (küçük harf / sadeleştirme istemcide) */
  text: string;
};

type L = { tr: string; en: string; id: string };
const PAGES: { href: string; title: L; keywords: string }[] = [
  { href: "/kahveler", title: { tr: "Tüm kahveler", en: "All coffees", id: "Semua kopi" }, keywords: "kahve coffee kopi çekirdek beans biji shop mağaza" },
  { href: "/demleme-rehberi", title: { tr: "Demleme rehberi", en: "Brew guide", id: "Panduan seduh" }, keywords: "v60 chemex french press espresso zamanlayıcı timer oran ratio öğütme grind değirmen grinder günlük log" },
  { href: "/coffee-bar", title: { tr: "Coffee Bar — tadım randevusu ve menü", en: "Coffee Bar — tasting booking & menu", id: "Coffee Bar — reservasi & menu" }, keywords: "randevu booking tadım tasting menü menu brew bar kopi susu tubruk espresso americano" },
  { href: "/toptan", title: { tr: "Toptan satış", en: "Wholesale", id: "Grosir" }, keywords: "b2b kafe cafe ofis office restoran kg toptan wholesale fiyat price" },
  { href: "/kahve-bulucu", title: { tr: "Kahve bulucu testi", en: "Coffee finder quiz", id: "Kuis pencari kopi" }, keywords: "test quiz öneri recommend hangi kahve" },
  { href: "/karsilastir", title: { tr: "Kahveleri karşılaştır", en: "Compare coffees", id: "Bandingkan kopi" }, keywords: "karşılaştırma compare" },
  { href: "/tat-carki", title: { tr: "Tat çarkı", en: "Flavour wheel", id: "Roda rasa" }, keywords: "tat notası flavor wheel meyvemsi çikolata çiçeksi" },
  { href: "/koken-haritasi", title: { tr: "Köken haritası", en: "Origin map", id: "Peta asal" }, keywords: "harita map endonezya etiyopya kolombiya köken origin" },
  { href: "/hikayemiz", title: { tr: "Hikayemiz", en: "Our story", id: "Kisah kami" }, keywords: "hakkımızda about flores kavurma roastery" },
  { href: "/iletisim", title: { tr: "İletişim", en: "Contact", id: "Kontak" }, keywords: "adres telefon whatsapp e-posta email contact" },
  { href: "/siparis-takip", title: { tr: "Sipariş takibi", en: "Order tracking", id: "Lacak pesanan" }, keywords: "kargo sipariş order tracking takip" },
  { href: "/iade-talebi", title: { tr: "İade talebi", en: "Return request", id: "Pengembalian" }, keywords: "iade return" },
  { href: "/teslimat-ve-iade-sartlari", title: { tr: "Teslimat ve iade şartları", en: "Delivery & returns", id: "Pengiriman & retur" }, keywords: "kargo ücret shipping teslimat delivery" },
];

async function searchIndex(locale: Locale): Promise<SearchItem[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  const products = (await getProducts()).filter((p) => p.slug !== "toptan-siparis");
  const coffees: SearchItem[] = products.map((raw) => {
    const p = localizeProduct(raw, locale);
    return {
      type: "coffee",
      title: p.fullName || p.name,
      sub: [p.subtitle, p.tastingNotes.slice(0, 3).map((n) => n.label).join(" · ")].filter(Boolean).join(" — "),
      href: `/kahveler/${p.slug}`,
      image: p.image.card,
      bg: p.image.bg,
      price: fromPrice(raw),
      soldOut: isSoldOut(raw),
      // Türkçe ve seçili dildeki notalar birlikte aranır (ör. "çikolata" EN sayfada da bulunsun)
      text: [p.name, p.fullName, p.subtitle, p.origin.country, p.origin.region, p.process, p.recommendedFor, raw.roastLevel, ...p.tastingNotes.map((n) => n.label), ...raw.tastingNotes.map((n) => n.label), ...p.categories].join(" "),
    };
  });
  const guides: SearchItem[] =
    locale === "tr" ? GUIDES.map((g) => ({ type: "guide", title: g.title, sub: g.description, href: `/rehber/${g.slug}`, image: g.image, text: `${g.title} ${g.description}` })) : [];
  const pages: SearchItem[] = PAGES.map((pg) => ({ type: "page", title: pg.title[locale], sub: "", href: pg.href, text: `${pg.title[locale]} ${pg.title.tr} ${pg.keywords}` }));
  return [...coffees, ...pages, ...guides];
}

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang");
  const locale: Locale = isLocale(lang) ? lang : "tr";
  return NextResponse.json({ items: await searchIndex(locale) }, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } });
}
