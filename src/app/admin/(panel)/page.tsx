"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Empty, ErrorBox, Skeleton } from "@/components/Bits";
import { appointmentApi, enquiryApi } from "@/lib/api";
import { fmtDate, fmtTime, todayISO } from "@/lib/format";
import { Appointment, Enquiry } from "@/lib/types";

type DashboardData = { enquiries: Enquiry[]; appointments: Appointment[] };

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    Promise.all([enquiryApi.list(), appointmentApi.list()])
      .then(([enquiries, appointments]) => {
        setData({ enquiries, appointments });
        setError("");
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Could not load the dashboard."));
  };

  useEffect(load, []);

  if (error) return <><h1>Dashboard</h1><ErrorBox msg={error} retry={load} /></>;
  if (!data) return <><h1>Dashboard</h1><Skeleton rows={5} /></>;

  const today = todayISO();
  const latest = [...data.enquiries]
    .sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date))
    .slice(0, 5);
  const upcoming = [...data.appointments]
    .filter((appointment) => appointment.date >= today && !["Cancelled", "Completed"].includes(appointment.status))
    .sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")))
    .slice(0, 5);

  const stats = [
    [data.enquiries.length, "Total enquiries"],
    [data.enquiries.filter((enquiry) => enquiry.status === "New").length, "New enquiries"],
    [data.appointments.length, "Appointments"],
    [data.appointments.filter((appointment) => appointment.status === "Pending").length, "Pending appointments"],
  ] as const;

  return (
    <>
      <div className="dashboard-heading"><h1>Dashboard</h1><span aria-hidden="true" /></div>
      <section className="dashboard-stats" aria-label="Summary">
        {stats.map(([value, label]) => <article className="summary-card" key={label}>
          <span className="summary-value">{value}</span><span className="summary-label">{label}</span>
        </article>)}
      </section>

      <section className="dashboard-list">
        <div className="section-title"><h2>Latest enquiries</h2><Link href="/admin/enquiries">View all</Link></div>
        {latest.length === 0 ? <Empty title="No enquiries yet">New website enquiries will appear here.</Empty> :
          <div className="table-scroll"><table className="dashboard-table"><thead><tr><th>Name</th><th>Country</th><th>Status</th></tr></thead>
            <tbody>{latest.map((enquiry) => <tr key={enquiry.id}><td>{enquiry.name}</td><td>{enquiry.country}</td><td>{enquiry.status}</td></tr>)}</tbody>
          </table></div>}
      </section>

      <section className="dashboard-list">
        <div className="section-title"><h2>Upcoming appointments</h2><Link href="/admin/appointments">View all</Link></div>
        {upcoming.length === 0 ? <Empty title="Nothing scheduled">Booked sessions will appear here.</Empty> :
          <div className="table-scroll"><table className="dashboard-table"><thead><tr><th>Name</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>{upcoming.map((appointment) => <tr key={appointment.id}><td>{appointment.name}</td><td>{fmtDate(appointment.date)}{appointment.time ? ` · ${fmtTime(appointment.time)}` : ""}</td><td>{appointment.status}</td></tr>)}</tbody>
          </table></div>}
      </section>
    </>
  );
}
