import { JsonLd } from "@/components/json-ld";
import { t } from "@/i18n/server";
import { faqSchema } from "@/lib/seo";

const faq = {
  title: { tr: "Sıkça sorulanlar", en: "Frequently asked questions", id: "Pertanyaan umum" },
  items: [
    {
      q: { tr: "Siparişim ne zaman kavrulur?", en: "When is my order roasted?", id: "Kapan pesanan saya disangrai?" },
      a: {
        tr: "Kahvelerimizi Eskişehir'deki atölyemizde, Kuban kavurucumuzda her hafta küçük partiler hâlinde kavuruyoruz. Siparişiniz en yakın kavrum partisinden paketlenir ve kavrumdan sonra genellikle 1–2 iş günü içinde kargoya verilir; rafta bekleyen eski stok göndermeyiz. Paketin üzerindeki tarih kavrum tarihidir.",
        en: "We roast in small batches every week on our Kuban roaster at our workshop in Eskişehir. Your order is packed from the nearest roast batch and usually ships within 1–2 working days of roasting — we never send old shelf stock. The date on the bag is the roast date.",
        id: "Kami menyangrai dalam batch kecil setiap minggu dengan mesin Kuban di workshop kami di Eskişehir. Pesanan Anda dikemas dari batch sangrai terdekat dan biasanya dikirim 1–2 hari kerja setelah disangrai — kami tidak mengirim stok lama. Tanggal di kemasan adalah tanggal sangrai.",
      },
    },
    {
      q: { tr: "Kahvemi nasıl taze saklarım?", en: "How do I keep my coffee fresh?", id: "Bagaimana cara menjaga kopi tetap segar?" },
      a: {
        tr: "Kahvenin düşmanları hava, ışık, nem ve ısıdır. Paketi her kullanımdan sonra havasını alarak sıkıca kapatın ya da hava almayan, ışık geçirmeyen bir kapta saklayın; serin ve karanlık bir dolap idealdir. Buzdolabına koymayın — nem ve koku çeker. Çekirdeği demlemeden hemen önce öğütün. En iyi lezzet kavrumdan sonraki 1–5 hafta arasındadır; filtre kahveler kavrumdan birkaç gün sonra (gaz salınımı bitince) en dengeli hâline gelir. Öğütülmüş kahveyi 1–2 hafta içinde tüketin.",
        en: "Coffee's enemies are air, light, moisture and heat. Squeeze the air out and seal the bag tightly after each use, or keep the beans in an airtight, opaque container in a cool, dark cupboard. Don't refrigerate — the fridge adds moisture and odours. Grind right before brewing. Flavour peaks 1–5 weeks after roasting; filter coffees taste most balanced a few days after the roast date, once they've degassed. Use ground coffee within 1–2 weeks.",
        id: "Musuh kopi adalah udara, cahaya, kelembapan, dan panas. Keluarkan udara dan tutup rapat kemasan setiap selesai dipakai, atau simpan biji di wadah kedap udara dan tidak tembus cahaya di lemari yang sejuk dan gelap. Jangan simpan di kulkas — kopi menyerap kelembapan dan bau. Giling tepat sebelum menyeduh. Rasa terbaik ada pada 1–5 minggu setelah sangrai; kopi filter paling seimbang beberapa hari setelah tanggal sangrai. Habiskan kopi bubuk dalam 1–2 minggu.",
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
      q: { tr: "Yalnızca çekirdek olarak mı satıyorsunuz?", en: "Do you only sell whole beans?", id: "Apakah hanya dijual dalam bentuk biji?" },
      a: {
        tr: "Hayır. Varsayılan olarak çekirdek gönderiyoruz, çünkü en taze fincan demlemeden hemen önce öğütülen çekirdekten çıkar. Değirmeniniz yoksa ürün sayfasında V60, filtre kahve makinesi, Chemex, French Press, AeroPress, moka pot, espresso veya Türk kahvesi için öğütmeyi seçin; kahvenizi kavrumdan sonra demleme yönteminize göre öğütüp gönderiyoruz. Ayrıca hazır Türk kahvemiz de var.",
        en: "No. We ship whole beans by default, because the freshest cup comes from grinding right before brewing. No grinder? On the product page choose a grind for V60, filter machine, Chemex, French Press, AeroPress, moka pot, espresso or Turkish coffee, and we'll grind it for your method after roasting. We also sell ready-ground Turkish coffee.",
        id: "Tidak. Secara default kami mengirim biji utuh, karena secangkir paling segar berasal dari biji yang digiling tepat sebelum diseduh. Tidak punya grinder? Di halaman produk, pilih gilingan untuk V60, mesin filter, Chemex, French Press, AeroPress, moka pot, espresso, atau kopi Turki, dan kami menggilingnya sesuai metode Anda setelah disangrai. Kami juga menjual kopi Turki siap seduh.",
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
        tr: "Endonezya (Java — Garut, Papandayan, Frinsa Estate; Ruso Exotics doğrudan ticaret serisi), Etiyopya (Sidamo bölgesinden Manis ve Sidama'dan Shantawene), Kolombiya, El Salvador ve Meksika tek köken kahveleri ile Etiyopya ve Endonezya çekirdeklerinden oluşan Pagi ve Tanah harmanlarımız var.",
        en: "Single origins from Indonesia (Java — Garut, Papandayan, Frinsa Estate; our direct-trade Ruso Exotics series), Ethiopia (Manis from Sidamo and Shantawene from Sidama), Colombia, El Salvador and Mexico, plus our Pagi and Tanah blends of Ethiopian and Indonesian beans.",
        id: "Single origin dari Indonesia (Jawa — Garut, Papandayan, Frinsa Estate; seri direct trade Ruso Exotics), Etiopia (Manis dari Sidamo dan Shantawene dari Sidama), Kolombia, El Salvador, dan Meksiko, serta blend Pagi dan Tanah dari biji Etiopia dan Indonesia.",
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
    {
      q: { tr: "Yeni kahveleri ve kampanyaları nereden takip edebilirim?", en: "Where can I follow new coffees and offers?", id: "Di mana saya bisa mengikuti kopi baru dan promo?" },
      a: {
        tr: "Instagram'da @floresroastery hesabımızı takip edin: yeni gelen çekirdekler, kavrum günleri, Coffee Bar tadımları ve kampanyaları ilk orada paylaşıyoruz. Sorularınızı DM'den de sorabilirsiniz.",
        en: "Follow @floresroastery on Instagram: new arrivals, roast days, Coffee Bar tastings and offers appear there first. You can also send us your questions by DM.",
        id: "Ikuti @floresroastery di Instagram: biji baru, hari sangrai, sesi cupping di Coffee Bar, dan promo kami bagikan di sana lebih dulu. Anda juga bisa bertanya lewat DM.",
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
