export const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const todayISO = () => toISO(new Date());
const parse = (s: string) => new Date(s.length > 10 ? s : s + "T00:00:00");
const NOW0 = () => parse(todayISO());
export const fmtDate = (s?: string) => { if (!s) return "—"; const d = parse(s); return isNaN(+d) ? s : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); };
export const fmtTime = (t?: string) => { if (!t) return ""; const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; };
export const daysFromToday = (s?: string) => (s ? Math.round((+parse(s.slice(0, 10)) - +NOW0()) / 864e5) : 0);
export const relDay = (s?: string) => { if (!s) return "No date"; const n = daysFromToday(s); return n === 0 ? "Today" : n === 1 ? "Tomorrow" : n === -1 ? "Yesterday" : n > 0 ? `In ${n} days` : `${-n} days ago`; };
export const timeAgo = (iso: string) => {
  const m = Math.round((Date.now() - +new Date(iso)) / 60000);
  if (m < 1) return "just now"; if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60); if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24); return d < 30 ? `${d} day${d > 1 ? "s" : ""} ago` : fmtDate(iso.slice(0, 10));
};
export const initials = (n?: string) => (n || "?").trim().split(/\s+/).slice(0, 2).map((x) => x[0]?.toUpperCase()).join("");
export const monthKey = (s?: string) => (s || "").slice(0, 7);
export const monthLabel = (k: string) => new Date(k + "-01T00:00:00").toLocaleDateString("en-GB", { month: "short" });

export function toCSV<T extends object>(rows: T[], cols: [keyof T & string, string][]) {
  const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.map((c) => q(c[1])).join(","), ...rows.map((r) => cols.map((c) => q((r as Record<string, unknown>)[c[0]])).join(","))].join("\n");
}
export function download(name: string, text: string, mime = "text/csv") {
  const url = URL.createObjectURL(new Blob([text], { type: mime + ";charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}
