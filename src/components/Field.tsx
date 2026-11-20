"use client";
import { ChangeEvent, ReactNode } from "react";

type Props = {
  name: string; label: string; value: string; error?: string; hint?: string; type?: string; rows?: number;
  options?: string[]; placeholder?: string; min?: string; autoComplete?: string; children?: ReactNode;
  onChange: (name: string, value: string) => void;
};
/** Label + input/select/textarea + inline error (same look as the design). */
export default function Field({ name, label, value, error, hint, type = "text", rows, options, placeholder, min, autoComplete, onChange }: Props) {
  const ch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(name, e.target.value);
  const common = { id: name, name, value, onChange: ch, "aria-invalid": !!error, "aria-describedby": `${name}-e` };
  return (<>
    <label htmlFor={name}>{label}</label>
    {options ? <select {...common}>{options.map((o) => <option key={o}>{o}</option>)}</select>
      : rows ? <textarea {...common} rows={rows} placeholder={placeholder} />
      : <input {...common} type={type} placeholder={placeholder} min={min} autoComplete={autoComplete} />}
    {hint && !error && <div className="mu sm">{hint}</div>}
    <div className="err" id={`${name}-e`}>{error}</div>
  </>);
}
