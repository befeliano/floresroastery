import "server-only";

/**
 * iyzico doğrudan entegrasyon ayarları — YALNIZCA sunucu ortam değişkenlerinden.
 * Anahtarlar Bağır'ın kendi iyzico üye işyeri hesabınındır; para doğrudan o hesaba geçer.
 *   IYZICO_API_KEY      iyzico panel → Ayarlar → Firma Ayarları → API Anahtarı
 *   IYZICO_SECRET_KEY   aynı yerdeki Güvenlik Anahtarı
 *   IYZICO_BASE_URL     canlı: https://api.iyzipay.com  ·  test: https://sandbox-api.iyzipay.com
 * Tanımlı değilse kartlı ödeme eskisi gibi WordPress'teki iyzico eklentisinden alınır.
 */
export function iyzicoConfig() {
  const apiKey = process.env.IYZICO_API_KEY?.trim();
  const secretKey = process.env.IYZICO_SECRET_KEY?.trim();
  if (!apiKey || !secretKey) return null;
  const base = (process.env.IYZICO_BASE_URL?.trim() || "https://api.iyzipay.com").replace(/\/$/, "");
  // yalnızca iyzico'nun kendi alan adlarına istek atılır (yanlış yapılandırmada anahtar sızmasın)
  // geliştirmede yerel sahte sunucuya izin (yalnızca NODE_ENV !== production)
  const devMock = process.env.NODE_ENV !== "production" && /^http:\/\/127\.0\.0\.1:\d+$/.test(base);
  if (!devMock && !/^https:\/\/(sandbox-)?api\.iyzipay\.com$/.test(base)) return null;
  return { apiKey, secretKey, base, sandbox: base.includes("sandbox") };
}

export const isIyzicoDirect = () => iyzicoConfig() !== null;
