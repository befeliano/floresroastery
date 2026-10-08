import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, type Limit } from "./rate-limit";

export const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

export const jsonError = (error: string, status = 400, headers?: HeadersInit) => NextResponse.json({ error }, { status, headers });

/**
 * Tüm POST API rotalarının ortak kapısı:
 *  1. Aynı-köken kontrolü (CSRF'e karşı Origin başlığı doğrulaması)
 *  2. IP tabanlı hız sınırı
 *  3. Content-Type ve gövde boyutu sınırı
 * Başarılıysa ayrıştırılmış JSON gövdesini döndürür.
 */
export async function guard(
  req: NextRequest,
  bucket: string,
  limit: Limit,
  maxBytes = 16_000,
): Promise<{ body: Record<string, unknown> } | { response: NextResponse }> {
  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    let sameOrigin = false;
    try {
      sameOrigin = new URL(origin).host === host;
    } catch {}
    if (!sameOrigin) return { response: jsonError("Geçersiz istek kaynağı.", 403) };
  }

  const rl = rateLimit(`${bucket}:${clientIp(req)}`, limit);
  if (!rl.ok) {
    return {
      response: jsonError(`Çok fazla deneme yaptınız. Lütfen ${Math.ceil(rl.retryAfter / 60)} dakika sonra tekrar deneyin.`, 429, {
        "Retry-After": String(rl.retryAfter),
      }),
    };
  }

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return { response: jsonError("İstek biçimi desteklenmiyor.", 415) };
  }
  const raw = await req.text();
  if (raw.length > maxBytes) return { response: jsonError("İstek çok büyük.", 413) };
  try {
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return { body };
  } catch {
    return { response: jsonError("Geçersiz veri.", 400) };
  }
}

/** İsteğin geldiği sayfanın dili (Referer: /en/odeme → "en") — API yönlendirmelerinde kullanılır */
export function refererLocale(req: NextRequest): "tr" | "en" | "id" {
  try {
    const seg = new URL(req.headers.get("referer") ?? "/", "http://x").pathname.split("/")[1];
    return seg === "en" || seg === "id" ? seg : "tr";
  } catch {
    return "tr";
  }
}
