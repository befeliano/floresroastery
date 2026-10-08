import type { Metadata } from "next";
import Image from "next/image";
import { EmTitle } from "@/components/em-title";
import { PageHeader } from "@/components/page-header";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { alternates, localPhotos, t } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const s = await t(pages.story);
  return { title: s.title, description: s.description, alternates: await alternates("/hikayemiz") };
}

export default async function StoryPage() {
  const s = await t(pages.story);
  const site = await t(pages.site);
  const home = await t(pages.home);
  const photos = await localPhotos();
  return (
    <>
      <PageHeader eyebrow={s.title} title={<EmTitle parts={s.heading} />} intro={site.about} />

      {/* Kavurma atölyesi */}
      <section className="mx-auto grid w-full max-w-[1440px] items-center gap-14 px-5 py-16 md:px-10 lg:grid-cols-2">
        <div className="arch relative mx-auto aspect-[9/14] w-full max-w-md">
          <Image src={photos.roastery.src} alt={photos.roastery.alt} fill preload quality={90} sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" />
        </div>
        <div className="reveal">
          <p className="eyebrow text-flores-400">{s.workshopEyebrow}</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight">{s.workshopTitle}</h2>
          <div className="mt-6 max-w-lg space-y-5 text-lg leading-relaxed text-cream-300">
            {s.workshop.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Ruso Exotics */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-24 md:px-10">
        <div className="relative overflow-hidden rounded-sm">
          <Image
            src={photos.storyIndonesia.src}
            alt={photos.storyIndonesia.alt}
            width={1600}
            height={560}
            quality={90}
            sizes="(min-width: 1440px) 1360px, 100vw"
            className="h-auto w-full"
          />
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <h2 className="font-serif text-5xl leading-tight">
            <EmTitle parts={s.rusoTitle} />
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-cream-300">
            {s.ruso.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <Link href="/kahveler?koleksiyon=ruso-exotics" className="btn btn-ghost mt-4">
              {s.rusoCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Şeffaflık */}
      <section id="seffaflik" className="scroll-mt-24 border-y border-ink-800 bg-ink-900 py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow text-flores-400">{s.transparencyEyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-tight">{s.transparencyTitle}</h2>
          <dl className="mt-14 grid gap-px bg-ink-700 md:grid-cols-2 lg:grid-cols-4">
            {s.transparency.map((item) => (
              <div key={item.k} className="bg-ink-900 p-8">
                <dt className="font-serif text-2xl text-cream-50">{item.k}</dt>
                <dd className="mt-3 leading-relaxed text-cream-300">{item.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative">
        <Image src={photos.boxesNature.src} alt={photos.boxesNature.alt} width={2000} height={707} quality={90} sizes="100vw" className="h-auto w-full" />
        <p lang="en" className="mx-auto max-w-[1440px] px-5 py-16 text-center font-serif text-4xl italic md:px-10 md:text-6xl">
          Where every bean has a story.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-[1440px] flex-wrap justify-center gap-4 px-5 pb-28 md:px-10">
        <Link href="/kahveler" className="btn btn-primary">
          {home.explore}
        </Link>
        <Link href="/coffee-bar" className="btn btn-ghost">
          {s.coffeeBarCta}
        </Link>
      </section>
    </>
  );
}
