import type { Metadata } from "next";
import { OrderComplete } from "@/components/checkout/order-complete";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Siparişiniz alındı",
  robots: { index: false, follow: false },
};

export default function OrderCompletePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-28 pt-32 md:pt-40">
      <OrderComplete bank={site.bank} phone={site.phone} phoneHref={site.phoneHref} email={site.email} />
    </div>
  );
}
