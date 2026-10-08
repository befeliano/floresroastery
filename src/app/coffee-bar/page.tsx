import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { photos } from "@/lib/photos";
import { storeSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coffee Bar — Kahve Tadım Randevusu",
  description: `Eskişehir Tepebaşı'ndaki deneyim barımızda tüm çekirdeklerimizi tadın. ${site.coffeeBar.days}, ${site.coffeeBar.hours}.${
    site.coffeeBar.promo ? ` ${site.coffeeBar.promo}.` : ""
  }`,
  alternates: { canonical: "/coffee-bar" },
};

const experience = [
  "Tüm single origin ve blend'lerimizi yerinde tadım",
  "Barista eşliğinde espresso & filtre kıyaslaması",
  "Demleme yöntemleri ve öğütme üzerine sohbet",
  "Evinize ya da işletmenize en uygun profili birlikte seçme",
];

export default function CoffeeBarPage() {
  const cb = site.coffeeBar;
  return (
    <>
      <JsonLd data={storeSchema()} />
      <section className="relative isolate overflow-hidden">
        <Image src="/video/roastery-poster.jpg" alt="" fill preload sizes="100vw" className="-z-20 object-cover opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/60 via-ink-950/80 to-ink-950" />

        <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-5 pb-24 pt-32 md:px-10 md:pt-40 lg:grid-cols-[1fr_30rem]">
          <div>
            <p className="eyebrow text-flores-400">
              <span lang="en">Coffee Bar</span> · Tepebaşı, Eskişehir
            </p>
            <h1 className="mt-5 font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98]">
              Kahve tadım <em className="text-flores-300">randevusu</em>
            </h1>
            {cb.promo && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-flores-500 px-4 py-2 text-sm font-semibold text-ink-950">
                <span aria-hidden>✦</span> {cb.promo}
              </p>
            )}
            <p className="mt-6 max-w-xl text-lg text-cream-300">
              Kör bir seçim yapmayın. Kavurduğumuz her çekirdeği deneyim barımızda, barmenlerimiz eşliğinde tadın; damağınıza uyan profili yerinde
              bulun.
            </p>

            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-sm bg-ink-700">
              {[
                ["Günler", cb.days],
                ["Saatler", cb.hours],
                ["Kapasite", `Saat başına ${cb.capacity} kişi`],
                ["Kapalı", cb.closed.replace(" kapalı", "")],
              ].map(([k, v]) => (
                <div key={k} className="bg-ink-900 p-5">
                  <dt className="eyebrow text-[0.6rem] text-cream-500">{k}</dt>
                  <dd className="mt-1 text-cream-100">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-10 max-w-xl space-y-3">
              {experience.map((e) => (
                <li key={e} className="flex gap-3 text-cream-200">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-flores-400" />
                  {e}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              <a href={site.store.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Yol tarifi
              </a>
              <a
                href={`${site.whatsapp}?text=${encodeURIComponent("Merhaba, deneyim barınıza uğrayıp çekirdek tatmak istiyorum.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                WhatsApp&apos;tan yaz
              </a>
            </div>
            <p className="mt-6 text-sm text-cream-500">{site.store.address}</p>
          </div>

          {/* randevu formu — randevu.floresroastery.com (kendi veritabanı, e-posta onayı ve iptal bağlantısıyla) */}
          <div id="randevu" className="scroll-mt-28">
            <div className="overflow-hidden rounded-sm border border-ink-600 bg-[#f4f8fb] shadow-2xl shadow-black/40">
              <iframe
                src={site.links.booking}
                title="Flores Roastery kahve tadım randevu formu"
                className="block h-[1120px] w-full"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p className="mt-3 text-center text-xs text-cream-500">
              Form görünmüyor mu?{" "}
              <a href={site.links.booking} target="_blank" rel="noopener noreferrer" className="text-flores-300 underline underline-offset-4">
                Randevu sayfasını yeni sekmede açın
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 pb-28 md:px-10 lg:grid-cols-2">
        <div className="arch relative mx-auto aspect-[4/5] w-full max-w-sm">
          <Image src={photos.cuppingPour.src} alt={photos.cuppingPour.alt} fill sizes="24rem" className="object-cover" />
        </div>
        <div>
          <h2 className="font-serif text-4xl md:text-5xl">Kavrulduğu yerde, yan yana fincanlar</h2>
          <p className="mt-5 max-w-lg text-lg text-cream-300">
            Barımız, Kuban kavurucumuzun hemen yanında. Tadım sırasında haftanın kavrumunu, kavurma derecelerini ve demleme tarifleri üzerine
            merak ettiklerinizi sorabilirsiniz. İşletmeniz için kahve arıyorsanız{" "}
            <Link href="/toptan" className="text-flores-300 underline underline-offset-4">
              toptan satış
            </Link>{" "}
            seçeneklerini de birlikte konuşalım.
          </p>
          <Link href="/kahveler" className="btn btn-primary mt-8">
            Kahvelerimizi keşfedin
          </Link>
        </div>
      </section>
    </>
  );
}
