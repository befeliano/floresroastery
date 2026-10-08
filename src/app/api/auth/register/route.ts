import { NextResponse, type NextRequest } from "next/server";
import { isAuthAvailable, startSession } from "@/lib/auth/session";
import { registerCustomer } from "@/lib/commerce/customers";
import { canCreateWooOrders } from "@/lib/commerce/woocommerce";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail, cleanLine } from "@/lib/security/sanitize";

/** Üye ol — hesap WooCommerce'te açılır (WordPress'teki müşteri hesabıyla aynı) */
export async function POST(req: NextRequest) {
  const g = await guard(req, "register", LIMITS.register, 2_000);
  if ("response" in g) return g.response;
  if (!canCreateWooOrders() || !isAuthAvailable()) {
    return jsonError("Üyelik sistemi şu an kullanılamıyor. Misafir olarak sipariş verebilirsiniz.", 503);
  }

  const b = g.body;
  const firstName = cleanLine(b.firstName, 60);
  const lastName = cleanLine(b.lastName, 60);
  const email = cleanEmail(b.email);
  const password = typeof b.password === "string" ? b.password : "";

  const fieldErrors: Record<string, string> = {};
  if (firstName.length < 2) fieldErrors.firstName = "Adınızı yazın.";
  if (lastName.length < 2) fieldErrors.lastName = "Soyadınızı yazın.";
  if (!email) fieldErrors.email = "Geçerli bir e-posta adresi girin.";
  if (password.length < 8 || password.length > 200) fieldErrors.password = "Şifre en az 8 karakter olmalı.";
  if (b.kvkk !== true) fieldErrors.kvkk = "Devam etmek için KVKK Aydınlatma Metni'ni onaylayın.";
  if (Object.keys(fieldErrors).length) return NextResponse.json({ error: "Lütfen işaretli alanları kontrol edin.", fieldErrors }, { status: 422 });

  try {
    const result = await registerCustomer({ email: email!, firstName, lastName, password });
    if (!result.ok) {
      return result.reason === "exists"
        ? jsonError("Bu e-posta adresiyle bir hesap zaten var. Giriş yapın ya da şifrenizi sıfırlayın.", 409)
        : jsonError(result.message?.replace(/<[^>]*>/g, "") || "Hesap oluşturulamadı, bilgilerinizi kontrol edin.", 422);
    }
    await startSession({ id: result.customer.id, email: result.customer.email, name: firstName });
    return NextResponse.json({ ok: true, name: firstName });
  } catch (err) {
    console.error("[auth/register]", err);
    return jsonError("Hesap şu an oluşturulamadı, lütfen biraz sonra tekrar deneyin.", 503);
  }
}
