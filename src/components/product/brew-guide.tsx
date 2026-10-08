"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import type { BrewGuide as Guide } from "@/lib/commerce/types";
import { formatClock } from "@/lib/format";

const now = () => performance.now();

/** Belirli bir anda terazide olması gereken ağırlık (g) */
function scaleAt(guide: Guide, t: number) {
  const steps = guide.steps;
  if (guide.method === "espresso") {
    // ilk damlalardan itibaren noktalar arasında doğrusal akış
    const pts = [{ at: steps[1]?.at ?? 0, target: 0 }, ...steps.filter((s) => s.target != null).map((s) => ({ at: s.at, target: s.target! }))];
    if (t <= pts[0].at) return 0;
    for (let i = 1; i < pts.length; i++) {
      if (t <= pts[i].at) {
        const a = pts[i - 1];
        const b = pts[i];
        return a.target + ((b.target - a.target) * (t - a.at)) / (b.at - a.at);
      }
    }
    return pts[pts.length - 1].target;
  }
  // filtre: her döküş ~15 sn içinde hedefe ulaşır, sonra sabit kalır
  let weight = 0;
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.target == null || t < s.at) continue;
    const nextAt = steps[i + 1]?.at ?? guide.totalTime;
    const pour = Math.min(15, nextAt - s.at);
    const prev = weight;
    weight = prev + (s.target - prev) * Math.min(1, (t - s.at) / pour);
  }
  return weight;
}

export interface BrewTab {
  key: string;
  label: string;
  guide: Guide;
}

/** Ürün sayfası: filtre / espresso sekmeleri */
export function BrewGuide({ guides }: { guides: { filter?: Guide; espresso?: Guide } }) {
  const { t } = useI18n();
  const tabs = (["filter", "espresso"] as const).flatMap((k) => (guides[k] ? [{ key: k, label: t.brew[k], guide: guides[k]! }] : []));
  return <BrewTabs tabs={tabs} />;
}

