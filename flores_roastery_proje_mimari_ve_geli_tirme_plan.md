# FLORES ROASTERY - E-TİCARET & WEB PLATFORMU MİMARİSİ
**Sürüm:** 1.0.0
**Teknoloji Yığını:** Next.js (App Router), React, Tailwind CSS, TypeScript
**Veri/E-ticaret Altyapısı (Headless):** WooCommerce REST API / GraphQL (veya benzeri bir Headless CMS)
**Konsept:** Premium, Dark Mode, Hızlı, Odaklı (Sadece Kahve)

---

## 1. TASARIM VE KULLANICI DENEYİMİ (UI/UX) SİSTEMİ

Gönderilen referans görsellerdeki yapı (Onyx/Doyenne) baz alınarak Flores Roastery için özelleştirilmiş tasarım sistemi:

### 1.1. Renk Paleti (Dark Premium + Turkuaz Accent)
*   **Ana Arka Plan:** Kömür Siyahı / Koyu Gri (`#0A0A0A` - `#121212`) - Göz yormayan derinlik.
*   **İkincil Arka Plan (Kartlar/Bölümler):** Mat Antrasit (`#1A1A1A` - `#242424`).
*   **Ana Metin Rengi:** Kırık Beyaz / Kirli Krem (`#F3F4F6` veya `#E5E7EB`) - Siyah üzerinde yüksek okunabilirlik.
*   **Vurgu Rengi (Accent):** Flores Turkuazı / Açık Mavi (`#00E5FF` veya `#40E0D0`) - Logodan (`logo.webp`) çekilen bu renk; butonlarda, link hover'larında, grafik çizgilerinde ve "Sepete Ekle" (Call to Action) eylemlerinde kullanılacak. Premium siyahın içinde parlayarak lüks bir kontrast yaratacak.

### 1.2. Tipografi
*   **Başlıklar (Headings):** Modern Serif (Örn: *Playfair Display* veya *Cinzel*) - Onyx'in o karakteristik, otoriter ve premium duruşunu sağlamak için.
*   **Gövde ve Teknik Veriler (Body):** Temiz Sans-Serif (Örn: *Inter* veya *Geist*) - Okunabilirliği maksimumda tutmak ve düşük bellek tüketimi için optimize edilmiş web fontları.

### 1.3. Ortak Bileşenler (Components)
*   **Global Header:** Sol üstte `logo.webp` (açık renk/beyaz hatlı varyasyonu). Sadece kahve odaklı minimal bir mega menü. Sağda Sepet (Slide-out drawer şeklinde) ve Kullanıcı Girişi.
*   **Görsel Maskeler:** Referans görseldeki gibi (Peru, Ecuador kartları) üstü kavisli (arched/kemerli) fotoğraf maskeleri CSS `clip-path` veya `border-radius: 50% 50% 0 0` ile kodlanacak.

---

## 2. SAYFA YAPISI VE ÖZELLİKLER (FEATURES)

### 2.1. Ana Sayfa (Home)
*   **Hero Section:** Tam ekran, yüksek kaliteli, koyu tonlarda bir kahve kavurma veya döküm (pour-over) videosu/görseli. Üzerinde Flores Turkuazı bir "Explore Coffees" butonu.
*   **Kategoriler:** Sadece kahve odaklı. "Single Origin", "Blends", "Espresso".
*   **Manifesto/Kalite Blokları:** "We are Flores" - Tedarik zinciri şeffaflığını anlatan, referans görseldeki (B-Corp tarzı) geniş tipografik şerit.

### 2.2. Ürün Detay Sayfası (Kritik Alan - Referanslara Göre Birebir Kodlanacak)
Bu sayfa sitenin kalbidir. Her kahve çekirdeği bir "proje" gibi sunulacaktır.
*   **Ürün Künyesi:** Sayfa başında kahvenin görseli (turkuaz veya koyu arka planda). Etrafında çizgilerle bağlanmış metinler: Rakım (Elevation), İşlem (Process - Washed/Natural), Çeşit (Variety), Hasat Zamanı.
*   **Tadım Notları (Tasting Notes):** Büyük serif fontlarla, renkli veya turkuaz vurgulu notlar (Örn: *Jasmine, Blueberry, Dark Chocolate*).
*   **Brew Guides (Demleme Rehberi):** 
    *   Filtre ve Espresso için tab'lar (sekmeler).
    *   **Zaman Çizelgesi (Timeline):** Referans görselindeki gibi yatay bir çizgi üzerinde saniye saniye demleme tarifi (0:00 Bloom, 0:30 Spiral Pour vs.). Bu tamamen CSS/JS ile hafif bir bileşen olarak yazılacak.
*   **Roast Profile (Kavurma Profili Grafiği):**
    *   Referans görseldeki gibi Isı/Zaman grafiği.
    *   Ağır kütüphaneler (Chart.js vb.) yerine, sitenin hızlı olması için **Recharts** gibi hafif bir React kütüphanesi veya doğrudan **SVG** kullanılarak çizdirilecek.

---

## 3. SEO OPTİMİZASYONU (UÇTAN UCA)

Next.js App Router'ın sunduğu gücü kullanarak tamamen Google uyumlu bir altyapı:

