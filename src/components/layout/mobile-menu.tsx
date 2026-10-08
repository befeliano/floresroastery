"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLoggedIn } from "@/lib/auth/client";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { mainLinks, type MenuData } from "./menu-types";

/**
 * Mobil / tablet menüsü — header'ın DIŞINDA render edilir: header'daki
 * backdrop-filter, içindeki `position: fixed` öğeleri header kutusuna hapseder.
 * Üstte kaydırılabilir kahve rafı, ortada büyük bağlantılar, altta iletişim.
 */
export function MobileMenu({ open, menu, onNavigate }: { open: boolean; menu: MenuData; onNavigate: () => void }) {
  // raf görselleri menü ilk açılana kadar yüklenmesin, sonra kapanış animasyonu için kalsın
  const loggedIn = useLoggedIn();
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);

  const shelf = [...menu.products].sort((a, b) => Number(a.soldOut) - Number(b.soldOut));
  const links = mainLinks.map((l, i) => ({ ...l, n: String(i + 1).padStart(2, "0") }));
  // kademeli giriş animasyonu
  const stagger = (i: number) => ({ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" });
  const item = `transition-[opacity,transform] duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`;

  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-ink-950 pt-18 transition-[opacity,visibility] duration-300 md:pt-20 xl:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div aria-hidden className="h-px shrink-0 bg-gradient-to-r from-transparent via-flores-500/60 to-transparent" />

      {/* kahve rafı */}
      <section aria-label="Kahveler" className="pt-7">
        <div className={`flex items-baseline justify-between px-5 md:px-10 ${item}`} style={stagger(0)}>
          <p className="eyebrow text-flores-400">Kahve rafı</p>
          <Link href="/kahveler" onClick={onNavigate} className="text-xs text-cream-300 underline underline-offset-4">
            Tümü ({menu.products.length}) →
          </Link>
        </div>
        <ul className={`mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 no-scrollbar md:px-10 ${item}`} style={stagger(1)}>
          {mounted &&
            shelf.map((p) => (
              <li key={p.slug} className="w-32 shrink-0 snap-start">
                <Link href={`/kahveler/${p.slug}`} onClick={onNavigate} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm" style={{ background: p.bg }}>
                    <Image src={p.image} alt="" fill sizes="128px" className={`object-cover ${p.soldOut ? "opacity-60 grayscale-[40%]" : ""}`} />
                    {p.soldOut && (
                      <span className="absolute left-1.5 top-1.5 rounded-sm bg-ink-950/80 px-1.5 py-0.5 text-[0.55rem] font-semibold tracking-wider text-cream-100">
                        TÜKENDİ
                      </span>
                    )}
                  </div>
                  <p className="mt-2 truncate font-serif text-base leading-tight">{p.name}</p>
                  <p className="truncate text-[0.7rem] text-cream-400">{p.from != null ? `${formatPrice(p.from)}'den` : p.subtitle}</p>
                </Link>
              </li>
            ))}
        </ul>
        <div className={`mt-4 flex flex-wrap gap-2 px-5 md:px-10 ${item}`} style={stagger(2)}>
          {menu.categories.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              onClick={onNavigate}
              lang="en"
              className="rounded-full border border-ink-600 px-4 py-2 text-sm text-cream-100 transition-colors hover:border-flores-400"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/kahveler?koleksiyon=ruso-exotics"
            onClick={onNavigate}
            lang="en"
            className="rounded-full border border-ink-600 px-4 py-2 text-sm text-cream-100 transition-colors hover:border-flores-400"
          >
            Ruso Exotics
          </Link>
        </div>
      </section>

      {/* ana bağlantılar */}
      <nav aria-label="Mobil menü" className="mt-8 border-t border-ink-800 px-5 md:px-10">
        <ul>
          {links.map((l, i) => (
            <li key={l.href} className={`border-b border-ink-800 ${item}`} style={stagger(3 + i)}>
              <Link href={l.href} onClick={onNavigate} className="flex items-center gap-4 py-4">
                <span className="w-6 font-mono text-[0.65rem] text-cream-500">{l.n}</span>
                <span lang={l.en ? "en" : undefined} className="font-serif text-[1.85rem] leading-none">
                  {l.label}
                </span>
                {l.badge && <span className="rounded-full bg-flores-500 px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.15em] text-ink-950">{l.badge}</span>}
                <span aria-hidden className="ml-auto text-cream-500">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* hızlı erişim + iletişim */}
      <div className={`mt-auto px-5 pb-10 pt-8 md:px-10 ${item}`} style={stagger(3 + links.length)}>
        <div className="grid grid-cols-2 gap-2">
          <Link href={loggedIn ? "/hesabim" : "/giris"} onClick={onNavigate} className="btn btn-ghost whitespace-nowrap px-3 py-3 tracking-[0.14em]">
            {loggedIn ? "Hesabım" : "Giriş yap"}
          </Link>
          <Link href="/siparis-takip" onClick={onNavigate} className="btn btn-ghost whitespace-nowrap px-3 py-3 tracking-[0.14em]">
            Sipariş takibi
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-cream-400">
          <p className="min-w-0">
            <span className="block text-cream-200">{site.store.name}</span>
            <span className="block truncate">{site.coffeeBar.days} · {site.coffeeBar.hours}</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-full border border-ink-600 hover:border-flores-400">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
              </svg>
            </a>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex size-10 items-center justify-center rounded-full border border-ink-600 hover:border-flores-400">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
                <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
