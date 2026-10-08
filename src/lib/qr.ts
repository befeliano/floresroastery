import "server-only";
import QRCode from "qrcode";

/** Beyaz modüllü, şeffaf zeminli QR kod (kutu arka yüzü için) — data URI */
export async function qrDataUri(text: string) {
  const svg = await QRCode.toString(text, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#ffffffff", light: "#00000000" },
  });
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
