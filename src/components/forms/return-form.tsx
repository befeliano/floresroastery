"use client";

import Link from "next/link";
import { RETURN_REASONS } from "@/lib/orders/constants";
import { useApiForm } from "./use-api-form";

export function ReturnForm() {
  const { state, submit } = useApiForm<{ id: string; message: string }>("/api/returns");

  if (state.kind === "ok") {
    return (
      <div role="status" className="rounded-sm border border-flores-500/40 bg-flores-500/5 p-8">
        <p className="font-serif text-3xl">Talebiniz alındı</p>
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
          orderNumber: f.get("orderNumber"),
          name: f.get("name"),
          email: f.get("email"),
          phone: f.get("phone") || undefined,
          reason: f.get("reason"),
          details: f.get("details"),
          kvkk: f.get("kvkk") === "on",
        });
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="r-no" className="mb-2 block text-sm text-cream-300">
          Sipariş numarası
        </label>
        <input id="r-no" name="orderNumber" required maxLength={30} className="field font-mono uppercase" placeholder="FR-261008-1234" />
      </div>
      <div>
        <label htmlFor="r-name" className="mb-2 block text-sm text-cream-300">
          Ad soyad
        </label>
        <input id="r-name" name="name" required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="r-mail" className="mb-2 block text-sm text-cream-300">
          E-posta
        </label>
        <input id="r-mail" name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="r-tel" className="mb-2 block text-sm text-cream-300">
          Telefon (isteğe bağlı)
        </label>
        <input id="r-tel" name="phone" type="tel" maxLength={20} autoComplete="tel" placeholder="05XX XXX XX XX" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="r-reason" className="mb-2 block text-sm text-cream-300">
          İade nedeni
        </label>
        <select id="r-reason" name="reason" required defaultValue="" className="field">
          <option value="" disabled>
            Seçin
          </option>
          {RETURN_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="r-details" className="mb-2 block text-sm text-cream-300">
          Açıklama — iade etmek istediğiniz ürün(ler) ve varsa hasar detayı
        </label>
        <textarea id="r-details" name="details" rows={5} maxLength={2000} className="field resize-y" />
      </div>
      <label className="flex items-start gap-3 text-sm text-cream-300 sm:col-span-2">
        <input type="checkbox" name="kvkk" className="mt-0.5 size-5 shrink-0 accent-[#5fa4d6]" />
        <span>
          Bilgilerimin talebimin işlenmesi amacıyla{" "}
          <Link href="/kvkk-aydinlatma-metni" target="_blank" className="text-flores-300 underline underline-offset-4">
            KVKK Aydınlatma Metni
          </Link>{" "}
          kapsamında işlenmesini okudum.
        </span>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" disabled={state.kind === "loading"} className="btn btn-primary">
          {state.kind === "loading" ? "Gönderiliyor…" : "İade talebini gönder"}
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
