"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "./Icon";

const NAV = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/destinations", "Destinations"],
  ["/success-stories", "Success stories"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
];

export default function SiteHeader() {
  const path = usePathname(); const [open, setOpen] = useState(false);
  return (
    <header className="top"><nav className="nav" aria-label="Main">
      <Link className="logo" href="/">Northbound</Link>
      <button className="l burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><Icon n="menu" /></button>
      <div className={`links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        {NAV.map(([h, l]) => <Link key={h} href={h} className={`l ${path === h ? "on" : ""}`}>{l}</Link>)}
        <Link className="l" href="/login">Student login</Link>
        <Link className="btn s" href="/book">Free counselling</Link>
      </div>
    </nav></header>
  );
}
