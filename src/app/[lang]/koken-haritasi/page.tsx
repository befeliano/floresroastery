import type { Metadata } from "next";
import { EmTitle } from "@/components/em-title";
import { PageHeader } from "@/components/page-header";
import { OriginMap } from "@/components/tools/origin-map";
import { tools } from "@/i18n/messages/tools";
import { alternates, getLocale, t } from "@/i18n/server";
import { getToolCoffees, ORIGINS } from "@/lib/commerce/tools";

export async function generateMetadata(): Promise<Metadata> {
  const m = await t(tools.map);
  return { title: m.metaTitle, description: m.metaDescription, alternates: await alternates("/koken-haritasi") };
}

export default async function OriginMapPage() {
  const m = await t(tools.map);
  const view = (await t(tools.finder)).view;
  const coffees = await getToolCoffees(await getLocale());
  return (
    <>
      <PageHeader eyebrow={m.eyebrow} title={<EmTitle parts={m.title} />} intro={m.intro} />
      <section className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <OriginMap coffees={coffees} origins={ORIGINS} text={m} cta={view} />
      </section>
    </>
  );
}
