"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "@/i18n/link";
import type { ToolCoffee } from "@/lib/commerce/tools";
import { formatPrice } from "@/lib/format";

type Text = {
  pick: string;
  slot: string;
  empty: string;
  rows: Record<"origin" | "region" | "process" | "roast" | "notes" | "body" | "acidity" | "sweetness" | "brew" | "price", string>;
  from: string;
  soldOut: string;
  view: string;
  remove: string;
};

const SLOTS = 3;

/** En fazla 3 kahveyi yan yana karşılaştırma — seçim adres çubuğunda (?k=a,b,c) tutulur, paylaşılabilir */
export function CoffeeCompare({ coffees, text }: { coffees: ToolCoffee[]; text: Text }) {
  const [picked, setPicked] = useState<string[]>([]);
  const bySlug = new Map(coffees.map((c) => [c.slug, c]));

  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("k");
    const initial = (k ?? "").split(",").filter((s) => bySlug.has(s)).slice(0, SLOTS);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- adres çubuğu yalnızca tarayıcıda okunabilir
    if (initial.length) setPicked(initial);
    // yalnızca ilk açılışta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (next: string[]) => {
    setPicked(next);
    const url = new URL(window.location.href);
    if (next.length) url.searchParams.set("k", next.join(","));
    else url.searchParams.delete("k");
    window.history.replaceState(null, "", url);
  };

  const selected = picked.map((s) => bySlug.get(s)).filter((c): c is ToolCoffee => !!c);
  const bar = (n?: number) =>
    n ? (
      <span className="flex max-w-[9rem] gap-[2px]" aria-label={`${n}/5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`h-2 flex-1 first:rounded-l last:rounded-r ${i < n ? "bg-flores-500" : "bg-ink-700"}`} />
        ))}
      </span>
    ) : (
      <span className="text-cream-600">—</span>
    );

  const rows: [string, (c: ToolCoffee) => React.ReactNode][] = [
    [text.rows.origin, (c) => c.country || "—"],
    [text.rows.region, (c) => c.region || "—"],
    [text.rows.process, (c) => c.process || "—"],
    [text.rows.roast, (c) => c.roastLabel],
    [
      text.rows.notes,
      (c) => (
        <ul className="space-y-1">
          {c.notes.map((n) => (
            <li key={n.label} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: n.color }} aria-hidden />
              {n.label}
            </li>
          ))}
        </ul>
      ),
    ],
    [text.rows.body, (c) => bar(c.sensory?.body)],
    [text.rows.acidity, (c) => bar(c.sensory?.acidity)],
    [text.rows.sweetness, (c) => bar(c.sensory?.sweetness)],
    [text.rows.brew, (c) => c.recommendedFor || "—"],
    [text.rows.price, (c) => (c.inStock && c.price != null ? text.from.replace("{price}", formatPrice(c.price)) : text.soldOut)],
  ];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: SLOTS }, (_, i) => (
          <label key={i} className="block">
            <span className="eyebrow text-[0.6rem] text-cream-500">{text.slot.replace("{n}", String(i + 1))}</span>
            <select
              value={picked[i] ?? ""}
              onChange={(e) => {
                const next = [...picked];
                if (e.target.value) next[i] = e.target.value;
                else next.splice(i, 1);
                update([...new Set(next.filter(Boolean))]);
              }}
              className="mt-2 w-full rounded-sm border border-ink-600 bg-ink-900 px-3 py-3 text-cream-100 focus:border-flores-500 focus:outline-none"
            >
              <option value="">{text.pick}</option>
              {coffees.map((c) => (
                <option key={c.slug} value={c.slug} disabled={picked.includes(c.slug) && picked[i] !== c.slug}>
                  {c.name} — {c.country}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {selected.length === 0 ? (
        <p className="mt-16 text-center text-cream-400">{text.empty}</p>
      ) : (
        <div className="-mx-5 mt-10 overflow-x-auto px-5 md:mx-0 md:px-0">
          <table className="w-full min-w-[40rem] table-fixed border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-28 md:w-36" />
                {selected.map((c) => (
                  <th key={c.slug} className="px-4 pb-6 align-bottom font-normal">
                    <div className="relative aspect-square w-full max-w-[12rem] overflow-hidden rounded-sm" style={{ backgroundColor: c.bg }}>
                      <Image src={c.image} alt="" fill sizes="192px" className="object-cover" />
                    </div>
                    <p className="mt-3 font-serif text-2xl leading-tight">{c.name}</p>
                    <div className="mt-2 flex gap-4 text-xs">
                      <Link href={`/kahveler/${c.slug}`} className="text-flores-300 hover:underline">
                        {text.view} →
                      </Link>
                      <button type="button" onClick={() => update(picked.filter((s) => s !== c.slug))} className="text-cream-500 hover:text-cream-200">
                        {text.remove}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, cell]) => (
                <tr key={label} className="border-t border-ink-700">
                  <th scope="row" className="py-3 pr-4 align-top font-normal text-cream-500">
                    {label}
                  </th>
                  {selected.map((c) => (
                    <td key={c.slug} className="px-4 py-3 align-top text-cream-100">
                      {cell(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
