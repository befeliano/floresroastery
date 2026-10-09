import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "@/i18n/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { InstagramIcon } from "@/components/home/instagram-band";
import { legalLinks } from "@/content/legal";
import { pages } from "@/i18n/messages/pages";
import { tools } from "@/i18n/messages/tools";
import { CITIES } from "@/content/seo/cities";
import { getLocale, t } from "@/i18n/server";
import { site } from "@/lib/site";

type FooterLink = { href: string; label: string; en?: boolean; external?: boolean };

async function columns(): Promise<{ title: string; links: FooterLink[] }[]> {
  const f = await t(pages.footer);
  const tl = await t(tools.links);
  const tr = (await getLocale()) === "tr";
  return [
  {
    title: f.shop,
    links: [
      { href: "/kahveler", label: f.allCoffees },
      { href: "/kategori/single-origin", label: "Single Origin", en: true },
      { href: "/kategori/blends", label: "Blends", en: true },
      { href: "/kategori/espresso", label: "Espresso", en: true },
      { href: "/kahveler?koleksiyon=ruso-exotics", label: "Ruso Exotics", en: true },
      { href: "/kahve-bulucu", label: tl.finder },
      { href: "/karsilastir", label: tl.compare },
      { href: "/tat-carki", label: tl.wheel },
      { href: "/koken-haritasi", label: tl.map },
    ],
  },
  {
    title: f.support,
    links: [
      { href: "/siparis-takip", label: f.tracking },
      { href: "/iade-talebi", label: f.returnRequest },
      { href: "/teslimat-ve-iade-sartlari", label: f.deliveryReturns },
      { href: "/iletisim", label: f.contact },
    ],
  },
  {
    title: "Flores",
    links: [
      { href: "/hikayemiz", label: f.story },
      { href: "/demleme-rehberi", label: f.brewGuide },
      ...(tr ? [{ href: "/rehber", label: f.guides }] : []),
      { href: "/toptan", label: f.wholesale },
      { href: "/coffee-bar", label: f.coffeeBar },
    ],
  },
  ];
}

export async function SiteFooter() {
  const f = await t(pages.footer);
  const legal = await t(pages.legal.links);
  const cols = await columns();
  const tr = (await getLocale()) === "tr";
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-ink-700 bg-ink-950">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-4xl md:text-5xl">
              {f.join.a}
              <em className="text-flores-300">{f.join.em}</em>
            </h2>
            <p className="mt-5 max-w-lg text-cream-300">{f.joinText}</p>
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
              <p>
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base text-cream-200 hover:text-flores-300">
                  <InstagramIcon />
                  Instagram {site.instagram.handle}
                </a>
              </p>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {cols.map((col) => (
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

        {tr && (
          <nav aria-label="Şehirlere kahve" className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink-800 pt-8 text-xs text-cream-500">
            <span>Taze kavrum gönderiyoruz:</span>
            {CITIES.map((c) => (
              <Link key={c.slug} href={`/kahve/${c.slug}`} className="hover:text-flores-300">
                {c.city} kahve
              </Link>
            ))}
          </nav>
        )}

        {/* kayan slogan — kutunun yan yüzündeki "Where every bean has a story" */}
        <div aria-hidden className="relative -mx-5 mt-24 select-none overflow-hidden md:-mx-10">
          <div className="flex w-max animate-[marquee_40s_linear_infinite] motion-reduce:animate-none">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0 items-center gap-10 pr-10 font-serif text-[clamp(4rem,11vw,10rem)] italic leading-[1.1] text-transparent [-webkit-text-stroke:1px_var(--color-ink-500)]">
                Where every bean has a story
                <Image src="/logo.webp" alt="" width={96} height={96} className="size-[0.6em] opacity-40" />
                {f.marquee === "Where every bean has a story" ? "Flores Roastery · Eskişehir" : f.marquee}
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
          <nav aria-label={f.legalAria} className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-cream-200">
                {legal[l.href.slice(1) as keyof typeof legal] ?? l.label}
              </Link>
            ))}
          </nav>
          <Image
            src="/payment-logos.png"
            alt={f.paymentAlt}
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
