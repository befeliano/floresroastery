import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Giriş",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-16 px-5 pb-28 pt-32 md:pt-40 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-flores-400">Hesabım</p>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">Tekrar hoş geldiniz</h1>
        <LoginForm />
      </div>
      <aside className="space-y-6 self-end rounded-sm border border-ink-700 bg-ink-900 p-8">
        <h2 className="font-serif text-2xl">Üye olmadan da alışveriş yapabilirsiniz</h2>
        <p className="text-cream-300">
          Siparişinizi misafir olarak verin; sipariş numaranız ve e-posta adresinizle durumunu istediğiniz zaman takip edin.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/kahveler" className="btn btn-primary">
            Alışverişe başla
          </Link>
          <Link href="/siparis-takip" className="btn btn-ghost">
            Sipariş takibi
          </Link>
        </div>
      </aside>
    </div>
  );
}
