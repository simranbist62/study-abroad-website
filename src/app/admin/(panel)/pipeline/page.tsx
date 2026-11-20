"use client";
import Link from "next/link";
import { useState } from "react";
import { Avatar, Empty, ErrorBox, Skeleton } from "@/components/Bits";
import { useUI } from "@/components/UIProvider";
import { activityApi, enquiryApi } from "@/lib/api";
import { relDay } from "@/lib/format";
import { useCollection } from "@/lib/useCollection";
import { ENQUIRY_STATUSES, Enquiry, EnquiryStatus } from "@/lib/types";

export default function Pipeline() {
  const { data, setData, loading, error, reload } = useCollection<Enquiry>("enquiries");
  const { toast } = useUI(); const [drag, setDrag] = useState<string | null>(null); const [over, setOver] = useState<string | null>(null);

  async function move(id: string, status: EnquiryStatus) {
    const x = data.find((r) => String(r.id) === id); if (!x || x.status === status) return;
    const before = data; setData(data.map((r) => (r.id === x.id ? { ...r, status } : r)));
    try { await enquiryApi.update(x.id, { status }); activityApi.log("updated", "enquiry", `${x.name}: status changed to ${status}`); toast(`${x.name} → ${status}`); }
    catch (e) { setData(before); toast(e instanceof Error ? e.message : "Could not move card", "err"); }
  }

  return (<>
    <div className="ph"><div><h1>Enquiry pipeline</h1><p className="mu">Drag cards between columns, or use the dropdown on a card.</p></div><div className="acts"><Link className="btn o" href="/admin/enquiries">Table view</Link></div></div>
    {error ? <ErrorBox msg={error} retry={reload} /> : loading ? <Skeleton rows={4} /> : data.length === 0 ? <Empty title="No enquiries yet">Leads from the website appear here.</Empty> : (
      <div className="kan">{ENQUIRY_STATUSES.map((s) => { const items = data.filter((x) => x.status === s); return (
        <section key={s} className={`col ${over === s ? "over" : ""}`} aria-label={s}
          onDragOver={(e) => { e.preventDefault(); setOver(s); }} onDragLeave={() => setOver(null)}
          onDrop={(e) => { e.preventDefault(); setOver(null); const id = e.dataTransfer.getData("text/plain") || drag; if (id) move(id, s); setDrag(null); }}>
          <h3><span className="badge" data-s={s}>{s}</span><span className="mu">{items.length}</span></h3>
          {items.map((x) => (
            <article key={x.id} className={`kc ${drag === String(x.id) ? "drag" : ""}`} draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(x.id)); setDrag(String(x.id)); }} onDragEnd={() => { setDrag(null); setOver(null); }}>
              <div className="who"><Avatar name={x.name} sm /><span><b>{x.name}</b><span className="mu sm">{x.country}{x.level ? ` · ${x.level}` : ""}</span></span></div>
              <p className="mu sm" style={{ margin: ".5rem 0 0" }}>{(x.message || "").length > 80 ? (x.message || "").slice(0, 80) + "…" : x.message}</p>
              <p className="mu sm" style={{ margin: ".3rem 0 0" }}>{relDay(x.date)}</p>
              <select value={x.status} onChange={(e) => move(String(x.id), e.target.value as EnquiryStatus)} aria-label={`Move ${x.name}`}>{ENQUIRY_STATUSES.map((o) => <option key={o}>{o}</option>)}</select>
            </article>))}
          {items.length === 0 && <p className="mu sm" style={{ textAlign: "center", marginTop: "2rem" }}>Drop here</p>}
        </section>); })}</div>)}
  </>);
}
