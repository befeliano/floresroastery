/**
 * Kahve rehberi yazıları (/rehber/[slug]) — bilgi amaçlı aramalar için özgün Türkçe içerik:
 * "3. nesil kahve nedir", "V60 nasıl demlenir", "Etiyopya kahvesi", "Endonezya kahvesi"...
 * Bloklar: h2 (ara başlık), p (paragraf), ul (liste), link (iç bağlantı satırı).
 */
export type GuideBlock = { h2: string } | { p: string } | { ul: string[] } | { links: { href: string; label: string }[] };

export interface Guide {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readMin: number;
  blocks: GuideBlock[];
}

export const GUIDES: Guide[] = [
  {
    slug: "3-nesil-kahve-nedir",
    title: "3. Nesil (Specialty) Kahve Nedir?",
    description:
      "Üçüncü dalga kahve, specialty kahve ve SCA puanı ne demek? Kökeni izlenebilir çekirdekten taze kavruma, 3. nesil kahvenin fincandaki farkını sade bir dille anlatıyoruz.",
    image: "/photos/coffee-bar-jars.webp",
    date: "2026-10-09",
    readMin: 5,
    blocks: [
      { p: "Kahvenin üç “dalgası” olduğu söylenir. Birinci dalga kahveyi her eve sokan hazır ve paket kahvedir. İkinci dalga, espresso bazlı içecekleri ve zincir kafeleri yaygınlaştırdı. Üçüncü dalga — ya da 3. nesil kahve — ise kahveye şarap gibi bakar: Nereden geldiğini, kimin yetiştirdiğini, nasıl işlendiğini ve ne zaman kavrulduğunu bilmek ister." },
      { h2: "Specialty kahve ne demek?" },
      { p: "Specialty kahve, Specialty Coffee Association (SCA) kupa protokolüne göre 100 üzerinden 80 ve üzeri puan alan kahvedir. Bu puan; aroma, tat, asidite, gövde, denge ve temizlik gibi kriterlerle eğitimli tadımcılar (Q-grader) tarafından verilir. 80 puanın altındaki kahveler ticari (commercial) kahve olarak kabul edilir." },
      { p: "Örneğin El Salvador Ochuspe'miz 85 SCA puanına sahip; beyaz üzüm, altın kuru üzüm ve karamel notalarıyla bu puanı fincanda hissettirir." },
      { h2: "3. nesil kahveyi farklı kılan ne?" },
      {
        ul: [
          "İzlenebilirlik: Ülke, bölge, rakım, çeşit ve çoğu zaman üretici ile çiftlik adı bilinir.",
          "İşleme yöntemi: Washed, natural, honey, anaerobik veya wet hulled — her yöntem fincanda farklı bir karakter yaratır.",
          "Taze kavrum: Kahve kavrulduktan sonraki birkaç hafta içinde en iyi hâlindedir; paketteki tarih kavrum tarihidir.",
          "Açık kavurma profili: Çekirdeğin kendi meyvemsi ve çiçeksi notalarını örtmeden ortaya çıkarmak için çoğunlukla açık–orta kavrulur.",
          "Demleme özeni: Oran, öğütme, su sıcaklığı ve süre ölçülerek demlenir.",
        ],
      },
      { h2: "Tadım notaları gerçekten kahvenin içinde mi?" },
      { p: "“Şeftali, sarı elma, esmer şeker” gibi notalar kahveye eklenmiş aromalar değildir. Bunlar çekirdeğin türünden, toprağından, rakımından ve işleme yönteminden gelen doğal tatların, tanıdık yiyeceklere benzetilerek tarif edilmesidir. Örneğin honey işlemde çekirdeğin üzerinde bırakılan müsilaj, fincanda bal benzeri bir tatlılık yaratır." },
      { h2: "Evde 3. nesil kahve nasıl içilir?" },
      { p: "En kolay başlangıç bir V60 ve bir terazidir. 15 gram kahveyi orta-ince öğütüp 250 gram 93 °C suyla yaklaşık 2:45 dakikada demlemek, çekirdeğin karakterini görmek için yeterlidir. Her kahvemizin sayfasında o çekirdeğe özel saniye saniye bir tarif bulabilirsiniz." },
      {
        links: [
          { href: "/kahveler", label: "Tüm specialty kahvelerimiz" },
          { href: "/rehber/v60-ile-filtre-kahve-nasil-demlenir", label: "V60 ile filtre kahve nasıl demlenir?" },
          { href: "/demleme-rehberi", label: "Demleme rehberi ve oran hesaplayıcı" },
        ],
      },
    ],
  },
  {
    slug: "v60-ile-filtre-kahve-nasil-demlenir",
    title: "V60 ile Filtre Kahve Nasıl Demlenir? (Adım Adım Tarif)",
    description:
      "Hario V60 ile evde filtre kahve demlemenin adım adım tarifi: oran, öğütme kalınlığı, su sıcaklığı, ön ıslatma (bloom) ve spiral döküş. Ekşi ya da acı fincan için çözümler.",
    image: "/photos/v60-pour.webp",
    date: "2026-10-09",
    readMin: 6,
    blocks: [
      { p: "V60, Japon Hario'nun konik, spiral oluklu demleme aparatıdır. Büyük tek deliği sayesinde akış hızını döküşünüzle siz kontrol edersiniz; bu da onu specialty kahvenin berrak, meyvemsi karakterini göstermek için en sevilen yöntemlerden biri yapar." },
      { h2: "İhtiyacınız olanlar" },
      { ul: ["Hario V60 02 ve kâğıt filtre", "Taze kavrulmuş çekirdek kahve (15 g)", "Değirmen (orta-ince, ~600 µm)", "Hassas terazi ve zamanlayıcı", "İnce ağızlı kettle ve 93 °C su (250 g)"] },
      { h2: "Oran: 1:16,7" },
      { p: "Başlangıç için 15 gram kahveye 250 gram su öneriyoruz (yaklaşık 1:16,7). Daha yoğun bir fincan için 1:15'e, daha hafif ve berrak bir fincan için 1:17'ye yaklaşabilirsiniz. Demleme rehberimizdeki oran hesaplayıcı, kahve miktarına göre suyu sizin için hesaplar." },
      { h2: "Adım adım" },
      {
        ul: [
          "Filtreyi sıcak suyla ıslatın ve suyu dökün — hem kâğıt tadını giderir hem de demliği ısıtır.",
          "0:00 — Ön ıslatma (bloom): Kahvenin iki-üç katı (45 g) suyu ortadan dışa doğru dökün, demliği hafifçe çevirin. Taze kahve kabarıp karbondioksit bırakır.",
          "0:45 — Spiral döküş: Merkezden kenarlara ince ve sakin bir spiralle 150 g'a kadar dökün.",
          "1:15 — İkinci döküş: Aynı ritimle 250 g'a tamamlayın, su seviyesini sabit tutun.",
          "1:35 — Çevirme: Demliği nazikçe çevirerek kahve yatağını düzleştirin.",
          "2:45 — Süzülme biter: Yatak düz ve çamursuz kalmalı. Afiyet olsun.",
        ],
      },
      { h2: "Fincan ekşi ya da acıysa" },
      { p: "Ekşi, sulu ve kısa biten bir fincan genellikle az demlenmeyi (under-extraction) gösterir: Öğütmeyi biraz inceltin ya da suyu birkaç derece ısıtın. Acı, kuru ve buruk bir fincan aşırı demlenmeyi (over-extraction) gösterir: Öğütmeyi kalınlaştırın veya süreyi kısaltın. Bir seferde yalnızca bir değişkeni değiştirin." },
      { h2: "V60 için hangi kahve?" },
      { p: "Açık kavrulmuş, meyvemsi ve çiçeksi kahveler V60'ta parlar: Endonezya Guntur Honey (çiçeksi, şeftali, sarı elma), Frinsa #3 Extended Natural (kan portakalı, kırmızı meyve) ve Frinsa Honey (yaban mersini, böğürtlen) ilk önerilerimiz. Daha yuvarlak ve tatlı bir günlük fincan için Manis harmanını deneyin." },
      {
        links: [
          { href: "/kahveler/guntur-endonezya", label: "Guntur Endonezya Honey" },
          { href: "/kahveler/frinsa3", label: "Frinsa #3 Extended Natural" },
          { href: "/kahveler/manis-blend-espresso-filtre", label: "Manis Blend" },
          { href: "/demleme-rehberi", label: "Zamanlayıcılı demleme rehberi" },
        ],
      },
    ],
  },
  {
    slug: "endonezya-kahvesi-java",
    title: "Endonezya Kahvesi: Java, Wet Hulled ve Ruso Exotics",
    description:
      "Endonezya kahvesi neden farklı? Java'nın volkanik toprakları, Giling Basah (wet hulled) işleme, Garut ve Papandayan bölgeleri ve doğrudan ticaretle gelen Ruso Exotics serisi.",
    image: "/photos/story-indonesia.webp",
    date: "2026-10-09",
    readMin: 5,
    blocks: [
      { p: "Endonezya, dünyanın en büyük kahve üreticilerinden biri ve “Java” kelimesi pek çok dilde doğrudan kahveyle eş anlamlı. Sumatra, Sulawesi, Bali ve Flores gibi adaların her biri kendine has karakterde kahveler üretir; bizim kalbimiz ise Batı Java'nın Garut bölgesinde." },
      { h2: "Volkanik toprak ve yüksek rakım" },
      { p: "Batı Java'da kahve, Papandayan gibi aktif yanardağların eteklerinde 1.100–1.600 metre arasında yetişir. Volkanik kül, toprağı mineral açısından zenginleştirir; serin gece sıcaklıkları kirazın yavaş olgunlaşmasını ve şekerlerini daha çok biriktirmesini sağlar." },
      { h2: "Giling Basah (wet hulled) nedir?" },
      { p: "Endonezya'ya özgü bu yöntemde kahve, çekirdek henüz nemliyken kabuğundan ayrılır. Sonuç; tam gövdeli, kremamsı, düşük asiditeli ve hafif baharatlı, topraksı bir fincandır. Arjuna'mız bu geleneksel karakterin modern ve temiz bir yorumudur: karamel, esmer şeker, misket limonu ve kakao." },
      { h2: "Yeni nesil Endonezya: honey, natural ve fermantasyon" },
      { p: "Son yıllarda Java'daki üreticiler honey, natural ve kontrollü fermantasyon gibi yöntemlerle çok daha meyvemsi ve berrak kahveler üretiyor. Frinsa Estate'te Wildan Mustofa'nın 72 saat Lactobacillus ile fermente ettiği Frinsa #3, kan portakalı ve kırmızı meyve notalarıyla bunun en güzel örneklerinden." },
      { h2: "Ruso Exotics: doğrudan ticaret" },
      { p: "Ruso Exotics, Endonezya kahvelerini aracısız Türkiye'ye getirdiğimiz serimiz. Garut'taki üreticilerle bizzat tanışıp lotlarımızı onlarla el sıkışarak seçiyoruz; bu yüzden stoklarımız sınırlı ve her hasat biraz farklı." },
      {
        links: [
          { href: "/kahveler?koleksiyon=ruso-exotics", label: "Ruso Exotics serisi" },
          { href: "/kahveler/arjuna-endonezya", label: "Arjuna Wet Hulled" },
          { href: "/kahveler/frinsa3", label: "Frinsa #3 Extended Natural" },
          { href: "/kahveler/guntur-endonezya", label: "Guntur Honey" },
        ],
      },
    ],
  },
  {
    slug: "etiyopya-kahvesi",
    title: "Etiyopya Kahvesi: Kahvenin Anavatanından Çiçeksi Fincanlar",
    description:
      "Etiyopya kahvesinin özellikleri: heirloom çeşitler, Sidama ve Yirgacheffe bölgeleri, natural ve washed işleme; bergamot, yasemin ve meyve notaları. Filtre ve harmanlarda Etiyopya.",
    image: "/photos/cupping-pour.webp",
    date: "2026-10-09",
    readMin: 4,
    blocks: [
      { p: "Kahvenin anavatanı kabul edilen Etiyopya'da kahve hâlâ büyük ölçüde küçük köy üreticileri tarafından, yüzlerce yerel “heirloom” çeşitle yetiştirilir. Bu genetik çeşitlilik, Etiyopya kahvelerini dünyanın en karmaşık ve aromatik fincanları arasına sokar." },
      { h2: "Bölgeler: Sidama, Yirgacheffe, Guji" },
      { p: "Sidama ve onun alt bölgesi Yirgacheffe, 1.800–2.200 metreye varan rakımlarıyla çiçeksi ve narenciye notalı kahveleriyle tanınır. Shantawene, Sidama'nın yüksek köylerinden gelen bir natural lot: bergamot, portakal kabuğu ve kakao nibs." },
      { h2: "Natural mı, washed mı?" },
      { p: "Washed (yıkanmış) Etiyopya kahveleri yasemin, bergamot ve limon gibi berrak, çay gibi notalar verir. Natural (kirazıyla kurutulmuş) olanlar ise yaban mersini, çilek ve olgun meyve gibi daha yoğun, şurupsu bir karakter taşır." },
      { h2: "Harmanlarda Etiyopya" },
      { p: "Manis, Pagi ve Tanah harmanlarımızda Etiyopya'nın parlak meyvesini Endonezya'nın gövdesiyle buluşturuyoruz. Manis'te çikolata ve orman meyveleri, Pagi'de karamel ve badem, Tanah'ta bitter çikolata ve baharat öne çıkar." },
      {
        links: [
          { href: "/kategori/blends", label: "Günlük harmanlarımız" },
          { href: "/kahveler/ethiopia-shantawene", label: "Shantawene Etiyopya Natural" },
          { href: "/rehber/v60-ile-filtre-kahve-nasil-demlenir", label: "Etiyopya kahvesini V60'ta demlemek" },
        ],
      },
    ],
  },
  {
    slug: "kolombiya-kahvesi",
    title: "Kolombiya Kahvesi: Dengeli Klasikten Deneysel Fermantasyona",
    description:
      "Kolombiya kahvesinin özellikleri, Quindío ve Huila bölgeleri, Castillo çeşidi ve Jairo Arcila'nın karpuzlu anaerobik fermantasyonu gibi deneysel işlemeler.",
    image: "/photos/coffee-shelf.webp",
    date: "2026-10-09",
    readMin: 4,
    blocks: [
      { p: "Kolombiya, yılda iki hasat yapabilen nadir kahve ülkelerinden biridir. And Dağları'nın sırtlarındaki küçük çiftliklerde yetişen kahveler genellikle dengeli, tatlı ve orta gövdelidir — ama son yıllarda Kolombiya, dünyanın en yaratıcı işleme denemelerinin de merkezi oldu." },
      { h2: "Kahve Üçgeni: Quindío, Caldas, Risaralda" },
      { p: "UNESCO Dünya Mirası listesindeki Kahve Kültürü Peyzajı, Quindío'nun volkanik topraklarını da kapsar. Armenia çevresindeki çiftlikler 1.400–1.600 metrede, Castillo gibi hastalığa dayanıklı çeşitler yetiştirir." },
      { h2: "Deneysel fermantasyon" },
      { p: "Jairo Arcila'nın Santa Monica çiftliğinden gelen Watermelon lotunda kirazlar 48 saat anaerobik fermantasyona alınır ve tanklara gerçek karpuz eklenir. Fincanda karpuz, bal kavunu, nane ve misket limonu; bitişte Castillo'ya özgü yumuşak bir çikolata." },
      { h2: "Kolombiya kahvesi nasıl demlenir?" },
      { p: "Meyvemsi deneysel lotlar için Kalita Wave veya V60'ta 92 °C su; klasik, dengeli Kolombiya kahveleri için French Press veya espresso harika sonuç verir. Yaz aylarında cold brew de deneyin." },
      { links: [{ href: "/kahveler/watermelon-colombia", label: "Jairo Arcila Watermelon Colombia" }, { href: "/demleme-rehberi", label: "Kalita ve V60 tarifleri" }] },
    ],
  },
  {
    slug: "cekirdek-kahve-nasil-saklanir",
    title: "Çekirdek Kahve Nasıl Saklanır? Tazelik İçin 7 Kural",
    description:
      "Çekirdek kahve ne kadar dayanır, buzdolabında saklanır mı, öğütülmüş kahve ne kadar taze kalır? Taze kavrulmuş kahveyi en iyi hâlinde tüketmek için pratik öneriler.",
    image: "/photos/coffee-shelf.webp",
    date: "2026-10-09",
    readMin: 3,
    blocks: [
      { p: "Kahve kavrulduktan sonra yavaş yavaş aromasını kaybeder. Doğru saklama bu süreyi yavaşlatır; yanlış saklama ise en iyi çekirdeği bile birkaç günde sıradanlaştırır." },
      {
        ul: [
          "Kavrumdan sonraki 4 hafta içinde tüketin; en iyi tat genellikle 5. günden itibaren başlar.",
          "Ventilli, ışık geçirmeyen paketinde ya da hava almayan opak bir kapta saklayın.",
          "Isı, ışık, nem ve oksijen kahvenin düşmanıdır — ocak ve pencere kenarından uzak tutun.",
          "Buzdolabına koymayın: Nem ve koku çeker, her açışta yoğuşma olur.",
          "Uzun süre saklayacaksanız küçük porsiyonlar hâlinde, hava almayan paketlerle dondurucuya koyup bir daha çözüp dondurmayın.",
          "Öğütmeyi demlemeden hemen önce yapın: Öğütülmüş kahve aromasının büyük kısmını bir-iki gün içinde kaybeder.",
          "Az ve sık alın: Haftalık taze kavrum, iki-üç haftalık ihtiyacınız kadar.",
        ],
      },
      { h2: "Paketteki tarih neyi gösterir?" },
      { p: "Flores Roastery paketlerinin üzerindeki tarih son kullanma değil, kavrum tarihidir. Tüm çekirdeklerimizi haftalık kavurduğumuz için kahveniz size her zaman taze ulaşır." },
      { links: [{ href: "/kahveler", label: "Haftalık taze kavrum kahvelerimiz" }, { href: "/rehber/hangi-demleme-icin-hangi-kahve", label: "Hangi demleme için hangi kahve?" }] },
    ],
  },
  {
    slug: "hangi-demleme-icin-hangi-kahve",
    title: "Hangi Demleme Yöntemi İçin Hangi Kahve? (Filtre, Espresso, Moka Pot, Türk Kahvesi)",
    description:
      "V60, filtre kahve makinesi, French Press, espresso, moka pot, cold brew ve Türk kahvesi için doğru çekirdek ve öğütme kalınlığı seçimi — yeni başlayanlar için rehber.",
    image: "/photos/brew-kit.webp",
    date: "2026-10-09",
    readMin: 4,
    blocks: [
      { p: "Aynı çekirdek farklı yöntemlerde bambaşka fincanlar verir. Doğru çekirdek ve doğru öğütme kalınlığı, evdeki kahvenizi kafedekine en çok yaklaştıran iki karardır." },
      { h2: "V60, Origami ve Kalita (pour-over)" },
      { p: "Orta-ince öğütme (~600 µm). Açık kavrulmuş, meyvemsi ve çiçeksi tek köken kahveler: Guntur, Frinsa #3, Frinsa Honey, Watermelon." },
      { h2: "Filtre kahve makinesi" },
      { p: "Orta öğütme (~650 µm). Dengeli ve tatlı kahveler: Manis, Pagi, Ochuspe. Ofis için büyük paketler ekonomiktir." },
      { h2: "French Press ve cold brew" },
      { p: "Kalın öğütme (~1000–1200 µm). Gövdeli ve çikolatalı kahveler: Tanah, Arjuna; cold brew için Manis ve Kolombiya." },
      { h2: "Espresso ve sütlü içecekler" },
      { p: "İnce öğütme (~250 µm). Kremamsı gövde ve karamel tatlılığı: Arjuna, Pagi, Tanah, Ochuspe. Latte ve flat white için Pagi ve Arjuna sütün içinde kaybolmaz." },
      { h2: "Moka pot ve Türk kahvesi" },
      { p: "Moka pot için ince-orta, Türk kahvesi için pudra inceliğinde öğütme. Orta-koyu kavrulmuş, düşük asiditeli kahveler: Tanah ve Türk Kahvesi by Flores." },
      { links: [{ href: "/demleme-rehberi", label: "Öğütme rehberi ve oran hesaplayıcı" }, { href: "/kategori/espresso", label: "Espresso kahveleri" }, { href: "/kategori/single-origin", label: "Single origin kahveler" }] },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
