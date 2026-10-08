"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { nextPath, useLoggedIn } from "@/lib/auth/client";

type Mode = "login" | "register" | "reset";

const TABS: { mode: Mode; label: string }[] = [
  { mode: "login", label: "Giriş yap" },
  { mode: "register", label: "Üye ol" },
];

/** Giriş · Üye ol · Şifremi unuttum — floresroastery.com'daki mevcut hesaplarla çalışır */
export function AuthPanel() {
  const router = useRouter();
  const loggedIn = useLoggedIn();
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);

  const switchTo = (m: Mode) => {
    setMode(m);
    setError(null);
    setNotice(null);
    setFieldErrors({});
  };

  async function send(url: string, body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    setNotice(null);
    setFieldErrors({});
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data.error ?? "Bir sorun oluştu, lütfen tekrar deneyin.");
      }
      return data as { ok: true; message?: string };
    } catch (err) {
      setError(err instanceof TypeError ? "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin." : (err as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (mode === "reset") {
      const data = await send("/api/auth/reset", { email: f.email });
      if (data) setNotice(data.message ?? "E-postanızı kontrol edin.");
      return;
    }
    const data =
      mode === "login"
        ? await send("/api/auth/login", { email: f.email, password: f.password })
        : await send("/api/auth/register", { firstName: f.firstName, lastName: f.lastName, email: f.email, password: f.password, kvkk: f.kvkk === "on" });
    if (data) {
      router.push(nextPath());
      router.refresh();
    }
  }

  if (loggedIn) {
    return (
      <div className="mt-10 rounded-sm border border-ink-700 bg-ink-900 p-6">
        <p className="text-cream-200">Zaten giriş yaptınız.</p>
        <Link href="/hesabim" className="btn btn-primary mt-5">
          Hesabıma git →
        </Link>
      </div>
    );
  }

  const err = (k: string) =>
    fieldErrors[k] ? (
      <p id={`ae-${k}`} className="mt-1.5 text-xs text-red-300">
        {fieldErrors[k]}
      </p>
    ) : null;

  return (
    <div className="mt-10">
      {mode !== "reset" && (
        <div role="tablist" aria-label="Hesap" className="mb-8 grid grid-cols-2 rounded-sm border border-ink-700 p-1">
          {TABS.map((t) => (
            <button
              key={t.mode}
              type="button"
              role="tab"
              aria-selected={mode === t.mode}
              onClick={() => switchTo(t.mode)}
              className={`rounded-sm py-2.5 text-sm font-medium transition-colors ${mode === t.mode ? "bg-flores-500 text-ink-950" : "text-cream-300 hover:text-cream-50"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <form key={mode} noValidate onSubmit={onSubmit} className="space-y-5">
        {mode === "reset" && (
          <div>
            <h2 className="font-serif text-3xl">Şifremi unuttum</h2>
            <p className="mt-2 text-sm text-cream-400">
              Hesabınızın e-posta adresini yazın; şifrenizi yenilemeniz için bir bağlantı gönderelim.
            </p>
          </div>
        )}

        {mode === "register" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="a-first" className="mb-2 block text-sm text-cream-300">
                Ad
              </label>
              <input id="a-first" name="firstName" required autoComplete="given-name" maxLength={60} aria-invalid={!!fieldErrors.firstName} className="field" />
              {err("firstName")}
            </div>
            <div>
              <label htmlFor="a-last" className="mb-2 block text-sm text-cream-300">
                Soyad
              </label>
              <input id="a-last" name="lastName" required autoComplete="family-name" maxLength={60} aria-invalid={!!fieldErrors.lastName} className="field" />
              {err("lastName")}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="a-mail" className="mb-2 block text-sm text-cream-300">
            {mode === "login" ? "E-posta veya kullanıcı adı" : "E-posta"}
          </label>
          <input
            id="a-mail"
            name="email"
            type={mode === "login" ? "text" : "email"}
            inputMode="email"
            required
            autoComplete={mode === "login" ? "username" : "email"}
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            aria-invalid={!!fieldErrors.email}
            className="field"
          />
          {err("email")}
        </div>

        {mode !== "reset" && (
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="a-pass" className="text-sm text-cream-300">
                Şifre
              </label>
              <button type="button" onClick={() => setShowPass((v) => !v)} className="text-xs text-cream-400 underline underline-offset-2 hover:text-cream-100">
                {showPass ? "Gizle" : "Göster"}
              </button>
            </div>
            <input
              id="a-pass"
              name="password"
              type={showPass ? "text" : "password"}
              required
              minLength={mode === "register" ? 8 : undefined}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              maxLength={200}
              aria-invalid={!!fieldErrors.password}
              className="field"
            />
            {mode === "register" && !fieldErrors.password && <p className="mt-1.5 text-xs text-cream-500">En az 8 karakter.</p>}
            {err("password")}
          </div>
        )}

        {mode === "register" && (
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-cream-200">
              <input type="checkbox" name="kvkk" className="mt-0.5 size-5 shrink-0 accent-[#5fa4d6]" />
              <span>
                <Link href="/kvkk-aydinlatma-metni" target="_blank" className="text-flores-300 underline underline-offset-4">
                  KVKK Aydınlatma Metni
                </Link>
                &apos;ni okudum; üyelik için kişisel verilerimin işlenmesini kabul ediyorum.
              </span>
            </label>
            {err("kvkk")}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? "Lütfen bekleyin…" : mode === "login" ? "Giriş yap" : mode === "register" ? "Hesap oluştur" : "Sıfırlama bağlantısı gönder"}
        </button>

        {error && (
          <p role="alert" className="rounded-sm border border-red-400/40 bg-red-400/5 p-3 text-sm text-red-200">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-sm border border-flores-500/40 bg-flores-500/5 p-3 text-sm text-flores-100">
            {notice}
          </p>
        )}

        <div className="flex flex-wrap justify-between gap-3 text-sm">
          {mode === "login" && (
            <button type="button" onClick={() => switchTo("reset")} className="text-cream-400 underline underline-offset-4 hover:text-cream-100">
              Şifremi unuttum
            </button>
          )}
          {mode === "reset" && (
            <button type="button" onClick={() => switchTo("login")} className="text-cream-400 underline underline-offset-4 hover:text-cream-100">
              ← Girişe dön
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
