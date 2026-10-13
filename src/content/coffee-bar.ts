/**
 * Coffee Bar — MENÜ, FİYATLAR ve BREW BAR KURALLARI
 * =================================================
 * Fiyat ya da menü değişince YALNIZCA bu dosyayı düzenleyin:
 *  - price: TL cinsinden sayı (₺ işareti otomatik eklenir)
 *  - name: kahvenin/içeceğin adı (her dilde aynı gösterilir)
 *  - desc / notes: { tr, en, id } — üç dilde de yazın (bilmiyorsanız Türkçeyi üçüne de kopyalayın)
 *  - slug: (isteğe bağlı) sitede satılan kahveyse ürün sayfasına link verir, ör. "watermelon-colombia"
 * Kaydedip yeniden derleyince (deploy) /coffee-bar sayfası güncellenir.
 * Not: randevu.floresroastery.com'daki menü ayrı bir dosyadadır (randevu sitesinde menu.php).
 */

type L = { tr: string; en: string; id: string };

export type MenuItem = { name: string; desc: L; price: number; slug?: string };
export type MenuSection = { key: string; title: L; subtitle?: L; items: MenuItem[] };

/** PDF menü (public/menu klasöründe) — yeni PDF'i aynı adla değiştirmeniz yeterli */
export const MENU_PDF = "/menu/flores-coffee-bar-menu.pdf";

export const COFFEE_BAR_MENU: MenuSection[] = [
  {
    key: "espresso",
    title: { tr: "Espresso Bar", en: "Espresso Bar", id: "Espresso Bar" },
    items: [
      {
        name: "Kopi Susu",
        desc: {
          tr: "Endonezya'nın tatlı, ikonik sütlü kahvesi, specialty kahveyle.",
          en: "Indonesia's sweet, iconic milk coffee — made with specialty coffee.",
          id: "Kopi susu manis ikonik Indonesia, dengan kopi spesialti.",
        },
        price: 200,
      },
      {
        name: "Kopi Tubruk",
        desc: {
          tr: "Geleneksel Endonezya usulü, Endonezya kahve çekirdekleriyle.",
          en: "The traditional Indonesian way, with Indonesian beans.",
          id: "Cara tradisional Indonesia, dengan biji kopi Indonesia.",
        },
        price: 150,
      },
      {
        name: "Espresso",
        desc: { tr: "Çift shot, tek köken kahve.", en: "Double shot, single-origin coffee.", id: "Double shot, kopi single origin." },
        price: 120,
      },
      {
        name: "Americano",
        desc: { tr: "Espresso & su.", en: "Espresso & water.", id: "Espresso & air." },
        price: 140,
      },
    ],
  },
  {
    key: "manual",
    title: { tr: "Manual Brew", en: "Manual Brew", id: "Manual Brew" },
    subtitle: { tr: "Limited Edition Series", en: "Limited Edition Series", id: "Limited Edition Series" },
    items: [
      {
        name: "Kolombiya Jardines del Edén — Natural",
        desc: {
          tr: "Çiçeksi • Tropikal meyve • Narenciye • Esmer şeker",
          en: "Floral • Tropical fruit • Citrus • Brown sugar",
          id: "Floral • Buah tropis • Sitrus • Gula merah",
        },
        price: 250,
      },
      {
        name: "Kolombiya Watermelon — Washed Watermelon",
        desc: { tr: "Karpuz • Bal kavunu • Nane", en: "Watermelon • Honeydew • Mint", id: "Semangka • Melon madu • Mint" },
        price: 200,
        slug: "watermelon-colombia",
      },
      {
        name: "Endonezya Karo Lychee — Wet Hulled Lychee",
        desc: { tr: "Liçi • Gül • Çikolata", en: "Lychee • Rose • Chocolate", id: "Leci • Mawar • Cokelat" },
        price: 200,
      },
      {
        name: "Endonezya Karo Jasmine — Wet Hulled Jasmine",
        desc: { tr: "Yasemin • Bergamot • Bal", en: "Jasmine • Bergamot • Honey", id: "Melati • Bergamot • Madu" },
        price: 200,
      },
      {
        name: "Endonezya Papandayan — Natural",
        desc: { tr: "Ahududu • Erik • Çiçeksi", en: "Raspberry • Plum • Floral", id: "Raspberry • Plum • Floral" },
        price: 180,
        slug: "papandayan-endonezya",
      },
    ],
  },
];

