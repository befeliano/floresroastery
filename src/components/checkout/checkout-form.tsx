"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { LegalBlocks } from "@/components/legal/legal-document";
import { distanceSalesContract, preInformationForm, type ContractContext, type LegalDoc } from "@/content/legal";
import { postJson } from "@/lib/api-client";
import { useCart } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import { PAYMENT_LABEL } from "@/lib/orders/constants";
import { TR_CITIES } from "@/lib/tr-cities";

type ShippingOption = { id: "standard" | "courier" | "pickup"; label: string; detail: string; cost: number };

type Quote = {
  errors: string[];
  lines: { slug: string; name: string; variantLabel: string; grind: string; quantity: number; unitPrice: number; lineTotal: number }[];
  subtotal: number;
  shippingOptions: ShippingOption[];
  shippingMethod: ShippingOption | null;
  shipping: number;
  coupon: { code: string; label: string } | null;
  couponError: string | null;
  discount: number;
  total: number;
};

type Fields = "firstName" | "lastName" | "email" | "phone" | "city" | "district" | "address" | "postcode";

export function CheckoutForm({ iyzicoEnabled }: { iyzicoEnabled: boolean }) {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const openCart = useCart((s) => s.open);
  // sepet localStorage'dan yüklendi mi?
  const hydrated = useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
  const [quote, setQuote] = useState<Quote | null>(null);
  const [values, setValues] = useState<Record<Fields | "note", string>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Eskişehir",
    district: "",
    address: "",
    postcode: "",
    note: "",
  });
  const [payment, setPayment] = useState<"bacs" | "iyzico">("bacs");
  const [shippingMethod, setShippingMethod] = useState<ShippingOption["id"] | "">("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [consents, setConsents] = useState({ preInfo: false, distanceSales: false, marketing: false });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [redirect, setRedirect] = useState<{ number: string; url: string } | null>(null);
  const [doc, setDoc] = useState<LegalDoc | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // sunucudan doğrulanmış fiyat, stok, kargo ve kupon
  const cartKey = JSON.stringify(items.map((i) => [i.slug, i.variantId, i.grind, i.quantity]));
  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    let cancelled = false;
    postJson<Quote>("/api/checkout/quote", {
      items: items.map(({ slug, variantId, grind, quantity }) => ({ slug, variantId, grind, quantity })),
      city: values.city,
      shippingMethod,
      couponCode: coupon,
    })
      .then((q) => !cancelled && setQuote(q))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, cartKey, values.city, shippingMethod, coupon]);

  // seçili yöntem artık geçerli değilse (ör. il değişti) sunucunun seçtiğini kullan
  const activeShipping = quote?.shippingMethod?.id ?? "";

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const contractCtx = useMemo<ContractContext>(() => {
    const name = `${values.firstName} ${values.lastName}`.trim();
    const addr = [values.address, values.district, values.city].filter(Boolean).join(", ");
    return {
      buyer: { name: name || "—", address: addr || "—", phone: values.phone || "—", email: values.email || "—" },
      order: quote?.lines.length
        ? {
            lines: quote.lines.map((l) => ({ name: `${l.name} (${l.variantLabel}, ${l.grind})`, quantity: l.quantity, total: formatPrice(l.lineTotal) })),
            subtotal: formatPrice(quote.subtotal) + (quote.discount ? ` (kupon indirimi: −${formatPrice(quote.discount)})` : ""),
            shipping: `${quote.shippingMethod?.label ?? "Kargo"} — ${quote.shipping ? formatPrice(quote.shipping) : "Ücretsiz"}`,
            total: formatPrice(quote.total),
            paymentMethod: PAYMENT_LABEL[payment],
            deliveryAddress: addr || "—",
            deliveryCity: [values.district, values.city].filter(Boolean).join(" / ") || "—",
            recipient: name || "—",
            invoiceAddress: addr || "—",
            date: new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date()),
          }
        : undefined,
    };
  }, [values, quote, payment]);

  function openDoc(kind: "pre" | "contract") {
    setDoc(kind === "pre" ? preInformationForm(contractCtx) : distanceSalesContract(contractCtx));
    dialogRef.current?.showModal();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    if (!consents.preInfo || !consents.distanceSales) {
      setError("Siparişi tamamlamak için Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi'ni onaylayın.");
      return;
    }
    setSubmitting(true);
    // sunucu (WooCommerce) yanıt vermezse buton sonsuza kadar beklemesin
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45_000);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: values,
          note: values.note,
          paymentMethod: payment,
          shippingMethod: activeShipping,
          couponCode: coupon,
          consents,
          items: items.map(({ slug, variantId, grind, quantity }) => ({ slug, variantId, grind, quantity })),
        }),
      }).catch(() => {
        throw new Error(
          ctrl.signal.aborted
            ? "Sunucu yanıt vermedi. Siparişiniz oluşmuş olabilir — tekrar denemeden önce e-postanızı kontrol edin ya da bize WhatsApp'tan yazın."
            : "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.",
        );
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data.error ?? "Sipariş oluşturulamadı.");
      }
      try {
        sessionStorage.setItem("flores-last-order", JSON.stringify(data));
      } catch {}
      // kart: WooCommerce sipariş ödeme sayfası → iyzico; dönüşte /siparis/tamamlandi
      if (data.paymentUrl) {
        setRedirect({ number: data.orderNumber, url: data.paymentUrl });
        clear();
        window.location.assign(data.paymentUrl);
      } else {
        clear();
        router.push("/siparis/tamamlandi");
      }
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    } finally {
      clearTimeout(timer);
    }
  }

  if (redirect) return <PaymentRedirect {...redirect} />;

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <p className="font-serif text-4xl italic">Sepetiniz boş.</p>
        <p className="mt-4 text-cream-300">Ödeme adımına geçmek için önce bir kahve seçin.</p>
        <Link href="/kahveler" className="btn btn-primary mt-8">
          Kahveleri Keşfet
        </Link>
      </div>
    );
  }

  const field = (k: Fields, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`f-${k}`} className="mb-2 block text-sm text-cream-300">
        {label}
      </label>
      <input
        id={`f-${k}`}
        name={k}
        value={values[k]}
        onChange={set(k)}
        aria-invalid={!!fieldErrors[k]}
        aria-describedby={fieldErrors[k] ? `e-${k}` : undefined}
        className={`field ${fieldErrors[k] ? "border-red-400/70" : ""}`}
        {...props}
      />
      {fieldErrors[k] && (
        <p id={`e-${k}`} className="mt-1.5 text-xs text-red-300">
          {fieldErrors[k]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-[1fr_26rem] lg:gap-16">
        <div className="space-y-12">
          <p className="flex items-start gap-3 rounded-sm border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-cream-300">
            <span aria-hidden className="mt-0.5 text-flores-300">✦</span>
            <span>
              Üyelik gerekmez — misafir olarak sipariş veriyorsunuz. Sipariş numaranız ve e-postanızla{" "}
              <Link href="/siparis-takip" className="text-flores-300 underline underline-offset-4">
                siparişinizi takip edebilirsiniz
              </Link>
              .
            </span>
          </p>

          <fieldset>
            <legend className="font-serif text-3xl">Teslimat bilgileri</legend>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {field("firstName", "Ad", { autoComplete: "given-name", required: true, maxLength: 60 })}
              {field("lastName", "Soyad", { autoComplete: "family-name", required: true, maxLength: 60 })}
              {field("email", "E-posta", { type: "email", autoComplete: "email", required: true, maxLength: 254 })}
              {field("phone", "Cep telefonu", { type: "tel", autoComplete: "tel", placeholder: "05XX XXX XX XX", required: true, maxLength: 20 })}
              <div>
                <label htmlFor="f-city" className="mb-2 block text-sm text-cream-300">
                  İl
                </label>
                <select id="f-city" value={values.city} onChange={set("city")} autoComplete="address-level1" className="field">
                  {TR_CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              {field("district", "İlçe", { autoComplete: "address-level2", required: true, maxLength: 60 })}
              <div className="sm:col-span-2">
                <label htmlFor="f-address" className="mb-2 block text-sm text-cream-300">
                  Açık adres
                </label>
                <textarea
                  id="f-address"
                  value={values.address}
                  onChange={set("address")}
                  rows={3}
                  maxLength={300}
                  autoComplete="street-address"
                  placeholder="Mahalle, cadde/sokak, bina no, daire"
                  aria-invalid={!!fieldErrors.address}
                  className={`field resize-none ${fieldErrors.address ? "border-red-400/70" : ""}`}
                />
                {fieldErrors.address && <p className="mt-1.5 text-xs text-red-300">{fieldErrors.address}</p>}
              </div>
              {field("postcode", "Posta kodu (isteğe bağlı)", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 5 })}
            </div>
            <div className="mt-5">
              <label htmlFor="f-note" className="mb-2 block text-sm text-cream-300">
                Sipariş notu (isteğe bağlı)
              </label>
              <textarea id="f-note" value={values.note} onChange={set("note")} rows={2} maxLength={500} className="field resize-none" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-serif text-3xl">Teslimat yöntemi</legend>
            <div className="mt-6 grid gap-3">
              {quote?.shippingOptions.length ? (
                quote.shippingOptions.map((o) => (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer gap-4 rounded-sm border p-5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-flores-400 ${
                      activeShipping === o.id ? "border-flores-500 bg-flores-500/5" : "border-ink-600 hover:border-cream-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={activeShipping === o.id}
                      onChange={() => setShippingMethod(o.id)}
                      className="mt-1 accent-[#5fa4d6]"
                    />
                    <span className="flex-1">
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="font-medium">{o.label}</span>
                        <span className="font-mono text-sm">{o.cost ? formatPrice(o.cost) : "Ücretsiz"}</span>
                      </span>
                      <span className="mt-1 block text-sm text-cream-400">{o.detail}</span>
                    </span>
                  </label>
                ))
              ) : (
                <div className="h-20 animate-pulse rounded-sm bg-ink-900" />
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-serif text-3xl">Ödeme</legend>
            <div className="mt-6 grid gap-3">
              <PaymentOption
                checked={payment === "bacs"}
                onChange={() => setPayment("bacs")}
                title="Havale / EFT"
                text="Sipariş numaranızla birlikte hesap bilgilerimiz gösterilir. Ödemeniz onaylandığında kahveniz kavrulup kargoya verilir."
              />
              <PaymentOption
                checked={payment === "iyzico"}
                onChange={() => setPayment("iyzico")}
                disabled={!iyzicoEnabled}
                title="Kredi / Banka Kartı"
                text={
                  iyzicoEnabled
                    ? "Siparişi onayladığınızda iyzico güvenli ödeme sayfasına yönlendirilirsiniz; tek çekim veya taksitle ödeyin. Kart bilgileriniz bize hiç ulaşmaz."
                    : "Kartla ödeme yeni sitemizde çok yakında aktif olacak. Şimdilik Havale / EFT ile sipariş verebilirsiniz."
                }
                badge={<Image src="/payment-logos.png" alt="iyzico, Mastercard, Visa, American Express, Troy" width={216} height={14} className="h-auto w-48 rounded-sm bg-white p-1" />}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-sm border border-ink-700 bg-ink-900 p-5 md:p-6">
            <legend className="sr-only">Sözleşmeler ve onaylar</legend>
            <Consent checked={consents.preInfo} onChange={(v) => setConsents((c) => ({ ...c, preInfo: v }))}>
              <button type="button" onClick={() => openDoc("pre")} className="text-flores-300 underline underline-offset-4">
                Ön Bilgilendirme Formu
              </button>
              &apos;nu okudum, onaylıyorum.
            </Consent>
            <Consent checked={consents.distanceSales} onChange={(v) => setConsents((c) => ({ ...c, distanceSales: v }))}>
              <button type="button" onClick={() => openDoc("contract")} className="text-flores-300 underline underline-offset-4">
                Mesafeli Satış Sözleşmesi
              </button>
              &apos;ni okudum, onaylıyorum.
            </Consent>
            <Consent checked={consents.marketing} onChange={(v) => setConsents((c) => ({ ...c, marketing: v }))}>
              Yeni hasatlar ve kampanyalardan e-posta / SMS ile haberdar olmak istiyorum. <span className="text-cream-500">(İsteğe bağlı)</span>
            </Consent>
            <p className="pl-8 text-xs leading-relaxed text-cream-500">
              Kişisel verileriniz siparişinizin işlenmesi amacıyla{" "}
              <Link href="/kvkk-aydinlatma-metni" target="_blank" className="underline underline-offset-2 hover:text-cream-300">
                KVKK Aydınlatma Metni
              </Link>{" "}
              kapsamında işlenir. Öğütülmüş kahvelerde{" "}
              <Link href="/teslimat-ve-iade-sartlari" target="_blank" className="underline underline-offset-2 hover:text-cream-300">
                cayma hakkı
              </Link>{" "}
              kullanılamaz.
            </p>
          </fieldset>
        </div>

        {/* sipariş özeti */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-sm border border-ink-700 bg-ink-900 p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-2xl">Sipariş özeti</h2>
              <button type="button" onClick={openCart} className="text-xs text-cream-400 underline underline-offset-4 hover:text-cream-100">
                Sepeti düzenle
              </button>
            </div>
            <ul className="mt-5 divide-y divide-ink-700">
              {items.map((i) => (
                <li key={`${i.slug}|${i.variantId}|${i.grind}`} className="flex gap-4 py-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-sm">
                    <Image src={i.image} alt="" fill sizes="64px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-flores-500 text-[10px] font-bold text-ink-950">
                      {i.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg leading-tight">{i.name}</p>
                    <p className="mt-0.5 text-xs text-cream-400">
                      {i.variantLabel} · {i.grind}
                    </p>
                  </div>
                  <p className="font-mono text-sm">{formatPrice(i.unitPrice * i.quantity)}</p>
                </li>
              ))}
            </ul>
            {/* kupon */}
            <div className="mt-2 border-t border-ink-700 pt-4">
              {quote?.coupon ? (
                <div className="flex items-center justify-between gap-3 rounded-sm bg-flores-500/10 px-3 py-2 text-sm">
                  <span>
                    <span className="font-mono uppercase text-flores-200">{quote.coupon.code}</span>
                    <span className="text-cream-400"> · {quote.coupon.label}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCoupon("");
                      setCouponInput("");
                    }}
                    className="text-xs text-cream-400 underline underline-offset-2 hover:text-cream-100"
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <label htmlFor="coupon" className="sr-only">
                    Kupon kodu
                  </label>
                  <input
                    id="coupon"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCoupon(couponInput.trim());
                      }
                    }}
                    maxLength={40}
                    placeholder="Kupon kodu"
                    className="field py-2.5 text-sm uppercase"
                  />
                  <button type="button" onClick={() => setCoupon(couponInput.trim())} disabled={!couponInput.trim()} className="btn btn-ghost shrink-0 px-4 py-2.5">
                    Uygula
                  </button>
                </div>
              )}
              {quote?.couponError && coupon && <p className="mt-2 text-xs text-amber-200">{quote.couponError}</p>}
            </div>

            <dl className="mt-4 space-y-2 border-t border-ink-700 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-cream-400">Ara toplam</dt>
                <dd className="font-mono">{quote ? formatPrice(quote.subtotal) : "…"}</dd>
              </div>
              {quote?.discount ? (
                <div className="flex justify-between text-flores-200">
                  <dt>Kupon indirimi</dt>
                  <dd className="font-mono">−{formatPrice(quote.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-cream-400">{quote?.shippingMethod?.label ?? "Kargo"}</dt>
                <dd className="font-mono">{!quote ? "…" : quote.shipping === 0 ? "Ücretsiz" : formatPrice(quote.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-700 pt-3 text-base">
                <dt>Toplam (KDV dahil)</dt>
                <dd className="font-mono text-lg">{quote ? formatPrice(quote.total) : "…"}</dd>
              </div>
            </dl>

            {quote?.errors.length ? (
              <ul className="mt-4 space-y-1 rounded-sm border border-amber-300/30 bg-amber-300/5 p-3 text-sm text-amber-100">
                {quote.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            ) : null}

            {error && (
              <p role="alert" className="mt-4 rounded-sm border border-red-400/40 bg-red-400/5 p-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting || !quote || quote.errors.length > 0} className="btn btn-primary mt-6 w-full">
              {submitting ? (payment === "iyzico" ? "Ödeme sayfasına yönlendiriliyor…" : "Sipariş oluşturuluyor…") : payment === "iyzico" ? "Onayla ve öde" : "Siparişi onayla"}
            </button>
            <p className="mt-3 text-center text-xs text-cream-500">Siparişi onaylayarak ödeme yükümlülüğü altına girdiğinizi kabul edersiniz.</p>
          </div>
        </aside>
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby="doc-title"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto max-h-[85vh] w-[min(46rem,92vw)] overflow-hidden rounded-sm border border-ink-600 bg-ink-900 p-0 text-cream-50 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {doc && (
          <div className="flex max-h-[85vh] flex-col">
            <div className="flex items-center justify-between border-b border-ink-700 px-6 py-4">
              <h2 id="doc-title" className="font-serif text-2xl">
                {doc.title}
              </h2>
              <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Kapat" className="text-cream-300 hover:text-cream-50">
                ✕
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <LegalBlocks blocks={doc.blocks} compact />
            </div>
            <div className="flex justify-end gap-3 border-t border-ink-700 px-6 py-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setConsents((c) => (doc.slug === "on-bilgilendirme-formu" ? { ...c, preInfo: true } : { ...c, distanceSales: true }));
                  dialogRef.current?.close();
                }}
              >
                Okudum, onaylıyorum
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

/** Kartlı siparişte iyzico'ya geçerken: sayfa geç açılırsa müşteri elle devam edebilsin */
function PaymentRedirect({ number, url }: { number: string; url: string }) {
  return (
    <div role="status" className="mx-auto max-w-lg py-24 text-center">
      <span aria-hidden className="mx-auto block size-10 animate-spin rounded-full border-2 border-ink-600 border-t-flores-400 motion-reduce:animate-none" />
      <p className="eyebrow mt-8 text-flores-400">Sipariş #{number} oluşturuldu</p>
      <p className="mt-3 font-serif text-4xl">iyzico güvenli ödeme sayfasına geçiyorsunuz…</p>
      <p className="mt-4 text-cream-300">
        Sayfa birkaç saniye içinde açılmazsa aşağıdaki butonu kullanın. Kart bilgileriniz yalnızca iyzico&apos;ya iletilir.
      </p>
      <a href={url} className="btn btn-primary mt-8">
        Ödeme sayfasına git →
      </a>
    </div>
  );
}

function PaymentOption({
  checked,
  onChange,
  title,
  text,
  disabled,
  badge,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  text: string;
  disabled?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-4 rounded-sm border p-5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-flores-400 ${
        checked ? "border-flores-500 bg-flores-500/5" : "border-ink-600 hover:border-cream-400"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input type="radio" name="payment" checked={checked} onChange={onChange} disabled={disabled} className="mt-1 accent-[#5fa4d6]" />
      <span>
        <span className="block font-medium">{title}</span>
        <span className="mt-1 block text-sm text-cream-400">{text}</span>
        {badge && <span className="mt-3 block">{badge}</span>}
      </span>
    </label>
  );
}

function Consent({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-cream-200">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#5fa4d6]" />
      <span>{children}</span>
    </label>
  );
}
