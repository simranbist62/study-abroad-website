import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 bg-[#0b2b2a] px-4 py-12 text-center sm:flex-row sm:px-8 sm:text-left">
      <div className="flex flex-wrap justify-center gap-5 text-sm sm:justify-start">
        <Link href="/privacy-policy" className="text-[#ffd27a] hover:underline">
          Privacy Policy
        </Link>

        <Link href="/terms" className="text-[#ffd27a] hover:underline">
          Terms of Use
        </Link>

        <Link href="/admin" className="text-[#ffd27a] hover:underline">
          Admin
        </Link>
      </div>

      <p className="text-sm text-[#b8d0cb]">
        © 2026 Northbound Study Abroad. Demo site: data is stored in your
        browser.
      </p>
    </footer>
  );
}
