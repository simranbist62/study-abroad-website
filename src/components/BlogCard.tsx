"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import { Blog } from "@/lib/api";

export default function BlogCard({ blog }: { blog: Blog }) {
  const date = new Date(blog.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link
        href={`/blog/${blog.id}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#2a403c] bg-[#162826] transition-colors hover:border-teal-500"
      >
        {/* Banner */}
        <div className="flex h-32 items-center justify-center bg-gradient-to-br from-teal-700 via-teal-950 to-blue-950 text-amber-400">
          <BookOpen size={40} />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap gap-4 text-xs text-[#9bb3ae]">
            <span className="flex items-center gap-1">
              <User size={14} /> {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {date}
            </span>
          </div>

          <h3 className="mt-3 font-serif text-xl font-bold text-white">
            {blog.title}
          </h3>
          <p className="mt-2 flex-1 leading-7 text-[#9bb3ae]">{blog.excerpt}</p>

          <span className="mt-4 flex items-center gap-1 font-semibold text-teal-400">
            Read article <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
