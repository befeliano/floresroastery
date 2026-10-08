import { NextResponse, type NextRequest } from "next/server";
import { RETURN_REASONS } from "@/lib/orders/constants";
import { db, newReturnId } from "@/lib/orders/store";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail, cleanLine, cleanPhone, cleanText } from "@/lib/security/sanitize";

/** Cayma / iade bildirimi (Mesafeli Sözleşmeler Yönetmeliği — cayma formu) */
export async function POST(req: NextRequest) {
  const g = await guard(req, "returns", LIMITS.form);
  if ("response" in g) return g.response;
  const b = g.body;

  const orderNumber = cleanLine(b.orderNumber, 30).toUpperCase();
  const name = cleanLine(b.name, 80);
  const email = cleanEmail(b.email);
  const phone = b.phone ? cleanPhone(b.phone) : null;
  const reason = (RETURN_REASONS as readonly string[]).includes(String(b.reason)) ? String(b.reason) : "";
  const details = cleanText(b.details, 2000);

  if (!/^[A-Z0-9-]{4,30}$/.test(orderNumber)) return jsonError("Lütfen sipariş numaranızı yazın.");
  if (name.length < 2) return jsonError("Lütfen adınızı ve soyadınızı yazın.");
  if (!email) return jsonError("Lütfen geçerli bir e-posta adresi girin.");
  if (b.phone && !phone) return jsonError("Telefon numarası 05XX XXX XX XX biçiminde olmalı.");
  if (!reason) return jsonError("Lütfen bir iade nedeni seçin.");
  if (b.kvkk !== true) return jsonError("Devam etmek için KVKK aydınlatma metnini onaylayın.");

  const id = newReturnId();
  db.returns.push({ id, createdAt: new Date().toISOString(), orderNumber, name, email, phone: phone ?? undefined, reason, details });
  // TODO: talebi e-posta ile info@floresroastery.com'a ve müşteriye iletin
  return NextResponse.json({
    id,
    message: `Talebiniz alındı. Takip numaranız: ${id}. Bildiriminiz bize ulaştığı tarihten itibaren yasal süreler içinde dönüş yapacağız.`,
  });
}
