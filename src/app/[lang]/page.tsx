import { BoxScroll } from "@/components/home/box-scroll";
import { BrewTeaser } from "@/components/home/brew-teaser";
import { CategoryArches } from "@/components/home/category-arches";
import { DailyBlends } from "@/components/home/daily-blends";
import { FeaturedCoffees } from "@/components/home/featured-coffees";
import { Hero } from "@/components/home/hero";
import { HomeFaq } from "@/components/home/home-faq";
import { InstagramBand } from "@/components/home/instagram-band";
import { Manifesto } from "@/components/home/manifesto";
import { Pillars } from "@/components/home/pillars";
import { RusoExotics } from "@/components/home/ruso-exotics";
import { VisitUs } from "@/components/home/visit-us";
import { JsonLd } from "@/components/json-ld";
import { catalogL } from "@/i18n/catalog";
import { getCollection, getFeaturedProducts, getProduct, getProductsByCategory } from "@/lib/commerce";
import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";
import { storeSchema } from "@/lib/seo";

export default async function Home() {
  const L = await catalogL();
  const h = await t(pages.home);
  const [featured, ruso, blends, manis] = await Promise.all([
    getFeaturedProducts(),
    getCollection("ruso-exotics"),
    getProductsByCategory("blends"),
    getProduct("manis-blend-espresso-filtre"),
  ]);
  // Endonezce isimli üçlü: Manis (tek köken Etiyopya Sidamo) + Pagi ve Tanah harmanları
  const daily = [...(manis ? [manis] : []), ...blends.filter((p) => p.slug !== manis?.slug)];

  return (
    <>
      <JsonLd data={storeSchema()} />
      {/* kaydırmalı kutu sahnesi en üstte; kavurucu videosu hemen altında */}
      <BoxScroll text={h.boxScroll} heading />
      <Hero first={false} />
      <CategoryArches categories={L.categories().filter((c) => ["single-origin", "blends", "espresso"].includes(c.slug))} />
      <FeaturedCoffees products={featured.map(L.card)} />
      <RusoExotics products={ruso.map(L.card)} />
      <Manifesto />
      <Pillars />
      <DailyBlends products={daily.map(L.card)} />
      <BrewTeaser />
      <VisitUs />
      <InstagramBand />
      <HomeFaq />
    </>
  );
}
