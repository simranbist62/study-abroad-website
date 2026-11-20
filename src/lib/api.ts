import type { Activity, Appointment, Enquiry, Id, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

/** JSON Server base URL. Override with NEXT_PUBLIC_API_URL. */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) { super(message); this.status = status; }
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_BASE + path, {
      ...init,
      cache: "no-store",
      headers: init.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the data server. Install backend dependencies once with npm --prefix backend install, then start both servers with npm run dev.");
  }
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

/** Generic JSON Server helpers: GET / POST / PATCH / DELETE /collection */
export const api = {
  list: <T,>(c: string, q = "") => req<T[]>(`/${c}${q}`),
  get: <T,>(c: string, id: Id) => req<T>(`/${c}/${id}`),
  create: <T,>(c: string, body: object) => req<T>(`/${c}`, { method: "POST", body: JSON.stringify(body) }),
  update: <T,>(c: string, id: Id, body: object) => req<T>(`/${c}/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (c: string, id: Id) => req<unknown>(`/${c}/${id}`, { method: "DELETE" }),
};

const nowISO = () => new Date().toISOString();
const dayISO = () => nowISO().slice(0, 10);

export const activityApi = {
  list: () => api.list<Activity>("activity"),
  log: (action: string, entity: string, detail: string, actor = "Admin") =>
    api.create<Activity>("activity", { action, entity, detail, actor, at: nowISO() }).catch(() => undefined),
  remove: (id: Id) => api.remove("activity", id),
};

export const enquiryApi = {
  list: () => api.list<Enquiry>("enquiries"),
  create: async (v: Omit<Enquiry, "id" | "status" | "note" | "date" | "createdAt">, actor = "Website") => {
    const e = await api.create<Enquiry>("enquiries", { ...v, status: "New", note: "", date: dayISO(), createdAt: nowISO() });
    activityApi.log("created", "enquiry", `New enquiry from ${v.name} (${v.country})`, actor);
    return e;
  },
  update: (id: Id, patch: Partial<Enquiry>) => api.update<Enquiry>("enquiries", id, patch),
  remove: (id: Id) => api.remove("enquiries", id),
};

export const appointmentApi = {
  list: () => api.list<Appointment>("appointments"),
  create: async (v: Omit<Appointment, "id" | "status" | "createdAt">, actor = "Website") => {
    const a = await api.create<Appointment>("appointments", { ...v, status: "Pending", createdAt: nowISO() });
    activityApi.log("created", "appointment", `${v.name} booked ${v.topic} for ${v.date}${v.time ? " at " + v.time : ""}`, actor);
    return a;
  },
  update: (id: Id, patch: Partial<Appointment>) => api.update<Appointment>("appointments", id, patch),
  remove: (id: Id) => api.remove("appointments", id),
};

export const settingsApi = {
  get: async (): Promise<Settings> => {
    try { const l = await api.list<Settings>("settings"); return { ...DEFAULT_SETTINGS, ...(l[0] || {}) }; }
    catch { return DEFAULT_SETTINGS; }
  },
  save: async (s: Settings) => (s.id ? api.update<Settings>("settings", s.id, s) : api.create<Settings>("settings", s)),
};

// Content types used by the public site maintained on main.
export type Destination = {
  id: string; name: string; tagline: string; tuition: string; image: string;
  desc: string; intakes: string[]; popularCourses: string[];
};
export type Service = { id: number | string; title: string; icon: string; desc: string };
export type Testimonial = { id: number | string; name: string; destination: string; course: string; quote: string };
export type Faq = { id: number | string; q: string; a: string };
export type Blog = { id: number | string; title: string; excerpt: string; author: string; date: string; body: string; image?: string };
