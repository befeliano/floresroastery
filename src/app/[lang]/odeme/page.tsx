import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { PageHeader } from "@/components/page-header";
import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";
import { isCardPaymentAvailable } from "@/lib/payments/iyzico";

export async function generateMetadata(): Promise<Metadata> {
  const p = await t(pages.checkoutPage);
  return { title: p.title, robots: { index: false, follow: false } };
}

export default async function CheckoutPage() {
  const p = await t(pages.checkoutPage);
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.heading} />
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <CheckoutForm iyzicoEnabled={isCardPaymentAvailable()} />
      </div>
    </>
  );
}
