import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/commerce/types";
import { absoluteUrl, site } from "@/lib/site";

/**
 * Schema.org yapılandırılmış veri — Google zengin sonuçlar (ürün fiyatı/stok, işletme,
 * içerik izi, SSS, demleme adımları). Kurallar: yalnızca sayfada gerçekten görünen bilgi.
 */

const inLang: Record<Locale, string> = { tr: "tr-TR", en: "en", id: "id" };

/** Hizmet verdiğimiz şehirler — yerel SEO (kargo Türkiye geneli, kurye Eskişehir) */
export const SERVED_CITIES = ["Eskişehir", "İstanbul", "Ankara", "Bursa", "İzmir", "Antalya", "Kocaeli", "Konya", "Bilecik", "Kütahya", "Afyonkarahisar"];

export const organizationSchema = () => ({
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: site.name,
  alternateName: ["Flores Kahve", "Flores Coffee", "Flores Roastery Eskişehir"],
  url: site.url,
  logo: absoluteUrl("/logo-og.png"),
  legalName: site.company.legalName,
  email: site.email,
  telephone: site.phone,
  slogan: site.tagline,
  sameAs: [site.instagram.url],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hoşnudiye Mah. İsmet İnönü-1 Blv. Kazım Önal İş Merkezi No: 43 D: 20",
    addressLocality: "Tepebaşı",
    addressRegion: "Eskişehir",
    addressCountry: "TR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.phone,
    email: site.email,
    contactType: "customer service",
    areaServed: "TR",
    availableLanguage: ["Turkish", "English"],
  },
});

export const storeSchema = () => ({
  "@type": ["CafeOrCoffeeShop", "Store"],
  "@id": absoluteUrl("/#store"),
  name: site.store.name,
  description:
    "Eskişehir Tepebaşı'nda specialty (3. nesil) kahve kavurma atölyesi ve coffee bar. Endonezya, Etiyopya, Kolombiya ve El Salvador çekirdek kahveleri; V60, filtre ve espresso için taze kavrum.",
  url: site.url,
  image: [absoluteUrl("/photos/roastery-kuban.webp"), absoluteUrl("/photos/v60-bar.webp")],
  logo: absoluteUrl("/logo-og.png"),
  telephone: site.phone,
  email: site.email,
  priceRange: "₺₺",
  servesCuisine: "Specialty coffee",
  currenciesAccepted: "TRY",
  paymentAccepted: "Credit Card, Debit Card, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Merkez Yeni Mah. Kanaat Sok. No: 8/A",
    postalCode: "26004",
    addressLocality: "Tepebaşı",
    addressRegion: "Eskişehir",
    addressCountry: "TR",
  },
  hasMap: site.store.mapsUrl,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "13:00",
      closes: "20:00",
    },
  ],
  areaServed: SERVED_CITIES.map((name) => ({ "@type": "City", name })),
  sameAs: [site.instagram.url],
  parentOrganization: { "@id": absoluteUrl("/#organization") },
});

export const websiteSchema = (locale: Locale = "tr") => ({
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: site.name,
  url: site.url,
  inLanguage: inLang[locale],
  publisher: { "@id": absoluteUrl("/#organization") },
});

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function articleSchema(a: { title: string; description: string; path: string; image: string; date: string; locale?: Locale }) {
  return {
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: absoluteUrl(a.image),
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: inLang[a.locale ?? "tr"],
    mainEntityOfPage: absoluteUrl(a.path),
    author: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function howToSchema(h: { name: string; description: string; totalSeconds: number; steps: { name: string; text: string }[]; supplies: string[] }) {
  return {
    "@type": "HowTo",
    name: h.name,
    description: h.description,
    totalTime: `PT${Math.round(h.totalSeconds / 60)}M${h.totalSeconds % 60}S`,
    supply: h.supplies.map((name) => ({ "@type": "HowToSupply", name })),
    step: h.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
  };
}

/** Google "satıcı listelemesi" için kargo ve iade bilgisi (site.ts kurallarıyla aynı) */
const shippingDetails = () => [
  {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: site.shipping.fee, currency: "TRY" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "TR" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
    },
  },
];

const returnPolicy = () => ({
  "@type": "MerchantReturnPolicy",
  applicableCountry: "TR",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
  merchantReturnLink: absoluteUrl("/teslimat-ve-iade-sartlari"),
});

export function productSchema(product: Product, path = `/kahveler/${product.slug}`, locale: Locale = "tr") {
  const url = absoluteUrl(path);
  const prices = product.variants.map((v) => v.price);
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.fullName,
    description: product.description,
    inLanguage: inLang[locale],
    image: [absoluteUrl(product.image.card), absoluteUrl(product.image.front)],
    sku: product.variants[0]?.sku || undefined,
    brand: { "@type": "Brand", name: site.name },
    category: "Food, Beverages & Tobacco > Beverages > Coffee",
    countryOfOrigin: product.origin.country,
    additionalProperty: [
      ...(product.elevation ? [{ "@type": "PropertyValue", name: "Altitude", value: product.elevation }] : []),
      { "@type": "PropertyValue", name: "Process", value: product.process },
      ...(product.variety.length ? [{ "@type": "PropertyValue", name: "Variety", value: product.variety.join(", ") }] : []),
      ...(product.harvest ? [{ "@type": "PropertyValue", name: "Harvest", value: product.harvest }] : []),
      { "@type": "PropertyValue", name: "Roast", value: product.roastLevel },
      { "@type": "PropertyValue", name: "Tasting notes", value: product.tastingNotes.map((n) => n.label).join(", ") },
    ],
    // Fiyatı bilinmeyen (varyantsız) ürünlerde teklif bildirilmez
    ...(product.variants.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "TRY",
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: product.variants.length,
            availability: product.variants.some((v) => v.inStock) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url,
            seller: { "@id": absoluteUrl("/#organization") },
            offers: product.variants.map((v) => ({
              "@type": "Offer",
              sku: v.sku || undefined,
              name: `${product.fullName} ${v.label}`,
              price: v.price,
              priceCurrency: "TRY",
              itemCondition: "https://schema.org/NewCondition",
              availability: v.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url,
              shippingDetails: shippingDetails(),
              hasMerchantReturnPolicy: returnPolicy(),
            })),
          },
        }
      : {}),
    // Yalnızca gerçek değerlendirme varsa eklenir (sahte puan Google cezası getirir)
    ...(product.rating
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating.value, reviewCount: product.rating.count } }
      : {}),
  };
}
