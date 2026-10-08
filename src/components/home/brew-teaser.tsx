import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";

const preview = [
  { t: "0:00", label: "Ön ıslatma", g: "45 g" },
  { t: "0:45", label: "Spiral döküş", g: "150 g" },
  { t: "1:15", label: "Spiral döküş", g: "250 g" },
  { t: "2:45", label: "Süzülme biter", g: "" },
];

export function BrewTeaser() {
  return (
    <section className="mx-auto grid w-full max-w-[1440px] items-center gap-16 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2">
      <div className="reveal arch relative mx-auto aspect-[3/4] w-full max-w-md">
        <Image src={photos.pourOverGrinder.src} alt={photos.pourOverGrinder.alt} fill quality={75} sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" />
      </div>

      <div className="reveal">
        <p className="eyebrow text-flores-400">Demleme rehberi</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
          Saniye saniye, <em className="text-flores-300">fincan fincan.</em>
        </h2>
        <p className="mt-6 max-w-lg text-lg text-cream-300">
          Her kahvemizin sayfasında, o çekirdek için kalibre ettiğimiz filtre ve espresso tarifleri var. Zamanlayıcıyı başlatın, terazinizi
          sıfırlayın ve adımları takip edin.
        </p>

        <div className="relative mt-12 max-w-lg">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] h-px bg-ink-600" />
          <span aria-hidden className="absolute left-0 top-[7px] h-px w-2/3 bg-flores-500" />
          <ol className="grid grid-cols-4 gap-2">
            {preview.map((s, i) => (
              <li key={s.t} className="relative pt-7">
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 size-[15px] rounded-full border-2 ${i < 3 ? "border-flores-500 bg-ink-950" : "border-ink-500 bg-ink-950"}`}
                />
                <span className="block font-mono text-sm text-flores-300">{s.t}</span>
                <span className="mt-1 block text-sm text-cream-100">{s.label}</span>
                {s.g && <span className="block font-mono text-xs text-cream-500">{s.g}</span>}
              </li>
            ))}
          </ol>
        </div>

        <Link href="/demleme-rehberi" className="btn btn-primary mt-12">
          Rehberi aç
        </Link>
      </div>
    </section>
  );
}