/** "Tadım nasıl işler?" — ücretsiz ve ücretli tadım ayrımı */
export const TASTING_PRICING = {
  title: { tr: "Tadım nasıl işler?", en: "How does the tasting work?", id: "Bagaimana sesi cicip berlangsung?" },
  free: {
    label: { tr: "Ücretsiz", en: "Free", id: "Gratis" },
    title: { tr: "Çekirdek tadımı", en: "Bean tasting", id: "Cicip biji kopi" },
    text: {
      tr: "Çekirdek kahve satın almadan önce denemek istiyorsanız tadım ücretsizdir. 50 dakikalık seansta her misafir 1 çekirdeği manuel demleme ile dener; 4 kişilik bir grup 4 farklı çekirdeği birlikte tadabilir.",
      en: "If you'd like to try our beans before buying them, the tasting is free. In a 50-minute session each guest tries 1 bean as a manual brew; a group of 4 can taste 4 different beans together.",
      id: "Jika Anda ingin mencoba biji kopi sebelum membelinya, sesi cicip gratis. Dalam sesi 50 menit setiap tamu mencoba 1 biji dengan seduh manual; grup 4 orang bisa mencicipi 4 biji berbeda bersama.",
    },
  },
  paid: {
    label: { tr: "Ücretli", en: "Paid", id: "Berbayar" },
    title: { tr: "Brew Bar & menü", en: "Brew Bar & menu", id: "Brew Bar & menu" },
    text: {
      tr: "Çekirdek almadan yalnızca kahve keyfi için gelenler, ek çekirdek denemek isteyenler ve özel üretim / özel seri kahveler menüdeki fiyatlarla ücretlendirilir.",
      en: "Guests who come just to enjoy coffee without buying beans, extra beans beyond your session, and special-production or limited-series coffees are charged at menu prices.",
      id: "Tamu yang datang hanya untuk menikmati kopi tanpa membeli biji, biji tambahan di luar sesi, serta kopi produksi khusus / seri terbatas dikenakan harga sesuai menu.",
    },
  },
};

