"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart/store";

/**
 * Önceki siparişin hâlâ satılan kalemlerini güncel fiyatlarıyla sepete koyar.
 * Fiyat yalnızca gösterim içindir; ödemede sunucu yeniden hesaplar.
 */
export function ReorderButton({ items, label, partial }: { items: CartItem[]; label: string; partial?: string }) {
  const add = useCart((s) => s.add);
  const [done, setDone] = useState(false);
  if (!items.length) return null;
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => {
          for (const item of items) add(item);
          setDone(true);
        }}
        className="btn btn-ghost px-4 py-2.5"
      >
        {done ? "✓ " : "↻ "}
        {label}
      </button>
      {partial && <p className="text-xs text-cream-500">{partial}</p>}
    </div>
  );
}
