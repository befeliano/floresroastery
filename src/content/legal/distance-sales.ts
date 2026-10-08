import { SELLER, type LegalBlock, type LegalDoc } from "./types";

/** Ödeme adımında sözleşmeye işlenecek alıcı ve sipariş bilgileri */
export interface ContractContext {
  buyer?: { name: string; address: string; phone: string; email: string };
  order?: {
    lines: { name: string; quantity: number; total: string }[];
    subtotal: string;
    shipping: string;
    total: string;
    paymentMethod: string;
    deliveryAddress: string;
    deliveryCity: string;
    recipient: string;
    invoiceAddress: string;
    date: string;
  };
}

const blank = "………………………";

function orderBlocks(ctx: ContractContext): LegalBlock[] {
  const o = ctx.order;
  return [
    {
      ul: o
        ? [
            ...o.lines.map((l) => `${l.name} — ${l.quantity} adet — ${l.total} (KDV dahil)`),
            `Ara toplam: ${o.subtotal}`,
            `Kargo ücreti: ${o.shipping}`,
            `Toplam ödenecek tutar: ${o.total}`,
          ]
        : [`Ürün Adı: ${blank}`, `Adet: ${blank}`, `Toplam Ürün Tutarı: ${blank}`],
    },
    {
      p: "Ürünlerin cinsi ve türü, miktarı, marka/modeli, rengi, satış bedeli yukarıda belirtildiği gibidir.",
    },
    {
      ul: [
        `Ödeme şekli: ${o?.paymentMethod ?? blank}`,
        `Teslimat adresi: ${o?.deliveryAddress ?? blank}`,
        `Teslim edilecek ilçe/il: ${o?.deliveryCity ?? blank}`,
        `Teslim edilecek kişi: ${o?.recipient ?? blank}`,
        `Fatura adresi: ${o?.invoiceAddress ?? blank}`,
        `Sipariş tarihi: ${o?.date ?? blank}`,
      ],
    },
  ];
}

