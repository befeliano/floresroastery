/**
 * Toptan satış içeriği — b2b.floresroastery.com sayfasından ve B2B
 * konfigüratörünün (WordPress /olustur) kademeli fiyat tablosundan alınmıştır.
 * Güncel fiyatlar konfigüratörde WordPress'ten gelir; buradaki tablo bilgi amaçlıdır.
 */
export const wholesaleStats = [
  { value: "80+", label: "SCA puanı" },
  { value: "24 s", label: "Teklif yanıtı" },
  { value: "5 kg", label: "Min. sipariş" },
  { value: "0₺", label: "Kurulum ücreti" },
];

export const wholesaleFeatures = [
  { title: "Doğrudan kaynaklı", text: "Endonezya menşeli seçilmiş specialty kahveler ve direct trade çekirdekler." },
  { title: "İstikrarlı roast profili", text: "Espresso ve filtre için ayrı profiller. Her siparişte aynı kalite ve tat standardı." },
  { title: "Private label altyapısı", text: "Kendi markanızla kahve satmanız için kavurma, paketleme ve kalite kontrol hazır." },
  { title: "Specialty grade", text: "Çekirdekler SCA standartlarında 80+ puan. Menünüzün kalite tabanı sabit kalır." },
  { title: "Teknik destek", text: "Kavurma profili, demleme reçeteleri ve baristanız için menü geliştirme rehberliği." },
  { title: "Türkiye geneli teslimat", text: "Düzenli teslimat planı, sabit fiyat anlaşması ve öncelikli müşteri hattı." },
];

export const wholesaleSteps = [
  { title: "İhtiyaç analizi", text: "Formu doldurun ya da WhatsApp'tan yazın. İşletme tipinizi ve tahmini miktarı öğrenelim." },
  { title: "Numune & cupping", text: "Damağınıza uygun çekirdekleri öneririz, numune göndeririz ve 24 saatte fiyat çıkarırız." },
  { title: "Fiyat & onay", text: "Miktar, teslimat sıklığı ve isterseniz private label detaylarını netleştirip planı sabitleriz." },
  { title: "Düzenli üretim", text: "Siparişe özel kavurup teslim ederiz. Sabit fiyat, öncelikli hat ve sürekli destek devam eder." },
];

export const builderSteps = ["Kahve tipi", "Single origin, blend ya da hazır reçete", "Çekirdekler ve kg", "Kavurma", "Öğütme", "Paket & ambalaj", "Sepet ve ödeme"];

export const wholesalePlans = [
  {
    name: "Başlangıç",
    min: "5 kg / aylık min.",
    text: "Küçük kafe ve ofisler için ideal giriş paketi.",
    items: ["Tüm specialty çekirdekler", "3 farklı ürün seçimi", "Siparişe özel kavurma", "Standart ambalaj", "E-posta destek"],
  },
  {
    name: "Profesyonel",
    min: "15 kg / aylık min.",
    text: "Aktif kafe ve restoranlar için eksiksiz çözüm.",
    popular: true,
    items: ["Tüm specialty çekirdekler", "Sınırsız ürün seçimi", "Espresso & filtre ayrı roast", "Özel etiket seçeneği", "Demleme danışmanlığı", "Öncelikli müşteri hattı"],
  },
  {
    name: "Kurumsal",
    min: "50 kg+ / aylık min.",
    text: "Otel, zincir ve private label projeleri için.",
    items: ["Sınırsız ürün seçimi", "Tam private label", "Özel ambalaj tasarımı", "Düzenli teslimat planı", "Sabit fiyat anlaşması", "Ekip eğitimi"],
  },
];

