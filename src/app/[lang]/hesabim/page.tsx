import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LogoutButton } from "@/components/account/logout-button";
import { ReorderButton } from "@/components/account/reorder-button";
import { localizeCard } from "@/i18n/content";
import { getProducts, toCard, type Product } from "@/lib/commerce";
import type { CartItem } from "@/lib/cart/store";
import { localeMeta } from "@/i18n/config";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { ui } from "@/i18n/messages/ui";
import { getLocale, href, t } from "@/i18n/server";
import { getSession } from "@/lib/auth/session";
import { getCustomer, getCustomerOrders, toProfile, type WooCustomer } from "@/lib/commerce/customers";
import { GRIND_TO_WOO, orderPayUrl, type WooOrder } from "@/lib/commerce/woocommerce";
import { WHOLESALE_SLUG } from "@/lib/commerce/wholesale";
import type { Locale } from "@/i18n/config";

const WOO_TO_GRIND = Object.fromEntries(Object.entries(GRIND_TO_WOO).map(([k, v]) => [v, k]));

/** Siparişin hâlâ satılan kalemleri → güncel fiyatlı sepet satırları */
function reorderItems(o: WooOrder, products: Map<string, Product>, locale: Locale) {
  const items: CartItem[] = [];
  let skipped = 0;
  for (const l of o.line_items) {
    const p = products.get(String(l.product_id));
    const v = p?.variants.find((x) => x.id === String(l.variation_id)) ?? (p?.variants.length === 1 ? p.variants[0] : undefined);
    if (!p || !v || !v.inStock || p.slug === WHOLESALE_SLUG) {
      skipped++;
      continue;
    }
    const raw = String(l.meta_data.find((m) => m.key === "grind-size")?.value ?? "");
    const grind = WOO_TO_GRIND[raw] ?? (p.grindOptions.includes(raw) ? raw : (p.grindOptions[0] ?? ""));
    const card = localizeCard(toCard(p), locale);
    items.push({
      slug: p.slug,
      variantId: v.id,
      grind: p.grindOptions.includes(grind) ? grind : (p.grindOptions[0] ?? ""),
      quantity: Math.min(l.quantity, 20),
      name: card.name,
      subtitle: card.subtitle,
      variantLabel: v.label,
      unitPrice: v.price,
      image: p.image.card,
    });
  }
  return { items, skipped };
}
import { formatPrice } from "@/lib/format";
import { wooStatus } from "@/lib/orders/woo-status";

export async function generateMetadata(): Promise<Metadata> {
  const a = await t(pages.account);
  return { title: a.title, robots: { index: false, follow: false } };
}

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <Suspense fallback={<AccountSkeleton />}>
        <Account />
      </Suspense>
    </div>
  );
}

const BADGE: Record<ReturnType<typeof wooStatus>, string> = {
  "awaiting-payment": "border-amber-300/40 bg-amber-300/10 text-amber-100",
  processing: "border-flores-400/40 bg-flores-500/10 text-flores-100",
  shipped: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  delivered: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  cancelled: "border-ink-600 bg-ink-800 text-cream-400",
};

