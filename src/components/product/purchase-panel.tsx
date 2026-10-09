"use client";

import Image from "next/image";
import Link from "@/i18n/link";
import { useEffect, useRef, useState } from "react";
import { StockAlertForm } from "@/components/forms/stock-alert-form";
import { useI18n } from "@/i18n/client";
import { MAX_QTY, useCart } from "@/lib/cart/store";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

type BuyProduct = Pick<Product, "slug" | "name" | "subtitle" | "variants" | "grindOptions"> & { image: string };

/**
 * Paket + öğütme + adet seçimi ve sepete ekleme. Panel ekrandan çıkınca altta yapışkan bar belirir:
 * mobilde panelden önce ve sonra, masaüstünde (panel yapışkan) yalnızca geçildikten sonra; footer görünürken gizlenir.
 */
export function PurchasePanel({ product }: { product: BuyProduct }) {
  const soldOut = product.variants.every((v) => !v.inStock);
  const firstAvailable = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const [variantId, setVariantId] = useState(firstAvailable?.id ?? "");
  const [grind, setGrind] = useState(product.grindOptions[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);
  const { t, fmt, grind: grindLabel } = useI18n();

  const variant = product.variants.find((v) => v.id === variantId) ?? firstAvailable;
  const ground = product.grindOptions.length > 0 && grind !== product.grindOptions[0];

  useEffect(() => {
    const el = panelRef.current;
    if (!el || soldOut) return;
    const footer = document.querySelector("footer");
    const desktop = window.matchMedia("(min-width: 1024px)");
    let panel: IntersectionObserverEntry | null = null;
    let footerVisible = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === el) panel = e;
        else footerVisible = e.isIntersecting;
      }
      if (!panel) return;
      const away = !panel.isIntersecting && (panel.boundingClientRect.top < 0 || !desktop.matches);
      setShowSticky(away && !footerVisible);
    });
    io.observe(el);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, [soldOut]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  function addToCart() {
    if (!variant?.inStock) return;
    add({
      slug: product.slug,
      variantId: variant.id,
      grind,
      quantity: qty,
      name: product.name,
      subtitle: product.subtitle,
      variantLabel: variant.label,
      unitPrice: variant.price,
      image: product.image,
    });
    setAdded(true);
  }

  if (soldOut || !variant) {
    return (
      <div className="rounded-sm border border-ink-700 bg-ink-900 p-6 md:p-8">
        <p className="eyebrow text-[0.65rem] text-flores-400">{t.product.stockStatus}</p>
        <p className="mt-3 font-serif text-3xl">{t.product.notInStock}</p>
        {variant && (
          <p className="mt-2 font-mono text-sm text-cream-400">
            {fmt(t.product.lastPrice, { price: formatPrice(Math.min(...product.variants.map((v) => v.price))) })}
          </p>
        )}
        <p className="mt-5 text-cream-300">{t.product.notifyText}</p>
        <StockAlertForm slug={product.slug} />
        <Link href="/kahveler" className="btn btn-ghost mt-6 w-full">
          {t.product.browseInStock}
        </Link>
      </div>
    );
  }

  const discount = variant.compareAtPrice ? Math.round((1 - variant.price / variant.compareAtPrice) * 100) : 0;
  // gram başı fiyat: en küçük pakete göre büyük paketteki avantaj (yalnızca gramajı bilinen paketler)
  const perGram = (v: { price: number; weight: number }) => (v.weight > 0 ? v.price / v.weight : 0);
  const weighed = product.variants.filter((v) => v.weight > 0);
  const base = weighed.length > 1 ? weighed.reduce((a, b) => (b.weight < a.weight ? b : a)) : null;
  const saving = (v: { price: number; weight: number }) =>
    base && v.weight > base.weight ? Math.round((1 - perGram(v) / perGram(base)) * 100) : 0;
  const best = weighed.length > 1 ? weighed.filter((v) => v.inStock).reduce<(typeof weighed)[number] | null>((a, b) => (!a || perGram(b) < perGram(a) ? b : a), null) : null;

  return (
    <>
      <div ref={panelRef} className="rounded-sm border border-ink-700 bg-ink-900 p-6 md:p-8">
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-3xl">{formatPrice(variant.price)}</p>
          {variant.compareAtPrice && (
            <>
              <p className="font-mono text-base text-cream-500 line-through">{formatPrice(variant.compareAtPrice)}</p>
              <span className="rounded-sm bg-flores-500/15 px-2 py-0.5 text-xs font-semibold text-flores-300">{fmt(t.product.discount, { n: discount })}</span>
            </>
          )}
          <p className="ml-auto text-xs text-cream-500">{t.common.vatIncluded}</p>
        </div>
        {variant.weight > 0 && (
          <p className="mt-2 font-mono text-xs text-cream-400">{fmt(t.product.perKg, { price: formatPrice(Math.round(perGram(variant) * 1000)) })}</p>
        )}

        <fieldset className="mt-8">
          <legend className="eyebrow text-[0.65rem] text-cream-400">{t.product.package}</legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {product.variants.map((v) => (
              <label
                key={v.id}
                className={`relative flex cursor-pointer flex-col items-center rounded-sm border px-4 py-3 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-flores-400 ${
                  v.id === variantId ? "border-flores-500 bg-flores-500/10" : "border-ink-600 hover:border-cream-400"
                } ${!v.inStock ? "cursor-not-allowed opacity-40" : ""}`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v.id}
                  checked={v.id === variantId}
                  disabled={!v.inStock}
                  onChange={() => setVariantId(v.id)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{v.label}</span>
                <span className="mt-0.5 font-mono text-xs text-cream-400">{v.inStock ? formatPrice(v.price) : t.common.soldOut}</span>
                {v.inStock && saving(v) >= 5 && (
                  <span className="absolute -top-2 right-2 rounded-full bg-flores-500 px-2 py-0.5 text-[0.6rem] font-semibold text-ink-950">
                    {fmt(t.product.bulkSave, { n: saving(v) })}
                  </span>
                )}
              </label>
            ))}
          </div>
          {best && saving(best) >= 5 && best.id !== variant.id && (
            <p className="mt-3 text-xs text-cream-400">
              {fmt(t.product.bulkHint, { label: best.label, price: formatPrice(Math.round(perGram(best) * 100)) })}
            </p>
          )}
        </fieldset>

        {product.grindOptions.length > 0 && (
        <div className="mt-6">
          <label htmlFor="grind" className="eyebrow text-[0.65rem] text-cream-400">
            {t.product.grind}
          </label>
          <div className="relative mt-3">
            <select id="grind" value={grind} onChange={(e) => setGrind(e.target.value)} className="field appearance-none pr-10">
              {product.grindOptions.map((g) => (
                <option key={g} value={g}>
                  {grindLabel(g)}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 10 6" aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-2.5 -translate-y-1/2 text-cream-400">
              <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
          <p className={`mt-2 text-xs ${ground ? "text-amber-200/90" : "text-cream-500"}`}>
            {ground ? (
              <>
                {t.product.groundNoteBefore}
                <Link href="/teslimat-ve-iade-sartlari" className="underline underline-offset-2">
                  {t.product.groundNoteLink}
                </Link>
                .
              </>
            ) : (
              t.product.beanNote
            )}
          </p>
        </div>
        )}

        <div className="mt-8 flex gap-3">
          <QtyStepper qty={qty} setQty={setQty} labels={t.product} fmt={fmt} />
          <button type="button" onClick={addToCart} className="btn btn-primary flex-1">
            {added ? t.product.added : t.product.addToCart}
          </button>
        </div>

        <ul className="mt-8 space-y-2 border-t border-ink-700 pt-6 text-sm text-cream-300">
          <li className="flex gap-3">
            <Dot /> {t.product.perkRoast}
          </li>
          {site.shipping.freeThreshold != null && (
            <li className="flex gap-3">
              <Dot /> {fmt(t.product.perkShipping, { price: formatPrice(site.shipping.freeThreshold) })}
            </li>
          )}
          <li className="flex gap-3">
            <Dot /> {t.product.perkSecure}
          </li>
        </ul>
        <Image src="/payment-logos.png" alt={t.product.paymentAlt} width={432} height={28} className="mt-5 h-auto w-full max-w-xs opacity-80 invert-0" />
      </div>

      {/* Yapışkan satın alma barı (Doyenne'deki sağ alt bar) */}
      <div
        inert={!showSticky}
        className={`fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)] border-t border-ink-700 bg-ink-950/90 backdrop-blur-xl transition-transform duration-500 md:inset-x-auto md:bottom-6 md:right-6 md:rounded-sm md:border ${
          showSticky ? "translate-y-0" : "translate-y-[140%]"
        }`}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-sm">
            <Image src={product.image} alt="" fill sizes="44px" className="object-cover" />
          </div>
          <div className="mr-auto min-w-0 md:mr-2">
            <p className="truncate font-serif text-lg leading-tight">{product.name}</p>
            <p className="font-mono text-xs text-cream-400">
              {variant.label} · {formatPrice(variant.price)}
            </p>
          </div>
          <QtyStepper qty={qty} setQty={setQty} compact tabbable={showSticky} labels={t.product} fmt={fmt} />
          <button type="button" tabIndex={showSticky ? 0 : -1} onClick={addToCart} className="btn btn-primary px-5 py-3">
            {added ? t.product.addedShort : t.product.add}
          </button>
        </div>
      </div>
    </>
  );
}

function QtyStepper({
  qty,
  setQty,
  compact = false,
  tabbable = true,
  labels,
  fmt,
}: {
  qty: number;
  setQty: (n: number) => void;
  compact?: boolean;
  tabbable?: boolean;
  labels: { qtyDec: string; qtyInc: string; qty: string };
  fmt: (s: string, v: Record<string, string | number>) => string;
}) {
  const size = compact ? "size-9" : "size-12";
  return (
    <div className="flex items-center border border-ink-600">
      <button
        type="button"
        tabIndex={tabbable ? 0 : -1}
        aria-label={labels.qtyDec}
        onClick={() => setQty(Math.max(1, qty - 1))}
        className={`${size} flex items-center justify-center text-cream-300 hover:text-cream-50`}
      >
        −
      </button>
      <span className="w-8 text-center font-mono" aria-live="polite" aria-label={fmt(labels.qty, { n: qty })}>
        {qty}
      </span>
      <button
        type="button"
        tabIndex={tabbable ? 0 : -1}
        aria-label={labels.qtyInc}
        onClick={() => setQty(Math.min(MAX_QTY, qty + 1))}
        className={`${size} flex items-center justify-center text-cream-300 hover:text-cream-50`}
      >
        +
      </button>
    </div>
  );
}

const Dot = () => <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-flores-500" />;
