"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/i18n/link";

/**
 * Kaydırmaya bağlı kutu sahnesi (Apple tarzı): bölüm ekrana yapışır, kaydırdıkça kare dizisi
 * ilerler — kamera önden tepeye geçer, kapak açılır, çekirdekler görünür. Yukarı kaydırınca geri sarar.
 * Kareler public/video/box-scroll/{lg|sm}-NNN.webp; hareket azaltma tercihinde son kare sabit gösterilir.
 */
const FRAMES = 185;
const SRC_W = 1280;
const SRC_H = 720;
const BOX_W = 430;
const BOX_H = 400;

export type BoxScrollText = {
  eyebrow: string;
  brand: string;
  intro: string;
  roastEyebrow: string;
  roastTitle: string;
  roastText: string;
  finalTitle: string;
  cta: string;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** a–b aralığında görünür; kenarlarda yumuşak giriş/çıkış */
const band = (p: number, a: number, b: number, edge = 0.07) =>
  clamp(Math.min((p - a) / edge + (a <= 0 ? 1 : 0), (b - p) / edge + (b >= 1 ? 1 : 0)));

/** heading: sayfanın en üstündeyse marka adı h1 olur (SEO için tek h1) */
export function BoxScroll({ text, heading = false }: { text: BoxScrollText; heading?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const [p, setP] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = window.innerWidth < 768 ? "sm" : "lg";
    const url = (i: number) => `/video/box-scroll/${set}-${String(i + 1).padStart(3, "0")}.webp`;
    let progress = reduce ? 1 : 0;
    let raf = 0;
    let disposed = false;

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < FRAMES; d++) {
        if (images.current[i - d]) return images.current[i - d];
        if (images.current[i + d]) return images.current[i + d];
      }
      return null;
    };

    const draw = () => {
      raf = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      // kutunun hareketi ilk ve son %8'de beklesin ki yazılar okunsun
      const t = clamp((progress - 0.08) / 0.8);
      const img = nearestLoaded(Math.round(t * (FRAMES - 1)));
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (!img) return;
      // kutu kaynakta ~430×400 px: bilgisayarda ekran genişliğinin ~%30'u (yazılara yer kalsın),
      // telefonda ~%75'i; yükseklikte ekranın yarısını geçmesin
      const scale = Math.min((w < 768 ? w * 0.7 : w * 0.3) / BOX_W, (h * 0.55) / BOX_H) * dpr;
      const dw = SRC_W * scale;
      const dh = SRC_H * scale;
      const x = (canvas.width - dw) / 2;
      // telefonda kutu biraz yukarıda: alttaki yazılar kutunun üstüne binmesin
      const y = (canvas.height - dh) / 2 - (w < 768 ? h * 0.04 * dpr : 0);
      ctx.drawImage(img, x, y, dw, dh);
      // karenin kenarlarını zemine erit (dikiş görünmesin)
      const f = Math.min(dw, dh) * 0.28;
      const edge = (x0: number, y0: number, x1: number, y1: number, rx: number, ry: number, rw: number, rh: number) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, "rgba(10,10,10,1)");
        g.addColorStop(1, "rgba(10,10,10,0)");
        ctx.fillStyle = g;
        ctx.fillRect(rx, ry, rw, rh);
      };
      edge(x, 0, x + f, 0, x, y, f, dh);
      edge(x + dw, 0, x + dw - f, 0, x + dw - f, y, f, dh);
      edge(0, y, 0, y + f, x, y, dw, f);
      edge(0, y + dh, 0, y + dh - f, x, y + dh - f, dw, f);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (images.current[i]) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          images.current[i] = img;
          schedule();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = url(i);
      });

    (async () => {
      if (reduce) {
        setStill(true);
        setP(1);
        await load(FRAMES - 1);
        return;
      }
      await load(0);
      // önce seyrek kareler (hızlı kaba önizleme), sonra aradakiler
      for (const step of [8, 4, 2, 1]) {
        const batch: Promise<void>[] = [];
        for (let i = 0; i < FRAMES; i += step) if (!images.current[i]) batch.push(load(i));
        await Promise.all(batch);
        if (disposed) return;
      }
    })();

    const onScroll = () => {
      if (reduce) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      progress = clamp(-rect.top / total);
      setP(progress);
      schedule();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const a = still ? 0 : band(p, 0, 0.3);
  const b = still ? 0 : band(p, 0.36, 0.66);
  const c = still ? 1 : band(p, 0.74, 1);
  const lift = (o: number) => ({ opacity: o, transform: `translateY(${(1 - o) * 24}px)` });

  return (
    <section ref={sectionRef} className={still ? "relative h-svh" : "relative h-[360vh]"} aria-label={text.brand}>
      <div className="sticky top-0 h-svh overflow-hidden bg-ink-950">
        <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />
        {/* kenarları sitenin zeminine erit */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,transparent_55%,#0a0a0a_100%)]" />

        <div className="relative mx-auto grid h-full max-w-[1440px] grid-cols-1 px-5 md:grid-cols-[1fr_minmax(0,34%)_1fr] md:px-10">
          {/* 1 — sol: marka; sağ: kısa giriş */}
          <div className="pointer-events-none absolute inset-x-5 top-28 text-center md:static md:flex md:flex-col md:justify-center md:text-left" style={lift(a)}>
            <p className="eyebrow text-flores-300">{text.eyebrow}</p>
            {heading ? (
              <h1 className="mt-3 font-serif text-[clamp(3.5rem,9vw,9rem)] font-normal leading-none text-cream-50">
                {text.brand}
                <span className="sr-only"> Roastery — {text.eyebrow}</span>
              </h1>
            ) : (
              <p className="mt-3 font-serif text-[clamp(3.5rem,9vw,9rem)] leading-none text-cream-50">{text.brand}</p>
            )}
          </div>
          <div className="hidden md:block" />
          <div className="pointer-events-none absolute inset-x-5 bottom-16 text-center md:static md:flex md:flex-col md:justify-center md:pl-8 md:text-left" style={lift(a)}>
            <p className="mx-auto max-w-xs text-lg text-cream-200 md:mx-0">{text.intro}</p>
          </div>
        </div>

        {/* 2 — sağ: kavurma */}
        <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1440px] items-end justify-center px-5 pb-8 md:items-center md:justify-end md:px-10 md:pb-0" style={lift(b)}>
          <div className="max-w-sm text-center [text-shadow:0_2px_18px_rgba(0,0,0,0.85)] md:w-[28%] md:text-left">
            <p className="eyebrow text-flores-300">{text.roastEyebrow}</p>
            <p className="mt-3 font-serif text-4xl leading-tight text-cream-50 md:text-5xl">{text.roastTitle}</p>
            <p className="mt-4 text-cream-300">{text.roastText}</p>
          </div>
        </div>

        {/* 3 — orta alt: kapanış + buton */}
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center px-5 text-center md:bottom-14" style={{ ...lift(c), pointerEvents: c > 0.5 ? "auto" : "none" }}>
          <p className="max-w-3xl font-serif text-[clamp(2rem,4.5vw,4rem)] leading-tight text-cream-50 [text-shadow:0_2px_24px_rgba(0,0,0,0.8)]">{text.finalTitle}</p>
          <Link href="/kahveler" className="btn btn-primary mt-6">
            {text.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
