import type { MetadataRoute } from "next";

/**
 * Web uygulaması bildirimi — "Ana ekrana ekle" ile Flores, demleme zamanlayıcısıyla açılan
 * bir uygulama gibi çalışır. Çevrimdışı destek: public/sw.js (yalnızca demleme rehberi).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flores Roastery — Demleme",
    short_name: "Flores",
    description: "Saniye saniye demleme zamanlayıcısı, oran hesaplayıcı ve demleme günlüğü.",
    start_url: "/demleme-rehberi",
    scope: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "tr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Demleme günlüğü", url: "/demleme-rehberi#gunluk" },
      { name: "Kahveler", url: "/kahveler" },
    ],
  };
}
