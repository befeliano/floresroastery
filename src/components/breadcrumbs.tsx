import Link from "@/i18n/link";
import { JsonLd } from "@/components/json-ld";
import { pages } from "@/i18n/messages/pages";
import { href, t } from "@/i18n/server";
import { breadcrumbSchema } from "@/lib/seo";

export interface Crumb {
  name: string;
  path: string;
}

/** Görünür içerik izi + BreadcrumbList şeması */
export async function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const c = await t(pages.crumbs);
  const localized = await Promise.all(items.map(async (i) => ({ ...i, path: await href(i.path) })));
  return (
    <>
      <JsonLd data={breadcrumbSchema(localized)} />
      <nav aria-label={c.aria} className={className}>
        <ol className="flex flex-wrap items-center gap-2 text-xs text-cream-500">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-cream-300">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="transition-colors hover:text-flores-300">
                      {c.name}
                    </Link>
                    <span aria-hidden>/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
