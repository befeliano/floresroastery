import Link from "@/i18n/link";
import { EmTitle } from "@/components/em-title";
import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";
import { HeroVideo } from "./hero-video";

export async function Hero() {
  const h = await t(pages.home);
  return (
    <section className="grain relative isolate flex min-h-svh items-end overflow-hidden">
      {/* LCP: poster hemen yüklensin */}
      <link rel="preload" as="image" href="/video/roastery-poster.jpg" fetchPriority="high" />
      <HeroVideo className="absolute inset-0 -z-20 size-full animate-slow-zoom object-cover" />
      {/* okunabilirlik için katmanlı karartma */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/35 to-ink-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_20%_80%,rgba(10,10,10,0.75),transparent)]" />

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-40 md:px-10 md:pb-28">
        <p className="eyebrow animate-fade-up text-flores-300 [animation-delay:150ms]">
          {h.eyebrow} · <span lang="en">Specialty Coffee Roasters</span>
        </p>
        <h1 className="mt-6 max-w-5xl animate-fade-up font-serif text-[clamp(3rem,9vw,8.5rem)] leading-[0.95] [animation-delay:300ms]">
          <EmTitle parts={h.title} />
        </h1>
        <p className="mt-8 max-w-xl animate-fade-up text-lg text-cream-200 [animation-delay:500ms] md:text-xl">
          {h.intro}
        </p>
        <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:700ms]">
          <Link href="/kahveler" lang="en" className="btn btn-primary">
            {h.explore}
            <span aria-hidden>→</span>
          </Link>
          <Link href="/hikayemiz" className="btn btn-ghost">
            {h.story}
          </Link>
        </div>
      </div>

      <div aria-hidden className="absolute bottom-8 right-10 hidden items-center gap-3 text-cream-400 md:flex">
        <span className="eyebrow text-[0.6rem]">{h.scroll}</span>
        <span className="relative h-12 w-px overflow-hidden bg-cream-50/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_ease-in-out_infinite] bg-flores-400" />
        </span>
      </div>
    </section>
  );
}
