import { NextResponse, type NextRequest } from "next/server";
import { endSession } from "@/lib/auth/session";
import { guard } from "@/lib/security/guard";
import { LIMITS } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const g = await guard(req, "logout", LIMITS.lookup, 200);
  if ("response" in g) return g.response;
  await endSession();
  return NextResponse.json({ ok: true });
}
