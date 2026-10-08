import { NextResponse, type NextRequest } from "next/server";
import { getProduct } from "@/lib/commerce";
import { db } from "@/lib/orders/store";
import { guard, jsonError } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";
import { cleanEmail, isSlug } from "@/lib/security/sanitize";

export async function POST(req: NextRequest) {
  const g = await guard(req, "stock-alert", LIMITS.form, 2_000);
  if ("response" in g) return g.response;

  const email = cleanEmail(g.body.email);
  if (!email) return jsonError("Lütfen geçerli bir e-posta adresi girin.");
  const product = isSlug(g.body.slug) ? await getProduct(g.body.slug) : undefined;
  if (!product) return jsonError("Ürün bulunamadı.", 404);

  const set = db.stockAlerts.get(product.slug) ?? new Set<string>();
  set.add(email);
  db.stockAlerts.set(product.slug, set);
  return NextResponse.json({ message: `${product.name} tekrar stoğa girdiğinde size haber vereceğiz.` });
}
