import { todayISO } from "./format";
export type Errors = Record<string, string>;
const req = "This field is required.";
export function validate(v: Record<string, string>, required: string[], opts: { futureDate?: boolean } = {}): Errors {
  const e: Errors = {};
  for (const k of required) if (!String(v[k] ?? "").trim()) e[k] = req;
  if (v.email && !e.email && !/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email address.";
  if (v.phone && !e.phone && !/^[+\d][\d\s-]{6,}$/.test(v.phone)) e.phone = "Enter a valid phone number.";
  if (v.date && !e.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date)) e.date = "Use the format YYYY-MM-DD.";
    else if (opts.futureDate && v.date < todayISO()) e.date = "Please choose today or a future date.";
  }
  return e;
}
