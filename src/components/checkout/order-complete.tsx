"use client";

import Link from "@/i18n/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/client";
import { formatPrice } from "@/lib/format";

const noopSubscribe = () => () => {};
const readLastOrder = () => {
  try {
    return sessionStorage.getItem("flores-last-order");
  } catch {
    return null;
  }
};

type LastOrder = {
  orderNumber: string;
  paymentMethod: "bacs" | "iyzico";
  total: number;
  subtotal: number;
  shipping: number;
  shippingLabel?: string;
  discount?: number;
  coupon?: string;
  email: string;
  lines: { name: string; variantLabel: string; grind: string; quantity: number; lineTotal: number }[];
};

/**
 * Sipariş özeti yalnızca bu tarayıcı oturumunda (sessionStorage) tutulur —
 * sipariş numarasıyla sunucudan kişisel veri çekilmez.
 */
export function OrderComplete({
  bank,
  phone,
  phoneHref,
  email,
}: {
  bank: { holder: string; name: string | null; iban: string | null };
  phone: string;
  phoneHref: string;
  email: string;
}) {
  const { t, fmt, tApi, grind } = useI18n();
  const o = t.orderComplete;
  // sunucuda undefined (iskelet), tarayıcıda sessionStorage değeri
  const raw = useSyncExternalStore(noopSubscribe, readLastOrder, () => undefined);
  const order = useMemo<LastOrder | null | undefined>(() => {
    if (raw === undefined) return undefined;
    try {
      return raw ? (JSON.parse(raw) as LastOrder) : null;
    } catch {
      return null;
    }
  }, [raw]);

  if (order === undefined) return <div className="h-96 animate-pulse rounded-sm bg-ink-900" />;

  if (order === null) {
    return (
      <div className="text-center">
        <h1 className="font-serif text-5xl">{o.notFound}</h1>
        <p className="mt-4 text-cream-300">{o.notFoundText}</p>
        <Link href="/siparis-takip" className="btn btn-primary mt-8">
          {t.common.orderTracking}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex size-16 items-center justify-center rounded-full bg-flores-500/15 text-flores-300">
        <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <p className="eyebrow mt-8 text-flores-400">{o.thanks}</p>
      <h1 className="mt-4 font-serif text-5xl md:text-6xl">{o.title}</h1>
      <p className="mt-5 text-lg text-cream-300">{fmt(o.text, { number: order.orderNumber, email: order.email })}</p>

      {order.paymentMethod === "iyzico" && <CardPaymentStatus orderNumber={order.orderNumber} email={order.email} />}

      {order.paymentMethod === "bacs" && (
        <section className="mt-10 rounded-sm border border-flores-500/40 bg-flores-500/5 p-6">
          <h2 className="font-serif text-2xl">{o.bacsTitle}</h2>
          <p className="mt-3 text-cream-200">{fmt(o.bacsText, { amount: formatPrice(order.total), number: order.orderNumber })}</p>
          {bank.iban ? (
            <dl className="mt-5 grid gap-2 font-mono text-sm">
              <div>
                {o.recipient}: {bank.holder}
              </div>
              {bank.name && (
                <div>
                  {o.bank}: {bank.name}
                </div>
              )}
              <div>IBAN: {bank.iban}</div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-cream-300">
              {o.ibanLater.split("{phone}")[0]}
              <a href={phoneHref} className="text-flores-300 underline underline-offset-4">
                {phone}
              </a>
              {o.ibanLater.split("{phone}")[1].split("{email}")[0]}
              <a href={`mailto:${email}`} className="text-flores-300 underline underline-offset-4">
                {email}
              </a>
              {o.ibanLater.split("{email}")[1]}
            </p>
          )}
        </section>
      )}

      <section className="mt-10">
        <h2 className="eyebrow text-cream-400">
          {o.summary} · {t.payment[order.paymentMethod]}
        </h2>
        <ul className="mt-4 divide-y divide-ink-700 border-y border-ink-700">
          {order.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-4 py-4">
              <div>
                <p>{l.name}</p>
                <p className="text-xs text-cream-400">
                  {l.quantity} × {l.variantLabel} · {grind(l.grind)}
                </p>
              </div>
              <p className="font-mono">{formatPrice(l.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-cream-400">{t.common.subtotal}</dt>
            <dd className="font-mono">{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount ? (
            <div className="flex justify-between text-flores-200">
              <dt>
                {t.checkout.couponDiscount}
                {order.coupon ? ` (${order.coupon.toUpperCase()})` : ""}
              </dt>
              <dd className="font-mono">−{formatPrice(order.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt className="text-cream-400">{order.shippingLabel ? tApi(order.shippingLabel) : t.common.shipping}</dt>
            <dd className="font-mono">{order.shipping ? formatPrice(order.shipping) : t.common.free}</dd>
          </div>
          <div className="flex justify-between pt-2 text-base">
            <dt>{t.common.total}</dt>
            <dd className="font-mono">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/siparis-takip" className="btn btn-ghost">
          {t.common.orderTracking}
        </Link>
        <Link href="/kahveler" className="btn btn-primary">
          {t.common.continueShopping}
        </Link>
      </div>
    </div>
  );
}

/** iyzico dönüşü: ödemenin WooCommerce'de gerçekten alınıp alınmadığını canlı kontrol eder */
function CardPaymentStatus({ orderNumber, email }: { orderNumber: string; email: string }) {
  const { t } = useI18n();
  const o = t.orderComplete;
  const [state, setState] = useState<{ status: string; paymentUrl?: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, email }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => !cancelled && d && setState({ status: d.status, paymentUrl: d.paymentUrl }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderNumber, email]);

  if (!state) return null;
  if (state.status === "awaiting-payment" && state.paymentUrl) {
    return (
      <section className="mt-10 rounded-sm border border-amber-300/40 bg-amber-300/5 p-6">
        <h2 className="font-serif text-2xl">{o.unpaidTitle}</h2>
        <p className="mt-2 text-cream-200">{o.unpaidText}</p>
        <a href={state.paymentUrl} className="btn btn-primary mt-5">
          {t.common.completePayment}
        </a>
      </section>
    );
  }
  if (state.status === "processing" || state.status === "shipped") {
    return (
      <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-flores-500/15 px-4 py-2 text-sm text-flores-200">
        <span aria-hidden>✓</span> {o.paid}
      </p>
    );
  }
  return null;
}
