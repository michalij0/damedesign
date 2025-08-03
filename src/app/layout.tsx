// src/app/layout.tsx

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

// ---> ZMIANA 1: Dodajemy import SpeedInsights
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  // Tutaj znajdują się Twoje metadane (title, description itp.)
  // Pozostaw je bez zmian.
  title: "DameDesign",
  description: "Portfolio i usługi projektowe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={GeistSans.className}>
        {children}
        
        {/* ---> ZMIANA 2: Dodajemy komponent tuż przed zamknięciem body */}
        <SpeedInsights />
      </body>
    </html>
  );
}