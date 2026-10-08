import "server-only";
import { cityFromWooState, wooStateFromCity } from "@/lib/tr-cities";
import { wooFetch, type WooOrder } from "./woocommerce";

/**
 * WooCommerce müşteri hesapları
 * -----------------------------
 * Şifre doğrulama ve şifre sıfırlama, WordPress'e eklenen küçük uç noktalarla
 * yapılır (docs/wordpress-snippet.php → "wc-flores/v1"). Bu uç noktalar yalnızca
 * sitenin WooCommerce anahtarıyla çağrılabilir; şifreler WordPress'te kalır.
 * Kayıt, profil ve siparişler WooCommerce REST API v3'ten gelir.
 */

export class AuthUnavailableError extends Error {}

export interface WooAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing: WooAddress;
  shipping: WooAddress;
}

/** Ödeme formunu dolduran sadeleştirilmiş profil */
export interface CustomerProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postcode: string;
}

export function toProfile(c: WooCustomer): CustomerProfile {
  const a = c.billing?.address_1 ? c.billing : c.shipping;
  return {
    id: c.id,
    email: c.email,
    firstName: c.first_name || c.billing?.first_name || "",
    lastName: c.last_name || c.billing?.last_name || "",
    phone: c.billing?.phone ?? "",
    city: cityFromWooState(a?.state),
    district: a?.city ?? "",
    address: [a?.address_1, a?.address_2].filter(Boolean).join(" "),
    postcode: a?.postcode ?? "",
  };
}

async function readError(res: Response): Promise<{ code?: string; message?: string }> {
  return (await res.json().catch(() => ({}))) as { code?: string; message?: string };
}

/** E-posta/kullanıcı adı + şifreyi WordPress'te doğrular; hatalıysa null */
export async function verifyCredentials(login: string, password: string): Promise<{ id: number; email: string } | null> {
  const res = await wooFetch("wc-flores/v1/login", { method: "POST", body: JSON.stringify({ login, password }) });
  if (res.ok) return (await res.json()) as { id: number; email: string };
  const err = await readError(res);
  if (err.code === "flores_invalid_login") return null;
  // 404: snippet kurulmamış · 401/403: anahtar hatalı/yetkisiz
  throw new AuthUnavailableError(`Giriş uç noktası ${res.status} ${err.code ?? ""}`);
}

/** WordPress'in (WooCommerce) şifre sıfırlama e-postasını gönderir; hesap var/yok bilgisi sızdırılmaz */
export async function sendPasswordReset(login: string): Promise<void> {
  const res = await wooFetch("wc-flores/v1/lost-password", { method: "POST", body: JSON.stringify({ login }) });
  if (!res.ok) throw new AuthUnavailableError(`Şifre sıfırlama uç noktası ${res.status}`);
}

export async function getCustomer(id: number): Promise<WooCustomer | null> {
  const res = await wooFetch(`wc/v3/customers/${id}`);
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`WooCommerce müşteri ${id} → ${res.status}`);
  return (await res.json()) as WooCustomer;
}

export type RegisterResult = { ok: true; customer: WooCustomer } | { ok: false; reason: "exists" | "invalid"; message?: string };

export async function registerCustomer(input: { email: string; firstName: string; lastName: string; password: string }): Promise<RegisterResult> {
  const res = await wooFetch("wc/v3/customers", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      password: input.password,
      // kullanıcı adı: e-postanın baş kısmı + rastgele ek (çakışmayı önler)
      username: `${input.email.split("@")[0].replace(/[^a-z0-9._-]/gi, "").slice(0, 40) || "musteri"}${Math.floor(1000 + Math.random() * 9000)}`,
      billing: { first_name: input.firstName, last_name: input.lastName, email: input.email, country: "TR" },
    }),
  });
  if (res.ok) return { ok: true, customer: (await res.json()) as WooCustomer };
  const err = await readError(res);
  if (err.code?.includes("email-exists") || err.code?.includes("username-exists")) return { ok: false, reason: "exists" };
  if (res.status === 400) return { ok: false, reason: "invalid", message: err.message };
  throw new Error(`WooCommerce müşteri kaydı → ${res.status} ${err.code ?? ""}`);
}

/** Son siparişteki teslimat bilgisini hesaba kaydeder (bir sonraki siparişte form dolu gelir) */
export async function saveCustomerAddress(id: number, p: Omit<CustomerProfile, "id" | "email">) {
  const address = {
    first_name: p.firstName,
    last_name: p.lastName,
    address_1: p.address,
    city: p.district,
    state: wooStateFromCity(p.city),
    postcode: p.postcode,
    country: "TR",
  };
  const res = await wooFetch(`wc/v3/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify({ billing: { ...address, phone: p.phone }, shipping: address }),
  });
  if (!res.ok) throw new Error(`WooCommerce müşteri adresi ${id} → ${res.status}`);
}

export async function getCustomerOrders(id: number): Promise<WooOrder[]> {
  const res = await wooFetch(`wc/v3/orders?customer=${id}&per_page=20&orderby=date&order=desc`);
  if (!res.ok) throw new Error(`WooCommerce siparişler (müşteri ${id}) → ${res.status}`);
  return (await res.json()) as WooOrder[];
}
