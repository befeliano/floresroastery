import type { Metadata } from "next";
import { OrderLookupForm } from "@/components/forms/order-lookup-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Sipariş Takibi",
  description: "Flores Roastery siparişinizin durumunu sipariş numarası ve e-posta adresinizle sorgulayın.",
  alternates: { canonical: "/siparis-takip" },
};

export default function OrderTrackingPage() {
  return (
    <>
      <PageHeader eyebrow="Destek" title="Sipariş takibi" intro="Kahveniz kavrulma, paketleme ya da kargo aşamasında mı? Hemen öğrenin." />
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <OrderLookupForm />
      </div>
    </>
  );
}
