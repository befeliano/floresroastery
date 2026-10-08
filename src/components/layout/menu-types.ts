import { site } from "@/lib/site";

export interface MenuProduct {
  slug: string;
  name: string;
  subtitle: string;
  categories: string[];
  collection?: string;
  soldOut: boolean;
  image: string;
  bg: string;
  from: number | null;
  notes: string[];
}

export interface MenuData {
  categories: { slug: string; name: string; tagline: string }[];
  products: MenuProduct[];
}

export const mainLinks: { href: string; label: string; badge?: string; en?: boolean }[] = [
  { href: "/demleme-rehberi", label: "Demleme" },
  { href: "/coffee-bar", label: "Coffee Bar", en: true, badge: site.coffeeBar.promo ? "Ücretsiz" : undefined },
  { href: "/toptan", label: "Toptan Satış" },
  { href: "/hikayemiz", label: "Hikayemiz" },
  { href: "/iletisim", label: "İletişim" },
];
