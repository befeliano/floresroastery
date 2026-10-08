/**
 * Diller — Türkçe varsayılan ve öneksiz (/kahveler), diğerleri önekli (/en/kahveler, /id/kahveler).
 * Yönlendirme: src/proxy.ts · sayfalar: src/app/[lang]/
 */
export const locales = ["tr", "en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (locales as readonly string[]).includes(v);

export const localeMeta: Record<Locale, { label: string; short: string; intl: string; og: string }> = {
  tr: { label: "Türkçe", short: "TR", intl: "tr-TR", og: "tr_TR" },
  en: { label: "English", short: "EN", intl: "en-GB", og: "en_US" },
  id: { label: "Bahasa Indonesia", short: "ID", intl: "id-ID", og: "id_ID" },
};

/** Site içi yol → dile göre yol ("/kahveler", "en" → "/en/kahveler"); dış bağlantı ve /api dokunulmaz */
export function localizePath(locale: Locale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/api/") || path.startsWith("/_next/")) return path;
  const { path: bare } = splitLocale(path);
  if (locale === defaultLocale) return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

/** "/en/kahveler?x=1" → { locale: "en", path: "/kahveler?x=1" } */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const m = /^\/(tr|en|id)(?=\/|$|\?|#)/.exec(pathname);
  if (!m) return { locale: defaultLocale, path: pathname || "/" };
  const rest = pathname.slice(m[0].length);
  return { locale: m[1] as Locale, path: rest.startsWith("/") ? rest : `/${rest}` };
}

/** Basit yer tutucu: fmt("{price}'den", { price: "₺300" }) */
export const fmt = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
