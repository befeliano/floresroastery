/**
 * Toptan sipariş oluşturucu — WordPress'teki gizli B2B ürünü (ID 1735) ile.
 * Fiyat HER ZAMAN sunucuda bu tablodan yeniden hesaplanır (priceCart); tarayıcıdaki
 * tutar yalnızca önizlemedir. Kademe: o çekirdekten alınan kg'nin düştüğü aralığın kg fiyatı.
 * Fiyatlar KDV dahil.
 *
 * TOPTAN FİYAT DEĞİŞİNCE YALNIZCA AŞAĞIDAKİ WHOLESALE_BEANS LİSTESİNİ DÜZENLEYİN:
 *  tiers: [[1, 1350], [5, 1250]] → "1 kg ve üzeri 1.350 ₺, 5 kg ve üzeri 1.250 ₺" (o çekirdekten alınan kg'ye göre)
 *  Sayfadaki fiyat tablosu ve sipariş oluşturucu buradan okur.
 */
export const WHOLESALE_PRODUCT_ID = "1735";
export const WHOLESALE_SLUG = "toptan-siparis";
export const WHOLESALE_MIN_KG = 5;
export const WHOLESALE_MAX_KG = 500;

export interface WholesaleBean {
  key: string;
  name: string;
  /** sayfada gösterilen ad (üç dil) */
  names: { tr: string; en: string; id: string };
  /** işleme yöntemi — boş bırakılırsa gösterilmez */
  process: string;
  tiers: [minKg: number, pricePerKg: number][];
}

export const WHOLESALE_BEANS: WholesaleBean[] = [
  { key: "mogiana", name: "Brezilya Mogiana", names: { tr: "Brezilya Mogiana", en: "Brazil Mogiana", id: "Brasil Mogiana" }, process: "Natural", tiers: [[1, 1350], [5, 1250], [10, 1200]] },
  { key: "sidamo", name: "Ethiopia Sidamo", names: { tr: "Etiyopya Sidamo", en: "Ethiopia Sidamo", id: "Etiopia Sidamo" }, process: "", tiers: [[1, 1100], [5, 1050], [10, 1000]] },
  { key: "arjuna", name: "Endonezya Arjuna", names: { tr: "Endonezya Arjuna", en: "Indonesia Arjuna", id: "Indonesia Arjuna" }, process: "Wet Hulled", tiers: [[1, 1350], [5, 1250], [10, 1200]] },
  { key: "guntur", name: "Endonezya Guntur", names: { tr: "Endonezya Guntur", en: "Indonesia Guntur", id: "Indonesia Guntur" }, process: "Honey", tiers: [[1, 1500], [5, 1400]] },
  { key: "decaf", name: "Meksika Decaf", names: { tr: "Meksika Decaf", en: "Mexico Decaf", id: "Meksiko Dekaf" }, process: "Swiss Water", tiers: [[1, 1500], [5, 1400]] },
  { key: "ochuspe", name: "El Salvador Ochuspe", names: { tr: "El Salvador Ochuspe", en: "El Salvador Ochuspe", id: "El Salvador Ochuspe" }, process: "Anaerobic Natural", tiers: [[1, 1450], [5, 1350]] },
  { key: "turk", name: "Türk Kahvesi", names: { tr: "Türk Kahvesi", en: "Turkish coffee", id: "Kopi Turki" }, process: "Natural", tiers: [[1, 850], [5, 800]] },
];

export const WHOLESALE_ROASTS = ["Filtre", "Espresso", "Omni (filtre + espresso)"] as const;
export const WHOLESALE_BAG_SIZES = ["1000 gr", "500 gr", "250 gr", "200 gr", "100 gr"] as const;
export const WHOLESALE_BAG_TYPES = ["Siyah doypack", "Beyaz doypack", "Kraft", "Renkli", "Siyah transparan"] as const;

export interface WholesaleConfig {
  beans: Record<string, number>;
  roast: string;
  grind: string;
  bagSize: string;
  bagType: string;
}

export interface WholesaleQuote {
  ok: boolean;
  error?: string;
  totalKg: number;
  total: number;
  lines: { key: string; name: string; kg: number; pricePerKg: number; total: number }[];
}

export const tierPrice = (bean: WholesaleBean, kg: number) => bean.tiers.reduce((p, [min, price]) => (kg >= min ? price : p), bean.tiers[0][1]);

/** Yapılandırmayı doğrular ve fiyatlar (istemci önizlemesi ve sunucu aynı fonksiyon) */
export function priceWholesale(raw: unknown, grindOptions: readonly string[]): WholesaleQuote {
  const fail = (error: string): WholesaleQuote => ({ ok: false, error, totalKg: 0, total: 0, lines: [] });
  if (!raw || typeof raw !== "object") return fail("Toptan sipariş bilgisi geçersiz.");
  const c = raw as Partial<WholesaleConfig>;
  if (!c.beans || typeof c.beans !== "object") return fail("Toptan sipariş bilgisi geçersiz.");
  if (!WHOLESALE_ROASTS.includes(c.roast as (typeof WHOLESALE_ROASTS)[number])) return fail("Kavurma seçimi geçersiz.");
  if (!WHOLESALE_BAG_SIZES.includes(c.bagSize as (typeof WHOLESALE_BAG_SIZES)[number])) return fail("Paket boyu geçersiz.");
  if (!WHOLESALE_BAG_TYPES.includes(c.bagType as (typeof WHOLESALE_BAG_TYPES)[number])) return fail("Ambalaj türü geçersiz.");
  if (typeof c.grind !== "string" || !grindOptions.includes(c.grind)) return fail("Öğütme seçimi geçersiz.");

  const lines: WholesaleQuote["lines"] = [];
  for (const [key, value] of Object.entries(c.beans)) {
    const bean = WHOLESALE_BEANS.find((b) => b.key === key);
    const kg = Number(value);
    if (!bean || !Number.isInteger(kg) || kg < 0 || kg > WHOLESALE_MAX_KG) return fail("Çekirdek miktarı geçersiz.");
    if (kg === 0) continue;
    const pricePerKg = tierPrice(bean, kg);
    lines.push({ key, name: bean.name, kg, pricePerKg, total: kg * pricePerKg });
  }
  const totalKg = lines.reduce((n, l) => n + l.kg, 0);
  if (totalKg < WHOLESALE_MIN_KG) return { ...fail(`Toptan siparişte en az ${WHOLESALE_MIN_KG} kg seçmelisiniz.`), totalKg, lines };
  if (totalKg > WHOLESALE_MAX_KG) return fail(`Online toptan sipariş en fazla ${WHOLESALE_MAX_KG} kg olabilir.`);
  return { ok: true, totalKg, total: lines.reduce((n, l) => n + l.total, 0), lines };
}

/** Sipariş satırında WordPress'te görünecek açıklama */
export function wholesaleSummary(c: WholesaleConfig, q: WholesaleQuote) {
  return [
    { key: "Çekirdekler", value: q.lines.map((l) => `${l.name} ${l.kg} kg (${l.pricePerKg}₺/kg)`).join(", ") },
    { key: "Toplam", value: `${q.totalKg} kg` },
    { key: "Kavurma", value: c.roast },
    { key: "Öğütme", value: c.grind },
    { key: "Paket", value: `${c.bagSize} · ${c.bagType}` },
  ];
}
