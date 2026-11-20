"use client";
import { useEffect, useState } from "react";

type Row = { label: string; value: number };
const COLORS = ["#0f6b5c", "#e8a33d", "#4da3e0", "#a58bf0", "#e0675a", "#8aa09b"];

/** Horizontal bars (animated width). */
export function HBars({ rows, max }: { rows: Row[]; max?: number }) {
  const [go, setGo] = useState(false); useEffect(() => { const t = setTimeout(() => setGo(true), 60); return () => clearTimeout(t); }, []);
  const m = max ?? Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="mu">No data yet.</p>;
  return <div>{rows.map((r) => <div className="hb" key={r.label}><span>{r.label}</span><div className="tk"><div className="fl" style={{ width: go ? `${(r.value / m) * 100}%` : 0 }} /></div><b>{r.value}</b></div>)}</div>;
}

/** Grouped vertical bars for monthly trends. */
export function MonthBars({ data }: { data: { label: string; enquiries: number; appointments: number }[] }) {
  const W = 520, H = 200, pad = 26, max = Math.max(3, ...data.flatMap((d) => [d.enquiries, d.appointments]));
  const gw = (W - pad) / data.length, bw = Math.min(22, gw / 3);
  return (<>
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Monthly enquiries and appointments">
      {[0, 0.5, 1].map((t) => <g key={t}><line x1={pad} x2={W} y1={H - 24 - t * (H - 44)} y2={H - 24 - t * (H - 44)} stroke="var(--bd)" strokeDasharray="3 4" /><text x={0} y={H - 20 - t * (H - 44)}>{Math.round(max * t)}</text></g>)}
      {data.map((d, i) => { const x = pad + i * gw + gw / 2; const h1 = (d.enquiries / max) * (H - 44), h2 = (d.appointments / max) * (H - 44); return (
        <g key={d.label}>
          <rect className="bar" x={x - bw - 1} y={H - 24 - h1} width={bw} height={h1} rx={4} fill="#0f6b5c"><title>{d.enquiries} enquiries</title></rect>
          <rect className="bar" x={x + 1} y={H - 24 - h2} width={bw} height={h2} rx={4} fill="#e8a33d"><title>{d.appointments} appointments</title></rect>
          <text x={x} y={H - 6} textAnchor="middle">{d.label}</text></g>); })}
    </svg>
    <div className="legend"><span><i style={{ background: "#0f6b5c" }} />Enquiries</span><span><i style={{ background: "#e8a33d" }} />Appointments</span></div>
  </>);
}

/** Donut with legend. */
export const STATUS_COLORS: Record<string, string> = { New: "#e8a33d", Contacted: "#4da3e0", "In progress": "#a58bf0", Closed: "#0f6b5c", Pending: "#e8a33d", Confirmed: "#2fb36d", Completed: "#0f6b5c", Cancelled: "#e0675a" };
export function Donut({ rows, byStatus }: { rows: Row[]; byStatus?: boolean }) {
  const col = (r: Row, i: number) => (byStatus && STATUS_COLORS[r.label]) || COLORS[i % COLORS.length];
  const total = rows.reduce((s, r) => s + r.value, 0); const R = 52, C = 2 * Math.PI * R; let off = 0;
  return (<div style={{ display: "flex", gap: "1.2rem", alignItems: "center", flexWrap: "wrap" }}>
    <svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="Distribution">
      <circle cx="70" cy="70" r={R} fill="none" stroke="var(--bd)" strokeWidth="18" />
      {total > 0 && rows.map((r, i) => { const len = (r.value / total) * C; const el = <circle key={r.label} cx="70" cy="70" r={R} fill="none" stroke={col(r, i)} strokeWidth="18" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} transform="rotate(-90 70 70)"><title>{r.label}: {r.value}</title></circle>; off += len; return el; })}
      <text x="70" y="68" textAnchor="middle" style={{ fontSize: 24, fontFamily: "Fraunces,serif", fontWeight: 700, fill: "var(--tx)" }}>{total}</text>
      <text x="70" y="86" textAnchor="middle" style={{ fontSize: 11, fill: "var(--mu)" }}>total</text>
    </svg>
    <div className="legend" style={{ flexDirection: "column", gap: ".3rem", margin: 0 }}>{rows.map((r, i) => <span key={r.label}><i style={{ background: col(r, i) }} />{r.label} · <b style={{ color: "var(--tx)" }}>{r.value}</b></span>)}</div>
  </div>);
}
