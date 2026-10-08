import { legalMetadata, LegalPage } from "@/components/legal/legal-page";

export const metadata = legalMetadata("on-bilgilendirme-formu");

export default function Page() {
  return <LegalPage slug="on-bilgilendirme-formu" />;
}
