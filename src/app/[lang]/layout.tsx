import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import { CartDrawer, type CartSuggestion } from "@/components/cart/cart-drawer";
import { JsonLd } from "@/components/json-ld";
import type { MenuData } from "@/components/layout/menu-types";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { I18nProvider } from "@/i18n/client";
import { locales } from "@/i18n/config";
import { localizeCard, localizeCategory } from "@/i18n/content";
import { apiTable } from "@/i18n/messages/api";
import { pages } from "@/i18n/messages/pages";
import { ui } from "@/i18n/messages/ui";
import { select } from "@/i18n/select";
import { alternates, getLocale, ogLocale } from "@/i18n/server";
import { fromPrice, getCategories, getProducts, isSoldOut, toCard } from "@/lib/commerce";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const m = select(pages.meta, await getLocale());
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${m.title}`, template: `%s | ${site.name}` },
    description: m.description,
    applicationName: site.name,
    keywords: m.keywords.split(", "),
    openGraph: { type: "website", siteName: site.name, ...(await ogLocale()) },
    twitter: { card: "summary_large_image" },
    alternates: await alternates("/"),
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

async function getMenu(): Promise<MenuData> {
  const locale = await getLocale();
  const products = await getProducts();
  return {
    categories: getCategories().map((c) => {
      const { slug, name, tagline } = localizeCategory(c, locale);
      return { slug, name, tagline };
    }),
    products: products.map((p) => {
      const card = localizeCard(toCard(p), locale);
      return {
        slug: p.slug,
        name: p.name,
        subtitle: card.subtitle,
        categories: p.categories,
        collection: p.collection,
        soldOut: isSoldOut(p),
        image: p.image.card,
        bg: p.image.bg,
        from: fromPrice(p),
        notes: card.tastingNotes.slice(0, 2).map((n) => n.label),
      };
    }),
  };
}

/** Sepette önerilecek kahveler: stokta olan çekirdekler, en küçük paketleriyle (çok satan/öne çıkan önce) */
async function getSuggestions(): Promise<CartSuggestion[]> {
  const locale = await getLocale();
  const beans = new Set(["single-origin", "blends", "espresso"]);
  return (await getProducts())
    .filter((p) => !p.auto && p.categories.some((c) => beans.has(c)) && !isSoldOut(p))
    .sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller) || Number(!!b.featured) - Number(!!a.featured))
    .map((p) => {
      const v = p.variants.filter((x) => x.inStock).reduce((a, b) => (b.price < a.price ? b : a));
      const card = localizeCard(toCard(p), locale);
      return { slug: p.slug, name: card.name, subtitle: card.subtitle, image: p.image.card, variantId: v.id, variantLabel: v.label, price: v.price, grind: p.grindOptions[0] ?? "" };
    });
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const [menu, suggestions] = await Promise.all([getMenu(), getSuggestions()]);

  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={locale} t={select(ui, locale)} api={apiTable(locale)}>
          <JsonLd data={[organizationSchema(), websiteSchema(locale)]} />
          <SiteHeader menu={menu} />
          <main id="icerik" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer suggestions={suggestions} />
        </I18nProvider>
      </body>
    </html>
  );
}
