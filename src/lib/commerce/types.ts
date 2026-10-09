export type CategorySlug = "single-origin" | "blends" | "espresso" | "sets" | "accessories";

export interface Photo {
  src: string;
  alt: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Kısa tanıtım cümlesi (kartlarda) */
  tagline: string;
  description: string;
  image: Photo;
}

export interface ProductVariant {
  id: string;
  sku: string;
  /** gram */
  weight: number;
  label: string;
  /** TL, KDV dahil, indirimli satış fiyatı */
  price: number;
  /** Liste fiyatı (indirim varsa üstü çizili gösterilir) */
  compareAtPrice?: number;
  inStock: boolean;
}

export interface TastingNote {
  label: string;
  /** Not rengi (aroma çarkından esinlenen) */
  color: string;
}

export interface BrewStep {
  /** saniye */
  at: number;
  title: string;
  detail?: string;
  /** Bu adımın sonunda terazide olması gereken toplam su/fincan ağırlığı (g) */
  target?: number;
}

export interface BrewGuide {
  method: "filter" | "espresso";
  device: string;
  /** g */
  dose: number;
  /** filtre: su (g) / espresso: fincandaki çıktı (g) */
  output: number;
  ratio: string;
  /** °C */
  temperature: number;
  grind: string;
  /** saniye */
  totalTime: number;
  steps: BrewStep[];
  tip?: string;
}

export type RoastLevel = "Açık" | "Açık-Orta" | "Orta" | "Orta-Koyu";

export interface Product {
  id: string;
  slug: string;
  /** Kısa vitrin adı (örn. "Arjuna") */
  name: string;
  /** Tam ürün adı (örn. "Arjuna Endonezya Wet Hulled") */
  fullName: string;
  /** Köken satırı (örn. "Endonezya · Garut, Batı Java") */
  subtitle: string;
  /** İlki birincil kategoridir */
  categories: CategorySlug[];
  collection?: "ruso-exotics";
  /** Sınırlı stok / mikro lot */
  limited?: boolean;
  headline?: string;
  origin: {
    country: string;
    region: string;
    producer?: string;
    farm?: string;
  };
  elevation: string;
  process: string;
  variety: string[];
  harvest: string;
  roastLevel: RoastLevel;
  recommendedFor: string;
  tastingNotes: TastingNote[];
  /** "Tam gövde, kremamsı doku, düşük asidite" gibi serbest metin */
  bodyAcidity?: string;
  /** Paket etiketindeki 1–5 puanlar */
  sensory?: { body: number; acidity: number; sweetness: number };
  /** SCA kupa puanı */
  score?: number;
  /** Künyede gösterilecek ek satırlar */
  facts?: { label: string; value: string }[];
  /** SEO / kısa açıklama */
  description: string;
  story: string[];
  image: {
    /** Kare ürün fotoğrafı (renkli fon) */
    card: string;
    /** 3D kutu için kırpılmış ön yüz */
    front: string;
    /** Fotoğraf fon rengi — sayfa vurgusu */
    bg: string;
    /** box/pouch: 3D kutu · photo: WordPress fotoğrafı (otomatik eklenen ürünler) */
    packaging: "box" | "pouch" | "photo";
    /** ön yüz en/boy oranı */
    aspect: number;
  };
  variants: ProductVariant[];
  grindOptions: string[];
  brewGuides: { filter?: BrewGuide; espresso?: BrewGuide };
  featured?: boolean;
  /** WordPress'ten otomatik eklendi (künye/demleme yok) */
  auto?: boolean;
  /** ek görseller (otomatik ürünler) */
  gallery?: Photo[];
  rating?: { value: number; count: number };
  /** WooCommerce toplam satış adedi (yalnızca anahtar tanımlıysa) */
  sales?: number;
  /** satışa göre ilk 3 kahve */
  bestseller?: boolean;
}

export interface CartLine {
  slug: string;
  variantId: string;
  grind: string;
  quantity: number;
  /** yalnızca toptan sipariş satırı: oluşturucudaki seçimler (fiyat sunucuda hesaplanır) */
  config?: unknown;
}

export const isSoldOut = (p: Pick<Product, "variants">) => p.variants.length === 0 || p.variants.every((v) => !v.inStock);
export const primaryCategory = (p: Pick<Product, "categories">) => p.categories[0];

/** Kart ve listelerde kullanılan hafif ürün özeti (istemciye kavurma eğrisi vb. gönderilmez) */
export type CardProduct = Pick<
  Product,
  "slug" | "name" | "fullName" | "subtitle" | "categories" | "collection" | "image" | "variants" | "tastingNotes" | "featured" | "sales" | "bestseller"
>;

export const toCard = ({ slug, name, fullName, subtitle, categories, collection, image, variants, tastingNotes, featured, sales, bestseller }: Product): CardProduct => ({
  slug,
  name,
  fullName,
  subtitle,
  categories,
  collection,
  image,
  variants,
  tastingNotes,
  featured,
  sales,
  bestseller,
});
