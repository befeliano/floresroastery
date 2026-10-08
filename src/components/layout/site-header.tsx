"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { useCart, useCartCount } from "@/lib/cart/store";
import { MegaMenu } from "./mega-menu";
import { mainLinks, type MenuData } from "./menu-types";

export function SiteHeader({ menu }: { menu: MenuData }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedBy = useRef<"hover" | "click" | null>(null);
  const openCart = useCart((s) => s.open);
  const count = useCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sayfa değişince menüleri kapat (render sırasında önceki değere göre ayarlama)
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen((open) => {
      if (!open) openedBy.current = "hover";
      return true;
    });
  };
  // fareyle açılmış menüye tıklamak onu kapatmaz, sabitler; ikinci tıklama kapatır
  const toggleMega = () => {
    if (megaOpen && openedBy.current === "hover") {
      openedBy.current = "click";
      return;
    }
    openedBy.current = megaOpen ? null : "click";
    setMegaOpen(!megaOpen);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  const overHero = pathname === "/" && !scrolled && !megaOpen && !mobileOpen;

  return (
    <header
      onMouseLeave={scheduleClose}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-ink-700/70 bg-ink-950/85 backdrop-blur-xl"
      }`}
    >
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-flores-500 focus:px-4 focus:py-2 focus:text-ink-950"
      >
        İçeriğe geç
      </a>
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
        <Logo />

        <nav aria-label="Ana menü" className="hidden items-center gap-7 xl:flex 2xl:gap-9">
          <button
            type="button"
            aria-expanded={megaOpen}
            aria-controls="mega-menu"
            onMouseEnter={openMega}
            onClick={toggleMega}
            className={`eyebrow flex items-center gap-2 py-3 transition-colors ${megaOpen ? "text-flores-300" : "text-cream-100 hover:text-flores-300"}`}
          >
            Kahveler
            <svg viewBox="0 0 10 6" className={`size-2.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} aria-hidden>
              <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          {mainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={scheduleClose}
              lang={l.en ? "en" : undefined}
              className={`eyebrow flex items-center gap-2 py-3 transition-colors hover:text-flores-300 ${pathname.startsWith(l.href) ? "text-flores-300" : "text-cream-100"}`}
            >
              {l.label}
              {l.badge && (
                <span lang="tr" className="rounded-full bg-flores-500 px-1.5 py-0.5 text-[0.5rem] tracking-[0.15em] text-ink-950">
                  {l.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <Link href="/giris" className="eyebrow hidden px-3 py-3 text-cream-100 transition-colors hover:text-flores-300 sm:block">
            Giriş
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Sepeti aç (${count} ürün)`}
            className="relative flex size-11 items-center justify-center text-cream-100 transition-colors hover:text-flores-300"
          >
            <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-flores-500 px-1 text-[10px] font-bold leading-[18px] text-ink-950">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            className="flex size-11 flex-col items-center justify-center gap-[7px] xl:hidden"
          >
            <span className={`h-px w-7 bg-cream-50 transition-transform duration-300 ${mobileOpen ? "translate-y-[4px] rotate-45" : ""}`} />
            <span className={`h-px w-7 bg-cream-50 transition-transform duration-300 ${mobileOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div className="hidden xl:block" onMouseEnter={openMega}>
        <MegaMenu id="mega-menu" data={menu} open={megaOpen} onNavigate={() => setMegaOpen(false)} />
      </div>

      <MobileMenu open={mobileOpen} menu={menu} onNavigate={() => setMobileOpen(false)} />
    </header>
  );
}

function MobileMenu({ open, menu, onNavigate }: { open: boolean; menu: MenuData; onNavigate: () => void }) {
  return (
    <div
      id="mobile-menu"
      className={`fixed inset-x-0 bottom-0 top-18 overflow-y-auto bg-ink-950 px-6 pb-12 pt-8 transition-[opacity,visibility] duration-300 md:top-20 xl:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <p className="eyebrow mb-4 text-flores-400">Kahveler</p>
      <ul className="space-y-1 border-b border-ink-700 pb-8">
        <li>
          <Link href="/kahveler" onClick={onNavigate} className="block py-2 font-serif text-4xl">
            Tüm Kahveler
          </Link>
        </li>
        {menu.categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/kategori/${c.slug}`} onClick={onNavigate} lang="en" className="block py-2 font-serif text-4xl">
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="space-y-1 pt-8">
        {[...mainLinks, { href: "/siparis-takip", label: "Sipariş Takibi" }, { href: "/giris", label: "Giriş" }].map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={onNavigate} className="eyebrow flex items-center gap-3 py-3 text-base text-cream-200">
              {l.label}
              {"badge" in l && l.badge && <span className="rounded-full bg-flores-500 px-2 py-0.5 text-[0.55rem] text-ink-950">{l.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
