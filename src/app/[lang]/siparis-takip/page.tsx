import type { Metadata } from "next";
import { OrderLookupForm } from "@/components/forms/order-lookup-form";
import { PageHeader } from "@/components/page-header";
import { pages } from "@/i18n/messages/pages";
import { alternates, t } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const p = await t(pages.tracking);
  return { title: p.title, description: p.description, alternates: await alternates("/siparis-takip") };
}

export default async function OrderTrackingPage() {
  const p = await t(pages.tracking);
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.heading} intro={p.intro} />
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-28 md:px-10">
        <OrderLookupForm />
      </div>
    </>
  );
}
