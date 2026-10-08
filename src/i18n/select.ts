import type { Locale } from "./config";

/** Çeviri yaprağı: her metin üç dilde yan yana yazılır, eksik dil derlemede yakalanır */
export type L = { tr: string; en: string; id: string };

/** Mesaj ağacındaki her { tr, en, id } yaprağını seçilen dilin metnine indirger */
export type Selected<T> = T extends L ? string : T extends readonly (infer U)[] ? Selected<U>[] : T extends object ? { [K in keyof T]: Selected<T[K]> } : T;

const isLeaf = (v: unknown): v is L => !!v && typeof v === "object" && "tr" in v && "en" in v && "id" in v && typeof (v as L).tr === "string";

export function select<T>(tree: T, locale: Locale): Selected<T> {
  if (isLeaf(tree)) return tree[locale] as Selected<T>;
  if (Array.isArray(tree)) return tree.map((x) => select(x, locale)) as Selected<T>;
  if (tree && typeof tree === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(tree)) out[k] = select(v, locale);
    return out as Selected<T>;
  }
  return tree as Selected<T>;
}
