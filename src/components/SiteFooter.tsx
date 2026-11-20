import Link from "next/link";

export default function SiteFooter({ admin = false }: { admin?: boolean }) {
  return (
    <>
      <footer className="ft">
        <div>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of use</Link>
          {admin ? <Link href="/admin">Admin</Link> : <Link href="/admin/login">Admin login</Link>}
          {!admin && <Link href="/login">Student login</Link>}
        </div>
        <p>© 2026 Northbound Study Abroad.</p>
      </footer>
      {!admin && <a className="wa" href="https://wa.me/9779800000000" target="_blank" rel="noopener noreferrer">WhatsApp us</a>}
    </>
  );
}
