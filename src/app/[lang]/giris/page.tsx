import type { Metadata } from "next";
import { AuthPanel } from "@/components/forms/auth-panel";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { alternates, t } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const l = await t(pages.login);
  return { title: l.title, robots: { index: false, follow: true }, alternates: await alternates("/giris") };
}

export default async function LoginPage() {
  const l = await t(pages.login);
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-16 px-5 pb-28 pt-32 md:pt-40 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-flores-400">{l.eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">{l.heading}</h1>
        <p className="mt-4 text-cream-300">{l.intro}</p>
        <AuthPanel />
      </div>
      <aside className="space-y-6 self-end rounded-sm border border-ink-700 bg-ink-900 p-8">
        <h2 className="font-serif text-2xl">{l.guestTitle}</h2>
        <ul className="space-y-2 text-sm text-cream-300">
          <li>✦ {l.perkMembers}</li>
          <li>✦ {l.perkGuests}</li>
        </ul>
        <p className="text-cream-300">{l.guestText}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/kahveler" className="btn btn-primary">
            {l.startShopping}
          </Link>
          <Link href="/siparis-takip" className="btn btn-ghost">
            {l.tracking}
          </Link>
        </div>
      </aside>
    </div>
  );
}
