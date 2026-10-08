"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizePath } from "./config";
import { useI18n } from "./client";

/** next/link + dil öneki: href="/kahveler" → İngilizcede "/en/kahveler" */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { locale } = useI18n();
  const localized =
    typeof href === "string"
      ? localizePath(locale, href)
      : href.pathname
        ? { ...href, pathname: localizePath(locale, href.pathname) }
        : href;
  return <NextLink href={localized} {...props} />;
}
