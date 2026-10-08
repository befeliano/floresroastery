"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "@/lib/commerce/types";

/**
 * Sepet durumu — Zustand (hafif, Context re-render maliyeti yok).
 * Fiyatlar burada yalnızca gösterim içindir; ödeme sırasında sunucu her satırı
 * katalogdan yeniden fiyatlar (bkz. /api/checkout).
 */
export interface CartItem extends CartLine {
  name: string;
  subtitle: string;
  variantLabel: string;
  unitPrice: number;
  /** Kart görseli */
  image: string;
}

export const MAX_QTY = 20;

export const lineKey = (l: Pick<CartLine, "slug" | "variantId" | "grind">) => `${l.slug}|${l.variantId}|${l.grind}`;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: CartItem) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item) =>
        set((state) => {
          const key = lineKey(item);
          const existing = state.items.find((i) => lineKey(i) === key);
          const items = existing
            ? state.items.map((i) =>
                lineKey(i) === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + item.quantity) } : i,
              )
            : [...state.items, { ...item, quantity: Math.min(MAX_QTY, item.quantity) }];
          return { items, isOpen: true };
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => lineKey(i) !== key)
              : state.items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i)),
        })),
      remove: (key) => set((state) => ({ items: state.items.filter((i) => lineKey(i) !== key) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "flores-cart",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      // önceki sürümlerin sepet şeması farklı: güvenle sıfırla
      migrate: () => ({ items: [] }),
      // SSR ile hydration uyuşmazlığını önlemek için sepet mount sonrası yüklenir
      skipHydration: true,
    },
  ),
);

export const useCartCount = () => useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
export const useCartSubtotal = () => useCart((s) => s.items.reduce((n, i) => n + i.quantity * i.unitPrice, 0));
