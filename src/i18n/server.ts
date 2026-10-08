import { lang } from "next/root-params";
import { defaultLocale, isLocale, localeMeta, localizePath, locales, type Locale } from "./config";
import { select } from "./select";

/** Geçerli dil — sunucu bileşenlerinde ve sunucu yardımcılarında (route handler'larda değil) */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  return isLocale(l) ? l : defaultLocale;
}

/** Mesaj ağacını geçerli dile indirger */
export async function t<T>(tree: T) {
  return select(tree, await getLocale());
}

/** canonical + hreflang (tr, en, id, x-default) */
export async function alternates(path: string) {
  const locale = await getLocale();
  return {
    canonical: localizePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizePath(l, path)])),
      "x-default": localizePath(defaultLocale, path),
    },
  };
}

export async function ogLocale() {
  const locale = await getLocale();
  return { locale: localeMeta[locale].og, alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].og) };
}

export async function href(path: string) {
  return localizePath(await getLocale(), path);
}

/** Fotoğraflar — açıklama (alt) metni seçili dilde */
export async function localPhotos() {
  const { photos } = await import("@/lib/photos");
  const { pages } = await import("./messages/pages");
  const alts = await t(pages.photos);
  return Object.fromEntries(Object.entries(photos).map(([k, p]) => [k, { ...p, alt: alts[k as keyof typeof alts] ?? p.alt }])) as {
    [K in keyof typeof photos]: { src: string; alt: string };
  };
}
