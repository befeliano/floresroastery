"use client";

import { useEffect, useRef } from "react";
import { useCartCount } from "@/lib/cart/store";

/** Sepet sayacı — ürün sepete uçup varınca ("flores:cart-bump") zıplar */
export function CartBadge({ className = "" }: { className?: string }) {
  const count = useCartCount();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bump = () =>
      ref.current?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.55)" }, { transform: "scale(.9)" }, { transform: "scale(1)" }],
        { duration: 480, easing: "cubic-bezier(.3,1.6,.5,1)" },
      );
    window.addEventListener("flores:cart-bump", bump);
    return () => window.removeEventListener("flores:cart-bump", bump);
  }, []);

  if (count <= 0) return null;
  return (
    <span
      ref={ref}
      className={`absolute flex min-w-[18px] items-center justify-center rounded-full bg-flores-500 px-1 text-[10px] font-bold leading-[18px] text-ink-950 ${className}`}
    >
      {count}
    </span>
  );
}
