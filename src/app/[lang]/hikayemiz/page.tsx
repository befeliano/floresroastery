import type { Metadata } from "next";
import Image from "next/image";
import { EmTitle } from "@/components/em-title";
import { PageHeader } from "@/components/page-header";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { select } from "@/i18n/select";
import { alternates, getLocale, localPhotos, t } from "@/i18n/server";
import { STORY_TIMELINE } from "@/content/story-timeline";

export async function generateMetadata(): Promise<Metadata> {
  const s = await t(pages.story);
  return { title: s.title, description: s.description, alternates: await alternates("/hikayemiz") };
}

export default async function StoryPage() {
  const s = await t(pages.story);
  const site = await t(pages.site);
  const home = await t(pages.home);
  const photos = await localPhotos();
  const timeline = select(STORY_TIMELINE, await getLocale());
  return (
    <>
      <PageHeader eyebrow={s.title} title={<EmTitle parts={s.heading} />} intro={site.about} />

      {/* Zaman çizelgesi — içerik: src/content/story-timeline.ts */}
      <section aria-labelledby="yolculuk" className="mx-auto w-full max-w-[1200px] px-5 pb-8 pt-4 md:px-10">
        <p className="eyebrow text-center text-flores-400">{s.timelineEyebrow}</p>
        <h2 id="yolculuk" className="mt-4 text-center font-serif text-4xl leading-tight md:text-5xl">
          {s.timelineTitle}
        </h2>
        <ol className="story-timeline relative mt-16 md:mt-20">
          {/* çizgi: kaydırdıkça dolar (destekleyen tarayıcılarda) */}
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-ink-700 md:left-1/2">
            <span className="story-timeline-fill absolute inset-0 bg-gradient-to-b from-flores-400 via-flores-500 to-flores-500/30" />
          </span>
          {timeline.map((c, i) => {
            const photo = photos[c.photo];
            const right = i % 2 === 1;
            return (
              <li key={c.title} className="relative grid gap-6 pb-16 pl-10 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0 md:pb-24">
                <span aria-hidden className="absolute left-0 top-1.5 size-[15px] rounded-full border-2 border-flores-400 bg-ink-950 shadow-[0_0_18px_rgba(95,164,214,0.45)] md:left-1/2 md:-translate-x-1/2" />
                <div className={`reveal ${right ? "md:order-2 md:pl-4" : "md:pr-4 md:text-right"}`}>
                  <p className="eyebrow text-[0.65rem] text-flores-300">
                    {c.year ? <span className="mr-2 font-mono text-sm tracking-normal text-cream-50">{c.year}</span> : null}
                    {c.label}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{c.title}</h3>
                  <p className={`mt-4 max-w-md text-lg leading-relaxed text-cream-300 ${right ? "" : "md:ml-auto"}`}>{c.text}</p>
                </div>
                <div className={`reveal ${right ? "md:order-1 md:pr-4" : "md:pl-4"}`}>
                  <div className={`relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-sm ${right ? "md:ml-auto" : ""}`}>
                    <Image src={photo.src} alt={photo.alt} fill quality={85} sizes="(min-width: 768px) 28rem, 90vw" className="object-cover" />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

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
