import "server-only";
import { canCreateWooOrders, wooFetch } from "./woocommerce";

/**
 * WooCommerce kuponları — Bağır kuponları WordPress → Pazarlama → Kuponlar'dan yönetir;
 * site her doğrulamada canlı okur (REST v3, anahtarlar yalnızca sunucuda).
 * Desteklenen: yüzde / sepet tutarı / ürün başına indirim, ürün ve hariç ürün kısıtları
 * (ana ürün veya varyasyon kimliği), indirimli ürünleri hariç tutma, min/max tutar,
 * son kullanma tarihi, kullanım limiti ve ücretsiz kargo. Kesin tutarı yine
 * WooCommerce siparişi hesaplar; ödeme Woo'nun tutarıyla alınır.
 */
type WooCoupon = {
  code: string;
  amount: string;
  discount_type: "percent" | "fixed_cart" | "fixed_product";
  date_expires: string | null;
  usage_count: number;
  usage_limit: number | null;
  minimum_amount: string;
  maximum_amount: string;
  product_ids: number[];
  excluded_product_ids: number[];
  exclude_sale_items: boolean;
  free_shipping: boolean;
};

export interface CouponLine {
  productId: string;
  variantId: string;
  quantity: number;
  lineTotal: number;
  onSale?: boolean;
}

export type CouponResult =
  | { ok: true; code: string; discount: number; freeShipping: boolean; label: string }
  | { ok: false; message: string };

export async function validateCoupon(rawCode: string, lines: CouponLine[]): Promise<CouponResult> {
  const code = rawCode.trim().toLowerCase();
  if (!/^[a-z0-9_-]{2,40}$/.test(code)) return { ok: false, message: "Kupon kodu geçersiz." };
  if (!canCreateWooOrders()) return { ok: false, message: "Kupon doğrulama şu an kullanılamıyor." };

  let coupon: WooCoupon | undefined;
  try {
    const res = await wooFetch(`wc/v3/coupons?code=${encodeURIComponent(code)}`);
    if (!res.ok) throw new Error(String(res.status));
    coupon = ((await res.json()) as WooCoupon[]).find((c) => c.code.toLowerCase() === code);
  } catch (err) {
    console.error("[coupon] doğrulanamadı:", err);
    return { ok: false, message: "Kupon şu an doğrulanamadı, lütfen tekrar deneyin." };
  }

  if (!coupon) return { ok: false, message: "Bu kupon kodu bulunamadı." };
  if (coupon.date_expires && new Date(coupon.date_expires).getTime() < Date.now()) return { ok: false, message: "Bu kuponun süresi dolmuş." };
  if (coupon.usage_limit != null && coupon.usage_count >= coupon.usage_limit) return { ok: false, message: "Bu kuponun kullanım limiti dolmuş." };

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const min = Number(coupon.minimum_amount) || 0;
  const max = Number(coupon.maximum_amount) || 0;
  if (min && subtotal < min) return { ok: false, message: `Bu kupon ${min.toLocaleString("tr-TR")}₺ ve üzeri sepetlerde geçerli.` };
  if (max && subtotal > max) return { ok: false, message: `Bu kupon ${max.toLocaleString("tr-TR")}₺ ve altı sepetlerde geçerli.` };

  // hangi satırlara uygulanır? (kimlik: ana ürün ya da varyasyon)
  const ids = (l: CouponLine) => [Number(l.productId), Number(l.variantId)];
  const eligible = lines.filter(
    (l) =>
      (!coupon.product_ids.length || ids(l).some((id) => coupon.product_ids.includes(id))) &&
      !ids(l).some((id) => coupon.excluded_product_ids.includes(id)) &&
      !(coupon.exclude_sale_items && l.onSale),
  );
  if (!eligible.length) return { ok: false, message: "Bu kupon yalnızca belirli ürünlerde geçerli; sepetinize uygulanamıyor." };

  const amount = Number(coupon.amount) || 0;
  const base = eligible.reduce((n, l) => n + l.lineTotal, 0);
  const raw =
    coupon.discount_type === "percent"
      ? (base * amount) / 100
      : coupon.discount_type === "fixed_product"
        ? eligible.reduce((n, l) => n + Math.min(l.lineTotal, amount * l.quantity), 0)
        : amount;
  const discount = Math.min(base, Math.round(raw * 100) / 100);
  const label = coupon.discount_type === "percent" ? `%${amount} indirim` : `${amount.toLocaleString("tr-TR")}₺ indirim`;
  return { ok: true, code: coupon.code, discount, freeShipping: coupon.free_shipping, label: coupon.free_shipping ? `${label} + ücretsiz kargo` : label };
}
