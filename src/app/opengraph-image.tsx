import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Flores Roastery — Where every bean has a story";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // yollar sabit alt klasörlere kapsandı (dosya izleme tüm projeyi kapsamasın)
  const [photoBuf, logoBuf] = await Promise.all([
    readFile(join(process.cwd(), "src", "assets", "og", "roastery.jpg")),
    readFile(join(process.cwd(), "public", "logo-og.png")),
  ]);
  const photo = `data:image/jpeg;base64,${photoBuf.toString("base64")}`;
  const logo = `data:image/png;base64,${logoBuf.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0a0a0a", color: "#f3f4f6" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 72, flex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={96} height={96} alt="" />
          <span style={{ fontSize: 72, letterSpacing: 14, marginTop: 36 }}>FLORES</span>
          <span style={{ fontSize: 20, letterSpacing: 16, color: "#9ca3af" }}>ROASTERY</span>
          <span style={{ fontSize: 34, color: "#7db8e2", marginTop: 40 }}>Where every bean has a story.</span>
          <span style={{ fontSize: 22, color: "#9ca3af", marginTop: 12 }}>Specialty coffee · Eskişehir</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} width={420} height={630} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    size,
  );
}
