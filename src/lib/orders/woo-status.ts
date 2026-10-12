import type { WooOrder } from "@/lib/commerce/woocommerce";
import { STATUS_LABEL, type OrderStatus } from "./store";

/** WooCommerce sipariş durumu → sitedeki durum (Hazırlanıyor → Kargoya verildi → Teslim edildi) */
export const WOO_STATUS: Record<string, OrderStatus> = {
  pending: "awaiting-payment",
  "on-hold": "awaiting-payment",
  "checkout-draft": "awaiting-payment",
  processing: "processing",
  completed: "delivered",
  cancelled: "cancelled",
  refunded: "cancelled",
  failed: "cancelled",
};

/**
 * WordPress'te eklentiyle eklenen özel durumlar ("Kargolandı" → kargolandi, shipped, hezarfen-shipped…)
 * kısa adlarına göre tanınır; bilinmeyen durum "Hazırlanıyor" sayılır.
 */
export function wooStatus(s: WooOrder["status"]): OrderStatus {
  if (WOO_STATUS[s]) return WOO_STATUS[s];
  const k = s.toLocaleLowerCase("tr-TR");
  if (/teslim|deliver/.test(k)) return "delivered";
  if (/kargo|ship|sent|gonder|gönder|yolda|dispatch/.test(k)) return "shipped";
  if (/iptal|cancel|iade|refund|fail/.test(k)) return "cancelled";
  return "processing";
}

export const wooStatusLabel = (s: WooOrder["status"]) =>
  s === "completed" ? "Tamamlandı" : s === "refunded" ? "İade edildi" : STATUS_LABEL[wooStatus(s)];
