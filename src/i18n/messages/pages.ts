/**
 * Sunucu sayfa metinleri — yalnızca sunucuda seçilir, istemciye HTML olarak gider.
 * Vurgulu başlıklar { a, em, b } parçalarıyla yazılır: a + <em>em</em> + b
 */
export const pages = {
  meta: {
    title: { tr: "Specialty Kahve & Taze Kavrulmuş Çekirdek Kahve · Eskişehir", en: "Specialty Coffee Roasters", id: "Specialty Coffee Roasters" },
    description: {
      tr: "Flores Roastery — Eskişehir'de kalpten kavrulan specialty kahve. Endonezya'dan doğrudan ticaret Ruso Exotics serisi, Etiyopya Sidamo Manis dahil tek kökenli kahveler ve Pagi, Tanah harmanları; her kahve için künye ve saniye saniye demleme rehberi.",
      en: "Flores Roastery — specialty coffee roasted from the heart in Eskişehir, Türkiye. The direct-trade Ruso Exotics series from Indonesia, single origins including Manis from Ethiopia's Sidamo, and the Pagi and Tanah blends; a full spec sheet and a second-by-second brew guide for every coffee.",
      id: "Flores Roastery — kopi spesialti yang disangrai sepenuh hati di Eskişehir, Turki. Seri direct trade Ruso Exotics dari Indonesia, kopi single origin termasuk Manis dari Sidamo, Etiopia, serta blend Pagi dan Tanah; lengkap dengan spesifikasi dan panduan seduh detik demi detik untuk setiap kopi.",
    },
    keywords: {
      tr: "specialty kahve, 3. nesil kahve, çekirdek kahve, taze kavrulmuş kahve, filtre kahve, V60, espresso, single origin, Endonezya kahvesi, Etiyopya kahvesi, Kolombiya kahvesi, kahve kavurma, Eskişehir kahve, İstanbul specialty kahve, Ankara çekirdek kahve, Bursa kahve, Flores Roastery",
      en: "specialty coffee, whole bean coffee, filter coffee, espresso, single origin, coffee roastery, Indonesian coffee, Flores Roastery",
      id: "kopi spesialti, biji kopi, kopi filter, espresso, single origin, roastery kopi, kopi Indonesia, Flores Roastery",
    },
  },

  site: {
    about: {
      tr: "Flores Roastery, basit bir inançla doğdu: Harika kahve sadece tadılmamalı, hissedilmelidir. Kalpten kavuruyoruz; kahvenin kaynağından fincana uzanan yolculuğuna saygı duyuyoruz.",
      en: "Flores Roastery was born from a simple belief: great coffee should not only be tasted, it should be felt. We roast from the heart and respect coffee's journey from source to cup.",
      id: "Flores Roastery lahir dari keyakinan sederhana: kopi yang hebat tidak hanya dicicipi, tetapi dirasakan. Kami menyangrai sepenuh hati dan menghargai perjalanan kopi dari sumber hingga ke cangkir.",
    },
    days: { tr: "Çarşamba – Pazar", en: "Wednesday – Sunday", id: "Rabu – Minggu" },
    closed: { tr: "Pazartesi ve Salı", en: "Monday and Tuesday", id: "Senin dan Selasa" },
    promo: { tr: "Ekim boyunca ücretsiz", en: "Free throughout October", id: "Gratis sepanjang Oktober" },
    directions: { tr: "Yol tarifi", en: "Directions", id: "Petunjuk arah" },
    writeWhatsapp: { tr: "WhatsApp'tan yaz", en: "Message us on WhatsApp", id: "Chat via WhatsApp" },
  },

  crumbs: {
    home: { tr: "Ana Sayfa", en: "Home", id: "Beranda" },
    coffees: { tr: "Kahveler", en: "Coffees", id: "Kopi" },
    aria: { tr: "İçerik izi", en: "Breadcrumb", id: "Breadcrumb" },
  },

  footer: {
    join: { a: { tr: "Bahçemize ", en: "Join our ", id: "Bergabunglah di " }, em: { tr: "katılın", en: "garden", id: "kebun kami" } },
    joinText: {
      tr: "Yeni hasatlar, sınırlı Ruso Exotics lotları, demleme notları ve kavurma günlüğümüzden haberler. Ayda en fazla iki e-posta.",
      en: "New harvests, limited Ruso Exotics lots, brewing notes and news from our roasting log. Two emails a month, at most.",
      id: "Panen baru, lot terbatas Ruso Exotics, catatan seduh, dan kabar dari jurnal sangrai kami. Maksimal dua email per bulan.",
    },
    shop: { tr: "Mağaza", en: "Shop", id: "Toko" },
    support: { tr: "Destek", en: "Support", id: "Bantuan" },
    allCoffees: { tr: "Tüm Kahveler", en: "All Coffees", id: "Semua Kopi" },
    tracking: { tr: "Sipariş Takibi", en: "Order Tracking", id: "Lacak Pesanan" },
    returnRequest: { tr: "İade Talebi", en: "Return Request", id: "Pengembalian" },
    deliveryReturns: { tr: "Teslimat & İade", en: "Delivery & Returns", id: "Pengiriman & Retur" },
    contact: { tr: "İletişim", en: "Contact", id: "Kontak" },
    story: { tr: "Hikayemiz", en: "Our Story", id: "Kisah Kami" },
    brewGuide: { tr: "Demleme Rehberi", en: "Brew Guide", id: "Panduan Seduh" },
    guides: { tr: "Kahve Rehberi", en: "Coffee Guides", id: "Panduan Kopi" },
    wholesale: { tr: "Toptan Satış", en: "Wholesale", id: "Grosir" },
    coffeeBar: { tr: "Coffee Bar Randevu", en: "Coffee Bar Booking", id: "Reservasi Coffee Bar" },
    marquee: { tr: "Her çekirdeğin bir hikâyesi var", en: "Where every bean has a story", id: "Setiap biji punya cerita" },
    legalAria: { tr: "Yasal", en: "Legal", id: "Legal" },
    paymentAlt: {
      tr: "iyzico, Mastercard, Visa, American Express ve Troy ile güvenli ödeme",
      en: "Secure payment with iyzico, Mastercard, Visa, American Express and Troy",
      id: "Pembayaran aman dengan iyzico, Mastercard, Visa, American Express, dan Troy",
    },
  },

  legal: {
    links: {
      "gizlilik-politikasi": { tr: "Gizlilik Politikası", en: "Privacy Policy", id: "Kebijakan Privasi" },
      "kvkk-aydinlatma-metni": { tr: "KVKK Aydınlatma Metni", en: "Privacy Notice (KVKK)", id: "Pemberitahuan Privasi (KVKK)" },
      "mesafeli-satis-sozlesmesi": { tr: "Mesafeli Satış Sözleşmesi", en: "Distance Sales Agreement", id: "Perjanjian Penjualan Jarak Jauh" },
      "on-bilgilendirme-formu": { tr: "Ön Bilgilendirme Formu", en: "Pre-Information Form", id: "Formulir Informasi Awal" },
      "teslimat-ve-iade-sartlari": { tr: "Teslimat ve İade Şartları", en: "Delivery & Returns Terms", id: "Ketentuan Pengiriman & Retur" },
    },
    navAria: { tr: "Yasal metinler", en: "Legal documents", id: "Dokumen legal" },
    returnCta: { tr: "İade talebi oluştur →", en: "Start a return →", id: "Ajukan pengembalian →" },
    updated: { tr: "Son güncelleme: {date}", en: "Last updated: {date}", id: "Terakhir diperbarui: {date}" },
    toc: { tr: "İçindekiler", en: "Contents", id: "Daftar isi" },
    notice: {
      tr: "",
      en: "This document is published in Turkish under Turkish consumer law; the Turkish text is the legally binding version. If you have any questions, write to us in English at info@floresroastery.com.",
      id: "Dokumen ini diterbitkan dalam bahasa Turki berdasarkan hukum konsumen Turki; teks berbahasa Turki adalah versi yang mengikat secara hukum. Jika ada pertanyaan, hubungi kami di info@floresroastery.com.",
    },
  },

  photos: {
    roastery: { tr: "Flores Roastery'nin Kuban kavurma makinesi — Eskişehir'deki kavurma atölyemiz", en: "Flores Roastery's Kuban roaster — our roasting workshop in Eskişehir", id: "Mesin sangrai Kuban milik Flores Roastery — workshop sangrai kami di Eskişehir" },
    cherriesHands: { tr: "Üreticinin avuçlarında olgun kırmızı ve sarı kahve kirazları", en: "Ripe red and yellow coffee cherries in a farmer's hands", id: "Ceri kopi merah dan kuning yang matang di tangan petani" },
    cherriesBranch: { tr: "Dalında olgunlaşan kırmızı ve yeşil kahve kirazları", en: "Red and green coffee cherries ripening on the branch", id: "Ceri kopi merah dan hijau yang matang di dahan" },
    pourOver: { tr: "Pencere önünde V60 ile demlenen Flores Roastery filtre kahvesi", en: "Flores Roastery filter coffee brewed with a V60 by the window", id: "Kopi filter Flores Roastery diseduh dengan V60 di dekat jendela" },
    v60Pour: { tr: "Beyaz kettle ile V60'a ince ve yavaş döküş — düz kahve yatağı", en: "A thin, slow pour into a V60 from a white kettle — a flat coffee bed", id: "Tuangan tipis dan pelan ke V60 dari ketel putih — bed kopi yang rata" },
    cuppingPour: { tr: "Cam servis sürahisinden tadım fincanlarına filtre kahve dökülüyor", en: "Filter coffee poured from a glass server into tasting cups", id: "Kopi filter dituang dari server kaca ke cangkir cicip" },
    v60Bar: { tr: "Karanlık bar tezgâhında filtre kâğıtlı cam V60 ve servis sürahisi", en: "A glass V60 with filter paper and a server on a dark bar counter", id: "V60 kaca dengan kertas filter dan server di meja bar yang gelap" },
    pourOverGrinder: { tr: "El değirmeni, pour-over ve bir fincan taze demlenmiş kahve", en: "A hand grinder, a pour-over and a cup of freshly brewed coffee", id: "Grinder manual, pour-over, dan secangkir kopi yang baru diseduh" },
    brewKit: { tr: "El değirmeni, çekirdek kavanozu, V60 ve kettle ile filtre kahve demleme seti", en: "A filter brewing kit: hand grinder, bean jar, V60 and kettle", id: "Perlengkapan seduh filter: grinder manual, toples biji, V60, dan ketel" },
    espressoShot: { tr: "Portafiltreden buzlu bardağa akan espresso shot", en: "An espresso shot pouring from the portafilter into an iced glass", id: "Shot espresso mengalir dari portafilter ke gelas berisi es" },
    storyIndonesia: { tr: "Story Behind Indonesian Coffee — A journey from farmers' hands to my roastery; Flores logosu ve wayang figürleri", en: "Story Behind Indonesian Coffee — a journey from farmers' hands to our roastery; the Flores logo and wayang figures", id: "Story Behind Indonesian Coffee — perjalanan dari tangan petani ke roastery kami; logo Flores dan tokoh wayang" },
    espressoMachine: { tr: "Flores Coffee Bar'daki Bezzera espresso makinesi", en: "The Bezzera espresso machine at the Flores Coffee Bar", id: "Mesin espresso Bezzera di Flores Coffee Bar" },
    coffeeBarJars: {
      tr: "Coffee Bar tezgâhında Arjuna, Guntur ve Papandayan çekirdek kavanozları ve tadım kartı",
      en: "Jars of Arjuna, Guntur and Papandayan beans with a tasting card on the Coffee Bar counter",
      id: "Toples biji Arjuna, Guntur, dan Papandayan beserta kartu cicip di meja Coffee Bar",
    },
    coffeeShelf: { tr: "Coffee Bar rafında dizili Flores Roastery kahve kutuları", en: "Flores Roastery coffee boxes lined up on the Coffee Bar shelf", id: "Kotak kopi Flores Roastery berjajar di rak Coffee Bar" },
    boxesNature: { tr: "Doğada fotoğraflanmış Flores Roastery kahve kutuları — Where every bean has a story", en: "Flores Roastery coffee boxes photographed in nature — Where every bean has a story", id: "Kotak kopi Flores Roastery difoto di alam — Where every bean has a story" },
  },

  home: {
    eyebrow: { tr: "Eskişehir", en: "Eskişehir, Türkiye", id: "Eskişehir, Turki" },
    title: { a: { tr: "Her çekirdeğin bir ", en: "Where every bean has a ", id: "Setiap biji punya " }, em: { tr: "hikâyesi", en: "story", id: "cerita" }, b: { tr: " var.", en: ".", id: "." } },
    intro: {
      tr: "Harika kahve sadece tadılmamalı, hissedilmelidir. Kalpten kavuruyoruz; kahvenin kaynağından fincana uzanan yolculuğuna saygı duyuyoruz.",
      en: "Great coffee should not only be tasted, it should be felt. We roast from the heart and respect coffee's journey from source to cup.",
      id: "Kopi yang hebat tidak hanya dicicipi, tetapi dirasakan. Kami menyangrai sepenuh hati dan menghargai perjalanan kopi dari sumber hingga ke cangkir.",
    },
    explore: { tr: "Explore Coffees", en: "Explore Coffees", id: "Jelajahi Kopi" },
    story: { tr: "Hikayemiz", en: "Our Story", id: "Kisah Kami" },
    scroll: { tr: "Kaydır", en: "Scroll", id: "Gulir" },

    archesEyebrow: { tr: "Yalnızca kahve", en: "Only coffee", id: "Hanya kopi" },
    archesTitle: { a: { tr: "Üç koleksiyon, ", en: "Three collections, ", id: "Tiga koleksi, " }, em: { tr: "tek odak.", en: "one focus.", id: "satu fokus." } },
    archesText: {
      tr: "Kökeni net, kavurması özenli, her kutusu izlenebilir specialty kahveler.",
      en: "Specialty coffees with a clear origin, careful roasting and a traceable story on every box.",
      id: "Kopi spesialti dengan asal yang jelas, sangrai yang teliti, dan setiap kotak dapat ditelusuri.",
    },

    featuredEyebrow: { tr: "Haftalık taze kavrum", en: "Freshly roasted every week", id: "Disangrai segar setiap minggu" },
    featuredTitle: { tr: "Öne çıkanlar", en: "Featured", id: "Pilihan" },
    seeAll: { tr: "Tümünü gör →", en: "See all →", id: "Lihat semua →" },

    rusoTitle: { a: { tr: "Java'nın volkanik yamaçlarından, ", en: "From the volcanic slopes of Java, ", id: "Dari lereng vulkanik Jawa, " }, em: { tr: "aracısız.", en: "direct.", id: "tanpa perantara." } },
    rusoText: {
      tr: "Ruso Exotics, Endonezya'daki üreticilerimizle bizzat el sıkışarak seçtiğimiz sınırlı stoklu lotlarımız. Garut'un sisli tepelerinden Papandayan Yanardağı'nın eteklerine; çiftçinin avucundan kavurucumuza uzanan bir yolculuk.",
      en: "Ruso Exotics are limited lots we choose with a handshake with our producers in Indonesia. From the misty hills of Garut to the foothills of Mount Papandayan — a journey from the farmer's hands to our roaster.",
      id: "Ruso Exotics adalah lot terbatas yang kami pilih langsung bersama para produsen kami di Indonesia. Dari bukit berkabut Garut hingga kaki Gunung Papandayan — perjalanan dari tangan petani ke mesin sangrai kami.",
    },
    rusoCta: { tr: "Seriyi keşfet", en: "Explore the series", id: "Jelajahi seri ini" },
    rusoAlt: { tr: "Ruso Exotics {name} kahve kutusu", en: "Ruso Exotics {name} coffee box", id: "Kotak kopi Ruso Exotics {name}" },

    manifesto: {
      tr: "Kahvenin nereden geldiğini, kimin emeğiyle yetiştiğini ve nasıl kavrulduğunu saklamıyoruz. Üreticisini tanıdığımız lotları doğrudan ticaretle seçiyor, Eskişehir'deki Kuban kavurucumuzda haftalık kavuruyoruz. Her kutunun yanında kahvenin künyesi yazar.",
      en: "We don't hide where our coffee comes from, whose work grew it or how it was roasted. We choose lots from producers we know through direct trade and roast them weekly on our Kuban roaster in Eskişehir. Every box carries the coffee's full spec sheet on its side.",
      id: "Kami tidak menyembunyikan dari mana kopi berasal, siapa yang menanamnya, atau bagaimana ia disangrai. Kami memilih lot dari produsen yang kami kenal melalui direct trade dan menyangrainya setiap minggu dengan mesin Kuban kami di Eskişehir. Setiap kotak mencantumkan spesifikasi kopinya di sisi samping.",
    },
    manifestoCta: { tr: "Şeffaflık yaklaşımımız", en: "Our approach to transparency", id: "Pendekatan transparansi kami" },

    pillars: [
      {
        title: { tr: "Doğrudan ticaret", en: "Direct trade", id: "Direct trade" },
        text: {
          tr: "Ruso Exotics serimizde Java'daki üreticilerimizle bizzat el sıkışarak lot seçiyoruz. Aracı yok; üretici desteklenir, kahve taze gelir.",
          en: "For our Ruso Exotics series we choose lots with a handshake with our producers in Java. No middlemen: producers are supported and the coffee arrives fresh.",
          id: "Untuk seri Ruso Exotics, kami memilih lot langsung bersama produsen kami di Jawa. Tanpa perantara: produsen didukung dan kopi tiba dalam keadaan segar.",
        },
      },
      {
        title: { tr: "Haftalık kavrum", en: "Roasted weekly", id: "Disangrai mingguan" },
        text: {
          tr: "Tüm çekirdeklerimiz Kuban kavurucumuzda haftalık kavrulur. Paketteki tarih, kahvenizin kavrulduğu gündür.",
          en: "All our beans are roasted weekly on our Kuban roaster. The date on the bag is the day your coffee was roasted.",
          id: "Semua biji kami disangrai setiap minggu dengan mesin Kuban. Tanggal di kemasan adalah hari kopi Anda disangrai.",
        },
      },
      {
        title: { tr: "Saniye saniye tarif", en: "Second-by-second recipes", id: "Resep detik demi detik" },
        text: {
          tr: "Filtre ve espresso için o kahveye özel oran, öğütme ve döküm zamanlaması. Evde de kafedeki fincanı yakalayın.",
          en: "A ratio, grind and pour timing made for each coffee, for filter and espresso. Get the café cup at home.",
          id: "Rasio, gilingan, dan waktu tuang khusus untuk setiap kopi, untuk filter maupun espresso. Dapatkan rasa kafe di rumah.",
        },
      },
    ],

    blendsEyebrow: { tr: "Günlük kahveler", en: "Everyday coffees", id: "Kopi harian" },
    blendsTitle: { a: { tr: "Tatlı, sabah ve ", en: "Sweet, morning and ", id: "Manis, pagi, dan " }, em: { tr: "toprak.", en: "earth.", id: "tanah." } },
    blendsText: {
      tr: "Adlarını Endonezce'den alan üç günlük kahve: Etiyopya Sidamo tek kökenli Manis ile Etiyopya'nın meyvesini Endonezya'nın gövdesiyle buluşturan Pagi ve Tanah harmanları. Her gün, her demleme yönteminde.",
      en: "Three everyday coffees named in Indonesian: Manis, a single origin from Ethiopia's Sidamo, and the Pagi and Tanah blends that bring Ethiopia's fruit together with Indonesia's body. For every day and every brew method.",
      id: "Tiga kopi harian yang dinamai dalam bahasa Indonesia: Manis, single origin dari Sidamo, Etiopia, serta blend Pagi dan Tanah yang memadukan rasa buah Etiopia dengan body Indonesia. Untuk setiap hari dan setiap metode seduh.",
    },
    blendMeaning: { tr: "Endonezce “{meaning}”", en: "Indonesian for “{meaning}”", id: "Artinya “{meaning}”" },
    blendWords: {
      "manis-blend-espresso-filtre": { tr: "tatlı", en: "sweet", id: "manis" },
      pagi: { tr: "sabah", en: "morning", id: "pagi" },
      tanah: { tr: "toprak", en: "earth", id: "tanah" },
    },

    brewEyebrow: { tr: "Demleme rehberi", en: "Brew guide", id: "Panduan seduh" },
    brewTitle: { a: { tr: "Saniye saniye, ", en: "Second by second, ", id: "Detik demi detik, " }, em: { tr: "fincan fincan.", en: "cup by cup.", id: "cangkir demi cangkir." } },
    brewText: {
      tr: "Her kahvemizin sayfasında, o çekirdek için kalibre ettiğimiz filtre ve espresso tarifleri var. Zamanlayıcıyı başlatın, terazinizi sıfırlayın ve adımları takip edin.",
      en: "Every coffee page has filter and espresso recipes calibrated for that bean. Start the timer, tare your scale and follow the steps.",
      id: "Setiap halaman kopi kami memiliki resep filter dan espresso yang dikalibrasi untuk biji tersebut. Mulai timer, nolkan timbangan, lalu ikuti langkahnya.",
    },
    brewCta: { tr: "Rehberi aç", en: "Open the guide", id: "Buka panduan" },
    brewSteps: [
      { tr: "Ön ıslatma", en: "Bloom", id: "Blooming" },
      { tr: "Spiral döküş", en: "Spiral pour", id: "Tuang spiral" },
      { tr: "Spiral döküş", en: "Spiral pour", id: "Tuang spiral" },
      { tr: "Süzülme biter", en: "Drawdown ends", id: "Tetesan selesai" },
    ],

    boxScroll: {
      eyebrow: { tr: "Eskişehir · Haftalık taze kavrum", en: "Eskişehir · Roasted fresh weekly", id: "Eskişehir · Disangrai segar setiap minggu" },
      brand: { tr: "Flores", en: "Flores", id: "Flores" },
      intro: {
        tr: "Her kutuda tek bir kökenin hikâyesi var. Kaydırın, birlikte açalım.",
        en: "Every box holds the story of a single origin. Scroll — let's open it together.",
        id: "Setiap kotak menyimpan kisah satu asal. Gulir — mari kita buka bersama.",
      },
      roastEyebrow: { tr: "Kalpten kavrulur", en: "Roasted from the heart", id: "Disangrai sepenuh hati" },
      roastTitle: { tr: "Küçük partiler, büyük özen.", en: "Small batches, great care.", id: "Batch kecil, perhatian besar." },
      roastText: {
        tr: "Tepebaşı'ndaki atölyemizde, Kuban kavurucumuzda her hafta kavrulur; aynı hafta yola çıkar.",
        en: "Roasted every week on our Kuban roaster at our Tepebaşı workshop, and on its way the same week.",
        id: "Disangrai setiap minggu dengan mesin Kuban di workshop kami di Tepebaşı, dan dikirim di minggu yang sama.",
      },
      finalTitle: { tr: "Kutuyu aç, hikâyeyi demle.", en: "Open the box. Brew the story.", id: "Buka kotaknya. Seduh ceritanya." },
      cta: { tr: "Kahveleri keşfet", en: "Explore coffees", id: "Jelajahi kopi" },
    },
    instaEyebrow: { tr: "Instagram'da biz", en: "Find us on Instagram", id: "Kami di Instagram" },
    instaText: {
      tr: "Kavrum günleri, yeni gelen çekirdekler, Coffee Bar tadımları ve kampanyalar — hepsini ilk Instagram'da paylaşıyoruz.",
      en: "Roast days, new arrivals, Coffee Bar tastings and offers — we share them all on Instagram first.",
      id: "Hari sangrai, biji baru, sesi cupping di Coffee Bar, dan promo — semuanya kami bagikan lebih dulu di Instagram.",
    },
    instaFollow: { tr: "Takip et", en: "Follow", id: "Ikuti" },
    visitEyebrow: { tr: "Eskişehir'de", en: "In Eskişehir", id: "Di Eskişehir" },
    visitTitle: { tr: "Coffee Bar'da bir fincan", en: "A cup at the Coffee Bar", id: "Secangkir di Coffee Bar" },
    visitText: {
      tr: "Kahvelerimizi kavrulduğu yerde, barmenlerimizin elinden deneyin.",
      en: "Taste our coffees where they're roasted, made by our baristas.",
      id: "Cicipi kopi kami di tempat ia disangrai, diseduh oleh barista kami.",
    },
    book: { tr: "Randevu al", en: "Book a visit", id: "Buat reservasi" },
    bizEyebrow: { tr: "İşletmeler için", en: "For businesses", id: "Untuk bisnis" },
    bizTitle: { tr: "Toptan kahve", en: "Wholesale coffee", id: "Kopi grosir" },
    bizText: {
      tr: "Kafe, restoran ve ofisler için düzenli taze kavrum kahve tedariki — B2B portalımızdan sipariş verin.",
      en: "A regular supply of freshly roasted coffee for cafés, restaurants and offices — order from our B2B portal.",
      id: "Pasokan rutin kopi sangrai segar untuk kafe, restoran, dan kantor — pesan melalui portal B2B kami.",
    },
    bizCta: { tr: "Toptan satış", en: "Wholesale", id: "Grosir" },
  },

  catalog: {
    title: { tr: "Çekirdek Kahve — Specialty & 3. Nesil Kahve Çeşitleri", en: "All Coffees — Specialty Whole Bean Coffee", id: "Semua Kopi — Biji Kopi Spesialti" },
    description: {
      tr: "Flores Roastery çekirdek kahveleri: Endonezya Ruso Exotics serisi, El Salvador, Kolombiya, Meksika ve Etiyopya Sidamo (Manis) tek kökenliler; Pagi ve Tanah harmanları. Haftalık taze kavrum.",
      en: "Flores Roastery whole-bean coffees: the Indonesian Ruso Exotics series, single origins from El Salvador, Colombia, Mexico and Ethiopia's Sidamo (Manis), and the Pagi and Tanah blends. Roasted fresh every week.",
      id: "Biji kopi Flores Roastery: seri Ruso Exotics dari Indonesia, single origin dari El Salvador, Kolombia, Meksiko, dan Sidamo Etiopia (Manis), serta blend Pagi dan Tanah. Disangrai segar setiap minggu.",
    },
    eyebrow: { tr: "Kahveler", en: "Coffees", id: "Kopi" },
    heading: { a: { tr: "Her çekirdeğin ", en: "Where every bean has ", id: "Setiap biji punya " }, em: { tr: "bir hikâyesi", en: "a story", id: "cerita" }, b: { tr: " var.", en: ".", id: "." } },
    intro: {
      tr: "Java'nın volkanik yamaçlarından El Salvador'un aile çiftliklerine; doğrudan ticaretle seçtiğimiz, Eskişehir'de haftalık kavurduğumuz kahveler.",
      en: "From the volcanic slopes of Java to the family farms of El Salvador — coffees we choose through direct trade and roast weekly in Eskişehir.",
      id: "Dari lereng vulkanik Jawa hingga kebun keluarga di El Salvador — kopi yang kami pilih melalui direct trade dan sangrai setiap minggu di Eskişehir.",
    },
  },

  category: {
    notFound: { tr: "Kategori bulunamadı", en: "Category not found", id: "Kategori tidak ditemukan" },
    title: { tr: "{name} Çekirdek Kahveler — Specialty Kahve", en: "{name} Coffees", id: "Kopi {name}" },
    collection: { tr: "Koleksiyon", en: "Collection", id: "Koleksi" },
    listAria: { tr: "{name} kahveleri", en: "{name} coffees", id: "Kopi {name}" },
  },

  product: {
    compare: { tr: "Diğer kahvelerle karşılaştır", en: "Compare with other coffees", id: "Bandingkan dengan kopi lain" },
    notFound: { tr: "Kahve bulunamadı", en: "Coffee not found", id: "Kopi tidak ditemukan" },
    metaTitle: { tr: "{name} Çekirdek Kahve — Fiyat ve Tadım Notaları", en: "{name} — Whole Bean Coffee", id: "{name} — Biji Kopi" },
    metaNotes: { tr: "Tadım notaları: {notes}.", en: "Tasting notes: {notes}.", id: "Catatan rasa: {notes}." },
    specAria: { tr: "Kahve künyesi", en: "Coffee spec sheet", id: "Spesifikasi kopi" },
    tastingNotes: { tr: "Tadım notaları", en: "Tasting notes", id: "Catatan rasa" },
    identity: { tr: "Kahve kimliği", en: "Coffee profile", id: "Profil kopi" },
    bodyAcidity: { tr: "Gövde & asidite", en: "Body & acidity", id: "Body & keasaman" },
    profile: { tr: "Tadım profili", en: "Tasting profile", id: "Profil rasa" },
    related: { tr: "Bunları da sevebilirsiniz", en: "You may also like", id: "Mungkin Anda juga suka" },
    sensory: { body: { tr: "Gövde", en: "Body", id: "Body" }, acidity: { tr: "Asidite", en: "Acidity", id: "Keasaman" }, sweetness: { tr: "Tatlılık", en: "Sweetness", id: "Rasa manis" } },
    specs: {
      origin: { tr: "Menşei", en: "Origin", id: "Asal" },
      region: { tr: "Bölge", en: "Region", id: "Wilayah" },
      altitude: { tr: "Rakım", en: "Altitude", id: "Ketinggian" },
      process: { tr: "İşleme", en: "Process", id: "Proses" },
      variety: { tr: "Çeşit", en: "Variety", id: "Varietas" },
      harvest: { tr: "Hasat", en: "Harvest", id: "Panen" },
      producer: { tr: "Üretici", en: "Producer", id: "Produsen" },
      farm: { tr: "Çiftlik", en: "Farm", id: "Kebun" },
      roast: { tr: "Kavurma", en: "Roast", id: "Sangrai" },
      brew: { tr: "Önerilen demleme", en: "Recommended brew", id: "Seduhan yang disarankan" },
      score: { tr: "Kupa puanı", en: "Cup score", id: "Skor cupping" },
    },
    loading: { tr: "Kahve yükleniyor", en: "Loading coffee", id: "Memuat kopi" },
    loadingList: { tr: "Kahveler yükleniyor", en: "Loading coffees", id: "Memuat kopi" },
  },

  story: {
    title: { tr: "Hikayemiz", en: "Our Story", id: "Kisah Kami" },
    description: {
      tr: "Flores Roastery'nin hikâyesi: Eskişehir'de Kuban kavurucuda haftalık kavrum, Endonezya'dan doğrudan ticaret Ruso Exotics serisi ve şeffaf tedarik zinciri.",
      en: "The Flores Roastery story: weekly roasting on a Kuban roaster in Eskişehir, the direct-trade Ruso Exotics series from Indonesia and a transparent supply chain.",
      id: "Kisah Flores Roastery: sangrai mingguan dengan mesin Kuban di Eskişehir, seri direct trade Ruso Exotics dari Indonesia, dan rantai pasok yang transparan.",
    },
    heading: { a: { tr: "Harika kahve sadece tadılmamalı, ", en: "Great coffee shouldn't only be tasted, ", id: "Kopi yang hebat tak hanya dicicipi, " }, em: { tr: "hissedilmelidir.", en: "it should be felt.", id: "tetapi dirasakan." } },
    workshopEyebrow: { tr: "Eskişehir · Kavurma atölyesi", en: "Eskişehir · Roasting workshop", id: "Eskişehir · Workshop sangrai" },
    workshopTitle: { tr: "Kalpten kavuruyoruz", en: "We roast from the heart", id: "Kami menyangrai sepenuh hati" },
    workshop: [
      {
        tr: "Çekirdeklerimiz Tepebaşı'ndaki atölyemizde, Kuban kavurucumuzda haftalık olarak kavrulur. Her kahveyi kendi karakterine göre profilliyor; çiçeksi bir Java honey'yi narin, gövdeli bir harmanı cesur kavuruyoruz.",
        en: "Our beans are roasted weekly on our Kuban roaster at our workshop in Tepebaşı. We profile each coffee to its own character — a floral Java honey gently, a full-bodied blend boldly.",
        id: "Biji kami disangrai setiap minggu dengan mesin Kuban di workshop kami di Tepebaşı. Setiap kopi kami profilkan sesuai karakternya — Java honey yang floral dengan lembut, blend yang ber-body dengan berani.",
      },
      {
        tr: "Paketin üzerindeki tarih, kahvenizin kavrulduğu gündür. Kavurma derecesini, demleme önerisini ve kahvenin künyesini her ürün sayfasında bulabilirsiniz.",
        en: "The date on the bag is the day your coffee was roasted. You'll find the roast level, brewing suggestions and the coffee's spec sheet on every product page.",
        id: "Tanggal di kemasan adalah hari kopi Anda disangrai. Tingkat sangrai, saran seduh, dan spesifikasi kopi tersedia di setiap halaman produk.",
      },
    ],
    rusoTitle: { a: { tr: "A journey from farmers' hands ", en: "A journey from farmers' hands ", id: "Perjalanan dari tangan petani " }, em: { tr: "to our roastery.", en: "to our roastery.", id: "ke roastery kami." } },
    ruso: [
      {
        tr: "Ruso Exotics, Endonezya kahvelerini doğrudan ticaretle Türkiye'ye getiren kendi markamız. Batı Java'nın Garut bölgesinde, sisli tepelerde ve Papandayan Yanardağı'nın eteklerinde çalışan üreticilerle bizzat tanıştık; lotlarımızı onlarla el sıkışarak seçiyoruz.",
        en: "Ruso Exotics is our own brand bringing Indonesian coffees to Türkiye through direct trade. We have met in person the producers working on the misty hills of Garut in West Java and the foothills of Mount Papandayan, and we choose our lots with a handshake.",
        id: "Ruso Exotics adalah merek kami sendiri yang membawa kopi Indonesia ke Turki melalui direct trade. Kami bertemu langsung dengan para produsen di bukit berkabut Garut, Jawa Barat, dan di kaki Gunung Papandayan; lot kami pilih dengan berjabat tangan bersama mereka.",
      },
      {
        tr: "Direct Trade felsefemizle aracıları ortadan kaldırıyor, hem üreticiyi destekliyor hem de en taze, en nitelikli çekirdekleri size ulaştırıyoruz. Bu yüzden Ruso Exotics lotları sınırlıdır — bittiğinde, bir sonraki hasadı bekleriz.",
        en: "With our direct-trade philosophy we cut out the middlemen, supporting producers while bringing you the freshest, finest beans. That's why Ruso Exotics lots are limited — when they're gone, we wait for the next harvest.",
        id: "Dengan filosofi direct trade, kami menghilangkan perantara, mendukung produsen sekaligus menghadirkan biji paling segar dan berkualitas untuk Anda. Karena itu lot Ruso Exotics terbatas — saat habis, kami menunggu panen berikutnya.",
      },
    ],
    rusoCta: { tr: "Ruso Exotics kahveleri", en: "Ruso Exotics coffees", id: "Kopi Ruso Exotics" },
    transparencyEyebrow: { tr: "Şeffaflık", en: "Transparency", id: "Transparansi" },
    transparencyTitle: { tr: "Kutunun yan yüzünde yazanlar", en: "What's written on the side of the box", id: "Yang tertulis di sisi kotak" },
    transparency: [
      {
        k: { tr: "Köken", en: "Origin", id: "Asal" },
        v: {
          tr: "Ülke, bölge, rakım ve — biliyorsak — üretici ile çiftlik adı her kutunun yan yüzünde ve ürün sayfasında yazar.",
          en: "Country, region, altitude and — when we know them — the producer and farm are written on the side of every box and on the product page.",
          id: "Negara, wilayah, ketinggian, dan — bila diketahui — nama produsen serta kebun tertulis di sisi setiap kotak dan di halaman produk.",
        },
      },
      {
        k: { tr: "İşleme", en: "Process", id: "Proses" },
        v: {
          tr: "Washed, natural, honey, anaerobik ya da wet hulled: kirazın çekirdeğe nasıl dönüştüğünü açıkça belirtiriz.",
          en: "Washed, natural, honey, anaerobic or wet hulled: we state clearly how the cherry became a bean.",
          id: "Washed, natural, honey, anaerob, atau giling basah: kami jelaskan bagaimana ceri berubah menjadi biji.",
        },
      },
      {
        k: { tr: "Kavrum", en: "Roast", id: "Sangrai" },
        v: {
          tr: "Paketteki tarih kavrum tarihidir. Tüm çekirdeklerimiz haftalık kavrulur; en iyi lezzet için 1 ay içinde tüketin.",
          en: "The date on the bag is the roast date. All our beans are roasted weekly; enjoy within a month for the best flavour.",
          id: "Tanggal di kemasan adalah tanggal sangrai. Semua biji disangrai mingguan; nikmati dalam 1 bulan untuk rasa terbaik.",
        },
      },
      {
        k: { tr: "Tedarik", en: "Sourcing", id: "Sumber" },
        v: {
          tr: "Ruso Exotics serisinde Java'daki üreticilerle doğrudan çalışırız; aracıların payı üreticiye ve tazeliğe kalır.",
          en: "For the Ruso Exotics series we work directly with producers in Java; what would go to middlemen stays with the producer and the freshness.",
          id: "Untuk seri Ruso Exotics kami bekerja langsung dengan produsen di Jawa; bagian perantara kembali ke produsen dan kesegaran kopi.",
        },
      },
    ],
    coffeeBarCta: { tr: "Coffee Bar randevusu", en: "Coffee Bar booking", id: "Reservasi Coffee Bar" },
  },

  coffeeBar: {
    title: { tr: "Coffee Bar — Kahve Tadım Randevusu", en: "Coffee Bar — Coffee Tasting Booking", id: "Coffee Bar — Reservasi Cicip Kopi" },
    description: {
      tr: "Eskişehir Tepebaşı'ndaki deneyim barımızda tüm çekirdeklerimizi tadın.",
      en: "Taste all our beans at our experience bar in Tepebaşı, Eskişehir.",
      id: "Cicipi semua biji kopi kami di experience bar kami di Tepebaşı, Eskişehir.",
    },
    heading: { a: { tr: "Kahve tadım ", en: "Coffee tasting ", id: "Reservasi " }, em: { tr: "randevusu", en: "booking", id: "cicip kopi" } },
    intro: {
      tr: "Kör bir seçim yapmayın. Kavurduğumuz her çekirdeği deneyim barımızda, barmenlerimiz eşliğinde tadın; damağınıza uyan profili yerinde bulun.",
      en: "Don't choose blind. Taste every bean we roast at our experience bar with our baristas, and find the profile that suits you on the spot.",
      id: "Jangan memilih tanpa mencoba. Cicipi setiap biji yang kami sangrai di experience bar bersama barista kami, dan temukan profil yang cocok untuk Anda.",
    },
    days: { tr: "Günler", en: "Days", id: "Hari" },
    hours: { tr: "Saatler", en: "Hours", id: "Jam" },
    capacity: { tr: "Kapasite", en: "Capacity", id: "Kapasitas" },
    capacityValue: { tr: "Saat başına {n} kişi", en: "{n} guests per hour", id: "{n} orang per jam" },
    closed: { tr: "Kapalı", en: "Closed", id: "Tutup" },
    experience: [
      { tr: "Tüm single origin ve blend'lerimizi yerinde tadım", en: "Taste all our single origins and blends on site", id: "Cicipi semua single origin dan blend kami di tempat" },
      { tr: "Barista eşliğinde espresso & filtre kıyaslaması", en: "Espresso & filter comparison with a barista", id: "Perbandingan espresso & filter bersama barista" },
      { tr: "Demleme yöntemleri ve öğütme üzerine sohbet", en: "A chat about brew methods and grinding", id: "Ngobrol soal metode seduh dan gilingan" },
      { tr: "Evinize ya da işletmenize en uygun profili birlikte seçme", en: "Choosing the best profile for your home or business together", id: "Memilih profil terbaik untuk rumah atau bisnis Anda bersama" },
    ],
    waText: { tr: "Merhaba, deneyim barınıza uğrayıp çekirdek tatmak istiyorum.", en: "Hello, I'd like to visit your experience bar and taste some beans.", id: "Halo, saya ingin berkunjung ke experience bar Anda dan mencicipi biji kopi." },
    iframeTitle: { tr: "Flores Roastery kahve tadım randevu formu", en: "Flores Roastery coffee tasting booking form", id: "Formulir reservasi cicip kopi Flores Roastery" },
    formTr: {
      tr: "",
      en: "The booking form is in Turkish — pick a date and time, enter your name, email and phone, and you'll get a confirmation email.",
      id: "Formulir reservasi berbahasa Turki — pilih tanggal dan jam, isi nama, email, dan telepon, lalu Anda akan menerima email konfirmasi.",
    },
    formMissing: { tr: "Form görünmüyor mu?", en: "Can't see the form?", id: "Formulir tidak muncul?" },
    formOpen: { tr: "Randevu sayfasını yeni sekmede açın", en: "Open the booking page in a new tab", id: "Buka halaman reservasi di tab baru" },
    sideTitle: { tr: "Kavrulduğu yerde, yan yana fincanlar", en: "Side-by-side cups, right where it's roasted", id: "Cangkir berdampingan, tepat di tempat disangrai" },
    sideText: {
      tr: "Barımız, Kuban kavurucumuzun hemen yanında. Tadım sırasında haftanın kavrumunu, kavurma derecelerini ve demleme tarifleri üzerine merak ettiklerinizi sorabilirsiniz. İşletmeniz için kahve arıyorsanız {wholesale} seçeneklerini de birlikte konuşalım.",
      en: "Our bar sits right next to our Kuban roaster. During the tasting, ask us anything about this week's roast, roast levels and brew recipes. Looking for coffee for your business? Let's talk about {wholesale} too.",
      id: "Bar kami berada tepat di samping mesin sangrai Kuban. Saat mencicipi, tanyakan apa saja tentang sangrai minggu ini, tingkat sangrai, dan resep seduh. Mencari kopi untuk bisnis Anda? Mari bicarakan opsi {wholesale} juga.",
    },
    wholesaleLink: { tr: "toptan satış", en: "wholesale", id: "grosir" },
    exploreCta: { tr: "Kahvelerimizi keşfedin", en: "Explore our coffees", id: "Jelajahi kopi kami" },
  },

  brewPage: {
    title: { tr: "Demleme Rehberi — V60, Chemex, French Press, Espresso", en: "Brew Guide — V60, Chemex, French Press, Espresso", id: "Panduan Seduh — V60, Chemex, French Press, Espresso" },
    description: {
      tr: "Specialty kahveyi evde demlemek için saniye saniye tarifler: V60, Kalita Wave, Chemex, French Press ve espresso. Oran hesaplayıcı ve öğütme rehberi.",
      en: "Second-by-second recipes for brewing specialty coffee at home: V60, Kalita Wave, Chemex, French Press and espresso. A ratio calculator and a grind guide.",
      id: "Resep detik demi detik untuk menyeduh kopi spesialti di rumah: V60, Kalita Wave, Chemex, French Press, dan espresso. Kalkulator rasio dan panduan gilingan.",
    },
    eyebrow: { tr: "Demleme rehberi", en: "Brew guide", id: "Panduan seduh" },
    heading: { a: { tr: "Saniye saniye, ", en: "Second by second, ", id: "Detik demi detik, " }, em: { tr: "fincan fincan.", en: "cup by cup.", id: "cangkir demi cangkir." } },
    intro: {
      tr: "Zamanlayıcıyı başlatın, terazinizi sıfırlayın ve adımları izleyin. Her kahvemizin sayfasında o çekirdeğe özel kalibre edilmiş tarif de var — {link}.",
      en: "Start the timer, tare your scale and follow the steps. Every coffee page also has a recipe calibrated for that bean — {link}.",
      id: "Mulai timer, nolkan timbangan, dan ikuti langkahnya. Setiap halaman kopi juga punya resep yang dikalibrasi untuk biji tersebut — {link}.",
    },
    introLink: { tr: "kahvelere göz atın", en: "browse the coffees", id: "lihat kopinya" },
    grindTitle: { tr: "Öğütme rehberi", en: "Grind guide", id: "Panduan gilingan" },
    grindText: {
      tr: "Temas süresi uzadıkça öğütme kalınlaşır. Aşağıdaki değerler başlangıç noktasıdır; acı ve kuru bir fincan için kalınlaştırın, ekşi ve sulu bir fincan için inceltin.",
      en: "The longer the contact time, the coarser the grind. These values are a starting point: go coarser for a bitter, dry cup and finer for a sour, thin one.",
      id: "Semakin lama waktu kontak, semakin kasar gilingannya. Nilai di bawah adalah titik awal: perkasar untuk cangkir yang pahit dan kering, perhalus untuk cangkir yang asam dan encer.",
    },
    grind: [
      { method: { tr: "Türk Kahvesi", en: "Turkish coffee", id: "Kopi Turki" }, size: { tr: "Çok ince · pudra", en: "Extra fine · powder", id: "Sangat halus · bubuk" } },
      { method: { tr: "Espresso", en: "Espresso", id: "Espresso" }, size: { tr: "İnce", en: "Fine", id: "Halus" } },
      { method: { tr: "Moka Pot", en: "Moka Pot", id: "Moka Pot" }, size: { tr: "İnce-orta", en: "Fine-medium", id: "Halus-sedang" } },
      { method: { tr: "V60 / Origami", en: "V60 / Origami", id: "V60 / Origami" }, size: { tr: "Orta-ince", en: "Medium-fine", id: "Sedang-halus" } },
      { method: { tr: "Kalita / Filtre makinesi", en: "Kalita / filter machine", id: "Kalita / mesin filter" }, size: { tr: "Orta", en: "Medium", id: "Sedang" } },
      { method: { tr: "Chemex", en: "Chemex", id: "Chemex" }, size: { tr: "Orta-kalın", en: "Medium-coarse", id: "Sedang-kasar" } },
      { method: { tr: "French Press", en: "French Press", id: "French Press" }, size: { tr: "Kalın", en: "Coarse", id: "Kasar" } },
      { method: { tr: "Cold Brew", en: "Cold Brew", id: "Cold Brew" }, size: { tr: "Çok kalın", en: "Extra coarse", id: "Sangat kasar" } },
    ],
  },

  contact: {
    title: { tr: "İletişim", en: "Contact", id: "Kontak" },
    eyebrow: { tr: "İletişim", en: "Contact", id: "Kontak" },
    heading: { tr: "Bir fincan sohbet?", en: "A chat over coffee?", id: "Ngobrol sambil ngopi?" },
    intro: {
      tr: "Siparişleriniz, kahvelerimiz, toptan satış ya da sadece bir merhaba için yazın.",
      en: "Write to us about your orders, our coffees, wholesale or just to say hello.",
      id: "Tulis kepada kami tentang pesanan, kopi kami, grosir, atau sekadar menyapa.",
    },
    directions: { tr: "Yol tarifi ↗", en: "Directions ↗", id: "Petunjuk arah ↗" },
    booking: { tr: "Tadım randevusu →", en: "Tasting booking →", id: "Reservasi cicip →" },
    phoneEmail: { tr: "Telefon & e-posta", en: "Phone & email", id: "Telepon & email" },
    wholesale: { tr: "Toptan satış", en: "Wholesale", id: "Grosir" },
    wholesaleLink: { tr: "Toptan satış sayfası →", en: "Wholesale page →", id: "Halaman grosir →" },
    company: { tr: "Şirket bilgileri", en: "Company details", id: "Info perusahaan" },
  },

  login: {
    title: { tr: "Giriş yap / Üye ol", en: "Sign in / Create account", id: "Masuk / Daftar" },
    eyebrow: { tr: "Hesabım", en: "My account", id: "Akun saya" },
    heading: { tr: "Tekrar hoş geldiniz", en: "Welcome back", id: "Selamat datang kembali" },
    intro: {
      tr: "floresroastery.com'daki hesabınızla, aynı e-posta ve şifreyle giriş yapabilirsiniz.",
      en: "Sign in with your floresroastery.com account — same email, same password.",
      id: "Masuk dengan akun floresroastery.com Anda — email dan kata sandi yang sama.",
    },
    guestTitle: { tr: "Üye olmadan da alışveriş yapabilirsiniz", en: "You can also shop without an account", id: "Anda juga bisa belanja tanpa akun" },
    perkMembers: { tr: "Üyeler: sipariş geçmişi, kayıtlı adres, hızlı ödeme", en: "Members: order history, saved address, faster checkout", id: "Anggota: riwayat pesanan, alamat tersimpan, checkout cepat" },
    perkGuests: { tr: "Misafirler: sipariş no + e-posta ile takip", en: "Guests: track with order number + email", id: "Tamu: lacak dengan nomor pesanan + email" },
    guestText: {
      tr: "Siparişinizi misafir olarak verin; sipariş numaranız ve e-posta adresinizle durumunu istediğiniz zaman takip edin.",
      en: "Order as a guest and track it any time with your order number and email address.",
      id: "Pesan sebagai tamu dan lacak kapan saja dengan nomor pesanan dan alamat email Anda.",
    },
    startShopping: { tr: "Alışverişe başla", en: "Start shopping", id: "Mulai belanja" },
    tracking: { tr: "Sipariş takibi", en: "Order tracking", id: "Lacak pesanan" },
  },

  account: {
    title: { tr: "Hesabım", en: "My account", id: "Akun saya" },
    hello: { tr: "Merhaba, {name}", en: "Hello, {name}", id: "Halo, {name}" },
    reorder: { tr: "Tekrar sipariş et", en: "Order again", id: "Pesan lagi" },
    reorderPartial: {
      tr: "{n} ürün şu an satışta değil, sepete eklenmez.",
      en: "{n} item(s) are not available right now and won't be added.",
      id: "{n} produk sedang tidak tersedia dan tidak ditambahkan.",
    },
    loadError: {
      tr: "Hesap bilgileriniz şu an yüklenemedi. Lütfen biraz sonra sayfayı yenileyin.",
      en: "We couldn't load your account details right now. Please refresh the page in a moment.",
      id: "Detail akun Anda belum dapat dimuat. Silakan muat ulang halaman sebentar lagi.",
    },
    orders: { tr: "Siparişlerim", en: "My orders", id: "Pesanan saya" },
    noOrders: { tr: "Henüz bu hesapla verilmiş bir sipariş yok.", en: "No orders have been placed with this account yet.", id: "Belum ada pesanan dengan akun ini." },
    address: { tr: "Teslimat adresi", en: "Delivery address", id: "Alamat pengiriman" },
    noAddress: {
      tr: "Kayıtlı adres yok. İlk siparişinizde yazdığınız adres hesabınıza kaydedilir.",
      en: "No saved address. The address from your first order will be saved to your account.",
      id: "Belum ada alamat tersimpan. Alamat dari pesanan pertama akan disimpan ke akun Anda.",
    },
    addressNote: {
      tr: "Ödeme sayfasında bu bilgiler otomatik dolar; siparişte değiştirirseniz hesabınız da güncellenir.",
      en: "These details fill in automatically at checkout; if you change them on an order, your account is updated too.",
      id: "Data ini terisi otomatis saat checkout; jika diubah saat memesan, akun Anda ikut diperbarui.",
    },
    returnRequest: { tr: "İade talebi", en: "Return request", id: "Pengembalian" },
  },

  tracking: {
    title: { tr: "Sipariş Takibi", en: "Order Tracking", id: "Lacak Pesanan" },
    description: {
      tr: "Flores Roastery siparişinizin durumunu sipariş numarası ve e-posta adresinizle sorgulayın.",
      en: "Check the status of your Flores Roastery order with your order number and email address.",
      id: "Cek status pesanan Flores Roastery Anda dengan nomor pesanan dan alamat email.",
    },
    eyebrow: { tr: "Destek", en: "Support", id: "Bantuan" },
    heading: { tr: "Sipariş takibi", en: "Order tracking", id: "Lacak pesanan" },
    intro: {
      tr: "Kahveniz kavrulma, paketleme ya da kargo aşamasında mı? Hemen öğrenin.",
      en: "Is your coffee being roasted, packed or already on its way? Find out now.",
      id: "Apakah kopi Anda sedang disangrai, dikemas, atau sudah dikirim? Cek sekarang.",
    },
  },

  returns: {
    title: { tr: "İade Talebi & Cayma Bildirimi", en: "Return Request & Withdrawal Notice", id: "Permintaan Pengembalian & Pembatalan" },
    description: {
      tr: "Flores Roastery siparişiniz için cayma hakkı bildirimi ve iade talebi oluşturun.",
      en: "Submit a withdrawal notice or return request for your Flores Roastery order.",
      id: "Ajukan pembatalan atau permintaan pengembalian untuk pesanan Flores Roastery Anda.",
    },
    eyebrow: { tr: "Destek", en: "Support", id: "Bantuan" },
    heading: { tr: "İade talebi", en: "Return request", id: "Permintaan pengembalian" },
    intro: {
      tr: "Siparişinizden memnun kalmadıysanız buradayız. Hasarlı ya da hatalı teslimatlarda masraf bizden.",
      en: "If you're not happy with your order, we're here. For damaged or incorrect deliveries, the cost is on us.",
      id: "Jika Anda tidak puas dengan pesanan, kami siap membantu. Untuk kiriman rusak atau salah, biaya kami tanggung.",
    },
    terms: { tr: "Teslimat ve iade şartları", en: "Delivery and returns terms", id: "Ketentuan pengiriman dan retur" },
    steps: [
      {
        t: { tr: "Bildirin", en: "Notify us", id: "Beri tahu kami" },
        d: { tr: "Teslimattan itibaren 14 gün içinde bu formu doldurun ya da bize e-posta ile yazın.", en: "Fill in this form or email us within 14 days of delivery.", id: "Isi formulir ini atau kirim email dalam 14 hari setelah barang diterima." },
      },
      {
        t: { tr: "Paketleyin", en: "Pack it", id: "Kemas" },
        d: { tr: "Ürünü orijinal kutusu ve faturasıyla, kullanılmamış ve hasarsız şekilde hazırlayın.", en: "Prepare the item unused and undamaged, in its original box with the invoice.", id: "Siapkan produk dalam keadaan belum dipakai dan tidak rusak, dengan kotak asli dan faktur." },
      },
      {
        t: { tr: "Gönderin", en: "Send it", id: "Kirim" },
        d: { tr: "Ürünü size ileteceğimiz iade adresine kargoyla gönderin.", en: "Ship the item to the return address we send you.", id: "Kirim produk ke alamat retur yang kami berikan." },
      },
      {
        t: { tr: "İade", en: "Refund", id: "Refund" },
        d: { tr: "Bildiriminiz bize ulaştıktan sonra en geç 10 gün içinde ödemeniz iade edilir.", en: "Your payment is refunded within 10 days of receiving your notice.", id: "Pembayaran dikembalikan paling lambat 10 hari setelah pemberitahuan kami terima." },
      },
    ],
    groundNote: {
      tr: "Öğütülmüş kahveler kişisel talebe göre hazırlandığından ve ambalajı açılmış gıda ürünleri hijyen gereği cayma hakkı kapsamı dışındadır. Hasarlı veya hatalı ürünlerde bu sınır geçerli değildir.",
      en: "Ground coffee, prepared to order, and opened food products are excluded from the right of withdrawal for hygiene reasons. This limit does not apply to damaged or incorrect items.",
      id: "Kopi bubuk yang disiapkan sesuai pesanan dan produk makanan yang kemasannya sudah dibuka tidak termasuk hak pembatalan karena alasan higienis. Batasan ini tidak berlaku untuk produk rusak atau salah kirim.",
    },
    questions: { tr: "Sorunuz mu var?", en: "Any questions?", id: "Ada pertanyaan?" },
  },

  orderDone: { title: { tr: "Siparişiniz alındı", en: "Your order is in", id: "Pesanan Anda diterima" } },

  checkoutPage: {
    title: { tr: "Ödeme", en: "Checkout", id: "Pembayaran" },
    eyebrow: { tr: "Güvenli ödeme", en: "Secure checkout", id: "Pembayaran aman" },
    heading: { tr: "Siparişinizi tamamlayın", en: "Complete your order", id: "Selesaikan pesanan Anda" },
  },

  notFound: {
    heading: { a: { tr: "Bu fincan ", en: "This cup came out ", id: "Cangkir ini ternyata " }, em: { tr: "boş", en: "empty", id: "kosong" }, b: { tr: " çıktı.", en: ".", id: "." } },
    text: {
      tr: "Aradığınız sayfa taşınmış ya da hiç demlenmemiş olabilir. Kahvelerimize göz atmaya ne dersiniz?",
      en: "The page you're looking for may have moved or was never brewed. How about browsing our coffees?",
      id: "Halaman yang Anda cari mungkin sudah pindah atau belum pernah diseduh. Bagaimana kalau melihat kopi kami?",
    },
    coffees: { tr: "Kahveler", en: "Coffees", id: "Kopi" },
    home: { tr: "Ana sayfa", en: "Home", id: "Beranda" },
  },
};
