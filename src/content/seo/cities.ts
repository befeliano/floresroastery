/**
 * Şehir sayfaları (/kahve/[şehir]) — yerel arama: "İstanbul specialty kahve", "Ankara çekirdek kahve",
 * "Eskişehir kahve kavurma" vb. Her şehir için özgün metin + gerçek teslimat bilgisi (site.ts ile aynı).
 * Türkçe içerik; yalnızca Türkçe sürümde yayınlanır.
 */
export interface CityPage {
  slug: string;
  city: string;
  /** "İstanbul'a", "Ankara'ya" */
  dative: string;
  /** "İstanbul'da" */
  locative: string;
  title: string;
  description: string;
  intro: string[];
  delivery: string;
  faq: { q: string; a: string }[];
}

const common = (dative: string, locative: string) => [
  {
    q: `${dative} hangi kahveleri gönderiyorsunuz?`,
    a: `Endonezya (Java — Garut, Papandayan, Frinsa Estate), Etiyopya, Kolombiya, El Salvador ve Meksika tek köken specialty kahvelerimizin yanı sıra Manis, Pagi ve Tanah harmanlarımızın tamamını ${dative} gönderiyoruz. Hepsi siparişinize göre haftalık kavrum partisinden paketlenir.`,
  },
  {
    q: `${locative} V60, filtre kahve makinesi veya espresso için öğütülmüş kahve alabilir miyim?`,
    a: "Evet. Sipariş sırasında V60, Origami, filtre kahve makinesi, French Press, moka pot, espresso, cold brew veya Türk kahvesi öğütmesini seçebilirsiniz. En taze fincan için çekirdek alıp demlemeden hemen önce öğütmenizi öneririz.",
  },
  {
    q: "Kargo ücreti ne kadar?",
    a: "Türkiye geneline sabit kargo ücreti 150₺'dir; 950₺ ve üzeri siparişlerde kargo ücretsizdir. Kartla (iyzico, taksit seçenekli) veya Havale / EFT ile ödeyebilirsiniz.",
  },
];

