import { legalMetadata, LegalPage } from "@/components/legal/legal-page";

export const generateMetadata = legalMetadata("mesafeli-satis-sozlesmesi");

export default function Page() {
  return <LegalPage slug="mesafeli-satis-sozlesmesi" />;
}
