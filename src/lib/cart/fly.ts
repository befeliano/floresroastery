"use client";

/**
 * Sepete uçan ürün animasyonu: ürün görselinin küçük bir kopyası görünür sepet ikonuna
 * (data-cart-target) kavis çizerek uçar, varınca sayaç zıplar ("flores:cart-bump").
 * Hareket azaltma tercihinde ya da hedef görünmüyorsa animasyon atlanır.
 */
export function flyToCart(from: Element | null | undefined, image: string): Promise<void> {
  const bump = () => window.dispatchEvent(new Event("flores:cart-bump"));
  const target = [...document.querySelectorAll<HTMLElement>("[data-cart-target]")].find((el) => el.offsetParent !== null && el.getClientRects().length > 0);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!from || !target || reduce || typeof Element.prototype.animate !== "function") {
    bump();
    return Promise.resolve();
  }
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(96, Math.max(48, Math.min(a.width, a.height) * 0.5));
  const x0 = a.left + a.width / 2 - size / 2;
  const y0 = a.top + a.height / 2 - size / 2;
  const dx = b.left + b.width / 2 - size / 2 - x0;
  const dy = b.top + b.height / 2 - size / 2 - y0;

  const img = document.createElement("img");
  img.src = image;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  Object.assign(img.style, {
    position: "fixed",
    left: `${x0}px`,
    top: `${y0}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "4px",
    zIndex: "80",
    pointerEvents: "none",
    boxShadow: "0 12px 30px rgba(0,0,0,.45)",
    willChange: "transform, opacity",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(img);

  // yukarı doğru kavis: ara noktada hedefin biraz üstünden geç
  const lift = Math.min(160, Math.abs(dy) * 0.35 + 60);
  const anim = img.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - lift}px) scale(.7)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.18)`, opacity: 0.35, offset: 1 },
    ],
    { duration: 720, easing: "cubic-bezier(.45,.05,.35,1)", fill: "forwards" },
  );
  return anim.finished
    .catch(() => undefined)
    .then(() => {
      img.remove();
      bump();
    });
}
