"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { splitLocale } from "@/i18n/config";
import Link from "@/i18n/link";
import { useLoggedIn } from "@/lib/auth/client";
import { useCart } from "@/lib/cart/store";
import { CartBadge } from "./cart-badge";
import { openSearch } from "./search-dialog";

/**
 * Telefon alt menüsü (md altı): Kahveler · Bulucu · Ara · Sepet · Hesap.
 * Ürün sayfasında (kendi yapışkan satın alma barı var) ve ödeme adımında gösterilmez.
 * Akıştaki boşluk div'i, footer'ın son satırı barın altında kalmasın diye.
 */
export function TabBar() {
  const { t } = useI18n();
  const path = splitLocale(usePathname()).path;
  const openCart = useCart((s) => s.open);
  const loggedIn = useLoggedIn();

  if (/^\/kahveler\/[^/]+$/.test(path) || path.startsWith("/odeme")) return null;

  const account = loggedIn ? "/hesabim" : "/giris";
  const item = "flex flex-1 flex-col items-center justify-center gap-1 pt-2 pb-1.5 text-[0.6rem] tracking-wide transition-colors";
  const tone = (active: boolean) => (active ? "text-flores-300" : "text-cream-300 active:text-cream-50");

  return (
    <>
      <div aria-hidden className="h-[calc(3.75rem+env(safe-area-inset-bottom))] md:hidden" />
      <nav
        aria-label={t.nav.tabBar}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-700 bg-ink-950 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="flex h-[3.75rem]">
          <li className="flex flex-1">
            <Link href="/kahveler" className={`${item} ${tone(path === "/kahveler")}`} aria-current={path === "/kahveler" ? "page" : undefined}>
              <Icon d="M12 3c4 0 7 3.6 7 8.5S16 21 12 21s-7-4.6-7-9.5S8 3 12 3Zm0 0c-2 3-2 6 0 9s2 6 0 9" />
              {t.nav.coffees}
            </Link>
          </li>
          <li className="flex flex-1">
            <Link href="/kahve-bulucu" className={`${item} ${tone(path === "/kahve-bulucu")}`} aria-current={path === "/kahve-bulucu" ? "page" : undefined}>
              <Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z" />
              {t.nav.tabFinder}
            </Link>
          </li>
          <li className="flex flex-1">
            <button type="button" onClick={openSearch} className={`${item} ${tone(false)}`}>
              <Icon d="M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM16 16l4 4" />
              {t.search.open}
            </button>
          </li>
          <li className="flex flex-1">
            <button type="button" data-cart-target onClick={openCart} className={`${item} ${tone(false)}`}>
              <span className="relative">
                <Icon d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Zm4 0V6.5a3 3 0 0 1 6 0V8" />
                <CartBadge className="-right-3 -top-2" />
              </span>
              {t.nav.tabCart}
            </button>
          </li>
          <li className="flex flex-1">
            <Link href={account} className={`${item} ${tone(path.startsWith(account))}`} aria-current={path.startsWith(account) ? "page" : undefined}>
              <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8.5c.8-3.4 3.6-5.5 7-5.5s6.2 2.1 7 5.5" />
              {t.nav.tabAccount}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
