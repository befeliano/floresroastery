import type { Metadata } from "next";
import { EmTitle } from "@/components/em-title";
import { PageHeader } from "@/components/page-header";
import { CoffeeCompare } from "@/components/tools/coffee-compare";
import { tools } from "@/i18n/messages/tools";
import { alternates, getLocale, t } from "@/i18n/server";
import { getToolCoffees } from "@/lib/commerce/tools";

export async function generateMetadata(): Promise<Metadata> {
  const c = await t(tools.compare);
  return { title: c.metaTitle, description: c.metaDescription, alternates: await alternates("/karsilastir") };
}

export default async function ComparePage() {
  const c = await t(tools.compare);
  const coffees = await getToolCoffees(await getLocale());
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={<EmTitle parts={c.title} />} intro={c.intro} />
      <section className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <CoffeeCompare coffees={coffees} text={c} />
      </section>
    </>
  );
}
