import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCustomer, toProfile } from "@/lib/commerce/customers";

/** Giriş yapmış müşterinin profili (ödeme formunu doldurmak için) */
export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null }, { headers });
  try {
    const customer = await getCustomer(session.sub);
    return NextResponse.json({ user: customer ? toProfile(customer) : null }, { headers });
  } catch (err) {
    console.error("[auth/me]", err);
    // WooCommerce'e ulaşılamasa da oturum bilgisi yeterli
    return NextResponse.json({ user: { id: session.sub, email: session.email, firstName: session.name } }, { headers });
  }
}
