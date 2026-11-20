"use client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

type Kind = "ok" | "err";
type ConfirmOpts = { title: string; message?: string; confirmLabel?: string; danger?: boolean };
type Ctx = { toast: (m: string, k?: Kind) => void; confirm: (o: ConfirmOpts) => Promise<boolean> };
const UI = createContext<Ctx | null>(null);
export const useUI = () => { const c = useContext(UI); if (!c) throw new Error("UIProvider missing"); return c; };

export default function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; m: string; k: Kind }[]>([]);
  const [dlg, setDlg] = useState<(ConfirmOpts & { res: (v: boolean) => void }) | null>(null);
  const n = useRef(0);

  const toast = useCallback((m: string, k: Kind = "ok") => {
    const id = ++n.current; setToasts((t) => [...t, { id, m, k }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((res) => setDlg({ ...o, res })), []);
  const close = (v: boolean) => { dlg?.res(v); setDlg(null); };

  useEffect(() => {
    if (!dlg) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && close(false);
    addEventListener("keydown", h); return () => removeEventListener("keydown", h);
  });

  return (
    <UI.Provider value={{ toast, confirm }}>
      {children}
      <div className="toasts" aria-live="polite">{toasts.map((t) => <div key={t.id} className={`toast ${t.k === "err" ? "err" : ""}`} role="status">{t.m}</div>)}</div>
      {dlg && (<>
        <div className="ov" onClick={() => close(false)} />
        <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="cd-t">
          <h3 id="cd-t">{dlg.title}</h3>
          {dlg.message && <p className="mu" style={{ margin: 0 }}>{dlg.message}</p>}
          <div className="btns">
            <button className="btn o" onClick={() => close(false)}>Cancel</button>
            <button className={`btn ${dlg.danger ? "d" : ""}`} autoFocus onClick={() => close(true)}>{dlg.confirmLabel || "Confirm"}</button>
          </div>
        </div>
      </>)}
    </UI.Provider>
  );
}
