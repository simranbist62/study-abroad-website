"use client";
import { useMemo, useState } from "react";
import { CountUp, ErrorBox, Skeleton } from "@/components/Bits";
import { Donut, HBars, MonthBars } from "@/components/Charts";
import Icon from "@/components/Icon";
import { download, toCSV } from "@/lib/format";
import { countBy, inRange, monthly } from "@/lib/stats";
import { useCollection } from "@/lib/useCollection";
import { ENQUIRY_STATUSES, Appointment, Enquiry } from "@/lib/types";

export default function Reports() {
  const E = useCollection<Enquiry>("enquiries"), A = useCollection<Appointment>("appointments");
  const [range, setRange] = useState(0);
  const e = useMemo(() => E.data.filter((x) => inRange(x.date, range)), [E.data, range]);
  const a = useMemo(() => A.data.filter((x) => inRange(x.date, range)), [A.data, range]);
  if (E.error || A.error) return <><h1>Reports</h1><ErrorBox msg={E.error || A.error} retry={() => { E.reload(); A.reload(); }} /></>;
  if (E.loading || A.loading) return <><h1>Reports</h1><Skeleton rows={5} /></>;

  const done = a.filter((x) => x.status === "Completed").length, cancelled = a.filter((x) => x.status === "Cancelled").length;
  const booked = a.length || 1; const closedRate = e.length ? Math.round((e.filter((x) => x.status === "Closed").length / e.length) * 100) : 0;
  const kpi = [["Enquiries", e.length, ""], ["Appointments", a.length, ""], ["Completed sessions", done, ""], ["Cancellation rate", Math.round((cancelled / booked) * 100), "%"], ["Closed rate", closedRate, "%"]] as const;
  const funnel = ENQUIRY_STATUSES.map((s) => ({ label: s, value: e.filter((x) => x.status === s).length }));

  const exportAll = () => {
    download("northbound-report.csv", toCSV(countBy(e, (x) => x.country).map((r) => ({ ...r })), [["label", "Country"], ["value", "Enquiries"]]) + "\n\n" + toCSV(countBy(a, (x) => x.topic).map((r) => ({ ...r })), [["label", "Topic"], ["value", "Appointments"]]));
  };

  return (<>
    <div className="ph"><div><h1>Reports</h1><p className="mu">See what students ask for and how your team is doing.</p></div>
      <div className="acts"><select value={range} onChange={(ev) => setRange(+ev.target.value)} aria-label="Date range"><option value={0}>All time</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select>
        <button className="btn o" onClick={exportAll}><Icon n="download" s={16} /> Export CSV</button><button className="btn" onClick={() => window.print()}>Print</button></div></div>
    <div className="grid k5">{kpi.map(([l, n, suf]) => <div key={l} className="card"><div className="big"><CountUp to={n} />{suf}</div><p className="mu" style={{ margin: 0 }}>{l}</p></div>)}</div>
    <div className="two"><div className="card"><h3>Monthly trend</h3><p className="mu sm">Last 6 months</p><MonthBars data={monthly(E.data, A.data, 6)} /></div>
      <div className="card"><h3>Lead funnel</h3><p className="mu sm">Enquiries by status</p><Donut byStatus rows={funnel} /></div></div>
    <div className="two eq sec"><div className="card"><h3>Demand by country</h3><HBars rows={countBy(e, (x) => x.country)} /></div><div className="card"><h3>Popular counselling topics</h3><HBars rows={countBy(a, (x) => x.topic)} /></div></div>
    <div className="two eq sec"><div className="card"><h3>Levels of study</h3><HBars rows={countBy(e, (x) => x.level || "Not given")} /></div>
      <div className="card"><h3>Online vs in office</h3><Donut rows={countBy(a, (x) => x.mode)} /></div></div>
  </>);
}
