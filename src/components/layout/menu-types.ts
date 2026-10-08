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

/** Ana menü bağlantıları — etiketler sözlükten (ui.nav[key]) */
export const mainLinks: { href: string; key: "brew" | "coffeeBar" | "wholesale" | "story" | "contact"; badge?: boolean; en?: boolean }[] = [
  { href: "/demleme-rehberi", key: "brew" },
  { href: "/coffee-bar", key: "coffeeBar", en: true, badge: true },
  { href: "/toptan", key: "wholesale" },
  { href: "/hikayemiz", key: "story" },
  { href: "/iletisim", key: "contact" },
];
