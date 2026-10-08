import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WholesaleQuoteForm } from "@/components/forms/wholesale-quote-form";
import { builderSteps, packaging, wholesaleFaq, wholesaleFeatures, wholesalePlans, wholesaleStats, wholesaleSteps, wholesaleTiers } from "@/content/wholesale";
import { formatPrice } from "@/lib/format";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Toptan Kahve — Otel, Restoran & Kafe Tedariği",
  description:
    "Otel, restoran, kafe ve ofisler için siparişe özel kavrulan specialty çekirdek. Kademeli kg fiyatı, minimum 5 kg, private label ve Türkiye geneli teslimat.",
  alternates: { canonical: "/toptan" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: wholesaleFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function WholesalePage() {
  const wa = `${site.whatsapp}?text=${encodeURIComponent("Merhaba, Flores toptan teklifi almak istiyorum.")}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src={photos.boxesNature.src} alt="" fill preload sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-32 md:px-10 md:pt-40">
          <p className="eyebrow text-flores-400">B2B · HoReCa tedarik</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98]">
            Specialty kahveyi işletmenizin <em className="text-flores-300">standardı</em> yapın.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream-300">
            Otel, restoran, kafe ve ofisler için siparişe özel kavrulan specialty çekirdek. İstikrarlı kalite, düzenli teslimat ve isterseniz kendi
            markanızla private label — ihtiyacınıza göre kurgulanır.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={site.links.wholesaleBuilder} className="btn btn-primary">
              Sipariş oluştur →
            </a>
            <a href="#teklif" className="btn btn-ghost">
              Teklif iste
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              WhatsApp&apos;tan yaz
            </a>
          </div>
          <dl className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-sm bg-ink-700 sm:grid-cols-4">
            {wholesaleStats.map((s) => (
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

      {/* Online sipariş — konfigüratör */}
      <section className="border-y border-ink-800 bg-ink-900 py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 md:px-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow text-flores-400">Online sipariş</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">İşletmenize özel harmanı kendiniz oluşturun</h2>
            <p className="mt-5 max-w-lg text-lg text-cream-300">
              Çekirdek, harman oranı, kavurma, miktar ve ambalajı adım adım seçin; fiyatı anında görün, sepete ekleyip güvenle ödeyin. Minimum
              toplam 5 kg — farklı çekirdekleri karıştırabilirsiniz.
            </p>
            <ol className="mt-10 space-y-3">
              {builderSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-flores-500/60 font-mono text-xs text-flores-300">
                    {i + 1}
                  </span>
                  <span className="text-cream-100">{s}</span>
                </li>
              ))}
            </ol>
            <a href={site.links.wholesaleBuilder} className="btn btn-primary mt-10">
              Sipariş oluşturmaya başla →
            </a>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-cream-200">Kademeli kg fiyatları</h3>
            <p className="mt-2 text-sm text-cream-400">
              Aldığınız miktar arttıkça kg fiyatı düşer. Fiyatlar KDV dahildir; güncel fiyat sipariş ekranında gösterilir.
            </p>
            <div className="mt-6 overflow-x-auto rounded-sm border border-ink-700">
              <table className="w-full text-left text-sm sm:min-w-[30rem]">
                <thead className="bg-ink-850 text-xs text-cream-400">
                  <tr>
                    <th className="px-4 py-3 font-normal">Çekirdek</th>
                    <th className="px-4 py-3 font-normal">Kademe (kg fiyatı)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700">
                  {wholesaleTiers.map((b) => (
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

            <h3 className="mt-10 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-cream-200">Paket & ambalaj</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {packaging.map((p) => (
                <li key={p.size} className="rounded-sm border border-ink-700 p-4">
                  <p className="font-mono text-cream-50">{p.size}</p>
                  <p className="text-xs text-flores-300">{p.text}</p>
                  <p className="mt-2 text-xs text-cream-400">{p.bags}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Neden Flores */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-24 md:px-10">
        <p className="eyebrow text-flores-400">Neden Flores?</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">HoReCa odaklı, istikrarlı tedarik</h2>
        <div className="mt-12 grid gap-px bg-ink-700 md:grid-cols-2 lg:grid-cols-3">
          {wholesaleFeatures.map((f) => (
            <div key={f.title} className="bg-ink-950 p-8">
              <h3 className="font-serif text-2xl">{f.title}</h3>
              <p className="mt-3 text-cream-300">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="mx-auto w-full max-w-[1440px] px-5 pb-24 md:px-10">
        <h2 className="font-serif text-4xl md:text-5xl">Tanışmadan ilk teslimata</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {wholesaleSteps.map((s, i) => (
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
          <h2 className="font-serif text-4xl md:text-5xl">İşletmenize uygun başlangıç</h2>
          <p className="mt-4 max-w-xl text-cream-300">Fiyatlar ürüne ve miktara göre değişir. Paketi seçin, size özel teklif hazırlayalım.</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {wholesalePlans.map((p) => (
              <div key={p.name} className={`relative flex flex-col rounded-sm border p-8 ${p.popular ? "border-flores-500 bg-flores-500/5" : "border-ink-700 bg-ink-950"}`}>
                {p.popular && <span className="eyebrow absolute -top-3 left-8 bg-flores-500 px-3 py-1 text-[0.6rem] text-ink-950">En popüler</span>}
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
                  Teklif iste
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
            Kendi markanız, <em className="text-flores-300">bizim kavurmamız.</em>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-cream-300">
            Kendi kahve markanızı oluşturmak için kavurma ekipmanı veya üretim yatırımı yapmanıza gerek yok. Kavurma, paketleme ve kalite kontrol
            süreçlerini sizin adınıza yönetiyoruz; marka tamamen sizde kalır.
          </p>
          <ul className="mt-8 space-y-2 text-cream-200">
            {["Damak profilinize göre özel blend geliştirme", "Etiket ve ambalaj tasarımı desteği", "Esnek miktar — pilot üretimden seri üretime", "Ortalama 1–2 haftada üretime hazır"].map(
              (t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="text-flores-400">✓</span>
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="arch relative mx-auto aspect-[3/4] w-full max-w-sm">
          <Image src={photos.roastery.src} alt={photos.roastery.alt} fill sizes="24rem" className="object-cover" />
        </div>
      </section>

      {/* SSS */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-24 md:px-10">
        <h2 className="font-serif text-4xl md:text-5xl">Sıkça sorulanlar</h2>
        <div className="mt-10 divide-y divide-ink-700 border-y border-ink-700">
          {wholesaleFaq.map((f) => (
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
            <p className="eyebrow text-flores-400">Teklif isteyin</p>
            <h2 className="mt-4 font-serif text-4xl">Hemen başlayalım</h2>
            <p className="mt-4 text-cream-300">Formu doldurun, 24 saat içinde işletmenize özel teklifi hazırlayıp dönelim.</p>
            <ul className="mt-8 space-y-4 text-sm">
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="text-cream-100 hover:text-flores-300">
                  WhatsApp · {site.phone}
                </a>
                <span className="block text-cream-500">En hızlı yanıt — direkt yazın, konuşalım.</span>
              </li>
              <li>
                <a href={site.phoneHref} className="text-cream-100 hover:text-flores-300">
                  Telefon · {site.phone}
                </a>
              </li>
              <li>
                <Link href="/coffee-bar" className="text-cream-100 hover:text-flores-300">
                  Deneyim barında tadım →
                </Link>
                <span className="block text-cream-500">{site.store.address}</span>
              </li>
            </ul>
          </div>
          <WholesaleQuoteForm whatsapp={site.whatsapp} />
        </div>
      </section>
    </>
  );
}
