"use client";

import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
type Text = { install: string; installText: string; iosHint: string; installButton: string };

/**
 * Demleme rehberini telefona "uygulama" olarak ekleme kartı + servis çalışanı kaydı (yalnızca production).
 * Android/Chrome'da yerleşik kurulum penceresi açılır; iPhone'da Paylaş → Ana Ekrana Ekle ipucu gösterilir.
 */
export function PwaInstall({ text }: { text: Text }) {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tarayıcı özellikleri yalnızca istemcide okunabilir
    setInstalled(!!standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!prompt && !ios)) return null;

  return (
    <div className="rounded-sm border border-flores-500/40 bg-flores-500/5 p-5">
      <p className="font-serif text-2xl">{text.install}</p>
      <p className="mt-2 text-sm text-cream-300">{text.installText}</p>
      {prompt ? (
        <button
          type="button"
          onClick={async () => {
            await prompt.prompt();
            setPrompt(null);
          }}
          className="btn btn-primary mt-4"
        >
          {text.installButton}
        </button>
      ) : (
        <p className="mt-3 text-sm text-flores-200">{text.iosHint}</p>
      )}
    </div>
  );
}
