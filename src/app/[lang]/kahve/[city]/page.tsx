import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product/product-card";
import { CITIES, getCity } from "@/content/seo/cities";
import { GUIDES } from "@/content/seo/guides";
import { catalogL } from "@/i18n/catalog";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getFeaturedProducts } from "@/lib/commerce";
import { faqSchema, storeSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/kahve/[city]">): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city || (await getLocale()) !== "tr") return {};
  return {
    title: city.title,
    description: city.description,
    alternates: { canonical: `/kahve/${city.slug}`, languages: { tr: `/kahve/${city.slug}`, "x-default": `/kahve/${city.slug}` } },
    openGraph: { title: city.title, description: city.description, locale: "tr_TR", type: "website", url: `/kahve/${city.slug}` },
  };
}

/** Yerel SEO: "{şehir} specialty kahve" — Türkçe sayfa */
export default async function CityPage({ params }: PageProps<"/[lang]/kahve/[city]">) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city || (await getLocale()) !== "tr") notFound();
  const L = await catalogL();
  const coffees = (await getFeaturedProducts()).slice(0, 8).map(L.card);

  return (
    <>
      <JsonLd data={[faqSchema(city.faq), ...(city.slug === "eskisehir" ? [storeSchema()] : [])]} />
      <header className="relative isolate overflow-hidden">
        <Image src="/photos/coffee-bar-jars.webp" alt="" fill preload quality={85} sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-32 md:px-10 md:pt-40">
          <Breadcrumbs
            items={[
              { name: "Ana Sayfa", path: "/" },
              { name: `${city.city} Kahve`, path: `/kahve/${city.slug}` },
            ]}
          />
          <p className="eyebrow mt-10 text-flores-400">Specialty kahve · {city.city}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.02]">{city.title}</h1>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-cream-200">
            {city.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10 max-w-3xl rounded-sm border border-flores-500/40 bg-flores-500/5 p-5 text-cream-100">
            <p className="eyebrow text-[0.65rem] text-flores-300">Teslimat · {city.city}</p>
            <p className="mt-2">{city.delivery}</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/kahveler" className="btn btn-primary">
              Kahveleri keşfet →
            </Link>
            <Link href="/demleme-rehberi" className="btn btn-ghost">
              Demleme rehberi
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="city-coffees" className="mx-auto w-full max-w-[1440px] px-5 py-20 md:px-10">
        <h2 id="city-coffees" className="font-serif text-4xl md:text-5xl">
          {city.dative} gönderdiğimiz kahveler
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {coffees.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 pb-20 md:px-10">
        <h2 className="font-serif text-4xl">{city.city} — sıkça sorulanlar</h2>
        <div className="mt-8 divide-y divide-ink-700 border-y border-ink-700">
          {city.faq.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-cream-100">
                <h3 className="font-sans text-lg font-normal">{f.q}</h3>
                <span aria-hidden className="text-flores-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-cream-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-800 bg-ink-900 py-16">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-2">
          <div>
            <h2 className="eyebrow text-flores-400">Kahve rehberi</h2>
            <ul className="mt-4 space-y-2">
              {GUIDES.slice(0, 5).map((g) => (
                <li key={g.slug}>
                  <Link href={`/rehber/${g.slug}`} className="text-cream-100 underline-offset-4 hover:text-flores-300 hover:underline">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-flores-400">Diğer şehirler</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
                <li key={c.slug}>
                  <Link href={`/kahve/${c.slug}`} className="inline-block rounded-full border border-ink-600 px-4 py-2 text-sm text-cream-200 hover:border-flores-400">
                    {c.city} kahve
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-cream-500">
              {site.store.name} · {site.store.address}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
