import Link from "@/i18n/link";
import { ProductCard } from "@/components/product/product-card";
import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";
import type { CardProduct } from "@/lib/commerce/types";

/** Slider kütüphanesi yerine saf CSS scroll-snap */
export async function FeaturedCoffees({ products }: { products: CardProduct[] }) {
  const h = await t(pages.home);
  return (
    <section className="border-y border-ink-800 bg-ink-900 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="reveal mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-flores-400">{h.featuredEyebrow}</p>
            <h2 className="mt-4 font-serif text-5xl md:text-6xl">{h.featuredTitle}</h2>
          </div>
          <Link href="/kahveler" className="eyebrow link-underline shrink-0 text-cream-200 hover:text-flores-300">
            {h.seeAll}
          </Link>
        </div>
      </div>

      <ul className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-4 md:scroll-px-10 md:px-10 xl:mx-auto xl:max-w-[1440px]">
        {products.map((p) => (
          <li key={p.slug} className="w-[78vw] shrink-0 snap-start sm:w-[45vw] lg:w-[calc((100%-4.5rem)/4)]">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
