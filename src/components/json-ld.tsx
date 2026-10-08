type Schema = Record<string, unknown>;

/** Schema.org JSON-LD — "<" kaçışlanarak XSS'e karşı güvenli hâle getirilir */
export function JsonLd({ data }: { data: Schema | Schema[] }) {
  const payload = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }} />;
}
