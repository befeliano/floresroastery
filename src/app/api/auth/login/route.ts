import { type NextRequest } from "next/server";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail } from "@/lib/security/sanitize";

/**
 * Üye girişi — kaba kuvvet saldırılarına karşı IP başına 15 dakikada 5 deneme.
 * TODO: WooCommerce müşteri hesaplarıyla doğrulama (JWT Auth eklentisi veya
 * WordPress Application Passwords) bağlandığında burada yapılır; oturum
 * httpOnly + Secure + SameSite=Lax çerezde tutulmalıdır.
 */
export async function POST(req: NextRequest) {
  const g = await guard(req, "login", LIMITS.login, 1_000);
  if ("response" in g) return g.response;

  const email = cleanEmail(g.body.email);
  const password = typeof g.body.password === "string" ? g.body.password : "";
  if (!email || password.length < 6) return jsonError("E-posta adresi veya şifre hatalı.", 401);

  return jsonError(
    "Yeni sitemizde üyelik sistemi çok yakında açılıyor. Siparişlerinizi şimdilik Sipariş Takibi sayfasından izleyebilirsiniz.",
    503,
  );
}