export const CITIES: CityPage[] = [
  {
    slug: "eskisehir",
    city: "Eskişehir",
    dative: "Eskişehir'e",
    locative: "Eskişehir'de",
    title: "Eskişehir Specialty Kahve & Kahve Kavurma Atölyesi",
    description:
      "Eskişehir'de taze kavrulmuş specialty (3. nesil) çekirdek kahve: Tepebaşı'ndaki kavurma atölyemiz ve coffee bar'ımız, aynı gün ücretsiz kurye, Endonezya, Etiyopya ve Kolombiya kahveleri.",
    intro: [
      "Flores Roastery, Eskişehir Tepebaşı'nda kahvesini kendi kavuran bir specialty kahve atölyesi ve coffee bar. Endonezya'dan doğrudan ticaretle getirdiğimiz Ruso Exotics lotlarını, Etiyopya ve Kolombiya'nın meyvemsi kahvelerini Kuban kavurucumuzda her hafta taze kavuruyoruz.",
      "Eskişehir içi siparişlerinizi kendi kuryemizle aynı gün ücretsiz teslim ediyoruz; dilerseniz Kanaat Sokak'taki dükkânımızdan da teslim alabilirsiniz. Coffee Bar'ımızda tüm çekirdeklerimizi barista eşliğinde tadabilir, V60 ve espressoda farklarını yerinde görebilirsiniz.",
      "Öğrenciler, ev barista'ları ve kafeler için: Eskişehir'de 3. nesil kahve arayışınız artık şehrin içinde, kavrum tarihi paketin üzerinde yazan taze çekirdekle karşılanıyor.",
    ],
    delivery:
      "Eskişehir içi: kendi kuryemizle ücretsiz, aynı gün. Teslimatlar hafta içi saat 16:00'da yapılır; 14:00'ten sonraki siparişler bir sonraki iş günü teslim edilir. Mağazadan teslim alma her zaman ücretsiz.",
    faq: [
      {
        q: "Eskişehir'de kahve kavurma atölyeniz ve coffee bar'ınız nerede?",
        a: "Merkez Yeni Mah. Kanaat Sok. No: 8/A, Tepebaşı / Eskişehir. Coffee Bar Çarşamba–Pazar 13:00–20:00 arası açık; kahve tadım randevusu alabilirsiniz.",
      },
      {
        q: "Eskişehir'de aynı gün teslimat var mı?",
        a: "Evet. Eskişehir içindeki siparişleri kendi kuryemizle ücretsiz ve aynı gün teslim ediyoruz (hafta içi 14:00'e kadar verilen siparişler).",
      },
      ...common("Eskişehir'e", "Eskişehir'de").slice(0, 2),
    ],
  },
  {
    slug: "istanbul",
    city: "İstanbul",
    dative: "İstanbul'a",
    locative: "İstanbul'da",
    title: "İstanbul'a Taze Kavrulmuş Specialty Çekirdek Kahve",
    description:
      "İstanbul'a specialty (3. nesil) çekirdek kahve siparişi: Endonezya, Etiyopya, Kolombiya ve El Salvador kahveleri haftalık taze kavrum, V60 ve espresso öğütme seçeneği, 950₺ üzeri ücretsiz kargo.",
    intro: [
      "İstanbul'da specialty kahve sahnesi büyürken, evde demlediğiniz fincanın da kafedeki kadar iyi olmasını istiyorsanız her şey taze kavrumla başlar. Flores Roastery'de her çekirdeği Eskişehir'deki atölyemizde haftalık kavurup, kavrum tarihini paketin üzerine yazarak İstanbul'a gönderiyoruz.",
      "Kadıköy'den Beşiktaş'a, Ataşehir'den Bakırköy'e evde V60, Chemex, French Press ya da espresso makinesiyle demleyenler için tek köken Endonezya Java kahveleri, meyvemsi Etiyopya ve Kolombiya lotları ile her gün içilecek Manis, Pagi ve Tanah harmanları sunuyoruz.",
      "Her kahvemizin sayfasında o çekirdek için hazırladığımız saniye saniye demleme tarifi, künye ve evde bir fincanın kaça geldiğini gösteren hesap var.",
    ],
    delivery: "İstanbul'a kargo: kavrum ve paketlemeden sonra genellikle 1–2 iş gününde kargoya verilir, teslimat çoğunlukla 1–2 iş günüdür. 950₺ ve üzeri siparişlerde kargo ücretsiz.",
    faq: [
      { q: "İstanbul'a kahve kaç günde gelir?", a: "Siparişler kavrum ve paketlemenin ardından genellikle 1–2 iş gününde kargoya verilir; İstanbul'a teslimat çoğunlukla 1–2 iş günü sürer." },
      ...common("İstanbul'a", "İstanbul'da"),
    ],
  },
  {
    slug: "ankara",
    city: "Ankara",
    dative: "Ankara'ya",
    locative: "Ankara'da",
    title: "Ankara'ya Specialty Çekirdek Kahve — Taze Kavrum",
    description:
      "Ankara'ya taze kavrulmuş specialty çekirdek kahve: Endonezya Java, Etiyopya ve Kolombiya kahveleri, filtre kahve ve espresso için öğütme, hızlı kargo ve 950₺ üzeri ücretsiz gönderim.",
    intro: [
      "Ankara, Eskişehir'e en yakın büyükşehirlerden biri — bu yüzden taze kavrulmuş kahvemiz Ankara'ya çoğu zaman ertesi gün ulaşır. Çankaya'dan Yenimahalle'ye, Etimesgut'tan Keçiören'e filtre kahve ve espresso sevenler için haftalık kavrum partilerimizden gönderiyoruz.",
      "Ofiste filtre kahve makinesi, evde V60 ya da moka pot: Hangi yöntemi kullanırsanız kullanın, kahvenizi o yönteme göre öğütüp gönderiyoruz. Yoğun gövde arayanlara Tanah ve Arjuna, meyvemsi bir fincan isteyenlere Frinsa ve Guntur'u öneriyoruz.",
    ],
    delivery: "Ankara'ya kargo: genellikle ertesi gün ile 2 iş günü arasında teslim. 950₺ ve üzeri siparişlerde kargo ücretsiz.",
    faq: [{ q: "Ankara'ya kahve kaç günde gelir?", a: "Kargoya verildikten sonra Ankara'ya teslimat çoğunlukla ertesi gün ile 2 iş günü arasındadır." }, ...common("Ankara'ya", "Ankara'da")],
  },
  {
    slug: "bursa",
    city: "Bursa",
    dative: "Bursa'ya",
    locative: "Bursa'da",
    title: "Bursa'ya Specialty Kahve — Taze Kavrulmuş Çekirdek",
    description:
      "Bursa'ya specialty (3. nesil) çekirdek kahve siparişi: haftalık taze kavrum, tek köken ve harman seçenekleri, V60 / espresso öğütme, Eskişehir'den hızlı kargo.",
    intro: [
      "Bursa ile Eskişehir arasındaki kısa mesafe sayesinde kahveniz kavrulduktan kısa süre sonra kapınızda. Nilüfer, Osmangazi ve Mudanya'daki ev barista'ları ve kafeler için specialty çekirdek kahvelerimizi haftalık kavrum partilerinden gönderiyoruz.",
      "Endonezya'nın kremamsı Java kahveleri, Etiyopya'nın çiçeksi zarafeti ve Kolombiya'nın sulu meyvesi — her birinin künyesi, demleme tarifi ve fincan maliyeti ürün sayfasında.",
    ],
    delivery: "Bursa'ya kargo: genellikle ertesi gün ile 2 iş günü arasında teslim. 950₺ ve üzeri siparişlerde kargo ücretsiz.",
    faq: [{ q: "Bursa'ya kahve kaç günde gelir?", a: "Kargoya verildikten sonra Bursa'ya teslimat çoğunlukla ertesi gün ile 2 iş günü arasındadır." }, ...common("Bursa'ya", "Bursa'da")],
  },
  {
    slug: "izmir",
    city: "İzmir",
    dative: "İzmir'e",
    locative: "İzmir'de",
    title: "İzmir'e Specialty Çekirdek Kahve — 3. Nesil Kahve Siparişi",
    description:
      "İzmir'e taze kavrulmuş specialty çekirdek kahve: Endonezya, Etiyopya, Kolombiya kahveleri ve günlük harmanlar; filtre, V60, cold brew ve espresso için öğütme, 950₺ üzeri ücretsiz kargo.",
    intro: [
      "İzmir'in sıcak yaz günlerinde cold brew, serin akşamlarında bir V60 — Flores Roastery'nin taze kavrulmuş specialty kahvelerini Karşıyaka'dan Bornova'ya, Alsancak'tan Urla'ya gönderiyoruz.",
      "Cold brew için Manis ve Kolombiya, sütlü içecekler için Pagi ve Tanah, filtre için Endonezya Frinsa ve Guntur'u öneriyoruz. Siparişinizi demleme yönteminize göre öğütebiliriz.",
    ],
    delivery: "İzmir'e kargo: kargoya verildikten sonra genellikle 1–3 iş gününde teslim. 950₺ ve üzeri siparişlerde kargo ücretsiz.",
    faq: [{ q: "İzmir'e kahve kaç günde gelir?", a: "Kargoya verildikten sonra İzmir'e teslimat genellikle 1–3 iş günü sürer." }, ...common("İzmir'e", "İzmir'de")],
  },
];

export const getCity = (slug: string) => CITIES.find((c) => c.slug === slug);
