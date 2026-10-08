import { pages } from "@/i18n/messages/pages";
import { t } from "@/i18n/server";

const pillarsNo = ["01", "02", "03"];

export async function Pillars() {
  const h = await t(pages.home);
  const pillars = h.pillars.map((p, i) => ({ ...p, no: pillarsNo[i] }));
  return (
    <section className="mx-auto grid w-full max-w-[1440px] gap-px bg-ink-800 px-0 md:grid-cols-3">
      {pillars.map((p) => (
        <div key={p.no} className="reveal grid grid-cols-[2.25rem_1fr] bg-ink-950 px-5 py-10 md:block md:px-10 md:py-20">
          <span className="pt-2 font-mono text-sm text-flores-400 md:pt-0">{p.no}</span>
          <div>
            <h3 className="font-serif text-3xl md:mt-6">{p.title}</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-cream-300 md:mt-4">{p.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
