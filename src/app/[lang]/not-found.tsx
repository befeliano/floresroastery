import { EmTitle } from "@/components/em-title";
import Link from "@/i18n/link";
import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";

export default async function NotFound() {
  const n = await t(pages.notFound);
  return (
    <div className="mx-auto flex min-h-[70svh] w-full max-w-3xl flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="font-mono text-sm text-flores-400">404</p>
      <h1 className="mt-4 font-serif text-5xl md:text-7xl">
        <EmTitle parts={n.heading} />
      </h1>
      <p className="mt-6 max-w-md text-cream-300">{n.text}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/kahveler" className="btn btn-primary">
          {n.coffees}
        </Link>
        <Link href="/" className="btn btn-ghost">
          {n.home}
        </Link>
      </div>
    </div>
  );
}
