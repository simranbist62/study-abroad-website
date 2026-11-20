import type { Metadata } from "next";
import UIProvider from "@/components/UIProvider";
import SiteFrame from "@/components/SiteFrame";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Northbound Study Abroad",
    template: "%s | Northbound Study Abroad",
  },
  description: "Personal guidance for choosing a study destination, finding a course and preparing your application.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><UIProvider><SiteFrame>{children}</SiteFrame></UIProvider></body>
    </html>
  );
}
