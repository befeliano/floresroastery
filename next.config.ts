import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/** WordPress görselleri (otomatik eklenen ürünler) — WOOCOMMERCE_URL'nin alan adı + bilinen adresler */
const wpHosts = Array.from(
  new Set(
    ["floresroastery.com", "www.floresroastery.com", "panel.floresroastery.com", process.env.WOOCOMMERCE_URL ? new URL(process.env.WOOCOMMERCE_URL).hostname : ""].filter(
      (h) => h && h !== "127.0.0.1",
    ),
  ),
);

/**
 * Content-Security-Policy
 *
 * Statik (nonce'suz) CSP kullanılıyor: nonce, tüm sayfaları dinamik render'a
 * zorlar ve ürün sayfalarının SSG avantajını yok eder. Next.js hydration için
 * inline script enjekte ettiğinden script-src 'unsafe-inline' gerekir; bunun
 * dışındaki tüm kaynaklar yalnızca kendi alan adımız + ödeme sağlayıcılarıyla
 * sınırlandırıldı.
 */
const paymentFrames = [
  // Coffee Bar tadım randevusu formu (/coffee-bar sayfasına gömülü)
  "https://randevu.floresroastery.com",
  "https://*.iyzipay.com",
  "https://www.paytr.com",
  "https://js.stripe.com",
  "https://hooks.stripe.com",
];

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  `frame-src ${paymentFrames.join(" ")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // HSTS yalnızca production'da (localhost'a HSTS göndermek tarayıcıyı bozar)
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // yüksek kalite: fotoğraflar 85–90 ile sunulur (ana sayfa kalitesi)
    qualities: [60, 75, 85, 90],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: wpHosts.map((hostname) => ({ protocol: "https" as const, hostname, pathname: "/wp-content/uploads/**" })),
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  /** Mevcut WordPress/WooCommerce sitesindeki URL'ler → yeni yapı (301, SEO değeri korunur) */
  async redirects() {
    return [
      { source: "/product/ethiopia-mitima-shantawene-natural-2", destination: "/kahveler/watermelon-colombia", permanent: true },
      { source: "/product/:slug", destination: "/kahveler/:slug", permanent: true },
      { source: "/product-category/:path*", destination: "/kahveler", permanent: true },
      { source: "/our-shop", destination: "/kahveler", permanent: true },
      { source: "/shop", destination: "/kahveler", permanent: true },
      { source: "/about", destination: "/hikayemiz", permanent: true },
      { source: "/contact", destination: "/iletisim", permanent: true },
      { source: "/cart", destination: "/odeme", permanent: false },
      { source: "/checkout", destination: "/odeme", permanent: false },
      { source: "/my-account", destination: "/giris", permanent: false },
      // WordPress panel.floresroastery.com'a taşındı: eski görsel/dosya linkleri (iyzico logosu,
      // eski e-postalar, Google Görseller) oraya gitsin. Kalıcı değil: panel adresi değişirse izlenebilsin.
      ...(process.env.WOOCOMMERCE_URL &&
      // aynı adres olursa sonsuz döngü olur
      new URL(process.env.WOOCOMMERCE_URL).host !== new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost").host
        ? [{ source: "/wp-content/:path*", destination: `${process.env.WOOCOMMERCE_URL.replace(/\/$/, "")}/wp-content/:path*`, permanent: false }]
        : []),
    ];
  },
};

export default nextConfig;
