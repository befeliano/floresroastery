import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { catalogL } from "@/i18n/catalog";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { alternates, t } from "@/i18n/server";
import { getCategories, getProductsByCategory, type CategorySlug } from "@/lib/commerce";

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/kategori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const L = await catalogL();
  const p = await t(pages.category);
  const category = L.getCategory(slug);
  if (!category) return { title: p.notFound };
  return {
    title: p.title.replace("{name}", category.name),
    description: category.description,
    alternates: await alternates(`/kategori/${category.slug}`),
  };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/kategori/[slug]">) {
  const { slug } = await params;
  const L = await catalogL();
  const category = L.getCategory(slug);
  if (!category) notFound();
  const p = await t(pages.category);
  const cr = await t(pages.crumbs);
  const products = (await getProductsByCategory(slug as CategorySlug)).map(L.card);
  const others = L.categories().filter((c) => c.slug !== category.slug);

  return (
    <>
      <header className="mx-auto grid w-full max-w-[1440px] items-end gap-12 px-5 pb-16 pt-28 md:px-10 md:pt-36 lg:grid-cols-[1fr_24rem]">
        <div>
          <Breadcrumbs
            items={[
              { name: cr.home, path: "/" },
              { name: cr.coffees, path: "/kahveler" },
              { name: category.name, path: `/kategori/${category.slug}` },
            ]}
          />
          <p className="eyebrow mt-10 text-flores-400">{p.collection}</p>
          <h1 lang="en" className="mt-4 font-serif text-[clamp(3rem,9vw,7.5rem)] uppercase leading-[0.95] tracking-[0.03em]">
            {category.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream-300">{category.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/${c.slug}`}
                lang="en"
                className="eyebrow rounded-full border border-ink-600 px-4 py-2 text-[0.65rem] text-cream-300 transition-colors hover:border-flores-400 hover:text-flores-300"
              >
                {c.name} →
              </Link>
            ))}
          </div>
        </div>
        <div className="arch relative hidden aspect-[3/4] lg:block">
          <Image src={category.image.src} alt={category.image.alt} fill preload quality={90} sizes="24rem" className="object-cover" />
        </div>
      </header>

      <section aria-label={p.listAria.replace("{name}", category.name)} className="mx-auto w-full max-w-[1440px] border-t border-ink-800 px-5 pb-28 pt-14 md:px-10">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((pr, i) => (
            <li key={pr.slug}>
              <ProductCard product={pr} priority={i < 4} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
