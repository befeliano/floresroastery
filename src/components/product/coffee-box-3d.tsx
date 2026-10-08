"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import type { Product } from "@/lib/commerce/types";
import { upperTR } from "@/lib/format";

export type BoxProduct = Pick<
  Product,
  | "name"
  | "fullName"
  | "origin"
  | "elevation"
  | "process"
  | "variety"
  | "roastLevel"
  | "recommendedFor"
  | "sensory"
  | "score"
  | "image"
> & { notes: string[]; soldOut: boolean; qr?: string };

const ROAST_DOTS: Record<Product["roastLevel"], number> = { Açık: 2, "Açık-Orta": 3, Orta: 3, "Orta-Koyu": 4 };

const FACES = [
  { key: "front", label: "front", ry: 0 },
  { key: "right", label: "label", ry: -90 },
  { key: "back", label: "back", ry: 180 },
  { key: "left", label: "side", ry: 90 },
] as const;

const REST_RX = -10;

/**
 * Flores kutusu — CSS 3D (WebGL/three.js yok, ~0 KB ek bağımlılık).
 * Sürükleyerek / ok tuşlarıyla çevrilir, boştayken yavaşça döner.
 * Yan yüz, gerçek kutudaki gibi kahvenin künye etiketini taşır.
 */
export function CoffeeBox3D({ product, className = "" }: { product: BoxProduct; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { t, fmt, locale } = useI18n();
  const upper = (v: string) => (locale === "tr" ? upperTR(v) : v.toUpperCase());
  const cubeRef = useRef<HTMLDivElement>(null);
  const s = useRef({ rx: REST_RX, ry: -32, vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0, hover: false, pauseUntil: 0, visible: true });
  const [activeFace, setActiveFace] = useState<string>("front");
  const [hinted, setHinted] = useState(false);

  const pouch = product.image.packaging === "pouch";
  const aspect = product.image.aspect;

  const apply = useCallback(() => {
    const { rx, ry } = s.current;
    if (cubeRef.current) cubeRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const loop = () => {
      const st = s.current;
      if (!st.dragging && st.visible) {
        st.ry += st.vy;
        st.rx += st.vx;
        st.vy *= 0.93;
        st.vx *= 0.88;
        const calm = Math.abs(st.vy) < 0.05;
        if (calm && !reduce && !st.hover && performance.now() > st.pauseUntil) st.ry += 0.14;
        if (calm) st.rx += (REST_RX - st.rx) * 0.03;
        st.rx = Math.max(-65, Math.min(65, st.rx));
        apply();
        // aktif yüzü belirle (buton durumları için)
        const n = ((-st.ry % 360) + 360) % 360;
        const face = n < 45 || n >= 315 ? "front" : n < 135 ? "right" : n < 225 ? "back" : "left";
        setActiveFace((f) => (f === face ? f : face));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // ekrandan çıkınca animasyonu durdur
    const io = new IntersectionObserver(([e]) => (s.current.visible = e.isIntersecting));
    if (stageRef.current) io.observe(stageRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [apply]);

  const snapTo = (targetRy: number) => {
    const st = s.current;
    const cube = cubeRef.current;
    if (!cube) return;
    // en kısa yoldan dön
    const delta = ((((targetRy - st.ry) % 360) + 540) % 360) - 180;
    st.vy = 0;
    st.vx = 0;
    st.ry += delta;
    st.rx = REST_RX;
    st.pauseUntil = performance.now() + 5000;
    cube.style.transition = "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
    apply();
    window.setTimeout(() => {
      if (cubeRef.current) cubeRef.current.style.transition = "";
    }, 900);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const st = s.current;
    st.dragging = true;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    st.vx = st.vy = 0;
    if (cubeRef.current) cubeRef.current.style.transition = "";
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setHinted(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.dragging) return;
    const dx = e.clientX - st.lastX;
    const dy = e.clientY - st.lastY;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    st.ry += dx * 0.45;
    st.rx = Math.max(-65, Math.min(65, st.rx - dy * 0.35));
    st.vy = dx * 0.45;
    st.vx = -dy * 0.2;
    apply();
  };
  const onPointerUp = () => {
    s.current.dragging = false;
    s.current.pauseUntil = performance.now() + 2500;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 90 : -90;
    snapTo(Math.round(s.current.ry / 90) * 90 + step);
    setHinted(true);
  };

  const dots = (n: number) => (
    <span className="tracking-[0.15em]" aria-label={fmt(t.box.dots, { n })}>
      {"●".repeat(n)}
      <span className="opacity-35">{"●".repeat(5 - n)}</span>
    </span>
  );

  const vars = {
    // mobilde kutu + perspektif payı (×1.5) ekrana sığsın
    "--w": pouch ? "min(56vw, 290px)" : "min(60vw, 330px)",
    "--h": `calc(var(--w) / ${aspect})`,
    "--d": pouch ? "calc(var(--w) * 0.13)" : "calc(var(--w) * 0.5)",
  } as React.CSSProperties;

  const sideBg = pouch
    ? { background: "linear-gradient(90deg,#e9e9e6,#fafaf8 40%,#dededb)" }
    : { backgroundImage: "url(/coffees/texture-watercolor.webp)", backgroundSize: "cover" };

  const labelRows: [string, React.ReactNode][] = [
    [upper(fmt(t.box.roast, { roast: t.roast[product.roastLevel] ?? product.roastLevel })), dots(ROAST_DOTS[product.roastLevel])],
    ...(product.sensory
      ? ([
          [t.box.body, dots(product.sensory.body)],
          [t.box.acidity, dots(product.sensory.acidity)],
          [t.box.sweetness, dots(product.sensory.sweetness)],
        ] as [string, React.ReactNode][])
      : []),
    ...(product.elevation ? ([[t.box.altitude, product.elevation]] as [string, React.ReactNode][]) : []),
    [t.box.process, product.process.split("(")[0].split("·")[0].trim()],
    ...(product.origin.producer ? ([[t.box.producer, product.origin.producer]] as [string, React.ReactNode][]) : []),
    ...(product.origin.farm ? ([[t.box.farm, product.origin.farm]] as [string, React.ReactNode][]) : []),
    [t.box.origin, upper(product.origin.country)],
    ...(product.score ? ([["SCA", fmt(t.box.points, { n: product.score })]] as [string, React.ReactNode][]) : []),
  ];

  return (
    <div className={`flex w-full min-w-0 flex-col items-center ${className}`}>
      <div
        ref={stageRef}
        role="img"
        tabIndex={0}
        aria-label={fmt(t.box.aria, { name: product.fullName })}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={() => (s.current.hover = true)}
        onPointerLeave={() => (s.current.hover = false)}
        onKeyDown={onKeyDown}
        className="relative flex w-full max-w-[calc(var(--w)*1.5)] cursor-grab touch-pan-y select-none items-center justify-center outline-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-flores-400 lg:w-[calc(var(--w)*1.5)]"
        style={{ ...vars, height: "calc(var(--h) * 1.55)", perspective: "1300px" }}
      >
        {/* zemin gölgesi */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl"
          style={{ bottom: "4%", width: "calc(var(--w) * 1.1)", height: "calc(var(--d) * 0.5 + 24px)" }}
        />

        <div ref={cubeRef} className="relative size-0 [transform-style:preserve-3d]" style={{ transform: `rotateX(${REST_RX}deg) rotateY(-32deg)` }}>
          {/* ÖN */}
          <Face w="var(--w)" h="var(--h)" t="translateZ(calc(var(--d) / 2))">
            <Image
              src={product.image.front}
              alt=""
              fill
              sizes="330px"
              preload
              quality={85}
              draggable={false}
              className="pointer-events-none object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14),transparent_45%,rgba(0,0,0,0.12))]" />
            {product.soldOut && (
              <span className="absolute left-3 top-3 -rotate-6 rounded-sm border-2 border-white/90 bg-black/55 px-2 py-1 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-sm">
                {t.box.soldOut}
              </span>
            )}
          </Face>

          {/* ARKA — gerçek kutudaki gibi: büyük logo, QR (bu kahvenin sayfası), web adresi ve Instagram */}
          {!pouch ? (
            <Face w="var(--w)" h="var(--h)" t="rotateY(180deg) translateZ(calc(var(--d) / 2))" style={sideBg}>
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(205deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.55)_24%,transparent_46%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3%] pt-[6%]">
                <Image src="/logo.webp" alt="" width={84} height={84} className="w-[26%] brightness-0 invert" draggable={false} />
                {product.qr && (
                  // eslint-disable-next-line @next/next/no-img-element -- sunucuda üretilen QR (data URI)
                  <img src={product.qr} alt={fmt(t.box.qrAlt, { name: product.fullName })} className="mt-[3%] w-[17%]" draggable={false} />
                )}
                <p className="mt-[2%] text-[11px] font-medium tracking-wide text-white">www.floresroastery.com</p>
                <p className="text-[10px] tracking-wide text-white/90">@floresroastery</p>
              </div>
            </Face>
          ) : (
          <Face w="var(--w)" h="var(--h)" t="rotateY(180deg) translateZ(calc(var(--d) / 2))" style={sideBg}>
            <div className="absolute inset-[7%] flex flex-col bg-white/92 p-[6%] text-[#1f4f86]">
              <p className="font-mono text-[9px] tracking-[0.25em] text-[#1f4f86]/70">FLORES ROASTERY</p>
              <p className="mt-2 font-serif text-[22px] italic leading-none text-[#173f6d]">{product.name}</p>
              <p className="mt-1 font-mono text-[9px] tracking-[0.18em]">{upper(`${product.origin.country} · ${product.origin.region}`)}</p>
              <div className="my-3 h-px bg-[#1f4f86]/25" />
              <p className="font-mono text-[8px] tracking-[0.25em] text-[#1f4f86]/70">{t.box.notes}</p>
              <p className="mt-1 text-[12px] font-medium leading-snug">{product.notes.join(" · ")}</p>
              <p className="mt-3 font-mono text-[8px] tracking-[0.25em] text-[#1f4f86]/70">{t.box.recommended}</p>
              <p className="mt-1 text-[11px] leading-snug">{product.recommendedFor}</p>
              <div className="mt-auto flex items-end justify-between">
                <p className="max-w-[60%] font-serif text-[11px] italic leading-tight">Where every bean has a story</p>
                {/* dekoratif barkod */}
                <div aria-hidden className="flex h-7 items-end gap-[1.5px]">
                  {Array.from({ length: 22 }, (_, i) => (
                    <span key={i} className="block h-full bg-[#173f6d]" style={{ width: (i * 7) % 3 === 0 ? 2 : 1 }} />
                  ))}
                </div>
              </div>
            </div>
          </Face>
          )}

          {/* SAĞ — künye etiketi */}
          <Face w="var(--d)" h="var(--h)" t="rotateY(90deg) translateZ(calc(var(--w) / 2))" style={sideBg}>
            <div aria-hidden className="absolute inset-0 bg-black/10" />
            {pouch ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rotate-90 whitespace-nowrap font-mono text-[9px] tracking-[0.35em] text-black/50">FLORES ROASTERY</span>
              </div>
            ) : (
              <div className="absolute inset-x-[8%] top-[7%] bg-[#4c9fdc] p-[7%] font-mono text-[8px] leading-tight text-white shadow-sm">
                {labelRows.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-2 border-b border-white/25 py-[3px] last:border-0">
                    <span className="shrink-0 tracking-[0.12em]">{k}</span>
                    <span className="truncate text-right">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {!pouch && (
              <p className="absolute bottom-[8%] left-[8%] right-[8%] text-[9px] leading-snug text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
                Flores Roastery
                <br />
                <span className="font-serif text-[11px] italic">Where every bean has a story</span>
              </p>
            )}
          </Face>

          {/* SOL — künyenin tam karşısı: yalnızca slogan (gerçek kutudaki gibi) */}
          <Face w="var(--d)" h="var(--h)" t="rotateY(-90deg) translateZ(calc(var(--w) / 2))" style={sideBg}>
            {pouch ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/logo.webp" alt="" width={24} height={24} draggable={false} />
              </div>
            ) : (
              <>
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.45)_30%,transparent_52%)]" />
                <p className="absolute inset-x-[9%] top-[50%] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.25)]">
                  <span className="block text-[9px] tracking-wide opacity-90">Flores Roastery</span>
                  <span className="block text-[11px] font-medium leading-snug">Where every bean has a story</span>
                </p>
              </>
            )}
          </Face>

          {/* ÜST */}
          <Face w="var(--w)" h="var(--d)" t="rotateX(90deg) translateZ(calc(var(--h) / 2))" style={sideBg}>
            <div aria-hidden className="absolute inset-0 bg-white/10" />
            {!pouch && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/logo.webp" alt="" width={36} height={36} className="brightness-0 invert" draggable={false} />
              </div>
            )}
          </Face>

          {/* ALT */}
          <Face w="var(--w)" h="var(--d)" t="rotateX(-90deg) translateZ(calc(var(--h) / 2))" style={{ background: pouch ? "#cfcfcc" : "#21456e" }} />
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center gap-3">
        <div className="flex gap-1.5" role="group" aria-label={t.box.faces}>
          {FACES.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                snapTo(f.ry);
                setHinted(true);
              }}
              aria-pressed={activeFace === f.key}
              className={`rounded-full border px-3.5 py-1.5 text-[0.7rem] font-medium tracking-wide transition-colors ${
                activeFace === f.key ? "border-flores-400 bg-flores-500/15 text-flores-200" : "border-ink-600 text-cream-400 hover:border-cream-400 hover:text-cream-100"
              }`}
            >
              {t.box[f.label]}
            </button>
          ))}
        </div>
        <p className={`flex items-center gap-2 text-xs text-cream-500 transition-opacity duration-700 ${hinted ? "opacity-0" : "opacity-100"}`} aria-hidden>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
            <path d="M18 3v4h-4M6 21v-4h4" />
          </svg>
          {t.box.hint}
        </p>
      </div>
    </div>
  );
}

function Face({ w, h, t, style, children }: { w: string; h: string; t: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <div
      className="absolute left-0 top-0 overflow-hidden [backface-visibility:hidden]"
      style={{ width: w, height: h, transform: `translate(-50%, -50%) ${t}`, ...style }}
    >
      {children}
    </div>
  );
}
