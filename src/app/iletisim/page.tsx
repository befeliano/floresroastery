import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { photos } from "@/lib/photos";
import { storeSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: `Flores Roastery ile iletişime geçin — ${site.store.address} · ${site.phone} · ${site.email}`,
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={storeSchema()} />
      <PageHeader eyebrow="İletişim" title="Bir fincan sohbet?" intro="Siparişleriniz, kahvelerimiz, toptan satış ya da sadece bir merhaba için yazın." />
      <div className="mx-auto mb-16 w-full max-w-[1440px] px-5 md:px-10">
        <div className="relative aspect-[3/2] max-w-[680px] overflow-hidden rounded-sm">
          <Image src={photos.v60Bar.src} alt={photos.v60Bar.alt} fill preload sizes="(min-width: 768px) 680px, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-[1440px] gap-16 px-5 pb-28 md:px-10 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-10">
          <div>
            <h2 className="eyebrow text-flores-400">Coffee Bar & Roastery</h2>
            <p className="mt-3 text-lg">{site.store.address}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={site.store.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-flores-300 underline underline-offset-4">
                Yol tarifi ↗
              </a>
              <Link href="/coffee-bar" className="text-sm text-flores-300 underline underline-offset-4">
                Tadım randevusu →
              </Link>
            </div>
          </div>
          <div>
            <h2 className="eyebrow text-flores-400">Telefon & e-posta</h2>
            <p className="mt-3">
              <a href={site.phoneHref} className="text-lg hover:text-flores-300">
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="text-lg hover:text-flores-300">
                {site.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="eyebrow text-flores-400">Toptan satış</h2>
            <Link href="/toptan" className="mt-3 block hover:text-flores-300">
              Toptan satış sayfası →
            </Link>
          </div>
          <div className="text-sm text-cream-500">
            <h2 className="eyebrow text-cream-400">Şirket bilgileri</h2>
            <p className="mt-3">{site.company.legalName}</p>
            <p className="mt-1">{site.company.address}</p>
          </div>
        </aside>
        <ContactForm />
      </div>
    </>
  );
}
