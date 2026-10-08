import { NextResponse, type NextRequest } from "next/server";
import { BUSINESS_TYPES, MONTHLY_VOLUMES, PRIVATE_LABEL } from "@/content/wholesale";
import { db } from "@/lib/orders/store";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail, cleanLine, cleanPhone, cleanText } from "@/lib/security/sanitize";

const pick = (v: unknown, list: readonly string[]) => (list.includes(String(v)) ? String(v) : "");

/** Toptan (B2B) teklif talebi */
export async function POST(req: NextRequest) {
  const g = await guard(req, "wholesale", LIMITS.form);
  if ("response" in g) return g.response;
  const b = g.body;

  if (typeof b.website === "string" && b.website.length > 0) return NextResponse.json({ message: "Talebiniz alındı." });

  const name = cleanLine(b.name, 80);
  const business = cleanLine(b.business, 120);
  const email = cleanEmail(b.email);
  const phone = b.phone ? cleanPhone(b.phone) : null;

  if (name.length < 2) return jsonError("Lütfen adınızı yazın.");
  if (business.length < 2) return jsonError("Lütfen işletme adınızı yazın.");
  if (!email) return jsonError("Lütfen geçerli bir e-posta adresi girin.");
  if (b.phone && !phone) return jsonError("Telefon numarası 05XX XXX XX XX biçiminde olmalı.");
  if (b.kvkk !== true) return jsonError("Devam etmek için KVKK aydınlatma metnini onaylayın.");

  const message = [
    `İşletme: ${business}`,
    `Tür: ${pick(b.type, BUSINESS_TYPES) || "-"}`,
    `Aylık miktar: ${pick(b.volume, MONTHLY_VOLUMES) || "-"}`,
    `Private label: ${pick(b.privateLabel, PRIVATE_LABEL) || "-"}`,
    `Telefon: ${phone ?? "-"}`,
    `Not: ${cleanText(b.notes, 2000) || "-"}`,
  ].join("\n");

  // TODO: e-posta servisine (Resend / SMTP) iletin — info@floresroastery.com
  db.messages.push({ at: new Date().toISOString(), name, email, subject: "Toptan teklif", message });
  return NextResponse.json({ message: "24 saat içinde işletmenize özel teklifi hazırlayıp size ulaşacağız." });
}
