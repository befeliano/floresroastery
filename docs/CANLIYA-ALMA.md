# Canlıya alma — Hostinger + WooCommerce + iyzico

## Mimari (headless)

```
 Müşteri ──► floresroastery.com  (Next.js — Hostinger Node.js uygulaması)
                 │  ürün fiyat/stok  ◄── Store API (herkese açık)
                 │  sipariş açma     ──► REST API (consumer key/secret)
                 ▼
            panel.floresroastery.com  (WordPress + WooCommerce — yönetim paneli)
                 │  siparişler, stok, kuponlar, e-postalar, raporlar, B2B konfigüratörü
                 ▼
            iyzico eklentisi (WordPress'te, zaten "Etkin")  ──► ödeme + webhook
```

- **WooCommerce bir WordPress eklentisidir**, WordPress dışında çalışmaz. WordPress yönetim paneli
  olarak kalır; yeni site ona API ile bağlanır. Ayrı bir admin paneli yazmanıza gerek yok:
  yeni siteden gelen siparişler WooCommerce → Siparişler'de (ve WooCommerce mobil uygulamasında) görünür,
  stok düşer, müşteriye WooCommerce e-postaları gider.
- **iyzico anahtarları yeni koda girilmez.** Kartla ödemede müşteri WooCommerce'in sipariş ödeme
  sayfasına yönlenir, ödemeyi WordPress'teki iyzico eklentisi alır (mevcut ayarlar ve webhook aynen).
- Havale/EFT siparişleri `on-hold` açılır; WooCommerce banka bilgisi e-postasını gönderir
  (WooCommerce → Ödemeler → Çevrimdışı → Doğrudan banka havalesi açık ve IBAN girili olmalı).

## Sıra (kesintisiz geçiş)

### 1. Yedek
hPanel → Web siteleri → floresroastery.com → **Yedekler** + WordPress'te All-in-One WP Migration ile dışa aktarım.

### 2. WooCommerce REST API anahtarı
WordPress → WooCommerce → Ayarlar → Gelişmiş → **REST API** → Anahtar ekle
- Açıklama: `Next.js site`, Kullanıcı: yönetici, İzinler: **Okuma/Yazma**
- Çıkan `ck_…` ve `cs_…` değerlerini yalnızca Hostinger ortam değişkenlerine girin (sohbete, koda, GitHub'a değil).

### 3. Snippet
`docs/wordpress-snippet.php` içeriğini WordPress → **Snippets** → Yeni ekle (Run everywhere).
Snippet şunları yapar: iyzico dönüşünü yeni siteye yönlendirir, kartlı siparişin ödeme sayfasında yalnızca
iyzico'yu gösterir, **üye girişini** (mevcut WordPress hesapları, aynı e-posta + şifre) ve şifre sıfırlamayı
sağlar, kartla ödeyen üyenin siparişini ödeme alınınca hesabına bağlar.

> REST API anahtarının kullanıcısı **Yönetici** (veya Mağaza yöneticisi) olmalı; giriş uç noktası buna bakar.

### 4. Next.js uygulamasını önce test alan adında kurun
1. hPanel → Web siteleri → **Web sitesi ekle → Node.js Web Uygulaması** → GitHub ile bağla → `befeliano/floresroastery`
2. Alan adı: geçici olarak `yeni.floresroastery.com`
3. Node sürümü **22**, derleme `npm run build`, başlatma `npm start`
4. Ortam değişkenleri (`.env.example`'daki adlarla):
   - `NEXT_PUBLIC_SITE_URL=https://yeni.floresroastery.com`
   - `WOOCOMMERCE_URL=https://floresroastery.com` (WordPress henüz ana alan adında)
   - `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`
   - `REVALIDATE_SECRET` (uzun rastgele bir değer)
5. Snippet'teki `FLORES_STOREFRONT` değerini geçici olarak `https://yeni.floresroastery.com` yapın.
6. Test: küçük bir kartlı sipariş (sonra iade) + bir Havale siparişi → WooCommerce → Siparişler'de görünmeli.

### 5. Alan adlarını değiştirin
1. WordPress'i `panel.floresroastery.com` alt alan adına taşıyın (hPanel → WordPress → alan adı değiştirme
   veya All-in-One WP Migration ile yeni alt alan adına içe aktarma). Taşıma sonrası:
   - iyzico üye işyeri panelindeki **webhook / callback URL**'ini yeni WordPress adresine güncelleyin
   - B2B sayfasındaki (b2b.floresroastery.com) "Sipariş Oluştur" bağlantısını `panel.floresroastery.com/olustur/` yapın
2. Node.js uygulamasının alan adını `floresroastery.com` yapın.
3. Ortam değişkenleri: `NEXT_PUBLIC_SITE_URL=https://floresroastery.com`, `WOOCOMMERCE_URL=https://panel.floresroastery.com`
4. Toptan "Sipariş oluştur" bağlantısı `WOOCOMMERCE_URL`'den otomatik türetilir (`…/olustur/`); yeniden derlemek yeterli.
5. Snippet'te `FLORES_STOREFRONT` = `https://floresroastery.com`.
6. Eski WordPress ürün adresleri (`/product/...`) yeni sitede otomatik 301 ile yönlenir (`next.config.ts`).

### 6. Önbellek yenileme
WooCommerce → Ayarlar → Gelişmiş → **Webhooks** → Ekle: Konu "Ürün güncellendi", Teslim URL'si
`https://floresroastery.com/api/revalidate?secret=REVALIDATE_SECRET`. (Webhook olmasa da fiyat/stok saatte bir yenilenir.)

## Notlar
- Ortam değişkeni değişince Hostinger'da **yeniden derleme** gerekir (ödeme sayfası derlemede oluşur).
- Rate limit bellek içidir; Hostinger'da tek örnek çalıştığı için yeterli.
- `_randevu/` ve `_b2b/` klasörleri GitHub'a gönderilmez (`.gitignore`). Randevu ve B2B kendi alt alan adlarında çalışmaya devam eder.
