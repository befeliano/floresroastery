/**
 * Ürün içeriği çevirileri (EN, ID). Türkçe kaynak: src/lib/commerce/catalog.ts
 * - PHRASES: katalogda tekrar eden kısa ifadeler (Türkçe metin → çeviri)
 * - PRODUCTS: ürüne özel uzun metinler
 */

type Tr = { en: string; id: string };

/** Kısa ifadeler — tadım notaları, işleme, köken, demleme adımları, öğütme... */
export const PHRASES: Record<string, Tr> = {
  // tadım notaları
  Karamel: { en: "Caramel", id: "Karamel" },
  "Esmer Şeker": { en: "Brown Sugar", id: "Gula Cokelat" },
  "Misket Limonu": { en: "Lime", id: "Jeruk Nipis" },
  Kakao: { en: "Cocoa", id: "Kakao" },
  Baharat: { en: "Spice", id: "Rempah" },
  "Beyaz Üzüm": { en: "White Grape", id: "Anggur Putih" },
  "Altın Kuru Üzüm": { en: "Golden Raisin", id: "Kismis Emas" },
  "Kan Portakalı": { en: "Blood Orange", id: "Jeruk Darah" },
  "Kırmızı Meyveler": { en: "Red Fruits", id: "Buah Merah" },
  "Yaban Mersini": { en: "Blueberry", id: "Bluberi" },
  Böğürtlen: { en: "Blackberry", id: "Blackberry" },
  Erik: { en: "Plum", id: "Plum" },
  Çiçeksi: { en: "Floral", id: "Floral" },
  Şeftali: { en: "Peach", id: "Persik" },
  "Sarı Elma": { en: "Yellow Apple", id: "Apel Kuning" },
  Karpuz: { en: "Watermelon", id: "Semangka" },
  "Bal Kavunu": { en: "Honeydew", id: "Melon Madu" },
  Nane: { en: "Mint", id: "Mint" },
  Çikolata: { en: "Chocolate", id: "Cokelat" },
  "Sütlü Çikolata": { en: "Milk Chocolate", id: "Cokelat Susu" },
  Fındık: { en: "Hazelnut", id: "Hazelnut" },
  "Orman Meyveleri": { en: "Forest Fruits", id: "Buah Hutan" },
  Tarçın: { en: "Cinnamon", id: "Kayu Manis" },
  Badem: { en: "Almond", id: "Almond" },
  "Bitter Çikolata": { en: "Dark Chocolate", id: "Cokelat Hitam" },
  "Kavrulmuş Kuruyemiş": { en: "Roasted Nuts", id: "Kacang Panggang" },
  Ahududu: { en: "Raspberry", id: "Raspberi" },
  Bergamot: { en: "Bergamot", id: "Bergamot" },
  "Portakal Kabuğu": { en: "Orange Peel", id: "Kulit Jeruk" },
  "Kakao Nibs": { en: "Cacao Nibs", id: "Kakao Nibs" },

  // kavurma
  Açık: { en: "Light", id: "Terang" },
  "Açık-Orta": { en: "Light-Medium", id: "Terang-Sedang" },
  Orta: { en: "Medium", id: "Sedang" },
  "Orta-Koyu": { en: "Medium-Dark", id: "Sedang-Gelap" },

  // köken
  Endonezya: { en: "Indonesia", id: "Indonesia" },
  Etiyopya: { en: "Ethiopia", id: "Etiopia" },
  Meksika: { en: "Mexico", id: "Meksiko" },
  Kolombiya: { en: "Colombia", id: "Kolombia" },
  "Endonezya × Etiyopya": { en: "Indonesia × Ethiopia", id: "Indonesia × Etiopia" },
  "Etiyopya × Endonezya": { en: "Ethiopia × Indonesia", id: "Etiopia × Indonesia" },
  "Garut, Batı Java": { en: "Garut, West Java", id: "Garut, Jawa Barat" },
  "Weninggalih, Batı Java": { en: "Weninggalih, West Java", id: "Weninggalih, Jawa Barat" },
  "Papandayan, Garut, Batı Java": { en: "Papandayan, Garut, West Java", id: "Papandayan, Garut, Jawa Barat" },
  "Günlük harman": { en: "Daily blend", id: "Blend harian" },
  "Filtre makinesi, V60, AeroPress & Türk kahvesi": { en: "Filter machine, V60, AeroPress & Turkish coffee", id: "Mesin filter, V60, AeroPress & kopi Turki" },

  // işleme
  "Doğal Anaerobik · 60 saat": { en: "Natural anaerobic · 60 hours", id: "Natural anaerob · 60 jam" },
  "Extended Natural · 72 saat yarı anaerobik Lactobacillus": {
    en: "Extended Natural · 72-hour semi-anaerobic Lactobacillus",
    id: "Extended Natural · 72 jam semi-anaerob Lactobacillus",
  },
  "Honey + Saccharomyces (uzatılmış fermantasyon)": { en: "Honey + Saccharomyces (extended fermentation)", id: "Honey + Saccharomyces (fermentasi diperpanjang)" },
  Harman: { en: "Blend", id: "Blend" },
  "Swiss Water (doğal su ile kafeinsizleştirme)": { en: "Swiss Water (chemical-free water decaf)", id: "Swiss Water (dekafeinasi dengan air, tanpa bahan kimia)" },
  "Washed + Watermelon (48 saat anaerobik fermantasyon + karpuz ilavesi)": {
    en: "Washed + Watermelon (48-hour anaerobic fermentation with watermelon)",
    id: "Washed + Watermelon (fermentasi anaerob 48 jam dengan semangka)",
  },
  "Natural (Doğal)": { en: "Natural", id: "Natural" },

  // hasat, çeşit, ek bilgiler
  "El ile seçilmiş olgun kirazlar": { en: "Hand-picked ripe cherries", id: "Ceri matang petik tangan" },
  "Seçilmiş en olgun kirazlar": { en: "Selectively picked, ripest cherries", id: "Ceri paling matang pilihan" },
  "El ile seçilmiş en olgun kirazlar": { en: "Hand-picked, ripest cherries", id: "Ceri paling matang petik tangan" },
  "%100 Arabica": { en: "100% Arabica", id: "100% Arabika" },
  "Etiyopya yerel çeşitleri (Heirloom)": { en: "Ethiopian heirloom varieties", id: "Varietas lokal Etiopia (Heirloom)" },
  "Marka / Tedarik": { en: "Brand / Sourcing", id: "Merek / Sumber" },
  "Toprak yapısı": { en: "Soil", id: "Jenis tanah" },
  "Volkanik kül": { en: "Volcanic ash", id: "Abu vulkanik" },

  // önerilen demleme
  Filtre: { en: "Filter", id: "Filter" },
  "Filtre & Espresso": { en: "Filter & Espresso", id: "Filter & Espresso" },
  "Espresso & Filtre": { en: "Espresso & Filter", id: "Espresso & Filter" },
  "Filtre, V60 & AeroPress": { en: "Filter, V60 & AeroPress", id: "Filter, V60 & AeroPress" },
  "Filtre & Sütlü içecekler": { en: "Filter & milk drinks", id: "Filter & minuman susu" },
  "Espresso, Moka Pot & Türk Kahvesi": { en: "Espresso, Moka Pot & Turkish coffee", id: "Espresso, Moka Pot & kopi Turki" },

  // öğütme seçenekleri
  "Çekirdek (öğütülmemiş)": { en: "Whole bean (unground)", id: "Biji utuh (tidak digiling)" },
  "Türk Kahvesi": { en: "Turkish coffee", id: "Kopi Turki" },
  "Filtre (makine)": { en: "Filter (machine)", id: "Filter (mesin)" },

  // demleme şablonları — ekipman ve öğütme
  "Espresso makinesi · 18 g sepet": { en: "Espresso machine · 18 g basket", id: "Mesin espresso · basket 18 g" },
  "Orta-ince · ~600 µm": { en: "Medium-fine · ~600 µm", id: "Sedang-halus · ~600 µm" },
  "Orta · ~650 µm": { en: "Medium · ~650 µm", id: "Sedang · ~650 µm" },
  "Orta-kalın · ~800 µm": { en: "Medium-coarse · ~800 µm", id: "Sedang-kasar · ~800 µm" },
  "İnce · ~250 µm": { en: "Fine · ~250 µm", id: "Halus · ~250 µm" },
  "Kalın · ~1000 µm": { en: "Coarse · ~1000 µm", id: "Kasar · ~1000 µm" },

  // demleme adımları
  "Ön ıslatma": { en: "Bloom", id: "Blooming" },
  "Spiral döküş": { en: "Spiral pour", id: "Tuang spiral" },
  Çevirme: { en: "Swirl", id: "Putar" },
  "Süzülme biter": { en: "Drawdown ends", id: "Tetesan selesai" },
  "Yoğun spiral": { en: "Intense spiral", id: "Spiral intens" },
  "Son döküş": { en: "Final pour", id: "Tuangan terakhir" },
  "Ön demleme": { en: "Pre-infusion", id: "Pra-infusi" },
  "İlk damlalar": { en: "First drops", id: "Tetesan pertama" },
  "Bal kıvamında akış": { en: "Honey-like flow", id: "Aliran sekental madu" },
  "Renk açılıyor": { en: "Blonding", id: "Warna memudar" },
  Durdur: { en: "Stop", id: "Hentikan" },
  "Tüm suyu ekleyin": { en: "Add all the water", id: "Tuang semua air" },
  "Kabuğu kırın": { en: "Break the crust", id: "Pecahkan kerak" },
  "Köpüğü alın": { en: "Skim the foam", id: "Buang busa" },
  "Bastırın ve servis": { en: "Plunge and serve", id: "Tekan dan sajikan" },
  "Tüm telveyi ıslatacak şekilde ortadan dışa doğru dökün, demliği hafifçe çevirin.": {
    en: "Pour from the centre outwards to wet all the grounds, then gently swirl the brewer.",
    id: "Tuang dari tengah ke luar hingga semua bubuk basah, lalu putar dripper perlahan.",
  },
  "Merkezden kenarlara ince ve sakin bir spiral.": { en: "A thin, calm spiral from the centre to the edges.", id: "Spiral tipis dan tenang dari tengah ke tepi." },
  "Aynı ritimle, su seviyesini sabit tutun.": { en: "Same rhythm — keep the water level steady.", id: "Dengan ritme yang sama, jaga ketinggian air tetap stabil." },
  "Demliği nazikçe çevirerek kahve yatağını düzleştirin.": { en: "Gently swirl the brewer to level the coffee bed.", id: "Putar dripper perlahan untuk meratakan bed kopi." },
  "Yatak düz ve çamursuz kalmalı. Afiyet olsun.": { en: "The bed should be flat, not muddy. Enjoy.", id: "Bed kopi harus rata dan tidak berlumpur. Selamat menikmati." },
  "60 g su ile telveyi eşit şekilde ıslatın.": { en: "Wet the grounds evenly with 60 g of water.", id: "Basahi bubuk secara merata dengan 60 g air." },
  "Hızlı ama kontrollü bir spiral döküş.": { en: "A quick but controlled spiral pour.", id: "Tuangan spiral yang cepat namun terkendali." },
  "Toplam süre 3:15 – 3:45 arası hedeflenir.": { en: "Aim for a total time of 3:15–3:45.", id: "Targetkan total waktu 3:15–3:45." },
  "75 g su, kaşıkla nazikçe karıştırın.": { en: "75 g of water; stir gently with a spoon.", id: "75 g air; aduk perlahan dengan sendok." },
  "Kalın filtre nedeniyle 4–4:30 dk normaldir.": { en: "4–4:30 min is normal with the thick filter.", id: "4–4:30 menit wajar karena filternya tebal." },
  "Düşük basınçla 4–6 sn telveyi ıslatın.": { en: "Wet the puck at low pressure for 4–6 s.", id: "Basahi bubuk dengan tekanan rendah selama 4–6 detik." },
  "Koyu, yoğun ilk damlalar gelmeli.": { en: "Dark, dense first drops should appear.", id: "Tetesan pertama harus gelap dan pekat." },
  "Kaplan desenli, kesintisiz akış.": { en: "Tiger-striped, uninterrupted flow.", id: "Aliran bercorak harimau, tanpa putus." },
  "Akış açık kahveye dönerken hazır olun.": { en: "Get ready as the flow turns light brown.", id: "Bersiaplah saat aliran berubah cokelat muda." },
  "Telveyi tamamen ıslatacak şekilde hızlıca dökün.": { en: "Pour quickly so all the grounds are wet.", id: "Tuang cepat hingga semua bubuk basah." },
  "Yüzeydeki kabuğu kaşıkla nazikçe karıştırın, kapağı kapatın.": { en: "Gently stir the crust with a spoon, then put the lid on.", id: "Aduk kerak di permukaan perlahan dengan sendok, lalu tutup." },
  "Yüzeydeki köpük ve ince parçacıkları kaşıkla alın.": { en: "Skim the foam and fines off the surface with a spoon.", id: "Ambil busa dan partikel halus di permukaan dengan sendok." },
  "Pistonu yavaşça indirip hemen servis edin.": { en: "Press the plunger down slowly and serve right away.", id: "Tekan plunger perlahan dan segera sajikan." },
};

