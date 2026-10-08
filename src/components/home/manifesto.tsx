import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";

/** "We are Flores" — sola hizalı manifesto; arkada yavaşça dönen Flores çiçeği */
export function Manifesto() {
  return (
    <section className="grain relative isolate overflow-hidden">
      <Image src={photos.roastery.src} alt={photos.roastery.alt} fill quality={60} sizes="100vw" className="-z-20 object-cover object-[50%_35%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink-950 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

      {/* dev çiçek filigranı */}
      <Image
        src="/logo.webp"
        alt=""
        width={636}
        height={636}
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 w-[44rem] max-w-none -translate-y-1/2 animate-[spin_90s_linear_infinite] opacity-[0.07] motion-reduce:animate-none"
      />

      <div className="mx-auto grid max-w-[1440px] items-end gap-12 px-5 py-32 md:px-10 md:py-44 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="eyebrow reveal text-flores-300">Manifesto</p>
          <h2 lang="en" className="reveal mt-6 font-serif text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.88]">
            We are <em className="text-flores-300">Flores</em>
            <span className="text-flores-400">.</span>
          </h2>
        </div>
        <div className="reveal border-l border-flores-500/40 pl-8">
          <p className="text-lg leading-relaxed text-cream-100 md:text-xl">
            Kahvenin nereden geldiğini, kimin emeğiyle yetiştiğini ve nasıl kavrulduğunu saklamıyoruz. Üreticisini tanıdığımız lotları doğrudan
            ticaretle seçiyor, Eskişehir&apos;deki Kuban kavurucumuzda haftalık kavuruyoruz. Her kutunun yanında kahvenin künyesi yazar.
          </p>
          <Link href="/hikayemiz#seffaflik" className="btn btn-ghost mt-10 bg-black/20 backdrop-blur-sm">
            Şeffaflık yaklaşımımız
          </Link>
        </div>
      </div>
    </section>
  );
}
