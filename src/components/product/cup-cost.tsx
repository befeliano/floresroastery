"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import type { ShopSettings } from "@/lib/commerce/settings";

type V = { id: string; label: string; weight: number; price: number; inStock: boolean };

const money = (n: number, intl: string) => new Intl.NumberFormat(intl, { style: "currency", currency: "TRY", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

/** "Evde bir fincan kaça gelir?" — seçilen paketin gram fiyatıyla filtre, espresso/americano ve latte maliyeti */
export function CupCost({ variants, settings }: { variants: V[]; settings: ShopSettings }) {
  const { t, fmt, intl } = useI18n();
  const c = t.cup;
  // varsayılan: gram fiyatı en uygun (genelde en büyük) stoktaki paket
  const best = [...variants].filter((v) => v.inStock).sort((a, b) => a.price / a.weight - b.price / b.weight)[0] ?? variants[0];
  const [id, setId] = useState(best.id);
  const v = variants.find((x) => x.id === id) ?? best;
  const perGram = v.price / v.weight;
  const milk = (settings.latteMilkMl / 1000) * settings.milkPricePerLiter;

  const rows = [
    { name: c.filter, detail: fmt(c.grams, { g: settings.filterGrams }), cost: perGram * settings.filterGrams },
    { name: c.single, detail: fmt(c.grams, { g: settings.espressoSingleGrams }), cost: perGram * settings.espressoSingleGrams },
    { name: c.double, detail: fmt(c.grams, { g: settings.espressoDoubleGrams }), cost: perGram * settings.espressoDoubleGrams },
    {
      name: c.latte,
      detail: fmt(c.latteDetail, { g: settings.latteGrams, ml: settings.latteMilkMl }),
      cost: perGram * settings.latteGrams + milk,
    },
  ];

  return (
    <section aria-labelledby="cup-cost" className="rounded-sm border border-ink-700 bg-ink-900 p-6 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-flores-400">{c.eyebrow}</p>
          <h2 id="cup-cost" className="mt-3 font-serif text-3xl md:text-4xl">
            {c.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-cream-400">{c.intro}</p>
        </div>
        <div role="group" aria-label={c.package} className="flex flex-wrap gap-2">
          {variants.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={x.id === v.id}
              onClick={() => setId(x.id)}
              className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                x.id === v.id ? "border-flores-500 bg-flores-500/10 text-flores-200" : "border-ink-600 text-cream-300 hover:border-cream-400"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <dl className="mt-8 grid gap-px overflow-hidden rounded-sm bg-ink-700 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((r) => (
          <div key={r.name} className="bg-ink-950 p-5">
            <dt className="text-sm text-cream-200">{r.name}</dt>
            <dd className="mt-2 font-mono text-3xl text-flores-300">{money(r.cost, intl)}</dd>
            <dd className="mt-1 text-xs text-cream-500">{r.detail}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-cream-500">
        {fmt(c.note, { perGram: money(perGram, intl), milk: money(settings.milkPricePerLiter, intl) })}
      </p>
    </section>
  );
}
