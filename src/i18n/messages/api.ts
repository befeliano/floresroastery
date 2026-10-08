import type { Locale } from "../config";

/**
 * API yanıtlarındaki Türkçe mesajların çevirileri. Sunucu Türkçe yanıt verir;
 * istemci, seçili dile göre bu tablodan çevirir (yalnızca o dilin tablosu gönderilir).
 * Yeni bir API mesajı eklerseniz buraya da ekleyin; eşleşmeyen mesaj Türkçe gösterilir.
 */
type T = { en: string; id: string };

const EXACT: Record<string, T> = {
  // genel / güvenlik
  "Geçersiz istek kaynağı.": { en: "Invalid request origin.", id: "Asal permintaan tidak valid." },
  "İstek biçimi desteklenmiyor.": { en: "Unsupported request format.", id: "Format permintaan tidak didukung." },
  "İstek çok büyük.": { en: "The request is too large.", id: "Permintaan terlalu besar." },
  "Geçersiz veri.": { en: "Invalid data.", id: "Data tidak valid." },
  "Lütfen işaretli alanları kontrol edin.": { en: "Please check the highlighted fields.", id: "Periksa kembali kolom yang ditandai." },
  "Lütfen geçerli bir e-posta adresi girin.": { en: "Please enter a valid email address.", id: "Masukkan alamat email yang valid." },
  "Geçerli bir e-posta adresi girin.": { en: "Enter a valid email address.", id: "Masukkan alamat email yang valid." },
  "Devam etmek için KVKK aydınlatma metnini onaylayın.": { en: "Please accept the privacy notice (KVKK) to continue.", id: "Setujui pemberitahuan privasi (KVKK) untuk melanjutkan." },
  "Devam etmek için KVKK Aydınlatma Metni'ni onaylayın.": { en: "Please accept the privacy notice (KVKK) to continue.", id: "Setujui pemberitahuan privasi (KVKK) untuk melanjutkan." },
  "Bir sorun oluştu.": { en: "Something went wrong.", id: "Terjadi kesalahan." },

  // ödeme / sipariş
  "Adınızı yazın.": { en: "Enter your first name.", id: "Isi nama depan Anda." },
  "Soyadınızı yazın.": { en: "Enter your last name.", id: "Isi nama belakang Anda." },
  "05XX XXX XX XX biçiminde bir cep telefonu girin.": { en: "Enter a Turkish mobile number in the format 05XX XXX XX XX.", id: "Masukkan nomor ponsel Turki dengan format 05XX XXX XX XX." },
  "İl seçin.": { en: "Select a province.", id: "Pilih provinsi." },
  "İlçe yazın.": { en: "Enter a district.", id: "Isi kecamatan." },
  "Açık adresinizi yazın (mahalle, sokak, no, daire).": { en: "Enter your full address (neighbourhood, street, number, flat).", id: "Isi alamat lengkap (kelurahan, jalan, nomor, unit)." },
  "Siparişi tamamlamak için Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi'ni onaylamanız gerekir.": {
    en: "You need to accept the Pre-Information Form and the Distance Sales Agreement to complete your order.",
    id: "Anda perlu menyetujui Formulir Informasi Awal dan Perjanjian Penjualan Jarak Jauh untuk menyelesaikan pesanan.",
  },
  "Lütfen bir ödeme yöntemi seçin.": { en: "Please choose a payment method.", id: "Pilih metode pembayaran." },
  "Kartla ödeme şu an kullanılamıyor. Havale / EFT ile siparişinizi tamamlayabilirsiniz.": {
    en: "Card payment is unavailable right now. You can complete your order by bank transfer.",
    id: "Pembayaran kartu sedang tidak tersedia. Anda dapat menyelesaikan pesanan dengan transfer bank.",
  },
  "Sepetiniz boş.": { en: "Your cart is empty.", id: "Keranjang Anda kosong." },
  "Sepette çok fazla satır var.": { en: "There are too many lines in your cart.", id: "Terlalu banyak baris di keranjang." },
  "Sepetinizdeki bir ürün artık satışta değil.": { en: "An item in your cart is no longer for sale.", id: "Salah satu produk di keranjang sudah tidak dijual." },
  "Siparişiniz şu an oluşturulamadı. Lütfen birkaç dakika sonra tekrar deneyin.": {
    en: "Your order couldn't be placed right now. Please try again in a few minutes.",
    id: "Pesanan Anda belum dapat dibuat. Coba lagi dalam beberapa menit.",
  },
  "Mağaza sistemimiz geç yanıt verdi. Siparişiniz oluşmuş olabilir — tekrar denemeden önce e-postanızı kontrol edin ya da bize WhatsApp'tan yazın.": {
    en: "Our store system responded slowly. Your order may have been placed — check your email before trying again, or message us on WhatsApp.",
    id: "Sistem toko kami lambat merespons. Pesanan Anda mungkin sudah dibuat — periksa email sebelum mencoba lagi, atau hubungi kami via WhatsApp.",
  },
  "Bu bilgilerle eşleşen bir sipariş bulamadık. Sipariş numaranızı ve e-posta adresinizi kontrol edin.": {
    en: "We couldn't find an order matching these details. Please check your order number and email address.",
    id: "Kami tidak menemukan pesanan yang cocok. Periksa nomor pesanan dan alamat email Anda.",
  },
  "Sipariş bilgisi şu an alınamadı, lütfen biraz sonra tekrar deneyin.": { en: "Order details couldn't be retrieved right now, please try again shortly.", id: "Detail pesanan belum dapat diambil, coba lagi sebentar lagi." },

  // toptan
  "Toptan sipariş bilgisi geçersiz.": { en: "The wholesale order details are invalid.", id: "Detail pesanan grosir tidak valid." },
  "Kavurma seçimi geçersiz.": { en: "Invalid roast selection.", id: "Pilihan sangrai tidak valid." },
  "Paket boyu geçersiz.": { en: "Invalid bag size.", id: "Ukuran kemasan tidak valid." },
  "Ambalaj türü geçersiz.": { en: "Invalid packaging type.", id: "Jenis kemasan tidak valid." },
  "Öğütme seçimi geçersiz.": { en: "Invalid grind selection.", id: "Pilihan gilingan tidak valid." },
  "Çekirdek miktarı geçersiz.": { en: "Invalid bean quantity.", id: "Jumlah biji tidak valid." },
  "Toptan siparişte en az 5 kg seçmelisiniz.": { en: "Wholesale orders need at least 5 kg.", id: "Pesanan grosir minimal 5 kg." },
  "Online toptan sipariş en fazla 500 kg olabilir.": { en: "Online wholesale orders are limited to 500 kg.", id: "Pesanan grosir online maksimal 500 kg." },
  "Toptan sipariş için adet 1–20 arasında olmalı.": { en: "Wholesale quantity must be between 1 and 20.", id: "Jumlah grosir harus antara 1–20." },

  // kupon
  "Kupon kodu geçersiz.": { en: "Invalid coupon code.", id: "Kode kupon tidak valid." },
  "Kupon doğrulama şu an kullanılamıyor.": { en: "Coupon validation is unavailable right now.", id: "Validasi kupon sedang tidak tersedia." },
  "Kupon şu an doğrulanamadı, lütfen tekrar deneyin.": { en: "The coupon couldn't be validated, please try again.", id: "Kupon belum dapat divalidasi, coba lagi." },
  "Bu kupon kodu bulunamadı.": { en: "This coupon code wasn't found.", id: "Kode kupon tidak ditemukan." },
  "Bu kuponun süresi dolmuş.": { en: "This coupon has expired.", id: "Kupon ini sudah kedaluwarsa." },
  "Bu kuponun kullanım limiti dolmuş.": { en: "This coupon has reached its usage limit.", id: "Kupon ini sudah mencapai batas pemakaian." },
  "Bu kupon yalnızca belirli ürünlerde geçerli; sepetinize uygulanamıyor.": {
    en: "This coupon is only valid for certain products and can't be applied to your cart.",
    id: "Kupon ini hanya berlaku untuk produk tertentu dan tidak bisa dipakai di keranjang Anda.",
  },

  // üyelik
  "E-posta adresi veya şifre hatalı.": { en: "Incorrect email or password.", id: "Email atau kata sandi salah." },
  "Üyelik sistemi şu an kullanılamıyor. Misafir olarak sipariş verebilirsiniz.": {
    en: "Accounts are unavailable right now. You can still order as a guest.",
    id: "Sistem akun sedang tidak tersedia. Anda tetap bisa memesan sebagai tamu.",
  },
  "Giriş şu an yapılamıyor, lütfen biraz sonra tekrar deneyin.": { en: "Sign-in isn't possible right now, please try again shortly.", id: "Belum bisa masuk saat ini, coba lagi sebentar lagi." },
  "Bu e-posta adresiyle bir hesap zaten var. Giriş yapın ya da şifrenizi sıfırlayın.": {
    en: "An account with this email already exists. Sign in or reset your password.",
    id: "Akun dengan email ini sudah ada. Silakan masuk atau atur ulang kata sandi.",
  },
  "Hesap oluşturulamadı, bilgilerinizi kontrol edin.": { en: "The account couldn't be created — please check your details.", id: "Akun tidak dapat dibuat, periksa data Anda." },
  "Hesap şu an oluşturulamadı, lütfen biraz sonra tekrar deneyin.": { en: "The account couldn't be created right now, please try again shortly.", id: "Akun belum dapat dibuat, coba lagi sebentar lagi." },
  "Şifre en az 8 karakter olmalı.": { en: "The password must be at least 8 characters.", id: "Kata sandi minimal 8 karakter." },
  "E-posta adresinizi yazın.": { en: "Enter your email address.", id: "Isi alamat email Anda." },
  "Şifre sıfırlama şu an kullanılamıyor.": { en: "Password reset is unavailable right now.", id: "Reset kata sandi sedang tidak tersedia." },
  "Şifre sıfırlama e-postası şu an gönderilemedi, lütfen biraz sonra tekrar deneyin.": {
    en: "The password reset email couldn't be sent right now, please try again shortly.",
    id: "Email reset kata sandi belum dapat dikirim, coba lagi sebentar lagi.",
  },
  "Bu adresle kayıtlı bir hesap varsa şifre sıfırlama bağlantısını e-postanıza gönderdik.": {
    en: "If an account exists for this address, we've sent a password reset link to your email.",
    id: "Jika ada akun dengan alamat ini, kami telah mengirim tautan reset kata sandi ke email Anda.",
  },

  // formlar
  "Lütfen adınızı yazın.": { en: "Please enter your name.", id: "Isi nama Anda." },
  "Lütfen adınızı ve soyadınızı yazın.": { en: "Please enter your full name.", id: "Isi nama lengkap Anda." },
  "Mesajınız en az 10 karakter olmalı.": { en: "Your message must be at least 10 characters.", id: "Pesan minimal 10 karakter." },
  "Mesajınız bize ulaştı. En kısa sürede dönüş yapacağız.": { en: "Your message has reached us. We'll get back to you as soon as possible.", id: "Pesan Anda sudah kami terima. Kami akan segera membalas." },
  "Mesajınız alındı.": { en: "Your message has been received.", id: "Pesan Anda diterima." },
  "Teşekkürler! Bahçemize hoş geldiniz.": { en: "Thank you! Welcome to our garden.", id: "Terima kasih! Selamat datang di kebun kami." },
  "Ürün bulunamadı.": { en: "Product not found.", id: "Produk tidak ditemukan." },
  "Lütfen sipariş numaranızı yazın.": { en: "Please enter your order number.", id: "Isi nomor pesanan Anda." },
  "Lütfen bir iade nedeni seçin.": { en: "Please choose a reason for the return.", id: "Pilih alasan pengembalian." },
  "Telefon numarası 05XX XXX XX XX biçiminde olmalı.": { en: "The phone number must be in the format 05XX XXX XX XX.", id: "Nomor telepon harus berformat 05XX XXX XX XX." },
  "Lütfen işletme adınızı yazın.": { en: "Please enter your business name.", id: "Isi nama bisnis Anda." },
  "Talebiniz alındı.": { en: "Your request has been received.", id: "Permintaan Anda diterima." },
  "24 saat içinde işletmenize özel teklifi hazırlayıp size ulaşacağız.": { en: "We'll prepare a quote tailored to your business and get back to you within 24 hours.", id: "Kami akan menyiapkan penawaran khusus untuk bisnis Anda dan menghubungi Anda dalam 24 jam." },

  // kargo seçenekleri
  "Eskişehir içi ücretsiz kurye": { en: "Free courier within Eskişehir", id: "Kurir gratis dalam kota Eskişehir" },
  "Bedava kargo": { en: "Free shipping", id: "Gratis ongkir" },
  "Kargo — sabit ücret": { en: "Shipping — flat rate", id: "Pengiriman — tarif tetap" },
  "Mağazadan teslim al": { en: "Pick up in store", id: "Ambil di toko" },
  Kargo: { en: "Shipping", id: "Pengiriman" },
};

