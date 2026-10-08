export function PageHeader({
  eyebrow,
  title,
  intro,
  eyebrowLang,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  eyebrowLang?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
      <p lang={eyebrowLang} className="eyebrow animate-fade-up text-flores-400">
        {eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl animate-fade-up font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] [animation-delay:120ms]">{title}</h1>
      {intro && <div className="mt-6 max-w-2xl animate-fade-up text-lg text-cream-300 [animation-delay:240ms]">{intro}</div>}
      {children}
    </header>
  );
}
