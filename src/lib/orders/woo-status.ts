import type { WooOrder } from "@/lib/commerce/woocommerce";
import { STATUS_LABEL, type OrderStatus } from "./store";

/** WooCommerce sipariş durumu → sitedeki durum */
export const WOO_STATUS: Record<WooOrder["status"], OrderStatus> = {
  pending: "awaiting-payment",
  "on-hold": "awaiting-payment",
  "checkout-draft": "awaiting-payment",
  processing: "processing",
  completed: "shipped",
  cancelled: "cancelled",
  refunded: "cancelled",
  failed: "cancelled",
};

export const wooStatus = (s: WooOrder["status"]): OrderStatus => WOO_STATUS[s] ?? "processing";

export const wooStatusLabel = (s: WooOrder["status"]) =>
  s === "completed" ? "Tamamlandı" : s === "refunded" ? "İade edildi" : STATUS_LABEL[wooStatus(s)];
