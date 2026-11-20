"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Field from "@/components/Field";
import { ErrorBox } from "@/components/Bits";
import { api, enquiryApi } from "@/lib/api";
import { validate, Errors } from "@/lib/validate";
import { COUNTRIES_FALLBACK, LEVELS } from "@/lib/types";

const INTAKES = ["January", "May", "July", "September", "Not sure yet"];

export default function EnquiryPage() {
  const [countries, setCountries] = useState(COUNTRIES_FALLBACK);
  const [v, setV] = useState({ name: "", email: "", phone: "", country: COUNTRIES_FALLBACK[0], level: LEVELS[2], intake: INTAKES[3], message: "" });
  const [errs, setErrs] = useState<Errors>({});
  const [busy, setBusy] = useState(false); const [apiErr, setApiErr] = useState(""); const [sent, setSent] = useState(false);

  useEffect(() => { api.list<{ name: string }>("destinations").then((d) => { if (d.length) { const c = d.map((x) => x.name); setCountries(c); setV((p) => ({ ...p, country: c[0] })); } }).catch(() => {}); }, []);
  const set = (k: string, val: string) => { setV((p) => ({ ...p, [k]: val })); setErrs((p) => ({ ...p, [k]: "" })); };

  async function submit(e: FormEvent) {
    e.preventDefault(); setApiErr("");
    const er = validate(v, ["name", "email", "phone", "message"]); setErrs(er); if (Object.keys(er).length) return;
    setBusy(true);
    try { await enquiryApi.create(v); setSent(true); }
    catch (x) { setApiErr(x instanceof Error ? x.message : "Could not send your enquiry."); }
    finally { setBusy(false); }
  }

  return (<>
    <h1>Student enquiry</h1>
    <p className="mu" style={{ maxWidth: "60ch" }}>Tell us a little about your plans and a counsellor will reply within one working day.</p>
    {sent ? (<>
      <div className="ok" role="status">Thanks. We received your enquiry and will reply within one working day.</div>
      <p><Link className="btn a" href="/book">Book a free counselling session</Link> <button className="btn o" onClick={() => { setSent(false); setV({ ...v, name: "", email: "", phone: "", message: "" }); }}>Send another</button></p></>) : (
    <div className="side">
      <form className="f" style={{ maxWidth: "none" }} onSubmit={submit} noValidate>
        {apiErr && <ErrorBox msg={apiErr} />}
        <div className="row2"><Field name="name" label="Full name" value={v.name} error={errs.name} onChange={set} autoComplete="name" />
          <Field name="phone" label="Phone" value={v.phone} error={errs.phone} onChange={set} autoComplete="tel" /></div>
        <Field name="email" label="Email" type="email" value={v.email} error={errs.email} onChange={set} autoComplete="email" />
        <div className="row2"><Field name="country" label="Country of interest" value={v.country} options={countries} onChange={set} />
          <Field name="level" label="Level of study" value={v.level} options={LEVELS} onChange={set} /></div>
        <Field name="intake" label="Preferred intake" value={v.intake} options={INTAKES} onChange={set} />
        <Field name="message" label="Your question" rows={4} value={v.message} error={errs.message} onChange={set} />
        <br /><button className="btn" disabled={busy}>{busy ? "Sending…" : "Send enquiry"}</button>
      </form>
      <aside className="card"><h3>Not sure where to start?</h3>
        <p className="mu">Share your course idea and budget. We will suggest countries and intakes that fit.</p>
        <ul className="mu" style={{ paddingLeft: "1.1rem", margin: 0 }}><li>Free first session</li><li>Reply within one working day</li><li>No obligation</li></ul>
      </aside>
    </div>)}</>);
}
