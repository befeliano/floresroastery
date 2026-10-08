import Image from "next/image";
import Link from "@/i18n/link";
import { EmTitle } from "@/components/em-title";
import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";
import type { Category } from "@/lib/commerce/types";

/** Kemerli kategori kartları — çerçeveli kemer, numara ve metin görselin altında */
export async function CategoryArches({ categories }: { categories: Category[] }) {
  const h = await t(pages.home);
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <div className="reveal mb-16 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="eyebrow text-flores-400">{h.archesEyebrow}</p>
          <h2 className="mt-4 font-serif text-5xl md:text-6xl">
            <EmTitle parts={h.archesTitle} />
          </h2>
        </div>
        <p className="max-w-sm text-cream-300">{h.archesText}</p>
      </div>

      {/* mobilde yana kaydırılan şerit (bir sonraki kart görünür kalır), md+ üç sütun */}
      <div className="reveal -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-6 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
        {categories.map((c, i) => (
          <Link key={c.slug} href={`/kategori/${c.slug}`} className="group block w-[78%] shrink-0 snap-start md:w-auto">
            <div className="relative">
              {/* kaydırılmış çerçeve kemer */}
              <div
                aria-hidden
                className="arch absolute inset-0 translate-x-3 translate-y-3 border border-flores-500/40 transition-transform duration-700 group-hover:translate-x-1.5 group-hover:translate-y-1.5"
              />
              <div className="arch relative isolate aspect-[4/5]">
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  quality={90}
                  sizes="(min-width: 768px) 30vw, 78vw"
                  className="-z-10 object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <span className="absolute left-1/2 top-[14%] -translate-x-1/2 font-mono text-xs tracking-[0.3em] text-white/80">0{i + 1}</span>
              </div>
            </div>
            <div className="mt-8 flex items-start justify-between gap-4">
              <div>
                <h3 lang="en" className="font-serif text-3xl md:text-4xl">
                  {c.name}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream-400">{c.tagline}</p>
              </div>
              <span
                aria-hidden
                className="mt-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-ink-600 text-cream-200 transition-colors group-hover:border-flores-400 group-hover:bg-flores-500 group-hover:text-ink-950"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