export function distanceSalesContract(ctx: ContractContext = {}): LegalDoc {
  const b = ctx.buyer;
  return {
    slug: "mesafeli-satis-sozlesmesi",
    title: "Mesafeli Satış Sözleşmesi",
    description: "Flores Roastery internet sitesi üzerinden yapılan alışverişlere ilişkin mesafeli satış sözleşmesi.",
    updated: "2026-10-08",
    blocks: [
      {
        p: `TARAFLAR: İşbu Mesafeli Satış Sözleşmesi (“Sözleşme”); adresi 1.2. maddede belirtilen (“Alıcı”) ile ${SELLER.address} adresinde bulunan ${SELLER.legalName} (“Satıcı”) arasında aşağıda belirtilen hüküm ve şartlar çerçevesinde elektronik ortamda kurulmuştur.`,
      },
      {
        p: "KONU: İşbu Sözleşme'nin konusu; ALICI'nın, SATICI'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince Taraflar'ın hak ve yükümlülüklerin belirlenmesidir. Listelenen ve sitede ilan edilen fiyatlar satış fiyatıdır. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir. Süreli olarak ilan edilen fiyatlar ise belirtilen süre sonuna kadar geçerlidir.",
      },
      { h: "Alıcı'nın Önceden Bilgilendirildiği Hususlar" },
      {
        p: "ALICI, aşağıdaki hususlarda, bu Sözleşme'nin ALICI tarafından İnternet Sitesi'nde kabulü ile kurulmasından ve gerek siparişi, gerek ödeme yükümlülüğü altına girmesinden önce İnternet Sitesi'nin ilgili sayfaları-kısımlarındaki tüm genel-özel açıklamaları incelediğini, okuduğunu, anladığını ve kendisine gerekli bilgilendirmenin yapıldığını kabul eder. SATICI'nın unvanı ve iletişim bilgileri ile güncel tanıtıcı bilgileri, SATICI tarafından uygulanan ALICI bilgileri için geçerli gizlilik, veri kullanımı-işleme ve ALICI'ya elektronik iletişim kuralları ile ALICI'nın bu hususlarda SATICI'ya verdiği izinler, ALICI'nın kanuni hakları, SATICI'nın hakları ve tarafların haklarını kullanım usulleri, ALICI'nın cayma hakkına sahip olmadığı Ürünler ve diğer mal ve hizmetler, ALICI'nın cayma hakkının olduğu durumlarda bu hakkını kullanma şartları, süresi ve usulü ile hakkın süresinde kullanılmaması durumunda ALICI'nın cayma hakkını kaybedeceği, Cayma hakkının bulunduğu durumlarda Ürünleri SATICI'ya ne şekilde iade edebileceği ve ilgili tüm mali hususlar (iade yolları, masrafı ve Ürün bedelinin iadesi ve iade sırasında, ALICI tarafından kazanılmış/kullanılmış ödül puanları için yapılabilecek indirim ve mahsuplar dahil), Mahiyetine göre bu Sözleşme'de de yer alan diğer tüm satış şartları ile işbu Sözleşme ALICI tarafından İNTERNET SİTESİ'nde onaylanarak kurulduktan sonra ALICI'ya elektronik posta ile gönderildiğinden ALICI tarafından istenen süre ile saklanıp buradan erişilebileceği, SATICI'nın da üç yıl süre ile nezdinde saklayabileceği. Mesafeli Satış Sözleşmesi'nden doğan tüm ihtilafların halinde, Mesafeli Satış Sözleşme'sinin tarafı Gerçek Kişi Alıcı ise, Gümrük ve Ticaret Bakanlığı tarafından belirlenen parasal sınırlar dahilinde Alıcı'nın ürünü satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Sorunları Hakem Heyeti veya Tüketici Mahkemeleri; Sözleşme'nin tarafı Tüzel Kişi Alıcı ise, Eskişehir Mahkemeleri ve İcra Müdürlükleri yetkili olacaktır.",
      },
      { h: "1.1 – Satıcı" },
      {
        ul: [`Ünvanı: ${SELLER.legalName}`, `Adresi: ${SELLER.address}`, `Telefon: ${SELLER.phone}`, "Fax: –", `E-posta: ${SELLER.email}`],
      },
      { h: "1.2 – Alıcı" },
      {
        ul: [`Adı/Soyadı/Ünvanı: ${b?.name ?? blank}`, `Adresi: ${b?.address ?? blank}`, `Telefon: ${b?.phone ?? blank}`, `E-posta: ${b?.email ?? blank}`],
      },
      { h: "Madde 2 – Konu" },
      {
        p: `İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait ${SELLER.web} internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 4077 sayılı Tüketicilerin Korunması Hakkındaki Kanun ve Mesafeli Sözleşmeleri Uygulama Esas ve Usulleri Hakkında Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.`,
      },
      { h: "Madde 3 – Sözleşme Konusu Ürün" },
      ...orderBlocks(ctx),
      { h: "Genel Hükümler" },
      {
        p: "9.1. ALICI, İnternet Sitesi'nde Sözleşme konusu Ürün'ün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup, bilgi sahibi olduğunu, elektronik ortamda gerekli teyidi verdiğini kabul, beyan ve taahhüt eder. ALICI'nın; Ön Bilgilendirmeyi elektronik ortamda teyit etmesi, mesafeli satış sözleşmesinin kurulmasından evvel, SATICI tarafından ALICI'ya verilmesi gereken adresi, siparişi verilen ürünlere ait temel özellikleri, ürünlerin vergiler dahil, ödeme ve teslimat bilgilerini de doğru ve eksiksiz olarak edindiğini kabul, beyan ve taahhüt eder.",
      },
      {
        p: "9.2. Sözleşme konusu her bir ürün, 30 günlük yasal süreyi aşmamak kaydı ile ALICI'nın yerleşim yeri uzaklığına bağlı olarak internet sitesindeki ön bilgiler kısmında belirtilen süre zarfında ALICI veya ALICI'nın gösterdiği adresteki kişi ve/veya kuruluşa teslim edilir. Bu süre içerisinde edimini yerine getirmemesi durumunda ALICI Sözleşme'yi feshedebilir. İnternet sitesinde “tahmini teslimat tarihi” şeklinde belirtilen ürünlerin, teslimat tarihi tahmini olarak belirtilmiş olup bu ifade herhangi bir taahhüt içermemektedir. Bu ürünler mevzuatta belirtildiği üzere en geç 30 gün içerisinde ALICI'ya teslim edilecektir.",
      },
      {
        p: "9.3. SATICI, Sözleşme'den doğan ifa yükümlülüğünün süresi dolmadan ALICI'yı bilgilendirmek ve açıkça onayını almak suretiyle eşit kalite ve fiyatta farklı bir ürün tedarik edebilir.",
      },
      {
        p: "9.4. ALICI, Sözleşme konusu Ürün'ün teslimatı için işbu Sözleşme'yi elektronik ortamda teyit edeceğini, herhangi bir nedenle Sözleşme konusu ürün bedelinin ödenmemesi ve/veya banka, finans kuruluşu kayıtlarında iptal edilmesi halinde, SATICI'nın sözleşme konusu ürünü teslim yükümlülüğünün sona ereceğini kabul, beyan ve taahhüt eder. Herhangi bir sebeple banka ve/veya finans kuruluşu tarafından başarısız kodu gönderilen ancak banka ve/veya finans kuruluşu tarafından SATICI'ya yapılan ödemelere ilişkin ALICI, SATICI'nın herhangi bir sorumluluğunun bulunmadığını kabul, beyan ve taahhüt eder.",
      },
      {
        p: "9.5. ALICI, Sözleşme konusu Ürün'ün ALICI veya ALICI'nın gösterdiği adresteki kişi ve/veya kuruluşa tesliminden sonra ALICI'ya ait kredi kartının yetkisiz kişilerce haksız kullanılması sonucunda Sözleşme konusu ürün bedelinin ilgili banka veya finans kuruluşu tarafından SATICI'ya ödenmemesi halinde, ALICI Sözleşme konusu ürünü 3 gün içerisinde nakliye gideri ALICI'ya ait olacak şekilde SATICI'ya iade edeceğini kabul, beyan ve taahhüt eder.",
      },
      {
        p: "9.6. SATICI, tarafların iradesi dışında gelişen, önceden öngörülemeyen ve tarafların borçlarını yerine getirmesini engelleyici ve/veya geciktirici hallerin oluşması gibi mücbir sebep halleri nedeni ile sözleşme konusu ürünü süresi içinde teslim edemez ise, durumu ALICI'ya bildireceğini kabul, beyan ve taahhüt eder.",
      },
      {
        p: "9.7. ALICI, Sözleşme konusu mal/hizmeti teslim almadan önce muayene edecek; ezik, kırık, ambalajı yırtılmış vb. hasarlı ve ayıplı mal/hizmeti kargo şirketinden teslim almayacaktır. Teslim alınan mal/hizmetin hasarsız ve sağlam olduğu kabul edilecektir. Teslimden sonra mal/hizmetin özenle korunması borcu, ALICI'ya aittir. Cayma hakkı kullanılacaksa mal/hizmet kullanılmamalıdır. Fatura iade edilmelidir.",
      },
      {
        p: "9.8. ALICI ile sipariş esnasında kullanılan kredi kartı hamilinin aynı kişi olmaması veya ürünün ALICI'ya tesliminden evvel, siparişte kullanılan kredi kartına ilişkin güvenlik açığı tespit edilmesi halinde, SATICI, kredi kartı hamiline ilişkin kimlik ve iletişim bilgilerini, siparişte kullanılan kredi kartının bir önceki aya ait ekstresini yahut kart hamilinin bankasından kredi kartının kendisine ait olduğuna ilişkin yazıyı ibraz etmesini ALICI'dan talep edebilir. ALICI'nın talebe konu bilgi/belgeleri temin etmesine kadar geçecek sürede sipariş dondurulacak olup, mezkur taleplerin 24 (yirmidört) saat içerisinde karşılanmaması halinde ise SATICI, siparişi iptal etme hakkını haizdir.",
      },
      {
        p: "9.9. SATICI'ya ait internet sitesinin üzerinden, SATICI'nın kendi kontrolünde olmayan ve/veya başkaca üçüncü kişilerin sahip olduğu ve/veya işlettiği başka web sitelerine ve/veya başka içeriklere link verilebilir. Bu linkler ALICI'ya yönlenme kolaylığı sağlamak amacıyla konmuş olup herhangi bir web sitesini veya o siteyi işleten kişiyi desteklememekte ve Link verilen web sitesinin içerdiği bilgilere yönelik herhangi bir garanti niteliği taşımamaktadır.",
      },
      {
        p: "9.10. İşbu üyelik sözleşmesi içerisinde sayılan maddelerden bir ya da birkaçını ihlal eden üye işbu ihlal nedeniyle cezai ve hukuki olarak şahsen sorumlu olup, SATICI'yı bu ihlallerin hukuki ve cezai sonuçlarından ayrı tutacaktır. Ayrıca; işbu ihlal nedeniyle, olayın hukuk alanına intikal ettirilmesi halinde, SATICI'nın üyeye karşı üyelik sözleşmesine uyulmamasından dolayı tazminat talebinde bulunma hakkı saklıdır.",
      },
      { h: "Özel Şartlar" },
      {
        p: "10.2. SATICI, kendi münhasır takdirinde olmak üzere, İnternet Sitesi'nde ALICI'lar için çeşitli zamanlarda koşulları SATICI tarafından belirlenmek üzere çeşitli kampanyalar sonucu ALICI'nın herhangi bir sebeple satın aldığı ürünleri iade, cayma hakkı vb. sebeplerle iade etmesi halinde SATICI tarafından düzenlenen kampanya koşullarının herhangi bir sebeple sağlanamaması halinde kampanya kapsamında faydalanılan indirim miktarı/fayda iptal edilir ve ALICI'ya yapılacak iade ödemesinden düşülecektir.",
      },
      {
        p: "10.3. ALICI'nın aynı faturada birden fazla kampanyadan yararlanabilir durumda olması halinde kampanyalar birleştirilmeyecek, ALICI yalnızca bir kampanyadan yararlanabilecektir. ALICI böyle bir durumda herhangi bir hak talebinde bulunmayacağını kabul, beyan ve taahhüt eder.",
      },
      {
        p: "10.4. SATICI İnternet Sitesi'nde duyurduğu kampanyaları dilediği zaman durdurma, güncelleme ve kampanya koşullarını değiştirme hakkı saklıdır. ALICI'nın İnternet Sitesi'nden yapacağı her bir alışveriş öncesi kampanya koşullarını incelemesi gerekmektedir.",
      },
      { h: "Kişisel Verilerin Korunması Hakkında" },
      {
        p: `11.1. SATICI kullanıcılarına daha iyi hizmet sunmak, ürünlerini ve hizmetlerini iyileştirmek, sitenin kullanımını kolaylaştırmak için kullanımını kullanıcılarının özel tercihlerine ve ilgi alanlarına yönelik çalışmalarda üyelerin kişisel bilgilerini kullanabilir. SATICI, ÜYE'nin ${SELLER.web} internet sitesi üzerinde yaptığı hareketlerin kaydını bulundurma hakkını saklı tutar.`,
      },
      {
        p: `11.2. SATICI'ya üye olan kişi, yürürlükte bulunan ve/veya yürürlüğe alınacak uygulamalar kapsamında SATICI tarafından kendisine ürün ve hizmet tanıtımları, reklamlar, kampanyalar, avantajlar, anketler ve diğer müşteri memnuniyeti uygulamaları sunulmasına izin verdiğini beyan ve kabul eder. ÜYE, SATICI'ya üye olurken ve/veya başka yollarla geçmişte vermiş olduğu ve/veya gelecekte vereceği kişisel ve alışveriş bilgilerinin ve alışveriş ve/veya tüketici davranış bilgilerinin yukarıdaki amaçlarla toplanmasına, paylaşılmasına, SATICI tarafından kullanılmasına ve arşivlenmesine izin verdiğini beyan ve kabul eder. ÜYE aksini bildirmediği sürece üyeliği sona erdiğinde de verilerin toplanmasına, paylaşılmasına, SATICI tarafından kullanılmasına ve arşivlenmesine izin verdiğini beyan ve kabul eder. ÜYE aksini bildirmediği sürece SATICI'nın kendisi ile internet, telefon, SMS, vb iletişim kanalları kullanarak irtibata geçmesine izin verdiğini beyan ve kabul eder. ÜYE yukarıda bahsi geçen bilgilerin toplanması, paylaşılması, kullanılması, arşivlenmesi ve kendisine erişilmesi nedeniyle doğrudan ve/veya dolaylı maddi ve/veya manevi menfi ve/veya müsbet, velhasıl herhangi bir zarara uğradığı konusunda talepte bulunmayacağını ve SATICI'yı sorumlu tutmayacağını beyan ve kabul eder. ÜYE veri paylaşım tercihlerini değiştirmek isterse, bu talebini SATICI'nın adresi olan ${SELLER.address} adresine yahut ${SELLER.email} adresine başvurarak veri paylaşım tercihlerini değiştirebilir.`,
      },
      {
        p: "11.3. SATICI, ÜYE'nin kişisel bilgilerini yasal bir zorunluluk olarak istendiğinde veya (a) yasal gereklere uygun hareket etmek veya SATICI'ya tebliğ edilen yasal işlemlere uymak; (b) SATICI ve SATICI web sitesi ailesinin haklarını ve mülkiyetini korumak ve savunmak için gerekli olduğuna iyi niyetle kanaat getirdiği hallerde açıklayabilir.",
      },
      {
        p: "11.4. SATICI web sitesinin virus ve benzeri amaçlı yazılımlardan arındırılmış olması için mevcut imkanlar dahilinde tedbir alınmıştır. Bunun yanında nihai güvenliğin sağlanması için kullanıcının, kendi virus koruma sistemini tedarik etmesi ve gerekli korunmayı sağlaması gerekmektedir. Bu bağlamda ÜYE, SATICI web sitesi'ne girmesiyle, kendi yazılım ve işletim sistemlerinde oluşabilecek tüm hata ve bunların doğrudan ya da dolaylı sonuçlarından kendisinin sorumlu olduğunu kabul etmiş sayılır.",
      },
      {
        p: "11.5. SATICI, sitenin içeriğini dilediği zaman değiştirme, kullanıcılara sağlanan herhangi bir hizmeti değiştirme ya da sona erdirme veya SATICI web sitesi'nde kayıtlı kullanıcı bilgi ve verilerini silme hakkını saklı tutar.",
      },
      { h: "12 – Cayma Hakkı" },
      {
        p: "ALICI; satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, SATICI'ya aşağıdaki iletişim bilgileri üzerinden bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkını kullanabilir. ALICI, 23 Ağustos 2022 tarih ve 31932 sayılı Resmi Gazetede yayınlanan Mesafeli Sözleşmeler Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmeliğinin 11 ve diğer hükümleri gereği ürünün ayıplı olmaması halinde iade ettiği ürün için SATICI'nın tüm masrafları (kargo, ulaşım vb.), ALICI tarafından karşılanacaktır.",
      },
      {
        p: "Mesafeli satış sözleşmesinin 17. maddesinde belirtildiği üzere “tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallara ilişkin sözleşmeler” cayma hakkı kapsamına girmemektedir. Yine aynı maddeye göre “çabuk bozulabilen veya son kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmeler” de cayma hakkının kullanılamayacağı belirtilmiştir. Yürürlükte belirtildiği üzere ödeme alındığı anda alıcının mesafeli satış sözleşmesinde yer alan tüm maddeleri okuduğu ve onayladığı, bunları bilerek ve kabul ederek sözleşmeyi yaptığı kabul edilir. Satıcı, alıcının ilgili sözleşmeleri okuduğuna dair yazılımsal düzenlemeleri yapmakla yükümlüdür.",
      },
      {
        p: "Flores Roastery kahve satışı noktasında yalnızca çekirdek halinde ürün satışı yapmakta olup, çekirdek kahve dışında tüketicilerin kişisel ihtiyacına binaen öğütülme tipleri doğrultusunda hazırlanan kahvelerde, tüketicilerin özel talepleri doğrultusunda kendilerine özgü hazırlandıklarından cayma hakkı bu ürünlerde kullanılamamaktadır. Bunun yanı sıra öğütülmüş ürünlerin çabuk bozulabilen ürün ve son kullanma tarihinin geçebileceğinden bahisle işbu ürünlere ilişkin tüketicinin cayma ve iade hakkı kapsam dışındadır.",
      },
      { h: "13 – Satıcının Cayma Hakkı Bildirimi Yapılacak İletişim Bilgileri" },
      {
        ul: [`Şirket: ${SELLER.legalName}`, `Adres: ${SELLER.address}`, `E-posta: ${SELLER.email}`, `Tel: ${SELLER.phone}`],
      },
      { h: "14 – Cayma Hakkının Süresi" },
      {
        p: "Alıcı, satın aldığı eğer bir hizmet ise, bu 14 günlük süre sözleşmenin imzalandığı tarihten itibaren başlar. Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile hizmetin ifasına başlanan hizmet sözleşmelerinde cayma hakkı kullanılamaz. Alıcı'ya Cayma hakkına ilişkin bildirim Mesafeli Sözleşmelerde ve İptal Koşullarında sunulmuş olup, Alıcı Cayma koşullarını bilerek sipariş vermektedir. Cayma hakkının kullanımından kaynaklanan masraflar SATICI'ya aittir. Cayma hakkının kullanılması için 14 (ondört) günlük süre içinde SATICI'ya iadeli taahhütlü posta, faks, e-posta veya SATICI tarafından bildirilen yöntem ile yazılı veya ilgili yöntemle bildirimde bulunulması ve ürünün işbu sözleşmede düzenlenen “Cayma Hakkı Kullanılamayacak Ürünler” hükümleri çerçevesinde kullanılmamış olması şarttır.",
      },
      { h: "15 – Cayma Hakkının Kullanımı" },
      {
        p: "Kişiye veya ALICI'ya teslim edilen ürünün faturası, (İade edilmek istenen ürünün faturası kurumsal ise, iade ederken kurumun düzenlemiş olduğu iade faturası ile gönderilmesi gerekmektedir. Faturası kurumlar adına düzenlenen sipariş iadeleri İADE FATURASI kesilmediği takdirde tamamlanamayacaktır.) İade formu, İade edilecek ürünlerin kutusu, ambalajı, varsa standart aksesuarları ile eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir.",
      },
      { h: "16 – İade Koşulları" },
      {
        p: "SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 10 günlük süre içerisinde toplam bedeli ve ALICI'yı borç altına sokan belgeleri ALICI'ya iade etmek ve 20 günlük süre içerisinde malı iade almakla yükümlüdür. ALICI'nın kusurundan kaynaklanan bir nedenle malın değerinde bir azalma olursa veya iade imkânsızlaşırsa ALICI kusuru oranında SATICI'nın zararlarını tazmin etmekle yükümlüdür. Ancak cayma hakkı süresi içinde malın veya ürünün usulüne uygun kullanılması sebebiyle meydana gelen değişiklik ve bozulmalardan ALICI sorumlu değildir. Cayma hakkının kullanılması nedeniyle SATICI tarafından düzenlenen kampanya limit tutarının altına düşülmesi halinde kampanya kapsamında faydalanılan indirim miktarı iptal edilir.",
      },
      { h: "17 – Cayma Hakkı Kullanılamayacak Ürünler" },
      {
        p: "İade edeceğiniz ürünün; paketi hasar görmemiş, kullanılmamış ve kullanım hatası sonucu zarar görmemiş olması gerekmektedir. Bu durumda ücret iadesi yapılmaz. Tek kullanımlık ürünlerin ve hızlı bozulan veya son kullanma tarihi geçme ihtimali olan ürünlerin iadesi kabul edilmemektedir. Sarf malzemeleri (filtre vb.) ancak ambalajı açılmamış, denenmemiş, bozulmamış ve kullanılmamış olmaları halinde iade edilebilir. İade etmek istediğiniz ürün ve ürünlerin tüm aksesuarları ve orijinal kutusu ile beraber iade etmeniz gerekmektedir. Aşağıdaki mesafeli sözleşmeler yönetmeliği gereğince cayma hakkı kullanılamayacak ürünler:",
      },
      {
        ul: [
          "Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallara ilişkin sözleşmeler.",
          "Çabuk bozulabilen veya son kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmeler.",
          "Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmeler.",
          "Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan mallara ilişkin sözleşmeler.",
          "Malın tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olması halinde maddi ortamda sunulan kitap, dijital içerik ve bilgisayar sarf malzemelerine ilişkin sözleşmeler.",
          "Belirli bir tarihte veya dönemde yapılması gereken, konaklama, eşya taşıma, araba kiralama, yiyecek-içecek tedariki ve eğlence veya dinlenme amacıyla yapılan boş zamanın değerlendirilmesine ilişkin sözleşmeler.",
          "Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler.",
        ],
      },
      { h: "18 – Temerrüt Hali ve Hukuki Sonuçları" },
      {
        p: "ALICI, ödeme işlemlerini kredi kartı ile yaptığı durumda temerrüde düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya karşı sorumlu olacağını kabul, beyan ve taahhüt eder. Bu durumda ilgili banka hukuki yollara başvurabilir; doğacak masrafları ve vekâlet ücretini ALICI'dan talep edebilir ve her koşulda ALICI'nın borcundan dolayı temerrüde düşmesi halinde, ALICI, borcun gecikmeli ifasından dolayı SATICI'nın uğradığı zarar ve ziyanını ödeyeceğini kabul eder.",
      },
      { h: "Delil Anlaşması ve Yetkili Mahkeme" },
      {
        p: "Bu Sözleşme'den ve/veya uygulanmasından doğabilecek her türlü uyuşmazlığın çözümünde SATICI kayıtları (bilgisayar-ses kayıtları gibi manyetik ortamdaki kayıtlar dahil) kesin delil oluşturur. Mesafeli Satış Sözleşmesi'nden doğan tüm ihtilafların halinde, Mesafeli Satış Sözleşme'sinin tarafı Gerçek Kişi Alıcı ise, Gümrük ve Ticaret Bakanlığı tarafından belirlenen parasal sınırlar dahilinde Alıcı'nın ürünü satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Sorunları Hakem Heyeti veya Tüketici Mahkemeleri; Sözleşme'nin tarafı Tüzel Kişi Alıcı ise, Eskişehir Mahkemeleri ve İcra Müdürlükleri yetkili olacaktır. İşbu sözleşme dolayısıyla taraflar arasında oluşan her türlü ihtilaf sonucunda Alıcı Tüketicinin Korunması Hakkında Kanun, Mesafeli Sözleşmeler Yönetmeliği ve 23 Ağustos 2022 tarih ve 31932 sayılı Resmi Gazetede yayınlanan Mesafeli Sözleşmeler Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmeliği, ihtilaf tarihindeki yürürlükteki kanun ve yönetmelikler uygulanacaktır.",
      },
      { h: "Yürürlük" },
      {
        p: "Site üzerinden verilen siparişe ait ödemenin gerçekleşmesi durumunda ALICI işbu Sözleşme'nin tüm koşullarını kabul etmiş sayılacaktır. SATICI, söz konusu Sözleşme'nin site üzerinde, ALICI tarafından okunduğuna ve kabul edildiğine dair onay almaksızın sipariş verilememesini sağlayacak yazılımsal düzenlemeleri yapmakla yükümlüdür.",
      },
      {
        ul: [`Firma Ünvanı: ${SELLER.legalName}`, `Adres: ${SELLER.address}`, `E-posta: ${SELLER.email}`, `Tel: ${SELLER.phone}`],
      },
    ],
  };
}

