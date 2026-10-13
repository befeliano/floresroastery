import type { Metadata } from "next";
import Image from "next/image";
import { EmTitle } from "@/components/em-title";
import { HeroVideo } from "@/components/home/hero-video";
import { JsonLd } from "@/components/json-ld";
import { BREW_BAR_RULES, COFFEE_BAR_MENU, COFFEE_BAR_TEXT, MENU_PDF, TASTING_PRICING } from "@/content/coffee-bar";
import { getProducts, isSoldOut } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { alternates, localPhotos, t } from "@/i18n/server";
import { storeSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const c = await t(pages.coffeeBar);
  const s = await t(pages.site);
  return {
    title: c.title,
    description: `${c.description} ${s.days}, ${site.coffeeBar.hours}.${site.coffeeBar.promo ? ` ${s.promo}.` : ""}`,
    alternates: await alternates("/coffee-bar"),
  };
}

export default async function CoffeeBarPage() {
  const c = await t(pages.coffeeBar);
  const s = await t(pages.site);
  const photos = await localPhotos();
  const cb = site.coffeeBar;
  const [sideA, sideB] = c.sideText.split("{wholesale}");
  const menu = await t(COFFEE_BAR_MENU);
  const pricing = await t(TASTING_PRICING);
  const rules = await t(BREW_BAR_RULES);
  const mt = await t(COFFEE_BAR_TEXT);
  // menüde satıştaki bir kahve varsa ürün sayfasına link (tükenmişse link yok)
  const inStock = new Set((await getProducts()).filter((p) => !isSoldOut(p)).map((p) => p.slug));
  return (
    <>
      <JsonLd data={storeSchema()} />
      <section className="grain relative isolate overflow-hidden">
        <link rel="preload" as="image" href="/video/coffeebar-poster.jpg" fetchPriority="high" />
        <HeroVideo base="/video/coffeebar" className="absolute inset-0 -z-20 size-full object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/80 to-ink-950" />

        <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-5 pb-24 pt-32 md:px-10 md:pt-40 lg:grid-cols-[1fr_30rem]">
          <div>
            <p className="eyebrow text-flores-400">
              <span lang="en">Coffee Bar</span> · Tepebaşı, Eskişehir
            </p>
            <h1 className="mt-5 font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98]">
              <EmTitle parts={c.heading} />
            </h1>
            {cb.promo && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-flores-500 px-4 py-2 text-sm font-semibold text-ink-950">
                <span aria-hidden>✦</span> {s.promo}
              </p>
            )}
            <p className="mt-6 max-w-xl text-lg text-cream-200">{c.intro}</p>

            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-sm bg-ink-700">
              {[
                [c.days, s.days],
                [c.hours, cb.hours],
                [c.capacity, c.capacityValue.replace("{n}", String(cb.capacity))],
                [c.closed, s.closed],
              ].map(([k, v]) => (
                <div key={k} className="bg-ink-900 p-5">
                  <dt className="eyebrow text-[0.6rem] text-cream-500">{k}</dt>
                  <dd className="mt-1 text-cream-100">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-10 max-w-xl space-y-3">
              {c.experience.map((e) => (
                <li key={e} className="flex gap-3 text-cream-200">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-flores-400" />
                  {e}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              <a href={site.store.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                {s.directions}
              </a>
              <a href={`${site.whatsapp}?text=${encodeURIComponent(c.waText)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                {s.writeWhatsapp}
              </a>
            </div>
            <p className="mt-6 text-sm text-cream-500">{site.store.address}</p>
          </div>

          {/* randevu formu — randevu.floresroastery.com (kendi veritabanı, e-posta onayı ve iptal bağlantısıyla) */}
          <div id="randevu" className="scroll-mt-28">
            {c.formTr && <p className="mb-3 rounded-sm border border-ink-600 bg-ink-900/80 p-3 text-xs text-cream-300">{c.formTr}</p>}
            <div className="overflow-hidden rounded-sm border border-ink-600 bg-ink-900 shadow-2xl shadow-black/40">
              <iframe src={site.links.booking} title={c.iframeTitle} className="block h-[1120px] w-full" referrerPolicy="strict-origin-when-cross-origin" />
            </div>
            <p className="mt-3 text-center text-xs text-cream-500">
              {c.formMissing}{" "}
              <a href={site.links.booking} target="_blank" rel="noopener noreferrer" className="text-flores-300 underline underline-offset-4">
                {c.formOpen}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Tadım nasıl işler: ücretsiz çekirdek tadımı / ücretli brew bar */}
      <section aria-labelledby="pricing-title" className="mx-auto w-full max-w-[1440px] px-5 pb-20 md:px-10">
        <h2 id="pricing-title" className="font-serif text-4xl md:text-5xl">
          {pricing.title}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[pricing.free, pricing.paid].map((p, i) => (
            <div key={p.title} className={`rounded-sm border p-6 md:p-8 ${i === 0 ? "border-flores-500/50 bg-flores-500/5" : "border-ink-700 bg-ink-900"}`}>
              <p className={`eyebrow text-[0.65rem] ${i === 0 ? "text-flores-300" : "text-cream-400"}`}>{p.label}</p>
              <p className="mt-2 font-serif text-3xl">{p.title}</p>
              <p className="mt-3 text-cream-300">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menü */}
      <section id="menu" aria-labelledby="menu-title" className="mx-auto w-full max-w-[1440px] scroll-mt-28 px-5 pb-20 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="menu-title" className="font-serif text-4xl md:text-5xl">
              {mt.menuTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-cream-300">{mt.menuIntro}</p>
          </div>
          <a href={MENU_PDF} target="_blank" rel="noopener" className="btn btn-ghost">
            {mt.pdf} ↗
          </a>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {menu.map((sec) => (
            <div key={sec.key}>
              <p className="eyebrow text-flores-400">
                <span lang="en">{sec.title}</span>
                {sec.subtitle && <span lang="en" className="text-cream-500"> · {sec.subtitle}</span>}
              </p>
              <ul className="mt-4 divide-y divide-ink-700 border-y border-ink-700">
                {sec.items.map((item) => (
                  <li key={item.name} className="flex items-start justify-between gap-6 py-4">
                    <div className="min-w-0">
                      <p className="font-serif text-xl leading-snug">{item.name}</p>
                      <p className="mt-1 text-sm text-cream-400">{item.desc}</p>
                      {item.slug && inStock.has(item.slug) && (
                        <Link href={`/kahveler/${item.slug}`} className="mt-1 inline-block text-xs text-flores-300 hover:underline">
                          {mt.inShop}
                        </Link>
                      )}
                    </div>
                    <p className="shrink-0 font-mono text-lg text-cream-50">{formatPrice(item.price)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Brew Bar kuralları */}
      <section aria-labelledby="rules-title" className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <h2 id="rules-title" className="font-serif text-4xl md:text-5xl">
          {mt.rulesTitle}
        </h2>
        <ol className="mt-8 grid gap-x-12 gap-y-4 md:grid-cols-2">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-4 text-cream-200">
              <span aria-hidden className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-flores-500/50 font-mono text-xs text-flores-300">
                {i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 pb-28 md:px-10 lg:grid-cols-2">
        <div className="arch relative mx-auto aspect-[4/5] w-full max-w-sm">
          <Image src={photos.cuppingPour.src} alt={photos.cuppingPour.alt} fill quality={90} sizes="(min-width: 1024px) 24rem, 90vw" className="object-cover" />
        </div>
        <div>
          <h2 className="font-serif text-4xl md:text-5xl">{c.sideTitle}</h2>
          <p className="mt-5 max-w-lg text-lg text-cream-300">
            {sideA}
            <Link href="/toptan" className="text-flores-300 underline underline-offset-4">
              {c.wholesaleLink}
            </Link>
            {sideB}
          </p>
          <Link href="/kahveler" className="btn btn-primary mt-8">
            {c.exploreCta}
          </Link>
        </div>
      </section>
    </>
  );
}
