"use client";

/**
 * Sipariş kaynağı (WooCommerce "Menşe" sütunu). Ziyaretin ilk sayfasında yakalanır,
 * sekme kapanana kadar saklanır ve siparişle birlikte gönderilir. Kişisel veri içermez.
 * source_type: typein = Doğrudan · organic = Organik (Google…) · referral = Yönlendirme · utm = kampanya
 */
export interface Attribution {
  source_type: "typein" | "organic" | "referral" | "utm";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  entry?: string;
  device?: "Mobile" | "Tablet" | "Desktop";
}

const KEY = "flores-attr";
const SEARCH = /(^|\.)(google|bing|yandex|duckduckgo|yahoo|ecosia|baidu|naver)\./i;

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const url = new URL(window.location.href);
    const ref = document.referrer ? new URL(document.referrer) : null;
    const external = ref && ref.host !== url.host ? ref : null;
    const utm = url.searchParams.get("utm_source");
    const a: Attribution = utm
      ? {
          source_type: "utm",
          utm_source: utm,
          utm_medium: url.searchParams.get("utm_medium") ?? undefined,
          utm_campaign: url.searchParams.get("utm_campaign") ?? undefined,
        }
      : external
        ? SEARCH.test(external.host)
          ? { source_type: "organic", utm_source: external.host.replace(/^www\./, "").split(".")[0], utm_medium: "organic" }
          : { source_type: "referral", utm_source: external.host.replace(/^www\./, ""), utm_medium: "referral" }
        : { source_type: "typein" };
    a.referrer = external?.origin;
    a.entry = url.origin + url.pathname;
    a.device = /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : /iPad|Tablet/i.test(navigator.userAgent) ? "Tablet" : "Desktop";
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {}
}

export function readAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {}
  return { source_type: "typein" };
}
