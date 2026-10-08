import "server-only";

/**
 * IP tabanlı kayan pencere hız sınırlayıcı (brute-force / spam / DDoS'a karşı).
 * Bellek içi çalışır: tek sunucu (Hostinger Node.js, VPS) için yeterlidir.
 * Vercel gibi çok örnekli/serverless ortamlarda aynı arayüzü Upstash Redis
 * (@upstash/ratelimit) ile değiştirin.
 */
type Hits = number[];
const store: Map<string, Hits> = ((globalThis as { __floresRate?: Map<string, Hits> }).__floresRate ??= new Map());

export interface Limit {
  /** pencere başına izin verilen istek */
  limit: number;
  /** pencere süresi (ms) */
  windowMs: number;
}

export const LIMITS = {
  login: { limit: 5, windowMs: 15 * 60_000 },
  register: { limit: 5, windowMs: 30 * 60_000 },
  reset: { limit: 3, windowMs: 15 * 60_000 },
  checkout: { limit: 10, windowMs: 10 * 60_000 },
  form: { limit: 5, windowMs: 10 * 60_000 },
  lookup: { limit: 10, windowMs: 10 * 60_000 },
} satisfies Record<string, Limit>;

export function rateLimit(key: string, { limit, windowMs }: Limit) {
  const now = Date.now();
  const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    store.set(key, hits);
    return { ok: false as const, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  store.set(key, hits);

  // ara sıra eski kayıtları temizle (bellek sızıntısını önler)
  if (store.size > 5000) {
    for (const [k, v] of store) if (!v.some((t) => now - t < windowMs)) store.delete(k);
  }
  return { ok: true as const, remaining: limit - hits.length };
}
