"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import Link from "@/i18n/link";
import { formatPrice } from "@/lib/format";

/**
 * "Son baktıkların" — ziyaret edilen ürünler yalnızca bu tarayıcıda (localStorage) tutulur,
 * sunucuya hiçbir şey gitmez. Dil başına ayrı liste (ürün adları o dilde saklanır).
 */
export type ViewedItem = { slug: string; name: string; subtitle: string; image: string; bg: string; price: number | null };

const MAX = 8;
const key = (locale: string) => `flores-recent-v1:${locale}`;

function read(locale: string): ViewedItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key(locale)) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x) => x && typeof x.slug === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

/** Ürün sayfasında: bu ürünü listenin başına yazar */
export function TrackView({ item }: { item: ViewedItem }) {
  const { locale } = useI18n();
  useEffect(() => {
    try {
      const list = [item, ...read(locale).filter((x) => x.slug !== item.slug)].slice(0, MAX);
      localStorage.setItem(key(locale), JSON.stringify(list));
    } catch {
      /* gizli sekme vb. — sessizce geç */
    }
  }, [item, locale]);
  return null;
}

/** Son bakılan ürünler şeridi (hiç yoksa hiçbir şey göstermez) */
export function RecentlyViewed({ exclude, className = "" }: { exclude?: string; className?: string }) {
  const { locale, t } = useI18n();
  const [items, setItems] = useState<ViewedItem[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage yalnızca tarayıcıda okunabilir
    setItems(read(locale).filter((x) => x.slug !== exclude));
  }, [locale, exclude]);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recent-title" className={className}>
      <h2 id="recent-title" className="eyebrow text-flores-400">
        {t.product.recentTitle}
      </h2>
      <ul className="no-scrollbar -mx-5 mt-5 flex gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        {items.map((p) => (
          <li key={p.slug} className="w-36 shrink-0 md:w-44">
            <Link href={`/kahveler/${p.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-sm" style={{ backgroundColor: p.bg }}>
                <Image src={p.image} alt="" fill sizes="176px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-2 truncate font-serif text-lg leading-tight group-hover:text-flores-300">{p.name}</p>
              <p className="truncate text-xs text-cream-500">{p.price != null ? formatPrice(p.price) : p.subtitle}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
