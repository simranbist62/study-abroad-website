"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clientLogin, DEMO_EMAIL, DEMO_STUDENT_EMAIL, isAuthed, isClientAuthed, login } from "@/lib/auth";

type Role = "student" | "admin";

export default function SharedLogin({ initialRole = "student" }: { initialRole?: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (role === "admin" && isAuthed()) router.replace("/admin");
    else if (role === "student" && isClientAuthed()) router.replace("/account");
  }, [role, router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const ok = role === "admin" ? login(email, password) : clientLogin(email, password);
    if (!ok) {
      setError("Email or password is incorrect.");
      return;
    }
    router.push(role === "admin" ? "/admin" : "/account");
  }

  const demoEmail = role === "admin" ? DEMO_EMAIL : DEMO_STUDENT_EMAIL;
  const demoPassword = role === "admin" ? "admin123" : "student123";

  return (
    <section className="card" style={{ maxWidth: 520, margin: "30px auto", padding: 28 }}>
      <p className="eyebrow">Northbound account</p>
      <h1 style={{ fontSize: "2.5rem" }}>Sign in</h1>
      <div className="acts" role="tablist" aria-label="Choose account type">
        <button type="button" role="tab" aria-selected={role === "student"} className={`btn ${role === "student" ? "" : "o"}`} onClick={() => { setRole("student"); setError(""); }}>Student / customer</button>
        <button type="button" role="tab" aria-selected={role === "admin"} className={`btn ${role === "admin" ? "" : "o"}`} onClick={() => { setRole("admin"); setError(""); }}>Administrator</button>
      </div>
      <p className="mu">{role === "admin" ? "Sign in to manage enquiries, appointments and site content." : "Sign in to view your enquiries and appointment requests."}</p>
      <form className="f" onSubmit={submit}>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        {error && <p className="err" role="alert">{error}</p>}
        <button className="btn" type="submit">Sign in as {role === "admin" ? "admin" : "student"}</button>
      </form>
      <p className="mu sm" style={{ marginTop: 18 }}>Demo: {demoEmail} / {demoPassword}</p>
      {role === "student" && <p className="sm">Need help? <Link href="/contact">Contact our team</Link></p>}
    </section>
  );
}
