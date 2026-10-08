/** Ürün sayfası iskeleti — anlık geçiş için App Shell içinde gösterilir */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] animate-pulse px-5 pt-28 md:px-10 md:pt-32" aria-busy="true">
      <div className="h-3 w-48 rounded bg-ink-800" />
      <div className="mx-auto mt-14 h-4 w-56 rounded bg-ink-800" />
      <div className="mx-auto mt-6 h-20 w-80 max-w-full rounded bg-ink-800" />
      <div className="mx-auto mt-16 aspect-square w-[min(70vw,330px)] rounded-sm bg-ink-850" />
    </div>
  );
}
