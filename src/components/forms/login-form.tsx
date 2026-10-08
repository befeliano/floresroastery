"use client";

import { useApiForm } from "./use-api-form";

export function LoginForm() {
  const { state, submit } = useApiForm("/api/auth/login");

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        void submit({ email: f.get("email"), password: f.get("password") });
      }}
      className="mt-10 space-y-5"
    >
      <div>
        <label htmlFor="l-mail" className="mb-2 block text-sm text-cream-300">
          E-posta
        </label>
        <input id="l-mail" name="email" type="email" required autoComplete="email" maxLength={254} className="field" />
      </div>
      <div>
        <label htmlFor="l-pass" className="mb-2 block text-sm text-cream-300">
          Şifre
        </label>
        <input id="l-pass" name="password" type="password" required autoComplete="current-password" maxLength={200} className="field" />
      </div>
      <button type="submit" disabled={state.kind === "loading"} className="btn btn-primary w-full">
        {state.kind === "loading" ? "Kontrol ediliyor…" : "Giriş yap"}
      </button>
      {state.kind === "error" && (
        <p role="alert" className="text-sm text-amber-200">
          {state.message}
        </p>
      )}
    </form>
  );
}