/** Ön Bilgilendirme Formu — Mesafeli Sözleşmeler Yönetmeliği md. 5 */
export function preInformationForm(ctx: ContractContext = {}): LegalDoc {
  const b = ctx.buyer;
  return {
    slug: "on-bilgilendirme-formu",
    title: "Ön Bilgilendirme Formu",
    description: "Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş öncesi alıcıya sunulan ön bilgilendirme formu.",
    updated: "2026-10-08",
    blocks: [
      { h: "1. Satıcı Bilgileri" },
      {
        ul: [`Ünvanı: ${SELLER.legalName}`, `Adresi: ${SELLER.address}`, `Telefon: ${SELLER.phone}`, `E-posta: ${SELLER.email}`],
      },
      { h: "2. Alıcı Bilgileri" },
      {
        ul: [`Adı/Soyadı/Ünvanı: ${b?.name ?? blank}`, `Adresi: ${b?.address ?? blank}`, `Telefon: ${b?.phone ?? blank}`, `E-posta: ${b?.email ?? blank}`],
      },
      { h: "3. Sözleşme Konusu Ürünler, Fiyat ve Ödeme" },
      ...orderBlocks(ctx),
      {
        p: "Listelenen ve sitede ilan edilen fiyatlar KDV dahil satış fiyatıdır. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir.",
      },
      { h: "4. Teslimat" },
      {
        p: "Sözleşme konusu ürün, 30 günlük yasal süreyi aşmamak kaydı ile ALICI'nın gösterdiği adresteki kişi ve/veya kuruluşa teslim edilir. Bu süre içinde ürün teslim edilmez ise ALICI sözleşmeyi sona erdirebilir. Ürün sevkiyat masrafı olan kargo ücreti, sipariş özetinde gösterildiği şekilde ALICI tarafından ödenir.",
      },
      { h: "5. Cayma Hakkı" },
      {
        p: "ALICI; satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, SATICI'ya bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkını kullanabilir. Cayma bildirimi yukarıdaki iletişim bilgilerine ya da sitemizdeki İade Talebi formu ile yapılabilir.",
      },
      {
        p: "Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallar (öğütülmüş kahveler), çabuk bozulabilen veya son kullanma tarihi geçebilecek mallar ile tesliminden sonra ambalajı, bandı, mührü açılmış olup iadesi sağlık ve hijyen açısından uygun olmayan ürünlerde cayma hakkı kullanılamaz.",
      },
      {
        p: "SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 10 gün içerisinde toplam bedeli ALICI'ya iade eder. Ürünün ayıplı olmaması halinde iade kargo masrafları ALICI'ya aittir.",
      },
      { h: "6. Şikâyet ve İtirazlar" },
      {
        p: "ALICI, şikâyet ve itirazlarını Ticaret Bakanlığı tarafından belirlenen parasal sınırlar dahilinde ürünü satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Hakem Heyeti'ne veya Tüketici Mahkemesi'ne iletebilir.",
      },
      {
        note: "ALICI, işbu Ön Bilgilendirme Formu'nu elektronik ortamda onaylayarak, mesafeli sözleşmenin kurulmasından önce yukarıdaki bilgileri doğru ve eksiksiz edindiğini kabul eder.",
      },
    ],
  };
}
