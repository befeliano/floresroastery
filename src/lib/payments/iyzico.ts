import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { canCreateWooOrders, type WooOrder } from "@/lib/commerce/woocommerce";
import { absoluteUrl } from "@/lib/site";
import { iyzicoConfig, isIyzicoDirect } from "./config";

/**
 * Kartla ödeme — iyzico Ödeme Formu (Checkout Form), doğrudan
 * ------------------------------------------------------------
 *  1. /api/checkout siparişi WooCommerce'de "pending" açar (tutarı sunucu hesaplar)
 *  2. Müşteri /api/payments/iyzico/pay'e gider → sunucu iyzico'da o siparişe özel
 *     ödeme oturumu açar (tutar = WooCommerce sipariş toplamı) → iyzico'nun KENDİ
 *     ödeme sayfasına yönlendirir. Kart bilgisi yalnızca iyzico'ya girilir; bu siteye
 *     ve sunucuya hiçbir kart verisi gelmez, hiçbir yerde saklanmaz.
 *  3. iyzico müşteriyi /api/payments/iyzico/callback'e döndürür → sunucu sonucu
 *     iyzico'dan (anahtarla imzalı istek) SORAR; tutar, sipariş ve para birimi
 *     eşleşirse sipariş "ödendi" yapılır (stok düşer, WooCommerce e-postaları gider).
 *     Aynı ödeme ikinci kez gelirse yeniden işlenmez (idempotent).
 *
 * Anahtarlar tanımlı değilse eski yol (WordPress'teki iyzico eklentisi) kullanılır.
 */

export const isCardPaymentAvailable = () => canCreateWooOrders();
export { isIyzicoDirect };

type IyziResponse = { status: "success" | "failure"; errorCode?: string; errorMessage?: string; [k: string]: unknown };

/** iyzico IYZWSv2 kimlik doğrulaması: HMAC-SHA256(gizli anahtar, rastgele + yol + gövde) */
async function iyzico<T extends IyziResponse>(path: string, body: Record<string, unknown>): Promise<T> {
  const cfg = iyzicoConfig();
  if (!cfg) throw new Error("iyzico yapılandırılmamış");
  const random = `${Date.now()}${randomBytes(6).toString("hex")}`;
  const payload = JSON.stringify(body);
  const signature = createHmac("sha256", cfg.secretKey).update(random + path + payload).digest("hex");
  const auth = Buffer.from(`apiKey:${cfg.apiKey}&randomKey:${random}&signature:${signature}`).toString("base64");
  const res = await fetch(cfg.base + path, {
    method: "POST",
    signal: AbortSignal.timeout(20_000),
    headers: { Authorization: `IYZWSv2 ${auth}`, "x-iyzi-rnd": random, "Content-Type": "application/json", Accept: "application/json" },
    body: payload,
  });
  const data = (await res.json().catch(() => ({ status: "failure", errorMessage: `HTTP ${res.status}` }))) as T;
  return data;
}

const money = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
const clip = (s: string | undefined, n = 100) => (s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, n) || "-";

/** Sepet kalemleri: satırlar + kargo; kalemler toplamı = sipariş toplamı (kuruş farkı son kaleme) */
function basketItems(order: WooOrder) {
  const items = order.line_items
    .map((l) => ({
      id: `L${l.id}`,
      name: clip(l.name, 120),
      category1: "Kahve",
      itemType: "PHYSICAL",
      amount: Number(l.total) + Number(l.total_tax || 0),
    }))
    .filter((i) => i.amount > 0);
  const shipping = order.shipping_lines.reduce((n, s) => n + Number(s.total) + Number(s.total_tax || 0), 0);
  if (shipping > 0) items.push({ id: "SHIP", name: "Kargo", category1: "Kargo", itemType: "PHYSICAL", amount: shipping });
  const total = Number(order.total);
  const sum = items.reduce((n, i) => n + i.amount, 0);
  if (items.length && Math.abs(total - sum) >= 0.01) items[items.length - 1].amount += total - sum;
  return items.filter((i) => i.amount > 0).map(({ amount, ...i }) => ({ ...i, price: money(amount) }));
}

