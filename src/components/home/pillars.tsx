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
        <div key={p.no} className="reveal bg-ink-950 px-5 py-16 md:px-10 md:py-20">
          <span className="font-mono text-sm text-flores-400">{p.no}</span>
          <h3 className="mt-6 font-serif text-3xl">{p.title}</h3>
          <p className="mt-4 max-w-sm leading-relaxed text-cream-300">{p.text}</p>
        </div>
      ))}
    </section>
  );
}
