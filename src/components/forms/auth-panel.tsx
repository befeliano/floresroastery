"use client";

import Link from "@/i18n/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { nextPath, useLoggedIn } from "@/lib/auth/client";

type Mode = "login" | "register" | "reset";

const TABS: { mode: Mode; key: "loginTab" | "registerTab" }[] = [
  { mode: "login", key: "loginTab" },
  { mode: "register", key: "registerTab" },
];

/** Giriş · Üye ol · Şifremi unuttum — floresroastery.com'daki mevcut hesaplarla çalışır */
export function AuthPanel() {
  const router = useRouter();
  const loggedIn = useLoggedIn();
  const { t, href, tApi } = useI18n();
  const a = t.auth;
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
        if (data.fieldErrors) setFieldErrors(Object.fromEntries(Object.entries(data.fieldErrors as Record<string, string>).map(([k, v]) => [k, tApi(v)])));
        throw new Error(data.error ? tApi(data.error) : t.common.genericError);
      }
      return { ...data, message: data.message ? tApi(data.message) : undefined } as { ok: true; message?: string };
    } catch (err) {
      setError(err instanceof TypeError ? t.common.networkError : (err as Error).message);
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
      if (data) setNotice(data.message ?? a.checkEmail);
      return;
    }
    const data =
      mode === "login"
        ? await send("/api/auth/login", { email: f.email, password: f.password })
        : await send("/api/auth/register", { firstName: f.firstName, lastName: f.lastName, email: f.email, password: f.password, kvkk: f.kvkk === "on" });
    if (data) {
      router.push(href(nextPath()));
      router.refresh();
    }
  }

  if (loggedIn) {
    return (
      <div className="mt-10 rounded-sm border border-ink-700 bg-ink-900 p-6">
        <p className="text-cream-200">{a.alreadyIn}</p>
        <Link href="/hesabim" className="btn btn-primary mt-5">
          {a.goAccount}
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
        <div role="tablist" aria-label={a.tabsAria} className="mb-8 grid grid-cols-2 rounded-sm border border-ink-700 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.mode}
              type="button"
              role="tab"
              aria-selected={mode === tab.mode}
              onClick={() => switchTo(tab.mode)}
              className={`rounded-sm py-2.5 text-sm font-medium transition-colors ${mode === tab.mode ? "bg-flores-500 text-ink-950" : "text-cream-300 hover:text-cream-50"}`}
            >
              {a[tab.key]}
            </button>
          ))}
        </div>
      )}

      <form key={mode} noValidate onSubmit={onSubmit} className="space-y-5">
        {mode === "reset" && (
          <div>
            <h2 className="font-serif text-3xl">{a.resetTitle}</h2>
            <p className="mt-2 text-sm text-cream-400">{a.resetText}</p>
          </div>
        )}

        {mode === "register" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="a-first" className="mb-2 block text-sm text-cream-300">
                {a.firstName}
              </label>
              <input id="a-first" name="firstName" required autoComplete="given-name" maxLength={60} aria-invalid={!!fieldErrors.firstName} className="field" />
              {err("firstName")}
            </div>
            <div>
              <label htmlFor="a-last" className="mb-2 block text-sm text-cream-300">
                {a.lastName}
              </label>
              <input id="a-last" name="lastName" required autoComplete="family-name" maxLength={60} aria-invalid={!!fieldErrors.lastName} className="field" />
              {err("lastName")}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="a-mail" className="mb-2 block text-sm text-cream-300">
            {mode === "login" ? a.loginId : t.common.email}
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
                {a.password}
              </label>
              <button type="button" onClick={() => setShowPass((v) => !v)} className="text-xs text-cream-400 underline underline-offset-2 hover:text-cream-100">
                {showPass ? a.hide : a.show}
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
            {mode === "register" && !fieldErrors.password && <p className="mt-1.5 text-xs text-cream-500">{a.min8}</p>}
            {err("password")}
          </div>
        )}

        {mode === "register" && (
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-cream-200">
              <input type="checkbox" name="kvkk" className="mt-0.5 size-5 shrink-0 accent-[#5fa4d6]" />
              <span>
                {a.kvkkConsent.split("{kvkk}")[0]}
                <Link href="/kvkk-aydinlatma-metni" target="_blank" className="text-flores-300 underline underline-offset-4">
                  {t.common.kvkk}
                </Link>
                {a.kvkkConsent.split("{kvkk}")[1]}
              </span>
            </label>
            {err("kvkk")}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? a.wait : mode === "login" ? a.submitLogin : mode === "register" ? a.submitRegister : a.submitReset}
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
              {a.forgot}
            </button>
          )}
          {mode === "reset" && (
            <button type="button" onClick={() => switchTo("login")} className="text-cream-400 underline underline-offset-4 hover:text-cream-100">
              {a.back}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
