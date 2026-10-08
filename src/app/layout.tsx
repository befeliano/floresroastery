import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { JsonLd } from "@/components/json-ld";
import type { MenuData } from "@/components/layout/menu-types";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fromPrice, getCategories, getProducts, isSoldOut } from "@/lib/commerce";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Specialty Coffee Roasters`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["specialty kahve", "çekirdek kahve", "filtre kahve", "espresso", "single origin", "kahve kavurma", "Flores Roastery"],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

async function getMenu(): Promise<MenuData> {
  const products = await getProducts();
  return {
    categories: getCategories().map(({ slug, name, tagline }) => ({ slug, name, tagline })),
    products: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      categories: p.categories,
      collection: p.collection,
      soldOut: isSoldOut(p),
      image: p.image.card,
      bg: p.image.bg,
      from: fromPrice(p),
      notes: p.tastingNotes.slice(0, 2).map((n) => n.label),
    })),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const menu = await getMenu();

  return (
    <html lang="tr" className={`${playfair.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <SiteHeader menu={menu} />
        <main id="icerik" className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
      </body>
    </html>
  );
}
