import type { Metadata } from "next";
import Image from "next/image";
import { BrewLog } from "@/components/brew/brew-log";
import { GrinderGuide } from "@/components/brew/grinder-guide";
import { PwaInstall } from "@/components/brew/pwa-install";
import { RatioCalculator } from "@/components/brew/ratio-calculator";
import { localeMeta } from "@/i18n/config";
import { tools } from "@/i18n/messages/tools";
import { getToolCoffees } from "@/lib/commerce/tools";
import { EmTitle } from "@/components/em-title";
import { HeroVideo } from "@/components/home/hero-video";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { BrewTabs } from "@/components/product/brew-guide";
import { localizeBrew } from "@/i18n/content";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { alternates, getLocale, localPhotos, t } from "@/i18n/server";
import { chemex, espresso, frenchPress, kalita, v60 } from "@/lib/commerce/brew";
import { howToSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const b = await t(pages.brewPage);
  return { title: b.title, description: b.description, alternates: await alternates("/demleme-rehberi") };
}

const GRIND_META = [
  { micron: "~100 µm", pct: 6 },
  { micron: "~250 µm", pct: 18 },
  { micron: "~400 µm", pct: 32 },
  { micron: "~600 µm", pct: 48 },
  { micron: "~650 µm", pct: 54 },
  { micron: "~800 µm", pct: 66 },
  { micron: "~1000 µm", pct: 82 },
  { micron: "~1200 µm", pct: 96 },
];

export default async function BrewGuidePage() {
  const locale = await getLocale();
  const b = await t(pages.brewPage);
  const tl = await t(tools);
  const photos = await localPhotos();
  const coffeeNames = (await getToolCoffees(locale)).map((c) => c.name);
  const L = (g: ReturnType<typeof v60>) => localizeBrew(g, locale)!;
  const tabs = [
    { key: "v60", label: "V60", guide: L(v60()) },
    { key: "kalita", label: "Kalita", guide: L(kalita()) },
    { key: "chemex", label: "Chemex", guide: L(chemex()) },
    { key: "french", label: "French Press", guide: L(frenchPress()) },
    { key: "espresso", label: "Espresso", guide: L(espresso()) },
  ];
  const v = tabs[0].guide;
  const [introA, introB] = b.intro.split("{link}");

  return (
    <>
      <JsonLd
        data={howToSchema({
          name: `V60 — ${b.eyebrow}`,
          description: b.description,
          totalSeconds: v.totalTime,
          supplies: ["Hario V60", `${v.dose} g`, `${v.output} g · ${v.temperature} °C`],
          steps: v.steps.map((s) => ({ name: s.title, text: s.detail ?? s.title })),
        })}
      />
      <PageHeader
        eyebrow={b.eyebrow}
        title={<EmTitle parts={b.heading} />}
        intro={
          <>
            {introA}
            <Link href="/kahveler" className="text-flores-300 underline underline-offset-4">
              {b.introLink}
            </Link>
            {introB}
          </>
        }
      />

      {/* geniş görsel bant */}
      <div className="mx-auto mb-16 w-full max-w-[1440px] px-5 md:px-10">
        <div className="relative aspect-[21/9] overflow-hidden rounded-sm">
          <Image src={photos.v60Pour.src} alt={photos.v60Pour.alt} fill preload quality={90} sizes="(min-width: 1440px) 1360px, 100vw" className="object-cover object-[50%_60%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        </div>
      </div>

      <BrewTabs tabs={tabs} heading={false} />

      {/* espresso makinesinden — döngü video */}
      <section className="mx-auto mt-28 w-full max-w-[1440px] px-5 md:px-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm md:aspect-[21/9]">
          <HeroVideo base="/video/espresso" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 font-serif text-3xl italic md:bottom-10 md:left-10 md:text-5xl">Espresso</p>
        </div>
      </section>

      <section className="mx-auto mt-28 grid w-full max-w-[1440px] gap-12 px-5 pb-28 md:px-10 lg:grid-cols-[1fr_26rem]">
        <div>
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-sm lg:hidden">
            <Image src={photos.brewKit.src} alt={photos.brewKit.alt} fill quality={90} sizes="100vw" className="object-cover" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl">{b.grindTitle}</h2>
          <p className="mt-4 max-w-xl text-cream-300">{b.grindText}</p>
          <ul className="mt-10 space-y-5">
            {b.grind.map((g, i) => (
              <li key={g.method} className="grid grid-cols-[minmax(0,10rem)_1fr] items-center gap-6 sm:grid-cols-[13rem_1fr_6rem]">
                <div>
                  <p className="text-cream-100">{g.method}</p>
                  <p className="text-xs text-cream-500">{g.size}</p>
                </div>
                <div className="relative h-2 rounded-full bg-ink-800">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-flores-500" style={{ width: `${GRIND_META[i].pct}%` }} />
                </div>
                <p className="hidden text-right font-mono text-sm text-cream-400 sm:block">{GRIND_META[i].micron}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-8">
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-sm lg:block">
            <Image src={photos.brewKit.src} alt={photos.brewKit.alt} fill quality={90} sizes="26rem" className="object-cover" />
          </div>
          <RatioCalculator />
          <PwaInstall text={tl.pwa} />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] space-y-28 px-5 pb-28 md:px-10">
        <GrinderGuide text={tl.grinders} />
        <BrewLog coffees={coffeeNames} text={tl.log} locale={localeMeta[locale].intl} />
      </div>
    </>
  );
}
