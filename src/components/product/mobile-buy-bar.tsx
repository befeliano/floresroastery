"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";

/**
 * Mobilde satın alma paneli ekrandan çıkınca alttan beliren çubuk:
 * fiyat + panele götüren buton. Panel ya da footer görünürken gizlenir.
 */
export function MobileBuyBar({ name, fromPrice, soldOut }: { name: string; fromPrice: number | null; soldOut: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const panel = document.getElementById("satin-al");
    const footer = document.querySelector("footer");
    if (!panel) return;
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) visible.set(e.target, e.isIntersecting);
      setShow(!visible.get(panel) && !(footer && visible.get(footer)));
    });
    io.observe(panel);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const goToPanel = () => {
    const panel = document.getElementById("satin-al");
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });
    panel?.querySelector<HTMLElement>("button, select, input")?.focus({ preventScroll: true });
  };

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink-700 bg-ink-950/95 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-serif text-lg leading-tight">{name}</p>
          <p className="font-mono text-xs text-cream-400">{soldOut ? "Stokta yok" : fromPrice != null ? `${formatPrice(fromPrice)}'den` : ""}</p>
        </div>
        <button type="button" onClick={goToPanel} className={`btn shrink-0 px-5 py-3 ${soldOut ? "btn-ghost" : "btn-primary"}`}>
          {soldOut ? "Haber ver" : "Sepete ekle"}
        </button>
      </div>
    </div>
  );
}
