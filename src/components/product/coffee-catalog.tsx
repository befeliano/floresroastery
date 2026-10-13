"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "@/i18n/link";
import { ProductCard } from "@/components/product/product-card";
import { useI18n } from "@/i18n/client";
import { FLAVOR_GROUPS, PROCESS_KINDS, type FlavorGroup, type MethodFit, type ProcessKind } from "@/lib/commerce/flavor";
import { isSoldOut, type CardProduct as Product, type RoastLevel } from "@/lib/commerce/types";

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
  { key: "bestselling", label: "bestselling" },
  { key: "price-asc", label: "priceAsc" },
  { key: "price-desc", label: "priceDesc" },
] as const;

const ROASTS: RoastLevel[] = ["Açık", "Açık-Orta", "Orta", "Orta-Koyu"];
const METHODS: (keyof MethodFit)[] = ["filter", "espresso", "turkish", "immersion"];

type FilterKey = (typeof FILTERS)[number]["key"];
type SortKey = (typeof SORTS)[number]["key"];

/** Ek filtreler — her grupta seçilenlerden biri yeterli, gruplar arası hepsi sağlanmalı */
type Facets = { tat: FlavorGroup[]; kavrum: RoastLevel[]; isleme: ProcessKind[]; yontem: (keyof MethodFit)[] };
const NO_FACETS: Facets = { tat: [], kavrum: [], isleme: [], yontem: [] };
const facetCount = (f: Facets) => f.tat.length + f.kavrum.length + f.isleme.length + f.yontem.length;

const minPrice = (p: Product) => (p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : Infinity);

function matches(p: Product, f: Facets) {
  if (f.tat.length && !f.tat.some((g) => p.flavorGroups.includes(g))) return false;
  if (f.kavrum.length && (p.auto || !f.kavrum.includes(p.roastLevel))) return false;
  if (f.isleme.length && !f.isleme.some((k) => p.processKinds.includes(k))) return false;
  if (f.yontem.length && !f.yontem.some((m) => p.fit[m])) return false;
  return true;
}

function apply(products: Product[], filter: FilterKey, inStock: boolean, sort: SortKey, facets: Facets) {
  let list = products.filter((p) =>
    filter === "all" ? true : filter === "ruso-exotics" ? p.collection === "ruso-exotics" : p.categories.includes(filter),
  );
  if (inStock) list = list.filter((p) => !isSoldOut(p));
  if (facetCount(facets)) list = list.filter((p) => matches(p, facets));
  list = [...list].sort((a, b) => {
    const so = Number(isSoldOut(a)) - Number(isSoldOut(b));
    if (so !== 0) return so;
    if (sort === "price-asc") return minPrice(a) - minPrice(b);
    if (sort === "price-desc") return minPrice(b) - minPrice(a);
    if (sort === "bestselling") return (b.sales ?? 0) - (a.sales ?? 0) || Number(!!b.featured) - Number(!!a.featured);
    return Number(!!b.featured) - Number(!!a.featured);
  });
  return list;
}

const parseList = <T extends string>(raw: string | null, allowed: readonly T[]) =>
  (raw ?? "").split(",").filter((x): x is T => (allowed as readonly string[]).includes(x));

