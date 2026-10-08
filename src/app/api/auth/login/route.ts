import { NextResponse, type NextRequest } from "next/server";
import { isAuthAvailable, startSession } from "@/lib/auth/session";
import { getCustomer, verifyCredentials } from "@/lib/commerce/customers";
import { canCreateWooOrders } from "@/lib/commerce/woocommerce";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanLine } from "@/lib/security/sanitize";

const INVALID = "E-posta adresi veya şifre hatalı.";

/**
 * Üye girişi — floresroastery.com'daki (WordPress/WooCommerce) mevcut hesaplarla.
 * Şifre WordPress'te doğrulanır, burada saklanmaz. IP başına 15 dakikada 5 deneme.
 * Başarılı girişte imzalı, httpOnly + SameSite=Lax oturum çerezi verilir.
 */
export async function POST(req: NextRequest) {
  const g = await guard(req, "login", LIMITS.login, 1_000);
  if ("response" in g) return g.response;
  if (!canCreateWooOrders() || !isAuthAvailable()) {
    return jsonError("Üyelik sistemi şu an kullanılamıyor. Misafir olarak sipariş verebilirsiniz.", 503);
  }

  // e-posta ya da WordPress kullanıcı adı
  const login = cleanLine(g.body.email, 254);
  const password = typeof g.body.password === "string" ? g.body.password.slice(0, 200) : "";
  if (!login || !password) return jsonError(INVALID, 401);

  try {
    const user = await verifyCredentials(login, password);
    if (!user) return jsonError(INVALID, 401);
    const customer = await getCustomer(user.id);
    const name = customer?.first_name || user.email.split("@")[0];
    await startSession({ id: user.id, email: user.email, name });
    return NextResponse.json({ ok: true, name });
  } catch (err) {
    console.error("[auth/login]", err);
    return jsonError("Giriş şu an yapılamıyor, lütfen biraz sonra tekrar deneyin.", 503);
  }
}
