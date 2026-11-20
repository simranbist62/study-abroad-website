"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Empty, ErrorBox, Skeleton } from "@/components/Bits";
import { fmtDate, fmtTime, toISO, todayISO } from "@/lib/format";
import { useCollection } from "@/lib/useCollection";
import { Appointment } from "@/lib/types";

export default function CalendarPage() {
  const { data, loading, error, reload } = useCollection<Appointment>("appointments");
  const [m, setM] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [sel, setSel] = useState(todayISO()); const today = todayISO();

  const days = useMemo(() => { // 6-week grid starting Sunday
    const start = new Date(m); start.setDate(1 - m.getDay());
    const weeks = Math.ceil((m.getDay() + new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate()) / 7);
    return Array.from({ length: weeks * 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  }, [m]);
  const by = useMemo(() => { const map: Record<string, Appointment[]> = {}; data.filter((a) => a.status !== "Cancelled").forEach((a) => (map[a.date] ||= []).push(a)); Object.values(map).forEach((l) => l.sort((a, b) => (a.time || "").localeCompare(b.time || ""))); return map; }, [data]);
  const monthCount = data.filter((a) => a.date.startsWith(toISO(m).slice(0, 7)) && a.status !== "Cancelled").length;
  const list = by[sel] || [];

  return (<>
    <div className="ph"><div><h1>Appointment calendar</h1><p className="mu">{monthCount} booking{monthCount === 1 ? "" : "s"} this month</p></div>
      <div className="acts"><button className="btn o" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))} aria-label="Previous month">←</button>
        <b style={{ minWidth: 150, textAlign: "center" }}>{m.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</b>
        <button className="btn o" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))} aria-label="Next month">→</button>
        <button className="btn" onClick={() => { const d = new Date(); setM(new Date(d.getFullYear(), d.getMonth(), 1)); setSel(today); }}>Today</button></div></div>
    {error ? <ErrorBox msg={error} retry={reload} /> : loading ? <Skeleton rows={6} /> : (
      <div className="side" style={{ gridTemplateColumns: "1fr 320px" }}>
        <div className="cal" role="grid">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="dow">{d}</div>)}
          {days.map((d) => { const iso = toISO(d); const ev = by[iso] || []; return (
            <button key={iso} className={`day ${d.getMonth() !== m.getMonth() ? "out" : ""} ${iso === today ? "today" : ""} ${iso === sel ? "sel" : ""}`} onClick={() => setSel(iso)} aria-label={`${fmtDate(iso)}, ${ev.length} appointments`}>
              <b>{d.getDate()}</b>
              {ev.slice(0, 2).map((a) => <div className="ev" key={a.id}>{fmtTime(a.time)} {(a.name || "").split(" ")[0]}</div>)}
              {ev.length > 2 && <div className="ev">+{ev.length - 2} more</div>}
              <div className="dots">{ev.map((a) => <i key={a.id} data-s={a.status} />)}</div></button>); })}</div>
        <aside className="card" style={{ position: "sticky", top: "5rem" }}>
          <h3>{fmtDate(sel)}</h3>
          {list.length === 0 ? <Empty icon="🗓️" title="Nothing booked">This day is free.</Empty> : list.map((a) => (
            <div key={a.id} style={{ padding: ".6rem 0", borderBottom: "1px solid var(--bd)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: ".5rem" }}><b>{fmtTime(a.time) || "Time TBC"}</b><Badge s={a.status} /></div>
              <div>{a.name}</div><div className="mu sm">{a.topic} · {a.mode}</div></div>))}
          <p style={{ marginTop: "1rem", marginBottom: 0 }}><Link className="btn s o" href="/admin/appointments">Manage appointments</Link></p>
        </aside>
      </div>)}
  </>);
}
