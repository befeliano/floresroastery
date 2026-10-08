import "server-only";
import { canCreateWooOrders } from "@/lib/commerce/woocommerce";

/**
 * Kartla ödeme — iyzico, WordPress'te kurulu WooCommerce eklentisi üzerinden
 * ---------------------------------------------------------------------------
 *  1. /api/checkout siparişi WooCommerce'de "pending" olarak açar
 *  2. Müşteri Woo'nun sipariş ödeme sayfasına (payment_url) yönlenir;
 *     iyzico eklentisi ("Yönlendir" modu) ödemeyi alır, webhook'u işler,
 *     siparişi "processing" yapar ve stok düşer
 *  3. docs/wordpress-snippet.php sayesinde müşteri ödeme sonrası bu siteye
 *     (/siparis/tamamlandi) döner
 *
 * iyzico API anahtarı, güvenlik anahtarı ve webhook adresi YALNIZCA WordPress'teki
 * iyzico eklentisinde durur — bu uygulamaya hiç girilmez.
 */
export const isCardPaymentAvailable = () => canCreateWooOrders();
