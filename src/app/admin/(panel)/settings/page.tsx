"use client";
import { FormEvent, useEffect, useState } from "react";
import { ErrorBox, Skeleton } from "@/components/Bits";
import Field from "@/components/Field";
import { useUI } from "@/components/UIProvider";
import { activityApi, api, appointmentApi, enquiryApi, settingsApi } from "@/lib/api";
import { changePassword } from "@/lib/auth";
import { download } from "@/lib/format";
import { DEFAULT_SETTINGS, Settings } from "@/lib/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SettingsPage() {
  const { toast, confirm } = useUI();
  const [s, setS] = useState<Settings | null>(null); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState("system"); const [pw, setPw] = useState({ old: "", next: "", again: "" }); const [pwErr, setPwErr] = useState("");

  useEffect(() => {
    settingsApi.get().then(setS).catch((e) => setErr(e.message));
    const timer = window.setTimeout(() => {
      try { setTheme(localStorage.getItem("sac_theme") || "system"); } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (err) return <><h1>Settings</h1><ErrorBox msg={err} /></>;
  if (!s) return <><h1>Settings</h1><Skeleton rows={4} /></>;
  const up = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });
  const set = (k: string, v: string) => up(k as keyof Settings, (k === "slotMinutes" ? +v : v) as never);

  async function save(e: FormEvent) {
    e.preventDefault(); if (!s) return;
    if (s.officeStart >= s.officeEnd) { toast("Closing time must be after opening time.", "err"); return; }
    setBusy(true);
    try { const saved = await settingsApi.save({ ...s, id: s.id ?? DEFAULT_SETTINGS.id }); setS({ ...s, ...saved }); activityApi.log("updated", "settings", "Updated office settings"); toast("Settings saved"); }
    catch (x) { toast(x instanceof Error ? x.message : "Could not save", "err"); } finally { setBusy(false); }
  }
  function applyTheme(t: string) {
    setTheme(t);
    try { if (t === "system") { localStorage.removeItem("sac_theme"); document.documentElement.removeAttribute("data-theme"); } else { localStorage.setItem("sac_theme", t); document.documentElement.setAttribute("data-theme", t); } } catch {}
  }
  function pass(e: FormEvent) {
    e.preventDefault(); setPwErr("");
    if (pw.next.length < 6) return setPwErr("New password must be at least 6 characters.");
    if (pw.next !== pw.again) return setPwErr("New passwords do not match.");
    if (!changePassword(pw.old, pw.next)) return setPwErr("Current password is incorrect.");
    setPw({ old: "", next: "", again: "" }); toast("Password changed (demo only, stored in this browser)");
  }
  async function exportAll() {
    try { const [enquiries, appointments, activity] = await Promise.all([enquiryApi.list(), appointmentApi.list(), activityApi.list()]);
      const content = Object.fromEntries(await Promise.all(["destinations", "services", "testimonials", "blog", "faqs"].map(async (c) => [c, await api.list(c)])));
      download("northbound-backup.json", JSON.stringify({ enquiries, appointments, activity, ...content }, null, 2), "application/json"); toast("Backup downloaded"); }
    catch (x) { toast(x instanceof Error ? x.message : "Export failed", "err"); }
  }
  async function cleanup(kind: "enq" | "apt") {
    const ok = await confirm({ title: kind === "enq" ? "Delete all closed enquiries?" : "Delete all cancelled appointments?", message: "These records will be permanently removed.", confirmLabel: "Delete", danger: true }); if (!ok) return;
    try {
      if (kind === "enq") { const l = (await enquiryApi.list()).filter((x) => x.status === "Closed"); await Promise.all(l.map((x) => enquiryApi.remove(x.id))); activityApi.log("deleted", "enquiry", `Deleted ${l.length} closed enquiries`); toast(`${l.length} enquiries deleted`); }
      else { const l = (await appointmentApi.list()).filter((x) => x.status === "Cancelled"); await Promise.all(l.map((x) => appointmentApi.remove(x.id))); activityApi.log("deleted", "appointment", `Deleted ${l.length} cancelled appointments`); toast(`${l.length} appointments deleted`); }
    } catch (x) { toast(x instanceof Error ? x.message : "Failed", "err"); }
  }

  return (<>
    <div className="ph"><div><h1>Settings</h1><p className="mu">Office hours, notifications, appearance and data tools.</p></div></div>
    <div className="two eq">
      <form className="card" onSubmit={save} noValidate>
        <h3>Profile and office hours</h3>
        <Field name="adminName" label="Your name" value={s.adminName} onChange={set} /><Field name="whatsapp" label="WhatsApp number" value={s.whatsapp} onChange={set} />
        <div className="row2"><Field name="officeStart" label="Opens" type="time" value={s.officeStart} onChange={set} /><Field name="officeEnd" label="Closes" type="time" value={s.officeEnd} onChange={set} /></div>
        <Field name="slotMinutes" label="Session length (minutes)" value={String(s.slotMinutes)} options={["30", "45", "60", "90"]} onChange={set} />
        <label>Closed on</label><div className="tabs" style={{ marginTop: ".3rem" }}>{DAYS.map((d, i) => <button type="button" key={d} className={s.closedDays.includes(i) ? "on" : ""} aria-pressed={s.closedDays.includes(i)} onClick={() => up("closedDays", s.closedDays.includes(i) ? s.closedDays.filter((x) => x !== i) : [...s.closedDays, i])}>{d}</button>)}</div>
        <div className="sw"><div><b>Notify me of new enquiries</b><p className="mu sm">Demo option stored with your settings.</p></div><input type="checkbox" role="switch" aria-label="Notify new enquiries" checked={s.notifyEnquiry} onChange={(e) => up("notifyEnquiry", e.target.checked)} /></div>
        <div className="sw"><div><b>Notify me of new bookings</b><p className="mu sm">Demo option stored with your settings.</p></div><input type="checkbox" role="switch" aria-label="Notify new bookings" checked={s.notifyBooking} onChange={(e) => up("notifyBooking", e.target.checked)} /></div>
        <br /><button className="btn" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
        <p className="mu sm" style={{ marginTop: ".8rem", marginBottom: 0 }}>Office hours are used for the time slots on the Book counselling page.</p>
      </form>
      <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
        <div className="card"><h3>Appearance</h3><div className="tabs" role="group" aria-label="Theme">{["system", "light", "dark"].map((t) => <button key={t} className={theme === t ? "on" : ""} aria-pressed={theme === t} onClick={() => applyTheme(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div></div>
        <form className="card" onSubmit={pass} noValidate><h3>Change password</h3><p className="mu sm">Demonstration only. The password is stored in this browser.</p>
          <label htmlFor="po">Current password</label><input id="po" type="password" autoComplete="current-password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} />
          <label htmlFor="pn">New password</label><input id="pn" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          <label htmlFor="pa">Repeat new password</label><input id="pa" type="password" autoComplete="new-password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} />
          <div className="err" role="alert">{pwErr}</div><button className="btn o">Update password</button></form>
        <div className="card"><h3>Data tools</h3><p className="mu sm">Back up or tidy up the records in JSON Server.</p>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><button className="btn s" onClick={exportAll}>Download backup (JSON)</button><button className="btn s d" onClick={() => cleanup("enq")}>Delete closed enquiries</button><button className="btn s d" onClick={() => cleanup("apt")}>Delete cancelled appointments</button></div></div>
      </div></div>
  </>);
}
