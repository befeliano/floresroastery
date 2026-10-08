import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const PRIVATE = ["/odeme", "/siparis/", "/giris", "/hesabim"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // özel sayfalar her dilde (/en/odeme, /id/hesabim…) taranmasın
        disallow: ["/api/", ...PRIVATE, ...PRIVATE.map((p) => `/en${p}`), ...PRIVATE.map((p) => `/id${p}`)],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
