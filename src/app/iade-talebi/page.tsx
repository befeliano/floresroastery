import type { Metadata } from "next";
import Link from "next/link";
import { ReturnForm } from "@/components/forms/return-form";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İade Talebi & Cayma Bildirimi",
  description: "Flores Roastery siparişiniz için cayma hakkı bildirimi ve iade talebi oluşturun.",
  alternates: { canonical: "/iade-talebi" },
};

const steps = [
  { t: "Bildirin", d: "Teslimattan itibaren 14 gün içinde bu formu doldurun ya da bize e-posta ile yazın." },
  { t: "Paketleyin", d: "Ürünü orijinal kutusu ve faturasıyla, kullanılmamış ve hasarsız şekilde hazırlayın." },
  { t: "Gönderin", d: "Ürünü size ileteceğimiz iade adresine kargoyla gönderin." },
  { t: "İade", d: "Bildiriminiz bize ulaştıktan sonra en geç 10 gün içinde ödemeniz iade edilir." },
];

export default function ReturnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Destek"
        title="İade talebi"
        intro={
          <>
            Siparişinizden memnun kalmadıysanız buradayız. Hasarlı ya da hatalı teslimatlarda masraf bizden.{" "}
            <Link href="/teslimat-ve-iade-sartlari" className="text-flores-300 underline underline-offset-4">
              Teslimat ve iade şartları
            </Link>
          </>
        }
      />
      <div className="mx-auto grid w-full max-w-[1440px] gap-16 px-5 pb-28 md:px-10 lg:grid-cols-[1fr_22rem]">
        <ReturnForm />
        <aside className="space-y-8 self-start">
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="font-mono text-sm text-flores-400">0{i + 1}</span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className="mt-1 text-sm text-cream-400">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="rounded-sm border border-amber-300/30 bg-amber-300/5 p-4 text-sm text-amber-100">
            Öğütülmüş kahveler kişisel talebe göre hazırlandığından ve ambalajı açılmış gıda ürünleri hijyen gereği cayma hakkı kapsamı
            dışındadır. Hasarlı veya hatalı ürünlerde bu sınır geçerli değildir.
          </p>
          <p className="text-sm text-cream-400">
            Sorunuz mu var?{" "}
            <a href={`mailto:${site.email}`} className="text-flores-300 underline underline-offset-4">
              {site.email}
            </a>{" "}
            ·{" "}
            <a href={site.phoneHref} className="text-flores-300 underline underline-offset-4">
              {site.phone}
            </a>
          </p>
        </aside>
      </div>
    </>
  );
}