export function BrewTabs({ tabs, heading = true }: { tabs: BrewTab[]; heading?: boolean }) {
  const { t } = useI18n();
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  if (!current) return null;

  return (
    <section aria-labelledby={heading ? "brew-title" : undefined} aria-label={heading ? undefined : t.brew.recipesAria} className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        {heading && (
          <div>
            <p lang="en" className="eyebrow text-flores-400">
              Brew Guide
            </p>
            <h2 id="brew-title" className="mt-4 font-serif text-5xl md:text-6xl">
              {t.brew.title}
            </h2>
          </div>
        )}
        <div role="tablist" aria-label={t.brew.methodAria} className="no-scrollbar -mx-1 flex max-w-full gap-2 overflow-x-auto px-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={current.key === t.key}
              aria-controls={`panel-${t.key}`}
              onClick={() => setActive(t.key)}
              className={`eyebrow shrink-0 rounded-sm border px-6 py-3 transition-colors ${
                current.key === t.key ? "border-flores-500 bg-flores-500 text-ink-950" : "border-ink-600 text-cream-200 hover:border-cream-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* key: sekme değişince zamanlayıcı sıfırlansın */}
      <BrewPanel key={current.key} guide={current.guide} id={`panel-${current.key}`} labelledBy={`tab-${current.key}`} />
    </section>
  );
}

function BrewPanel({ guide, id, labelledBy }: { guide: Guide; id: string; labelledBy: string }) {
  const { t, fmt } = useI18n();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef<number | null>(null);
  const startedAt = useRef(0);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const t = (now() - startedAt.current) / 1000;
      if (t >= guide.totalTime) {
        setElapsed(guide.totalTime);
        stop();
        return;
      }
      setElapsed(t);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [running, guide.totalTime, stop]);

  const play = () => {
    const from = elapsed >= guide.totalTime ? 0 : elapsed;
    startedAt.current = now() - from * 1000;
    setElapsed(from);
    setRunning(true);
  };
  const reset = () => {
    stop();
    setElapsed(0);
  };
  const seek = (t: number) => {
    startedAt.current = now() - t * 1000;
    setElapsed(t);
  };

  const currentIndex = guide.steps.reduce((acc, s, i) => (s.at <= elapsed ? i : acc), 0);
  const current = guide.steps[currentIndex];
  const progress = (elapsed / guide.totalTime) * 100;
  const weight = scaleAt(guide, elapsed);
  const isEspresso = guide.method === "espresso";

  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} className="mt-12 overflow-hidden rounded-sm border border-ink-700">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        {/* zamanlayıcı */}
        <div className="relative flex flex-col justify-between gap-10 bg-ink-900 p-6 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow text-[0.65rem] text-cream-400">{t.brew.equipment}</p>
              <p className="mt-1 font-serif text-2xl">{guide.device}</p>
            </div>
            <div className="text-right">
              <p className="eyebrow text-[0.65rem] text-cream-400">{t.brew.scale}</p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-flores-300">{Math.round(weight)} g</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[clamp(4rem,10vw,7rem)] leading-none tabular-nums" aria-live="off">
              {formatClock(elapsed)}
              <span className="text-[0.35em] text-cream-500"> / {formatClock(guide.totalTime)}</span>
            </p>
            <div className="mt-6 min-h-20" aria-live="polite">
              <p className="font-serif text-2xl text-flores-200">
                {current.title}
                {current.target != null && <span className="font-mono text-lg text-cream-400"> → {current.target} g</span>}
              </p>
              {current.detail && <p className="mt-2 max-w-md text-cream-300">{current.detail}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={running ? stop : play} className="btn btn-primary min-w-40">
              {running ? (
                <>
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                    <path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor" />
                  </svg>
                  {t.brew.pause}
                </>
              ) : (
                <>
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                    <path d="M2 1l9 5-9 5z" fill="currentColor" />
                  </svg>
                  {elapsed > 0 && elapsed < guide.totalTime ? t.brew.resume : t.brew.start}
                </>
              )}
            </button>
            <button type="button" onClick={reset} className="btn btn-ghost">
              {t.brew.reset}
            </button>
          </div>
        </div>

        {/* genel bakış + tarif */}
        <div className="bg-flores-900/40 p-6 md:p-10">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-cream-100">{t.brew.overview}</h3>
              <dl className="mt-5 space-y-4 text-sm">
                <Row label={t.brew.coffee} value={`${guide.dose} g`} />
                <Row label={isEspresso ? t.brew.output : t.brew.water} value={`${guide.output} g`} />
                <Row label={t.brew.temperature} value={`${guide.temperature} °C`} />
                <Row label={t.brew.grind} value={guide.grind} />
              </dl>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-cream-100">{t.brew.recipe}</h3>
              <ol className="mt-5 space-y-2.5 font-mono text-sm">
                {guide.steps.map((s, i) => (
                  <li key={i} className={`flex gap-3 transition-colors ${i === currentIndex && elapsed > 0 ? "text-flores-300" : "text-cream-300"}`}>
                    <span className="w-10 shrink-0 tabular-nums">{formatClock(s.at)}</span>
                    <span>
                      {s.title}
                      {s.target != null && ` – ${s.target} g`}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          {guide.tip && (
            <p className="mt-10 border-l-2 border-flores-500 pl-4 font-serif text-lg italic text-cream-100">{guide.tip}</p>
          )}
        </div>
      </div>

      {/* yatay zaman çizelgesi */}
      <div className="border-t border-ink-700 bg-ink-950 px-6 py-14 md:px-14">
        <div className="relative hidden h-36 md:block">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink-600" />
          <div className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-flores-500" style={{ width: `${progress}%` }} />
          <div
            aria-hidden
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flores-300 shadow-[0_0_24px_rgba(95,164,214,0.8)]"
            style={{ left: `${progress}%` }}
          />
          {guide.steps.map((s, i) => {
            const left = (s.at / guide.totalTime) * 100;
            const above = i % 2 === 0;
            const done = elapsed >= s.at && (elapsed > 0 || i === 0);
            const align = left > 88 ? { transform: "translateX(calc(-100% + 8px))", textAlign: "right" as const } : left < 6 ? { transform: "translateX(-8px)", textAlign: "left" as const } : { transform: "translateX(-50%)", textAlign: "center" as const };
            return (
              <button
                key={i}
                type="button"
                onClick={() => seek(s.at)}
                className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%` }}
                aria-label={fmt(t.brew.goTo, { time: formatClock(s.at), title: s.title })}
              >
                <span
                  className={`block size-3 rotate-45 border transition-colors ${
                    done ? "border-flores-400 bg-flores-500" : "border-cream-400 bg-ink-950 group-hover:border-flores-400"
                  }`}
                />
                <span className={`pointer-events-none absolute left-1/2 w-40 ${above ? "bottom-7" : "top-7"}`} style={align}>
                  <span className={`block font-mono text-sm ${done ? "text-flores-300" : "text-cream-400"}`}>{formatClock(s.at)}</span>
                  <span className="block text-sm text-cream-100">{s.title}</span>
                  {s.target != null && <span className="block font-mono text-xs text-cream-500">{s.target} g</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* mobil: dikey adımlar */}
        <ol className="relative space-y-6 border-l border-ink-600 pl-6 md:hidden">
          {guide.steps.map((s, i) => (
            <li key={i} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[29px] top-1.5 size-2.5 rotate-45 border ${
                  elapsed >= s.at && elapsed > 0 ? "border-flores-400 bg-flores-500" : "border-cream-400 bg-ink-950"
                }`}
              />
              <p className="font-mono text-sm text-flores-300">
                {formatClock(s.at)} {s.target != null && <span className="text-cream-500">· {s.target} g</span>}
              </p>
              <p className="text-cream-100">{s.title}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* özet bar */}
      <dl className="grid grid-cols-2 border-t border-ink-700 text-center sm:grid-cols-5">
        {[
          [t.brew.method, guide.device.split("·")[0].trim()],
          [t.brew.coffee, `${guide.dose} g`],
          [t.brew.ratio, guide.ratio],
          [isEspresso ? t.brew.output : t.brew.water, `${guide.output} g @ ${guide.temperature} °C`],
          [t.brew.time, formatClock(guide.totalTime)],
        ].map(([k, v]) => (
          <div key={k} className="border-b border-r border-ink-700 px-3 py-4 last:border-r-0 sm:border-b-0">
            <dt className="eyebrow text-[0.6rem] text-cream-500">{k}</dt>
            <dd className="mt-1 font-mono text-sm text-cream-100">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-cream-50/10 pb-3">
      <dt className="text-cream-400">{label}</dt>
      <dd className="text-right text-cream-100">{value}</dd>
    </div>
  );
}
