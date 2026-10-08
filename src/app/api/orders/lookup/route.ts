import { NextResponse, type NextRequest } from "next/server";
import { canCreateWooOrders, getWooOrder, orderPayUrl, type WooOrder } from "@/lib/commerce/woocommerce";
import { db, STATUS_LABEL, type OrderStatus } from "@/lib/orders/store";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail, cleanLine } from "@/lib/security/sanitize";

const NOT_FOUND = "Bu bilgilerle eşleşen bir sipariş bulamadık. Sipariş numaranızı ve e-posta adresinizi kontrol edin.";

const WOO_STATUS: Record<WooOrder["status"], OrderStatus> = {
  pending: "awaiting-payment",
  "on-hold": "awaiting-payment",
  "checkout-draft": "awaiting-payment",
  processing: "processing",
  completed: "shipped",
  cancelled: "cancelled",
  refunded: "cancelled",
  failed: "cancelled",
};

/** Sipariş takibi — sipariş no + e-posta birlikte doğrulanır (numara tek başına yetmez) */
export async function POST(req: NextRequest) {
  const g = await guard(req, "lookup", LIMITS.lookup, 1_000);
  if ("response" in g) return g.response;

  const number = cleanLine(g.body.orderNumber, 30).toUpperCase().replace(/^#/, "");
  const email = cleanEmail(g.body.email);
  if (!number || !email) return jsonError(NOT_FOUND, 404);

  // WooCommerce siparişi (canlı durum: ödeme, hazırlık, kargo)
  if (canCreateWooOrders() && /^\d{1,10}$/.test(number)) {
    let woo: WooOrder | null = null;
    try {
      woo = await getWooOrder(Number(number));
    } catch (err) {
      console.error("[lookup]", err);
      return jsonError("Sipariş bilgisi şu an alınamadı, lütfen biraz sonra tekrar deneyin.", 502);
    }
    // tek tip yanıt: hangi alanın yanlış olduğunu sızdırma
    if (!woo || woo.billing.email.toLowerCase() !== email) return jsonError(NOT_FOUND, 404);
    const status = WOO_STATUS[woo.status] ?? "processing";
    const grind = (l: WooOrder["line_items"][number]) => String(l.meta_data.find((m) => m.key === "grind-size")?.value ?? "");
    return NextResponse.json({
      number: woo.number,
      createdAt: woo.date_created,
      status,
      statusLabel: woo.status === "completed" ? "Tamamlandı" : STATUS_LABEL[status],
      paymentMethod: woo.payment_method === "bacs" ? "bacs" : "iyzico",
      // ödenmemiş kart siparişinde müşteri ödemeyi tamamlayabilsin
      paymentUrl: woo.status === "pending" ? orderPayUrl(woo) : undefined,
      lines: woo.line_items.map((l) => ({ name: l.name, variantLabel: "", grind: grind(l), quantity: l.quantity, lineTotal: Number(l.total) })),
      subtotal: woo.line_items.reduce((n, l) => n + Number(l.total), 0),
      shipping: Number(woo.shipping_total),
      shippingLabel: woo.shipping_lines[0]?.method_title ?? "Kargo",
      discount: Number(woo.discount_total),
      total: Number(woo.total),
      city: woo.billing.state,
    });
  }

  // yerel kayıt (WooCommerce bağlı değilken)
  const order = db.orders.get(number);
  if (!order || order.customer.email !== email) return jsonError(NOT_FOUND, 404);
  return NextResponse.json({
    number: order.number,
    createdAt: order.createdAt,
    status: order.status,
    statusLabel: STATUS_LABEL[order.status],
    paymentMethod: order.paymentMethod,
    lines: order.lines.map(({ name, variantLabel, grind, quantity, lineTotal }) => ({ name, variantLabel, grind, quantity, lineTotal })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    shippingLabel: order.shippingMethod.label,
    discount: order.discount,
    total: order.total,
    city: order.customer.city,
  });
}
