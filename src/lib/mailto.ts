/** Form içeriğinden e-posta taslağı açar (sunucuya veri gönderilmez; mail doğrudan info@'ya gider) */
export function openMailto(to: string, subject: string, rows: [label: string, value: string][]) {
  const body = rows
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v.trim()}`)
    .join("\n");
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
