export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] animate-pulse px-5 pt-28 md:px-10 md:pt-36" aria-busy="true" aria-label="Kahveler yükleniyor">
      <div className="h-3 w-40 rounded bg-ink-800" />
      <div className="mt-12 h-24 w-2/3 rounded bg-ink-800" />
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-ink-850" />
        ))}
      </div>
    </div>
  );
}
