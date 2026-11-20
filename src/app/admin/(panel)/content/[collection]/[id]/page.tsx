"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ErrorBox, Skeleton } from "@/components/Bits";
import Field from "@/components/Field";
import { useUI } from "@/components/UIProvider";
import { activityApi } from "@/lib/api";
import { CONTENT, contentApi } from "@/lib/contentApi";
import { todayISO } from "@/lib/format";
import { Errors } from "@/lib/validate";

export default function ContentForm() {
  const { collection, id } = useParams<{ collection: string; id: string }>();
  const cfg = CONTENT[collection]; const isNew = id === "new"; const router = useRouter(); const { toast } = useUI();
  const [v, setV] = useState<Record<string, string>>(() => isNew && cfg ? Object.fromEntries(cfg.fields.map((f) => [f.key, f.type === "date" ? todayISO() : ""])) : {}); const [errs, setErrs] = useState<Errors>({});
  const [loading, setLoading] = useState(!isNew); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!cfg) return;
    if (isNew) return;
    contentApi.get<Record<string, unknown>>(collection, id)
      .then((r) => setV(Object.fromEntries(cfg.fields.map((f) => [f.key, Array.isArray(r[f.key]) ? (r[f.key] as string[]).join(", ") : String(r[f.key] ?? "")]))))
      .catch((e) => setErr(e.status === 404 ? "This item no longer exists." : e.message)).finally(() => setLoading(false));
  }, [cfg, collection, id, isNew]);

  if (!cfg) return <><h1>Manage website content</h1><ErrorBox msg="Unknown content type." /></>;
  const set = (k: string, val: string) => { setV((p) => ({ ...p, [k]: val })); setErrs((p) => ({ ...p, [k]: "" })); };

  async function submit(e: FormEvent) {
    e.preventDefault(); const er: Errors = {};
    cfg.fields.forEach((f) => { if (f.required && !String(v[f.key] ?? "").trim()) er[f.key] = "This field is required."; });
    setErrs(er); if (Object.keys(er).length) return;
    const body: Record<string, unknown> = {};
    cfg.fields.forEach((f) => { const val = (v[f.key] ?? "").trim(); body[f.key] = f.type === "list" ? val.split(",").map((s) => s.trim()).filter(Boolean) : val; });
    setBusy(true);
    try {
      if (isNew) await contentApi.create(collection, body); else await contentApi.update(collection, id, body);
      activityApi.log(isNew ? "created" : "updated", collection, `${isNew ? "Added" : "Edited"} ${cfg.singular}: ${String(body[cfg.titleKey]).slice(0, 50)}`);
      toast(isNew ? "Added to the website" : "Changes saved"); router.push(`/admin/content/${collection}`);
    } catch (x) { setErr(x instanceof Error ? x.message : "Could not save."); setBusy(false); }
  }

  return (<>
    <h1>Manage website content</h1>
    <div className="tabs">{Object.entries(CONTENT).map(([k, c]) => <Link key={k} href={`/admin/content/${k}`} className={k === collection ? "on" : ""}>{c.label}</Link>)}</div>
    <h2>{isNew ? "Add" : "Edit"} {cfg.singular}</h2>
    {loading ? <Skeleton rows={4} /> : err && !Object.keys(v).length ? <ErrorBox msg={err} /> : (
      <form className="f" onSubmit={submit} noValidate>{err && <ErrorBox msg={err} />}
        {cfg.fields.map((f) => <Field key={f.key} name={f.key} label={f.label + (f.required ? "" : " (optional)")} hint={f.hint} type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"} rows={f.type === "textarea" ? 4 : undefined} value={v[f.key] ?? ""} error={errs[f.key]} onChange={set} />)}
        <br /><button className="btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button> <Link className="btn o" href={`/admin/content/${collection}`}>Cancel</Link>
      </form>)}
  </>);
}
