import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
export default function PublicShell({ children }: { children: ReactNode }) {
  return (<><SiteHeader /><main className="page">{children}</main><SiteFooter /></>);
}
