"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import Link from "@/i18n/link";
import { openMailto } from "@/lib/mailto";
import { site } from "@/lib/site";

/** İletişim formu — e-posta uygulamasında info@floresroastery.com'a hazır taslak açar */
export function ContactForm() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kvkkBefore, kvkkAfter] = t.forms.contactConsent.split("{kvkk}");

  if (sent) {
    return (
      <div role="status" className="rounded-sm border border-flores-500/40 bg-flores-500/5 p-8">
        <p className="font-serif text-3xl">{t.forms.thanks}</p>
        <p className="mt-3 text-cream-200">{t.forms.mailOpened.replace("{email}", site.email)}</p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-ghost mt-6">
          {t.forms.back}
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const name = String(f.get("name") ?? "").trim();
        const message = String(f.get("message") ?? "").trim();
        if (name.length < 2 || message.length < 10) return setError(t.forms.fillRequired);
        if (f.get("kvkk") !== "on") return setError(t.forms.kvkkRequired);
        setError(null);
        openMailto(site.email, `[Flores] ${f.get("subject")} — ${name}`, [
          [t.common.nameSurname, name],
          [t.common.email, String(f.get("email") ?? "")],
          [t.forms.subject, String(f.get("subject") ?? "")],
          ["", ""],
          [t.forms.message, `\n${message}`],
        ]);
        setSent(true);
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="c-name" className="mb-2 block text-sm text-cream-300">
          {t.common.nameSurname}
        </label>
        <input id="c-name" name="name" required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="c-mail" className="mb-2 block text-sm text-cream-300">
          {t.common.email}
        </label>
        <input id="c-mail" name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-subject" className="mb-2 block text-sm text-cream-300">
          {t.forms.subject}
        </label>
        <select id="c-subject" name="subject" className="field">
          {t.forms.subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-msg" className="mb-2 block text-sm text-cream-300">
          {t.forms.message}
        </label>
        <textarea id="c-msg" name="message" required rows={6} maxLength={3000} className="field resize-y" />
      </div>
      <label className="flex items-start gap-3 text-sm text-cream-300 sm:col-span-2">
        <input type="checkbox" name="kvkk" className="mt-0.5 size-5 shrink-0 accent-[#5fa4d6]" />
        <span>
          {kvkkBefore}
          <Link href="/kvkk-aydinlatma-metni" target="_blank" className="text-flores-300 underline underline-offset-4">
            {t.common.kvkk}
          </Link>
          {kvkkAfter}
        </span>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary">
          {t.forms.send}
        </button>
        <p className="mt-3 text-xs text-cream-500">{t.forms.mailNote.replace("{email}", site.email)}</p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
