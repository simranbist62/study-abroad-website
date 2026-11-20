"use client";
import { useMemo, useState } from "react";
import { Empty, ErrorBox, Skeleton } from "@/components/Bits";
import { useUI } from "@/components/UIProvider";
import { activityApi } from "@/lib/api";
import { fmtDate, timeAgo } from "@/lib/format";
import { useCollection } from "@/lib/useCollection";
import { Activity } from "@/lib/types";

export default function ActivityLog() {
  const { data, setData, loading, error, reload } = useCollection<Activity>("activity");
  const { toast, confirm } = useUI(); const [f, setF] = useState("All");
  const types = ["All", "enquiry", "appointment", "destinations", "services", "testimonials", "blog", "faqs"];
  const rows = useMemo(() => data.filter((x) => f === "All" || x.entity === f).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 60), [data, f]);

  async function clear() {
    if (!(await confirm({ title: "Clear the activity log?", message: "All log entries will be deleted. Your enquiries and appointments are not affected.", confirmLabel: "Clear log", danger: true }))) return;
    try { await Promise.all(data.map((x) => activityApi.remove(x.id))); setData([]); toast("Activity log cleared"); } catch (e) { toast(e instanceof Error ? e.message : "Failed", "err"); reload(); }
  }
  return (<>
    <div className="ph"><div><h1>Activity log</h1><p className="mu">Everything that changed on the website and in the admin.</p></div><div className="acts"><button className="btn o" onClick={clear} disabled={!data.length}>Clear log</button></div></div>
    <div className="tabs">{types.map((t) => <button key={t} className={f === t ? "on" : ""} onClick={() => setF(t)}>{t === "All" ? "All" : t[0].toUpperCase() + t.slice(1)}</button>)}</div>
    {error ? <ErrorBox msg={error} retry={reload} /> : loading ? <Skeleton rows={5} /> : rows.length === 0 ? <Empty icon="🕑" title="No activity yet">Actions appear here as soon as something changes.</Empty> : (
      <div className="tl">{rows.map((x) => <div key={x.id} className={`it ${x.action === "deleted" ? "del" : x.action === "created" ? "new" : ""}`}><b>{x.detail}</b><div className="mu sm">{x.actor} · {timeAgo(x.at)} · {fmtDate(x.at.slice(0, 10))}</div></div>)}</div>)}
  </>);
}
