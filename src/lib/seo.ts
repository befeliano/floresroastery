import type { Product } from "@/lib/commerce/types";
import { absoluteUrl, site } from "@/lib/site";

export const organizationSchema = () => ({
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/logo-og.png"),
  legalName: site.company.legalName,
  email: site.email,
  telephone: site.phone,
  slogan: site.tagline,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hoşnudiye Mah. İsmet İnönü-1 Blv. Kazım Önal İş Merkezi No: 43 D: 20",
    addressLocality: "Tepebaşı",
    addressRegion: "Eskişehir",
    addressCountry: "TR",
  },
});

export const storeSchema = () => ({
  "@type": "CafeOrCoffeeShop",
  "@id": absoluteUrl("/#store"),
  name: site.store.name,
  url: site.url,
  image: absoluteUrl("/photos/roastery-kuban.webp"),
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Merkez Yeni Mah. Kanaat Sok. No: 8/A",
    postalCode: "26004",
    addressLocality: "Tepebaşı",
    addressRegion: "Eskişehir",
    addressCountry: "TR",
  },
  parentOrganization: { "@id": absoluteUrl("/#organization") },
});

export const websiteSchema = () => ({
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: site.name,
  url: site.url,
  inLanguage: "tr-TR",
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

export function productSchema(product: Product) {
  const url = absoluteUrl(`/kahveler/${product.slug}`);
  const prices = product.variants.map((v) => v.price);
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.fullName,
    description: product.description,
    image: [absoluteUrl(product.image.card), absoluteUrl(product.image.front)],
    sku: product.variants[0]?.sku || undefined,
    brand: { "@type": "Brand", name: site.name },
    category: "Kahve > Çekirdek Kahve",
    countryOfOrigin: product.origin.country,
    additionalProperty: [
      ...(product.elevation ? [{ "@type": "PropertyValue", name: "Rakım", value: product.elevation }] : []),
      { "@type": "PropertyValue", name: "İşleme", value: product.process },
      ...(product.variety.length ? [{ "@type": "PropertyValue", name: "Çeşit", value: product.variety.join(", ") }] : []),
      ...(product.harvest ? [{ "@type": "PropertyValue", name: "Hasat", value: product.harvest }] : []),
      { "@type": "PropertyValue", name: "Tadım notaları", value: product.tastingNotes.map((n) => n.label).join(", ") },
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
              name: v.label,
              price: v.price,
              priceCurrency: "TRY",
              availability: v.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url,
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
