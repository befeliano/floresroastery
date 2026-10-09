"use client";

import { useState } from "react";
import type { ToolCoffee } from "@/lib/commerce/tools";
import { ToolCard } from "./tool-card";
import { MAP, WORLD_DOTS } from "./world-dots";

type Text = {
  roastery: string;
  count: string;
  pickHint: string;
  origins: Record<string, { name: string; text: string }>;
};

const ESKISEHIR = { lat: 39.78, lon: 30.52 };
/** yakın kökenlerin etiketleri çakışmasın: etiket konumu (pinin altı varsayılan) */
const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  Meksika: { dx: -10, dy: -24, anchor: "middle" },
  "El Salvador": { dx: 0, dy: 46, anchor: "middle" },
};
const xy = (p: { lat: number; lon: number }) => ({ x: (p.lon - MAP.lon0) * MAP.k, y: (MAP.lat0 - p.lat) * MAP.k });

/** Noktalı dünya haritasında kökenler; her kökenden Eskişehir'e bir yay */
export function OriginMap({
  coffees,
  origins,
  text,
  cta,
}: {
  coffees: ToolCoffee[];
  origins: Record<string, { lat: number; lon: number }>;
  text: Text;
  cta: string;
}) {
  const keys = Object.keys(origins).filter((k) => coffees.some((c) => c.originKeys.includes(k)));
  const [active, setActive] = useState<string | null>(null);
  const home = xy(ESKISEHIR);
  const list = active ? coffees.filter((c) => c.originKeys.includes(active)) : [];

  return (
    <div className="grid items-start gap-10 xl:grid-cols-[1fr_24rem]">
      <div>
        <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="w-full" role="group" aria-label={text.pickHint}>
          <path d={WORLD_DOTS} stroke="#34302b" strokeWidth={3} strokeLinecap="round" fill="none" aria-hidden />
          {keys.map((k) => {
            const p = xy(origins[k]);
            const mx = (p.x + home.x) / 2;
            const my = Math.min(p.y, home.y) - 60;
            return (
              <path
                key={`arc-${k}`}
                d={`M${p.x} ${p.y} Q${mx} ${my} ${home.x} ${home.y}`}
                fill="none"
                stroke={active === k ? "#7cb8e3" : "#5fa4d6"}
                strokeOpacity={active && active !== k ? 0.15 : 0.55}
                strokeWidth={active === k ? 2.5 : 1.5}
                strokeDasharray="4 5"
                className="transition-all duration-300"
                aria-hidden
              />
            );
          })}
          <g aria-label={text.roastery}>
            <circle cx={home.x} cy={home.y} r={9} fill="#f3ead8" />
            <circle cx={home.x} cy={home.y} r={16} fill="none" stroke="#f3ead8" strokeOpacity={0.4} />
            <text x={home.x + 16} y={home.y - 16} className="fill-cream-100 text-[24px] font-semibold">
              Eskişehir
            </text>
          </g>
          {keys.map((k) => {
            const p = xy(origins[k]);
            const on = active === k;
            const n = coffees.filter((c) => c.originKeys.includes(k)).length;
            return (
              <g
                key={k}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${text.origins[k]?.name ?? k} — ${text.count.replace("{n}", String(n))}`}
                onClick={() => setActive(on ? null : k)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(on ? null : k))}
                className="cursor-pointer outline-none"
              >
                <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
                <circle cx={p.x} cy={p.y} r={on ? 11 : 8} fill="#5fa4d6" className="transition-all duration-300" />
                <circle cx={p.x} cy={p.y} r={on ? 20 : 15} fill="none" stroke="#5fa4d6" strokeOpacity={0.5} className="animate-pulse" />
                <text
                  x={p.x + (LABEL[k]?.dx ?? 0)}
                  y={p.y + (LABEL[k]?.dy ?? 42)}
                  textAnchor={LABEL[k]?.anchor ?? "middle"}
                  className={`text-[24px] ${on ? "fill-flores-200 font-semibold" : "fill-cream-200"}`}
                >
                  {text.origins[k]?.name ?? k} · {n}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="mt-6 flex flex-wrap gap-2">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={active === k}
              onClick={() => setActive(active === k ? null : k)}
              className={`eyebrow rounded-full border px-4 py-2 text-[0.65rem] transition-colors ${
                active === k ? "border-flores-500 bg-flores-500 text-ink-950" : "border-ink-600 text-cream-200 hover:border-cream-300"
              }`}
            >
              {text.origins[k]?.name ?? k}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {!active ? (
          <p className="font-serif text-3xl italic text-cream-300">{text.pickHint}</p>
        ) : (
          <>
            <p className="eyebrow text-flores-400">{text.count.replace("{n}", String(list.length))}</p>
            <h2 className="mt-3 font-serif text-4xl">{text.origins[active]?.name ?? active}</h2>
            <p className="mt-2 text-cream-300">{text.origins[active]?.text}</p>
            <div className="mt-8 grid gap-4">
              {list.map((c) => (
                <ToolCard key={c.slug} coffee={c} cta={cta} />
              ))}
            </div>
          </>
        )}
        <p className="mt-10 text-xs text-cream-500">● {text.roastery}</p>
      </div>
    </div>
  );
}
