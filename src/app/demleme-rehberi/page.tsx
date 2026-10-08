import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RatioCalculator } from "@/components/brew/ratio-calculator";
import { PageHeader } from "@/components/page-header";
import { BrewTabs } from "@/components/product/brew-guide";
import { chemex, espresso, frenchPress, kalita, v60 } from "@/lib/commerce/brew";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Demleme Rehberi — V60, Chemex, French Press, Espresso",
  description:
    "Specialty kahveyi evde demlemek için saniye saniye tarifler: V60, Kalita Wave, Chemex, French Press ve espresso. Oran hesaplayıcı ve öğütme rehberi.",
  alternates: { canonical: "/demleme-rehberi" },
};

const GRIND = [
  { method: "Türk Kahvesi", size: "Çok ince · pudra", micron: "~100 µm", pct: 6 },
  { method: "Espresso", size: "İnce", micron: "~250 µm", pct: 18 },
  { method: "Moka Pot", size: "İnce-orta", micron: "~400 µm", pct: 32 },
  { method: "V60 / Origami", size: "Orta-ince", micron: "~600 µm", pct: 48 },
  { method: "Kalita / Filtre makinesi", size: "Orta", micron: "~650 µm", pct: 54 },
  { method: "Chemex", size: "Orta-kalın", micron: "~800 µm", pct: 66 },
  { method: "French Press", size: "Kalın", micron: "~1000 µm", pct: 82 },
  { method: "Cold Brew", size: "Çok kalın", micron: "~1200 µm", pct: 96 },
];

export default function BrewGuidePage() {
  const tabs = [
    { key: "v60", label: "V60", guide: v60() },
    { key: "kalita", label: "Kalita", guide: kalita() },
    { key: "chemex", label: "Chemex", guide: chemex() },
    { key: "french", label: "French Press", guide: frenchPress() },
    { key: "espresso", label: "Espresso", guide: espresso() },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Demleme rehberi"
        title={
          <>
            Saniye saniye, <em className="text-flores-300">fincan fincan.</em>
          </>
        }
        intro={
          <>
            Zamanlayıcıyı başlatın, terazinizi sıfırlayın ve adımları izleyin. Her kahvemizin sayfasında o çekirdeğe özel kalibre edilmiş tarif de var —{" "}
            <Link href="/kahveler" className="text-flores-300 underline underline-offset-4">
              kahvelere göz atın
            </Link>
            .
          </>
        }
      />

      {/* geniş görsel bant */}
      <div className="mx-auto mb-16 w-full max-w-[1440px] px-5 md:px-10">
        <div className="relative aspect-[21/9] overflow-hidden rounded-sm">
          <Image src={photos.v60Pour.src} alt={photos.v60Pour.alt} fill preload sizes="(min-width: 1440px) 1360px, 100vw" className="object-cover object-[50%_60%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        </div>
      </div>

      <BrewTabs tabs={tabs} heading={false} />

      <section className="mx-auto mt-28 grid w-full max-w-[1440px] gap-12 px-5 pb-28 md:px-10 lg:grid-cols-[1fr_26rem]">
        <div>
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-sm lg:hidden">
            <Image src={photos.brewKit.src} alt={photos.brewKit.alt} fill sizes="100vw" className="object-cover" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl">Öğütme rehberi</h2>
          <p className="mt-4 max-w-xl text-cream-300">
            Temas süresi uzadıkça öğütme kalınlaşır. Aşağıdaki değerler başlangıç noktasıdır; acı ve kuru bir fincan için kalınlaştırın, ekşi ve
            sulu bir fincan için inceltin.
          </p>
          <ul className="mt-10 space-y-5">
            {GRIND.map((g) => (
              <li key={g.method} className="grid grid-cols-[minmax(0,10rem)_1fr] items-center gap-6 sm:grid-cols-[13rem_1fr_6rem]">
                <div>
                  <p className="text-cream-100">{g.method}</p>
                  <p className="text-xs text-cream-500">{g.size}</p>
                </div>
                <div className="relative h-2 rounded-full bg-ink-800">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-flores-500" style={{ width: `${g.pct}%` }} />
                </div>
                <p className="hidden text-right font-mono text-sm text-cream-400 sm:block">{g.micron}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-8">
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-sm lg:block">
            <Image src={photos.brewKit.src} alt={photos.brewKit.alt} fill sizes="26rem" className="object-cover" />
          </div>
          <RatioCalculator />
        </div>
      </section>
    </>
  );
}
