"use client";
import { ReactNode, useEffect, useState } from "react";
import { initials } from "@/lib/format";

export const Badge = ({ s }: { s: string }) => <span className="badge" data-s={s}>{s}</span>;
export const Avatar = ({ name, sm }: { name: string; sm?: boolean }) => <span className={`av ${sm ? "sm" : ""}`}>{initials(name)}</span>;
export const Empty = ({ icon = "📭", title, children }: { icon?: string; title: string; children?: ReactNode }) =>
  <div className="empty"><div className="e">{icon}</div><b>{title}</b><p style={{ margin: ".3rem 0 0" }}>{children}</p></div>;
export const Skeleton = ({ rows = 4 }: { rows?: number }) =>
  <div style={{ display: "grid", gap: ".8rem", margin: "1rem 0" }}>{Array.from({ length: rows }, (_, i) => <div key={i} className="skel" style={{ height: 38 }} />)}</div>;
export const ErrorBox = ({ msg, retry }: { msg: string; retry?: () => void }) =>
  <div className="bad" role="alert">{msg} {retry && <button className="btn s o" onClick={retry} style={{ marginLeft: ".5rem" }}>Try again</button>}</div>;

/** Number that counts up (like the original design's dashboard). */
export function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (to <= 0) return;
    let raf = 0; const t0 = performance.now(), dur = 800;
    const step = (t: number) => { const p = Math.min(1, (t - t0) / dur); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{to <= 0 ? 0 : v}</>;
}

export function Drawer({ onClose, title, children }: { onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === "Escape" && onClose(); addEventListener("keydown", h); return () => removeEventListener("keydown", h); }, [onClose]);
  return (<><div className="ov" onClick={onClose} /><aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
    <button className="x" onClick={onClose} aria-label="Close">×</button><h2 style={{ fontSize: "1.4rem" }}>{title}</h2>{children}</aside></>);
}
export function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === "Escape" && onClose(); addEventListener("keydown", h); return () => removeEventListener("keydown", h); }, [onClose]);
  return (<><div className="ov" onClick={onClose} /><div className="modal" role="dialog" aria-modal="true" aria-label={title}>
    <button className="x" onClick={onClose} aria-label="Close">×</button><h3>{title}</h3>{children}</div></>);
}
export function Pager({ page, pages, total, per, set }: { page: number; pages: number; total: number; per: number; set: (p: number) => void }) {
  if (total <= per) return <div className="pager"><span>{total} record{total === 1 ? "" : "s"}</span></div>;
  return (<div className="pager"><span>Showing {(page - 1) * per + 1}–{Math.min(total, page * per)} of {total}</span>
    <div className="pg"><button className="btn s o" disabled={page <= 1} onClick={() => set(page - 1)}>Previous</button>
      <span style={{ alignSelf: "center" }}>Page {page} / {pages}</span>
      <button className="btn s o" disabled={page >= pages} onClick={() => set(page + 1)}>Next</button></div></div>);
}
