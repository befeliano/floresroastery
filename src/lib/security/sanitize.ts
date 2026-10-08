/**
 * Girdi temizleme — kullanıcıdan gelen tüm metinler (iletişim formu, sipariş
 * notu, adres...) saklanmadan / iletilmeden önce HTML etiketlerinden ve
 * kontrol karakterlerinden arındırılır.
 */
export function cleanText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/<[^>]*>?/g, "") // HTML etiketleri (yarım kalanlar dahil)
    .replace(/[<>]/g, "") // kalan açılı ayraçlar
    .replace(/javascript:/gi, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // kontrol karakterleri (satır sonu hariç)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

/** Tek satırlık alanlar için (ad, şehir, e-posta...) */
export const cleanLine = (value: unknown, maxLength = 120) => cleanText(value, maxLength).replace(/\s+/g, " ");

export function cleanEmail(value: unknown): string | null {
  const v = cleanLine(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? v : null;
}

/** TR telefon: 05xx / 5xx / +905xx → +905xxxxxxxxx */
export function cleanPhone(value: unknown): string | null {
  const digits = cleanLine(value, 30).replace(/\D/g, "");
  const local = digits.replace(/^(90|0)/, "");
  return /^5\d{9}$/.test(local) ? `+90${local}` : null;
}

export const isSlug = (v: unknown): v is string => typeof v === "string" && /^[a-z0-9-]{1,120}$/.test(v);
