import Link from "next/link";
export default function SiteFooter({ admin = false }: { admin?: boolean }) {
  return (<>
    <footer className="ft">
      <div><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of use</Link><Link href={admin ? "/admin" : "/admin/login"}>Admin</Link></div>
      <p>© 2026 Northbound Study Abroad. Demo site: data is stored in JSON Server.</p>
    </footer>
    <a className="wa" href="https://wa.me/9779800000000" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
  </>);
}
