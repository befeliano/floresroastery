"use client";

import { useI18n } from "@/i18n/client";
import { formatPrice } from "@/lib/format";
import { useApiForm } from "./use-api-form";

type Result = {
  message?: string;
  number: string;
  createdAt: string;
  statusLabel: string;
  status: string;
  paymentMethod: "bacs" | "iyzico";
  paymentUrl?: string;
  shippingLabel?: string;
  lines: { name: string; variantLabel: string; grind: string; quantity: number; lineTotal: number }[];
  total: number;
};

const STEPS = ["awaiting-payment", "processing", "shipped", "delivered"];

export function OrderLookupForm() {
  const { state, submit } = useApiForm<Result>("/api/orders/lookup");
  const { t, intl, tApi, grind } = useI18n();
  const STEP_LABEL = [t.lookup.steps.received, t.lookup.steps.roasting, t.lookup.steps.shipped, t.lookup.steps.delivered];
  const statusLabel = (r: Result) => (r.statusLabel === "Tamamlandı" ? t.status.completed : (t.status[r.status as keyof typeof t.status] ?? r.statusLabel));

  return (
    <div className="grid gap-12 lg:grid-cols-[24rem_1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          void submit({ orderNumber: f.get("orderNumber"), email: f.get("email") });
        }}
        className="space-y-5 self-start rounded-sm border border-ink-700 bg-ink-900 p-6"
      >
        <div>
          <label htmlFor="ol-no" className="mb-2 block text-sm text-cream-300">
            {t.lookup.number}
          </label>
          <input id="ol-no" name="orderNumber" required maxLength={30} placeholder="FR-261008-1234" className="field font-mono uppercase" />
        </div>
        <div>
          <label htmlFor="ol-mail" className="mb-2 block text-sm text-cream-300">
            {t.lookup.email}
          </label>
          <input id="ol-mail" name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
        </div>
        <button type="submit" disabled={state.kind === "loading"} className="btn btn-primary w-full">
          {state.kind === "loading" ? t.lookup.searching : t.lookup.find}
        </button>
        {state.kind === "error" && (
          <p role="alert" className="text-sm text-red-300">
            {state.message}
          </p>
        )}
      </form>

      <div aria-live="polite">
        {state.kind === "ok" ? (
          <div>
            <p className="eyebrow text-flores-400">{new Intl.DateTimeFormat(intl, { dateStyle: "long" }).format(new Date(state.data.createdAt))}</p>
            <h2 className="mt-3 font-mono text-3xl">{state.data.number}</h2>
            <p className="mt-2 text-cream-300">
              {t.lookup.status}: <span className="text-cream-50">{statusLabel(state.data)}</span> · {t.payment[state.data.paymentMethod]}
            </p>
            {state.data.status !== "cancelled" && (
              <ol className="mt-8 grid grid-cols-4 gap-2">
                {STEP_LABEL.map((label, i) => {
                  const done = i <= STEPS.indexOf(state.data.status);
                  return (
                    <li key={label} className="text-xs">
                      <span className={`block h-1 rounded-full ${done ? "bg-flores-500" : "bg-ink-700"}`} />
                      <span className={`mt-2 block ${done ? "text-cream-100" : "text-cream-500"}`}>{label}</span>
                    </li>
                  );
                })}
              </ol>
            )}
            <ul className="mt-8 divide-y divide-ink-700 border-y border-ink-700">
              {state.data.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-3 text-sm">
                  <span>
                    {l.quantity} × {l.name}{" "}
                    {[l.variantLabel, l.grind].filter(Boolean).length > 0 && (
                      <span className="text-cream-500">({[l.variantLabel, l.grind && grind(l.grind)].filter(Boolean).join(", ")})</span>
                    )}
                  </span>
                  <span className="font-mono">{formatPrice(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between text-sm text-cream-400">
              <span>{state.data.shippingLabel ? tApi(state.data.shippingLabel) : t.common.shipping}</span>
              <span className="font-mono text-lg text-cream-50">{formatPrice(state.data.total)}</span>
            </p>
            {state.data.paymentUrl && (
              <a href={state.data.paymentUrl} className="btn btn-primary mt-6">
                {t.common.completePayment}
              </a>
            )}
          </div>
        ) : (
          <p className="max-w-md text-cream-400">{t.lookup.help}</p>
        )}
      </div>
    </div>
  );
}
