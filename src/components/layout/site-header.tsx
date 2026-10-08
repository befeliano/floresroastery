"use client";

import Link from "@/i18n/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { useI18n } from "@/i18n/client";
import { splitLocale } from "@/i18n/config";
import { useLoggedIn } from "@/lib/auth/client";
import { site } from "@/lib/site";
import { useCart, useCartCount } from "@/lib/cart/store";
import { LanguageSwitcher } from "./language-switcher";
import { MegaMenu } from "./mega-menu";
import { mainLinks, type MenuData } from "./menu-types";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader({ menu }: { menu: MenuData }) {
  const pathname = usePathname();
  const { t, fmt } = useI18n();
  // dil önekisiz yol: "/en/kahveler" → "/kahveler"
  const path = splitLocale(pathname).path;
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedBy = useRef<"hover" | "click" | null>(null);
  const openCart = useCart((s) => s.open);
  const count = useCartCount();
  const loggedIn = useLoggedIn();

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

  const overHero = path === "/" && !scrolled && !megaOpen && !mobileOpen;

  return (
    <>
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
          {t.nav.skip}
        </a>
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <Logo />

          <nav aria-label={t.nav.main} className="hidden items-center gap-7 xl:flex 2xl:gap-9">
            <button
              type="button"
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              onMouseEnter={openMega}
              onClick={toggleMega}
              className={`eyebrow flex items-center gap-2 py-3 transition-colors ${megaOpen ? "text-flores-300" : "text-cream-100 hover:text-flores-300"}`}
            >
              {t.nav.coffees}
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
                className={`eyebrow flex items-center gap-2 py-3 transition-colors hover:text-flores-300 ${path.startsWith(l.href) ? "text-flores-300" : "text-cream-100"}`}
              >
                {t.nav[l.key]}
                {l.badge && site.coffeeBar.promo && (
                  <span lang="tr" className="rounded-full bg-flores-500 px-1.5 py-0.5 text-[0.5rem] tracking-[0.15em] text-ink-950">
                    {t.nav.freeBadge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <LanguageSwitcher className="hidden md:flex" />
            <Link
              href={loggedIn ? "/hesabim" : "/giris"}
              className="eyebrow hidden px-3 py-3 text-cream-100 transition-colors hover:text-flores-300 sm:block"
            >
              {loggedIn ? t.nav.account : t.nav.login}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={fmt(t.nav.openCart, { n: count })}
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
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
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

      </header>
      {/* header'ın dışında: backdrop-filter fixed konumlu menüyü header kutusuna hapsetmesin */}
      <MobileMenu open={mobileOpen} menu={menu} onNavigate={() => setMobileOpen(false)} />
    </>
  );
}

