"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Faq } from "@/lib/api";
import { api } from "@/lib/axios";

export default function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    async function getFaqs() {
      try {
        const response = await api.get("/faqs");
        setFaqs(response.data);
      } catch (error) {
        console.error("Error fetching faqs", error);
      }
    }
    getFaqs();
  }, []);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
      {/* Section title */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">
          Frequently asked questions
        </h2>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {faqs.slice(0, 3).map((faq) => (
          <div
            key={faq.id}
            className="rounded-xl border border-[#2a403c] bg-[#162826]"
          >
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              aria-expanded={openId === faq.id}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-white"
            >
              {faq.q}
              <motion.span
                animate={{ rotate: openId === faq.id ? 180 : 0 }}
                className="shrink-0 text-teal-400"
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>

            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 leading-7 text-[#9bb3ae]">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
