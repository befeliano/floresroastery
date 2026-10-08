import "server-only";
import { canCreateWooOrders } from "./woocommerce";

/**
 * WooCommerce kuponları — REST API v3 ile doğrulanır (anahtarlar yalnızca sunucuda).
 * Desteklenen: yüzde (percent) ve sepet tutarı (fixed_cart) indirimi, minimum /
 * maksimum tutar, son kullanma tarihi, kullanım limiti ve ücretsiz kargo.
 * Ürüne özel kuponlar (fixed_product, ürün kısıtları) WooCommerce siparişinde
 * yeniden hesaplanacağından burada reddedilir.
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
  free_shipping: boolean;
};

export type CouponResult =
  | { ok: true; code: string; discount: number; freeShipping: boolean; label: string }
  | { ok: false; message: string };

export async function validateCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = rawCode.trim().toLowerCase();
  if (!/^[a-z0-9_-]{2,40}$/.test(code)) return { ok: false, message: "Kupon kodu geçersiz." };
  if (!canCreateWooOrders()) return { ok: false, message: "Kupon doğrulama şu an kullanılamıyor." };

  const auth = Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString("base64");
  let coupon: WooCoupon | undefined;
  try {
    const res = await fetch(`${process.env.WOOCOMMERCE_URL!.replace(/\/$/, "")}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code)}`, {
      headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
    });
    if (!res.ok) throw new Error(String(res.status));
    coupon = ((await res.json()) as WooCoupon[])[0];
  } catch (err) {
    console.error("[coupon] doğrulanamadı:", err);
    return { ok: false, message: "Kupon şu an doğrulanamadı, lütfen tekrar deneyin." };
  }

  if (!coupon) return { ok: false, message: "Bu kupon kodu bulunamadı." };
  if (coupon.date_expires && new Date(coupon.date_expires).getTime() < Date.now()) return { ok: false, message: "Bu kuponun süresi dolmuş." };
  if (coupon.usage_limit != null && coupon.usage_count >= coupon.usage_limit) return { ok: false, message: "Bu kuponun kullanım limiti dolmuş." };
  if (coupon.discount_type === "fixed_product" || coupon.product_ids.length || coupon.excluded_product_ids.length) {
    return { ok: false, message: "Bu kupon yalnızca belirli ürünlerde geçerli; sepetinize uygulanamıyor." };
  }
  const min = Number(coupon.minimum_amount) || 0;
  const max = Number(coupon.maximum_amount) || 0;
  if (min && subtotal < min) return { ok: false, message: `Bu kupon ${min.toLocaleString("tr-TR")}₺ ve üzeri sepetlerde geçerli.` };
  if (max && subtotal > max) return { ok: false, message: `Bu kupon ${max.toLocaleString("tr-TR")}₺ ve altı sepetlerde geçerli.` };

  const amount = Number(coupon.amount) || 0;
  const discount = Math.min(subtotal, coupon.discount_type === "percent" ? Math.round((subtotal * amount) / 100) : amount);
  const label = coupon.discount_type === "percent" ? `%${amount} indirim` : `${amount.toLocaleString("tr-TR")}₺ indirim`;
  return { ok: true, code: coupon.code, discount, freeShipping: coupon.free_shipping, label: coupon.free_shipping ? `${label} + ücretsiz kargo` : label };
}
