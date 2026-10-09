"use client";

import { useState } from "react";
import type { FlavorGroup, ToolCoffee } from "@/lib/commerce/tools";
import { ToolCard } from "./tool-card";

type Text = {
  pickHint: string;
  count: string;
  none: string;
  groups: Record<FlavorGroup, { label: string; text: string }>;
};

const ORDER: FlavorGroup[] = ["fruity", "citrus", "floral", "caramel", "chocolate", "nutty"];
const COLOR: Record<FlavorGroup, string> = {
  fruity: "#c2334d",
  citrus: "#f0963c",
  floral: "#b9a7e6",
  caramel: "#d99a4e",
  chocolate: "#8a5a44",
  nutty: "#a8784c",
};

/** koyu dilimlerde açık yazı */
const INK: Record<FlavorGroup, string> = { fruity: "#fff7ec", citrus: "#1a1410", floral: "#1a1410", caramel: "#1a1410", chocolate: "#fff7ec", nutty: "#fff7ec" };

const R_OUT = 200;
const R_IN = 92;
const C = 210;

function arc(i: number, n: number, rOut: number, rIn: number) {
  const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
  const p = (r: number, a: number) => `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;
  return `M ${p(rOut, a0)} A ${rOut} ${rOut} 0 0 1 ${p(rOut, a1)} L ${p(rIn, a1)} A ${rIn} ${rIn} 0 0 0 ${p(rIn, a0)} Z`;
}

/** Tat çarkı: bir tat ailesine dokun → o notayı taşıyan kahveler */
export function FlavorWheel({ coffees, text, cta }: { coffees: ToolCoffee[]; text: Text; cta: string }) {
  const [active, setActive] = useState<FlavorGroup | null>(null);
  const list = active ? coffees.filter((c) => c.groups.includes(active) && c.inStock) : [];
  const count = (g: FlavorGroup) => coffees.filter((c) => c.groups.includes(g) && c.inStock).length;

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,30rem)_1fr]">
      <svg viewBox="0 0 420 420" className="mx-auto w-full max-w-[30rem]" role="group" aria-label={text.pickHint}>
        {ORDER.map((g, i) => {
          const mid = ((i + 0.5) / ORDER.length) * Math.PI * 2 - Math.PI / 2;
          const r = (R_OUT + R_IN) / 2;
          // tamsayıya yuvarla: sunucu ve tarayıcı ondalıkları farklı yazınca hydration uyarısı çıkıyor
          const x = Math.round(C + r * Math.cos(mid));
          const y = Math.round(C + r * Math.sin(mid));
          const on = active === g;
          const lines = text.groups[g].label.split(" & ");
          return (
            <g
              key={g}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${text.groups[g].label} — ${text.count.replace("{n}", String(count(g)))}`}
              onClick={() => setActive(on ? null : g)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(on ? null : g))}
              className="cursor-pointer outline-none focus-visible:[&>path]:stroke-cream-50"
            >
              <path
                d={arc(i, ORDER.length, on ? R_OUT + 8 : R_OUT, R_IN)}
                fill={COLOR[g]}
                opacity={active && !on ? 0.35 : 0.92}
                stroke="#0a0a0a"
                strokeWidth={3}
                className="transition-all duration-300"
              />
              <text x={x} y={y - (lines.length - 1) * 8} textAnchor="middle" dominantBaseline="middle" fill={INK[g]} className="pointer-events-none text-[15px] font-semibold">
                {lines.map((l, k) => (
                  <tspan key={l} x={x} dy={k ? 17 : 0}>
                    {l}
                  </tspan>
                ))}
              </text>
              <text x={x} y={y + 14 + (lines.length - 1) * 9} textAnchor="middle" fill={INK[g]} fillOpacity={0.75} className="pointer-events-none text-[11px]">
                {count(g)}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R_IN - 6} fill="#111" />
        <text x={C} y={C} textAnchor="middle" dominantBaseline="middle" className="fill-cream-200 font-serif text-[22px] italic">
          {active ? text.groups[active].label.split(" & ")[0] : "Flores"}
        </text>
      </svg>

      <div aria-live="polite">
        {!active ? (
          <p className="pt-8 font-serif text-3xl italic text-cream-300">{text.pickHint}</p>
        ) : (
          <>
            <p className="eyebrow" style={{ color: COLOR[active] }}>
              {text.count.replace("{n}", String(list.length))}
            </p>
            <h2 className="mt-3 font-serif text-4xl">{text.groups[active].label}</h2>
            <p className="mt-2 text-cream-300">{text.groups[active].text}</p>
            {list.length === 0 ? (
              <p className="mt-8 text-cream-400">{text.none}</p>
            ) : (
              <div className="mt-8 grid gap-4 xl:grid-cols-2">
                {list.map((c) => (
                  <ToolCard key={c.slug} coffee={c} cta={cta} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
