import { JsonLd } from "@/components/json-ld";
import { t } from "@/i18n/server";
import { faqSchema } from "@/lib/seo";

const faq = {
  title: { tr: "Sıkça sorulanlar", en: "Frequently asked questions", id: "Pertanyaan umum" },
  items: [
    {
      q: { tr: "Kahveleriniz ne zaman kavruluyor?", en: "When are your coffees roasted?", id: "Kapan kopi Anda disangrai?" },
      a: {
        tr: "Tüm çekirdeklerimizi Eskişehir'deki atölyemizde Kuban kavurucumuzda her hafta taze kavuruyoruz. Paketin üzerindeki tarih kavrum tarihidir; en iyi lezzet için kavrumdan sonraki 4 hafta içinde tüketmenizi öneririz.",
        en: "We roast every bean fresh each week on our Kuban roaster at our workshop in Eskişehir. The date on the bag is the roast date; for the best flavour, enjoy within 4 weeks of roasting.",
        id: "Semua biji kami disangrai segar setiap minggu dengan mesin Kuban di workshop kami di Eskişehir. Tanggal di kemasan adalah tanggal sangrai; nikmati dalam 4 minggu untuk rasa terbaik.",
      },
    },
    {
      q: {
        tr: "İstanbul, Ankara, Bursa ve İzmir'e kargo ne kadar sürer?",
        en: "How long does delivery take to Istanbul, Ankara, Bursa and Izmir?",
        id: "Berapa lama pengiriman ke Istanbul, Ankara, Bursa, dan Izmir?",
      },
      a: {
        tr: "Siparişler kavrum ve paketlemenin ardından genellikle 1–2 iş günü içinde kargoya verilir; İstanbul, Ankara, Bursa ve İzmir'e teslimat çoğunlukla ertesi gün ile 3 iş günü arasındadır. 950₺ ve üzeri siparişlerde kargo ücretsizdir. Eskişehir içinde kendi kuryemizle aynı gün ücretsiz teslim ediyoruz.",
        en: "Orders usually ship within 1–2 working days after roasting and packing; delivery to Istanbul, Ankara, Bursa and Izmir typically takes 1–3 working days. Shipping is free on orders of ₺950 or more. Within Eskişehir our own courier delivers free, the same day.",
        id: "Pesanan biasanya dikirim 1–2 hari kerja setelah disangrai dan dikemas; pengiriman ke Istanbul, Ankara, Bursa, dan Izmir umumnya 1–3 hari kerja. Gratis ongkir untuk pesanan ₺950 ke atas. Di Eskişehir, kurir kami mengantar gratis di hari yang sama.",
      },
    },
    {
      q: { tr: "Çekirdek mi almalıyım, öğütülmüş mü?", en: "Should I buy whole bean or ground?", id: "Sebaiknya beli biji utuh atau bubuk?" },
      a: {
        tr: "En taze fincan için çekirdek alıp demlemeden hemen önce öğütmenizi öneririz. Değirmeniniz yoksa sipariş sırasında V60, filtre makinesi, French Press, moka pot, espresso veya Türk kahvesi için öğütmeyi seçebilirsiniz; kahvenizi demleme yönteminize göre öğütüp gönderiyoruz.",
        en: "For the freshest cup, buy whole beans and grind right before brewing. No grinder? Choose a grind for V60, filter machine, French Press, moka pot, espresso or Turkish coffee at checkout and we'll grind it for your method.",
        id: "Untuk secangkir paling segar, beli biji utuh dan giling tepat sebelum menyeduh. Tidak punya grinder? Pilih gilingan untuk V60, mesin filter, French Press, moka pot, espresso, atau kopi Turki saat memesan.",
      },
    },
    {
      q: { tr: "Specialty (3. nesil) kahve nedir?", en: "What is specialty (third-wave) coffee?", id: "Apa itu kopi spesialti (third wave)?" },
      a: {
        tr: "Specialty kahve, SCA standartlarına göre 80 ve üzeri puan alan, kökeni izlenebilir, özenle toplanıp işlenmiş kahvedir. 3. nesil kahve yaklaşımı; çekirdeğin geldiği bölgeyi, üreticiyi, işleme yöntemini ve taze kavrumu öne çıkarır. Bu yüzden her kutumuzun yan yüzünde kahvenin künyesi yazar.",
        en: "Specialty coffee scores 80+ on SCA standards, with a traceable origin and careful picking and processing. The third-wave approach puts the region, producer, process and fresh roast front and centre — which is why every box carries the coffee's spec sheet.",
        id: "Kopi spesialti memiliki skor 80+ menurut standar SCA, asal yang dapat ditelusuri, serta dipetik dan diproses dengan cermat. Pendekatan third wave menonjolkan wilayah, produsen, proses, dan sangrai segar — karena itu setiap kotak kami mencantumkan spesifikasi kopinya.",
      },
    },
    {
      q: { tr: "Hangi ülkelerin kahvelerini satıyorsunuz?", en: "Which origins do you sell?", id: "Kopi dari negara mana saja yang Anda jual?" },
      a: {
        tr: "Endonezya (Java — Garut, Papandayan, Frinsa Estate; Ruso Exotics doğrudan ticaret serisi), Etiyopya, Kolombiya, El Salvador ve Meksika tek köken kahveleri ile Etiyopya ve Endonezya çekirdeklerinden oluşan Manis, Pagi ve Tanah harmanlarımız var.",
        en: "Single origins from Indonesia (Java — Garut, Papandayan, Frinsa Estate; our direct-trade Ruso Exotics series), Ethiopia, Colombia, El Salvador and Mexico, plus our Manis, Pagi and Tanah blends of Ethiopian and Indonesian beans.",
        id: "Single origin dari Indonesia (Jawa — Garut, Papandayan, Frinsa Estate; seri direct trade Ruso Exotics), Etiopia, Kolombia, El Salvador, dan Meksiko, serta blend Manis, Pagi, dan Tanah dari biji Etiopia dan Indonesia.",
      },
    },
    {
      q: { tr: "Ödeme güvenli mi?", en: "Is payment secure?", id: "Apakah pembayaran aman?" },
      a: {
        tr: "Kartla ödemeler iyzico'nun güvenli ödeme sayfasında alınır; kart bilgileriniz bize hiç ulaşmaz ve saklanmaz. Dilerseniz Havale / EFT ile de ödeyebilirsiniz.",
        en: "Card payments are taken on iyzico's secure payment page; your card details never reach us and are never stored. You can also pay by bank transfer.",
        id: "Pembayaran kartu diproses di halaman aman iyzico; data kartu Anda tidak pernah sampai ke kami dan tidak disimpan. Anda juga bisa membayar dengan transfer bank.",
      },
    },
  ],
};

/** Ana sayfa SSS — FAQPage yapılandırılmış verisiyle */
export async function HomeFaq() {
  const f = await t(faq);
  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-24 md:px-10 md:py-32">
      <JsonLd data={faqSchema(f.items)} />
      <h2 className="font-serif text-4xl md:text-5xl">{f.title}</h2>
      <div className="mt-10 divide-y divide-ink-700 border-y border-ink-700">
        {f.items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-cream-100">
              <h3 className="font-sans text-lg font-normal">{item.q}</h3>
              <span aria-hidden className="text-flores-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-cream-300">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
