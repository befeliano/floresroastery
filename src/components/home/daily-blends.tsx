import Image from "next/image";
import Link from "next/link";
import type { CardProduct } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";

const MEANING: Record<string, { word: string; meaning: string; mood: string; image?: { src: string; bg: string } }> = {
  // vitrin tutarlılığı için Manis'in poşet (maskotlu) fotoğrafı
  "manis-blend-espresso-filtre": { word: "Manis", meaning: "tatlı", mood: "A sweet break", image: { src: "/coffees/manis-pouch.webp", bg: "#6aa6d6" } },
  pagi: { word: "Pagi", meaning: "sabah", mood: "Start your day" },
  tanah: { word: "Tanah", meaning: "toprak", mood: "Maximum intensity" },
};

/** Manis · Pagi · Tanah — Endonezce isimli günlük harmanlar */
export function DailyBlends({ products }: { products: CardProduct[] }) {
  return (
    <section className="border-y border-ink-800 bg-ink-900 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="reveal max-w-2xl">
          <p className="eyebrow text-flores-400">Günlük harmanlar</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
            Tatlı, sabah ve <em className="text-flores-300">toprak.</em>
          </h2>
          <p className="mt-6 text-lg text-cream-300">
            Etiyopya&apos;nın meyvesi ile Endonezya&apos;nın gövdesini buluşturan, adlarını Endonezce&apos;den alan üç harman. Her gün, her demleme
            yönteminde.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {products.map((p) => {
            const m = MEANING[p.slug];
            const from = p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : null;
            return (
              <li key={p.slug} className="reveal">
                <Link href={`/kahveler/${p.slug}`} className="group relative block overflow-hidden rounded-sm" style={{ backgroundColor: m?.image?.bg ?? p.image.bg }}>
                  <div className="relative aspect-square">
                    <Image
                      src={m?.image?.src ?? p.image.card}
                      alt={`${p.fullName} kahve paketi`}
                      fill
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-4 bg-ink-950/85 p-5 backdrop-blur">
                    <div>
                      <p className="font-serif text-3xl">{m?.word ?? p.name}</p>
                      <p className="mt-1 text-sm text-cream-400">
                        Endonezce &ldquo;{m?.meaning}&rdquo; · <span lang="en">{m?.mood}</span>
                      </p>
                    </div>
                    {from != null && <p className="shrink-0 font-mono text-sm text-cream-200">{formatPrice(from)}&apos;den</p>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
