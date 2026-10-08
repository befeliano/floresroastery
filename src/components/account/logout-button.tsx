"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => null);
        router.push("/");
        router.refresh();
      }}
      className="btn btn-ghost"
    >
      {busy ? "Çıkılıyor…" : "Çıkış yap"}
    </button>
  );
}
