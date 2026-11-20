"use client";
import { FormEvent, useMemo, useState } from "react";
import { Avatar, Badge, Drawer, Empty, ErrorBox, Modal, Pager, Skeleton } from "@/components/Bits";
import Field from "@/components/Field";
import Icon from "@/components/Icon";
import { activityApi, appointmentApi } from "@/lib/api";
import { download, fmtDate, fmtTime, relDay, toCSV, todayISO } from "@/lib/format";
import { useCollection } from "@/lib/useCollection";
import { APPOINTMENT_STATUSES, Appointment, AppointmentStatus, TOPICS_FALLBACK } from "@/lib/types";
import { validate, Errors } from "@/lib/validate";
import { useUI } from "@/components/UIProvider";

const PER = 8; const TIMES = Array.from({ length: 8 }, (_, i) => `${String(10 + i).padStart(2, "0")}:00`);

export default function Appointments() {
  const { data, setData, loading, error, reload } = useCollection<Appointment>("appointments");
  const { toast, confirm } = useUI();
  const [q, setQ] = useState(""); const [st, setSt] = useState("All"); const [when, setWhen] = useState("all"); const [page, setPage] = useState(1);
  const [view, setView] = useState<Appointment | null>(null); const [adding, setAdding] = useState(false); const today = todayISO();

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data.filter((x) => (st === "All" || x.status === st) && (when === "all" || (when === "today" ? x.date === today : when === "upcoming" ? x.date >= today : x.date < today)) &&
      (!s || [x.name, x.email, x.phone, x.topic].join(" ").toLowerCase().includes(s)))
      .sort((a, b) => { // upcoming first (soonest on top), then past ones newest first
        const ka = (a.date || "") + (a.time || ""), kb = (b.date || "") + (b.time || ""), ua = (a.date || "") >= today, ub = (b.date || "") >= today;
        return ua !== ub ? (ua ? -1 : 1) : ua ? ka.localeCompare(kb) : kb.localeCompare(ka);
      });
  }, [data, q, st, when, today]);
  const pages = Math.max(1, Math.ceil(rows.length / PER)); const cur = Math.min(page, pages); const shown = rows.slice((cur - 1) * PER, cur * PER);

  async function patch(x: Appointment, p: Partial<Appointment>, msg = "Appointment updated") {
    if (p.date || p.time) { // prevent double-booking the same slot
      const d = p.date ?? x.date, t = p.time ?? x.time;
      if (t && data.some((r) => r.id !== x.id && r.date === d && r.time === t && r.status !== "Cancelled")) { toast("That time slot is already booked.", "err"); reload(); return; }
    }
    const before = data; setData(data.map((r) => (r.id === x.id ? { ...r, ...p } : r))); setView((v) => (v && v.id === x.id ? { ...v, ...p } : v));
    try { await appointmentApi.update(x.id, p); activityApi.log("updated", "appointment", `${x.name}: ${p.status ? "status changed to " + p.status : "rescheduled"}`); toast(msg); }
    catch (e) { setData(before); toast(e instanceof Error ? e.message : "Update failed", "err"); }
  }
  async function del(x: Appointment) {
    if (!(await confirm({ title: "Delete this appointment?", message: `${x.name}'s appointment on ${fmtDate(x.date)} will be removed.`, confirmLabel: "Delete", danger: true }))) return;
    try { await appointmentApi.remove(x.id); setData(data.filter((r) => r.id !== x.id)); setView(null); activityApi.log("deleted", "appointment", `Deleted appointment for ${x.name}`); toast("Appointment deleted"); }
    catch (e) { toast(e instanceof Error ? e.message : "Delete failed", "err"); }
  }
  const exportCsv = () => { download("appointments.csv", toCSV(rows, [["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["date", "Date"], ["time", "Time"], ["mode", "Mode"], ["topic", "Topic"], ["status", "Status"]])); toast(`Exported ${rows.length} appointments`); };
  const counts = (s: string) => (s === "All" ? data.length : data.filter((x) => x.status === s).length);

  return (<>
    <div className="ph"><div><h1>Manage appointments</h1><p className="mu">Confirm bookings, reschedule and keep the calendar tidy.</p></div>
      <div className="acts"><button className="btn o" onClick={exportCsv} disabled={!rows.length}><Icon n="download" s={16} /> Export CSV</button><button className="btn" onClick={() => setAdding(true)}><Icon n="plus" s={16} /> New appointment</button></div></div>
    <div className="tabs">{["All", ...APPOINTMENT_STATUSES].map((s) => <button key={s} className={st === s ? "on" : ""} onClick={() => { setSt(s); setPage(1); }}>{s}<span className="cnt">{counts(s)}</span></button>)}</div>
    <div className="toolbar"><div className="search"><Icon n="search" s={16} /><input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name, email, phone or topic" aria-label="Search appointments" /></div>
      <select value={when} onChange={(e) => { setWhen(e.target.value); setPage(1); }} aria-label="When"><option value="all">All dates</option><option value="today">Today</option><option value="upcoming">Upcoming</option><option value="past">Past</option></select></div>

    {error ? <ErrorBox msg={error} retry={reload} /> : loading ? <Skeleton rows={5} /> : shown.length === 0 ? <Empty icon="📅" title="No appointments found">{data.length ? "Try clearing the search or filters." : "Booked sessions will appear here."}</Empty> : (
      <div className="tw"><table><thead><tr><th>Student</th><th>Topic</th><th>Date</th><th>Time</th><th>Status</th><th></th></tr></thead><tbody>
        {shown.map((x) => <tr key={x.id}>
          <td><div className="who"><Avatar name={x.name} /><span><b>{x.name}</b><span className="mu sm">{x.email}</span></span></div></td>
          <td>{x.topic}<br /><span className="mu sm">{x.mode}</span></td>
          <td><input type="date" value={x.date} onChange={(e) => e.target.value && patch(x, { date: e.target.value }, "Date updated")} aria-label={`Date for ${x.name}`} /><span className="mu sm">{relDay(x.date)}</span></td>
          <td><select value={x.time || ""} onChange={(e) => patch(x, { time: e.target.value }, "Time updated")} aria-label={`Time for ${x.name}`}>{!x.time && <option value="">—</option>}{TIMES.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</select></td>
          <td><select value={x.status} onChange={(e) => patch(x, { status: e.target.value as AppointmentStatus }, "Status updated")} aria-label={`Status for ${x.name}`}>{APPOINTMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
          <td><div className="acts">{x.status === "Pending" && <button className="btn s" onClick={() => patch(x, { status: "Confirmed" }, "Appointment confirmed")}>Confirm</button>}<button className="btn s o" onClick={() => setView(x)}>View</button><button className="btn s d" onClick={() => del(x)}>Delete</button></div></td></tr>)}</tbody></table></div>)}
    {!loading && !error && <Pager page={cur} pages={pages} total={rows.length} per={PER} set={setPage} />}

    {view && <Drawer title={view.name} onClose={() => setView(null)}><Badge s={view.status} />
      <dl className="kv"><dt>Email</dt><dd><a href={`mailto:${view.email}`}>{view.email}</a></dd><dt>Phone</dt><dd><a href={`tel:${view.phone}`}>{view.phone}</a></dd><dt>Topic</dt><dd>{view.topic}</dd><dt>Mode</dt><dd>{view.mode}</dd><dt>When</dt><dd>{fmtDate(view.date)} · {fmtTime(view.time) || "time not set"} ({relDay(view.date)})</dd><dt>Note</dt><dd>{view.message || "—"}</dd></dl>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {view.status !== "Confirmed" && <button className="btn s" onClick={() => patch(view, { status: "Confirmed" }, "Appointment confirmed")}>Confirm</button>}
        {view.status !== "Completed" && <button className="btn s o" onClick={() => patch(view, { status: "Completed" }, "Marked as completed")}>Mark completed</button>}
        {view.status !== "Cancelled" && <button className="btn s o" onClick={() => patch(view, { status: "Cancelled" }, "Appointment cancelled")}>Cancel</button>}
        <a className="btn s o" href={`mailto:${view.email}?subject=Your Northbound appointment on ${view.date}`}>Email</a><button className="btn s d" onClick={() => del(view)}>Delete</button></div></Drawer>}
    {adding && <AddAppt existing={data} onClose={() => setAdding(false)} onAdded={() => { setAdding(false); reload(); toast("Appointment created"); }} />}
  </>);
}

function AddAppt({ existing, onClose, onAdded }: { existing: Appointment[]; onClose: () => void; onAdded: () => void }) {
  const [v, setV] = useState({ name: "", email: "", phone: "", date: todayISO(), time: "10:00", mode: "Online", topic: TOPICS_FALLBACK[0], message: "" });
  const [errs, setErrs] = useState<Errors>({}); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const set = (k: string, val: string) => { setV((p) => ({ ...p, [k]: val })); setErrs((p) => ({ ...p, [k]: "" })); };
  async function submit(e: FormEvent) {
    e.preventDefault(); const er = validate(v, ["name", "email", "phone", "date"]);
    if (!er.date && existing.some((r) => r.date === v.date && r.time === v.time && r.status !== "Cancelled")) er.time = "That slot is already booked.";
    setErrs(er); if (Object.keys(er).length) return;
    setBusy(true); try { await appointmentApi.create(v, "Admin"); onAdded(); } catch (x) { setErr(x instanceof Error ? x.message : "Failed"); setBusy(false); }
  }
  return <Modal title="New appointment" onClose={onClose}><form onSubmit={submit} noValidate>{err && <ErrorBox msg={err} />}
    <Field name="name" label="Full name" value={v.name} error={errs.name} onChange={set} /><div className="row2"><Field name="email" label="Email" value={v.email} error={errs.email} onChange={set} /><Field name="phone" label="Phone" value={v.phone} error={errs.phone} onChange={set} /></div>
    <div className="row2"><Field name="date" label="Date" type="date" value={v.date} error={errs.date} onChange={set} /><div><label htmlFor="time">Time</label><select id="time" value={v.time} onChange={(e) => set("time", e.target.value)}>{TIMES.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</select><div className="err">{errs.time}</div></div></div>
    <div className="row2"><Field name="mode" label="Mode" value={v.mode} options={["Online", "In office"]} onChange={set} /><Field name="topic" label="Topic" value={v.topic} options={TOPICS_FALLBACK} onChange={set} /></div>
    <div className="btns"><button type="button" className="btn o" onClick={onClose}>Cancel</button><button className="btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button></div></form></Modal>;
}
