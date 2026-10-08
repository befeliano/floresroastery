import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { legalLinks } from "@/content/legal";
import { site } from "@/lib/site";

type FooterLink = { href: string; label: string; en?: boolean; external?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Mağaza",
    links: [
      { href: "/kahveler", label: "Tüm Kahveler" },
      { href: "/kategori/single-origin", label: "Single Origin", en: true },
      { href: "/kategori/blends", label: "Blends", en: true },
      { href: "/kategori/espresso", label: "Espresso", en: true },
      { href: "/kahveler?koleksiyon=ruso-exotics", label: "Ruso Exotics", en: true },
    ],
  },
  {
    title: "Destek",
    links: [
      { href: "/siparis-takip", label: "Sipariş Takibi" },
      { href: "/iade-talebi", label: "İade Talebi" },
      { href: "/teslimat-ve-iade-sartlari", label: "Teslimat & İade" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
  {
    title: "Flores",
    links: [
      { href: "/hikayemiz", label: "Hikayemiz" },
      { href: "/demleme-rehberi", label: "Demleme Rehberi" },
      { href: "/toptan", label: "Toptan Satış" },
      { href: "/coffee-bar", label: "Coffee Bar Randevu" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-ink-700 bg-ink-950">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-4xl md:text-5xl">
              Bahçemize <em className="text-flores-300">katılın</em>
            </h2>
            <p className="mt-5 max-w-lg text-cream-300">
              Yeni hasatlar, sınırlı Ruso Exotics lotları, demleme notları ve kavurma günlüğümüzden haberler. Ayda en fazla iki e-posta.
            </p>
            <NewsletterForm />
            <address className="mt-8 space-y-2 text-sm not-italic text-cream-400">
              <p>{site.store.address}</p>
              <p>
                <a href={site.phoneHref} className="hover:text-flores-300">
                  {site.phone}
                </a>{" "}
                ·{" "}
                <a href={`mailto:${site.email}`} className="hover:text-flores-300">
                  {site.email}
                </a>
              </p>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-sans text-lg font-normal text-cream-50">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="eyebrow link-underline text-cream-300 hover:text-flores-300">
                          {l.label} ↗
                        </a>
                      ) : (
                        <Link href={l.href} lang={l.en ? "en" : undefined} className="eyebrow link-underline text-cream-300 hover:text-flores-300">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* kayan slogan — kutunun yan yüzündeki "Where every bean has a story" */}
        <div aria-hidden className="relative -mx-5 mt-24 select-none overflow-hidden md:-mx-10">
          <div className="flex w-max animate-[marquee_40s_linear_infinite] motion-reduce:animate-none">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0 items-center gap-10 pr-10 font-serif text-[clamp(4rem,11vw,10rem)] italic leading-[1.1] text-transparent [-webkit-text-stroke:1px_var(--color-ink-500)]">
                Where every bean has a story
                <Image src="/logo.webp" alt="" width={96} height={96} className="size-[0.6em] opacity-40" />
                Her çekirdeğin bir hikâyesi var
                <Image src="/logo.webp" alt="" width={96} height={96} className="size-[0.6em] opacity-40" />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-ink-700 pt-8 text-xs text-cream-500 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.webp" alt="" width={24} height={24} className="size-6" />
            <span>
              © <CurrentYear /> {site.company.legalName}
            </span>
          </div>
          <nav aria-label="Yasal" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-cream-200">
                {l.label}
              </Link>
            ))}
          </nav>
          <Image
            src="/payment-logos.png"
            alt="iyzico, Mastercard, Visa, American Express ve Troy ile güvenli ödeme"
            width={432}
            height={28}
            className="h-auto w-56 rounded-sm bg-white px-2 py-1"
          />
        </div>
      </div>
    </footer>
  );
}

/** cacheComponents altında "new Date()" önbelleklenmiş bir kapsamda olmalı */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
