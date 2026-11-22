"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Blog } from "@/lib/api";
import { api } from "@/lib/axios";
import CollectionState from "./CollectionState";

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBlog() {
      try {
        const response = await api.get(`/blog/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog post", error);
        setError(
          axios.isAxiosError(error) && !error.response
            ? "Could not reach the data server. Start the site with npm run dev."
            : "Article not found.",
        );
      } finally {
        setLoading(false);
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
    <section className="mx-auto max-w-3xl px-4 sm:px-8">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-teal-400 hover:underline"
      >
        <ArrowLeft size={18} /> Back to blog
      </Link>

      {(loading || error || !blog) && (
        <CollectionState
          loading={loading}
          error={error}
          empty="Article not found."
        />
      )}

      {blog && (
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            {blog.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#9bb3ae]">
            <span className="flex items-center gap-1">
              <User size={16} /> {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {date}
            </span>
          </div>

          <p className="mt-8 text-md leading-8 text-white/90 font-serif">
            {blog.body}
          </p>
        </motion.article>
      )}
    </section>
  );
}