/** Kademeli kg fiyatı: o çekirdekten alınan toplam miktarın düştüğü aralığın fiyatı uygulanır */
export const wholesaleTiers: { name: string; process: string; tiers: [minKg: number, price: number][] }[] = [
  { name: "Endonezya Arjuna", process: "Wet Hulled", tiers: [[1, 1100], [20, 1075], [30, 1050]] },
  { name: "Brezilya Mogiana", process: "Natural", tiers: [[1, 1100], [5, 1000], [10, 950]] },
  { name: "El Salvador Ochuspe", process: "Anaerobik Natural", tiers: [[1, 1350], [10, 1250]] },
  { name: "Meksika Decaf", process: "Swiss Water", tiers: [[1, 1350], [3, 1285]] },
  { name: "Endonezya Guntur", process: "Honey", tiers: [[1, 1450], [3, 1350]] },
  { name: "Endonezya Frinsa", process: "Honey Saccharomyces", tiers: [[1, 1950], [3, 1800]] },
  { name: "Ethiopia Bombe", process: "Honey", tiers: [[1, 1950]] },
  { name: "Endonezya Papandayan", process: "Natural", tiers: [[1, 2250], [3, 2050]] },
  { name: "Watermelon (Kolombiya)", process: "Washed", tiers: [[1, 3250]] },
  { name: "Türk Kahvesi", process: "Natural", tiers: [[1, 750], [3, 700]] },
];

export const packaging = [
  { size: "1000 gr", text: "Toptan alımlar için", bags: "Siyah / beyaz doypack, kraft, renkli, krem, siyah transparan" },
  { size: "500 gr", text: "Kafe ve küçük işletmeler", bags: "Siyah / beyaz doypack, kraft, renkli" },
  { size: "200 gr", text: "Standart perakende paketi", bags: "Siyah cüzdan, kraft, renkli, siyah transparan" },
  { size: "100 gr", text: "Deneme veya hediye boyu", bags: "Siyah cüzdan, kraft, renkli" },
];

export const wholesaleFaq = [
  {
    q: "Minimum sipariş miktarı nedir?",
    a: "Toptan tedarikte minimum 5 kg ile başlıyoruz; farklı çekirdekler karıştırılabilir. İşletme tipinize ve ürün çeşidinize göre en uygun başlangıç paketini birlikte belirleriz.",
  },
  { q: "Espresso ve filtre için ayrı kavrum yapıyor musunuz?", a: "Evet. Espresso ve filtre için ayrı roast profilleri sunuyoruz, böylece her demleme yöntemi en iyi sonucu verir." },
  {
    q: "Fiyatları nereden görebilirim?",
    a: "Sipariş Oluştur adımlarında çekirdek, miktar ve ambalajı seçtikçe fiyatı anlık görürsünüz — aldığınız miktar arttıkça kilogram fiyatı kademeli olarak düşer. Private label, özel blend veya düzenli tedarik için işletmenize özel teklif hazırlıyoruz.",
  },
  {
    q: "Nasıl ödeme yapabilirim?",
    a: "Sipariş Oluştur ile harmanınızı adım adım kurup sepete ekleyerek online ödeyebilirsiniz — fiyatlara KDV dahildir. Havale/EFT'de komisyon %0'dır; kredi kartı ile de ödeme kabul edilir. Dilerseniz teklif formuyla ödeme koşullarını birebir de netleştirebiliriz.",
  },
  {
    q: "Türkiye geneline gönderim yapıyor musunuz?",
    a: "Evet, Türkiye'nin tüm şehirlerine gönderim sağlıyoruz. Düzenli tedarikte sabit bir teslimat takvimi kurarak stoğunuzun boşa düşmesini engelliyoruz.",
  },
  {
    q: "Private label süreci ne kadar sürer?",
    a: "Ortalama 1–2 hafta içinde üretime hazır hale gelir. Kurulum ücreti almıyoruz; tasarım ve ambalaj maliyetleri projenin kapsamına göre şeffaf şekilde paylaşılır.",
  },
];

export const BUSINESS_TYPES = ["Kafe", "Restoran", "Otel", "Ofis", "Market", "Zincir işletme", "Diğer"];
export const MONTHLY_VOLUMES = ["5 – 10 kg", "10 – 25 kg", "25 – 50 kg", "50 kg üzeri"];
export const PRIVATE_LABEL = ["Hayır, standart ambalaj yeterli", "Evet, kendi markamla satmak istiyorum", "Henüz emin değilim, bilgi almak istiyorum"];
