import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Müşteri oturumu — imzalı (HMAC-SHA256), httpOnly çerez.
 * Şifre hiçbir yerde saklanmaz; çerezde yalnızca WooCommerce müşteri kimliği,
 * e-posta ve ad bulunur. İmza anahtarı SESSION_SECRET ortam değişkeninden,
 * yoksa WooCommerce consumer secret'ından türetilir (yalnızca sunucuda).
 */

export const SESSION_COOKIE = "flores_session";
/** Yalnızca "giriş yapılmış mı" bayrağı — kişisel veri içermez, arayüz için JS'ten okunur */
export const AUTH_FLAG_COOKIE = "flores_auth";
const MAX_AGE = 30 * 24 * 60 * 60;

export interface Session {
  sub: number;
  email: string;
  name: string;
  exp: number;
}

function key(): Buffer | null {
  const own = process.env.SESSION_SECRET;
  if (own && own.length >= 32) return Buffer.from(own);
  const woo = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  return woo ? createHmac("sha256", woo).update("flores-session-v1").digest() : null;
}

export const isAuthAvailable = () => key() !== null;

const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");
const sign = (data: string, k: Buffer) => createHmac("sha256", k).update(data).digest("base64url");

function encode(session: Session): string {
  const k = key();
  if (!k) throw new Error("Oturum anahtarı yok");
  const data = `v1.${b64(JSON.stringify(session))}`;
  return `${data}.${sign(data, k)}`;
}

function decode(token: string | undefined): Session | null {
  const k = key();
  if (!k || !token) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const data = token.slice(0, i);
  const sig = Buffer.from(token.slice(i + 1));
  const expected = Buffer.from(sign(data, k));
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;
  try {
    const s = JSON.parse(Buffer.from(data.slice(3), "base64url").toString()) as Session;
    return typeof s.sub === "number" && s.exp * 1000 > Date.now() ? s : null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  // süre kontrolü (Date.now) yalnızca istek anında — önceden render (prerender) sırasında değil
  await connection();
  return decode(token);
}

const secure = process.env.NODE_ENV === "production";

export async function startSession(user: { id: number; email: string; name: string }) {
  const store = await cookies();
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  store.set(SESSION_COOKIE, encode({ sub: user.id, email: user.email, name: user.name, exp }), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  store.set(AUTH_FLAG_COOKIE, "1", { secure, sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(AUTH_FLAG_COOKIE);
}
