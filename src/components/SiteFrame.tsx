"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import PublicShell from "./PublicShell";

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminArea = pathname === "/admin" || (pathname.startsWith("/admin/") && pathname !== "/admin/login");

  return isAdminArea ? children : <PublicShell>{children}</PublicShell>;
}