/** URL parametreleriyle (?kategori=…&stok=1&sirala=…&tat=…&kavrum=…&isleme=…&yontem=…) senkron katalog */
export function CoffeeCatalog({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = params.get("koleksiyon") ?? params.get("kategori") ?? "all";
  const filter = (FILTERS.some((f) => f.key === raw) ? raw : "all") as FilterKey;
  const inStock = params.get("stok") === "1";
  const sort = (SORTS.some((s) => s.key === params.get("sirala")) ? params.get("sirala") : "featured") as SortKey;
  const facets: Facets = useMemo(
    () => ({
      tat: parseList(params.get("tat"), FLAVOR_GROUPS),
      kavrum: parseList(params.get("kavrum"), ROASTS),
      isleme: parseList(params.get("isleme"), PROCESS_KINDS),
      yontem: parseList(params.get("yontem"), METHODS),
    }),
    [params],
  );

  const list = useMemo(() => apply(products, filter, inStock, sort, facets), [products, filter, inStock, sort, facets]);

  const update = (next: Partial<{ filter: FilterKey; inStock: boolean; sort: SortKey; facets: Facets }>) => {
    const f = next.filter ?? filter;
    const s = next.sort ?? sort;
    const st = next.inStock ?? inStock;
    const fc = next.facets ?? facets;
    const q = new URLSearchParams();
    if (f !== "all") q.set(f === "ruso-exotics" ? "koleksiyon" : "kategori", f);
    if (st) q.set("stok", "1");
    if (s !== "featured") q.set("sirala", s);
    for (const k of ["tat", "kavrum", "isleme", "yontem"] as const) if (fc[k].length) q.set(k, fc[k].join(","));
    router.replace(q.size ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  return <CatalogView all={products} products={list} filter={filter} inStock={inStock} sort={sort} facets={facets} onChange={update} />;
}

/** Statik ön-render ve Suspense yedeği: filtresiz liste */
export function CoffeeCatalogStatic({ products }: { products: Product[] }) {
  return (
    <CatalogView all={products} products={apply(products, "all", false, "featured", NO_FACETS)} filter="all" inStock={false} sort="featured" facets={NO_FACETS} />
  );
}

function CatalogView({
  all,
  products,
  filter,
  inStock,
  sort,
  facets,
  onChange,
}: {
  all: Product[];
  products: Product[];
  filter: FilterKey;
  inStock: boolean;
  sort: SortKey;
  facets: Facets;
  onChange?: (next: Partial<{ filter: FilterKey; inStock: boolean; sort: SortKey; facets: Facets }>) => void;
}) {
  const { t, fmt } = useI18n();
  const active = facetCount(facets);
  const [open, setOpen] = useState(active > 0);

  // yalnızca katalogda karşılığı olan seçenekler (boş sonuç veren filtre gösterilmez)
  const beans = all.filter((p) => !p.auto);
  const groups: { key: keyof Facets; label: string; options: { value: string; label: string }[] }[] = [
    { key: "tat", label: t.catalog.fFlavor, options: FLAVOR_GROUPS.filter((g) => beans.some((p) => p.flavorGroups.includes(g))).map((g) => ({ value: g, label: t.catalog.flavor[g] })) },
    { key: "kavrum", label: t.catalog.fRoast, options: ROASTS.filter((r) => beans.some((p) => p.roastLevel === r)).map((r) => ({ value: r, label: t.roast[r] ?? r })) },
    { key: "isleme", label: t.catalog.fProcess, options: PROCESS_KINDS.filter((k) => beans.some((p) => p.processKinds.includes(k))).map((k) => ({ value: k, label: t.catalog.process[k] })) },
    { key: "yontem", label: t.catalog.fMethod, options: METHODS.filter((m) => beans.some((p) => p.fit[m])).map((m) => ({ value: m, label: t.catalog.method[m] })) },
  ];
  const toggle = (key: keyof Facets, value: string) => {
    const cur = facets[key] as string[];
    const nextList = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    onChange?.({ facets: { ...facets, [key]: nextList } as Facets });
  };

  return (
    <>
      <div className="sticky top-18 z-30 -mx-5 border-b border-ink-800 bg-ink-950/90 px-5 py-4 backdrop-blur-xl md:top-20 md:-mx-10 md:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="catalog-facets"
              onClick={() => setOpen(!open)}
              className={`flex items-center gap-2 rounded-sm border px-3 py-2 transition-colors ${active ? "border-flores-500 text-flores-200" : "border-ink-600 text-cream-200 hover:border-cream-300"}`}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              {t.catalog.filters}
              {active > 0 && <span className="rounded-full bg-flores-500 px-1.5 text-xs font-semibold text-ink-950">{active}</span>}
            </button>
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

        {open && (
          <div id="catalog-facets" className="mt-4 grid gap-4 border-t border-ink-800 pt-4 md:grid-cols-2 xl:grid-cols-4">
            {groups.map((g) => (
              <fieldset key={g.key}>
                <legend className="eyebrow text-[0.6rem] text-cream-500">{g.label}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.options.map((o) => {
                    const on = (facets[g.key] as string[]).includes(o.value);
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(g.key, o.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                          on ? "border-flores-500 bg-flores-500/15 text-flores-100" : "border-ink-600 text-cream-300 hover:border-cream-300"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            {active > 0 && (
              <button type="button" onClick={() => onChange?.({ facets: NO_FACETS })} className="justify-self-start text-sm text-cream-400 underline underline-offset-4 hover:text-cream-100 md:col-span-2 xl:col-span-4">
                {t.catalog.clearFilters}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-cream-500" aria-live="polite">
          {fmt(t.catalog.count, { n: products.length })}
        </p>
        <span className="flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/kahve-bulucu" className="text-flores-300 underline-offset-4 hover:underline">
            {t.catalog.finderLink} →
          </Link>
          <Link href="/karsilastir" className="text-flores-300 underline-offset-4 hover:underline">
            {t.catalog.compareLink} →
          </Link>
        </span>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p, i) => (
          <li key={p.slug}>
            <ProductCard product={p} priority={i < 4} morph />
          </li>
        ))}
      </ul>
      {products.length === 0 && (
        <div className="py-20 text-center text-cream-400">
          <p>{t.catalog.empty}</p>
          {active > 0 && (
            <button type="button" onClick={() => onChange?.({ facets: NO_FACETS })} className="btn btn-ghost mt-6">
              {t.catalog.clearFilters}
            </button>
          )}
        </div>
      )}
    </>
  );
}
