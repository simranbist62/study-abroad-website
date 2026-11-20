"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Blog } from "@/lib/api";
import { api } from "@/lib/axios";

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getBlog() {
      try {
        const response = await api.get(`/blog/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog post", error);
        setError("Article not found.");
      }
    }
    getBlog();
  }, [id]);

  const date = blog
    ? new Date(blog.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-teal-400 hover:underline"
      >
        <ArrowLeft size={18} /> Back to blog
      </Link>

      {error && <p className="text-red-300">{error}</p>}

      {blog && (
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            {blog.title}
          </h1>
          <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />

          <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#9bb3ae]">
            <span className="flex items-center gap-1">
              <User size={16} /> {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {date}
            </span>
          </div>

          <p className="mt-8 text-md leading-8 text-white/90">{blog.body}</p>
        </motion.article>
      )}
    </section>
  );
}