*   **Sunucu Taraflı Oluşturma (SSR / SSG):** Tüm ürün sayfaları sunucuda (Server-Side) derlenip HTML olarak tarayıcıya gönderilecek. Google botları sayfayı anında okuyacak.
*   **Dinamik Meta Verileri (Metadata API):** Her ürün için `<title>`, `<meta description>` ve OpenGraph (Sosyal medya paylaşım görselleri) etiketleri dinamik olarak kahve adından ve tadım notlarından oluşturulacak.
*   **Schema.org / JSON-LD Entegrasyonu:**
    *   `Product` şeması: Fiyat, stok durumu, kullanıcı oyları (varsa) ve marka bilgisi.
    *   `BreadcrumbList` şeması: Kullanıcının sitedeki konumunu (Ana Sayfa > Kahveler > Etiyopya Yirgacheffe) arama motorlarına bildirme.
*   **Otomatik Sitemap & Robots.txt:** Next.js üzerinden ürün eklendikçe otomatik güncellenen `sitemap.xml`.
*   **Görsel SEO:** Tüm görsellerin `alt` etiketleri zorunlu tutulacak. Sadece "kahve" değil, "Flores Roastery Yıkanmış Kolombiya Kahve Çekirdeği" gibi uzun kuyruklu anahtar kelimeler kullanılacak.

---

## 4. PERFORMANS VE HIZ STRATEJİSİ (Low Memory Footprint)

Onyx tarzı sitelerin en büyük düşmanı şişkin kod ve ağır görsellerdir. Hedef %95+ Lighthouse skoru.

*   **Görsel Optimizasyonu (Next/Image):**
    *   Tüm görseller, özellikle `logo.webp`, Next.js'in yerleşik `<Image />` bileşeni ile kullanılacak.
    *   Formatlar otomatik olarak **WebP / AVIF**'e dönüştürülecek.
    *   Görünmeyen görseller için `loading="lazy"` varsayılan olacak.
*   **Code Splitting & Hafiflik:** 
    *   Sadece kullanıcının bulunduğu sayfaya ait JavaScript yüklenecek.
    *   Eski tip ağır slider kütüphaneleri (Slick, Swiper) yerine saf CSS (Scroll Snap) veya çok hafif React alternatifleri kullanılacak.
*   **Font Optimizasyonu (Next/Font):** Google Fontları sunucu tarafında barındırılarak (self-hosted) layout kaymaları (CLS - Cumulative Layout Shift) sıfıra indirilecek.
*   **Önbellekleme (Caching):** Ürün verileri değişmediği sürece (stok vs. hariç) Next.js'in `fetch` önbellekleme yetenekleri kullanılarak veritabanı sorguları minimuma indirilecek.

---

## 5. GÜVENLİK ÖNLEMLERİ

E-ticaret verilerinin ve sitenin korunması için askeri düzeyde (Enterprise) önlemler:

*   **HTTP Güvenlik Başlıkları (Security Headers):** `next.config.js` dosyasına şu başlıklar eklenecek:
    *   `Content-Security-Policy (CSP):` Sadece izin verilen kaynaklardan (kendi sunucumuz, ödeme altyapısı) script çalıştırılmasına izin verilecek (XSS saldırılarına karşı).
    *   `X-Frame-Options: DENY` (Clickjacking saldırılarını engeller).
    *   `Strict-Transport-Security (HSTS):` Zorunlu HTTPS bağlantısı.
*   **Veri Sanitizasyonu:** Kullanıcıdan alınan tüm girdiler (iletişim formu, sepet notları) arka planda HTML taglerinden temizlenecek.
*   **Rate Limiting (İstek Sınırlandırma):** API rotalarına (özellikle ödeme ve giriş sayfalarına) kısa sürede aşırı istek atılmasını (DDoS/Brute Force) engellemek için IP tabanlı limitler konulacak.
*   **Ödeme Güvenliği:** Kredi kartı verileri **kesinlikle** kendi sunucularımızda tutulmayacak. İyzico, Stripe veya PayTR gibi ödeme kuruluşlarının token/iframe tabanlı güvenli yöntemleri entegre edilecek.
*   **Çevresel Değişkenler (ENV):** Veritabanı şifreleri, API anahtarları sadece sunucu tarafında (Server-side) saklanacak, `NEXT_PUBLIC_` ön eki olmayan hiçbir key tarayıcıya sızdırılmayacak.

---

## 6. GELİŞTİRME YOL HARİTASI (ROADMAP)

1.  **Aşama 1: Kurulum ve Temel Yapı (Hafta 1)**
    *   Next.js projesinin başlatılması, Tailwind konfigürasyonu.
    *   Renk paletinin (`tailwind.config.js`) turkuaz ve siyah ekseninde ayarlanması.
    *   Global fontların ve `logo.webp`'nin yerleştirilmesi.
2.  **Aşama 2: UI Kodlama (Hafta 2-3)**
    *   Ürün detay sayfasındaki karmaşık bileşenlerin (Brew Guide Timeline, Roast Profile Grafiği) kodlanması.
    *   Ana sayfa ve kategori listeleme tasarımları.
3.  **Aşama 3: Backend & Sepet Entegrasyonu (Hafta 4)**
    *   Headless e-ticaret altyapısına bağlanma (Ürünleri çekme, stok durumu).
    *   Sepet yönetimi (Zustand veya React Context ile hafif state yönetimi).
4.  **Aşama 4: Optimizasyon, SEO ve Güvenlik (Hafta 5)**
    *   Lighthouse testleri, JSON-LD şemalarının eklenmesi, Security Headers yapılandırması.
5.  **Aşama 5: Canlıya Alma (Deployment)**
    *   Vercel (veya Hostinger Node.js destekli sunucu) üzerinden sitenin yayına alınması.