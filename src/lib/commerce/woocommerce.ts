import "server-only";
import type { Product } from "./types";

/**
 * WooCommerce (headless) adaptörü
 * -------------------------------
 * Katalog okuma: WooCommerce Store API (herkese açık, anahtar gerektirmez).
 *   Fiyat, liste fiyatı ve stok canlı veriden gelir; künye, demleme ve kavurma
 *   gibi editoryal alanlar catalog.ts'de kalır. Ürünler Woo ürün ID'siyle eşlenir.
 * Sipariş oluşturma: REST API v3 (consumer key/secret — yalnızca sunucuda).
 *
 * Ortam değişkenleri (NEXT_PUBLIC_ önekisiz → tarayıcıya sızmaz):
 *   WOOCOMMERCE_URL              https://floresroastery.com
 *   WOOCOMMERCE_CONSUMER_KEY     ck_...   (sipariş oluşturmak için)
 *   WOOCOMMERCE_CONSUMER_SECRET  cs_...
 */

const base = () => process.env.WOOCOMMERCE_URL?.replace(/\/$/, "");
export const isWooConfigured = () => Boolean(base());
export const canCreateWooOrders = () =>
  Boolean(base() && process.env.WOOCOMMERCE_CONSUMER_KEY && process.env.WOOCOMMERCE_CONSUMER_SECRET);

type StorePrices = { price: string; regular_price: string; currency_minor_unit: number };
type StoreProduct = { id: number; is_in_stock: boolean; prices: StorePrices; variations: { id: number }[] };
type StoreVariation = { id: number; is_in_stock: boolean; prices: StorePrices };

/** WordPress yanıt vermezse istek sonsuza kadar asılı kalmasın (müşteri butonda beklemesin) */
const TIMEOUT_MS = 20_000;
const ORDER_TIMEOUT_MS = 30_000;

