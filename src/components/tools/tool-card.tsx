import Image from "next/image";
import Link from "@/i18n/link";
import type { ToolCoffee } from "@/lib/commerce/tools";
import { formatPrice } from "@/lib/format";

/** Araç sayfalarında (bulucu, tat çarkı, harita) kullanılan sade kahve kartı */
export function ToolCard({ coffee, cta, badge, large = false }: { coffee: ToolCoffee; cta: string; badge?: string; large?: boolean }) {
  return (
    <Link href={`/kahveler/${coffee.slug}`} className={`group flex gap-4 rounded-sm border border-ink-700 bg-ink-900 p-3 transition-colors hover:border-flores-500 ${large ? "md:p-5" : ""}`}>
      <div className={`relative shrink-0 overflow-hidden rounded-sm ${large ? "size-28 md:size-40" : "size-20"}`} style={{ backgroundColor: coffee.bg }}>
        <Image src={coffee.image} alt="" fill sizes={large ? "160px" : "80px"} className="object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {badge && <p className="eyebrow text-[0.6rem] text-flores-300">{badge}</p>}
        <p className={`font-serif leading-tight group-hover:text-flores-300 ${large ? "mt-1 text-3xl" : "text-xl"}`}>{coffee.name}</p>
        <p className="truncate text-xs text-cream-400">{coffee.subtitle}</p>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-cream-300">
          {coffee.notes.slice(0, 3).map((n) => (
            <li key={n.label} className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: n.color }} aria-hidden />
              {n.label}
            </li>
          ))}
        </ul>
        <p className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm">
          <span className="font-mono text-cream-200">{coffee.price != null ? formatPrice(coffee.price) : ""}</span>
          <span className="text-flores-300">{cta} →</span>
        </p>
      </div>
    </Link>
  );
}
