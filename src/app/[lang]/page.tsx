import { BrewTeaser } from "@/components/home/brew-teaser";
import { CategoryArches } from "@/components/home/category-arches";
import { DailyBlends } from "@/components/home/daily-blends";
import { FeaturedCoffees } from "@/components/home/featured-coffees";
import { Hero } from "@/components/home/hero";
import { HomeFaq } from "@/components/home/home-faq";
import { Manifesto } from "@/components/home/manifesto";
import { Pillars } from "@/components/home/pillars";
import { RusoExotics } from "@/components/home/ruso-exotics";
import { VisitUs } from "@/components/home/visit-us";
import { JsonLd } from "@/components/json-ld";
import { catalogL } from "@/i18n/catalog";
import { getCollection, getFeaturedProducts, getProductsByCategory } from "@/lib/commerce";
import { storeSchema } from "@/lib/seo";

export default async function Home() {
  const L = await catalogL();
  const [featured, ruso, blends] = await Promise.all([getFeaturedProducts(), getCollection("ruso-exotics"), getProductsByCategory("blends")]);

  return (
    <>
      <JsonLd data={storeSchema()} />
      <Hero />
      <CategoryArches categories={L.categories().filter((c) => ["single-origin", "blends", "espresso"].includes(c.slug))} />
      <FeaturedCoffees products={featured.map(L.card)} />
      <RusoExotics products={ruso.map(L.card)} />
      <Manifesto />
      <Pillars />
      <DailyBlends products={blends.map(L.card)} />
      <BrewTeaser />
      <VisitUs />
      <HomeFaq />
    </>
  );
}
