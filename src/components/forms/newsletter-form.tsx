"use client";

import { useState } from "react";

type Status = { kind: "idle" | "loading" | "ok" | "error"; message?: string };

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Bir sorun oluştu.");
      setStatus({ kind: "ok", message: data.message });
      form.reset();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Bir sorun oluştu." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-lg" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        E-posta adresiniz
      </label>
      <div className="flex border-b border-cream-50/30 focus-within:border-flores-400">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="E-posta adresiniz"
          className="w-full bg-transparent py-4 text-base text-cream-50 placeholder:text-cream-500 focus:outline-none"
        />
        <button type="submit" disabled={status.kind === "loading"} className="eyebrow shrink-0 px-2 text-flores-300 transition-colors hover:text-flores-200 disabled:opacity-50">
          {status.kind === "loading" ? "Gönderiliyor" : "Katıl →"}
        </button>
      </div>
      <p role="status" className={`mt-3 min-h-5 text-sm ${status.kind === "error" ? "text-red-300" : "text-flores-300"}`}>
        {status.message}
      </p>
    </form>
  );
}
