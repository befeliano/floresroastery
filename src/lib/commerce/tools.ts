import "server-only";
import { localizeProduct, roastLabel } from "@/i18n/content";
import type { Locale } from "@/i18n/config";
import { fromPrice, getProducts, isSoldOut } from "./index";
import type { Product, RoastLevel } from "./types";

/**
 * Kahve araçları (bulucu testi, karşılaştırma, tat çarkı, köken haritası) için ortak veri.
 * Tat grupları ve köken anahtarları Türkçe ham veriden hesaplanır, metinler seçili dile çevrilir.
 */

export const FLAVOR_GROUPS = ["fruity", "citrus", "floral", "chocolate", "caramel", "nutty"] as const;
export type FlavorGroup = (typeof FLAVOR_GROUPS)[number];

const NOTE_GROUP: Record<string, FlavorGroup> = {
  "Kırmızı Meyveler": "fruity",
  "Yaban Mersini": "fruity",
  Böğürtlen: "fruity",
  Erik: "fruity",
  Şeftali: "fruity",
  "Sarı Elma": "fruity",
  Karpuz: "fruity",
  "Bal Kavunu": "fruity",
  "Orman Meyveleri": "fruity",
  Ahududu: "fruity",
  "Beyaz Üzüm": "fruity",
  "Altın Kuru Üzüm": "fruity",
  "Misket Limonu": "citrus",
  "Kan Portakalı": "citrus",
  Bergamot: "citrus",
  "Portakal Kabuğu": "citrus",
  Çiçeksi: "floral",
  Nane: "floral",
  Kakao: "chocolate",
  Çikolata: "chocolate",
  "Sütlü Çikolata": "chocolate",
  "Bitter Çikolata": "chocolate",
  "Kakao Nibs": "chocolate",
  Karamel: "caramel",
  "Esmer Şeker": "caramel",
  Fındık: "nutty",
  Badem: "nutty",
  "Kavrulmuş Kuruyemiş": "nutty",
  Baharat: "nutty",
  Tarçın: "nutty",
};

/** WordPress'ten gelen bilinmeyen notalar için anahtar kelime yedeği */
function groupOf(label: string): FlavorGroup | undefined {
  if (NOTE_GROUP[label]) return NOTE_GROUP[label];
  const s = label.toLocaleLowerCase("tr-TR");
  if (/limon|portakal|greyfurt|mandalina|bergamot|narenciye/.test(s)) return "citrus";
  if (/çiçek|yasemin|gül|nane|lavanta/.test(s)) return "floral";
  if (/çikolata|kakao/.test(s)) return "chocolate";
  if (/karamel|şeker|bal\b|melas|şurup/.test(s)) return "caramel";
  if (/fındık|badem|ceviz|kuruyemiş|baharat|tarçın|karanfil/.test(s)) return "nutty";
  if (/meyve|üzüm|elma|şeftali|erik|kiraz|çilek|ahududu|mersin|karpuz|kavun|vişne/.test(s)) return "fruity";
  return undefined;
}

/** Köken ülkeleri (Türkçe anahtar) → harita koordinatı */
export const ORIGINS: Record<string, { lat: number; lon: number }> = {
  Endonezya: { lat: -7.2, lon: 107.9 },
  Etiyopya: { lat: 6.5, lon: 38.5 },
  Kolombiya: { lat: 4.5, lon: -75.7 },
  "El Salvador": { lat: 13.9, lon: -89.6 },
  Meksika: { lat: 15.7, lon: -92.6 },
};

export type ToolCoffee = {
  slug: string;
  name: string;
  fullName: string;
  subtitle: string;
  /** Türkçe ülke anahtarları (harmanlarda birden fazla) */
  originKeys: string[];
  country: string;
  region: string;
  process: string;
  roast: RoastLevel;
  roastLabel: string;
  notes: { label: string; color: string; group?: FlavorGroup }[];
  groups: FlavorGroup[];
  sensory?: { body: number; acidity: number; sweetness: number };
  recommendedFor: string;
  categories: Product["categories"];
  price: number | null;
  image: string;
  bg: string;
  inStock: boolean;
  bestseller: boolean;
  /** hangi demleme yöntemine yatkın (test puanlaması için) */
  fit: { filter: boolean; espresso: boolean; turkish: boolean; immersion: boolean };
  /** anaerobik / uzatılmış fermantasyon gibi deneysel işleme */
  experimental: boolean;
};

const BEANS = new Set(["single-origin", "blends", "espresso"]);

export async function getToolCoffees(locale: Locale): Promise<ToolCoffee[]> {
  const products = (await getProducts()).filter((p) => !p.auto && p.categories.some((c) => BEANS.has(c)));
  return products
    .map((raw) => {
      const p = localizeProduct(raw, locale);
      const notes = raw.tastingNotes.map((n, i) => ({ label: p.tastingNotes[i]?.label ?? n.label, color: n.color, group: groupOf(n.label) }));
      return {
        slug: raw.slug,
        name: p.name,
        fullName: p.fullName,
        subtitle: p.subtitle,
        originKeys: raw.origin.country.split("×").map((s) => s.trim()).filter((c) => ORIGINS[c]),
        country: p.origin.country,
        region: p.origin.region,
        process: p.process,
        roast: raw.roastLevel,
        roastLabel: roastLabel(raw.roastLevel, locale),
        notes,
        groups: [...new Set(notes.map((n) => n.group).filter((g): g is FlavorGroup => !!g))],
        sensory: raw.sensory,
        recommendedFor: p.recommendedFor,
        categories: raw.categories,
        price: fromPrice(raw),
        image: raw.image.card,
        bg: raw.image.bg,
        inStock: !isSoldOut(raw),
        bestseller: !!raw.bestseller,
        fit: {
          filter: raw.categories.includes("single-origin") || /filtre|v60|chemex|aeropress/i.test(raw.recommendedFor),
          espresso: raw.categories.includes("espresso") || /espresso/i.test(raw.recommendedFor),
          turkish: /türk|moka/i.test(raw.recommendedFor) || raw.roastLevel === "Orta-Koyu",
          immersion: /french|cold/i.test(raw.recommendedFor) || ((raw.roastLevel === "Orta" || raw.roastLevel === "Orta-Koyu") && (raw.sensory?.body ?? 0) >= 4),
        },
        experimental: /anaerob|fermant|saccharomyces|lactobacillus|watermelon|extended/i.test(raw.process),
      };
    })
    .sort((a, b) => Number(b.inStock) - Number(a.inStock));
}
