import type { Metadata } from "next";
import { OrderComplete } from "@/components/checkout/order-complete";
import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const p = await t(pages.orderDone);
  return { title: p.title, robots: { index: false, follow: false } };
}

export default function OrderCompletePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-28 pt-32 md:pt-40">
      <OrderComplete bank={site.bank} phone={site.phone} phoneHref={site.phoneHref} email={site.email} />
    </div>
  );
}
