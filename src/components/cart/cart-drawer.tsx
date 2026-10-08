"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { lineKey, MAX_QTY, useCart, useCartSubtotal } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

/** Sağdan kayan sepet çekmecesi */
export function CartDrawer() {
  const { items, isOpen, close, setQuantity, remove } = useCart();
  const subtotal = useCartSubtotal();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Mount sonrası localStorage'dan sepeti yükle (SSR uyumlu)
  useEffect(() => {
    void useCart.persist.rehydrate();
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

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "visible" : "invisible"}`} aria-hidden={!isOpen}>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Sepeti kapat"
        onClick={close}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sepetiniz"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-ink-700 bg-ink-900 outline-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-700 px-6 py-5">
          <h2 className="font-serif text-2xl">Sepetiniz</h2>
          <button type="button" onClick={close} aria-label="Kapat" className="flex size-10 items-center justify-center text-cream-300 hover:text-cream-50">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {threshold != null && items.length > 0 && (
          <div className="border-b border-ink-700 px-6 py-4">
            <p className="text-sm text-cream-300">
              {remaining > 0 ? (
                <>
                  Ücretsiz kargoya <span className="font-semibold text-flores-300">{formatPrice(remaining)}</span> kaldı
                </>
              ) : (
                <span className="text-flores-300">Ücretsiz kargo kazandınız.</span>
              )}
            </p>
            <p className="mt-1 text-xs text-cream-500">Eskişehir içi kurye ve mağazadan teslim her zaman ücretsiz.</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink-700">
              <div className="h-full rounded-full bg-flores-500 transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-serif text-2xl italic text-cream-200">Sepetiniz şimdilik boş.</p>
            <Link href="/kahveler" className="btn btn-primary" onClick={close}>
              Kahveleri Keşfet
            </Link>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-ink-700 overflow-y-auto px-6">
            {items.map((item) => {
              const key = lineKey(item);
              return (
                <li key={key} className="flex gap-4 py-5">
                  <Link href={`/kahveler/${item.slug}`} onClick={close} className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-ink-800">
                    <Image src={item.image} alt={`${item.name} kahve paketi`} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/kahveler/${item.slug}`} onClick={close} className="font-serif text-lg leading-tight hover:text-flores-300">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-cream-400">
                          {item.variantLabel} · {item.grind}
                        </p>
                      </div>
                      <p className="font-mono text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-ink-600">
                        <button
                          type="button"
                          aria-label="Azalt"
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
                          aria-label="Arttır"
                          disabled={item.quantity >= MAX_QTY}
                          onClick={() => setQuantity(key, item.quantity + 1)}
                          className="flex size-8 items-center justify-center text-cream-300 hover:text-cream-50 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(key)} className="text-xs text-cream-500 underline-offset-4 hover:text-cream-200 hover:underline">
                        Kaldır
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {items.length > 0 && (
          <div className="border-t border-ink-700 px-6 py-6">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-cream-300">Ara toplam</span>
              <span className="font-mono text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-cream-500">Kargo ve indirimler ödeme adımında hesaplanır. Fiyatlara KDV dahildir.</p>
            <Link href="/odeme" onClick={close} className="btn btn-primary mt-5 w-full">
              Ödemeye Geç
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
