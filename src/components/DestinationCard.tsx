"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Destination } from "@/lib/api";
import Image from "next/image";

export default function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <Link
        href={`/destination/${destination.id}`}
        className="block overflow-hidden rounded-2xl border border-[#2a403c] bg-[#162826]"
      >
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={destination.image || "/images/city.webp"}
            alt={destination.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg font-bold text-white">
            {destination.name}
          </h3>
          <p className="mt-1 text-sm text-[#9bb3ae]">{destination.desc}</p>
          <span className="mt-3 inline-block rounded-full bg-amber-400/20 px-3 py-1 text-xs text-amber-200">
            {destination.tuition}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
