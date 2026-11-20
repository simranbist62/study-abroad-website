export type Id = string | number;
export type EnquiryStatus = "New" | "Contacted" | "In progress" | "Closed";
export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export const ENQUIRY_STATUSES: EnquiryStatus[] = ["New", "Contacted", "In progress", "Closed"];
export const APPOINTMENT_STATUSES: AppointmentStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];

export interface Enquiry {
  id: Id; name: string; email: string; phone: string; country: string;
  level?: string; intake?: string; message: string;
  status: EnquiryStatus; note: string; date: string; createdAt?: string;
}
export interface Appointment {
  id: Id; name: string; email: string; phone: string; date: string; time?: string;
  mode: string; topic: string; message?: string; status: AppointmentStatus; createdAt?: string;
}
export interface Activity { id: Id; action: string; entity: string; detail: string; actor: string; at: string; }
export interface Settings {
  id: Id; adminName: string; adminEmail: string; officeStart: string; officeEnd: string;
  slotMinutes: number; closedDays: number[]; whatsapp: string; notifyEnquiry: boolean; notifyBooking: boolean;
}
export const DEFAULT_SETTINGS: Settings = {
  id: 1, adminName: "Pratikshya", adminEmail: "admin@northbound.example", officeStart: "10:00", officeEnd: "17:00",
  slotMinutes: 60, closedDays: [6], whatsapp: "9779800000000", notifyEnquiry: true, notifyBooking: true,
};
export const LEVELS = ["Diploma", "Bachelor's", "Master's", "PhD"];
export const TOPICS_FALLBACK = ["Career counselling", "University shortlisting", "Application support", "Visa guidance", "Test preparation"];
export const COUNTRIES_FALLBACK = ["United Kingdom", "Canada", "Australia", "United States", "Germany"];
