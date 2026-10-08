import type { Metadata } from "next";
import { ReturnForm } from "@/components/forms/return-form";
import { PageHeader } from "@/components/page-header";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { alternates, t } from "@/i18n/server";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const p = await t(pages.returns);
  return { title: p.title, description: p.description, alternates: await alternates("/iade-talebi") };
}

export default async function ReturnsPage() {
  const p = await t(pages.returns);
  return (
    <>
      <PageHeader
        eyebrow={p.eyebrow}
        title={p.heading}
        intro={
          <>
            {p.intro}{" "}
            <Link href="/teslimat-ve-iade-sartlari" className="text-flores-300 underline underline-offset-4">
              {p.terms}
            </Link>
          </>
        }
      />
      <div className="mx-auto grid w-full max-w-[1440px] gap-16 px-5 pb-28 md:px-10 lg:grid-cols-[1fr_22rem]">
        <ReturnForm />
        <aside className="space-y-8 self-start">
          <ol className="space-y-5">
            {p.steps.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="font-mono text-sm text-flores-400">0{i + 1}</span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className="mt-1 text-sm text-cream-400">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="rounded-sm border border-amber-300/30 bg-amber-300/5 p-4 text-sm text-amber-100">{p.groundNote}</p>
          <p className="text-sm text-cream-400">
            {p.questions}{" "}
            <a href={`mailto:${site.email}`} className="text-flores-300 underline underline-offset-4">
              {site.email}
            </a>{" "}
            ·{" "}
            <a href={site.phoneHref} className="text-flores-300 underline underline-offset-4">
              {site.phone}
            </a>
          </p>
        </aside>
      </div>
    </>
  );
}
