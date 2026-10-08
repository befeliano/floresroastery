"use client";

import Link from "next/link";
import { useRef } from "react";
import { BUSINESS_TYPES, MONTHLY_VOLUMES, PRIVATE_LABEL } from "@/content/wholesale";
import { useApiForm } from "./use-api-form";

export function WholesaleQuoteForm({ whatsapp }: { whatsapp: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { state, submit } = useApiForm("/api/wholesale-quote");

  const read = () => {
    const f = new FormData(formRef.current!);
    return {
      name: String(f.get("name") ?? ""),
      business: String(f.get("business") ?? ""),
      email: String(f.get("email") ?? ""),
      phone: String(f.get("phone") ?? ""),
      type: String(f.get("type") ?? ""),
      volume: String(f.get("volume") ?? ""),
      privateLabel: String(f.get("privateLabel") ?? ""),
      notes: String(f.get("notes") ?? ""),
      website: String(f.get("website") ?? ""),
      kvkk: f.get("kvkk") === "on",
    };
  };

  const sendWhatsapp = () => {
    const d = read();
    const text = [
      "Merhaba, Flores toptan teklifi almak istiyorum.",
      d.name && `Ad Soyad: ${d.name}`,
      d.business && `İşletme: ${d.business}`,
      d.type && `İşletme türü: ${d.type}`,
      d.volume && `Tahmini aylık miktar: ${d.volume}`,
      d.privateLabel && `Private label: ${d.privateLabel}`,
      d.notes && `Not: ${d.notes}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  if (state.kind === "ok") {
    return (
      <div role="status" className="rounded-sm border border-flores-500/40 bg-flores-500/5 p-8">
        <p className="font-serif text-3xl">Talebiniz alındı!</p>
        <p className="mt-3 text-cream-200">{state.message}</p>
      </div>
    );
  }

  const label = "mb-2 block text-sm text-cream-300";
  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit(read());
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="w-website">Web sitesi</label>
        <input id="w-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="w-name" className={label}>
          Ad soyad *
        </label>
        <input id="w-name" name="name" required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="w-business" className={label}>
          İşletme adı *
        </label>
        <input id="w-business" name="business" required maxLength={120} autoComplete="organization" className="field" />
      </div>
      <div>
        <label htmlFor="w-mail" className={label}>
          E-posta *
        </label>
        <input id="w-mail" name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="w-tel" className={label}>
          Telefon
        </label>
        <input id="w-tel" name="phone" type="tel" maxLength={20} autoComplete="tel" placeholder="05XX XXX XX XX" className="field" />
      </div>
      <div>
        <label htmlFor="w-type" className={label}>
          İşletme türü
        </label>
        <select id="w-type" name="type" defaultValue="" className="field">
          <option value="">Seçin</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="w-volume" className={label}>
          Tahmini aylık miktar
        </label>
        <select id="w-volume" name="volume" defaultValue="" className="field">
          <option value="">Seçin</option>
          {MONTHLY_VOLUMES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="w-pl" className={label}>
          Private label ilgisi
        </label>
        <select id="w-pl" name="privateLabel" defaultValue={PRIVATE_LABEL[0]} className="field">
          {PRIVATE_LABEL.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="w-notes" className={label}>
          Ek notlar
        </label>
        <textarea id="w-notes" name="notes" rows={4} maxLength={2000} className="field resize-y" />
      </div>
      <label className="flex items-start gap-3 text-sm text-cream-300 sm:col-span-2">
        <input type="checkbox" name="kvkk" className="mt-0.5 size-5 shrink-0 accent-[#5fa4d6]" />
        <span>
          Bilgilerimin yalnızca teklif hazırlamak amacıyla{" "}
          <Link href="/kvkk-aydinlatma-metni" target="_blank" className="text-flores-300 underline underline-offset-4">
            KVKK Aydınlatma Metni
          </Link>{" "}
          kapsamında işlenmesini okudum.
        </span>
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={state.kind === "loading"} className="btn btn-primary">
          {state.kind === "loading" ? "Gönderiliyor…" : "Teklif iste"}
        </button>
        <span className="text-sm text-cream-500">veya</span>
        <button type="button" onClick={sendWhatsapp} className="btn btn-ghost">
          WhatsApp&apos;tan gönder
        </button>
      </div>
      {state.kind === "error" && (
        <p role="alert" className="text-sm text-red-300 sm:col-span-2">
          {state.message}
        </p>
      )}
    </form>
  );
}
