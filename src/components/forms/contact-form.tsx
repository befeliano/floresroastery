"use client";

import Link from "next/link";
import { useApiForm } from "./use-api-form";

const SUBJECTS = ["Sipariş", "Ürün & demleme", "Toptan satış", "Coffee Bar", "Diğer"];

export function ContactForm() {
  const { state, submit } = useApiForm("/api/contact");

  if (state.kind === "ok") {
    return (
      <div role="status" className="rounded-sm border border-flores-500/40 bg-flores-500/5 p-8">
        <p className="font-serif text-3xl">Teşekkürler!</p>
        <p className="mt-3 text-cream-200">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        void submit({
          name: f.get("name"),
          email: f.get("email"),
          subject: f.get("subject"),
          message: f.get("message"),
          website: f.get("website"),
          kvkk: f.get("kvkk") === "on",
        });
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      {/* bal küpü — gerçek kullanıcılar görmez */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-website">Web sitesi</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="c-name" className="mb-2 block text-sm text-cream-300">
          Ad soyad
        </label>
        <input id="c-name" name="name" required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="c-mail" className="mb-2 block text-sm text-cream-300">
          E-posta
        </label>
        <input id="c-mail" name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-subject" className="mb-2 block text-sm text-cream-300">
          Konu
        </label>
        <select id="c-subject" name="subject" className="field">
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-msg" className="mb-2 block text-sm text-cream-300">
          Mesajınız
        </label>
        <textarea id="c-msg" name="message" required rows={6} maxLength={3000} className="field resize-y" />
      </div>
      <label className="flex items-start gap-3 text-sm text-cream-300 sm:col-span-2">
        <input type="checkbox" name="kvkk" className="mt-0.5 size-5 shrink-0 accent-[#5fa4d6]" />
        <span>
          Bilgilerimin talebime yanıt verilmesi amacıyla{" "}
          <Link href="/kvkk-aydinlatma-metni" target="_blank" className="text-flores-300 underline underline-offset-4">
            KVKK Aydınlatma Metni
          </Link>{" "}
          kapsamında işlenmesini okudum.
        </span>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" disabled={state.kind === "loading"} className="btn btn-primary">
          {state.kind === "loading" ? "Gönderiliyor…" : "Gönder"}
        </button>
        {state.kind === "error" && (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
