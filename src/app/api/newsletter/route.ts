import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/orders/store";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail } from "@/lib/security/sanitize";

export async function POST(req: NextRequest) {
  const g = await guard(req, "newsletter", LIMITS.form, 2_000);
  if ("response" in g) return g.response;

  const email = cleanEmail(g.body.email);
  if (!email) return jsonError("Lütfen geçerli bir e-posta adresi girin.");

  // TODO: e-bülten sağlayıcısına (Mailchimp, Brevo vb.) ve İYS'ye aktarın
  db.newsletter.add(email);
  return NextResponse.json({ message: "Teşekkürler! Bahçemize hoş geldiniz." });
}
