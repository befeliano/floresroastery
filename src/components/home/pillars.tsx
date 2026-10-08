const pillars = [
  {
    no: "01",
    title: "Doğrudan ticaret",
    text: "Ruso Exotics serimizde Java'daki üreticilerimizle bizzat el sıkışarak lot seçiyoruz. Aracı yok; üretici desteklenir, kahve taze gelir.",
  },
  {
    no: "02",
    title: "Haftalık kavrum",
    text: "Tüm çekirdeklerimiz Kuban kavurucumuzda haftalık kavrulur. Paketteki tarih, kahvenizin kavrulduğu gündür.",
  },
  {
    no: "03",
    title: "Saniye saniye tarif",
    text: "Filtre ve espresso için o kahveye özel oran, öğütme ve döküm zamanlaması. Evde de kafedeki fincanı yakalayın.",
  },
];

export function Pillars() {
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
