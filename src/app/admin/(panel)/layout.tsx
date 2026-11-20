import AdminShell from "@/components/AdminShell";
export const metadata = { title: "Admin · Northbound Study Abroad" };
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
