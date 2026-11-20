"use client";

import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

// Change these to your real details
const details = [
  { icon: Mail, label: "Email", value: "hello@northbound.example" },
  { icon: Phone, label: "Phone", value: "+977 980-000-0000" },
  { icon: MapPin, label: "Office", value: "Butwal, Nepal" },
  {
    icon: Clock,
    label: "Opening hours",
    value: "Sunday to Friday, 10:00 to 18:00",
  },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {details.map((d) => (
        <div
          key={d.label}
          className="flex items-center gap-4 rounded-2xl border border-[#2a403c] bg-[#162826] p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400">
            <d.icon size={24} />
          </div>
          <div>
            <p className="text-sm text-[#9bb3ae]">{d.label}</p>
            <p className="font-semibold text-white">{d.value}</p>
          </div>
        </div>
      ))}

      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/9779800000000"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 rounded-2xl bg-[#25a244] p-4 font-semibold text-white"
      >
        <MessageCircle size={22} /> Chat with us on WhatsApp
      </motion.a>

      {/* Social links */}
      <div className="flex gap-3">
        {[
          { name: "Facebook", href: "https://facebook.com" },
          { name: "Instagram", href: "https://instagram.com" },
        ].map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#2a403c] px-5 py-2 text-[#b8d0cb] transition-colors hover:border-teal-500 hover:text-white"
          >
            {s.name}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
