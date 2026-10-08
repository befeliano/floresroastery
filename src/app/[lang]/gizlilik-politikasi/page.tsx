import { legalMetadata, LegalPage } from "@/components/legal/legal-page";

export const generateMetadata = legalMetadata("gizlilik-politikasi");

export default function Page() {
  return <LegalPage slug="gizlilik-politikasi" />;
}
