"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/app/api/search/route";
import { useI18n } from "@/i18n/client";
import Link from "@/i18n/link";
import { formatPrice } from "@/lib/format";

/** Arama penceresini açmak için: openSearch() — üst menü, telefon alt menüsü ve klavye kısayolu */
export const openSearch = () => window.dispatchEvent(new Event("flores:search"));

/** Türkçe karakterleri sadeleştir: "Çikolatalı" → "cikolatali" */
const norm = (s: string) =>
  s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function search(items: SearchItem[], q: string) {
  const tokens = norm(q).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  return items
    .map((it) => {
      const title = norm(it.title);
      const hay = `${title} ${norm(it.sub)} ${norm(it.text)}`;
      if (!tokens.every((tk) => hay.includes(tk))) return null;
      // başlıkta geçen ve başlığın başında geçen öne çıkar; stokta olan kahve önce
      const score = tokens.reduce((n, tk) => n + (title.startsWith(tk) ? 6 : title.includes(tk) ? 3 : 1), 0) - (it.soldOut ? 1 : 0);
      return { it, score };
    })
    .filter((x): x is { it: SearchItem; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.it);
}

export function SearchDialog() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();

  // aç: özel olay, "/" ya da Ctrl/Cmd+K
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("flores:search", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("flores:search", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // sayfa değişince kapan
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // ilk açılışta arama verisini çek (dil başına bir kez)
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    inputRef.current?.focus();
    if (!items) {
      fetch(`/api/search?lang=${locale}`)
        .then((r) => r.json())
        .then((d: { items: SearchItem[] }) => setItems(d.items))
        .catch(() => setItems([]));
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, items, locale]);

  const results = useMemo(() => (items ? search(items, q).slice(0, 24) : []), [items, q]);
  const groups = [
    { key: "coffee", label: t.search.coffees, list: results.filter((r) => r.type === "coffee").slice(0, 8) },
    { key: "page", label: t.search.pages, list: results.filter((r) => r.type === "page").slice(0, 5) },
    { key: "guide", label: t.search.guides, list: results.filter((r) => r.type === "guide").slice(0, 6) },
  ].filter((g) => g.list.length);
  const flat = groups.flatMap((g) => g.list);

  if (!open) return null;

  const go = (i: number) => {
    const el = listRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-result]")[i];
    el?.click();
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={t.search.open}>
      <button type="button" tabIndex={-1} aria-label={t.search.close} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70" />
      <div className="relative mx-auto mt-0 flex max-h-[100svh] w-full max-w-2xl flex-col border-ink-700 bg-ink-900 shadow-2xl sm:mt-[10vh] sm:max-h-[75vh] sm:rounded-sm sm:border">
        <div className="flex items-center gap-3 border-b border-ink-700 px-4">
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-cream-400" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, flat.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && flat.length) {
                e.preventDefault();
                go(active);
              }
            }}
            type="search"
            enterKeyHint="search"
            placeholder={t.search.placeholder}
            aria-label={t.search.placeholder}
            className="min-w-0 flex-1 bg-transparent py-4 text-lg text-cream-50 placeholder:text-cream-500 focus:outline-none"
          />
          <button type="button" onClick={() => setOpen(false)} className="shrink-0 rounded-sm border border-ink-600 px-2 py-1 text-xs text-cream-400 hover:text-cream-100">
            {t.search.close}
          </button>
        </div>

        <ul ref={listRef} className="flex-1 overflow-y-auto px-2 py-3">
          {!items && <li className="px-3 py-6 text-sm text-cream-400">{t.search.loading}</li>}
          {items && !q.trim() && <li className="px-3 py-6 text-sm text-cream-400">{t.search.hint}</li>}
          {items && q.trim() && !flat.length && <li className="px-3 py-6 text-sm text-cream-400">{t.search.empty}</li>}
          {groups.map((g) => (
            <li key={g.key} className="mb-3">
              <p className="eyebrow px-3 pb-1 text-[0.6rem] text-cream-500">{g.label}</p>
              <ul>
                {g.list.map((r) => {
                  const i = flat.indexOf(r);
                  return (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        data-result
                        onMouseEnter={() => setActive(i)}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-sm px-3 py-2.5 ${i === active ? "bg-ink-800" : ""}`}
                      >
                        {r.image ? (
                          <span className="relative size-11 shrink-0 overflow-hidden rounded-sm" style={{ backgroundColor: r.bg ?? "#1b1916" }}>
                            <Image src={r.image} alt="" fill sizes="44px" className="object-cover" />
                          </span>
                        ) : (
                          <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-ink-700 text-cream-500">
                            →
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-cream-50">{r.title}</span>
                          {r.sub && <span className="block truncate text-xs text-cream-400">{r.sub}</span>}
                        </span>
                        {r.type === "coffee" && (
                          <span className="shrink-0 font-mono text-xs text-cream-300">{r.soldOut ? t.search.soldOut : r.price != null ? formatPrice(r.price) : ""}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
