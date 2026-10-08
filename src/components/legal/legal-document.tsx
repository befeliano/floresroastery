import Link from "@/i18n/link";
import type { LegalBlock } from "@/content/legal";

/** Yasal metin blokları — sayfada ve ödeme adımındaki pencerelerde ortak kullanılır */
export function LegalBlocks({ blocks, compact = false }: { blocks: LegalBlock[]; compact?: boolean }) {
  return (
    <div className={`legal space-y-4 text-cream-200 ${compact ? "text-sm leading-relaxed" : "text-[0.975rem] leading-[1.8]"}`}>
      {blocks.map((b, i) => {
        if ("h" in b)
          return (
            <h2 key={i} id={`b${i}`} className={`scroll-mt-28 font-sans font-semibold text-cream-50 ${compact ? "pt-3 text-sm" : "pt-6 text-lg"}`}>
              {b.h}
            </h2>
          );
        if ("p" in b) return <p key={i}>{b.p}</p>;
        if ("note" in b)
          return (
            <p key={i} className="border-l-2 border-flores-500 bg-flores-500/5 py-2 pl-4 text-cream-100">
              {b.note.includes("/iade-talebi") ? (
                <>
                  {b.note.replace("/iade-talebi", "")}
                  <Link href="/iade-talebi" className="text-flores-300 underline underline-offset-4">
                    İade Talebi formu
                  </Link>
                </>
              ) : (
                b.note
              )}
            </p>
          );
        const Tag = "ol" in b ? "ol" : "ul";
        const items = "ol" in b ? b.ol : b.ul;
        return (
          <Tag key={i} className={`space-y-1.5 pl-5 ${Tag === "ol" ? "list-decimal" : "list-disc"} marker:text-flores-500`}>
            {items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}
