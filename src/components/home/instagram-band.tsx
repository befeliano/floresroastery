import Image from "next/image";
import { pages } from "@/i18n/messages/pages";
import { localPhotos, t } from "@/i18n/server";
import { site } from "@/lib/site";

export function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

/** Ana sayfa — @floresroastery Instagram şeridi (API yok; atölye fotoğrafları hesaba bağlanır) */
export async function InstagramBand() {
  const h = await t(pages.home);
  const p = await localPhotos();
  const tiles = [p.roastery, p.cuppingPour, p.coffeeBarJars, p.espressoShot, p.boxesNature, p.pourOver];
  return (
    <section className="border-t border-ink-800 py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-flores-400">{h.instaEyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-flores-300">
                {site.instagram.handle}
              </a>
            </h2>
            <p className="mt-4 text-cream-300">{h.instaText}</p>
          </div>
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-fit gap-2">
            <InstagramIcon />
            {h.instaFollow}
          </a>
        </div>
        <ul className="reveal mt-10 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
          {tiles.map((ph) => (
            <li key={ph.src}>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${ph.alt} — Instagram ${site.instagram.handle}`}
                className="group relative block aspect-square overflow-hidden rounded-sm"
              >
                <Image src={ph.src} alt="" fill quality={75} sizes="(min-width: 768px) 16vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-ink-950/0 text-cream-50 opacity-0 transition group-hover:bg-ink-950/45 group-hover:opacity-100">
                  <InstagramIcon className="size-7" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
