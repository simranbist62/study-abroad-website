"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { api } from "@/lib/axios";

const countries = [
  "United Kingdom",
  "Canada",
  "Australia",
  "United States",
  "Germany",
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  country: countries[0],
  message: "",
};

const inputClass =
  "w-full rounded-lg border border-[#2a403c] bg-[#0e1b19] px-4 py-2.5 text-white placeholder:text-[#9bb3ae]/60 focus:border-teal-500 focus:outline-none";

export default function EnquiryForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sending, setSending] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const found: Record<string, string> = {};
    if (!form.name.trim()) found.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      found.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone))
      found.phone = "Enter a valid phone number.";
    if (!form.message.trim()) found.message = "Please write a message.";
    return found;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setSubmitError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);
    try {
      await api.post("/enquiries", {
        ...form,
        status: "New",
        note: "",
        date: new Date().toISOString().slice(0, 10),
      });
      setSuccess(true);
      setForm(emptyForm);
    } catch (error) {
      console.error("Error sending enquiry", error);
      setSubmitError("Could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 rounded-2xl border border-[#2a403c] bg-[#162826] p-6 sm:p-8"
    >
      <h2 className="font-serif text-2xl font-bold text-white">
        Send an enquiry
      </h2>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-lg bg-teal-600 p-3 text-white"
          >
            <CheckCircle2 size={20} /> Thanks. We received your enquiry and will
            reply soon.
          </motion.div>
        )}
      </AnimatePresence>
      {submitError && <p className="text-red-300">{submitError}</p>}

      <div>
        <label htmlFor="name" className="mb-1 block font-medium text-white">
          Full name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-300">{errors.name}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block font-medium text-white">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-300">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block font-medium text-white">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-300">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="country" className="mb-1 block font-medium text-white">
          Country of interest
        </label>
        <select
          id="country"
          name="country"
          value={form.country}
          onChange={handleChange}
          className={inputClass}
        >
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block font-medium text-white">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-300">{errors.message}</p>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={sending}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#e8a33d] to-[#f2c36b] px-6 py-3 font-semibold text-[#2b1c00] disabled:opacity-60"
      >
        <Send size={18} /> {sending ? "Sending…" : "Send enquiry"}
      </motion.button>
    </motion.form>
  );
}
