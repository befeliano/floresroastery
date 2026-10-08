import { BrewTeaser } from "@/components/home/brew-teaser";
import { CategoryArches } from "@/components/home/category-arches";
import { DailyBlends } from "@/components/home/daily-blends";
import { FeaturedCoffees } from "@/components/home/featured-coffees";
import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { Pillars } from "@/components/home/pillars";
import { RusoExotics } from "@/components/home/ruso-exotics";
import { VisitUs } from "@/components/home/visit-us";
import { getCategories, getCollection, getFeaturedProducts, getProductsByCategory, toCard } from "@/lib/commerce";

export default async function Home() {
  const [featured, ruso, blends] = await Promise.all([getFeaturedProducts(), getCollection("ruso-exotics"), getProductsByCategory("blends")]);

  return (
    <>
      <Hero />
      <CategoryArches categories={getCategories()} />
      <FeaturedCoffees products={featured.map(toCard)} />
      <RusoExotics products={ruso.map(toCard)} />
      <Manifesto />
      <Pillars />
      <DailyBlends products={blends.map(toCard)} />
      <BrewTeaser />
      <VisitUs />
    </>
  );
}
