import type { Metadata } from "next";
import { EmTitle } from "@/components/em-title";
import { PageHeader } from "@/components/page-header";
import { CoffeeFinder } from "@/components/tools/coffee-finder";
import { tools } from "@/i18n/messages/tools";
import { alternates, getLocale, t } from "@/i18n/server";
import { getToolCoffees } from "@/lib/commerce/tools";

export async function generateMetadata(): Promise<Metadata> {
  const f = await t(tools.finder);
  return { title: f.metaTitle, description: f.metaDescription, alternates: await alternates("/kahve-bulucu") };
}

export default async function CoffeeFinderPage() {
  const f = await t(tools.finder);
  const coffees = await getToolCoffees(await getLocale());
  return (
    <>
      <PageHeader eyebrow={f.eyebrow} title={<EmTitle parts={f.title} />} intro={f.intro} />
      <section className="mx-auto w-full max-w-3xl px-5 pb-28 md:px-10">
        <CoffeeFinder coffees={coffees} text={f} />
      </section>
    </>
  );
}
