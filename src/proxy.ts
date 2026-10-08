import { NextResponse, type NextRequest } from "next/server";

/**
 * Dil yönlendirmesi
 * - /en/…, /id/…  → olduğu gibi (src/app/[lang]/…)
 * - /…            → içeride /tr/… olarak sunulur (Türkçe öneksiz kalır, mevcut SEO bozulmaz)
 * - /tr/…         → 308 ile öneksiz adrese (aynı içeriğin iki adresi olmasın)
 * API, statik dosyalar ve kök metadata dosyaları proxy'ye hiç girmez (config.matcher).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === "en" || first === "id") return NextResponse.next();

  if (first === "tr") {
    // Next'in ürettiği /tr/... paylaşım görselleri doğrudan sunulur
    if (pathname.includes("/opengraph-image")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/tr${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // nokta içeren yollar (dosyalar), API, Next iç yolları ve kökteki metadata görselleri hariç
  matcher: ["/((?!api/|_next/|.*\\..*|opengraph-image|twitter-image|icon|apple-icon).*)"],
};
