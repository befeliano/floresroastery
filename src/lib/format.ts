const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => priceFormatter.format(value);

/** 75 → "1:15" */
export const formatClock = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export const upperTR = (s: string) => s.toLocaleUpperCase("tr-TR");

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });
export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));

/** Hex rengin algılanan parlaklığı (0–1) — paket üzerindeki logo varyantını seçmek için */
export function luminance(hex: string) {
  const v = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
