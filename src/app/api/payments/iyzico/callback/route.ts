import { NextResponse, type NextRequest } from "next/server";
import { isLocale, localizePath } from "@/i18n/config";
import { addWooOrderNote, getWooOrder, updateWooOrder } from "@/lib/commerce/woocommerce";
import { retrieveCheckoutForm } from "@/lib/payments/iyzico";
import { absoluteUrl } from "@/lib/site";

/**
 * iyzico ödeme sayfasından dönüş (iyzico tarayıcıyla POST eder: token).
 * Token'a tek başına güvenilmez: sonuç iyzico'dan anahtarla imzalı istekle SORULUR ve
 *  - ödeme başarılı, para birimi TRY,
 *  - iyzico'daki sepet = bu sipariş, ödenen tutar ≥ WooCommerce sipariş toplamı,
 * ise sipariş "ödendi" yapılır. Sipariş zaten ödenmişse tekrar işlenmez (idempotent).
 */
export async function POST(req: NextRequest) {
  const lang = isLocale(req.nextUrl.searchParams.get("lang")) ? req.nextUrl.searchParams.get("lang")! : "tr";
  const to = (path: string) => NextResponse.redirect(absoluteUrl(localizePath(lang as "tr", path)), 303);

  let token = "";
  try {
    token = String((await req.formData()).get("token") ?? "");
  } catch {}
  if (!/^[A-Za-z0-9-]{10,200}$/.test(token)) return to("/");

  try {
    const r = await retrieveCheckoutForm(token);
    const id = Number(r.basketId ?? r.conversationId);
    const order = Number.isInteger(id) && id > 0 ? await getWooOrder(id) : null;
    if (!order) {
      console.error("[iyzico/callback] sipariş bulunamadı", { basketId: r.basketId, status: r.status, paymentStatus: r.paymentStatus });
      return to("/siparis-takip");
    }
    const done = (ok: boolean) => to(`/siparis/tamamlandi?no=${order.number}${ok ? "" : "&odeme=basarisiz"}`);

    // zaten ödenmiş → yeniden işleme (çift tıklama, geri tuşu, iyzico'nun tekrarlı bildirimi)
    if (["processing", "completed", "on-hold"].includes(order.status)) return done(true);

    const savedToken = order.meta_data.find((m) => m.key === "_flores_iyzico_token")?.value;
    if (r.signatureOk === false) console.warn(`[iyzico/callback] #${order.number}: yanıt imzası doğrulanamadı`);
    // farklı sekmede açılmış eski bir oturumla ödenmiş olabilir — sipariş eşleşmesini sepet kimliği garanti eder
    if (savedToken !== undefined && savedToken !== token) console.warn(`[iyzico/callback] #${order.number}: önceki bir ödeme oturumuyla ödendi`);

    const paid =
      r.status === "success" &&
      r.paymentStatus === "SUCCESS" &&
      r.currency === "TRY" &&
      String(r.basketId) === String(order.id) &&
      Number(r.paidPrice) + 0.01 >= Number(order.total);

    if (paid) {
      await updateWooOrder(order.id, {
        set_paid: true,
        transaction_id: String(r.paymentId ?? ""),
        payment_method: "iyzico",
        payment_method_title: "Kredi / Banka Kartı (iyzico)",
        meta_data: [{ key: "_flores_iyzico_payment_id", value: String(r.paymentId ?? "") }],
      });
      await addWooOrderNote(order.id, `iyzico ödemesi alındı · paymentId ${r.paymentId} · ${r.paidPrice} TRY`);
      return done(true);
    }

    await addWooOrderNote(order.id, `iyzico ödemesi tamamlanmadı: ${r.errorMessage ?? r.paymentStatus ?? r.status}`);
    return done(false);
  } catch (err) {
    console.error("[iyzico/callback]", err);
    return to("/siparis-takip");
  }
}

export function GET() {
  return NextResponse.redirect(absoluteUrl("/"), 303);
}
