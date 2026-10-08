import "server-only";
import { randomInt } from "node:crypto";

/**
 * Sipariş / talep kayıtları.
 * WooCommerce REST anahtarları tanımlıysa siparişler WooCommerce'de açılır
 * (bkz. /api/checkout); buradaki bellek içi kayıt geliştirme ortamı ve sipariş
 * takibi önizlemesi içindir — sunucu yeniden başlayınca silinir.
 */
export type OrderStatus = "awaiting-payment" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderLine {
  slug: string;
  productId: string;
  name: string;
  variantId: string;
  variantLabel: string;
  grind: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** liste fiyatından indirimli mi (kuponun "indirimli ürünleri hariç tut" kuralı için) */
  onSale?: boolean;
  /** WooCommerce sipariş satırına yazılacak ek bilgiler (toptan sipariş içeriği) */
  meta?: { key: string; value: string }[];
}

export interface Order {
  number: string;
  wooId?: number;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: "bacs" | "iyzico";
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    postcode?: string;
  };
  note?: string;
  lines: OrderLine[];
  subtotal: number;
  shippingMethod: { id: string; label: string };
  shipping: number;
  coupon?: { code: string; label: string };
  discount: number;
  total: number;
  consents: { preInfo: boolean; distanceSales: boolean; marketing: boolean; at: string; ip: string };
}

export interface ReturnRequest {
  id: string;
  createdAt: string;
  orderNumber: string;
  name: string;
  email: string;
  phone?: string;
  reason: string;
  details: string;
}

type Db = {
  orders: Map<string, Order>;
  returns: ReturnRequest[];
  newsletter: Set<string>;
  stockAlerts: Map<string, Set<string>>;
  messages: { at: string; name: string; email: string; subject: string; message: string }[];
};

export const db: Db = ((globalThis as { __floresDb?: Db }).__floresDb ??= {
  orders: new Map(),
  returns: [],
  newsletter: new Set(),
  stockAlerts: new Map(),
  messages: [],
});

const stamp = () => {
  const d = new Date();
  return `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
};

/** FR-261008-4821 biçiminde, tahmin edilmesi zor sipariş numarası */
export function newOrderNumber() {
  let n: string;
  do n = `FR-${stamp()}-${randomInt(1000, 10000)}`;
  while (db.orders.has(n));
  return n;
}

export const newReturnId = () => `IADE-${stamp()}-${randomInt(1000, 10000)}`;

export const STATUS_LABEL: Record<OrderStatus, string> = {
  "awaiting-payment": "Ödeme bekleniyor",
  processing: "Hazırlanıyor",
  shipped: "Kargoya verildi",
  delivered: "Teslim edildi",
  cancelled: "İptal edildi",
};
