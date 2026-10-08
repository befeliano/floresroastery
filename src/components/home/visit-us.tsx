import Image from "next/image";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { localPhotos, t } from "@/i18n/server";

import { site } from "@/lib/site";

/** Coffee Bar ve toptan satış yönlendirmesi */
export async function VisitUs() {
  const h = await t(pages.home);
  const s = await t(pages.site);
  const photos = await localPhotos();
  return (
    <section className="relative isolate overflow-hidden border-t border-ink-800">
      <Image src={photos.boxesNature.src} alt={photos.boxesNature.alt} fill quality={90} sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div className="mx-auto grid max-w-[1440px] gap-px px-5 py-24 md:grid-cols-2 md:px-10 md:py-32">
        <div className="reveal pr-6">
          <p className="eyebrow text-flores-400">{h.visitEyebrow}</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{h.visitTitle}</h2>
          <p className="mt-5 max-w-md text-cream-300">
            {h.visitText} {site.store.address}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/coffee-bar" className="btn btn-primary">
              {h.book}
            </Link>
            <a href={site.store.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {s.directions}
            </a>
          </div>
        </div>
        <div className="reveal mt-16 border-t border-ink-700 pt-16 md:mt-0 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          <p className="eyebrow text-flores-400">{h.bizEyebrow}</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{h.bizTitle}</h2>
          <p className="mt-5 max-w-md text-cream-300">{h.bizText}</p>
          <Link href="/toptan" className="btn btn-ghost mt-8">
            {h.bizCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
