import type { Appointment, Enquiry } from "./types";
import { daysFromToday, monthKey, monthLabel, toISO } from "./format";

export const countBy = <T,>(rows: T[], f: (r: T) => string) => {
  const m = new Map<string, number>(); rows.forEach((r) => { const k = f(r) || "Other"; m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};
/** Last n months (oldest first) with enquiry + appointment counts. */
export function monthly(enq: Enquiry[], apt: Appointment[], n = 6) {
  const out: { key: string; label: string; enquiries: number; appointments: number }[] = [];
  const d = new Date(); d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d.getFullYear(), d.getMonth() - i, 1); const key = monthKey(toISO(x));
    out.push({ key, label: monthLabel(key), enquiries: enq.filter((e) => monthKey(e.date) === key).length, appointments: apt.filter((a) => monthKey(a.date) === key).length });
  }
  return out;
}
export const inRange = (date: string | undefined, days: number) => days === 0 || (daysFromToday(date) <= 0 && daysFromToday(date) >= -days);
