import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { BrewGuide } from "@/components/product/brew-guide";
import { ProductCard } from "@/components/product/product-card";
import { productSpecs, ProductSpecs } from "@/components/product/product-specs";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { CupCost } from "@/components/product/cup-cost";
import { catalogL } from "@/i18n/catalog";
import { pages } from "@/i18n/messages/pages";
import { alternates, href, ogLocale, t } from "@/i18n/server";
import { getProducts, getRelatedProducts, primaryCategory } from "@/lib/commerce";
import { getShopSettings } from "@/lib/commerce/settings";
import { productSchema } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/kahveler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const L = await catalogL();
  const raw = await L.getProduct(slug);
  const p = await t(pages.product);
  if (!raw) return { title: p.notFound };
  const product = L.product(raw);
  const notes = product.tastingNotes.map((n) => n.label).join(", ");
  const title = product.categories.includes("accessories") ? product.fullName : p.metaTitle.replace("{name}", product.fullName);
  const description = `${product.description} ${p.metaNotes.replace("{notes}", notes)}`;
  const url = await href(`/kahveler/${product.slug}`);
  return {
    title,
    description,
    alternates: await alternates(`/kahveler/${product.slug}`),
    openGraph: { title, description, type: "website", url, ...(await ogLocale()) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/kahveler/[slug]">) {
  const { slug } = await params;
  const L = await catalogL();
  const raw = await L.getProduct(slug);
  if (!raw) notFound();
  const product = L.product(raw);
  const p = await t(pages.product);
  const c = await t(pages.crumbs);
  const settings = await getShopSettings();

  const category = L.getCategory(primaryCategory(product))!;
  const related = (await getRelatedProducts(raw, 4)).map(L.card);
  const specs = await productSpecs(product);

  return (
    <article className="pt-24 md:pt-28">
      <JsonLd data={productSchema(product, await href(`/kahveler/${product.slug}`), L.locale)} />

      <header className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <Breadcrumbs
          items={[
            { name: c.home, path: "/" },
            { name: c.coffees, path: "/kahveler" },
            { name: product.fullName, path: `/kahveler/${product.slug}` },
          ]}
        />
        <div className="mt-10 text-center">
          <p className="eyebrow flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-flores-400">
            <span lang="en">{category.name}</span>
            <span aria-hidden className="text-ink-500">/</span>
            <span>{product.subtitle}</span>
            {product.collection === "ruso-exotics" && (
              <span lang="en" className="rounded-full border border-flores-500/50 px-2.5 py-1 text-[0.6rem] text-flores-300">
                Ruso Exotics · Direct Trade
              </span>
            )}
          </p>
          <h1 className="mt-5 font-serif text-[clamp(3rem,8vw,6.5rem)] italic leading-none">{product.name}</h1>
          {product.headline && <p className="mt-5 font-serif text-xl text-cream-300 md:text-2xl">{product.headline}</p>}
        </div>
      </header>

      <div className="mt-10 md:mt-14">
        <ProductSpecs product={product} />
      </div>

      {/* tadım notaları + satın alma + hikâye — mobilde panel notaların hemen altında */}
      <section className="mx-auto mt-24 grid w-full max-w-[1440px] grid-cols-1 gap-14 px-5 md:mt-32 md:px-10 lg:grid-cols-[1.3fr_1fr] lg:gap-x-16">
        <div className="lg:col-start-1">
          <p lang="en" className="eyebrow text-flores-400">
            Tasting Notes
          </p>
          <h2 className="sr-only">{p.tastingNotes}</h2>
          <ul className="mt-6 space-y-1">
            {product.tastingNotes.map((n) => (
              <li key={n.label} className="reveal flex items-center gap-5 font-serif text-[clamp(2.5rem,5.5vw,4.75rem)] italic leading-[1.1]">
                <span aria-hidden className="size-3 shrink-0 rounded-full md:size-4" style={{ background: n.color, boxShadow: `0 0 24px ${n.color}` }} />
                {n.label}
              </li>
            ))}
          </ul>

          {product.sensory && <SensoryBars sensory={product.sensory} labels={p.sensory} />}
        </div>

        <div id="satin-al" className="scroll-mt-24 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <PurchasePanel
            product={{
              slug: product.slug,
              name: product.name,
              subtitle: product.subtitle,
              variants: product.variants,
              grindOptions: product.grindOptions,
              image: product.image.card,
            }}
          />
        </div>

        <div className="lg:col-start-1">
          <div className="max-w-xl space-y-5 text-lg leading-relaxed text-cream-300">
            {product.story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Kahve kimliği — tüm teknik özellikler */}
          <div className="mt-14 max-w-xl">
            <h2 className="eyebrow text-flores-400">{p.identity}</h2>
            <dl className="mt-5 divide-y divide-ink-700 border-y border-ink-700">
              {[...specs, ...(product.bodyAcidity ? [{ label: p.bodyAcidity, value: product.bodyAcidity }] : [])].map((s) => (
                <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-4 py-3 text-sm">
                  <dt className="text-cream-500">{s.label}</dt>
                  <dd className="text-cream-100">{s.value}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[9rem_1fr] gap-4 py-3 text-sm">
                <dt className="text-cream-500">{p.profile}</dt>
                <dd className="text-cream-100">{product.tastingNotes.map((n) => n.label).join(", ")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="mt-28 md:mt-40">
        <BrewGuide guides={product.brewGuides} />
      </div>

      {product.variants.some((v) => v.weight > 0) && !product.categories.includes("accessories") && (
        <div className="mx-auto mt-16 w-full max-w-[1440px] px-5 md:px-10">
          <CupCost variants={product.variants.map(({ id, label, weight, price, inStock }) => ({ id, label, weight, price, inStock }))} settings={settings} />
        </div>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mx-auto mt-28 w-full max-w-[1440px] px-5 pb-28 md:mt-40 md:px-10">
          <h2 id="related-title" className="font-serif text-4xl md:text-5xl">
            {p.related}
          </h2>
          <ul className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug} className="w-[72%] shrink-0 snap-start sm:w-auto">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function SensoryBars({
  sensory,
  labels,
}: {
  sensory: { body: number; acidity: number; sweetness: number };
  labels: { body: string; acidity: string; sweetness: string };
}) {
  const rows = [
    [labels.body, sensory.body],
    [labels.acidity, sensory.acidity],
    [labels.sweetness, sensory.sweetness],
  ] as const;
  return (
    <dl className="mt-10 grid max-w-md gap-3">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-4 text-sm">
          <dt className="text-cream-400">{label}</dt>
          <dd className="flex gap-[2px]" aria-label={`${value}/5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`h-2 flex-1 first:rounded-l-[4px] last:rounded-r-[4px] ${i < value ? "bg-flores-500" : "bg-ink-700"}`} />
            ))}
          </dd>
          <span aria-hidden className="font-mono text-xs text-cream-500">
            {value}/5
          </span>
        </div>
      ))}
    </dl>
  );
}
