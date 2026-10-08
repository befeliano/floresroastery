"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { postJson } from "@/lib/api-client";

export function StockAlertForm({ slug }: { slug: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<{ kind: "idle" | "loading" | "ok" | "error"; message?: string }>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ kind: "loading" });
    try {
      const data = await postJson("/api/stock-alert", { slug, email: new FormData(form).get("email") });
      setState({ kind: "ok", message: data.message });
      form.reset();
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6" noValidate>
      <label htmlFor="stock-email" className="sr-only">
        {t.common.yourEmail}
      </label>
      <div className="flex gap-2">
        <input id="stock-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder={t.common.yourEmail} className="field" />
        <button type="submit" disabled={state.kind === "loading"} className="btn btn-primary shrink-0 px-5">
          {state.kind === "loading" ? "…" : t.product.notify}
        </button>
      </div>
      <p role="status" className={`mt-2 min-h-5 text-sm ${state.kind === "error" ? "text-red-300" : "text-flores-300"}`}>
        {state.message}
      </p>
    </form>
  );
}
