/** İstemci tarafı JSON POST yardımcısı — API hata mesajını Türkçe olarak döndürür */
export async function postJson<T = { message?: string }>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.");
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Bir sorun oluştu, lütfen tekrar deneyin.");
  return data;
}
