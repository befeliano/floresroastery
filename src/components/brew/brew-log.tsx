"use client";

import { useEffect, useState } from "react";

/** Kişisel demleme günlüğü — yalnızca bu cihazda (localStorage) saklanır, sunucuya gitmez */
type Entry = { id: string; at: number; coffee: string; method: string; dose: number; water: number; time: string; rating: number; notes: string };

type Text = {
  title: string;
  intro: string;
  coffee: string;
  other: string;
  method: string;
  dose: string;
  water: string;
  time: string;
  rating: string;
  notes: string;
  save: string;
  empty: string;
  delete: string;
  ratio: string;
  best: string;
};

const KEY = "flores-brew-log-v1";
const METHODS = ["V60", "Kalita", "Chemex", "Origami", "AeroPress", "French Press", "Espresso", "Moka Pot", "Cold Brew", "Türk Kahvesi"];

function load(): Entry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? raw.slice(0, 200) : [];
  } catch {
    return [];
  }
}

export function BrewLog({ coffees, text, locale }: { coffees: string[]; text: Text; locale: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({ coffee: coffees[0] ?? "", method: "V60", dose: "15", water: "240", time: "3:00", rating: 4, notes: "" });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage yalnızca tarayıcıda okunabilir
    setEntries(load());
  }, []);

  const persist = (next: Entry[]) => {
    setEntries(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* depolama kapalı — oturum boyunca yine de görünür */
    }
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const dose = Number(form.dose);
    const water = Number(form.water);
    if (!(dose > 0) || !(water > 0)) return;
    persist([
      { id: crypto.randomUUID(), at: Date.now(), coffee: form.coffee.slice(0, 80), method: form.method, dose, water, time: form.time.slice(0, 8), rating: form.rating, notes: form.notes.slice(0, 300) },
      ...entries,
    ]);
    setForm({ ...form, notes: "" });
  };

  const bestId = entries.length > 1 ? entries.reduce((a, b) => (b.rating > a.rating ? b : a)).id : null;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const input = "w-full rounded-sm border border-ink-600 bg-ink-900 px-3 py-2.5 text-cream-100 focus:border-flores-500 focus:outline-none";

  return (
    <section id="gunluk" aria-labelledby="log-title" className="scroll-mt-28">
      <h2 id="log-title" className="font-serif text-4xl md:text-5xl">
        {text.title}
      </h2>
      <p className="mt-4 max-w-2xl text-cream-300">{text.intro}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[24rem_1fr]">
        <form onSubmit={add} className="grid grid-cols-2 gap-4 self-start rounded-sm border border-ink-700 bg-ink-900/60 p-5">
          <label className="col-span-2 text-sm text-cream-400">
            {text.coffee}
            <select value={form.coffee} onChange={(e) => setForm({ ...form, coffee: e.target.value })} className={`${input} mt-1.5`}>
              {coffees.map((c) => (
                <option key={c}>{c}</option>
              ))}
              <option value={text.other}>{text.other}</option>
            </select>
          </label>
          <label className="col-span-2 text-sm text-cream-400">
            {text.method}
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={`${input} mt-1.5`}>
              {METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-cream-400">
            {text.dose}
            <input inputMode="decimal" value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value.replace(/[^\d.]/g, "") })} className={`${input} mt-1.5 font-mono`} />
          </label>
          <label className="text-sm text-cream-400">
            {text.water}
            <input inputMode="decimal" value={form.water} onChange={(e) => setForm({ ...form, water: e.target.value.replace(/[^\d.]/g, "") })} className={`${input} mt-1.5 font-mono`} />
          </label>
          <label className="text-sm text-cream-400">
            {text.time}
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value.replace(/[^\d:]/g, "") })} className={`${input} mt-1.5 font-mono`} />
          </label>
          <fieldset className="text-sm text-cream-400">
            <legend>{text.rating}</legend>
            <div className="mt-2.5 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n}/5`}
                  aria-pressed={form.rating === n}
                  onClick={() => setForm({ ...form, rating: n })}
                  className={`text-xl leading-none ${n <= form.rating ? "text-flores-400" : "text-ink-600"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>
          <label className="col-span-2 text-sm text-cream-400">
            {text.notes}
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} maxLength={300} className={`${input} mt-1.5 resize-none`} />
          </label>
          <button type="submit" className="btn btn-primary col-span-2">
            + {text.save}
          </button>
        </form>

        <div>
          {entries.length === 0 ? (
            <p className="rounded-sm border border-dashed border-ink-700 p-8 text-center text-cream-400">{text.empty}</p>
          ) : (
            <ul className="space-y-3">
              {entries.map((e) => (
                <li key={e.id} className={`rounded-sm border p-4 ${e.id === bestId ? "border-flores-500/60 bg-flores-500/5" : "border-ink-700"}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-serif text-xl">
                      {e.coffee} <span className="text-base text-cream-400">· {e.method}</span>
                    </p>
                    <p className="text-sm text-flores-400" aria-label={`${e.rating}/5`}>
                      {"★".repeat(e.rating)}
                      <span className="text-ink-600">{"★".repeat(5 - e.rating)}</span>
                    </p>
                  </div>
                  <p className="mt-1 font-mono text-xs text-cream-400">
                    {e.dose} g → {e.water} g · {text.ratio.replace("{r}", (e.water / e.dose).toFixed(1))} · {e.time} · {date.format(e.at)}
                    {e.id === bestId && <span className="ml-2 text-flores-300">· {text.best}</span>}
                  </p>
                  {e.notes && <p className="mt-2 text-sm text-cream-200">{e.notes}</p>}
                  <button type="button" onClick={() => persist(entries.filter((x) => x.id !== e.id))} className="mt-2 text-xs text-cream-500 hover:text-cream-200">
                    {text.delete}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
