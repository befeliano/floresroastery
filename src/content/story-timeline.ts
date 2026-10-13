/**
 * Hikayemiz sayfasındaki zaman çizelgesi.
 * Düzenlemek için: bölüm ekle/çıkar, metni değiştir. `year` boş bırakılırsa yalnızca `label` görünür.
 * Kesin yılı bilinmeyen bölümlere tarih yazmıyoruz — Bağır onaylayınca `year` alanına eklenebilir.
 * `photo`: src/lib/photos.ts içindeki fotoğraf anahtarı.
 */
import type { photos } from "@/lib/photos";

type L = { tr: string; en: string; id: string };

export type StoryChapter = {
  year?: string;
  label: L;
  title: L;
  text: L;
  photo: keyof typeof photos;
};

export const STORY_TIMELINE: StoryChapter[] = [
  {
    year: "2024",
    label: { tr: "Kuruluş", en: "Founded", id: "Berdiri" },
    title: { tr: "Kapımızı Eskişehir'de açtık", en: "We opened our doors in Eskişehir", id: "Kami membuka pintu di Eskişehir" },
    text: {
      tr: "Tepebaşı'nda bir kavurma atölyesi ve bir tezgâh. Tek bir inançla başladık: harika kahve sadece tadılmamalı, hissedilmelidir.",
      en: "A roasting workshop and a counter in Tepebaşı. We started with one belief: great coffee shouldn't only be tasted, it should be felt.",
      id: "Sebuah workshop sangrai dan meja bar di Tepebaşı. Kami memulai dengan satu keyakinan: kopi hebat tak hanya dicicipi, tetapi dirasakan.",
    },
    photo: "coffeeShelf",
  },
  {
    label: { tr: "Kavrum", en: "Roasting", id: "Sangrai" },
    title: { tr: "Kuban kavurucuda, haftalık", en: "Weekly, on our Kuban roaster", id: "Mingguan, dengan mesin Kuban" },
    text: {
      tr: "Her kahveyi kendi karakterine göre profilliyoruz. Raf stoğu yok: paketin üzerindeki tarih, kahvenizin kavrulduğu gün.",
      en: "We profile every coffee to its own character. No shelf stock: the date on the bag is the day your coffee was roasted.",
      id: "Setiap kopi kami profilkan sesuai karakternya. Tanpa stok lama: tanggal di kemasan adalah hari kopi Anda disangrai.",
    },
    photo: "roastery",
  },
  {
    label: { tr: "Kaynak", en: "Origin", id: "Asal" },
    title: { tr: "Garut'ta bir el sıkışma", en: "A handshake in Garut", id: "Jabat tangan di Garut" },
    text: {
      tr: "Batı Java'da, Papandayan Yanardağı'nın eteklerindeki üreticilerle tanıştık. Ruso Exotics serisi böyle doğdu: aracısız, doğrudan ticaret.",
      en: "We met producers on the foothills of Mount Papandayan in West Java. That's how the Ruso Exotics series was born: direct trade, no middlemen.",
      id: "Kami bertemu para produsen di kaki Gunung Papandayan, Jawa Barat. Dari situlah seri Ruso Exotics lahir: direct trade, tanpa perantara.",
    },
    photo: "cherriesHands",
  },
  {
    label: { tr: "Coffee Bar", en: "Coffee Bar", id: "Coffee Bar" },
    title: { tr: "Tadım tezgâhı", en: "The tasting counter", id: "Meja cicip" },
    text: {
      tr: "Atölyenin yanında bir deneyim barı: espresso, manuel demleme ve randevulu tadım seansları. Çekirdek almadan önce tatmak ücretsiz.",
      en: "An experience bar beside the roastery: espresso, manual brewing and booked tasting sessions. Tasting before you buy beans is free.",
      id: "Experience bar di samping roastery: espresso, seduh manual, dan sesi cicip dengan reservasi. Mencicipi sebelum membeli biji gratis.",
    },
    photo: "espressoMachine",
  },
  {
    label: { tr: "Bugün", en: "Today", id: "Hari ini" },
    title: { tr: "Kutudan fincana, Türkiye'nin her yerine", en: "From box to cup, all across Türkiye", id: "Dari kotak ke cangkir, ke seluruh Turki" },
    text: {
      tr: "Endonezya'dan El Salvador'a tek kökenliler, kendi harmanlarımız ve kafeler için toptan kavrum. Her kutuda kahvenin künyesi ve hikâyesi.",
      en: "Single origins from Indonesia to El Salvador, our own blends and wholesale roasting for cafés. Every box carries the coffee's profile and story.",
      id: "Single origin dari Indonesia hingga El Salvador, blend kami sendiri, dan sangrai grosir untuk kafe. Setiap kotak membawa profil dan cerita kopinya.",
    },
    photo: "boxesNature",
  },
];
