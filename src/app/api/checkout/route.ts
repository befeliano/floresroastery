import { NextResponse, type NextRequest } from "next/server";
import { canCreateWooOrders, createWooOrder, orderPayUrl } from "@/lib/commerce/woocommerce";
import { isCardPaymentAvailable } from "@/lib/payments/iyzico";
import { priceCart } from "@/lib/orders/pricing";
import { db, newOrderNumber, type Order } from "@/lib/orders/store";
import { clientIp, guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail, cleanLine, cleanPhone, cleanText } from "@/lib/security/sanitize";

/**
 * Sipariş oluşturma.
 * - Ön Bilgilendirme Formu + Mesafeli Satış Sözleşmesi onayı olmadan sipariş alınmaz
 * - Sepet sunucuda katalogdan yeniden fiyatlanır, stok doğrulanır
 * - Kart verisi bu sunucuya HİÇ gelmez: kartla ödemede müşteri WooCommerce sipariş
 *   ödeme sayfasına yönlenir, ödemeyi WordPress'teki iyzico eklentisi alır
 */
export async function POST(req: NextRequest) {
  const g = await guard(req, "checkout", LIMITS.checkout, 24_000);
  if ("response" in g) return g.response;
  const b = g.body;
  const c = (b.customer ?? {}) as Record<string, unknown>;
  const consents = (b.consents ?? {}) as Record<string, unknown>;

  const customer = {
    firstName: cleanLine(c.firstName, 60),
    lastName: cleanLine(c.lastName, 60),
    email: cleanEmail(c.email),
    phone: cleanPhone(c.phone),
    city: cleanLine(c.city, 40),
    district: cleanLine(c.district, 60),
    address: cleanText(c.address, 300).replace(/\n/g, " "),
    postcode: cleanLine(c.postcode, 10).replace(/\D/g, "") || undefined,
  };

  const fieldErrors: Record<string, string> = {};
  if (customer.firstName.length < 2) fieldErrors.firstName = "Adınızı yazın.";
  if (customer.lastName.length < 2) fieldErrors.lastName = "Soyadınızı yazın.";
  if (!customer.email) fieldErrors.email = "Geçerli bir e-posta adresi girin.";
  if (!customer.phone) fieldErrors.phone = "05XX XXX XX XX biçiminde bir cep telefonu girin.";
  if (customer.city.length < 2) fieldErrors.city = "İl seçin.";
  if (customer.district.length < 2) fieldErrors.district = "İlçe yazın.";
  if (customer.address.length < 10) fieldErrors.address = "Açık adresinizi yazın (mahalle, sokak, no, daire).";
  if (Object.keys(fieldErrors).length) return NextResponse.json({ error: "Lütfen işaretli alanları kontrol edin.", fieldErrors }, { status: 422 });

  if (consents.preInfo !== true || consents.distanceSales !== true) {
    return jsonError("Siparişi tamamlamak için Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi'ni onaylamanız gerekir.", 422);
  }

  const paymentMethod = b.paymentMethod === "iyzico" ? "iyzico" : b.paymentMethod === "bacs" ? "bacs" : null;
  if (!paymentMethod) return jsonError("Lütfen bir ödeme yöntemi seçin.");
  if (paymentMethod === "iyzico" && !isCardPaymentAvailable()) {
    return jsonError("Kartla ödeme şu an kullanılamıyor. Havale / EFT ile siparişinizi tamamlayabilirsiniz.", 503);
  }

  const quote = await priceCart(b.items, { city: customer.city, shippingMethod: b.shippingMethod, couponCode: b.couponCode });
  if (quote.errors.length || !quote.lines.length) {
    return NextResponse.json({ error: quote.errors[0] ?? "Sepetiniz boş.", errors: quote.errors }, { status: 409 });
  }
  if (quote.couponError) return jsonError(quote.couponError, 409);
  const shippingMethod = quote.shippingMethod!;

  const note = cleanText(b.note, 500) || undefined;
  const fullCustomer = { ...customer, email: customer.email!, phone: customer.phone! };
  let number = newOrderNumber();
  let wooId: number | undefined;
  let paymentUrl: string | undefined;
  let total = quote.total;
  const consentRecord = { preInfo: true, distanceSales: true, marketing: consents.marketing === true, at: new Date().toISOString(), ip: clientIp(req) };

  if (canCreateWooOrders()) {
    const started = Date.now();
    try {
      const woo = await createWooOrder({
        customer: fullCustomer,
        paymentMethod,
        note,
        shipping: { methodId: shippingMethod.id, title: shippingMethod.label, total: quote.shipping },
        couponCode: quote.coupon?.code,
        lines: quote.lines.map((l) => ({ productId: l.productId, variationId: l.variantId, quantity: l.quantity, grind: l.grind })),
        // sözleşme onayı kaydı (Mesafeli Sözleşmeler Yönetmeliği — ispat yükü satıcıda)
        consents: consentRecord,
      });
      wooId = woo.id;
      number = String(woo.number);
      console.info(`[checkout] Woo #${woo.number} (${paymentMethod}, ${woo.status}) ${Date.now() - started} ms`);
      if (paymentMethod === "iyzico") {
        paymentUrl = orderPayUrl(woo);
        if (!paymentUrl) {
          console.error(`[checkout] #${woo.number}: Woo ödeme adresi dönmedi`, { id: woo.id, hasKey: Boolean(woo.order_key) });
          return jsonError(`Siparişiniz (#${woo.number}) alındı ancak ödeme sayfası açılamadı. Lütfen bizimle iletişime geçin.`, 502);
        }
      }
      // tutarı WooCommerce hesaplar (vergi/kupon); fark varsa Woo'nun tutarı geçerlidir
      const wooTotal = Number(woo.total);
      if (Math.abs(wooTotal - quote.total) > 0.5) console.warn(`[checkout] tutar farkı: site ${quote.total} / Woo ${wooTotal} (#${woo.number})`);
      total = wooTotal;
    } catch (err) {
      const timedOut = (err as Error).name === "TimeoutError";
      console.error(`[checkout] WooCommerce siparişi açılamadı (${paymentMethod}, ${Date.now() - started} ms):`, err);
      return jsonError(
        timedOut
          ? "Mağaza sistemimiz geç yanıt verdi. Siparişiniz oluşmuş olabilir — tekrar denemeden önce e-postanızı kontrol edin ya da bize WhatsApp'tan yazın."
          : "Siparişiniz şu an oluşturulamadı. Lütfen birkaç dakika sonra tekrar deneyin.",
        timedOut ? 504 : 502,
      );
    }
  }

  const order: Order = {
    number,
    wooId,
    createdAt: new Date().toISOString(),
    status: "awaiting-payment",
    paymentMethod,
    customer: fullCustomer,
    note,
    lines: quote.lines,
    subtotal: quote.subtotal,
    shippingMethod: { id: shippingMethod.id, label: shippingMethod.label },
    shipping: quote.shipping,
    coupon: quote.coupon ?? undefined,
    discount: quote.discount,
    total,
    consents: consentRecord,
  };
  db.orders.set(order.number, order);

  return NextResponse.json({
    orderNumber: order.number,
    paymentUrl,
    paymentMethod,
    total: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
    shippingLabel: order.shippingMethod.label,
    discount: order.discount,
    coupon: order.coupon?.code,
    email: order.customer.email,
    lines: order.lines.map(({ name, variantLabel, grind, quantity, lineTotal }) => ({ name, variantLabel, grind, quantity, lineTotal })),
  });
}
