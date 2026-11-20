"use client";

import { Blog } from "@/lib/api";
import { useCollection } from "@/lib/useCollection";
import BlogCard from "./BlogCard";
import CollectionState from "./CollectionState";

export default function Blogs() {
  const { data: blogs, loading, error } = useCollection<Blog>("blog");

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-white">
          Blog and resources
        </h1>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
        <p className="mt-3 max-w-2xl text-[#9bb3ae]">
          Practical guides on applications, costs, tests and visas.
        </p>
      </div>

      {/* Cards */}
      {loading || error || blogs.length === 0 ? <CollectionState loading={loading} error={error} empty="No articles have been published yet." /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>}
    </section>
  );
}
