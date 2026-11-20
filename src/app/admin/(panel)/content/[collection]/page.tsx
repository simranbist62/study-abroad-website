"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Empty, ErrorBox, Skeleton } from "@/components/Bits";
import Icon from "@/components/Icon";
import { useUI } from "@/components/UIProvider";
import { activityApi } from "@/lib/api";
import { CONTENT, contentApi } from "@/lib/contentApi";
import { useCollection } from "@/lib/useCollection";

type Item = { id: string | number } & Record<string, unknown>;
const text = (v: unknown) => (Array.isArray(v) ? v.join(", ") : String(v ?? ""));
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n) + "…" : s);

export default function ContentList() {
  const { collection } = useParams<{ collection: string }>();
  const cfg = CONTENT[collection];
  const { data, setData, loading, error, reload } = useCollection<Item>(cfg ? collection : "services");
  const { toast, confirm } = useUI(); const [q, setQ] = useState("");
  const rows = useMemo(() => { const s = q.trim().toLowerCase(); return s ? data.filter((x) => JSON.stringify(x).toLowerCase().includes(s)) : data; }, [data, q]);

  const tabs = <div className="tabs">{Object.entries(CONTENT).map(([k, c]) => <Link key={k} href={`/admin/content/${k}`} className={k === collection ? "on" : ""}>{c.label}</Link>)}</div>;
  if (!cfg) return <><h1>Manage website content</h1>{tabs}<Empty icon="🤔" title="Unknown content type">Pick one of the tabs above.</Empty></>;

  async function del(x: Item) {
    const title = text(x[cfg.titleKey]);
    if (!(await confirm({ title: `Delete this ${cfg.singular}?`, message: `“${cut(title, 60)}” will be removed from the website.`, confirmLabel: "Delete", danger: true }))) return;
    try { await contentApi.remove(collection, x.id); setData(data.filter((r) => r.id !== x.id)); activityApi.log("deleted", collection, `Deleted ${cfg.singular}: ${cut(title, 50)}`); toast("Deleted"); }
    catch (e) { toast(e instanceof Error ? e.message : "Delete failed", "err"); }
  }

  return (<>
    <div className="ph"><div><h1>Manage website content</h1><p className="mu">Changes appear on the public website straight away.</p></div></div>
    {tabs}
    <div className="toolbar"><div className="search"><Icon n="search" s={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${cfg.label.toLowerCase()}`} aria-label="Search content" /></div>
      <Link className="btn" href={`/admin/content/${collection}/new`}><Icon n="plus" s={16} /> Add new</Link></div>
    {error ? <ErrorBox msg={error} retry={reload} /> : loading ? <Skeleton rows={5} /> : rows.length === 0 ? <Empty icon={cfg.emoji} title={data.length ? "No matches" : `No ${cfg.label.toLowerCase()} yet`}>{data.length ? "Try a different search." : "Add the first item."}</Empty> : (
      <div className="tw"><table><tbody>{rows.map((x) => <tr key={x.id}>
        <td style={{ width: "34%" }}><b>{cut(text(x[cfg.titleKey]), 70)}</b></td><td className="mu">{cut(text(x[cfg.subKey]), 90)}</td>
        <td style={{ width: 170 }}><div className="acts"><Link className="btn s o" href={`/admin/content/${collection}/${x.id}`}>Edit</Link><button className="btn s d" onClick={() => del(x)}>Delete</button></div></td></tr>)}</tbody></table></div>)}
    {!loading && !error && <p className="mu sm" style={{ marginTop: ".8rem" }}>{rows.length} {cfg.label.toLowerCase()}</p>}
  </>);
}
