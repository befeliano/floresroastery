"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";

/**
 * Tahmini teslimat — İstanbul saatine göre hesaplanır (ziyaretçinin saat diliminden bağımsız).
 * Kurye (Eskişehir): hafta içi 16:00 teslim, 14:00'ten sonraki sipariş ertesi iş günü.
 * Kargo: kavrumdan sonra 1–2 iş gününde kargoya, 1–3 iş gününde teslim → siparişten 2–5 iş günü.
 * Zamana bağlı olduğu için yalnızca tarayıcıda (mount sonrası) çizilir.
 */
const CUTOFF_HOUR = 14;
const CARGO_MIN = 2;
const CARGO_MAX = 5;

/** İstanbul'daki takvim günü (UTC gece yarısı olarak) ve saat/dakika */
function istanbulNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Istanbul", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h23" })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return { day: new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day)), hour: +parts.hour, minute: +parts.minute };
}

const isWeekend = (d: Date) => d.getUTCDay() === 0 || d.getUTCDay() === 6;
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);
function addBusinessDays(d: Date, n: number) {
  let out = d;
  while (n > 0) {
    out = addDays(out, 1);
    if (!isWeekend(out)) n--;
  }
  return out;
}

function estimate() {
  const { day, hour, minute } = istanbulNow();
  const beforeCutoff = !isWeekend(day) && hour < CUTOFF_HOUR;
  // siparişin işleme alındığı iş günü
  const start = beforeCutoff ? day : addBusinessDays(day, 1);
  return {
    today: day,
    courier: start,
    cargoFrom: addBusinessDays(start, CARGO_MIN),
    cargoTo: addBusinessDays(start, CARGO_MAX),
    minutesLeft: beforeCutoff ? CUTOFF_HOUR * 60 - (hour * 60 + minute) : null,
  };
}

export function DeliveryEstimate({ compact = false }: { compact?: boolean }) {
  const { t, fmt, intl } = useI18n();
  const [e, setE] = useState<ReturnType<typeof estimate> | null>(null);

  useEffect(() => {
    const tick = () => setE(estimate());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!e) return <div aria-hidden className={compact ? "h-10" : "h-[7.5rem]"} />;

  const date = (d: Date) => d.toLocaleDateString(intl, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime();
  const when = sameDay(e.courier, e.today)
    ? t.delivery.today
    : sameDay(e.courier, addDays(e.today, 1))
      ? t.delivery.tomorrow
      : e.courier.toLocaleDateString(intl, { weekday: "long", timeZone: "UTC" });
  const left = e.minutesLeft != null ? fmt(t.delivery.left, { h: Math.floor(e.minutesLeft / 60), m: e.minutesLeft % 60 }) : null;
  const cargo = fmt(t.delivery.cargo, { from: date(e.cargoFrom), to: date(e.cargoTo) });
  const courier = fmt(t.delivery.courier, { when });

  if (compact) {
    return (
      <p className="flex gap-2 text-xs leading-relaxed text-cream-400">
        <TruckIcon />
        <span>
          {cargo}
          <br />
          {courier}
        </span>
      </p>
    );
  }

  return (
    <div className="mt-6 rounded-sm border border-ink-700 bg-ink-950/50 p-4">
      <p className="eyebrow flex items-center gap-2 text-[0.6rem] text-flores-400">
        <TruckIcon />
        {t.delivery.title}
      </p>
      {left && (
        <p className="mt-2 text-sm text-cream-100">
          <span aria-hidden className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-flores-400 align-middle" />
          {fmt(t.delivery.order, { left })}
        </p>
      )}
      <ul className="mt-2 space-y-1 text-sm text-cream-300">
        <li>{courier}</li>
        <li>{cargo}</li>
      </ul>
      <p className="mt-2 text-xs text-cream-500">{t.delivery.note}</p>
    </div>
  );
}

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.5" />
    <circle cx="17" cy="17.5" r="1.5" />
  </svg>
);
