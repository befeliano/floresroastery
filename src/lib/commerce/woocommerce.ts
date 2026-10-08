import "server-only";
import { isIyzicoDirect } from "@/lib/payments/config";

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
export const wooBase = () => base();
export const isWooConfigured = () => Boolean(base());
export const canCreateWooOrders = () =>
  Boolean(base() && process.env.WOOCOMMERCE_CONSUMER_KEY && process.env.WOOCOMMERCE_CONSUMER_SECRET);

/** WordPress yanıt vermezse istek sonsuza kadar asılı kalmasın (müşteri butonda beklemesin) */
const TIMEOUT_MS = 20_000;
const ORDER_TIMEOUT_MS = 30_000;

export async function getJson<T>(url: string, init?: RequestInit, timeoutMs = TIMEOUT_MS): Promise<T> {
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

export interface WooOrderInput {
  customer: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; district: string; postcode?: string };
  paymentMethod: "iyzico" | "bacs";
  note?: string;
  lines: { productId: string; variationId: string; quantity: number; grind: string; lineTotal?: number; meta?: { key: string; value: string }[]; custom?: boolean }[];
  /** ziyaret kaynağı (WooCommerce "Menşe") */
  attribution?: Record<string, string>;
  shipping: { methodId: string; title: string; total: number };
  couponCode?: string;
  consents?: Record<string, unknown>;
  /** giriş yapmış müşterinin WooCommerce kimliği */
  customerId?: number;
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

/** Anahtarla kimliği doğrulanmış WordPress REST isteği (path: "wc/v3/customers" gibi) — yalnızca sunucuda */
export function wooFetch(path: string, init: RequestInit = {}, timeoutMs = TIMEOUT_MS) {
  return fetch(`${base()}/wp-json/${path.replace(/^\//, "")}`, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

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
  billing: { email: string; state: string; first_name: string; last_name: string; phone: string; address_1: string; city: string; postcode: string };
  shipping: { first_name: string; last_name: string; address_1: string; city: string; state: string; postcode: string };
  line_items: {
    id: number;
    product_id: number;
    name: string;
    quantity: number;
    total: string;
    total_tax: string;
    meta_data: { key: string; display_key?: string; value: unknown; display_value?: unknown }[];
  }[];
  shipping_lines: { method_title: string; total: string; total_tax: string }[];
  currency: string;
  customer_id: number;
  customer_ip_address: string;
  transaction_id: string;
  meta_data: { key: string; value: unknown }[];
}

/** Sipariş güncelleme (ör. ödeme alındı) — yalnızca sunucuda */
export async function updateWooOrder(id: number, body: Record<string, unknown>): Promise<WooOrder> {
  const res = await wooFetch(`wc/v3/orders/${id}`, { method: "PUT", body: JSON.stringify(body) }, ORDER_TIMEOUT_MS);
  if (!res.ok) throw new Error(`WooCommerce sipariş güncelleme ${id} → ${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as WooOrder;
}

/** Siparişe yönetici notu (WordPress'te sipariş geçmişinde görünür; müşteriye gitmez) */
export async function addWooOrderNote(id: number, note: string) {
  await wooFetch(`wc/v3/orders/${id}/notes`, { method: "POST", body: JSON.stringify({ note, customer_note: false }) }).catch(() => null);
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
        // kart: sipariş hesaba ödeme alınınca bağlanır (snippet) — müşteri kimliği olan siparişin
        // ödeme sayfası WordPress'te giriş ister, müşteri ise yalnızca yeni sitede oturum açmıştır
        ...(input.customerId && input.paymentMethod === "iyzico" ? [{ key: "_flores_customer_id", value: String(input.customerId) }] : []),
        // WooCommerce sipariş kaynağı — panelde "Doğrudan", "Organik: Google" vb. görünür
        ...Object.entries(input.attribution ?? {}).map(([k, v]) => ({ key: `_wc_order_attribution_${k}`, value: v })),
      ],
      ...(input.customerId && input.paymentMethod === "bacs" ? { customer_id: input.customerId } : {}),
      // Havale/EFT: "on-hold" → WooCommerce müşteriye banka bilgilerini içeren e-postayı otomatik gönderir
      status: input.paymentMethod === "bacs" ? "on-hold" : "pending",
      customer_note: input.note ?? "",
      billing: { ...address, email: input.customer.email, phone: input.customer.phone },
      shipping: address,
      line_items: input.lines.map((l) =>
        l.custom
          ? {
              // toptan: gizli B2B ürünü, tutar sunucuda kademe tablosundan hesaplandı
              product_id: Number(l.productId),
              quantity: l.quantity,
              subtotal: (l.lineTotal ?? 0).toFixed(2),
              total: (l.lineTotal ?? 0).toFixed(2),
              meta_data: [...(l.meta ?? []), { key: "grind-size", value: GRIND_TO_WOO[l.grind] ?? l.grind }],
            }
          : {
              product_id: Number(l.productId),
              variation_id: Number(l.variationId),
              quantity: l.quantity,
              // ürünlerdeki yerel "Grind Size" özniteliğiyle aynı anahtar/terim → panelde aynı görünür
              meta_data: l.grind ? [{ key: "grind-size", value: GRIND_TO_WOO[l.grind] ?? l.grind }] : [],
            },
      ),
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

/**
 * Ödenmemiş siparişin ödeme bağlantısı:
 * - iyzico anahtarları tanımlıysa: bu sitenin /api/payments/iyzico/pay adresi (doğrudan iyzico ödeme sayfası)
 * - değilse: WooCommerce'in ödeme sayfası (WordPress'teki iyzico eklentisi)
 */
export function orderPayUrl(order: Pick<WooOrder, "id" | "order_key" | "payment_url">, lang = "tr"): string | undefined {
  if (isIyzicoDirect() && order.id && order.order_key) {
    return `/api/payments/iyzico/pay?order=${order.id}&key=${encodeURIComponent(order.order_key)}&lang=${lang}`;
  }
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
