import { CoffeeBox3D } from "@/components/product/coffee-box-3d";
import { isSoldOut, type Product } from "@/lib/commerce/types";
import { qrDataUri } from "@/lib/qr";
import { absoluteUrl } from "@/lib/site";

export interface Spec {
  label: string;
  value: string;
}

/** Ürünün tüm künye satırları (boş alanlar atlanır) */
export function productSpecs(product: Product): Spec[] {
  const rows: Spec[] = [
    { label: "Menşei", value: product.origin.country },
    { label: "Bölge", value: product.origin.region },
    { label: "Rakım", value: product.elevation },
    { label: "İşleme", value: product.process },
    { label: "Çeşit", value: product.variety.join(", ") },
    { label: "Hasat", value: product.harvest },
    { label: "Üretici", value: product.origin.producer ?? "" },
    { label: "Çiftlik", value: product.origin.farm ?? "" },
    { label: "Kavurma", value: product.roastLevel },
    { label: "Önerilen demleme", value: product.recommendedFor },
    { label: "Kupa puanı", value: product.score ? `${product.score} (SCA)` : "" },
    ...(product.facts ?? []),
  ];
  return rows.filter((r) => r.value.trim() !== "");
}

/**
 * Ürün künyesi — 3D kutu ortada, özellikler iki yanda çizgilerle bağlı
 * (Doyenne ürün sayfasındaki yapı). Mobilde iki sütunlu listeye dönüşür.
 */
export async function ProductSpecs({ product }: { product: Product }) {
  const qr = await qrDataUri(absoluteUrl(`/kahveler/${product.slug}`));
  const specs = productSpecs(product).slice(0, 8);
  const half = Math.ceil(specs.length / 2);
  const left = specs.slice(0, half);
  const right = specs.slice(half);

  return (
    <section aria-labelledby="kunye-baslik" className="relative mx-auto w-full max-w-[1440px] px-5 md:px-10">
      <h2 id="kunye-baslik" className="sr-only">
        Kahve künyesi
      </h2>

      {/* ürün renginde yumuşak hale */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[44rem] max-w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-3xl"
        style={{ background: `radial-gradient(circle, ${product.image.bg}, transparent 65%)` }}
      />

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
    </section>
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
