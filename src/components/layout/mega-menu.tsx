"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import type { MenuData } from "./menu-types";

interface MegaMenuProps {
  id: string;
  data: MenuData;
  open: boolean;
  onNavigate: () => void;
}

const SHELF_LIMIT = 8;

/**
 * "Kahve rafı" menüsü — solda koleksiyonlar ve kampanyalar, sağda kutu
 * fotoğraflarıyla kahveler. Koleksiyonun üzerine gelince raf filtrelenir.
 */
export function MegaMenu({ id, data, open, onNavigate }: MegaMenuProps) {
  const [active, setActive] = useState<string>("all");

  const collections = [
    { slug: "all", name: "Tüm kahveler", tagline: "Haftalık taze kavrum", href: "/kahveler" },
    ...data.categories.map((c) => ({ ...c, href: `/kategori/${c.slug}` })),
    { slug: "ruso-exotics", name: "Ruso Exotics", tagline: "Java'dan doğrudan ticaret", href: "/kahveler?koleksiyon=ruso-exotics" },
  ];
  const inCollection = (slug: string) =>
    slug === "all"
      ? data.products
      : slug === "ruso-exotics"
        ? data.products.filter((p) => p.collection === "ruso-exotics")
        : data.products.filter((p) => p.categories.includes(slug));

  const list = [...inCollection(active)].sort((a, b) => Number(a.soldOut) - Number(b.soldOut));
  const current = collections.find((c) => c.slug === active)!;

  return (
    <div
      id={id}
      className={`absolute inset-x-0 top-full origin-top border-b border-ink-700 bg-ink-900 shadow-2xl shadow-black/60 transition-[opacity,transform,visibility] duration-300 ${
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
      }`}
    >
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-flores-500/60 to-transparent" />
      <div className="mx-auto grid max-w-[1440px] grid-cols-[17rem_1fr] gap-10 px-10 py-8">
        {/* koleksiyonlar */}
        <div className="flex flex-col">
          <p className="eyebrow text-[0.6rem] text-cream-500">Koleksiyonlar</p>
          <ul className="mt-4 space-y-1">
            {collections.map((c) => {
              const isActive = c.slug === active;
              return (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    onMouseEnter={() => setActive(c.slug)}
                    onFocus={() => setActive(c.slug)}
                    onClick={onNavigate}
                    lang={c.slug === "all" ? undefined : "en"}
                    className={`group flex items-center gap-3 rounded-sm py-1.5 font-serif text-[1.6rem] leading-tight transition-colors ${
                      isActive ? "text-cream-50" : "text-cream-500 hover:text-cream-200"
                    }`}
                  >
                    <Image
                      src="/logo.webp"
                      alt=""
                      width={16}
                      height={16}
                      className={`size-4 transition-all duration-500 ${isActive ? "rotate-45 opacity-100" : "-rotate-45 opacity-0"}`}
                    />
                    <span className={`transition-transform duration-300 ${isActive ? "translate-x-0" : "-translate-x-7"}`}>{c.name}</span>
                    <sup className="font-mono text-[0.6rem] text-flores-400">{inCollection(c.slug).length}</sup>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto space-y-2 pt-8">
            <Link
              href="/coffee-bar"
              onClick={onNavigate}
              className="group block rounded-sm border border-flores-500/40 bg-flores-500/10 p-4 transition-colors hover:border-flores-400"
            >
              <span className="flex items-center justify-between">
                <span lang="en" className="eyebrow text-[0.6rem] text-flores-300">
                  Coffee Bar
                </span>
                {site.coffeeBar.promo && <span className="rounded-full bg-flores-500 px-2 py-0.5 text-[0.55rem] font-semibold text-ink-950">{site.coffeeBar.promo}</span>}
              </span>
              <span className="mt-1.5 block text-sm text-cream-100">Kahve tadım randevusu al →</span>
            </Link>
            <Link href="/toptan" onClick={onNavigate} className="block rounded-sm border border-ink-700 p-4 transition-colors hover:border-cream-400">
              <span className="eyebrow text-[0.6rem] text-cream-400">İşletmeler için</span>
              <span className="mt-1.5 block text-sm text-cream-100">Toptan satış · 5 kg&apos;dan itibaren →</span>
            </Link>
          </div>
        </div>

        {/* kahve rafı */}
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-cream-400">
              <span className="font-serif text-lg italic text-cream-100">{current.name}</span> — {current.tagline}
            </p>
            <Link href={current.href} onClick={onNavigate} className="eyebrow link-underline text-[0.6rem] text-cream-300 hover:text-flores-300">
              Tümünü gör →
            </Link>
          </div>
          <ul className="mt-5 grid grid-cols-4 gap-x-5 gap-y-6">
            {list.slice(0, SHELF_LIMIT).map((p) => (
              <li key={p.slug}>
                <Link href={`/kahveler/${p.slug}`} onClick={onNavigate} className="group flex gap-3">
                  <span className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-sm" style={{ backgroundColor: p.bg }}>
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="72px"
                      className={`object-cover transition-transform duration-500 group-hover:scale-110 ${p.soldOut ? "grayscale" : ""}`}
                    />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className={`block font-serif text-lg leading-tight transition-colors group-hover:text-flores-300 ${p.soldOut ? "text-cream-400" : ""}`}>
                      {p.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-cream-500">{p.notes.join(" · ")}</span>
                    <span className="mt-1 block font-mono text-[0.7rem] text-cream-300">
                      {p.soldOut ? "Stokta yok" : p.from != null ? `${formatPrice(p.from)}'den` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {list.length > SHELF_LIMIT && (
            <Link href={current.href} onClick={onNavigate} className="mt-6 inline-block text-sm text-cream-400 hover:text-flores-300">
              +{list.length - SHELF_LIMIT} kahve daha
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
