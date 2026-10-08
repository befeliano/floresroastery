"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { postJson } from "@/lib/api-client";

type Status = { kind: "idle" | "loading" | "ok" | "error"; message?: string };

export function NewsletterForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setStatus({ kind: "loading" });
    try {
      const data = await postJson("/api/newsletter", { email });
      setStatus({ kind: "ok", message: data.message });
      form.reset();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : t.common.genericError });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-lg" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        {t.common.yourEmail}
      </label>
      <div className="flex border-b border-cream-50/30 focus-within:border-flores-400">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder={t.common.yourEmail}
          className="w-full bg-transparent py-4 text-base text-cream-50 placeholder:text-cream-500 focus:outline-none"
        />
        <button type="submit" disabled={status.kind === "loading"} className="eyebrow shrink-0 px-2 text-flores-300 transition-colors hover:text-flores-200 disabled:opacity-50">
          {status.kind === "loading" ? t.forms.newsletterSending : t.forms.newsletterJoin}
        </button>
      </div>
      <p role="status" className={`mt-3 min-h-5 text-sm ${status.kind === "error" ? "text-red-300" : "text-flores-300"}`}>
        {status.message}
      </p>
    </form>
  );
}
