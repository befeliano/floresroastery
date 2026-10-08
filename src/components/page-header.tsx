import { HeroVideo } from "@/components/home/hero-video";

export function PageHeader({
  eyebrow,
  title,
  intro,
  eyebrowLang,
  video,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  eyebrowLang?: string;
  /** arka planda oynayan video (ör. "/video/kahveler" → -1080.mp4, -720.mp4, -poster.jpg) */
  video?: string;
  children?: React.ReactNode;
}) {
  const content = (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
      <p lang={eyebrowLang} className="eyebrow animate-fade-up text-flores-400">
        {eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl animate-fade-up font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] [animation-delay:120ms]">{title}</h1>
      {intro && <div className="mt-6 max-w-2xl animate-fade-up text-lg text-cream-200 [animation-delay:240ms]">{intro}</div>}
      {children}
    </div>
  );
  if (!video) return <header>{content}</header>;
  return (
    <header className="grain relative isolate overflow-hidden">
      <link rel="preload" as="image" href={`${video}-poster.jpg`} fetchPriority="high" />
      <HeroVideo base={video} className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/80 via-ink-950/55 to-ink-950" />
      {content}
    </header>
  );
}
