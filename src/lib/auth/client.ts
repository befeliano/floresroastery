"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const hasFlag = () => document.cookie.split("; ").includes("flores_auth=1");

/**
 * Giriş yapılmış mı? — httpOnly oturum çerezinin yanındaki kişisel veri içermeyen
 * bayraktan okunur (yalnızca arayüz için; yetki her zaman sunucuda doğrulanır).
 */
export const useLoggedIn = () => useSyncExternalStore(noop, hasFlag, () => false);

/** Girişten sonra dönülecek sayfa — yalnızca site içi yollar (açık yönlendirmeye karşı) */
export function nextPath(fallback = "/hesabim") {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
