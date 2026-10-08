import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { CoffeeCatalog, CoffeeCatalogStatic } from "@/components/product/coffee-catalog";
import { getProducts, toCard } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Tüm Kahveler — Specialty Çekirdek Kahve",
  description:
    "Flores Roastery çekirdek kahveleri: Endonezya Ruso Exotics serisi, El Salvador, Kolombiya ve Meksika tek kökenliler; Manis, Pagi ve Tanah harmanları. Haftalık taze kavrum.",
  alternates: { canonical: "/kahveler" },
};

export default async function CoffeesPage() {
  const products = (await getProducts()).map(toCard);

  return (
    <>
      <PageHeader
        eyebrow="Kahveler"
        title={
          <>
            Her çekirdeğin <em className="text-flores-300">bir hikâyesi</em> var.
          </>
        }
        intro="Java'nın volkanik yamaçlarından El Salvador'un aile çiftliklerine; doğrudan ticaretle seçtiğimiz, Eskişehir'de haftalık kavurduğumuz kahveler."
      >
        <Breadcrumbs
          className="mt-8"
          items={[
            { name: "Ana Sayfa", path: "/" },
            { name: "Kahveler", path: "/kahveler" },
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
