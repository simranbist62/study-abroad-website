/**
 * Content CRUD used by "Manage Website Content" (admin).
 * These call the same JSON Server collections as Simran's public-site API functions
 * (services, destinations, testimonials, blog, faqs), so both parts always see the same data.
 * When merging, you can swap these wrappers for Simran's own functions.
 */
import { api } from "./api";
import type { Id } from "./types";

export const contentApi = {
  list: <T,>(collection: string) => api.list<T>(collection),
  get: <T,>(collection: string, id: Id) => api.get<T>(collection, id),
  create: <T,>(collection: string, body: object) => api.create<T>(collection, body),
  update: <T,>(collection: string, id: Id, body: object) => api.update<T>(collection, id, body),
  remove: (collection: string, id: Id) => api.remove(collection, id),
};

export type FieldDef = { key: string; label: string; type?: "text" | "textarea" | "list" | "date" | "url"; required?: boolean; hint?: string };
export type ContentConfig = { label: string; singular: string; titleKey: string; subKey: string; emoji: string; fields: FieldDef[] };

export const CONTENT: Record<string, ContentConfig> = {
  destinations: { label: "Destinations", singular: "destination", titleKey: "name", subKey: "tuition", emoji: "🌍", fields: [
    { key: "name", label: "Country", required: true }, { key: "tagline", label: "Tagline", required: true },
    { key: "tuition", label: "Tuition range", required: true }, { key: "image", label: "Image URL", type: "url", hint: "Optional" },
    { key: "desc", label: "Description", type: "textarea", required: true },
    { key: "intakes", label: "Intakes", type: "list", hint: "Separate with commas, e.g. January, May, September" },
    { key: "popularCourses", label: "Popular courses", type: "list", hint: "Separate with commas" } ] },
  services: { label: "Services", singular: "service", titleKey: "title", subKey: "desc", emoji: "🧭", fields: [
    { key: "title", label: "Title", required: true }, { key: "icon", label: "Icon name", hint: "e.g. compass, book, passport" },
    { key: "desc", label: "Description", type: "textarea", required: true } ] },
  testimonials: { label: "Testimonials", singular: "testimonial", titleKey: "name", subKey: "destination", emoji: "💬", fields: [
    { key: "name", label: "Student name", required: true }, { key: "destination", label: "Destination", required: true },
    { key: "course", label: "Course" }, { key: "quote", label: "Quote", type: "textarea", required: true } ] },
  blog: { label: "Blog", singular: "blog post", titleKey: "title", subKey: "author", emoji: "📝", fields: [
    { key: "title", label: "Title", required: true }, { key: "excerpt", label: "Excerpt", required: true },
    { key: "author", label: "Author" }, { key: "date", label: "Date", type: "date" },
    { key: "body", label: "Body", type: "textarea", required: true } ] },
  faqs: { label: "FAQs", singular: "FAQ", titleKey: "q", subKey: "a", emoji: "❓", fields: [
    { key: "q", label: "Question", required: true }, { key: "a", label: "Answer", type: "textarea", required: true } ] },
};
