import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * WooCommerce webhook'u (ürün oluşturuldu / güncellendi / silindi) buraya
 * POST eder: https://site/api/revalidate?secret=REVALIDATE_SECRET
 * Katalog önbelleği ve sitemap yenilenir. WordPress snippet'i ürün kaydedilince otomatik çağırır.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  const given = req.nextUrl.searchParams.get("secret") ?? "";
  const ok = !!expected && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  // ?tag=settings → Flores Ayarları (gramaj, süt fiyatı); varsayılan: ürünler (ad, fiyat, stok, yeni ürün)
  const tag = req.nextUrl.searchParams.get("tag") === "settings" ? "settings" : "products";
  revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: tag });
}
