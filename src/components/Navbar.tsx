"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Destinations", href: "/destinations" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9e3e0] bg-white/85 px-4 py-4 backdrop-blur-md dark:border-[#2a403c] dark:bg-[#162826] sm:px-8 sticky top-0  z-50">
      <Link
        href="/"
        className="text-xl font-bold text-[#12302c] dark:text-[#e6f1ee]"
      >
        Northbound
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-2 text-sm ${
              pathname === link.href
                ? "bg-[#0f6b5c]/[0.14] text-[#0f6b5c] dark:text-[#4fc3ad]"
                : "text-[#58716d] hover:bg-[#0f6b5c]/10 dark:text-[#9bb3ae]"
            }`}
          >
            {link.name}
          </Link>
        ))}

        <Link
          href="/book-counseling"
          className="rounded-full bg-[#0f6b5c] px-4 py-2 text-sm text-white"
        >
          Book Counseling
        </Link>
      </div>
    </nav>
  );
}
