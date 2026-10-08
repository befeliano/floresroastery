import Image from "next/image";
import Link from "next/link";
import { isSoldOut, primaryCategory, type CardProduct } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";

const CATEGORY_LABEL = { "single-origin": "Single Origin", blends: "Blend", espresso: "Espresso" } as const;

export function ProductCard({ product, className = "", priority = false }: { product: CardProduct; className?: string; priority?: boolean }) {
  const soldOut = isSoldOut(product);
  const cheapest = product.variants.length ? product.variants.reduce((a, b) => (b.price < a.price ? b : a)) : null;

  return (
    <Link href={`/kahveler/${product.slug}`} className={`group block ${className}`}>
      <div className="relative isolate aspect-square overflow-hidden rounded-sm" style={{ backgroundColor: product.image.bg }}>
        <Image
          src={product.image.card}
          alt={`Flores Roastery ${product.fullName} kahve paketi`}
          fill
          sizes="(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 80vw"
          quality={75}
          preload={priority}
          className={`object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] ${soldOut ? "grayscale-[0.6]" : ""}`}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span lang="en" className="eyebrow rounded-full bg-black/45 px-2.5 py-1 text-[0.55rem] text-white backdrop-blur-sm">
            {CATEGORY_LABEL[primaryCategory(product)]}
          </span>
          {soldOut ? (
            <span className="eyebrow rounded-full bg-ink-950/85 px-2.5 py-1 text-[0.55rem] text-cream-100">Stokta yok</span>
          ) : product.collection === "ruso-exotics" ? (
            <span lang="en" className="eyebrow rounded-full bg-ink-950/70 px-2.5 py-1 text-[0.55rem] text-flores-200 backdrop-blur-sm">
              Ruso Exotics
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-2xl leading-tight transition-colors group-hover:text-flores-300">{product.name}</h3>
          <p className="mt-1 truncate text-sm text-cream-400">{product.subtitle}</p>
        </div>
        {cheapest && (
          <p className="shrink-0 pt-1 text-right font-mono text-sm text-cream-200">
            {cheapest.compareAtPrice && <span className="mr-2 text-xs text-cream-500 line-through">{formatPrice(cheapest.compareAtPrice)}</span>}
            {formatPrice(cheapest.price)}
          </p>
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-cream-300">
        {product.tastingNotes.slice(0, 4).map((n) => (
          <li key={n.label} className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: n.color }} aria-hidden />
            {n.label}
          </li>
        ))}
      </ul>
    </Link>
  );
}
