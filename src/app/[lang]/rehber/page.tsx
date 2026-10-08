import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { CITIES } from "@/content/seo/cities";
import { GUIDES } from "@/content/seo/guides";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  if ((await getLocale()) !== "tr") return {};
  return {
    title: "Kahve Rehberi — 3. Nesil Kahve, V60, Endonezya, Etiyopya, Kolombiya",
    description:
      "Specialty (3. nesil) kahve nedir, V60 ile filtre kahve nasıl demlenir, Endonezya, Etiyopya ve Kolombiya kahvesi, çekirdek kahve saklama ve demleme yöntemine göre kahve seçimi.",
    alternates: { canonical: "/rehber", languages: { tr: "/rehber", "x-default": "/rehber" } },
  };
}

export default async function GuidesIndex() {
  if ((await getLocale()) !== "tr") notFound();
  return (
    <>
      <PageHeader
        eyebrow="Kahve rehberi"
        title="Kahveyi tanımak için okuyun, tadarak öğrenin."
        intro="3. nesil kahveden V60 tarifine, Java'nın volkanik yamaçlarından Etiyopya'nın çiçeksi fincanlarına — kavurma atölyemizden notlar."
      />
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 md:px-10">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={`/rehber/${g.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                  <Image src={g.image} alt="" fill quality={85} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-4 text-xs text-cream-500">{g.readMin} dk okuma</p>
                <h2 className="mt-1 font-serif text-2xl leading-tight group-hover:text-flores-300">{g.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-cream-400">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-20 border-t border-ink-800 pt-10">
          <h2 className="eyebrow text-flores-400">Şehrinize taze kavrum</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/kahve/${c.slug}`} className="inline-block rounded-full border border-ink-600 px-4 py-2 text-sm text-cream-200 hover:border-flores-400">
                  {c.city} specialty kahve
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
