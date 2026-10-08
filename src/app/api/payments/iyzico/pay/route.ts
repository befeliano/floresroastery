import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isLocale, localizePath } from "@/i18n/config";
import { getWooOrder, updateWooOrder } from "@/lib/commerce/woocommerce";
import { isIyzicoDirect, startCheckoutForm } from "@/lib/payments/iyzico";
import { clientIp } from "@/lib/security/guard";
import { rateLimit } from "@/lib/security/rate-limit";
import { absoluteUrl } from "@/lib/site";

/**
 * Ödenmemiş bir siparişi iyzico'nun ödeme sayfasına gönderir.
 * Sipariş numarası + WooCommerce sipariş anahtarı (tahmin edilemez) birlikte doğrulanır;
 * tutar her seferinde WooCommerce'teki sipariş toplamından alınır.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const lang = isLocale(q.get("lang")) ? q.get("lang")! : "tr";
  const to = (path: string) => NextResponse.redirect(absoluteUrl(localizePath(lang as "tr", path)), 303);

  if (!isIyzicoDirect()) return to("/siparis-takip");
  const rl = rateLimit(`iyzico-pay:${clientIp(req)}`, { limit: 10, windowMs: 10 * 60_000 });
  if (!rl.ok) return new NextResponse("Çok fazla deneme. Lütfen biraz sonra tekrar deneyin.", { status: 429 });

  const id = Number(q.get("order"));
  const key = q.get("key") ?? "";
  if (!Number.isInteger(id) || id <= 0 || !/^wc_order_[A-Za-z0-9]{6,40}$/.test(key)) return to("/siparis-takip");

  try {
    const order = await getWooOrder(id);
    const ok = order && order.order_key.length === key.length && timingSafeEqual(Buffer.from(order.order_key), Buffer.from(key));
    if (!order || !ok) return to("/siparis-takip");
    if (order.status !== "pending" && order.status !== "failed") return to(`/siparis/tamamlandi?no=${order.number}`);

    const { token, url } = await startCheckoutForm(order, { ip: clientIp(req), lang });
    // bu oturumun belirteci siparişe yazılır: dönüşte yalnızca bu siparişe ait ödeme kabul edilir
    await updateWooOrder(id, {
      payment_method: "iyzico",
      payment_method_title: "Kredi / Banka Kartı (iyzico)",
      meta_data: [{ key: "_flores_iyzico_token", value: token }],
    });
    return NextResponse.redirect(url, 303);
  } catch (err) {
    console.error("[iyzico/pay]", err);
    return to(`/siparis/tamamlandi?no=${id}&odeme=hata`);
  }
}
