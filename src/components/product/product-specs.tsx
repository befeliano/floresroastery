import Image from "next/image";
import { CoffeeBox3D } from "@/components/product/coffee-box-3d";
import { roastLabel } from "@/i18n/content";
import { pages } from "@/i18n/messages/pages";
import { getLocale, href, t } from "@/i18n/server";
import { isSoldOut, type Product } from "@/lib/commerce/types";
import { qrDataUri } from "@/lib/qr";
import { absoluteUrl } from "@/lib/site";

export interface Spec {
  label: string;
  value: string;
}

/** Ürünün tüm künye satırları (boş alanlar atlanır) */
export async function productSpecs(product: Product): Promise<Spec[]> {
  const L = await t(pages.product.specs);
  const locale = await getLocale();
  const rows: Spec[] = [
    { label: L.origin, value: product.origin.country },
    { label: L.region, value: product.origin.region },
    { label: L.altitude, value: product.elevation },
    { label: L.process, value: product.process },
    { label: L.variety, value: product.variety.join(", ") },
    { label: L.harvest, value: product.harvest },
    { label: L.producer, value: product.origin.producer ?? "" },
    { label: L.farm, value: product.origin.farm ?? "" },
    { label: L.roast, value: product.auto ? "" : roastLabel(product.roastLevel, locale) },
    { label: L.brew, value: product.recommendedFor },
    { label: L.score, value: product.score ? `${product.score} (SCA)` : "" },
    ...(product.facts ?? []),
  ];
  return rows.filter((r) => r.value.trim() !== "");
}

/**
 * Ürün künyesi — 3D kutu ortada, özellikler iki yanda çizgilerle bağlı
 * (Doyenne ürün sayfasındaki yapı). Mobilde iki sütunlu listeye dönüşür.
 */
export async function ProductSpecs({ product }: { product: Product }) {
  const qr = await qrDataUri(absoluteUrl(await href(`/kahveler/${product.slug}`)));
  const specs = (await productSpecs(product)).slice(0, 8);
  const p = await t(pages.product);
  const half = Math.ceil(specs.length / 2);
  const left = specs.slice(0, half);
  const right = specs.slice(half);

  return (
    <section aria-labelledby="kunye-baslik" className="relative mx-auto w-full max-w-[1440px] px-5 md:px-10">
      <h2 id="kunye-baslik" className="sr-only">
        {p.specAria}
      </h2>

      {/* ürün renginde yumuşak hale */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[44rem] max-w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-3xl"
        style={{ background: `radial-gradient(circle, ${product.image.bg}, transparent 65%)` }}
      />

      {product.image.packaging === "photo" ? (
        <ProductGallery images={product.gallery?.length ? product.gallery : [{ src: product.image.card, alt: product.fullName }]} />
      ) : (
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
        <SpecColumn specs={left} side="left" className="order-2 lg:order-1" />

        <CoffeeBox3D
          className="order-1 lg:order-2"
          product={{
            name: product.name,
            fullName: product.fullName,
            origin: product.origin,
            elevation: product.elevation,
            process: product.process,
            variety: product.variety,
            roastLevel: product.roastLevel,
            recommendedFor: product.recommendedFor,
            sensory: product.sensory,
            score: product.score,
            image: product.image,
            notes: product.tastingNotes.map((n) => n.label),
            soldOut: isSoldOut(product),
            qr,
          }}
        />

        <SpecColumn specs={right} side="right" className="order-3" />
      </div>
      )}
    </section>
  );
}

/** WordPress'ten otomatik gelen ürünler: fotoğraf galerisi */
function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [first, ...rest] = images;
  return (
    <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-[2fr_1fr]">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-ink-900">
        <Image src={first.src} alt={first.alt} fill preload quality={90} sizes="(min-width: 1024px) 40rem, 100vw" className="object-cover" />
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-1">
          {rest.slice(0, 3).map((img) => (
            <div key={img.src} className="relative aspect-square overflow-hidden rounded-sm bg-ink-900">
              <Image src={img.src} alt={img.alt} fill quality={85} sizes="(min-width: 640px) 20rem, 33vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SpecColumn({ specs, side, className = "" }: { specs: Spec[]; side: "left" | "right"; className?: string }) {
  const isLeft = side === "left";
  return (
    <dl className={`grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-1 lg:gap-y-12 ${className}`}>
      {specs.map((s, i) => (
        <div
          key={s.label}
          className={`reveal relative flex items-center gap-5 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className={`min-w-0 lg:max-w-[17rem] ${isLeft ? "lg:text-right" : "lg:text-left"}`}>
            <dt className="eyebrow text-[0.6rem] text-flores-400">{s.label}</dt>
            <dd className="mt-1.5 font-serif text-lg leading-snug text-cream-50 md:text-xl">{s.value}</dd>
          </div>
          {/* bağlantı çizgisi */}
          <span aria-hidden className="hidden h-px min-w-10 flex-1 lg:block">
            <span className={`block h-px w-full ${isLeft ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-cream-50/45 to-flores-500/70`} />
          </span>
          <span aria-hidden className="hidden size-1.5 shrink-0 rounded-full bg-flores-400 lg:block" />
        </div>
      ))}
    </dl>
  );
}
