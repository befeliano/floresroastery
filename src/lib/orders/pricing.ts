import "server-only";
import { getProducts } from "@/lib/commerce";
import { GRIND_OPTIONS } from "@/lib/commerce/catalog";
import { validateCoupon } from "@/lib/commerce/coupons";
import { priceWholesale, WHOLESALE_PRODUCT_ID, WHOLESALE_SLUG, wholesaleSummary, type WholesaleConfig } from "@/lib/commerce/wholesale";
import { isSlug } from "@/lib/security/sanitize";
import { shippingOptions, type ShippingMethodId, type ShippingOption } from "@/lib/site";
import type { OrderLine } from "./store";

export interface CartInput {
  slug: unknown;
  variantId: unknown;
  grind: unknown;
  quantity: unknown;
  config?: unknown;
}

export interface Quote {
  errors: string[];
  lines: OrderLine[];
  subtotal: number;
  shippingOptions: ShippingOption[];
  shippingMethod: ShippingOption | null;
  shipping: number;
  coupon: { code: string; label: string } | null;
  couponError: string | null;
  discount: number;
  total: number;
}

/**
 * Sepeti SUNUCUDA yeniden fiyatlar. İstemciden gelen fiyatlara ASLA güvenilmez
 * (tarayıcıda F12 ile değiştirilen tutar hiçbir işe yaramaz): ürün, paket, öğütme,
 * stok, toptan kademe fiyatı, kargo ve kupon burada hesaplanır.
 */
export async function priceCart(items: unknown, opts: { city?: unknown; shippingMethod?: unknown; couponCode?: unknown } = {}): Promise<Quote> {
  const empty = (errors: string[]): Quote => ({
    errors,
    lines: [],
    subtotal: 0,
    shippingOptions: [],
    shippingMethod: null,
    shipping: 0,
    coupon: null,
    couponError: null,
    discount: 0,
    total: 0,
  });
  if (!Array.isArray(items) || items.length === 0) return empty(["Sepetiniz boş."]);
  if (items.length > 30) return empty(["Sepette çok fazla satır var."]);

  const products = await getProducts();
  const errors: string[] = [];
  const lines: OrderLine[] = [];

  for (const raw of items as CartInput[]) {
    const quantity = Number(raw?.quantity);

    // toptan sipariş satırı — fiyat yapılandırmadan, kademe tablosuyla
    if (raw?.slug === WHOLESALE_SLUG) {
      const q = priceWholesale(raw.config, GRIND_OPTIONS);
      if (!q.ok) {
        errors.push(q.error ?? "Toptan sipariş bilgisi geçersiz.");
        continue;
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        errors.push("Toptan sipariş için adet 1–20 arasında olmalı.");
        continue;
      }
      const config = raw.config as WholesaleConfig;
      lines.push({
        slug: WHOLESALE_SLUG,
        productId: WHOLESALE_PRODUCT_ID,
        name: "Toptan Sipariş (B2B)",
        variantId: "0",
        variantLabel: `${q.totalKg} kg · ${config.roast}`,
        grind: config.grind,
        quantity,
        unitPrice: q.total,
        lineTotal: q.total * quantity,
        meta: wholesaleSummary(config, q),
      });
      continue;
    }

    const product = isSlug(raw?.slug) ? products.find((p) => p.slug === raw.slug) : undefined;
    const variant = product?.variants.find((v) => v.id === raw?.variantId);
    if (!product || !variant) {
      errors.push("Sepetinizdeki bir ürün artık satışta değil.");
      continue;
    }
    if (!variant.inStock) {
      errors.push(`${product.name} ${variant.label} şu an stokta yok.`);
      continue;
    }
    if (typeof raw.grind !== "string" || (product.grindOptions.length ? !product.grindOptions.includes(raw.grind) : raw.grind !== "")) {
      errors.push(`${product.name} için geçersiz öğütme seçimi.`);
      continue;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      errors.push(`${product.name} için adet 1–20 arasında olmalı.`);
      continue;
    }
    lines.push({
      slug: product.slug,
      productId: product.id,
      name: product.fullName,
      variantId: variant.id,
      variantLabel: variant.label,
      grind: raw.grind,
      quantity,
      unitPrice: variant.price,
      lineTotal: variant.price * quantity,
      onSale: !!variant.compareAtPrice,
    });
  }

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);

  // kupon — satır bazında (ürüne özel kuponlar dahil)
  let coupon: Quote["coupon"] = null;
  let couponError: string | null = null;
  let discount = 0;
  let freeShipping = false;
  if (typeof opts.couponCode === "string" && opts.couponCode.trim() && subtotal > 0) {
    const c = await validateCoupon(opts.couponCode, lines);
    if (c.ok) {
      coupon = { code: c.code, label: c.label };
      discount = c.discount;
      freeShipping = c.freeShipping;
    } else couponError = c.message;
  }

  // kargo — indirim sonrası tutara göre (WooCommerce varsayılanı)
  const options = shippingOptions(typeof opts.city === "string" ? opts.city : "", subtotal - discount).map((o) =>
    freeShipping ? { ...o, cost: 0 } : o,
  );
  const chosen = options.find((o) => o.id === (opts.shippingMethod as ShippingMethodId)) ?? options[0] ?? null;
  const shipping = lines.length && chosen ? chosen.cost : 0;

  return {
    errors,
    lines,
    subtotal,
    shippingOptions: lines.length ? options : [],
    shippingMethod: lines.length ? chosen : null,
    shipping,
    coupon,
    couponError,
    discount,
    total: Math.max(0, subtotal - discount) + shipping,
  };
}
