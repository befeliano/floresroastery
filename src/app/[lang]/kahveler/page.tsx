import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmTitle } from "@/components/em-title";
import { PageHeader } from "@/components/page-header";
import { CoffeeCatalog, CoffeeCatalogStatic } from "@/components/product/coffee-catalog";
import { catalogL } from "@/i18n/catalog";
import { pages } from "@/i18n/messages/pages";
import { alternates, t } from "@/i18n/server";
import { getProducts } from "@/lib/commerce";

export async function generateMetadata(): Promise<Metadata> {
  const c = await t(pages.catalog);
  return { title: c.title, description: c.description, alternates: await alternates("/kahveler") };
}

export default async function CoffeesPage() {
  const L = await catalogL();
  const c = await t(pages.catalog);
  const cr = await t(pages.crumbs);
  const products = (await getProducts()).map(L.card);

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={<EmTitle parts={c.heading} />} intro={c.intro} video="/video/kahveler">
        <Breadcrumbs
          className="mt-8"
          items={[
            { name: cr.home, path: "/" },
            { name: cr.coffees, path: "/kahveler" },
          ]}
        />
      </PageHeader>
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <Suspense fallback={<CoffeeCatalogStatic products={products} />}>
          <CoffeeCatalog products={products} />
        </Suspense>
      </div>
    </>
  );
}
