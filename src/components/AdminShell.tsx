"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { isAuthed, logout } from "@/lib/auth";
import SiteFooter from "./SiteFooter";

const NAV = [
  ["/admin", "Dashboard"],
  ["/admin/enquiries", "Enquiries and appointments"],
  ["/admin/content", "Content"],
] as const;

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/admin/login");
      return;
    }
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [router]);

  if (!ready) return <main className="page"><div className="skel" style={{ width: 240, height: 28 }} /></main>;

  return (
    <>
      <header className="top"><nav className="nav admin-nav" aria-label="Admin">
        <Link className="logo" href="/admin">Admin</Link>
        <div className="links">
          {NAV.map(([href, label]) => <Link key={href} href={href} className={`l ${pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`)) ? "on" : ""}`}>{label}</Link>)}
          <Link className="l" href="/">View site</Link>
          <button className="btn s o" onClick={() => { logout(); router.push("/"); }}>Log out</button>
        </div>
      </nav></header>
      <main className="page wide">{children}</main>
      <SiteFooter admin />
    </>
  );
}
