"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { localeMeta, localizePath, locales, splitLocale } from "@/i18n/config";

/** TR · EN · ID — aynı sayfanın diğer dildeki karşılığına geçer */
export function LanguageSwitcher({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const { path } = splitLocale(pathname);

  return (
    <nav aria-label={t.nav.language} className={`flex items-center gap-1 ${className}`}>
      {locales.map((l) => (
        <NextLink
          key={l}
          href={localizePath(l, path)}
          hrefLang={l}
          lang={l}
          onClick={onNavigate}
          aria-current={l === locale ? "true" : undefined}
          title={localeMeta[l].label}
          className={`rounded-full px-2 py-1 font-mono text-[0.68rem] tracking-wider transition-colors ${
            l === locale ? "bg-cream-50/10 text-cream-50" : "text-cream-400 hover:text-flores-300"
          }`}
        >
          {localeMeta[l].short}
        </NextLink>
      ))}
    </nav>
  );
}