/** Değişken içeren mesajlar — $1, $2 yakalanan parçalar */
const PATTERNS: { re: string; en: string; id: string }[] = [
  { re: "^Çok fazla deneme yaptınız\\. Lütfen (\\d+) dakika sonra tekrar deneyin\\.$", en: "Too many attempts. Please try again in $1 minutes.", id: "Terlalu banyak percobaan. Coba lagi dalam $1 menit." },
  { re: "^(.+) şu an stokta yok\\.$", en: "$1 is out of stock right now.", id: "$1 sedang habis." },
  { re: "^(.+) için geçersiz öğütme seçimi\\.$", en: "Invalid grind option for $1.", id: "Pilihan gilingan tidak valid untuk $1." },
  { re: "^(.+) için adet 1–20 arasında olmalı\\.$", en: "Quantity for $1 must be between 1 and 20.", id: "Jumlah untuk $1 harus antara 1–20." },
  { re: "^Bu kupon ([\\d.,]+)₺ ve üzeri sepetlerde geçerli\\.$", en: "This coupon is valid for carts of ₺$1 or more.", id: "Kupon ini berlaku untuk keranjang mulai ₺$1." },
  { re: "^Bu kupon ([\\d.,]+)₺ ve altı sepetlerde geçerli\\.$", en: "This coupon is valid for carts up to ₺$1.", id: "Kupon ini berlaku untuk keranjang hingga ₺$1." },
  { re: "^%(\\d+) indirim \\+ ücretsiz kargo$", en: "$1% off + free shipping", id: "Hemat $1% + gratis ongkir" },
  { re: "^%(\\d+) indirim$", en: "$1% off", id: "Hemat $1%" },
  { re: "^([\\d.,]+)₺ indirim \\+ ücretsiz kargo$", en: "₺$1 off + free shipping", id: "Hemat ₺$1 + gratis ongkir" },
  { re: "^([\\d.,]+)₺ indirim$", en: "₺$1 off", id: "Hemat ₺$1" },
  { re: "^Siparişiniz \\(#(\\w+)\\) alındı ancak ödeme sayfası açılamadı\\. Lütfen bizimle iletişime geçin\\.$", en: "Your order (#$1) was received but the payment page couldn't be opened. Please contact us.", id: "Pesanan Anda (#$1) diterima, tetapi halaman pembayaran tidak dapat dibuka. Silakan hubungi kami." },
  { re: "^(.+) tekrar stoğa girdiğinde size haber vereceğiz\\.$", en: "We'll let you know when $1 is back in stock.", id: "Kami akan mengabari Anda saat $1 tersedia kembali." },
  {
    re: "^Talebiniz alındı\\. Takip numaranız: (\\S+)\\. Bildiriminiz bize ulaştığı tarihten itibaren yasal süreler içinde dönüş yapacağız\\.$",
    en: "Your request has been received. Your reference number is $1. We'll respond within the legal time limits from the date we receive your notice.",
    id: "Permintaan Anda diterima. Nomor referensi Anda: $1. Kami akan merespons dalam batas waktu hukum sejak pemberitahuan Anda kami terima.",
  },
  // kargo açıklamaları
  { re: "^([\\d.,]+)₺ üzeri siparişlerde kargo bizden\\.$", en: "Shipping is on us for orders over ₺$1.", id: "Gratis ongkir untuk pesanan di atas ₺$1." },
  { re: "^Eskişehir dışı gönderimler\\. ([\\d.,]+)₺ üzeri ücretsiz\\.$", en: "Deliveries outside Eskişehir. Free over ₺$1.", id: "Pengiriman ke luar Eskişehir. Gratis di atas ₺$1." },
  { re: "^Eskişehir dışı gönderimler\\. ?$", en: "Deliveries outside Eskişehir.", id: "Pengiriman ke luar Eskişehir." },
  {
    re: "^Kendi kuryemizle aynı gün teslimat\\. .*$",
    en: "Same-day delivery by our own courier. Deliveries go out on weekdays (Mon–Fri) at 16:00; orders placed after 14:00 are delivered the next working day.",
    id: "Pengiriman di hari yang sama oleh kurir kami. Pengiriman pada hari kerja (Senin–Jumat) pukul 16:00; pesanan setelah pukul 14:00 dikirim hari kerja berikutnya.",
  },
  { re: "^(.+) — siparişiniz hazır olunca haber veririz\\.$", en: "$1 — we'll let you know when your order is ready.", id: "$1 — kami kabari saat pesanan Anda siap." },
];

export type ApiTable = { exact: Record<string, string>; patterns: { re: string; out: string }[] };

/** Seçili dilin tablosu (Türkçe için boş) — layout'ta bir kez hazırlanıp istemciye gönderilir */
export function apiTable(locale: Locale): ApiTable {
  if (locale === "tr") return { exact: {}, patterns: [] };
  return {
    exact: Object.fromEntries(Object.entries(EXACT).map(([k, v]) => [k, v[locale]])),
    patterns: PATTERNS.map((p) => ({ re: p.re, out: p[locale] })),
  };
}

export function translateWith(table: ApiTable | null, msg: string | null | undefined): string {
  if (!msg || !table) return msg ?? "";
  const hit = table.exact[msg];
  if (hit) return hit;
  for (const p of table.patterns) {
    const re = new RegExp(p.re);
    if (re.test(msg)) return msg.replace(re, p.out);
  }
  return msg;
}
