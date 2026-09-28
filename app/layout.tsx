import type { Metadata } from "next";
import "./globals.css";

import { SiteLoader } from "@/components/SiteLoader";

export const metadata: Metadata = {
  title: "AA Kurmawa Automobiles",
  description:
    "Premium vehicles. Trusted service. A standard built around you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}