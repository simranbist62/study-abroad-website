/** Demonstration-only admin login. Credentials are checked in the browser; do NOT use this in production. */
export const DEMO_EMAIL = "admin@northbound.example";
const DEMO_PASSWORD = "admin123";
const KEY = "sac_admin";
const PW_KEY = "sac_admin_pw";

export const isAuthed = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const currentPassword = () => { try { return localStorage.getItem(PW_KEY) || DEMO_PASSWORD; } catch { return DEMO_PASSWORD; } };

export function login(email: string, password: string) {
  const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === currentPassword();
  if (ok) { try { sessionStorage.setItem(KEY, "1"); } catch {} }
  return ok;
}
export const logout = () => { try { sessionStorage.removeItem(KEY); } catch {} };
export function changePassword(oldPw: string, newPw: string) {
  if (oldPw !== currentPassword()) return false;
  try { localStorage.setItem(PW_KEY, newPw); } catch {}
  return true;
}
