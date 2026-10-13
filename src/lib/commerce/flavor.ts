/**
 * Kahve sınıflandırması — tat ailesi, işleme türü ve demleme uygunluğu.
 * Hem araç sayfaları (bulucu, tat çarkı) hem katalog filtreleri kullanır; Türkçe ham veriden hesaplanır.
 */
import type { Product } from "./types";

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

/** Tat notası → tat ailesi (WordPress'ten gelen bilinmeyen notalar için anahtar kelime yedeği) */
export function groupOf(label: string): FlavorGroup | undefined {
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

export const flavorGroups = (p: Pick<Product, "tastingNotes">): FlavorGroup[] => [
  ...new Set(p.tastingNotes.map((n) => groupOf(n.label)).filter((g): g is FlavorGroup => !!g)),
];

/** İşleme türü (katalog filtresi) */
export const PROCESS_KINDS = ["washed", "natural", "honey", "wetHulled", "experimental", "decaf"] as const;
export type ProcessKind = (typeof PROCESS_KINDS)[number];

export const isExperimental = (process: string) => /anaerob|fermant|saccharomyces|lactobacillus|watermelon|extended/i.test(process);

export function processKinds(process: string): ProcessKind[] {
  const s = process.toLocaleLowerCase("tr-TR");
  const out: ProcessKind[] = [];
  if (/wet hulled/.test(s)) out.push("wetHulled");
  else if (/washed|yıkan/.test(s)) out.push("washed");
  if (/natural|doğal/.test(s)) out.push("natural");
  if (/honey/.test(s)) out.push("honey");
  if (isExperimental(process)) out.push("experimental");
  if (/swiss water|decaf|kafeinsiz/.test(s)) out.push("decaf");
  return out;
}

/** Demleme yöntemine uygunluk */
export type MethodFit = { filter: boolean; espresso: boolean; turkish: boolean; immersion: boolean };

export function methodFit(p: Pick<Product, "categories" | "recommendedFor" | "roastLevel" | "sensory">): MethodFit {
  return {
    filter: p.categories.includes("single-origin") || /filtre|v60|chemex|aeropress/i.test(p.recommendedFor),
    espresso: p.categories.includes("espresso") || /espresso/i.test(p.recommendedFor),
    turkish: /türk|moka/i.test(p.recommendedFor) || p.roastLevel === "Orta-Koyu",
    immersion: /french|cold/i.test(p.recommendedFor) || ((p.roastLevel === "Orta" || p.roastLevel === "Orta-Koyu") && (p.sensory?.body ?? 0) >= 4),
  };
}
