# Flores — Neyi nerede değiştiririm?

Bu rehber, kod bilgisi az olan biri için: hangi bilgi hangi dosyada, nasıl değiştirilir ve siteye nasıl yüklenir.

## 1. Üç ayrı parça var

| Parça | Adres | Ne işe yarar | Nasıl güncellenir |
|---|---|---|---|
| **WordPress / WooCommerce** | panel.floresroastery.com | Ürün, fiyat, stok, sipariş, kupon, Flores Ayarları | WordPress panelinden — **kod yok**, kaydedince site kendini günceller |
| **Ana site (Next.js)** | floresroastery.com | Müşterinin gördüğü site | Bu klasördeki dosyalar → derle → zip → Hostinger |
| **Randevu sitesi (PHP)** | randevu.floresroastery.com | Tadım randevusu + admin paneli | Hostinger Dosya Yöneticisi'nde dosyayı düzenle — derleme yok |

**Önce sor: Bu bilgi WordPress'te mi?** Fiyat, stok, indirim, yeni ürün, kupon, gramaj/süt fiyatı → hepsi WordPress'ten. Koda dokunmaya gerek yok.

## 2. Hızlı tablo — "şunu değiştirmek istiyorum"

| Değiştirmek istediğin | Nerede |
|---|---|
| Ürün fiyatı, indirim, stok, paket boyu | WordPress → Ürünler (kaydet; site birkaç saniyede güncellenir) |
| Yeni ürün ekleme | WordPress'te yayınla → site otomatik ekler. Özel hikâye/künye istenirse: `src/lib/commerce/catalog.ts` |
| Kupon | WordPress → Pazarlama → Kuponlar |
| Fincan maliyeti (gram, süt fiyatı) | WordPress → **Flores Ayarları** |
| Sipariş durumu, kargo | WordPress → Siparişler ("Kargolandı" yapınca müşteriye e-posta gider) |
| Kahvenin hikâyesi, tat notaları, künye, demleme tarifi | `src/lib/commerce/catalog.ts` (Türkçe) + `src/i18n/messages/products.ts` (İngilizce/Endonezce) |
| Adres, telefon, e-posta, WhatsApp, Instagram | `src/lib/site.ts` |
| Coffee Bar günleri, saatleri, kampanya yazısı | `src/lib/site.ts` → `coffeeBar` (kampanyayı kaldırmak için `promo: null`) |
| Kargo ücreti / ücretsiz kargo sınırı | `src/lib/site.ts` → `shipping` (**WordPress'teki kargo ayarıyla aynı olmalı**) |
| **Coffee Bar menüsü, fiyatlar, Brew Bar kuralları** | `src/content/coffee-bar.ts` (ana site) **ve** randevu sitesinde `menu.php` |
| PDF menü | `public/menu/flores-coffee-bar-menu.pdf` dosyasını aynı adla değiştir |
| Sayfa yazıları (başlıklar, paragraflar) | `src/i18n/messages/pages.ts` |
| Buton, sepet, ödeme yazıları | `src/i18n/messages/ui.ts` |
| Ana sayfa "Sıkça sorulanlar" | `src/components/home/home-faq.tsx` |
| Blog / rehber yazıları | `src/content/seo/guides.ts` ve `guides-more.ts` |
| Şehir sayfaları (İstanbul, Ankara…) | `src/content/seo/cities.ts` |
| KVKK, mesafeli satış vb. yasal metinler | `src/content/legal/` |
| Toptan kg fiyatları | `src/lib/commerce/wholesale.ts` (WordPress'teki toptan fiyatlarla aynı tut) |
| Değirmen ayar tablosu | `src/components/brew/grinder-guide.tsx` |
| Kahve bulucu, tat çarkı, harita yazıları | `src/i18n/messages/tools.ts` |
| Fotoğraflar | `public/photos/` (aynı adla değiştir) — açıklamaları `src/lib/photos.ts` |
| Kutu ön yüzü (3D kutu) | `public/coffees/<kahve>-face.webp` |
| Videolar | `public/video/` (`-1080.mp4`, `-720.mp4`, `-poster.jpg` üçlüsü) |

## 3. Yazılar üç dilde: `{ tr, en, id }`

Sitedeki çoğu metin şöyle yazılır:

```ts
promo: { tr: "Çekirdek almadan önce tadım ücretsiz", en: "Free tasting before you buy beans", id: "Cicip gratis sebelum membeli biji kopi" },
```

- Sadece tırnak içindeki metni değiştir; tırnakları, virgülleri ve süslü parantezleri silme.
- Metnin içinde `"` kullanman gerekirse `\"` yaz ya da `“ ”` (Türkçe tırnak) kullan.
- İngilizce/Endonezce bilmiyorsan Türkçeyi üçüne de yazabilirsin; site çalışır, sonra düzeltilir.
- `{name}`, `{n}`, `{price}` gibi süslü parantezli kelimeler yer tutucudur — **silme**, site oraya değeri koyar.

## 4. Ana sitede değişiklik → yükleme

1. Dosyayı düzenle (VS Code önerilir) ve kaydet.
2. Kontrol et — proje klasöründe terminal aç:
   ```bash
   export PATH="/d/tools/node:$PATH"
   ```
   ```bash
   npm run build
   ```
   Sonunda `✓ Generating static pages` görürsen sorun yok. Kırmızı **error** çıkarsa yazdığın dosya ve satır numarası söylenir; çoğunlukla unutulmuş bir tırnak ya da virgüldür.
3. Kaydet ve paketle:
   ```bash
   git add -A src public && git commit -m "Ne değiştirdiğini yaz"
   ```
   ```bash
   git archive --format=zip -o flores-roastery.zip HEAD
   ```
4. Hostinger → floresroastery.com (Node.js) → dosyaları yükle → zip'i yükle → **deploy**.

İstersen bu adımları Claude'a yaptırabilirsin: "şu yazıyı şöyle değiştir, derle, zip'le" demen yeter.

## 5. Randevu sitesinde değişiklik

Hostinger → randevu.floresroastery.com → **Dosya Yöneticisi**. Derleme yok; kaydettiğin an canlıdadır.

| Değiştirmek istediğin | Dosya |
|---|---|
| Menü, fiyatlar, Brew Bar kuralları, tadım ücreti açıklaması | `menu.php` |
| Admin şifresi, e-posta (Resend) ayarları | `config.php` (**şifreleri kimseyle paylaşma**) |
| Slot başına kişi sayısı, açık günler | `lib.php` en üstte: `FLORES_CAPACITY`, `FLORES_OPEN_DAYS` (0=Pazar, 3=Çarşamba…) |
| Randevu saatleri (13:00–19:00) | `lib.php` → `flores_slot_times()` içindeki `13` ve `19` |
| Sayfadaki başlık, tanıtım yazısı, adres | `index.php` (`fr-hero` bölümü) |
| Renk, yazı tipi, görünüm | `assets/premium.css` |

Düzenlemeden önce dosyanın bir kopyasını indir; bir şey bozulursa geri yüklersin. Bilgisayardaki kopyalar: `randevu_public_html/` (GitHub'a gitmez, içinde şifreler var).

## 6. Dokunma / dikkat

- **Şifreler ve anahtarlar** (iyzico, WooCommerce, REVALIDATE_SECRET, randevu `config.php`) yalnızca Hostinger ortam değişkenlerinde, WordPress snippet'inde ve sunucudaki `config.php`'de durur. Koda, sohbete, GitHub'a yazma.
- `src/lib/payments/`, `src/app/api/checkout/`, `src/lib/orders/` → ödeme ve sipariş. Burada değişiklik yaptıysan yüklemeden önce mutlaka test ettir.
- Hostinger ortam değişkenleri: `NEXT_PUBLIC_SITE_URL=https://floresroastery.com`, `WOOCOMMERCE_URL=https://panel.floresroastery.com`, `IYZICO_*`, `WOOCOMMERCE_CONSUMER_*`, `REVALIDATE_SECRET`, `SESSION_SECRET`. Değiştirince **yeniden deploy** gerekir.
- WordPress snippet'i (`docs/wordpress-snippet.php`): fiyat güncelleme sinyali, giriş köprüsü, Flores Ayarları ve "kargolandı" e-postası buradadır. Snippet'i değiştirirken `FLORES_STOREFRONT` ve `FLORES_REVALIDATE_SECRET` satırlarını koru.

## 7. Bir şey ters giderse

| Belirti | Bak |
|---|---|
| WordPress'te değiştirdiğim fiyat sitede değişmedi | Snippet aktif mi, `FLORES_STOREFRONT` doğru mu? Değilse en geç 1 saat içinde kendiliğinden güncellenir |
| Sitede sipariş verilemiyor | Hostinger'da `WOOCOMMERCE_URL` ve anahtarlar; panel.floresroastery.com açılıyor mu? |
| Kartla ödemede sorun | `IYZICO_*` değişkenleri; iyzico panelinde hesap durumu |
| Yüklemeden sonra site açılmıyor | Hostinger → Node.js → deploy günlüğü (build log); bir önceki zip'i tekrar yükle |
| Randevu sayfası beyaz/boş | Son düzenlediğin PHP dosyasını yedeğiyle değiştir (genelde eksik tırnak/virgül) |
