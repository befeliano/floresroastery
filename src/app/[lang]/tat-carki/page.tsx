import type { Metadata } from "next";
import { EmTitle } from "@/components/em-title";
import { PageHeader } from "@/components/page-header";
import { FlavorWheel } from "@/components/tools/flavor-wheel";
import { tools } from "@/i18n/messages/tools";
import { alternates, getLocale, t } from "@/i18n/server";
import { getToolCoffees } from "@/lib/commerce/tools";

export async function generateMetadata(): Promise<Metadata> {
  const w = await t(tools.wheel);
  return { title: w.metaTitle, description: w.metaDescription, alternates: await alternates("/tat-carki") };
}

export default async function FlavorWheelPage() {
  const w = await t(tools.wheel);
  const view = (await t(tools.finder)).view;
  const coffees = await getToolCoffees(await getLocale());
  return (
    <>
      <PageHeader eyebrow={w.eyebrow} title={<EmTitle parts={w.title} />} intro={w.intro} />
      <section className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <FlavorWheel coffees={coffees} text={w} cta={view} />
      </section>
    </>
  );
}
