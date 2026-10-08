import { notFound } from "next/navigation";

/** Eşleşmeyen tüm adresler dile göre 404 sayfasına düşsün */
export default function CatchAll() {
  notFound();
}
