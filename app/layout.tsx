import type { Metadata } from "next";
import "./globals.css";

import { SiteLoader } from "@/components/SiteLoader";
import { Analytics } from "@vercel/analytics/next";

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
        <body>
        {children}
        <Analytics />
      </body>

      </body>
    </html>
  );
}