# Flores Roastery — web sitesi

Next.js 16 (App Router, Cache Components) · React 19 · Tailwind CSS 4 · TypeScript · Zustand.
Mimari ve gereksinimler: [`flores_roastery_proje_mimari_ve_geli_tirme_plan.md`](flores_roastery_proje_mimari_ve_geli_tirme_plan.md)

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

Ortam değişkenleri için `.env.example` dosyasını `.env.local` olarak kopyalayın. Hiçbiri zorunlu değildir; boşken site yerel katalogla çalışır.

## Klasör yapısı

| Yol | İçerik |
| --- | --- |
| `src/app` | Sayfalar, API rotaları, `sitemap.ts`, `robots.ts`, OG görselleri |
| `src/components` | Header/kahve rafı menüsü, sepet çekmecesi, 3D kutu, demleme zamanlayıcısı, formlar |
| `src/lib/commerce/catalog.ts` | **Kahve kataloğu** — künye, notalar, paketler, demleme tarifleri |
| `src/lib/commerce/woocommerce.ts` | Headless WooCommerce: canlı fiyat/stok (Store API) ve sipariş açma (REST v3) |
| `src/lib/orders` | Sunucu tarafı fiyatlama (kargo + kupon), sipariş kayıtları |
| `src/lib/security` | Rate limit, origin kontrolü, girdi temizleme |
| `src/content/legal` | KVKK, Gizlilik, Mesafeli Satış, Ön Bilgilendirme, Teslimat & İade |
| `src/content/wholesale.ts` | Toptan satış sayfası içeriği ve kademeli fiyat tablosu |
| `src/lib/site.ts` | Şirket bilgileri, kargo kuralları, Coffee Bar kampanyası, IBAN |
| `public/coffees` | Ürün kartları ve 3D kutu yüzleri (`img/` klasöründen üretildi) |
| `public/video` | Hero videosu (4K kaynaktan 1080p/720p H.264) |

## Yeni kahve eklemek

1. Kutu fotoğrafını `img/` klasörüne koyun, `public/coffees/<slug>.webp` (kart) ve `<slug>-front.webp` (kutunun ön yüzü, kırpılmış) üretin.
2. `src/lib/commerce/catalog.ts` dosyasına ürünü ekleyin; `id` = WooCommerce ürün ID'si, paket `id`'leri = WooCommerce varyasyon ID'leri.
3. `WOOCOMMERCE_URL` tanımlıysa fiyat ve stok canlı veriden gelir. WooCommerce'de ürün güncellendiğinde webhook ile
   `POST /api/revalidate?secret=REVALIDATE_SECRET` çağrılırsa önbellek ve sitemap anında yenilenir.

## Sipariş akışı

Sepet (tarayıcıda) → `/odeme` → `POST /api/checkout`:
sunucu sepeti katalogdan yeniden fiyatlar, stok/öğütme/kargo/kuponu doğrular, Ön Bilgilendirme + Mesafeli Satış onayı olmadan sipariş almaz.
WooCommerce REST anahtarları varsa sipariş WooCommerce'de açılır:
- **Havale/EFT** → `on-hold`, WooCommerce banka bilgisi e-postasını gönderir.
- **Kart** → `pending`, müşteri WooCommerce sipariş ödeme sayfasına yönlenir; ödemeyi WordPress'teki **iyzico eklentisi** alır,
  `docs/wordpress-snippet.php` müşteriyi `/siparis/tamamlandi` sayfasına geri gönderir. iyzico anahtarları bu projede yoktur.

Üyelik gerekmez; sipariş takibi numara + e-posta ile yapılır (WooCommerce'den canlı durum).
Kurulum adımları: **[docs/CANLIYA-ALMA.md](docs/CANLIYA-ALMA.md)**

**Kargo kuralları** (`src/lib/site.ts`): Eskişehir dışı sabit 150₺, 950₺ üzeri ücretsiz; Eskişehir içi aynı gün ücretsiz kurye; mağazadan teslim ücretsiz.

## Yapılacaklar (canlıya almadan önce)

- [ ] `site.ts` → `bank.iban` (Havale/EFT ekranında gösterilir)
- [ ] WooCommerce REST anahtarları + WordPress snippet'i (kartla ödeme ve kuponlar bunlarla açılır)
- [ ] E-posta gönderimi (iletişim, iade, toptan teklif, e-bülten şu an yalnızca sunucu belleğinde) — Resend/SMTP.
      Sipariş e-postalarını WooCommerce zaten gönderir.
- [ ] Yasal metinlerin hukuk danışmanınca gözden geçirilmesi (bkz. aşağı)
- [ ] WordPress'in alt alan adına taşınması ve `site.links.wholesaleBuilder` adresinin güncellenmesi
- [ ] Unsplash'ten gelen birkaç editoryal fotoğrafın (`src/lib/photos.ts`) kendi çekimlerinizle değiştirilmesi

## Güvenlik

CSP, HSTS (production), X-Frame-Options, nosniff, Referrer/Permissions-Policy (`next.config.ts`);
tüm POST API'lerde origin kontrolü + IP rate limit + gövde boyutu sınırı + HTML temizleme;
kart verisi ve iyzico anahtarları bu uygulamaya hiç gelmez (ödeme WordPress'teki iyzico eklentisinde). Bellek içi rate limit tek sunucu içindir —
çok örnekli barındırmada Upstash Redis kullanın.

> ⚠️ `_randevu/config.php` düz metin veritabanı şifresi, admin şifresi ve Resend API anahtarı içerir.
> `_randevu/` ve `_b2b/` `.gitignore`'dadır; yine de bu anahtarları değiştirmeniz önerilir.
