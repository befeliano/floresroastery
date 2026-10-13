import "server-only";
import { localizeProduct, roastLabel } from "@/i18n/content";
import type { Locale } from "@/i18n/config";
import { fromPrice, getProducts, isSoldOut } from "./index";
import { groupOf, isExperimental, methodFit, type FlavorGroup } from "./flavor";
import type { Product, RoastLevel } from "./types";

/**
 * Kahve araçları (bulucu testi, karşılaştırma, tat çarkı, köken haritası) için ortak veri.
 * Tat grupları ve köken anahtarları Türkçe ham veriden hesaplanır, metinler seçili dile çevrilir.
 */

export { FLAVOR_GROUPS, type FlavorGroup } from "./flavor";

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
        fit: methodFit(raw),
        experimental: isExperimental(raw.process),
      };
    })
    .sort((a, b) => Number(b.inStock) - Number(a.inStock));
}
