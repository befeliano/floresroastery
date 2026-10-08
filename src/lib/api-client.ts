import { translateWith, type ApiTable } from "@/i18n/messages/api";

/** I18nProvider her render'da seçili dilin API çeviri tablosunu buraya yazar */
let table: ApiTable | null = null;
export const setApiTable = (t: ApiTable) => {
  table = t;
};

/** API'den gelen Türkçe mesajı seçili dile çevirir (eşleşme yoksa olduğu gibi) */
export const translateApi = (msg: string | null | undefined) => translateWith(table, msg);

const NETWORK: Record<string, string> = {
  tr: "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.",
  en: "Could not connect. Please check your internet connection and try again.",
  id: "Tidak dapat terhubung. Periksa koneksi internet Anda dan coba lagi.",
};
const GENERIC: Record<string, string> = {
  tr: "Bir sorun oluştu, lütfen tekrar deneyin.",
  en: "Something went wrong, please try again.",
  id: "Terjadi kesalahan, silakan coba lagi.",
};
const pageLocale = () => (typeof document !== "undefined" ? document.documentElement.lang : "tr") || "tr";

/** İstemci tarafı JSON POST yardımcısı — hata ve bilgi mesajlarını seçili dile çevirerek döndürür */
export async function postJson<T = { message?: string }>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(NETWORK[pageLocale()] ?? NETWORK.tr);
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string; message?: string };
  if (!res.ok) throw new Error(data.error ? translateApi(data.error) : (GENERIC[pageLocale()] ?? GENERIC.tr));
  if (typeof data.message === "string") data.message = translateApi(data.message);
  return data;
}
