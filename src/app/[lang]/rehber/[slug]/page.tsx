import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { GUIDES, getGuide } from "@/content/seo/guides";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { articleSchema } from "@/lib/seo";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/rehber/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g || (await getLocale()) !== "tr") return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/rehber/${g.slug}`, languages: { tr: `/rehber/${g.slug}`, "x-default": `/rehber/${g.slug}` } },
    openGraph: { type: "article", title: g.title, description: g.description, locale: "tr_TR", url: `/rehber/${g.slug}`, images: [g.image] },
  };
}

export default async function GuidePage({ params }: PageProps<"/[lang]/rehber/[slug]">) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g || (await getLocale()) !== "tr") notFound();
  const others = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 4);

  return (
    <article className="mx-auto w-full max-w-[1440px] px-5 pb-28 pt-28 md:px-10 md:pt-36">
      <JsonLd data={articleSchema({ title: g.title, description: g.description, path: `/rehber/${g.slug}`, image: g.image, date: g.date })} />
      <Breadcrumbs
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Kahve Rehberi", path: "/rehber" },
          { name: g.title, path: `/rehber/${g.slug}` },
        ]}
      />
      <header className="mx-auto mt-10 max-w-3xl">
        <p className="eyebrow text-flores-400">Kahve rehberi · {g.readMin} dk okuma</p>
        <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">{g.title}</h1>
        <p className="mt-5 text-lg text-cream-300">{g.description}</p>
      </header>
      <div className="relative mx-auto mt-10 aspect-[21/9] max-w-5xl overflow-hidden rounded-sm">
        <Image src={g.image} alt={g.title} fill preload quality={90} sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
      </div>
      <div className="mx-auto mt-12 max-w-3xl space-y-6 text-lg leading-relaxed text-cream-200">
        {g.blocks.map((b, i) =>
          "h2" in b ? (
            <h2 key={i} className="pt-6 font-serif text-3xl text-cream-50">
              {b.h2}
            </h2>
          ) : "p" in b ? (
            <p key={i}>{b.p}</p>
          ) : "ul" in b ? (
            <ul key={i} className="space-y-2 pl-1">
              {b.ul.map((li) => (
                <li key={li} className="flex gap-3">
                  <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-flores-400" />
                  {li}
                </li>
              ))}
            </ul>
          ) : (
            <nav key={i} aria-label="İlgili sayfalar" className="rounded-sm border border-ink-700 bg-ink-900 p-5 text-base">
              <p className="eyebrow text-[0.65rem] text-flores-400">İlgili</p>
              <ul className="mt-3 space-y-2">
                {b.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-flores-200 underline underline-offset-4 hover:text-flores-100">
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ),
        )}
      </div>
      <aside className="mx-auto mt-16 max-w-3xl border-t border-ink-700 pt-10">
        <h2 className="eyebrow text-cream-400">Diğer yazılar</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/rehber/${o.slug}`} className="block rounded-sm border border-ink-700 p-4 hover:border-flores-400">
                <span className="font-serif text-xl">{o.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