/** Brew Bar kuralları (Bağır'ın metni) */
export const BREW_BAR_RULES: L[] = [
  { tr: "Her brew bar seansı 50 dakika sürer.", en: "Each brew bar session lasts 50 minutes.", id: "Setiap sesi brew bar berlangsung 50 menit." },
  {
    tr: "Her misafir, seans kapsamında 1 farklı kahve çekirdeğini manuel demleme yöntemiyle deneyebilir.",
    en: "Within the session, each guest can try 1 different coffee bean as a manual brew.",
    id: "Dalam sesi, setiap tamu dapat mencoba 1 biji kopi berbeda dengan metode seduh manual.",
  },
  {
    tr: "Bir misafir birden fazla kahve çekirdeği denemek isterse, ek çekirdekler için ayrıca ücret uygulanır.",
    en: "If a guest wants to try more than one bean, the extra beans are charged separately.",
    id: "Jika tamu ingin mencoba lebih dari satu biji, biji tambahan dikenakan biaya terpisah.",
  },
  {
    tr: "Dört kişilik bir grup, seans boyunca toplam 4 farklı kahve çekirdeği seçerek bu kahveleri birlikte deneyebilir.",
    en: "A group of four can choose 4 different beans in total and taste them together during the session.",
    id: "Grup empat orang dapat memilih total 4 biji berbeda dan mencicipinya bersama selama sesi.",
  },
  {
    tr: "Brew Bar deneyiminin amacı, kahve çekirdeklerini satın almadan önce tatlarını ve karakterlerini keşfetmenize yardımcı olmaktır.",
    en: "The Brew Bar experience is there to help you discover a bean's flavour and character before you buy it.",
    id: "Pengalaman Brew Bar bertujuan membantu Anda mengenal rasa dan karakter biji kopi sebelum membelinya.",
  },
  {
    tr: "Özel üretim veya özel seri kahveleri denemek ücretlidir. Ücretli menü seçenekleri ve fiyatları Brew Bar'da ayrıca belirtilir.",
    en: "Tasting special-production or limited-series coffees is paid. Paid menu options and prices are listed separately at the Brew Bar.",
    id: "Mencicipi kopi produksi khusus atau seri terbatas dikenakan biaya. Opsi menu berbayar dan harganya tercantum terpisah di Brew Bar.",
  },
  {
    tr: "Rezervasyon saatinden en az birkaç dakika önce gelmenizi rica ederiz. Geç kalınması durumunda seans süresi uzatılamaz.",
    en: "Please arrive a few minutes before your booking. If you're late, the session can't be extended.",
    id: "Mohon datang beberapa menit sebelum jadwal reservasi. Jika terlambat, durasi sesi tidak dapat diperpanjang.",
  },
  {
    tr: "Seans kapasitesi sınırlıdır. Bu nedenle rezervasyonun iptali veya değişikliği mümkün olduğunca önceden bildirilmelidir.",
    en: "Session capacity is limited, so please let us know about cancellations or changes as early as possible.",
    id: "Kapasitas sesi terbatas, jadi mohon kabari pembatalan atau perubahan reservasi sedini mungkin.",
  },
  {
    tr: "Kahve çekirdeklerinin tadım sırası, tatların daha iyi algılanabilmesi için baristanın önerisine göre düzenlenebilir.",
    en: "The tasting order may be arranged on the barista's advice so the flavours come through better.",
    id: "Urutan cicip dapat diatur sesuai saran barista agar rasa lebih mudah dikenali.",
  },
  {
    tr: "Tadım sırasında kahveler hakkında sorularınızı sormaktan ve damak zevkinizi paylaşmaktan çekinmeyin. Amacımız, kahve keşfinizi keyifli ve anlaşılır hâle getirmektir.",
    en: "Feel free to ask questions and share your taste during the session — we want your coffee discovery to be enjoyable and easy to follow.",
    id: "Jangan ragu bertanya dan berbagi selera Anda saat mencicipi — kami ingin penjelajahan kopi Anda menyenangkan dan mudah dipahami.",
  },
  {
    tr: "Brew Bar'da sunulan kahveler, stok durumuna ve çekirdeklerin tazeliğine bağlı olarak değişebilir.",
    en: "The coffees offered at the Brew Bar may change depending on stock and the freshness of the beans.",
    id: "Kopi yang tersedia di Brew Bar dapat berubah tergantung stok dan kesegaran biji.",
  },
  {
    tr: "Tadım deneyimi sırasında kullanılan kahveler, ekipmanlar ve servis alanı özenle kullanılmalıdır.",
    en: "Please take care with the coffees, equipment and service area during the tasting.",
    id: "Mohon gunakan kopi, peralatan, dan area servis dengan hati-hati selama sesi cicip.",
  },
  {
    tr: "Alerjiniz, kafein hassasiyetiniz veya özel bir beslenme durumunuz varsa lütfen seans başlamadan önce ekibimize bilgi verin.",
    en: "If you have an allergy, caffeine sensitivity or special dietary need, please tell our team before the session starts.",
    id: "Jika Anda memiliki alergi, sensitivitas kafein, atau kebutuhan diet khusus, mohon beri tahu tim kami sebelum sesi dimulai.",
  },
];

export const COFFEE_BAR_TEXT = {
  menuTitle: { tr: "Menü", en: "Menu", id: "Menu" },
  menuIntro: {
    tr: "Coffee Bar'da sunduğumuz içecekler ve manuel demleme kahveler. Fiyatlar TL'dir; menü stok ve sezona göre değişebilir.",
    en: "The drinks and manual-brew coffees we serve at the Coffee Bar. Prices are in TRY; the menu may change with stock and season.",
    id: "Minuman dan kopi seduh manual yang kami sajikan di Coffee Bar. Harga dalam TRY; menu dapat berubah sesuai stok dan musim.",
  },
  pdf: { tr: "Menüyü PDF olarak aç", en: "Open the menu as PDF", id: "Buka menu dalam PDF" },
  inShop: { tr: "Çekirdeğini satın al →", en: "Buy the beans →", id: "Beli bijinya →" },
  rulesTitle: { tr: "Brew Bar kuralları", en: "Brew Bar rules", id: "Aturan Brew Bar" },
};
