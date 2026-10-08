import Image from "next/image";
import Link from "next/link";
import { isSoldOut, type CardProduct } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { photos } from "@/lib/photos";

/** Ruso Exotics — Endonezya doğrudan ticaret serisi */
export function RusoExotics({ products }: { products: CardProduct[] }) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <div className="reveal relative overflow-hidden rounded-sm">
        <Image
          src={photos.storyIndonesia.src}
          alt={photos.storyIndonesia.alt}
          width={1600}
          height={560}
          quality={75}
          sizes="(min-width: 1440px) 1360px, 100vw"
          className="h-auto w-full"
        />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="reveal">
          <p lang="en" className="eyebrow text-flores-400">
            Ruso Exotics · Direct Trade
          </p>
          <h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
            Java&apos;nın volkanik yamaçlarından, <em className="text-flores-300">aracısız.</em>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-cream-300">
            Ruso Exotics, Endonezya&apos;daki üreticilerimizle bizzat el sıkışarak seçtiğimiz sınırlı stoklu lotlarımız. Garut&apos;un sisli
            tepelerinden Papandayan Yanardağı&apos;nın eteklerine; çiftçinin avucundan kavurucumuza uzanan bir yolculuk.
          </p>
          <Link href="/kahveler?koleksiyon=ruso-exotics" className="btn btn-ghost mt-10">
            Seriyi keşfet
          </Link>
        </div>

        {/* mobilde yana kaydırılan raf */}
        <ul className="reveal -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {products.map((p) => {
            const soldOut = isSoldOut(p);
            const from = p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : null;
            return (
              <li key={p.slug} className="w-[62%] shrink-0 snap-start sm:w-auto">
                <Link href={`/kahveler/${p.slug}`} className="group block">
                  <div className="arch relative aspect-[3/4]" style={{ backgroundColor: p.image.bg }}>
                    <Image
                      src={p.image.card}
                      alt={`Ruso Exotics ${p.fullName} kahve kutusu`}
                      fill
                      sizes="(min-width: 640px) 18rem, 62vw"
                      className={`object-cover transition-transform duration-[1.2s] group-hover:scale-105 ${soldOut ? "grayscale-[0.6]" : ""}`}
                    />
                  </div>
                  <p className="mt-4 font-serif text-2xl group-hover:text-flores-300">{p.name}</p>
                  <p className="text-sm text-cream-400">
                    {p.tastingNotes
                      .slice(0, 3)
                      .map((n) => n.label)
                      .join(" · ")}
                  </p>
                  <p className="mt-1 font-mono text-xs text-cream-300">{soldOut ? "Stokta yok" : from != null ? `${formatPrice(from)}'den` : ""}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
