# Canlıya alma — Hostinger + WooCommerce + iyzico

## Mimari

```
 Müşteri ──► floresroastery.com  (bu site — Next.js, Hostinger Node.js uygulaması, TR / EN / ID)
                 │  ürün adı/fiyat/stok/yeni ürün ◄── WordPress Store API (herkese açık)
                 │  sipariş, üyelik, kupon          ──► WordPress REST API (ck/cs anahtarı)
                 │  kartla ödeme                    ──► iyzico'nun kendi ödeme sayfası (doğrudan)
                 ▼
            panel.floresroastery.com  (WordPress + WooCommerce = YÖNETİM PANELİ)
                 siparişler, "kargolandı" işaretleme, ürün/fiyat/stok, kuponlar, raporlar, Flores Ayarları
```

- **Bağır her şeyi WordPress'ten yönetir.** Ürün adı, fiyatı, indirimi, stoğu, yeni ürün, kupon, gramaj/süt fiyatı
  (Flores Ayarları) — WordPress'te kaydedilince site birkaç saniyede güncellenir (snippet → /api/revalidate).
  Ayrı bir admin paneli yok, gerek de yok.
- **Kartla ödeme doğrudan iyzico'da.** Müşteri iyzico'nun barındırdığı ödeme sayfasına gider; kart bilgisi
  yalnızca iyzico'ya girilir, bu siteye/sunucuya hiç gelmez ve hiçbir yerde saklanmaz. Para Bağır'ın iyzico
  hesabına geçer. Tutar her zaman sunucuda WooCommerce siparişinden hesaplanır (tarayıcıdan değiştirilemez);
  ödeme sonucu iyzico'dan sorgulanır, aynı ödeme iki kez işlenmez.
- Havale/EFT siparişleri `on-hold` açılır; WooCommerce banka bilgisi e-postasını gönderir.

## Ortam değişkenleri (Hostinger → Node.js uygulaması → Ortam değişkenleri)

| Ad | Değer |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sitenin adresi: şimdilik `https://new.floresroastery.com`, geçişten sonra `https://floresroastery.com` |
| `WOOCOMMERCE_URL` | WordPress'in adresi: şimdilik `https://floresroastery.com`, geçişten sonra `https://panel.floresroastery.com` |
| `WOOCOMMERCE_CONSUMER_KEY` / `_SECRET` | WooCommerce → Ayarlar → Gelişmiş → REST API (Okuma/Yazma, kullanıcı: Yönetici) |
| `REVALIDATE_SECRET` | Uzun rastgele değer — snippet'teki `FLORES_REVALIDATE_SECRET` ile **aynı** |
| `IYZICO_API_KEY` / `IYZICO_SECRET_KEY` | iyzico paneli → Ayarlar → Firma Ayarları |
| `IYZICO_BASE_URL` | Test: `https://sandbox-api.iyzipay.com` · Canlı: `https://api.iyzipay.com` |

Değişken değiştirince **yeniden derleyin** (deploy). Anahtarları kimseyle (sohbet, e-posta, GitHub) paylaşmayın.

## iyzico — önce test (sandbox), sonra canlı

1. https://sandbox-merchant.iyzipay.com adresinden ücretsiz test hesabı açın → test API ve güvenlik anahtarı.
2. Hostinger'a sandbox anahtarlarını ve `IYZICO_BASE_URL=https://sandbox-api.iyzipay.com` girin, deploy edin.
3. Sitede kartla sipariş verin; iyzico'nun test kartıyla (ör. 5528 7900 0000 0008, ileri bir son kullanma tarihi, CVC 123)
   ödeyin. WooCommerce'te sipariş "Hazırlanıyor" olmalı ve notlarda "iyzico ödemesi alındı" yazmalı.
4. Sandbox'ta gerçek para yoktur; hiçbir sorumluluk doğurmaz. Testten sonra canlı anahtarları ve
   `IYZICO_BASE_URL=https://api.iyzipay.com` girin, deploy edin.

## Alan adı geçişi (new.floresroastery.com → floresroastery.com)

Ödeme artık WordPress'e bağlı değil, bu yüzden geçiş basit:

1. **Yedek:** hPanel → Yedekler + All-in-One WP Migration ile WordPress dışa aktarımı.
2. **WordPress'i `panel.floresroastery.com`'a taşıyın** (hPanel → WordPress → alan adı değiştir, ya da yeni alt
   alan adına içe aktarma). WordPress → Ayarlar → Genel'de iki adresin de `https://panel.floresroastery.com` olduğunu kontrol edin.
3. **Bu siteyi `floresroastery.com`'a bağlayın** (Node.js uygulaması → Alan adı).
4. Ortam değişkenleri: `NEXT_PUBLIC_SITE_URL=https://floresroastery.com`, `WOOCOMMERCE_URL=https://panel.floresroastery.com` → deploy.
5. Snippet'te `FLORES_STOREFRONT = 'https://floresroastery.com'`.
6. Toptan sipariş artık site içinde (/toptan) — eski B2B "Sipariş Oluştur" bağlantısına gerek kalmadı.
7. Eski WordPress ürün adresleri (`/product/...`) yeni sitede otomatik 301 ile yönlenir; Google Search Console'a
   `https://floresroastery.com/sitemap.xml` gönderin.

## WordPress snippet
`docs/wordpress-snippet.php` → WordPress → Snippets → mevcut snippet'i bu içerikle değiştirin, "Run everywhere".
İlk satırdaki `<?php` hariç yapıştırın; `FLORES_STOREFRONT` ve `FLORES_REVALIDATE_SECRET`'ı doldurun.

## Notlar
- Rate limit bellek içidir; Hostinger'da tek örnek çalıştığı için yeterli.
- `_randevu/` ve `_b2b/` klasörleri yüklenmez (`.gitignore`).
- Hostinger zip'i: proje klasöründe `git archive --format=zip -o flores-roastery.zip HEAD`.
