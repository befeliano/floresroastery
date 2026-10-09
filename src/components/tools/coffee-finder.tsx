"use client";

import { useMemo, useState } from "react";
import type { ToolCoffee } from "@/lib/commerce/tools";
import { ToolCard } from "./tool-card";

type Text = {
  step: string;
  back: string;
  restart: string;
  resultEyebrow: string;
  resultTitle: string;
  alternatives: string;
  match: string;
  view: string;
  grindTip: string;
  questions: { key: string; q: string; options: { value: string; label: string }[] }[];
};

type Answers = Record<string, string>;

/** Cevaplara göre kahve puanı — basit, açıklanabilir kurallar */
function score(c: ToolCoffee, a: Answers): number {
  let s = 0;
  const body = c.sensory?.body ?? 3;
  const acidity = c.sensory?.acidity ?? 3;
  const light = c.roast === "Açık" || c.roast === "Açık-Orta";
  const dark = c.roast === "Orta-Koyu";

  if (a.method && c.fit[a.method as keyof ToolCoffee["fit"]]) s += 3;
  if (a.method === "filter" && light) s += 1;
  if ((a.method === "turkish" || a.method === "immersion") && !light) s += 1;

  if (a.milk === "yes") s += (body >= 4 ? 2 : 0) + (c.groups.some((g) => g === "chocolate" || g === "caramel" || g === "nutty") ? 2 : 0) - (light && acidity >= 4 ? 2 : 0);
  if (a.milk === "sometimes") s += c.groups.includes("chocolate") ? 1 : 0;
  if (a.milk === "no") s += acidity >= 4 || c.groups.includes("fruity") ? 1 : 0;

  const tasteGroups: Record<string, ToolCoffee["groups"]> = {
    fruity: ["fruity"],
    chocolate: ["chocolate", "caramel"],
    floral: ["floral", "citrus"],
    spicy: ["nutty"],
  };
  if (a.taste) s += c.groups.some((g) => tasteGroups[a.taste]?.includes(g)) ? 4 : 0;
  if (a.taste === "spicy" && body >= 4) s += 1;

  if (a.intensity === "light") s += light ? 2 : dark ? -1 : 0;
  if (a.intensity === "balanced") s += c.roast === "Orta" || c.roast === "Açık-Orta" ? 2 : 0;
  if (a.intensity === "strong") s += dark || body >= 4 ? 2 : light ? -1 : 0;

  if (a.adventure === "wild") s += c.experimental ? 3 : 0;
  if (a.adventure === "classic") s += c.experimental ? -1 : 1;
  if (a.adventure === "curious") s += c.categories.includes("single-origin") ? 1 : 0;

  return s + (c.bestseller ? 0.5 : 0);
}

const MAX_SCORE = 3 + 1 + 4 + 4 + 1 + 2 + 3;

export function CoffeeFinder({ coffees, text }: { coffees: ToolCoffee[]; text: Text }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const total = text.questions.length;
  const done = step >= total;

  const results = useMemo(() => {
    if (!done) return [];
    return coffees
      .filter((c) => c.inStock)
      .map((c) => ({ c, s: score(c, answers) }))
      .sort((x, y) => y.s - x.s)
      .slice(0, 3);
  }, [done, coffees, answers]);

  // uyum yüzdesi: en iyi sonuç ~%95, diğerleri ona göre; hiç örtüşme yoksa düşük kalır
  const top = Math.max(1, results[0]?.s ?? 1);
  const pct = (s: number) => Math.max(40, Math.min(97, Math.round(55 + 40 * (s / top) * Math.min(1, top / (MAX_SCORE * 0.6)))));

  if (done) {
    const [best, ...rest] = results;
    return (
      <div aria-live="polite">
        <p className="eyebrow text-flores-400">{text.resultEyebrow}</p>
        {best && (
          <div className="mt-6">
            <ToolCard coffee={best.c} cta={text.view} badge={`${text.resultTitle} · ${text.match.replace("{n}", String(pct(best.s)))}`} large />
          </div>
        )}
        {rest.length > 0 && (
          <>
            <p className="mt-10 font-serif text-2xl">{text.alternatives}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {rest.map(({ c, s }) => (
                <ToolCard key={c.slug} coffee={c} cta={text.view} badge={text.match.replace("{n}", String(pct(s)))} />
              ))}
            </div>
          </>
        )}
        <p className="mt-8 text-sm text-cream-500">{text.grindTip}</p>
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setStep(0);
          }}
          className="btn btn-ghost mt-8"
        >
          ↺ {text.restart}
        </button>
      </div>
    );
  }

  const q = text.questions[step];
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-flores-400">{text.step.replace("{n}", String(step + 1)).replace("{total}", String(total))}</p>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-cream-400 hover:text-cream-100">
            ← {text.back}
          </button>
        )}
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-ink-800" aria-hidden>
        <div className="h-full rounded-full bg-flores-500 transition-[width] duration-500" style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <fieldset className="mt-10">
        <legend className="font-serif text-3xl leading-tight md:text-4xl">{q.q}</legend>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {q.options.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={answers[q.key] === o.value}
              onClick={() => {
                setAnswers({ ...answers, [q.key]: o.value });
                setStep(step + 1);
              }}
              className={`rounded-sm border px-5 py-4 text-left text-cream-100 transition-colors hover:border-flores-500 hover:bg-flores-500/10 ${
                answers[q.key] === o.value ? "border-flores-500 bg-flores-500/10" : "border-ink-600"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
