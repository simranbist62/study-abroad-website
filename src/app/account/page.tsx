"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clientLogout, getClientEmail, isClientAuthed } from "@/lib/auth";
import type { Appointment, Enquiry } from "@/lib/types";
import { fmtDate } from "@/lib/format";

export default function ClientAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isClientAuthed()) {
      router.replace("/login");
      return;
    }
    const address = getClientEmail();
    Promise.all([
      api.list<Enquiry>("enquiries", `?email=${encodeURIComponent(address)}`),
      api.list<Appointment>("appointments", `?email=${encodeURIComponent(address)}`),
    ]).then(([clientEnquiries, clientAppointments]) => {
      setEmail(address);
      setEnquiries(clientEnquiries);
      setAppointments(clientAppointments);
    }).catch(() => {
      setEmail(address);
      setError("We could not load your requests. Please try again later.");
    })
      .finally(() => setReady(true));
  }, [router]);

  if (!ready) return <div className="skel" style={{ width: 240, height: 28, margin: "30px auto" }} />;

  return (
    <section className="account-page">
      <div className="ph">
        <div><p className="eyebrow">Student portal</p><h1>Welcome back</h1><p className="mu">Signed in as {email}</p></div>
        <button className="btn o" onClick={() => { clientLogout(); router.push("/"); }}>Sign out</button>
      </div>
      <div className="acts"><Link className="btn" href="/book">Book counselling</Link><Link className="btn o" href="/enquiry">Send an enquiry</Link></div>
      {error && <p className="err" role="alert">{error}</p>}
      <div className="two">
        <section className="panel"><h2>Your enquiries</h2>
          {enquiries.length ? enquiries.map((item) => <article className="card" key={item.id}>
            <div className="ph"><strong>{item.country} · {item.level || "Study plans"}</strong><span className="badge" data-s={item.status}>{item.status}</span></div>
            <p className="mu">Submitted {fmtDate(item.date)}</p><p>{item.message}</p>
          </article>) : <p className="mu">No enquiries are linked to this account yet.</p>}
        </section>
        <section className="panel"><h2>Your appointments</h2>
          {appointments.length ? appointments.map((item) => <article className="card" key={item.id}>
            <div className="ph"><strong>{item.topic}</strong><span className="badge" data-s={item.status}>{item.status}</span></div>
            <p className="mu">{fmtDate(item.date)}{item.time ? ` at ${item.time}` : ""} · {item.mode}</p>
          </article>) : <p className="mu">No appointment requests are linked to this account yet.</p>}
        </section>
      </div>
    </section>
  );
}