/** Kalıp içeren ifadeler (sayılar değişir) */
export const PATTERNS: { re: RegExp; en: string; id: string }[] = [{ re: /^(\d+) g çıktıda shot'ı kesin\.$/, en: "Cut the shot at $1 g.", id: "Hentikan shot pada $1 g." }];

export interface ProductText {
  fullName?: string;
  subtitle: string;
  headline?: string;
  bodyAcidity?: string;
  description: string;
  story: string[];
  tips?: { filter?: string; espresso?: string };
}

export const PRODUCTS: Record<"en" | "id", Record<string, ProductText>> = {
  en: {
    "guntur-endonezya": {
      fullName: "Guntur Indonesia Honey",
      subtitle: "Indonesia · Garut, West Java",
      headline: "A flower garden in the mountains of Java",
      bodyAcidity: "Medium body, bright fruity acidity, silky texture",
      description: "Guntur Indonesia Honey whole-bean coffee from Garut, West Java — a bright, silky filter coffee with notes of florals, peach, yellow apple and brown sugar.",
      story: [
        "From the misty slopes of Garut in West Java, Guntur Honey offers a Java experience unlike any other. Brought to life by the meticulous work of renowned producer Redi Purnawan, it is a refined combination of Typica, Ateng and the rare Yellow Bourbon.",
        "Refreshing as a spring morning: floral notes greet you on the first sip and soon give way to the sweetness of peach and juicy yellow apple, with brown-sugar depth balancing the fruit. In the honey process part of the mucilage is left on the bean while it dries — that is where the honey-like sweetness comes from.",
        "A limited lot chosen through Ruso Exotics' direct-trade philosophy — sealed with a handshake with our producer Redi Purnawan.",
      ],
      tips: { filter: "For the floral opening: water at 93 °C and a thin, calm spiral pour." },
    },
    "el-savador-ochuspe": {
      fullName: "El Salvador Ochuspe — Natural Anaerobic 60 Hours",
      subtitle: "El Salvador · Santa Ana",
      headline: "From the Apaneca-Ilamatepec volcanoes",
      description: "El Salvador Finca Ochuspe natural anaerobic whole-bean coffee — white grape, golden raisin and caramel; scored 85 SCA, great for espresso and filter.",
      story: [
        "Grown in the rich soils of the Apaneca-Ilamatepec volcanic range in El Salvador's Santa Ana region, this coffee is part of the family legacy of fourth-generation producer Mauricio Escalón.",
        "Hand-picked at 1,250 metres, the cherries ferment for 60 hours without oxygen. The process builds an intensely aromatic profile without tipping into over-fermentation: the fruity sweetness of white grape and golden raisin meets a balanced caramel body in the cup.",
      ],
      tips: {
        filter: "The flat bed of the Kalita Wave is ideal for bringing out the anaerobic fruit.",
        espresso: "Raisin and caramel as a straight espresso; a caramel-like latte with milk.",
      },
    },
    frinsa3: {
      fullName: "Indonesia Frinsa #3 — Extended Natural",
      subtitle: "Indonesia · Weninggalih, West Java",
      headline: "72 hours with Lactobacillus",
      bodyAcidity: "Medium-full, syrupy body; lively, bright, fruity acidity",
      description: "Indonesia Frinsa #3 Extended Natural whole-bean coffee — 72-hour Lactobacillus fermentation; a syrupy, sweet filter coffee with blood orange and red fruit.",
      story: [
        "Carefully picked cherries ferment for 72 hours with Lactobacillus in tanks fitted with a small vent, developing a depth far beyond ordinary flavours.",
        "On the palate, the lively, sweet and juicy citrus of blood orange; complex layers of red fruit mid-palate; a clean, lingering sweetness on the finish.",
        "Unlike traditional wet-hulled Indonesian coffees, it goes through a modern, meticulous and controlled process at Wildan Mustofa's Java Frinsa Estate at 1,400 metres, pushing cup clarity to the top.",
      ],
      tips: { filter: "We suggest a 1:15–1:16 ratio, water at 90–93 °C and a 2:15–3:00 drawdown. For AeroPress / Kalita / Clever: 1:15, medium-coarse, 1:30–2:00." },
    },
    "endonezya-frinsa-estate-honey-saccharomyces-filtre": {
      fullName: "Indonesia Frinsa Estate — Honey Saccharomyces",
      subtitle: "Indonesia · Weninggalih, Java",
      headline: "Honey process, yeast fermentation",
      bodyAcidity: "Medium-high, captivating body; balanced, fruity but never overpowering acidity",
      description: "Indonesia Frinsa Estate Honey Saccharomyces whole-bean coffee — blueberry, blackberry and plum with balanced acidity and a rich body.",
      story: [
        "Grown on the high plateaus of Weninggalih in Java, this special lot is a flavour journey beyond the ordinary. It starts with the honey process and is completed by Saccharomyces yeast fermentation.",
        "Intense blueberry and blackcurrant sweetness on the palate, wine-like red fruit and sour cherry mid-palate, a lingering plum finish. Compact and intense as espresso, long and layered as filter; balanced fruit with AeroPress or V60.",
      ],
      tips: {
        filter: "We suggest a 1:16–1:18 ratio, water at 88–92 °C and a 2:00–3:30 drawdown. AeroPress / Kalita / Clever: 1:15, medium-coarse, 1:30–2:00.",
        espresso: "Compact and intense — a fruit bomb as espresso.",
      },
    },
    "arjuna-endonezya": {
      fullName: "Arjuna Indonesia Wet Hulled",
      subtitle: "Indonesia · Garut, West Java",
      headline: "The creamy body of Java",
      bodyAcidity: "Full body, creamy texture, low and balanced acidity",
      description: "Arjuna Indonesia Wet Hulled whole-bean coffee — caramel, brown sugar, lime, cocoa and spice; full-bodied, creamy and low in acidity.",
      story: [
        "Grown at 1,100–1,400 metres in Garut, West Java, Arjuna is born from Typica, Ateng, Catimor and Sigararutang processed with Indonesia's own Giling Basah (wet-hulled) method.",
        "Caramel and brown-sugar sweetness, a fresh hint of lime and a cocoa–spice depth. Full-bodied and creamy with low, balanced acidity — as strong in filter as it is in espresso.",
        "This series is one of Ruso Exotics' limited-batch boutique selections.",
      ],
      tips: {
        espresso: "The creamy body loves milk: 1:2 for a flat white.",
        filter: "The thick Chemex filter softens the spice and lets the caramel shine.",
      },
    },
    "manis-blend-espresso-filtre": {
      subtitle: "Ethiopia · Sidamo",
      headline: "Ready for a sweet break with Manis?",
      bodyAcidity: "Soft, smooth body; gentle fruity acidity; pronounced natural sweetness",
      description: "Manis Ethiopia Sidamo single-origin whole-bean coffee — chocolate, forest fruits and cinnamon; a soft, fruity, naturally sweet medium roast for V60, filter machines, AeroPress and Turkish coffee.",
      story: [
        "Named after the Indonesian word for \"sweet\", Manis is a special Ethiopian coffee that lives up to its name. If you want soft, fruity, naturally sugary flavours instead of bitterness, Manis and its friendly mascot are for you.",
        "A careful medium roast brings out the bean's natural fruit sugars in balance: rich chocolate notes are joined by lively forest fruits and a warming touch of cinnamon on the finish.",
        "A slow Sunday-morning V60, a quick filter coffee at the office or a finely ground modern Turkish coffee — an easy, enjoyable cup every time.",
      ],
      tips: {
        filter: "For the fruity, sweet notes: V60, AeroPress or a filter coffee machine — also lovely as a finely ground modern Turkish coffee.",
        espresso: "Chocolatey as a straight espresso, a cinnamon finish with milk.",
      },
    },
    pagi: {
      subtitle: "Ethiopia × Indonesia blend",
      headline: "Add flavour to your mornings with Pagi",
      bodyAcidity: "Balanced, round body; soft and gentle acidity; pronounced natural sweetness",
      description: "Pagi Blend whole-bean coffee — caramel, almond and chocolate; a balanced everyday blend, ideal for filter coffee and for lattes, cappuccinos and flat whites.",
      story: [
        "Named after the Indonesian word for \"morning\", Pagi was designed for the perfect start to the day. Bringing Ethiopia's bright, lively character together with Indonesia's rich texture, this blend turns morning grogginess into a pleasant awakening.",
        "A medium roast delivers perfect balance: sweet caramel and roasted almond on the first sip, a satisfying, smooth chocolate on the finish. An easy \"every day\" coffee you can drink all day long.",
      ],
      tips: {
        filter: "A balanced morning cup with a filter machine, V60 or French Press.",
        espresso: "A strong base for lattes, cappuccinos and flat whites.",
      },
    },
    tanah: {
      subtitle: "Ethiopia × Indonesia blend",
      headline: "Meet coffee at its boldest",
      bodyAcidity: "Full-bodied and intense; low, gentle acidity",
      description: "Tanah Blend whole-bean coffee — dark chocolate, roasted nuts and spice; full-bodied and low in acidity, for espresso, moka pot and Turkish coffee.",
      story: [
        "Named after the Indonesian word for \"earth\", Tanah was blended for those who want intensity, strength and body from their coffee. The most characterful beans of Ethiopia and Indonesia come together to reveal coffee's deep, earthy nature.",
        "Our medium-dark roast profile unlocks rich aromas while keeping acidity to a minimum: intense dark chocolate and roasted nuts, with a warm breath of spice on the finish.",
        "Its bold structure never gets lost in milk — great for lattes and cortados; and a French Press for those who like a strong filter coffee.",
      ],
      tips: {
        espresso: "Medium-dark roast: 92 °C to avoid bitterness.",
        filter: "French Press for a strong, full-bodied filter.",
      },
    },
    kafeinsizmeksika: {
      fullName: "Decaf Mexico — Swiss Water Decaf",
      subtitle: "Mexico · Altura, Chiapas",
      headline: "Chemical-free, 99.9% caffeine-free",
      bodyAcidity: "Medium body, balanced and easy acidity, smooth finish",
      description: "Decaf Mexico Swiss Water whole-bean coffee — 99.9% decaffeinated without chemicals; smooth and sweet with milk chocolate and hazelnut.",
      story: [
        "The Swiss Water process removes 99.9% of the caffeine using only water, osmosis and solubility — no chemicals. Mountain water preserves the coffee's original flavour and aroma.",
        "We roast to City (medium) to protect the beans' flavour and oils — the most balanced point of acidity and aroma. On the palate, the sweet, smooth and silky touch of milk chocolate.",
        "All our beans are roasted weekly; the date on the bag is the day your coffee was roasted. For the best flavour, enjoy within a month.",
      ],
      tips: { espresso: "An evening espresso: like milk chocolate with milk." },
    },
    "watermelon-colombia": {
      fullName: "Jairo Arcila Watermelon Colombia — Washed",
      subtitle: "Colombia · Armenia, Quindío",
      headline: "An extraordinary summer breeze",
      bodyAcidity: "Lively profile, smooth medium body, bright acidity",
      description: "Jairo Arcila Watermelon Colombia whole-bean coffee — 48-hour anaerobic fermentation with watermelon; notes of watermelon, honeydew, mint and lime.",
      story: [
        "Grown at 1,450–1,500 metres in the volcanic soils of Armenia, Quindío, this coffee is the product of an experimental process that pushes the boundaries of coffee. Castillo beans grown by renowned producer Jairo Arcila on his Santa Monica farm.",
        "Cherries sorted in flotation tanks undergo a 48-hour dry anaerobic fermentation at the La Pradera processing centre; real watermelon added to the tanks gives the beans their unique juicy sweetness. They are then washed and dried on raised beds for about 10 days until they reach 9.5–11% moisture.",
        "In the cup, dominant watermelon and honeydew, a refreshing touch of mint and lime acidity; a soft chocolate finish typical of Castillo.",
      ],
    },
    "papandayan-endonezya": {
      fullName: "Papandayan Indonesia Natural",
      subtitle: "Indonesia · Garut, West Java",
      headline: "The wild, elegant side of Java",
      bodyAcidity: "Medium-high body, lively fruity acidity",
      description: "Papandayan Indonesia Natural whole-bean coffee — from the foothills of Papandayan volcano in West Java; a micro-lot with floral, raspberry and plum notes.",
      story: [
        "From the foothills of Mount Papandayan, one of West Java's most iconic peaks, and the fertile soils of Garut, this coffee combines the intense fruitiness of the natural process with the elegance of fine varieties such as Typica and Sigararutang.",
        "Lively raspberry and sweet plum burst on the first sip, giving way to an elegant floral finish as the coffee cools. The cherries are sun-dried whole, locking all the fruit's sugar into the heart of the bean.",
        "A limited micro-lot hand-selected by Ruso Exotics from the farms of Indonesia.",
      ],
    },
    "ethiopia-shantawene": {
      fullName: "Shantawene Ethiopia Natural",
      subtitle: "Ethiopia · Sidama",
      description: "Shantawene Ethiopia Natural whole-bean coffee — bergamot, orange peel and cacao nibs. Back in stock when the new harvest arrives.",
      story: [
        "From the highland villages of Sidama, Shantawene brings together the fruity depth of naturally dried cherries and the floral elegance of Ethiopia.",
        "The aromatic brightness of bergamot, the lively citrus of orange peel and cacao nibs on the finish. Sign up below and we will let you know when the new harvest arrives.",
      ],
    },
  },
  id: {
    "guntur-endonezya": {
      fullName: "Guntur Indonesia Honey",
      subtitle: "Indonesia · Garut, Jawa Barat",
      headline: "Taman bunga di pegunungan Jawa",
      bodyAcidity: "Body sedang, keasaman buah yang cerah, tekstur lembut seperti sutra",
      description: "Biji kopi Guntur Indonesia Honey dari Garut, Jawa Barat — kopi filter yang cerah dan lembut dengan nuansa floral, persik, apel kuning, dan gula cokelat.",
      story: [
        "Dari lereng berkabut Garut di Jawa Barat, Guntur Honey menghadirkan pengalaman kopi Jawa yang berbeda. Lahir dari tangan teliti produsen ternama Redi Purnawan, kopi ini merupakan perpaduan apik Typica, Ateng, dan Yellow Bourbon yang langka.",
        "Menyegarkan seperti pagi di musim semi: nuansa floral menyambut di tegukan pertama, lalu berganti dengan manisnya persik dan apel kuning yang juicy; kedalaman gula cokelat menyeimbangkan rasa buahnya. Pada proses honey, sebagian lendir buah dibiarkan menempel saat dikeringkan — dari sinilah rasa manis seperti madu berasal.",
        "Lot terbatas yang kami pilih melalui filosofi direct trade Ruso Exotics — langsung berjabat tangan dengan produsen kami, Redi Purnawan.",
      ],
      tips: { filter: "Untuk pembukaan floral: air 93 °C dan tuangan spiral yang tipis dan tenang." },
    },
    "el-savador-ochuspe": {
      fullName: "El Salvador Ochuspe — Natural Anaerob 60 Jam",
      subtitle: "El Salvador · Santa Ana",
      headline: "Dari gunung berapi Apaneca-Ilamatepec",
      description: "Biji kopi El Salvador Finca Ochuspe natural anaerob — anggur putih, kismis emas, dan karamel; skor SCA 85, cocok untuk espresso dan filter.",
      story: [
        "Tumbuh di tanah subur pegunungan vulkanik Apaneca-Ilamatepec di wilayah Santa Ana, El Salvador, kopi ini adalah bagian dari warisan keluarga Mauricio Escalón, produsen kopi generasi keempat.",
        "Ceri yang dipetik tangan di ketinggian 1.250 meter difermentasi tanpa oksigen selama 60 jam. Proses ini menghasilkan profil yang sangat aromatik tanpa berlebihan: manisnya anggur putih dan kismis emas berpadu dengan body karamel yang seimbang.",
      ],
      tips: {
        filter: "Bed datar Kalita Wave ideal untuk menonjolkan rasa buah anaerobnya.",
        espresso: "Kismis dan karamel sebagai espresso murni; latte bernuansa karamel dengan susu.",
      },
    },
    frinsa3: {
      fullName: "Indonesia Frinsa #3 — Extended Natural",
      subtitle: "Indonesia · Weninggalih, Jawa Barat",
      headline: "72 jam bersama Lactobacillus",
      bodyAcidity: "Body sedang-penuh seperti sirup; keasaman buah yang hidup dan cerah",
      description: "Biji kopi Indonesia Frinsa #3 Extended Natural — fermentasi Lactobacillus 72 jam; kopi filter manis seperti sirup dengan jeruk darah dan buah merah.",
      story: [
        "Ceri kopi yang dipetik dengan cermat difermentasi bersama Lactobacillus selama 72 jam di tangki berlubang kecil, menghasilkan kedalaman rasa yang jauh melampaui biasanya.",
        "Di lidah, karakter jeruk darah yang hidup, manis, dan juicy; lapisan buah merah yang kompleks di tengah; serta jejak manis yang bersih dan bertahan lama di akhir.",
        "Berbeda dengan kopi Indonesia tradisional (giling basah), kopi ini diproses secara modern, teliti, dan terkendali di Java Frinsa Estate milik Wildan Mustofa pada ketinggian 1.400 meter, sehingga kebersihan cangkirnya maksimal.",
      ],
      tips: { filter: "Kami sarankan rasio 1:15–1:16, air 90–93 °C, dan waktu tetes 2:15–3:00. Untuk AeroPress / Kalita / Clever: 1:15, gilingan sedang-kasar, 1:30–2:00." },
    },
    "endonezya-frinsa-estate-honey-saccharomyces-filtre": {
      fullName: "Indonesia Frinsa Estate — Honey Saccharomyces",
      subtitle: "Indonesia · Weninggalih, Jawa",
      headline: "Proses honey, fermentasi ragi",
      bodyAcidity: "Body sedang-tinggi yang memikat; keasaman buah yang seimbang dan tidak mendominasi",
      description: "Biji kopi Indonesia Frinsa Estate Honey Saccharomyces — bluberi, blackberry, dan plum dengan keasaman seimbang dan body yang kaya.",
      story: [
        "Tumbuh di dataran tinggi Weninggalih, Jawa, lot istimewa ini menawarkan perjalanan rasa di luar kebiasaan. Dimulai dengan proses honey dan disempurnakan dengan fermentasi ragi Saccharomyces.",
        "Manisnya bluberi dan kismis hitam yang intens di lidah, buah merah seperti anggur dan ceri asam di tengah, serta jejak plum yang bertahan di akhir. Padat dan intens sebagai espresso, panjang dan berlapis sebagai filter; seimbang dengan AeroPress atau V60.",
      ],
      tips: {
        filter: "Kami sarankan rasio 1:16–1:18, air 88–92 °C, dan waktu tetes 2:00–3:30. AeroPress / Kalita / Clever: 1:15, sedang-kasar, 1:30–2:00.",
        espresso: "Padat dan intens — bom buah sebagai espresso.",
      },
    },
    "arjuna-endonezya": {
      fullName: "Arjuna Indonesia Wet Hulled",
      subtitle: "Indonesia · Garut, Jawa Barat",
      headline: "Body Jawa yang creamy",
      bodyAcidity: "Body penuh, tekstur creamy, keasaman rendah dan seimbang",
      description: "Biji kopi Arjuna Indonesia Wet Hulled — karamel, gula cokelat, jeruk nipis, kakao, dan rempah; body penuh, creamy, dan rendah asam.",
      story: [
        "Tumbuh di ketinggian 1.100–1.400 meter di Garut, Jawa Barat, Arjuna lahir dari varietas Typica, Ateng, Catimor, dan Sigararutang yang diproses dengan metode khas Indonesia, giling basah (wet hulled).",
        "Manisnya karamel dan gula cokelat, segarnya jeruk nipis, serta kedalaman kakao dan rempah. Body penuh dan creamy dengan keasaman rendah yang seimbang — sama kuatnya di filter maupun espresso.",
        "Seri ini adalah salah satu pilihan butik terbatas (Limited Batch) dari Ruso Exotics.",
      ],
      tips: {
        espresso: "Body creamy-nya cocok dengan susu: 1:2 untuk flat white.",
        filter: "Filter Chemex yang tebal melembutkan rempah dan menonjolkan karamel.",
      },
    },
    "manis-blend-espresso-filtre": {
      subtitle: "Etiopia · Sidamo",
      headline: "Siap untuk rehat manis bersama Manis?",
      bodyAcidity: "Body lembut dan halus, keasaman buah yang lembut, rasa manis alami yang jelas",
      description: "Biji kopi single origin Manis Etiopia Sidamo — cokelat, buah hutan, dan kayu manis; sangrai sedang yang lembut, fruity, dan manis alami untuk V60, mesin kopi filter, AeroPress, dan kopi Turki.",
      story: [
        "Ya, namanya memang diambil dari kata \"manis\" — kopi Etiopia istimewa ini benar-benar sesuai namanya. Jika Anda mencari rasa lembut, fruity, dan manis alami alih-alih pahit, Manis dan maskotnya yang menggemaskan untuk Anda.",
        "Sangrai sedang yang teliti mengeluarkan gula buah alami dalam biji secara seimbang: nuansa cokelat yang kaya ditemani segarnya buah hutan dan sentuhan hangat kayu manis di akhir.",
        "V60 yang diseduh santai di Minggu pagi, kopi filter cepat di kantor, atau kopi Turki modern bergiling halus — pengalaman yang ringan dan menyenangkan di setiap cangkir.",
      ],
      tips: {
        filter: "Untuk nuansa fruity dan manis: V60, AeroPress, atau mesin kopi filter — juga nikmat sebagai kopi Turki modern bergiling halus.",
        espresso: "Bernuansa cokelat sebagai espresso murni, akhir kayu manis dengan susu.",
      },
    },
    pagi: {
      subtitle: "Blend Etiopia × Indonesia",
      headline: "Tambahkan rasa pada pagi Anda bersama Pagi",
      bodyAcidity: "Body seimbang dan bulat, keasaman lembut, rasa manis alami yang jelas",
      description: "Biji kopi Pagi Blend — karamel, almond, dan cokelat; blend harian yang seimbang, ideal untuk kopi filter serta latte, cappuccino, dan flat white.",
      story: [
        "Diambil dari kata \"pagi\", blend ini dirancang untuk awal hari yang sempurna. Memadukan karakter Etiopia yang cerah dan hidup dengan tekstur Indonesia yang kaya, Pagi mengubah kantuk pagi menjadi kebangkitan yang menyenangkan.",
        "Sangrai sedang menghadirkan keseimbangan sempurna: karamel manis dan almond panggang di tegukan pertama, cokelat yang lembut dan memuaskan di akhir. Kopi \"setiap hari\" yang tak membosankan sepanjang hari.",
      ],
      tips: {
        filter: "Secangkir pagi yang seimbang dengan mesin filter, V60, atau French Press.",
        espresso: "Dasar yang kuat untuk latte, cappuccino, dan flat white.",
      },
    },
    tanah: {
      subtitle: "Blend Etiopia × Indonesia",
      headline: "Kenali kopi dalam wujud terkuatnya",
      bodyAcidity: "Body penuh dan intens; keasaman rendah dan tidak mengganggu",
      description: "Biji kopi Tanah Blend — cokelat hitam, kacang panggang, dan rempah; body penuh dan rendah asam, untuk espresso, moka pot, dan kopi Turki.",
      story: [
        "Diambil dari kata \"tanah\", blend ini diracik bagi mereka yang mencari intensitas, kekuatan, dan body. Biji paling berkarakter dari Etiopia dan Indonesia berpadu untuk menampilkan sifat kopi yang dalam dan earthy.",
        "Profil sangrai sedang-gelap kami mengeluarkan aroma yang kaya sambil menekan keasaman: cokelat hitam yang pekat dan kacang panggang, dengan hembusan rempah hangat di akhir.",
        "Strukturnya yang kuat tidak hilang dalam susu — cocok untuk latte dan cortado; dan French Press bagi pencinta kopi filter yang kuat.",
      ],
      tips: {
        espresso: "Sangrai sedang-gelap: 92 °C untuk menghindari rasa pahit.",
        filter: "French Press untuk filter yang kuat dan ber-body.",
      },
    },
    kafeinsizmeksika: {
      fullName: "Dekaf Meksiko — Swiss Water Decaf",
      subtitle: "Meksiko · Altura, Chiapas",
      headline: "Tanpa bahan kimia, 99,9% bebas kafein",
      bodyAcidity: "Body sedang, keasaman seimbang dan ringan, akhir yang halus",
      description: "Biji kopi Dekaf Meksiko Swiss Water — 99,9% bebas kafein tanpa bahan kimia; halus dan manis dengan cokelat susu dan hazelnut.",
      story: [
        "Proses Swiss Water menghilangkan 99,9% kafein hanya dengan air, osmosis, dan prinsip kelarutan — tanpa bahan kimia. Air pegunungan menjaga rasa dan aroma asli kopi.",
        "Kami menyangrai pada tingkat City (sedang) untuk menjaga rasa dan minyak biji — titik paling seimbang antara keasaman dan aroma. Di lidah, sentuhan cokelat susu yang manis, halus, dan lembut.",
        "Semua biji kami disangrai setiap minggu; tanggal di kemasan adalah hari kopi Anda disangrai. Untuk rasa terbaik, nikmati dalam 1 bulan.",
      ],
      tips: { espresso: "Espresso malam hari: seperti cokelat susu bila dengan susu." },
    },
    "watermelon-colombia": {
      fullName: "Jairo Arcila Watermelon Colombia — Washed",
      subtitle: "Kolombia · Armenia, Quindío",
      headline: "Angin musim panas yang luar biasa",
      bodyAcidity: "Profil hidup, body sedang yang halus, keasaman cerah",
      description: "Biji kopi Jairo Arcila Watermelon Colombia — fermentasi anaerob 48 jam dengan semangka; nuansa semangka, melon madu, mint, dan jeruk nipis.",
      story: [
        "Tumbuh di tanah vulkanik Armenia, Quindío, Kolombia, pada ketinggian 1.450–1.500 meter, kopi ini adalah hasil proses eksperimental yang mendobrak batas dunia kopi. Biji Castillo yang ditanam produsen ternama Jairo Arcila di kebun Santa Monica.",
        "Ceri yang disortir di tangki apung difermentasi anaerob kering selama 48 jam di pusat pengolahan La Pradera; semangka asli yang ditambahkan ke tangki memberi rasa manis juicy yang unik. Setelah dicuci, biji dikeringkan di bedeng sekitar 10 hari hingga kadar air 9,5–11%.",
        "Di cangkir, semangka dan melon madu yang dominan, sentuhan mint yang menyegarkan, keasaman jeruk nipis; akhir cokelat lembut khas Castillo.",
      ],
    },
    "papandayan-endonezya": {
      fullName: "Papandayan Indonesia Natural",
      subtitle: "Indonesia · Garut, Jawa Barat",
      headline: "Sisi Jawa yang liar dan anggun",
      bodyAcidity: "Body sedang-tinggi, keasaman buah yang hidup",
      description: "Biji kopi Papandayan Indonesia Natural — dari kaki Gunung Papandayan, Jawa Barat; micro-lot dengan nuansa floral, raspberi, dan plum.",
      story: [
        "Dari kaki Gunung Papandayan, salah satu puncak paling ikonik di Jawa Barat, dan tanah subur Garut, kopi ini memadukan rasa buah yang intens dari proses natural dengan keanggunan varietas pilihan seperti Typica dan Sigararutang.",
        "Raspberi yang hidup dan plum manis meledak di tegukan pertama, lalu berganti dengan akhir floral yang anggun saat kopi mendingin. Ceri dijemur bersama kulitnya, sehingga seluruh gula buah terkunci di jantung biji.",
        "Micro-lot terbatas yang dipilih langsung oleh Ruso Exotics dari kebun-kebun di Indonesia.",
      ],
    },
    "ethiopia-shantawene": {
      fullName: "Shantawene Etiopia Natural",
      subtitle: "Etiopia · Sidama",
      description: "Biji kopi Shantawene Etiopia Natural — bergamot, kulit jeruk, dan kakao nibs. Tersedia kembali saat panen baru tiba.",
      story: [
        "Dari desa-desa dataran tinggi Sidama, Shantawene memadukan kedalaman rasa buah dari ceri yang dikeringkan secara natural dengan keanggunan floral khas Etiopia.",
        "Kecerahan aromatik bergamot, segarnya kulit jeruk, dan kakao nibs di akhir. Daftar di bawah agar kami kabari saat panen baru tiba.",
      ],
    },
  },
};

/** Kategori metinleri */
export const CATEGORIES: Record<"en" | "id", Record<string, { tagline: string; description: string }>> = {
  en: {
    "single-origin": {
      tagline: "The signature of one region, one harvest.",
      description:
        "Coffees from a single country, region and often a single producer. From the volcanic slopes of Java to the family farms of El Salvador, they carry the trace of soil, altitude and process into the cup in their purest form.",
    },
    blends: {
      tagline: "Ethiopia and Indonesia in the same cup.",
      description:
        "Pagi and Tanah: our everyday blends that bring Ethiopia's fruit together with Indonesia's body. Their names come from Indonesian — morning and earth.",
    },
    sets: {
      tagline: "For gifting, or for discovering by tasting.",
      description: "Try the four beans of the Indonesia series, or Manis, Pagi and Tanah together. Gift boxes and discovery sets — each freshly roasted every week.",
    },
    accessories: {
      tagline: "Handmade pieces for your brew station.",
      description: "Handmade leather kettle and filter-paper sleeves — a Flores touch for your brewing ritual.",
    },
    espresso: {
      tagline: "Body and sweetness that shine under pressure.",
      description:
        "Coffees that shine in espresso and milk drinks. Dense body, long finish and creamy texture; reliable picks for moka pot and Turkish coffee too.",
    },
  },
  id: {
    "single-origin": {
      tagline: "Ciri khas satu wilayah, satu panen.",
      description:
        "Kopi dari satu negara, satu wilayah, dan sering kali satu produsen. Dari lereng vulkanik Jawa hingga kebun keluarga di El Salvador; jejak tanah, ketinggian, dan proses tersaji di cangkir dalam bentuk paling murni.",
    },
    blends: {
      tagline: "Etiopia dan Indonesia dalam satu cangkir.",
      description:
        "Pagi dan Tanah: blend harian kami yang memadukan rasa buah Etiopia dengan body Indonesia. Namanya diambil dari bahasa Indonesia — pagi dan tanah.",
    },
    sets: {
      tagline: "Untuk hadiah, atau untuk mengenal lewat rasa.",
      description: "Coba empat biji seri Indonesia, atau Manis, Pagi, dan Tanah sekaligus. Kotak hadiah dan set penjelajah — semua disangrai segar setiap minggu.",
    },
    accessories: {
      tagline: "Aksesori buatan tangan untuk meja seduh Anda.",
      description: "Sarung kulit buatan tangan untuk ketel dan kertas filter — sentuhan Flores untuk ritual seduh Anda.",
    },
    espresso: {
      tagline: "Body dan rasa manis yang bersinar di bawah tekanan.",
      description:
        "Kopi yang bersinar dalam espresso dan minuman susu. Body pekat, akhir yang panjang, dan tekstur creamy; pilihan andal untuk moka pot dan kopi Turki juga.",
    },
  },
};
