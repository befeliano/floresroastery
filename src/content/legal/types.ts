export type LegalBlock = { h: string } | { p: string } | { ul: string[] } | { ol: string[] } | { note: string };

export interface LegalDoc {
  slug: string;
  title: string;
  description: string;
  updated: string;
  blocks: LegalBlock[];
}

export const SELLER = {
  legalName: "FLORES GIDA VE DIŞ TİCARET LİMİTED ŞİRKETİ",
  address: "HOŞNUDİYE MAH. İSMET İNÖNÜ-1 BLV. KAZIM ÖNAL IŞ MERKEZİ No: 43 Daire: 20 TEPEBAŞI / Eskişehir",
  phone: "+90 505 920 39 08",
  email: "info@floresroastery.com",
  web: "www.floresroastery.com",
};
