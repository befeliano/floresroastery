/**
 * Kahve araçları: bulucu testi, karşılaştırma, tat çarkı, köken haritası, demleme günlüğü, değirmen rehberi.
 * Sunucuda seçili dile indirgenir (t()) ve istemci bileşenlerine hazır metin olarak verilir.
 */
export const tools = {
  links: {
    finder: { tr: "Kahve bulucu", en: "Coffee finder", id: "Pencari kopi" },
    compare: { tr: "Karşılaştır", en: "Compare", id: "Bandingkan" },
    wheel: { tr: "Tat çarkı", en: "Flavour wheel", id: "Roda rasa" },
    map: { tr: "Köken haritası", en: "Origin map", id: "Peta asal" },
    finderTeaser: { tr: "Hangi kahve bana göre?", en: "Which coffee suits me?", id: "Kopi mana yang cocok untuk saya?" },
  },

  finder: {
    metaTitle: { tr: "Kahve Bulucu — Sana Uygun Kahveyi 5 Soruda Bul", en: "Coffee Finder — Find Your Coffee in 5 Questions", id: "Pencari Kopi — Temukan Kopimu dalam 5 Pertanyaan" },
    metaDescription: {
      tr: "Demleme yöntemin, süt tercihin ve sevdiğin tatlara göre Flores kahvelerinden sana en uygununu öneren kısa test.",
      en: "A short quiz that recommends the right Flores coffee for your brew method, milk preference and favourite flavours.",
      id: "Kuis singkat yang merekomendasikan kopi Flores sesuai metode seduh, preferensi susu, dan rasa favoritmu.",
    },
    eyebrow: { tr: "Kahve bulucu", en: "Coffee finder", id: "Pencari kopi" },
    title: { a: { tr: "Sana göre kahve, ", en: "Your coffee, ", id: "Kopimu, " }, em: { tr: "5 soruda.", en: "in 5 questions.", id: "dalam 5 pertanyaan." } },
    intro: {
      tr: "Doğru ya da yanlış cevap yok. Nasıl içtiğini söyle, kahvelerimizden sana en uygun üçünü seçelim.",
      en: "There are no right or wrong answers. Tell us how you drink your coffee and we'll pick the three that suit you best.",
      id: "Tidak ada jawaban benar atau salah. Ceritakan cara kamu minum kopi, kami pilihkan tiga yang paling cocok.",
    },
    step: { tr: "Soru {n} / {total}", en: "Question {n} of {total}", id: "Pertanyaan {n} dari {total}" },
    back: { tr: "Geri", en: "Back", id: "Kembali" },
    restart: { tr: "Testi yeniden başlat", en: "Start over", id: "Ulangi kuis" },
    resultEyebrow: { tr: "Senin için seçtiklerimiz", en: "Our picks for you", id: "Pilihan kami untukmu" },
    resultTitle: { tr: "En uygun kahven", en: "Your best match", id: "Paling cocok untukmu" },
    alternatives: { tr: "Bunlar da hoşuna gidebilir", en: "You may also enjoy", id: "Kamu mungkin juga suka" },
    match: { tr: "%{n} uyum", en: "{n}% match", id: "{n}% cocok" },
    view: { tr: "Kahveyi incele", en: "View coffee", id: "Lihat kopi" },
    grindTip: {
      tr: "İpucu: Ürün sayfasında demleme yöntemine göre öğütme seçebilirsin.",
      en: "Tip: on the product page you can choose a grind for your brew method.",
      id: "Tips: di halaman produk kamu bisa memilih gilingan sesuai metode seduh.",
    },
    questions: [
      {
        key: "method",
        q: { tr: "Kahveni en çok nasıl hazırlıyorsun?", en: "How do you usually brew?", id: "Biasanya kamu menyeduh dengan apa?" },
        options: [
          { value: "filter", label: { tr: "V60, Chemex ya da filtre makinesi", en: "V60, Chemex or a filter machine", id: "V60, Chemex, atau mesin filter" } },
          { value: "espresso", label: { tr: "Espresso makinesi", en: "Espresso machine", id: "Mesin espresso" } },
          { value: "turkish", label: { tr: "Türk kahvesi ya da moka pot", en: "Turkish coffee or moka pot", id: "Kopi Turki atau moka pot" } },
          { value: "immersion", label: { tr: "French press ya da cold brew", en: "French press or cold brew", id: "French press atau cold brew" } },
        ],
      },
      {
        key: "milk",
        q: { tr: "Süt ekliyor musun?", en: "Do you add milk?", id: "Apakah kamu menambahkan susu?" },
        options: [
          { value: "no", label: { tr: "Hayır, sade içerim", en: "No, I drink it black", id: "Tidak, saya minum tanpa susu" } },
          { value: "sometimes", label: { tr: "Bazen", en: "Sometimes", id: "Kadang-kadang" } },
          { value: "yes", label: { tr: "Evet — latte, flat white, cortado", en: "Yes — latte, flat white, cortado", id: "Ya — latte, flat white, cortado" } },
        ],
      },
      {
        key: "taste",
        q: { tr: "Fincanda en çok neyi seversin?", en: "What do you love most in a cup?", id: "Apa yang paling kamu suka dalam secangkir kopi?" },
        options: [
          { value: "fruity", label: { tr: "Meyvemsi ve canlı", en: "Fruity and lively", id: "Fruity dan segar" } },
          { value: "chocolate", label: { tr: "Çikolata, karamel, tatlılık", en: "Chocolate, caramel, sweetness", id: "Cokelat, karamel, manis" } },
          { value: "floral", label: { tr: "Çiçeksi ve narenciye", en: "Floral and citrus", id: "Floral dan sitrus" } },
          { value: "spicy", label: { tr: "Gövdeli, baharatlı, kuruyemişli", en: "Full-bodied, spicy, nutty", id: "Body tebal, rempah, kacang" } },
        ],
      },
      {
        key: "intensity",
        q: { tr: "Ne kadar yoğun olsun?", en: "How intense do you like it?", id: "Seberapa kuat yang kamu suka?" },
        options: [
          { value: "light", label: { tr: "Hafif ve narin", en: "Light and delicate", id: "Ringan dan lembut" } },
          { value: "balanced", label: { tr: "Dengeli", en: "Balanced", id: "Seimbang" } },
          { value: "strong", label: { tr: "Güçlü ve dolgun", en: "Bold and full", id: "Kuat dan penuh" } },
        ],
      },
      {
        key: "adventure",
        q: { tr: "Ne kadar maceracısın?", en: "How adventurous are you?", id: "Seberapa suka bereksperimen?" },
        options: [
          { value: "classic", label: { tr: "Klasik, tanıdık tatlar", en: "Classic, familiar flavours", id: "Klasik, rasa yang familiar" } },
          { value: "curious", label: { tr: "Yeni kökenler denemeyi severim", en: "I like trying new origins", id: "Saya suka mencoba asal baru" } },
          { value: "wild", label: { tr: "Deneysel fermantasyonlar, sürpriz notalar", en: "Experimental ferments, surprising notes", id: "Fermentasi eksperimental, rasa kejutan" } },
        ],
      },
    ],
  },

  compare: {
    metaTitle: { tr: "Kahve Karşılaştırma — Tat Profili, Köken ve Fiyat", en: "Compare Coffees — Flavour, Origin and Price", id: "Bandingkan Kopi — Rasa, Asal, dan Harga" },
    metaDescription: {
      tr: "Flores kahvelerini yan yana karşılaştır: köken, işleme, kavrum, tat notaları, gövde, asidite, tatlılık ve fiyat.",
      en: "Compare Flores coffees side by side: origin, process, roast, tasting notes, body, acidity, sweetness and price.",
      id: "Bandingkan kopi Flores berdampingan: asal, proses, sangrai, catatan rasa, body, keasaman, rasa manis, dan harga.",
    },
    eyebrow: { tr: "Karşılaştır", en: "Compare", id: "Bandingkan" },
    title: { a: { tr: "Yan yana ", en: "Side by side, ", id: "Berdampingan, " }, em: { tr: "tat.", en: "taste.", id: "rasa." } },
    intro: {
      tr: "En fazla üç kahve seç; kökenden kavruma, tat notalarından fiyata hepsini tek tabloda gör.",
      en: "Pick up to three coffees and see everything from origin and roast to tasting notes and price in one table.",
      id: "Pilih hingga tiga kopi dan lihat semuanya — asal, sangrai, catatan rasa, hingga harga — dalam satu tabel.",
    },
    pick: { tr: "Kahve seç", en: "Choose a coffee", id: "Pilih kopi" },
    slot: { tr: "{n}. kahve", en: "Coffee {n}", id: "Kopi {n}" },
    empty: { tr: "Karşılaştırmak için yukarıdan kahve seç.", en: "Choose coffees above to compare.", id: "Pilih kopi di atas untuk membandingkan." },
    rows: {
      origin: { tr: "Köken", en: "Origin", id: "Asal" },
      region: { tr: "Bölge", en: "Region", id: "Wilayah" },
      process: { tr: "İşleme", en: "Process", id: "Proses" },
      roast: { tr: "Kavrum", en: "Roast", id: "Sangrai" },
      notes: { tr: "Tat notaları", en: "Tasting notes", id: "Catatan rasa" },
      body: { tr: "Gövde", en: "Body", id: "Body" },
      acidity: { tr: "Asidite", en: "Acidity", id: "Keasaman" },
      sweetness: { tr: "Tatlılık", en: "Sweetness", id: "Rasa manis" },
      brew: { tr: "Önerilen demleme", en: "Recommended brew", id: "Seduhan yang disarankan" },
      price: { tr: "Fiyat", en: "Price", id: "Harga" },
    },
    from: { tr: "{price}'den", en: "from {price}", id: "mulai {price}" },
    soldOut: { tr: "Tükendi", en: "Sold out", id: "Habis" },
    view: { tr: "İncele", en: "View", id: "Lihat" },
    remove: { tr: "Kaldır", en: "Remove", id: "Hapus" },
  },

  wheel: {
    metaTitle: { tr: "Kahve Tat Çarkı — Sevdiğin Notaya Göre Kahve Bul", en: "Coffee Flavour Wheel — Find Coffee by Tasting Note", id: "Roda Rasa Kopi — Temukan Kopi dari Catatan Rasa" },
    metaDescription: {
      tr: "Meyvemsi, narenciye, çiçeksi, çikolata, karamel, kuruyemiş ve baharat: tat çarkından bir notaya dokun, o notayı taşıyan Flores kahvelerini gör.",
      en: "Fruity, citrus, floral, chocolate, caramel, nutty and spice: tap a flavour on the wheel to see the Flores coffees that carry it.",
      id: "Buah, sitrus, floral, cokelat, karamel, kacang, dan rempah: sentuh rasa di roda untuk melihat kopi Flores yang memilikinya.",
    },
    eyebrow: { tr: "Tat çarkı", en: "Flavour wheel", id: "Roda rasa" },
    title: { a: { tr: "Önce tadı seç, ", en: "Choose the flavour, ", id: "Pilih rasanya, " }, em: { tr: "sonra kahveyi.", en: "then the coffee.", id: "lalu kopinya." } },
    intro: {
      tr: "Tat notaları kahveye eklenen aromalar değil; tadımcıların fincanda bulduğu benzerliklerdir. Çarktan bir tat ailesine dokun.",
      en: "Tasting notes aren't added flavourings — they're what tasters find in the cup. Tap a flavour family on the wheel.",
      id: "Catatan rasa bukan perisa tambahan — itu yang ditemukan pencicip di cangkir. Sentuh satu keluarga rasa di roda.",
    },
    pickHint: { tr: "Çarktan bir tat seç", en: "Pick a flavour on the wheel", id: "Pilih rasa di roda" },
    count: { tr: "{n} kahve", en: "{n} coffees", id: "{n} kopi" },
    none: { tr: "Şu an bu tat ailesinde kahvemiz yok.", en: "No coffees in this flavour family right now.", id: "Belum ada kopi di keluarga rasa ini." },
    groups: {
      fruity: { label: { tr: "Meyvemsi", en: "Fruity", id: "Buah" }, text: { tr: "Kırmızı meyve, orman meyvesi, şeftali, karpuz.", en: "Red fruit, forest berries, peach, watermelon.", id: "Buah merah, beri hutan, persik, semangka." } },
      citrus: { label: { tr: "Narenciye", en: "Citrus", id: "Sitrus" }, text: { tr: "Bergamot, kan portakalı, misket limonu.", en: "Bergamot, blood orange, lime.", id: "Bergamot, jeruk darah, jeruk nipis." } },
      floral: { label: { tr: "Çiçeksi", en: "Floral", id: "Floral" }, text: { tr: "Çiçeksi, ferah, nane.", en: "Floral, fresh, mint.", id: "Floral, segar, mint." } },
      chocolate: { label: { tr: "Çikolata", en: "Chocolate", id: "Cokelat" }, text: { tr: "Kakao, sütlü ve bitter çikolata.", en: "Cacao, milk and dark chocolate.", id: "Kakao, cokelat susu dan hitam." } },
      caramel: { label: { tr: "Karamel", en: "Caramel", id: "Karamel" }, text: { tr: "Karamel, esmer şeker.", en: "Caramel, brown sugar.", id: "Karamel, gula merah." } },
      nutty: { label: { tr: "Kuruyemiş & Baharat", en: "Nutty & Spice", id: "Kacang & Rempah" }, text: { tr: "Fındık, badem, tarçın, baharat.", en: "Hazelnut, almond, cinnamon, spice.", id: "Hazelnut, almond, kayu manis, rempah." } },
    },
  },

  map: {
    metaTitle: { tr: "Kahve Köken Haritası — Çekirdeklerimiz Nereden Geliyor?", en: "Coffee Origin Map — Where Our Beans Come From", id: "Peta Asal Kopi — Dari Mana Biji Kami Berasal" },
    metaDescription: {
      tr: "Endonezya Java, Etiyopya Sidamo ve Sidama, Kolombiya, El Salvador ve Meksika: Flores kahvelerinin kökenlerini haritada keşfet.",
      en: "Java in Indonesia, Sidamo and Sidama in Ethiopia, Colombia, El Salvador and Mexico: explore where Flores coffees come from.",
      id: "Jawa di Indonesia, Sidamo dan Sidama di Etiopia, Kolombia, El Salvador, dan Meksiko: jelajahi asal kopi Flores.",
    },
    eyebrow: { tr: "Köken haritası", en: "Origin map", id: "Peta asal" },
    title: { a: { tr: "Kahve kuşağından ", en: "From the coffee belt ", id: "Dari sabuk kopi " }, em: { tr: "Eskişehir'e.", en: "to Eskişehir.", id: "ke Eskişehir." } },
    intro: {
      tr: "Her nokta bir köken. Dokun, o topraklardan gelen kahvelerimizi gör.",
      en: "Every dot is an origin. Tap one to see our coffees from that land.",
      id: "Setiap titik adalah asal. Sentuh untuk melihat kopi kami dari tanah itu.",
    },
    roastery: { tr: "Flores Roastery — Eskişehir'de kavruluyor", en: "Flores Roastery — roasted in Eskişehir", id: "Flores Roastery — disangrai di Eskişehir" },
    count: { tr: "{n} kahve", en: "{n} coffees", id: "{n} kopi" },
    pickHint: { tr: "Haritadan bir köken seç", en: "Pick an origin on the map", id: "Pilih asal di peta" },
    origins: {
      Endonezya: { name: { tr: "Endonezya", en: "Indonesia", id: "Indonesia" }, text: { tr: "Batı Java'nın volkanik yaylaları: Garut, Papandayan, Weninggalih.", en: "The volcanic highlands of West Java: Garut, Papandayan, Weninggalih.", id: "Dataran tinggi vulkanik Jawa Barat: Garut, Papandayan, Weninggalih." } },
      Etiyopya: { name: { tr: "Etiyopya", en: "Ethiopia", id: "Etiopia" }, text: { tr: "Kahvenin anavatanı: Sidamo ve Sidama'nın yüksek köyleri.", en: "The birthplace of coffee: the high villages of Sidamo and Sidama.", id: "Tanah kelahiran kopi: desa-desa tinggi Sidamo dan Sidama." } },
      Kolombiya: { name: { tr: "Kolombiya", en: "Colombia", id: "Kolombia" }, text: { tr: "Quindío'nun kahve bölgesinden deneysel lotlar.", en: "Experimental lots from the coffee region of Quindío.", id: "Lot eksperimental dari wilayah kopi Quindío." } },
      "El Salvador": { name: { tr: "El Salvador", en: "El Salvador", id: "El Salvador" }, text: { tr: "Santa Ana volkanının yamaçlarında aile çiftlikleri.", en: "Family farms on the slopes of the Santa Ana volcano.", id: "Kebun keluarga di lereng gunung api Santa Ana." } },
      Meksika: { name: { tr: "Meksika", en: "Mexico", id: "Meksiko" }, text: { tr: "Chiapas'ın Altura kahveleri.", en: "Altura coffees from Chiapas.", id: "Kopi Altura dari Chiapas." } },
    },
  },

  log: {
    title: { tr: "Demleme günlüğün", en: "Your brew log", id: "Jurnal seduhmu" },
    intro: {
      tr: "Hangi kahveyi hangi oranla demledin, nasıl buldun? Not al, en iyi fincanını tekrar yakala. Günlük yalnızca bu cihazda saklanır.",
      en: "Which coffee, what ratio, how was it? Take notes and repeat your best cup. The log stays on this device only.",
      id: "Kopi apa, rasio berapa, bagaimana rasanya? Catat dan ulangi cangkir terbaikmu. Jurnal hanya disimpan di perangkat ini.",
    },
    coffee: { tr: "Kahve", en: "Coffee", id: "Kopi" },
    other: { tr: "Başka bir kahve", en: "Another coffee", id: "Kopi lain" },
    method: { tr: "Yöntem", en: "Method", id: "Metode" },
    dose: { tr: "Kahve (g)", en: "Coffee (g)", id: "Kopi (g)" },
    water: { tr: "Su (g)", en: "Water (g)", id: "Air (g)" },
    time: { tr: "Süre (dk:sn)", en: "Time (m:ss)", id: "Waktu (m:dd)" },
    rating: { tr: "Puanın", en: "Your rating", id: "Nilaimu" },
    notes: { tr: "Notlar (öğütme, tat…)", en: "Notes (grind, taste…)", id: "Catatan (gilingan, rasa…)" },
    save: { tr: "Günlüğe ekle", en: "Add to log", id: "Tambah ke jurnal" },
    empty: { tr: "Henüz kayıt yok. İlk demlemeni ekle.", en: "No entries yet. Add your first brew.", id: "Belum ada catatan. Tambahkan seduhan pertamamu." },
    delete: { tr: "Sil", en: "Delete", id: "Hapus" },
    ratio: { tr: "Oran 1:{r}", en: "Ratio 1:{r}", id: "Rasio 1:{r}" },
    best: { tr: "En sevdiğin", en: "Your favourite", id: "Favoritmu" },
  },

  grinders: {
    title: { tr: "Değirmenine göre ayar", en: "Settings for your grinder", id: "Pengaturan sesuai grinder" },
    intro: {
      tr: "Popüler değirmenler için başlangıç ayarları (tık ya da kademe). Her değirmen ve çekirdek biraz farklıdır: Bu sayılarla başla, tadına göre bir iki tık ince ya da kalın ayarla.",
      en: "Starting points for popular grinders (clicks or steps). Every grinder and bean differs a little: start here, then go a click or two finer or coarser to taste.",
      id: "Titik awal untuk grinder populer (klik atau langkah). Setiap grinder dan biji sedikit berbeda: mulai dari sini, lalu sesuaikan satu dua klik lebih halus atau kasar.",
    },
    grinder: { tr: "Değirmen", en: "Grinder", id: "Grinder" },
    unit: { tr: "Birim", en: "Unit", id: "Satuan" },
    clicks: { tr: "tık", en: "clicks", id: "klik" },
    steps: { tr: "kademe", en: "steps", id: "langkah" },
    na: { tr: "uygun değil", en: "not suited", id: "tidak cocok" },
    methods: {
      turkish: { tr: "Türk kahvesi", en: "Turkish coffee", id: "Kopi Turki" },
      espresso: { tr: "Espresso", en: "Espresso", id: "Espresso" },
      moka: { tr: "Moka pot", en: "Moka pot", id: "Moka pot" },
      aeropress: { tr: "AeroPress", en: "AeroPress", id: "AeroPress" },
      v60: { tr: "V60", en: "V60", id: "V60" },
      chemex: { tr: "Chemex / makine", en: "Chemex / machine", id: "Chemex / mesin" },
      french: { tr: "French press", en: "French press", id: "French press" },
    },
    note: {
      tr: "Tık sayıları tamamen kapalı (sıfır) konumdan sayılır. Türk kahvesi için pudra inceliği gerekir; çoğu ev değirmeni bunu tam veremez — sipariş verirken \"Türk Kahvesi\" öğütmesini seçebilirsin.",
      en: "Clicks are counted from fully closed (zero). Turkish coffee needs a powder-fine grind that most home grinders can't quite reach — choose the \"Turkish Coffee\" grind when you order.",
      id: "Klik dihitung dari posisi tertutup penuh (nol). Kopi Turki butuh gilingan sehalus bedak yang sulit dicapai grinder rumahan — pilih gilingan \"Kopi Turki\" saat memesan.",
    },
  },

  pwa: {
    install: { tr: "Zamanlayıcıyı telefona ekle", en: "Add the timer to your phone", id: "Tambahkan timer ke ponsel" },
    installText: {
      tr: "Demleme rehberini ana ekranına ekle; uygulama gibi açılır, internet olmasa da çalışır.",
      en: "Add the brew guide to your home screen; it opens like an app and works offline.",
      id: "Tambahkan panduan seduh ke layar utama; terbuka seperti aplikasi dan bisa offline.",
    },
    iosHint: {
      tr: "iPhone'da: Paylaş düğmesi → \"Ana Ekrana Ekle\".",
      en: "On iPhone: Share button → \"Add to Home Screen\".",
      id: "Di iPhone: tombol Bagikan → \"Tambah ke Layar Utama\".",
    },
    installButton: { tr: "Ana ekrana ekle", en: "Add to home screen", id: "Tambah ke layar utama" },
  },
};
