"use client";

import Link from "@/i18n/link";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { openMailto } from "@/lib/mailto";

/** Teklif formu — e-posta uygulamasında info@floresroastery.com'a hazır taslak açar (veya WhatsApp) */
export function WholesaleQuoteForm({ whatsapp, email }: { whatsapp: string; email: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const { t } = useI18n();
  const f = t.forms;
  const [kvkkBefore, kvkkAfter] = f.wsConsent.split("{kvkk}");

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
      f.wsWaIntro,
      d.name && `${f.wsWaName}: ${d.name}`,
      d.business && `${f.wsWaBusiness}: ${d.business}`,
      d.type && `${f.wsWaType}: ${d.type}`,
      d.volume && `${f.wsWaVolume}: ${d.volume}`,
      d.privateLabel && `Private label: ${d.privateLabel}`,
      d.notes && `${f.wsWaNote}: ${d.notes}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  if (state.kind === "ok") {
    return (
      <div role="status" className="rounded-sm border border-flores-500/40 bg-flores-500/5 p-8">
        <p className="font-serif text-3xl">{f.wsReceived}</p>
        <p className="mt-3 text-cream-200">{f.mailOpened.replace("{email}", email)}</p>
        <button type="button" onClick={() => setState({ kind: "idle" })} className="btn btn-ghost mt-6">
          {f.back}
        </button>
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
        const d = read();
        if (d.name.trim().length < 2 || d.business.trim().length < 2 || !d.email.includes("@")) return setState({ kind: "error", message: f.fillRequired });
        if (!d.kvkk) return setState({ kind: "error", message: f.kvkkRequired });
        openMailto(email, `[Flores Toptan] ${d.business} — ${d.name}`, [
          [f.wsWaName, d.name],
          [f.wsWaBusiness, d.business],
          [t.common.email, d.email],
          [t.common.phone, d.phone],
          [f.wsWaType, d.type],
          [f.wsWaVolume, d.volume],
          ["Private label", d.privateLabel],
          [f.wsWaNote, d.notes],
        ]);
        setState({ kind: "ok" });
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="w-website">{t.common.website}</label>
        <input id="w-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="w-name" className={label}>
          {f.wsName}
        </label>
        <input id="w-name" name="name" required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="w-business" className={label}>
          {f.wsBusiness}
        </label>
        <input id="w-business" name="business" required maxLength={120} autoComplete="organization" className="field" />
      </div>
      <div>
        <label htmlFor="w-mail" className={label}>
          {f.wsEmail}
        </label>
        <input id="w-mail" name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="w-tel" className={label}>
          {t.common.phone}
        </label>
        <input id="w-tel" name="phone" type="tel" maxLength={20} autoComplete="tel" placeholder="05XX XXX XX XX" className="field" />
      </div>
      <div>
        <label htmlFor="w-type" className={label}>
          {f.wsType}
        </label>
        <select id="w-type" name="type" defaultValue="" className="field">
          <option value="">{t.common.select}</option>
          {f.wsTypes.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="w-volume" className={label}>
          {f.wsVolume}
        </label>
        <select id="w-volume" name="volume" defaultValue="" className="field">
          <option value="">{t.common.select}</option>
          {f.wsVolumes.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="w-pl" className={label}>
          {f.wsPrivate}
        </label>
        <select id="w-pl" name="privateLabel" defaultValue={f.wsPrivateOptions[0]} className="field">
          {f.wsPrivateOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="w-notes" className={label}>
          {f.wsNotes}
        </label>
        <textarea id="w-notes" name="notes" rows={4} maxLength={2000} className="field resize-y" />
      </div>
      <label className="flex items-start gap-3 text-sm text-cream-300 sm:col-span-2">
        <input type="checkbox" name="kvkk" className="mt-0.5 size-5 shrink-0 accent-[#5fa4d6]" />
        <span>
          {kvkkBefore}
          <Link href="/kvkk-aydinlatma-metni" target="_blank" className="text-flores-300 underline underline-offset-4">
            {t.common.kvkk}
          </Link>
          {kvkkAfter}
        </span>
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" className="btn btn-primary">
          {f.wsSubmit}
        </button>
        <span className="text-sm text-cream-500">{t.common.or}</span>
        <button type="button" onClick={sendWhatsapp} className="btn btn-ghost">
          {f.wsWhatsapp}
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
