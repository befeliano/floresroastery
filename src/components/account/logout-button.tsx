"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/client";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { t, href } = useI18n();
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => null);
        router.push(href("/"));
        router.refresh();
      }}
      className="btn btn-ghost"
    >
      {busy ? t.auth.loggingOut : t.auth.logout}
    </button>
  );
}
