import { NextResponse, type NextRequest } from "next/server";
import { sendPasswordReset } from "@/lib/commerce/customers";
import { canCreateWooOrders } from "@/lib/commerce/woocommerce";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanLine } from "@/lib/security/sanitize";

/** Şifremi unuttum — WooCommerce'in sıfırlama e-postası gönderilir; hesap var/yok bilgisi verilmez */
export async function POST(req: NextRequest) {
  const g = await guard(req, "reset", LIMITS.reset, 1_000);
  if ("response" in g) return g.response;
  if (!canCreateWooOrders()) return jsonError("Şifre sıfırlama şu an kullanılamıyor.", 503);

  const login = cleanLine(g.body.email, 254);
  if (!login) return jsonError("E-posta adresinizi yazın.", 422);
  try {
    await sendPasswordReset(login);
  } catch (err) {
    console.error("[auth/reset]", err);
    return jsonError("Şifre sıfırlama e-postası şu an gönderilemedi, lütfen biraz sonra tekrar deneyin.", 503);
  }
  return NextResponse.json({ ok: true, message: "Bu adresle kayıtlı bir hesap varsa şifre sıfırlama bağlantısını e-postanıza gönderdik." });
}
