import { distanceSalesContract, preInformationForm } from "./distance-sales";
import { kvkkPolicy } from "./kvkk";
import { privacyPolicy } from "./privacy";
import { returnsPolicy } from "./returns";
import type { LegalDoc } from "./types";

export type { ContractContext } from "./distance-sales";
export { distanceSalesContract, preInformationForm } from "./distance-sales";
export type { LegalBlock, LegalDoc } from "./types";

/** /[slug] altında yayınlanan yasal sayfalar (mevcut sitedeki URL'lerle aynı) */
export const legalDocs: LegalDoc[] = [privacyPolicy, kvkkPolicy, distanceSalesContract(), preInformationForm(), returnsPolicy];

export const getLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);

export const legalLinks = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kvkk-aydinlatma-metni", label: "KVKK Aydınlatma Metni" },
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/on-bilgilendirme-formu", label: "Ön Bilgilendirme Formu" },
  { href: "/teslimat-ve-iade-sartlari", label: "Teslimat ve İade Şartları" },
];
