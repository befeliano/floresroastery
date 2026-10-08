import type { Metadata } from "next";
import Image from "next/image";
import { EmTitle } from "@/components/em-title";
import { WholesaleQuoteForm } from "@/components/forms/wholesale-quote-form";
import { JsonLd } from "@/components/json-ld";
import { WholesaleBuilder } from "@/components/wholesale/wholesale-builder";
import Link from "@/i18n/link";
import { wholesale } from "@/i18n/messages/wholesale";
import { alternates, localPhotos, t } from "@/i18n/server";
import { WHOLESALE_BEANS } from "@/lib/commerce/wholesale";
import { formatPrice } from "@/lib/format";
import { faqSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const w = await t(wholesale.meta);
  return { title: w.title, description: w.description, alternates: await alternates("/toptan") };
}

export default async function WholesalePage() {
  const w = await t(wholesale);
  const photos = await localPhotos();
  const wa = `${site.whatsapp}?text=${encodeURIComponent(w.waText)}`;

  return (
    <>
      <JsonLd data={faqSchema(w.faq)} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src={photos.boxesNature.src} alt="" fill preload quality={85} sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-32 md:px-10 md:pt-40">
          <p className="eyebrow text-flores-400">{w.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98]">
            <EmTitle parts={w.heading} />
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream-300">{w.intro}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#siparis" className="btn btn-primary">
              {w.createOrder}
            </a>
            <a href="#teklif" className="btn btn-ghost">
              {w.requestQuote}
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              WhatsApp
            </a>
          </div>
          <dl className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-sm bg-ink-700 sm:grid-cols-4">
            {w.stats.map((s) => (
              <div key={s.label} className="bg-ink-900/90 p-5">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-serif text-4xl text-cream-50">{s.value}</span>
                  <span className="mt-1 block text-xs text-cream-400">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Online sipariş — site içi konfigüratör */}
      <section id="siparis" className="scroll-mt-24 border-y border-ink-800 bg-ink-900 py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow text-flores-400">{w.onlineEyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">{w.onlineTitle}</h2>
          <p className="mt-5 max-w-2xl text-lg text-cream-300">{w.onlineText}</p>
          <div className="mt-12">
            <WholesaleBuilder beans={WHOLESALE_BEANS.map((b, i) => ({ ...b, name: w.tiers[i]?.name ?? b.name }))} />
          </div>

          <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-cream-200">{w.tiersTitle}</h3>
              <p className="mt-2 text-sm text-cream-400">{w.tiersText}</p>
              <div className="mt-6 overflow-x-auto rounded-sm border border-ink-700">
                <table className="w-full text-left text-sm sm:min-w-[30rem]">
                  <thead className="bg-ink-850 text-xs text-cream-400">
                    <tr>
                      <th className="px-4 py-3 font-normal">{w.bean}</th>
                      <th className="px-4 py-3 font-normal">{w.tier}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-700">
                    {w.tiers.map((b) => (
                      <tr key={b.name}>
                        <td className="px-4 py-3">
                          <span className="text-cream-100">{b.name}</span>
                          <span className="block text-xs text-cream-500">{b.process}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex flex-wrap gap-2 font-mono text-xs">
                            {b.tiers.map(([min, price], i) => (
                              <span key={min} className={`rounded-sm px-2 py-1 ${i === 0 ? "bg-ink-700 text-cream-100" : "bg-flores-500/10 text-flores-200"}`}>
                                {min} kg+ · {formatPrice(price)}
                              </span>
                            ))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-cream-200">{w.packagingTitle}</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {w.packaging.map((p) => (
                  <li key={p.size} className="rounded-sm border border-ink-700 p-4">
                    <p className="font-mono text-cream-50">{p.size}</p>
                    <p className="text-xs text-flores-300">{p.text}</p>
                    <p className="mt-2 text-xs text-cream-400">{p.bags}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Neden Flores */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-24 md:px-10">
        <p className="eyebrow text-flores-400">{w.whyEyebrow}</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">{w.whyTitle}</h2>
        <div className="mt-12 grid gap-px bg-ink-700 md:grid-cols-2 lg:grid-cols-3">
          {w.features.map((f) => (
            <div key={f.title} className="bg-ink-950 p-8">
              <h3 className="font-serif text-2xl">{f.title}</h3>
              <p className="mt-3 text-cream-300">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="mx-auto w-full max-w-[1440px] px-5 pb-24 md:px-10">
        <h2 className="font-serif text-4xl md:text-5xl">{w.howTitle}</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {w.steps.map((s, i) => (
            <li key={s.title} className="border-t border-flores-500/50 pt-6">
              <span className="font-mono text-sm text-flores-400">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-cream-400">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Paketler */}
      <section className="border-y border-ink-800 bg-ink-900 py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <h2 className="font-serif text-4xl md:text-5xl">{w.plansTitle}</h2>
          <p className="mt-4 max-w-xl text-cream-300">{w.plansText}</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {w.plans.map((p) => (
              <div key={p.name} className={`relative flex flex-col rounded-sm border p-8 ${p.popular ? "border-flores-500 bg-flores-500/5" : "border-ink-700 bg-ink-950"}`}>
                {p.popular && <span className="eyebrow absolute -top-3 left-8 bg-flores-500 px-3 py-1 text-[0.6rem] text-ink-950">{w.popular}</span>}
                <h3 className="font-serif text-3xl">{p.name}</h3>
                <p className="mt-2 text-sm text-cream-400">{p.text}</p>
                <p className="mt-6 font-mono text-flores-300">{p.min}</p>
                <ul className="mt-6 flex-1 space-y-2 text-sm text-cream-200">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span aria-hidden className="text-flores-400">✓</span>
                      {it}
                    </li>
                  ))}
                </ul>
                <a href="#teklif" className={`btn mt-8 ${p.popular ? "btn-primary" : "btn-ghost"}`}>
                  {w.requestQuote}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Private label */}
      <section className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-flores-400">Private label</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
            <EmTitle parts={w.plTitle} />
          </h2>
          <p className="mt-5 max-w-lg text-lg text-cream-300">{w.plText}</p>
          <ul className="mt-8 space-y-2 text-cream-200">
            {w.plItems.map((it) => (
              <li key={it} className="flex gap-3">
                <span aria-hidden className="text-flores-400">✓</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
        <div className="arch relative mx-auto aspect-[3/4] w-full max-w-sm">
          <Image src={photos.roastery.src} alt={photos.roastery.alt} fill quality={90} sizes="(min-width: 1024px) 24rem, 90vw" className="object-cover" />
        </div>
      </section>

      {/* SSS */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-24 md:px-10">
        <h2 className="font-serif text-4xl md:text-5xl">{w.faqTitle}</h2>
        <div className="mt-10 divide-y divide-ink-700 border-y border-ink-700">
          {w.faq.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-cream-100">
                {f.q}
                <span aria-hidden className="text-flores-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-cream-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Teklif formu */}
      <section id="teklif" className="scroll-mt-24 border-t border-ink-800 bg-ink-900 py-24">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-[22rem_1fr]">
          <div>
            <p className="eyebrow text-flores-400">{w.quoteEyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl">{w.quoteTitle}</h2>
            <p className="mt-4 text-cream-300">{w.quoteText}</p>
            <ul className="mt-8 space-y-4 text-sm">
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="text-cream-100 hover:text-flores-300">
                  WhatsApp · {site.phone}
                </a>
                <span className="block text-cream-500">{w.fastest}</span>
              </li>
              <li>
                <a href={site.phoneHref} className="text-cream-100 hover:text-flores-300">
                  ☎ {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-cream-100 hover:text-flores-300">
                  ✉ {site.email}
                </a>
              </li>
              <li>
                <Link href="/coffee-bar" className="text-cream-100 hover:text-flores-300">
                  {w.tasting}
                </Link>
                <span className="block text-cream-500">{site.store.address}</span>
              </li>
            </ul>
          </div>
          <WholesaleQuoteForm whatsapp={site.whatsapp} email={site.email} />
        </div>
      </section>
    </>
  );
}
