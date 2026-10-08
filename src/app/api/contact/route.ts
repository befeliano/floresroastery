import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/orders/store";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail, cleanLine, cleanText } from "@/lib/security/sanitize";

export async function POST(req: NextRequest) {
  const g = await guard(req, "contact", LIMITS.form);
  if ("response" in g) return g.response;
  const b = g.body;

  // bal küpü: botlar gizli alanı doldurur
  if (typeof b.website === "string" && b.website.length > 0) return NextResponse.json({ message: "Mesajınız alındı." });

  const name = cleanLine(b.name, 80);
  const email = cleanEmail(b.email);
  const subject = cleanLine(b.subject, 120) || "Genel";
  const message = cleanText(b.message, 3000);

  if (name.length < 2) return jsonError("Lütfen adınızı yazın.");
  if (!email) return jsonError("Lütfen geçerli bir e-posta adresi girin.");
  if (message.length < 10) return jsonError("Mesajınız en az 10 karakter olmalı.");
  if (b.kvkk !== true) return jsonError("Devam etmek için KVKK aydınlatma metnini onaylayın.");

  // TODO: e-posta servisine (SMTP / Resend) iletin — info@floresroastery.com
  db.messages.push({ at: new Date().toISOString(), name, email, subject, message });
  return NextResponse.json({ message: "Mesajınız bize ulaştı. En kısa sürede dönüş yapacağız." });
}
