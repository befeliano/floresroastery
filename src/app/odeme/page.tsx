import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { PageHeader } from "@/components/page-header";
import { isCardPaymentAvailable } from "@/lib/payments/iyzico";

export const metadata: Metadata = {
  title: "Ödeme",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader eyebrow="Güvenli ödeme" title="Siparişinizi tamamlayın" />
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <CheckoutForm iyzicoEnabled={isCardPaymentAvailable()} />
      </div>
    </>
  );
}
