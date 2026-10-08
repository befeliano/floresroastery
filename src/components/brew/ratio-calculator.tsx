"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";

const RATIOS = [
  { r: 15, key: "strong" },
  { r: 16, key: "balanced" },
  { r: 17, key: "clean" },
] as const;

/** Kahve ↔ su oran hesaplayıcı */
export function RatioCalculator() {
  const { t, fmt } = useI18n();
  const [dose, setDose] = useState(15);
  const [ratio, setRatio] = useState(16);
  const water = Math.round(dose * ratio);
  const bloom = dose * 3;

  return (
    <div className="rounded-sm border border-ink-700 bg-ink-900 p-6 md:p-8">
      <h2 className="font-serif text-3xl">{t.ratio.title}</h2>
      <p className="mt-2 text-sm text-cream-400">{t.ratio.intro}</p>

      <div className="mt-8">
        <label htmlFor="dose" className="flex items-baseline justify-between text-sm text-cream-300">
          {t.ratio.coffee} <span className="font-mono text-2xl text-cream-50">{dose} g</span>
        </label>
        <input
          id="dose"
          type="range"
          min={8}
          max={60}
          value={dose}
          onChange={(e) => setDose(Number(e.target.value))}
          className="mt-3 w-full accent-[#5fa4d6]"
        />
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm text-cream-300">{t.ratio.ratio}</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {RATIOS.map((o) => (
            <button
              key={o.r}
              type="button"
              aria-pressed={ratio === o.r}
              onClick={() => setRatio(o.r)}
              className={`rounded-sm border px-2 py-2 text-xs transition-colors ${
                ratio === o.r ? "border-flores-500 bg-flores-500/10 text-flores-200" : "border-ink-600 text-cream-300 hover:border-cream-400"
              }`}
            >
              1:{o.r} · {t.ratio[o.key]}
            </button>
          ))}
        </div>
      </fieldset>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-ink-700" aria-live="polite">
        <div className="bg-ink-950 p-4">
          <dt className="eyebrow text-[0.6rem] text-cream-500">{t.ratio.water}</dt>
          <dd className="mt-1 font-mono text-3xl text-flores-300">{water} g</dd>
        </div>
        <div className="bg-ink-950 p-4">
          <dt className="eyebrow text-[0.6rem] text-cream-500">{t.ratio.bloom}</dt>
          <dd className="mt-1 font-mono text-3xl">{bloom} g</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-cream-500">{fmt(t.ratio.cup, { ml: Math.round(water * 0.88) })}</p>
    </div>
  );
}
