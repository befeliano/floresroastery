import { NextResponse, type NextRequest } from "next/server";
import { priceCart } from "@/lib/orders/pricing";
import { guard } from "@/lib/security/guard";

/** Ödeme sayfası için sunucu tarafında doğrulanmış sepet özeti (kargo seçenekleri + kupon dahil) */
export async function POST(req: NextRequest) {
  const g = await guard(req, "quote", { limit: 60, windowMs: 60_000 });
  if ("response" in g) return g.response;
  const quote = await priceCart(g.body.items, {
    city: g.body.city,
    shippingMethod: g.body.shippingMethod,
    couponCode: g.body.couponCode,
  });
  return NextResponse.json(quote);
}
