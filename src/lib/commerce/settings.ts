import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isWooConfigured, wooFetch } from "./woocommerce";

/**
 * Mağaza ayarları — WordPress → "Flores Ayarları" sayfasından (docs/wordpress-snippet.php).
 * Bağır kod bilmeden gramaj ve süt fiyatını oradan değiştirir; site saatte bir (ya da
 * kaydedince anında) günceller. WordPress'e ulaşılamazsa varsayılanlar kullanılır.
 */
export interface ShopSettings {
  filterGrams: number;
  espressoSingleGrams: number;
  espressoDoubleGrams: number;
  latteGrams: number;
  latteMilkMl: number;
  milkPricePerLiter: number;
}

export const DEFAULT_SETTINGS: ShopSettings = {
  filterGrams: 15,
  espressoSingleGrams: 9,
  espressoDoubleGrams: 18,
  latteGrams: 18,
  latteMilkMl: 240,
  milkPricePerLiter: 55,
};

export async function getShopSettings(): Promise<ShopSettings> {
  "use cache";
  cacheTag("settings");
  cacheLife("hours");
  if (!isWooConfigured()) return DEFAULT_SETTINGS;
  try {
    const res = await wooFetch("wc-flores/v1/settings", {}, 8_000);
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = (await res.json()) as Partial<Record<keyof ShopSettings, unknown>>;
    const out = { ...DEFAULT_SETTINGS };
    for (const k of Object.keys(DEFAULT_SETTINGS) as (keyof ShopSettings)[]) {
      const v = Number(data[k]);
      if (Number.isFinite(v) && v > 0 && v < 10_000) out[k] = v;
    }
    return out;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
