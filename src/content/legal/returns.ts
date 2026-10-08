import { SELLER, type LegalDoc } from "./types";

export const returnsPolicy: LegalDoc = {
  slug: "teslimat-ve-iade-sartlari",
  title: "Teslimat ve İade Şartları",
  description: "Tüketici hakları, cayma hakkı, iptal ve iade koşulları; öğütülmüş kahvelerde cayma hakkı istisnası.",
  updated: "2026-10-08",
  blocks: [
    { h: "1. Genel Hükümler" },
    {
      p: "Kullanmakta olduğunuz web sitesi üzerinden elektronik ortamda sipariş verdiğiniz takdirde, size sunulan ön bilgilendirme formunu ve mesafeli satış sözleşmesini kabul etmiş sayılırsınız.",
    },
    {
      p: "Alıcılar, satın aldıkları ürünün satış ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun, Mesafeli Sözleşmeler Yönetmeliği ve 23 Ağustos 2022 tarih ve 31932 sayılı Resmi Gazetede yayınlanan Mesafeli Sözleşmeler Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmeliği hükümleri ile yürürlükteki diğer yasalara tabidir.",
    },
    { p: "Ürün sevkiyat masrafı olan kargo ücretleri alıcılar tarafından ödenecektir." },
    {
      p: "Satın alınan her bir ürün, 30 günlük yasal süreyi aşmamak kaydı ile alıcının gösterdiği adresteki kişi ve/veya kuruluşa teslim edilir. Bu süre içinde ürün teslim edilmez ise, Alıcılar sözleşmeyi sona erdirebilir.",
    },
    {
      p: "Satın alınan ürün, eksiksiz ve siparişte belirtilen niteliklere uygun ve varsa garanti belgesi, kullanım kılavuzu gibi belgelerle teslim edilmek zorundadır.",
    },
    {
      p: "Satın alınan ürünün satılmasının imkansızlaşması durumunda, satıcı bu durumu öğrendiğinden itibaren 3 gün içinde yazılı olarak alıcıya bu durumu bildirmek zorundadır. 14 gün içinde de toplam bedel Alıcı'ya iade edilmek zorundadır.",
    },
    { h: "2. Satın Alınan Ürün Bedeli Ödenmez İse" },
    { p: "Alıcı, satın aldığı ürün bedelini ödemez veya banka kayıtlarında iptal ederse, Satıcının ürünü teslim yükümlülüğü sona erer." },
    { h: "3. Kredi Kartının Yetkisiz Kullanımı ile Yapılan Alışverişler" },
    {
      p: "Ürün teslim edildikten sonra, alıcının ödeme yaptığı kredi kartının yetkisiz kişiler tarafından haksız olarak kullanıldığı tespit edilirse ve satılan ürün bedeli ilgili banka veya finans kuruluşu tarafından Satıcı'ya ödenmez ise, Alıcı, sözleşme konusu ürünü 3 gün içerisinde nakliye gideri SATICI'ya ait olacak şekilde SATICI'ya iade etmek zorundadır.",
    },
    { h: "4. Öngörülemeyen Sebeplerle Ürün Süresinde Teslim Edilemez İse" },
    {
      p: "Satıcı'nın öngöremeyeceği mücbir sebepler oluşursa ve ürün süresinde teslim edilemez ise, durum Alıcı'ya bildirilir. Alıcı, siparişin iptalini, ürünün benzeri ile değiştirilmesini veya engel ortadan kalkana dek teslimatın ertelenmesini talep edebilir. Alıcı siparişi iptal ederse; ödemeyi nakit ile yapmış ise iptalinden itibaren 14 gün içinde kendisine nakden bu ücret ödenir. Alıcı, ödemeyi kredi kartı ile yapmış ise ve iptal ederse, bu iptalden itibaren yine 14 gün içinde ürün bedeli bankaya iade edilir, ancak bankanın alıcının hesabına 2 hafta içerisinde aktarması olasıdır.",
    },
    { h: "5. Alıcının Ürünü Kontrol Etme Yükümlülüğü" },
    {
      p: "Alıcı, sözleşme konusu mal/hizmeti teslim almadan önce muayene edecek; ezik, kırık, ambalajı yırtılmış vb. hasarlı ve ayıplı mal/hizmeti kargo şirketinden teslim almayacaktır. Teslim alınan mal/hizmetin hasarsız ve sağlam olduğu kabul edilecektir. ALICI, teslimden sonra mal/hizmeti özenle korumak zorundadır. Cayma hakkı kullanılacaksa mal/hizmet kullanılmamalıdır. Ürünle fatura da iade edilmelidir.",
    },
    { h: "6. Cayma Hakkı" },
    {
      p: "ALICI; satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, SATICI'ya aşağıdaki iletişim bilgileri üzerinden bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkını kullanabilir.",
    },
    { note: "Cayma bildiriminizi sitemizdeki İade Talebi formu ile de iletebilirsiniz: /iade-talebi" },
    { h: "7. Satıcının Cayma Hakkı Bildirimi Yapılacak İletişim Bilgileri" },
    { ul: [`Şirket: ${SELLER.legalName}`, `Adres: ${SELLER.address}`, `E-posta: ${SELLER.email}`, `Tel: ${SELLER.phone}`] },
    { h: "8. Cayma Hakkının Süresi" },
    {
      p: "Alıcı, satın aldığı eğer bir hizmet ise, bu 14 günlük süre sözleşmenin imzalandığı tarihten itibaren başlar. Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile hizmetin ifasına başlanan hizmet sözleşmelerinde cayma hakkı kullanılamaz. Alıcı'ya Cayma hakkına ilişkin bildirim Mesafeli Sözleşmelerde ve İptal Koşullarında sunulmuş olup, Alıcı Cayma koşullarını bilerek sipariş vermektedir.",
    },
    { p: "Cayma hakkının kullanımından kaynaklanan masraflar SATICI'ya aittir." },
    {
      p: "Cayma hakkının kullanılması için 14 (ondört) günlük süre içinde SATICI'ya iadeli taahhütlü posta, faks, e-posta veya SATICI tarafından bildirilen yöntem ile yazılı veya ilgili yöntemle bildirimde bulunulması ve ürünün işbu sözleşmede düzenlenen “Cayma Hakkı Kullanılamayacak Ürünler” hükümleri çerçevesinde kullanılmamış olması şarttır.",
    },
    { h: "9. Cayma Hakkının Kullanımı" },
    {
      p: "Kişiye veya ALICI'ya teslim edilen ürünün faturası, (İade edilmek istenen ürünün faturası kurumsal ise, iade ederken kurumun düzenlemiş olduğu iade faturası ile gönderilmesi gerekmektedir. Faturası kurumlar adına düzenlenen sipariş iadeleri İADE FATURASI kesilmediği takdirde tamamlanamayacaktır.)",
    },
    { p: "İade formu, iade edilecek ürünlerin kutusu, ambalajı, varsa standart aksesuarları ile eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir." },
    { h: "10. İade Koşulları" },
    {
      p: "SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 10 günlük süre içerisinde toplam bedeli ve ALICI'yı borç altına sokan belgeleri ALICI'ya iade etmek ve 20 günlük süre içerisinde malı iade almakla yükümlüdür.",
    },
    {
      p: "ALICI'nın kusurundan kaynaklanan bir nedenle malın değerinde bir azalma olursa veya iade imkânsızlaşırsa ALICI kusuru oranında SATICI'nın zararlarını tazmin etmekle yükümlüdür. Ancak cayma hakkı süresi içinde malın veya ürünün usulüne uygun kullanılması sebebiyle meydana gelen değişiklik ve bozulmalardan ALICI sorumlu değildir.",
    },
    {
      p: "ALICI, 23 Ağustos 2022 tarih ve 31932 sayılı Resmi Gazetede yayınlanan Mesafeli Sözleşmeler Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmeliğinin 11 ve diğer hükümleri gereği ürünün ayıplı olmaması halinde iade ettiği ürün için SATICI'nın tüm masrafları (kargo, ulaşım vb.), ALICI tarafından karşılanacaktır.",
    },
    { p: "Cayma hakkının kullanılması nedeniyle SATICI tarafından düzenlenen kampanya limit tutarının altına düşülmesi halinde kampanya kapsamında faydalanılan indirim miktarı iptal edilir." },
    { h: "11. Cayma Hakkı Kullanılamayacak Ürünler" },
    {
      p: "İade edeceğiniz ürünün; paketi hasar görmemiş, kullanılmamış ve kullanım hatası sonucu zarar görmemiş olması gerekmektedir. Bu durumda ücret iadesi yapılmaz. Tek kullanımlık ürünlerin ve hızlı bozulan veya son kullanma tarihi geçme ihtimali olan ürünlerin iadesi kabul edilmemektedir. Sarf malzemeleri (filtre vb.) ancak ambalajı açılmamış, denenmemiş, bozulmamış ve kullanılmamış olmaları halinde iade edilebilir.",
    },
    { p: "İade etmek istediğiniz ürün ve ürünlerin tüm aksesuarları ve orijinal kutusu ile beraber iade etmeniz gerekmektedir." },
    { p: "Aşağıdaki mesafeli sözleşmeler yönetmeliği gereğince cayma hakkı kullanılamayacak ürünler:" },
    {
      ul: [
        "Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallara ilişkin sözleşmeler (öğütülmüş kahveler dahil).",
        "Çabuk bozulabilen veya son kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmeler.",
        "Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmeler.",
        "Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan mallara ilişkin sözleşmeler.",
        "Malın tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olması halinde maddi ortamda sunulan kitap, dijital içerik ve bilgisayar sarf malzemelerine ilişkin sözleşmeler.",
        "Belirli bir tarihte veya dönemde yapılması gereken, konaklama, eşya taşıma, araba kiralama, yiyecek-içecek tedariki ve eğlence veya dinlenme amacıyla yapılan boş zamanın değerlendirilmesine ilişkin sözleşmeler.",
        "Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler.",
      ],
    },
    { h: "12. Temerrüt Hali ve Hukuki Sonuçları" },
    {
      p: "ALICI, ödeme işlemlerini kredi kartı ile yaptığı durumda temerrüde düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya karşı sorumlu olacağını kabul, beyan ve taahhüt eder. Bu durumda ilgili banka hukuki yollara başvurabilir; doğacak masrafları ve vekâlet ücretini ALICI'dan talep edebilir ve her koşulda ALICI'nın borcundan dolayı temerrüde düşmesi halinde, ALICI, borcun gecikmeli ifasından dolayı SATICI'nın uğradığı zarar ve ziyanını ödeyeceğini kabul eder.",
    },
    { h: "13. Ödeme ve Teslimat" },
    { p: "Banka Havalesi veya EFT (Elektronik Fon Transferi) yaparak hesaplarımızdan (TL) herhangi birine ödeme yapabilirsiniz." },
    {
      p: "Sitemiz üzerinden kredi kartlarınız ile, her türlü kredi kartınıza online tek ödeme ya da online taksit imkânlarından yararlanabilirsiniz. Online ödemelerinizde siparişiniz sonunda kredi kartınızdan tutar çekim işlemi gerçekleşecektir.",
    },
    { h: "14. Uyuşmazlık Hali" },
    {
      p: "Bu Sözleşme'den ve/veya uygulanmasından doğabilecek her türlü uyuşmazlığın çözümünde SATICI kayıtları (bilgisayar-ses kayıtları gibi manyetik ortamdaki kayıtlar dahil) kesin delil oluşturur.",
    },
    {
      p: "Mesafeli Satış Sözleşmesi'nden doğan tüm ihtilafların halinde, Mesafeli Satış Sözleşme'sinin tarafı Gerçek Kişi Alıcı ise, Gümrük ve Ticaret Bakanlığı tarafından belirlenen parasal sınırlar dahilinde Alıcı'nın ürünü satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Sorunları Hakem Heyeti veya Tüketici Mahkemeleri; Sözleşme'nin tarafı Tüzel Kişi Alıcı ise, Eskişehir Mahkemeleri ve İcra Müdürlükleri yetkili olacaktır.",
    },
    {
      p: "İşbu sözleşme dolayısıyla taraflar arasında oluşan her türlü ihtilaf sonucunda Alıcı Tüketicinin Korunması Hakkında Kanun, Mesafeli Sözleşmeler Yönetmeliği ve 23 Ağustos 2022 tarih ve 31932 sayılı Resmi Gazetede yayınlanan Mesafeli Sözleşmeler Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmeliği, ihtilaf tarihindeki yürürlükteki kanun ve yönetmelikler uygulanacaktır.",
    },
  ],
};
