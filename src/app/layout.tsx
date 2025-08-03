// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";

export const metadata: Metadata = {
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
      {/* ---> ZMIANA: Dodajemy domyślne tło i kolor tekstu, aby uniknąć "błysku" */}
      <body className={`${GeistSans.className} bg-black text-neutral-200`}>
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}