async function Account() {
  const session = await getSession();
  if (!session) redirect(await href("/giris?next=/hesabim"));
  const a = await t(pages.account);
  const u = await t(ui);
  const locale = await getLocale();

  let customer: WooCustomer | null = null;
  let orders: WooOrder[] = [];
  let failed = false;
  try {
    [customer, orders] = await Promise.all([getCustomer(session.sub), getCustomerOrders(session.sub)]);
  } catch (err) {
    console.error("[hesabim]", err);
    failed = true;
  }
  const profile = customer ? toProfile(customer) : null;
  const productsById = new Map((await getProducts()).map((p) => [p.id, p]));
  const date = new Intl.DateTimeFormat(localeMeta[locale].intl, { dateStyle: "long" });
  const statusLabel = (s: WooOrder["status"]) =>
    s === "completed" ? u.status.completed : s === "refunded" ? u.status.cancelled : u.status[wooStatus(s)];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-flores-400">{a.title}</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">{a.hello.replace("{name}", profile?.firstName || session.name)}</h1>
          <p className="mt-3 text-cream-400">{session.email}</p>
        </div>
        <LogoutButton />
      </div>

      {failed && (
        <p role="alert" className="mt-10 rounded-sm border border-amber-300/30 bg-amber-300/5 p-4 text-sm text-amber-100">
          {a.loadError}
        </p>
      )}

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="orders-title">
          <h2 id="orders-title" className="font-serif text-3xl">
            {a.orders}
          </h2>
          {orders.length === 0 ? (
            <div className="mt-6 rounded-sm border border-ink-700 bg-ink-900 p-6 text-cream-300">
              <p>{a.noOrders}</p>
              <Link href="/kahveler" className="btn btn-primary mt-5">
                {u.common.exploreCoffees}
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {orders.map((o) => {
                const status = wooStatus(o.status);
                const payUrl = o.status === "pending" ? orderPayUrl(o, locale) : undefined;
                const again = payUrl ? { items: [], skipped: 0 } : reorderItems(o, productsById, locale);
                return (
                  <li key={o.id} className="rounded-sm border border-ink-700 bg-ink-900 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-mono text-sm">
                        #{o.number} <span className="text-cream-500">· {date.format(new Date(o.date_created))}</span>
                      </p>
                      <span className={`rounded-full border px-3 py-1 text-xs ${BADGE[status]}`}>{statusLabel(o.status)}</span>
                    </div>
                    <ul className="mt-4 space-y-1 text-sm text-cream-200">
                      {o.line_items.map((l, i) => (
                        <li key={i} className="flex justify-between gap-4">
                          <span className="min-w-0">
                            {l.name} <span className="text-cream-500">× {l.quantity}</span>
                          </span>
                          <span className="shrink-0 font-mono text-cream-400">{formatPrice(Number(l.total))}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-700 pt-4">
                      <p className="text-sm text-cream-400">
                        {o.payment_method === "bacs" ? u.payment.bacs : o.payment_method ? u.payment.iyzico : "—"} · {u.common.total}{" "}
                        <span className="font-mono text-cream-50">{formatPrice(Number(o.total))}</span>
                      </p>
                      {payUrl && (
                        <a href={payUrl} className="btn btn-primary px-4 py-2.5">
                          {u.common.completePayment} →
                        </a>
                      )}
                      <ReorderButton
                        items={again.items}
                        label={a.reorder}
                        partial={again.skipped ? a.reorderPartial.replace("{n}", String(again.skipped)) : undefined}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="space-y-6">
          <section aria-labelledby="address-title" className="rounded-sm border border-ink-700 bg-ink-900 p-6">
            <h2 id="address-title" className="eyebrow text-flores-400">
              {a.address}
            </h2>
            {profile?.address ? (
              <address className="mt-4 text-sm not-italic leading-relaxed text-cream-200">
                {profile.firstName} {profile.lastName}
                <br />
                {profile.address}
                <br />
                {[profile.district, profile.city].filter(Boolean).join(" / ")} {profile.postcode}
                {profile.phone && (
                  <>
                    <br />
                    {profile.phone}
                  </>
                )}
              </address>
            ) : (
              <p className="mt-4 text-sm text-cream-400">{a.noAddress}</p>
            )}
            <p className="mt-4 text-xs text-cream-500">{a.addressNote}</p>
          </section>
          <div className="grid gap-3">
            <Link href="/kahveler" className="btn btn-primary">
              {u.common.continueShopping}
            </Link>
            <Link href="/iade-talebi" className="btn btn-ghost">
              {a.returnRequest}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function AccountSkeleton() {
  return (
    <div aria-busy className="animate-pulse space-y-6">
      <div className="h-4 w-24 rounded bg-ink-800" />
      <div className="h-14 w-2/3 rounded bg-ink-800" />
      <div className="mt-14 h-40 rounded bg-ink-900" />
      <div className="h-40 rounded bg-ink-900" />
    </div>
  );
}
