/**
 * Değirmene göre başlangıç ayarları. Değerler yaklaşık başlangıç noktalarıdır (tamamen kapalı konumdan);
 * değirmen toleransı ve çekirdeğe göre bir iki tık oynar — sayfada bu açıkça yazar.
 */
type Method = "turkish" | "espresso" | "moka" | "aeropress" | "v60" | "chemex" | "french";

const METHODS: Method[] = ["turkish", "espresso", "moka", "aeropress", "v60", "chemex", "french"];

const GRINDERS: { name: string; unit: "clicks" | "steps"; values: Partial<Record<Method, string>> }[] = [
  { name: "Comandante C40", unit: "clicks", values: { turkish: "5–7", espresso: "8–12", moka: "13–16", aeropress: "15–20", v60: "20–26", chemex: "25–30", french: "30–35" } },
  { name: "Timemore Chestnut C2 / C3", unit: "clicks", values: { moka: "9–11", aeropress: "10–13", v60: "14–18", chemex: "17–20", french: "20–24" } },
  { name: "Baratza Encore", unit: "steps", values: { moka: "8–12", aeropress: "10–14", v60: "14–18", chemex: "18–22", french: "28–32" } },
  { name: "Fellow Ode Gen 2", unit: "steps", values: { aeropress: "2–3", v60: "3–5", chemex: "5–7", french: "8–10" } },
];

type Text = {
  title: string;
  intro: string;
  grinder: string;
  unit: string;
  clicks: string;
  steps: string;
  na: string;
  methods: Record<Method, string>;
  note: string;
};

export function GrinderGuide({ text }: { text: Text }) {
  return (
    <section aria-labelledby="grinder-title">
      <h2 id="grinder-title" className="font-serif text-4xl md:text-5xl">
        {text.title}
      </h2>
      <p className="mt-4 max-w-2xl text-cream-300">{text.intro}</p>
      <div className="-mx-5 mt-10 overflow-x-auto px-5 md:mx-0 md:px-0">
        <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-600 text-cream-400">
              <th scope="col" className="py-3 pr-4 font-normal">
                {text.grinder}
              </th>
              <th scope="col" className="px-3 py-3 font-normal">
                {text.unit}
              </th>
              {METHODS.map((m) => (
                <th key={m} scope="col" className="px-3 py-3 text-center font-normal">
                  {text.methods[m]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRINDERS.map((g) => (
              <tr key={g.name} className="border-b border-ink-800">
                <th scope="row" className="py-4 pr-4 font-serif text-lg font-normal text-cream-100">
                  {g.name}
                </th>
                <td className="px-3 py-4 text-cream-500">{g.unit === "clicks" ? text.clicks : text.steps}</td>
                {METHODS.map((m) => (
                  <td key={m} className="px-3 py-4 text-center font-mono">
                    {g.values[m] ? <span className="text-cream-100">{g.values[m]}</span> : <span className="text-xs text-cream-600">{text.na}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 max-w-3xl text-xs text-cream-500">{text.note}</p>
    </section>
  );
}
