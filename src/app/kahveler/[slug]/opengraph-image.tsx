import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getProduct, getProducts } from "@/lib/commerce";

export const alt = "Flores Roastery kahve";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

// yollar sabit alt klasörlere kapsandı (dosya izleme tüm projeyi kapsamasın)
const ogPhoto = async (name: string) =>
  `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "src", "assets", "og", `${name}.jpg`))).toString("base64")}`;
const ogLogo = async () => `data:image/png;base64,${(await readFile(join(process.cwd(), "public", "logo-og.png"))).toString("base64")}`;

/** Ürün adı + tadım notlarından dinamik paylaşım görseli */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const [photo, logo] = await Promise.all([ogPhoto(product ? product.slug : "roastery").catch(() => ogPhoto("roastery")), ogLogo()]);
  const from = product?.variants.length ? Math.min(...product.variants.map((v) => v.price)) : null;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0a0a0a", color: "#f3f4f6" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} width={630} height={630} alt="" style={{ objectFit: "cover" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 56px 52px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={44} height={44} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 24, letterSpacing: 6 }}>FLORES</span>
              <span style={{ fontSize: 12, letterSpacing: 8, color: "#9ca3af" }}>ROASTERY</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 20, letterSpacing: 4, color: "#7db8e2", textTransform: "uppercase" }}>{product?.subtitle ?? "Specialty Coffee"}</span>
            <span style={{ fontSize: 76, lineHeight: 1.05, marginTop: 12 }}>{product?.name ?? "Flores Roastery"}</span>
            <span style={{ fontSize: 26, color: "#d1d5db", marginTop: 20 }}>{product?.tastingNotes.map((n) => n.label).join(" · ")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 22, color: "#9ca3af" }}>
            <span>floresroastery.com</span>
            {from != null && <span style={{ color: "#f3f4f6", fontSize: 30 }}>{`${from.toLocaleString("tr-TR")} TL'den`}</span>}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
