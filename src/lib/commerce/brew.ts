import type { BrewGuide } from "./types";

/** Sık kullanılan demleme tariflerinin şablonları (örnek veriler için) */

export function v60(opts: { dose?: number; water?: number; temperature?: number; grind?: string; totalTime?: number; tip?: string } = {}): BrewGuide {
  const dose = opts.dose ?? 15;
  const water = opts.water ?? 250;
  const bloom = dose * 3;
  return {
    method: "filter",
    device: "Hario V60 02",
    dose,
    output: water,
    ratio: `1:${Math.round((water / dose) * 10) / 10}`,
    temperature: opts.temperature ?? 93,
    grind: opts.grind ?? "Orta-ince · ~600 µm",
    totalTime: opts.totalTime ?? 165,
    tip: opts.tip,
    steps: [
      { at: 0, title: "Ön ıslatma", detail: "Tüm telveyi ıslatacak şekilde ortadan dışa doğru dökün, demliği hafifçe çevirin.", target: bloom },
      { at: 45, title: "Spiral döküş", detail: "Merkezden kenarlara ince ve sakin bir spiral.", target: Math.round(water * 0.6) },
      { at: 75, title: "Spiral döküş", detail: "Aynı ritimle, su seviyesini sabit tutun.", target: water },
      { at: 95, title: "Çevirme", detail: "Demliği nazikçe çevirerek kahve yatağını düzleştirin." },
      { at: opts.totalTime ?? 165, title: "Süzülme biter", detail: "Yatak düz ve çamursuz kalmalı. Afiyet olsun." },
    ],
  };
}

export function kalita(opts: { tip?: string; temperature?: number } = {}): BrewGuide {
  return {
    method: "filter",
    device: "Kalita Wave 185",
    dose: 20,
    output: 320,
    ratio: "1:16",
    temperature: opts.temperature ?? 94,
    grind: "Orta · ~650 µm",
    totalTime: 210,
    tip: opts.tip,
    steps: [
      { at: 0, title: "Ön ıslatma", detail: "60 g su ile telveyi eşit şekilde ıslatın.", target: 60 },
      { at: 35, title: "Yoğun spiral", detail: "Hızlı ama kontrollü bir spiral döküş.", target: 160 },
      { at: 70, title: "Spiral döküş", target: 240 },
      { at: 105, title: "Spiral döküş", target: 320 },
      { at: 210, title: "Süzülme biter", detail: "Toplam süre 3:15 – 3:45 arası hedeflenir." },
    ],
  };
}

export function chemex(opts: { tip?: string } = {}): BrewGuide {
  return {
    method: "filter",
    device: "Chemex 6 Cup",
    dose: 30,
    output: 480,
    ratio: "1:16",
    temperature: 94,
    grind: "Orta-kalın · ~800 µm",
    totalTime: 255,
    tip: opts.tip,
    steps: [
      { at: 0, title: "Ön ıslatma", detail: "75 g su, kaşıkla nazikçe karıştırın.", target: 75 },
      { at: 45, title: "Spiral döküş", target: 250 },
      { at: 90, title: "Spiral döküş", target: 400 },
      { at: 135, title: "Son döküş", target: 480 },
      { at: 255, title: "Süzülme biter", detail: "Kalın filtre nedeniyle 4–4:30 dk normaldir." },
    ],
  };
}

export function espresso(opts: { dose?: number; output?: number; time?: number; temperature?: number; grind?: string; tip?: string } = {}): BrewGuide {
  const dose = opts.dose ?? 18;
  const output = opts.output ?? 40;
  const time = opts.time ?? 28;
  return {
    method: "espresso",
    device: "Espresso makinesi · 18 g sepet",
    dose,
    output,
    ratio: `1:${Math.round((output / dose) * 10) / 10}`,
    temperature: opts.temperature ?? 93,
    grind: opts.grind ?? "İnce · ~250 µm",
    totalTime: time,
    tip: opts.tip,
    steps: [
      { at: 0, title: "Ön demleme", detail: "Düşük basınçla 4–6 sn telveyi ıslatın." },
      { at: 7, title: "İlk damlalar", detail: "Koyu, yoğun ilk damlalar gelmeli." },
      { at: 15, title: "Bal kıvamında akış", detail: "Kaplan desenli, kesintisiz akış.", target: Math.round(output * 0.45) },
      { at: time - 5, title: "Renk açılıyor", detail: "Akış açık kahveye dönerken hazır olun.", target: Math.round(output * 0.85) },
      { at: time, title: "Durdur", detail: `${output} g çıktıda shot'ı kesin.`, target: output },
    ],
  };
}

export function frenchPress(opts: { tip?: string } = {}): BrewGuide {
  return {
    method: "filter",
    device: "French Press",
    dose: 30,
    output: 500,
    ratio: "1:16.7",
    temperature: 94,
    grind: "Kalın · ~1000 µm",
    totalTime: 240,
    tip: opts.tip,
    steps: [
      { at: 0, title: "Tüm suyu ekleyin", detail: "Telveyi tamamen ıslatacak şekilde hızlıca dökün.", target: 500 },
      { at: 45, title: "Kabuğu kırın", detail: "Yüzeydeki kabuğu kaşıkla nazikçe karıştırın, kapağı kapatın." },
      { at: 210, title: "Köpüğü alın", detail: "Yüzeydeki köpük ve ince parçacıkları kaşıkla alın." },
      { at: 240, title: "Bastırın ve servis", detail: "Pistonu yavaşça indirip hemen servis edin." },
    ],
  };
}
