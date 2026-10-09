import Image from "next/image";
import Link from "@/i18n/link";
import type { CardProduct } from "@/lib/commerce/types";
import { EmTitle } from "@/components/em-title";
import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";
import { formatPrice } from "@/lib/format";

const MEANING: Record<string, { word: string; meaning: string; mood: string; image?: { src: string; bg: string } }> = {
  // vitrin tutarlılığı için Manis'in poşet (maskotlu) fotoğrafı
  "manis-blend-espresso-filtre": { word: "Manis", meaning: "tatlı", mood: "A sweet break", image: { src: "/coffees/manis-pouch.webp", bg: "#6aa6d6" } },
  pagi: { word: "Pagi", meaning: "sabah", mood: "Start your day" },
  tanah: { word: "Tanah", meaning: "toprak", mood: "Maximum intensity" },
};

/** Manis · Pagi · Tanah — Endonezce isimli günlük kahveler (Manis tek köken, diğerleri harman) */
export async function DailyBlends({ products }: { products: CardProduct[] }) {
  const h = await t(pages.home);
  const ui = await t((await import("@/i18n/messages/ui")).ui.common);
  return (
    <section className="border-y border-ink-800 bg-ink-900 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="reveal max-w-2xl">
          <p className="eyebrow text-flores-400">{h.blendsEyebrow}</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
            <EmTitle parts={h.blendsTitle} />
          </h2>
          <p className="mt-6 text-lg text-cream-300">{h.blendsText}</p>
        </div>

        {/* mobilde yana kaydırılan şerit, md+ üç sütun */}
        <ul className="reveal -mx-5 mt-14 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {products.map((p) => {
            const m = MEANING[p.slug];
            const from = p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : null;
            return (
              <li key={p.slug} className="w-[80%] shrink-0 snap-start md:w-auto">
                <Link href={`/kahveler/${p.slug}`} className="group relative block overflow-hidden rounded-sm" style={{ backgroundColor: m?.image?.bg ?? p.image.bg }}>
                  <div className="relative aspect-square">
                    <Image
                      src={m?.image?.src ?? p.image.card}
                      alt={ui.coffeePackageAlt.replace("{name}", p.fullName)}
                      fill
                      sizes="(min-width: 768px) 30vw, 80vw"
                      className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-4 bg-ink-950/85 p-5 backdrop-blur">
                    <div>
                      <p className="font-serif text-3xl">{m?.word ?? p.name}</p>
                      <p className="mt-1 text-sm text-cream-400">
                        {h.blendMeaning.replace("{meaning}", h.blendWords[p.slug as keyof typeof h.blendWords] ?? m?.meaning ?? "")} · <span lang="en">{m?.mood}</span>
                      </p>
                    </div>
                    {from != null && <p className="shrink-0 font-mono text-sm text-cream-200">{ui.fromPrice.replace("{price}", formatPrice(from))}</p>}
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
