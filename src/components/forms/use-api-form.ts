"use client";

import { useState } from "react";
import { postJson } from "@/lib/api-client";

export type FormState<T> = { kind: "idle" | "loading" | "error"; message?: string } | { kind: "ok"; message?: string; data: T };

/** Basit form gönderim durumu (yükleniyor / hata / başarılı) */
export function useApiForm<T extends { message?: string }>(url: string) {
  const [state, setState] = useState<FormState<T>>({ kind: "idle" });

  async function submit(body: unknown) {
    setState({ kind: "loading" });
    try {
      const data = await postJson<T>(url, body);
      setState({ kind: "ok", message: data.message, data });
      return data;
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
      return null;
    }
  }

  return { state, submit, reset: () => setState({ kind: "idle" }) };
}
