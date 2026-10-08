import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hikayemiz",
  description:
    "Flores Roastery'nin hikâyesi: Eskişehir'de Kuban kavurucuda haftalık kavrum, Endonezya'dan doğrudan ticaret Ruso Exotics serisi ve şeffaf tedarik zinciri.",
  alternates: { canonical: "/hikayemiz" },
};

const transparency = [
  { k: "Köken", v: "Ülke, bölge, rakım ve — biliyorsak — üretici ile çiftlik adı her kutunun yan yüzünde ve ürün sayfasında yazar." },
  { k: "İşleme", v: "Washed, natural, honey, anaerobik ya da wet hulled: kirazın çekirdeğe nasıl dönüştüğünü açıkça belirtiriz." },
  { k: "Kavrum", v: "Paketteki tarih kavrum tarihidir. Tüm çekirdeklerimiz haftalık kavrulur; en iyi lezzet için 1 ay içinde tüketin." },
  { k: "Tedarik", v: "Ruso Exotics serisinde Java'daki üreticilerle doğrudan çalışırız; aracıların payı üreticiye ve tazeliğe kalır." },
];

export default function StoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hikayemiz"
        title={
          <>
            Harika kahve sadece tadılmamalı, <em className="text-flores-300">hissedilmelidir.</em>
          </>
        }
        intro={site.about}
      />

      {/* Kavurma atölyesi */}
      <section className="mx-auto grid w-full max-w-[1440px] items-center gap-14 px-5 py-16 md:px-10 lg:grid-cols-2">
        <div className="arch relative mx-auto aspect-[9/14] w-full max-w-md">
          <Image src={photos.roastery.src} alt={photos.roastery.alt} fill preload quality={75} sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" />
        </div>
        <div className="reveal">
          <p className="eyebrow text-flores-400">Eskişehir · Kavurma atölyesi</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight">Kalpten kavuruyoruz</h2>
          <div className="mt-6 max-w-lg space-y-5 text-lg leading-relaxed text-cream-300">
            <p>
              Çekirdeklerimiz Tepebaşı&apos;ndaki atölyemizde, Kuban kavurucumuzda haftalık olarak kavrulur. Her kahveyi kendi karakterine göre
              profilliyor; çiçeksi bir Java honey&apos;yi narin, gövdeli bir harmanı cesur kavuruyoruz.
            </p>
            <p>
              Paketin üzerindeki tarih, kahvenizin kavrulduğu gündür. Kavurma derecesini, demleme önerisini ve kahvenin künyesini her ürün
              sayfasında bulabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Ruso Exotics */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-24 md:px-10">
        <div className="relative overflow-hidden rounded-sm">
          <Image src={photos.storyIndonesia.src} alt={photos.storyIndonesia.alt} width={1600} height={560} quality={75} sizes="100vw" className="h-auto w-full" />
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <h2 className="font-serif text-5xl leading-tight">
            <span lang="en">A journey from farmers&apos; hands</span> <em className="text-flores-300">to our roastery.</em>
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-cream-300">
            <p>
              Ruso Exotics, Endonezya kahvelerini doğrudan ticaretle Türkiye&apos;ye getiren kendi markamız. Batı Java&apos;nın Garut bölgesinde, sisli tepelerde ve Papandayan
              Yanardağı&apos;nın eteklerinde çalışan üreticilerle bizzat tanıştık; lotlarımızı onlarla el sıkışarak seçiyoruz.
            </p>
            <p>
              Direct Trade felsefemizle aracıları ortadan kaldırıyor, hem üreticiyi destekliyor hem de en taze, en nitelikli çekirdekleri size
              ulaştırıyoruz. Bu yüzden Ruso Exotics lotları sınırlıdır — bittiğinde, bir sonraki hasadı bekleriz.
            </p>
            <Link href="/kahveler?koleksiyon=ruso-exotics" className="btn btn-ghost mt-4">
              Ruso Exotics kahveleri
            </Link>
          </div>
        </div>
      </section>

      {/* Şeffaflık */}
      <section id="seffaflik" className="scroll-mt-24 border-y border-ink-800 bg-ink-900 py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow text-flores-400">Şeffaflık</p>
          <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-tight">Kutunun yan yüzünde yazanlar</h2>
          <dl className="mt-14 grid gap-px bg-ink-700 md:grid-cols-2 lg:grid-cols-4">
            {transparency.map((t) => (
              <div key={t.k} className="bg-ink-900 p-8">
                <dt className="font-serif text-2xl text-cream-50">{t.k}</dt>
                <dd className="mt-3 leading-relaxed text-cream-300">{t.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative">
        <Image src={photos.boxesNature.src} alt={photos.boxesNature.alt} width={2000} height={707} quality={75} sizes="100vw" className="h-auto w-full" />
        <p lang="en" className="mx-auto max-w-[1440px] px-5 py-16 text-center font-serif text-4xl italic md:px-10 md:text-6xl">
          Where every bean has a story.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-[1440px] flex-wrap justify-center gap-4 px-5 pb-28 md:px-10">
        <Link href="/kahveler" className="btn btn-primary">
          Kahveleri keşfet
        </Link>
        <Link href="/coffee-bar" className="btn btn-ghost">
          Coffee Bar randevusu
        </Link>
      </section>
    </>
  );
}
