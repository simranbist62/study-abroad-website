"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_EMAIL, isAuthed, login } from "@/lib/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [show, setShow] = useState(false);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (isAuthed()) router.replace("/admin"); }, [router]);

  function submit(e: FormEvent) {
    e.preventDefault(); setErr("");
    if (!email.trim() || !pw) { setErr("Enter your email and password."); return; }
    setBusy(true);
    setTimeout(() => { // short delay so the loading state is visible
      if (login(email, pw)) router.push("/admin"); else { setErr("Email or password is incorrect."); setBusy(false); }
    }, 350);
  }

  return (<>
    <h1>Admin login</h1>
    <p className="mu">Demo credentials: {DEMO_EMAIL} / admin123</p>
    <form className="f" onSubmit={submit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <div className="pwrap"><input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? "Hide" : "Show"}</button></div>
      <div className="err" role="alert">{err}</div>
      <br /><button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form></>);
}
