"use client";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Field from "@/components/Field";
import { ErrorBox } from "@/components/Bits";
import { api, appointmentApi, settingsApi } from "@/lib/api";
import { fmtDate, fmtTime, todayISO } from "@/lib/format";
import { validate, Errors } from "@/lib/validate";
import { Appointment, DEFAULT_SETTINGS, Settings, TOPICS_FALLBACK } from "@/lib/types";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const mins = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export default function BookPage() {
  const [v, setV] = useState({ name: "", email: "", phone: "", date: "", time: "", mode: "Online", topic: "", message: "" });
  const [errs, setErrs] = useState<Errors>({});
  const [topics, setTopics] = useState<string[]>(TOPICS_FALLBACK);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [taken, setTaken] = useState<Appointment[]>([]);
  const [busy, setBusy] = useState(false);
  const [apiErr, setApiErr] = useState("");
  const [done, setDone] = useState<Appointment | null>(null);

  useEffect(() => {
    api.list<{ title: string }>("services").then((s) => { if (s.length) { const t = s.map((x) => x.title); setTopics(t); setV((p) => ({ ...p, topic: p.topic || t[0] })); } }).catch(() => setV((p) => ({ ...p, topic: TOPICS_FALLBACK[0] })));
    settingsApi.get().then(setSettings);
    appointmentApi.list().then(setTaken).catch(() => {});
  }, []);

  const set = (k: string, val: string) => { setV((p) => ({ ...p, [k]: val, ...(k === "date" ? { time: "" } : {}) })); setErrs((p) => ({ ...p, [k]: "" })); };

  const closed = v.date && settings.closedDays.includes(new Date(v.date + "T00:00:00").getDay());
  const slots = useMemo(() => {
    if (!v.date || closed) return [];
    const out: { t: string; off: boolean }[] = []; const now = new Date(); const isToday = v.date === todayISO();
    for (let m = mins(settings.officeStart); m + settings.slotMinutes <= mins(settings.officeEnd); m += settings.slotMinutes) {
      const t = hhmm(m);
      const busyAlready = taken.some((a) => a.date === v.date && a.time === t && a.status !== "Cancelled");
      const past = isToday && m <= now.getHours() * 60 + now.getMinutes();
      out.push({ t, off: busyAlready || past });
    }
    return out;
  }, [v.date, closed, settings, taken]);

  async function submit(e: FormEvent) {
    e.preventDefault(); setApiErr("");
    const er = validate(v, ["name", "email", "phone", "date", "topic"], { futureDate: true });
    if (!er.date && closed) er.date = `We are closed on ${DAYS[new Date(v.date + "T00:00:00").getDay()]}s. Please pick another day.`;
    if (!er.date && !er.time && !v.time) er.time = "Please pick a time slot.";
    setErrs(er); if (Object.keys(er).length) return;
    setBusy(true);
    try { setDone(await appointmentApi.create(v)); window.scrollTo({ top: 0, behavior: "smooth" }); }
    catch (x) { setApiErr(x instanceof Error ? x.message : "Could not send your request."); }
    finally { setBusy(false); }
  }

  if (done) return (<>
    <h1>Book counselling</h1>
    <div className="ok" role="status">Your appointment request is in. We will confirm by email.</div>
    <div className="card" style={{ maxWidth: 560 }}>
      <h3>Request #{String(done.id)}</h3>
      <dl className="kv"><dt>Name</dt><dd>{done.name}</dd><dt>Topic</dt><dd>{done.topic}</dd><dt>When</dt><dd>{fmtDate(done.date)} at {fmtTime(done.time)}</dd><dt>Mode</dt><dd>{done.mode}</dd><dt>Status</dt><dd><span className="badge" data-s="Pending">Pending</span></dd></dl>
      <button className="btn o" onClick={() => { setDone(null); setV({ ...v, name: "", email: "", phone: "", date: "", time: "", message: "" }); }}>Book another</button>{" "}
      <Link className="btn" href="/">Back to home</Link>
    </div></>);

  return (<>
    <h1>Book counselling</h1>
    <p className="mu" style={{ maxWidth: "60ch" }}>Your first session is free. Pick a day and time that suits you and we will confirm by email.</p>
    <div className="side">
      <form className="f" style={{ maxWidth: "none" }} onSubmit={submit} noValidate>
        {apiErr && <ErrorBox msg={apiErr} />}
        <div className="row2"><Field name="name" label="Full name" value={v.name} error={errs.name} onChange={set} autoComplete="name" />
          <Field name="phone" label="Phone" value={v.phone} error={errs.phone} onChange={set} autoComplete="tel" /></div>
        <Field name="email" label="Email" type="email" value={v.email} error={errs.email} onChange={set} autoComplete="email" />
        <div className="row2"><Field name="date" label="Preferred date" type="date" min={todayISO()} value={v.date} error={errs.date} onChange={set} />
          <Field name="mode" label="Mode" value={v.mode} options={["Online", "In office"]} onChange={set} /></div>
        <label>Time slot</label>
        {!v.date ? <p className="mu sm" style={{ margin: 0 }}>Choose a date to see available times.</p>
          : closed ? <p className="mu sm" style={{ margin: 0 }}>We are closed that day. Please choose another date.</p>
          : slots.length === 0 ? <p className="mu sm" style={{ margin: 0 }}>No slots available.</p>
          : <div className="slots" role="group" aria-label="Time slots">{slots.map((s) => <button type="button" key={s.t} className="slot" aria-pressed={v.time === s.t} disabled={s.off} onClick={() => set("time", s.t)}>{fmtTime(s.t)}</button>)}</div>}
        <div className="err">{errs.time}</div>
        <Field name="topic" label="Topic" value={v.topic} options={topics} onChange={set} />
        <Field name="message" label="Anything we should know? (optional)" rows={3} value={v.message} onChange={set} />
        <br /><button className="btn" disabled={busy}>{busy ? "Sending…" : "Request appointment"}</button>
      </form>
      <aside className="card"><h3>What to expect</h3>
        <p className="mu">A 45-minute one-to-one session with a certified counsellor. We will talk about your goals, budget and timeline.</p>
        <p style={{ margin: 0 }}><b>Office hours</b></p>
        <p className="mu">{fmtTime(settings.officeStart)} – {fmtTime(settings.officeEnd)}, closed on {settings.closedDays.map((d) => DAYS[d] + "s").join(", ") || "no days"}.</p>
        <p style={{ margin: 0 }}><b>Bring (optional)</b></p>
        <p className="mu" style={{ margin: 0 }}>Latest transcript, test scores and a rough budget.</p>
      </aside>
    </div></>);
}
