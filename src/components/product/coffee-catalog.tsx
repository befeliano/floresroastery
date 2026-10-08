"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProductCard } from "@/components/product/product-card";
import { useI18n } from "@/i18n/client";
import { isSoldOut, type CardProduct as Product } from "@/lib/commerce/types";

const FILTERS = [
  { key: "all", label: "" },
  { key: "single-origin", label: "Single Origin", en: true },
  { key: "blends", label: "Blends", en: true },
  { key: "espresso", label: "Espresso", en: true },
  { key: "ruso-exotics", label: "Ruso Exotics", en: true },
  { key: "sets", label: "Sets & Boxes", en: true },
  { key: "accessories", label: "Accessories", en: true },
] as const;

const SORTS = [
  { key: "featured", label: "featured" },
  { key: "price-asc", label: "priceAsc" },
  { key: "price-desc", label: "priceDesc" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];
type SortKey = (typeof SORTS)[number]["key"];

const minPrice = (p: Product) => (p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : Infinity);

function apply(products: Product[], filter: FilterKey, inStock: boolean, sort: SortKey) {
  let list = products.filter((p) =>
    filter === "all" ? true : filter === "ruso-exotics" ? p.collection === "ruso-exotics" : p.categories.includes(filter),
  );
  if (inStock) list = list.filter((p) => !isSoldOut(p));
  list = [...list].sort((a, b) => {
    const so = Number(isSoldOut(a)) - Number(isSoldOut(b));
    if (so !== 0) return so;
    if (sort === "price-asc") return minPrice(a) - minPrice(b);
    if (sort === "price-desc") return minPrice(b) - minPrice(a);
    return Number(!!b.featured) - Number(!!a.featured);
  });
  return list;
}

/** URL parametreleriyle (?kategori=…&stok=1&sirala=…) senkron katalog */
export function CoffeeCatalog({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = params.get("koleksiyon") ?? params.get("kategori") ?? "all";
  const filter = (FILTERS.some((f) => f.key === raw) ? raw : "all") as FilterKey;
  const inStock = params.get("stok") === "1";
  const sort = (SORTS.some((s) => s.key === params.get("sirala")) ? params.get("sirala") : "featured") as SortKey;

  const list = useMemo(() => apply(products, filter, inStock, sort), [products, filter, inStock, sort]);

  const update = (next: Partial<{ filter: FilterKey; inStock: boolean; sort: SortKey }>) => {
    const f = next.filter ?? filter;
    const s = next.sort ?? sort;
    const st = next.inStock ?? inStock;
    const q = new URLSearchParams();
    if (f !== "all") q.set(f === "ruso-exotics" ? "koleksiyon" : "kategori", f);
    if (st) q.set("stok", "1");
    if (s !== "featured") q.set("sirala", s);
    router.replace(q.size ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  return <CatalogView products={list} filter={filter} inStock={inStock} sort={sort} onChange={update} />;
}

/** Statik ön-render ve Suspense yedeği: filtresiz liste */
export function CoffeeCatalogStatic({ products }: { products: Product[] }) {
  return <CatalogView products={apply(products, "all", false, "featured")} filter="all" inStock={false} sort="featured" />;
}

function CatalogView({
  products,
  filter,
  inStock,
  sort,
  onChange,
}: {
  products: Product[];
  filter: FilterKey;
  inStock: boolean;
  sort: SortKey;
  onChange?: (next: Partial<{ filter: FilterKey; inStock: boolean; sort: SortKey }>) => void;
}) {
  const { t, fmt } = useI18n();
  return (
    <>
      <div className="sticky top-18 z-30 -mx-5 flex flex-col gap-4 border-b border-ink-800 bg-ink-950/90 px-5 py-4 backdrop-blur-xl md:top-20 md:-mx-10 md:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={t.catalog.filterAria} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              lang={"en" in f ? "en" : undefined}
              onClick={() => onChange?.({ filter: f.key })}
              className={`eyebrow shrink-0 rounded-full border px-4 py-2 text-[0.65rem] transition-colors ${
                filter === f.key ? "border-flores-500 bg-flores-500 text-ink-950" : "border-ink-600 text-cream-200 hover:border-cream-300"
              }`}
            >
              {f.key === "all" ? t.catalog.all : f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-cream-300">
            <input type="checkbox" checked={inStock} onChange={(e) => onChange?.({ inStock: e.target.checked })} className="size-4 accent-[#5fa4d6]" />
            {t.catalog.inStockOnly}
          </label>
          <label className="flex items-center gap-2 text-cream-300">
            <span className="sr-only sm:not-sr-only">{t.catalog.sort}</span>
            <select
              value={sort}
              onChange={(e) => onChange?.({ sort: e.target.value as SortKey })}
              className="rounded-sm border border-ink-600 bg-ink-900 px-3 py-2 text-cream-100 focus:border-flores-500 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {t.catalog[s.label]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-cream-500" aria-live="polite">
        {fmt(t.catalog.count, { n: products.length })}
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p, i) => (
          <li key={p.slug}>
            <ProductCard product={p} priority={i < 4} />
          </li>
        ))}
      </ul>
      {products.length === 0 && <p className="py-20 text-center text-cream-400">{t.catalog.empty}</p>}
    </>
  );
}
