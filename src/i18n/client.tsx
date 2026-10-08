"use client";

import { createContext, useContext } from "react";
import { setApiTable } from "@/lib/api-client";
import { fmt, localizePath, localeMeta, type Locale } from "./config";
import { translateWith, type ApiTable } from "./messages/api";
import type { Ui } from "./messages/ui";

const I18nContext = createContext<{ locale: Locale; t: Ui; api: ApiTable } | null>(null);

/** Kök layout'ta: yalnızca seçili dilin arayüz metinleri ve API çeviri tablosu istemciye gider */
export function I18nProvider({ locale, t, api, children }: { locale: Locale; t: Ui; api: ApiTable; children: React.ReactNode }) {
  // postJson gibi hook dışı yardımcılar da API mesajlarını çevirebilsin
  setApiTable(api);
  return <I18nContext.Provider value={{ locale, t, api }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n: I18nProvider bulunamadı");
  return {
    locale: ctx.locale,
    t: ctx.t,
    fmt,
    intl: localeMeta[ctx.locale].intl,
    href: (path: string) => localizePath(ctx.locale, path),
    /** API'den gelen (Türkçe) mesajı seçili dile çevirir */
    tApi: (msg: string | null | undefined) => translateWith(ctx.api, msg),
    /** Kayıtlı öğütme değeri (Türkçe anahtar) → etiket */
    grind: (value: string) => ctx.t.grind[value] ?? value,
  };
}
