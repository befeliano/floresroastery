export const site = {
  name: "Flores Roastery",
  shortName: "Flores",
  tagline: "Where every bean has a story",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "tr_TR",
  description:
    "Flores Roastery — Eskişehir'de kalpten kavrulan specialty kahve. Endonezya'dan doğrudan ticaret Ruso Exotics serisi, Etiyopya Sidamo Manis dahil tek kökenli kahveler ve Pagi, Tanah harmanları; her kahve için künye ve saniye saniye demleme rehberi.",
  about:
    "Flores Roastery, basit bir inançla doğdu: Harika kahve sadece tadılmamalı, hissedilmelidir. Kalpten kavuruyoruz; kahvenin kaynağından fincana uzanan yolculuğuna saygı duyuyoruz.",
  company: {
    legalName: "FLORES GIDA VE DIŞ TİCARET LİMİTED ŞİRKETİ",
    address: "Hoşnudiye Mah. İsmet İnönü-1 Blv. Kazım Önal İş Merkezi No: 43 Daire: 20 Tepebaşı / Eskişehir",
  },
  store: {
    name: "Flores Coffee Bar & Roastery",
    address: "Merkez Yeni Mah. Kanaat Sok. No: 8/A, 26004 Tepebaşı / Eskişehir",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Flores+Roastery+Kanaat+8A+Tepeba%C5%9F%C4%B1+Eski%C5%9Fehir",
  },
  email: "info@floresroastery.com",
  phone: "+90 505 920 39 08",
  phoneHref: "tel:+905059203908",
  whatsapp: "https://wa.me/905059203908",
  instagram: { handle: "@floresroastery", url: "https://www.instagram.com/floresroastery/" },
  /** Havale/EFT — TODO: IBAN'ı ekleyin; null iken müşteriye iletişim bilgisi gösterilir */
  bank: {
    holder: "Flores Gıda ve Dış Ticaret Ltd. Şti.",
    name: null as string | null,
    iban: null as string | null,
  },
  links: {
    wholesale: "https://b2b.floresroastery.com/",
    /** B2B konfigüratörü (WordPress eklentisi: gizli ürün → sepet) — WordPress hangi adresteyse orada */
    wholesaleBuilder: `${(process.env.WOOCOMMERCE_URL ?? "https://floresroastery.com").replace(/\/$/, "")}/olustur/`,
    booking: "https://randevu.floresroastery.com/",
  },
  /** Coffee Bar — Kahve Tadım Randevusu (randevu.floresroastery.com) */
  coffeeBar: {
    days: "Çarşamba – Pazar",
    hours: "13:00 – 20:00",
    closed: "Pazartesi ve Salı kapalı",
    capacity: 4,
    /** Kampanya metni — süre bitince null yapın */
    promo: "Ekim boyunca ücretsiz" as string | null,
  },
  /** Kargo kuralları — floresroastery.com WooCommerce gönderim ayarlarıyla aynı */
  shipping: {
    fee: 150,
    freeThreshold: 950 as number | null,
    homeCity: "Eskişehir",
    courierNote: "Teslimatlar hafta içi (Pazartesi–Cuma) saat 16:00'da yapılır. 14:00'ten sonra verilen siparişler bir sonraki iş günü teslim edilir.",
  },
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export type ShippingMethodId = "standard" | "courier" | "pickup";

export interface ShippingOption {
  id: ShippingMethodId;
  label: string;
  detail: string;
  cost: number;
}

/** Şehir ve ara toplama göre kullanılabilir gönderim seçenekleri */
export function shippingOptions(city: string, subtotal: number): ShippingOption[] {
  const s = site.shipping;
  const local = city.trim().toLocaleLowerCase("tr-TR") === s.homeCity.toLocaleLowerCase("tr-TR");
  const freeCargo = s.freeThreshold != null && subtotal >= s.freeThreshold;
  const options: ShippingOption[] = [];
  if (local) {
    options.push({ id: "courier", label: "Eskişehir içi ücretsiz kurye", detail: `Kendi kuryemizle aynı gün teslimat. ${s.courierNote}`, cost: 0 });
  } else {
    options.push(
      freeCargo
        ? { id: "standard", label: "Bedava kargo", detail: `${s.freeThreshold}₺ üzeri siparişlerde kargo bizden.`, cost: 0 }
        : { id: "standard", label: "Kargo — sabit ücret", detail: `Eskişehir dışı gönderimler. ${s.freeThreshold ? `${s.freeThreshold}₺ üzeri ücretsiz.` : ""}`, cost: s.fee },
    );
  }
  options.push({ id: "pickup", label: "Mağazadan teslim al", detail: `${site.store.address} — siparişiniz hazır olunca haber veririz.`, cost: 0 });
  return options;
}

/** Sepet çekmecesi gibi şehrin bilinmediği yerlerde tahmini kargo (Eskişehir dışı varsayımı) */
export const shippingFor = (subtotal: number) => shippingOptions("", subtotal)[0].cost;
