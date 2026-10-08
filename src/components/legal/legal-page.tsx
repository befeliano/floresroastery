import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getLegalDoc, legalLinks } from "@/content/legal";
import { localeMeta } from "@/i18n/config";
import { pages } from "@/i18n/messages/pages";
import { alternates, getLocale, t } from "@/i18n/server";
import { LegalBlocks } from "./legal-document";

export function legalMetadata(slug: string) {
  return async (): Promise<Metadata> => {
    const doc = getLegalDoc(slug);
    const titles = await t(pages.legal.links);
    return doc
      ? { title: titles[slug as keyof typeof titles] ?? doc.title, description: doc.description, alternates: await alternates(`/${slug}`) }
      : {};
  };
}

export async function LegalPage({ slug }: { slug: string }) {
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  const locale = await getLocale();
  const l = await t(pages.legal);
  const c = await t(pages.crumbs);
  const headings = doc.blocks.flatMap((b, i) => ("h" in b ? [{ id: `b${i}`, text: b.h }] : []));

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-28 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs
        items={[
          { name: c.home, path: "/" },
          { name: l.links[doc.slug as keyof typeof l.links] ?? doc.title, path: `/${doc.slug}` },
        ]}
      />
      <div className="mt-10 grid gap-14 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label={l.navAria} className="sticky top-28 space-y-1 text-sm">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.href === `/${doc.slug}` ? "page" : undefined}
                className={`block rounded-sm px-3 py-2 transition-colors ${
                  link.href === `/${doc.slug}` ? "bg-ink-800 text-cream-50" : "text-cream-400 hover:text-cream-100"
                }`}
              >
                {l.links[link.href.slice(1) as keyof typeof l.links] ?? link.label}
              </Link>
            ))}
            <Link href="/iade-talebi" className="mt-4 block px-3 py-2 text-flores-300 hover:text-flores-200">
              {l.returnCta}
            </Link>
          </nav>
        </aside>

        <article className="max-w-3xl">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight">{doc.title}</h1>
          <p className="mt-3 text-sm text-cream-500">
            {l.updated.replace("{date}", new Intl.DateTimeFormat(localeMeta[locale].intl, { dateStyle: "long" }).format(new Date(doc.updated)))}
          </p>
          {l.notice && <p className="mt-6 rounded-sm border border-flores-500/40 bg-flores-500/5 p-4 text-sm text-cream-200">{l.notice}</p>}
          {headings.length > 4 && (
            <details className="mt-8 rounded-sm border border-ink-700 bg-ink-900 lg:hidden">
              <summary className="cursor-pointer px-4 py-3 text-sm text-cream-300">{l.toc}</summary>
              <ol className="space-y-1 px-4 pb-4 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-cream-400 hover:text-cream-100">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}
          <div className="mt-10">
            <LegalBlocks blocks={doc.blocks} />
          </div>
        </article>
      </div>
    </div>
  );
}
