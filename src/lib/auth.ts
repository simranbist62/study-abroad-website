/** Demonstration-only admin login. Credentials are checked in the browser; do NOT use this in production. */
export const DEMO_EMAIL = "admin@northbound.example";
export const DEMO_STUDENT_EMAIL = "student@northbound.example";
const DEMO_PASSWORD = "admin123";
const DEMO_STUDENT_PASSWORD = "student123";
const KEY = "sac_admin";
const PW_KEY = "sac_admin_pw";
const CLIENT_KEY = "sac_client";

export const isAuthed = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const currentPassword = () => { try { return localStorage.getItem(PW_KEY) || DEMO_PASSWORD; } catch { return DEMO_PASSWORD; } };

export function login(email: string, password: string) {
  const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === currentPassword();
  if (ok) { try { sessionStorage.setItem(KEY, "1"); } catch {} }
  return ok;
}
export const logout = () => { try { sessionStorage.removeItem(KEY); } catch {} };
export const isClientAuthed = () => { try { return Boolean(sessionStorage.getItem(CLIENT_KEY)); } catch { return false; } };
export const getClientEmail = () => { try { return sessionStorage.getItem(CLIENT_KEY) || ""; } catch { return ""; } };
export function clientLogin(email: string, password: string) {
  const ok = email.trim().toLowerCase() === DEMO_STUDENT_EMAIL && password === DEMO_STUDENT_PASSWORD;
  if (ok) { try { sessionStorage.setItem(CLIENT_KEY, DEMO_STUDENT_EMAIL); } catch {} }
  return ok;
}
export const clientLogout = () => { try { sessionStorage.removeItem(CLIENT_KEY); } catch {} };
export function changePassword(oldPw: string, newPw: string) {
  if (oldPw !== currentPassword()) return false;
  try { localStorage.setItem(PW_KEY, newPw); } catch {}
  return true;
}
