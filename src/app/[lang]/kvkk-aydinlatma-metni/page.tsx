import { legalMetadata, LegalPage } from "@/components/legal/legal-page";

export const generateMetadata = legalMetadata("kvkk-aydinlatma-metni");

export default function Page() {
  return <LegalPage slug="kvkk-aydinlatma-metni" />;
}
