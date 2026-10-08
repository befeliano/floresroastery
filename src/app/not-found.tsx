import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] w-full max-w-3xl flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="font-mono text-sm text-flores-400">404</p>
      <h1 className="mt-4 font-serif text-5xl md:text-7xl">
        Bu fincan <em className="text-flores-300">boş</em> çıktı.
      </h1>
      <p className="mt-6 max-w-md text-cream-300">Aradığınız sayfa taşınmış ya da hiç demlenmemiş olabilir. Kahvelerimize göz atmaya ne dersiniz?</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/kahveler" className="btn btn-primary">
          Kahveler
        </Link>
        <Link href="/" className="btn btn-ghost">
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}
