import { legalMetadata, LegalPage } from "@/components/legal/legal-page";

export const generateMetadata = legalMetadata("teslimat-ve-iade-sartlari");

export default function Page() {
  return <LegalPage slug="teslimat-ve-iade-sartlari" />;
}
