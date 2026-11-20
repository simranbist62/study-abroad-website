"use client";
import { FormEvent, useMemo, useState } from "react";
import { Avatar, Badge, Drawer, Empty, ErrorBox, Modal, Pager, Skeleton } from "@/components/Bits";
import Field from "@/components/Field";
import Icon from "@/components/Icon";
import { activityApi, appointmentApi, enquiryApi } from "@/lib/api";
import { download, fmtDate, toCSV } from "@/lib/format";
import { useCollection } from "@/lib/useCollection";
import { COUNTRIES_FALLBACK, ENQUIRY_STATUSES, Enquiry, EnquiryStatus, LEVELS } from "@/lib/types";
import { validate, Errors } from "@/lib/validate";
import { useUI } from "@/components/UIProvider";

const PER = 8;

export default function Enquiries() {
  const { data, setData, loading, error, reload } = useCollection<Enquiry>("enquiries");
  const { toast, confirm } = useUI();
  const [q, setQ] = useState(""); const [st, setSt] = useState("All"); const [country, setCountry] = useState("All"); const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1); const [view, setView] = useState<Enquiry | null>(null); const [adding, setAdding] = useState(false);

  const countries = useMemo(() => ["All", ...Array.from(new Set(data.map((x) => x.country))).sort()], [data]);
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = data.filter((x) => (st === "All" || x.status === st) && (country === "All" || x.country === country) &&
      (!s || [x.name, x.email, x.phone, x.message, x.country].join(" ").toLowerCase().includes(s)));
    const key = (x: Enquiry) => x.createdAt || x.date;
    return r.sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "oldest" ? key(a).localeCompare(key(b)) : key(b).localeCompare(key(a)));
  }, [data, q, st, country, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PER)); const cur = Math.min(page, pages); const shown = rows.slice((cur - 1) * PER, cur * PER);

  async function patch(x: Enquiry, p: Partial<Enquiry>, msg?: string) {
    const before = data; setData(data.map((r) => (r.id === x.id ? { ...r, ...p } : r))); setView((v) => (v && v.id === x.id ? { ...v, ...p } : v));
    try { await enquiryApi.update(x.id, p); if (p.status) activityApi.log("updated", "enquiry", `${x.name}: status changed to ${p.status}`); if (msg) toast(msg); }
    catch (e) { setData(before); toast(e instanceof Error ? e.message : "Update failed", "err"); }
  }
  async function del(x: Enquiry) {
    if (!(await confirm({ title: "Delete this enquiry?", message: `${x.name}'s enquiry will be removed. This can’t be undone.`, confirmLabel: "Delete", danger: true }))) return;
    try { await enquiryApi.remove(x.id); setData(data.filter((r) => r.id !== x.id)); setView(null); activityApi.log("deleted", "enquiry", `Deleted enquiry from ${x.name}`); toast("Enquiry deleted"); }
    catch (e) { toast(e instanceof Error ? e.message : "Delete failed", "err"); }
  }
  async function toAppointment(x: Enquiry) {
    try { await appointmentApi.create({ name: x.name, email: x.email, phone: x.phone, date: new Date(Date.now() + 864e5).toISOString().slice(0, 10), time: "10:00", mode: "Online", topic: "Career counselling", message: `From enquiry: ${x.message}` }, "Admin");
      await patch(x, { status: "In progress" }); toast("Appointment created for tomorrow 10:00 AM. Adjust it in Appointments."); }
    catch (e) { toast(e instanceof Error ? e.message : "Could not create appointment", "err"); }
  }
  const exportCsv = () => { download("enquiries.csv", toCSV(rows, [["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["country", "Country"], ["level", "Level"], ["intake", "Intake"], ["message", "Message"], ["status", "Status"], ["note", "Note"], ["date", "Date"]])); toast(`Exported ${rows.length} enquiries`); };
  const counts = (s: string) => (s === "All" ? data.length : data.filter((x) => x.status === s).length);

  return (<>
    <div className="ph"><div><h1>Manage enquiries</h1><p className="mu">Reply to students, update status and keep follow-up notes.</p></div>
      <div className="acts"><button className="btn o" onClick={exportCsv} disabled={!rows.length}><Icon n="download" s={16} /> Export CSV</button><button className="btn" onClick={() => setAdding(true)}><Icon n="plus" s={16} /> Add enquiry</button></div></div>

    <div className="tabs">{["All", ...ENQUIRY_STATUSES].map((s) => <button key={s} className={st === s ? "on" : ""} onClick={() => { setSt(s); setPage(1); }}>{s}<span className="cnt">{counts(s)}</span></button>)}</div>
    <div className="toolbar">
      <div className="search"><Icon n="search" s={16} /><input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name, email, phone or message" aria-label="Search enquiries" /></div>
      <select value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }} aria-label="Country">{countries.map((c) => <option key={c}>{c}</option>)}</select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option></select>
    </div>

    {error ? <ErrorBox msg={error} retry={reload} /> : loading ? <Skeleton rows={5} /> : shown.length === 0 ? <Empty title="No enquiries found">{data.length ? "Try clearing the search or filters." : "New enquiries from the website will appear here."}</Empty> : (
      <div className="tw"><table><thead><tr><th>Student</th><th>Details</th><th>Status</th><th>Follow-up note</th><th></th></tr></thead><tbody>
        {shown.map((x) => <tr key={x.id}>
          <td><div className="who"><Avatar name={x.name} /><span><b>{x.name}</b><span className="mu sm">{x.email}<br />{x.phone}</span></span></div></td>
          <td>{x.country}{x.level && <span className="mu sm"> · {x.level}</span>}<br /><span className="mu">{(x.message || "").length > 70 ? (x.message || "").slice(0, 70) + "…" : x.message}</span><br /><span className="mu sm">{fmtDate(x.date)}</span></td>
          <td><select value={x.status} onChange={(e) => patch(x, { status: e.target.value as EnquiryStatus }, "Status updated")} aria-label={`Status for ${x.name}`}>{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
          <td><input defaultValue={x.note} placeholder="Add a note…" aria-label={`Note for ${x.name}`} onBlur={(e) => e.target.value !== x.note && patch(x, { note: e.target.value }, "Note saved")} /></td>
          <td><div className="acts"><button className="btn s o" onClick={() => setView(x)}>View</button><button className="btn s d" onClick={() => del(x)}>Delete</button></div></td></tr>)}</tbody></table></div>)}
    {!loading && !error && <Pager page={cur} pages={pages} total={rows.length} per={PER} set={setPage} />}

    {view && <Drawer title={view.name} onClose={() => setView(null)}>
      <Badge s={view.status} />
      <dl className="kv"><dt>Email</dt><dd><a href={`mailto:${view.email}`}>{view.email}</a></dd><dt>Phone</dt><dd><a href={`tel:${view.phone}`}>{view.phone}</a></dd><dt>Country</dt><dd>{view.country}</dd>
        <dt>Level</dt><dd>{view.level || "—"}</dd><dt>Intake</dt><dd>{view.intake || "—"}</dd><dt>Received</dt><dd>{fmtDate(view.date)}</dd><dt>Message</dt><dd>{view.message}</dd></dl>
      <label htmlFor="dn">Follow-up note</label><textarea id="dn" rows={3} defaultValue={view.note} onBlur={(e) => e.target.value !== view.note && patch(view, { note: e.target.value }, "Note saved")} />
      <label htmlFor="ds">Status</label><select id="ds" value={view.status} onChange={(e) => patch(view, { status: e.target.value as EnquiryStatus }, "Status updated")}>{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      <div className="acts" style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: "1.2rem" }}>
        <a className="btn s" href={`mailto:${view.email}?subject=Your study abroad enquiry`}><Icon n="mail" s={14} /> Email</a>
        <a className="btn s o" href={`https://wa.me/${(view.phone || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"><Icon n="chat" s={14} /> WhatsApp</a>
        <button className="btn s a" onClick={() => toAppointment(view)}><Icon n="cal" s={14} /> Book appointment</button>
        <button className="btn s d" onClick={() => del(view)}>Delete</button></div>
    </Drawer>}
    {adding && <AddEnquiry onClose={() => setAdding(false)} onAdded={() => { setAdding(false); reload(); toast("Enquiry added"); }} />}
  </>);
}

function AddEnquiry({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [v, setV] = useState({ name: "", email: "", phone: "", country: COUNTRIES_FALLBACK[0], level: LEVELS[2], intake: "September", message: "" });
  const [errs, setErrs] = useState<Errors>({}); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const set = (k: string, val: string) => { setV((p) => ({ ...p, [k]: val })); setErrs((p) => ({ ...p, [k]: "" })); };
  async function submit(e: FormEvent) {
    e.preventDefault(); const er = validate(v, ["name", "email", "phone", "message"]); setErrs(er); if (Object.keys(er).length) return;
    setBusy(true); try { await enquiryApi.create(v, "Admin"); onAdded(); } catch (x) { setErr(x instanceof Error ? x.message : "Failed"); setBusy(false); }
  }
  return <Modal title="Add enquiry" onClose={onClose}><form onSubmit={submit} noValidate>{err && <ErrorBox msg={err} />}
    <Field name="name" label="Full name" value={v.name} error={errs.name} onChange={set} /><div className="row2"><Field name="email" label="Email" value={v.email} error={errs.email} onChange={set} /><Field name="phone" label="Phone" value={v.phone} error={errs.phone} onChange={set} /></div>
    <div className="row2"><Field name="country" label="Country" value={v.country} options={COUNTRIES_FALLBACK} onChange={set} /><Field name="level" label="Level" value={v.level} options={LEVELS} onChange={set} /></div>
    <Field name="message" label="Message" rows={3} value={v.message} error={errs.message} onChange={set} />
    <div className="btns"><button type="button" className="btn o" onClick={onClose}>Cancel</button><button className="btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button></div></form></Modal>;
}
