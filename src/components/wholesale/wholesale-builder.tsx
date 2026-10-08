"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { useCart } from "@/lib/cart/store";
import { GRIND_OPTIONS } from "@/lib/commerce/grind";
import {
  priceWholesale,
  tierPrice,
  WHOLESALE_BAG_SIZES,
  WHOLESALE_BAG_TYPES,
  WHOLESALE_MIN_KG,
  WHOLESALE_ROASTS,
  WHOLESALE_SLUG,
  type WholesaleBean,
  type WholesaleConfig,
} from "@/lib/commerce/wholesale";
import { formatPrice } from "@/lib/format";

/** Site içi toptan sipariş oluşturucu → sepete tek satır (fiyat sunucuda yeniden hesaplanır) */
export function WholesaleBuilder({ beans }: { beans: WholesaleBean[] }) {
  const { t, fmt, grind: grindLabel } = useI18n();
  const w = t.ws;
  const add = useCart((s) => s.add);
  const [kg, setKg] = useState<Record<string, number>>({});
  const [roast, setRoast] = useState<string>(WHOLESALE_ROASTS[1]);
  const [grind, setGrind] = useState<string>(GRIND_OPTIONS[0]);
  const [bagSize, setBagSize] = useState<string>(WHOLESALE_BAG_SIZES[0]);
  const [bagType, setBagType] = useState<string>(WHOLESALE_BAG_TYPES[0]);

  const config: WholesaleConfig = { beans: Object.fromEntries(Object.entries(kg).filter(([, v]) => v > 0)), roast, grind, bagSize, bagType };
  const quote = priceWholesale(config, GRIND_OPTIONS);
  const totalKg = Object.values(kg).reduce((n, v) => n + v, 0);
  const clamp = (v: number) => Math.max(0, Math.min(500, Math.round(v) || 0));
  const set = (key: string, v: number) => setKg((s) => ({ ...s, [key]: clamp(v) }));
  // art arda hızlı tıklamalarda da doğru sayılsın (her zaman güncel durumdan)
  const step = (key: string, delta: number) => setKg((s) => ({ ...s, [key]: clamp((s[key] ?? 0) + delta) }));

  const addToCart = () => {
    if (!quote.ok) return;
    // aynı yapılandırma aynı satır olsun
    const id = Array.from(JSON.stringify(config)).reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7).toString(36);
    add({
      slug: WHOLESALE_SLUG,
      variantId: `b2b-${id}`,
      grind,
      quantity: 1,
      config,
      name: w.cartName,
      subtitle: quote.lines.map((l) => `${l.name} ${l.kg} kg`).join(", "),
      variantLabel: `${quote.totalKg} kg · ${roast}`,
      unitPrice: quote.total,
      image: "/coffees/guntur-endonezya.webp",
    });
  };

  const field = "field py-2.5";
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
      <div>
        <h3 className="eyebrow text-cream-300">{w.step1}</h3>
        <ul className="mt-4 divide-y divide-ink-700 rounded-sm border border-ink-700">
          {beans.map((b) => {
            const v = kg[b.key] ?? 0;
            return (
              <li key={b.key} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-cream-100">{b.name}</p>
                  <p className="text-xs text-cream-500">
                    {b.process} · {b.tiers.map(([min, price]) => `${min}+ kg ${formatPrice(price)}`).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {v > 0 && <span className="font-mono text-xs text-flores-300">{formatPrice(tierPrice(b, v))}/kg</span>}
                  <div className="flex items-center border border-ink-600">
                    <button type="button" aria-label={fmt(w.less, { name: b.name })} onClick={() => step(b.key, -1)} className="size-9 text-cream-300 hover:text-cream-50">
                      −
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={500}
                      value={v}
                      aria-label={fmt(w.kgOf, { name: b.name })}
                      onChange={(e) => set(b.key, Number(e.target.value))}
                      className="w-14 bg-transparent text-center font-mono text-sm [appearance:textfield] focus:outline-none"
                    />
                    <button type="button" aria-label={fmt(w.more, { name: b.name })} onClick={() => step(b.key, 1)} className="size-9 text-cream-300 hover:text-cream-50">
                      +
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="text-sm text-cream-300">
            {w.roast}
            <select value={roast} onChange={(e) => setRoast(e.target.value)} className={`${field} mt-2`}>
              {WHOLESALE_ROASTS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-cream-300">
            {w.grind}
            <select value={grind} onChange={(e) => setGrind(e.target.value)} className={`${field} mt-2`}>
              {GRIND_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {grindLabel(g)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-cream-300">
            {w.bagSize}
            <select value={bagSize} onChange={(e) => setBagSize(e.target.value)} className={`${field} mt-2`}>
              {WHOLESALE_BAG_SIZES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-cream-300">
            {w.bagType}
            <select value={bagType} onChange={(e) => setBagType(e.target.value)} className={`${field} mt-2`}>
              {WHOLESALE_BAG_TYPES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <aside className="h-fit rounded-sm border border-ink-700 bg-ink-950 p-6 lg:sticky lg:top-28">
        <h3 className="font-serif text-2xl">{w.summary}</h3>
        {quote.lines.length ? (
          <ul className="mt-4 space-y-2 text-sm">
            {quote.lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-3">
                <span className="text-cream-200">
                  {l.name} · {l.kg} kg
                </span>
                <span className="font-mono text-cream-300">{formatPrice(l.total)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-cream-500">{w.empty}</p>
        )}
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink-700">
          <div className="h-full bg-flores-500 transition-[width]" style={{ width: `${Math.min(100, (totalKg / WHOLESALE_MIN_KG) * 100)}%` }} />
        </div>
        <p className="mt-2 text-xs text-cream-400">
          {totalKg < WHOLESALE_MIN_KG ? fmt(w.min, { kg: WHOLESALE_MIN_KG - totalKg }) : fmt(w.totalKg, { kg: totalKg })}
        </p>
        <dl className="mt-5 flex items-baseline justify-between border-t border-ink-700 pt-4">
          <dt className="text-cream-300">{t.common.totalVat}</dt>
          <dd className="font-mono text-2xl">{formatPrice(quote.ok ? quote.total : quote.lines.reduce((n, l) => n + l.total, 0))}</dd>
        </dl>
        <button type="button" onClick={addToCart} disabled={!quote.ok} className="btn btn-primary mt-6 w-full">
          {w.addToCart}
        </button>
        <p className="mt-3 text-xs text-cream-500">{w.note}</p>
      </aside>
    </div>
  );
}
