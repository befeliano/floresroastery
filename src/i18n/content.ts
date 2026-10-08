import type { BrewGuide, CardProduct, Category, Product } from "@/lib/commerce/types";
import type { Locale } from "./config";
import { CATEGORIES, PATTERNS, PHRASES, PRODUCTS } from "./messages/products";

/**
 * Katalog içeriğini dile çevirir. Türkçe kaynak olduğu gibi döner;
 * fiyat, stok, kimlik ve görseller hiçbir dilde değişmez.
 */

export function phrase(s: string, locale: Locale): string {
  if (locale === "tr" || !s) return s;
  const hit = PHRASES[s];
  if (hit) return hit[locale];
  for (const p of PATTERNS) if (p.re.test(s)) return s.replace(p.re, p[locale]);
  return s;
}

export function localizeBrew(g: BrewGuide | undefined, locale: Locale, tip?: string): BrewGuide | undefined {
  if (!g || locale === "tr") return g;
  return {
    ...g,
    device: phrase(g.device, locale),
    grind: phrase(g.grind, locale),
    tip: tip ?? (g.tip ? phrase(g.tip, locale) : undefined),
    steps: g.steps.map((s) => ({ ...s, title: phrase(s.title, locale), detail: s.detail ? phrase(s.detail, locale) : undefined })),
  };
}

export function localizeProduct(p: Product, locale: Locale): Product {
  if (locale === "tr") return p;
  const t = PRODUCTS[locale][p.slug];
  return {
    ...p,
    fullName: t?.fullName ?? p.fullName,
    subtitle: t?.subtitle ?? p.subtitle,
    headline: t?.headline ?? p.headline,
    bodyAcidity: t?.bodyAcidity ?? p.bodyAcidity,
    description: t?.description ?? p.description,
    story: t?.story ?? p.story,
    origin: { ...p.origin, country: phrase(p.origin.country, locale), region: phrase(p.origin.region, locale) },
    process: phrase(p.process, locale),
    variety: p.variety.map((v) => phrase(v, locale)),
    harvest: phrase(p.harvest, locale),
    recommendedFor: phrase(p.recommendedFor, locale),
    tastingNotes: p.tastingNotes.map((n) => ({ ...n, label: phrase(n.label, locale) })),
    facts: p.facts?.map((f) => ({ label: phrase(f.label, locale), value: phrase(f.value, locale) })),
    brewGuides: {
      filter: localizeBrew(p.brewGuides.filter, locale, t?.tips?.filter),
      espresso: localizeBrew(p.brewGuides.espresso, locale, t?.tips?.espresso),
    },
  };
}

export function localizeCard(c: CardProduct, locale: Locale): CardProduct {
  if (locale === "tr") return c;
  const t = PRODUCTS[locale][c.slug];
  return {
    ...c,
    fullName: t?.fullName ?? c.fullName,
    subtitle: t?.subtitle ?? c.subtitle,
    tastingNotes: c.tastingNotes.map((n) => ({ ...n, label: phrase(n.label, locale) })),
  };
}

export function localizeCategory(c: Category, locale: Locale): Category {
  if (locale === "tr") return c;
  const t = CATEGORIES[locale][c.slug];
  return t ? { ...c, ...t } : c;
}

/** Kavurma seviyesi etiketi (tür değeri Türkçe anahtar olarak kalır) */
export const roastLabel = (r: Product["roastLevel"], locale: Locale) => phrase(r, locale);