async function getJson<T>(url: string, init?: RequestInit, timeoutMs = TIMEOUT_MS): Promise<T> {
  const res = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`WooCommerce ${url.split("?")[0]} → ${res.status} ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

const money = (p: StorePrices, key: "price" | "regular_price") => Number(p[key]) / 10 ** p.currency_minor_unit;

/** Katalogdaki ürünlerin fiyat ve stoklarını canlı WooCommerce verisiyle günceller */
export async function syncWithWoo(products: Product[]): Promise<Product[]> {
  const root = `${base()}/wp-json/wc/store/v1`;
  const live = await getJson<StoreProduct[]>(`${root}/products?per_page=100`);
  const byId = new Map(live.map((p) => [String(p.id), p]));

  return Promise.all(
    products.map(async (product) => {
      const lp = byId.get(product.id);
      if (!lp) return product;
      const vars = await Promise.all(lp.variations.map((v) => getJson<StoreVariation>(`${root}/products/${v.id}`)));
      const byVar = new Map(vars.map((v) => [String(v.id), v]));
      return {
        ...product,
        variants: product.variants.map((v) => {
          const lv = byVar.get(v.id);
          if (!lv) return { ...v, inStock: v.inStock && lp.is_in_stock };
          const price = money(lv.prices, "price");
          const regular = money(lv.prices, "regular_price");
          return { ...v, price, compareAtPrice: regular > price ? regular : undefined, inStock: lp.is_in_stock && lv.is_in_stock };
        }),
      };
    }),
  );
}

export interface WooOrderInput {
  customer: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; district: string; postcode?: string };
  paymentMethod: "iyzico" | "bacs";
  note?: string;
  lines: { productId: string; variationId: string; quantity: number; grind: string }[];
  shipping: { methodId: string; title: string; total: number };
  couponCode?: string;
  consents?: Record<string, unknown>;
}

/** Sitedeki öğütme seçenekleri → WooCommerce "Grind Size" öznitelik terimleri */
const GRIND_TO_WOO: Record<string, string> = {
  "Çekirdek (öğütülmemiş)": "Çekirdek Kahve (Öğütülmemiş)",
  "Türk Kahvesi": "Turkish Coffee",
  Espresso: "Espresso",
  "Moka Pot": "Moka pot",
  "Filtre (makine)": "Filter",
  V60: "V60",
  Origami: "Origami",
  "French Press": "Frenchpress",
  "Cold Brew": "Coldbrew",
};

const authHeader = () =>
  `Basic ${Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString("base64")}`;

export interface WooOrder {
  id: number;
  number: string;
  status: "pending" | "processing" | "on-hold" | "completed" | "cancelled" | "refunded" | "failed" | "checkout-draft";
  order_key: string;
  payment_url: string;
  date_created: string;
  payment_method: string;
  payment_method_title: string;
  total: string;
  discount_total: string;
  shipping_total: string;
  billing: { email: string; state: string };
  line_items: { name: string; quantity: number; total: string; meta_data: { key: string; display_key?: string; value: unknown; display_value?: unknown }[] }[];
  shipping_lines: { method_title: string; total: string }[];
}

/**
 * WooCommerce'de sipariş açar.
 * - Havale/EFT → "on-hold": Woo banka bilgilerini içeren e-postayı gönderir.
 * - Kart → "pending": müşteri `payment_url` (Woo sipariş ödeme sayfası) adresine
 *   yönlendirilir; ödemeyi WordPress'te kurulu iyzico eklentisi alır ve siparişi
 *   kendisi "processing" yapar. Kart verisi ve iyzico anahtarları bu uygulamaya hiç girmez.
 */
export async function createWooOrder(input: WooOrderInput): Promise<WooOrder> {
  const address = {
    first_name: input.customer.firstName,
    last_name: input.customer.lastName,
    address_1: input.customer.address,
    city: input.customer.district,
    state: input.customer.city,
    postcode: input.customer.postcode ?? "",
    country: "TR",
  };
  return getJson(`${base()}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({
      // kart: Woo ödeme sayfasında iyzico seçili gelir (WordPress'teki ödeme yöntemi kimliği "iyzico")
      ...(input.paymentMethod === "bacs"
        ? { payment_method: "bacs", payment_method_title: "Havale / EFT" }
        : { payment_method: "iyzico", payment_method_title: "Kredi / Banka Kartı (iyzico)" }),
      set_paid: false,
      created_via: "flores-headless",
      // WordPress tarafındaki yönlendirme snippet'i bu işarete bakar (docs/wordpress-snippet.php)
      meta_data: [
        { key: "_flores_headless", value: "1" },
        ...(input.consents ? [{ key: "_flores_consents", value: JSON.stringify(input.consents) }] : []),
      ],
      // Havale/EFT: "on-hold" → WooCommerce müşteriye banka bilgilerini içeren e-postayı otomatik gönderir
      status: input.paymentMethod === "bacs" ? "on-hold" : "pending",
      customer_note: input.note ?? "",
      billing: { ...address, email: input.customer.email, phone: input.customer.phone },
      shipping: address,
      line_items: input.lines.map((l) => ({
        product_id: Number(l.productId),
        variation_id: Number(l.variationId),
        quantity: l.quantity,
        // ürünlerdeki yerel "Grind Size" özniteliğiyle aynı anahtar/terim → panelde aynı görünür
        meta_data: [{ key: "grind-size", value: GRIND_TO_WOO[l.grind] ?? l.grind }],
      })),
      shipping_lines: [
        {
          method_id: input.shipping.methodId === "pickup" ? "local_pickup" : input.shipping.methodId === "courier" ? "free_shipping" : "flat_rate",
          method_title: input.shipping.title,
          total: input.shipping.total.toFixed(2),
        },
      ],
      ...(input.couponCode ? { coupon_lines: [{ code: input.couponCode }] } : {}),
    }),
  }, ORDER_TIMEOUT_MS);
}

/** Woo'nun ödeme sayfası adresi; yanıtta boş gelirse sipariş anahtarından kurulur */
export function orderPayUrl(order: Pick<WooOrder, "id" | "order_key" | "payment_url">): string | undefined {
  if (order.payment_url?.startsWith("http")) return order.payment_url;
  if (!order.id || !order.order_key) return undefined;
  return `${base()}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${encodeURIComponent(order.order_key)}`;
}

/** Sipariş takibi için WooCommerce siparişini okur (e-posta doğrulaması çağıran tarafta yapılır) */
export async function getWooOrder(id: number): Promise<WooOrder | null> {
  const res = await fetch(`${base()}/wp-json/wc/v3/orders/${id}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Authorization: authHeader(), Accept: "application/json" },
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`WooCommerce sipariş ${id} → ${res.status}`);
  return (await res.json()) as WooOrder;
}
