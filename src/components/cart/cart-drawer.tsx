"use client";

import Image from "next/image";
import Link from "@/i18n/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/client";
import { captureAttribution } from "@/lib/attribution";
import { lineKey, MAX_QTY, useCart, useCartSubtotal } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export type CartSuggestion = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  variantId: string;
  variantLabel: string;
  price: number;
  grind: string;
};

/** Sağdan kayan sepet çekmecesi */
export function CartDrawer({ suggestions = [] }: { suggestions?: CartSuggestion[] }) {
  const { items, isOpen, close, setQuantity, remove, add } = useCart();
  const subtotal = useCartSubtotal();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const { t, fmt, grind } = useI18n();

  // Mount sonrası localStorage'dan sepeti yükle (SSR uyumlu)
  useEffect(() => {
    void useCart.persist.rehydrate();
    // ziyaret kaynağı (WooCommerce "Menşe") — sitenin her sayfasında bulunan bileşenden bir kez
    captureAttribution();
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, close]);

  const threshold = site.shipping.freeThreshold;
  const remaining = threshold == null ? 0 : Math.max(0, threshold - subtotal);
  const progress = threshold == null ? 0 : Math.min(100, (subtotal / threshold) * 100);

  // öneri: ücretsiz kargoya az kaldıysa açığı kapatan en ucuz paket, yoksa sepette olmayan ilk kahve
  const inCart = new Set(items.map((i) => i.slug));
  const pool = suggestions.filter((s) => !inCart.has(s.slug));
  const filler = remaining > 0 ? pool.filter((s) => s.price >= remaining && s.price <= remaining + 400).sort((a, b) => a.price - b.price)[0] : undefined;
  const suggestion = items.length > 0 && !items.some((i) => i.slug === "toptan-siparis") ? (filler ?? pool[0]) : undefined;

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "visible" : "invisible"}`} aria-hidden={!isOpen}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={t.cart.closeCart}
        onClick={close}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-ink-700 bg-ink-900 outline-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-700 px-6 py-5">
          <h2 className="font-serif text-2xl">{t.cart.title}</h2>
          <button type="button" onClick={close} aria-label={t.common.close} className="flex size-10 items-center justify-center text-cream-300 hover:text-cream-50">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {threshold != null && items.length > 0 && (
          <div className="border-b border-ink-700 px-6 py-4">
            <p className="text-sm text-cream-300">
              {remaining > 0 ? (
                <span>{fmt(t.cart.toFree, { amount: formatPrice(remaining) })}</span>
              ) : (
                <span className="text-flores-300">{t.cart.gotFree}</span>
              )}
            </p>
            <p className="mt-1 text-xs text-cream-500">{t.cart.localFree}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink-700">
              <div className="h-full rounded-full bg-flores-500 transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-serif text-2xl italic text-cream-200">{t.cart.empty}</p>
            <Link href="/kahveler" className="btn btn-primary" onClick={close}>
              {t.cart.explore}
            </Link>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-ink-700 overflow-y-auto px-6">
            {items.map((item) => {
              const key = lineKey(item);
              return (
                <li key={key} className="flex gap-4 py-5">
                  <Link href={item.slug === "toptan-siparis" ? "/toptan#siparis" : `/kahveler/${item.slug}`} onClick={close} className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-ink-800">
                    <Image src={item.image} alt={fmt(t.common.coffeePackageAlt, { name: item.name })} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={item.slug === "toptan-siparis" ? "/toptan#siparis" : `/kahveler/${item.slug}`} onClick={close} className="font-serif text-lg leading-tight hover:text-flores-300">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-cream-400">
                          {[item.variantLabel, item.grind && grind(item.grind)].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <p className="font-mono text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-ink-600">
                        <button
                          type="button"
                          aria-label={t.cart.decrease}
                          onClick={() => setQuantity(key, item.quantity - 1)}
                          className="flex size-8 items-center justify-center text-cream-300 hover:text-cream-50"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-mono text-sm" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={t.cart.increase}
                          disabled={item.quantity >= MAX_QTY}
                          onClick={() => setQuantity(key, item.quantity + 1)}
                          className="flex size-8 items-center justify-center text-cream-300 hover:text-cream-50 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(key)} className="text-xs text-cream-500 underline-offset-4 hover:text-cream-200 hover:underline">
                        {t.common.remove}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {suggestion && (
          <div className="border-t border-ink-700 px-6 py-4">
            <p className="eyebrow text-[0.6rem] text-flores-300">{filler ? t.cart.suggestFill : t.cart.suggestTry}</p>
            <div className="mt-3 flex items-center gap-3">
              <Link href={`/kahveler/${suggestion.slug}`} onClick={close} className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-ink-800">
                <Image src={suggestion.image} alt={fmt(t.common.coffeePackageAlt, { name: suggestion.name })} fill sizes="56px" className="object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-base leading-tight">{suggestion.name}</p>
                <p className="truncate text-xs text-cream-400">
                  {suggestion.variantLabel} · {formatPrice(suggestion.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  add({
                    slug: suggestion.slug,
                    variantId: suggestion.variantId,
                    grind: suggestion.grind,
                    quantity: 1,
                    name: suggestion.name,
                    subtitle: suggestion.subtitle,
                    variantLabel: suggestion.variantLabel,
                    unitPrice: suggestion.price,
                    image: suggestion.image,
                  })
                }
                className="btn btn-ghost shrink-0 px-4 py-2 text-[0.65rem]"
              >
                + {t.cart.suggestAdd}
              </button>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-ink-700 px-6 py-6">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-cream-300">{t.common.subtotal}</span>
              <span className="font-mono text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-cream-500">{t.cart.note}</p>
            <Link href="/odeme" onClick={close} className="btn btn-primary mt-5 w-full">
              {t.cart.checkout}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
