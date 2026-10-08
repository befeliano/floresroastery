"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Kuban kavurucumuzun soğutma tepsisinden döngü video.
 * Hareket azaltma tercihi veya veri tasarrufu modunda yalnızca poster gösterilir;
 * sekme arka plandayken / hero ekrandan çıkınca video duraklatılır.
 */
export function HeroVideo({ className = "", base = "/video/roastery" }: { className?: string; base?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- tarayıcı tercihine göre tek seferlik karar
      setAllowed(false);
      return;
    }
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? void video.play().catch(() => {}) : video.pause()));
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={`${base}-poster.jpg`}
      autoPlay={allowed}
      muted
      loop
      playsInline
      preload={allowed ? "auto" : "none"}
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
    >
      {allowed && (
        <>
          <source src={`${base}-1080.mp4`} type="video/mp4" media="(min-width: 1024px)" />
          <source src={`${base}-720.mp4`} type="video/mp4" />
        </>
      )}
    </video>
  );
}
