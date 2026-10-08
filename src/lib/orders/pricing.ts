import "server-only";
import { getProducts } from "@/lib/commerce";
import { validateCoupon } from "@/lib/commerce/coupons";
import { isSlug } from "@/lib/security/sanitize";
import { shippingOptions, type ShippingMethodId, type ShippingOption } from "@/lib/site";
import type { OrderLine } from "./store";

export interface CartInput {
  slug: unknown;
  variantId: unknown;
  grind: unknown;
  quantity: unknown;
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
 * Sepeti SUNUCUDA yeniden fiyatlar. İstemciden gelen fiyatlara asla
 * güvenilmez; ürün, paket, öğütme, stok, kargo ve kupon burada hesaplanır.
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
    const product = isSlug(raw?.slug) ? products.find((p) => p.slug === raw.slug) : undefined;
    const variant = product?.variants.find((v) => v.id === raw?.variantId);
    const quantity = Number(raw?.quantity);
    if (!product || !variant) {
      errors.push("Sepetinizdeki bir ürün artık satışta değil.");
      continue;
    }
    if (!variant.inStock) {
      errors.push(`${product.name} ${variant.label} şu an stokta yok.`);
      continue;
    }
    if (typeof raw.grind !== "string" || !product.grindOptions.includes(raw.grind)) {
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
    });
  }

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);

  // kupon
  let coupon: Quote["coupon"] = null;
  let couponError: string | null = null;
  let discount = 0;
  let freeShipping = false;
  if (typeof opts.couponCode === "string" && opts.couponCode.trim() && subtotal > 0) {
    const c = await validateCoupon(opts.couponCode, subtotal);
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
