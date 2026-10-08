import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

/** Coffee Bar ve toptan satış yönlendirmesi */
export function VisitUs() {
  return (
    <section className="relative isolate overflow-hidden border-t border-ink-800">
      <Image src={photos.boxesNature.src} alt={photos.boxesNature.alt} fill quality={60} sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div className="mx-auto grid max-w-[1440px] gap-px px-5 py-24 md:grid-cols-2 md:px-10 md:py-32">
        <div className="reveal pr-6">
          <p className="eyebrow text-flores-400">Eskişehir&apos;de</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Coffee Bar&apos;da bir fincan</h2>
          <p className="mt-5 max-w-md text-cream-300">
            Kahvelerimizi kavrulduğu yerde, barmenlerimizin elinden deneyin. {site.store.address}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/coffee-bar" className="btn btn-primary">
              Randevu al
            </Link>
            <a href={site.store.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Yol tarifi
            </a>
          </div>
        </div>
        <div className="reveal mt-16 border-t border-ink-700 pt-16 md:mt-0 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          <p className="eyebrow text-flores-400">İşletmeler için</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Toptan kahve</h2>
          <p className="mt-5 max-w-md text-cream-300">
            Kafe, restoran ve ofisler için düzenli taze kavrum kahve tedariki — B2B portalımızdan sipariş verin.
          </p>
          <Link href="/toptan" className="btn btn-ghost mt-8">
            Toptan satış
          </Link>
        </div>
      </div>
    </section>
  );
}