/** Siparişe özel iyzico ödeme oturumu açar → iyzico'nun barındırdığı ödeme sayfası adresi */
export async function startCheckoutForm(order: WooOrder, opts: { ip: string; lang: string }) {
  const total = Number(order.total);
  if (!(total > 0)) throw new Error("Sipariş tutarı geçersiz");
  const b = order.billing;
  const s = order.shipping?.address_1 ? order.shipping : b;
  const address = (a: { first_name: string; last_name: string; address_1: string; city: string; state: string; postcode: string }) => ({
    contactName: clip(`${a.first_name} ${a.last_name}`),
    city: clip(a.state || a.city, 50),
    country: "Turkey",
    address: clip(`${a.address_1} ${a.city}/${a.state}`, 250),
    zipCode: a.postcode || undefined,
  });
  const data = await iyzico<IyziResponse & { token?: string; paymentPageUrl?: string; tokenExpireTime?: number }>(
    "/payment/iyzipos/checkoutform/initialize/auth/ecom",
    {
      locale: opts.lang === "tr" ? "tr" : "en",
      conversationId: String(order.id),
      price: money(total),
      paidPrice: money(total),
      currency: "TRY",
      basketId: String(order.id),
      paymentGroup: "PRODUCT",
      callbackUrl: absoluteUrl(`/api/payments/iyzico/callback?lang=${opts.lang}`),
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: order.customer_id ? `C${order.customer_id}` : `G${order.id}`,
        name: clip(b.first_name, 50),
        surname: clip(b.last_name, 50),
        gsmNumber: b.phone || undefined,
        email: b.email,
        // TC kimlik no toplanmaz; iyzico'nun önerdiği yer tutucu
        identityNumber: "11111111111",
        registrationAddress: clip(`${b.address_1} ${b.city}/${b.state}`, 250),
        ip: opts.ip || order.customer_ip_address || "85.34.78.112",
        city: clip(b.state || b.city, 50),
        country: "Turkey",
        zipCode: b.postcode || undefined,
      },
      shippingAddress: address(s),
      billingAddress: address({ ...b, state: b.state }),
      basketItems: basketItems(order),
    },
  );
  if (data.status !== "success" || !data.paymentPageUrl || !data.token) {
    throw new Error(`iyzico ödeme oturumu açılamadı: ${data.errorCode ?? ""} ${data.errorMessage ?? ""}`);
  }
  return { token: data.token, url: data.paymentPageUrl };
}

export interface CheckoutResult extends IyziResponse {
  paymentStatus?: string;
  paymentId?: string;
  conversationId?: string;
  basketId?: string;
  paidPrice?: number;
  price?: number;
  currency?: string;
  token?: string;
  signature?: string;
}

/** Ödeme sonucunu iyzico'dan sorgular (callback'teki token tek başına güvenilmez) */
export async function retrieveCheckoutForm(token: string) {
  const r = await iyzico<CheckoutResult>("/payment/iyzipos/checkoutform/auth/ecom/detail", { locale: "tr", token });
  return { ...r, signatureOk: verifySignature(r) };
}

/** iyzico yanıt imzası (ek savunma): paymentStatus:paymentId:currency:basketId:conversationId:paidPrice:price:token */
function verifySignature(r: CheckoutResult): boolean | null {
  const cfg = iyzicoConfig();
  if (!cfg || !r.signature) return null;
  const fmt = (n: unknown) => String(Number(n)).replace(/\.0+$/, "");
  const data = [r.paymentStatus, r.paymentId, r.currency, r.basketId, r.conversationId, fmt(r.paidPrice), fmt(r.price), r.token].join(":");
  const expected = Buffer.from(createHmac("sha256", cfg.secretKey).update(data).digest("hex"));
  const got = Buffer.from(String(r.signature));
  return expected.length === got.length && timingSafeEqual(expected, got);
}
