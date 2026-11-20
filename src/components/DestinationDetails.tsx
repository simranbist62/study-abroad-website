"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import { Destination } from "@/lib/api";
import { api } from "@/lib/axios";
import CollectionState from "./CollectionState";

export default function DestinationDetails() {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDestination() {
      try {
        const response = await api.get(`/destinations/${id}`);
        setDestination(response.data);
      } catch (error) {
        console.error("Error fetching destination", error);
        setError(axios.isAxiosError(error) && !error.response ? "Could not reach the data server. Start the site with npm run dev." : "Destination not found.");
      } finally {
        setLoading(false);
      }
    }
    getDestination();
  }, [id]);

  return (
    <section className="mx-auto max-w-[1000px] px-4 py-10 sm:px-8">
      <Link
        href="/destinations"
        className="mb-6 inline-flex items-center gap-2 text-teal-400 hover:underline"
      >
        <ArrowLeft size={18} /> Back to destinations
      </Link>

      {(loading || error || !destination) && <CollectionState loading={loading} error={error} empty="Destination not found." />}

      {destination && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Banner */}
          <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80">
            <Image
              src={destination.image || "/images/city.webp"}
              alt={destination.name}
              fill
              priority
              sizes="(min-width: 1000px) 1000px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white sm:p-8">
              <h1 className="font-serif text-4xl font-bold sm:text-5xl">
                {destination.name}
              </h1>
              <p className="mt-1 text-lg text-white/90">
                {destination.tagline}
              </p>
            </div>
          </div>

          {/* Tuition and intakes */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#2a403c] bg-[#162826] p-6">
              <div className="mb-3 flex items-center gap-2 text-teal-400">
                <Wallet size={22} />
                <h2 className="font-serif text-lg font-bold text-white">
                  Typical tuition
                </h2>
              </div>
              <p className="text-[#9bb3ae]">{destination.tuition}</p>
            </div>

            <div className="rounded-2xl border border-[#2a403c] bg-[#162826] p-6">
              <div className="mb-3 flex items-center gap-2 text-teal-400">
                <CalendarDays size={22} />
                <h2 className="font-serif text-lg font-bold text-white">
                  Intakes
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {destination.intakes.map((intake) => (
                  <span
                    key={intake}
                    className="rounded-full bg-amber-400/20 px-3 py-1 text-sm text-amber-200"
                  >
                    {intake}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              Why study in {destination.name}
            </h2>
            <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
            <p className="mt-4 text-lg leading-8 text-[#9bb3ae]">
              {destination.desc}
            </p>
          </div>

          {/* Popular courses */}
          <div className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              Popular courses
            </h2>
            <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {destination.popularCourses.map((course) => (
                <div
                  key={course}
                  className="flex items-center gap-3 rounded-xl border border-[#2a403c] bg-[#162826] p-4 text-white"
                >
                  <GraduationCap className="shrink-0 text-teal-400" size={22} />
                  {course}
                </div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <motion.div
            className="mt-10"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#e8a33d] to-[#f2c36b] px-6 py-3 font-semibold text-[#2b1c00]"
            >
              Book counselling for {destination.name} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
